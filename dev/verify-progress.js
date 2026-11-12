const PORT = 9222;
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'file:///' + ROOT.replace(/\\/g, '/') + '/atlases/cs/index.html';

async function target() {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  return list.find((t) => t.type === 'page');
}
function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    ws.onopen = () => resolve({ send });
    ws.onerror = reject;
    ws.onmessage = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id && pending.has(d.id)) {
        const { res, rej } = pending.get(d.id);
        pending.delete(d.id);
        if (d.error) rej(new Error(d.error.message)); else res(d.result);
      }
    };
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const mid = ++id;
        pending.set(mid, { res, rej });
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
    }
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const cdp = await connect((await target()).webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const evalJs = async (expr) => {
    const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception && exceptionDetails.exception.description || ''));
    return result.value;
  };

  await cdp.send('Page.navigate', { url: BASE + '#/topic/unix' });
  await sleep(900);

  const storageOk = await evalJs(`(() => { try { localStorage.setItem('__t','1'); const v = localStorage.getItem('__t'); localStorage.removeItem('__t'); return v === '1'; } catch (e) { return 'error: ' + e.name; } })()`);
  console.log('localStorage on file:// =>', storageOk);

  await evalJs(`document.querySelectorAll('.status-btn')[2].click()`);
  await sleep(150);
  console.log('after click, active =', await evalJs(`document.querySelector('.status-btn.is-active').textContent`));
  console.log('store =', await evalJs(`localStorage.getItem('cs-atlas.progress.v1')`));

  await cdp.send('Page.reload', { ignoreCache: true });
  await sleep(900);
  console.log('after reload, active =', await evalJs(`document.querySelector('.status-btn.is-active').textContent`));
  console.log('due text =', await evalJs(`document.querySelector('.status-due').textContent`));

  await evalJs(`location.hash = '#/progress'`);
  await sleep(700);
  console.log('progress stats =', await evalJs(`Array.from(document.querySelectorAll('.stat strong')).map(e => e.textContent).join(' | ')`));
  console.log('next items =', await evalJs(`document.querySelectorAll('.next-item').length`));
  console.log('blind items =', await evalJs(`document.querySelectorAll('.blind-list p').length`));
  console.log('review items =', await evalJs(`document.querySelectorAll('.review-item').length`));

  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
