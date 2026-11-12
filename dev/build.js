/* Prerender every atlas into static HTML at its real path.
   Output: dist/<atlas>/<route>/index.html + dist/index.html portal + sitemap + robots
   Usage: node dev/build.js
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://example.com';        // placeholder: replace once a domain exists

/* One entry per atlas. Adding an atlas = adding one object here plus its folder. */
const ATLASES = [
  {
    id: 'cs',
    base: '/cs',
    dir: 'atlases/cs',
    title: 'CS Atlas',
    tagline: 'A map of computer science',
    card: 'Computer science in 13 domains, 75 topics, 326 milestones — plus a from-scratch hardware course.',
    routes: [
      '', 'map', 'timeline', 'domains', 'paths', 'progress', 'giants', 'about', 'random',
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
  return [
    '<link rel="canonical" href="' + u + '">',
    '<link rel="alternate" hreflang="x-default" href="' + u + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:title" content="' + title.replace(/"/g, '&quot;') + '">',
    '<meta property="og:url" content="' + u + '">',
    '<meta property="og:description" content="' + (desc || '').replace(/"/g, '&quot;') + '">'
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
<meta name="description" content="Interactive, bottom-up atlases of big subjects.">
<style>body{background:#080b12;color:#e6e9f0;font:16px/1.7 ui-sans-serif,system-ui;margin:0;padding:12vh 8vw}h1{font-size:clamp(30px,5vw,54px);margin:0 0 10px}p{color:#9aa4b8;max-width:60ch}a.card{display:block;margin-top:26px;padding:20px 22px;border:1px solid #232a38;border-radius:12px;color:#e6e9f0;text-decoration:none;max-width:520px}a.card:hover{border-color:#7aa2f7}a.card b{display:block;font-size:19px;margin-bottom:4px}a.card span{color:#9aa4b8;font-size:14px}</style>
</head><body>
<main>
<h1>Atlas</h1>
<p>Visual, bottom-up maps of big subjects. Each atlas is a set of interlinked pages, from first principles to the frontier.</p>
${cards}
</main>
</body></html>`;
}

async function main() {
  rmrf(DIST);
  mkdir(DIST);

  const urls = [];

  for (const entry of ATLASES) {
    const srcDir = path.join(ROOT, entry.dir);
    if (!fs.existsSync(srcDir)) { console.log('skip (no folder):', entry.id); continue; }

    for (const sub of ['css', 'js']) {
      const from = path.join(srcDir, sub);
      if (fs.existsSync(from)) copyDir(from, path.join(DIST, entry.base.slice(1), 'assets', sub));
    }
    const version = assetVersion(srcDir);

    let routes = entry.routes.slice();
    if (entry.dataRoutes) {
      const data = await probeData(entry);
      routes = routes.concat(
        data.domains.map(function (id) { return 'domain/' + id; }),
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

  fs.writeFileSync(path.join(DIST, 'index.html'), portal(ATLASES), 'utf8');

  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(function (u) {
      return '  <url><loc>' + SITE + u.base + '/' + (u.route ? u.route + '/' : '') + '</loc></url>';
    }).join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n', 'utf8');

  console.log('pages:', urls.length, '| atlases:', ATLASES.length, '| dist ready');
}

main().catch(e => { console.error(e); process.exit(1); });
