# Portfolio SvelteKit — Design Spec

**Date:** 2026-05-16  
**Source:** `design_handoff_portfolio/` (Claude Design handoff)  
**Target:** `com/` SvelteKit project deployed to Cloudflare Pages

---

## Overview

Recreate the three-page "Minimal Swiss" portfolio design as an idiomatic SvelteKit project. The design is pixel-close to the 1280px handoff canvas and scales gracefully to mobile. Content is centralised in a single TypeScript file so the site can be updated without touching any component or page markup.

---

## Design Tokens

Defined as CSS custom properties in `src/app.css` alongside `@import 'tailwindcss'`.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FBF7EF` | Page background (warm ivory) |
| `--paper` | `#FFFFFF` | Elevated surfaces, button text on dark |
| `--ink` | `#191917` | Primary text |
| `--ink-2` | `#6B675F` | Secondary text |
| `--ink-3` | `#A09B91` | Tertiary text, faded labels |
| `--accent` | `#1F70C1` | IBM Heritage Blue — used sparingly |
| `--rule` | `rgba(25,25,23,0.12)` | Dividers, hairline borders |
| `--rule-soft` | `rgba(25,25,23,0.06)` | Fainter dividers (skills table) |

**Fonts** (CDN for now, self-host later):
- Switzer (Fontshare) — body and headlines, weights 300–700
- JetBrains Mono (Google Fonts) — labels, metadata, tags, mono accents

---

## Architecture

```
com/src/
├── app.css                        # @import tailwindcss + CSS token definitions
├── lib/
│   ├── content.ts                 # Single source of truth for all site content
│   └── components/
│       ├── TopBar.svelte
│       ├── Section.svelte
│       ├── MetaField.svelte
│       ├── ProjectRow.svelte
│       ├── Tag.svelte
│       ├── Photo.svelte
│       └── Footer.svelte
└── routes/
    ├── +layout.svelte             # Font imports, CSS tokens, {children}
    ├── +page.svelte               # Home (/)
    ├── photography/
    │   ├── +page.ts               # load() — returns PHOTOS from content.ts (R2 seam)
    │   └── +page.svelte           # Gallery (/photography)
    └── cv/
        └── +page.svelte           # CV (/cv)
```

---

## Data Layer — `src/lib/content.ts`

Single file, all exports typed. No string literals anywhere else in the codebase.

### Types

```ts
export type Project = {
  no: string;
  title: string;
  client: string;
  year: string;
  blurb: string;
  tags: string[];
};

export type Experience = {
  yr: string;
  role: string;
  org: string;
  bullets: string[];
  stack: string[];
};

export type Education = {
  yr: string;
  org: string;
  description: string;
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type Photo = {
  id: string;        // e.g. "001"
  caption: string;   // e.g. "Kensington · 04·25"
  place: string;
  date: string;
  ratio: string;     // e.g. "4/5"
  tags: string[];    // e.g. ["Toronto", "Film"]
  src?: string;      // undefined until R2 is wired; Photo.svelte shows placeholder when absent
};
```

### Exports

```ts
export const IDENTITY: { name, role, org, location, email, github, linkedin, updated }
export const PROJECTS: Project[]
export const EXPERIENCE: Experience[]
export const EDUCATION: Education[]
export const SKILLS: SkillGroup[]
export const PHOTOS: Photo[]          // placeholder stubs — src field added later
export const SITE_META: { version, updatedLabel, photoCount, photosSince }
```

---

## Component Library

### `TopBar.svelte`
- Props: `active: 'index' | 'work' | 'photography' | 'cv' | 'contact'`, `right?: Snippet`
- Sticky, `z-index: 5`, bottom border `--rule`
- 3-column grid: `120px / 1fr / auto`, 24px gap, `24px 64px` padding
- Left: `idx · 2026` — mono 11px, ink-2, uppercase, 0.06em
- Centre: nav links — mono 12px, 32px gap. Active link = `--ink`, rest = `--ink-2`. Hover: underline with `text-underline-offset: 4px`, 120ms ease
- Right: `{@render right?.()}` snippet — caller provides contextual content
- Mobile (< 768px): centre nav collapses; right slot replaced with a `menu` text toggle (`$state` boolean) that shows/hides the nav links as a dropdown

### `Section.svelte`
- Props: `num: string`, `label: string`, `topPad?: string` (default `'88px'`)
- Encodes the core structural rhythm: `display: grid; grid-template-columns: 120px 1fr; gap: 24px`
- Header row: num label (mono 11, ink-2, uppercase) beside h2 (Switzer 500 22px, ink, -0.01em)
- Content row: same grid, num column is empty spacer, content in right column
- `<slot>` / `{@render children()}` fills the content column
- Mobile (< 768px): single column; num label sits above h2

### `MetaField.svelte`
- Props: `label: string`, `value: string`
- Mono 12px uppercase, 0.06em. Label in `--ink-3`, value in `--ink`, 6px vertical gap

### `ProjectRow.svelte`
- Props: `project: Project`
- 4-column grid: `60px / 1fr / 1fr / auto`, 32px gap, `32px 0` padding
- Top border `--rule`; last row additionally gets bottom border (handled by parent via `:last-child`)
- Hover: `background: rgba(0,0,0,0.02)`, `cursor: pointer`
- Columns: number (mono 11, uppercase) · title + client/year subline · blurb · `<Tag>` pill row

### `Tag.svelte`
- Props: `label: string`
- Mono 11px, `--ink-2`, `4px 8px` padding, `1px solid --rule` border, `border-radius: 99px`

### `Photo.svelte`
- Props: `photo: Photo`
- Renders `<figure>` with aspect-ratio set from `photo.ratio`
- When `photo.src` is absent: coloured placeholder block (duotone gradient keyed to `photo.id`)
- When `photo.src` present: `<img>` with `object-fit: cover`
- Caption below: mono 11px, ink-2 — left: `photo.caption`, right: `#${photo.id}`

### `Footer.svelte`
- Props: `left?: string`, `right?: string` — override `SITE_META` defaults when provided
- Reads `SITE_META` for defaults: left = `© 2026 — built by hand`, right = `v {version} · last updated {updatedLabel}`
- Gallery overrides both: left = `← back to index`, right = `{photoCount} photos · updated {updatedLabel}`
- Mono 11px, ink-3, uppercase, 0.06em, `32px 64px` padding, flex space-between

---

## Routes

### `/` — Home (`+page.svelte`)

Sections in order:

1. `<TopBar active="index">` — right slot: green dot + `Toronto · live`
2. **Hero** — `padding: 160px 64px 140px`. Gutter grid with `00 / intro` label. H1 80px/500/-0.03em: name in `--ink-3`, tagline in `--ink`, `Toronto.` in `--accent`. Metadata row: four `<MetaField>` components in a flex row, 56px gap, 72px below H1
3. Hairline rule (`margin: 0 64px`)
4. `<Section num="01" label="About">` — 2-col grid 1.1fr/1fr, 80px gap: primary paragraph (22px/400/1.5/-0.005em) + secondary paragraph (16px/400/1.65, ink-2) left; `<Photo>` right (4/5 ratio, portrait placeholder)
5. `<Section num="02" label="Selected work" topPad="120px">` — `{#each PROJECTS as project}<ProjectRow {project} />{/each}`
6. `<Section num="03" label="Photography" topPad="120px">` — intro paragraph + `view all (52) →` link; 4-column photo grid with first 4 `PHOTOS`
7. `<Section num="04" label="Contact" topPad="120px">` — 2-col grid: left has 36px statement + email outline button; right has `<dl>` with GITHUB, LINKEDIN, RESUME, LOCATION from `IDENTITY`
8. Hairline rule
9. `<Footer />`

### `/photography` — Gallery

- `+page.ts` `load()`: returns `{ photos: PHOTOS }` — this is the seam for R2. Replacing the import with a `fetch()` to an R2-backed API changes nothing in the page component
- `+page.svelte`:
  - `<TopBar active="photography">` — right slot: `52 photos · since 2023` from `SITE_META`
  - Title block: `03 / photography` gutter, H1 48px/500/-0.025em with accent period, filter pill row
  - Filter state: `let activeFilter = $state('All')` — filters `photos` array by `photo.tags`
  - Grid: 3-column masonry-ish layout — photos striped across columns with `display: flex; flex-direction: column; gap: 24px` per column
  - Load more: `let visible = $state(18)` — slice `filteredPhotos` to `visible`. Button increments by 18
  - Faded preview: 3-photo strip below load-more button with `mask-image: linear-gradient(180deg, black 0%, transparent 90%)`
  - `<Footer>` (left: `← back to index`, right: photo count from `SITE_META`)

### `/cv` — Curriculum Vitae

- `<TopBar active="cv">` — right slot: dark `Download · pdf ↓` button (`<a href="/resume.pdf" download>`)
- Title block: `04 / cv` gutter, H1 56px `Curriculum vitae.` (accent period), identity row of `<MetaField>` components
- Hairline rule
- Experience section: `{#each EXPERIENCE as e}` — each item is a `180px/1fr` grid, date left, role/org/bullets/stack right. Bullet em-dash in `--accent`
- Skills section: 2-col grid of skill groups; each row has top `--rule-soft` border, 160px/1fr inner grid
- Education section: same pattern as experience
- Colophon: references note left + `Download résumé · pdf ↓` button (`<a href="/resume.pdf" download>`) right

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `lg` (≥ 1024px) | Full layout as designed |
| `md` (768–1023px) | Section gutter collapses to stacked. Padding 64px → 40px. Hero H1 80px → 56px. About/Contact grids: gaps tighten to 40px |
| `< md` (< 768px) | TopBar nav collapses to `menu` toggle. All 2-col grids → 1 col. Hero H1 → 40px. Photography grid → 2 cols. CV experience date stacks above role |

---

## Interactions & Motion

- **Scroll reveal:** `use:fadeUp` Svelte action using `IntersectionObserver`. Each `<Section>` gets the action. On enter: `opacity 0→1`, `translateY 12px→0`, 500ms `cubic-bezier(.2,.7,.25,1)`. Triggers once, then unobserves.
- **Nav hover:** `text-decoration-line: underline`, `text-underline-offset: 4px`, `text-decoration-thickness: 1px`, 120ms ease
- **Project row hover:** `background: rgba(0,0,0,0.02)`
- **Filter pills:** active = `--ink` bg + `--paper` text; inactive = transparent + `--ink-2` text + `--rule` border

---

## What Is Not In Scope

- R2 photo integration (placeholder stubs only; load seam is in place)
- Per-project case study pages (project rows are non-linking for now)
- Photo lightbox
- Self-hosted fonts (CDN links for now)
- Print stylesheet for CV (PDF is a static file)
