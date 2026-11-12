window.CS = window.CS || {};
CS.Circuit = (function () {
  'use strict';

  var GW = 44, GH = 30, COL = 122, ROW = 58, PAD = 26;

  function build(ast) {
    var nodes = [], vars = {};

    function make(node) {
      if (node.k === 'var') {
        if (!vars[node.name]) {
          var v = { id: 'v_' + node.name, type: 'var', name: node.name, depth: 0, ins: [] };
          vars[node.name] = v;
          nodes.push(v);
        }
        return vars[node.name];
      }
      var a = make(node.a);
      var b = node.b ? make(node.b) : null;
      var g = { id: 'g' + nodes.length, type: node.k, depth: (b ? Math.max(a.depth, b.depth) : a.depth) + 1, ins: b ? [a, b] : [a] };
      nodes.push(g);
      return g;
    }

    var root = make(ast);
    return { nodes: nodes, root: root };
  }

  function evaluateNodes(nodes, root, env) {
    var memo = {};
    function val(n) {
      if (memo[n.id] !== undefined) return memo[n.id];
      var r;
      if (n.type === 'var') r = env[n.name] ? 1 : 0;
      else if (n.type === 'not') r = val(n.ins[0]) ? 0 : 1;
      else if (n.type === 'and') r = val(n.ins[0]) && val(n.ins[1]) ? 1 : 0;
      else if (n.type === 'or') r = val(n.ins[0]) || val(n.ins[1]) ? 1 : 0;
      else r = val(n.ins[0]) !== val(n.ins[1]) ? 1 : 0;
      memo[n.id] = r;
      return r;
    }
    val(root);
    return memo;
  }

  function shape(type) {
    var paths = '';
    if (type === 'and') {
      paths = '<path d="M6 0 H24 A15 15 0 0 1 24 30 H6 Z"/>';
    } else if (type === 'nand') {
      paths = '<path d="M6 0 H24 A15 15 0 0 1 24 30 H6 Z"/><circle cx="45" cy="15" r="4" class="bubble"/>';
    } else if (type === 'or' || type === 'xor' || type === 'nor') {
      paths = '<path d="M4 0 Q24 2 40 15 Q24 28 4 30 Q12 15 4 0 Z"/>';
      if (type === 'xor') paths += '<path d="M-3 0 Q5 15 -3 30" class="extra"/>';
      if (type === 'nor') paths += '<circle cx="45" cy="15" r="4" class="bubble"/>';
    } else if (type === 'not') {
      paths = '<path d="M8 0 L40 15 L8 30 Z"/><circle cx="45" cy="15" r="4" class="bubble"/>';
    }
    return paths;
  }

  function render(ast, env) {
    var built = build(ast);
    var nodes = built.nodes, root = built.root;
    var values = evaluateNodes(nodes, root, env);

    var cols = {};
    var maxDepth = 0;
    nodes.forEach(function (n) {
      maxDepth = Math.max(maxDepth, n.depth);
      (cols[n.depth] = cols[n.depth] || []).push(n);
    });
    var maxCount = 1;
    Object.keys(cols).forEach(function (d) { maxCount = Math.max(maxCount, cols[d].length); });

    var totalH = PAD * 2 + maxCount * ROW;
    var totalW = PAD * 2 + maxDepth * COL + GW + 86;


    var consumers = {};
    nodes.forEach(function (n) {
      n.ins.forEach(function (s) { (consumers[s.id] = consumers[s.id] || []).push(n); });
    });

    function placeCol(list) {
      var offset = (maxCount - list.length) * ROW / 2;
      list.forEach(function (n, i) { n.y = offset + i * ROW; });
    }
    if (cols[0]) cols[0].sort(function (x, y) { return x.name < y.name ? -1 : 1; });
    Object.keys(cols).forEach(function (d) { placeCol(cols[d]); });

    for (var pass = 0; pass < 3; pass++) {
      for (var dd = 1; dd <= maxDepth; dd++) {
        var c1 = cols[dd];
        if (!c1) continue;
        c1.forEach(function (n) {
          n._b = n.ins.length ? n.ins.reduce(function (a, s) { return a + s.y; }, 0) / n.ins.length : n.y;
        });
        c1.sort(function (x, y) { return x._b - y._b; });
        placeCol(c1);
      }
      for (var d2 = maxDepth - 1; d2 >= 1; d2--) {
        var c2 = cols[d2];
        if (!c2) continue;
        c2.forEach(function (n) {
          var cs = consumers[n.id] || [];
          n._b = cs.length ? cs.reduce(function (a, x) { return a + x.y; }, 0) / cs.length : n.y;
        });
        c2.sort(function (x, y) { return x._b - y._b; });
        placeCol(c2);
      }
    }

    nodes.forEach(function (n) {
      n.x = PAD + n.depth * COL;
      n.y += PAD + (ROW - GH) / 2;
    });

    var wires = [];
    nodes.forEach(function (n) {
      if (n.type === 'var') return;

      var ordered = n.ins.slice().sort(function (p, q) { return p.y - q.y; });
      ordered.forEach(function (src, idx) {
        var sx = src.type === 'var' ? src.x + 40 : src.x + GW;
        var sy = src.y + (src.type === 'var' ? 11 : 15);
        var tx = n.x;
        var ty = n.y + (ordered.length === 1 ? 15 : (idx === 0 ? 8 : 22));
        var on = values[src.id] ? 1 : 0;
        wires.push('<path class="wire ' + (on ? 'on' : 'off') + '" d="M' + sx + ' ' + sy +
          ' C' + (sx + 34) + ' ' + sy + ', ' + (tx - 34) + ' ' + ty + ', ' + tx + ' ' + ty + '"/>');
        wires.push('<circle class="port ' + (on ? 'on' : 'off') + '" cx="' + tx + '" cy="' + ty + '" r="2.4"/>');
      });
    });

    var gates = nodes.map(function (n) {
      var outVal = values[n.id] ? 1 : 0;
      if (n.type === 'var') {
        return '<g class="pin in-pill" data-var="' + n.name + '">' +
          '<rect x="' + n.x + '" y="' + (n.y + 1) + '" width="40" height="28" rx="8"/>' +
          '<text x="' + (n.x + 14) + '" y="' + (n.y + 20) + '" class="pin-name">' + n.name + '</text>' +
          '<text x="' + (n.x + 30) + '" y="' + (n.y + 20) + '" class="pin-val ' + (outVal ? 'on' : 'off') + '">' + outVal + '</text>' +
          '</g>';
      }
      return '<g class="gate" data-id="' + n.id + '">' +
        '<g transform="translate(' + n.x + ' ' + n.y + ')" class="gate-shape ' + n.type + '">' + shape(n.type) + '</g>' +
        '<text x="' + (n.x + 22) + '" y="' + (n.y + 19) + '" class="gate-label">' + n.type.toUpperCase() + '</text>' +
        '<path class="wire ' + (outVal ? 'on' : 'off') + '" d="M' + (n.x + GW) + ' ' + (n.y + 15) + ' H' + (n.x + GW + 10) + '"/>' +
        '<text x="' + (n.x + GW + 14) + '" y="' + (n.y + 19) + '" class="gate-val ' + (outVal ? 'on' : 'off') + '">' + outVal + '</text>' +
        '</g>';
    }).join('');

    var rootOut = values[root.id] ? 1 : 0;
    var fX = root.x + GW + 60, fY = root.y + 15;
    var fPill = '<g class="pin out-pill">' +
      '<rect x="' + (fX - 6) + '" y="' + (fY - 14) + '" width="46" height="28" rx="8"/>' +
      '<text x="' + (fX + 4) + '" y="' + (fY + 5) + '" class="pin-name">f</text>' +
      '<text x="' + (fX + 22) + '" y="' + (fY + 5) + '" class="pin-val ' + (rootOut ? 'on' : 'off') + '">' + rootOut + '</text>' +
      '</g>';

    return '<svg class="circuit-svg" viewBox="0 0 ' + totalW + ' ' + totalH + '' +
      '<g class="wires">' + wires.join('') + '</g>' +
      '<g class="gates">' + gates + '</g>' +
      '<path class="wire ' + (rootOut ? 'on' : 'off') + '" d="M' + (root.x + GW) + ' ' + (root.y + 15) + ' H' + (fX - 6) + '"/>' +
      fPill +
      '</svg>';
  }

  function gateTypes(ast) {
    var set = {};
    (function walk(n) {
      if (n.k === 'var') return;
      set[n.k] = true;
      walk(n.a);
      if (n.b) walk(n.b);
    })(ast);
    return ['not', 'and', 'or', 'xor'].filter(function (k) { return set[k]; });
  }

  return { render: render, gateTypes: gateTypes, shape: shape };
})();
