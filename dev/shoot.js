const fs = require('fs');
const path = require('path');

const PORT = 9222;
const ROOT = path.join(__dirname, '..');
const BASE = 'file:///' + ROOT.replace(/\\/g, '/') + '/atlases/cs/index.html';

async function getTarget() {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  const page = list.find((t) => t.type === 'page');
  if (page) return page;
  const created = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  return created;
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const events = new Map();
    ws.onopen = () => resolve({ send, on, close: () => ws.close() });
    ws.onerror = reject;
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id && pending.has(data.id)) {
        const { res, rej } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) rej(new Error(data.error.message)); else res(data.result);
      } else if (data.method && events.has(data.method)) {
        events.get(data.method).forEach((fn) => fn(data.params));
        events.delete(data.method);
      }
    };
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const mid = ++id;
        pending.set(mid, { res, rej });
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
    }
    function on(method, fn) {
      if (!events.has(method)) events.set(method, []);
      events.get(method).push(fn);
    }
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const target = await getTarget();
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  async function navigate(hash) {
    await cdp.send('Page.navigate', { url: BASE + hash });
    await sleep(900);
    await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
    await sleep(250);
  }

  async function shot(name, full = false) {
    let params = { format: 'png', fromSurface: true };
    if (full) {
      const metrics = await cdp.send('Page.getLayoutMetrics');
      const size = metrics.cssContentSize;
      params.captureBeyondViewport = true;
      params.clip = { x: 0, y: 0, width: 1440, height: Math.min(size.height, 14000), scale: 1 };
    }
    const { data } = await cdp.send('Page.captureScreenshot', params);
    fs.writeFileSync(path.join(ROOT, 'shots', name + '.png'), Buffer.from(data, 'base64'));
    console.log('saved', name);
  }

  fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });

  await navigate('');
  await shot('home-viewport', false);
  await shot('home-full', true);

  await cdp.send('Runtime.evaluate', { expression: "document.getElementById('search-trigger').click()" });
  await sleep(350);
  await cdp.send('Runtime.evaluate', {
    expression: "var i=document.getElementById('search-input'); i.value='图灵'; i.dispatchEvent(new Event('input',{bubbles:true}));"
  });
  await sleep(350);
  await shot('search', false);
  await cdp.send('Runtime.evaluate', { expression: "document.querySelector('[data-search-close]').click()" });
  await sleep(200);

  await navigate('#/map');
  await sleep(400);
  await shot('map', false);
  await shot('map-full', true);

  await navigate('#/timeline');
  await shot('timeline', false);

  await navigate('#/domains');
  await shot('domains', false);

  await navigate('#/domain/theory');
  await shot('domain', false);

  await navigate('#/topic/transformer');
  await shot('topic', false);
  await shot('topic-full', true);

  await navigate('#/paths');
  await shot('paths', false);

  await navigate('#/path/logic-to-machines');
  await shot('path-detail', false);

  await navigate('#/about');
  await shot('about', false);

  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await navigate('');
  await shot('mobile-home', false);
  await navigate('#/map');
  await shot('mobile-map', false);

  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Runtime.evaluate', { expression: "document.getElementById('theme-toggle').click()" });
  await navigate('');
  await sleep(300);
  await shot('light-home', false);
  await navigate('#/topic/deep-learning');
  await shot('light-topic', false);
  await navigate('#/timeline');
  await shot('light-timeline', false);
  await cdp.send('Runtime.evaluate', { expression: "document.getElementById('theme-toggle').click()" });

  cdp.close();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
