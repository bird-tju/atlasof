window.CS = window.CS || {};
CS.RamUI = (function () {
  'use strict';

  var RAM_N = 8;
  var ramState = { addr: 0, in: 0x0000, load: 1, slots: [0, 0, 0, 0, 0, 0, 0, 0], writes: 0 };

  function svg(w, h, inner) {
    return '<svg class="p1-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img">' + inner + '</svg>';
  }

  function hex16(v) {
    return '0x' + ('000' + (v & 0xFFFF).toString(16).toUpperCase()).slice(-4);
  }

  function bitsRowC(k, v, editable, dataK) {
    var cells = '';
    for (var i = 15; i >= 0; i--) {
      var bit = (v >> i) & 1;
      cells += '<span class="b16-cell' + (bit ? ' on' : '') + (editable ? ' is-edit' : '') +
        '" data-k="' + dataK + '" data-bit="' + i + '">' + bit + '</span>';
    }
    return '<div class="b16-row"><span class="b16-k">' + k + '</span><span class="b16-cells">' + cells +
      '</span><span class="b16-hex">' + hex16(v) + '</span></div>';
  }

  function toggleC(label, on, key) {
    return '<button type="button" class="clk-toggle' + (on ? ' is-on' : '') + '" data-toggle="' + key + '">' +
      label + ' ' + on + '</button>';
  }

  function ramSvg() {
    var o = '';
    o += '<path class="p1-w" d="M10 90 H60"/>';
    o += '<text class="p1-slice-k" x="4" y="76">in[16]</text>';

    o += '<rect class="p1-gate-path" x="60" y="60" width="90" height="60" rx="8"/>';
    o += '<text class="p1-slice-t" x="105" y="86">DMux8Way</text>';
    o += '<text class="p1-slice-n" x="105" y="104">' + 'pick one register' + '</text>';

    for (var i = 0; i < 4; i++) {
      var y = 46 + i * 26;
      o += '<rect class="p1-gate-path" x="200" y="' + (y - 10) + '" width="70" height="20" rx="4"/>';
      o += '<text class="p1-slice-k" x="235" y="' + (y + 4) + '" text-anchor="middle">R' + i + '</text>';
      o += '<path class="p1-w" d="M150 ' + y + ' H200"/>';
      o += '<path class="p1-w" d="M270 ' + y + ' H320"/>';
    }
    o += '<text class="p1-slice-t" x="235" y="152" text-anchor="middle">' + '… 8 of them' + '</text>';

    o += '<rect class="p1-gate-path" x="320" y="60" width="90" height="60" rx="8"/>';
    o += '<text class="p1-slice-t" x="365" y="86">Mux8Way16</text>';
    o += '<text class="p1-slice-n" x="365" y="104">' + 'read one back' + '</text>';
    o += '<path class="p1-w" d="M410 90 H460"/>';
    o += '<text class="p1-slice-k" x="466" y="94">out[16]</text>';

    o += '<path class="p1-w" d="M105 140 V170" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-k" x="105" y="186" text-anchor="middle">address[3]</text>';
    o += '<path class="p1-w" d="M365 140 V170" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-k" x="365" y="186" text-anchor="middle">address[3]</text>';
    o += '<path class="p1-w" d="M105 60 V30" stroke-dasharray="3 3"/>';
    o += '<text class="p1-slice-n" x="105" y="24" text-anchor="middle">load</text>';
    return svg(520, 200, o);
  }

  function ramTable() {
    var rows = [
      ['RAM8', '8 × Register', '3', 'eight 16-bit words'],
      ['RAM64', '8 × RAM8', '6', '64 words'],
      ['RAM512', '8 × RAM64', '9', '512 words'],
      ['RAM4K', '8 × RAM512', '12', '4096 words'],
      ['RAM16K', '4 × RAM4K', '14', '16384 words']
    ];
    return '<table class="layer-table"><thead><tr><th>' + 'Chip' + '</th><th>' + 'Built from' + '</th><th>' + 'Address bits' + '</th><th>' + 'Capacity' + '</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td class="mono">' + r[2] + '</td><td>' + r[3] + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function ramWidget() {
    var slots = '';
    for (var i = 0; i < RAM_N; i++) {
      slots += '<button type="button" class="ram-slot' + (i === ramState.addr ? ' is-sel' : '') +
        '" data-ram="' + i + '"><span class="ram-idx">' + i + '</span>' +
        '<span class="ram-val mono">' + hex16(ramState.slots[i]) + '</span></button>';
    }
    return '<div class="clk-widget" data-w="ram">' +
      bitsRowC('in', ramState.in, true, 'ramIn') +
      '<div class="clk-row">' + toggleC('load', ramState.load, 'ramLoad') +
      '<button type="button" class="clk-btn" id="ram-write">' + 'Write once ↗' + '</button>' +
      '<span class="clk-out-meta mono">' + (EN ? 'address ' + ramState.addr + ' · writes: ' + ramState.writes : '' + ramState.addr + '' + ramState.writes + '') + '</span></div>' +
      '<div class="ram-slots">' + slots + '</div>' +
      '<p class="p2-out">out <b>' + hex16(ramState.slots[ramState.addr]) + '</b>' + (EN ? ' (contents of address ' + ramState.addr + ')' : '' + ramState.addr + '') + '</p>' +
      '</div>';
  }

  function addrTable() {
    var rows = [
      ['RAM64', 'address[3..5]', 'address[0..2]', 'top 3 bits pick the RAM8 block'],
      ['RAM512', 'address[6..8]', 'address[0..5]', 'top 3 bits pick the RAM64 block'],
      ['RAM4K', 'address[9..11]', 'address[0..8]', 'top 3 bits pick the RAM512 block'],
      ['RAM16K', 'address[12..13]', 'address[0..11]', 'top 2 bits pick the RAM4K block']
    ];
    return '<table class="layer-table"><thead><tr><th>' + 'Chip' + '</th><th>' + 'High bits (block)' + '</th><th>' + 'Low bits (inside)' + '</th><th>' + 'Meaning' + '</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="mono">' + r[0] + '</td><td class="mono">' + r[1] + '</td><td class="mono">' + r[2] + '</td><td>' + r[3] + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function block(title, body) {
    return '<div class="clock-block">' + body + '</div>';
  }

  function view() {
    return '<section class="page-head page-head-ram">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Project 3 · RAM</p>' +
      '<h1>' + 'RAM: a bank of registers plus address decoding' + '</h1>' +
      '<p class="page-head-lead">' + 'RAM introduces no new part. It just puts <b>many registers side by side</b> ' + '' +
      '' + 'and uses the address to decide which one is written and which one is read. To grow, stack the previous level again.' + '</p>' +
      '</div></section>' +

      CS.lineNav('ram', 'wrap') +

      '<section class="clock-section"><div class="wrap">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>' + 'One address, two paths' + '</h2>' +
      '<p>' + 'A write uses <b>DMux</b> to send <code>load</code> to one register; a read uses <b>Mux</b> to select that register’s contents. ' + '' +
      '' + 'The address drives both selectors, so what goes in and what comes out are always the same slot.' + '</p>' +
      '<div class="clock-figure" data-fig="ram">' + ramSvg() + '</div>' +
      '<p class="bits-tip">' + 'Note: with <code>load=0</code> all eight DMux outputs are 0 and no register is written — that is what “read without writing” means.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>' + 'How five levels of capacity stack up' + '</h2>' +
      '<p>' + 'Each level does one thing: <b>place eight copies of the level below side by side</b>, and split the address into “high bits pick the block, low bits pick the word”.' + '</p>' +
      ramTable() +
      '<p class="bits-tip">' + 'The one exception is RAM16K: 16K ÷ 4K = 4, so it is <b>four RAM4K blocks</b>, using DMux4Way and Mux4Way16.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>' + 'RAM8: eight registers and two 8-way selectors' + '</h2>' +
      '<p>' + 'The simplest RAM: 3 address bits, exactly enough to pick one of eight registers.' + '</p>' +
      ramWidget() +
      '<p class="bits-tip">' + 'Click an address to pick a register, change <code>in</code>, then press “Write once” — the value lands only when load=1.' + '</p>' +
      CS.hdlView('ram8') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>' + 'RAM64: eight RAM8 blocks' + '</h2>' +
      '<p>' + 'The 6-bit address splits: <code>address[3..5]</code> picks the RAM8 block and <code>address[0..2]</code> picks the register inside it.' + '</p>' +
      CS.hdlView('ram64') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>' + 'RAM512: eight RAM64 blocks' + '</h2>' +
      '<p>' + 'The same trick once more: the top 3 bits pick the block, the low 6 pass straight through to RAM64.' + '</p>' +
      CS.hdlView('ram512') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>' + 'RAM4K: eight RAM512 blocks' + '</h2>' +
      '<p>' + 'A 12-bit address: the top 3 bits pick the block, the low 9 address inside it.' + '</p>' +
      CS.hdlView('ram4k') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">07</span>' + 'RAM16K: four RAM4K blocks' + '</h2>' +
      '<p>' + 'The last level differs: 16K is only four 4K blocks, so it uses 4-way selectors. Of the 14 address bits, the top 2 pick the block.' + '</p>' +
      CS.hdlView('ram16k') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">08</span>' + 'How the address is sliced' + '</h2>' +
      '<p>' + 'Line up the slicing at every level and the rule is clear: <b>high bits select, low bits pass through</b>.' + '</p>' +
      addrTable() +
      '<p class="bits-tip">' + 'That is also why RAM16K takes a 14-bit address: 2<sup>14</sup> = 16384.' + '</p>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {
    var root = document.querySelector('.clock-section');
    if (!root || !document.querySelector('.clk-widget[data-w="ram"]')) return;

    function paint() {
      var w = document.querySelector('.clk-widget[data-w="ram"]');
      if (w) w.outerHTML = ramWidget();
    }
    paint();

    root.addEventListener('click', function (e) {
      var cell = e.target.closest ? e.target.closest('.b16-cell.is-edit') : null;
      if (cell) {
        var bit = parseInt(cell.dataset.bit, 10);
        ramState.in = (ramState.in ^ (1 << bit)) & 0xFFFF;
        paint();
        return;
      }
      var slot = e.target.closest ? e.target.closest('[data-ram]') : null;
      if (slot) {
        ramState.addr = parseInt(slot.dataset.ram, 10);
        paint();
        return;
      }
      var tg = e.target.closest ? e.target.closest('[data-toggle]') : null;
      if (tg && tg.dataset.toggle === 'ramLoad') {
        ramState.load = ramState.load ? 0 : 1;
        paint();
        return;
      }
      if (e.target.id === 'ram-write') {
        if (ramState.load) {
          ramState.slots[ramState.addr] = ramState.in;
          ramState.writes++;
        }
        paint();
      }
    });
  }

  return { view: view, mount: mount };
})();
