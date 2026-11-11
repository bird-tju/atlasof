/* Horizontal navigation for the hardware line: gates → MUX → width → adders → ALU */
window.CS = window.CS || {};
CS.lineNav = (function () {
  'use strict';

  var ITEMS = [
    ['intro', 'Why universal?'],
    ['p1', 'Basic gates'],
    ['p2', 'Adders'],
    ['alu', 'ALU'],
    ['clock', 'Sequential'],
    ['ram', 'RAM'],
    ['machine', 'Spec'],
    ['ml', 'Machine language'],
    ['asm', 'Assembly'],
    ['cpu', 'CPU'],
    ['computer', 'Computer'],
    ['screen', 'Screen'],
    ['input', 'Keyboard'],
    ['logic', 'Gates']
  ];

  return function (current, wrapClass) {
    var links = ITEMS.map(function (item) {
      var href = '#/' + item[0];
      return '<a href="' + href + '"' + (item[0] === current ? ' class="is-current" aria-current="page"' : '') + '>' + item[1] + '</a>';
    }).join('<span class="line-sep">→</span>');

    return '<div class="' + (wrapClass || 'wrap-wide') + '"><nav class="line-nav" aria-label="The hardware line">' +
      '<span class="line-label">Bottom-up</span>' + links +
      '</nav></div>';
  };
})();
