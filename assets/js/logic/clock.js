window.CS = window.CS || {};
CS.ClockUI = (function () {
  'use strict';

  var state = { in: 1, load: 0, out: 0, ticks: 0 };

  function bitBtn(name, v) {
    return '<button type="button" class="bit' + (v ? ' is-on' : '') + '" data-bit="' + name + '">' + v + '</button>';
  }

  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
  }

  function latchSvg() {
    var o = "";
    o += '<rect class="p1-gate-path" x="70" y="50" width="120" height="60" rx="8"/>';
    o += '<text class="p1-slice-t" x="130" y="86">NOT</text>';
    o += '<rect class="p1-gate-path" x="330" y="50" width="120" height="60" rx="8"/>';
    o += '<text class="p1-slice-t" x="390" y="86">NOT</text>';
    o += '<path class="p1-w" d="M190 70 H330"/>';
    o += '<path class="p1-w" d="M450 100 H500 V150 H30 V100 H70"/>';
    o += '<text class="p1-slice-k" x="200" y="60">Q′</text>';
    o += '<text class="p1-slice-k" x="460" y="60">Q</text>';
    o += '<text class="p1-slice-k" x="30" y="172">' + 'Two NOTs locked in a loop: they hold each other while powered' + '</text>';
    return svg(560, 185, o);
  }

  function dffSvg() {
    var o = '';
    o += '<rect class="p1-gate-path" x="70" y="44" width="130" height="96" rx="8"/>';
    o += '<text class="p1-slice-t" x="135" y="100">DFF</text>';
    o += '<path class="p1-w" d="M30 70 H70"/>';
    o += '<text class="p1-slice-k" x="6" y="74">D</text>';
    o += '<path class="p1-w" d="M30 116 H70"/>';
    o += '<path class="p1-gate-path" d="M70 106 L82 116 L70 126 Z"/>';
    o += '<text class="p1-slice-k" x="6" y="120">clk</text>';
    o += '<path class="p1-w" d="M200 70 H250"/>';
    o += '<text class="p1-slice-k" x="256" y="74">Q</text>';

    var x0 = 330, x1 = 620, hi = 0, lo = 16;
    o += '<text class="p1-slice-k" x="300" y="54">clk</text>';
    o += '<text class="p1-slice-k" x="300" y="104">D</text>';
    o += '<text class="p1-slice-k" x="300" y="154">Q</text>';

    var clk = 'M' + x0 + ' 62';
    var period = 72, high = 34;
    for (var i = 0; i < 4; i++) {
      var a = x0 + i * period;
      clk += ' V46 H' + (a + high) + ' V62 H' + (a + period);
    }
    o += '<path class="p1-w is-on" d="' + clk + '"/>';

    // D: 0 -> 1 -> 1 -> 0
    var d = 'M' + x0 + ' 112 H' + (x0 + 60) + ' V96 H' + (x0 + 132) + ' V112 H' + (x0 + 180) + ' V96 H' + (x0 + 290);
    o += '<path class="p1-w" d="' + d + '"/>';

    var q = 'M' + x0 + ' 162 H' + (x0 + 72) + ' V146 H' + (x0 + 144) + ' V162 H' + (x0 + 216) + ' V146 H' + (x0 + 290);
    o += '<path class="p1-w is-on" d="' + q + '"/>';

    for (var k = 0; k < 4; k++) {
      var xr = x0 + k * period;
      o += '<path class="p1-w" d="M' + xr + ' 46 V168" stroke-dasharray="2 4" opacity="0.5"/>';
    }

    o += '<text class="p1-slice-n" x="' + (x0 + 120) + '" y="188">' + 'updates on the rising edge only' + '</text>';
    return svg(660, 200, o);
  }

  function bitSvg() {
    var o = '';
    // MUX
    o += '<rect class="p1-gate-path" x="70" y="46" width="120" height="86" rx="8"/>';
    o += '<text class="p1-slice-t" x="130" y="94">MUX</text>';
    o += '<path class="p1-w" d="M70 66 H40" />';
    o += '<text class="p1-slice-k" x="6" y="70">out</text>';
    o += '<path class="p1-w' + (state.in ? ' is-on' : '') + '" d="M40 112 H70"/>';
    o += '<text class="p1-slice-k" x="6" y="116">in</text>';
    o += '<path class="p1-w" d="M130 132 V150" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-k" x="136" y="164">load</text>';
    // DFF
    o += '<rect class="p1-gate-path" x="270" y="46" width="120" height="86" rx="8"/>';
    o += '<text class="p1-slice-t" x="330" y="94">DFF</text>';
    o += '<path class="p1-w" d="M190 76 H270"/>';
    o += '<path class="p1-w" d="M330 132 V150" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-k" x="336" y="164">clk</text>';
    o += '<path class="p1-w' + (state.out ? ' is-on' : '') + '" d="M390 76 H440"/>';
    o += '<text class="p1-slice-k" x="446" y="80">out</text>';
    o += '<path class="p1-w" d="M415 76 V20 H40 V66"/>';
    o += '<text class="p1-slice-n" x="230" y="14">' + 'out fed back to the input (hold)' + '</text>';
    return svg(500, 180, o);
  }

  function regSvg() {
    var o = '';
    o += '<rect class="p1-gate-path" x="30" y="50" width="120" height="80" rx="8"/>';
    o += '<text class="p1-slice-t" x="90" y="82">Bit 0</text>';
    o += '<rect class="p1-gate-path" x="170" y="50" width="120" height="80" rx="8"/>';
    o += '<text class="p1-slice-t" x="230" y="82">Bit 1</text>';
    o += '<text class="p1-slice-t" x="330" y="94">⋯</text>';
    o += '<rect class="p1-gate-path" x="370" y="50" width="120" height="80" rx="8"/>';
    o += '<text class="p1-slice-t" x="430" y="82">Bit 15</text>';
    o += '<path class="p1-w" d="M90 140 V160 H430 V140" stroke-dasharray="3 3"/>';
    o += '<path class="p1-w" d="M230 130 V160" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-k" x="250" y="176">' + 'load (one line, shared by all 16 Bit chips)' + '</text>';
    o += '<path class="p1-w" d="M10 90 H30"/>';
    o += '<text class="p1-slice-k" x="4" y="76">in[16]</text>';
    o += '<path class="p1-w" d="M490 90 H520"/>';
    o += '<text class="p1-slice-k" x="500" y="76">out[16]</text>';
    return svg(540, 190, o);
  }

  function pcSvg() {
    var o = '';
    var boxes = [
      [40, 'MUX', 'inc'],
      [170, 'MUX', 'load'],
      [300, 'MUX', 'reset']
    ];
    boxes.forEach(function (b) {
      o += '<rect class="p1-gate-path" x="' + b[0] + '" y="50" width="100" height="80" rx="8"/>';
      o += '<text class="p1-slice-t" x="' + (b[0] + 50) + '" y="86">' + b[1] + '</text>';
      o += '<text class="p1-slice-n" x="' + (b[0] + 50) + '" y="106">' + b[2] + '</text>';
      o += '<path class="p1-w" d="M' + (b[0] + 50) + ' 130 V150" stroke-dasharray="3 3"/>';
      o += '<text class="p1-slice-k" x="' + (b[0] + 50) + '" y="166" text-anchor="middle">sel</text>';
    });
    o += '<path class="p1-w" d="M140 90 H170"/>';
    o += '<path class="p1-w" d="M270 90 H300"/>';
    o += '<path class="p1-w" d="M400 90 H430"/>';
    o += '<text class="p1-slice-k" x="436" y="94">out[16]</text>';
    o += '<path class="p1-w" d="M10 90 H40"/>';
    o += '<text class="p1-slice-k" x="4" y="76">in[16]</text>';
    o += '<path class="p1-w" d="M350 130 V170 H40 V130" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-n" x="200" y="188">' + 'out fed back into the incrementer (auto-increment)' + '</text>';
    return svg(560, 200, o);
  }

  var regState = { in: 0x0000, load: 0, out: 0x0000, ticks: 0 };
  var pcState = { in: 0x0000, load: 0, inc: 1, reset: 0, out: 0x0000, ticks: 0 };

  function bitsRowC(k, v, editable, dataK) {
    var cells = '';
    for (var i = 15; i >= 0; i--) {
      var bit = (v >> i) & 1;
      cells += '<span class="b16-cell' + (bit ? ' on' : '') + (editable ? ' is-edit' : '') +
        '" data-k="' + dataK + '" data-bit="' + i + '">' + bit + '</span>';
    }
    return '<div class="b16-row"><span class="b16-k">' + k + '</span><span class="b16-cells">' + cells +
      '</span><span class="b16-hex">0x' + ('000' + (v & 0xFFFF).toString(16).toUpperCase()).slice(-4) + '</span></div>';
  }

  function toggleC(label, on, key) {
    return '<button type="button" class="clk-toggle' + (on ? ' is-on' : '') + '" data-toggle="' + key + '">' +
      label + ' ' + on + '</button>';
  }
  function tickBtn(id) {
    return '<button type="button" class="clk-btn" id="' + id + '">' + 'Tick the clock ↗' + '</button>';
  }

  function regWidget() {
    return '<div class="clk-widget" data-w="reg">' +
      bitsRowC('in', regState.in, true, 'regIn') +
      '<div class="clk-row">' + toggleC('load', regState.load, 'regLoad') + tickBtn('reg-tick') +
      '<span class="clk-out-meta mono">' + (EN ? 'ticks: ' + regState.ticks : '' + regState.ticks + '') + '</span></div>' +
      bitsRowC('out', regState.out, false, '') +
      '</div>';
  }

  function pcWidget() {
    return '<div class="clk-widget" data-w="pc">' +
      bitsRowC('in', pcState.in, true, 'pcIn') +
      '<div class="clk-row">' +
      toggleC('inc', pcState.inc, 'pcInc') +
      toggleC('load', pcState.load, 'pcLoad') +
      toggleC('reset', pcState.reset, 'pcReset') +
      tickBtn('pc-tick') +
      '<span class="clk-out-meta mono">' + (EN ? 'ticks: ' + pcState.ticks : '' + pcState.ticks + '') + '</span></div>' +
      bitsRowC('out', pcState.out, false, '') +
      '</div>';
  }

  function widget() {
    return '<div class="clk-widget">' +
      '<div class="clk-row">' +
      '<label class="g16-field"><span>' + 'in (the value to write)' + '</span>' + bitBtn('in', state.in) + '</label>' +
      '<label class="g16-field"><span>' + 'load (write or not)' + '</span>' + bitBtn('load', state.load) + '</label>' +
      '<button type="button" class="clk-btn" id="clk-tick">' + 'Tick the clock ↗' + '</button>' +
      '</div>' +
      '<div class="clk-out">' +
      '<span class="clk-out-label">out</span>' +
      '<span class="clk-out-val mono' + (state.out ? ' is-on' : '') + '">' + state.out + '</span>' +
      '<span class="clk-out-meta mono">' + (EN ? 'ticks so far: ' + state.ticks : '' + state.ticks + '') + '</span>' +
      '</div>' +
      '<p class="clk-hint">' + (state.load
        ? 'load=1: this tick writes the value of in into out.'
        : 'load=0: nothing changes — out feeds its current value back to itself.') + '</p>' +
      '</div>';
  }

  function view() {
    return '<section class="page-head page-head-clock">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Sequential Logic</p>' +
      '<h1>' + 'Sequential logic: from computing to remembering' + '</h1>' +
      '<p class="page-head-lead">' + 'Everything so far is combinational: change an input and the output follows immediately, and <b>nothing is remembered</b>. ' + '' +
      '' + 'But a CPU must keep a result in a register for the next instruction. What this layer adds is <b>when</b> to update.' + '</p>' +
      '</div></section>' +

      CS.lineNav('sequential', 'wrap') +

      '<section class="clock-section"><div class="wrap">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>' + 'Where memory comes from: two gates locked together' + '</h2>' +
      '<p>' + 'The gates so far are combinational: change an input and the output follows. A number computed by the adder exists on that wire for an instant and <b>is stored nowhere</b>.' + '</p>' +
      '<div class="clock-figure" data-fig="latch">' + latchSvg() + '</div>' +
      '<p>' + 'Wire two NOTs nose to tail: left output to right input, right output back to left input. In steady state <code>Q = NOT(Q′)</code> and <code>Q′ = NOT(Q)</code>, each holding the other — as long as power stays on the state persists. That is <b>bistability</b>, the physical origin of all memory (one bit of SRAM is exactly this).' + '</p>' +
      '<div class="intro-callout">' +
      '<b>' + 'The physical problem: glitches.' + '</b>' + ' Why not simply wire the adder output back to its input and accumulate?' +
      '' + 'Because gates have delay. If bits arrive a few hundred picoseconds apart, the combinational output bounces around and produces glitches.' +
      'Left as an uncontrolled loop, the system would cycle tens of thousands of times in a nanosecond and run away.' +
      '</div>' +
      '<p class="bits-tip">' + 'Why an even number? With an odd number (three NOTs in a ring) every stage inverts and the signal never settles — that is a <b>ring oscillator</b>, not a memory. Only an even number is stable: remembering costs a loop that agrees with itself.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>' + 'DFF: the clock as a sluice gate' + '</h2>' +
      '<p>' + 'A bistable remembers, but you cannot control <b>when</b> it changes: nudge it and it flips at once, outside your control. ' + '' +
      '' + 'To make writing happen only at a defined instant you need <b>edge triggering</b> — that is the DFF.' + '</p>' +
      '<p>' + '<b>DFF</b> (D flip-flop) is the smallest storage element: on each clock edge it latches its input to its output; the rest of the time the output holds, whatever the input does.' + '</p>' +
      '<div class="clock-figure" data-fig="dff">' + dffSvg() + '</div>' +
      '<p class="intro-quote">' + 'The clock is a sluice gate: the water may slosh violently inside the pool (gate delays, glitches), but at the click of the rising edge only the settled level is let through. Discretising time buys the digital system its absolute certainty.' + '</p>' +
      '<p class="bits-tip">' + 'On the left is the symbol: <code>D</code> is the data input, and the small triangle on <code>clk</code> means <b>rising-edge triggered</b>. ' + '' +
      '' + 'On the right is the timing: Q takes D only at the rising edge of clk and holds it in between.' + '</p>' +
      CS.hdlView('dff') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>' + 'Bit: adding a “write or not” switch' + '</h2>' +
      '<p>' + 'With only a DFF it would be written every cycle, but we often want it to <b>hold</b> — so a MUX goes in front: ' + '' +
      '' + 'with <code>load=1</code> it takes the new value, and with <code>load=0</code> it feeds <b>its own output</b> back, which means no change.' + '</p>' +
      '<div class="clock-figure" data-fig="bit">' + bitSvg() + '</div>' +
      widget() +
      CS.hdlView('bit') +
      '<p class="bits-tip">' + 'Note <code>Mux(a=outv, ...)</code>: it reads <code>outv</code>, a copy of the DFF output, not the chip’s <code>out</code> pin — ' +
      '' + '“An output pin cannot be an input” is a hard HDL rule. Feeding an output back through an internal net is common in sequential circuits — that is what makes state.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>' + 'Register: sixteen Bit chips side by side' + '</h2>' +
      '<p>' + 'A 16-bit register is sixteen Bit chips sharing one <code>load</code> — either all 16 bits are written or none move.' + '</p>' +
      '<div class="clock-figure" data-fig="reg">' + regSvg() + '</div>' +
      regWidget() +
      CS.hdlView('register') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>' + 'PC: the register that walks forward on its own' + '</h2>' +
      '<p>' + 'A program counter must do three things: <b>+1</b> (fall through), <b>load a new value</b> (jump) and <b>reset to zero</b>. ' + '' +
      '' + 'Three controls form a chain, later ones winning: <code>reset</code> &gt; <code>load</code> &gt; <code>inc</code>.' + '</p>' +
      '<div class="clock-figure" data-fig="pc">' + pcSvg() + '</div>' +
      pcWidget() +
      CS.hdlView('pc') +
      '<p class="bits-tip">' + 'Reading <code>PARTS</code> once explains the priority: three MUXes in series, the later one winning. reset is last, so it overrides everything.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>' + 'The clock: one beat, two phases' + '</h2>' +
      '<p>' + 'Every sequential element shares one clock line. Two things happen in a cycle:' + '</p>' +
      '<ul class="clock-list">' +
      '<li><b>' + 'Edge' + '</b>' + ': the clock flips and every DFF and register updates at once — the new values are photographed at that instant.</li>' +
      '<li><b>' + 'Settling' + '</b>' + ': between edges the combinational logic (ALU, adders) computes from the new values, waiting for the next edge to store the result.</li>' +
      '</ul>' +
      '<p>' + 'So how many cycles an instruction takes depends on how long the combinational path is — that is the physical meaning of clock frequency: ' +
      'however fast the clock, it must wait for the slowest path to finish.' + '</p>' +
      '</div>' +

      '</div></section>';
  }

  function paint() {
    var w = document.querySelector('.clk-widget[data-w="bit"], .clk-widget:not([data-w])');
    if (w) w.outerHTML = widget();
    var r = document.querySelector('.clk-widget[data-w="reg"]');
    if (r) r.outerHTML = regWidget();
    var q = document.querySelector('.clk-widget[data-w="pc"]');
    if (q) q.outerHTML = pcWidget();
  }

  function mount() {
    var root = document.querySelector('.clock-section');
    if (!root) return;
    paint();

    root.addEventListener('click', function (e) {
      var b = e.target.closest('button.bit[data-bit]');
      if (b) {
        var k = b.dataset.bit;
        state[k] = state[k] ? 0 : 1;
        paint();
        return;
      }
      var cell = e.target.closest('.b16-cell.is-edit');
      if (cell) {
        var key = cell.dataset.k;
        var bit = parseInt(cell.dataset.bit, 10);
        if (key === 'regIn') regState.in = (regState.in ^ (1 << bit)) & 0xFFFF;
        if (key === 'pcIn') pcState.in = (pcState.in ^ (1 << bit)) & 0xFFFF;
        paint();
        return;
      }
      var tg = e.target.closest('[data-toggle]');
      if (tg) {
        var tk = tg.dataset.toggle;
        if (tk === 'regLoad') regState.load = regState.load ? 0 : 1;
        if (tk === 'pcInc') pcState.inc = pcState.inc ? 0 : 1;
        if (tk === 'pcLoad') pcState.load = pcState.load ? 0 : 1;
        if (tk === 'pcReset') pcState.reset = pcState.reset ? 0 : 1;
        paint();
        return;
      }
      if (e.target.id === 'reg-tick') {
        if (regState.load) regState.out = regState.in;
        regState.ticks++;
        paint();
        return;
      }
      if (e.target.id === 'pc-tick') {
        if (pcState.reset) pcState.out = 0;
        else if (pcState.load) pcState.out = pcState.in;
        else if (pcState.inc) pcState.out = (pcState.out + 1) & 0xFFFF;
        pcState.ticks++;
        paint();
        return;
      }
      if (e.target.id === 'clk-tick') {
        if (state.load) state.out = state.in;
        state.ticks++;
        paint();
      }
    });
  }

  return { view: view, mount: mount };
})();
