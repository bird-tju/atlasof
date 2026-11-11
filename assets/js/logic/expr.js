window.CS = window.CS || {};
CS.Expr = (function () {
  'use strict';

  var ALIAS = {
    '*': '&', '·': '&', '∧': '&', '&&': '&',
    '+': '|', '∨': '|', '||': '|',
    '~': '!', '¬': '!',
    '⊕': '^'
  };

  function tokenize(src) {
    var s = String(src || '');
    var out = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '(' || c === ')') { out.push({ t: c }); i++; continue; }
      if ('&|!^*+~·¬∧∨⊕'.indexOf(c) >= 0) { out.push({ t: 'op', v: ALIAS[c] || c }); i++; continue; }
      var m = /^[A-Za-z][A-Za-z0-9_]*/.exec(s.slice(i));
      if (m) { out.push({ t: 'id', v: m[0] }); i += m[0].length; continue; }
      throw new Error('' + c + '」');
    }
    return out;
  }

  function parse(src) {
    var toks;
    try { toks = tokenize(src); } catch (e) { return { ok: false, error: e.message }; }
    if (!toks.length) return { ok: false, error: '' };

    var pos = 0;
    var vars = [];

    function peek() { return toks[pos]; }
    function eat(t, v) {
      var x = toks[pos];
      if (!x || x.t !== t || (v && x.v !== v)) return null;
      pos++;
      return x;
    }

    function primary() {
      var x = peek();
      if (!x) throw new Error('');
      if (x.t === '(') { pos++; var e = expr(); if (!eat(')')) throw new Error(''); return e; }
      if (x.t === 'id') { pos++; if (vars.indexOf(x.v) < 0) vars.push(x.v); return { k: 'var', name: x.v }; }
      throw new Error('');
    }
    function unary() {
      var x = peek();
      if (x && x.t === 'op' && x.v === '!') { pos++; return { k: 'not', a: unary() }; }
      return primary();
    }
    function andExpr() {
      var left = unary();
      while (peek() && peek().t === 'op' && peek().v === '&') { pos++; left = { k: 'and', a: left, b: unary() }; }
      return left;
    }
    function xorExpr() {
      var left = andExpr();
      while (peek() && peek().t === 'op' && peek().v === '^') { pos++; left = { k: 'xor', a: left, b: andExpr() }; }
      return left;
    }
    function expr() {
      var left = xorExpr();
      while (peek() && peek().t === 'op' && peek().v === '|') { pos++; left = { k: 'or', a: left, b: xorExpr() }; }
      return left;
    }

    try {
      var ast = expr();
      if (pos < toks.length) throw new Error('' + (toks[pos].v || toks[pos].t) + '」');
      if (vars.length > 5) throw new Error('' + vars.length + '');
      vars.sort();
      return { ok: true, ast: ast, vars: vars };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  function evaluate(node, env) {
    switch (node.k) {
      case 'var': return env[node.name] ? 1 : 0;
      case 'not': return evaluate(node.a, env) ? 0 : 1;
      case 'and': return evaluate(node.a, env) && evaluate(node.b, env) ? 1 : 0;
      case 'or': return evaluate(node.a, env) || evaluate(node.b, env) ? 1 : 0;
      case 'xor': return evaluate(node.a, env) !== evaluate(node.b, env) ? 1 : 0;
      default: return 0;
    }
  }

  function truthTable(vars, ast) {
    var n = vars.length;
    var rows = [];
    for (var i = 0; i < Math.pow(2, n); i++) {
      var env = {};
      for (var j = 0; j < n; j++) env[vars[j]] = (i >> (n - 1 - j)) & 1;
      rows.push({ index: i, env: env, out: evaluate(ast, env) });
    }
    return rows;
  }

  function toText(node) {
    switch (node.k) {
      case 'var': return node.name;
      case 'not': return '¬' + wrap(node.a);
      case 'and': return wrap(node.a) + ' ∧ ' + wrap(node.b);
      case 'or': return wrap(node.a) + ' ∨ ' + wrap(node.b);
      case 'xor': return wrap(node.a) + ' ⊕ ' + wrap(node.b);
      default: return '?';
    }
  }
  function wrap(n) {
    return (n.k === 'and' || n.k === 'or' || n.k === 'xor') ? '(' + toText(n) + ')' : toText(n);
  }

  function depth(node) {
    switch (node.k) {
      case 'var': return 0;
      case 'not': return depth(node.a) + 1;
      default: return Math.max(depth(node.a), depth(node.b)) + 1;
    }
  }

  return { parse: parse, evaluate: evaluate, truthTable: truthTable, toText: toText, depth: depth };
})();
