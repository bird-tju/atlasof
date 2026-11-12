/* Render the social card and the touch icon for each atlas.
   Usage: start headless Chrome with --remote-debugging-port=9222, then
          node dev/make-images.js
   Output: atlases/<id>/og.png (1200x630), atlases/<id>/icon-180.png (180x180)

   Kept in the repo so the images can be regenerated when the wording changes.
   They are baked at whatever font the machine resolves, which is why they are
   committed rather than built at deploy time. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ATLASES = [
  { id: 'cs', label: 'CS ATLAS', line1: 'A map of', line2: 'computer science', note: '13 domains · 75 topics · 326 milestones' },
  { id: 'math', label: 'MATH ATLAS', line1: 'A map of', line2: 'mathematics', note: 'Structure in place — content in progress' }
];

const FONT = "'Inter','Segoe UI Variable Text','Segoe UI',system-ui,-apple-system,sans-serif";
const MONO = "ui-monospace,'Cascadia Code','SF Mono',Menlo,Consolas,monospace";

function ogHtml(a) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}
    body{margin:0;width:1200px;height:630px;background:#070910;color:#e9ebf2;font-family:${FONT};overflow:hidden}
    .glow{position:absolute;inset:0;background:
      radial-gradient(760px 420px at 84% 12%, rgba(122,162,247,.16), transparent 70%),
      radial-gradient(620px 340px at 8% 92%, rgba(224,175,104,.10), transparent 70%)}
    .wrap{position:relative;height:100%;padding:72px 76px;display:flex;flex-direction:column;justify-content:space-between}
    .eyebrow{font-family:${MONO};font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#7aa2f7}
    h1{margin:0;font-size:78px;line-height:1.04;letter-spacing:-.035em;font-weight:640}
    h1 em{font-style:normal;color:#7aa2f7}
    .note{margin-top:26px;font-size:23px;line-height:1.4;color:#a8afc2}
    .foot{display:flex;justify-content:space-between;align-items:center;font-family:${MONO};font-size:15px;letter-spacing:.08em;color:#6d758a;border-top:1px solid rgba(255,255,255,.08);padding-top:22px}
  </style></head><body>
    <div class="glow"></div>
    <div class="wrap">
      <div class="eyebrow">${a.label}</div>
      <div>
        <h1>${a.line1}<br><em>${a.line2}</em></h1>
        <div class="note">${a.note}</div>
      </div>
      <div class="foot"><span>atlas</span><span>${a.id === 'cs' ? '/cs/' : '/' + a.id + '/'}</span></div>
    </div>
  </body></html>`;
}

function iconHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;width:180px;height:180px;background:#070910;display:grid;place-items:center}
    svg{width:132px;height:132px}
  </style></head><body>
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#7aa2f7" stroke-width="1.6" stroke-linejoin="round">
      <path d="M9 22 16 9l7 13M9 22h14M16 9v13"/>
    </g>
    <g fill="#e0af68">
      <circle cx="16" cy="9" r="2.4"/><circle cx="9" cy="22" r="2.4"/><circle cx="23" cy="22" r="2.4"/>
    </g>
  </svg></body></html>`;
}

function getJSON(u) {
  return new Promise((res, rej) => {
    http.get(u, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}

(async () => {
  const tabs = await getJSON('http://127.0.0.1:9222/json/list');
  const tab = tabs.find((t) => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pend = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  };
  const send = (method, params) => new Promise((res) => {
    const mid = ++id;
    pend.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
  });
  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable');

  async function shot(html, w, h, out) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(html) });
    await new Promise((r) => setTimeout(r, 700));
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(out, Buffer.from(s.result.data, 'base64'));
    console.log('wrote', out, (fs.statSync(out).size / 1024).toFixed(0) + 'KB');
  }

  for (const a of ATLASES) {
    const dir = path.join(__dirname, '..', 'atlases', a.id);
    await shot(ogHtml(a), 1200, 630, path.join(dir, 'og.png'));
    await shot(iconHtml(), 180, 180, path.join(dir, 'icon-180.png'));
  }
  ws.close();
})();
