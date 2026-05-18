// src/lib/content.ts

// ── Types ────────────────────────────────────────────────────────────────────

export type Project = {
  no: string;
  title: string;
  client: string;
  year: string;
  blurb: string;
  tags: string[];
  href?: string;  // optional deep-link to CV section
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
  ratio: '2/3' | '4/5' | '3/4' | '1/1' | '4/3' | '3/2';
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
  photosSince: number;
};

// ── Identity ─────────────────────────────────────────────────────────────────

export const IDENTITY: Identity = {
  name: 'Nicholaus Suprapto',
  role: 'Associate DevOps Engineer · IBM',
  org: 'IBM Payments Center',
  location: 'Toronto, ON',
  email: 'nsuprapto@icloud.com',
  github: 'github.com/ininicho',
  linkedin: 'in/nicholaus-suprapto',
  updated: 'May 2026',
};

// ── Projects (Home — Selected Work) ──────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    no: '01',
    year: 'Aug 2025 — present',
    client: 'Payments Canada · IBM',
    title: 'Real-Time Rail · Platform team',
    blurb:
      "Part of the IBM Platform team building Canada's first national real-time payment infrastructure with Interac and CGI. GitOps across 12 OpenShift clusters, Kong Gateway, ActiveMQ, HashiCorp Vault, F5 CIS, distributed databases — the full platform stack.",
    tags: ['OpenShift', 'ArgoCD', 'Kong', 'Vault', 'CockroachDB', 'AMQ'],
    href: '/cv#exp-0',
  },
  {
    no: '02',
    year: 'Jul — Aug 2025',
    client: 'IBM Payments Center',
    title: 'Release Management Remediation',
    blurb:
      'Led a compliance-driven decommission of the Wires Services Jenkins instance, migrating 40+ pipelines to IBM One Pipeline (Tekton). Reduced pipeline execution time by up to 3× through concurrent stage optimisation.',
    tags: ['Tekton', 'IBM One Pipeline', 'CI/CD', 'Jenkins'],
    href: '/cv#exp-1',
  },
  {
    no: '03',
    year: 'Jan — Apr 2025',
    client: 'IBM Payments Center',
    title: 'Cloud Platform Engineering',
    blurb:
      'Migrated 800+ platform base images from JFrog to IBM Cloud Container Registry. Provisioned EKS add-ons via Terraform; built CloudWatch-based log monitoring with Instana alerting; implemented S3 cross-region replication for DR.',
    tags: ['Terraform', 'AWS', 'EKS', 'IBM Cloud'],
    href: '/cv#exp-2',
  },
];

// ── Experience (CV) ───────────────────────────────────────────────────────────

export const EXPERIENCE: Experience[] = [
  {
    yr: 'Aug 2025 — present',
    role: 'Associate DevOps Engineer · Real-Time Rail',
    org: 'IBM · embedded with Payments Canada',
    bullets: [
      'Managed ArgoCD / OpenShift GitOps across 12 clusters, with 2 management instances each governing a set of datacenters, enabling GitOps-driven delivery for C&S and Exchange workloads across 16 environments.',
      'Standardized and maintained CI/CD pipelines across 16 environments, including snapshot and release pipelines for C&S teams and per-environment CD pipelines for both C&S and Exchange.',
      'Migrated and rebuilt CloudBees CI Jenkins from IBM Cloud to on-premises OpenShift using CasC, deploying in an active-passive configuration across 2 management clusters.',
      'Deployed and configured Kong Gateway (Control Plane and Data Plane) on OpenShift; built a custom plugin image pipeline; implemented Kong Deck config-as-code for version-controlled API infrastructure.',
      'Deployed ActiveMQ (AMQ) Broker via OpenShift operators, configuring Queue Federation and Mirroring across pre-production and production for cross-site message persistence.',
      'Installed and configured EDB PostgreSQL with synchronous commits between datacenters to achieve RPO=0 across production environments.',
      'Deployed CockroachDB as pods across the cluster fleet as part of the distributed data layer.',
      'Integrated LDAP (Red Hat Directory Server) with Artifactory, AMQ, Kong Gateway, and EDB PostgreSQL for centralized identity and access management.',
      'Engineered a Zero-Trust network model using OpenShift Network Policies for microsegmentation and Istio Service Mesh to enforce mTLS across all in-mesh microservices.',
      'Installed HashiCorp Vault operator across all clusters, configuring Kubernetes auth methods and managing 17 namespaces with automated certificate lifecycle management via the PKI engine.',
      "Deployed F5 CIS operators to provision Virtual IPs for platform components, collaborating with CGI's network team to define and validate network flows.",
      'Instrumented all platform components with Dynatrace via ActiveGate for metrics collection across the full cluster fleet.',
      'Configured backups for all platform components using Nooba storage connected to the SAN.',
      'Supported resiliency, performance, and functional testing — including 300 TPS load tests and 36-hour soak tests — serving as the platform layer interface between development, QA, and infrastructure teams.',
    ],
    stack: ['OpenShift', 'ArgoCD', 'CloudBees CI', 'Kong', 'AMQ', 'EDB PostgreSQL', 'CockroachDB', 'Vault', 'Istio', 'F5 CIS', 'Dynatrace', 'Nooba'],
  },
  {
    yr: 'Jul — Aug 2025',
    role: 'Associate DevOps Engineer · Release Mgmt Remediation',
    org: 'IBM · Wires Services',
    bullets: [
      'Led a compliance-driven decommission of the Wires Services Jenkins instance, migrating CI/CD infrastructure to IBM One Pipeline (1PL) — a Tekton-based framework — across development, platform, QA, and operations teams.',
      'Migrated 40+ Jenkins pipelines to IBM One Pipeline, covering PR, CI, and CD pipelines across Stage, QA, and Production.',
      'Connected IBM Cloud CD instances to AWS accounts to support deployment of CloudFormation infrastructure and Lambda-based microservices.',
      'Reduced pipeline execution time by up to 3× by enabling concurrent stages for code scanning, vulnerability checks, and compliance, and optimizing base image sizes.',
      'Migrated base images from AWS ECR to IBM Cloud Container Registry, remediating vulnerabilities surfaced by automated scanning.',
      'Implemented RBAC to enforce access control across pipeline resources.',
    ],
    stack: ['IBM One Pipeline', 'Tekton', 'Jenkins', 'AWS', 'CloudFormation', 'IBM Cloud'],
  },
  {
    yr: 'Jan — Apr 2025',
    role: 'Cloud Engineer · Student-On-Call',
    org: 'IBM · Payments Center',
    bullets: [
      "Migrated 800+ platform base images from JFrog to IBM Cloud Container Registry, supporting the platform team's AMI build pipeline.",
      'Provisioned EKS add-ons using Terraform to enhance existing Kubernetes clusters.',
      'Developed a CloudWatch-based log monitoring system to detect critical patterns and trigger Instana alerts.',
      'Enabled ELB access logs and implemented S3 cross-region replication for disaster recovery and compliance.',
    ],
    stack: ['Terraform', 'AWS', 'EKS', 'IBM Cloud', 'CloudWatch'],
  },
  {
    yr: 'May — Sep 2024',
    role: 'Cloud Engineer Intern',
    org: 'IBM · Payments Center',
    bullets: [
      'Automated IBM Cloud Toolchain provisioning with Terraform, reducing setup time by 80% — automation later reused as the foundation for the Wires Services CI/CD migration.',
      'Developed CI/CD pipelines for Terraform projects using IBM Toolchain, improving deployment reliability and productivity.',
      'Migrated Terraform CI/CD workflows from Jenkins to IBM Toolchain, reducing deployment times by over 20%.',
      'Integrated Mend (WhiteSource) for automated code compliance and security scanning across pipelines.',
    ],
    stack: ['Terraform', 'IBM Toolchain', 'Jenkins', 'Mend'],
  },
  {
    yr: 'Sep — Dec 2023',
    role: 'Cloud Engineer',
    org: 'Manulife Global',
    bullets: [
      'Implemented Azure Blob Storage lifecycle policies, reducing access costs by over 20%.',
      'Built an Azure Function to automate ParkMyCloud credential rotation, replacing a manual secret management process.',
      'Developed an Azure Function to forward Azure Health Alerts to Microsoft Teams for real-time observability across all resources.',
      'Led development of an internal chatbot using Azure OpenAI and RAG architecture — adopted beyond PoC — enabling secure, role-based knowledge retrieval with team-level access controls.',
    ],
    stack: ['Azure', 'Azure Functions', 'Azure OpenAI', 'RAG'],
  },
  {
    yr: 'May — Aug 2023',
    role: 'Software Developer',
    org: 'Rhetoricon Research · University of Waterloo',
    bullets: [
      'Migrated a legacy MySQL database to PostgreSQL, optimizing queries to improve search and response times.',
      'Integrated Redis caching for Zotero API calls, reducing redundant API calls and improving page load performance.',
      'Built and optimized an admin frontend using client-side rendering and lazy data fetching.',
      'Developed reusable pagination components to standardize UI/UX across multiple views.',
    ],
    stack: ['PostgreSQL', 'Redis', 'JavaScript'],
  },
  {
    yr: 'Jan — Apr 2023',
    role: 'Cloud Engineer',
    org: 'State Street Corporation',
    bullets: [
      'Built Kibana observability dashboards on an ELK stack to monitor node health and log ingestion performance across 20–50 GB of daily log volume.',
      'Designed AWS Lambda pipelines to stream logs from S3, CloudWatch, and CloudTrail into OpenSearch for centralized log aggregation.',
      'Integrated Kinesis to optimize log streaming throughput, reducing Lambda invocation costs by 10%.',
      'Refactored and tuned Lambda functions, cutting tail latency by 20% and preventing throttling through SQS optimization.',
    ],
    stack: ['AWS', 'OpenSearch', 'Lambda', 'Kinesis', 'SQS'],
  },
  {
    yr: 'May — Aug 2022',
    role: 'Software Developer',
    org: 'FarmLink Marketing Solutions',
    bullets: [
      'Refactored front-end components with standardized Vuetify components, eliminating code duplication.',
      'Configured Vite and front-end code splitting, cutting load times by 26% and bundle size by 72%.',
      'Optimized Django ORM queries with lazy loading to improve API response times.',
      'Dockerized the application into microservices, streamlining development workflows and deployment.',
    ],
    stack: ['Vue.js', 'Django', 'Vite', 'Docker'],
  },
];

// ── Education (CV) ────────────────────────────────────────────────────────────

export const EDUCATION: Education[] = [
  {
    yr: '2020 — 2025',
    org: 'Bachelor of Computer Science in Data Science · University of Waterloo',
    description:
      "Graduated with Dean's Honours distinction. Cumulative GPA above 87%. Coursework in distributed systems, networks, machine learning, algorithms and data structures.",
  },
];

// ── Skills (CV) ───────────────────────────────────────────────────────────────

export const SKILLS: SkillGroup[] = [
  {
    group: 'Containers & Orchestration',
    items: ['OpenShift', 'Kubernetes', 'Helm', 'ArgoCD', 'OpenShift GitOps', 'CloudBees CI'],
  },
  {
    group: 'IaC & Automation',
    items: ['Terraform', 'CloudFormation', 'Jenkins', 'IBM One Pipeline (Tekton)', 'Kong Deck'],
  },
  {
    group: 'Cloud Platforms',
    items: ['AWS', 'Azure', 'IBM Cloud'],
  },
  {
    group: 'Networking & Security',
    items: ['Istio Service Mesh', 'F5 BIG-IP (LTM/GTM)', 'F5 CIS', 'HashiCorp Vault (PKI/Secrets)', 'OpenShift Network Policies', 'LDAP'],
  },
  {
    group: 'Messaging & Middleware',
    items: ['ActiveMQ (AMQ) Broker', 'Kong Gateway'],
  },
  {
    group: 'Data & Storage',
    items: ['CockroachDB', 'EDB PostgreSQL', 'Nooba Storage', 'Redis'],
  },
  {
    group: 'Observability & Scanning',
    items: ['Dynatrace (ActiveGate)', 'SonarQube', 'JFrog Artifactory & Xray', 'Mend (WhiteSource)'],
  },
  {
    group: 'Languages',
    items: ['Python', 'Golang', 'C / C++', 'Bash', 'JavaScript'],
  },
  {
    group: 'Web Frameworks',
    items: ['Svelte', 'Vue.js', 'Next.js', 'React'],
  },
];

// ── Photos (Gallery + Home preview) ──────────────────────────────────────────
// src is intentionally absent — Photo.svelte shows a placeholder swatch.
// Add src: 'https://<r2-bucket>/<key>' once R2 is wired.

export const PHOTOS: Photo[] = [
  { id: '001', caption: 'Kensington', place: 'Kensington', date: '2026/05/25', ratio: '3/2', tags: ['Toronto'] },
  { id: '002', caption: 'Spadina', place: 'Spadina', date: '04/25', ratio: '2/3', tags: ['Toronto'] },
  { id: '003', caption: 'Union', place: 'Union', date: '04/25', ratio: '1/1', tags: ['Toronto'] },
  { id: '004', caption: 'Don Valley', place: 'Don Valley', date: '03/25', ratio: '4/3', tags: ['Toronto'] },
  { id: '005', caption: 'Bellwoods', place: 'Bellwoods', date: '03/25', ratio: '3/4', tags: ['Toronto'] },
  { id: '006', caption: 'Lakeshore', place: 'Lakeshore', date: '02/25', ratio: '4/5', tags: ['Toronto'] },
  { id: '007', caption: 'Annex', place: 'Annex', date: '01/25', ratio: '1/1', tags: ['Toronto'] },
  { id: '008', caption: 'Distillery', place: 'Distillery', date: '12/24', ratio: '3/4', tags: ['Toronto'] },
  { id: '009', caption: 'Roncesvalles', place: 'Roncesvalles', date: '11/24', ratio: '4/5', tags: ['Toronto'] },
  { id: '010', caption: 'Kensington', place: 'Kensington', date: '11/24', ratio: '4/3', tags: ['Toronto', 'Film'] },
  { id: '011', caption: 'Spadina', place: 'Spadina', date: '10/24', ratio: '3/4', tags: ['Toronto', 'Film'] },
  { id: '012', caption: 'Bellwoods', place: 'Bellwoods', date: '09/24', ratio: '4/5', tags: ['Toronto'] },
  { id: '013', caption: 'Don Valley', place: 'Don Valley', date: '08/24', ratio: '1/1', tags: ['Toronto'] },
  { id: '014', caption: 'Lakeshore', place: 'Lakeshore', date: '07/24', ratio: '4/5', tags: ['Toronto', 'Digital'] },
  { id: '015', caption: 'Annex', place: 'Annex', date: '06/24', ratio: '3/4', tags: ['Toronto'] },
  { id: '016', caption: 'Union', place: 'Union', date: '05/24', ratio: '4/3', tags: ['Toronto', 'Film'] },
  { id: '017', caption: 'Roncesvalles', place: 'Roncesvalles', date: '04/24', ratio: '4/5', tags: ['Toronto'] },
  { id: '018', caption: 'Distillery', place: 'Distillery', date: '03/24', ratio: '3/4', tags: ['Toronto'] },
  { id: '019', caption: 'Montreal', place: 'Montreal', date: '02/24', ratio: '4/5', tags: ['Travel'] },
  { id: '020', caption: 'Montreal', place: 'Montreal', date: '02/24', ratio: '3/4', tags: ['Travel'] },
  { id: '021', caption: 'Vancouver', place: 'Vancouver', date: '01/24', ratio: '1/1', tags: ['Travel'] },
  { id: '022', caption: 'Vancouver', place: 'Vancouver', date: '01/24', ratio: '4/5', tags: ['Travel', 'Film'] },
];

// ── Site meta ─────────────────────────────────────────────────────────────────

export const SITE_META: SiteMeta = {
  version: '1.0',
  updatedLabel: 'may 2026',
  photosSince: 2026,
};

// ── Page copy ─────────────────────────────────────────────────────────────────
// Edit these strings to update page text without touching .svelte files.

export type Copy = {
  heroTagline: string;
  heroNow: string;
  aboutPrimary: string;
  aboutSecondary: string;
  photographyIntro: string;
  contactStatement: string;
};

export const COPY: Copy = {
  heroTagline: 'Platform and DevOps Engineer. Payments infrastructure.',
  heroNow: 'Payments Canada · RTR',
  aboutPrimary:
    "DevOps and Cloud Engineer at IBM who thrives where reliability meets scale. Computer Science grad from Waterloo — I build the infrastructure other engineers take for granted, and I wouldn't have it any other way.",
  aboutSecondary:
    "Outside of work I've started taking photographs — mostly walking around Toronto. This site is half CV, half slowly-growing gallery.",
  photographyIntro:
    'A working selection. Mostly 35mm, mostly Toronto, occasionally further. Updated when I find one I like.',
  contactStatement: 'The fastest way is email',
};
