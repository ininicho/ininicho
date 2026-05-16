# Handoff — Portfolio site (Nicholaus Suprapto)

## Overview

A small, elegant, single-author portfolio site for a software / DevOps engineer.
Three pages: **Home**, **Photography**, **CV**. The design is "Minimal Swiss" — tight
grid, generous whitespace, small mono numerical labels, a warm-white background,
and a single muted-blue accent (IBM Heritage blue) used sparingly for emphasis.

The voice is professional with a small touch of personality (a photography section
sits alongside the engineering CV). Nothing is loud; everything earns its place.

## About the design files

The files in `design/` and the three `*.html` files are **design references** —
React/JSX prototypes that show the intended look and behaviour. They are **not**
production code to copy directly. The goal is to **recreate these screens as a
Svelte / SvelteKit project** using idiomatic Svelte patterns:

- One route per page (`/`, `/photography`, `/cv`) using SvelteKit's file-based router.
- A shared `+layout.svelte` for the top nav, fonts and design-token CSS variables.
- Small, focused `.svelte` components for the repeating pieces (top bar, section
  header, project row, photo card, CV experience block).
- Plain CSS (or your preferred zero-runtime style approach — Svelte's scoped
  `<style>` blocks are perfect here). No CSS-in-JS needed.
- Real `<img>` tags inside the photography grid — the `PhotoBlock` placeholder
  in `design/placeholders.jsx` is just a stand-in until real photos exist.

If you'd prefer a different stack than SvelteKit (e.g. plain Svelte SPA, Astro
with Svelte islands), that's fine — the design carries fine in either. The
component decomposition below is framework-agnostic.

## Fidelity

**High-fidelity.** Colours, type, sizing, spacing and copy are all final. The
visual target is to reproduce the screens pixel-close on a 1280px canvas (the
design width), and to scale gracefully down to mobile. The HTML previews show
the desktop layout; responsive behaviour is described below per page.

## How to view the design

Open any of these in a browser (they need no build):

- `home.html` — Home page
- `gallery.html` — Photography page
- `cv.html` — CV page

Each is a single-file React/Babel renderer that mounts the corresponding JSX
file from `design/`. The design files themselves contain all the values you
need; this README documents them in a framework-agnostic way for translation.

---

## Design tokens

These are the values you should put behind CSS variables (e.g. in
`src/app.css` or a `tokens.css` in `+layout.svelte`).

### Colours

| Token            | Hex       | Used for                                              |
|------------------|-----------|-------------------------------------------------------|
| `--bg`           | `#FBF7EF` | Page background (Ivory — warm white)                  |
| `--paper`        | `#FFFFFF` | Elevated surfaces: button text on dark, lifted blocks |
| `--ink`          | `#191917` | Primary text                                          |
| `--ink-2`        | `#6B675F` | Secondary text                                        |
| `--ink-3`        | `#A09B91` | Tertiary text, faded labels, the muted name in hero   |
| `--accent`       | `#1F70C1` | IBM Heritage Blue — used only on key emphasis points  |
| `--rule`         | `rgba(25,25,23,0.12)` | Dividers, faint borders                   |
| `--rule-soft`    | `rgba(25,25,23,0.06)` | Even fainter dividers (inside tables)     |

The accent is intentionally rare — count its uses on the home page: hero
"Toronto." period, contact "email" period, the `→` glyph on the "view all"
arrow on CV bullets. That's it. Resist using it anywhere else.

### Typography

Two families, loaded from CDNs:

```html
<link href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Switzer** (Fontshare) — body and headlines, weights 300 / 400 / 500 / 600 / 700
- **JetBrains Mono** (Google Fonts) — labels, metadata, small numerical accents, tags

For SvelteKit, self-host both via `@fontsource-variable/jetbrains-mono` and a
local Switzer download (Fontshare provides webfont packages on request).

### Type scale (the actual sizes used)

| Use                              | Family   | Weight | Size       | Line-height | Letter-spacing |
|----------------------------------|----------|-------:|-----------:|------------:|---------------:|
| Hero headline                    | Switzer  |    500 | 80px       | 1.02        | -0.03em        |
| CV title / Photography title     | Switzer  |    500 | 56px       | 1.05        | -0.025em       |
| Photography page H1              | Switzer  |    500 | 48px       | 1.05        | -0.025em       |
| Contact "fastest way is email"   | Switzer  |    500 | 36px       | 1.15        | -0.02em        |
| Section header (ASection label)  | Switzer  |    500 | 22px       | 1.2         | -0.01em        |
| Project / CV role title          | Switzer  |    500 | 22px       | 1.2 / 1.25  | -0.01 / -0.012 |
| About paragraph (primary)        | Switzer  |    400 | 22px       | 1.5         | -0.005em       |
| Body / paragraph                 | Switzer  |    400 | 14–16px    | 1.55–1.65   | —              |
| Mono label                       | Mono     |    400 | 11px       | —           | 0.06em + UPPER |
| Mono nav / status                | Mono     |    400 | 12px       | —           | 0.04em         |
| Mono caption (photos)            | Mono     |    400 | 11px       | —           | 0.04em         |
| Mono tag (pill)                  | Mono     |    400 | 10–11px    | —           | 0.04em         |

### Spacing

The design uses a relaxed scale; multiples of 8 are common but not strict.
Key recurring values:

- Page horizontal padding: **64px** (home/cv/gallery)
- Section gap (top padding between sections): **88–120px**
- Hero top padding: **160px**, hero bottom: **140px**
- Two-column grid gap (about, contact): **48–80px**
- Inner content max-width on text columns: **880–1080px**

A left "metadata gutter" of **120px** runs down every section — the small `01 /
…` labels live in that gutter, and the section content begins after a 24px gap.
This is the single most important structural rhythm in the design.

### Radii & borders

- Pill-shape stack tags (`border-radius: 99px`)
- Otherwise **no rounded corners** anywhere — squared edges are part of the
  Swiss feel.
- Hairline borders everywhere use `--rule` or `--rule-soft`.

### No shadows

The design has zero box-shadows. Depth is communicated by hairline rules and
warm-white vs paper-white surfaces only.

---

## Pages

### 1. Home (`home.html` → `/`)

**Purpose**: Landing — introduce Nicholaus, then funnel to work, photography,
or contact.

**Layout** (1280 wide, ~3360 tall on desktop):

1. **Top bar** (sticky, 70px). 3-column grid: `120px / 1fr / auto`.
   - Left: `idx · 2026` (mono label, ink-2)
   - Middle: nav links — `index` (active, ink), `work`, `photography`, `cv`, `contact` (mono, 12px, ink-2)
   - Right: green dot + `Toronto · live` (mono, 12px, ink-2)
   - Bottom border: `--rule`

2. **Section 00 — Hero** (padding `160px 64px 140px`).
   - Gutter (120px) + content. Gutter holds `00 / intro` mono label.
   - H1 (80px / 500 / -0.03em, line-height 1.02):
     - Line 1: `Nicholaus Suprapto.` in `--ink-3` (muted grey)
     - Line 2: `Software engineer. Payments platforms.` in `--ink` + `Toronto.` in `--accent`
   - **Metadata row** (72px below H1). Flex row, 56px gap, mono 12px uppercase 0.06em:
     - `ROLE` → Associate DevOps
     - `ORGANIZATION` → IBM Payments Center
     - `NOW` → Payments Canada · RTR
     - `BASED` → Toronto, CA
   - Each metadata block: small label in `--ink-3`, value in `--ink`, 6px gap.

3. **Section 01 — About** (`ASection` pattern: `01` label in gutter, "About" header at 22px/500).
   - 2-column grid, 1.1fr / 1fr, 80px gap, max-width 1080.
   - Left: primary paragraph (22px/1.5/-0.005em, ink) + secondary paragraph (16px/1.65, ink-2).
   - Right: portrait photo placeholder, 4/5 ratio.

4. **Section 02 — Selected work** (3 rows; top padding 120px).
   - Each row: 4-column grid `60px / 1fr / 1fr / auto`, gap 32px, padding 32px 0.
   - Row top border `--rule`; last row also has bottom border.
   - Columns: number (mono 11/uppercase) · title (22/500/-0.01em) + sub-line (mono 11/uppercase, ink-2) · blurb (14/1.55, ink-2, max-width 380) · tags (pill row, mono 11, border `--rule`).

5. **Section 03 — Photography preview** (top padding 120px).
   - Two-line intro: paragraph left (max 480, ink-2) + `view all (52) →` mono link right.
   - 4-column photo grid, 16px gap, ratio 4/5 each.
   - Caption beneath each: location/date on left, `#001` on right (mono 11, ink-2).

6. **Section 04 — Contact** (top 120px, bottom 96px).
   - 2-column grid, max-width 1000:
     - Left: 36px/500 statement "The fastest way is email." (with accent period) + outline button (mono 13, 14×22 padding, 1px ink border) showing `nsuprapt@uwaterloo.ca ↗`.
     - Right: `<dl>` with mono labels (80px column) — GITHUB, LINKEDIN, RESUME, LOCATION — values in `--ink`.

7. **Bottom rule** + **footer** (32px 64px padding): mono 11 uppercase, ink-3. Left "© 2026 — built by hand", right "v 1.0 · last updated may 2026".

**Interactions**:
- Top bar sticky to page top.
- Nav links: no visited state; hover should subtly underline (`text-underline-offset: 4px`, thickness 1px).
- All blue periods (`Toronto.`, `email.`) — non-interactive emphasis.
- "view all →" arrow → navigate to `/photography`.
- Project rows: cursor pointer; on hover, faintly highlight (e.g. add a barely-visible background `rgba(0,0,0,0.02)`). Stretch goal: project rows link to per-project case-study pages.

---

### 2. Photography (`gallery.html` → `/photography`)

**Purpose**: A growing photography archive. The user takes photos and adds to
this page; it should feel like a personal index of moments, not a stock gallery.

**Layout**:

1. **Top bar** — same as Home, but "photography" is the active nav item (ink instead of ink-2), and the right slot shows `52 photos · since 2023`.

2. **Page title** (88px top, 56px bottom; same gutter pattern).
   - Gutter: `03 / photography`.
   - Right column: H1 "Things I've noticed while walking around." (48/500/-0.025em, accent period) on left + filter pill row on right (`All` active, `Toronto`, `Travel`, `Film`, `Digital`).
   - Filter pills: mono 11, uppercase, 0.06em, 6×12 padding, border-radius 99. Active pill: `--ink` background, `--paper` text, 1px ink border. Inactive: transparent, `--ink-2` text, 1px `--rule` border.

3. **Grid** (3-column).
   - Photos are striped across 3 columns to create a masonry-ish rhythm; each column is a flex column with 24px gap.
   - Aspect ratios vary (4/5, 3/4, 1/1, 4/3) to create natural staggers.
   - Each photo is a `<figure>` with the image and a caption below (mono 11, ink-2): left = "Kensington · 04·25", right = "#001".

4. **Load-more affordance**:
   - Horizontal rule + centered dark button ("LOAD 18 MORE" — mono 12, uppercase, 0.06em, 14×28 padding, ink background, paper text).
   - Below: "18 of 52 · scroll or click to continue" (mono 11, ink-3, centered).

5. **Faded "next batch" preview** — a 3-photo strip after the button, fading to nothing via a CSS mask. This is purely visual — it suggests "there's more if you scroll."

6. **Footer**: "← back to index" + "52 photos · updated 05·26" (mono 11 uppercase, ink-3).

**Interactions**:
- Filter pills: clicking changes the active state and filters the grid (simple `filter` state in a Svelte component).
- Load more: appends the next batch. For a real photo collection, paginate from a JSON file (`/static/photos.json` is the easy path).
- Photo click (stretch): open a lightbox / focus view with the photo enlarged and metadata.

**Replacing placeholders with real photos**:
- `design/placeholders.jsx` defines `PHOTO_MOODS` (24 duotone swatches) and a
  `<PhotoBlock i={…} ratio="4/5" caption="…" label="#…">` component. In Svelte,
  define a `Photo.svelte` that takes `{ src, alt, caption, label, ratio }` and
  renders an `<img>` with the same surrounding figure+caption markup.
- For lightweight images, suggest `enhanced:img` from `@sveltejs/enhanced-img`.

---

### 3. CV (`cv.html` → `/cv`)

**Purpose**: Full résumé. Should look great on screen and double as a print PDF
target (the "Download · pdf" button is the main CTA on the page).

**Layout**:

1. **Top bar** — same pattern; right slot replaced with a dark **Download · pdf ↓** button (8×14 padding, mono 11, uppercase, 0.06em, ink background, paper text). "cv" is active in the nav.

2. **Title block** (88/48 padding, gutter pattern):
   - Gutter: `04 / cv`.
   - Right: H1 "Curriculum vitae." (56/500/-0.025em, accent period).
   - **Identity row** (36px below H1): flex row of small mono fields — Name, Title, Based, Email, Updated.

3. **Hairline rule** (`--rule`, margin 0 64px).

4. **Section 01 — Experience** (64/32 padding; gutter `01 / experience`).
   - Right column: max-width 920, flex column, 48px gap.
   - Each experience is a grid `180px / 1fr`, 32px gap:
     - Left: date range, mono 12, ink-2, 0.04em letter-spacing.
     - Right: role (22/500/-0.012em) + organisation (14/ink-2) + bulleted list (16px gap, mono em-dash in accent on left) + stack pill row.

5. **Section 02 — Skills** (gutter `02 / skills`). 2-column grid, 16px gap.
   - Each skill group is a row with a top hairline (`--rule-soft`) and a `160px / 1fr` grid inside: mono label left + items joined by ` · ` on the right.

6. **Section 03 — Education** — same pattern as Experience but only one entry currently.

7. **Colophon + download CTA** (64/96 padding, gutter `—`):
   - Left: short paragraph ("References available on request…").
   - Right: dark button "Download résumé · pdf ↓".

**Interactions**:
- Both "Download · pdf" buttons link to `/resume.pdf` (a static file in
  `/static/`).
- The print stylesheet should hide the top bar, side gutters and footer, and
  render the CV at letter/A4 with all sections visible. For SvelteKit this is
  a single `print.css` imported in `+layout.svelte` inside a `@media print`
  block.

---

## Shared components (suggested Svelte decomposition)

| Component        | Props                                                      | Notes                                                    |
|------------------|------------------------------------------------------------|----------------------------------------------------------|
| `TopBar.svelte`  | `active: 'index' \| 'work' \| 'photography' \| 'cv' \| 'contact'`, `right?: Snippet` | Renders the sticky nav. `right` slot is the contextual right-hand element. |
| `Section.svelte` | `num: string`, `label: string`, `topPad?: number`         | Implements the `120px / 1fr` gutter pattern. Wraps `<section>` with the small `num` label in the gutter and the `label` as an H2 inside the right column. |
| `MetaField.svelte` | `label: string`, `value: string`                         | The small mono `LABEL` / `value` pair used in hero and CV identity row. |
| `ProjectRow.svelte` | `no, title, client, year, blurb, tags[]`                | One row of the Selected Work list on Home. |
| `Photo.svelte`   | `src, alt, caption, label?, ratio?`                        | Replaces `<PhotoBlock>`. Renders `<figure>` with image and mono caption. |
| `Tag.svelte`     | `children`                                                 | Pill-shaped mono label, 1px `--rule` border, 99px radius.|
| `Footer.svelte`  | `left, right`                                              | Mono 11 uppercase footer line.                           |

A `tokens.css` (or `app.css`) exports the colour and font variables; everything
else can be local scoped Svelte CSS.

---

## State management

The site is mostly static. Real state only appears in:

- **Photography**: filter (active filter pill), and visible-count (for "load
  more"). Both can live in `+page.svelte` as plain `$state` (Svelte 5) / `let`
  reactive variables (Svelte 4).
- **CV download**: not state, just an `<a download>` link.

No global stores needed. No data fetching unless you choose to drive photos
from a JSON file (recommended — `/static/photos.json` with `{ src, alt,
caption, label, place, date, tags, ratio }` per photo).

---

## Animations & motion

Minimal. The user explicitly asked for *subtle motion / scroll reveals*. Two
patterns:

1. **Fade-up on scroll** — each section's content (header + body) translates up
   ~12px and fades from opacity 0 → 1 over ~500ms with `cubic-bezier(.2, .7,
   .25, 1)` when it enters the viewport. Use `IntersectionObserver` with a
   small Svelte action — no library required. Trigger once, then unobserve.
2. **Header underline on hover** — nav links animate `text-underline-offset`
   from 6px → 4px on hover (120ms ease).

Avoid: page-load animations, large parallax, scroll-hijacking, marquees, or
anything that draws attention to itself.

---

## Responsive behaviour

The design is targeted at 1280px desktop. Breakpoints to handle:

- **≥ 1024px**: full layout exactly as documented.
- **768–1023px**: collapse the 120px left gutter — small `num` label sits
  *above* the section header instead of beside it. Reduce horizontal padding
  from 64 to 40. Hero H1 from 80 → 56. Two-column grids (About, Contact) stay
  two-column but with tighter gaps (40 instead of 80).
- **< 768px**: top nav collapses to a small drawer triggered by a mono "menu"
  text button on the right. All two-column grids collapse to single column.
  Hero H1 to 40–44px. Photography grid to 2 columns; CV experience date row
  stacks above the role.

---

## Assets

- **Fonts**: Switzer (Fontshare), JetBrains Mono (Google Fonts). Self-host both
  for production.
- **Photos**: **Placeholder only.** `design/placeholders.jsx`'s `PhotoBlock`
  draws a duotone gradient. In production, swap for real `<img>` tags. Plan for
  ~18 photos visible on first load on the gallery, with a list of ~52 total in
  the data file.
- **Icons**: none. The only iconic element is the green status dot on the top
  bar and the arrow glyphs (`→`, `↗`, `↓`) which are plain Unicode.
- **Logos / brand**: none. The name is the brand.

---

## Files in this bundle

```
design_handoff_portfolio/
├── README.md              ← this file
├── home.html              ← standalone preview of the Home page
├── gallery.html           ← standalone preview of the Photography page
├── cv.html                ← standalone preview of the CV page
└── design/
    ├── home.jsx           ← Home page React component (visual source of truth)
    ├── gallery.jsx        ← Photography page component
    ├── cv.jsx             ← CV page component
    └── placeholders.jsx   ← Photo placeholder helper (replace in Svelte)
```

Open the `.html` files directly in a browser to see each page rendered. The
`.jsx` files are the source of truth for every measurement and value — when in
doubt, grep them.

---

## Content notes

All copy in the design is real (drawn from the engineer's actual résumé). Any
field that should obviously change before launch:

- Email: currently `nsuprapt@uwaterloo.ca` — confirm whether to use this, a
  personal address, or the IBM address.
- GitHub / LinkedIn handles in the contact dl — placeholders, swap with real.
- Photo grid: all 24 thumbnails are placeholder duotones. Captions are
  fictional Toronto locations to demonstrate the rhythm.
- "52 photos · since 2023" counter — wire to the real count once a photo data
  file exists.

---

## Open questions for the developer

1. **Routing**: SvelteKit's file-router is the easiest. Confirm before
   wiring `+page.server.ts` data loaders.
2. **Resume PDF**: should be a real, hand-set print export of the CV page (not
   a separately maintained file). The simplest path is `window.print()` from
   the Download button with a print stylesheet — but a static PDF generated at
   build time (via Puppeteer / Playwright) is more reliable.
3. **Photo data source**: static JSON, a small CMS (e.g. Sanity, Notion-as-DB,
   or a plain GitHub-tracked folder), or a `@content-collections/core` setup?
4. **Deploy target**: Vercel / Netlify / Cloudflare Pages all work for
   SvelteKit. No backend needed.
