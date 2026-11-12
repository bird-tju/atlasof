/* Prerender: export every SPA route as static HTML at its real path
   Output: dist/cs/<route>/index.html + sitemap + robots (English only; Chinese, if it returns, goes under /cs/zh/…)
   Usage: node dev/build.js
*/
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE = '/cs';
const SITE = 'https://example.com';        // placeholder: replace once a domain exists
const LANGS = ['en'];   // English only: /cs/… (Chinese, if it returns, goes under /cs/zh/…)

// Content hash of css/js, appended as ?v= so a stale browser cache cannot survive a rebuild
const crypto = require('crypto');
function assetVersion() {
  const parts = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(css|js)$/.test(e.name)) parts.push(fs.readFileSync(full, 'utf8'));
    }
  })(path.join(ROOT, 'assets'));
  return crypto.createHash('sha1').update(parts.join('\n')).digest('hex').slice(0, 10);
}
const ASSET_V = assetVersion();
const ROUTES = [
  '', 'map', 'timeline', 'domains', 'paths', 'progress', 'giants', 'about',
  'courses/nand2tetris',
  'courses/nand2tetris/intro', 'courses/nand2tetris/gates', 'courses/nand2tetris/adders',
  'courses/nand2tetris/alu', 'courses/nand2tetris/sequential', 'courses/nand2tetris/ram',
  'courses/nand2tetris/machine', 'courses/nand2tetris/machine-language',
  'courses/nand2tetris/assembler', 'courses/nand2tetris/cpu',
  'courses/nand2tetris/computer', 'courses/nand2tetris/screen',
  'courses/nand2tetris/keyboard', 'courses/nand2tetris/gate-reference',
  'courses/nand2tetris/abstraction-levels'
];

function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }

function copyDir(src, dst) {
  mkdir(dst);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function probeData() {
  const dom = await JSDOM.fromFile(path.join(ROOT, 'index.html'), {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(win) {
      win.__ATLAS__ = { route: '', lang: 'en', base: BASE };
      win.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      win.scrollTo = () => {};
      win.IntersectionObserver = function () { return { observe() {}, unobserve() {}, disconnect() {}, takeRecords() { return []; } }; };
    }
  });
  await new Promise(r => { if (dom.window.document.readyState === 'complete') return r(); dom.window.addEventListener('load', r); });
  await new Promise(r => setTimeout(r, 120));
  const CS = dom.window.CS;
  const out = {
    topics: CS.topics.map(t => t.id),
    domains: CS.domains.map(d => d.id),
    paths: (CS.paths || []).map(x => x.id)
  };
  dom.window.close();
  return out;
}

async function render(route, lang) {
  const vc = new VirtualConsole();
  const dom = await JSDOM.fromFile(path.join(ROOT, 'index.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(win) {
      win.__ATLAS__ = { route: route, lang: lang, base: BASE };
      win.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      win.scrollTo = () => {};
      win.IntersectionObserver = function () { return { observe() {}, unobserve() {}, disconnect() {}, takeRecords() { return []; } }; };
    }
  });
  await new Promise(r => {
    if (dom.window.document.readyState === 'complete') return r();
    dom.window.addEventListener('load', r);
  });
  await new Promise(r => setTimeout(r, 150));
  const doc = dom.window.document;
  // English shell: apply the data-en / data-en-<attr> copies
  if (lang === 'en') {
    doc.querySelectorAll('[data-en]').forEach(function (el) { el.textContent = el.getAttribute('data-en'); });
    ['aria-label', 'title', 'placeholder', 'content'].forEach(function (attr) {
      doc.querySelectorAll('[data-en-' + attr + ']').forEach(function (el) {
        el.setAttribute(attr, el.getAttribute('data-en-' + attr));
      });
    });
  }
  const title = doc.title;
  const desc = (doc.querySelector('meta[name="description"]') || {}).content || '';
  const html = '<!doctype html>\n' + doc.documentElement.outerHTML;
  dom.window.close();
  return { html, title, desc };
}

function rewrite(html, lang, route) {
  // Rewrite asset paths to root-absolute
  html = html.split('href="assets/').join('href="' + BASE + '/assets/');
  html = html.split('src="assets/').join('src="' + BASE + '/assets/');
  // Internal links: #/x  ->  /cs/x/
  html = html.replace(/href="#\/([^"#]*)(#[^"]*)?"/g, function (m, p, hash) {
    const target = BASE + '/' + (p ? p + '/' : '') + (hash || '');
    return 'href="' + target + '"';
  });
  // Cache busting: version every local css/js reference
  html = html.replace(/(href|src)="(\/cs\/assets\/[^"]*\.(?:css|js))"/g, function (m, attr, url) {
    return attr + '="' + url + '?v=' + ASSET_V + '"';
  });
  // lang attribute
  html = html.replace(/<html lang="[^"]*"/, '<html lang="' + (lang === 'zh' ? 'zh-CN' : 'en') + '"');
  // Write route and language into the page so the runtime renders the same view
  const boot = '<script>window.__ATLAS__=' + JSON.stringify({ route: route || '', lang: lang, base: BASE }) + ';</script>';
  html = html.replace(/<body([^>]*)>/, '<body$1>\n' + boot);
  return html;
}

function headLinks(route, lang, title, desc) {
  const u = () => SITE + BASE + '/' + (route ? route + '/' : '');
  return [
    '<link rel="canonical" href="' + u() + '">',
    '<link rel="alternate" hreflang="x-default" href="' + u() + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:title" content="' + title.replace(/"/g, '&quot;') + '">',
    '<meta property="og:url" content="' + u() + '">',
    '<meta property="og:description" content="' + desc.replace(/"/g, '&quot;') + '">'
  ].join('\n');
}


async function main() {
  rmrf(DIST);
  mkdir(DIST);

  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'cs', 'assets'));

  const data = await probeData();
  const allRoutes = ROUTES.concat(
    data.domains.map(function (id) { return 'domain/' + id; }),
    data.topics.map(function (id) { return 'topic/' + id; }),
    data.paths.map(function (id) { return 'path/' + id; })
  );
  console.log('routes:', allRoutes.length);
  const urls = [];
  for (const lang of LANGS) {
    for (const route of allRoutes) {
      const { html, title, desc } = await render(route, lang);
      let out = rewrite(html, lang, route);
      out = out.replace('</head>', headLinks(route, lang, title, desc) + '\n</head>');
      const dir = path.join(DIST, 'cs', route);
      mkdir(dir);
      fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
      urls.push({ lang, route, title });
      process.stdout.write('.');
    }
  }
  console.log('');

  // Root landing page: list every atlas
  fs.writeFileSync(path.join(DIST, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Atlas — visual maps of big subjects</title>
<meta name="description" content="Interactive atlases: computer science, and more to come.">
<style>body{background:#080b12;color:#e6e9f0;font:16px/1.7 ui-sans-serif,system-ui;margin:0;padding:12vh 8vw}h1{font-size:clamp(30px,5vw,54px);margin:0 0 10px}p{color:#9aa4b8;max-width:60ch}a.card{display:block;margin-top:26px;padding:20px 22px;border:1px solid #232a38;border-radius:12px;color:#e6e9f0;text-decoration:none;max-width:520px}a.card:hover{border-color:#7aa2f7}a.card b{display:block;font-size:19px;margin-bottom:4px}a.card span{color:#9aa4b8;font-size:14px}</style>
</head><body>
<h1>Atlas</h1>
<p>Visual, bottom-up maps of big subjects. Each atlas is a set of interlinked pages, from first principles to the frontier.</p>
<a class="card" href="/cs/"><b>CS Atlas</b><span>Computer science in 13 domains, 75 topics, 326 milestones — plus a from-scratch hardware course.</span></a>
</body></html>`, 'utf8');

  // sitemap (single language)
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(function (u) {
      return '  <url><loc>' + SITE + BASE + '/' + (u.route ? u.route + '/' : '') + '</loc></url>';
    }).join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n', 'utf8');

  console.log('pages:', urls.length, '| dist ready');
}

main().catch(e => { console.error(e); process.exit(1); });
