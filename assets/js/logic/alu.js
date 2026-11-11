window.CS = window.CS || {};
CS.AluUI = (function () {
  'use strict';

  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var state = { x: 2, y: 3, zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0, orBits: 0b00100100 };

  function hex4(n) {
    var s = (n & 0xffff).toString(16).toUpperCase();
    while (s.length < 4) s = '0' + s;
    return '0x' + s;
  }
  function bin16(n) {
    var s = '';
    for (var i = 15; i >= 0; i--) {
      s += (n >> i) & 1;
      if (i % 4 === 0 && i !== 0) s += ' ';
    }
    return s;
  }
  function signed16(n) { return n > 0x7fff ? n - 0x10000 : n; }
  function parseHex(s) {
    var t = String(s || '').trim().replace(/^0x/i, '').replace(/\s+/g, '');
    if (!/^[0-9a-fA-F]{1,4}$/.test(t)) return null;
    return parseInt(t, 16);
  }

  function compute(st) {
    var x = st.x & 0xffff, y = st.y & 0xffff;
    var x1 = st.zx ? 0 : x;
    var x2 = st.nx ? (~x1) & 0xffff : x1;
    var y1 = st.zy ? 0 : y;
    var y2 = st.ny ? (~y1) & 0xffff : y1;
    var o = st.f ? (x2 + y2) & 0xffff : (x2 & y2);
    var out = st.no ? (~o) & 0xffff : o;
    return { out: out, zr: out === 0 ? 1 : 0, ng: (out >> 15) & 1 };
  }

  var FUNCS = [
    { name: '0', c: [1, 0, 1, 0, 1, 0] },
    { name: '1', c: [1, 1, 1, 1, 1, 1] },
    { name: '-1', c: [1, 1, 1, 0, 1, 0] },
    { name: 'x', c: [0, 0, 1, 1, 0, 0] },
    { name: 'y', c: [1, 1, 0, 0, 0, 0] },
    { name: '!x', c: [0, 0, 1, 1, 0, 1] },
    { name: '!y', c: [1, 1, 0, 0, 0, 1] },
    { name: '-x', c: [0, 0, 1, 1, 1, 1] },
    { name: '-y', c: [1, 1, 0, 0, 1, 1] },
    { name: 'x+1', c: [0, 1, 1, 1, 1, 1] },
    { name: 'y+1', c: [1, 1, 0, 1, 1, 1] },
    { name: 'x-1', c: [0, 0, 1, 1, 1, 0] },
    { name: 'y-1', c: [1, 1, 0, 0, 1, 0] },
    { name: 'x+y', c: [0, 0, 0, 0, 1, 0] },
    { name: 'x-y', c: [0, 1, 0, 0, 1, 1] },
    { name: 'y-x', c: [0, 0, 0, 1, 1, 1] },
    { name: 'x&y', c: [0, 0, 0, 0, 0, 0] },
    { name: 'x|y', c: [0, 1, 0, 1, 0, 1] }
  ];
  var CTL = ['zx', 'nx', 'zy', 'ny', 'f', 'no'];

  function applyFunc(f) {
    CTL.forEach(function (k, i) { state[k] = f.c[i]; });
  }
  function currentFuncIndex() {
    for (var i = 0; i < FUNCS.length; i++) {
      if (FUNCS[i].c.every(function (v, k) { return v === state[CTL[k]]; })) return i;
    }
    return -1;
  }

  function or8Widget() {
    var bits = '';
    for (var i = 7; i >= 0; i--) {
      var on = (state.orBits >> i) & 1;
      bits += '<button type="button" class="bit' + (on ? ' is-on' : '') + '" data-orbit="' + i + '">' + on + '</button>';
    }
    var any = state.orBits ? 1 : 0;
    return '<div class="or8-widget">' +
      '<div class="bitrow or8-row">' + bits + '</div>' +
      '<p class="or8-out mono">Or8Way(...) = ' + any + '　' + (any ? '(at least one bit is 1)' : '(all eight bits are 0)') + '</p>' +
      '</div>';
  }

  function aluPanel() {
    var r = compute(state);
    var fi = currentFuncIndex();
    var ctlBtns = CTL.map(function (k) {
      return '<button type="button" class="ctl-btn' + (state[k] ? ' is-on' : '') + '" data-ctl="' + k + '">' +
        '<span class="ctl-name">' + k + '</span><span class="ctl-val">' + state[k] + '</span></button>';
    }).join('');

    var rows = FUNCS.map(function (f, i) {
      var st = { x: state.x, y: state.y };
      CTL.forEach(function (k, j) { st[k] = f.c[j]; });
      var o = compute(st);
      return '<tr data-func="' + i + '" class="' + (i === fi ? 'is-sel' : '') + '">' +
        '<td class="mono alu-fname">' + h(f.name) + '</td>' +
        '<td class="mono alu-ctl">' + f.c.join('') + '</td>' +
        '<td class="mono alu-res">' + (o.out === 0 ? '0' : signed16(o.out)) + '</td>' +
        '<td class="mono alu-hex">' + hex4(o.out) + '</td>' +
        '<td class="mono alu-flags">' + (o.zr ? 'zr ' : '') + (o.ng ? 'ng' : '') + '</td>' +
        '</tr>';
    }).join('');

    return '<div class="alu-panel">' +
      '<div class="g16-inputs">' +
      '<label class="g16-field"><span>x</span><input id="alu-x" class="hex-input" value="' + hex4(state.x) + '" spellcheck="false" aria-label="x"></label>' +
      '<label class="g16-field"><span>y</span><input id="alu-y" class="hex-input" value="' + hex4(state.y) + '" spellcheck="false" aria-label="y"></label>' +
      '<div class="alu-ctl-group"><span class="g16-label">' + 'Control bits' + '</span><div class="ctl-row">' + ctlBtns + '</div></div>' +
      '</div>' +
      '<div class="alu-result">' +
      '<div class="alu-out"><span class="alu-out-label">out</span><span class="alu-out-val mono">' + hex4(r.out) + '</span>' +
      '<span class="alu-out-signed mono">' + signed16(r.out) + '</span></div>' +
      '<div class="alu-flags-row">' +
      '<span class="alu-flag' + (r.zr ? ' is-on' : '') + '">zr ' + r.zr + '</span>' +
      '<span class="alu-flag' + (r.ng ? ' is-on' : '') + '">ng ' + r.ng + '</span>' +
      '</div>' +
      '<p class="alu-bits mono">' + bin16(r.out) + '</p>' +
      '</div>' +
      '<table class="alu-table"><thead><tr><th>' + 'Function' + '</th><th>zx nx zy ny f no</th><th>' + 'Result' + '</th><th>' + 'Hex' + '</th><th>' + 'Flags' + '</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="alu-hint">' + 'Click any row and the control bits set themselves — the 18 functions are 18 combinations of six switches.' + '</p>' +
      '</div>';
  }

  function view() {
    return '<section class="page-head page-head-alu">' +
      '<div class="wrap">' +
      '<p class="eyebrow">The ALU</p>' +
      '<h1>' + 'Arithmetic logic unit' + '</h1>' +
      '<p class="page-head-lead">' + 'The ALU is not a new part: it is <b>an adder and a bitwise AND placed side by side</b>, with a few control bits choosing which one runs. ' + '' +
      '' + 'It has two 16-bit inputs, one 16-bit output, six 1-bit controls and two flags.' + '</p>' +
      '</div></section>' +
      CS.lineNav('alu', 'wrap') +

      '<section class="alu-section"><div class="wrap">' +

      CS.P2UI.aluPanel() +

      '<div class="alu-block">' +
      '<h2><span class="bits-num">01</span>' + 'The six control bits' + '</h2>' +
      '<table class="layer-table ctl-table">' +
      '<thead><tr><th>' + 'Bit' + '</th><th>' + 'Controls' + '</th><th>' + 'When 1' + '</th></tr></thead><tbody>' +
      '<tr><td class="mono">zx</td><td>x</td><td>' + 'zero x' + '</td></tr>' +
      '<tr><td class="mono">nx</td><td>x</td><td>' + 'invert x (after zx)' + '</td></tr>' +
      '<tr><td class="mono">zy</td><td>y</td><td>' + 'zero y' + '</td></tr>' +
      '<tr><td class="mono">ny</td><td>y</td><td>' + 'invert y (after zy)' + '</td></tr>' +
      '<tr><td class="mono">f</td><td>' + 'operation' + '</td><td>' + '1 = add, 0 = bitwise AND' + '</td></tr>' +
      '<tr><td class="mono">no</td><td>' + 'output' + '</td><td>' + 'invert the result' + '</td></tr>' +
      '</tbody></table>' +
      '<p><b>' + 'The order matters' + '</b>' + ': zero first, then invert, so <code>zx=1, nx=1</code> gives all ones (−1), not 0.' + '</p>' +
      '<div class="intro-callout">' +
      '<b>' + 'The elegant bit: how does the ALU subtract <code>x − y</code>?' + '</b><br>' +
      '' + 'By two’s complement, inversion is <code>~A = −A − 1</code>. Set <code>nx=1</code> (invert x), <code>f=1</code> (add) and <code>no=1</code> (invert the output):<br>' +
      '· add inside: <code>~x + y = (−x − 1) + y = (y − x) − 1</code>;<br>' +
      '· invert the output: <code>~((y − x) − 1) = −((y − x) − 1) − 1 = x − y</code>!<br>' +
      '<b>' + 'No dedicated subtract line is needed' + '</b>' + ': invert, add, invert again — subtraction falls out of parts that were already there.' +
      '</div>' +
      '<p>' + 'All six bits are 1 bit wide — <b>narrow control, wide data</b>. They carry no information; they only decide.' + '</p>' +
      '</div>' +

      '<div class="alu-block">' +
      '<h2><span class="bits-num">02</span>' + 'The two flags' + '</h2>' +
      '<p><b>zr</b>' + ' (zero): 1 when the output is all zeros. The CPU uses it for “the values are equal”.' + '</p>' +
      '<p><b>ng</b>' + ' (negative): the top bit of the output, that is the sign bit. The CPU uses it for “less than zero”.' + '</p>' +
      '<p class="bits-tip">' + 'Note that ng is just <code>out[15]</code>, no extra logic; zr must look at all 16 bits — which is why reduction gates exist.' + '</p>' +
      '</div>' +

      '<div class="alu-block">' +
      '<h2><span class="bits-num">03</span>' + 'Eighteen functions, eighteen switch combinations' + '</h2>' +
      aluPanel() +
      CS.hdlView('alu') +
      '</div>' +
      '</div></section>';
  }

  function paintPanel() {
    var p = document.querySelector('.alu-panel');
    if (p) p.outerHTML = aluPanel();
  }
  function mount() {
    var root = document.querySelector('.alu-section');
    if (!root) return;
    if (CS.P2UI && CS.P2UI.mountAluPanel) CS.P2UI.mountAluPanel();
    paintPanel();

    root.addEventListener('click', function (e) {
      var ctl = e.target.closest('[data-ctl]');
      if (ctl) {
        var k = ctl.dataset.ctl;
        state[k] = state[k] ? 0 : 1;
        paintPanel();
        return;
      }
      var tr = e.target.closest('tr[data-func]');
      if (tr) {
        applyFunc(FUNCS[parseInt(tr.dataset.func, 10)]);
        paintPanel();
      }
    });

    root.addEventListener('input', function (e) {
      if (e.target.id !== 'alu-x' && e.target.id !== 'alu-y') return;
      var v = parseHex(e.target.value);
      if (v === null) { e.target.classList.add('is-bad'); return; }
      e.target.classList.remove('is-bad');
      if (e.target.id === 'alu-x') state.x = v; else state.y = v;
      var r = compute(state);
      var box = document.querySelector('.alu-result');
      if (box) {
        box.querySelector('.alu-out-val').textContent = hex4(r.out);
        box.querySelector('.alu-out-signed').textContent = signed16(r.out);
        box.querySelector('.alu-bits').textContent = bin16(r.out);
        var flags = box.querySelectorAll('.alu-flag');
        if (flags[0]) { flags[0].textContent = 'zr ' + r.zr; flags[0].classList.toggle('is-on', !!r.zr); }
        if (flags[1]) { flags[1].textContent = 'ng ' + r.ng; flags[1].classList.toggle('is-on', !!r.ng); }
      }
      var fi = currentFuncIndex();
      document.querySelectorAll('tr[data-func]').forEach(function (row) {
        row.classList.toggle('is-sel', parseInt(row.dataset.func, 10) === fi);
      });
      document.querySelectorAll('tr[data-func]').forEach(function (row) {
        var i = parseInt(row.dataset.func, 10);
        var st = { x: state.x, y: state.y };
        CTL.forEach(function (k2, j) { st[k2] = FUNCS[i].c[j]; });
        var o = compute(st);
        row.children[2].textContent = o.out === 0 ? '0' : signed16(o.out);
        row.children[3].textContent = hex4(o.out);
        row.children[4].textContent = (o.zr ? 'zr ' : '') + (o.ng ? 'ng' : '');
      });
    });
  }

  return { view: view, mount: mount };
})();
