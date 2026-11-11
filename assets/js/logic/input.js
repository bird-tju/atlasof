window.CS = window.CS || {};
CS.InputUI = (function () {
  'use strict';

  var SPECIAL = {
    128: 'Enter', 129: 'Backspace', 130: '←', 131: '↑', 132: '→', 133: '↓',
    134: 'Home', 135: 'End', 136: 'PgUp', 137: 'PgDn', 138: 'Insert', 139: 'Delete', 140: 'Esc'
  };

  var KEYS = [];
  (function () {
    for (var d = 0; d <= 9; d++) KEYS.push({ label: String(d), code: 48 + d });
    for (var a = 0; a < 26; a++) KEYS.push({ label: String.fromCharCode(65 + a), code: 65 + a });
    KEYS.push({ label: 'Space', code: 32 });
    KEYS.push({ label: 'Enter', code: 128 });
    KEYS.push({ label: 'Back', code: 129 });
    KEYS.push({ label: '←', code: 130 });
    KEYS.push({ label: '↑', code: 131 });
    KEYS.push({ label: '→', code: 132 });
    KEYS.push({ label: '↓', code: 133 });
    KEYS.push({ label: 'Esc', code: 140 });
  })();

  var state = { code: 0 };

  function charOf(code) {
    if (!code) return '' + '(no key)' + '';
    if (SPECIAL[code]) return SPECIAL[code];
    if (code >= 32 && code < 127) return String.fromCharCode(code);
    return '' + 'undefined' + '';
  }

  function bin16(v) {
    return ('0000000000000000' + (v & 0xFFFF).toString(2)).slice(-16);
  }

  function keypadHtml() {
    var out = KEYS.map(function (k) {
      return '<button type="button" class="kb-key' + (state.code === k.code ? ' is-on' : '') +
        '" data-code="' + k.code + '">' + k.label + '</button>';
    }).join('');
    return '<div class="kb-grid">' + out + '</div>' +
      '<div class="kb-row"><button type="button" class="clk-btn" id="kb-release">' + 'Release all (KBD = 0)' + '</button></div>';
  }

  function readoutHtml() {
    var c = state.code;
    var bits = bin16(c).split('').map(function (b, i) {
      return '<span class="ib g-c' + (b === '1' ? '' : ' is-off') + '">' + b + '</span>';
    }).join('');
    return '<div class="kb-read">' +
      '<div class="kb-line"><span class="kb-k">KBD[24576]</span><span class="mono kb-v">' + bin16(c) + '</span></div>' +
      '<div class="kb-bits">' + bits + '</div>' +
      '<div class="kb-line"><span class="kb-k">' + 'decimal' + '</span><span class="mono kb-v">' + c + '</span></div>' +
      '<div class="kb-line"><span class="kb-k">' + 'hex' + '</span><span class="mono kb-v">' + '0x' + ('000' + c.toString(16).toUpperCase()).slice(-4) + '</span></div>' +
      '<div class="kb-line"><span class="kb-k">' + 'character' + '</span><span class="mono kb-v kb-char">' + charOf(c) + '</span></div>' +
      '</div>';
  }

  function demoHtml() {
    return '<div class="kb-wrap">' +
      '<div class="kb-panel">' + keypadHtml() + '</div>' +
      '<div class="kb-panel">' + readoutHtml() + '</div>' +
      '</div>';
  }

  function codesTable() {
    var rows = [
      ['0 – 9', '48 – 57', 'digit keys'],
      ['A – Z', '65 – 90', 'uppercase letters (lowercase is 97–122)'],
      ['Space', '32', 'space'],
      ['Enter', '128', 'return'],
      ['Backspace', '129', 'backspace'],
      ['← ↑ → ↓', '130 – 133', 'arrow keys'],
      ['Esc', '140', 'escape']
    ];
    return '<table class="layer-table"><thead><tr><th>' + 'Key' + '</th><th>' + 'Scan code' + '</th><th>' + 'Note' + '</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="mono">' + r[0] + '</td><td class="mono">' + r[1] + '</td><td>' + r[2] + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function view() {
    return '<section class="page-head page-head-input">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Input · Keyboard</p>' +
      '<h1>' + 'The keyboard: reading one memory address' + '</h1>' +
      '<p class="page-head-lead">' + 'Like the screen, the keyboard has no input instruction. It is simply the word at <b>RAM[24576]</b>: ' + '' +
      '' + 'while a key is held the word holds that key’s scan code; released, it is 0. All a program does is keep reading it.' + '</p>' +
      '</div></section>' +

      CS.lineNav('input', 'wrap') +

      '<section class="clock-section"><div class="wrap">' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">01</span>' + 'The keyboard lives at 24576' + '</h2>' +
      '<table class="layer-table"><thead><tr><th>' + 'Address' + '</th><th>' + 'What it is' + '</th></tr></thead><tbody>' +
      '<tr><td class="mono">16384 – 24575</td><td>' + 'screen (8K words)' + '</td></tr>' +
      '<tr><td class="mono">24576</td><td><b>' + 'keyboard' + '</b>' + ' (1 word)' + '</td></tr>' +
      '<tr><td class="mono">24577 – 32767</td><td>' + 'unused' + '</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + '<code>@KBD</code> in assembly is just <code>@24576</code>. The CPU has no idea a keyboard exists — it only reads an address.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">02</span>' + 'What the word holds: a scan code' + '</h2>' +
      '<p>' + 'Pressing a key makes the hardware write its code into 24576; releasing writes 0. The codes follow ASCII, so the common ones are easy to remember:' + '</p>' +
      codesTable() +
      '<p class="bits-tip">' + 'Only <b>one</b> value at a time: hold two keys and you read the last one pressed. There is no buffer and no queue.' + '</p>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">03</span>' + 'No interrupts, only polling' + '</h2>' +
      '<p>' + 'Hack has no “notify me on a key press”. To wait for a key you <b>read it in a loop</b>: ' + '</p>' +
      `<pre class="hdl-code">(WAIT)
@KBD
D=M          // read the keyboard
@WAIT
D;JEQ        // still 0 (no key): keep waiting
// a key is down; D holds its scan code</pre>` +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">04</span>' + 'Hands-on: press a key and watch 24576 change' + '</h2>' +
      '<p>' + 'Click a key: the right side shows KBD in binary, decimal and as a character; “Release all” sets it back to 0.' + '</p>' +
      '<div data-kb></div>' +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">05</span>' + 'Three common patterns' + '</h2>' +
      '<p><b>' + 'Echo the key to the top-left corner' + '</b>' + ': write the code into the word at 16384.' + '</p>' +
      `<pre class="hdl-code">(LOOP)
@KBD
D=M
@LOOP
D;JEQ
@SCREEN
M=D          // top-left 16 pixels = the code in binary</pre>` +
      '</div>' +

      '<div class="clock-block">' +
      '<h2><span class="bits-num">06</span>' + 'Why design it this way' + '</h2>' +
      '<table class="layer-table"><thead><tr><th>' + 'Approach' + '</th><th>' + 'Price' + '</th></tr></thead><tbody>' +
      '<tr><td><b>' + 'Memory mapping + polling' + '</b>' + ' (Hack)' + '</td><td>' + 'the CPU spins; but the hardware is minimal and the CPU never learns a keyboard exists' + '</td></tr>' +
      '<tr><td>' + 'Interrupts' + '</td><td>' + 'the CPU needs interrupt control: saving and restoring state, priorities' + '</td></tr>' +
      '<tr><td>' + 'DMA or a dedicated controller' + '</td><td>' + 'extra chips and a protocol' + '</td></tr>' +
      '</tbody></table>' +
      '<p class="bits-tip">' + 'As with the screen, this is the same idea: turn devices into addresses. Input and output collapse into reading and writing memory, so the CPU has only one way to touch the world.' + '</p>' +
      '</div>' +

      '</div></section>';
  }

  function mount() {
    var root = document.querySelector('.clock-section');
    if (!root) return;
    var host = root.querySelector('[data-kb]');
    if (!host) return;

    function paint() {
      host.innerHTML = demoHtml();
    }
    paint();

    host.addEventListener('click', function (e) {
      var key = e.target.closest('[data-code]');
      if (key) {
        state.code = parseInt(key.dataset.code, 10);
        paint();
        return;
      }
      if (e.target.id === 'kb-release') {
        state.code = 0;
        paint();
      }
    });
  }

  return { view: view, mount: mount };
})();
