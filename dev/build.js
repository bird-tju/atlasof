/* Prerender every atlas into static HTML at its real path.
   Output: dist/<atlas>/<route>/index.html + dist/index.html portal + sitemap + robots
   Usage: node dev/build.js
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM, VirtualConsole } = require('jsdom');
const { privacyPage } = require('./privacy');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
// Contact address for the privacy page. Read from the environment so the repo does
// not carry a personal mailbox: set CONTACT_EMAIL in the host's build settings.
const CONTACT = process.env.CONTACT_EMAIL || '';
const SITE = 'https://atlasof.dev';        // the deployed origin
const ADSENSE_CLIENT = 'ca-pub-1177594928684175';
const ADSENSE_SCRIPT = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT + '" crossorigin="anonymous"></script>';

/* One entry per atlas. Adding an atlas = adding one object here plus its folder. */
const ATLASES = [
  {
    id: 'cs',
    base: '/cs',
    dir: 'atlases/cs',
    title: 'CS Atlas',
    tagline: 'A map of computing',
    card: 'Computer science in 13 domains, 75 topics, 326 milestones — plus a from-scratch hardware course.',
    routes: [
      '', 'map', 'timeline', 'domains', 'paths', 'progress', 'giants', 'about', 'random', 'library',
      'courses/nand2tetris',
      'courses/nand2tetris/intro', 'courses/nand2tetris/gates', 'courses/nand2tetris/adders',
      'courses/nand2tetris/alu', 'courses/nand2tetris/sequential', 'courses/nand2tetris/ram',
      'courses/nand2tetris/machine', 'courses/nand2tetris/machine-language',
      'courses/nand2tetris/assembler', 'courses/nand2tetris/cpu',
      'courses/nand2tetris/computer', 'courses/nand2tetris/screen',
      'courses/nand2tetris/keyboard', 'courses/nand2tetris/gate-reference',
      'courses/nand2tetris/abstraction-levels'
    ],
    dataRoutes: true
  },
  {
    id: 'math',
    base: '/math',
    enabled: false,          // source kept, not published yet
    dir: 'atlases/math',
    title: 'Math Atlas',
    tagline: 'A map of mathematics',
    card: 'A second atlas, in progress.',
    routes: [''],
    dataRoutes: false
  }
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

/* Content hash of an atlas's css/js, appended as ?v= so a stale cache cannot survive a rebuild */
function assetVersion(dir) {
  const parts = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(css|js)$/.test(e.name)) parts.push(fs.readFileSync(full, 'utf8'));
    }
  })(dir);
  return crypto.createHash('sha1').update(parts.join('\n')).digest('hex').slice(0, 10);
}

async function load(entry, route) {
  const vc = new VirtualConsole();
  const dom = await JSDOM.fromFile(path.join(ROOT, entry.dir, 'index.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(win) {
      win.__ATLAS__ = { route: route, lang: 'en', base: entry.base };
      win.__BUILDING__ = true;   // keeps /random from navigating away while prerendering
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
  return dom;
}

async function probeData(entry) {
  const dom = await load(entry, '');
  const CS = dom.window.CS || {};
  const out = {
    topics: (CS.topics || []).map(t => t.id),
    domains: (CS.domains || []).map(d => d.id),
    paths: (CS.paths || []).map(x => x.id)
  };
  dom.window.close();
  return out;
}

function rewrite(html, entry, route, version) {
  const base = entry.base;
  // Assets: he dir keeps css/ and js/ side by side, published under <base>/assets/
  html = html.split('href="css/').join('href="' + base + '/assets/css/');
  html = html.split('src="js/').join('src="' + base + '/assets/js/');
  // Internal links: #/x  ->  <base>/x/
  html = html.replace(/href="#\/([^"#]*)(#[^"]*)?"/g, function (m, p, hash) {
    return 'href="' + base + '/' + (p ? p + '/' : '') + (hash || '') + '"';
  });
  // Cache busting
  const prefix = base.replace(/\//g, '\\/');
  html = html.replace(new RegExp('(href|src)="(' + prefix + '\\/assets\\/[^"]*\\.(?:css|js))"', 'g'), function (m, attr, url) {
    return attr + '="' + url + '?v=' + version + '"';
  });
  // Route + language for the runtime
  const boot = '<script>window.__ATLAS__=' + JSON.stringify({ route: route || '', lang: 'en', base: base }) + ';</script>';
  html = html.replace(/<body([^>]*)>/, '<body$1>\n' + boot);
  return html;
}

function headLinks(entry, route, title, desc) {
  const u = SITE + entry.base + '/' + (route ? route + '/' : '');
  const img = SITE + entry.base + '/og.png';
  const icon = entry.base + '/icon-180.png';
  return [
    '<link rel="canonical" href="' + u + '">',
    '<link rel="alternate" hreflang="x-default" href="' + u + '">',
    '<meta name="theme-color" content="#070910" media="(prefers-color-scheme: dark)">',
    '<meta name="theme-color" content="#f6f4ee" media="(prefers-color-scheme: light)">',
    '<link rel="apple-touch-icon" sizes="180x180" href="' + icon + '">',
    '<meta property="og:type" content="' + (route ? 'article' : 'website') + '">',
    '<meta property="og:site_name" content="' + entry.title + '">',
    '<meta property="og:title" content="' + title.replace(/"/g, '&quot;') + '">',
    '<meta property="og:url" content="' + u + '">',
    '<meta property="og:description" content="' + (desc || '').replace(/"/g, '&quot;') + '">',
    '<meta property="og:image" content="' + img + '">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + title.replace(/"/g, '&quot;') + '">',
    '<meta name="twitter:description" content="' + (desc || '').replace(/"/g, '&quot;') + '">',
    '<meta name="twitter:image" content="' + img + '">',
    ADSENSE_SCRIPT
  ].join('\n');
}

function portal(atlasList) {
  const cards = atlasList.map(function (a) {
    return '<a class="card" href="' + a.base + '/"><b>' + a.title + '</b><span>' + a.card + '</span></a>';
  }).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Atlas — visual maps of big subjects</title>
<meta name="theme-color" content="#080b12">
<link rel="apple-touch-icon" sizes="180x180" href="/cs/icon-180.png">
<link rel="canonical" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:title" content="Atlas — visual maps of big subjects">
<meta property="og:url" content="${SITE}/">
<meta property="og:description" content="Interactive, bottom-up atlases of big subjects.">
<meta name="twitter:card" content="summary">
<meta name="description" content="Interactive, bottom-up atlases of big subjects.">
<style>body{background:#080b12;color:#e6e9f0;font:16px/1.7 ui-sans-serif,system-ui;margin:0;padding:12vh 8vw}h1{font-size:clamp(30px,5vw,54px);margin:0 0 10px}p{color:#9aa4b8;max-width:60ch}a.card{display:block;margin-top:26px;padding:20px 22px;border:1px solid #232a38;border-radius:12px;color:#e6e9f0;text-decoration:none;max-width:520px}a.card:hover{border-color:#7aa2f7}a.card b{display:block;font-size:19px;margin-bottom:4px}a.card span{color:#9aa4b8;font-size:14px}</style>
${ADSENSE_SCRIPT}
</head><body>
<main>
<h1>Atlas</h1>
<p>Visual, bottom-up maps of big subjects. Each atlas is a set of interlinked pages, from first principles to the frontier.</p>
${cards}
<p style="margin-top:34px;font-size:13px;color:#6d758a"><a href="/privacy/" style="color:#9aa4b8">Privacy</a></p>
</main>
</body></html>`;
}


/* 404: hosts serve this file for any path that does not exist. It is deliberately
   self-contained — inline styles, no asset requests — so it still renders if the
   asset host or the path prefix is what went wrong. */
function notFound(atlasList) {
  const links = atlasList.map(function (a) {
    return '<a class="pill" href="' + a.base + '/">' + a.title + '</a>';
  }).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="robots" content="noindex">
<title>404 · that page is not on the map</title>
<style>
  :root{--bg:#070910;--text:#e9ebf2;--muted:#a8afc2;--line:rgba(255,255,255,.09);--accent:#7aa2f7;--mono:ui-monospace,"Cascadia Code","SF Mono",Menlo,Consolas,monospace}
  @media (prefers-color-scheme: light){:root{--bg:#f6f4ee;--text:#191c24;--muted:#4e5565;--line:rgba(24,28,40,.12);--accent:#2f5fd0}}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;align-items:center;background:var(--bg);color:var(--text);
       font:16px/1.65 "Inter","Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
       -webkit-font-smoothing:antialiased}
  .wrap{width:min(660px,88vw);margin:0 auto;padding:12vh 0}
  .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:0 0 18px}
  .code{font-family:var(--mono);font-size:clamp(52px,9vw,96px);line-height:1;letter-spacing:-.04em;margin:0 0 16px;color:var(--accent)}
  h1{font-size:clamp(24px,3.4vw,34px);line-height:1.2;letter-spacing:-.02em;margin:0 0 14px}
  p{color:var(--muted);max-width:52ch;margin:0 0 26px}
  .row{display:flex;flex-wrap:wrap;gap:10px;padding-top:22px;border-top:1px solid var(--line)}
  .pill{font-family:var(--mono);font-size:12.5px;padding:8px 14px;border:1px solid var(--line);border-radius:999px;color:var(--text);text-decoration:none}
  .pill:hover{border-color:var(--accent);color:var(--accent)}
</style>
${ADSENSE_SCRIPT}
</head><body>
<main class="wrap">
  <p class="eyebrow">Not on the map</p>
  <p class="code">404</p>
  <h1>That page is not part of any atlas.</h1>
  <p>The address may have been mistyped, or the page may have moved when an atlas was restructured. Everything is reachable from the front page.</p>
  <nav class="row">${links}<a class="pill" href="/">All atlases</a></nav>
</main>
</body></html>`;
}

async function main() {
  rmrf(DIST);
  mkdir(DIST);

  // An atlas can sit in the repo without being published: enabled: false keeps its
  // source and drops it from the build, the portal, the sitemap and the 404 page.
  const live = ATLASES.filter(function (a) { return a.enabled !== false; });
  const urls = [];

  for (const entry of live) {
    const srcDir = path.join(ROOT, entry.dir);
    if (!fs.existsSync(srcDir)) { console.log('skip (no folder):', entry.id); continue; }

    for (const sub of ['css', 'js']) {
      const from = path.join(srcDir, sub);
      if (fs.existsSync(from)) copyDir(from, path.join(DIST, entry.base.slice(1), 'assets', sub));
    }
    // Social card and touch icon: copied to the atlas root, not under assets/
    for (const file of ['og.png', 'icon-180.png']) {
      const from = path.join(srcDir, file);
      if (fs.existsSync(from)) {
        fs.copyFileSync(from, path.join(DIST, entry.base.slice(1), file));
      }
    }
    const version = assetVersion(srcDir);

    let routes = entry.routes.slice();
    if (entry.dataRoutes) {
      const data = await probeData(entry);
      routes = routes.concat(
        data.domains.map(function (id) { return 'domain/' + id; }),
        // A focused view of the atlas graph: /cs/map/ai/ opens with AI selected.
        data.domains.map(function (id) { return 'map/' + id; }),
        data.topics.map(function (id) { return 'topic/' + id; }),
        data.paths.map(function (id) { return 'path/' + id; })
      );
    }

    console.log(entry.id + ' routes:', routes.length);
    for (const route of routes) {
      const dom = await load(entry, route);
      const doc = dom.window.document;
      const title = doc.title;
      const desc = (doc.querySelector('meta[name="description"]') || {}).content || '';
      const html = '<!doctype html>\n' + doc.documentElement.outerHTML;
      dom.window.close();

      let out = rewrite(html, entry, route, version);
      out = out.replace('</head>', headLinks(entry, route, title, desc) + '\n</head>');
      const dir = path.join(DIST, entry.base.slice(1), route);
      mkdir(dir);
      fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
      urls.push({ base: entry.base, route });
      process.stdout.write('.');
    }
    console.log('');
  }

  // Privacy policy at the domain root: ad networks expect one URL for the whole site.
  mkdir(path.join(DIST, 'privacy'));
  fs.writeFileSync(path.join(DIST, 'privacy', 'index.html'), privacyPage(SITE, CONTACT, ADSENSE_SCRIPT), 'utf8');
  urls.push({ base: '', route: 'privacy' });

  // IAB ads.txt: Google AdSense is authorised to sell inventory on this domain.
  fs.writeFileSync(path.join(DIST, 'ads.txt'), 'google.com, pub-1177594928684175, DIRECT, f08c47fec0942fa0\n', 'utf8');

  fs.writeFileSync(path.join(DIST, 'index.html'), portal(live), 'utf8');
  fs.writeFileSync(path.join(DIST, '404.html'), notFound(live), 'utf8');

  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(function (u) {
      return '  <url><loc>' + SITE + u.base + '/' + (u.route ? u.route + '/' : '') + '</loc></url>';
    }).join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n', 'utf8');


  // Host cache policy. Assets carry a content hash in the query string, so they can
  // be cached forever; HTML keeps the platform default (revalidate every time).
  // Only one rule sets Cache-Control, because Cloudflare joins duplicate headers
  // with a comma instead of letting the last rule win.
  fs.writeFileSync(path.join(DIST, '_headers'), [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    ''
  ].join('\n'), 'utf8');

  console.log('pages:', urls.length, '| atlases:', live.length, '| dist ready');
}

main().catch(e => { console.error(e); process.exit(1); });
