window.CS = window.CS || {};
CS.tools = CS.tools || {};
CS.tools['boolean-algebra'] = {
  href: '#/logic',
  title: (typeof window !== 'undefined' && window.CS && CS.I18N && CS.I18N.lang === 'en') ? 'Gate reference' : '',
  desc: (typeof window !== 'undefined' && window.CS && CS.I18N && CS.I18N.lang === 'en') ? 'Basic gates (AND, OR, NAND…): expression, truth table and symbol side by side' : ''
};

CS.LogicUI = (function () {
  'use strict';

  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var V = function (name) { return { k: 'var', name: name }; };
  var N = function (a) { return { k: 'not', a: a }; };
  var A = function (a, b) { return { k: 'and', a: a, b: b }; };
  var O = function (a, b) { return { k: 'or', a: a, b: b }; };

  var GATES = [
    {
      id: 'not', name: 'NOT', en: 'Inverter', expr: '¬a', rule: (typeof EN !== 'undefined' && EN) ? 'the output is the opposite of the input' : '',
      ast: N(V('a')), type: 'not'
    },
    {
      id: 'and', name: 'AND', en: 'Conjunction', expr: 'a ∧ b', rule: (typeof EN !== 'undefined' && EN) ? 'the output is 1 only when both inputs are 1' : '',
      ast: A(V('a'), V('b')), type: 'and'
    },
    {
      id: 'or', name: 'OR', en: 'Disjunction', expr: 'a ∨ b', rule: (typeof EN !== 'undefined' && EN) ? 'the output is 1 when either input is 1' : '',
      ast: O(V('a'), V('b')), type: 'or'
    },
    {
      id: 'xor', name: 'XOR', en: 'Exclusive or', expr: 'a ⊕ b', rule: (typeof EN !== 'undefined' && EN) ? 'the output is 1 when the inputs differ' : '',
      ast: { k: 'xor', a: V('a'), b: V('b') }, type: 'xor'
    },
    {
      id: 'nand', name: 'NAND', en: '', expr: '¬(a ∧ b)', rule: (typeof EN !== 'undefined' && EN) ? 'the output is 0 when both inputs are 1' : '',
      ast: N(A(V('a'), V('b'))), type: 'nand'
    },
    {
      id: 'nor', name: 'NOR', en: '', expr: '¬(a ∨ b)', rule: (typeof EN !== 'undefined' && EN) ? 'the output is 1 only when both inputs are 0' : '',
      ast: N(O(V('a'), V('b'))), type: 'nor'
    }
  ];

  GATES.forEach(function (g) {
    g.vars = g.id === 'not' ? ['a'] : ['a', 'b'];
    g.rows = CS.Expr.truthTable(g.vars, g.ast);
    var first = g.rows.filter(function (r) { return r.out === 1; })[0] || g.rows[0];
    g.env = Object.assign({}, first.env);
    g.sel = first.index;
  });

  function pinTxt(name, v, x, y, anchor) {
    return '<text class="sym-pin" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'start') + '">' +
      name + ' <tspan class="sym-pinv' + (v ? ' on' : '') + '">' + v + '</tspan></text>';
  }

  function symbolSvg(g) {
    var env = g.env;
    var outVal = CS.Expr.evaluate(g.ast, env);
    var two = g.vars.length === 2;
    var on = '#7aa2f7', off = 'rgba(160,170,190,0.42)';
    var col = function (v) { return v ? on : off; };
    var s = '<svg class="gate-sym-svg" viewBox="0 0 240 128" role="img" aria-label="' + g.name + ' logic symbol">';

    var y1 = two ? 50 : 62, y2 = 82;
    s += '<path d="M44 ' + y1 + ' H74" stroke="' + col(env.a) + '" stroke-width="1.8" fill="none"/>';
    s += pinTxt('a', env.a, 6, y1 + 4);
    if (two) {
      s += '<path d="M44 ' + y2 + ' H74" stroke="' + col(env.b) + '" stroke-width="1.8" fill="none"/>';
      s += pinTxt('b', env.b, 6, y2 + 4);
    }

    s += '<g transform="translate(74 41) scale(1.55)" class="gate-shape ' + g.type + '">' + CS.Circuit.shape(g.type) + '</g>';

    var bubbled = g.type === 'not' || g.type === 'nand' || g.type === 'nor';
    var outStart = 74 + (bubbled ? 49 : 44) * 1.55;
    var outX = outStart + 34;
    s += '<path d="M' + outStart + ' 64 H' + (outX - 6) + '" stroke="' + col(outVal) + '" stroke-width="1.8" fill="none"/>';
    s += pinTxt('f', outVal, outX + 2, 68);
    s += '</svg>';
    return s;
  }

  function tableHtml(g) {
    return '<table class="ref-tt"><thead><tr>' +
      g.vars.map(function (v) { return '<th>' + v + '</th>'; }).join('') +
      '<th class="o">f</th></tr></thead><tbody>' +
      g.rows.map(function (r) {
        return '<tr data-row="' + r.index + '" class="' + (r.index === g.sel ? 'is-sel ' : '') + (r.out === 1 ? 'is-on' : '') + '">' +
          g.vars.map(function (v) { return '<td class="' + (r.env[v] ? 'v1' : 'v0') + '">' + r.env[v] + '</td>'; }).join('') +
          '<td class="o ' + (r.out ? 'v1' : 'v0') + '">' + r.out + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function view() {
    return '<section class="page-head page-head-logic">' +
      '<div class="wrap-wide">' +
      '<p class="eyebrow">Gate Reference</p>' +
      '<h1>' + 'Gate reference' + '</h1>' +
      '<p class="page-head-lead">' + 'Six basic gates, each from three angles: expression, truth table and symbol. ' +
      'Click any row of a truth table and the pin values on the symbol follow.' + '</p>' +
      '<p class="ref-scope">' + 'The “basic gates” here are the <strong>digital-logic</strong> view: AND, OR and NOT are the primitives, with NAND and NOR listed for their universality. ' +
      'In Boolean algebra the primitives are ∧, ∨ and ¬; in CMOS they are NAND, NOR and the inverter — an AND is usually NAND plus inverter.' +
      '<a href="#/layers">' + 'The same gate at four levels →' + '</a></p>' +
      '</div></section>' +
      CS.lineNav('logic', 'wrap-wide') +
      '<section class="ref-section"><div class="wrap-wide">' +
      '<div class="ref-head"><span>' + 'Gate' + '</span><span>' + 'Truth table' + '</span><span>' + 'Symbol' + '</span></div>' +
      GATES.map(function (g) {
        return '<article class="gate-ref" data-gate="' + g.id + '">' +
          '<div class="ref-col ref-name">' +
          '<h2>' + g.name + '</h2>' +
          (g.en ? '<p class="ref-en">' + h(g.en) + '</p>' : '') +
          '<p class="ref-expr">' + g.expr + '</p>' +
          '<p class="ref-rule">' + g.rule + '</p>' +
          '</div>' +
          '<div class="ref-col ref-table" data-slot="table"></div>' +
          '<div class="ref-col ref-sym" data-slot="sym"></div>' +
          '</article>';
      }).join('') +
      '<p class="ref-foot">' + 'Click any row of a truth table and the pin values on the symbol to the right follow.' + '</p>' +
      '</div></section>';
  }

  function paint(g, card) {
    card.querySelector('[data-slot="table"]').innerHTML = tableHtml(g);
    card.querySelector('[data-slot="sym"]').innerHTML = symbolSvg(g);
  }

  function mount() {
    var cards = document.querySelectorAll('.gate-ref');
    if (!cards.length) return;
    cards.forEach(function (card) {
      var g = GATES.filter(function (x) { return x.id === card.dataset.gate; })[0];
      paint(g, card);
      card.addEventListener('click', function (e) {
        var tr = e.target.closest('tr[data-row]');
        if (!tr) return;
        var row = g.rows[parseInt(tr.dataset.row, 10)];
        g.env = Object.assign({}, row.env);
        g.sel = row.index;
        paint(g, card);
      });
    });
  }

  return { view: view, mount: mount };
})();
