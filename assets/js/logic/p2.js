window.CS = window.CS || {};
CS.P2UI = (function () {
  'use strict';

  var on = '#7aa2f7', off = 'rgba(160,170,190,0.42)';
  var col = function (v) { return v ? on : off; };

  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
  }
  function W(d, v, cls) {
    return '<path class="p1-w' + (v ? ' is-on' : '') + (cls ? ' ' + cls : '') + '" d="' + d + '"/>';
  }
  function tag(name, v, x, y, anchor) {
    var a = anchor || 'end';
    var w = (name.length + 1.6) * 6.4;
    var rx = a === 'end' ? x - w : (a === 'middle' ? x - w / 2 : x);
    return '<rect class="p1-pinbg" x="' + rx + '" y="' + (y - 9) + '" width="' + w + '" height="13" rx="3"/>' +
      '<text class="p1-pin" x="' + x + '" y="' + y + '" text-anchor="' + a + '">' +
      name + ' <tspan class="p1-pinv' + (v ? ' on' : '') + '">' + v + '</tspan></text>';
  }

  function gate(type, x, y, w, h) {
    var sc = Math.min(w / 49, h / 30);
    var ox = x + (w - 49 * sc) / 2;
    var oy = y + (h - 30 * sc) / 2;
    var inX = (type === 'not' ? 8 : (type === 'and' || type === 'nand' ? 6 : 4)) * sc;
    var y1 = (type === 'not' ? 15 : (type === 'and' || type === 'nand' ? 7 : 8)) * sc;
    var y2 = (type === 'not' ? 15 : (type === 'and' || type === 'nand' ? 23 : 22)) * sc;
    var outX = (type === 'nand' || type === 'nor' || type === 'not') ? 49 : (type === 'and' ? 39 : 40);
    return {
      svg: '<g transform="translate(' + ox + ' ' + oy + ') scale(' + sc + ')" class="p1-gate p1-gate-' + type + '">' +
        CS.Circuit.shape(type) + '</g>',
      in1: { x: ox + inX, y: oy + y1 },
      in2: { x: ox + inX, y: oy + y2 },
      out: { x: ox + outX * sc, y: oy + 15 * sc }
    };
  }

  function halfAdderSvg(env) {
    var xr = gate('xor', 150, 20, 90, 56);
    var an = gate('and', 150, 110, 90, 56);
    var s = '';
    s += xr.svg + an.svg;
    s += W('M40 ' + xr.in1.y + ' H' + xr.in1.x, env.a);
    s += W('M40 ' + xr.in2.y + ' H' + xr.in2.x, env.b);
    s += W('M40 ' + an.in1.y + ' H' + an.in1.x, env.a);
    s += W('M40 ' + an.in2.y + ' H' + an.in2.x, env.b);
    s += W('M' + xr.out.x + ' ' + xr.out.y + ' H290', env.sum);
    s += W('M' + an.out.x + ' ' + an.out.y + ' H290', env.carry);
    s += tag('a', env.a, 38, xr.in1.y + 4);
    s += tag('b', env.b, 38, xr.in2.y + 4);
    s += tag('sum', env.sum, xr.out.x + 10, xr.out.y + 4, 'start');
    s += tag('carry', env.carry, an.out.x + 10, an.out.y + 4, 'start');
    return svg(380, 190, s);
  }

  function fullAdderSvg(env) {
    var or = gate('or', 470, 150, 90, 50);
    var s = '';
    s += '<rect class="p1-gate-path" x="100" y="40" width="130" height="90" rx="8"/>';
    s += '<text class="p1-slice-t" x="165" y="78">HalfAdder</text>';
    s += '<text class="p1-slice-n" x="165" y="96">' + 'low bit' + '</text>';
    s += '<rect class="p1-gate-path" x="300" y="40" width="130" height="90" rx="8"/>';
    s += '<text class="p1-slice-t" x="365" y="78">HalfAdder</text>';
    s += '<text class="p1-slice-n" x="365" y="96">' + 'plus carry' + '</text>';
    s += or.svg;

    s += W('M30 70 H100', env.a);
    s += W('M30 100 H100', env.b);
    s += W('M230 70 H300', env.x1);
    s += W('M30 20 H280 V100 H300', env.c);
    s += W('M230 110 V205 H440 V' + or.in2.y + ' H' + or.in2.x, env.c1);
    s += W('M430 110 H455 V' + or.in1.y + ' H' + or.in1.x, env.c2);
    s += W('M430 70 H600', env.sum);
    s += W('M' + or.out.x + ' ' + or.out.y + ' H600', env.carry);

    s += tag('a', env.a, 28, 74);
    s += tag('b', env.b, 28, 104);
    s += tag('c', env.c, 28, 24);
    s += tag('ab', env.x1, 250, 64, 'start');
    s += tag('c1', env.c1, 238, 168, 'start');
    s += tag('c2', env.c2, 438, 168, 'start');
    s += tag('sum', env.sum, 446, 62, 'start');
    s += tag('carry', env.carry, or.out.x + 8, or.out.y - 8, 'start');
    return svg(640, 240, s);
  }

  function add16Svg() {
    var a = st.addA, b = st.addB, carry = 0;
    var rows = '';
    for (var i = 0; i < 16; i++) {
      var ai = (a >> i) & 1, bi = (b >> i) & 1, ci = carry;
      var total = ai + bi + ci;
      var sum = total & 1;
      carry = total >> 1;
      var y = 12 + i * 34;
      var head = 'a[' + i + ']=' + ai + '　b[' + i + ']=' + bi;
      if (i > 0) head += '　c' + i + '=' + ci;
      var name = i === 0 ? 'HA' : 'FA';
      rows += '<text class="p1-slice-k" x="4" y="' + (y + 20) + '">' + head + '</text>';
      rows += '<path class="p1-w' + (ai || bi || ci ? ' is-on' : '') + '" d="M150 ' + (y + 16) + ' H180"/>';
      rows += '<rect class="p1-gate-path" x="180" y="' + (y + 4) + '" width="56" height="24" rx="5"/>';
      rows += '<text class="p1-slice-t" x="208" y="' + (y + 20) + '">' + name + '</text>';
      rows += '<path class="p1-w' + (sum ? ' is-on' : '') + '" d="M236 ' + (y + 16) + ' H268"/>';
      rows += '<text class="p1-slice-k" x="274" y="' + (y + 20) + '">out[' + i + ']=' + sum + '</text>';
      rows += '<text class="p1-slice-n" x="360" y="' + (y + 20) + '">c' + (i + 1) + '=' + carry + '</text>';
    }
    return svg(460, 12 + 16 * 34 + 6, rows);
  }

  function inc16Svg() {
    var s = '';
    s += '<rect class="p1-gate-path" x="120" y="40" width="160" height="100" rx="8"/>';
    s += '<text class="p1-slice-t" x="200" y="86">Add16</text>';
    s += '<text class="p1-slice-n" x="200" y="104">b = 1</text>';
    s += '<path class="p1-w" d="M40 70 H120"/>';
    s += '<text class="p1-slice-k" x="4" y="74">in[16]</text>';
    s += '<path class="p1-w" d="M280 90 H380"/>';
    s += '<text class="p1-slice-k" x="386" y="94">out[16]</text>';
    return svg(470, 170, s);
  }

  function aluSvg() {
    var boxX = 150, boxY = 70, boxW = 180, boxH = 110;
    var cx = boxX + boxW / 2, cy = boxY + boxH / 2;
    var o = '';
    o += '<rect class="p1-gate-path" x="' + boxX + '" y="' + boxY + '" width="' + boxW + '" height="' + boxH + '" rx="10"/>';
    o += '<text class="p1-slice-t" x="' + cx + '" y="' + (cy - 4) + '">ALU</text>';
    o += '<text class="p1-slice-n" x="' + cx + '" y="' + (cy + 16) + '">six control bits</text>';

    o += '<path class="p1-w" d="M60 95 H' + boxX + '"/>';
    o += '<text class="p1-slice-k" x="4" y="89">x[16]</text>';
    o += '<path class="p1-w" d="M60 155 H' + boxX + '"/>';
    o += '<text class="p1-slice-k" x="4" y="149">y[16]</text>';

    var top = ['zx', 'nx', 'zy', 'ny'];
    top.forEach(function (k, i) {
      var x = boxX + 30 + i * 40;
      o += '<path class="p1-w" d="M' + x + ' 34 V' + boxY + '" stroke-dasharray="3 3"/>';
      o += '<text class="p1-slice-k" x="' + x + '" y="26" text-anchor="middle">' + k + '</text>';
    });
    var bottom = ['f', 'no'];
    bottom.forEach(function (k, i) {
      var x = boxX + 55 + i * 60;
      o += '<path class="p1-w" d="M' + x + ' ' + (boxY + boxH) + ' V216" stroke-dasharray="3 3"/>';
      o += '<text class="p1-slice-k" x="' + x + '" y="230" text-anchor="middle">' + k + '</text>';
    });

    o += '<path class="p1-w" d="M' + (boxX + boxW) + ' 100 H430"/>';
    o += '<text class="p1-slice-k" x="436" y="104">out[16]</text>';
    o += '<path class="p1-w" d="M' + (boxX + boxW) + ' 150 H430"/>';
    o += '<text class="p1-slice-k" x="436" y="154">zr / ng</text>';

    return svg(520, 245, o);
  }

  function adderTable(rows, sel) {
    var head = rows[0].env ? Object.keys(rows[0].env) : [];
    return '<table class="ref-tt"><thead><tr>' +
      head.map(function (k) { return '<th>' + k + '</th>'; }).join('') +
      '<th class="o">sum</th><th class="o">carry</th></tr></thead><tbody>' +
      rows.map(function (r, i) {
        return '<tr data-row="' + i + '" class="' + (i === sel ? 'is-sel ' : '') + '">' +
          head.map(function (k) { return '<td class="' + (r.env[k] ? 'v1' : 'v0') + '">' + r.env[k] + '</td>'; }).join('') +
          '<td class="o ' + (r.sum ? 'v1' : 'v0') + '">' + r.sum + '</td>' +
          '<td class="o ' + (r.carry ? 'v1' : 'v0') + '">' + r.carry + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  var HALF = [];
  for (var i = 0; i < 4; i++) {
    var e = { a: (i >> 1) & 1, b: i & 1 };
    HALF.push({ env: e, sum: e.a ^ e.b, carry: e.a & e.b });
  }
  var FULL = [];
  for (var j = 0; j < 8; j++) {
    var f = { a: (j >> 2) & 1, b: (j >> 1) & 1, c: j & 1 };
    var x1 = f.a ^ f.b;
    FULL.push({ env: f, x1: x1, sum: x1 ^ f.c, carry: (f.a & f.b) | (x1 & f.c) });
  }
  var st = { half: 3, full: 7, addA: 0x00FF, addB: 0x0001, inc: 0x00FF, aluX: 0x0005, aluY: 0x0003, aluC: 0x12 };

  function bitsRow2(key, val, editable, dataK) {
    var bits = '';
    for (var i = 15; i >= 0; i--) {
      var v = (val >> i) & 1;
      bits += '<span class="b16-cell' + (v ? ' on' : '') + (editable ? ' is-edit' : '') +
        '" data-k="' + dataK + '" data-bit="' + i + '">' + v + '</span>';
    }
    return '<div class="b16-row"><span class="b16-k">' + key + '</span>' +
      '<span class="b16-cells">' + bits + '</span>' +
      '<span class="b16-hex">' + hex4(val) + '</span></div>';
  }

  function hex4(v) { return '0x' + ('000' + (v & 0xFFFF).toString(16).toUpperCase()).slice(-4); }

  function addDemoRows() {
    var o = (st.addA + st.addB) & 0xFFFF;
    return bitsRow2('a', st.addA, true, 'addA') +
      bitsRow2('b', st.addB, true, 'addB') +
      bitsRow2('out', o, false, '');
  }
  function incDemoRows() {
    var o = (st.inc + 1) & 0xFFFF;
    return bitsRow2('in', st.inc, true, 'inc') + bitsRow2('out', o, false, '');
  }

  var ALU_FN = {
    0x2A: ['0', 0], 0x3F: ['1', '65535'], 0x3A: ['-1', '65535'],
    0x0C: ['D', 0], 0x30: ['A', 0], 0x0D: ['!D', 0], 0x31: ['!A', 0],
    0x0F: ['-D', 0], 0x33: ['-A', 0], 0x1F: ['D+1', 0], 0x37: ['A+1', 0],
    0x0E: ['D-1', 0], 0x32: ['A-1', 0], 0x02: ['D+A', 0], 0x13: ['D-A', 0],
    0x07: ['A-D', 0], 0x00: ['D&A', 0], 0x15: ['D|A', 0]
  };
  function aluCalc(x, y, c) {
    var zx = (c >> 5) & 1, nx = (c >> 4) & 1, zy = (c >> 3) & 1, ny = (c >> 2) & 1, f = (c >> 1) & 1, no = c & 1;
    x &= 0xFFFF; y &= 0xFFFF;
    if (zx) x = 0;
    if (nx) x = (~x) & 0xFFFF;
    if (zy) y = 0;
    if (ny) y = (~y) & 0xFFFF;
    var o = f ? (x + y) : (x & y);
    o &= 0xFFFF;
    if (no) o = (~o) & 0xFFFF;
    return o;
  }
  function block(o) {
    return '<div class="mux-block p1-block" data-p2="' + o.id + '">' +
      '<div class="mux-head"><h2>' + o.name + ' <span>' + o.sub + '</span></h2>' +
      '<p class="mux-eq">' + o.eq + '</p></div>' +
      '<div class="mux-grid p1-grid">' +
      '<div class="mux-col"><p class="aside-h">' + o.leftTitle + '</p><div data-slot="left"></div></div>' +
      '<div class="mux-col"><p class="aside-h">' + o.midTitle + '</p><div data-slot="mid"></div></div>' +
      '<div class="mux-col mux-about"><p class="aside-h">' + 'What it does' + '</p><div data-slot="about"></div></div>' +
      '</div>' +
      CS.hdlView(o.hdl) + '</div>';
  }

  function aluPanel() {
    return '<div class="alu-block">' +
      '<h2><span class="bits-num">00</span>What the ALU looks like</h2>' +
      '<div class="alu-figure" data-alu-fig></div>' +
      '</div>';
  }

  function mountAluPanel() {
    var fig = document.querySelector('[data-alu-fig]');
    if (!fig) return;
    fig.innerHTML = aluSvg();
  }

  function view() {
    return '<section class="page-head page-head-p2">' +
      '<div class="wrap-wide">' +
      '<p class="eyebrow">Project 2 · Arithmetic</p>' +
      '<h1>Adders: from half adder to ALU</h1>' +
      '<p class="page-head-lead">The gates from the previous page are enough; from here they are combined into things that compute: ' +
      'half adder → full adder → 16-bit adder → incrementer → ALU. The carry travels through all sixteen full adders, bit by bit.</p>' +
      '</div></section>' +
      CS.lineNav('p2', 'wrap-wide') +
      '<section class="mux-section"><div class="wrap-wide">' +

      block({ id: 'half', name: 'HalfAdder', sub: 'half adder', leftTitle: 'Truth table', midTitle: 'Structure',
        eq: 'sum = a ⊕ b，carry = a ∧ b', hdl: 'halfAdder',
        about: '<p class="p1-how">' + 'Adding two 1-bit numbers: XOR gives the sum bit, AND gives the carry.' + '</p>' +
          '<ul class="mux-points"><li><strong>' + 'No carry in' + '</strong>' + ': this is what the lowest bit uses.' + '</li>' +
          '<li><strong>' + 'Two gates' + '</strong>' + ': Xor and And.' + '</li></ul>' }) +

      block({ id: 'full', name: 'FullAdder', sub: 'full adder', leftTitle: 'Truth table', midTitle: 'Structure',
        eq: 'sum = a ⊕ b ⊕ c，carry = (a∧b) ∨ (c∧(a⊕b))', hdl: 'fullAdder',
        about: '<p class="p1-how">' + 'Adding three 1-bit values: a, b and the carry c from the bit below.' + '</p>' +
          '<ul class="mux-points"><li><strong>' + 'Carry in' + '</strong>' + ': that is what lets them chain.' + '</li>' +
          '<li><strong>' + 'Five gates' + '</strong>' + ': two Xor, two And, one Or.' + '</li></ul>' }) +

      block({ id: 'add16', name: 'Add16', sub: '16-bit adder', leftTitle: 'Demo', midTitle: 'Structure',
        eq: 'out = a + b (16 bits, overflow dropped)', hdl: 'add16',
        about: '<p class="p1-how">' + 'Sixteen full adders chained: bit i passes its carry to bit i+1.' + '</p>' +
          '<ul class="mux-points"><li><strong>' + 'Carry chain' + '</strong>' + ': the slowest path runs through sixteen gates.' + '</li>' +
          '<li><strong>' + 'Overflow' + '</strong>' + ': the carry out of the top bit is dropped.' + '</li></ul>' }) +

      block({ id: 'inc16', name: 'Inc16', sub: 'incrementer', leftTitle: 'Demo', midTitle: 'Structure',
        eq: 'out = in + 1', hdl: 'inc16',
        about: '<p class="p1-how">' + 'Simply Add16 with b = 1.' + '</p>' +
          '<ul class="mux-points"><li><strong>' + 'Used by PC' + '</strong>' + ': it adds one after each fetch.' + '</li>' +
          '<li><strong>' + 'Top-bit overflow' + '</strong>' + ': 0xFFFF + 1 = 0x0000.' + '</li></ul>' }) +

      '<div class="clock-block" style="margin-top:40px">' +
      '<h2>Coda: why an adder can subtract</h2>' +
      '<div class="intro-callout">' +
      '<b>The clock-face idea:</b> imagine a 12-hour dial reading 3 o’clock, and you want to go back two hours to 1. There are two ways:<br>' +
      '① <b>turn back two hours</b> (borrow subtraction: 3 − 2 = 1);<br>' +
      '② <b>turn forward ten hours</b> (modular addition: 3 + 10 = 13 ≡ 1 mod 12).<br>' +
      '<b>Hardware hates borrowing and loves overflow.</b> Set the dial to 65536 (the top-bit carry is dropped automatically) and subtracting X becomes adding <code>65536 − X</code>.' +
      '</div>' +
      '<p>' + 'In binary, <code>65536 − X = (65535 − X) + 1</code>. Since 65535 is all ones (<code>0xFFFF</code>), subtracting X from it is exactly <b>inverting every bit (~X)</b>.' + '</p>' +
      '<p class="intro-quote">Negation = invert every bit, then add 1. That is two’s complement — it removes the need for a whole subtractor and lets the same Add16 handle both addition and subtraction.</p>' +
      '<p>In the ALU, subtraction needs only three control bits: <code>nx=1</code> (invert x), <code>f=1</code> (add), <code>no=1</code> (invert the output) — ' +
      'the <a href="#/alu">ALU page</a> has the full derivation.</p>' +
      '</div>' +

      '</div></section>';
  }

  function paint(card) {
    var id = card.dataset.p2;
    var left = card.querySelector('[data-slot="left"]');
    var mid = card.querySelector('[data-slot="mid"]');
    if (id === 'half') {
      left.innerHTML = adderTable(HALF, st.half);
      var h = HALF[st.half];
      mid.innerHTML = halfAdderSvg({ a: h.env.a, b: h.env.b, sum: h.sum, carry: h.carry });
    } else if (id === 'full') {
      left.innerHTML = adderTable(FULL, st.full);
      var f = FULL[st.full];
      mid.innerHTML = fullAdderSvg({ a: f.env.a, b: f.env.b, c: f.env.c, x1: f.x1, sum: f.sum, carry: f.carry, c1: f.env.a & f.env.b, c2: f.x1 & f.env.c });
    } else if (id === 'add16') {
      left.innerHTML = addDemoRows();
      mid.innerHTML = add16Svg();
    } else if (id === 'inc16') {
      left.innerHTML = incDemoRows();
      mid.innerHTML = inc16Svg();
    }
  }

  function mount() {
    var cards = document.querySelectorAll('[data-p2]');
    if (!cards.length) return;
    cards.forEach(function (card) {
      paint(card);
      card.addEventListener('click', function (e) {
        var cell = e.target.closest ? e.target.closest('.b16-cell.is-edit') : null;
        if (cell) {
          var bit = parseInt(cell.dataset.bit, 10);
          st[cell.dataset.k] = (st[cell.dataset.k] ^ (1 << bit)) & 0xFFFF;
          paint(card);
          return;
        }
        var tr = e.target.closest ? e.target.closest('tr[data-row]') : null;
        if (tr) {
          if (card.dataset.p2 === 'half') st.half = parseInt(tr.dataset.row, 10);
          if (card.dataset.p2 === 'full') st.full = parseInt(tr.dataset.row, 10);
          paint(card);
        }
      });
      card.addEventListener('input', function (e) {
        var inp = e.target;
        if (!inp.classList || !inp.classList.contains('p2-hex')) return;
        var v = parseInt(inp.value, 16);
        if (isNaN(v)) return;
        st[inp.dataset.k] = v & 0xFFFF;
        paint(card);
      });
    });
  }

  return { view: view, mount: mount, aluPanel: aluPanel, mountAluPanel: mountAluPanel };
})();
