# Atlas

A static, zero-dependency collection of atlases. One is published:

- **CS Atlas** at `/cs/` — computer science in 13 domains, 75 topics and 326 milestones, plus a from-scratch hardware course built up from a single NAND gate.
- **Math Atlas** — source in `atlases/math/`, held back until it has content (`enabled: false` in `ATLASES`).

The front page at `/` is the portal that lists the published ones.

Everything is **English-only**. Each atlas lives under its own base: `/cs/…` today, `/math/…` when it ships.

Live shape of the content: **13 domains · 75 topics · 326 milestones · 129 people**.

## What it is

A map rather than a syllabus. Every topic sits in three coordinates: which domain it belongs to, what problem it solves, and where it came from. Any node works as an entry point — the related links at the bottom of a page are the next step.

The site is deliberately boring to run: HTML, CSS and plain JavaScript, no build step for authoring, no external fonts or CDNs, no tracking.

## Pages

| Route | Content |
| --- | --- |
| `/cs/` | Home: statement, the 13 domains, three learning paths, a slice of the timeline |
| `/cs/map/` | The atlas graph: pannable, zoomable, clustered by domain, with hover summaries |
| `/cs/timeline/` | 326 milestones in six eras, filterable by domain and searchable |
| `/cs/domains/` | Domain index |
| `/cs/domain/:id` | A domain: intro, topic list with dates, chronology, courses and labs |
| `/cs/topic/:id` | A topic: overview, history, core concepts, people, hands-on task, self-check, further reading |
| `/cs/paths/` · `/cs/path/:id` | Five story-shaped paths plus a free-roam option |
| `/cs/progress/` | Your progress: mastery levels, coverage, review queue, blind spots, next steps |
| `/cs/giants/` | Open courses: the courses this site is studied alongside |
| `/cs/about/` | Why it exists, how to use it, editorial rules, licence |
| `/cs/courses/nand2tetris/` | The hardware course index: fifteen steps from NAND to a computer |
| `/cs/courses/nand2tetris/intro/` | Why a machine can be universal: the stored program |
| `/cs/courses/nand2tetris/gates/` | Basic gates from NAND, multiplexers, one bit and sixteen |
| `/cs/courses/nand2tetris/adders/` | Half adder → full adder → Add16 → Inc16 → ALU |
| `/cs/courses/nand2tetris/alu/` | The ALU: six control bits, two flags |
| `/cs/courses/nand2tetris/sequential/` | The clock, the DFF, registers and the PC |
| `/cs/courses/nand2tetris/ram/` | RAM: from one register to 16K words |
| `/cs/courses/nand2tetris/machine/` | The Hack specification: memory map, registers |
| `/cs/courses/nand2tetris/machine-language/` | A and C instructions, sixteen bits at a time |
| `/cs/courses/nand2tetris/assembler/` | Symbols, labels and the two-pass assembler |
| `/cs/courses/nand2tetris/cpu/` | Fetch, decode, execute |
| `/cs/courses/nand2tetris/computer/` | The whole machine, assembled |
| `/cs/courses/nand2tetris/screen/` | Memory-mapped output |
| `/cs/courses/nand2tetris/keyboard/` | Memory-mapped input |
| `/cs/courses/nand2tetris/gate-reference/` | Appendix: six gates, expression / truth table / symbol |
| `/cs/courses/nand2tetris/abstraction-levels/` | Appendix: the same NAND at four levels |

## Repository layout

```
atlases/cs/           the CS atlas: its own shell, styles, data and pages
  index.html          SPA shell — the build prerenders it, and it also works
                      as an offline preview (file://, hash routing)
  css/main.css        its styling
  js/app.js           shell, routing, views, progress store
  js/i18n.js          compatibility layer (CS.I18N, language fixed to English)
  js/data/            content: core.js, 01–13 domains, 14 learning, 15 courses,
                      17 HDL, 18 open courses
  js/pages/           the hardware course pages and their widgets
atlases/math/         the math atlas: source only, not published (enabled: false)
dev/                  build, static server, data check, HDL check, smoke tests
dist/                 build output (generated, ignored by git)
  index.html          the portal
  404.html            served by the host for unknown paths (self-contained)
docs/                 design notes and artwork
shots/                screenshots used while reviewing (ignored by git)
```

## Adding an atlas

1. Create `atlases/<id>/` with `index.html` and `css/main.css` (plus `js/` if it needs a runtime).
2. Add one object to `ATLASES` in `dev/build.js`: `{ id, base, dir, title, tagline, card, routes }`.
3. `npm run build` — the portal, the sitemap and every page are generated from that list.

## Commands

```bash
npm install            # jsdom, only needed for build and smoke tests
npm run check          # validate the data files (ids, references, fields)
npm run hdl            # validate the HDL snippets
npm run smoke          # 35 headless checks: routes, interactions, build guards
npm run build          # prerender dist/ (115 pages)
npm run preview        # serve dist/ on http://127.0.0.1:4321
```

`npm run build` needs `jsdom`; authoring the site does not.

## Adding a topic

Append one object to the matching domain file in `atlases/cs/js/data/` and rebuild:

```js
{
  id: 'my-topic',
  name: 'Topic name',
  domain: 'theory',
  year: 1936,
  tags: ['tag'],
  summary: 'One-line summary',
  body: ['First paragraph', 'Second paragraph'],
  milestones: [[1936, 'Event', 'Note', 1]],
  concepts: [['Concept', 'Explanation']],
  people: [['Person', '1900 – 1980', 'Contribution']],
  related: ['turing-machine'],
  reading: [['Title', 'Author', 1936]],
  practice: 'A task worth one evening to one weekend'
}
```

The fourth milestone element (`1`) marks it as a highlight for the home page.
Prerequisites and practice tasks live in `14-learning.js`, courses and labs in `15-courses.js`.

## Troubleshooting

**Accents look orange/brown and the graph looks washed out.** A colour-remapping
extension is overriding the stylesheet — Dark Reader, Midnight Lizard, or a
global Stylus/Stylish theme. Disable it for this site (or open the page in a
private window) and the palette returns to normal. The site ships both a dark and
a light theme and picks one from the OS colour scheme on first visit, so a
dark-mode extension has nothing to "fix".

**Colours or layout look stale after a rebuild.** Run `npm run build` again and
reload. Asset URLs carry a content hash (`main.css?v=…`), so a reload always
picks up new CSS; HTML is served with `no-store` by `npm run preview`.

## Typography

Latin-first font stacks: `Inter` if installed, then Segoe UI Variable / Segoe UI on
Windows, SF on macOS, with the CJK faces (PingFang, YaHei) kept as a last resort so
stray CJK characters still render. Everything else in the stylesheet assumes Latin
text: body leading 1.65, prose 1.72 and capped at a 68-character measure, headings
tracked slightly tight, `text-wrap: balance` on headings and `pretty` on prose.

If English ever looks wrong again, check the platform font first: before this stack
was reordered, Windows resolved to Microsoft YaHei for Latin text, which is why the
site "looked Chinese" while every measurement was correct.

## Sharing and metadata

Each atlas carries its own `og.png` (1200×630) and `icon-180.png` next to its
`index.html`; the build copies both to `/<atlas>/` and emits `og:image`,
`twitter:card`, `theme-color` (dark and light) and `apple-touch-icon` for every
page. The images are generated once by `dev/make-images.js` (needs headless Chrome
on port 9222) and committed, because they bake in whatever font the generating
machine resolved.

## Deploying

The output in `dist/` is plain static files; any host works. The configuration used
for Cloudflare Pages:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Output directory | `dist` |
| Node version | 22 |

`npm ci` requires `package-lock.json`, which is committed for that reason: without
it every build resolves jsdom fresh and a major release can break the build with no
change on our side.

Before the first deploy, change `SITE` in `dev/build.js` to the real domain and
rebuild — canonical URLs, `og:url`, the sitemap and robots.txt all derive from it.

The build writes `dist/_headers` (Cloudflare Pages and Netlify both read it):
`/assets/*` is cacheable forever because those URLs carry a content hash, while
HTML keeps the platform default of revalidating on every request. Only one rule
sets `Cache-Control`, because the host joins duplicate headers with a comma rather
than letting the last rule win.

## Licence

Two licences, split by what is being reused:

| What | Licence | File |
| --- | --- | --- |
| Code — shell, styles, page modules, data files as software, build scripts | MIT | [LICENSE](LICENSE) |
| Content — topic pages, milestones, course text, about page, social card | CC BY-NC-SA 4.0 | [LICENSE-CONTENT](LICENSE-CONTENT) |

In short: take the engine freely; you may reuse the writing with credit, but not to sell it.
