window.CS = window.CS || {};
CS.MLUI = (function () {
  'use strict';

  var COMP = {
    '0': '0101010', '1': '0111111', '-1': '0111010', 'D': '0001100',
    'A': '0110000', '!D': '0001101', '!A': '0110001', '-D': '0001111',
    '-A': '0110011', 'D+1': '0011111', 'A+1': '0110111', 'D-1': '0001110',
    'A-1': '0110010', 'D+A': '0000010', 'D-A': '0010011', 'A-D': '0000111',
    'D&A': '0000000', 'D|A': '0010101',
    'M': '1110000', '!M': '1110001', '-M': '1110011',
    'M+1': '1110111', 'M-1': '1110010', 'D+M': '1000010', 'D-M': '1010011',
    'M-D': '1000111', 'D&M': '1000000', 'D|M': '1010101'
  };
  var JMP = { '': '000', 'JGT': '001', 'JEQ': '010', 'JGE': '011', 'JLT': '100', 'JNE': '101', 'JLE': '110', 'JMP': '111' };
  var JMP_TEXT = {
    'JGT': 'result &gt; 0', 'JEQ': 'result = 0', 'JGE': 'result ≥ 0',
    'JLT': 'result &lt; 0', 'JNE': 'result ≠ 0', 'JLE': 'result ≤ 0', 'JMP': 'always'
  };
  var PREDEF = { 'SP': 0, 'LCL': 1, 'ARG': 2, 'THIS': 3, 'THAT': 4, 'SCREEN': 16384, 'KBD': 24576 };
  for (var i = 0; i < 16; i++) PREDEF['R' + i] = i;



  var state = { dest: ['D'], comp: 'D+1', jump: '' };

  function bin16(n) { return ('0000000000000000' + (n & 0xFFFF).toString(2)).slice(-16); }
  function hex4(n) { return '0x' + ('000' + (n & 0xFFFF).toString(16).toUpperCase()).slice(-4); }
  function destBits(d) {
    return (d.indexOf('A') >= 0 ? 1 : 0) + '' + (d.indexOf('D') >= 0 ? 1 : 0) + '' + (d.indexOf('M') >= 0 ? 1 : 0);
  }

  function bitLayout(bits, groups) {
    var w = 34, x0 = 10, y = 26;
    var o = '';
    for (var i = 0; i < 16; i++) {
      var x = x0 + i * w;
      var on = bits.charAt(i) === '1';
      o += '<rect class="ml-bit' + (on ? ' is-on' : '') + '" x="' + x + '" y="' + y + '" width="' + (w - 4) + '" height="30" rx="4"/>';
      o += '<text class="ml-bit-t" x="' + (x + (w - 4) / 2) + '" y="' + (y + 21) + '">' + bits.charAt(i) + '</text>';
      o += '<text class="ml-idx" x="' + (x + (w - 4) / 2) + '" y="' + (y - 6) + '">' + (15 - i) + '</text>';
    }
    (groups || []).forEach(function (g) {
      var xa = x0 + g.from * w, xb = x0 + (g.to + 1) * w - 4;
      o += '<path class="ml-brace" d="M' + xa + ' ' + (y + 40) + ' V' + (y + 46) + ' H' + xb + ' V' + (y + 40) + '"/>';
      o += '<text class="ml-glabel" x="' + ((xa + xb) / 2) + '" y="' + (y + 62) + '" text-anchor="middle">' + g.label + '</text>';
    });
    return '<svg class="ml-svg" viewBox="0 0 570 100" role="img">' + o + '</svg>';
  }
  function aLayout() {
    return bitLayout('0000000000010101', [
      { from: 0, to: 0, label: 'opcode 0' },
      { from: 1, to: 15, label: 'value (15 bits)' }
    ]);
  }
  function cLayout() {
    return bitLayout('1110011111010000', [
      { from: 0, to: 2, label: '111' },
      { from: 3, to: 3, label: 'a' },
      { from: 4, to: 9, label: 'comp' },
      { from: 10, to: 12, label: 'dest' },
      { from: 13, to: 15, label: 'jump' }
    ]);
  }

  function cWord() {
    return '111' + COMP[state.comp] + destBits(state.dest) + JMP[state.jump];
  }
  function cBuilderHtml() {
    var word = cWord();
    var destNames = ['A', 'D', 'M'];
    var comps = Object.keys(COMP);
    var jumps = Object.keys(JMP);
    return '<div class="ml-builder">' +
      '<div class="ml-pick"><span>dest</span><div class="ml-chips">' +
      destNames.map(function (d) {
        return '<button type="button" class="ml-chip' + (state.dest.indexOf(d) >= 0 ? ' is-on' : '') + '" data-dest="' + d + '">' + d + '</button>';
      }).join('') + '</div></div>' +
      '<div class="ml-pick"><span>comp</span><select class="ml-select" data-comp>' +
      comps.map(function (c) { return '<option' + (c === state.comp ? ' selected' : '') + '>' + c + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="ml-pick"><span>jump</span><select class="ml-select" data-jump>' +
      jumps.map(function (j) { return '<option value="' + j + '"' + (j === state.jump ? ' selected' : '') + '>' + (j || '(no jump)') + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="ml-word"><code>' + word + '</code><span>' + hex4(parseInt(word, 2)) + '</span></div>' +
      '<p class="ml-asm">' + (state.dest.length ? state.dest.join('') + '=' : '') + state.comp + (state.jump ? ';' + state.jump : '') + '</p>' +
      '</div>';
  }

  function cBuilder() { return cBuilderHtml(); }

  function view() {
    return '<section class="page-head page-head-ml">' +
      '<div class="wrap-wide">' +
      '<p class="eyebrow">Machine Language</p>' +
      '<h1>Machine language: 16 bits, nothing else</h1>' +
      '<p class="page-head-lead">Machine language is <b>binary code</b>: 16 bits per instruction, one instruction per cycle.' +
      'The human-readable form is only mnemonics and symbols; the real machine language is these 0s and 1s.</p>' +
      '</div></section>' +

      CS.lineNav('machine-language', 'wrap-wide') +

      '<section class="clock-section"><div class="wrap-wide">' +

      /* 01 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>What machine language is</h2>' +
      '<p>Machine language is the <b>only thing a CPU executes directly</b>: a stream of 16-bit binary code.' +
      'It answers three questions: <b>which operations exist</b>, <b>what they operate on</b>, and <b>where the next instruction is</b>.</p>' +
      '<table class="layer-table"><thead><tr><th>Question</th><th>The answer in machine language</th></tr></thead><tbody>' +
      '<tr><td><b>Which operations</b></td><td>Compute (18: constants, copy, negate, add/subtract, and/or), read memory, write memory, jump</td></tr>' +
      '<tr><td><b>What they operate on</b></td><td>Only three places: register <code>A</code>, register <code>D</code>, and <code>M</code> (= RAM[A], address first put into A)</td></tr>' +
      '<tr><td><b>How flow is controlled</b></td><td>PC = PC + 1 by default; to jump, A first holds the target, then the jump field decides; conditions come from the ALU’s zr / ng</td></tr>' +
      '</tbody></table>' +
      '<p>Remember those three and every other instruction is a combination: multiplication is “loop + add + test”, ' +
      'drawing is “compute an address + write M”. Machine language has no notion of multiply, functions or arrays.</p>' +
      '<p class="bits-tip">The human-readable form (<code>@5</code>, <code>D=M+1</code>) is <b>symbolic syntax</b>: ' +
      'the names inside are mnemonics and symbols. The real machine language is only 0 and 1.</p>' +
      '</div>' +

      /* 02 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>What an instruction looks like: only two kinds</h2>' +
      '<p>The top bit tells them apart: <b>0</b> starts an A instruction, <b>111</b> starts a C instruction. There is no third kind.</p>' +
      '<table class="layer-table"><thead><tr><th>Instruction</th><th>binary syntax</th><th>What it does</th></tr></thead><tbody>' +
      '<tr><td class="mono">A</td><td class="mono">0vvvvvvvvvvvvvvv</td><td>puts a 15-bit number into A</td></tr>' +
      '<tr><td class="mono">C</td><td class="mono">111accccccdddjjj</td><td>computes comp, stores into dest, jumps by jump</td></tr>' +
      '<tr><td class="mono">(LABEL)</td><td class="mono">—</td><td>not an instruction: a name for an address, absent from the binary</td></tr>' +
      '</tbody></table>' +
      '</div>' +

      /* 03 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>The A instruction: symbolic and binary</h2>' +
      '<p><b>symbolic</b> is <code>@value</code> (a number or a symbol); <b>binary</b> is <code>0</code> plus a 15-bit value.</p>' +
      aLayout() +
      '<table class="layer-table"><thead><tr><th>symbolic</th><th>binary</th><th>What it does</th></tr></thead><tbody>' +
      '<tr><td class="mono">@5</td><td class="mono">0000000000000101</td><td>A = 5</td></tr>' +
      '<tr><td class="mono">@32767</td><td class="mono">0111111111111111</td><td>A = 32767 (the largest 15-bit value)</td></tr>' +
      '<tr><td class="mono">@SCREEN</td><td class="mono">0100000000000000</td><td>A = 16384 (address of the first screen word)</td></tr>' +
      '<tr><td class="mono">@sum</td><td class="mono">0000000000010000</td><td>A = 16 (the RAM address of variable sum)</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">An A instruction does <b>one thing</b>: write A. It does not read memory, touch D, or jump. ' +
      'It exists because the CPU has a single address line and it is wired to A — so the address must go into A before M can be used.</p>' +
      '</div>' +

      /* 04 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>The C instruction: three fields</h2>' +
      '<p><b>symbolic</b> is <code>dest=comp;jump</code>; <b>binary</b> is <code>111</code> plus 13 bits, split into four fields:</p>' +
      cLayout() +
      '<table class="layer-table"><thead><tr><th>Field</th><th>Bits</th><th>Controls</th></tr></thead><tbody>' +
      '<tr><td class="mono">a</td><td class="mono">1</td><td>whether comp uses M: 0 means “use A instead of M”</td></tr>' +
      '<tr><td class="mono">comp</td><td class="mono">6</td><td>which of the 18 operations to compute</td></tr>' +
      '<tr><td class="mono">dest</td><td class="mono">3</td><td>where to store: any combination of A / D / M (or nothing)</td></tr>' +
      '<tr><td class="mono">jump</td><td class="mono">3</td><td>whether to jump: 7 conditions (or not at all)</td></tr>' +
      '</tbody></table>' +
      '<p>Within one instruction the order is fixed: <b>compute, then store, then jump</b>. Storing and jumping use the same comp result.</p>' +
      '</div>' +

      /* 05 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>Line by line: symbolic against binary</h2>' +
      '<p>Each line gives the symbolic form, the binary form (split as <code>111 | a | comp | dest | jump</code>), ' +
      'what operation it is, what it operates on, and whether it changes the flow.</p>' +
      '<table class="layer-table"><thead><tr><th>symbolic</th><th>binary (split)</th><th>Operation</th><th>Operates on</th><th>Changes flow?</th></tr></thead><tbody>' +
      '<tr><td class="mono">D=A</td><td class="mono ml-word-cell">111 0 110000 010 000</td><td>copy</td><td>puts A into D</td><td>no</td></tr>' +
      '<tr><td class="mono">D=M+1</td><td class="mono ml-word-cell">111 1 110111 010 000</td><td>add</td><td>adds 1 to RAM[A], stores into D</td><td>no</td></tr>' +
      '<tr><td class="mono">M=D</td><td class="mono ml-word-cell">111 0 000110 001 000</td><td>store</td><td>writes D into RAM[A]</td><td>no</td></tr>' +
      '<tr><td class="mono">D=D&A</td><td class="mono ml-word-cell">111 0 000000 010 000</td><td>bitwise AND</td><td>D AND A, back into D</td><td>no</td></tr>' +
      '<tr><td class="mono">D;JEQ</td><td class="mono ml-word-cell">111 0 000110 000 010</td><td>' + 'conditional jump' + '</td><td>' + 'if D = 0, PC = A' + '</td><td><b>' + 'yes' + '</b></td></tr>' +
      '<tr><td class="mono">0;JMP</td><td class="mono ml-word-cell">111 0 101010 000 111</td><td>' + 'unconditional jump' + '</td><td>PC = A</td><td><b>' + 'yes' + '</b></td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">In the last two rows <code>dest</code> is empty: they only test, writing nothing back. ' +
      'So a C instruction does not have to store anything.</p>' +
      '</div>' +

      /* 06 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>Control flow: two lines working together</h2>' +
      '<p>The CPU by itself only does <b>PC = PC + 1</b>. To jump it takes two things: <b>supply the address</b> (A instruction), then <b>decide whether to jump</b> (the jump field).</p>' +
      `<pre class="hdl-code">@sum       // A = the address of sum   (A instruction)
D=M        // D = RAM[sum]             (C instruction)
@END       // A = the address of END   (A instruction)
D;JEQ      // if D == 0 → PC = A       (C instruction, jump)</pre>` +
      '<p>Where do conditions come from? <b>The ALU’s zr / ng</b>: zr when the result is 0, ng when it is negative. The three jump bits test those two flags:</p>' +
      '<table class="layer-table"><thead><tr><th>jump</th><th>Condition</th><th>Jumps when</th></tr></thead><tbody>' +
      '<tr><td class="mono">JGT</td><td class="mono">001</td><td>result &gt; 0</td></tr>' +
      '<tr><td class="mono">JEQ</td><td class="mono">010</td><td>result = 0</td></tr>' +
      '<tr><td class="mono">JGE</td><td class="mono">011</td><td>result ≥ 0</td></tr>' +
      '<tr><td class="mono">JLT</td><td class="mono">100</td><td>result &lt; 0</td></tr>' +
      '<tr><td class="mono">JNE</td><td class="mono">101</td><td>result ≠ 0</td></tr>' +
      '<tr><td class="mono">JLE</td><td class="mono">110</td><td>result ≤ 0</td></tr>' +
      '<tr><td class="mono">JMP</td><td class="mono">111</td><td>always</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">So a loop in machine language is: a line <code>@LOOP</code> puts the address back into A, and the next line <code>0;JMP</code> jumps there unconditionally.</p>' +
      '</div>' +

      /* 07 */
      '<div class="clock-block">' +
      '<h2><span class="bits-num">07</span>Build a C instruction</h2>' +
      '<p>Pick dest, comp and jump, and watch the 16 bits take shape.</p>' +
      '<div data-ml-builder>' + cBuilderHtml() + '</div>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {
    var root = document.querySelector('.clock-section');
    if (!root) return;

    var builder = root.querySelector('[data-ml-builder]');
    if (builder) {
      function paintBuilder() { builder.innerHTML = cBuilderHtml(); }
      builder.addEventListener('click', function (e) {
        var chip = e.target.closest('[data-dest]');
        if (!chip) return;
        var d = chip.dataset.dest;
        var i = state.dest.indexOf(d);
        if (i >= 0) state.dest.splice(i, 1); else state.dest.push(d);
        state.dest.sort(function (a, b) { return 'ADM'.indexOf(a) - 'ADM'.indexOf(b); });
        paintBuilder();
      });
      builder.addEventListener('change', function (e) {
        var t = e.target;
        if (t.hasAttribute('data-comp')) { state.comp = t.value; paintBuilder(); }
        if (t.hasAttribute('data-jump')) { state.jump = t.value; paintBuilder(); }
      });
    }
  }

  return { view: view, mount: mount };
})();
