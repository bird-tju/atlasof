/* The privacy policy page, served from the site root.
   One URL for the whole domain, because ad networks and privacy rules expect a
   single policy rather than one per atlas. Self-contained: inline styles, no asset
   requests, so it renders even if a path prefix is what went wrong.

   Contact is optional; leave it empty until there is a mailbox to point at. */
function privacyPage(site, contact) {
  const contactHtml = contact
    ? '<p>Questions about this page: <a href="mailto:' + contact + '">' + contact + '</a>.</p>'
    : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="robots" content="index,follow">
<title>Privacy · Atlas</title>
<meta name="description" content="What this site stores, what it does not, and how advertising cookies are handled.">
<link rel="canonical" href="${site}/privacy/">
<style>
  :root{--bg:#070910;--text:#e9ebf2;--prose:#d9dbe5;--muted:#a8afc2;--line:rgba(255,255,255,.09);--accent:#7aa2f7;
        --sans:"Inter","Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,sans-serif;--mono:ui-monospace,"Cascadia Code",Menlo,Consolas,monospace}
  @media (prefers-color-scheme: light){:root{--bg:#f6f4ee;--text:#191c24;--prose:#202532;--muted:#4e5565;--line:rgba(24,28,40,.12);--accent:#2f5fd0}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--prose);font:17px/1.7 var(--sans);-webkit-font-smoothing:antialiased}
  .wrap{width:min(720px,90vw);margin:0 auto;padding:14vh 0}
  .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:0 0 18px}
  h1{color:var(--text);font-size:clamp(30px,5vw,44px);line-height:1.1;letter-spacing:-.03em;margin:0 0 12px}
  h2{color:var(--text);font-size:20px;letter-spacing:-.01em;margin:34px 0 10px}
  p,li{margin:0 0 14px}
  ul{padding-left:20px}
  a{color:var(--accent)}
  code{font-family:var(--mono);font-size:.9em;background:rgba(127,127,127,.14);padding:1px 5px;border-radius:4px}
  .back{margin-top:44px;padding-top:20px;border-top:1px solid var(--line);font-family:var(--mono);font-size:13px}
  .updated{font-family:var(--mono);font-size:12px;color:var(--muted);margin:0 0 26px}
</style>
</head><body>
<main class="wrap">
  <p class="eyebrow">Privacy</p>
  <h1>What this site knows about you</h1>
  <p class="updated">Last updated 12 November 2026</p>

  <p>Atlas is a static site: the pages are pre-built HTML files, and there is no account system, no server-side database and no form that sends data anywhere.</p>

  <h2>Stored in your browser</h2>
  <p>Two things are kept in <code>localStorage</code> on your device, and they never leave it unless you export them:</p>
  <ul>
    <li><code>atlasof.progress.v1</code> — which topics you marked as read, understood or built, plus the review schedule. The progress page can export this to a JSON file and import it back.</li>
    <li><code>atlas-theme</code> — your dark or light preference, so the site does not flash the wrong theme.</li>
  </ul>
  <p>Clearing site data in your browser deletes both.</p>

  <h2>What is not collected</h2>
  <p>No analytics, no tracking pixels, no fingerprinting, no cross-site identifiers. The site loads no third-party fonts or scripts of its own.</p>

  <h2>Hosting</h2>
  <p>The site is served by a hosting provider acting as a content delivery network. Like any web server it receives your IP address, the page you asked for and your user agent, and it may keep request logs for security and abuse prevention. Those logs belong to the provider, not to us.</p>

  <h2>Advertising</h2>
  <p>This site may display advertising through Google AdSense. If and when ads are enabled:</p>
  <ul>
    <li>Google and its partners may use cookies or similar technologies to serve ads based on your prior visits to this and other sites.</li>
    <li>Where the law requires it — for example in the European Economic Area and the United Kingdom — a consent message appears first, and no advertising cookies are set until you choose.</li>
    <li>You can opt out of personalised advertising in <a href="https://adssettings.google.com/" rel="noopener">Google Ad Settings</a>, or manage cookies in your browser.</li>
    <li>Google's own practices are described on the <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">Google privacy and terms</a> page.</li>
  </ul>

  <h2>Outbound links</h2>
  <p>Pages link to external sources — papers, books, course sites. Once you follow one, that site's own privacy policy applies.</p>

  <h2>Changes</h2>
  <p>If this policy changes, the date at the top changes with it. The site is a static build, so earlier versions live in the repository history.</p>
  ${contactHtml}

  <p class="back"><a href="/">← All atlases</a> · <a href="/cs/">CS Atlas</a></p>
</main>
</body></html>`;
}

module.exports = { privacyPage };
