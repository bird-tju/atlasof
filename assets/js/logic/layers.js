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
      id: 'algebra', name: 'Boolean algebra', en: 'mathematics', tone: 'math',
      prim: '∧ ∨ ¬', extra: 'de Morgan, distributivity',
      why: 'Lets you prove that two circuits are equal without building either of them.',
      not: 'Cost, delay, and whether it can be built at all'
    },
    {
      id: 'logic', name: 'Digital logic', en: 'engineering', tone: 'logic',
      prim: 'AND / OR / NOT', extra: 'truth tables, clocks',
      why: 'Composes gates into adders, registers and processors, and gives a language for timing.',
      not: 'How a gate is actually made, or what it costs in silicon'
    },
    {
      id: 'cmos', name: 'CMOS', en: 'physics', tone: 'ee',
      prim: 'NAND / NOR / INV', extra: 'transistors, voltage',
      why: 'NAND is the primitive because a pull-down network inverts as it conducts — six transistors beat four.',
      not: 'Which arrangement of gates is worth building'
    },
    {
      id: 'relay', name: 'Relay logic', en: '1937', tone: 'relay',
      prim: 'contacts, coils', extra: "Shannon's thesis",
      why: 'Series is AND, parallel is OR, a normally-closed contact is NOT: the same algebra, thirty years earlier.',
      not: 'Speed, size, or anything that would make it a computer'
    }
  ];

  var COST = [
    ['INV', '2', 'one pull-up, one pull-down'],
    ['NAND2', '4', 'two of each'],
    ['NOR2', '4', 'wider, but the same count'],
    ['AND2', '6', 'NAND2 + INV'],
    ['OR2', '6', 'NOR2 + INV'],
    ['XOR2', '10–12', 'four NANDs']
  ];

  function view() {
    return '<section class="page-head page-head-layers">' +
      '<div class="wrap">' +
      '<p class="eyebrow">One Gate, Four Layers</p>' +
      '<h1>One gate, four layers</h1>' +
      '<p class="page-head-lead">The same NAND seen at four levels: as algebra, as a logic gate, as a CMOS circuit, and as a relay contact. Each level keeps one thing and hides another.</p>' +
      '</div></section>' +

      '<section class="section section-tight"><div class="wrap">' +

      '<div class="layer-scroll"><table class="layer-table">' +
      '<thead><tr><th>Layer</th><th>Primitives</th><th>What it buys you</th><th>What it hides</th></tr></thead><tbody>' +
      LAYERS.map(function (l) {
        return '<tr class="tone-' + l.tone + '">' +
          '<td class="lt-name"><strong>' + h(l.name) + '</strong><em>' + h(l.en) + '</em></td>' +
          '<td class="lt-prim"><span class="mono">' + h(l.prim) + '</span><small>' + h(l.extra) + '</small></td>' +
          '<td>' + h(l.why) + '</td>' +
          '<td class="lt-not">' + h(l.not) + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +

      '<div class="layer-cards">' +
      '<div class="layer-card"><h3>Same function, different price</h3><p>A NAND is four transistors; an AND is six, because it is a NAND followed by an inverter. The algebra says they are equally expressive. The silicon says otherwise.</p></div>' +
      '<div class="layer-card"><h3>Why NAND and not AND</h3><p>In CMOS the pull-down network already inverts the result, so the inverting gate is the one you get for free. That single fact is why NAND is the primitive in every standard cell library.</p></div>' +
      '<div class="layer-card"><h3>Why the course starts at gates</h3><p>Starting from NAND means every later layer is a construction, not an assumption: you can point at the four transistors and then at Tetris.</p></div>' +
      '</div>' +

      '<div class="layer-split">' +
      '<div class="layer-block">' +
      '<h2>Transistor count, 2-input static CMOS</h2>' +
      '<table class="cost-table"><tbody>' +
      COST.map(function (c) {
        return '<tr><td class="mono">' + h(c[0]) + '</td><td class="cost-n">' + h(c[1]) + '</td><td>' + h(c[2]) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<p class="bits-tip">Counts are for a single stage. Real libraries trade area for drive strength, so the numbers move, but the ordering does not.</p>' +
      '</div>' +
      '<div class="layer-block">' +
      '<h2>What changes between layers</h2>' +
      '<p>Moving down a layer adds constraints and removes choices. Algebra has no notion of time; CMOS gates take nanoseconds; a relay takes milliseconds and wears out.</p>' +
      '<p>Moving up a layer does the opposite: it removes detail so that a bigger structure fits in your head. A CPU made of transistors is unreadable; a CPU made of adders and registers is a diagram.</p>' +
      '</div>' +
      '</div>' +

      '<div class="layer-back">' +
      '<a class="text-link" href="#/hardware/gate-reference">Back to the gate reference <span>→</span></a>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {}

  return { view: view, mount: mount };
})();
