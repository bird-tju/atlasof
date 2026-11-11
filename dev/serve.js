const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dist');
const PORT = Number(process.argv[2] || 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  if (!fs.existsSync(file) && fs.existsSync(file + '/index.html')) file = file + '/index.html';
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const fallback = path.join(ROOT, '404.html');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(fs.existsSync(fallback) ? fs.readFileSync(fallback) : 'not found');
  }
  const ext = path.extname(file);
  const headers = { 'content-type': TYPES[ext] || 'application/octet-stream' };
  // HTML must never be reused from cache in development: a stale page would keep
  // pointing at the previous asset URLs even after a rebuild.
  headers['cache-control'] = ext === '.html' ? 'no-store, must-revalidate' : 'no-cache';
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => {
  console.log('serving http://127.0.0.1:' + PORT + '/');
});
