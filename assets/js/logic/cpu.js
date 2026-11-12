window.CS = window.CS || {};
CS.CpuUI = (function () {
  'use strict';

  var state = { instr: 0xfdd0 };

  function hex4(n) {
    var s = (n & 0xffff).toString(16).toUpperCase();
    while (s.length < 4) s = '0' + s;
    return '0x' + s;
  }
  function bits16(n) {
    var s = '';
    for (var i = 15; i >= 0; i--) s += (n >> i) & 1;
    return s;
  }
  function parseHex(s) {
    var t = String(s || '').trim().replace(/^0x/i, '').replace(/\s+/g, '');
    if (!/^[0-9a-fA-F]{1,4}$/.test(t)) return null;
    return parseInt(t, 16);
  }

  var COMPS = [
    ['0', 0, '101010'], ['1', 0, '111111'], ['-1', 0, '111010'],
    ['D', 0, '001100'], ['A', 0, '110000'], ['!D', 0, '001101'], ['!A', 0, '110001'],
    ['-D', 0, '001111'], ['-A', 0, '110011'],
    ['D+1', 0, '011111'], ['A+1', 0, '110111'], ['D-1', 0, '001110'], ['A-1', 0, '110010'],
    ['D+A', 0, '000010'], ['D-A', 0, '010011'], ['A-D', 0, '000111'],
    ['D&A', 0, '000000'], ['D|A', 0, '010101'],
    ['M', 1, '110000'], ['!M', 1, '110001'], ['-M', 1, '110011'],
    ['M+1', 1, '110111'], ['M-1', 1, '110010'],
    ['D+M', 1, '000010'], ['D-M', 1, '010011'], ['M-D', 1, '000111'],
    ['D&M', 1, '000000'], ['D|M', 1, '010101']
  ];
  var DEST = ['null', 'M', 'D', 'MD', 'A', 'AM', 'AD', 'AMD'];
  var JUMP = ['null', 'JGT', 'JEQ', 'JGE', 'JLT', 'JNE', 'JLE', 'JMP'];
  var JUMP_TEXT = {
    'null': '', JGT: 'when the result is greater than 0', JEQ: 'when the result equals 0', JGE: 'when the result is not less than 0',
    JLT: 'when the result is less than 0', JNE: 'when the result is not 0', JLE: 'when the result is not greater than 0', JMP: 'always'
  };

  function decode(n) {
    if (((n >> 15) & 1) === 0) {
      return { aInstr: true, value: n & 0x7fff };
    }
    var a = (n >> 12) & 1;
    var comp = (n >> 6) & 0x3f;
    var dest = (n >> 3) & 7;
    var jump = n & 7;
    var compKey = (a << 6) | comp;
    var hit = COMPS.filter(function (c) { return (c[1] << 6 | parseInt(c[2], 2)) === compKey; })[0];
    return {
      aInstr: false, a: a, comp: comp, dest: dest, jump: jump,
      compText: hit ? hit[0] : 'unknown combination',
      destText: DEST[dest], jumpText: JUMP[jump]
    };
  }

  function mnemonic(d) {
    if (d.aInstr) return '@' + d.value;
    var s = d.compText;
    if (d.destText !== 'null') s = d.destText + '=' + s;
    if (d.jumpText !== 'null') s += ';' + d.jumpText;
    return s;
  }

  function bitCells(n, d) {
    var items = [];
    if (d.aInstr) {
      items.push({ cls: "g-op", label: "kind", bits: [15] });
      items.push({ cls: "g-val", label: "value (15 bits)", bits: [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0] });
    } else {
      items.push({ cls: "g-op", label: "111", bits: [15,14,13] });
      items.push({ cls: "g-a", label: "a", bits: [12] });
      for (var ci = 0; ci < 6; ci++) items.push({ cls: "g-c", label: "c" + (ci + 1), bits: [11 - ci] });
      for (var di = 0; di < 3; di++) items.push({ cls: "g-d", label: "d" + (di + 1), bits: [5 - di] });
      for (var ji = 0; ji < 3; ji++) items.push({ cls: "g-j", label: "j" + (ji + 1), bits: [2 - ji] });
    }

    var cells = "";
    var legend = "";
    items.forEach(function (it) {
      var w = it.bits.length * 26 + (it.bits.length - 1) * 3;
      it.bits.forEach(function (b) {
        var locked = !d.aInstr && (b === 14 || b === 13);
        cells += '<span class="ib ' + it.cls + (locked ? " is-locked" : "") + '" data-bit="' + b + '">' + ((n >> b) & 1) + '</span>';
      });
      legend += '<span class="ibl ' + it.cls + '" style="flex:0 0 ' + w + 'px;width:' + w + 'px">' + it.label + '</span>';
    });

    return '<div class="instr-bits">' + cells + '</div><div class="instr-legend">' + legend + '</div>';
  }

  function panel() {
    var n = state.instr;
    var d = decode(n);
    var body;
    if (d.aInstr) {
      body = '<dl class="dec-list">' +
        '<div><dt>' + 'Kind' + '</dt><dd>' + 'A instruction' + '</dd></div>' +
        '<div><dt>' + 'Effect' + '</dt><dd>' + 'writes' + ' <span class="mono">' + d.value + '' +
        '<div><dt>' + 'Result' + '</dt><dd>' + 'in the next instruction' + ' <span class="mono">M</span> ' + 'points at' + ' <span class="mono">RAM[' + d.value + ']</span></dd></div>' +
        '</dl>';
    } else {
      body = '<dl class="dec-list">' +
        '<div><dt>' + 'y is' + '</dt><dd>' + (d.a ? 'M (RAM[A])' : 'the A register') + '</dd></div>' +
        '<div><dt>' + 'ALU computes' + '</dt><dd><span class="mono">' + d.compText + '</span>' + ' (control bits ' + ('000000' + d.comp.toString(2)).slice(-6) + ')' + '</dd></div>' +
        '<div><dt>' + 'Written to' + '</dt><dd>' + (d.destText === 'null' ? 'nothing (result dropped)' : d.destText) + '</dd></div>' +
        '<div><dt>' + 'Jump' + '</dt><dd>' + (d.jumpText === 'null' ? 'no jump' : d.jumpText + ' — ' + JUMP_TEXT[d.jumpText]) + '</dd></div>' +
        '</dl>';
    }
    return '<div class="dec-panel">' +
      '<div class="dec-top">' +
      '<div class="g16-field"><span>' + 'instruction (hex)' + '</span><span class="dec-hex mono">' + hex4(n) + '</span></div>' +
      '<div class="dec-mnemonic"><span class="dec-mn-label">' + 'mnemonic' + '</span><span class="mono dec-mn">' + mnemonic(d) + '</span></div>' +
      '</div>' +
      bitCells(n, d) +
      body +
      '<div class="dec-presets">' +
      [['@0', 0x0000], ['@21', 0x0015], ['D=A', 0xec10], ['D=M+1', 0xfdd0], ['0;JMP', 0xea87]].map(function (p) {
        return '<button type="button" class="op-btn" data-preset="' + p[1] + '">' + p[0] + '</button>';
      }).join('') +
      '</div>' +
      '</div>';
  }

  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
  }

  function bus(x1, x2, y, w, label, side) {
    var o = "";
    o += '<path class="p1-w" d="M' + x1 + ' ' + y + ' H' + x2 + '"/>';
    var mx = (x1 + x2) / 2;
    o += '<path class="p1-w" d="M' + (mx - 5) + ' ' + (y + 5) + ' L' + (mx + 5) + ' ' + (y - 5) + '"/>';
    o += '<text class="p1-slice-n" x="' + mx + '" y="' + (y + 18) + '" text-anchor="middle">' + w + '</text>';
    if (label) {
      var lx = side === "in" ? x2 - 6 : x1 + 6;
      var an = side === "in" ? "end" : "start";
      o += '<text class="p1-slice-k" x="' + lx + '" y="' + (y - 8) + '" text-anchor="' + an + '">' + label + '</text>';
    }
    return o;
  }

  function cpuIfaceSvg() {
    var o = "";
    o += '<path class="p1-gate-path" d="M300 20 L470 55 L470 265 L300 300 Z"/>';
    o += '<text class="p1-slice-t" x="362" y="170" style="font-size:22px">CPU</text>';

    o += bus(190, 300, 80, "16", "inM", "in");
    o += bus(190, 300, 160, "16", "instruction", "in");
    o += bus(190, 300, 255, "1", "reset", "in");

    o += bus(470, 620, 85, "16", "outM", "out");
    o += bus(470, 620, 135, "1", "writeM", "out");
    o += bus(470, 620, 185, "15", "addressM", "out");
    o += bus(470, 620, 245, "15", "pc", "out");

    o += '<text class="p1-slice-n" x="8" y="76">from</text>';
    o += '<text class="p1-slice-n" x="8" y="92">Data Memory</text>';
    o += '<text class="p1-slice-n" x="8" y="156">from</text>';
    o += '<text class="p1-slice-n" x="8" y="172">Instruction Memory</text>';
    o += '<text class="p1-slice-n" x="8" y="251">from</text>';
    o += '<text class="p1-slice-n" x="8" y="267">the user</text>';

    return svg(660, 330, o);
  }

  function view() {
    return '<section class="page-head page-head-cpu">' +
      '<div class="wrap">' +
      '<p class="eyebrow">The CPU</p>' +
      '<h1>CPU: wiring the control bits</h1>' +
      '<p class="page-head-lead">The ALU computes, registers remember, PC advances. The CPU introduces no new parts — it does exactly one thing:' +
      '<b>wire the 16 bits of an instruction straight onto the control pins of those parts</b>. “Decoding” is just wiring.</p>' +
      '</div></section>' +

      CS.lineNav('cpu', 'wrap') +

      '<section class="cpu-section"><div class="wrap">' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">01</span>What the CPU does: 16 bits onto control pins</h2>' +
      '<p>The CPU invents nothing. It does one thing: split the fetched 16-bit instruction into <b>control signals</b> and drive the control pins of the ALU, registers, memory and PC.</p>' +
      '<div class="intro-callout">' +
      '<b>Mental model: the CPU is an automatic railway switchyard driven by the instruction</b><br>' +
      '· <b>Tracks</b>: the 16-bit data bus, carrying 16-bit cars;<br>' +
      '· <b>The factory</b>: the ALU is the only workshop on the line;<br>' +
      '· <b>The 16-bit instruction</b>: not a magic spell but a <b>work order for an automatic switch operator</b> —' +
      'the <code>a</code> bit throws the input switch (send A or M into the factory); ' +
      '<code>c1~c6</code> select the arithmetic or logic job; ' +
      '<code>d1~d3</code> throw the output switch (unload into A, D, or through Memory into RAM); ' +
      '<code>j1~j3</code> read the sign and zero flags of the result and decide whether the PC track takes the default next stop (+1) or turns to a new station (a jump).' +
      '</div>' +
      '<p class="bits-tip">The <b>format</b> (how A and C instructions are written) is on the <a href="#/ml">machine language</a> page; ' +
      'what the machine promises externally is on the <a href="#/machine">Hack computer</a> page. This page cares about one thing: <b>how those bits become wires</b>.</p>' +
      '<div class="clock-figure" data-fig="iface">' + cpuIfaceSvg() + '</div>' +
      panel() +
      '</div>' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">02</span>Where the six control bits come from</h2>' +
      '<p>Bits 11–6 of a C instruction are <b>in exactly the same order as the ALU’s six control bits</b>:</p>' +
      '<table class="layer-table cpu-map">' +
      '<thead><tr><th>Instruction bit</th><th>Wired to</th><th>Meaning</th></tr></thead><tbody>' +
      '<tr><td class="mono">bit 12(a)</td><td class="mono">Mux16.sel</td><td>' + "whether the ALU’s y takes A or M" + '</td></tr>' +
      '<tr><td class="mono">bit 11</td><td class="mono">ALU.zx</td><td>zero x</td></tr>' +
      '<tr><td class="mono">bit 10</td><td class="mono">ALU.nx</td><td>invert x</td></tr>' +
      '<tr><td class="mono">bit 9</td><td class="mono">ALU.zy</td><td>zero y</td></tr>' +
      '<tr><td class="mono">bit 8</td><td class="mono">ALU.ny</td><td>invert y</td></tr>' +
      '<tr><td class="mono">bit 7</td><td class="mono">ALU.f</td><td>1 = add, 0 = and</td></tr>' +
      '<tr><td class="mono">bit 6</td><td class="mono">ALU.no</td><td>invert the result</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">That is why the ALU page presents them in the order <code>zx nx zy ny f no</code>: <b>it matches the instruction exactly</b>, so wiring is one bit to one pin with no conversion.</p>' +
      '</div>' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">03</span>Datapath: x is always D, y follows the a bit</h2>' +
      '<p>The ALU’s two inputs are not arbitrary:</p>' +
      '<ul class="cpu-list">' +
      '<li><b>x = the D register</b>: hard-wired, so every instruction implicitly computes with D.</li>' +
      '<li><b>y = A or M</b>: chosen by the <code>a</code> bit. When it picks M, M is <code>RAM[A]</code> — A doubles as the address.</li>' +
      '</ul>' +
      '<p>Writing back uses three independent lines: <code>d1</code> writes A, <code>d2</code> writes D, <code>d3</code> writes M (each gated by “this is a C instruction”).' +
      'So the number of combinations on the left of <code>=</code> in <code>D=M+1</code> is the number of control lines.</p>' +
      '<table class="layer-table cpu-map">' +
      '<thead><tr><th>CPU pin</th><th>Wired to</th></tr></thead><tbody>' +
      '<tr><td class="mono">instruction[16]</td><td>where the control bits come from</td></tr>' +
      '<tr><td class="mono">inM[16]</td><td>RAM[A], that is M</td></tr>' +
      '<tr><td class="mono">addressM[15]</td><td>the low 15 bits of A (the address)</td></tr>' +
      '<tr><td class="mono">outM[16]</td><td>the ALU output</td></tr>' +
      '<tr><td class="mono">writeM</td><td>“is a C instruction” AND d3</td></tr>' +
      '<tr><td class="mono">pc[15]</td><td>the low 15 bits of PC (next instruction address)</td></tr>' +
      '<tr><td class="mono">reset</td><td>the PC reset</td></tr>' +
      '</tbody></table>' +
      '</div>' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">04</span>Jumps: three bits plus two flags</h2>' +
      '<p>The last three bits <code>j1 j2 j3</code> mean “less / equal / greater”. ANDed with the ALU flags <code>ng</code> (negative) and <code>zr</code> (zero), they produce “jump or not”:</p>' +
      '<table class="layer-table cpu-map">' +
      '<thead><tr><th>jjj</th><th>Mnemonic</th><th>Condition</th></tr></thead><tbody>' +
      '<tr><td class="mono">001</td><td class="mono">JGT</td><td>result &gt; 0</td></tr>' +
      '<tr><td class="mono">010</td><td class="mono">JEQ</td><td>result = 0</td></tr>' +
      '<tr><td class="mono">011</td><td class="mono">JGE</td><td>result ≥ 0</td></tr>' +
      '<tr><td class="mono">100</td><td class="mono">JLT</td><td>result &lt; 0</td></tr>' +
      '<tr><td class="mono">101</td><td class="mono">JNE</td><td>result ≠ 0</td></tr>' +
      '<tr><td class="mono">110</td><td class="mono">JLE</td><td>result ≤ 0</td></tr>' +
      '<tr><td class="mono">111</td><td class="mono">JMP</td><td>always</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">Note: <code>0;JMP</code> has no destination — the result is only tested, not written back anywhere.</p>' +
      '</div>' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">05</span>One instruction, step by step</h2>' +
      '<table class="layer-table flow-table">' +
      '<thead><tr><th>Stage</th><th>A instruction (@x)</th><th>C instruction (D=M+1;JGT)</th></tr></thead><tbody>' +
      '<tr><td>Fetch</td><td colspan="2">16 bits are read from the address in PC and fed to instruction</td></tr>' +
      '<tr><td>Top bit</td><td>0: a constant</td><td>1: a computation</td></tr>' +
      '<tr><td>Compute</td><td>nothing; the ALU output is ignored</td><td>x=D, y=M, the six control bits compute M+1</td></tr>' +
      '<tr><td>Write</td><td>A ← the constant</td><td>D ← the result (d2=1)</td></tr>' +
      '<tr><td>Jump</td><td>no jump</td><td>if the result &gt; 0, PC loads A; otherwise PC+1</td></tr>' +
      '</tbody></table>' +
      '<p>One pass per clock tick. A “program” is just these 16-bit words lined up in memory.</p>' +
      '</div>' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">06</span>How PC gets written</h2>' +
      '<p>PC is not a register programs write directly; it has three inputs, in priority order:</p>' +
      '<table class="layer-table cpu-map"><thead><tr><th>Signal</th><th>Effect</th><th>Priority</th></tr></thead><tbody>' +
      '<tr><td class="mono">reset</td><td>PC = 0</td><td>highest (power-on / reset)</td></tr>' +
      '<tr><td class="mono">' + 'load (from the jump)' + '</td><td>PC = A (the jump target)</td><td>middle</td></tr>' +
      '<tr><td class="mono">inc</td><td>PC = PC + 1</td><td>lowest (the default)</td></tr>' +
      '</tbody></table>' +
      '<p>So a jump is two wires in hardware: <b>send A to the PC input</b>, then <b>raise load</b>.' +
      "An A instruction puts the target address into A first; only then can a jump mean anything." + '</p>' +
      '<p class="bits-tip">The jump condition is the three jump bits ANDed/ORed with the ALU’s zr / ng — load goes high only when it holds.' +
      'When it does not hold, load=0 and PC still increments.</p>' +
      '</div>' +

      '<div class="cpu-block">' +
      '<h2><span class="bits-num">07</span>Writing it in HDL</h2>' +
      CS.hdlView('cpu') +
      '<p class="bits-tip">Three things to notice in this code: <b>every control bit comes from <code>instruction[..]</code></b> (a few are gated), and there is no separate decoder; ' +
      '<b>A is both data and address</b>; <b>the PC load comes from the jump logic</b>.</p>' +
      '</div>' +

      '</div></section>';
  }

  function paint() {
    var p = document.querySelector('.dec-panel');
    if (p) p.outerHTML = panel();
  }

  function mount() {
    var root = document.querySelector('.cpu-section');
    if (!root) return;
    paint();

    root.addEventListener('click', function (e) {
      var preset = e.target.closest('[data-preset]');
      if (preset) {
        state.instr = parseInt(preset.dataset.preset, 10);
        paint();
        return;
      }
      var bit = e.target.closest('[data-bit]');
      if (!bit) return;
      var b = parseInt(bit.dataset.bit, 10);
      var n = state.instr;
      if (b === 15) {
        n ^= (1 << 15);
        if ((n >> 15) & 1) n |= (1 << 14) | (1 << 13);
      } else if ((b === 14 || b === 13) && ((n >> 15) & 1)) {
        return;
      } else {
        n ^= (1 << b);
      }
      state.instr = n & 0xFFFF;
      paint();
    });


  }

  return { view: view, mount: mount };
})();
