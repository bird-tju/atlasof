window.CS = window.CS || {};
CS.ScreenUI = (function () {
  'use strict';

  var ROWS = 16;
  var COLS = 32;

  var state = {
    bits: [],         // bits[r][c]
    hover: null
  };
  (function init() {
    for (var r = 0; r < ROWS; r++) {
      var row = [];
      for (var c = 0; c < COLS; c++) row.push(0);
      state.bits.push(row);
    }
    for (var i = 4; i < 12; i++) { state.bits[4][i] = 1; state.bits[11][i] = 1; }
    for (var j = 4; j < 12; j++) { state.bits[j][4] = 1; state.bits[j][11] = 1; }
  })();

  function wordOf(r, wi) {
    var v = 0;
    for (var b = 0; b < 16; b++) {
      if (state.bits[r][wi * 16 + b]) v |= (1 << b);
    }
    return v;
  }

  function hex4(v) {
    return '0x' + ('000' + (v & 0xFFFF).toString(16).toUpperCase()).slice(-4);
  }

  function gridHtml() {
    var out = [];
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        out.push('<button type="button" class="scr-cell' + (state.bits[r][c] ? ' on' : '') +
          '" data-r="' + r + '" data-c="' + c + '" aria-label="r' + r + ' c' + c + '"></button>');
      }
    }
    return '<div class="scr-grid" style="grid-template-columns:repeat(' + COLS + ',20px)">' + out.join('') + '</div>';
  }

  function wordsHtml() {
    var rows = [];
    for (var r = 0; r < ROWS; r++) {
      if (!state.bits[r].some(function (v) { return v; })) continue;
      var w0 = wordOf(r, 0), w1 = wordOf(r, 1);
      rows.push('<tr><td class="mono">' + r + '</td>' +
        '<td class="mono">' + ('0000000000000000' + w0.toString(2)).slice(-16) + '</td>' +
        '<td class="mono">' + (16384 + 32 * r) + '</td>' +
        '<td class="mono">' + ('0000000000000000' + w1.toString(2)).slice(-16) + '</td>' +
        '<td class="mono">' + (16384 + 32 * r + 1) + '</td></tr>');
    }
    if (!rows.length) rows.push('<tr><td colspan="5" class="mono">' + '(the screen is empty)' + '</td></tr>');
    return '<table class="ref-tt scr-words"><thead><tr><th>' + 'Row' + '</th><th>' + 'Left word (16 bits)' + '</th><th>' + 'Address' + '</th>' +
      '<th>' + 'Right word (16 bits)' + '</th><th>' + 'Address' + '</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  function canvasHtml() {
    return '<div class="scr-panel">' +
      '<p class="aside-h">' + 'Click a cell = write one bit' + '</p>' +
      gridHtml() +
      '<p class="bits-tip">' + 'The demo is only 32 pixels wide (a real row is 512 pixels = 32 words). Click and watch the words below change.' + '</p>' +
      '</div>' +
      '<div class="scr-panel">' +
      '<p class="aside-h">' + 'The matching words' + '</p>' +
      wordsHtml() +
      '</div>';
  }

  function bitmapSvg() {
    var o = "";
    var bitOn = function (k) { return k < 4; };

    for (var i = 0; i < 16; i++) {
      var bi = 15 - i;
      var x = 20 + i * 24;
      o += '<text class="p1-slice-n" x="' + (x + 10) + '" y="20" text-anchor="middle">' + bi + '</text>';
      o += '<rect class="ml-bit' + (bitOn(bi) ? " is-on" : "") + '" x="' + x + '" y="26" width="20" height="20" rx="3"/>';
      o += '<text class="ml-bit-t" x="' + (x + 10) + '" y="41">' + (bitOn(bi) ? 1 : 0) + '</text>';
    }
    o += '<text class="p1-slice-k" x="20" y="68">' + 'Word 0x000F written as a number: the lit bits sit on the right (bits 0–3)' + '</text>';

    for (var q = 0; q < 16; q++) {
      var px = 20 + q * 24;
      o += '<rect class="ml-bit' + (bitOn(q) ? " is-on" : "") + '" x="' + px + '" y="88" width="20" height="20" rx="3"/>';
      o += '<text class="p1-slice-n" x="' + (px + 10) + '" y="126" text-anchor="middle">' + q + '</text>';
    }
    o += '<text class="p1-slice-k" x="20" y="150">' + 'On screen: the same bits light up on the left (leftmost = bit 0)' + '</text>';

    return '<svg class="p1-svg" viewBox="0 0 430 168" role="img">' + o + '</svg>';
  }

  function view() {
    return '<section class="page-head page-head-screen">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Output · Screen</p>' +
      '<h1>' + 'The screen: drawing is writing memory' + '</h1>' +
      '<p class="page-head-lead">' + 'Hack has no draw instruction and no graphics card. The screen is <b>a particular block of memory</b> — ' + '' +
      '' + 'write 0s and 1s into the 8K words starting at 16384 and the pixels follow. This page shows how that memory maps onto pixels, and how to write it.' + '</p>' +
      '</div></section>' +

      CS.lineNav('screen', 'wrap') +

      '<section class="clock-section"><div class="wrap">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>' + 'Where the screen lives: RAM 16384–24575' + '</h2>' +
      '<p>' + 'The first 16K of RAM is ordinary data (variables, stack); the next <b>8K words</b> are the screen:' + '</p>' +
      '<table class="layer-table"><thead><tr><th>' + 'Address' + '</th><th>' + 'What it is' + '</th><th>' + 'Size' + '</th></tr></thead><tbody>' +
      '<tr><td class="mono">0 – 16383</td><td>' + 'data' + '</td><td>' + '16K words' + '</td></tr>' +
      '<tr><td class="mono">16384 – 24575</td><td><b>' + 'screen' + '</b></td><td>' + '8192 words' + '</td></tr>' +
      '<tr><td class="mono">24576</td><td>' + 'keyboard' + '</td><td>' + '1 word' + '</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'So <code>@SCREEN</code> in assembly is just <code>@16384</code> — a predefined symbol, not a new instruction.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>' + 'One bit = one pixel' + '</h2>' +
      '<p>' + 'The screen is <b>512 × 256</b> black-and-white pixels. One 16-bit word lights 16 consecutive pixels: ' + '</p>' +
      bitmapSvg() +
      '<p>' + 'Do the arithmetic: 512 ÷ 16 = <b>32 words per row</b>; 256 rows × 32 = <b>8192 words</b>, exactly the block above.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>' + 'The address formula' + '</h2>' +
      '<p>' + 'Row <code>r</code>, word <code>c</code> (c from 0 to 31):' + '</p>' +
      '<pre class="hdl-code">' + 'address = 16384 + 32 × r + c' + '</pre>' +
      '<p>' + 'and bit <code>b</code> of that word (b from 0 to 15, <b>bit 0 leftmost</b>) is pixel column <code>c × 16 + b</code>.' + '</p>' +
      '<p class="bits-tip">' + 'The order is reversed: written as a number bit 15 is leftmost, but on screen the leftmost pixel is <b>bit 0</b>. ' + '' +
      '' + 'Writing <code>0x0001</code> lights the leftmost pixel of the row; <code>0x8000</code> lights the rightmost.' + '</p>' +
      '<table class="layer-table"><thead><tr><th>' + 'What you want to draw' + '</th><th>' + 'How' + '</th></tr></thead><tbody>' +
      '<tr><td>' + 'a row' + '</td><td>' + 'compute the address of its first word, then write 32 words' + '</td></tr>' +
      '<tr><td>' + 'one pixel' + '</td><td>' + 'read that word, set one bit, write it back' + '</td></tr>' +
      '<tr><td>' + 'the whole screen' + '</td><td>' + 'write 8192 words starting at 16384' + '</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'There is no shortcut around read-modify-write: to set a bit you do <code>D=M</code>, <code>D=D|mask</code>, then <code>M=D</code>.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>' + 'Hands-on: click cells and watch the words change' + '</h2>' +
      '<p>' + 'Below is a 32 × 16 mini screen. Each row of 32 pixels is <b>2 words</b>. Click any cell and the two words’ binary and addresses update on the right. ' + '' +
      '' + 'Click the leftmost pixel and the last bit of the binary flips to 1.' + '</p>' +
      '<div class="scr-wrap">' + canvasHtml() + '</div>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>' + 'Three useful assembly snippets' + '</h2>' +
      '<p><b>' + 'Clear the screen' + '</b>' + ': write 0 into all 8192 words.' + '</p>' +
      (EN ? `<pre class="hdl-code">@SCREEN
D=A
@i
M=D
(LOOP)
@i
D=M
@24576
D=D-A        // stop once we reach 24576
@END
D;JEQ
@i
A=M
M=0          // clear the current word
@i
M=M+1
@LOOP
0;JMP
(END)
@END
0;JMP</pre>`
: '') +
      '<p><b>' + 'Fill one row' + '</b>' + ': write -1 into all 32 words of a row (all 16 bits set).' + '</p>' +
      '<p class="bits-tip">' + 'The 16-bit form of -1 is all ones, so one <code>M=-1</code> lights 16 pixels — a row takes only 32 writes.' + '</p>' +
      '<p><b>' + 'Draw one pixel' + '</b>' + ': compute the word address and the mask, then read-modify-write.' + '</p>' +
      (EN ? `<pre class="hdl-code">// draw pixel (x, y):
//   addr = 16384 + 32*y + (x / 16)
//   mask = 1 << (x % 16)     <- bit 0 is leftmost
// Hack has no multiply, divide or shift:
//   32*y, x/16 and x%16 must all be computed with loops (assumed done here)

@addr
A=M
D=M          // read the word's current 16 pixels
@mask        // only the bit to light is 1 in mask
D=D|M        // set that bit, leave the rest
@addr
A=M
M=D          // write it back to the screen</pre>`
: '') +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>' + 'Why design it this way' + '</h2>' +
      '<p>' + 'Making the screen ordinary memory means <b>the CPU never needs to know a screen exists</b>: it writes an address, and the hardware (address decoding inside Memory) turns the write into pixels.' + '</p>' +
      '<table class="layer-table"><thead><tr><th>' + 'Approach' + '</th><th>' + 'Price' + '</th></tr></thead><tbody>' +
      '<tr><td>' + 'Memory mapping (what Hack does)' + '</td><td>' + 'drawing is writing memory; the CPU stays simple, but it costs 8K of address space' + '</td></tr>' +
      '<tr><td>' + 'Dedicated display instructions' + '</td><td>' + 'the CPU needs extra control logic and opcodes' + '</td></tr>' +
      '<tr><td>' + 'A separate graphics card' + '</td><td>' + 'another processor and its own memory — not in this course' + '</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'The price is real too: a frame is 8K words, thousands of instructions word by word, which is why animation on Hack stays modest.' + '</p>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {
    var root = document.querySelector('.clock-section');
    if (!root) return;
    var wrap = root.querySelector('.scr-wrap');
    if (!wrap) return;

    function paint() {
      wrap.innerHTML = canvasHtml();
    }
    paint();

    wrap.addEventListener('click', function (e) {
      var cell = e.target.closest('.scr-cell');
      if (!cell) return;
      var r = +cell.dataset.r, c = +cell.dataset.c;
      state.bits[r][c] = state.bits[r][c] ? 0 : 1;
      paint();
    });
  }

  return { view: view, mount: mount };
})();
