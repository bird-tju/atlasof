window.CS = window.CS || {};
CS.GiantsUI = (function () {
  'use strict';

  function card(c) {
    var notes = c.notes.map(function (n) {
      var live = n[3] === 'live';
      return '<a class="gn-note' + (live ? '' : ' is-plan') + '" href="' + n[0] + '">' +
        '<span class="gn-no">' + n[1] + '</span>' +
        '<span class="gn-title">' + n[2] + '</span>' +
        '<span class="gn-tag' + (live ? ' is-live' : '') + '">' + (live ? 'Live' : 'Planned') + '</span>' +
        '</a>';
    }).join('');

    return '<article class="giant-card">' +
      '<header class="giant-head">' +
      '<div class="giant-title"><h2>' + c.name + '</h2><span class="giant-full">' + c.full + '</span></div>' +
      '<a class="giant-link" href="' + c.url + '" target="_blank" rel="noopener">' +
      c.url.replace(/^https?:\/\//, '').replace(/\/$/, '') + ' ↗</a>' +
      '</header>' +
      '<dl class="giant-meta">' +
      '<div><dt>' + 'Offered by' + '</dt><dd>' + c.school + '</dd></div>' +
      '<div><dt>' + 'Authors' + '</dt><dd>' + c.authors + '</dd></div>' +
      '<div><dt>' + 'Since' + '</dt><dd>' + c.since + '</dd></div>' +
      '<div><dt>' + 'Materials' + '</dt><dd>' + c.license + '</dd></div>' +
      '</dl>' +
      '<p class="giant-intro">' + c.intro + '</p>' +
      '<p class="giant-why"><b>' + 'Why reordered:' + '</b>' + c.why + '</p>' +
      '<h3 class="giant-sub">' + c.order + '</h3>' +
      '<div class="giant-notes">' + notes + '</div>' +
      '</article>';
  }

  function view() {
    var planned = CS.giantPlanned.map(function (p) {
      return '<li><b>' + p[0] + '</b><span>' + p[1] + '</span><em>' + p[2] + '</em></li>';
    }).join('');

    return '<section class="page-head page-head-giants">' +
      '<div class="wrap">' +
      '<p class="eyebrow">Open Courses</p>' +
      '<h1>' + 'Standing on the shoulders of giants' + '</h1>' +
      '<p class="page-head-lead">' + 'These are my own notes from open courses, not copies of the course material. Each course is reordered around how I understood it, with diagrams I drew and panels you can play with: understanding and building are two different things.' + '</p>' +
      '</div></section>' +

      '<section class="giants-section"><div class="wrap">' +
      '<p class="giants-note"><b>' + 'On copyright:' + '</b>' + 'Courses, books and slides belong to their authors and publishers. What you find here is my understanding, my own diagrams and my own experiments; quotes are attributed, and no figures, exercises or source from the book are reproduced.' + '</p>' +

      CS.giants.map(card).join('') +
      '<div class="giants-more">' +
      '<h3>' + 'Want to learn next' + '</h3>' +
      '<ul class="giants-plan">' + planned + '</ul>' +
      '</div>' +
      '</div></section>';
  }

  function mount() {}

  return { view: view, mount: mount };
})();
