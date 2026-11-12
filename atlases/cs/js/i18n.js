/* i18n — compatibility layer for the English-only site
   The site is English-only at /cs/ (Chinese, if it ever returns, goes under /cs/zh/).
   CS.I18N keeps its old API so L()/LN()/LS() and CS.I18N.t() calls keep working. */
window.CS = window.CS || {};

var EN = true;
window.EN = true;

(function () {
  'use strict';
  CS.I18N = {
    lang: 'en',
    t: function (zh, en) { return en == null ? zh : en; },
    n: function (o) { return (o && (o.en || o.name)) || ''; },
    sub: function () { return ''; }
  };
})();
