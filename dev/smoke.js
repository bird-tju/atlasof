const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');

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

  check('首页', () => {
    if (!doc.querySelector('.hero')) throw new Error('no hero');
    if (!doc.querySelector('.hero-map') && !doc.querySelector('#hero-map')) throw new Error('no hero map');
  });

  check('主导航 7 项', () => {
    const links = $$('.site-nav a, .nav-links a, header nav a');
    if (links.length < 6) throw new Error('nav links: ' + links.length);
  });

  await go('#/map');
  check('图谱页', () => {
    if (!doc.querySelector('svg')) throw new Error('no svg');
  });

  await go('#/timeline');
  check('时间轴页', () => {
    if (!doc.querySelector('.tl-item, .tl-list, .timeline-item')) throw new Error('no timeline items');
  });

  await go('#/domains');
  check('领域页', () => {
    if ($('.index-domain').length < 8) throw new Error('domain cards: ' + $('.index-domain').length);
  });

  await go('#/paths');
  check('路径页', () => {
    if (!doc.querySelector('.path-card, .path-list')) throw new Error('no path cards');
  });

  await go('#/progress');
  check('进度页', () => {
    if (!doc.querySelector('[data-status-topic], .progress-grid')) throw new Error('no progress');
  });

  await go('#/intro');
  check('引子页', () => {
    if ($$('.intro-block').length < 4) throw new Error('intro blocks: ' + $$('.intro-block').length);
    if (!doc.querySelector('.cycle-player')) throw new Error('no cycle player');
  });

  /* ---------- Project 1 ---------- */
  await go('#/p1');
  check('Project 1 结构', () => {
    const navCount = doc.querySelectorAll('.line-nav a').length;
    if (navCount !== 14) throw new Error('line-nav: ' + navCount);
    if ($$('.p1-block').length !== 13) throw new Error('p1 blocks: ' + $$('.p1-block').length);
    if ($$('.p1-block[data-gway]').length !== 5) throw new Error('way blocks');
    if (!doc.querySelector('[data-dev="mux"]')) throw new Error('mux block missing');
    if (!doc.querySelector('[data-dev="dmux"]')) throw new Error('dmux block missing');
  });

  check('Project 1 真值表交互', () => {
    const xor = doc.querySelector('.p1-block[data-gate="xor"]');
    const rows = xor.querySelectorAll('tr[data-row]');
    click(rows[rows.length - 1]);
    if (!xor.querySelector('.p1-w.is-on')) throw new Error('xor circuit not live');
  });

  check('Project 1 16 位交互', () => {
    const a16 = doc.querySelector('.p1-block[data-gate="and16"]');
    if (a16.querySelectorAll('.b16-cell').length !== 48) throw new Error('b16 cells');
    const before = a16.querySelector('.b16-row:last-child .b16-hex').textContent;
    click(a16.querySelector('.b16-cell.is-edit[data-row="a"][data-bit="0"]'));
    const after = doc.querySelector('.p1-block[data-gate="and16"] .b16-row:last-child .b16-hex').textContent;
    if (before === after) throw new Error('16-bit out unchanged');
  });

  check('Project 1 多路高亮', () => {
    const m4 = doc.querySelector('.p1-block[data-gate="mux4way16"]');
    click(m4.querySelector('tr[data-sel="2"]'));
    const m4b = doc.querySelector('.p1-block[data-gate="mux4way16"]');
    if (!m4b.querySelector('.p1-w.is-on')) throw new Error('way highlight missing');
  });

  /* ---------- Project 2 ---------- */
  await go('#/p2');
  check('Project 2 结构', () => {
    if ($$('[data-p2]').length !== 4) throw new Error('p2 blocks: ' + $$('[data-p2]').length);
    ['half', 'full', 'add16', 'inc16'].forEach((id) => {
      if (!doc.querySelector('[data-p2="' + id + '"]')) throw new Error('missing ' + id);
    });
  });

  check('Project 2 真值表', () => {
    const full = doc.querySelector('[data-p2="full"]');
    click(full.querySelector('tr[data-row="7"]'));
    if (!doc.querySelector('[data-p2="full"]').querySelector('.p1-w.is-on')) throw new Error('full adder not live');
  });

  check('Project 2 Add16 位格', () => {
    const a16 = doc.querySelector('[data-p2="add16"]');
    const before = a16.querySelector('.b16-row:last-child .b16-hex').textContent;
    click(a16.querySelector('.b16-cell.is-edit[data-k="addA"][data-bit="0"]'));
    const after = doc.querySelector('[data-p2="add16"] .b16-row:last-child .b16-hex').textContent;
    if (before === after) throw new Error('add16 out unchanged');
  });

  /* ---------- ALU ---------- */
  await go('#/alu');
  check('ALU 页结构', () => {
    if (!doc.querySelector('[data-alu-fig] svg')) throw new Error('no alu figure');
    if (!doc.querySelector('.alu-panel')) throw new Error('no alu panel');
    if ($$('.alu-panel tr[data-func]').length !== 18) throw new Error('18 functions');
    if ($$('.alu-panel [data-ctl]').length !== 6) throw new Error('6 control bits');
  });

  check('ALU 交互', () => {
    const rows = $$('.alu-panel tr[data-func]');
    click(rows[16]);
    const sel = doc.querySelector('.alu-panel tr.is-sel');
    if (!sel) throw new Error('row not selected');
    const ctl = $$('.alu-panel [data-ctl]')[0];
    click(ctl);
    if (!doc.querySelector('.alu-panel .alu-out-val')) throw new Error('panel lost');
  });

  check('ALU HDL 合法', () => {
    const code = doc.querySelector('.hdl-code');
    if (!code) throw new Error('no hdl code');
  });

  await go('#/clock');
  check('时序页结构', () => {
    const figs = doc.querySelectorAll('[data-fig]').length;
    if (figs !== 5) throw new Error('figures: ' + figs);
    if (!doc.querySelector('.clk-widget[data-w="reg"]')) throw new Error('no register widget');
    if (!doc.querySelector('.clk-widget[data-w="pc"]')) throw new Error('no pc widget');
  });

  check('Register 交互', () => {
    const reg = () => doc.querySelector('.clk-widget[data-w="reg"]');
    click(reg().querySelector('.b16-cell.is-edit[data-bit="0"]'));
    click(reg().querySelector('[data-toggle="regLoad"]'));
    click(reg().querySelector('#reg-tick'));
    const rows = reg().querySelectorAll('.b16-row');
    const out = rows[rows.length - 1].querySelector('.b16-hex').textContent;
    if (out !== '0x0001') throw new Error('reg out=' + out);
  });

  check('PC 优先级', () => {
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
  await go('#/ram');
  check('RAM 页结构', () => {
    if (!doc.querySelector('[data-fig="ram"] svg')) throw new Error('no ram figure');
    const hdlCount = doc.querySelectorAll('.hdl-block').length;
    if (hdlCount !== 5) throw new Error('ram hdl blocks: ' + hdlCount);
    if ($('.layer-table tbody tr').length < 9) throw new Error('ram tables');
  });

  check('RAM 演示', () => {
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

  await go('#/logic');
  check('门参考', () => {
    if ($('.ref-col.ref-name').length < 6) throw new Error('gate cards: ' + $('.ref-col.ref-name').length);
    if ($('.ref-sym svg').length < 6) throw new Error('gate symbols: ' + $('.ref-sym svg').length);
  });

  await go('#/machine');
  check('Hack 计算机页', () => {
    const figs = doc.querySelectorAll('[data-fig]');
    if (figs.length !== 6) throw new Error('figures: ' + figs.length);
    const blocks = doc.querySelectorAll('.clock-block').length;
    if (blocks !== 11) throw new Error('blocks: ' + blocks);
    const tables = doc.querySelectorAll('.layer-table').length;
    if (tables < 6) throw new Error('spec tables: ' + tables);
  });

  await go('#/ml');
  check('机器语言页', () => {
    const word = doc.querySelector('.ml-word code');
    if (!word || word.textContent.length !== 16) throw new Error('builder word: ' + (word && word.textContent));
    const bits = doc.querySelectorAll('.ml-bit').length;
    if (bits < 32) throw new Error('bit layout cells: ' + bits);
    const rows = doc.querySelectorAll('.layer-table tbody tr').length;
    if (rows < 20) throw new Error('ml tables: ' + rows);
    if (doc.querySelector('[data-ml-asm]')) throw new Error('translator should be removed');
  });

  check('机器语言交互', () => {
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

  await go('#/screen');
  check('输出页', () => {
    if (!doc.querySelector('.scr-grid')) throw new Error('no screen grid');
    const cells = doc.querySelectorAll('.scr-cell').length;
    if (cells !== 32 * 16) throw new Error('cells: ' + cells);
    const before = doc.querySelectorAll('.scr-words tbody tr').length;
    click(doc.querySelector('.scr-cell[data-r="0"][data-c="0"]'));
    const after = doc.querySelectorAll('.scr-words tbody tr').length;
    if (after !== before + 1) throw new Error('word table not updated');
  });

  await go('#/input');
  check('输入页', () => {
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

  await go('#/computer');
  check('整机页', () => {
    const figs = doc.querySelectorAll('[data-fig]').length;
    if (figs < 2) throw new Error('figures: ' + figs);
    const hdls = doc.querySelectorAll('.hdl-block').length;
    if (hdls < 2) throw new Error('hdl blocks: ' + hdls);
  });

  await go('#/asm');
  check('汇编器页', () => {
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

  await go('#/cpu');
  check('CPU 页', () => {
    const blocks = doc.querySelectorAll('.cpu-block').length;
    if (blocks !== 7) throw new Error('cpu blocks: ' + blocks);
    if (!doc.querySelector('.cpu-section .p1-svg')) throw new Error('no computer figure');
    if (!doc.querySelector('.dec-panel')) throw new Error('no decode panel');
  });

  await go('#/giants');
  check('公开课页', () => {
    if ($$('.giant-card').length < 1) throw new Error('no giant cards');
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
