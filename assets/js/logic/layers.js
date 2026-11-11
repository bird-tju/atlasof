window.CS = window.CS || {};
CS.LayersUI = (function () {
  'use strict';

  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var LAYERS = [
    {
      id: 'algebra', name: '', en: 'Boolean algebra', tone: 'math',
      prim: '∧ ∨ ¬', extra: '',
      why: '',
      not: ''
    },
    {
      id: 'logic', name: '', en: 'Digital logic', tone: 'logic',
      prim: 'AND / OR / NOT', extra: '',
      why: '',
      not: ''
    },
    {
      id: 'cmos', name: '', en: 'CMOS', tone: 'ee',
      prim: 'NAND / NOR / INV', extra: '',
      why: '',
      not: ''
    },
    {
      id: 'relay', name: '', en: 'Relay logic, 1937', tone: 'relay',
      prim: '', extra: '',
      why: '',
      not: ''
    }
  ];

  var COST = [
    ['INV', '2', ''],
    ['NAND2', '4', ''],
    ['NOR2', '4', ''],
    ['AND2', '6', 'NAND2 + INV'],
    ['OR2', '6', 'NOR2 + INV'],
    ['XOR2', '10–12', '']
  ];

  function view() {
    return '<section class="page-head page-head-layers">' +
      '<div class="wrap">' +
      '<p class="eyebrow">One Gate, Four Layers</p>' +
      '' +
      '' +
      '' +
      '</div></section>' +

      '<section class="section section-tight"><div class="wrap">' +

      '<div class="layer-scroll"><table class="layer-table">' +
      '' +
      LAYERS.map(function (l) {
        return '<tr class="tone-' + l.tone + '">' +
          '<td class="lt-name"><strong>' + h(l.name) + '</strong><em>' + h(l.en) + '</em></td>' +
          '<td class="lt-prim"><span class="mono">' + h(l.prim) + '</span><small>' + h(l.extra) + '</small></td>' +
          '<td>' + h(l.why) + '</td>' +
          '<td class="lt-not">' + h(l.not) + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +

      '<div class="layer-cards">' +
      '' +
      '' +
      '' +
      '' +
      '' +
      '' +
      '</div>' +

      '<div class="layer-split">' +
      '<div class="layer-block">' +
      '' +
      '<table class="cost-table"><tbody>' +
      COST.map(function (c) {
        return '<tr><td class="mono">' + h(c[0]) + '</td><td class="cost-n">' + h(c[1]) + '</td><td>' + h(c[2]) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '' +
      '</div>' +
      '<div class="layer-block">' +
      '' +
      '' +
      '' +
      '' +
      '</div>' +
      '</div>' +

      '<div class="layer-back">' +
      '' +
      
      '</div>' +

      '</div></section>';
  }

  function mount() {}

  return { view: view, mount: mount };
})();
