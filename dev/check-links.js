/* External link check.
   Collects every http(s) URL that appears in the built pages, asks each one for a
   response, and reports what came back. Run it before a release, not in CI: a slow
   third-party site should not fail a build.

   Usage: node dev/check-links.js [--strict]
   Exit code is 1 when a link returns 4xx/5xx (with --strict, also on timeouts). */
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const STRICT = process.argv.includes('--strict');
const TIMEOUT_MS = 10000;
const CONCURRENCY = 5;

function collect() {
  const urls = new Set();
  const sources = new Map();
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'assets') walk(full); continue; }
      if (!e.name.endsWith('.html')) continue;
      const html = fs.readFileSync(full, 'utf8');
      for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
        const url = m[1];
        if (url.includes('atlasof.dev')) continue;   // internal, checked elsewhere
        urls.add(url);
        if (!sources.has(url)) sources.set(url, new Set());
        sources.get(url).add('/' + path.relative(DIST, path.dirname(full)).replace(/\\/g, '/') + '/');
      }
    }
  })(DIST);
  return { urls: [...urls], sources };
}

function probe(url, method) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (r) => { if (!settled) { settled = true; resolve(r); } };
    let target;
    try { target = new URL(url); } catch (e) { return done({ status: 0, note: 'bad url' }); }
    const mod = target.protocol === 'http:' ? http : https;
    const req = mod.request({
      method,
      hostname: target.hostname,
      path: target.pathname + target.search,
      headers: { 'user-agent': 'atlasof-link-check/1.0', accept: '*/*' },
      timeout: TIMEOUT_MS
    }, (res) => {
      res.resume();
      done({ status: res.statusCode, location: res.headers.location || '' });
    });
    req.on('timeout', () => { req.destroy(); done({ status: 0, note: 'timeout' }); });
    req.on('error', (e) => done({ status: 0, note: e.code || e.message }));
    req.end();
  });
}

async function check(url) {
  let r = await probe(url, 'HEAD');
  // Many servers reject HEAD; retry with GET before calling it dead.
  if (r.status === 405 || r.status === 403 || r.status === 0) {
    const g = await probe(url, 'GET');
    if (g.status) r = g;
  }
  return r;
}

(async () => {
  const { urls, sources } = collect();
  if (!urls.length) { console.log('no external links found'); return; }

  console.log('checking', urls.length, 'external links…\n');
  const rows = [];
  let index = 0;

  async function worker() {
    while (index < urls.length) {
      const url = urls[index++];
      const r = await check(url);
      rows.push({ url, ...r });
      process.stdout.write('.');
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log('\n');

  // 403/429 are usually bot protection rather than a dead page, so they are warnings.
  const blocked = rows.filter((r) => r.status === 403 || r.status === 429);
  const bad = rows.filter((r) => (r.status >= 400 && r.status !== 403 && r.status !== 429) || (r.status === 0 && r.note !== 'timeout'));
  const slow = rows.filter((r) => r.status === 0 && r.note === 'timeout');
  const ok = rows.length - bad.length - slow.length - blocked.length;

  rows.sort((a, b) => (a.status || 999) - (b.status || 999));
  for (const r of rows) {
    const tag = (r.status === 403 || r.status === 429) ? 'BLOCK' : r.status >= 400 ? 'DEAD ' : r.status === 0 ? 'WARN ' : 'ok   ';
    if (tag === 'ok   ' && !process.argv.includes('--all')) continue;
    console.log(tag + (r.status || r.note) + '  ' + r.url);
    const where = [...(sources.get(r.url) || [])].slice(0, 2).join(', ');
    if (where) console.log('       cited on ' + where);
  }

  console.log('\n' + ok + ' ok · ' + bad.length + ' dead · ' + blocked.length + ' blocked · ' + slow.length + ' timed out');
  if (bad.length || (STRICT && slow.length)) process.exitCode = 1;
})().catch((e) => { console.error(e); process.exit(1); });
