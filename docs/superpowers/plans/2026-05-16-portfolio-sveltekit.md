# Portfolio SvelteKit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate the Minimal Swiss design handoff into a production SvelteKit project with three routes (Home, Gallery, CV), a centralised content data layer, and seven focused shared components.

**Architecture:** All site content lives in `src/lib/content.ts` and is imported by components and pages — no string literals elsewhere. Shared components encode structural patterns (gutter grid, section header, TopBar) once. Pages are thin compositions. Tailwind handles layout utilities; CSS custom properties (registered via `@theme`) handle design tokens; scoped `<style>` blocks handle complex grid/responsive patterns.

**Tech Stack:** SvelteKit 2, Svelte 5, Tailwind CSS v4, TypeScript, Vitest + @testing-library/svelte, Cloudflare Pages adapter

---

## File Map

```
com/src/
├── app.css                                  MODIFY  — add @theme tokens, font vars, base styles
├── tests/
│   ├── setup.ts                             CREATE  — @testing-library/jest-dom setup
│   ├── content.test.ts                      CREATE  — validates content.ts shape
│   └── photos.test.ts                       CREATE  — tests filterPhotos, photoColumns, paginatePhotos
├── lib/
│   ├── content.ts                           CREATE  — all site content (replaces Navbar.svelte + Icon.svelte)
│   ├── utils/
│   │   └── photos.ts                        CREATE  — filterPhotos, photoColumns, paginatePhotos
│   ├── actions/
│   │   └── fadeUp.ts                        CREATE  — IntersectionObserver scroll-reveal action
│   └── components/
│       ├── TopBar.svelte                    CREATE
│       ├── Section.svelte                   CREATE
│       ├── MetaField.svelte                 CREATE
│       ├── Tag.svelte                       CREATE
│       ├── Photo.svelte                     CREATE
│       ├── ProjectRow.svelte                CREATE
│       └── Footer.svelte                    CREATE
├── routes/
│   ├── +layout.svelte                       MODIFY  — strip old code, add fonts
│   ├── +page.svelte                         MODIFY  — Home page
│   ├── photography/
│   │   ├── +page.ts                         CREATE  — load() returning PHOTOS (R2 seam)
│   │   └── +page.svelte                     CREATE  — Gallery page
│   └── cv/
│       └── +page.svelte                     CREATE  — CV page
```

**Files to delete:** `src/lib/Navbar.svelte`, `src/lib/Icon.svelte`

---

## Task 1: Test infrastructure & strip old code

**Files:**
- Modify: `com/vite.config.ts`
- Create: `com/src/tests/setup.ts`
- Delete: `com/src/lib/Navbar.svelte`, `com/src/lib/Icon.svelte`
- Modify: `com/src/routes/+layout.svelte` (remove old imports)
- Modify: `com/package.json` (add test script)

- [ ] **Step 1: Install test dependencies**

```bash
cd com && npm install -D vitest jsdom @testing-library/svelte @testing-library/jest-dom
```

Expected: installs without errors, `node_modules/vitest` present.

- [ ] **Step 2: Add vitest config to vite.config.ts**

Full file replacement:

```ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    globals: true,
  },
});
```

- [ ] **Step 3: Add test script to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create test setup file**

```ts
// src/tests/setup.ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Delete old components**

```bash
rm com/src/lib/Navbar.svelte com/src/lib/Icon.svelte
```

- [ ] **Step 6: Strip +layout.svelte to a blank shell**

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>

{@render children()}
```

- [ ] **Step 7: Stub +page.svelte so the app still loads**

```svelte
<!-- src/routes/+page.svelte -->
<p>coming soon</p>
```

- [ ] **Step 8: Verify dev server starts**

```bash
cd com && npm run dev
```

Expected: no import errors, page loads with "coming soon".

- [ ] **Step 9: Commit**

```bash
cd com && git add -A && git commit -m "chore: set up vitest, strip old navbar/icon components"
```

---

## Task 2: CSS design tokens & layout foundation

**Files:**
- Modify: `com/src/app.css`
- Modify: `com/src/routes/+layout.svelte`

- [ ] **Step 1: Update app.css with @theme tokens and base styles**

```css
/* src/app.css */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  --color-bg: #fbf7ef;
  --color-paper: #ffffff;
  --color-ink: #191917;
  --color-ink-2: #6b675f;
  --color-ink-3: #a09b91;
  --color-accent: #1f70c1;
  --color-rule: rgba(25, 25, 23, 0.12);
  --color-rule-soft: rgba(25, 25, 23, 0.06);

  --font-sans: 'Switzer', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background-color: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

body {
  margin: 0;
  min-height: 100vh;
}

a {
  color: inherit;
}
```

- [ ] **Step 2: Update +layout.svelte with font imports**

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://api.fontshare.com" />
  <link
    href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap"
    rel="stylesheet"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}
```

- [ ] **Step 3: Verify fonts load in browser**

```bash
cd com && npm run dev
```

Open http://localhost:5173 — open DevTools → Network → filter by "font". Expect Switzer and JetBrains Mono requests.

- [ ] **Step 4: Commit**

```bash
cd com && git add src/app.css src/routes/+layout.svelte && git commit -m "feat: add design tokens via @theme and font imports"
```

---

## Task 3: Content data layer

**Files:**
- Create: `com/src/lib/content.ts`
- Create: `com/src/tests/content.test.ts`

- [ ] **Step 1: Write the failing content test**

```ts
// src/tests/content.test.ts
import { describe, it, expect } from 'vitest';
import {
  IDENTITY,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  PHOTOS,
  SITE_META,
} from '$lib/content';

describe('IDENTITY', () => {
  it('has all required fields', () => {
    expect(IDENTITY.name).toBeTruthy();
    expect(IDENTITY.email).toBeTruthy();
    expect(IDENTITY.github).toBeTruthy();
    expect(IDENTITY.linkedin).toBeTruthy();
    expect(IDENTITY.location).toBeTruthy();
    expect(IDENTITY.role).toBeTruthy();
    expect(IDENTITY.org).toBeTruthy();
    expect(IDENTITY.updated).toBeTruthy();
  });
});

describe('PROJECTS', () => {
  it('is non-empty', () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });
  it('each project has required fields', () => {
    for (const p of PROJECTS) {
      expect(p.no).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.client).toBeTruthy();
      expect(p.year).toBeTruthy();
      expect(p.blurb).toBeTruthy();
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });
});

describe('EXPERIENCE', () => {
  it('is non-empty', () => {
    expect(EXPERIENCE.length).toBeGreaterThan(0);
  });
  it('each entry has bullets and stack', () => {
    for (const e of EXPERIENCE) {
      expect(e.bullets.length).toBeGreaterThan(0);
      expect(e.stack.length).toBeGreaterThan(0);
    }
  });
});

describe('SKILLS', () => {
  it('has at least 4 groups', () => {
    expect(SKILLS.length).toBeGreaterThanOrEqual(4);
  });
  it('each group has items', () => {
    for (const s of SKILLS) {
      expect(s.items.length).toBeGreaterThan(0);
    }
  });
});

describe('PHOTOS', () => {
  it('is non-empty', () => {
    expect(PHOTOS.length).toBeGreaterThan(0);
  });
  it('each photo has a valid ratio', () => {
    const validRatios = ['4/5', '3/4', '1/1', '4/3'];
    for (const p of PHOTOS) {
      expect(validRatios).toContain(p.ratio);
    }
  });
  it('each photo has a unique id', () => {
    const ids = PHOTOS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('SITE_META', () => {
  it('has photoCount and version', () => {
    expect(SITE_META.photoCount).toBeGreaterThan(0);
    expect(SITE_META.version).toBeTruthy();
    expect(SITE_META.updatedLabel).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests — expect failure (module not found)**

```bash
cd com && npm test
```

Expected: FAIL — `Cannot find module '$lib/content'`.

- [ ] **Step 3: Create content.ts**

```ts
// src/lib/content.ts

// ── Types ────────────────────────────────────────────────────────────────────

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
  id: string;     // zero-padded, e.g. "001"
  caption: string;
  place: string;
  date: string;
  ratio: '4/5' | '3/4' | '1/1' | '4/3';
  tags: string[];
  src?: string;   // undefined until R2 is wired; Photo.svelte shows placeholder when absent
};

export type Identity = {
  name: string;
  role: string;
  org: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  updated: string;
};

export type SiteMeta = {
  version: string;
  updatedLabel: string;
  photoCount: number;
  photosSince: number;
};

// ── Identity ─────────────────────────────────────────────────────────────────

export const IDENTITY: Identity = {
  name: 'Nicholaus Suprapto',
  role: 'Associate DevOps Engineer · IBM',
  org: 'IBM Payments Center',
  location: 'Toronto, ON',
  email: 'nsuprapt@uwaterloo.ca',
  github: 'github.com/ininicho',
  linkedin: 'in/nicholaus-suprapto',
  updated: 'May 2026',
};

// ── Projects (Home — Selected Work) ──────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    no: '01',
    year: 'Aug 2025 — present',
    client: 'Payments Canada · via IBM',
    title: 'Real-Time Rail · Platform team',
    blurb:
      "Platform & DevOps work on Canada's first national real-time payment system. ArgoCD multi-cluster GitOps, Istio service mesh, Vault PKI, AMQ broker federation.",
    tags: ['OpenShift', 'ArgoCD', 'Istio', 'Vault', 'F5'],
  },
  {
    no: '02',
    year: 'Jul — Aug 2025',
    client: 'IBM Wires Services · via Expertus',
    title: 'Release management remediation',
    blurb:
      'Re-designed the release management strategy for the Wires Services team — safer rollbacks, fewer surprises during deploys.',
    tags: ['CI/CD', 'Release Mgmt'],
  },
  {
    no: '03',
    year: 'Jan 2025 — Jul 2025',
    client: 'IBM Payments Center',
    title: 'Cloud platform engineering',
    blurb:
      'Migrated 800+ Docker images from JFrog to IBM Cloud Container Registry. Provisioned EKS add-ons via Terraform; built CloudWatch → Instana alerting.',
    tags: ['Terraform', 'AWS', 'EKS', 'IBM Cloud'],
  },
];

// ── Experience (CV) ───────────────────────────────────────────────────────────

export const EXPERIENCE: Experience[] = [
  {
    yr: 'Aug 2025 — present',
    role: 'DevOps Engineer · Payments Canada (RTR)',
    org: 'IBM Payments Center · embedded with Payments Canada',
    bullets: [
      'Refactored ArgoCD repositories to support multi-cluster environments — robust GitOps workflow for application delivery.',
      'Standardized CI/CD pipelines for application teams with automated health checks and smoke tests.',
      'Deployed ActiveMQ Broker on OpenShift with queue federation and mirroring for cross-site message persistence.',
      'Engineered zero-trust micro-segmentation with OpenShift Network Policies; integrated Vault for PKI + TLS lifecycle.',
      'Deployed Istio service mesh; designed F5 BIG-IP VIPs and automated fallback health monitors; orchestrated Kong Gateway.',
    ],
    stack: ['OpenShift', 'ArgoCD', 'Istio', 'Vault', 'F5 BIG-IP', 'AMQ', 'CockroachDB', 'Kong'],
  },
  {
    yr: 'Jul — Aug 2025',
    role: 'DevOps Engineer · Release Mgmt Remediation',
    org: 'IBM Wires Services (via Expertus Technologies)',
    bullets: [
      'Helped design and implement a new release management strategy enabling safe rollbacks during new releases.',
    ],
    stack: ['CI/CD', 'Release Mgmt'],
  },
  {
    yr: 'Jan — Jul 2025',
    role: 'Cloud Engineer · Associate DevOps',
    org: 'IBM Payments Center',
    bullets: [
      'Migrated 800+ Docker images from JFrog to IBM Cloud Container Registry, streamlining image management.',
      'Provisioned EKS add-ons using Terraform to enhance existing Kubernetes clusters.',
      'Developed a CloudWatch-based log monitoring system to detect critical patterns and trigger Instana alerts.',
      'Enabled ELB access logs and implemented S3 cross-region replication for DR + compliance.',
    ],
    stack: ['Terraform', 'AWS', 'EKS', 'IBM Cloud', 'CloudWatch', 'Instana'],
  },
  {
    yr: 'May — Aug 2024',
    role: 'Cloud Engineer Intern',
    org: 'IBM Payments Center',
    bullets: [
      'Automated IBM Cloud Toolchain provisioning with Terraform — 80% reduction in setup time.',
      'Built CI/CD pipelines for Terraform projects using IBM Toolchain.',
      'Migrated Terraform CI/CD from Jenkins to IBM Toolchain — 20%+ faster deployments.',
      'Implemented SPbD by integrating Mend (WhiteSource) for automated code compliance + security checks.',
    ],
    stack: ['Terraform', 'IBM Toolchain', 'Jenkins', 'Mend'],
  },
  {
    yr: 'Sep — Dec 2023',
    role: 'Cloud Engineer · Platform Architecture',
    org: 'Manulife Global',
    bullets: [
      'Implemented Azure Blob Storage lifecycle policies, cutting access costs by 20%+.',
      'Built Azure Functions for credential rotation and Health Alerts → MS Teams forwarding.',
      'Led PoC for an internal chatbot using Azure OpenAI + RAG architecture for secure internal knowledge retrieval.',
    ],
    stack: ['Azure', 'Azure Functions', 'OpenAI', 'LangChain'],
  },
  {
    yr: 'May — Aug 2023',
    role: 'Software Developer',
    org: 'Rhetoricon Research · University of Waterloo',
    bullets: [
      'Migrated MySQL → PostgreSQL; tuned queries for faster search and response times.',
      'Integrated Redis caching for Zotero API calls; built admin frontend with client-side rendering + lazy fetch.',
    ],
    stack: ['PostgreSQL', 'Redis', 'JavaScript'],
  },
  {
    yr: 'Jan — Apr 2023',
    role: 'Cloud Engineer · Infrastructure',
    org: 'State Street Corporation',
    bullets: [
      'Built OpenSearch dashboards for node health + log ingestion observability.',
      'Designed pipelines streaming logs from S3, CloudWatch and CloudTrail into OpenSearch via Lambda.',
      'Integrated Kinesis to cut Lambda invocation costs by 10%; tuned Lambda for −20% tail latency.',
    ],
    stack: ['AWS', 'OpenSearch', 'Lambda', 'Kinesis', 'SQS'],
  },
  {
    yr: 'May — Aug 2022',
    role: 'Software Developer · Fullstack',
    org: 'FarmLink Marketing Solutions',
    bullets: [
      'Refactored frontend onto standardized Vuetify components; configured Vite + code-splitting — load times −26%, bundle −72%.',
      'Optimized Django ORM queries with lazy loading; Dockerized the app into microservices.',
    ],
    stack: ['Vue.js', 'Django', 'Vite', 'Docker'],
  },
];

// ── Education (CV) ────────────────────────────────────────────────────────────

export const EDUCATION: Education[] = [
  {
    yr: '2020 — 2025',
    org: 'BCS, Data Science · University of Waterloo',
    description:
      "Dean's Honours List. Coursework in distributed systems, networks, machine learning, algorithms and data structures.",
  },
];

// ── Skills (CV) ───────────────────────────────────────────────────────────────

export const SKILLS: SkillGroup[] = [
  { group: 'Containers / Orchestration', items: ['OpenShift', 'Kubernetes', 'Helm', 'ArgoCD (GitOps)'] },
  { group: 'IaC & Automation', items: ['Terraform', 'CloudFormation', 'Ansible', 'Jenkins'] },
  { group: 'Cloud platforms', items: ['AWS', 'Azure', 'IBM Cloud'] },
  { group: 'Networking & Security', items: ['Istio service mesh', 'F5 BIG-IP (LTM/GTM)', 'HashiCorp Vault (PKI/Secrets)'] },
  { group: 'Data & Middleware', items: ['ActiveMQ Broker', 'CockroachDB', 'EDB Postgres', 'Kong Gateway', 'Redis'] },
  { group: 'Languages', items: ['Python', 'Golang', 'C / C++', 'Bash', 'JavaScript', 'SQL'] },
];

// ── Photos (Gallery + Home preview) ──────────────────────────────────────────
// src is intentionally absent — Photo.svelte shows a placeholder swatch.
// Add src: 'https://<r2-bucket>/<key>' once R2 is wired.

export const PHOTOS: Photo[] = [
  { id: '001', caption: 'Kensington · 05·25', place: 'Kensington', date: '05·25', ratio: '4/5', tags: ['Toronto'] },
  { id: '002', caption: 'Spadina · 04·25', place: 'Spadina', date: '04·25', ratio: '3/4', tags: ['Toronto'] },
  { id: '003', caption: 'Union · 04·25', place: 'Union', date: '04·25', ratio: '1/1', tags: ['Toronto'] },
  { id: '004', caption: 'Don Valley · 03·25', place: 'Don Valley', date: '03·25', ratio: '4/3', tags: ['Toronto'] },
  { id: '005', caption: 'Bellwoods · 03·25', place: 'Bellwoods', date: '03·25', ratio: '3/4', tags: ['Toronto'] },
  { id: '006', caption: 'Lakeshore · 02·25', place: 'Lakeshore', date: '02·25', ratio: '4/5', tags: ['Toronto'] },
  { id: '007', caption: 'Annex · 01·25', place: 'Annex', date: '01·25', ratio: '1/1', tags: ['Toronto'] },
  { id: '008', caption: 'Distillery · 12·24', place: 'Distillery', date: '12·24', ratio: '3/4', tags: ['Toronto'] },
  { id: '009', caption: 'Roncesvalles · 11·24', place: 'Roncesvalles', date: '11·24', ratio: '4/5', tags: ['Toronto'] },
  { id: '010', caption: 'Kensington · 11·24', place: 'Kensington', date: '11·24', ratio: '4/3', tags: ['Toronto', 'Film'] },
  { id: '011', caption: 'Spadina · 10·24', place: 'Spadina', date: '10·24', ratio: '3/4', tags: ['Toronto', 'Film'] },
  { id: '012', caption: 'Bellwoods · 09·24', place: 'Bellwoods', date: '09·24', ratio: '4/5', tags: ['Toronto'] },
  { id: '013', caption: 'Don Valley · 08·24', place: 'Don Valley', date: '08·24', ratio: '1/1', tags: ['Toronto'] },
  { id: '014', caption: 'Lakeshore · 07·24', place: 'Lakeshore', date: '07·24', ratio: '4/5', tags: ['Toronto', 'Digital'] },
  { id: '015', caption: 'Annex · 06·24', place: 'Annex', date: '06·24', ratio: '3/4', tags: ['Toronto'] },
  { id: '016', caption: 'Union · 05·24', place: 'Union', date: '05·24', ratio: '4/3', tags: ['Toronto', 'Film'] },
  { id: '017', caption: 'Roncesvalles · 04·24', place: 'Roncesvalles', date: '04·24', ratio: '4/5', tags: ['Toronto'] },
  { id: '018', caption: 'Distillery · 03·24', place: 'Distillery', date: '03·24', ratio: '3/4', tags: ['Toronto'] },
  { id: '019', caption: 'Montreal · 02·24', place: 'Montreal', date: '02·24', ratio: '4/5', tags: ['Travel'] },
  { id: '020', caption: 'Montreal · 02·24', place: 'Montreal', date: '02·24', ratio: '3/4', tags: ['Travel'] },
  { id: '021', caption: 'Vancouver · 01·24', place: 'Vancouver', date: '01·24', ratio: '1/1', tags: ['Travel'] },
  { id: '022', caption: 'Vancouver · 01·24', place: 'Vancouver', date: '01·24', ratio: '4/5', tags: ['Travel', 'Film'] },
];

// ── Site meta ─────────────────────────────────────────────────────────────────

export const SITE_META: SiteMeta = {
  version: '1.0',
  updatedLabel: 'may 2026',
  photoCount: 52,
  photosSince: 2023,
};
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd com && npm test
```

Expected: all content tests PASS.

- [ ] **Step 5: Commit**

```bash
cd com && git add src/lib/content.ts src/tests/content.test.ts && git commit -m "feat: add centralised content data layer"
```

---

## Task 4: Photo utility functions

**Files:**
- Create: `com/src/lib/utils/photos.ts`
- Create: `com/src/tests/photos.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/tests/photos.test.ts
import { describe, it, expect } from 'vitest';
import { filterPhotos, photoColumns, paginatePhotos } from '$lib/utils/photos';
import type { Photo } from '$lib/content';

const mock: Photo[] = [
  { id: '001', caption: 'A', place: 'Kensington', date: '01·25', ratio: '4/5', tags: ['Toronto'] },
  { id: '002', caption: 'B', place: 'Montreal',   date: '02·25', ratio: '3/4', tags: ['Travel'] },
  { id: '003', caption: 'C', place: 'Kensington', date: '03·25', ratio: '1/1', tags: ['Toronto', 'Film'] },
  { id: '004', caption: 'D', place: 'Vancouver',  date: '04·25', ratio: '4/3', tags: ['Travel', 'Film'] },
  { id: '005', caption: 'E', place: 'Annex',      date: '05·25', ratio: '4/5', tags: ['Toronto', 'Digital'] },
];

describe('filterPhotos', () => {
  it('returns all photos when filter is "All"', () => {
    expect(filterPhotos(mock, 'All')).toHaveLength(5);
  });

  it('filters by a single tag', () => {
    const result = filterPhotos(mock, 'Toronto');
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.tags.includes('Toronto'))).toBe(true);
  });

  it('returns photos that have the tag among multiple tags', () => {
    expect(filterPhotos(mock, 'Film')).toHaveLength(2);
  });

  it('returns empty array when no photos match', () => {
    expect(filterPhotos(mock, 'Street')).toHaveLength(0);
  });
});

describe('paginatePhotos', () => {
  it('slices to visible count', () => {
    expect(paginatePhotos(mock, 3)).toHaveLength(3);
  });

  it('returns all when visible >= length', () => {
    expect(paginatePhotos(mock, 100)).toHaveLength(5);
  });
});

describe('photoColumns', () => {
  it('distributes photos across N columns in stripe order', () => {
    const cols = photoColumns(mock, 3);
    expect(cols).toHaveLength(3);
    expect(cols[0][0].id).toBe('001');
    expect(cols[1][0].id).toBe('002');
    expect(cols[2][0].id).toBe('003');
    expect(cols[0][1].id).toBe('004');
    expect(cols[1][1].id).toBe('005');
  });

  it('handles fewer photos than columns', () => {
    const cols = photoColumns(mock.slice(0, 2), 3);
    expect(cols[0]).toHaveLength(1);
    expect(cols[1]).toHaveLength(1);
    expect(cols[2]).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
cd com && npm test src/tests/photos.test.ts
```

Expected: FAIL — `Cannot find module '$lib/utils/photos'`.

- [ ] **Step 3: Create photos.ts**

```ts
// src/lib/utils/photos.ts
import type { Photo } from '$lib/content';

/** Returns all photos if filter is 'All', otherwise filters by tag membership. */
export function filterPhotos(photos: Photo[], filter: string): Photo[] {
  if (filter === 'All') return photos;
  return photos.filter((p) => p.tags.includes(filter));
}

/** Returns the first `visible` photos. */
export function paginatePhotos(photos: Photo[], visible: number): Photo[] {
  return photos.slice(0, visible);
}

/**
 * Stripes photos across `cols` columns for a masonry-ish layout.
 * photo[0] → col[0], photo[1] → col[1], …, photo[cols] → col[0], …
 */
export function photoColumns(photos: Photo[], cols: number): Photo[][] {
  const columns: Photo[][] = Array.from({ length: cols }, () => []);
  photos.forEach((p, i) => columns[i % cols].push(p));
  return columns;
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
cd com && npm test
```

Expected: all 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd com && git add src/lib/utils/photos.ts src/tests/photos.test.ts && git commit -m "feat: add photo filter/paginate/column utilities with tests"
```

---

## Task 5: TopBar component

**Files:**
- Create: `com/src/lib/components/TopBar.svelte`

- [ ] **Step 1: Create TopBar.svelte**

```svelte
<!-- src/lib/components/TopBar.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type ActivePage = 'index' | 'work' | 'photography' | 'cv' | 'contact';

  let {
    active,
    right,
  }: {
    active: ActivePage;
    right?: Snippet;
  } = $props();

  let menuOpen = $state(false);

  const navLinks = [
    { key: 'index' as ActivePage,       label: 'index',       href: '/' },
    { key: 'work' as ActivePage,        label: 'work',        href: '/#work' },
    { key: 'photography' as ActivePage, label: 'photography', href: '/photography' },
    { key: 'cv' as ActivePage,          label: 'cv',          href: '/cv' },
    { key: 'contact' as ActivePage,     label: 'contact',     href: '/#contact' },
  ];
</script>

<header class="topbar">
  <div class="topbar-inner">
    <!-- Left: idx label -->
    <span class="idx-label">idx · 2026</span>

    <!-- Centre: desktop nav -->
    <nav class="desktop-nav">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={active === link.key}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <!-- Centre: mobile menu toggle -->
    <button class="menu-toggle" onclick={() => (menuOpen = !menuOpen)}>
      {menuOpen ? 'close' : 'menu'}
    </button>

    <!-- Right slot -->
    <div class="right-slot">
      {@render right?.()}
    </div>
  </div>

  <!-- Mobile dropdown nav -->
  {#if menuOpen}
    <nav class="mobile-nav">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:active={active === link.key}
          onclick={() => (menuOpen = false)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  {/if}
</header>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-rule);
  }

  .topbar-inner {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    padding: 24px 64px;
    align-items: center;
  }

  .idx-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
  }

  .desktop-nav {
    display: flex;
    gap: 32px;
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .menu-toggle {
    display: none;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .nav-link {
    color: var(--color-ink-2);
    text-decoration: none;
    transition: text-underline-offset 120ms ease;
  }

  .nav-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 1px;
  }

  .nav-link.active {
    color: var(--color-ink);
  }

  .right-slot {
    display: flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink-2);
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 64px 20px;
    font-family: var(--font-mono);
    font-size: 12px;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .topbar-inner {
      grid-template-columns: 1fr auto auto;
      padding: 20px 40px;
      gap: 16px;
    }

    .idx-label {
      display: none;
    }

    .desktop-nav {
      display: none;
    }

    .menu-toggle {
      display: block;
    }

    .mobile-nav {
      padding: 0 40px 20px;
    }
  }
</style>
```

- [ ] **Step 2: Wire TopBar into Home page temporarily to verify it renders**

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
</script>

<TopBar active="index">
  {#snippet right()}
    <span style="display:flex;align-items:center;gap:10px;">
      <span style="width:6px;height:6px;border-radius:99px;background:#3a8a5a;display:inline-block;"></span>
      Toronto · live
    </span>
  {/snippet}
</TopBar>

<p style="padding:40px 64px;">coming soon</p>
```

- [ ] **Step 3: Verify in browser**

```bash
cd com && npm run dev
```

Open http://localhost:5173 — TopBar should appear sticky at top with all five nav links. On narrow window (< 768px) the nav should collapse and show a "menu" button. Clicking "menu" should toggle the nav dropdown.

- [ ] **Step 4: Commit**

```bash
cd com && git add src/lib/components/TopBar.svelte src/routes/+page.svelte && git commit -m "feat: add TopBar component with sticky nav and mobile menu"
```

---

## Task 6: Section, MetaField, and Tag components

**Files:**
- Create: `com/src/lib/components/Section.svelte`
- Create: `com/src/lib/components/MetaField.svelte`
- Create: `com/src/lib/components/Tag.svelte`

- [ ] **Step 1: Create Section.svelte**

Section encodes the 120px gutter pattern used on every section of every page.

```svelte
<!-- src/lib/components/Section.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    num,
    label,
    topPad = '88px',
    children,
  }: {
    num: string;
    label: string;
    topPad?: string;
    children: Snippet;
  } = $props();
</script>

<section style:padding-top={topPad} class="section">
  <header class="section-header">
    <span class="section-num">{num}</span>
    <h2 class="section-label">{label}</h2>
  </header>
  <div class="section-body">
    <div class="section-gutter" aria-hidden="true"></div>
    <div class="section-content">
      {@render children()}
    </div>
  </div>
</section>

<style>
  .section {
    padding-right: 64px;
    padding-bottom: 0;
    padding-left: 64px;
  }

  .section-header {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    margin-bottom: 56px;
    align-items: baseline;
  }

  .section-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 4px;
  }

  .section-label {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  .section-body {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }

  /* Responsive */
  @media (max-width: 767px) {
    .section {
      padding-right: 40px;
      padding-left: 40px;
    }

    .section-header {
      display: block;
      margin-bottom: 24px;
    }

    .section-num {
      display: block;
      margin-bottom: 8px;
    }

    .section-body {
      display: block;
    }

    .section-gutter {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .section {
      padding-right: 40px;
      padding-left: 40px;
    }
  }
</style>
```

- [ ] **Step 2: Create MetaField.svelte**

```svelte
<!-- src/lib/components/MetaField.svelte -->
<script lang="ts">
  let { label, value }: { label: string; value: string } = $props();
</script>

<div class="meta-field">
  <span class="meta-label">{label}</span>
  <span class="meta-value">{value}</span>
</div>

<style>
  .meta-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .meta-label {
    color: var(--color-ink-3);
  }

  .meta-value {
    color: var(--color-ink);
  }
</style>
```

- [ ] **Step 3: Create Tag.svelte**

```svelte
<!-- src/lib/components/Tag.svelte -->
<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<span class="tag">{label}</span>

<style>
  .tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--color-ink-2);
    padding: 4px 8px;
    border: 1px solid var(--color-rule);
    border-radius: 99px;
    white-space: nowrap;
  }
</style>
```

- [ ] **Step 4: Verify components render in the dev page**

Update `src/routes/+page.svelte` temporarily:

```svelte
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import Section from '$lib/components/Section.svelte';
  import MetaField from '$lib/components/MetaField.svelte';
  import Tag from '$lib/components/Tag.svelte';
</script>

<TopBar active="index">
  {#snippet right()}
    <span>Toronto · live</span>
  {/snippet}
</TopBar>

<Section num="01" label="Test section">
  <MetaField label="Role" value="Associate DevOps" />
  <div style="margin-top:16px;display:flex;gap:8px;">
    <Tag label="OpenShift" />
    <Tag label="ArgoCD" />
  </div>
</Section>
```

Open http://localhost:5173 — confirm the 120px gutter layout, mono label, section header, meta field, and tags all display correctly.

- [ ] **Step 5: Commit**

```bash
cd com && git add src/lib/components/Section.svelte src/lib/components/MetaField.svelte src/lib/components/Tag.svelte && git commit -m "feat: add Section, MetaField, and Tag components"
```

---

## Task 7: Photo, ProjectRow, and Footer components

**Files:**
- Create: `com/src/lib/components/Photo.svelte`
- Create: `com/src/lib/components/ProjectRow.svelte`
- Create: `com/src/lib/components/Footer.svelte`

- [ ] **Step 1: Create Photo.svelte**

When `photo.src` is absent, shows a warm duotone placeholder keyed to the photo id.

```svelte
<!-- src/lib/components/Photo.svelte -->
<script lang="ts">
  import type { Photo } from '$lib/content';

  let { photo }: { photo: Photo } = $props();

  // 8 warm duotone swatches — cycle by photo index parsed from id
  const SWATCHES = [
    '#c8bfb0', '#bfc8c0', '#c0b8c8', '#c8c0b8',
    '#b8c0c8', '#c8b8b8', '#bec8b8', '#c8c4b8',
  ];

  const swatchColor = SWATCHES[(parseInt(photo.id, 10) - 1) % SWATCHES.length];
</script>

<figure class="photo-figure">
  <div class="photo-media" style="aspect-ratio: {photo.ratio};">
    {#if photo.src}
      <img src={photo.src} alt={photo.caption} class="photo-img" />
    {:else}
      <div class="photo-placeholder" style="background-color: {swatchColor};"></div>
    {/if}
  </div>
  <figcaption class="photo-caption">
    <span>{photo.caption}</span>
    <span>#{photo.id}</span>
  </figcaption>
</figure>

<style>
  .photo-figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .photo-media {
    width: 100%;
    overflow: hidden;
  }

  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
  }

  .photo-caption {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--color-ink-2);
  }
</style>
```

- [ ] **Step 2: Create ProjectRow.svelte**

```svelte
<!-- src/lib/components/ProjectRow.svelte -->
<script lang="ts">
  import Tag from './Tag.svelte';
  import type { Project } from '$lib/content';

  let { project, last = false }: { project: Project; last?: boolean } = $props();
</script>

<article class="row" class:last>
  <span class="row-num">{project.no}</span>

  <div class="row-title-col">
    <div class="row-title">{project.title}</div>
    <div class="row-sub">{project.client} · {project.year}</div>
  </div>

  <p class="row-blurb">{project.blurb}</p>

  <div class="row-tags">
    {#each project.tags as tag}
      <Tag label={tag} />
    {/each}
  </div>
</article>

<style>
  .row {
    padding: 32px 0;
    border-top: 1px solid var(--color-rule);
    display: grid;
    grid-template-columns: 60px 1fr 1fr auto;
    gap: 32px;
    align-items: baseline;
    cursor: pointer;
    transition: background 150ms ease;
  }

  .row:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .row.last {
    border-bottom: 1px solid var(--color-rule);
  }

  .row-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
  }

  .row-title {
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  .row-sub {
    margin-top: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
  }

  .row-blurb {
    margin: 0;
    color: var(--color-ink-2);
    font-size: 14px;
    line-height: 1.55;
    max-width: 380px;
  }

  .row-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 220px;
  }

  @media (max-width: 767px) {
    .row {
      grid-template-columns: 40px 1fr;
      grid-template-rows: auto auto auto;
      gap: 12px 16px;
    }

    .row-blurb {
      grid-column: 2;
      max-width: none;
    }

    .row-tags {
      grid-column: 2;
      justify-content: flex-start;
      max-width: none;
    }
  }
</style>
```

- [ ] **Step 3: Create Footer.svelte**

```svelte
<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { SITE_META } from '$lib/content';

  let {
    left = `© 2026 — built by hand`,
    right = `v ${SITE_META.version} · last updated ${SITE_META.updatedLabel}`,
  }: {
    left?: string;
    right?: string;
  } = $props();
</script>

<footer class="footer">
  <span>{left}</span>
  <span>{right}</span>
</footer>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    padding: 32px 64px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-3);
  }

  @media (max-width: 767px) {
    .footer {
      padding: 24px 40px;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
cd com && git add src/lib/components/Photo.svelte src/lib/components/ProjectRow.svelte src/lib/components/Footer.svelte && git commit -m "feat: add Photo, ProjectRow, and Footer components"
```

---

## Task 8: Scroll-reveal action

**Files:**
- Create: `com/src/lib/actions/fadeUp.ts`

- [ ] **Step 1: Create fadeUp.ts**

```ts
// src/lib/actions/fadeUp.ts

/**
 * Svelte action — fades the element up 12px into view when it enters the
 * viewport. Triggers once, then disconnects the observer.
 *
 * Usage: <section use:fadeUp>...</section>
 */
export function fadeUp(node: HTMLElement): { destroy(): void } {
  node.style.opacity = '0';
  node.style.transform = 'translateY(12px)';
  node.style.transition = 'opacity 500ms cubic-bezier(.2,.7,.25,1), transform 500ms cubic-bezier(.2,.7,.25,1)';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      });
    },
    { threshold: 0.08 },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
cd com && git add src/lib/actions/fadeUp.ts && git commit -m "feat: add fadeUp scroll-reveal action"
```

---

## Task 9: Home page

**Files:**
- Modify: `com/src/routes/+page.svelte`

- [ ] **Step 1: Write the full Home page**

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import Section from '$lib/components/Section.svelte';
  import MetaField from '$lib/components/MetaField.svelte';
  import ProjectRow from '$lib/components/ProjectRow.svelte';
  import Photo from '$lib/components/Photo.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { fadeUp } from '$lib/actions/fadeUp';
  import { IDENTITY, PROJECTS, PHOTOS, SITE_META } from '$lib/content';

  const previewPhotos = PHOTOS.slice(0, 4);
</script>

<svelte:head>
  <title>Nicholaus Suprapto — Software Engineer</title>
</svelte:head>

<!-- TOP BAR -->
<TopBar active="index">
  {#snippet right()}
    <span class="status">
      <span class="status-dot" aria-hidden="true"></span>
      Toronto · live
    </span>
  {/snippet}
</TopBar>

<!-- HERO -->
<section class="hero" use:fadeUp>
  <div class="hero-grid">
    <span class="hero-num">00 / intro</span>
    <div>
      <h1 class="hero-h1">
        <span class="hero-name">{IDENTITY.name}.</span><br />
        Software engineer. Payments platforms.
        <span class="hero-accent">Toronto.</span>
      </h1>
      <div class="hero-meta">
        <MetaField label="Role" value={IDENTITY.role.split(' · ')[0]} />
        <MetaField label="Organization" value={IDENTITY.org} />
        <MetaField label="Now" value="Payments Canada · RTR" />
        <MetaField label="Based" value={IDENTITY.location} />
      </div>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- ABOUT -->
<div use:fadeUp>
  <Section num="01" label="About">
    <div class="about-grid">
      <div>
        <p class="about-primary">
          Waterloo CS grad, now at the IBM Payments Center. I came up through cloud-engineering
          co-ops — State Street, Manulife, then back to IBM full-time — and ended up specialising
          in the platform layer for high-availability payment infrastructure.
        </p>
        <p class="about-secondary">
          Outside of work I've started taking photographs — mostly walking around Toronto. This
          site is half CV, half slowly-growing gallery.
        </p>
      </div>
      <Photo photo={{ id: '000', caption: 'Portrait · placeholder', place: '', date: '', ratio: '4/5', tags: [] }} />
    </div>
  </Section>
</div>

<!-- SELECTED WORK -->
<div id="work" use:fadeUp>
  <Section num="02" label="Selected work" topPad="120px">
    {#each PROJECTS as project, i}
      <ProjectRow {project} last={i === PROJECTS.length - 1} />
    {/each}
  </Section>
</div>

<!-- PHOTOGRAPHY PREVIEW -->
<div use:fadeUp>
  <Section num="03" label="Photography" topPad="120px">
    <div class="photo-intro">
      <p class="photo-desc">
        A working selection. Mostly 35mm, mostly Toronto, occasionally further. Updated when I
        find one I like.
      </p>
      <a href="/photography" class="photo-link">
        view all ({SITE_META.photoCount}) →
      </a>
    </div>
    <div class="photo-grid">
      {#each previewPhotos as photo}
        <Photo {photo} />
      {/each}
    </div>
  </Section>
</div>

<!-- CONTACT -->
<div id="contact" use:fadeUp>
  <Section num="04" label="Contact" topPad="120px">
    <div class="contact-grid">
      <div>
        <p class="contact-statement">
          The fastest way is email<span class="accent">.</span>
        </p>
        <a href="mailto:{IDENTITY.email}" class="contact-btn">
          {IDENTITY.email} ↗
        </a>
      </div>
      <dl class="contact-dl">
        <dt>GitHub</dt>
        <dd><a href="https://{IDENTITY.github}" target="_blank" rel="noopener">{IDENTITY.github}</a></dd>
        <dt>LinkedIn</dt>
        <dd><a href="https://linkedin.com/{IDENTITY.linkedin}" target="_blank" rel="noopener">{IDENTITY.linkedin}</a></dd>
        <dt>Resume</dt>
        <dd><a href="/resume.pdf" download>resume.pdf ↓</a></dd>
        <dt>Location</dt>
        <dd>{IDENTITY.location}</dd>
      </dl>
    </div>
  </Section>
</div>

<div class="rule" style="margin-top: 96px;"></div>

<Footer />

<style>
  /* Status dot */
  .status {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 99px;
    background: #3a8a5a;
    display: inline-block;
    flex-shrink: 0;
  }

  /* Hero */
  .hero {
    padding: 160px 64px 140px;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .hero-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 8px;
  }
  .hero-h1 {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 80px;
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.03em;
    color: var(--color-ink);
    max-width: 980px;
  }
  .hero-name {
    color: var(--color-ink-3);
  }
  .hero-accent {
    color: var(--color-accent);
  }
  .hero-meta {
    display: flex;
    gap: 56px;
    margin-top: 72px;
  }

  /* Rule */
  .rule {
    height: 1px;
    background: var(--color-rule);
    margin: 0 64px;
  }

  /* About */
  .about-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 80px;
    max-width: 1080px;
    align-items: start;
  }
  .about-primary {
    margin: 0;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.005em;
    color: var(--color-ink);
  }
  .about-secondary {
    margin: 24px 0 0;
    font-size: 16px;
    line-height: 1.65;
    color: var(--color-ink-2);
  }

  /* Photography preview */
  .photo-intro {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  .photo-desc {
    margin: 0;
    color: var(--color-ink-2);
    max-width: 480px;
    font-size: 14px;
  }
  .photo-link {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink);
    text-decoration: none;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .photo-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  /* Contact */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    max-width: 1000px;
  }
  .contact-statement {
    margin: 0;
    font-size: 36px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--color-ink);
  }
  .accent {
    color: var(--color-accent);
  }
  .contact-btn {
    display: inline-block;
    margin-top: 28px;
    padding: 14px 22px;
    border: 1px solid var(--color-ink);
    color: var(--color-ink);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.03em;
    transition: background 150ms ease, color 150ms ease;
  }
  .contact-btn:hover {
    background: var(--color-ink);
    color: var(--color-paper);
  }
  .contact-dl {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink-2);
    line-height: 2;
    display: grid;
    grid-template-columns: 80px 1fr;
    column-gap: 16px;
    align-content: start;
  }
  .contact-dl dt {
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .contact-dl dd {
    margin: 0;
    color: var(--color-ink);
  }
  .contact-dl dd a {
    color: inherit;
    text-decoration: none;
  }
  .contact-dl dd a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  /* Responsive */
  @media (max-width: 1023px) {
    .hero {
      padding: 100px 40px 100px;
    }
    .hero-h1 {
      font-size: 56px;
    }
    .hero-meta {
      gap: 32px;
      flex-wrap: wrap;
    }
    .about-grid {
      gap: 40px;
    }
    .rule {
      margin: 0 40px;
    }
  }

  @media (max-width: 767px) {
    .hero {
      padding: 64px 40px 80px;
    }
    .hero-grid {
      display: block;
    }
    .hero-num {
      display: block;
      margin-bottom: 16px;
    }
    .hero-h1 {
      font-size: 40px;
      letter-spacing: -0.02em;
    }
    .hero-meta {
      flex-direction: column;
      gap: 16px;
      margin-top: 40px;
    }
    .about-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .photo-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .photo-intro {
      flex-direction: column;
      gap: 12px;
    }
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .rule {
      margin: 0 40px;
    }
  }
</style>
```

- [ ] **Step 2: Check in browser at multiple widths**

```bash
cd com && npm run dev
```

Open http://localhost:5173. Verify:
- Desktop (1280px): hero H1 is 80px, gutter is visible, 4-column photo preview, 4-column project rows
- Tablet (768–1023px): H1 scales to 56px, padding reduces
- Mobile (< 768px): H1 scales to 40px, photo grid is 2-column, contact stacks

- [ ] **Step 3: Commit**

```bash
cd com && git add src/routes/+page.svelte && git commit -m "feat: build Home page with all sections"
```

---

## Task 10: Gallery page

**Files:**
- Create: `com/src/routes/photography/+page.ts`
- Create: `com/src/routes/photography/+page.svelte`

- [ ] **Step 1: Create the load function**

```ts
// src/routes/photography/+page.ts
import { PHOTOS } from '$lib/content';
import type { PageLoad } from './$types';

/**
 * R2 seam: replace the PHOTOS import below with a fetch() call to your
 * R2-backed API endpoint. The page component receives the same `photos`
 * shape regardless of source.
 */
export const load: PageLoad = () => {
  return { photos: PHOTOS };
};
```

- [ ] **Step 2: Create the Gallery page**

```svelte
<!-- src/routes/photography/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import Photo from '$lib/components/Photo.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { filterPhotos, paginatePhotos, photoColumns } from '$lib/utils/photos';
  import { SITE_META } from '$lib/content';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const FILTERS = ['All', 'Toronto', 'Travel', 'Film', 'Digital'] as const;
  const PAGE_SIZE = 18;

  let activeFilter = $state<string>('All');
  let visible = $state(PAGE_SIZE);

  const filtered = $derived(filterPhotos(data.photos, activeFilter));
  const paginated = $derived(paginatePhotos(filtered, visible));
  const columns = $derived(photoColumns(paginated, 3));
  const previewColumns = $derived(photoColumns(data.photos.slice(PAGE_SIZE, PAGE_SIZE + 3), 3));

  function setFilter(f: string) {
    activeFilter = f;
    visible = PAGE_SIZE;
  }

  function loadMore() {
    visible += PAGE_SIZE;
  }
</script>

<svelte:head>
  <title>Photography — Nicholaus Suprapto</title>
</svelte:head>

<!-- TOP BAR -->
<TopBar active="photography">
  {#snippet right()}
    <span>{SITE_META.photoCount} photos · since {SITE_META.photosSince}</span>
  {/snippet}
</TopBar>

<!-- PAGE TITLE -->
<section class="page-title">
  <div class="title-grid">
    <span class="title-num">03 / photography</span>
    <div class="title-right">
      <h1 class="title-h1">
        Things I've noticed while walking around<span class="accent">.</span>
      </h1>
      <div class="filter-pills">
        {#each FILTERS as f}
          <button
            class="pill"
            class:pill-active={activeFilter === f}
            onclick={() => setFilter(f)}
          >
            {f}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- PHOTO GRID -->
<section class="grid-section">
  <div class="grid-gutter" aria-hidden="true"></div>
  <div class="masonry">
    {#each columns as col}
      <div class="masonry-col">
        {#each col as photo}
          <Photo {photo} />
        {/each}
      </div>
    {/each}
  </div>
</section>

<!-- LOAD MORE -->
{#if visible < filtered.length}
  <section class="load-more-section">
    <div class="grid-gutter" aria-hidden="true"></div>
    <div class="load-more-inner">
      <div class="load-rule"></div>
      <button class="load-btn" onclick={loadMore}>
        Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
      </button>
      <div class="load-rule"></div>
    </div>
    <div class="grid-gutter" aria-hidden="true"></div>
    <p class="load-status">
      {Math.min(visible, filtered.length)} of {filtered.length} · scroll or click to continue
    </p>

    <!-- Faded preview of next batch -->
    {#if previewColumns.some((col) => col.length > 0)}
      <div class="grid-gutter" aria-hidden="true"></div>
      <div class="masonry preview-fade">
        {#each previewColumns as col}
          <div class="masonry-col">
            {#each col as photo}
              <Photo {photo} />
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}

<div class="rule"></div>

<Footer
  left="← back to index"
  right="{SITE_META.photoCount} photos · updated {SITE_META.updatedLabel}"
/>

<style>
  /* Page title */
  .page-title {
    padding: 88px 64px 56px;
  }
  .title-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    align-items: start;
  }
  .title-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 8px;
  }
  .title-right {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
  }
  .title-h1 {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 48px;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.025em;
    max-width: 720px;
  }
  .accent {
    color: var(--color-accent);
  }

  /* Filter pills */
  .filter-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .pill {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 99px;
    cursor: pointer;
    border: 1px solid var(--color-rule);
    background: transparent;
    color: var(--color-ink-2);
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }
  .pill-active {
    background: var(--color-ink);
    color: var(--color-paper);
    border-color: var(--color-ink);
  }

  /* Masonry grid */
  .grid-section {
    padding: 0 64px 56px;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .masonry {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .masonry-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Load more */
  .load-more-section {
    padding: 32px 64px 0;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .load-more-inner {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .load-rule {
    height: 1px;
    flex: 1;
    background: var(--color-rule);
  }
  .load-btn {
    padding: 14px 28px;
    background: var(--color-ink);
    color: var(--color-paper);
    border: none;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: opacity 150ms ease;
  }
  .load-btn:hover {
    opacity: 0.85;
  }
  .load-status {
    margin: 12px 0 0;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-ink-3);
    letter-spacing: 0.04em;
    grid-column: 2;
  }

  /* Faded preview */
  .preview-fade {
    grid-column: 2;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%);
    -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%);
    padding-top: 56px;
  }

  .rule {
    height: 1px;
    background: var(--color-rule);
    margin: 32px 64px 0;
  }

  .grid-gutter {
    /* spacer in grid */
  }

  /* Responsive */
  @media (max-width: 1023px) {
    .page-title {
      padding: 64px 40px 40px;
    }
    .grid-section {
      padding: 0 40px 40px;
    }
    .load-more-section {
      padding: 32px 40px 0;
    }
    .rule {
      margin: 32px 40px 0;
    }
  }

  @media (max-width: 767px) {
    .page-title {
      padding: 48px 40px 32px;
    }
    .title-grid {
      display: block;
    }
    .title-num {
      display: block;
      margin-bottom: 12px;
    }
    .title-h1 {
      font-size: 32px;
    }
    .title-right {
      flex-direction: column;
      gap: 24px;
      align-items: flex-start;
    }
    .grid-section {
      display: block;
      padding: 0 40px 40px;
    }
    .masonry {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .load-more-section {
      display: block;
      padding: 32px 40px 0;
    }
    .load-status {
      grid-column: auto;
    }
    .preview-fade {
      grid-column: auto;
    }
  }
</style>
```

- [ ] **Step 3: Verify in browser**

```bash
cd com && npm run dev
```

Open http://localhost:5173/photography. Verify:
- Photo grid renders 18 placeholders in 3 columns with varying aspect ratios
- Filter pills toggle active state and refilter the grid
- "Load more" button appears and appends photos on click
- Faded preview strip shows below the load-more button

- [ ] **Step 4: Commit**

```bash
cd com && git add src/routes/photography/ && git commit -m "feat: build Gallery page with filter, load-more, and faded preview"
```

---

## Task 11: CV page

**Files:**
- Create: `com/src/routes/cv/+page.svelte`

- [ ] **Step 1: Create the CV page**

```svelte
<!-- src/routes/cv/+page.svelte -->
<script lang="ts">
  import TopBar from '$lib/components/TopBar.svelte';
  import MetaField from '$lib/components/MetaField.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { fadeUp } from '$lib/actions/fadeUp';
  import { IDENTITY, EXPERIENCE, EDUCATION, SKILLS } from '$lib/content';
</script>

<svelte:head>
  <title>CV — Nicholaus Suprapto</title>
</svelte:head>

<!-- TOP BAR -->
<TopBar active="cv">
  {#snippet right()}
    <a href="/resume.pdf" download class="dl-btn">Download · pdf ↓</a>
  {/snippet}
</TopBar>

<!-- TITLE BLOCK -->
<section class="title-block" use:fadeUp>
  <div class="title-grid">
    <span class="title-num">04 / cv</span>
    <div>
      <h1 class="title-h1">Curriculum vitae<span class="accent">.</span></h1>
      <div class="identity-row">
        <MetaField label="Name"    value={IDENTITY.name} />
        <MetaField label="Title"   value={IDENTITY.role} />
        <MetaField label="Based"   value={IDENTITY.location} />
        <MetaField label="Email"   value={IDENTITY.email} />
        <MetaField label="Updated" value={IDENTITY.updated} />
      </div>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- EXPERIENCE -->
<section class="cv-section" use:fadeUp>
  <span class="cv-section-num">01 / experience</span>
  <div class="experience-list">
    {#each EXPERIENCE as exp}
      <article class="exp-row">
        <div class="exp-date">{exp.yr}</div>
        <div class="exp-body">
          <h3 class="exp-role">{exp.role}</h3>
          <div class="exp-org">{exp.org}</div>
          <ul class="exp-bullets">
            {#each exp.bullets as bullet}
              <li class="exp-bullet">
                <span class="bullet-dash" aria-hidden="true">—</span>
                <span>{bullet}</span>
              </li>
            {/each}
          </ul>
          <div class="exp-stack">
            {#each exp.stack as s}
              <Tag label={s} />
            {/each}
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<div class="rule"></div>

<!-- SKILLS -->
<section class="cv-section" use:fadeUp>
  <span class="cv-section-num">02 / skills</span>
  <div class="skills-grid">
    {#each SKILLS as group}
      <div class="skill-row">
        <span class="skill-group">{group.group}</span>
        <span class="skill-items">{group.items.join(' · ')}</span>
      </div>
    {/each}
  </div>
</section>

<div class="rule"></div>

<!-- EDUCATION -->
<section class="cv-section" use:fadeUp>
  <span class="cv-section-num">03 / education</span>
  <div class="experience-list">
    {#each EDUCATION as edu}
      <article class="exp-row">
        <div class="exp-date">{edu.yr}</div>
        <div class="exp-body">
          <h3 class="edu-org">{edu.org}</h3>
          <p class="edu-desc">{edu.description}</p>
        </div>
      </article>
    {/each}
  </div>
</section>

<div class="rule"></div>

<!-- COLOPHON -->
<section class="colophon" use:fadeUp>
  <span class="cv-section-num">—</span>
  <div class="colophon-inner">
    <p class="colophon-text">
      References available on request. Prefer to print this? The PDF is set on a single page
      in the same type.
    </p>
    <a href="/resume.pdf" download class="dl-btn dl-btn-large">Download résumé · pdf ↓</a>
  </div>
</section>

<style>
  /* Download button */
  .dl-btn {
    padding: 8px 14px;
    background: var(--color-ink);
    color: var(--color-paper);
    border: none;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    transition: opacity 150ms ease;
  }
  .dl-btn:hover {
    opacity: 0.85;
  }
  .dl-btn-large {
    padding: 14px 22px;
    font-size: 12px;
    white-space: nowrap;
  }

  /* Title block */
  .title-block {
    padding: 88px 64px 48px;
  }
  .title-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    align-items: start;
  }
  .title-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 8px;
  }
  .title-h1 {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 56px;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.025em;
  }
  .accent {
    color: var(--color-accent);
  }
  .identity-row {
    display: flex;
    gap: 48px;
    margin-top: 36px;
    flex-wrap: wrap;
  }

  /* Shared rule */
  .rule {
    height: 1px;
    background: var(--color-rule);
    margin: 0 64px;
  }

  /* CV sections (experience, skills, education, colophon) */
  .cv-section {
    padding: 64px 64px 32px;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .cv-section-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink-2);
    padding-top: 4px;
  }

  /* Experience */
  .experience-list {
    display: flex;
    flex-direction: column;
    gap: 48px;
    max-width: 920px;
  }
  .exp-row {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 32px;
    align-items: baseline;
  }
  .exp-date {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-ink-2);
    letter-spacing: 0.04em;
  }
  .exp-role {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.012em;
  }
  .exp-org {
    margin-top: 4px;
    color: var(--color-ink-2);
    font-size: 14px;
  }
  .exp-bullets {
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .exp-bullet {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: 6px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-ink);
  }
  .bullet-dash {
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .exp-stack {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  /* Skills */
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    max-width: 920px;
  }
  .skill-row {
    border-top: 1px solid var(--color-rule-soft);
    padding-top: 14px;
    padding-bottom: 14px;
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    align-items: baseline;
  }
  .skill-group {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-ink-2);
    letter-spacing: 0.04em;
  }
  .skill-items {
    color: var(--color-ink);
    font-size: 14px;
  }

  /* Education */
  .edu-org {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 18px;
    font-weight: 500;
    line-height: 1.3;
  }
  .edu-desc {
    margin: 6px 0 0;
    color: var(--color-ink-2);
    font-size: 14px;
  }

  /* Colophon */
  .colophon {
    padding: 64px 64px 96px;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
  }
  .colophon-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .colophon-text {
    margin: 0;
    color: var(--color-ink-2);
    max-width: 520px;
    font-size: 14px;
  }

  /* Responsive */
  @media (max-width: 1023px) {
    .title-block,
    .cv-section,
    .colophon {
      padding-left: 40px;
      padding-right: 40px;
    }
    .rule {
      margin: 0 40px;
    }
    .identity-row {
      gap: 24px;
    }
  }

  @media (max-width: 767px) {
    .title-block {
      padding: 48px 40px 32px;
    }
    .title-grid {
      display: block;
    }
    .title-num {
      display: block;
      margin-bottom: 12px;
    }
    .title-h1 {
      font-size: 36px;
    }
    .identity-row {
      flex-direction: column;
      gap: 12px;
    }
    .cv-section {
      display: block;
      padding: 48px 40px 24px;
    }
    .cv-section-num {
      display: block;
      margin-bottom: 20px;
    }
    .exp-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .skills-grid {
      grid-template-columns: 1fr;
    }
    .skill-row {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .colophon {
      display: block;
      padding: 40px 40px 64px;
    }
    .colophon-inner {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
```

- [ ] **Step 2: Verify in browser**

```bash
cd com && npm run dev
```

Open http://localhost:5173/cv. Verify:
- "Download · pdf ↓" button appears in the top bar
- Experience entries render with bullet dashes in accent blue
- Skills section shows 2-column grid with hairline dividers
- On mobile (< 768px): date stacks above role, skills become single column

- [ ] **Step 3: Run all tests**

```bash
cd com && npm test
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
cd com && git add src/routes/cv/ && git commit -m "feat: build CV page with experience, skills, and education"
```

---

## Task 12: Final wiring — lib/index.ts and build check

**Files:**
- Modify: `com/src/lib/index.ts`

- [ ] **Step 1: Update the lib barrel export**

```ts
// src/lib/index.ts
export { IDENTITY, PROJECTS, EXPERIENCE, EDUCATION, SKILLS, PHOTOS, SITE_META } from './content';
export { filterPhotos, paginatePhotos, photoColumns } from './utils/photos';
export { fadeUp } from './actions/fadeUp';
```

- [ ] **Step 2: Run svelte-check**

```bash
cd com && npm run check
```

Expected: zero TypeScript or Svelte errors.

- [ ] **Step 3: Run production build**

```bash
cd com && npm run build
```

Expected: build succeeds, `.svelte-kit/output` directory produced.

- [ ] **Step 4: Smoke-test the preview build**

```bash
cd com && npm run preview
```

Open http://localhost:4173. Click through Home → Photography → CV. Confirm all three routes load, TopBar nav links work, filter pills work on the gallery, download button on CV points to `/resume.pdf`.

- [ ] **Step 5: Run full test suite one final time**

```bash
cd com && npm test
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
cd com && git add src/lib/index.ts && git commit -m "chore: update lib barrel export and verify build"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Design tokens — `@theme` in app.css
- ✅ Fonts — Switzer + JetBrains Mono via CDN in layout.svelte
- ✅ TopBar — sticky, 3-col grid, active nav, right snippet, mobile menu
- ✅ Section — 120px gutter pattern, responsive collapse
- ✅ MetaField, Tag, Photo, ProjectRow, Footer — all created
- ✅ fadeUp action — IntersectionObserver, triggers once
- ✅ Home — all 5 sections (Hero, About, Work, Photography, Contact)
- ✅ Gallery — filter state, load-more, faded preview, R2 seam in +page.ts
- ✅ CV — Experience, Skills, Education, Colophon, download link
- ✅ Responsive — lg/md/mobile breakpoints across all pages and components
- ✅ content.ts — centralised, all pages import from it
- ✅ filterPhotos/photoColumns/paginatePhotos — TDD'd

**No placeholders:** All code steps contain complete, runnable code. No TBDs.

**Type consistency:** `Photo`, `Project`, `Experience`, `SkillGroup`, `Identity`, `SiteMeta` types defined once in `content.ts` and used identically in components and utilities throughout.
