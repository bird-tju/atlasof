window.CS = window.CS || {};
CS.MuxUI = (function () {
  'use strict';

  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var MUX = { env: { a: 1, b: 0, s: 0 } };
  var DMUX = { env: { in: 1, s: 0 } };

  function rowsForMux() {
    var rows = [];
    for (var i = 0; i < 8; i++) {
      var env = { a: (i >> 2) & 1, b: (i >> 1) & 1, s: i & 1 };
      rows.push({ i: i, env: env, out: env.s ? env.b : env.a });
    }
    return rows;
  }
  function rowsForDmux() {
    var rows = [];
    for (var i = 0; i < 4; i++) {
      var env = { in: (i >> 1) & 1, s: i & 1 };
      rows.push({ i: i, env: env, a: env.in && !env.s ? 1 : 0, b: env.in && env.s ? 1 : 0 });
    }
    return rows;
  }
  function idxForMux(env) { return (env.a << 2) | (env.b << 1) | env.s; }
  function idxForDmux(env) { return (env.in << 1) | env.s; }

  function muxSymbol(env) {
    var on = '#7aa2f7', off = 'rgba(160,170,190,0.42)';
    var col = function (v) { return v ? on : off; };
    var out = env.s ? env.b : env.a;
    var s = '<svg class="mux-sym" viewBox="0 0 240 150" role="img" aria-label="' + 'MUX 2:1 symbol' + '">';
    s += '<path d="M56 30 H150 L196 60 V90 L150 120 H56 Z" fill="var(--panel-2)" stroke="var(--line-2)" stroke-width="1.4"/>';
    s += '<path d="M18 55 H56" stroke="' + col(env.a) + '" stroke-width="1.8"/>';
    s += '<path d="M18 95 H56" stroke="' + col(env.b) + '" stroke-width="1.8"/>';
    s += '<text class="sym-label" x="8" y="50">a</text><text class="sym-val ' + (env.a ? 'on' : 'off') + '" x="8" y="70">' + env.a + '</text>';
    s += '<text class="sym-label" x="8" y="90">b</text><text class="sym-val ' + (env.b ? 'on' : 'off') + '" x="8" y="110">' + env.b + '</text>';
    s += '<path d="M110 140 V120" stroke="' + col(env.s) + '" stroke-width="1.8"/>';
    s += '<text class="sym-label" x="116" y="146">sel</text>';
    s += '<text class="sym-val ' + (env.s ? 'on' : 'off') + '" x="150" y="146">' + env.s + '</text>';
    s += '<path d="M196 75 H216" stroke="' + col(out) + '" stroke-width="1.8"/>';
    s += '<text class="sym-label" x="220" y="70">out</text>';
    s += '<text class="sym-val ' + (out ? 'on' : 'off') + '" x="220" y="88">' + out + '</text>';
    s += '<text class="mux-inner-label" x="104" y="80">MUX</text>';
    s += '</svg>';
    return s;
  }

  function dmuxSymbol(env) {
    var on = '#7aa2f7', off = 'rgba(160,170,190,0.42)';
    var col = function (v) { return v ? on : off; };
    var aOut = env.in && !env.s ? 1 : 0;
    var bOut = env.in && env.s ? 1 : 0;
    var s = '<svg class="mux-sym" viewBox="0 0 240 150" role="img" aria-label="' + 'DMUX 1:2 symbol' + '">';
    s += '<path d="M44 60 L90 30 H184 V120 H90 L44 90 Z" fill="var(--panel-2)" stroke="var(--line-2)" stroke-width="1.4"/>';
    s += '<path d="M18 75 H44" stroke="' + col(env.in) + '" stroke-width="1.8"/>';
    s += '<text class="sym-label" x="8" y="70">in</text><text class="sym-val ' + (env.in ? 'on' : 'off') + '" x="8" y="90">' + env.in + '</text>';
    s += '<path d="M184 55 H214" stroke="' + col(aOut) + '" stroke-width="1.8"/>';
    s += '<path d="M184 95 H214" stroke="' + col(bOut) + '" stroke-width="1.8"/>';
    s += '<text class="sym-label" x="222" y="50">a</text><text class="sym-val ' + (aOut ? 'on' : 'off') + '" x="222" y="70">' + aOut + '</text>';
    s += '<text class="sym-label" x="222" y="90">b</text><text class="sym-val ' + (bOut ? 'on' : 'off') + '" x="222" y="110">' + bOut + '</text>';
    s += '<path d="M90 140 V120" stroke="' + col(env.s) + '" stroke-width="1.8"/>';
    s += '<text class="sym-label" x="96" y="146">sel</text>';
    s += '<text class="sym-val ' + (env.s ? 'on' : 'off') + '" x="130" y="146">' + env.s + '</text>';
    s += '<text class="mux-inner-label" x="112" y="80">DMUX</text>';
    s += '</svg>';
    return s;
  }

  function muxTable() {
    var rows = rowsForMux();
    var sel = idxForMux(MUX.env);
    return '<table class="ref-tt"><thead><tr><th>a</th><th>b</th><th>sel</th><th class="o">out</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr data-row="' + r.i + '" class="' + (r.i === sel ? 'is-sel ' : '') + (r.out ? 'is-on' : '') + '">' +
          '<td class="' + (r.env.a ? 'v1' : 'v0') + '">' + r.env.a + '</td>' +
          '<td class="' + (r.env.b ? 'v1' : 'v0') + '">' + r.env.b + '</td>' +
          '<td class="' + (r.env.s ? 'v1' : 'v0') + '">' + r.env.s + '</td>' +
          '<td class="o ' + (r.out ? 'v1' : 'v0') + '">' + r.out + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function dmuxTable() {
    var rows = rowsForDmux();
    var sel = idxForDmux(DMUX.env);
    return '<table class="ref-tt"><thead><tr><th>in</th><th>sel</th><th class="o">a</th><th class="o">b</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr data-row="' + r.i + '" class="' + (r.i === sel ? 'is-sel ' : '') + ((r.a || r.b) ? 'is-on' : '') + '">' +
          '<td class="' + (r.env.in ? 'v1' : 'v0') + '">' + r.env.in + '</td>' +
          '<td class="' + (r.env.s ? 'v1' : 'v0') + '">' + r.env.s + '</td>' +
          '<td class="o ' + (r.a ? 'v1' : 'v0') + '">' + r.a + '</td>' +
          '<td class="o ' + (r.b ? 'v1' : 'v0') + '">' + r.b + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function blocks() {
    return '<div class="mux-block" data-dev="mux">' +
      '<div class="mux-head">' +
      '<h2>MUX <span>' + 'multiplexer 2:1' + '</span></h2>' +
      '<p class="mux-eq">out = <span class="mono">(¬sel ∧ a) ∨ (sel ∧ b)</span> — <strong>' + 'sel=0 picks a, sel=1 picks b' + '</strong></p>' +
      '</div>' +
      '<div class="mux-grid">' +
      '<div class="mux-col"><p class="aside-h">' + 'Selection table' + '</p><div data-slot="table"></div></div>' +
      '<div class="mux-col"><p class="aside-h">' + 'Symbol' + '</p><div data-slot="sym"></div></div>' +
      '<div class="mux-col mux-about">' +
      '<p class="aside-h">' + 'What it does' + '</p>' +
      '<ul class="mux-points">' +
      '<li><strong>' + 'sel only selects' + '</strong>: ' + 'sel decides the route and takes no part in the computation itself.' + '</li>' +
      '<li><strong>' + 'The other input is dropped' + '</strong>: ' + 'the input that is not selected has no effect on the output.' + '</li>' +
      '<li><strong>' + 'It can be widened' + '</strong>: ' + 'Mux16 is sixteen of these side by side; Mux4Way16 uses two sel bits to choose among four.' + '</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      CS.hdlView('mux') +
      '</div>' +

      '<div class="mux-block" data-dev="dmux">' +
      '<div class="mux-head">' +
      '<h2>DMUX <span>' + 'demultiplexer 1:2' + '</span></h2>' +
      '<p class="mux-eq"><span class="mono">a = in ∧ ¬sel, b = in ∧ sel</span> — <strong>' + 'sel=0 sends to a, sel=1 sends to b' + '</strong></p>' +
      '</div>' +
      '<div class="mux-grid">' +
      '<div class="mux-col"><p class="aside-h">' + 'Selection table' + '</p><div data-slot="table"></div></div>' +
      '<div class="mux-col"><p class="aside-h">' + 'Symbol' + '</p><div data-slot="sym"></div></div>' +
      '<div class="mux-col mux-about">' +
      '<p class="aside-h">' + 'What it does' + '</p>' +
      '<ul class="mux-points">' +
      '<li><strong>' + 'One in, two out' + '</strong>: ' + 'only one output gets in at a time; the other is forced to 0.' + '</li>' +
      '<li><strong>' + 'The mirror image of MUX' + '</strong>: ' + 'MUX picks one line out of several; DMUX sends one line to one of several.' + '</li>' +
      '<li><strong>' + 'It can be widened' + '</strong>' + ': DMux4Way uses two sel bits to send the input to one of four outputs.' + '</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      CS.hdlView('dmux') +
      '</div>' +

      '<div class="mux-compare">' +
      '<table class="layer-table compare-table">' +
      '<thead><tr><th></th><th>MUX</th><th>DMUX</th></tr></thead><tbody>' +
      '<tr><td class="lt-name"><strong>' + 'Direction' + '</strong></td><td>' + 'many → one (merge)' + '</td><td>' + 'one → many (split)' + '</td></tr>' +
      '<tr><td class="lt-name"><strong>' + 'Control' + '</strong></td><td>' + 'sel picks which line comes in' + '</td><td>' + 'sel picks which line goes out' + '</td></tr>' +
      '<tr><td class="lt-name"><strong>' + 'Role in the datapath' + '</strong></td><td>' + 'ALU input selection, register write-back, forwarding' + '</td><td>' + 'send one result to different destinations (register / memory)' + '</td></tr>' +
      '<tr><td class="lt-name"><strong>' + 'Extension' + '</strong></td><td>Mux4Way16 / Mux8Way16</td><td>DMux4Way / DMux8Way</td></tr>' +
      '</tbody></table>' +
      '</div>';
  }

  function view() {
    return '<section class="page-head page-head-mux">' +
      '<div class="wrap-wide">' +
      '<p class="eyebrow">MUX &amp; DMUX</p>' +
      '<h1>' + 'Merge several lines into one, or split one' + '</h1>' +
      '<p class="page-head-lead">' + 'MUX is a selector: pick one of several inputs and connect it to the output. DMUX is the opposite: send one input to a chosen output.' + '</p>' +
      '</div></section>' +
      CS.lineNav('gates', 'wrap-wide') +
      '<section class="mux-section"><div class="wrap-wide">' + blocks() + '</div></section>';
  }

  function paint(dev) {
    var block = document.querySelector('[data-dev="' + dev + '"]');
    if (!block) return;
    if (dev === 'mux') {
      block.querySelector('[data-slot="table"]').innerHTML = muxTable();
      block.querySelector('[data-slot="sym"]').innerHTML = muxSymbol(MUX.env);
    } else {
      block.querySelector('[data-slot="table"]').innerHTML = dmuxTable();
      block.querySelector('[data-slot="sym"]').innerHTML = dmuxSymbol(DMUX.env);
    }
  }

  function mount() {
    var muxBlock = document.querySelector('[data-dev="mux"]');
    if (!muxBlock) return;

    paint('mux');
    paint('dmux');

    muxBlock.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-row]');
      if (!tr) return;
      var i = parseInt(tr.dataset.row, 10);
      MUX.env = { a: (i >> 2) & 1, b: (i >> 1) & 1, s: i & 1 };
      paint('mux');
    });

    var dmuxBlock = document.querySelector('[data-dev="dmux"]');
    dmuxBlock.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-row]');
      if (!tr) return;
      var i = parseInt(tr.dataset.row, 10);
      DMUX.env = { in: (i >> 1) & 1, s: i & 1 };
      paint('dmux');
    });
  }

  return { view: view, mount: mount, blocks: blocks };
})();
