/* ============================================================
   ============================================================ */
(function () {
  'use strict';

  function L(zh, en) { return en == null ? zh : en; }
  function MT(m) { var e = (window.CS && CS.msEn) ? CS.msEn[m.title] : null; return e ? e[0] : m.title; }
  function MX(m) { var e = (window.CS && CS.msEn) ? CS.msEn[m.title] : null; return e ? e[1] : m.text; }
  function LN(o) { return (window.CS && CS.I18N && CS.I18N.n) ? CS.I18N.n(o) : (o && o.name) || ''; }
  function LS(o) { return (window.CS && CS.I18N && CS.I18N.sub) ? CS.I18N.sub(o) : (o && o.en) || ''; }

  var CS = window.CS;
  var main = document.getElementById('main');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('js');


  var DOMAINS = CS.domains.slice();
  var domainById = new Map(DOMAINS.map(function (d) { return [d.id, d]; }));

  var TOPICS = (CS.topics || []).map(function (t) {
    return Object.assign({}, t, {
      body: t.body || [],
      milestones: (t.milestones || []).map(function (m) {
        return { year: m[0], title: m[1], text: m[2], star: m[3] === 1 || m[3] === true };
      }),
      bodyEn: t.bodyEn || null,
      concepts: (t.concepts || []).map(function (c) { return { name: c[0], text: c[1] }; }),
      conceptsEn: (t.conceptsEn || []).map(function (c) { return { name: c[0], text: c[1] }; }),
      people: (t.people || []).map(function (p) { return { name: p[0], life: p[1], role: p[2] }; }),
      peopleEn: (t.peopleEn || []).map(function (p) { return { name: p[0], life: p[1], role: p[2] }; }),
      reading: (t.reading || []).map(function (r) { return { title: r[0], author: r[1], year: r[2] }; }),
      readingEn: (t.readingEn || []).map(function (r) { return { title: r[0], author: r[1], year: r[2] }; }),
      related: t.related || [],
      tags: t.tags || [],
      tagsEn: t.tagsEn || [],
      prereq: (CS.prereqs && CS.prereqs[t.id]) || [],
      practice: (CS.practice && CS.practice[t.id]) || ''
    });
  });

  var topicById = new Map(TOPICS.map(function (t) { return [t.id, t]; }));
  var topicsByDomain = new Map(DOMAINS.map(function (d) { return [d.id, []]; }));
  TOPICS.forEach(function (t) {
    if (topicsByDomain.has(t.domain)) topicsByDomain.get(t.domain).push(t);
  });
  topicsByDomain.forEach(function (list) {
    list.sort(function (a, b) { return (a.year || 0) - (b.year || 0); });
  });
  TOPICS.sort(function (a, b) { return (a.year || 0) - (b.year || 0); });

  var STORE_KEY = 'cs-atlas.progress.v1';
  var LEGACY_KEY = '{{SECRET_hpkbkgnp}}';
  var DAY = 86400000;
  var STATUS_META = {
    todo:    { label: 'Not started', short: '—', color: '#6d758a', days: 0 },
    read:    { label: 'Read', short: 'R', color: '#7aa2f7', days: 2 },
    explain: { label: 'Can explain', short: 'E', color: '#e0af68', days: 7 },
    build:   { label: 'Built', short: 'B', color: '#5fbf7f', days: 21 }
  };
  var STATUS_ORDER = ['todo', 'read', 'explain', 'build'];
  if (window.CS && CS.I18N && CS.I18N.lang === 'en') {
    STATUS_META.todo    = { label: 'Not started', short: '—', color: STATUS_META.todo.color, days: 0 };
    STATUS_META.read    = { label: 'Read',        short: 'R', color: STATUS_META.read.color, days: 2 };
    STATUS_META.explain = { label: 'Can explain', short: 'E', color: STATUS_META.explain.color, days: 7 };
    STATUS_META.build   = { label: 'Built',       short: 'B', color: STATUS_META.build.color, days: 21 };
  }
  var store = loadStore();

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(LEGACY_KEY);
      if (raw) {
        if (!localStorage.getItem(STORE_KEY)) localStorage.setItem(STORE_KEY, raw);
        localStorage.removeItem(LEGACY_KEY);
      }
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {}
  }
  function entryOf(id) { return store[id] || null; }
  function statusOf(id) { var e = entryOf(id); return (e && e.status) || 'todo'; }
  function dueOf(id) { var e = entryOf(id); return (e && e.due) || 0; }
  function setStatus(id, s) {
    if (s === 'todo') { delete store[id]; saveStore(); return; }
    var prev = entryOf(id);
    var reps = prev && prev.status === s ? (prev.reps || 0) + 1 : 0;
    var span = Math.min(STATUS_META[s].days * Math.pow(2.2, reps), 120);
    store[id] = { status: s, updated: Date.now(), due: Date.now() + span * DAY, reps: reps };
    saveStore();
  }
  function studied(id) { return statusOf(id) !== 'todo'; }
  function countStatus(s) { return TOPICS.filter(function (t) { return statusOf(t.id) === s; }).length; }
  function covered() { return TOPICS.filter(function (t) { return studied(t.id); }).length; }

  function reviewDue() {
    var now = Date.now();
    return TOPICS.filter(function (t) { return studied(t.id) && dueOf(t.id) <= now; })
      .sort(function (a, b) { return dueOf(a.id) - dueOf(b.id); });
  }
  function blindSpots() {
    var out = [];
    TOPICS.forEach(function (t) {
      if (!studied(t.id)) return;
      t.prereq.forEach(function (pid) {
        var p = topicById.get(pid);
        if (p && !studied(pid)) out.push({ topic: t, missing: p });
      });
    });
    return out;
  }
  function readyNext(limit) {
    var pool = TOPICS.filter(function (t) {
      if (studied(t.id)) return false;
      return t.prereq.every(function (pid) { return studied(pid); });
    });
    var domainScore = {};
    DOMAINS.forEach(function (d) { domainScore[d.id] = 0; });
    TOPICS.forEach(function (t) { if (studied(t.id)) domainScore[t.domain] += 1; });
    pool.sort(function (a, b) {
      var da = domainScore[a.domain] ? 0 : 1;
      var db = domainScore[b.domain] ? 0 : 1;
      if (da !== db) return da - db;
      return (a.year || 0) - (b.year || 0);
    });
    return pool.slice(0, limit || 4);
  }

  function fmtDate(ms) {
    if (!ms) return '';
    var d = new Date(ms);
    if (window.CS && CS.I18N && CS.I18N.lang === 'en') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return (d.getMonth() + 1) + '' + d.getDate() + '';
  }
  function relDue(ms) {
    if (!ms) return '';
    var diff = Math.round((ms - Date.now()) / DAY);
    var en = window.CS && CS.I18N && CS.I18N.lang === 'en';
    if (diff < 0) return 'Due now';
    if (diff === 0) return 'Due today';
    return 'Due in ' + diff + ' days';
  }

  function dedupeMilestones(list) {
    var seen = new Set();
    return list.filter(function (m) {
      var key = m.year + '|' + m.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  var ALL_MILESTONES = [];
  TOPICS.forEach(function (t) {
    t.milestones.forEach(function (m) {
      ALL_MILESTONES.push({ year: m.year, title: m.title, text: m.text, star: m.star, topic: t });
    });
  });
  ALL_MILESTONES = dedupeMilestones(ALL_MILESTONES);
  ALL_MILESTONES.sort(function (a, b) { return a.year - b.year; });

  var YEAR_MIN = TOPICS.length ? Math.min.apply(null, TOPICS.map(function (t) { return t.year || 0; })) : 0;
  var YEAR_MAX = 2026;
  var SPAN = YEAR_MAX - YEAR_MIN;


  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function yearLabel(y) {
    if (y == null) return '';
    var west = (window.CS && CS.I18N && CS.I18N.lang === 'en');
    if (y < 0) return west ? (-y) + ' BC' : '' + (-y);
    return String(y);
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function domainOf(t) { return domainById.get(t.domain) || DOMAINS[0]; }
  function domainTopics(id) { return topicsByDomain.get(id) || []; }

  function rangeOf(id) {
    var list = domainTopics(id);
    if (!list.length) return '';
    var min = Math.min.apply(null, list.map(function (t) { return t.year; }));
    var max = Math.max.apply(null, list.map(function (t) { return t.year; }));
    return yearLabel(min) + ' — ' + yearLabel(max);
  }

  function pickSpread(arr, n) {
    if (arr.length <= n) return arr.slice();
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push(arr[Math.round(i * (arr.length - 1) / (n - 1))]);
    }
    return out.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  function domainChip(t, extra) {
    var d = domainOf(t);
    return '<a class="chip chip-domain" style="--c:' + d.color + '" href="#/domain/' + d.id + '">' +
      '<i></i>' + h(LN(d)) + '</a>' + (extra || '');
  }

  function topicHref(t) { return '#/topic/' + t.id; }

  function topicTool(t) {
    var tool = CS.tools && CS.tools[t.id];
    if (!tool) return '';
    return '<a class="topic-tool" href="' + tool.href + '">' +
      '<span class="topic-tool-tag">' + 'Interactive' + '</span>' +
      '<span class="topic-tool-body"><strong>' + h(tool.title) + '</strong><em>' + h(tool.desc) + '</em></span>' +
      '<span class="topic-tool-go">' + 'Open →' + '</span>' +
      '</a>';
  }

  function statusBar(t) {    var s = statusOf(t.id);
    var due = dueOf(t.id);
    return '<div class="status-bar" data-status-topic="' + t.id + '">' +
      '<p class="status-label">' + 'My level' + '</p>' +
      '<div class="status-btns">' + STATUS_ORDER.map(function (k) {
        return '<button type="button" class="status-btn' + (k === s ? ' is-active' : '') + '" data-status="' + k + '" style="--s:' + STATUS_META[k].color + '">' +
          STATUS_META[k].label + '</button>';
      }).join('') + '</div>' +
      '<p class="status-due">' + (s === 'todo' ? 'Not started yet' : (relDue(due) + ' · ' + 'last ' + fmtDate((entryOf(t.id) || {}).updated))) + '</p>' +
      '</div>';
  }


  var THEME_KEY = 'cs-atlas-theme';
  var root = document.documentElement;

  function syncThemeButton() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var dark = root.dataset.theme !== 'light';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    syncThemeButton();
  });
  syncThemeButton();


  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menu-btn');
  menuBtn.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function () {
    document.body.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });


  var searchEl = document.getElementById('search');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchCount = document.getElementById('search-count');
  var searchItems = [];
  var searchActive = -1;

  var SUGGESTED = ['turing-machine', 'transformer', 'relational-model', 'unix', 'public-key', 'godel-incompleteness'];

  function scoreTopic(t, q) {
    var name = t.name.toLowerCase();
    var en = (t.en || '').toLowerCase();
    var s = 0;
    if (name === q) s = 120;
    else if (name.indexOf(q) === 0) s = 95;
    else if (name.indexOf(q) >= 0) s = 80;
    else if (en === q) s = 70;
    else if (en.indexOf(q) >= 0) s = 58;
    if (t.tags.some(function (x) { return x.toLowerCase().indexOf(q) >= 0; })) s += 34;
    if (t.concepts.some(function (c) { return c.name.toLowerCase().indexOf(q) >= 0; })) s += 26;
    if (t.people.some(function (p) { return p.name.toLowerCase().indexOf(q) >= 0; })) s += 24;
    if ((t.summary || '').toLowerCase().indexOf(q) >= 0) s += 16;
    if (t.milestones.some(function (m) { return (m.title || '').toLowerCase().indexOf(q) >= 0; })) s += 10;
    return s;
  }

  function runSearch(q) {
    var raw = q.trim();
    var query = raw.toLowerCase();
    if (!query) {
      return SUGGESTED.map(function (id) { return topicById.get(id); }).filter(Boolean);
    }
    var scored = TOPICS.map(function (t) {
      return { t: t, s: scoreTopic(t, query) };
    }).filter(function (x) { return x.s > 0; });
    scored.sort(function (a, b) { return b.s - a.s || a.t.year - b.t.year; });
    var out = scored.slice(0, 14).map(function (x) { return x.t; });

    DOMAINS.forEach(function (d) {
      if (d.name.toLowerCase().indexOf(query) >= 0 || d.en.toLowerCase().indexOf(query) >= 0) {
        out.push(d);
      }
    });
    return out;
  }

  function hl(text, q) {
    text = String(text || '');
    if (!q) return h(text);
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return h(text);
    return h(text.slice(0, i)) + '<mark>' + h(text.slice(i, i + q.length)) + '</mark>' + h(text.slice(i + q.length));
  }

  function renderSearch(q) {
    var results = runSearch(q);
    searchItems = results;
    searchActive = results.length ? 0 : -1;
    var query = q.trim();

    if (!results.length) {
      searchResults.innerHTML = '' + h(q) + '';
      searchCount.textContent = '';
      return;
    }

    var html = '';
    if (!query) html += '';
    html += results.map(function (item, i) {
      if (!item.domain && domainById.has(item.id)) {
        return '<a class="s-result' + (i === 0 ? ' is-active' : '') + '" href="#/domain/' + item.id + '" data-i="' + i + '">' +
          '<span class="s-dot" style="--c:' + item.color + '"></span>' +
          '<span class="s-main"><strong>' + hl(item.name, query) + '</strong><em>' + h(item.en) + '</em></span>' +
          '';
      }
      var d = domainOf(item);
      return '<a class="s-result' + (i === 0 ? ' is-active' : '') + '" href="' + topicHref(item) + '" data-i="' + i + '">' +
        '<span class="s-dot" style="--c:' + d.color + '"></span>' +
        '<span class="s-main"><strong>' + hl(item.name, query) + '</strong><em>' + h(item.en) + '</em>' +
        '<p>' + hl(item.summary, query) + '</p></span>' +
        '<span class="s-meta">' + h(LN(d)) + '<br>' + yearLabel(item.milestones[0] ? item.milestones[0].year : item.year) + '</span></a>';
    }).join('');

    searchResults.innerHTML = html;
    searchCount.textContent = query ? results.length + '' : '';

    var first = searchResults.querySelector('.s-result');
    if (first) searchResults.scrollTop = 0;
  }

  function setActiveResult(i) {
    var nodes = searchResults.querySelectorAll('.s-result');
    if (!nodes.length) return;
    searchActive = (i + nodes.length) % nodes.length;
    for (var k = 0; k < nodes.length; k++) nodes[k].classList.toggle('is-active', k === searchActive);
    var active = nodes[searchActive];
    if (active) {
      var top = active.offsetTop;
      var box = searchResults;
      if (top < box.scrollTop || top + active.offsetHeight > box.scrollTop + box.clientHeight) {
        box.scrollTop = top - box.clientHeight / 2 + active.offsetHeight / 2;
      }
    }
  }

  function openSearch(prefill) {
    searchEl.hidden = false;
    document.body.classList.add('search-open');
    requestAnimationFrame(function () { searchEl.classList.add('is-open'); });
    searchInput.value = prefill || '';
    renderSearch(prefill || '');
    setTimeout(function () { searchInput.focus(); searchInput.select(); }, 30);
  }

  function closeSearch() {
    searchEl.classList.remove('is-open');
    document.body.classList.remove('search-open');
    setTimeout(function () { searchEl.hidden = true; }, 180);
  }

  document.getElementById('search-trigger').addEventListener('click', function () { openSearch(''); });
  searchEl.querySelectorAll('[data-search-close]').forEach(function (el) {
    el.addEventListener('click', closeSearch);
  });
  searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveResult(searchActive + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveResult(searchActive - 1); }
    else if (e.key === 'Enter') {
      var active = searchResults.querySelector('.s-result.is-active');
      if (active) { e.preventDefault(); location.hash = active.getAttribute('href'); closeSearch(); }
    } else if (e.key === 'Escape') { closeSearch(); }
  });
  searchResults.addEventListener('mousemove', function (e) {
    var a = e.target.closest('.s-result');
    if (!a) return;
    var i = Number(a.dataset.i);
    if (i !== searchActive) setActiveResult(i);
  });
  searchResults.addEventListener('click', function () { closeSearch(); });

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (searchEl.hidden) openSearch(''); else closeSearch();
      return;
    }
    if (e.key === '/' && !typing && searchEl.hidden) {
      e.preventDefault(); openSearch('');
    }
    if (e.key === 'Escape') {
      if (!searchEl.hidden) closeSearch();
      if (document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });


  function domainCard(d, i) {
    var list = domainTopics(d.id);
    var names = list.slice(0, 3).map(function (t) { return LN(t); }).join(' · ');
    return '<a class="domain-card reveal" href="#/domain/' + d.id + '" style="--c:' + d.color + '">' +
      '<div class="domain-card-top"><span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="domain-card-count">' + list.length + ' topics' + '</span></div>' +
      '<h3>' + h(LN(d)) + '</h3>' +
      '<p class="domain-card-en">' + h(d.en) + '</p>' +
      '<p class="domain-card-blurb">' + h(d.shortEn) + '. ' + h(names) + '…</p>' +
      '<span class="domain-card-go">' + 'Enter domain' + ' <span>→</span></span>' +
      '</a>';
  }

  function topicRow(t) {
    var d = domainOf(t);
    return '<a class="topic-row reveal" href="' + topicHref(t) + '" style="--c:' + d.color + '">' +
      '<span class="topic-row-year">' + yearLabel(t.year) + '</span>' +
      '<span class="topic-row-main">' +
      '<span class="topic-row-title"><strong>' + h(LN(t)) + '</strong><em>' + h(LS(t)) + '</em></span>' +
      '<span class="topic-row-summary">' + h(t.summaryEn) + '</span>' +
      '</span>' +
      '<span class="topic-row-arrow" aria-hidden="true">→</span>' +
      '</a>';
  }

  function pathCard(p, i) {
    var steps = p.steps.map(function (id) { return topicById.get(id); }).filter(Boolean);
    return '<a class="path-card reveal" href="#/path/' + p.id + '">' +
      '<div class="path-card-top"><span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="path-level">' + h(p.levelEn || p.level) + '</span></div>' +
      '<h3>' + h(p.en || p.title) + '</h3>' +
      '<p class="path-card-en">' + h(p.en) + '</p>' +
      '<p class="path-card-blurb">' + h(p.blurbEn || p.blurb) + '</p>' +
      '<div class="path-steps">' + steps.slice(0, 4).map(function (t, k) {
        return '<span>' + (k + 1) + '. ' + h(LN(t)) + '</span>';
      }).join('') + (steps.length > 4 ? '<span>… ' + '' + steps.length + ' stops' + '</span>' : '') + '</div>' +
      '<span class="path-card-go">' + steps.length + ' stops · start reading ' + '<span>→</span></span>' +
      '</a>';
  }

  function customPathCard() {
    return '<a class="path-card path-card-custom reveal" href="#/map">' +
      '<div class="path-card-top"><span class="num">06</span><span class="path-level">'+'Free'+'</span></div>' +
      '<h3>'+'Build your own'+'</h3>' +
      '<p class="path-card-en">Build Your Own</p>' +
      '<p class="path-card-blurb">' + 'There is no single route. Start anywhere, follow the links, and pick a direction when the path forks.' + '</p>' +
      '<div class="path-steps"><span>' + 'Enter by domain' + '</span><span>' + 'Follow related topics' + '</span><span>' + 'Check dates on the timeline' + '</span></div>' +
      '<span class="path-card-go">' + 'Open the atlas' + ' <span>→</span></span>' +
      '</a>';
  }


  function viewHome() {
    var stars = ALL_MILESTONES.filter(function (m) { return m.star; });
    if (stars.length < 6) stars = pickSpread(ALL_MILESTONES, 8);
    else stars = pickSpread(stars, 8);

    return '' +
      '<section class="hero">' +
      '  <div class="hero-grid wrap">' +
      '    <div class="hero-copy">' +
      '      <p class="eyebrow"><span class="eyebrow-line"></span>An Atlas of Computing</p>' +
      '      <h1 class="hero-title">' + 'A map of <span class="hero-title-em">computing</span>' + '</h1>' +
      '      <p class="hero-lead">' + 'From Euclid&#39;s algorithm in the third century BC to generative models that write code. Not a syllabus — a map you can wander: every node opens onto its history, its people, and the techniques next door.' + '</p>' +
      '      <div class="hero-actions">' +
      '        <a class="btn btn-primary" href="#/map">' + 'Open the atlas' + ' <span>→</span></a>' +
      '        <a class="btn btn-ghost" href="#/timeline">' + 'Wander the timeline' + '</a>' +
      '      </div>' +
      '      <dl class="hero-stats">' +
      '        <div><dt>' + 'Domains' + '</dt><dd>' + DOMAINS.length + '</dd></div>' +
      '        <div><dt>' + 'Topics' + '</dt><dd>' + TOPICS.length + '</dd></div>' +
      '        <div><dt>' + 'Milestones' + '</dt><dd>' + ALL_MILESTONES.length + '</dd></div>' +
      '        <div><dt>' + 'Span' + '</dt><dd>' + Math.floor(SPAN / 100) * 100 + '<small>' + '+ yrs' + '</small></dd></div>' +
      '      </dl>' +
      '      <p class="hero-progress"><a href="#/progress">' +
      (covered()
        ? 'Touched ' + covered() + ' / ' + TOPICS.length + ' · Built ' + countStatus('build') + ' · Due ' + reviewDue().length + ' →'
        : 'Mark what you know, see the gaps' + ' →') +
      '</a></p>' +
      '    </div>' +
      '    <div class="hero-map" id="hero-map" aria-hidden="true"></div>' +
      '  </div>' +
      '  <div class="hero-fade" aria-hidden="true"></div>' +
      '</section>' +

      '<section class="section">' +
      '  <div class="wrap">' +
      '    <div class="section-head">' +
      '      <div><p class="eyebrow">01 — Domains</p><h2>' + 'Thirteen domains' + '</h2></div>' +
      '      <a class="text-link" href="#/domains">' + 'Domain index' + ' <span>→</span></a>' +
      '    </div>' +
      '    <p class="section-lead">' + 'Computer science is not a tree but an archipelago of cross-references. Each domain has its own language, methods and history, and shares its border problems with its neighbours.' + '</p>' +
      '    <div class="domain-grid">' + DOMAINS.map(domainCard).join('') +
      '      <div class="domain-extra">' +
      '        <p>Open Atlas</p>' +
      '        <h3>' + 'A fourteenth domain?' + '</h3>' +
      '        <span>' + 'The map keeps growing. Domains and topics live in separate data files — new nodes and edges are welcome.' + '</span>' +
      '        <a href="#/about#extend">' + 'How to extend' + ' <span>→</span></a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</section>' +

      '<section class="section section-alt">' +
      '  <div class="wrap">' +
      '    <div class="section-head">' +
      '      <div><p class="eyebrow">02 — Paths</p><h2>' + 'Paths' + '</h2></div>' +
      '      <a class="text-link" href="#/paths">' + 'All paths' + ' <span>→</span></a>' +
      '    </div>' +
      '    <p class="section-lead">' + 'If this is your first visit, pick one thread and follow it to the end. Each path is a story, not a checklist.' + '</p>' +
      '    <div class="path-grid">' + CS.paths.map(pathCard).join('') + customPathCard() + '</div>' +
      '  </div>' +
      '</section>' +

      '<section class="section">' +
      '  <div class="wrap">' +
      '    <div class="section-head">' +
      '      <div><p class="eyebrow">03 — Timeline</p><h2>' + 'Timeline' + '</h2></div>' +
      '      <a class="text-link" href="#/timeline">' + 'Full timeline' + ' <span>→</span></a>' +
      '    </div>' +
      '    <div class="home-timeline">' + stars.map(function (m, i) {
        return '<a class="home-milestone reveal" href="' + topicHref(m.topic) + '" style="--c:' + domainOf(m.topic).color + '">' +
          '<span class="hm-year">' + yearLabel(m.year) + '</span>' +
          '<span class="hm-line"><i></i></span>' +
          '<span class="hm-body"><strong>' + h(MT(m)) + '</strong><span>' + h(MX(m)) + '</span>' +
          '<em>' + h(LN(m.topic)) + '</em></span></a>';
      }).join('') + '</div>' +
      '  </div>' +
      '</section>' +

      '<section class="closing">' +
      '  <div class="wrap closing-inner">' +
      '    <p class="eyebrow">04 — Anywhere</p>' +
      '    <h2>' + 'Start anywhere.' + '</h2>' +
      '    <p>' + 'The map has no single entrance. Enter by domain, browse by year, or let chance pick the next stop.' + '</p>' +
      '    <div class="closing-actions">' +
      '      <a class="btn btn-primary" href="#/random" data-random>' + 'Surprise me' + ' <span>↗</span></a>' +
      '      <a class="btn btn-ghost" href="#/paths">' + 'Choose a path' + '</a>' +
      '    </div>' +
      '  </div>' +
      '</section>';
  }


  function viewDomains() {
    return '<section class="page-head">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Index — ' + DOMAINS.length + ' Domains</p>' +
      '<h1>' + 'Domain index' + '</h1>' +
      '<p class="page-head-lead">' + 'Browse all ' + TOPICS.length + ' topics by domain. Each one stands on its own, and the links at the bottom let you keep wandering.' + '</p>' +
      '</div></section>' +
      '<section class="section section-tight"><div class="wrap">' +
      DOMAINS.map(function (d, i) {
        return '<section class="index-domain reveal" style="--c:' + d.color + '">' +
          '<div class="index-domain-head">' +
          '<span class="index-num">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<div><h2><a href="#/domain/' + d.id + '">' + h(LN(d)) + '</a></h2>' +
          '<p class="index-en">' + h(d.en) + '</p></div>' +
          '<p class="index-blurb">' + h(d.blurbEn) + '</p>' +
          '</div>' +
          '<div class="index-topics">' + domainTopics(d.id).map(function (t) {
            return '<a href="' + topicHref(t) + '"><span>' + yearLabel(t.year) + '</span>' + h(LN(t)) + '</a>';
          }).join('') + '</div>' +
          '</section>';
      }).join('') +
      '</div></section>';
  }


  var COURSE_TYPE = {
    lab:   { label: 'Standalone lab course / project', cls: 'is-lab' },
    mixed: { label: 'In-class labs + a project', cls: 'is-mixed' },
    none:  { label: 'Problem sets and proofs, almost no lab', cls: 'is-none' }
  };

  function courseBlock(d) {
    var c = CS.courses && CS.courses[d.id];
    if (!c) return '';
    var meta = COURSE_TYPE[c.type] || COURSE_TYPE.mixed;
    return '<div class="course-head">' +
      '<span class="course-type ' + meta.cls + '">' + meta.label + '</span>' +
      '<p class="course-note">' + h(c.noteEn || c.note) + '</p>' +
      '</div>' +
      '<div class="course-body">' +
      '<div class="course-col">' +
      '<p class="aside-h">' + 'Courses' + '</p>' +
      '<div class="course-chips">' + (c.coursesEn || c.courses).map(function (n) {
        return '<span class="course-chip">' + h(n) + '</span>';
      }).join('') + '</div>' +
      (c.en && c.en.length ? '<p class="aside-h" style="margin-top:22px">' + 'Open courses' + '</p><ul class="course-en">' +
        c.en.map(function (n) { return '<li>' + h(n) + '</li>'; }).join('') + '</ul>' : '') +
      '</div>' +
      '<div class="course-col">' +
      '<p class="aside-h">' + 'What the labs look like' + '</p>' +
      '<ul class="course-labs">' + (c.labsEn || c.labs).map(function (l) {
        return '<li><strong>' + h(l[0]) + '</strong><p>' + h(l[1]) + '</p></li>';
      }).join('') + '</ul>' +
      '</div>' +
      '</div>';
  }

  function viewDomain(d) {
    var list = domainTopics(d.id);
    var idx = DOMAINS.indexOf(d) + 1;
    var chronology = [];
    var seenEvent = new Set();
    list.forEach(function (t) {
      t.milestones.forEach(function (m) {
        var key = m.year + '|' + m.title;
        if (seenEvent.has(key)) return;
        seenEvent.add(key);
        chronology.push({ year: m.year, title: m.title, text: m.text, topic: t });
      });
    });
    chronology.sort(function (a, b) { return a.year - b.year; });
    return '<section class="domain-hero" style="--c:' + d.color + '">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Domain ' + String(idx).padStart(2, '0') + ' — ' + h(d.en) + '</p>' +
      '<h1>' + h(LN(d)) + '</h1>' +
      '<p class="domain-hero-lead">' + h(d.blurbEn) + '</p>' +
      '<div class="domain-hero-meta"><span>' + list.length + ' topics' + '</span><span>' + rangeOf(d.id) + '</span><span>' + h(d.shortEn) + '</span></div>' +
      '</div></section>' +
      '<section class="section section-tight"><div class="wrap">' +
      '<div class="topic-list">' + list.map(topicRow).join('') + '</div>' +
      '</div></section>' +
      '<section class="section section-alt"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Chronology — ' + chronology.length + ' entries</p><h2>' + 'Chronology' + '</h2></div></div>' +
      '<p class="section-lead">' + 'Every milestone in this domain, ordered by date. An event shared by several topics is counted once.' + '</p>' +
      '<div class="mini-timeline">' + chronology.map(function (m) {
          return '<div class="mini-tl-item" style="--c:' + d.color + '"><span class="mini-tl-year">' + yearLabel(m.year) + '</span>' +
            '<span class="mini-tl-dot"></span>' +
            '<span class="mini-tl-body"><strong>' + h(MT(m)) + '</strong><span>' + h(MX(m)) + '</span></span>' +
            '<a class="mini-tl-topic" href="' + topicHref(m.topic) + '">' + h(LN(m.topic)) + '</a></div>';
        }).join('') + '</div>' +
      '</div></section>' +
      '<section class="section"><div class="wrap">' +
      '<div class="section-head"><div><p class="eyebrow">Curriculum</p><h2>' + 'Courses and labs' + '</h2></div></div>' +
      '<p class="section-lead">' + 'Which university courses this domain usually maps to, and whether the practical work is a standalone project course or an in-class lab.' + '</p>' +
      courseBlock(d) +
      '</div></section>';
  }


  function viewTopic(t) {
    var d = domainOf(t);
    var siblings = domainTopics(d.id);
    var idx = siblings.indexOf(t);
    var prev = idx > 0 ? siblings[idx - 1] : null;
    var next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

    var sections = [];
    var toc = [];
    var n = 0;
    function sec(id, title, inner) {
      n++;
      toc.push([id, title]);
      sections.push('<section class="article-section" id="' + id + '">' +
        '<h2><span class="sec-num">' + String(n).padStart(2, '0') + '</span>' + title + '</h2>' + inner + '</section>');
    }

    var isEn = !!(window.CS && CS.I18N && CS.I18N.lang === 'en');
    var pickList = function (zh, enList) { return (isEn && enList && enList.length) ? enList : zh; };
    var bodyList = pickList(t.body, t.bodyEn);
    var conceptList = pickList(t.concepts, t.conceptsEn);
    var peopleList = pickList(t.people, t.peopleEn);
    var readingList = pickList(t.reading, t.readingEn);

    sec('overview', 'Overview', bodyList.map(function (p) { return '<p class="lede">' + h(p) + '</p>'; }).join(''));

    if (t.milestones.length) {
      sec('history', 'History',
        '<ol class="milestones">' + t.milestones.map(function (m) {
          return '<li><span class="ms-year">' + yearLabel(m.year) + '</span>' +
            '<div class="ms-body"><h3>' + h(MT(m)) + '</h3><p>' + h(MX(m)) + '</p></div></li>';
        }).join('') + '</ol>');
    }

    if (t.concepts.length) {
      sec('concepts', 'Core concepts', '<div class="concept-grid">' + conceptList.map(function (c) {
        return '<div class="concept"><h3>' + h(c.name) + '</h3><p>' + h(c.text) + '</p></div>';
      }).join('') + '</div>');
    }

    if (t.practice) {
      sec('practice', 'Hands-on',
        '<div class="practice-box">' +
        '<p class="practice-label">' + 'Do it once — it beats reading it ten times' + '</p>' +
        '<p class="practice-text">' + h((isEn && CS.practiceEn && CS.practiceEn[t.id]) || t.practice) + '</p>' +
        '<label class="practice-check"><input type="checkbox" data-practice="' + t.id + '"' +
        (statusOf(t.id) === 'build' ? ' checked' : '') + '>' + '<span>' + 'Tick this once you have built it and written down what you learned; the topic is then marked as built.' + '</span></label>' +
        '</div>');
    }

    if (t.concepts.length) {
      sec('check', 'Self-check',
        '<p class="section-note">' + 'Say it in your own words first, then open the answer. Whatever you cannot explain is what to review next.' + '</p>' +
        '<div class="probes">' + conceptList.map(function (c) {
          return '<details class="probe"><summary>' + 'Can you explain "' + h(c.name) + '"?' + '</summary><p>' + h(c.text) + '</p></details>';
        }).join('') +
        '<details class="probe"><summary>' + 'What problem did it solve, and why was there nothing better at the time?' + '</summary>' +
        '<p>' + 'Go back to the history section: how was this done before, and what did it cost?' + '</p></details>' +
        '<details class="probe"><summary>' + 'If you had to build it today, how would you break it down?' + '</summary>' +
        '<p>' + 'Use the hands-on task above: write a plan of at most three steps before you start.' + '</p></details>' +
        '</div>');
    }

    if (peopleList.length) {
      sec('people', 'Key people', '<div class="people">' + peopleList.map(function (p) {
        return '<div class="person"><span class="person-mark">' + h(p.name.slice(0, 1)) + '</span>' +
          '<div><h3>' + h(p.name) + '</h3><p class="person-life">' + h(p.life) + '</p><p>' + h(p.role) + '</p></div></div>';
      }).join('') + '</div>');
    }

    if (readingList.length) {
      sec('reading', 'Further reading', '<ul class="reading">' + readingList.map(function (r) {
        return '<li><span class="reading-title">' + h(r.title) + '</span>' +
          '<span class="reading-meta">' + h(r.author) + (r.year ? ' · ' + yearLabel(r.year) : '') + '</span></li>';
      }).join('') + '</ul>');
    }

    var related = t.related.map(function (id) { return topicById.get(id); }).filter(Boolean);

    return '<article class="topic-page" style="--c:' + d.color + '">' +
      '<div class="wrap">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">' + 'Atlas' + '</a><span>/</span><a href="#/domain/' + d.id + '">' + h(LN(d)) + '</a></nav>' +
      '<header class="topic-head">' +
      '<div class="topic-badges">' + domainChip(t) +
      '<span class="chip">' + yearLabel(t.milestones[0] ? t.milestones[0].year : t.year) + ' onward' + '</span>' +
      ((isEn && t.tagsEn && t.tagsEn.length) ? t.tagsEn : t.tags).map(function (tag) { return '<span class="chip chip-plain">' + h(tag) + '</span>'; }).join('') +
      '</div>' +
      '<h1>' + h(LN(t)) + '</h1>' +
      '<p class="topic-en">' + h(t.en) + '</p>' +
      '<p class="topic-summary">' + h(t.summaryEn) + '</p>' +
      statusBar(t) +
      topicTool(t) +
      '</header>' +
      '<div class="article-grid">' +
      '<div class="article-body" id="article-body">' + sections.join('') + '</div>' +
      '<aside class="article-aside">' +
      '<div class="aside-block"><p class="aside-h">' + 'On this page' + '</p><nav class="toc">' +
      toc.map(function (x, i) {
        return '<a href="#' + x[0] + '" data-toc="' + x[0] + '"><span>' + String(i + 1).padStart(2, '0') + '</span>' + x[1] + '</a>';
      }).join('') + '</nav></div>' +
      (related.length ? '<div class="aside-block"><p class="aside-h">' + 'Related' + '</p><div class="related-list">' +
        related.map(function (r) {
          var rd = domainOf(r);
          return '<a href="' + topicHref(r) + '"><i style="--c:' + rd.color + '"></i><span><strong>' + h(LN(r)) + '</strong><em>' + h(LN(rd)) + '</em></span></a>';
        }).join('') + '</div></div>' : '') +
      (t.prereq.length ? '<div class="aside-block"><p class="aside-h">' + 'Prerequisites' + '</p><div class="prereq-list">' +
        t.prereq.map(function (pid) {
          var p = topicById.get(pid);
          if (!p) return '';
          var ok = studied(pid);
          return '<a class="prereq' + (ok ? ' is-done' : '') + '" href="' + topicHref(p) + '">' +
            '<span class="prereq-mark">' + (ok ? '✓' : '○') + '</span>' +
            '<span><strong>' + h(LN(p)) + '</strong><em>' + STATUS_META[statusOf(pid)].label + '</em></span></a>';
        }).join('') + '</div></div>' : '') +
      '<div class="aside-block aside-nav">' +
      (prev ? '<a href="' + topicHref(prev) + '"><span>' + '← Previous' + '</span><strong>' + h(LN(prev)) + '</strong></a>' : '') +
      (next ? '<a href="' + topicHref(next) + '"><span>' + 'Next →' + '</span><strong>' + h(LN(next)) + '</strong></a>' : '') +
      '</div>' +
      '</aside>' +
      '</div>' +
      '</div>' +
      '</article>';
  }


  function viewPaths() {
    return '<section class="page-head">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Reading Paths</p>' +
      '<h1>' + 'Paths' + '</h1>' +
      '<p class="page-head-lead">' + 'Five routes through the map. They do not try to cover everything: each uses a chain of topics to show how a technology became infrastructure.' + '</p>' +
      '</div></section>' +
      '<section class="section section-tight"><div class="wrap"><div class="path-grid path-grid-wide">' +
      CS.paths.map(pathCard).join('') + customPathCard() +
      '</div></div></section>';
  }

  function viewPath(p) {
    var steps = p.steps.map(function (id) { return topicById.get(id); }).filter(Boolean);
    var i = CS.paths.indexOf(p);
    return '<section class="page-head">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Path ' + String(i + 1).padStart(2, '0') + ' — ' + h(p.en) + '</p>' +
      '<h1>' + h(p.en || p.title) + '</h1>' +
      '<p class="page-head-lead">' + h(p.blurbEn || p.blurb) + '</p>' +
      '<div class="page-head-meta"><span>' + steps.length + ' stops' + '</span><span>' + h(p.levelEn || p.level) + '</span></div>' +
      '</div></section>' +
      '<section class="section section-tight"><div class="wrap"><ol class="path-steps-list">' +
      steps.map(function (t, k) {
        var d = domainOf(t);
        return '<li class="reveal" style="--c:' + d.color + '">' +
          '<span class="step-num">' + String(k + 1).padStart(2, '0') + '</span>' +
          '<div class="step-body">' +
          '<p class="step-domain">' + h(LN(d)) + ' · ' + yearLabel(t.year) + '</p>' +
          '<h2><a href="' + topicHref(t) + '">' + h(LN(t)) + '</a></h2>' +
          '<p class="step-en">' + h(t.en) + '</p>' +
          '<p class="step-summary">' + h(t.summaryEn) + '</p>' +
          '<a class="text-link" href="' + topicHref(t) + '">' + 'Read this stop' + ' <span>→</span></a>' +
          '</div></li>';
      }).join('') + '</ol>' +
      '<div class="path-end"><p>' + 'Finished? Head back to the map and pick a neighbouring node.' + '</p>' +
      '<a class="btn btn-primary" href="#/map">' + 'Open the atlas' + ' <span>→</span></a></div>' +
      '</div></section>';
  }


  function viewProgress() {
    var total = TOPICS.length;
    var done = covered();
    var canExplain = countStatus('explain') + countStatus('build');
    var canBuild = countStatus('build');
    var due = reviewDue();
    var blind = blindSpots();
    var next = readyNext(4);

    function bar(d) {
      var list = domainTopics(d.id);
      var counts = { read: 0, explain: 0, build: 0 };
      list.forEach(function (t) { var s = statusOf(t.id); if (s !== 'todo') counts[s] += 1; });
      var pct = function (n) { return list.length ? (n / list.length) * 100 : 0; };
      return '<a class="dom-bar" href="#/domain/' + d.id + '" style="--c:' + d.color + '">' +
        '<span class="dom-bar-name">' + h(LN(d)) + '</span>' +
        '<span class="dom-bar-track">' +
        '<i class="seg seg-read" style="width:' + pct(counts.read).toFixed(1) + '%"></i>' +
        '<i class="seg seg-explain" style="width:' + pct(counts.explain).toFixed(1) + '%"></i>' +
        '<i class="seg seg-build" style="width:' + pct(counts.build).toFixed(1) + '%"></i>' +
        '</span>' +
        '<span class="dom-bar-count">' + (counts.read + counts.explain + counts.build) + '/' + list.length + '</span>' +
        '</a>';
    }

    return '<section class="page-head">' +
      '<div class="wrap">' +
      '<p class="eyebrow">'+'Learning — stored in this browser only'+'</p>' +
      '<h1>'+'My progress'+'</h1>' +
      '<p class="page-head-lead">'+'Four levels: not started, read, can explain, built. Only ticking the hands-on task counts as really knowing it. Everything is stored in localStorage and never uploaded.'+'</p>' +
      '</div></section>' +
      '<section class="section section-tight"><div class="wrap">' +
      '<div class="stat-row">' +
      '<div class="stat"><span>'+'Touched'+'</span><strong>' + done + '<small>/' + total + '</small></strong></div>' +
      '<div class="stat"><span>'+'Can explain'+'</span><strong>' + canExplain + '</strong></div>' +
      '<div class="stat"><span>'+'Built'+'</span><strong>' + canBuild + '</strong></div>' +
      '<div class="stat"><span>'+'Due'+'</span><strong class="' + (due.length ? 'is-due' : '') + '">' + due.length + '</strong></div>' +
      '</div>' +
      '<div class="progress-tools">' +
      '<button type="button" class="mini-btn" data-progress="export">'+'Export'+'</button>' +
      '<button type="button" class="mini-btn" data-progress="import">'+'Import'+'</button>' +
      '<button type="button" class="mini-btn" data-progress="reset">'+'Reset'+'</button>' +
      '<input type="file" id="progress-file" accept="application/json" hidden>' +
      '<span class="progress-hint">'+'The exported JSON can be moved to another device'+'</span>' +
      '</div>' +

      '<div class="progress-grid">' +
      '<div class="progress-col">' +
      '<div class="section-head"><div><p class="eyebrow">Coverage</p><h2>'+'Coverage'+'</h2></div></div>' +
      '<p class="bar-legend"><span><i class="seg-read"></i>'+'Read'+'</span><span><i class="seg-explain"></i>'+'Explained'+'</span><span><i class="seg-build"></i>'+'Built'+'</span></p>' +
      DOMAINS.map(bar).join('') +
      '</div>' +
      '<div class="progress-col">' +
      '<div class="section-head"><div><p class="eyebrow">Review</p><h2>'+'Due for review'+'</h2></div></div>' +
      (due.length ? '<div class="review-list">' + due.slice(0, 12).map(function (t) {
        var e = entryOf(t.id);
        return '<div class="review-item">' +
          '<a href="' + topicHref(t) + '"><strong>' + h(LN(t)) + '</strong><em>' + h(LN(domainOf(t))) + ' · ' + STATUS_META[e.status].label + '</em></a>' +
          '<button type="button" class="mini-btn" data-review="' + t.id + '">'+'Still remember'+'</button>' +
          '</div>';
      }).join('') + '</div>' : '<p class="empty-note">'+'Nothing is due yet. Pick a topic, mark it as read, and it will show up here in two days.'+'</p>') +
      '</div>' +
      '</div>' +

      '<div class="section-head"><div><p class="eyebrow">Blind spots</p><h2>'+'Blind spots'+'</h2></div></div>' +
      (blind.length ? '<div class="blind-list">' + blind.slice(0, 12).map(function (b) {
        return '<p>' + 'You are studying ' + '<a href="' + topicHref(b.topic) + '">' + h(LN(b.topic)) + '</a>' + ' but have not touched its prerequisite ' + '<a href="' + topicHref(b.missing) + '">' + h(LN(b.missing)) + '</a></p>';
      }).join('') + '</div>' : '<p class="empty-note">'+'No broken chains: every prerequisite of your touched topics is covered.'+'</p>') +

      '<div class="section-head"><div><p class="eyebrow">Next</p><h2>'+'What you can learn next'+'</h2></div></div>' +
      '<div class="next-list">' + (next.length ? next.map(function (t) {
        return '<a class="next-item" href="' + topicHref(t) + '" style="--c:' + domainOf(t).color + '">' +
          '<span class="next-year">' + yearLabel(t.year) + '</span>' +
          '<span class="next-body"><strong>' + h(LN(t)) + '</strong><em>' + h(LN(domainOf(t))) + '</em><p>' + h(t.summaryEn) + '</p></span>' +
          '<span class="next-go">→</span></a>';
      }).join('') : '<p class="empty-note">'+'Every topic is touched. Go back to the ones you can explain and push them to built.'+'</p>') +
      '</div>' +
      '</div></section>';
  }


  function viewAbout() {
    return '<section class="page-head">' +
      '<div class="wrap">' +
      '<p class="eyebrow">About</p><h1>'+'About this map'+'</h1>' +
      '<p class="page-head-lead">'+'CS Atlas is an open notebook about the history and structure of computer science. It tries to answer two questions: what the field is made of, and how it became what it is today.'+'</p>' +
      '</div></section>' +
      '<section class="section section-tight"><div class="wrap about-grid">' +
      '<div class="about-body">' +
      '<h2>'+'Why this exists'+'</h2>' +
      '<p>'+'Knowledge in computer science is scattered across courses, papers, documentation and blogs. Beginners see isolated lists; engineers know their own corner well but struggle to place it on the map. This site tries to offer one continuous picture: every topic has a position, a prehistory and neighbours.'+'</p>' +
      '<p>'+'It does not aim to be an encyclopaedia. It is closer to an atlas with an editorial point of view: which nodes to include, how to connect them, which history comes first — all of that is a judgement.'+'</p>' +
      '<h2>'+'How to learn with it'+'</h2>' +
      '<p>'+'The value here is not finishing every topic; it is a loop you can repeat: '+'<strong>'+'pick one → read → self-test → build → mark → review'+'</strong>.</p>' +
      '<div class="principles">' +
      '<div><span>01</span><h3>'+'Only start when the prerequisites are there'+'</h3><p>'+'The progress page only suggests topics whose prerequisites you have already touched. Skip them and what you read is just vocabulary.'+'</p></div>' +
      '<div><span>02</span><h3>'+'Self-test right after reading'+'</h3><p>'+'The self-test on a topic page turns each concept name into a question: answer from memory first, then open it. Whatever you cannot answer is the real gain of that session.'+'</p></div>' +
      '<div><span>03</span><h3>'+'It counts only once you build it'+'</h3><p>'+'Every topic carries a task worth one evening to one weekend. Tick it off and the topic is marked as built — depth comes from there, not from reading.'+'</p></div>' +
      '<div><span>04</span><h3>'+'Let review come to you'+'</h3><p>'+'After you mark a topic it comes back for review at 2, 7 and 21 days; answer correctly and the interval doubles. The numbers on the progress page move, and blind spots surface by themselves.'+'</p></div>' +
      '</div>' +
      '<h2>'+'Three editorial rules'+'</h2>' +
      '<div class="principles">' +
      '<div><span>01</span><h3>'+'Structure first, detail second'+'</h3><p>'+'Each topic first answers what problem it solves and where it sits, then opens up dates and people. Dates follow the common account, and say “about” where they are disputed.'+'</p></div>' +
      '<div><span>02</span><h3>'+'History is an argument, not decoration'+'</h3><p>'+'Technical history is not a timeline. Every turn answers a concrete difficulty: memory was too expensive, networks were unreliable, compilers were not clever enough. History is told here to explain today’s designs.'+'</p></div>' +
      '<div><span>03</span><h3>'+'Links first'+'</h3><p>'+'Knowledge is most valuable at the boundaries. Every topic lists its related nodes explicitly, and jumping sideways is encouraged over reading straight through.'+'</p></div>' +
      '</div>' +
      '<h2 id="extend">'+'Adding to it'+'</h2>' +
      '<p>'+'The site is static files with data separated from the interface. To add a topic, append one record to the matching domain file under data/ and refresh: it appears in the graph, the timeline and search.'+'</p>' +
      '<pre class="code-block"><code>CS.addTopics([{\n  id: \'my-topic\',\n  name: \'Topic name\',\n  en: \'English Name\',\n  domain: \'theory\',        // domain id\n  year: 1936,\n  tags: [\'tags\'],\n  summary: \'one-line summary\',\n  body: [\'first paragraph\', \'second paragraph\'],\n  milestones: [[1936, \'event\', \'note\']],\n  concepts: [[\'concept\', \'explanation\']],\n  people: [[\'person\', \'dates\', \'contribution\']],\n  related: [\'turing-machine\'],\n  reading: [[\'title\', \'author\', 1936]]\n}]);</code></pre>' +
      '<h2 id="sources">'+'Sources and thanks'+'</h2>' +
      '<p>'+'The narrative here owes a debt to these books: <em>Computer Science: An Overview</em> (Brookshear), <em>The Innovators</em> (Isaacson), <em>Code</em> (Petzold), <em>Computer Systems: A Programmer’s Perspective</em> (Bryant and O’Hallaron), <em>Introduction to Algorithms</em> (CLRS), <em>The Art of Computer Programming</em> (Knuth) and <em>Structure and Interpretation of Computer Programs</em> (Abelson and Sussman). Facts follow published papers, standards and vendor documentation; corrections to the data files are welcome.'+'</p>' +
      '<h2>'+'How it is built'+'</h2>' +
      '<p>'+'Plain HTML, CSS and JavaScript: no build step, no external dependencies, no tracking. The graph is inline SVG with a deterministic ring-cluster layout; the timeline and search are generated in the browser. The whole site works offline by opening index.html.'+'</p>' +
      '<h2>'+'Licence'+'</h2>' +
      '<p>'+'Text is shared under '+'<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>'+'. Code is under the MIT licence.'+'</p>' +
      '</div>' +
      '<aside class="about-side">' +
      '<div class="aside-block"><p class="aside-h">'+'Numbers'+'</p>' +
      '<dl class="about-stats"><div><dt>'+'Domains'+'</dt><dd>' + DOMAINS.length + '</dd></div>' +
      '<div><dt>'+'Topics'+'</dt><dd>' + TOPICS.length + '</dd></div>' +
      '<div><dt>'+'Milestones'+'</dt><dd>' + ALL_MILESTONES.length + '</dd></div>' +
      '<div><dt>'+'People'+'</dt><dd>' + new Set(TOPICS.reduce(function (a, t) { return a.concat(t.people.map(function (p) { return p.name; })); }, [])).size + '</dd></div></dl></div>' +
      '<div class="aside-block"><p class="aside-h">'+'Shortcuts'+'</p><ul class="key-list">' +
      '<li><kbd>Ctrl</kbd><kbd>K</kbd><span>'+'Search'+'</span></li>' +
      '<li><kbd>/</kbd><span>'+'Search'+'</span></li>' +
      '<li><kbd>ESC</kbd><span>'+'Close the panel'+'</span></li></ul></div>' +
      '</aside>' +
      '</div></section>';
  }

  /* ---------- 404 ---------- */

  function viewNotFound() {
    return '<section class="notfound"><div class="wrap">' +
      '<p class="eyebrow">404 — Off the map</p>' +
      '<h1>' + 'This part of the map is not drawn yet.' + '</h1>' +
      '<p>' + 'The node you asked for does not exist, or the link is stale. Go back to the atlas and pick another entrance.' + '</p>' +
      '<div class="closing-actions"><a class="btn btn-primary" href="#/">' + 'Back to the atlas' + ' <span>→</span></a>' +
      '<a class="btn btn-ghost" href="#/map">' + 'Open the graph' + '</a></div>' +
      '</div></section>';
  }


  function graphLayout() {
    var portrait = window.innerWidth < 720;
    var W = portrait ? 920 : 1700;
    var H = portrait ? 1520 : 1150;
    var cx = W / 2, cy = H / 2;
    var n = DOMAINS.length;
    var hubs = DOMAINS.map(function (d, i) {
      var x, y, ang;
      if (portrait) {
        x = 165 + (i % 3) * 295;
        y = 200 + Math.floor(i / 3) * 300;
        ang = 0;
      } else {
        ang = -Math.PI / 2 + i * 2 * Math.PI / n;
        x = cx + Math.cos(ang) * 590;
        y = cy + Math.sin(ang) * 408;
      }
      var list = domainTopics(d.id);
      var R = (portrait ? 82 : 74) + Math.min(list.length, 9) * 4.6;
      var nodes = list.map(function (t, j) {
        var a = -Math.PI / 2 + j * 2 * Math.PI / list.length;
        return { t: t, x: x + Math.cos(a) * R, y: y + Math.sin(a) * R, a: a };
      });
      return { d: d, x: x, y: y, ang: ang, list: list, nodes: nodes, R: R };
    });

    var edges = [];
    var seen = new Set();
    hubs.forEach(function (hub) {
      hub.nodes.forEach(function (n1) {
        (n1.t.related || []).forEach(function (rid) {
          var other = topicById.get(rid);
          if (!other) return;
          var key = [n1.t.id, rid].sort().join('|');
          if (seen.has(key)) return;
          seen.add(key);
          var n2 = null;
          hubs.forEach(function (hh) {
            hh.nodes.forEach(function (nn) { if (nn.t.id === rid) n2 = nn; });
          });
          if (!n2) return;
          edges.push({ a: n1, b: n2, color: domainOf(n1.t).color });
        });
      });
    });

    return { W: W, H: H, cx: cx, cy: cy, hubs: hubs, edges: edges, portrait: portrait };
  }

  var GRAPH = null;
  function getGraph() { if (!GRAPH) GRAPH = graphLayout(); return GRAPH; }

  function edgePath(a, b, cx, cy) {
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var qx = mx + (cx - mx) * 0.16, qy = my + (cy - my) * 0.16;
    return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' Q' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
  }

  function renderHeroMap(el) {
    var g = getGraph();
    var svg = '<svg viewBox="0 0 ' + g.W + ' ' + g.H + '" class="minimap-svg" aria-hidden="true">';
    svg += '<g class="mm-edges">' + g.edges.map(function (e) {
      return '<path d="' + edgePath(e.a, e.b, g.cx, g.cy) + '" stroke="' + e.color + '"/>';
    }).join('') + '</g>';
    svg += g.hubs.map(function (hub) {
      return '<g class="mm-hub">' +
        '<circle cx="' + hub.x + '" cy="' + hub.y + '" r="' + (hub.R + 16) + '" fill="' + hub.d.color + '" opacity=".05"/>' +
        '<circle cx="' + hub.x + '" cy="' + hub.y + '" r="4.5" fill="' + hub.d.color + '"/>' +
        hub.nodes.map(function (n) {
          return '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="2.4" fill="' + hub.d.color + '" opacity=".8"/>';
        }).join('') +
        '</g>';
    }).join('');
    svg += '</svg>';
    el.innerHTML = svg;
  }

  function viewMap() {
    var g = getGraph();
    return '<section class="page-head page-head-map">' +      '<div class="wrap">' +
      '<p class="eyebrow">The Atlas</p>' +
      '<h1>' + 'The Atlas' + '</h1>' +
      '<p class="page-head-lead">' + TOPICS.length + ' topics cluster into ' + DOMAINS.length + ' constellations by domain; thin lines are cross-links. Drag to pan, scroll to zoom, click a node to read.' + '</p>' +
      '</div></section>' +
      '<section class="map-section"><div class="wrap-wide map-layout">' +
      '<aside class="map-side">' +
      '<p class="aside-h">' + 'Domains' + '</p>' +
      '<button class="map-domain is-active" data-focus="all" type="button"><i></i><span>' + 'All' + '</span><em>' + TOPICS.length + '</em></button>' +
      DOMAINS.map(function (d) {
        return '<button class="map-domain" data-focus="' + d.id + '" type="button" style="--c:' + d.color + '">' +
          '<i></i><span>' + h(LN(d)) + '</span><em>' + domainTopics(d.id).length + '</em></button>';
      }).join('') +
      '<p class="map-hint">' + 'Drag to pan<br>Scroll to zoom<br>Click a node to read' + '</p>' +
      '</aside>' +
      '<div class="map-stage">' +
      '<div class="map-toolbar">' +
      '<div class="map-zoom"><button type="button" data-zoom="in" aria-label="Zoom in">+</button>' +
      '<button type="button" data-zoom="out" aria-label="Zoom out">−</button>' +
      '<button type="button" data-zoom="reset" aria-label="Reset view">' + 'Reset' + '</button></div>' +
      '<div class="map-legend">' + STATUS_ORDER.map(function (k) {
        var c = TOPICS.filter(function (t) { return statusOf(t.id) === k; }).length;
        return '<span class="lg"><i style="--st:' + STATUS_META[k].color + '"></i>' + STATUS_META[k].label + ' ' + c + '</span>';
      }).join('') + '</div>' +
      '<button type="button" class="mini-btn" id="map-unread" aria-pressed="false">' + 'Unread only' + '</button>' +
      '<p class="map-status" id="map-status">' + DOMAINS.length + ' domains · ' + TOPICS.length + ' topics' + '</p>' +
      '</div>' +
      '<div class="map-canvas">' +
      '<svg id="atlas" viewBox="0 0 ' + g.W + ' ' + g.H + '" role="group" aria-label="' + 'Map of computer science topics; drag and zoom' + '"></svg>' +
      '<div class="map-tip" id="map-tip" hidden></div>' +
      '</div>' +
      '</div>' +
      '</div></section>';
  }

  function initMap() {
    var svg = document.getElementById('atlas');
    if (!svg) return;
    var g = getGraph();
    var W = g.W, H = g.H;
    var tip = document.getElementById('map-tip');
    var status = document.getElementById('map-status');

    var parts = [];
    parts.push('<g class="edges">' + g.edges.map(function (e, i) {
      return '<path class="edge" data-a="' + e.a.t.id + '" data-b="' + e.b.t.id + '" d="' + edgePath(e.a, e.b, g.cx, g.cy) + '" stroke="' + e.color + '"/>';
    }).join('') + '</g>');

    parts.push('<g class="hubs">' + g.hubs.map(function (hub) {
      return '<g class="hub" data-domain="' + hub.d.id + '" transform="translate(' + hub.x.toFixed(1) + ' ' + hub.y.toFixed(1) + ')" style="--c:' + hub.d.color + '">' +
        '<circle class="hub-ring" r="' + hub.R + '"/>' +
        '<text class="hub-label" y="-1">' + h(LN(hub.d)) + '</text>' +
        '<text class="hub-count" y="17">' + hub.list.length + ' topics</text>' +
        '</g>';
    }).join('') + '</g>');

    parts.push('<g class="nodes">' + g.hubs.map(function (hub) {
      return hub.nodes.map(function (n) {
        var st = statusOf(n.t.id);
        var meta = STATUS_META[st];
        return '<g class="node st-' + st + '" data-id="' + n.t.id + '" tabindex="0" role="link" aria-label="' + h(LN(n.t) + ' · ' + hub.d.name + ' · ' + meta.label) + '" transform="translate(' + n.x.toFixed(1) + ' ' + n.y.toFixed(1) + ')" style="--c:' + hub.d.color + ';--st:' + meta.color + '">' +
          '<circle class="node-halo" r="15"/>' +
          '<circle class="node-status" r="9.5"/>' +
          '<circle class="node-dot" r="5.2"/>' +
          '<text class="node-label" y="20">' + h(LN(n.t)) + '</text>' +
          '</g>';
      }).join('');
    }).join('') + '</g>');

    svg.innerHTML = '<g id="viewport">' + parts.join('') + '</g>';
    var viewport = svg.querySelector('#viewport');

    var k = 1, tx = 0, ty = 0;
    function apply() {
      viewport.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ') scale(' + k.toFixed(3) + ')');
      svg.classList.toggle('show-labels', k > 1.65);
    }
    function svgPoint(clientX, clientY) {
      var pt = svg.createSVGPoint();
      pt.x = clientX; pt.y = clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    function zoomAt(px, py, factor) {
      var k2 = clamp(k * factor, 0.55, 4.5);
      if (k2 === k) return;
      tx = px - (px - tx) * (k2 / k);
      ty = py - (py - ty) * (k2 / k);
      k = k2;
      apply();
    }
    function reset() {
      k = 1; tx = 0; ty = 0; apply();
      document.querySelectorAll('.map-domain').forEach(function (b) { b.classList.toggle('is-active', b.dataset.focus === 'all'); });
      svg.classList.remove('is-filtered');
      svg.querySelectorAll('.node, .hub, .edge').forEach(function (el) { el.classList.remove('is-dim', 'is-lit'); });
      status.textContent = DOMAINS.length + ' domains · ' + TOPICS.length + ' topics';
      if (tip) tip.hidden = true;
    }
    function focusDomain(id) {
      var hub = g.hubs.filter(function (x) { return x.d.id === id; })[0];
      if (!hub) { reset(); return; }
      k = 2.0;
      tx = W / 2 - hub.x * k;
      ty = H / 2 - hub.y * k;
      apply();
      document.querySelectorAll('.map-domain').forEach(function (b) { b.classList.toggle('is-active', b.dataset.focus === id); });
      svg.classList.add('is-filtered');
      svg.querySelectorAll('.node').forEach(function (el) {
        var t = topicById.get(el.dataset.id);
        el.classList.toggle('is-dim', !t || t.domain !== id);
      });
      svg.querySelectorAll('.hub').forEach(function (el) {
        el.classList.toggle('is-dim', el.dataset.domain !== id);
      });
      svg.querySelectorAll('.edge').forEach(function (el) {
        var a = topicById.get(el.dataset.a), b = topicById.get(el.dataset.b);
        el.classList.toggle('is-dim', !(a && a.domain === id) && !(b && b.domain === id));
      });
      status.textContent = LN(hub.d) + ' · ' + hub.list.length + ' topics';
      if (tip) tip.hidden = true;
    }

    var drag = null;
    var moved = false;
    svg.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.node') || e.target.closest('.hub')) return;
      var p = svgPoint(e.clientX, e.clientY);
      drag = { p: p, tx: tx, ty: ty };
      moved = false;
      svg.setPointerCapture(e.pointerId);
      svg.classList.add('is-dragging');
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var p = svgPoint(e.clientX, e.clientY);
      var dx = p.x - drag.p.x, dy = p.y - drag.p.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      tx = drag.tx + dx;
      ty = drag.ty + dy;
      apply();
    });
    function endDrag(e) {
      if (!drag) return;
      drag = null;
      svg.classList.remove('is-dragging');
      if (svg.hasPointerCapture && svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
    }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var p = svgPoint(e.clientX, e.clientY);
      zoomAt(p.x, p.y, e.deltaY < 0 ? 1.12 : 0.89);
    }, { passive: false });

    svg.addEventListener('click', function (e) {
      if (moved) { moved = false; return; }
      var node = e.target.closest('.node');
      if (node) { location.hash = '#/topic/' + node.dataset.id; return; }
      var hub = e.target.closest('.hub');
      if (hub) { location.hash = '#/domain/' + hub.dataset.domain; }
    });

    svg.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var node = document.activeElement && document.activeElement.closest ? document.activeElement.closest('.node') : null;
      if (node) { e.preventDefault(); location.hash = '#/topic/' + node.dataset.id; }
    });

    svg.addEventListener('focusin', function (e) {
      var node = e.target.closest && e.target.closest('.node');
      if (!node) return;
      var t = topicById.get(node.dataset.id);
      if (!t) return;
      var nb = node.getBoundingClientRect();
      if (tip) {
        var d = domainOf(t);
        tip.innerHTML = '<span class="tip-year">' + yearLabel(t.year) + ' · ' + h(LN(d)) + '</span>' +
          '<strong>' + h(LN(t)) + '</strong><em>' + h(LS(t)) + '</em><p>' + h(t.summaryEn) + '</p>';
        tip.hidden = false;
        tip.style.transform = 'translate(' + Math.min(nb.right + 8, window.innerWidth - 290) + 'px,' + Math.min(nb.top, window.innerHeight - 160) + 'px)';
      }
    });
    svg.addEventListener('focusout', function (e) {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.node')) return;
      if (tip) tip.hidden = true;
    });

    svg.addEventListener('mouseover', function (e) {
      var node = e.target.closest('.node');
      if (!node) return;
      var t = topicById.get(node.dataset.id);
      if (!t) return;
      var related = new Set([t.id].concat(t.related || []));
      svg.querySelectorAll('.edge').forEach(function (el) {
        var on = related.has(el.dataset.a) && related.has(el.dataset.b);
        el.classList.toggle('is-lit', on && (el.dataset.a === t.id || el.dataset.b === t.id));
        el.classList.toggle('is-dim', !on);
      });
      svg.querySelectorAll('.node').forEach(function (el) { el.classList.toggle('is-dim', !related.has(el.dataset.id)); });
      if (tip) {
        var d = domainOf(t);
        tip.innerHTML = '<span class="tip-year">' + yearLabel(t.year) + ' · ' + h(LN(d)) + '</span>' +
          '<strong>' + h(LN(t)) + '</strong><em>' + h(LS(t)) + '</em><p>' + h(t.summaryEn) + '</p>';
        tip.hidden = false;
      }
    });
    svg.addEventListener('mousemove', function (e) {
      if (!tip || tip.hidden) return;
      var pad = 16;
      var x = e.clientX + pad, y = e.clientY + pad;
      var w = tip.offsetWidth, hh = tip.offsetHeight;
      if (x + w > window.innerWidth - 12) x = e.clientX - w - pad;
      if (y + hh > window.innerHeight - 12) y = e.clientY - hh - pad;
      tip.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    svg.addEventListener('mouseout', function (e) {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.node')) return;
      if (tip) tip.hidden = true;
      svg.querySelectorAll('.edge').forEach(function (el) { el.classList.remove('is-lit', 'is-dim'); });
      svg.querySelectorAll('.node').forEach(function (el) { el.classList.remove('is-dim'); });
    });

    document.querySelectorAll('.map-domain').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.focus;
        if (id === 'all') reset(); else focusDomain(id);
      });
    });
    document.querySelectorAll('[data-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var z = btn.dataset.zoom;
        if (z === 'reset') reset();
        else zoomAt(W / 2, H / 2, z === 'in' ? 1.25 : 0.8);
      });
    });

    var unreadBtn = document.getElementById('map-unread');
    if (unreadBtn) {
      unreadBtn.addEventListener('click', function () {
        var on = !svg.classList.contains('only-unread');
        svg.classList.toggle('only-unread', on);
        unreadBtn.classList.toggle('is-on', on);
        unreadBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    apply();
    requestAnimationFrame(function () { svg.classList.add('is-ready'); });
  }


  var ERAS = [
    { to: 1899, label: 'Prehistory', sub: 'From Euclid to Boole' },
    { to: 1949, label: '1900 — 1949', sub: 'Logic and the dawn of electronics' },
    { to: 1969, label: '1950 — 1969', sub: 'Computing becomes an industry' },
    { to: 1989, label: '1970 — 1989', sub: 'Microprocessors, networks, personal computing' },
    { to: 2009, label: '1990 — 2009', sub: 'The Web and the graphical interface' },
    { to: 9999, label: '2010 — today', sub: 'Deep learning, cloud and mobile' }
  ];

  function viewTimeline() {
    return '<section class="page-head page-head-timeline">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Chronology — ' + ALL_MILESTONES.length + ' entries</p>' +
      '<h1>' + 'Timeline' + '</h1>' +
      '<p class="page-head-lead">' + ALL_MILESTONES.length + ' entries, from the third century BC to today. Filter by domain, or search for people, technologies and years.' + '</p>' +
      '</div></section>' +
      '<div class="tl-bar"><div class="wrap tl-bar-inner">' +
      '<div class="tl-filters" id="tl-filters">' +
      '<button type="button" class="chip-filter is-active" data-filter="all">' + 'All' + '</button>' +
      DOMAINS.map(function (d) {
        return '<button type="button" class="chip-filter" data-filter="' + d.id + '" style="--c:' + d.color + '"><i></i>' + h(LN(d)) + '</button>';
      }).join('') +
      '</div>' +
      '<div class="tl-search-wrap"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.2"/><path d="m12.6 12.6 3.9 3.9"/></svg>' +
      '<input id="tl-search" type="search" placeholder="' + 'Filter by year, person or event…' + '" autocomplete="off"></div>' +
      '</div></div>' +
      '<section class="timeline-section"><div class="wrap">' +
      '<p class="tl-count" id="tl-count"></p>' +
      '<div class="timeline" id="tl-list"></div>' +
      '</div></section>';
  }

  function initTimeline() {
    var listEl = document.getElementById('tl-list');
    var countEl = document.getElementById('tl-count');
    var input = document.getElementById('tl-search');
    if (!listEl) return;
    var filter = 'all';

    function matches(m) {
      if (filter !== 'all' && m.topic.domain !== filter) return false;
      var q = input.value.trim().toLowerCase();
      if (!q) return true;
      return (m.title + ' ' + m.text + ' ' + m.topic.name + ' ' + m.year + ' ' + yearLabel(m.year)).toLowerCase().indexOf(q) >= 0;
    }

    function render() {
      var items = ALL_MILESTONES.filter(matches);
      countEl.textContent = items.length + ' entries';
      var html = '';
      ERAS.forEach(function (era, ei) {
        var prevTo = ei === 0 ? -Infinity : ERAS[ei - 1].to;
        var group = items.filter(function (m) { return m.year > prevTo && m.year <= era.to; });
        if (!group.length) return;
        html += '<section class="tl-era"><header class="tl-era-head">' +
          '<h2>' + era.label + '</h2><p>' + era.sub + '</p></header><div class="tl-items">';
        html += group.map(function (m) {
          var d = domainOf(m.topic);
          return '<a class="tl-item" href="' + topicHref(m.topic) + '" style="--c:' + d.color + '">' +
            '<span class="tl-year">' + yearLabel(m.year) + '</span>' +
            '<span class="tl-rail"><i></i></span>' +
            '<span class="tl-body"><span class="tl-title">' + h(MT(m)) + '</span>' +
            '<span class="tl-text">' + h(MX(m)) + '</span>' +
            '<span class="tl-meta">' + h(LN(m.topic)) + ' · ' + h(LN(d)) + '</span></span></a>';
        }).join('');
        html += '</div></section>';
      });
      if (!items.length) {
        html = '<div class="tl-empty"><p>' + 'Nothing matches this combination.' + '</p><span>' + 'Try another domain, or clear the search.' + '</span></div>';
      }
      listEl.innerHTML = html;
    }

    document.getElementById('tl-filters').addEventListener('click', function (e) {
      var btn = e.target.closest('.chip-filter');
      if (!btn) return;
      filter = btn.dataset.filter;
      document.querySelectorAll('.chip-filter').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      render();
    });
    input.addEventListener('input', render);
    render();
  }


  var state = { route: 'home', title: '' };

  function parseHash() {
    if (window.__ATLAS__ && window.__ATLAS__.route) {
      return String(window.__ATLAS__.route).split('/').filter(Boolean);
    }
    var raw = location.hash.replace(/^#\/?/, '');
    raw = raw.split('#')[0];
    var qi = raw.indexOf('?');
    if (qi >= 0) raw = raw.slice(0, qi);
    return raw.split('/').filter(Boolean);
  }

  function setNav(route) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.nav === route);
    });
  }

  function render() {
    var seg = (location.hash && location.hash.indexOf('#/') !== 0) ? [] : parseHash();
    var html = '';
    var route = '';
    var title = state.title;

    document.body.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');

    if (!seg.length) {
      html = viewHome();
      route = 'home';
      title = 'CS Atlas · A map of computer science';
    } else if (seg[0] === 'map') {
      html = viewMap();
      route = 'map';
      title = 'The Atlas · CS Atlas';
    } else if (seg[0] === 'timeline') {
      html = viewTimeline();
      route = 'timeline';
      title = 'Timeline · CS Atlas';
    } else if (seg[0] === 'domains') {
      html = viewDomains();
      route = 'domains';
      title = 'Domains · CS Atlas';
    } else if (seg[0] === 'paths') {
      html = viewPaths();
      route = 'paths';
      title = 'Paths · CS Atlas';
    } else if (seg[0] === 'progress') {
      html = viewProgress();
      route = 'progress';
      title = 'My progress · CS Atlas';
    } else if (seg[0] === 'computer') {
      html = CS.ComputerUI.view();
      route = 'logic';
      title = 'Computer · the whole machine';
    } else if (seg[0] === 'asm') {
      html = CS.AsmUI.view();
      route = 'logic';
      title = 'Assembly language & assembler · Hack';
    } else if (seg[0] === 'input') {
      html = CS.InputUI.view();
      route = 'logic';
      title = 'Input · keyboard';
    } else if (seg[0] === 'screen') {
      html = CS.ScreenUI.view();
      route = 'logic';
      title = 'Output · screen';
    } else if (seg[0] === 'logic') {
      html = CS.LogicUI.view();
      route = 'logic';
      title = 'Gate reference · CS Atlas';
    } else if (seg[0] === 'giants') {
      html = CS.GiantsUI.view();
      route = 'giants';
      title = 'Courses · standing on shoulders · CS Atlas'; 
    } else if (seg[0] === 'p2') {
      html = CS.P2UI.view();
      route = 'logic';
      title = 'Adders · CS Atlas';
    } else if (seg[0] === 'bits') {
      html = CS.P2UI.view();
      route = 'logic';
      title = 'Adders · CS Atlas';
    } else if (seg[0] === 'p1' || seg[0] === 'mux') {
      html = CS.P1UI.view();
      route = 'logic';
      title = 'Basic gates · building everything from NAND'; 
    } else if (seg[0] === 'intro') {
      html = CS.IntroUI.view();
      route = 'logic';
      title = 'Why computers can be universal · CS Atlas';
    } else if (seg[0] === 'ram') {
      html = CS.RamUI.view();
      route = 'logic';
      title = 'RAM · picking a register by address';
    } else if (seg[0] === 'machine') {
      html = CS.MachineUI.view();
      route = 'logic';
      title = 'The Hack computer · specification';
    } else if (seg[0] === 'ml') {
      html = CS.MLUI.view();
      route = 'logic';
      title = 'Machine language · A and C instructions';
    } else if (seg[0] === 'cpu') {
      html = CS.CpuUI.view();
      route = 'logic';
      title = 'CPU · CS Atlas';
    } else if (seg[0] === 'clock') {
      html = CS.ClockUI.view();
      route = 'logic';
      title = 'Sequential logic · CS Atlas';
    } else if (seg[0] === 'alu') {
      html = CS.AluUI.view();
      route = 'logic';
      title = 'ALU · CS Atlas';
    } else if (seg[0] === 'adder') {
      html = CS.AdderUI.view();
      route = 'logic';
      title = 'Adders · from half adder to 16-bit';
    } else if (seg[0] === 'layers') {
      html = CS.LayersUI.view();
      route = 'logic';
      title = 'One gate, four layers · CS Atlas';
    } else if (seg[0] === 'path' && seg[1]) {
      var p = CS.paths.filter(function (x) { return x.id === seg[1]; })[0];
      if (p) { html = viewPath(p); route = 'paths'; title = p.title + ' · CS Atlas'; }
      else html = viewNotFound();
    } else if (seg[0] === 'domain' && seg[1]) {
      var d = domainById.get(seg[1]);
      if (d) { html = viewDomain(d); route = 'domains'; title = LN(d) + ' · CS Atlas'; }
      else html = viewNotFound();
    } else if (seg[0] === 'topic' && seg[1]) {
      var t = topicById.get(seg[1]);
      if (t) { html = viewTopic(t); route = 'domains'; title = LN(t) + ' · CS Atlas'; }
      else html = viewNotFound();
    } else if (seg[0] === 'about') {
      html = viewAbout();
      route = '';
      title = 'About · CS Atlas';
    } else if (seg[0] === 'random') {
      var pool = TOPICS;
      var pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) { location.replace('#/topic/' + pick.id); return; }
      html = viewNotFound();
    } else {
      html = viewNotFound();
    }

    state.route = route;
    state.title = title;
    document.title = title;

    main.innerHTML = html;
    main.classList.remove('view-in');
    void main.offsetWidth;
    main.classList.add('view-in');

    setNav(route);
    window.scrollTo(0, 0);
    updateProgress();
    mount();

    var anchor = (window.__ATLAS__ && window.__ATLAS__.anchor) || location.hash.split('#')[2];
    if (anchor) {
      requestAnimationFrame(function () {
        var el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    }
  }

  var LOGIC_MOUNTS = {
    intro: ['IntroUI'],
    p1: ['P1UI', 'MuxUI'],
    mux: ['P1UI', 'MuxUI'],
    p2: ['P2UI'],
    bits: ['P2UI'],
    alu: ['AluUI'],
    adder: ['AdderUI'],
    clock: ['ClockUI'],
    ram: ['RamUI'],
    machine: ['MachineUI'],
    ml: ['MLUI'],
    asm: ['AsmUI'],
    cpu: ['CpuUI'],
    computer: ['ComputerUI'],
    screen: ['ScreenUI'],
    input: ['InputUI'],
    logic: ['LogicUI'],
    layers: ['LayersUI']
  };

  function mountLogic() {
    var key = (parseHash()[0] || '');
    (LOGIC_MOUNTS[key] || []).forEach(function (name) {
      var ui = CS[name];
      if (ui && typeof ui.mount === 'function') ui.mount();
    });
  }

  function mount() {
    if (state.route === 'home') {
      var hm = document.getElementById('hero-map');
      if (hm) renderHeroMap(hm);
    }
    if (state.route === 'map') initMap();
    if (state.route === 'timeline') initTimeline();
    if (state.route === 'progress') initProgress();
    
    if (state.route === 'logic') mountLogic();
    if (state.route === 'giants') CS.GiantsUI.mount();
    if (document.querySelector('[data-status-topic]')) initTopicStatus();
    observeReveal();
    initToc();
  }


  function initTopicStatus() {
    var bar = document.querySelector('[data-status-topic]');
    if (!bar) return;
    var id = bar.dataset.statusTopic;

    function paint() {
      var s = statusOf(id);
      bar.querySelectorAll('.status-btn').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.status === s);
      });
      var dueEl = bar.querySelector('.status-due');
      if (dueEl) {
        dueEl.textContent = s === 'todo'
          ? ''
          : (relDue(dueOf(id)) + '' + fmtDate((entryOf(id) || {}).updated));
      }
      var cb = document.querySelector('[data-practice]');
      if (cb) cb.checked = s === 'build';
    }

    bar.querySelectorAll('.status-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setStatus(id, btn.dataset.status);
        paint();
      });
    });

    var practice = document.querySelector('[data-practice]');
    if (practice) {
      practice.addEventListener('change', function () {
        setStatus(id, practice.checked ? 'build' : 'read');
        paint();
      });
    }
  }

  function initProgress() {
    var wrap = document.querySelector('[data-progress]');
    if (!wrap) return;

    document.querySelectorAll('[data-progress]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.dataset.progress;
        if (action === 'export') {
          var blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'cs-atlas-progress.json';
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        } else if (action === 'import') {
          var input = document.getElementById('progress-file');
          if (input) input.click();
        } else if (action === 'reset') {
          if (window.confirm('Clear all learning records? This cannot be undone.')) {
            store = {};
            saveStore();
            render();
          }
        }
      });
    });

    var file = document.getElementById('progress-file');
    if (file) {
      file.addEventListener('change', function () {
        var f = file.files && file.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = JSON.parse(String(reader.result));
            if (data && typeof data === 'object') {
              store = Object.assign({}, store, data);
              saveStore();
              render();
            }
          } catch (e) {
            window.alert('That file is not valid progress JSON.');
          }
        };
        reader.readAsText(f);
      });
    }

    document.querySelectorAll('[data-review]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.review;
        setStatus(id, statusOf(id));
        var item = btn.closest('.review-item');
        if (item) item.remove();
      });
    });
  }


  var progressEl = document.getElementById('progress');

  function updateProgress() {
    if (!progressEl) return;
    var isArticle = state.route === 'domains' && document.querySelector('.topic-page');
    document.body.classList.toggle('is-article', !!isArticle);
    if (!isArticle) { progressEl.style.transform = 'scaleX(0)'; return; }
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    progressEl.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  var tocObs = null;
  function initToc() {
    var links = document.querySelectorAll('[data-toc]');
    if (!links.length) return;
    var sections = Array.prototype.map.call(links, function (a) {
      return document.getElementById(a.dataset.toc);
    }).filter(Boolean);
    if (!sections.length) return;
    if (tocObs) tocObs.disconnect();
    var obs = tocObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.dataset.toc === en.target.id); });
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(a.dataset.toc);
        if (!target) return;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  var revealObs = null;
  function observeReveal() {
    if (reduceMotion) return;
    if (revealObs) revealObs.disconnect();
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { revealObs.observe(el); });
  }


  document.getElementById('footer-meta').textContent = DOMAINS.length + ' domains · ' + TOPICS.length + ' topics · ' + ALL_MILESTONES.length + ' milestones';
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-random]') : null;
    if (!a) return;
    e.preventDefault();
    var pick = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    if (pick) location.hash = '#/topic/' + pick.id;
  });

  document.addEventListener('click', function (e) {
    if (!window.__ATLAS__) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#/"]') : null;
    if (!a) return;
    e.preventDefault();
    var raw = a.getAttribute('href').slice(2);
    var bits = raw.split('#');
    var sub = bits[0];
    var hash = bits[1] ? '#' + bits[1] : '';
    var base = (window.__ATLAS__.base || '') + '/';
    location.href = base + (sub ? sub + '/' : '') + hash;
  });

  window.addEventListener('hashchange', function () {
    if (location.hash && location.hash.indexOf('#/') !== 0) return;
    render();
  });
  render();
})();
