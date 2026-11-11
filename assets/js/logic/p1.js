window.CS = window.CS || {};
CS.P1UI = (function () {
  'use strict';

  var on = '#7aa2f7', off = 'rgba(160,170,190,0.42)';
  var col = function (v) { return v ? on : off; };

  function L(x, y, t) { return '<text class="p1-l" x="' + x + '" y="' + y + '">' + t + '</text>'; }
  function V(x, y, v) { return '<text class="p1-v' + (v ? ' on' : '') + '" x="' + x + '" y="' + y + '">' + v + '</text>'; }
  function W(d, v, cls) {
    return '<path class="p1-w' + (v ? ' is-on' : '') + (cls ? ' ' + cls : '') + '" d="' + d + '"/>';
  }
  function ND(x, y, w, h, name, v) {
    return '<rect class="p1-node' + (v ? ' is-on' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7"/>' +
      '<text class="p1-node-t" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '">' + name + '</text>';
  }
  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
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

  function tag(name, v, x, y, anchor) {
    var a = anchor || 'end';
    var w = (name.length + 1.6) * 6.4;
    var rx = a === 'end' ? x - w : (a === 'middle' ? x - w / 2 : x);
    return '<rect class="p1-pinbg" x="' + rx + '" y="' + (y - 9) + '" width="' + w + '" height="13" rx="3"/>' +
      '<text class="p1-pin" x="' + x + '" y="' + y + '" text-anchor="' + a + '">' +
      name + ' <tspan class="p1-pinv' + (v ? ' on' : '') + '">' + v + '</tspan></text>';
  }

  function notSvg(env) {
    var a = env.a, f = 1 - a;
    var g = gate('nand', 130, 20, 120, 90);
    var cy = (g.in1.y + g.in2.y) / 2;
    var s = '';
    s += W('M46 ' + cy + ' H100', a);
    s += W('M100 ' + g.in1.y + ' V' + g.in2.y, a);
    s += W('M100 ' + g.in1.y + ' H' + g.in1.x, a);
    s += W('M100 ' + g.in2.y + ' H' + g.in2.x, a);
    s += g.svg;
    s += W('M' + g.out.x + ' ' + g.out.y + ' H270', f);
    s += tag('in', a, 44, cy + 4);
    s += tag('out', f, g.out.x + 10, g.out.y + 4, 'start');
    return svg(330, 130, s);
  }

  function andSvg(env) {
    var a = env.a, b = env.b;
    var n1 = 1 - (a & b), f = 1 - n1;
    var g1 = gate('nand', 70, 10, 110, 90);
    var g2 = gate('not', 220, 20, 84, 72);
    var s = '';
    s += W('M50 ' + g1.in1.y + ' H' + g1.in1.x, a);
    s += W('M50 ' + g1.in2.y + ' H' + g1.in2.x, b);
    s += g1.svg + g2.svg;
    s += W('M' + g1.out.x + ' ' + g1.out.y + ' H' + g2.in1.x, n1);
    s += W('M' + g2.out.x + ' ' + g2.out.y + ' H340', f);
    s += tag('a', a, 48, g1.in1.y + 4);
    s += tag('b', b, 48, g1.in2.y + 4);
    s += tag('n', n1, g1.out.x + 10, g1.out.y + 4, 'start');
    s += tag('out', f, g2.out.x + 10, g2.out.y + 4, 'start');
    return svg(390, 140, s);
  }

  function orSvg(env) {
    var a = env.a, b = env.b;
    var na = 1 - a, nb = 1 - b, f = 1 - (na & nb);
    var g1 = gate('not', 56, 10, 76, 56);
    var g2 = gate('not', 56, 96, 76, 56);
    var g3 = gate('nand', 220, 36, 110, 90);
    var s = '';
    s += W('M40 ' + g1.in1.y + ' H' + g1.in1.x, a);
    s += W('M40 ' + g2.in1.y + ' H' + g2.in1.x, b);
    s += g1.svg + g2.svg + g3.svg;
    s += W('M' + g1.out.x + ' ' + g1.out.y + ' H180 V' + g3.in1.y + ' H' + g3.in1.x, na);
    s += W('M' + g2.out.x + ' ' + g2.out.y + ' H180 V' + g3.in2.y + ' H' + g3.in2.x, nb);
    s += W('M' + g3.out.x + ' ' + g3.out.y + ' H366', f);
    s += tag('a', a, 38, g1.in1.y + 4) + tag('b', b, 38, g2.in1.y + 4);
    s += tag('na', na, g1.out.x + 12, g1.out.y + 4, 'start');
    s += tag('nb', nb, g2.out.x + 12, g2.out.y + 4, 'start');
    s += tag('out', f, g3.out.x + 10, g3.out.y + 4, 'start');
    return svg(410, 170, s);
  }

  function xorSvg(env) {
    var a = env.a, b = env.b;
    var n1 = 1 - (a & b), n2 = 1 - (a & n1), n3 = 1 - (b & n1), f = 1 - (n2 & n3);
    var g1 = gate('nand', 60, 80, 100, 70);
    var g2 = gate('nand', 230, 0, 100, 70);
    var g3 = gate('nand', 230, 160, 100, 70);
    var g4 = gate('nand', 400, 80, 100, 70);
    var ay = 80, by = 150, xa = 52, xb = 52, xm = 200;
    var s = '';
    s += g1.svg + g2.svg + g3.svg + g4.svg;
    s += W('M46 ' + ay + ' H' + xa, a);
    s += W('M' + xa + ' ' + g2.in1.y + ' V' + g1.in1.y, a);
    s += W('M' + xa + ' ' + g2.in1.y + ' H' + g2.in1.x, a);
    s += W('M' + xa + ' ' + g1.in1.y + ' H' + g1.in1.x, a);
    s += W('M46 ' + by + ' H' + xb, b);
    s += W('M' + xb + ' ' + g1.in2.y + ' V' + g3.in2.y, b);
    s += W('M' + xb + ' ' + g3.in2.y + ' H' + g3.in2.x, b);
    s += W('M' + xb + ' ' + g1.in2.y + ' H' + g1.in2.x, b);
    s += W('M' + g1.out.x + ' ' + g1.out.y + ' H' + xm, n1);
    s += W('M' + xm + ' ' + g2.in2.y + ' V' + g3.in1.y, n1);
    s += W('M' + xm + ' ' + g2.in2.y + ' H' + g2.in2.x, n1);
    s += W('M' + xm + ' ' + g3.in1.y + ' H' + g3.in1.x, n1);
    // n2 / n3 → N4
    s += W('M' + g2.out.x + ' ' + g2.out.y + ' H' + (g4.in1.x - 16) + ' V' + g4.in1.y + ' H' + g4.in1.x, n2);
    s += W('M' + g3.out.x + ' ' + g3.out.y + ' H' + (g4.in1.x - 16) + ' V' + g4.in2.y + ' H' + g4.in2.x, n3);
    s += W('M' + g4.out.x + ' ' + g4.out.y + ' H545', f);
    s += tag('a', a, 44, ay + 4) + tag('b', b, 44, by + 4);
    s += tag('n1', n1, 172, g1.out.y + 4, 'start');
    s += tag('n2', n2, g2.out.x + 8, g2.out.y + 4, 'start');
    s += tag('n3', n3, g3.out.x + 8, g3.out.y + 4, 'start');
    s += tag('out', f, g4.out.x + 10, g4.out.y + 4, 'start');
    return svg(560, 240, s);
  }

  function pageBg() {
    try {
      var c = getComputedStyle(document.body).backgroundColor;
      return c && c !== 'rgba(0, 0, 0, 0)' ? c : '#0d1017';
    } catch (e) { return '#0d1017'; }
  }

  function inlineClone(svg) {
    var clone = svg.cloneNode(true);
    var src = svg.querySelectorAll('*');
    var dst = clone.querySelectorAll('*');
    for (var i = 0; i < src.length; i++) {
      var cs = getComputedStyle(src[i]);
      var el = dst[i];
      el.removeAttribute('class');
      el.setAttribute('style',
        'fill:' + cs.fill + ';stroke:' + cs.stroke + ';stroke-width:' + cs.strokeWidth +
        ';opacity:' + cs.opacity + ';font-family:' + cs.fontFamily + ';font-size:' + cs.fontSize +
        ';font-weight:' + cs.fontWeight + ';text-anchor:' + cs.textAnchor +
        ';stroke-linecap:' + cs.strokeLinecap + ';stroke-linejoin:' + cs.strokeLinejoin);
    }
    var vb = (svg.getAttribute('viewBox') || '0 0 400 200').split(/\s+/);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', vb[2]);
    clone.setAttribute('height', vb[3]);
    var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
    bg.setAttribute('width', vb[2]); bg.setAttribute('height', vb[3]);
    bg.setAttribute('style', 'fill:' + pageBg() + ';stroke:none');
    clone.insertBefore(bg, clone.firstChild);
    return clone.outerHTML;
  }

  function exportSvg() {
    var out = {};
    document.querySelectorAll('.p1-block').forEach(function (card) {
      var svg = card.querySelector('.p1-svg');
      if (svg) out[card.dataset.gate] = inlineClone(svg);
    });
    return out;
  }

  var G16 = [
    {
      id: 'not16', name: 'Not16', expr: 'out[i] = ¬in[i]', hdl: 'not16', type: 'not',
      ins: ['in'], nands: 16,
      note: '' + '16 Not gates side by side; each bit inverts on its own — no carry, no shared state.' + '',
      st: { a: 0x0F0F, b: 0x00FF, sel: 0 }
    },
    {
      id: 'and16', name: 'And16', expr: 'out[i] = a[i] ∧ b[i]', hdl: 'and16', type: 'and',
      ins: ['a', 'b'], nands: 32,
      note: '' + '16 And gates side by side. Bit i looks only at a[i] and b[i]; no other bit affects it.' + '',
      st: { a: 0x0F0F, b: 0x00FF, sel: 0 }
    },
    {
      id: 'or16', name: 'Or16', expr: 'out[i] = a[i] ∨ b[i]', hdl: 'or16', type: 'or',
      ins: ['a', 'b'], nands: 48,
      note: '' + '16 Or gates side by side. Only the gate differs from And16.' + '',
      st: { a: 0x0F0F, b: 0x00FF, sel: 0 }
    },
    {
      id: 'mux16', name: 'Mux16', expr: 'out[i] = sel ? b[i] : a[i]', hdl: 'mux16', type: 'mux',
      ins: ['a', 'b', 'sel'], nands: 48,
      note: '' + '16 Muxes side by side with a single sel — it decides the way for all 16 bits at once.' + '',
      st: { a: 0x0F0F, b: 0x00FF, sel: 1 }
    }
  ];

  function calc16(g) {
    var a = g.st.a & 0xFFFF, b = g.st.b & 0xFFFF, sel = g.st.sel ? 1 : 0;
    if (g.id === 'not16') return (~a) & 0xFFFF;
    if (g.id === 'and16') return a & b;
    if (g.id === 'or16') return a | b;
    return sel ? b : a;
  }

  function hex4(v) { return '0x' + ('000' + (v & 0xFFFF).toString(16).toUpperCase()).slice(-4); }

  function sliceSvg(g) {
    var two = g.ins.length > 1, three = g.ins.length > 2;
    var out = '';
    [40, 132].forEach(function (cy, k) {
      if (g.type === 'mux') {
        out += '<path class="p1-gate-path" d="M96 ' + (cy - 30) + ' H150 L176 ' + cy + ' L150 ' + (cy + 30) + ' H96 Z"/>';
        out += '<text class="p1-slice-t" x="132" y="' + (cy + 4) + '">MUX</text>';
        out += '<path class="p1-w" d="M56 ' + (cy - 16) + ' H96"/>';
        out += '<path class="p1-w" d="M56 ' + (cy + 16) + ' H96"/>';
        out += '<text class="p1-slice-k" x="4" y="' + (cy - 12) + '">a[' + k + ']</text>';
        out += '<text class="p1-slice-k" x="4" y="' + (cy + 20) + '">b[' + k + ']</text>';
        out += '<path class="p1-w" d="M132 ' + (cy + 30) + ' V' + (cy + 40) + ' H74" stroke-dasharray="3 3"/>';
        out += '<text class="p1-slice-k" x="4" y="' + (cy + 44) + '">sel</text>';
        out += '<path class="p1-w" d="M176 ' + cy + ' H240"/>';
      } else {
        var gg = gate(g.type, 108, cy - 22, 68, 44);
        out += gg.svg;
        if (two) {
          out += '<path class="p1-w" d="M56 ' + gg.in1.y + ' H' + gg.in1.x + '"/>';
          out += '<path class="p1-w" d="M56 ' + gg.in2.y + ' H' + gg.in2.x + '"/>';
          out += '<text class="p1-slice-k" x="4" y="' + (gg.in1.y + 4) + '">a[' + k + ']</text>';
          out += '<text class="p1-slice-k" x="4" y="' + (gg.in2.y + 4) + '">b[' + k + ']</text>';
        } else {
          out += '<path class="p1-w" d="M56 ' + gg.in1.y + ' H' + gg.in1.x + '"/>';
          out += '<text class="p1-slice-k" x="4" y="' + (gg.in1.y + 4) + '">in[' + k + ']</text>';
        }
        out += '<path class="p1-w" d="M' + gg.out.x + ' ' + gg.out.y + ' H240"/>';
      }
      out += '<text class="p1-slice-k" x="248" y="' + (cy + 4) + '">out[' + k + ']</text>';
    });
    out += '<text class="p1-slice-t" x="150" y="88">⋮</text>';
    out += '<text class="p1-slice-n" x="196" y="92">× 16</text>';
    return svg(320, 190, out);
  }

  function bitsRow(g, key, val, editable) {
    var bits = '';
    for (var i = 15; i >= 0; i--) {
      var v = (val >> i) & 1;
      bits += '<span class="b16-cell' + (v ? ' on' : '') + (editable ? ' is-edit' : '') +
        '" data-row="' + key + '" data-bit="' + i + '">' + v + '</span>';
    }
    return '<div class="b16-row"><span class="b16-k">' + key + '</span>' +
      '<span class="b16-cells">' + bits + '</span>' +
      '<span class="b16-hex">' + hex4(val) + '</span></div>';
  }

  function demoHtml(g) {
    var o = calc16(g);
    var h = '';
    if (g.id === 'not16') h += bitsRow(g, 'in', g.st.a, true);
    else { h += bitsRow(g, 'a', g.st.a, true); h += bitsRow(g, 'b', g.st.b, true); }
    h += '<div class="b16-row is-out"><span class="b16-k">out</span><span class="b16-cells">' +
      (function () { var b = ''; for (var i = 15; i >= 0; i--) { var v = (o >> i) & 1; b += '<span class="b16-cell' + (v ? ' on' : '') + '">' + v + '</span>'; } return b; })() +
      '</span><span class="b16-hex">' + hex4(o) + '</span></div>';
    if (g.type === 'mux') {
      h += '<button class="cyc-btn b16-sel" type="button" data-sel="' + g.id + '">sel = ' + g.st.sel + '' + '(click to toggle)' + '</button>';
    }
    return h;
  }

  var GWAY = [
    { id: 'mux4way16', name: 'Mux4Way16', kind: 'mux', n: 4, bits: 2, hdl: 'mux4way16', sel: 0,
      note: '' + 'Pick 1 of 4; sel has 2 bits. Built from two levels of Mux16: pair up first, then choose once more.' + '' },
    { id: 'mux8way16', name: 'Mux8Way16', kind: 'mux', n: 8, bits: 3, hdl: 'mux8way16', sel: 0,
      note: '' + 'Pick 1 of 8; sel has 3 bits. Three levels of Mux16: 4 → 2 → 1.' + '' },
    { id: 'dmux4way', name: 'DMux4Way', kind: 'demux', n: 4, bits: 2, hdl: 'dmux4way', sel: 0,
      note: '' + 'Send one input to one of four outputs; the rest are forced to 0 by AND gates.' + '' },
    { id: 'dmux8way', name: 'DMux8Way', kind: 'demux', n: 8, bits: 3, hdl: 'dmux8way', sel: 0,
      note: '' + 'Send one input to one of eight outputs; sel has 3 bits.' + '' },
    { id: 'or8way', name: 'Or8Way', kind: 'or', n: 8, bits: 0, hdl: 'or8way', sel: 0,
      note: '' + 'Eight inputs chained through Or: if any is 1, out is 1.' + '' }
  ];

  function wayNames(g) {
    if (g.kind === 'or') return ['in[0]', 'in[1]', 'in[2]', 'in[3]', 'in[4]', 'in[5]', 'in[6]', 'in[7]'];
    var L = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return L.slice(0, g.n);
  }

  function waySvg(g) {
    var n = g.n, rowH = 26, boxX = 150, boxW = 130, boxY = 26, boxH = n * rowH;
    var cy = boxY + boxH / 2;
    var names = wayNames(g);
    var o = '';
    o += '<rect class="p1-gate-path" x="' + boxX + '" y="' + boxY + '" width="' + boxW + '" height="' + boxH + '" rx="8"/>';
    o += '<text class="p1-slice-t" x="' + (boxX + boxW / 2) + '" y="' + (cy + 4) + '">' +
      (g.kind === 'mux' ? 'MUX ' + n : (g.kind === 'demux' ? 'DMUX ' + n : 'OR ' + n)) + '</text>';
    for (var i = 0; i < n; i++) {
      var y = boxY + rowH / 2 + i * rowH;
      var on = (g.kind === 'mux' || g.kind === 'demux') && i === g.sel;
      if (g.kind === 'mux') {
        o += '<path class="p1-w' + (on ? ' is-on' : '') + '" d="M56 ' + y + ' H' + boxX + '"/>';
        o += '<text class="p1-slice-k" x="4" y="' + (y + 4) + '">' + names[i] + '</text>';
      } else if (g.kind === 'demux') {
        o += '<path class="p1-w' + (on ? ' is-on' : '') + '" d="M' + (boxX + boxW) + ' ' + y + ' H' + (boxX + boxW + 40) + '"/>';
        o += '<text class="p1-slice-k" x="' + (boxX + boxW + 46) + '" y="' + (y + 4) + '">' + names[i] + '</text>';
      } else {
        o += '<path class="p1-w" d="M56 ' + y + ' H' + boxX + '"/>';
        o += '<text class="p1-slice-k" x="4" y="' + (y + 4) + '">' + names[i] + '</text>';
      }
    }
    if (g.kind === 'demux') {
      o += '<path class="p1-w" d="M56 ' + cy + ' H' + boxX + '"/>';
      o += '<text class="p1-slice-k" x="4" y="' + (cy + 4) + '">in</text>';
      o += '<text class="p1-slice-n" x="' + (boxX + 20) + '" y="' + (boxY - 8) + '">sel[' + g.bits + ']</text>';
    } else {
      o += '<path class="p1-w" d="M' + (boxX + boxW) + ' ' + cy + ' H' + (boxX + boxW + 60) + '"/>';
      o += '<text class="p1-slice-k" x="' + (boxX + boxW + 66) + '" y="' + (cy + 4) + '">out</text>';
      if (g.bits) o += '<text class="p1-slice-n" x="' + (boxX + 20) + '" y="' + (boxY - 8) + '">sel[' + g.bits + ']</text>';
    }
    return svg(420, boxY + boxH + 34, o);
  }

  function wayTable(g) {
    if (!g.bits) {
      return '<table class="ref-tt"><thead><tr><th>in</th><th class="o">out</th></tr></thead><tbody>' +
        '<tr>' + '<td>all 0</td>' + '<td class="o v0">0</td></tr>' +
        '<tr>' + '<td>any 1</td>' + '<td class="o v1">1</td></tr>' +
        '</tbody></table>';
    }
    var names = wayNames(g);
    var rows = '';
    for (var i = 0; i < g.n; i++) {
      rows += '<tr data-sel="' + i + '" class="' + (i === g.sel ? 'is-sel is-on' : '') + '">' +
        '<td>' + ('000' + i.toString(2)).slice(-g.bits) + '</td>' +
        '<td class="o v1">' + names[i] + '</td></tr>';
    }
    return '<table class="ref-tt"><thead><tr><th>sel</th>' + '<th class="o">Selected</th>' + '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  var GATES = [
    {
      id: 'not', name: 'NOT', vars: ['a'], nands: 1,
      expr: '¬a', how: '' + 'Wire the input to both pins: NAND(a, a) = ¬a.' + '', draw: notSvg,
      f: function (e) { return 1 - e.a; }
    },
    {
      id: 'and', name: 'AND', vars: ['a', 'b'], nands: 2,
      expr: 'a ∧ b', how: '' + 'NAND, then invert: inverting ¬(a ∧ b) gives a ∧ b.' + '', draw: andSvg,
      f: function (e) { return e.a & e.b; }
    },
    {
      id: 'or', name: 'OR', vars: ['a', 'b'], nands: 3,
      expr: 'a ∨ b', how: '' + 'Invert both inputs, then NAND: ¬(¬a ∧ ¬b) = a ∨ b (De Morgan).' + '', draw: orSvg,
      f: function (e) { return e.a | e.b; }
    },
    {
      id: 'xor', name: 'XOR', vars: ['a', 'b'], nands: 4,
      expr: 'a ⊕ b', how: '' + 'First n1 = ¬(a ∧ b); NAND n1 with a and with b to get n2 and n3; then NAND n2 and n3 together.' + '', draw: xorSvg,
      f: function (e) { return e.a ^ e.b; }
    }
  ];

  GATES.forEach(function (g) {
    g.rows = [];
    var n = g.vars.length === 1 ? 2 : 4;
    for (var i = 0; i < n; i++) {
      var env = { a: (i >> 1) & 1 };
      if (g.vars.length === 2) env.b = i & 1;
      else env.a = i & 1;
      g.rows.push({ i: i, env: env, out: g.f(env) });
    }
    g.env = Object.assign({}, g.rows[g.rows.length - 1].env);
    g.sel = g.rows.length - 1;
  });

  function tableHtml(g) {
    var head = g.vars.map(function (v) { return '<th>' + v + '</th>'; }).join('');
    return '<table class="ref-tt"><thead><tr>' + head + '<th class="o">out</th></tr></thead><tbody>' +
      g.rows.map(function (r) {
        return '<tr data-row="' + r.i + '" class="' + (r.i === g.sel ? 'is-sel ' : '') + (r.out ? 'is-on' : '') + '">' +
          g.vars.map(function (v) { return '<td class="' + (r.env[v] ? 'v1' : 'v0') + '">' + r.env[v] + '</td>'; }).join('') +
          '<td class="o ' + (r.out ? 'v1' : 'v0') + '">' + r.out + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function view() {
    return '<section class="page-head page-head-p1">' +
      '<div class="wrap-wide">' +
      '<p class="eyebrow">Project 1 · NAND only</p>' +
      '<h1>' + 'Basic gates: everything from NAND' + '</h1>' +
      '<p class="page-head-lead">' + 'Project 1 of nand2tetris: the whole computer starts from <strong>one</strong> gate — NAND. ' + '' +
      '' + 'This page follows Project 1: build the four basic gates from NAND, then the multiplexers and demultiplexers, then copy them to 16 bits, then use a multi-bit sel for 4-way and 8-way selection. ' + '' +
      '' + 'Click any row of a truth table or selection table to see where the current flows.' + '</p>' +
      '</div></section>' +
      CS.lineNav('p1', 'wrap-wide') +

      '<section class="mux-section"><div class="wrap-wide">' +
      '<div class="p1-intro">' +
      '<p><b>' + 'Why NAND?</b> Because it is <b>functionally complete</b>: any Boolean function can be built from it alone (Sheffer, 1913).  ' + '' +
      '' + 'NOT, AND, OR and XOR all come from it, so one kind of part is enough to grow a whole computer.' + '</p>' +
      '<p class="p1-count">' + 'NAND count: NOT 1 · AND 2 · OR 3 · XOR 4' + '</p>' +
      '<p class="bits-tip"><b>' + 'Before reading HDL:</b> HDL is not a program and <b>has no execution order</b>. Line 1 and line 100 are the same thing — ' + '' +
      '' + 'every line is a wire that is live at the same time. Do not read top to bottom; follow where the signals come from and go.' + '</p>' +
      '</div>' +

      GATES.map(function (g) {
        return '<div class="mux-block p1-block" data-gate="' + g.id + '">' +
          '<div class="mux-head">' +
          '<h2>' + g.name + ' <span>' + g.expr + '</span></h2>' +
      '<p class="mux-eq">' + (EN ? 'Built from <b>' + g.nands + (g.nands === 1 ? '</b> NAND' : '</b> NANDs') : '' + g.nands + '') + '</p>' +
          '</div>' +
          '<div class="mux-grid p1-grid">' +
          '<div class="mux-col"><p class="aside-h">' + 'Truth table' + '</p><div data-slot="table"></div></div>' +
          '<div class="mux-col p1-cir"><p class="aside-h">' + 'Built from NAND' + '</p><div data-slot="cir"></div></div>' +
          '<div class="mux-col mux-about"><p class="aside-h">' + 'How it is wired' + '</p>' +
          '<p class="p1-how">' + g.how + '</p>' +
          '<ul class="mux-points">' +
          '<li><strong>' + 'Inputs' + '</strong>：' + g.vars.join('、') + '.</li>' +
      '<li><strong>' + 'NANDs' + '</strong>' + ': ' + g.nands + '.</li>' +
          '<li><strong>' + 'Output' + '</strong>：out = ' + g.expr + '。</li>' +
          '</ul></div>' +
          '</div>' +
          CS.hdlView(g.id) +
          '</div>';
      }).join('') +

      '<div class="p1-band"><span>' + 'Selecting' + '</span><p>' + 'Combine several lines into one (MUX), or split one into several (DMUX). ' +
      'They do not change the data, only where it goes.' + '</p></div>' +
      CS.MuxUI.blocks() +
      '<div class="p1-band"><span>' + 'Wider words' + '</span><p>' + 'The second half of Project 1: copy a 1-bit gate sixteen times. ' +
      'Click any bit and the 16-bit result below changes at once.' + '</p></div>' +

      G16.map(function (g) {
        return '<div class="mux-block p1-block" data-gate="' + g.id + '" data-g16="1">' +
          '<div class="mux-head">' +
          '<h2>' + g.name + ' <span>' + g.expr + '</span></h2>' +
          '<p class="mux-eq">Sixteen 1-bit gates side by side</p>' +
          '</div>' +
          '<div class="mux-grid p1-grid">' +
          '<div class="mux-col"><p class="aside-h">' + 'Bit slice' + '</p><div data-slot="slice"></div></div>' +
          '<div class="mux-col"><p class="aside-h">' + '16-bit demo' + '</p><div data-slot="demo"></div></div>' +
          '<div class="mux-col mux-about"><p class="aside-h">' + 'What it does' + '</p>' +
          '<p class="p1-how">' + g.note + '</p>' +
          '<ul class="mux-points">' +
          '<li><strong>Inputs</strong>: ' + (g.id === 'mux16' ? 'a, b (16 bits each), sel (1 bit)' : g.ins.join(', ') + ' (16 bits each)') + '.</li>' +
          '<li><strong>Output</strong>: out (16 bits).</li>' +
          '<li><strong>Key point</strong>: bit i depends only on bit i — that is what “width” means.</li>' +
          '</ul></div>' +
          '</div>' +
          CS.hdlView(g.hdl) +
          '</div>';
      }).join('') +

      '<div class="p1-band"><span>' + 'Wide select and decode' + '</span><p>' + 'Once sel has several bits it can choose among 4 or 8 lines. ' +
      'Click any row in the left table to see the route switch.' + '</p></div>' +

      GWAY.map(function (g) {
        return '<div class="mux-block p1-block" data-gate="' + g.id + '" data-gway="1">' +
          '<div class="mux-head">' +
          '<h2>' + g.name + ' <span>' + (g.bits ? 'sel has ' + g.bits + ' bits' : '8-way reduction') + '</span></h2>' +
          '<p class="mux-eq">' + (g.kind === 'mux' ? 'pick 1 of ' + g.n + ''
            : g.kind === 'demux' ? 'send 1 input to one of ' + g.n + ' outputs'
            : 'reduce 8 inputs to 1 bit') + '</p>' +
          '</div>' +
          '<div class="mux-grid p1-grid">' +
          '<div class="mux-col"><p class="aside-h">' + (g.bits ? 'Selection table' : 'Truth table') + '</p><div data-slot="table"></div></div>' +
          '<div class="mux-col"><p class="aside-h">' + 'Route' + '</p><div data-slot="route"></div></div>' +
          '<div class="mux-col mux-about"><p class="aside-h">' + 'What it does' + '</p>' +
          '<p class="p1-how">' + g.note + '</p>' +
          '<ul class="mux-points">' +
          '<li><strong>Inputs</strong>: ' + (g.kind === 'or' ? 'in[8] (8 bits)' : g.kind === 'demux' ? 'in (1 bit)' : wayNames(g).join(', ') + ' (16 bits each)') + '.</li>' +
          '<li><strong>Output</strong>: ' + (g.kind === 'demux' ? wayNames(g).join(', ') + ' (1 bit each)' : g.kind === 'or' ? 'out (1 bit)' : 'out (16 bits)') + '.</li>' +
          '<li><strong>Key point</strong>: ' + (g.kind === 'or' ? 'Any input that is 1 makes out 1.' : 'Each sel bit picks the next branch.') + '</li>' +
          '</ul></div>' +
          '</div>' +
          CS.hdlView(g.hdl) +
          '</div>';
      }).join('') +

      '</div></section>';
  }

  function paint(g, card) {
    card.querySelector('[data-slot="table"]').innerHTML = tableHtml(g);
    card.querySelector('[data-slot="cir"]').innerHTML = g.draw(g.env);
  }

  function mount() {
    var cards16 = document.querySelectorAll('.p1-block[data-g16]');
    cards16.forEach(function (card) {
      var g = G16.filter(function (x) { return x.id === card.dataset.gate; })[0];
      function paint16() {
        card.querySelector('[data-slot="slice"]').innerHTML = sliceSvg(g);
        card.querySelector('[data-slot="demo"]').innerHTML = demoHtml(g);
      }
      paint16();
      card.addEventListener('click', function (e) {
        var cell = e.target.closest ? e.target.closest('.b16-cell.is-edit') : null;
        if (cell) {
          var bit = parseInt(cell.dataset.bit, 10);
          if (cell.dataset.row === 'b') g.st.b ^= (1 << bit);
          else g.st.a ^= (1 << bit);
          paint16();
          return;
        }
        var sel = e.target.closest ? e.target.closest('[data-sel]') : null;
        if (sel) { g.st.sel = g.st.sel ? 0 : 1; paint16(); }
      });
    });

    var cardsWay = document.querySelectorAll('.p1-block[data-gway]');
    cardsWay.forEach(function (card) {
      var g = GWAY.filter(function (x) { return x.id === card.dataset.gate; })[0];
      function paintWay() {
        card.querySelector('[data-slot="table"]').innerHTML = wayTable(g);
        card.querySelector('[data-slot="route"]').innerHTML = waySvg(g);
      }
      paintWay();
      card.addEventListener('click', function (e) {
        var tr = e.target.closest ? e.target.closest('tr[data-sel]') : null;
        if (!tr) return;
        g.sel = parseInt(tr.dataset.sel, 10);
        paintWay();
      });
    });

    var cards = document.querySelectorAll('.p1-block:not([data-g16]):not([data-gway]):not([data-p2])');
    if (!cards.length) return;
    cards.forEach(function (card) {
      var g = GATES.filter(function (x) { return x.id === card.dataset.gate; })[0];
      if (!g) return;
      paint(g, card);
      card.addEventListener('click', function (e) {
        var tr = e.target.closest ? e.target.closest('tr[data-row]') : null;
        if (!tr) return;
        var row = g.rows[parseInt(tr.dataset.row, 10)];
        g.env = Object.assign({}, row.env);
        g.sel = row.i;
        paint(g, card);
      });
    });
  }

  return { view: view, mount: mount, exportSvg: exportSvg };
})();
