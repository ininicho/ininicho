// CV subpage — long-form résumé, designed to look great on screen AND
// double as the print PDF (a button at the top triggers the download).

const CV_TOK = {
  bg:    '#fbf7ef',
  paper: '#ffffff',
  ink:   '#191917',
  ink2:  '#6b675f',
  ink3:  '#a09b91',
  accent:'#1f70c1',
  rule:  'rgba(25,25,23,0.12)',
  ruleSoft: 'rgba(25,25,23,0.06)',
  sans:  '"Switzer", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

function CVPage() {
  const experience = [
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

  const education = [
    { yr: '2020 — 2025', org: 'BCS, Data Science · University of Waterloo', what: 'Dean\'s Honours List. Coursework in distributed systems, networks, machine learning, algorithms and data structures.' },
  ];

  const skills = [
    { group: 'Containers / Orchestration',  items: ['OpenShift', 'Kubernetes', 'Helm', 'ArgoCD (GitOps)'] },
    { group: 'IaC & Automation',            items: ['Terraform', 'CloudFormation', 'Ansible', 'Jenkins'] },
    { group: 'Cloud platforms',             items: ['AWS', 'Azure', 'IBM Cloud'] },
    { group: 'Networking & Security',       items: ['Istio service mesh', 'F5 BIG-IP (LTM/GTM)', 'HashiCorp Vault (PKI/Secrets)'] },
    { group: 'Data & Middleware',           items: ['ActiveMQ Broker', 'CockroachDB', 'EDB Postgres', 'Kong Gateway', 'Redis'] },
    { group: 'Languages',                   items: ['Python', 'Golang', 'C / C++', 'Bash', 'JavaScript', 'SQL'] },
  ];

  return (
    <div style={{ background: CV_TOK.bg, color: CV_TOK.ink, font: `400 14px/1.6 ${CV_TOK.sans}`, minHeight: '100%' }}>
      {/* TOP BAR */}
      <header style={{
        display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24,
        padding: '24px 64px', borderBottom: `1px solid ${CV_TOK.rule}`,
      }}>
        <span style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>idx · 2026</span>
        <nav style={{ display: 'flex', gap: 32, fontFamily: CV_TOK.mono, fontSize: 12, color: CV_TOK.ink2 }}>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>index</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>work</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>photography</a>
          <a style={{ color: CV_TOK.ink, textDecoration: 'none' }}>cv</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>contact</a>
        </nav>
        <button style={{
          padding: '8px 14px', background: CV_TOK.ink, color: CV_TOK.paper, border: 'none', cursor: 'pointer',
          fontFamily: CV_TOK.mono, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          Download · pdf  ↓
        </button>
      </header>

      {/* TITLE / IDENTITY BLOCK */}
      <section style={{ padding: '88px 64px 48px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <span style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>04 / cv</span>
        <div>
          <h1 style={{ margin: 0, font: `500 56px/1.05 ${CV_TOK.sans}`, letterSpacing: '-0.025em', textWrap: 'pretty' }}>
            Curriculum vitae<span style={{ color: CV_TOK.accent }}>.</span>
          </h1>
          <div style={{ display: 'flex', gap: 48, marginTop: 36, fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <div><div style={{ color: CV_TOK.ink3, marginBottom: 6 }}>Name</div><div style={{ color: CV_TOK.ink }}>Nicholaus Suprapto</div></div>
            <div><div style={{ color: CV_TOK.ink3, marginBottom: 6 }}>Title</div><div style={{ color: CV_TOK.ink }}>Associate DevOps Engineer · IBM</div></div>
            <div><div style={{ color: CV_TOK.ink3, marginBottom: 6 }}>Based</div><div style={{ color: CV_TOK.ink }}>Toronto, ON</div></div>
            <div><div style={{ color: CV_TOK.ink3, marginBottom: 6 }}>Email</div><div style={{ color: CV_TOK.ink }}>nsuprapt@uwaterloo.ca</div></div>
            <div><div style={{ color: CV_TOK.ink3, marginBottom: 6 }}>Updated</div><div style={{ color: CV_TOK.ink }}>May 2026</div></div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: CV_TOK.rule, margin: '0 64px' }} />

      {/* EXPERIENCE */}
      <section style={{ padding: '64px 64px 32px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <span style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>01 / experience</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 920 }}>
          {experience.map((e) => (
            <article key={e.role} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'baseline' }}>
              <div style={{ fontFamily: CV_TOK.mono, fontSize: 12, color: CV_TOK.ink2, letterSpacing: '0.04em' }}>{e.yr}</div>
              <div>
                <h3 style={{ margin: 0, font: `500 22px/1.25 ${CV_TOK.sans}`, letterSpacing: '-0.012em' }}>{e.role}</h3>
                <div style={{ marginTop: 4, color: CV_TOK.ink2, fontSize: 14 }}>{e.org}</div>
                <ul style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {e.bullets.map((b, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 6, color: CV_TOK.ink, fontSize: 14, lineHeight: 1.6 }}>
                      <span style={{ color: CV_TOK.accent, fontFamily: CV_TOK.mono, fontSize: 12 }}>—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.stack.map(s => (
                    <span key={s} style={{ fontFamily: CV_TOK.mono, fontSize: 10, padding: '4px 8px', border: `1px solid ${CV_TOK.rule}`, borderRadius: 99, color: CV_TOK.ink2, letterSpacing: '0.04em' }}>{s}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: CV_TOK.rule, margin: '32px 64px 0' }} />

      {/* SKILLS */}
      <section style={{ padding: '64px 64px 32px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <span style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>02 / skills</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 920 }}>
          {skills.map(s => (
            <div key={s.group} style={{ borderTop: `1px solid ${CV_TOK.ruleSoft}`, paddingTop: 14, display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'baseline' }}>
              <div style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.04em' }}>{s.group}</div>
              <div style={{ color: CV_TOK.ink, fontSize: 14 }}>{s.items.join(' · ')}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: CV_TOK.rule, margin: '32px 64px 0' }} />

      {/* EDUCATION */}
      <section style={{ padding: '64px 64px 32px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <span style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>03 / education</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 920 }}>
          {education.map(e => (
            <article key={e.org} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'baseline' }}>
              <div style={{ fontFamily: CV_TOK.mono, fontSize: 12, color: CV_TOK.ink2, letterSpacing: '0.04em' }}>{e.yr}</div>
              <div>
                <h3 style={{ margin: 0, font: `500 18px/1.3 ${CV_TOK.sans}` }}>{e.org}</h3>
                <p style={{ margin: '6px 0 0', color: CV_TOK.ink2, fontSize: 14 }}>{e.what}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: CV_TOK.rule, margin: '32px 64px 0' }} />

      {/* COLOPHON / DOWNLOAD CTA */}
      <section style={{ padding: '64px 64px 96px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <span style={{ fontFamily: CV_TOK.mono, fontSize: 11, color: CV_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>—</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ margin: 0, color: CV_TOK.ink2, maxWidth: 520, fontSize: 14 }}>
            References available on request. Prefer to print this? The PDF is set on a single page in the same type.
          </p>
          <button style={{
            padding: '14px 22px', background: CV_TOK.ink, color: CV_TOK.paper, border: 'none', cursor: 'pointer',
            fontFamily: CV_TOK.mono, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Download résumé · pdf  ↓
          </button>
        </div>
      </section>
    </div>
  );
}

window.CVPage = CVPage;
