/* Data validation: unique topic ids, valid domains and references, complete fields.
   Usage: node dev/check.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = path.join(__dirname, '..', 'assets', 'js', 'data');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.js')).sort((a, b) =>
  a === 'core.js' ? -1 : b === 'core.js' ? 1 : a.localeCompare(b)
);

const ctx = { console };
vm.createContext(ctx);
for (const f of files) {
  vm.runInContext('var window = globalThis;\n' + fs.readFileSync(path.join(DIR, f), 'utf8'), ctx, { filename: f });
}

const CS = ctx.CS;
const errors = [];
const ids = new Set();
const domainIds = new Set(CS.domains.map((d) => d.id));

for (const t of CS.topics) {
  if (ids.has(t.id)) errors.push(`duplicate id: ${t.id}`);
  ids.add(t.id);
  if (!domainIds.has(t.domain)) errors.push(`${t.id}: unknown domain ${t.domain}`);
  for (const k of ['name', 'summary', 'year']) {
    if (t[k] == null) errors.push(`${t.id}: missing ${k}`);
  }
  if (!Array.isArray(t.body) || !t.body.length) errors.push(`${t.id}: missing body`);
  if (!Array.isArray(t.milestones) || !t.milestones.length) errors.push(`${t.id}: missing milestones`);
  for (const m of t.milestones || []) {
    if (typeof m[0] !== 'number' || !m[1]) errors.push(`${t.id}: malformed milestone ${JSON.stringify(m)}`);
  }
  for (const k of ['related', 'concepts', 'people', 'reading', 'tags']) {
    if (!Array.isArray(t[k])) errors.push(`${t.id}: ${k} should be an array`);
  }
  for (const p of t.people || []) {
    if (!p[0] || !p[1]) errors.push(`${t.id}: person missing name or dates`);
  }
  for (const c of t.concepts || []) {
    if (!c[0] || !c[1]) errors.push(`${t.id}: concept missing name or explanation`);
  }
}

for (const t of CS.topics) {
  for (const r of t.related) {
    if (!ids.has(r)) errors.push(`${t.id}: related points at a missing topic ${r}`);
    if (r === t.id) errors.push(`${t.id}: related points at itself`);
  }
}

for (const p of CS.paths) {
  for (const s of p.steps) if (!ids.has(s)) errors.push(`路径 ${p.id}: unknown step ${s}`);
}

for (const d of CS.domains) {
  if (!CS.topics.some((t) => t.domain === d.id)) errors.push(`domain ${d.id} has no topics`);
}

/* Learning layer: prerequisites and hands-on tasks */
const prereq = CS.prereqs || {};
const practice = CS.practice || {};
for (const t of CS.topics) {
  if (!Array.isArray(prereq[t.id])) errors.push(`${t.id}: missing prereq 定义`);
  if (!practice[t.id]) errors.push(`${t.id}: missing practice 动手任务`);
  for (const p of prereq[t.id] || []) {
    if (!ids.has(p)) errors.push(`${t.id}: prereq points at a missing topic ${p}`);
    if (p === t.id) errors.push(`${t.id}: prereq points at itself`);
  }
}
for (const id of Object.keys(prereq)) {
  if (!ids.has(id)) errors.push(`prereq contains an unknown topic ${id}`);
}
{
  const state = new Map();
  const stack = [];
  const visit = (id) => {
    const s = state.get(id);
    if (s === 2) return;
    if (s === 1) {
      errors.push('prerequisite cycle: ' + stack.slice(stack.indexOf(id)).concat(id).join(' → '));
      return;
    }
    state.set(id, 1);
    stack.push(id);
    for (const p of prereq[id] || []) visit(p);
    stack.pop();
    state.set(id, 2);
  };
  for (const t of CS.topics) visit(t.id);
}

const roots = CS.topics.filter((t) => (prereq[t.id] || []).length === 0).length;

/* Courses and labs */
const courses = CS.courses || {};
for (const d of CS.domains) {
  const c = courses[d.id];
  if (!c) { errors.push(`domain ${d.id}: missing course mapping`); continue; }
  if (!['lab', 'mixed', 'none'].includes(c.type)) errors.push(`domain ${d.id}: invalid type ${c.type}`);
  if (!Array.isArray(c.courses) || !c.courses.length) errors.push(`domain ${d.id}: missing course list`);
  if (!Array.isArray(c.labs) || !c.labs.length) errors.push(`domain ${d.id}: missing lab list`);
  if (!c.note) errors.push(`domain ${d.id}: missing note`);
  for (const l of c.labs || []) {
    if (!l[0] || !l[1]) errors.push(`domain ${d.id}: malformed lab entry`);
  }
}
const labCount = Object.values(courses).filter((c) => c.type === 'lab').length;
const mixedCount = Object.values(courses).filter((c) => c.type === 'mixed').length;
const noneCount = Object.values(courses).filter((c) => c.type === 'none').length;

const milestones = CS.topics.reduce((a, t) => a + t.milestones.length, 0);
const people = new Set(CS.topics.flatMap((t) => t.people.map((p) => p[0]))).size;
const years = CS.topics.map((t) => t.year).sort((a, b) => a - b);

console.log(`domain ${CS.domains.length} · topics ${CS.topics.length} · milestones ${milestones} · people ${people}`);
console.log(`topic years ${years[0]} → ${years[years.length - 1]}`);
console.log(`practice tasks ${Object.keys(practice).length} 条 · root topics ${roots} 个`);
console.log(`lab types: standalone ${labCount} · in-class+project ${mixedCount} · almost none ${noneCount}`);
for (const d of CS.domains) {
  console.log(`  ${d.name.padEnd(12, ' ')} ${CS.topics.filter((t) => t.domain === d.id).length} topics`);
}

if (errors.length) {
  console.error(`\nfound ${errors.length} problems:`);
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}
console.log('\nData validation passed.');
