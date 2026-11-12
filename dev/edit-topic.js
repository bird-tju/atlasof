/* Replace the body array and reading array of one topic, locating each array by
   bracket depth rather than "first ]" — nested arrays broke that twice already.
   Emits real JS string literals (escaping apostrophes) instead of doing quote
   surgery on JSON, and validates before finishing. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function findArray(src, from, key) {
  const start = src.indexOf(key + ': [', from);
  if (start < 0) return null;
  const open = start + key.length + 2;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) return { start, open, close: i };
    }
  }
  return null;
}

function jsStr(v) {
  return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const repo = path.join(__dirname, '..');
const full = path.join(repo, spec.file);

let s = fs.readFileSync(full, 'utf8');
const topicAt = s.indexOf("id: '" + spec.id + "'");
if (topicAt < 0) { console.error('topic not found: ' + spec.id); process.exit(1); }

const body = findArray(s, topicAt, 'body');
const reading = findArray(s, topicAt, 'reading');
if (!body || !reading) { console.error('arrays not found'); process.exit(1); }
if (reading.start < body.close) { console.error('unexpected layout'); process.exit(1); }

const bodyRaw = '[\n' + spec.body.map(function (t) {
  return '      ' + jsStr(t);
}).join(',\n') + '\n    ]';

const readingRaw = '[\n' + spec.reading.map(function (r) {
  return '      [' + r.map(jsStr).join(', ') + ']';
}).join(',\n') + '\n    ]';

s = s.slice(0, reading.start) + 'reading: ' + readingRaw + s.slice(reading.close + 1);
s = s.slice(0, body.start) + 'body: ' + bodyRaw + s.slice(body.close + 1);

fs.writeFileSync(full, s, 'utf8');

try {
  execFileSync('node', ['--check', full], { cwd: repo, stdio: 'inherit' });
  console.log('syntax ok');
} catch (e) {
  console.error('SYNTAX ERROR after edit');
  process.exit(1);
}

try {
  execFileSync('node', ['dev/check.js'], { cwd: repo, stdio: 'inherit' });
  console.log('data check ok');
} catch (e) {
  console.error('DATA CHECK FAILED');
  process.exit(1);
}

console.log('paragraphs:', spec.body.length, '| chars:', spec.body.join(' ').length, '| sources:', spec.reading.length);
