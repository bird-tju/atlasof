window.CS = window.CS || {};
CS.ComputerUI = (function () {
  'use strict';

  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
  }
  function box(x, y, w, h, title, sub) {
    var o = '<rect class="p1-gate-path" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"/>';
    o += '<text class="p1-slice-t" x="' + (x + w / 2) + '" y="' + (y + h / 2 + (sub ? -4 : 5)) + '">' + title + '</text>';
    if (sub) o += '<text class="p1-slice-n" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 16) + '">' + sub + '</text>';
    return o;
  }

  function memSvg() {
    var o = '';
    var rows = [
      { cond: 'address[14] = 0', name: 'RAM16K', range: '0 – 16383' },
      { cond: 'address[14] = 1，address[13] = 0', name: 'Screen', range: '16384 – 24575' },
      { cond: 'address[14] = 1，address[13] = 1', name: 'Keyboard', range: '24576' }
    ];
    rows.forEach(function (r, i) {
      var y = 40 + i * 54;
      o += '<text class="p1-slice-k" x="10" y="' + (y + 15) + '">' + r.cond + '</text>';
      o += '<path class="p1-w" d="M250 ' + (y + 10) + ' H290"/>';
      o += '<rect class="p1-gate-path" x="290" y="' + (y - 8) + '" width="110" height="36" rx="6"/>';
      o += '<text class="p1-slice-t" x="345" y="' + (y + 15) + '">' + r.name + '</text>';
      o += '<text class="p1-slice-n" x="412" y="' + (y + 15) + '">' + r.range + '</text>';
    });
    o += '<text class="p1-slice-n" x="10" y="200">Read: address[13] picks screen vs keyboard, then address[14] picks RAM vs device. Write: a DMux sends load the other way.</text>';
    return svg(600, 215, o);
  }

  function compSvg() {
    var o = '';
    o += box(30, 60, 110, 56, 'ROM32K', 'built in');
    o += box(220, 60, 120, 90, 'CPU', 'A / D / ALU');
    o += box(430, 60, 130, 90, 'Memory', 'RAM / screen / kbd');
    o += '<path class="p1-w" d="M140 88 H220"/>';
    o += '<text class="p1-slice-k" x="146" y="80">instruction</text>';
    o += '<path class="p1-w" d="M340 80 H430"/>';
    o += '<text class="p1-slice-k" x="346" y="72">addressM / outM / writeM</text>';
    o += '<path class="p1-w" d="M430 125 H340"/>';
    o += '<text class="p1-slice-k" x="346" y="142">inM</text>';
    o += '<path class="p1-w" d="M85 116 V180 H280 V150"/>';
    o += '<text class="p1-slice-k" x="120" y="198">pc → ROM.address</text>';
    return svg(600, 215, o);
  }

  function view() {
    return '<section class="page-head page-head-computer">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Project 5 · The Computer</p>' +
      '<h1>The whole machine: wiring three chips together</h1>' +
      '<p class="page-head-lead">The CPU can execute instructions, but it does not know which instruction it fetched or which memory it wrote. ' +
      'This page does two things: build <b>Memory</b> (RAM + screen + keyboard), then wire <b>CPU + ROM32K + Memory</b> into a machine.</p>' +
      '</div></section>' +

      CS.lineNav('computer', 'wrap') +

      '<section class="clock-section"><div class="wrap">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>Three chips, that is the whole machine</h2>' +
      '<div class="clock-figure" data-fig="comp">' + compSvg() + '</div>' +
      '<table class="layer-table"><thead><tr><th>Chip</th><th>Role</th><th>Source</th></tr></thead><tbody>' +
      '<tr><td class="mono">ROM32K</td><td>Stores instructions, read by address</td><td><b>Built in</b> (provided, not implemented here)</td></tr>' +
      '<tr><td class="mono">CPU</td><td>Executes instructions</td><td>Built on the previous page</td></tr>' +
      '<tr><td class="mono">Memory</td><td>Data + screen + keyboard</td><td>Built on this page</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">The whole machine is six wires: <code>pc</code>, <code>instruction</code>, <code>addressM</code>, <code>outM</code>, <code>writeM</code>, <code>inM</code>.' +
      'This is the <b>Harvard architecture</b> from the <a href="#/intro">prologue</a>: ROM32K and Memory are two separate memories with separate address lines, so one cycle can fetch and access memory at the same time.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>Memory: one address space, three devices</h2>' +
      '<p>Outside it is a memory with a 15-bit address and 16-bit data; inside it splits reads and writes by the top address bits:</p>' +
      '<div class="clock-figure" data-fig="mem">' + memSvg() + '</div>' +
      '<table class="layer-table"><thead><tr><th>Address</th><th>Who</th><th>How it is selected</th></tr></thead><tbody>' +
      '<tr><td class="mono">0 – 16383</td><td>RAM16K</td><td><code>address[14] = 0</code></td></tr>' +
      '<tr><td class="mono">16384 – 24575</td><td>Screen</td><td><code>address[14] = 1</code> and <code>address[13] = 0</code></td></tr>' +
      '<tr><td class="mono">24576</td><td>Keyboard</td><td><code>address[14] = 1</code> and <code>address[13] = 1</code></td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">On a write, a DMux sends <code>load</code> to the right device; on a read, Mux16 selects it back. RAM16K sees only the low 14 address bits and the screen only the low 13 — so each device sees “its own” address.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>The HDL for Memory</h2>' +
      '<p>Keyboard has no inputs (it only outputs), and Screen and RAM16K are built-in chips. Everything else is address decoding:</p>' +
      CS.hdlView('memory') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>Why ROM32K is not implemented</h2>' +
      '<p>ROM is read-only: give it an address and it returns the 16 bits stored there. The course provides <code>ROM32K</code> as a built-in chip, </p>' +
      '<pre class="hdl-code">ROM32K(address=pc, out=instruction);</pre>' +
      '<p>with no <code>load</code> and no clock — the program is already installed before the machine runs. Think of it as an array of 32768 rows.</p>' +
      '<p class="bits-tip">That also explains why <b>Hack cannot modify its own program</b>: ROM is read-only, and program and data live in two places from the start.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>The HDL for Computer</h2>' +
      '<p>The whole machine is one CHIP that connects the three chips:</p>' +
      CS.hdlView('computer') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>One fetch, step by step</h2>' +
      '<table class="layer-table"><thead><tr><th>Step</th><th>Who carries it</th></tr></thead><tbody>' +
      '<tr><td>PC points at an instruction</td><td>the CPU’s <code>pc</code> → <code>ROM32K.address</code></td></tr>' +
      '<tr><td>16 bits come out</td><td><code>ROM32K.out</code> → the CPU’s <code>instruction</code></td></tr>' +
      '<tr><td>Execute</td><td>inside the CPU (ALU + registers)</td></tr>' +
      '<tr><td>Touch memory</td><td><code>addressM / outM / writeM</code> → Memory; <code>inM</code> comes back</td></tr>' +
      '<tr><td>PC advances</td><td>inside the CPU (+1 by default, A on a jump)</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">There is no bus arbitration, no cache, no pipeline: in one beat the signals travel this chain once, then the next beat starts.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">07</span>Boot: what happens after reset</h2>' +
      '<p>When <code>reset = 1</code> the CPU sets PC to 0. On the next beat <code>ROM32K</code> returns the instruction at address 0 — the first line of the program.</p>' +
      '<p>So “power on and run” is one sentence on Hack: <b>clear PC, then keep executing</b>. No operating system, no loader; the program is the numbers in ROM.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">08</span>Hardware done, software enters: how Tetris runs</h2>' +
      '<div class="intro-callout">' +
      '<b>From silicon logic to a tower of computing:</b><br>' +
      'Congratulations: from nothing but NAND gates you have welded together a general-purpose computer that runs programs on its own.<br>' +
      'But the sobering fact: the hardware ticks millions of times a second and knows only the 0 and 1 levels in memory. To write Tetris, would a programmer hand-write hundreds of thousands of lines of binary?' +
      '</div>' +
      '<p>That is the <b>six-storey tower</b> of computing (five layers of software plus the hardware at the bottom):</p>' +
      '<table class="layer-table comp-layers"><thead><tr><th>Layer</th><th>Who</th><th>Responsible for</th><th>Now</th></tr></thead><tbody>' +
      '<tr><td>Layer 6</td><td><b>Tetris</b></td><td>Game logic: rotation, collision detection, scoring</td><td>empty</td></tr>' +
      '<tr><td>Layer 5</td><td><b>Jack language &amp; OS</b></td><td>A small object-oriented language plus a runtime (Math/Memory/Screen/Output)</td><td>empty</td></tr>' +
      '<tr><td>Layer 4</td><td><b>Compiler</b></td><td>Compiles Jack source into stack-based VM bytecode</td><td>empty</td></tr>' +
      '<tr><td>Layer 3</td><td><b>VM translator</b></td><td>Expands push/pop/call bytecode into sequences of Hack assembly</td><td>empty</td></tr>' +
      '<tr><td>Layer 2</td><td><b>Assembler</b></td><td>Turns Hack mnemonics and symbols into 16-bit machine code</td><td class="is-built">built</td></tr>' +
      '<tr><td>Layer 1</td><td><b>Computer hardware</b></td><td><b>The machine you just built</b>: ROM emits instructions, the CPU throws switches, pixels light up</td><td class="is-built">built</td></tr>' +
      '</tbody></table>' +
      '<p class="intro-quote">No magic, only layer upon layer of abstraction and encapsulation. You are standing on the most solid foundation of that tower — look back at every gate and the picture becomes clear.</p>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {}

  return { view: view, mount: mount };
})();
