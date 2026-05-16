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
