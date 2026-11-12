/* HDL snippet check: syntax and references only, no evaluation
   Checks: CHIP structure, IN/OUT, PARTS statements, chip names, pin names, widths,
           whether wires are declared, whether outputs are driven, duplicate drivers
   Usage: node dev/hdl-check.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = {};
vm.createContext(ctx);
vm.runInContext('var window = globalThis; var CS = window.CS = {};\n' + fs.readFileSync(path.join(ROOT, 'atlases/cs/js/data/17-hdl.js'), 'utf8'), ctx, { filename: '17-hdl.js' });
const HDL = ctx.CS.hdl;

/* Known chips with pins and widths (chips defined in the snippet are parsed too) */
const CHIPS = {
  Nand: { in: { a: 1, b: 1 }, out: { out: 1 } },
  Not: { in: { in: 1 }, out: { out: 1 } },
  And: { in: { a: 1, b: 1 }, out: { out: 1 } },
  Or: { in: { a: 1, b: 1 }, out: { out: 1 } },
  Xor: { in: { a: 1, b: 1 }, out: { out: 1 } },
  Mux: { in: { a: 1, b: 1, sel: 1 }, out: { out: 1 } },
  DMux: { in: { in: 1, sel: 1 }, out: { a: 1, b: 1 } },
  Not16: { in: { in: 16 }, out: { out: 16 } },
  And16: { in: { a: 16, b: 16 }, out: { out: 16 } },
  Or16: { in: { a: 16, b: 16 }, out: { out: 16 } },
  Mux16: { in: { a: 16, b: 16, sel: 1 }, out: { out: 16 } },
  Or8Way: { in: { in: 8 }, out: { out: 1 } },
  Mux4Way16: { in: { a: 16, b: 16, c: 16, d: 16, sel: 2 }, out: { out: 16 } },
  Mux8Way16: { in: { a: 16, b: 16, c: 16, d: 16, e: 16, f: 16, g: 16, h: 16, sel: 3 }, out: { out: 16 } },
  DMux4Way: { in: { in: 1, sel: 2 }, out: { a: 1, b: 1, c: 1, d: 1 } },
  DMux8Way: { in: { in: 1, sel: 3 }, out: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1 } },
  HalfAdder: { in: { a: 1, b: 1 }, out: { sum: 1, carry: 1 } },
  FullAdder: { in: { a: 1, b: 1, c: 1 }, out: { sum: 1, carry: 1 } },
  Add16: { in: { a: 16, b: 16 }, out: { out: 16 } },
  Inc16: { in: { in: 16 }, out: { out: 16 } },
  ALU: { in: { x: 16, y: 16, zx: 1, nx: 1, zy: 1, ny: 1, f: 1, no: 1 }, out: { out: 16, zr: 1, ng: 1 } },
  DFF: { in: { in: 1 }, out: { out: 1 } },
  Bit: { in: { in: 1, load: 1 }, out: { out: 1 } },
  Register: { in: { in: 16, load: 1 }, out: { out: 16 } },
  ARegister: { in: { in: 16, load: 1 }, out: { out: 16 } },
  ROM32K: { in: { address: 15 }, out: { out: 16 } },
  Screen: { in: { in: 16, load: 1, address: 13 }, out: { out: 16 } },
  Keyboard: { in: {}, out: { out: 16 } },
  Memory: { in: { in: 16, load: 1, address: 15 }, out: { out: 16 } },
  Computer: { in: { reset: 1 }, out: {} },
  DRegister: { in: { in: 16, load: 1 }, out: { out: 16 } },
  PC: { in: { in: 16, load: 1, inc: 1, reset: 1 }, out: { out: 16 } }
};

/* ---------- Parsing ---------- */
function stripComments(code) {
  return code.replace(/\/\/[^\n]*/g, '');
}
function parsePins(text) {
  const pins = [];
  const re = /([A-Za-z_]\w*)(?:\[(\d+)(?:\.\.(\d+))?\])?/g;
  let m;
  while ((m = re.exec(text))) {
    // In a declaration a[16] means 16 bits wide; a[0..7] selects bits
    let width = 1;
    if (m[2] !== undefined) {
      width = m[3] === undefined ? parseInt(m[2], 10) : parseInt(m[3], 10) - parseInt(m[2], 10) + 1;
    }
    pins.push({ name: m[1], width: width });
  }
  return pins;
}
function parseChip(code, meta) {
  const primitive = !!(meta && meta.primitive);
  const clean = stripComments(code);
  const cm = /CHIP\s+([A-Za-z_]\w*)\s*\{([\s\S]*)\}/.exec(clean);
  if (!cm) return { errors: ['no CHIP definition found'], chip: null };
  const name = cm[1];
  const body = cm[2];
  const errors = [];
  const inM = /(?:^|\n)\s*IN\s+([^;]+);/.exec(body);
  const outM = /(?:^|\n)\s*OUT\s+([^;]+);/.exec(body);
  if (!inM) errors.push('missing IN declaration');
  // OUT may be absent (e.g. Computer has only IN reset)
  if (body.indexOf('PARTS:') < 0 && !primitive) errors.push('缺少 PARTS:');
  const ins = inM ? parsePins(inM[1]) : [];
  const outs = outM ? parsePins(outM[1]) : [];

  const parts = [];
  const partsText = body.indexOf('PARTS:') >= 0 ? body.slice(body.indexOf('PARTS:') + 6) : '';
  const re = /([A-Za-z_]\w*)\s*\(([^)]*)\)\s*(;?)/g;
  let m;
  while ((m = re.exec(partsText))) {
    const line = m.index;
    if (m[3] !== ';') errors.push(`芯片 ${m[1]} 的语句缺分号`);
    const args = [];
    m[2].split(',').forEach((kv) => {
      if (!kv.trim()) return;
      const am = /^\s*([A-Za-z_]\w*)(?:\[(\d+)(?:\.\.(\d+))?\])?\s*=\s*(true|false|([A-Za-z_]\w*)(?:\[(\d+)(?:\.\.(\d+))?\])?)\s*$/.exec(kv);
      if (!am) {
        errors.push(`无法解析参数：${kv.trim()}`);
        return;
      }
      const pFrom = am[2] === undefined ? null : parseInt(am[2], 10);
      const pTo = am[3] === undefined ? pFrom : parseInt(am[3], 10);
      const isConst = am[4] === 'true' || am[4] === 'false';
      const vFrom = am[6] === undefined ? null : parseInt(am[6], 10);
      const vTo = am[7] === undefined ? vFrom : parseInt(am[7], 10);
      args.push({
        pin: am[1],
        pinFrom: pFrom,
        pinTo: pTo,
        pinWidth: pFrom === null ? null : pTo - pFrom + 1,
        const: isConst ? am[4] : null,
        wire: isConst ? null : am[5],
        from: vFrom,
        to: vTo
      });
    });
    parts.push({ name: m[1], args, at: line });
  }
  return { chip: { name, ins, outs, parts }, errors };
}

function rangeBits(from, to) {
  const out = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

function checkChip(chip, iface, hasEllipsis) {
  const errors = [];
  const warnings = [];
  const declared = {};
  chip.ins.concat(chip.outs).forEach((p) => { declared[p.name] = p.width; });

  const driven = {};            // wire -> Set(bits)
  const widthOf = Object.assign({}, declared);

  function drive(wire, bits, by) {
    if (!driven[wire]) driven[wire] = new Set();
    bits.forEach((b) => {
      if (driven[wire].has(b)) errors.push('线路 ' + wire + ' 的第 ' + b + ' 位被重复驱动（' + by + '）');
      driven[wire].add(b);
    });
  }

  chip.parts.forEach((part) => {
    const spec = iface[part.name];
    if (!spec) return;
    part.args.forEach((a) => {
      if (spec.out[a.pin] === undefined || spec.in[a.pin] !== undefined) return;
      const bits = a.from !== null ? rangeBits(a.from, a.to)
        : (a.pinFrom !== null ? rangeBits(a.pinFrom, a.pinTo) : rangeBits(0, spec.out[a.pin] - 1));
      drive(a.wire, bits, part.name + '.' + a.pin);
      if (widthOf[a.wire] === undefined) widthOf[a.wire] = Math.max.apply(null, bits) + 1;
    });
  });

  chip.parts.forEach((part) => {
    const spec = iface[part.name];
    if (!spec) { errors.push('未知芯片 ' + part.name); return; }

    const covered = {};   // 输入脚 -> Set(bits)
    part.args.forEach((a) => {
      const isOut = spec.out[a.pin] !== undefined;
      const isIn = spec.in[a.pin] !== undefined;
      if (!isOut && !isIn) { errors.push(part.name + ' 没有引脚 ' + a.pin); return; }

      const pinW = isOut ? spec.out[a.pin] : spec.in[a.pin];
      if (a.pinWidth !== null && a.to >= pinW) {
        errors.push(part.name + '.' + a.pin + ' 只有 ' + pinW + ' 位，却接到第 ' + a.to + ' 位');
        return;
      }
      if (isOut && a.pinWidth !== null && a.pinWidth > pinW) {
        errors.push(part.name + '.' + a.pin + ' 是 ' + pinW + ' 位，不能接 ' + a.pinWidth + ' 位');
      }
      if (isOut && a.pinWidth !== null && a.pinWidth < pinW) {
      }

      if (isOut) {
        if (a.const) { errors.push(part.name + '.' + a.pin + ' 是输出脚，不能接常量'); return; }
        return; // 驱动已在第一遍记录
      }

      if (!covered[a.pin]) covered[a.pin] = new Set();
      const pinBits = a.pinFrom !== null ? rangeBits(a.pinFrom, a.pinTo) : rangeBits(0, pinW - 1);
      pinBits.forEach((b) => covered[a.pin].add(b));

      if (a.const) return;

      if (a.from !== null) {
        const w = widthOf[a.wire];
        if (w !== undefined && a.to >= w) errors.push(a.wire + '[' + a.from + '..' + a.to + '] 超出 ' + w + ' 位');
        return;
      }
      if (declared[a.wire] === undefined && !driven[a.wire]) {
        (hasEllipsis ? warnings : errors).push('线路 ' + a.wire + ' 未声明也未驱动');
      }
    });

    Object.keys(spec.in).forEach((pin) => {
      if (!covered[pin]) { errors.push(part.name + ' 缺少输入 ' + pin); return; }
      if (covered[pin].size < spec.in[pin]) {
        const msg = part.name + '.' + pin + ' 只接了 ' + covered[pin].size + '/' + spec.in[pin] + ' 位';
        (hasEllipsis ? warnings : errors).push(msg);
      }
    });
  });

  chip.outs.forEach((p) => {
    const got = driven[p.name] ? driven[p.name].size : 0;
    if (got < p.width) {
      const msg = '输出 ' + p.name + ' 只驱动了 ' + got + '/' + p.width + ' 位';
      (hasEllipsis ? warnings : errors).push(msg);
    }
  });

  return { errors, warnings };
}

const ids = Object.keys(HDL);
const parsed = {};
const parseErrors = {};
let bad = 0;

ids.forEach((id) => {
  const r = parseChip(HDL[id].code, HDL[id]);
  if (r.errors.length) parseErrors[id] = r.errors;   // 结构错误也记下，但仍继续校验
  if (r.chip) parsed[id] = r.chip;
});

const iface = Object.assign({}, CHIPS);
Object.keys(parsed).forEach((id) => {
  const c = parsed[id];
  const spec = { in: {}, out: {} };
  c.ins.forEach((p) => { spec.in[p.name] = p.width; });
  c.outs.forEach((p) => { spec.out[p.name] = p.width; });
  iface[c.name] = spec;
});

console.log('HDL 片段检查（' + ids.length + ' 段）\n');
ids.forEach((id) => {
  const structErrors = parseErrors[id] || [];
  const hasEllipsis = /…|\.\.\./.test(HDL[id].code);
  const r = (parsed[id] && !HDL[id].primitive) ? checkChip(parsed[id], iface, hasEllipsis) : { errors: [], warnings: [] };
  const all = structErrors.concat(r.errors);
  if (all.length) {
    bad++;
    console.log('  ✗ ' + HDL[id].title);
    all.forEach((e) => console.log('      ' + e));
  } else {
    console.log('  ✓ ' + HDL[id].title + (r.warnings.length ? '（' + r.warnings.length + ' 条省略提示）' : ''));
  }
  r.warnings.forEach((w) => console.log('      · ' + w));
});

console.log('');
console.log(bad ? bad + ' 段有问题' : '全部通过');
process.exit(bad ? 1 : 0);
