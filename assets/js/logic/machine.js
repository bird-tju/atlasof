window.CS = window.CS || {};
CS.MachineUI = (function () {
  'use strict';

  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
  }
  function box(x, y, w, h, title, sub) {
    var o = '<rect class="p1-gate-path" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"/>';
    o += '<text class="p1-slice-t" x="' + (x + w / 2) + '" y="' + (y + h / 2 + (sub ? -4 : 4)) + '">' + title + '</text>';
    if (sub) o += '<text class="p1-slice-n" x="' + (x + w / 2) + '" y="' + (y + h / 2 + 16) + '">' + sub + '</text>';
    return o;
  }

  function archSvg() {
    var o = '';
    o += box(30, 40, 110, 60, 'ROM', '' + '32K instructions' + '');
    o += box(30, 150, 90, 52, 'PC', '' + 'next address' + '');
    o += box(240, 90, 120, 100, 'CPU', 'A / D / ALU');
    o += box(440, 30, 140, 210, 'Memory', '' + 'RAM + screen' + '');

    // PC → ROM
    o += '<path class="p1-w" d="M75 150 V100"/>';
    o += '<text class="p1-slice-k" x="82" y="130">address</text>';
    // ROM → CPU
    o += '<path class="p1-w" d="M140 70 H240"/>';
    o += '<text class="p1-slice-k" x="150" y="62">instruction[16]</text>';
    // CPU → PC
    o += '<path class="p1-w" d="M300 190 V236 H75 V202"/>';
    o += '<text class="p1-slice-k" x="186" y="252">next pc</text>';
    // CPU ↔ Memory
    o += '<path class="p1-w" d="M360 105 H440"/>';
    o += '<text class="p1-slice-k" x="368" y="98">address / outM</text>';
    o += '<path class="p1-w" d="M440 165 H360"/>';
    o += '<text class="p1-slice-k" x="368" y="182">inM</text>';
    o += '<path class="p1-w" d="M360 135 H440" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-k" x="368" y="150">load</text>';

    o += '<text class="p1-slice-n" x="300" y="292" text-anchor="middle">' + 'One instruction per cycle: ROM emits it, the CPU executes, A / D / M are written, PC advances' + '</text>';
    return svg(610, 300, o);
  }

  function memMapSvg() {
    var o = '';
    var segs = [
      { x: 20, w: 168, label: 'Data', range: '0 – 16383', cls: 'a' },
      { x: 188, w: 136, label: 'Screen', range: '16384 – 24575', cls: 'b' },
      { x: 324, w: 58, label: 'Keyboard', range: '24576', cls: 'c' },
      { x: 382, w: 120, label: 'Unused', range: '24577 – 32767', cls: 'd' }
    ];
    segs.forEach(function (s) {
      o += '<rect class="ml-bit ' + (s.cls === 'd' ? '' : 'is-on') + '" x="' + s.x + '" y="40" width="' + s.w + '" height="44" rx="4"/>';
      o += '<text class="p1-slice-t" x="' + (s.x + s.w / 2) + '" y="60">' + s.label + '</text>';
      o += '<text class="p1-slice-n" x="' + (s.x + s.w / 2) + '" y="78">' + s.range + '</text>';
    });
    o += '<text class="p1-slice-k" x="20" y="30">' + 'RAM (32K words, 16 bits each)' + '</text>';
    o += '<text class="p1-slice-k" x="470" y="30">' + 'addresses start at 0' + '</text>';
    o += '<text class="p1-slice-n" x="235" y="110" text-anchor="middle">' + 'ROM is separate: 0 – 32767, instructions' + '</text>';
    return svg(560, 130, o);
  }

  function screenSvg() {
    var o = '';
    for (var i = 0; i < 32; i++) {
      var x = 20 + i * 13;
      o += '<rect class="ml-bit is-on" x="' + x + '" y="40" width="11" height="26" rx="2"/>';
    }
    o += '<text class="p1-slice-k" x="20" y="32">' + 'one row = 32 words = 512 pixels' + '</text>';
    o += '<text class="p1-slice-k" x="20" y="84">' + 'each word’s 16 bits = 16 pixels (1 on / 0 off)' + '</text>';

    for (var b = 0; b < 16; b++) {
      var bx = 20 + b * 22;
      var on = b % 3 === 0;
      o += '<rect class="ml-bit' + (on ? ' is-on' : '') + '" x="' + bx + '" y="110" width="18" height="24" rx="3"/>';
      o += '<text class="ml-bit-t" x="' + (bx + 9) + '" y="127">' + (on ? 1 : 0) + '</text>';
    }
    o += '<text class="p1-slice-n" x="20" y="156">' + 'address of row r, word c = 16384 + 32 × r + c' + '</text>';
    return svg(460, 175, o);
  }

  function beatSvg() {
    var steps = EN ? ['fetch', 'execute', 'write back', 'PC+1'] : ['', '', '', 'PC+1'];
    var o = '';
    steps.forEach(function (s, i) {
      var x = 20 + i * 108;
      o += '<rect class="ml-bit is-on" x="' + x + '" y="30" width="94" height="46" rx="8"/>';
      o += '<text class="p1-slice-t" x="' + (x + 47) + '" y="58">' + (i + 1) + '. ' + s + '</text>';
      if (i < 3) o += '<path class="p1-w" d="M' + (x + 94) + ' 53 H' + (x + 108) + '"/>';
    });
    o += '<text class="p1-slice-n" x="20" y="100">' + 'All four happen in one beat, so one instruction = one cycle' + '</text>';
    return svg(460, 115, o);
  }

  function noregSvg() {
    var o = '';
    o += '<rect class="p1-gate-path" x="30" y="50" width="110" height="60" rx="8"/>';
    o += '<text class="p1-slice-t" x="85" y="76">ROM</text>';
    o += '<text class="p1-slice-n" x="85" y="96">' + 'instruction' + '</text>';
    o += '<path class="p1-w" d="M140 80 H230"/>';
    o += '<text class="p1-slice-k" x="146" y="72">instruction[16]</text>';
    o += '<rect class="p1-gate-path" x="230" y="40" width="130" height="80" rx="8"/>';
    o += '<text class="p1-slice-t" x="295" y="70">' + 'Control logic' + '</text>';
    o += '<text class="p1-slice-n" x="295" y="90">' + 'splits bits this beat' + '</text>';
    o += '<path class="p1-w" d="M360 70 H450"/>';
    o += '<text class="p1-slice-k" x="366" y="62">' + 'ALU control bits' + '</text>';
    o += '<path class="p1-w" d="M360 95 H450"/>';
    o += '<text class="p1-slice-k" x="366" y="112">dest / jump</text>';
    o += '<text class="p1-slice-n" x="295" y="150" text-anchor="middle">' + 'No IR: the instruction is decoded directly, never stored' + '</text>';
    return svg(520, 170, o);
  }

  function cycleSvg() {
    var o = '';
    o += '<rect class="p1-gate-path" x="40" y="26" width="150" height="54" rx="8"/>';
    o += '<text class="p1-slice-t" x="115" y="48">' + 'Software needs' + '</text>';
    o += '<text class="p1-slice-n" x="115" y="66">' + 'what programs to write' + '</text>';

    o += '<rect class="p1-gate-path" x="250" y="26" width="150" height="54" rx="8"/>';
    o += '<text class="p1-slice-t" x="325" y="48">' + 'ISA draft' + '</text>';
    o += '<text class="p1-slice-n" x="325" y="66">' + 'format and encoding' + '</text>';

    o += '<rect class="p1-gate-path" x="250" y="130" width="150" height="54" rx="8"/>';
    o += '<text class="p1-slice-t" x="325" y="152">' + 'Hardware cost' + '</text>';
    o += '<text class="p1-slice-n" x="325" y="170">' + 'gates / cycles / registers' + '</text>';

    o += '<rect class="p1-gate-path" x="40" y="130" width="150" height="54" rx="8"/>';
    o += '<text class="p1-slice-t" x="115" y="152">' + 'adjust' + '</text>';
    o += '<text class="p1-slice-n" x="115" y="170">' + 'cut features or add fields' + '</text>';

    o += '<path class="p1-w" d="M190 53 H250"/>';
    o += '<path class="p1-w" d="M325 80 V130"/>';
    o += '<path class="p1-w" d="M250 157 H190"/>';
    o += '<path class="p1-w" d="M115 130 V80"/>';

    o += '<path class="p1-w" d="M250 48 L258 53 L250 58"/>';
    o += '<path class="p1-w" d="M320 130 L325 138 L330 130"/>';
    o += '<path class="p1-w" d="M190 152 L182 157 L190 162"/>';
    o += '<path class="p1-w" d="M110 80 L115 72 L120 80"/>';
    o += '<text class="p1-slice-n" x="325" y="212" text-anchor="middle">' + 'iterate until both sides agree' + '</text>';
    return svg(470, 226, o);
  }

  function view() {
    return '<section class="page-head page-head-machine">' +
      '<div class="wrap">' +
      '<p class="eyebrow">The Hack Computer</p>' +
      '<h1>' + 'Specification: the manual for a machine' + '</h1>' +
      '<p class="page-head-lead">' + 'Before writing programs you need to know what the machine promises: how many parts, how memory is split, where addresses come from, and what one beat can finish. ' + '' +
      '' + 'This page covers the <b>specification</b> only; it does not take the CPU apart.' + '</p>' +
      '</div></section>' +

      CS.lineNav('machine', 'wrap') +

      '<section class="clock-section"><div class="wrap">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>' + 'Four parts, one instruction path' + '</h2>' +
      '<p>' + 'The machine has only four parts: <b>CPU</b>, <b>ROM</b> (instructions), <b>RAM</b> (data, screen, keyboard) and <b>PC</b>. ' + '' +
      '' + 'Three groups of lines connect them: address, data and control.' + '</p>' +
      '<div class="clock-figure" data-fig="arch">' + archSvg() + '</div>' +
      '<table class="layer-table"><thead><tr>' + '<th>Item</th><th>Spec</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td>Word size</td><td class="mono">16 bits</td>' + '</tr>' +
      '<tr>' + '<td>Instruction memory</td><td class="mono">32K × 16 (addresses 0–32767)</td>' + '</tr>' +
      '<tr>' + '<td>Data memory</td><td class="mono">32K × 16 (addresses 0–32767)</td>' + '</tr>' +
      '<tr>' + '<td>Registers</td><td class="mono">A, D, PC</td>' + '</tr>' +
      '<tr>' + '<td>Instruction kinds</td><td class="mono">Two (A and C)</td>' + '</tr>' +
      '<tr>' + '<td>Cycle</td><td>One instruction per beat</td>' + '</tr>' +
      '</tbody></table>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>' + 'The memory map: address is everything' + '</h2>' +
      '<p>' + 'There are no device registers: the screen and keyboard are just <b>memory at particular addresses</b>. A program reaches them exactly as it reaches an ordinary variable.' + '</p>' +
      '<div class="clock-figure" data-fig="memmap">' + memMapSvg() + '</div>' +
      '<table class="layer-table"><thead><tr>' + '<th>Address range</th><th>What it is</th><th>How it is used</th>' + '</tr></thead><tbody>' +
      '<tr><td class="mono">0 – 16383</td>' + '<td>Data</td><td>R0–R15, variables, the stack</td>' + '</tr>' +
      '<tr><td class="mono">16384 – 24575</td>' + '<td>Screen (8K words)</td><td>Write a 1 to light a pixel</td>' + '</tr>' +
      '<tr><td class="mono">24576</td>' + '<td>Keyboard</td><td>Read the scan code of the key held</td>' + '</tr>' +
      '<tr><td class="mono">0 – 32767（ROM）</td>' + (EN ? '<td>Instructions</td><td>Read wherever PC points</td>' : '<td>' + 'instruction' + '') + '</tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'So <code>@SCREEN</code> is just <code>@16384</code> and <code>@KBD</code> is just <code>@24576</code> — predefined symbols in the assembler, not new instructions.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>' + 'Two registers, one address' + '</h2>' +
      '<p>' + '<b>A</b> has two roles: it is a data register and an <b>address register</b>. When the CPU touches memory it uses the value in A: ' + '' +
      '' + '<code>M</code> always reads and writes <code>RAM[A]</code>.' + '</p>' +
      '<p>' + '<b>D</b> holds data only. So moving a value out of memory takes two steps: put the address in A, then use M.' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>Register</th><th>Role</th><th>Who can write it</th>' + '</tr></thead><tbody>' +
      '<tr><td class="mono">A</td>' + '<td>Data + address (M = RAM[A])</td><td>The A instruction, or dest of a C instruction</td>' + '</tr>' +
      '<tr><td class="mono">D</td>' + '<td>Data only</td><td>dest of a C instruction</td>' + '</tr>' +
      '<tr><td class="mono">PC</td>' + '<td>Address of the next instruction</td><td>Only jumps and reset</td>' + '</tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'This is why every memory operation in machine language is preceded by <code>@address</code> — not verbosity, but the fact that the hardware has one address line, and it is wired to A.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>' + 'Four things per beat' + '</h2>' +
      '<p>' + 'One tick of the clock and the machine does four steps in lockstep. They are <b>not four cycles</b>; they are four stages of the same cycle:' + '</p>' +
      '<div class="clock-figure" data-fig="beat">' + beatSvg() + '</div>' +
      '<ul class="clock-list">' +
      '<li>' + '<b>Fetch</b>: send the 16-bit instruction at ROM[PC] to the CPU.' + '</li>' +
      '<li>' + '<b>Execute</b>: compute once as the instruction says (the ALU), or just load a constant into A.' + '</li>' +
      '<li>' + '<b>Write back</b>: store the result into some of A / D / M.' + '</li>' +
      '<li>' + '<b>PC+1</b>: advance by default; if the instruction jumps and its condition holds, load A instead.' + '</li>' +
      '</ul>' +
      '<p class="bits-tip">' + '"One computation per instruction" is not laziness: the ALU can only run once per cycle.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>' + 'Screen: 8K words, 512×256 pixels' + '</h2>' +
      '<p>' + 'The screen is not drawn, it is <b>written</b>. One row of 512 pixels is 32 words, and each word’s 16 bits are 16 pixels.' + '</p>' +
      '<div class="clock-figure" data-fig="screen">' + screenSvg() + '</div>' +
      '<p class="bits-tip">' + 'Address arithmetic: row <code>r</code>, word <code>c</code> is <code>16384 + 32 × r + c</code>; ' + '' +
      '' + 'to light pixel <code>b</code>, set that bit to 1. 256 rows × 32 = 8192 words, exactly 8K.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>' + 'Boot: PC starts at 0' + '</h2>' +
      '<p>' + 'On reset <code>PC = 0</code> and the CPU immediately reads ROM[0]. So <b>the first instruction must live at address 0</b> — there is no operating system, no loader; power on and it runs.' + '</p>' +
      '<p>' + 'That is why assembly programs often start with:' + '</p>' +
      '<pre class="hdl-code">@0\n0;JMP        ' + '// jump to the real entry point (or just start here)' + '</pre>' +
      '<p class="bits-tip">' + 'A program is always loaded from ROM[0]; if you write a label such as <code>(LOOP)</code>, the assembler turns it into a line number in ROM.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">07</span>' + 'Design thinking: three circles bound the machine' + '</h2>' +
      '<p>' + 'The spec is not a wish list; it is the intersection of three circles.' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>Circle</th><th>The question it asks</th><th>Hack’s answer</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td><b>Lower bound</b></td><td>Can it compute anything computable?</td><td>Read/write memory, add and subtract, conditional jump, unconditional jump — all four present</td>' + '</tr>' +
      '<tr>' + '<td><b>Programmability</b></td><td>Do common statements need detours?</td><td>18 ALU functions covering constants, moves, negation, add/subtract, and/or</td>' + '</tr>' +
      '<tr>' + '<td><b>Buildability</b></td><td>Can a student build it from the chips at hand?</td><td>One adder, one AND gate, a few multiplexers</td>' + '</tr>' +
      '</tbody></table>' +
      '<p>' + '<b>The bar for universality is very low</b>: in theory, memory access plus subtraction plus a conditional branch is enough for Turing completeness (one-instruction computers exist).' + '' +
      '' + 'So only four or five of those 18 functions are truly necessary; the rest <b>trade a handful of gates for a lot of writing comfort</b>.' + '</p>' +
      '<p>' + 'Acceptance testing is plain: try the programs you must be able to write — multiplication (repeated addition), filling the screen, echoing the keyboard, a call stack.' + '' +
      '' + 'If they can be written at all, the lower bound holds; if they write smoothly, programmability is enough.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">08</span>' + 'Why there is no instruction register' + '</h2>' +
      '<p>' + 'A classic CPU has an <b>IR</b> (instruction register): the fetched instruction is stored, then decoded slowly over several cycles. Hack has none —' + '' +
      '' + 'because <b>an instruction lives for exactly one cycle</b>.' + '</p>' +
      '<div class="clock-figure" data-fig="noreg">' + noregSvg() + '</div>' +
      '<table class="layer-table"><thead><tr>' + '<th></th><th>With an IR (multi-cycle)</th><th>Hack (single cycle)</th>' + '</tr></thead><tbody>' +
      '<tr><td>' + 'Where it lives' + '</td><td>' + 'An IR, 16 bits' + '</td><td>' + 'Nowhere: ROM’s output feeds the control logic directly' + '</td></tr>' +
      '<tr>' + '<td>One instruction</td><td>Several cycles (fetch / decode / execute…)</td><td>Everything in one cycle</td>' + '</tr>' +
      '<tr>' + '<td>Reuse</td><td>Yes (microcode, replay)</td><td>No, discarded after use</td>' + '</tr>' +
      '<tr>' + '<td>Cost</td><td>16 more bits of register, write control, timing</td><td>Saved — but the instruction must be fully used in that beat</td>' + '</tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'Put another way: Hack’s instruction format <b>is</b> the format of the control signals. The 16 bits from ROM are split within the beat into ALU control bits, dest and jump — nothing is buffered.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">09</span>' + 'Why two registers, A and D, are enough' + '</h2>' +
      '<p>' + 'Two reasons: one from encoding, one from function.' + '</p>' +
      '<p>' + '<b>Encoding</b>: the 16 bits are already full — opcode, comp, dest, jump. More registers mean wider dest and source fields,' + '' +
      '' + 'and comp only has 6 bits to spare — one more register and the whole format changes.' + '</p>' +
      '<p>' + '<b>Function</b>: <code>A</code> does two jobs (data and address), <code>D</code> is the accumulator.' + '' +
      '' + 'Two registers plus memory can express any program; when you run out, spill temporaries to RAM.' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>Register</th><th>Role</th><th>What nothing else can do</th>' + '</tr></thead><tbody>' +
      '<tr><td class="mono">A</td>' + '<td>Data register + address register</td><td>The only register that can hold an address (M = RAM[A])</td>' + '</tr>' +
      '<tr><td class="mono">D</td>' + '<td>Accumulator</td><td>The ALU’s x input always comes from D</td>' + '</tr>' +
      '<tr><td class="mono">PC</td>' + '<td>Next instruction address</td><td>Maintained by hardware; programs change it only by jumping</td>' + '</tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'The price is real: too many temporaries and you spill to RAM, so Hack assembly needs careful use of D and A.' + '' +
      '' + 'Real CPUs have 16–32 registers for exactly this reason — at the cost of more encoding bits and decode logic.' + '</p>' +
      '</div>' +

            '<div class="clock-block">' +
      '<h2><span class="bits-num">10</span>' + 'What the instruction set is designed from' + '</h2>' +
      '<p>' + 'An instruction set is a <b>contract between software and hardware</b>: software promises to issue only these commands; hardware promises to finish each in one cycle.' + '' +
      '' + 'So it is not designed from "what would be nice" but from four sources asking at once.' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>Source</th><th>What it asks for</th><th>How Hack answers</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td><b>Hardware</b></td><td>Instructions can only use what the datapath has</td><td>Only A and D; the ALU has only 18 functions</td>' + '</tr>' +
      '<tr>' + '<td><b>Software</b></td><td>Common statements must be expressible directly</td><td>comp covers constants, moves, negation, add/subtract, and/or</td>' + '</tr>' +
      '<tr>' + '<td><b>Cost</b></td><td>Decoding must be simple and gate count small</td><td>Fixed 16 bits; the top two bits identify the instruction</td>' + '</tr>' +
      '<tr>' + '<td><b>Compatibility</b></td><td>Existing software must not be invalidated</td><td>Hack carries no legacy, so it starts from zero</td>' + '</tr>' +
      '</tbody></table>' +
      '<p>' + '<b>The derivation chain</b> (each step forced by the previous one):' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>Given</th><th>It forces</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td>16-bit words</td><td>Instructions are 16 bits</td>' + '</tr>' +
      '<tr>' + '<td>One instruction per cycle</td><td>Instruction bits must <b>be</b> the control bits; no microcode</td>' + '</tr>' +
      '<tr>' + '<td>Only A and D</td><td>dest needs 3 bits (A / D / M)</td>' + '</tr>' +
      '<tr>' + '<td>18 ALU functions</td><td>comp needs 7 bits (a plus 6 control bits)</td>' + '</tr>' +
      '<tr>' + '<td>Jumps read zr / ng</td><td>jump needs 3 bits (6 conditions, plus no jump)</td>' + '</tr>' +
      '<tr>' + '<td>15-bit addresses</td><td>An A instruction is 0 plus a 15-bit value</td>' + '</tr>' +
      '</tbody></table>' +
      '<p>' + 'Add the fields up: 3 (opcode) + 1 (a) + 6 (comp) + 3 (dest) + 3 (jump) = 16.' + '' +
      '' + '<b>The format was not chosen and then filled; the content filled all 16 bits.</b>' + '</p>' +
      '<p>' + '<b>The classic trade-offs</b> (every ISA picks one; Hack’s choice in bold):' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>Dimension</th><th>Options</th><th>Hack</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td>Instruction length</td><td>Fixed / variable</td><td><b>Fixed 16</b> (decode reads the top bit only)</td>' + '</tr>' +
      '<tr>' + '<td>Operand style</td><td>Register-register / register-memory / accumulator</td><td><b>Accumulator</b> (D + A/M)</td>' + '</tr>' +
      '<tr>' + '<td>Registers</td><td>Few (save encoding) / many (save memory traffic)</td><td><b>Two</b></td>' + '</tr>' +
      '<tr>' + '<td>Addressing</td><td>Direct / indirect / indexed</td><td><b>Indirect</b> (M = RAM[A])</td>' + '</tr>' +
      '<tr>' + '<td>Instruction count</td><td>Few (simple) / many (expressive)</td><td><b>Two formats</b></td>' + '</tr>' +
      '<tr>' + '<td>Field layout</td><td>Packed / regular</td><td><b>Regular</b> (fixed fields, zero decode cost)</td>' + '</tr>' +
      '</tbody></table>' +
      '<p>' + '<b>How to check the design</b> — not by feel, but with four tests:' + '</p>' +
      '<ul class="clock-list">' +
      '' + '<li><b>Expression</b>: can you write multiplication, screen drawing, keyboard echo and a call stack?</li>' + '' +
      '' + '<li><b>Encoding</b>: do all fields fit in the word? (Hack comes to exactly 16.)</li>' + '' +
      '' + '<li><b>Cost</b>: how many gate levels to decode? Hack needs the top two bits.</li>' + '' +
      '' + '<li><b>Writing</b>: how many instructions does a common statement take? <code>a = a + 1</code> is two in Hack: <code>@a; M=M+1</code>.</li>' + '' +
      '</ul>' +
      '<p class="bits-tip">' + 'This is why Hack’s instruction set looks simple: it is not a cut-down version but <b>the only solution under three constraints — 16 bits, one cycle, two registers</b>.' + '</p>' +
      '</div>' +


            '<div class="clock-block">' +
      '<h2><span class="bits-num">11</span>' + 'Design order: which comes first' + '</h2>' +
      '<p>' + 'In real engineering, ISA and hardware are <b>polished against each other</b>: needs come first, then a draft of instructions, then a cost estimate; what is too expensive gets cut, and then you check the software again.' +
      '' + 'Hack takes one edge of that loop — <b>hardware first</b>.' + '</p>' +
      '<div class="clock-figure" data-fig="cycle">' + cycleSvg() + '</div>' +
      '<table class="layer-table"><thead><tr>' + '<th>Mode</th><th>Order</th><th>Fits</th><th>Examples</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td><b>Hardware first</b></td><td>Build the circuit, then wrap its abilities as instructions</td><td>Goal is buildability, with budget or process limits</td><td>Early computers, <b>Hack</b>, teaching CPUs</td>' + '</tr>' +
      '<tr>' + '<td><b>ISA first</b></td><td>Decide what software needs, then design hardware</td><td>Goal is comfortable programming, with legacy compatibility</td><td>IBM 360, x86 clones</td>' + '</tr>' +
      '<tr>' + '<td><b>Co-design</b></td><td>Draft → cost → revise</td><td>Both matter, and schedule is flexible</td><td>ARM, RISC-V</td>' + '</tr>' +
      '</tbody></table>' +
      '<p>' + '<b>Hack’s actual order</b>: gates (P1) → the ALU’s 18 functions (P2) → registers and RAM (P3) → the machine spec → the instruction format.' + '' +
      '' + 'The format comes last, and it is almost forced by everything before it rather than designed.' + '</p>' +
      '<p>' + '<b>So why does the course give you the ISA before the CPU?</b> Because the CPU needs a target: without knowing what instructions look like,' + '' +
      'you would not know what the control logic decodes. The order is “hand over the contract, then honour it” — and the client side of that contract is what you built in P1–P3.' + '</p>' +
      '<table class="layer-table"><thead><tr>' + '<th>If…</th><th>Then</th>' + '</tr></thead><tbody>' +
      '<tr>' + '<td>The goal is a working machine from limited gates</td><td><b>Hardware first</b></td>' + '</tr>' +
      '<tr>' + '<td>The goal is easy compilation and programming</td><td><b>ISA first</b></td>' + '</tr>' +
      '<tr>' + '<td>Both, with a flexible schedule</td><td><b>Co-design</b>: draft, estimate, revise</td>' + '</tr>' +
      '</tbody></table>' +
      '<p>' + 'The rule is one sentence: <b>satisfy the harder constraint first</b>. Hack’s hard constraint is that a student can build it from the chips at hand,' + '' +
      '' + 'so hardware comes first.' + '</p>' +
      '<p class="bits-tip">' + 'A counter-example: starting from the ISA would probably give "8 general registers + shifts + multiply" — reasonable sounding,' + '' +
      '' + 'but 16 bits cannot hold fields for 8 registers, and a multiplier costs thousands of gates. ISA-first tempts you with features and charges you in buildability.' + '</p>' +
      '</div>' +


            '</div></section>';
  }

  function mount() {}

  return { view: view, mount: mount };
})();
