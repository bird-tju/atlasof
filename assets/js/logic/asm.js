/* Project 6 · Assembly language and the assembler
*/
window.CS = window.CS || {};
CS.AsmUI = (function () {
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
  var PREDEF = { 'SP': 0, 'LCL': 1, 'ARG': 2, 'THIS': 3, 'THAT': 4, 'SCREEN': 16384, 'KBD': 24576 };
  for (var i = 0; i < 16; i++) PREDEF['R' + i] = i;

  var SAMPLE = [
    '// sum = 1 + 2 + ... + R0, result into R1',
    '@R0',
    'D=M',
    '@n',
    'M=D',
    '@sum',
    'M=0',
    '(LOOP)',
    '@n',
    'D=M',
    '@END',
    'D;JEQ',
    '@sum',
    'D=M',
    '@n',
    'D=D+M',
    '@sum',
    'M=D',
    '@n',
    'M=M-1',
    '@LOOP',
    '0;JMP',
    '(END)',
    '@sum',
    'D=M',
    '@R1',
    'M=D'
  ].join('\n');

  var PRESETS = [
    { name: 'sum', code: SAMPLE },
    { name: 'fill a row', code: '@SCREEN\nD=A\n@i\nM=D\n(LOOP)\n@i\nA=M\nM=-1\n@i\nM=M+1\nD=M\n@24576\nD=D-A\n@LOOP\nD;JNE' },
    { name: 'read the keyboard', code: '(PRESS)\n@KBD\nD=M\n@PRESS\nD;JEQ\n@SCREEN\nM=D' }
  ];

  var state = { text: SAMPLE };

  function bin16(n) { return ('0000000000000000' + (n & 0xFFFF).toString(2)).slice(-16); }
  function hex4(n) { return '0x' + ('000' + (n & 0xFFFF).toString(16).toUpperCase()).slice(-4); }
  function destBits(d) {
    return (d.indexOf('A') >= 0 ? 1 : 0) + '' + (d.indexOf('D') >= 0 ? 1 : 0) + '' + (d.indexOf('M') >= 0 ? 1 : 0);
  }

  function assemble(text) {
    var errors = [];
    var syms = {};          // name -> { addr, type }
    var vars = 16;
    var items = [];
    var pc = 0;

    text.split('\n').forEach(function (raw, idx) {
      var line = raw.replace(/\/\/.*$/, '').trim();
      if (!line) return;
      var m = line.match(/^\((.+)\)$/);
      if (m) {
        items.push({ lineNo: idx + 1, kind: 'label', name: m[1].trim(), addr: pc });
        return;
      }
      items.push({ lineNo: idx + 1, kind: 'inst', text: line, addr: pc });
      pc++;
    });

    items.forEach(function (it) {
      if (it.kind !== 'label') return;
      if (syms[it.name]) {
        errors.push('line ' + it.lineNo + ': label (' + it.name + ') is defined twice');
      } else {
        syms[it.name] = { addr: it.addr, type: 'label' };
      }
    });

    var rows = [];
    items.forEach(function (it) {
      if (it.kind === 'label') {
        rows.push({ lineNo: it.lineNo, src: '(' + it.name + ')', addr: '—', word: '—', hex: '', note: 'a label, no instruction' });
        return;
      }
      var t = it.text;
      if (t.charAt(0) === '@') {
        var v = t.slice(1).trim();
        var val = null, note = '';
        if (/^\d+$/.test(v)) {
          val = parseInt(v, 10);
          note = 'constant ' + val;
          if (val > 32767) errors.push('line ' + it.lineNo + ': constant ' + val + ' does not fit in 15 bits (max 32767)');
        } else if (syms[v]) {
          var sy = syms[v];
          val = sy.addr;
          note = sy.type === 'variable' ? 'variable ' + v + ', RAM address ' + val
               : sy.type === 'label' ? 'label ' + v + ', instruction address ' + val
               : 'predefined ' + v + ', address ' + val;
        } else if (PREDEF[v] !== undefined) {
          val = PREDEF[v];
          syms[v] = { addr: val, type: 'predefined' };
          note = 'predefined ' + v + ', RAM address ' + val;
        } else {
          syms[v] = { addr: vars, type: 'variable' };
          val = vars;
          note = 'new variable ' + v + ', RAM address ' + vars;
          vars++;
        }
        var word = '0' + bin16(val).slice(1);
        rows.push({ lineNo: it.lineNo, src: t, addr: it.addr, word: word, hex: hex4(parseInt(word, 2)), note: note });
        return;
      }
      var mm = t.match(/^(?:(A|D|M|AD|AM|DM|ADM)=)?([^;]+)?(?:;(JGT|JEQ|JGE|JLT|JNE|JLE|JMP))?$/);
      if (!mm || (!mm[1] && !mm[2] && !mm[3])) {
        errors.push('line ' + it.lineNo + ': cannot read the statement "' + t + '"');
        rows.push({ lineNo: it.lineNo, src: t, addr: it.addr, word: '??', hex: '', note: 'parse failed' });
        return;
      }
      var dest = mm[1] || '';
      var comp = (mm[2] || '0').trim();
      var jump = mm[3] || '';
      if (!COMP[comp]) {
        errors.push('line ' + it.lineNo + ': unknown comp "' + comp + '"');
        rows.push({ lineNo: it.lineNo, src: t, addr: it.addr, word: '??', hex: '', note: 'invalid comp' });
        return;
      }
      var w = '111' + COMP[comp] + destBits(dest) + JMP[jump];
      rows.push({ lineNo: it.lineNo, src: t, addr: it.addr, word: w, hex: hex4(parseInt(w, 2)),
        note: 'C instruction' + (jump ? ' ' + jump : '') });
    });

    return { rows: rows, syms: syms, errors: errors, count: pc };
  }

  function resultHtml() {
    var r = assemble(state.text);

    var symRows = Object.keys(r.syms).sort(function (x, y) { return r.syms[x].addr - r.syms[y].addr; }).map(function (k) {
      return '<tr><td class="mono">' + k + '</td><td class="mono">' + r.syms[k].addr + '</td><td>' + r.syms[k].type + '</td></tr>';
    }).join('');

    var rows = r.rows.map(function (x) {
      return '<tr' + (x.word === '??' ? ' class="is-bad"' : '') + '>' +
        '<td class="mono">' + x.lineNo + '</td>' +
        '<td class="mono">' + x.src.replace(/</g, '&lt;') + '</td>' +
        '<td class="mono">' + x.addr + '</td>' +
        '<td class="mono asm-word">' + x.word + '</td>' +
        '<td class="mono">' + x.hex + '</td>' +
        '<td class="asm-note">' + x.note + '</td></tr>';
    }).join('');

    var errBox = r.errors.length
      ? '<ul class="asm-errors">' + r.errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>'
      : '<p class="bits-tip">' + 'No errors: ' + r.count + ' instructions, ' + Object.keys(r.syms).length + ' symbols.' + '</p>';

    return '<div class="asm-cards">' +
      '<div class="asm-card"><p class="aside-h">' + 'Symbol table' + '</p>' +
      '<div class="asm-table-wrap"><table class="ref-tt"><thead><tr><th>' + 'Name' + '</th><th>' + 'Address' + '</th><th>' + 'Type' + '</th></tr></thead><tbody>' + symRows + '</tbody></table></div>' +
      '</div>' +
      '<div class="asm-card"><p class="aside-h">' + 'Line by line' + '</p>' +
      '<div class="asm-table-wrap"><table class="ref-tt"><thead><tr><th>' + 'Line' + '</th><th>' + 'Source' + '</th><th>' + 'Address' + '</th><th>' + 'Machine code' + '</th><th>' + 'Hex' + '</th><th>' + 'Note' + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</div>' +
      '</div>' + errBox;
  }

  function view() {
    return '<section class="page-head page-head-asm">' +
      '<div class="wrap-wide">' +
      '<p class="eyebrow">Project 6 · Assembler</p>' +
      '<h1>Assembly language and the assembler</h1>' +
      '<p class="page-head-lead">Assembly language is a low-level language that maps <b>almost one to one</b> onto machine instructions: ' +
      'one statement is usually one instruction, with <b>mnemonics</b> in place of 0s and 1s and <b>symbols</b> in place of addresses. ' +
      'It still faces registers, memory and jumps directly, with no functions in between. The program that turns those mnemonics into machine code is the <b>assembler</b>.</p>' +
      '</div></section>' +

      CS.lineNav('asm', 'wrap-wide') +

      '<section class="clock-section"><div class="wrap-wide">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>Assembly: machine instructions written with symbols</h2>' +
      '<p>It is called a language because the grammar is fixed: every line is one of three things — give an address, do a computation, or just mark a position.</p>' +
      '<table class="layer-table"><thead><tr><th>Form</th><th>Meaning</th><th>Emits an instruction?</th></tr></thead><tbody>' +
      '<tr><td class="mono">@value</td><td>An A instruction: puts a number, or a symbol’s address, into A</td><td>yes, one</td></tr>' +
      '<tr><td class="mono">dest=comp;jump</td><td>A C instruction: compute, store, maybe jump</td><td>yes, one</td></tr>' +
      '<tr><td class="mono">(LABEL)</td><td>A label: names the address of the next instruction</td><td><b>no</b></td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">Comments and blank lines emit nothing either. So <b>line number ≠ address</b> — exactly what the first pass works out.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>Why two passes: the forward-reference crisis</h2>' +
      '<div class="intro-callout">' +
      '<b>The dead end of a single pass:</b>' +
      '<pre class="hdl-code">@END       ' + '// crisis: on this line the assembler has no idea what END is!' + '\n' +
      'D;JEQ\n' +
      '...\n' +
      '(END)      ' + '// only here does the assembler learn the address of END' + '</pre>' +
      'In real code a conditional jump usually targets a label further down (used before defined). Scanning once, the assembler is stuck on the very first line: it cannot produce a complete 16-bit word.' +
      '</div>' +
      '<p>The fix is a clean piece of engineering decoupling — <b>two passes</b>:</p>' +
      '<table class="layer-table"><thead><tr><th>Pass</th><th>Role</th><th>What it does</th><th>Output</th></tr></thead><tbody>' +
      '<tr><td><b>First</b></td><td><b>Surveyor</b></td><td>Measures only: counts instruction addresses, records the current address at each <code>(LABEL)</code></td><td>A complete label table</td></tr>' +
      '<tr><td><b>Second</b></td><td><b>Builder</b></td><td>With the table in hand, turns every mnemonic and symbol into machine code with absolute addresses</td><td>16-bit instructions</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">The first pass measures without building; the second builds to the plan. From then on, jumps forward or backward always land on a known address.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>Three kinds of names in the symbol table</h2>' +
      '<table class="layer-table"><thead><tr><th>Kind</th><th>Example</th><th>Where the address comes from</th></tr></thead><tbody>' +
      '<tr><td>Predefined</td><td class="mono">R0–R15, SCREEN, KBD, SP, LCL, ARG, THIS, THAT</td><td>Fixed values</td></tr>' +
      '<tr><td>Label</td><td class="mono">(LOOP)</td><td>The <b>instruction address</b> counted in pass one</td></tr>' +
      '<tr><td>Variable</td><td class="mono">@sum</td><td>Starts at <b>16</b>, allocated in order of first appearance</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">Allocation order changes addresses (whichever appears first gets 16), but behaviour does not change — names follow the addresses.</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>Hands-on: edit the code and watch the translation</h2>' +
      '<p>Edit assembly on the left; the <b>symbol table</b> and <b>line-by-line machine code</b> update on the right.</p>' +
      '<textarea class="asm-textarea" data-asm spellcheck="false"></textarea>' +
      '<div class="asm-presets">' +
      PRESETS.map(function (p, idx) {
        return '<button type="button" class="op-btn" data-asm-preset="' + idx + '">' + p.name + '</button>';
      }).join('') +
      '</div>' +
      '<div class="asm-out" data-asm-out></div>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>The three usual mistakes</h2>' +
      '<table class="layer-table"><thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead><tbody>' +
      '<tr><td>The label is “not found”</td><td>Missing brackets when defining, or a colon when referencing</td><td>Define <code>(END)</code>, reference <code>@END</code></td></tr>' +
      '<tr><td>A variable lands at an unexpected address</td><td>Assuming variables start at 0</td><td>They start at <b>16</b>; 0–15 are R0–R15</td></tr>' +
      '<tr><td><code>@40000</code> is rejected</td><td>An A instruction carries 15 bits</td><td>The maximum is 32767</td></tr>' +
      '</tbody></table>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>After translation</h2>' +
      '<pre class="hdl-code">' + 'source (.asm) → assembler → machine code (.hack) → ROM → CPU executes' + '</pre>' +
      '<p>The output is a stream of 16-bit words loaded into ROM in order (starting at address 0); after reset PC = 0 and the CPU runs the first one. ' +
      'How that loading and running works is on the <a href="#/computer">whole machine</a> page.</p>' +
      '<p class="bits-tip">That is why the <a href="#/ml">machine language</a> page covers the instruction format first: the assembler only removes symbols; the encoding itself is unchanged.</p>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {
    var root = document.querySelector('.clock-section');
    if (!root) return;
    var ta = root.querySelector('[data-asm]');
    var out = root.querySelector('[data-asm-out]');
    if (!ta || !out) return;

    ta.value = state.text;
    function paint() { out.innerHTML = resultHtml(); }
    paint();

    ta.addEventListener('input', function () {
      state.text = ta.value;
      paint();
    });

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-asm-preset]');
      if (!b) return;
      var preset = PRESETS[+b.dataset.asmPreset];
      if (!preset) return;
      ta.value = preset.code;
      state.text = preset.code;
      paint();
    });
  }

  return { view: view, mount: mount, assemble: assemble };
})();
