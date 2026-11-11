window.CS = window.CS || {};
CS.AdderUI = (function () {
  'use strict';

  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var HA = { env: { a: 1, b: 1 } };
  var FA = { env: { a: 1, b: 0, c: 1 } };
  var ADD = { a: 0x1234, b: 0x00ff };

  function hex4(n) {
    var s = (n & 0xffff).toString(16).toUpperCase();
    while (s.length < 4) s = '0' + s;
    return '0x' + s;
  }
  function binGroups(n, w) {
    var s = '';
    for (var i = w - 1; i >= 0; i--) {
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

  function haRows() {
    var rows = [];
    for (var i = 0; i < 4; i++) {
      var env = { a: (i >> 1) & 1, b: i & 1 };
      rows.push({ i: i, env: env, sum: env.a ^ env.b, carry: env.a & env.b });
    }
    return rows;
  }
  function haTable() {
    var sel = (HA.env.a << 1) | HA.env.b;
    return '<table class="ref-tt"><thead><tr><th>a</th><th>b</th><th class="o">sum</th><th class="o">carry</th></tr></thead><tbody>' +
      haRows().map(function (r) {
        return '<tr data-row="' + r.i + '" class="' + (r.i === sel ? 'is-sel ' : '') + ((r.sum || r.carry) ? 'is-on' : '') + '">' +
          '<td class="' + (r.env.a ? 'v1' : 'v0') + '">' + r.env.a + '</td>' +
          '<td class="' + (r.env.b ? 'v1' : 'v0') + '">' + r.env.b + '</td>' +
          '<td class="o ' + (r.sum ? 'v1' : 'v0') + '">' + r.sum + '</td>' +
          '<td class="o ' + (r.carry ? 'v1' : 'v0') + '">' + r.carry + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function faRows() {
    var rows = [];
    for (var i = 0; i < 8; i++) {
      var env = { a: (i >> 2) & 1, b: (i >> 1) & 1, c: i & 1 };
      var s = env.a + env.b + env.c;
      rows.push({ i: i, env: env, sum: s & 1, carry: s > 1 ? 1 : 0 });
    }
    return rows;
  }
  function faTable() {
    var sel = (FA.env.a << 2) | (FA.env.b << 1) | FA.env.c;
    return '<table class="ref-tt"><thead><tr><th>a</th><th>b</th><th>c</th><th class="o">sum</th><th class="o">carry</th></tr></thead><tbody>' +
      faRows().map(function (r) {
        return '<tr data-row="' + r.i + '" class="' + (r.i === sel ? 'is-sel ' : '') + ((r.sum || r.carry) ? 'is-on' : '') + '">' +
          '<td class="' + (r.env.a ? 'v1' : 'v0') + '">' + r.env.a + '</td>' +
          '<td class="' + (r.env.b ? 'v1' : 'v0') + '">' + r.env.b + '</td>' +
          '<td class="' + (r.env.c ? 'v1' : 'v0') + '">' + r.env.c + '</td>' +
          '<td class="o ' + (r.sum ? 'v1' : 'v0') + '">' + r.sum + '</td>' +
          '<td class="o ' + (r.carry ? 'v1' : 'v0') + '">' + r.carry + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function boxSymbol(labels, env, label) {
    var on = '#7aa2f7', off = 'rgba(160,170,190,0.42)';
    var col = function (v) { return v ? on : off; };
    var ins = labels.in;
    var outs = labels.out;
    var H = Math.max(ins.length, outs.length) * 26 + 30;
    var s = '<svg class="adder-sym" viewBox="0 0 240 ' + H + '" role="img" aria-label="' + label + '';
    var x0 = 56, x1 = 168;
    s += '<rect x="' + x0 + '" y="10" width="' + (x1 - x0) + '" height="' + (H - 20) + '" rx="8" fill="var(--panel-2)" stroke="var(--line-2)"/>';
    s += '<text class="adder-box-label" x="' + ((x0 + x1) / 2) + '" y="' + (H / 2 + 5) + '">' + label + '</text>';
    ins.forEach(function (pin, i) {
      var y = 26 + i * 26;
      var v = env[pin] ? 1 : 0;
      s += '<path d="M20 ' + y + ' H' + x0 + '" stroke="' + col(v) + '" stroke-width="1.8"/>';
      s += '<text class="sym-label" x="8" y="' + (y - 6) + '">' + pin + '</text>';
      s += '<text class="sym-val ' + (v ? 'on' : 'off') + '" x="8" y="' + (y + 12) + '">' + v + '</text>';
    });
    outs.forEach(function (pin, i) {
      var y = 26 + i * 26;
      var v = outValue(pin, env);
      s += '<path d="M' + x1 + ' ' + y + ' H204" stroke="' + col(v) + '" stroke-width="1.8"/>';
      s += '<text class="sym-label" x="210" y="' + (y - 6) + '">' + pin + '</text>';
      s += '<text class="sym-val ' + (v ? 'on' : 'off') + '" x="210" y="' + (y + 12) + '">' + v + '</text>';
    });
    s += '</svg>';
    return s;
  }

  function outValue(pin, env) {
    if (pin === 'sum') {
      return env.c === undefined ? (env.a ^ env.b) : (env.a ^ env.b ^ env.c);
    }
    if (pin === 'carry') {
      return env.c === undefined
        ? (env.a & env.b)
        : ((env.a + env.b + env.c) > 1 ? 1 : 0);
    }
    return 0;
  }

  function addBits(a, b) {
    var bits = [];
    var carry = 0;
    for (var i = 0; i < 16; i++) {
      var ai = (a >> i) & 1, bi = (b >> i) & 1;
      var s = ai + bi + carry;
      bits.push({ i: i, a: ai, b: bi, cin: carry, sum: s & 1, cout: s > 1 ? 1 : 0 });
      carry = s > 1 ? 1 : 0;
    }
    return bits;
  }

  function bitChain(a, b) {
    var bits = addBits(a, b);
    var out = (a + b) & 0xffff;
    var carryOut = (a + b) > 0xffff ? 1 : 0;
    var cols = bits.slice().reverse();

    function row(label, key, cls) {
      return '<tr><th>' + label + '</th>' + cols.map(function (x) {
        return '<td class="' + (x[key] ? 'v1 ' : 'v0 ') + (cls || '') + '">' + x[key] + '</td>';
      }).join('') + '</tr>';
    }

    return '<div class="chain">' +
      '<div class="chain-scroll"><table class="chain-table">' +
      '' + cols.map(function (x) { return '<th>' + x.i + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' +
      row('a', 'a') +
      row('b', 'b') +
      row('', 'cin') +
      row('', 'sum', 'cc-sum') +
      row('', 'cout') +
      '</tbody></table></div>' +
      '<dl class="add-values">' +
      '<div><dt>a + b</dt><dd class="mono">' + hex4(out) + '</dd></div>' +
      '' + (a + b) + '</dd></div>' +
      '' + signed16(out) + '</dd></div>' +
      '' + carryOut + '</dd></div>' +
      '</dl></div>';
  }

  function addWidget() {
    return '<div class="add-widget">' +
      '<div class="g16-inputs">' +
      '<label class="g16-field"><span>a</span><input id="add-a" class="hex-input" value="' + hex4(ADD.a) + '' +
      '<label class="g16-field"><span>b</span><input id="add-b" class="hex-input" value="' + hex4(ADD.b) + '' +
      '' +
      '</div>' +
      '<div id="add-chain">' + bitChain(ADD.a, ADD.b) + '</div>' +
      '</div>';
  }

  function view() {
    return '<section class="page-head page-head-adder">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Adders, Step by Step</p>' +
      '' +
      '' +
      '' +
      '</div></section>' +
      CS.lineNav('adder', 'wrap') +

      '<section class="adder-section"><div class="wrap">' +

      '<div class="adder-block" data-dev="ha">' +
      '' +
      '' +
      '<p class="adder-eq mono">sum = a ⊕ b　　carry = a ∧ b</p>' +
      '<div class="adder-grid">' +
      '' +
      '' +
      '</div>' +
      CS.hdlView('halfAdder') +
      '' +
      '</div>' +

      '<div class="adder-block" data-dev="fa">' +
      '' +
      '' +
      '' +
      '<div class="adder-grid">' +
      '' +
      '' +
      '</div>' +
      CS.hdlView('fullAdder') +
      '' +
      '</div>' +

      '<div class="adder-block" data-dev="add">' +
      '' +
      '' +
      '' +
      addWidget() +
      CS.hdlView('add16') +
      '' +
      '' +
      '</div>' +

      '<div class="adder-block" data-dev="inc">' +
      '' +
      '' +
      '<p class="adder-eq mono">Inc16(x) = Add16(x, 1)</p>' +
      CS.hdlView('inc16') +
      '' +
      '' +
      '</div>' +

      '<div class="adder-block adder-next">' +
      '' +
      '' +
      '' +
      '</div>' +

      '</div></section>';
  }

  function paint(dev) {
    var block = document.querySelector('[data-dev="' + dev + '"]');
    if (!block) return;
    if (dev === 'ha') {
      block.querySelector('[data-slot="table"]').innerHTML = haTable();
      block.querySelector('[data-slot="sym"]').innerHTML = boxSymbol({ in: ['a', 'b'], out: ['sum', 'carry'] }, HA.env, 'HA');
    } else if (dev === 'fa') {
      block.querySelector('[data-slot="table"]').innerHTML = faTable();
      block.querySelector('[data-slot="sym"]').innerHTML = boxSymbol({ in: ['a', 'b', 'c'], out: ['sum', 'carry'] }, FA.env, 'FA');
    } else if (dev === 'add') {
      block.querySelector('#add-chain').innerHTML = bitChain(ADD.a, ADD.b);
    }
  }

  function mount() {
    var root = document.querySelector('.adder-section');
    if (!root) return;

    paint('ha');
    paint('fa');
    paint('add');

    root.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-row]');
      if (tr) {
        var block = tr.closest('[data-dev]');
        var i = parseInt(tr.dataset.row, 10);
        if (block.dataset.dev === 'ha') {
          HA.env = { a: (i >> 1) & 1, b: i & 1 };
          paint('ha');
        } else if (block.dataset.dev === 'fa') {
          FA.env = { a: (i >> 2) & 1, b: (i >> 1) & 1, c: i & 1 };
          paint('fa');
        }
        return;
      }
      if (e.target.id === 'add-inc') {
        ADD.b = 1;
        var bInput = document.getElementById('add-b');
        if (bInput) bInput.value = hex4(1);
        paint('add');
      }
    });

    root.addEventListener('input', function (e) {
      if (e.target.id !== 'add-a' && e.target.id !== 'add-b') return;
      var v = parseHex(e.target.value);
      if (v === null) { e.target.classList.add('is-bad'); return; }
      e.target.classList.remove('is-bad');
      if (e.target.id === 'add-a') ADD.a = v; else ADD.b = v;
      paint('add');
    });
  }

  return { view: view, mount: mount };
})();
