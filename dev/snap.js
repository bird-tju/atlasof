const fs = require('fs');
const path = require('path');

const PORT = 9222;
const ROOT = path.join(__dirname, '..');
const BASE = 'file:///' + ROOT.replace(/\\/g, '/') + '/atlases/cs/index.html';
const [, , hash = '', name = 'snap', mode = 'full', widthArg = '1440'] = process.argv;
const WIDTH = Number(widthArg) || 1440;
const HEIGHT = WIDTH < 720 ? 844 : 1000;

async function getTarget() {
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
      const data = JSON.parse(msg.data);
      if (data.id && pending.has(data.id)) {
        const { res, rej } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) rej(new Error(data.error.message)); else res(data.result);
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
  const target = await getTarget();
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: WIDTH < 720 ? 2 : 1, mobile: WIDTH < 720 });
  await cdp.send('Page.navigate', { url: 'about:blank' });
  await sleep(200);
  await cdp.send('Page.navigate', { url: BASE + hash });
  await sleep(900);

  let clip;
  if (mode === 'full') {
    const m = await cdp.send('Page.getLayoutMetrics');
    clip = { x: 0, y: 0, width: WIDTH, height: Math.min(m.cssContentSize.height, 14000), scale: 1 };
  } else if (mode === 'viewport') {
    clip = { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 };
  } else {
    const { result } = await cdp.send('Runtime.evaluate', {
      expression: `(() => { const el = document.querySelector(${JSON.stringify(mode)}); if (!el) return null;
        el.scrollIntoView({block:'start'});
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top + window.scrollY, width: r.width, height: r.height }; })()`,
      returnByValue: true
    });
    if (!result.value) { console.error('selector not found:', mode); process.exit(1); }
    clip = { ...result.value, scale: 1 };
  }

  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: true, clip });
  fs.writeFileSync(path.join(ROOT, 'shots', name + '.png'), Buffer.from(data, 'base64'));
  console.log('saved', name, JSON.stringify(clip));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
