const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'atlases', 'cs', 'index.html');

const errors = [];
const passed = [];
function check(name, fn) {
  try {
    fn();
    passed.push(name);
  } catch (e) {
    errors.push(name + ': ' + (e && e.message ? e.message : e));
  }
}

function boot() {
  const vc = new VirtualConsole();
  vc.on('jsdomError', () => {});
  return JSDOM.fromFile(INDEX, {
    virtualConsole: vc,
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'file:///' + INDEX.replace(/\\/g, '/'),
    beforeParse(window) {
      window.scrollTo = function () {};
      window.IntersectionObserver = function () {
        return { observe() {}, unobserve() {}, disconnect() {}, takeRecords() { return []; } };
      };
      window.matchMedia = function () {
        return {
          matches: false, media: '',
          addEventListener() {}, removeEventListener() {},
          addListener() {}, removeListener() {}
        };
      };
    }
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const dom = await boot();
  const win = dom.window;
  const doc = win.document;

  await new Promise((resolve) => {
    if (doc.readyState === 'complete') return resolve();
    win.addEventListener('load', resolve);
  });
  await wait(300);

  const go = async (hash) => {
    win.location.hash = hash;
    await wait(280);
  };
  const $ = (s) => doc.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(doc.querySelectorAll(s));
  const click = (el) => el && el.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));

  check('home', () => {
    if (!doc.querySelector('.hero')) throw new Error('no hero');
    if (!doc.querySelector('.hero-map') && !doc.querySelector('#hero-map')) throw new Error('no hero map');
  });

  check('main nav', () => {
    const links = $$('.site-nav a, .nav-links a, header nav a');
    if (links.length < 6) throw new Error('nav links: ' + links.length);
  });

  await go('#/map');
  check('atlas graph', () => {
    if (!doc.querySelector('svg')) throw new Error('no svg');
  });

  await go('#/timeline');
  check('timeline', () => {
    if (!doc.querySelector('.tl-item, .tl-list, .timeline-item')) throw new Error('no timeline items');
  });

  await go('#/domains');
  check('domains', () => {
    if ($('.index-domain').length < 8) throw new Error('domain cards: ' + $('.index-domain').length);
  });

  await go('#/paths');
  check('paths', () => {
    if (!doc.querySelector('.path-card, .path-list')) throw new Error('no path cards');
  });

  await go('#/progress');
  check('progress', () => {
    if (!doc.querySelector('[data-status-topic], .progress-grid')) throw new Error('no progress');
  });

  await go('#/courses/nand2tetris/intro');
  check('hardware intro', () => {
    if ($$('.intro-block').length < 4) throw new Error('intro blocks: ' + $$('.intro-block').length);
    if (!doc.querySelector('.cycle-player')) throw new Error('no cycle player');
  });

  /* ---------- Project 1 ---------- */
  await go('#/courses/nand2tetris/gates');
  check('p1 structure', () => {
    const navCount = doc.querySelectorAll('.line-nav a').length;
    if (navCount !== 14) throw new Error('line-nav: ' + navCount);
    if ($$('.p1-block').length !== 13) throw new Error('p1 blocks: ' + $$('.p1-block').length);
    if ($$('.p1-block[data-gway]').length !== 5) throw new Error('way blocks');
    if (!doc.querySelector('[data-dev="mux"]')) throw new Error('mux block missing');
    if (!doc.querySelector('[data-dev="dmux"]')) throw new Error('dmux block missing');
  });

  check('p1 truth table', () => {
    const xor = doc.querySelector('.p1-block[data-gate="xor"]');
    const rows = xor.querySelectorAll('tr[data-row]');
    click(rows[rows.length - 1]);
    if (!xor.querySelector('.p1-w.is-on')) throw new Error('xor circuit not live');
  });

  check('p1 16-bit', () => {
    const a16 = doc.querySelector('.p1-block[data-gate="and16"]');
    if (a16.querySelectorAll('.b16-cell').length !== 48) throw new Error('b16 cells');
    const before = a16.querySelector('.b16-row:last-child .b16-hex').textContent;
    click(a16.querySelector('.b16-cell.is-edit[data-row="a"][data-bit="0"]'));
    const after = doc.querySelector('.p1-block[data-gate="and16"] .b16-row:last-child .b16-hex').textContent;
    if (before === after) throw new Error('16-bit out unchanged');
  });

  check('p1 multi-way highlight', () => {
    const m4 = doc.querySelector('.p1-block[data-gate="mux4way16"]');
    click(m4.querySelector('tr[data-sel="2"]'));
    const m4b = doc.querySelector('.p1-block[data-gate="mux4way16"]');
    if (!m4b.querySelector('.p1-w.is-on')) throw new Error('way highlight missing');
  });

  /* ---------- Project 2 ---------- */
  await go('#/courses/nand2tetris/adders');
  check('p2 structure', () => {
    if ($$('[data-p2]').length !== 4) throw new Error('p2 blocks: ' + $$('[data-p2]').length);
    ['half', 'full', 'add16', 'inc16'].forEach((id) => {
      if (!doc.querySelector('[data-p2="' + id + '"]')) throw new Error('missing ' + id);
    });
  });

  check('p2 truth tables', () => {
    const full = doc.querySelector('[data-p2="full"]');
    click(full.querySelector('tr[data-row="7"]'));
    if (!doc.querySelector('[data-p2="full"]').querySelector('.p1-w.is-on')) throw new Error('full adder not live');
  });

  check('p2 add16 cells', () => {
    const a16 = doc.querySelector('[data-p2="add16"]');
    const before = a16.querySelector('.b16-row:last-child .b16-hex').textContent;
    click(a16.querySelector('.b16-cell.is-edit[data-k="addA"][data-bit="0"]'));
    const after = doc.querySelector('[data-p2="add16"] .b16-row:last-child .b16-hex').textContent;
    if (before === after) throw new Error('add16 out unchanged');
  });

  /* ---------- ALU ---------- */
  await go('#/courses/nand2tetris/alu');
  check('alu structure', () => {
    if (!doc.querySelector('[data-alu-fig] svg')) throw new Error('no alu figure');
    if (!doc.querySelector('.alu-panel')) throw new Error('no alu panel');
    if ($$('.alu-panel tr[data-func]').length !== 18) throw new Error('18 functions');
    if ($$('.alu-panel [data-ctl]').length !== 6) throw new Error('6 control bits');
  });

  check('alu controls', () => {
    const rows = $$('.alu-panel tr[data-func]');
    click(rows[16]);
    const sel = doc.querySelector('.alu-panel tr.is-sel');
    if (!sel) throw new Error('row not selected');
    const ctl = $$('.alu-panel [data-ctl]')[0];
    click(ctl);
    if (!doc.querySelector('.alu-panel .alu-out-val')) throw new Error('panel lost');
  });

  check('alu hdl', () => {
    const code = doc.querySelector('.hdl-code');
    if (!code) throw new Error('no hdl code');
  });

  await go('#/courses/nand2tetris/sequential');
  check('sequential structure', () => {
    const figs = doc.querySelectorAll('[data-fig]').length;
    if (figs !== 5) throw new Error('figures: ' + figs);
    if (!doc.querySelector('.clk-widget[data-w="reg"]')) throw new Error('no register widget');
    if (!doc.querySelector('.clk-widget[data-w="pc"]')) throw new Error('no pc widget');
  });

  check('register', () => {
    const reg = () => doc.querySelector('.clk-widget[data-w="reg"]');
    click(reg().querySelector('.b16-cell.is-edit[data-bit="0"]'));
    click(reg().querySelector('[data-toggle="regLoad"]'));
    click(reg().querySelector('#reg-tick'));
    const rows = reg().querySelectorAll('.b16-row');
    const out = rows[rows.length - 1].querySelector('.b16-hex').textContent;
    if (out !== '0x0001') throw new Error('reg out=' + out);
  });

  check('pc priority', () => {
    const pc = () => doc.querySelector('.clk-widget[data-w="pc"]');
    const hex = () => {
      const rows = pc().querySelectorAll('.b16-row');
      return rows[rows.length - 1].querySelector('.b16-hex').textContent;
    };
    click(pc().querySelector('#pc-tick'));
    click(pc().querySelector('#pc-tick'));
    if (hex() !== '0x0002') throw new Error('inc out=' + hex());
    click(pc().querySelector('[data-toggle="pcLoad"]'));
    click(pc().querySelector('#pc-tick'));
    if (hex() !== '0x0000') throw new Error('load out=' + hex());
    click(pc().querySelector('[data-toggle="pcReset"]'));
    click(pc().querySelector('#pc-tick'));
    if (hex() !== '0x0000') throw new Error('reset out=' + hex());
  });

  /* ---------- RAM ---------- */
  await go('#/courses/nand2tetris/ram');
  check('ram structure', () => {
    if (!doc.querySelector('[data-fig="ram"] svg')) throw new Error('no ram figure');
    const hdlCount = doc.querySelectorAll('.hdl-block').length;
    if (hdlCount !== 5) throw new Error('ram hdl blocks: ' + hdlCount);
    if ($('.layer-table tbody tr').length < 9) throw new Error('ram tables');
  });

  check('ram demo', () => {
    const w = () => doc.querySelector('.clk-widget[data-w="ram"]');
    if (!w()) throw new Error('no ram widget');
    click(w().querySelectorAll('.ram-slot')[3]);
    if (w().querySelector('.ram-slot.is-sel .ram-idx').textContent !== '3') throw new Error('addr not selected');
    click(w().querySelector('.b16-cell.is-edit[data-k="ramIn"][data-bit="0"]'));
    click(w().querySelector('#ram-write'));
    const wrote = w().querySelector('.p2-out b').textContent;
    if (wrote !== '0x0001') throw new Error('write failed: ' + wrote);
    click(w().querySelector('[data-toggle="ramLoad"]'));
    click(w().querySelector('.b16-cell.is-edit[data-k="ramIn"][data-bit="1"]'));
    click(w().querySelector('#ram-write'));
    if (w().querySelector('.p2-out b').textContent !== '0x0001') throw new Error('load=0 should not write');
  });

  await go('#/courses/nand2tetris/gate-reference');
  check('gate reference', () => {
    if ($('.ref-col.ref-name').length < 6) throw new Error('gate cards: ' + $('.ref-col.ref-name').length);
    if ($('.ref-sym svg').length < 6) throw new Error('gate symbols: ' + $('.ref-sym svg').length);
  });

  await go('#/courses/nand2tetris/machine');
  check('computer', () => {
    const figs = doc.querySelectorAll('[data-fig]');
    if (figs.length !== 6) throw new Error('figures: ' + figs.length);
    const blocks = doc.querySelectorAll('.clock-block').length;
    if (blocks !== 11) throw new Error('blocks: ' + blocks);
    const tables = doc.querySelectorAll('.layer-table').length;
    if (tables < 6) throw new Error('spec tables: ' + tables);
  });

  await go('#/courses/nand2tetris/machine-language');
  check('machine language', () => {
    const word = doc.querySelector('.ml-word code');
    if (!word || word.textContent.length !== 16) throw new Error('builder word: ' + (word && word.textContent));
    const bits = doc.querySelectorAll('.ml-bit').length;
    if (bits < 32) throw new Error('bit layout cells: ' + bits);
    const rows = doc.querySelectorAll('.layer-table tbody tr').length;
    if (rows < 20) throw new Error('ml tables: ' + rows);
    if (doc.querySelector('[data-ml-asm]')) throw new Error('translator should be removed');
  });

  check('machine language decode', () => {
    const chip = doc.querySelector('[data-dest="A"]');
    click(chip);
    const word = doc.querySelector('.ml-word code').textContent;
    if (word.charAt(10) !== '1') throw new Error('dest bit not set: ' + word);
    const sel = doc.querySelector('[data-comp]');
    sel.value = '0';
    sel.dispatchEvent(new win.Event('change', { bubbles: true }));
    const w2 = doc.querySelector('.ml-word code').textContent;
    if (!w2.startsWith('1110101010')) throw new Error('comp not applied: ' + w2);
  });

  await go('#/courses/nand2tetris/screen');
  check('screen', () => {
    if (!doc.querySelector('.scr-grid')) throw new Error('no screen grid');
    const cells = doc.querySelectorAll('.scr-cell').length;
    if (cells !== 32 * 16) throw new Error('cells: ' + cells);
    const before = doc.querySelectorAll('.scr-words tbody tr').length;
    click(doc.querySelector('.scr-cell[data-r="0"][data-c="0"]'));
    const after = doc.querySelectorAll('.scr-words tbody tr').length;
    if (after !== before + 1) throw new Error('word table not updated');
  });

  await go('#/courses/nand2tetris/keyboard');
  check('input', () => {
    if (!doc.querySelector('.kb-grid')) throw new Error('no keyboard');
    const keys = doc.querySelectorAll('.kb-key').length;
    if (keys < 30) throw new Error('keys: ' + keys);
    click(doc.querySelector('.kb-key[data-code="65"]'));
    const v = Array.from(doc.querySelectorAll('.kb-v')).map(function (e) { return e.textContent; });
    if (v[1] !== '65') throw new Error('KBD value: ' + v.join('/'));
    click(doc.getElementById('kb-release'));
    const v2 = Array.from(doc.querySelectorAll('.kb-v')).map(function (e) { return e.textContent; });
    if (v2[1] !== '0') throw new Error('release: ' + v2.join('/'));
  });

  await go('#/courses/nand2tetris/computer');
  check('whole machine', () => {
    const figs = doc.querySelectorAll('[data-fig]').length;
    if (figs < 2) throw new Error('figures: ' + figs);
    const hdls = doc.querySelectorAll('.hdl-block').length;
    if (hdls < 2) throw new Error('hdl blocks: ' + hdls);
  });

  await go('#/courses/nand2tetris/assembler');
  check('assembler', () => {
    const ta = doc.querySelector('[data-asm]');
    if (!ta) throw new Error('no asm textarea');
    const out = doc.querySelector('[data-asm-out]');
    if (!out || !out.textContent.includes('instructions')) throw new Error('no summary');
    const cards = out.querySelectorAll('.ref-tt tbody tr').length;
    if (cards < 5) throw new Error('table rows: ' + cards);
    ta.value = '@5\nD=A';
    ta.dispatchEvent(new win.Event('input', { bubbles: true }));
    const out2 = doc.querySelector('[data-asm-out]').textContent;
    if (!out2.includes('2 instructions')) throw new Error('not re-assembled');
  });

  await go('#/courses/nand2tetris/cpu');
  check('cpu', () => {
    const blocks = doc.querySelectorAll('.cpu-block').length;
    if (blocks !== 7) throw new Error('cpu blocks: ' + blocks);
    if (!doc.querySelector('.cpu-section .p1-svg')) throw new Error('no computer figure');
    if (!doc.querySelector('.dec-panel')) throw new Error('no decode panel');
  });

  await go('#/giants');
  check('open courses', () => {
    if ($$('.giant-card').length < 1) throw new Error('no giant cards');
  });

  /* ---------- build artifacts: no thin pages, no literal 'undefined', sane stars ---------- */
  check('build artifacts', () => {
    const distRoot = path.join(ROOT, 'dist');
    if (!fs.existsSync(distRoot)) throw new Error('dist missing: run npm run build first');

    // Portal: every atlas folder in dist must be linked from the front page.
    const portal = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');
    const atlasDirs = fs.readdirSync(distRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !['assets', 'privacy'].includes(e.name))
      .map((e) => e.name);
    for (const a of atlasDirs) {
      if (!portal.includes('href="/' + a + '/"')) throw new Error('portal does not link /' + a + '/');
    }

    let pages = 0;
    const thin = [];
    const undefinedPages = [];
    const unversioned = [];
    const noMain = [];

    for (const atlas of atlasDirs) {
      const root = path.join(distRoot, atlas);
      const files = [];
      (function walk(dir) {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walk(full);
          else if (e.name === 'index.html') files.push(full);
        }
      })(root);

      for (const file of files) {
        pages++;
        const html = fs.readFileSync(file, 'utf8');
        const rel = '/' + path.relative(distRoot, path.dirname(file)).replace(/\\/g, '/') + '/';
        const main = html.match(/<main[\s\S]*?<\/main>/);
        if (!main) { noMain.push(rel); continue; }
        const text = main[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        // Placeholder atlases are allowed to be short; real content is not.
        // The random door is a redirect stub, not an article.
        const isRedirect = /\/random\/$/.test(rel);
        if (atlas === 'cs' && !isRedirect && text.length < 400) thin.push(rel + ' (' + text.length + ')');
        if (/\bundefined\b/.test(text)) undefinedPages.push(rel);
        if (/\.(?:css|js)"/.test(html)) unversioned.push(rel);
      }
    }

    if (!pages) throw new Error('no pages in dist');
    if (noMain.length) throw new Error('pages without <main>: ' + noMain.slice(0, 3).join(', '));
    if (thin.length) throw new Error('thin pages: ' + thin.slice(0, 5).join(', '));
    if (undefinedPages.length) throw new Error("pages showing 'undefined': " + undefinedPages.slice(0, 5).join(', '));
    if (unversioned.length) throw new Error('unversioned assets: ' + unversioned.slice(0, 3).join(', '));
  });

  check('brand line', () => {
    const home = fs.readFileSync(path.join(ROOT, 'dist', 'cs', 'index.html'), 'utf8');
    if (!/<em>A map of computing<\/em>/.test(home)) throw new Error('brand subtitle is not "A map of computing"');
    if (!/<title>CS Atlas · A map of computer science<\/title>/.test(home)) throw new Error('title lost the searchable term');
  });

  check('share metadata', () => {
    const distRoot = path.join(ROOT, 'dist');
    const atlases = fs.readdirSync(distRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !['assets', 'privacy'].includes(e.name))
      .map((e) => e.name);
    for (const a of atlases) {
      for (const f of ['og.png', 'icon-180.png']) {
        if (!fs.existsSync(path.join(distRoot, a, f))) throw new Error(a + ': missing ' + f);
      }
    }
    const sample = path.join(distRoot, atlases[0], 'index.html');
    const html = fs.readFileSync(sample, 'utf8');
    for (const needle of ['og:image', 'twitter:card', 'theme-color', 'apple-touch-icon']) {
      if (!html.includes(needle)) throw new Error('head is missing ' + needle);
    }
  });

  check('host headers', () => {
    const file = path.join(ROOT, 'dist', '_headers');
    if (!fs.existsSync(file)) throw new Error('dist/_headers missing');
    const txt = fs.readFileSync(file, 'utf8');
    if (!/^\/assets\/\*/m.test(txt)) throw new Error('no /assets/* rule');
    if (!/immutable/.test(txt)) throw new Error('assets are not marked immutable');
    // Only one rule may set Cache-Control: the host joins duplicates with a comma.
    const cacheLines = txt.split('\n').filter((l) => /^\s*Cache-Control:/i.test(l));
    if (cacheLines.length !== 1) throw new Error('Cache-Control set ' + cacheLines.length + ' times');
  });

  check('canonical on every page', () => {
    const distRoot = path.join(ROOT, 'dist');
    const files = [path.join(distRoot, 'index.html')];
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) { if (e.name !== 'assets') walk(p); }
        else if (e.name === 'index.html') files.push(p);
      }
    })(distRoot);
    const bad = [];
    for (const f of files) {
      const html = fs.readFileSync(f, 'utf8');
      const m = html.match(/<link rel="canonical" href="([^"]+)"/);
      if (!m) bad.push(path.relative(distRoot, f) + ' (none)');
      else if (!/^https:\/\//.test(m[1])) bad.push(path.relative(distRoot, f) + ' (not absolute)');
    }
    if (bad.length) throw new Error('canonical missing: ' + bad.slice(0, 3).join(', '));
  });

  check('not-found page', () => {
    const file = path.join(ROOT, 'dist', '404.html');
    if (!fs.existsSync(file)) throw new Error('dist/404.html missing');
    const html = fs.readFileSync(file, 'utf8');
    if (!/<main/.test(html)) throw new Error('404 has no <main>');
    // Every published atlas must be reachable from the 404 page; the list comes from
    // dist itself, so an atlas that is not built cannot break this check.
    const atlases = fs.readdirSync(path.join(ROOT, 'dist'), { withFileTypes: true })
      .filter((e) => e.isDirectory() && !['assets', 'privacy'].includes(e.name))
      .map((e) => e.name);
    if (!atlases.length) throw new Error('no atlas built');
    for (const a of atlases) {
      if (!html.includes('href="/' + a + '/"')) throw new Error('404 does not link /' + a + '/');
    }
    // The AdSense tag is the one permitted third-party request; everything else
    // on this page stays self-contained so a broken asset path cannot take it down.
    const stripped = html
      .replace(/xmlns="[^"]*"/g, '')
      .replace(/<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-[0-9]+" crossorigin="anonymous"><\/script>/g, '');
    if (/https?:\/\//.test(stripped)) throw new Error('404 makes external requests');
  });

  check('star ratio', () => {
    const vm = require('vm');
    const fs2 = require('fs');
    const dir = path.join(ROOT, 'atlases', 'cs', 'js', 'data');
    const CS = { topics: [] };
    CS.addTopics = function (list) { CS.topics = CS.topics.concat(list); };
    const sandbox = { window: {}, console };
    sandbox.window.CS = CS;
    sandbox.CS = CS;
    vm.createContext(sandbox);
    const files = fs2.readdirSync(dir).filter((f) => f.endsWith('.js'))
      .sort((a, b) => (a === 'core.js' ? -1 : b === 'core.js' ? 1 : a.localeCompare(b)));
    for (const f of files) {
      vm.runInContext('var window = globalThis; var CS = window.CS;\n' + fs2.readFileSync(path.join(dir, f), 'utf8'), sandbox, { filename: f });
    }
    let total = 0;
    let starred = 0;
    for (const t of CS.topics) {
      for (const m of t.milestones || []) {
        total++;
        if (m[3] === 1 || m[3] === true) starred++;
      }
    }
    if (!total) throw new Error('no milestones');
    const ratio = starred / total;
    if (ratio < 0.05 || ratio > 0.4) {
      throw new Error('starred ' + starred + '/' + total + ' = ' + ratio.toFixed(2) + ', expected 0.05-0.40');
    }
  });


  /* Library filter: serve dist on an ephemeral port and click the buttons. The check
     has to read computed display, not the hidden property: a CSS specificity bug once
     set the attribute while the row still rendered. */
  await new Promise((resolve) => {
    const httpSrv = require('http');
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
    const server = httpSrv.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(ROOT, 'dist', urlPath);
      if (urlPath.endsWith('/')) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nope'); }
      res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', async () => {
      const port = server.address().port;
      const url = 'http://127.0.0.1:' + port + '/cs/library/';
      try {
        const page = await new Promise((res, rej) => {
          require('http').get(url, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d)); }).on('error', rej);
        });
        const vc2 = new VirtualConsole();
        vc2.on('jsdomError', () => {});
        const dom = new (require('jsdom').JSDOM)(page, {
          url,
          runScripts: 'dangerously',
          resources: 'usable',
          pretendToBeVisual: true,
          virtualConsole: vc2,
          beforeParse(win) {
            win.scrollTo = () => {};
            win.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
            win.IntersectionObserver = function () { return { observe() {}, unobserve() {}, disconnect() {}, takeRecords() { return []; } }; };
          }
        });
        await new Promise((r) => dom.window.addEventListener('load', () => setTimeout(r, 350)));
        const doc = dom.window.document;
        const rows = [...doc.querySelectorAll('.lib-group li[data-type]')];
        const visible = () => rows.filter((li) => dom.window.getComputedStyle(li).display !== 'none');

        check('library filters', () => {
          if (!rows.length) throw new Error('no library rows');
          for (const btn of [...doc.querySelectorAll('.lib-filter-btn')]) {
            btn.click();
            const type = btn.dataset.type;
            const shown = visible();
            const badge = Number(btn.querySelector('em').textContent);
            if (shown.length !== badge) throw new Error(type + ': ' + shown.length + ' visible, badge ' + badge);
            const wrong = shown.filter((li) => type !== 'all' && li.dataset.type !== type);
            if (wrong.length) throw new Error(type + ' shows ' + wrong.length + ' rows of another type');
            // group counts must follow the filter too
            for (const group of [...doc.querySelectorAll('.lib-group')]) {
              if (group.hidden) continue;
              const rowsInGroup = [...group.querySelectorAll('li[data-type]')]
                .filter((li) => dom.window.getComputedStyle(li).display !== 'none').length;
              const label = Number(group.querySelector('h2 em').textContent);
              if (label !== rowsInGroup) throw new Error(type + ': group says ' + label + ' but shows ' + rowsInGroup);
            }
          }
        });
        dom.window.close();
      } catch (e) {
        check('library filters', () => { throw e; });
      }
      server.close(() => resolve());
    });
  });

  console.log('通过：' + passed.length + ' 项');
  if (errors.length) {
    console.log('失败：' + errors.length + ' 项');
    errors.forEach((e) => console.log(' - ' + e));
    process.exitCode = 1;
  } else {
    console.log('errors: 0');
  }
  win.close();
})().catch((e) => {
  console.error('启动失败：' + e.message);
  process.exitCode = 1;
});
