/* Horizontal navigation for the hardware line: gates → MUX → width → adders → ALU */
window.CS = window.CS || {};
CS.lineNav = (function () {
  'use strict';

  var ITEMS = [
    ['intro', 'Why universal?'],
    ['gates', 'Basic gates'],
    ['adders', 'Adders'],
    ['alu', 'ALU'],
    ['sequential', 'Sequential'],
    ['ram', 'RAM'],
    ['machine', 'Spec'],
    ['machine-language', 'Machine language'],
    ['assembler', 'Assembly'],
    ['cpu', 'CPU'],
    ['computer', 'Computer'],
    ['screen', 'Screen'],
    ['keyboard', 'Keyboard'],
    ['gate-reference', 'Gates']
  ];

  return function (current, wrapClass) {
    var links = ITEMS.map(function (item) {
      var href = '#/hardware/' + item[0];
      return '<a href="' + href + '"' + (item[0] === current ? ' class="is-current" aria-current="page"' : '') + '>' + item[1] + '</a>';
    }).join('<span class="line-sep">→</span>');

    return '<div class="' + (wrapClass || 'wrap-wide') + '"><nav class="line-nav" aria-label="The hardware line">' +
      '<span class="line-label">Bottom-up</span>' + links +
      '</nav></div>';
  };
})();
