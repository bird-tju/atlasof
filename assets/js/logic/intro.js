window.CS = window.CS || {};
CS.IntroUI = (function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }
  function svg(w, h, inner, cls) {
    return '<svg class="intro-svg ' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" role="img">' +
      '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>' +
      inner + '</svg>';
  }
  function box(x, y, w, h, title, sub, tone, cls) {
    var s = '<rect class="bx ' + (cls || '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"/>';
    if (tone) s = '<g class="tone-' + tone + '">' + s;
    s += '<text class="bx-t" x="' + (x + 12) + '" y="' + (y + 22) + '">' + esc(title) + '</text>';
    if (sub) s += '<text class="bx-s" x="' + (x + 12) + '" y="' + (y + 39) + '">' + esc(sub) + '</text>';
    if (tone) s += '</g>';
    return s;
  }
  function line(x1, y1, x2, y2, cls, label, lx, ly) {
    var s = '<path class="ln ' + (cls || '') + '" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" marker-end="url(#ah)"/>';
    if (label) s += '<text class="ln-l" x="' + (lx || (x1 + x2) / 2) + '" y="' + (ly || (y1 + y2) / 2 - 6) + '">' + esc(label) + '</text>';
    return s;
  }
  function curve(x1, y1, x2, y2, cls, label, lx, ly) {
    var mx = (x1 + x2) / 2;
    var s = '<path class="ln ' + (cls || '') + '" d="M' + x1 + ' ' + y1 + ' C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + x2 + ' ' + y2 + '" marker-end="url(#ah)"/>';
    if (label) s += '<text class="ln-l" x="' + (lx || mx) + '" y="' + (ly || (y1 + y2) / 2 - 4) + '">' + esc(label) + '</text>';
    return s;
  }

  function figArch() {
    var out = '';
    out += '<text class="cap" x="186" y="26">von Neumann</text>';
    out += '<text class="cap" x="560" y="26">Harvard</text>';

    out += box(96, 44, 180, 54, 'CPU', '', 'eng');
    out += box(96, 276, 180, 56, 'Memory', 'instructions + data', 'mem');
    out += '<path class="ln data" d="M186 98 V276" marker-start="url(#ah)" marker-end="url(#ah)"/>';
    out += '<text class="ln-l" x="236" y="176">one shared bus</text>';
    out += '<text class="ln-l" x="236" y="196">fetch and load both go here</text>';

    out += box(470, 44, 180, 54, 'CPU', '', 'eng');
    out += box(412, 276, 150, 56, 'Instruction memory', 'ROM', 'mem');
    out += box(578, 276, 150, 56, 'Data memory', 'RAM', 'mem');
    out += line(505, 98, 487, 276, 'addr', 'fetch', 470, 190);
    out += line(630, 98, 653, 276, 'data', 'load', 676, 190);
    out += '<text class="ln-l" x="560" y="350">separate paths</text>';

    return svg(760, 380, out);
  }

  var CYCLE_STEPS = [
    { n: '① Fetch', d: 'PC puts out the address; the instruction is read from instruction memory into IR.', w: ['c-w1', 'c-w2'], b: ['c-ip', 'c-memi', 'c-ir'] },
    { n: '② Decode', d: 'IR hands the instruction to the control unit, which raises the control signals.', w: ['c-w3', 'c-w4'], b: ['c-ir', 'c-ctrl', 'c-alu'] },
    { n: '③ Operands', d: 'The register sends an address and one operand to the ALU; the other operand is read from data memory.', w: ['c-w5', 'c-w6', 'c-w7'], b: ['c-reg', 'c-memd', 'c-alu'] },
    { n: '④ Execute', d: 'The ALU computes the result as directed.', w: [], b: ['c-alu'] },
    { n: '⑤ Write back', d: 'The result returns to the register; a store instruction also writes it into data memory.', w: ['c-w8', 'c-w9'], b: ['c-alu', 'c-reg', 'c-memd'] },
    { n: '⑥ Update', d: 'PC points to the next instruction and the cycle repeats.', w: [], b: ['c-ip'] }
  ];

  function figCycleAnim() {
    var o = '';
    // CPU
    o += '<rect class="cb-frame" x="30" y="40" width="700" height="130" rx="12"/>';
    o += '<text class="cb-cap" x="46" y="62">CPU</text>';
    o += '<rect class="cb" id="c-ip" x="50" y="78" width="95" height="66" rx="8"/><text class="cb-t" x="97" y="106">PC</text><text class="cb-s" x="97" y="124">' + 'address' + '</text>';
    o += '<rect class="cb" id="c-ir" x="160" y="78" width="95" height="66" rx="8"/><text class="cb-t" x="207" y="106">IR</text><text class="cb-s" x="207" y="124">' + 'instruction' + '</text>';
    o += '<rect class="cb" id="c-ctrl" x="270" y="78" width="120" height="66" rx="8"/>Control</text>';
    o += '<rect class="cb" id="c-reg" x="400" y="78" width="100" height="66" rx="8"/>Registers</text>';
    o += '<rect class="cb" id="c-alu" x="530" y="78" width="120" height="66" rx="8"/><text class="cb-t" x="590" y="106">ALU</text><text class="cb-s" x="590" y="124">' + 'compute' + '</text>';

    o += '<rect class="cb-bus" x="30" y="250" width="700" height="46" rx="8"/>';
    o += '<text class="cb-cap" x="44" y="268">System bus</text>';
    o += '<text class="cb-bus-l" x="44" y="283">address / data / control</text>';

    o += '<rect class="cb-frame" x="30" y="320" width="700" height="110" rx="12"/>';
    o += '<text class="cb-cap" x="46" y="342">Memory</text>';
    o += '<rect class="cb" id="c-memi" x="45" y="352" width="330" height="62" rx="8"/>Instructions</text>';
    o += '<rect class="cb" id="c-memd" x="395" y="352" width="320" height="62" rx="8"/>Data</text>';

    o += '<path class="w" id="c-w1" d="M97 144 V352" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="112" y="226">address</text>';
    o += '<path class="w" id="c-w2" d="M207 352 V144" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="222" y="232">instruction</text>';
    o += '<path class="w" id="c-w3" d="M255 111 H270" marker-end="url(#ah)"/>';
    o += '<path class="w" id="c-w4" d="M330 78 V56 H590 V78" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="460" y="50">control</text>';
    o += '<path class="w" id="c-w5" d="M450 144 V352" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="465" y="226">address</text>';
    o += '<path class="w" id="c-w6" d="M590 352 V144" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="605" y="232">data</text>';
    o += '<path class="w" id="c-w7" d="M500 96 H530" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="512" y="66">read</text>';
    o += '<path class="w" id="c-w8" d="M530 126 H500" marker-end="url(#ah)"/>';
    o += '<path class="w w-dash" id="c-w9" d="M420 144 V352" marker-end="url(#ah)"/>';
    o += '<text class="w-l" x="404" y="232">store</text>';
    o += '<text class="w-l" x="512" y="160">write back</text>';

    return svg(760, 450, o, 'cycle-svg');
  }

  function cyclePlayer() {
    var dots = CYCLE_STEPS.map(function (st, i) {
      return '<button class="cyc-dot' + (i === 0 ? ' is-on' : '') + '" data-i="' + i + '" aria-label="' + st.n + '">' + (i + 1) + '</button>';
    }).join('');
    return '<div class="cycle-player">' +
      figCycleAnim() +
      '<div class="cyc-bar">' +
      '<button class="cyc-btn" data-act="prev" aria-label="Previous step">◀</button>' +
      '<button class="cyc-btn cyc-play" data-act="play" aria-label="Play">▶ Play</button>' +
      '<button class="cyc-btn" data-act="next" aria-label="Next step">▶</button>' +
      '<span class="cyc-step">' + CYCLE_STEPS[0].n + '</span>' +
      '<span class="cyc-desc">' + CYCLE_STEPS[0].d + '</span>' +
      '</div>' +
      '<div class="cyc-dots">' + dots + '</div>' +
      '</div>';
  }

  function clkMark(x, y) {
    return '<path class="clk-m" d="M' + (x - 6) + ' ' + y + ' L' + (x + 6) + ' ' + y + ' L' + x + ' ' + (y + 9) + ' Z"/>';
  }

  function view() {
    return '<section class="page-head page-head-intro">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Prologue</p>' +
      '<h1>Why computers can be universal</h1>' +
      '<p class="page-head-lead">This series starts from a single NAND gate and builds, in HDL, all the way to a computer that runs programs. ' +
      'But before that, answer the question in the title: why can a machine be <b>universal</b>? No parts are built here — only the three preconditions: ' +
      '<b>what computation is</b> (the Turing machine), <b>what universal means</b> (programs are data), and <b>where instructions and data live</b> (von Neumann vs Harvard).' +
      '</div></section>' +

      CS.lineNav('intro', 'wrap') +

      '<section class="intro-section"><div class="wrap">' +

      /* 0.1 */
      '<div class="intro-block">' +
      '<h2><span class="bits-num">0.1</span>The Turing machine: three things</h2>' +
      '<p>In 1936, Turing abstracted computation into a machine with only three things:</p>' +
      '<table class="layer-table intro-map">' +
      '<thead><tr><th>Thing</th><th>What it is</th></tr></thead><tbody>' +
      '<tr><td class="mono">Tape</td><td>An endless sequence of cells, each holding one symbol; the head sits on one of them</td></tr>' +
      '<tr><td class="mono">Head</td><td>Reads the current symbol, may rewrite it, and moves one cell left or right</td></tr>' +
      '<tr><td class="mono">State table</td><td>A rule table: given the current state and the symbol read, it decides what to write, where to move, and which state comes next</td></tr>' +
      '</tbody></table>' +
      '<p>So one <strong>step</strong> is five things: <b>read</b> the cell → <b>look it up</b> → <b>write</b> → <b>move</b> → <b>change state</b>.</p>' +
      '<p class="bits-tip">Note: a Turing machine has <b>no clock</b>. A step is a logical unit, not a time unit — each step is assumed to be instantaneous.</p>' +
      '</div>' +

      /* 0.2 */
      '<div class="intro-block">' +
      '<h2><span class="bits-num">0.2</span>What "universal" means</h2>' +
      '<p>An ordinary Turing machine does one thing: its state table is designed for one task. A different task needs a different machine.</p>' +
      '<p>A <b>universal Turing machine</b> is different: encode another machine\'s state table <strong>as a string on the tape</strong>, and it can read that description and simulate the machine.</p>' +
      '<p>This is the first rigorous definition of a general-purpose computer: <strong>not a machine that adds, but a machine that can read how someone else computes</strong>.</p>' +
      '<p>It also turns <strong>programs into data</strong> for the first time: a new algorithm needs a new tape, not new hardware.</p>' +
      '<p class="bits-tip">But this is still theory: the universal machine is an <b>interpreter</b>, re-reading the description at every step, far too slow to be useful — and its tape is infinite.</p>' +
      '<p>Turning it into a machine you can build took another decade.</p>' +
      '</div>' +

      /* 0.3 */
      '<div class="intro-block">' +
      '<h2><span class="bits-num">0.3</span>The von Neumann architecture: from idea to blueprint</h2>' +
      '<p>In June 1945 a document titled <em>First Draft of a Report on the EDVAC</em> circulated at the Moore School. It turned Turing\'s idea into something that could be built.</p>' +
      '<p>The report offered two things: <b>five parts</b>, and <b>one rule</b>.</p>' +
      '<table class="layer-table intro-map">' +
      '<thead><tr><th>The five parts</th><th>What they do</th></tr></thead><tbody>' +
      '<tr><td>Arithmetic unit</td><td>Arithmetic and logic</td></tr>' +
      '<tr><td>Control unit</td><td>Fetch, decode, issue commands</td></tr>' +
      '<tr><td>Memory</td><td>Holds the program, and the data</td></tr>' +
      '<tr><td>Input / output</td><td>Exchange with the outside world</td></tr>' +
      '</tbody></table>' +
      '<p>The rule: <strong>program and data live in the same memory, addressed the same way</strong>. The control unit can then fetch instructions the way it fetches data — that is the <b>stored program</b>.</p>' +
      '<p>Hence the loop: <b>fetch → decode → execute</b>. The control unit reads an instruction from memory, decodes it into control signals, and drives the arithmetic unit.</p>' +
      '<h3 class="intro-h3">One cycle: how information moves</h3>' +
      '<p>Press Next or Play to see what moves at each step, and along which path. Everything entering or leaving memory travels the <b>system bus</b> — address, data and control lines.</p>' +
      cyclePlayer() +
      '<b>A register</b> is a small 16-bit box that plays two roles: it is a <b>source of ALU operands</b> and the place results <b>land</b>.' +
      'So one operation needs only two operands — one in a register, one in memory. Early machines had a single such register, which is exactly why instructions could be short. <b>Where the result goes is decided by the instruction</b>: arithmetic writes back to the register, a store writes into memory.' +
      '<b>The instruction register (IR)</b> holds the fetched instruction. If fetch and decode happen in different cycles, you need it.' +
      '<p>It has three consequences:</p>' +
      '<ul class="intro-list">' +
      '<li><b>No rewiring to change programs</b>: load a new program instead — on ENIAC a new task meant days of rewiring.</li>' +
      '<li><b>Programs can modify programs</b>: loaders, compilers and self-modifying code all rest on this.</li>' +
      '<li><b>Instructions need a fixed encoding</b>: they share memory with data, so they must be distinguishable and readable by the fetch unit.</li>' +
      '</ul>' +
      '<p class="intro-quote">Stored program = programs become data.</p>' +
      '<table class="layer-table intro-map">' +
      '<thead><tr><th>The five EDVAC parts</th><th>Our machine</th></tr></thead><tbody>' +
      '<tr><td>Arithmetic unit</td><td>ALU</td></tr>' +
      '<tr><td>Control unit</td><td>PC + decoder</td></tr>' +
      '<tr><td>Memory</td><td>ROM (instructions) + RAM (data)</td></tr>' +
      '<tr><td>Input / output</td><td>Input register / display</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">The name is a little misleading: the "von Neumann architecture" summarises discussions in the Moore School team (Eckert, Mauchly, von Neumann and others), but the report carried only von Neumann\'s name.</p>' +
      '<p class="bits-tip">Timeline: the 1945 report → 1948, the Manchester Baby runs a stored program → 1949, EDSAC makes it practical.</p>' +
      '</div>' +

      /* 0.5 */
      '<div class="intro-block">' +
      '<h2><span class="bits-num">0.4</span>von Neumann vs Harvard</h2>' +
      '<p>After the stored program, one question remains: <strong>do instructions and data share one memory</strong>? Both answers have names.</p>' +
      figArch() +
      '<table class="layer-table intro-map">' +
      '<thead><tr><th></th><th>von Neumann</th><th>Harvard</th></tr></thead><tbody>' +
      '<tr><td>Memory</td><td>One, holding instructions and data together</td><td>Two, kept apart</td></tr>' +
      '<tr><td>Bus</td><td>One set</td><td>Two sets</td></tr>' +
      '<tr><td>Fetch and load</td><td><b>Cannot overlap</b> — they share one path</td><td><b>Can overlap</b></td></tr>' +
      '<tr><td>Programs modifiable?</td><td>Yes, instructions are writable</td><td>Instructions are read-only; <b>no self-modification</b></td></tr>' +
      '<tr><td>Typical</td><td>General CPUs, the instruction path of GPUs</td><td>Microcontrollers, DSPs, most embedded processors</td></tr>' +
      '</tbody></table>' +
      '<div class="intro-callout"><b>The von Neumann bottleneck:</b> fetch and load share one bus, so a faster CPU still queues. Harvard splits that path with two memories — the price is read-only instructions, so a program cannot change itself.</div>' +
      '<div class="intro-callout"><b>Which one is Hack?</b> The Hack we build later is <b>Harvard</b>: ROM32K holds only instructions, RAM16K holds only data, and two 15-bit address lines run separately. That lets it fetch and access memory in the same cycle, at the cost of not modifying itself.</div>' +
      '<p class="intro-quote">von Neumann: one memory for two things. Harvard: two memories, one thing each.</p>' +
      '</div>' +

      /* 0.6 */
      '</div></section>';
  }

  function mount() {
    var root = document.querySelector('.cycle-player');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    var i = 0, timer = null, steps = CYCLE_STEPS;

    function paint() {
      steps.forEach(function (st, k) {
        st.w.forEach(function (id) { var e = document.getElementById(id); if (e) e.classList.toggle('is-on', k === i); });
        st.b.forEach(function (id) { var e = document.getElementById(id); if (e) e.classList.toggle('is-on', k === i); });
      });
      root.querySelector('.cyc-step').textContent = steps[i].n;
      root.querySelector('.cyc-desc').textContent = steps[i].d;
      root.querySelectorAll('.cyc-dot').forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    }
    function go(n) { i = (n + steps.length) % steps.length; paint(); }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      root.querySelector('.cyc-play').textContent = EN ? '▶ Play' : '';
    }
    function play() {
      if (timer) { stop(); return; }
      root.querySelector('.cyc-play').textContent = EN ? '❙❙ Pause' : '';
      timer = setInterval(function () {
        if (!document.body.contains(root)) { clearInterval(timer); timer = null; return; }
        go(i + 1);
      }, 1900);
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-act]') : null;
      if (b) {
        if (b.dataset.act === 'next') { stop(); go(i + 1); }
        else if (b.dataset.act === 'prev') { stop(); go(i - 1); }
        else if (b.dataset.act === 'play') play();
        return;
      }
      var d = e.target.closest ? e.target.closest('[data-i]') : null;
      if (d) { stop(); go(+d.dataset.i); }
    });
    paint();
  }

  return { view: view, mount: mount };
})();
