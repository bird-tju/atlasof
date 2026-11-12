# CS Atlas

A static, zero-dependency atlas of computer science — plus a from-scratch hardware course built up from a single NAND gate.

The site is **English-only**. Pages are served from `/cs/…`; Chinese, if it ever returns, would live under `/cs/zh/…`.

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
index.html            development shell — the build prerenders it, and it also
                      works as an offline SPA preview (file://, hash routing)
assets/css/main.css   all styling (dark by default, light theme available)
assets/js/app.js      shell, routing, views, progress store
assets/js/i18n.js     tiny compatibility layer (CS.I18N, language fixed to English)
assets/js/data/       content: core.js, 01–13 domains, 14 learning, 15 courses,
                      17 HDL, 18 open courses
assets/js/logic/      hardware-course pages and their interactive widgets
dev/                  build, static server, data check, HDL check, smoke tests
dist/                 build output (115 prerendered pages) — generated, not edited
shots/                screenshots used while reviewing the design (ignored by git)
svg/                  hand-drawn gate artwork (not referenced by the site)
```

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

Append one object to the matching domain file in `assets/js/data/` and rebuild:

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

## Licence

Text is shared under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); code under the MIT licence.
