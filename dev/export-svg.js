const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'svg');
const PAGE = 'file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/') + '#/p1';

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

async function main() {
  const tabs = await getJSON('http://127.0.0.1:9222/json/list');
  let tab = tabs.find((t) => t.type === 'page');
  if (!tab) throw new Error('没有可用的页面目标');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params) => new Promise((resolve) => {
    const mid = ++id;
    pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  await new Promise((r) => (ws.onopen = r));

  await send('Page.enable', {});
  await send('Page.navigate', { url: PAGE });
  await new Promise((r) => setTimeout(r, 1200));

  const res = await send('Runtime.evaluate', {
    expression: 'JSON.stringify(CS.P1UI.exportSvg())',
    returnByValue: true,
    awaitPromise: true
  });
  const raw = res.result && res.result.result && res.result.result.value;
  if (!raw) throw new Error('导出失败：' + JSON.stringify(res).slice(0, 300));
  const data = JSON.parse(raw);

  fs.mkdirSync(OUT, { recursive: true });
  Object.keys(data).forEach((k) => {
    const file = path.join(OUT, 'bhack-' + k + '.svg');
    fs.writeFileSync(file, data[k], 'utf8');
    console.log('saved', path.relative(ROOT, file));
  });
  ws.close();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
