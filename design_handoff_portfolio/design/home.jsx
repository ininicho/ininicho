// Direction A — Classic Swiss
// Tight 12-column-ish grid, big restful whitespace, small mono numerical
// labels, one warm accent. The "by-the-book" portfolio.

const A_TOK = {
  bg:    '#fbf7ef',
  paper: '#ffffff',
  ink:   '#191917',
  ink2:  '#6b675f',
  ink3:  '#a09b91',
  accent:'#1f70c1',
  rule:  'rgba(25,25,23,0.12)',
  ruleSoft: 'rgba(25,25,23,0.07)',
  sans:  '"Switzer", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

function ANumber({ children, style }) {
  return <span style={{ fontFamily: A_TOK.mono, fontSize: 11, letterSpacing: '0.06em', color: A_TOK.ink2, textTransform: 'uppercase', ...style }}>{children}</span>;
}

function ARule({ style }) {
  return <div style={{ height: 1, background: A_TOK.rule, ...style }} />;
}

function ASection({ num, label, children, gridGap = 80, style }) {
  return (
    <section style={{ padding: '88px 64px 0', ...style }}>
      <header style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, marginBottom: 56, alignItems: 'baseline' }}>
        <ANumber>{num}</ANumber>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, font: `500 22px/1.2 ${A_TOK.sans}`, color: A_TOK.ink, letterSpacing: '-0.01em' }}>{label}</h2>
        </div>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: gridGap }}>
        <div />
        <div>{children}</div>
      </div>
    </section>
  );
}

function HomeA() {
  const projects = [
    {
      no: '01', year: 'Aug 2025 — present', client: 'Payments Canada · via IBM',
      title: 'Real-Time Rail · Platform team',
      blurb: 'Platform & DevOps work on Canada\'s first national real-time payment system. ArgoCD multi-cluster GitOps, Istio service mesh, Vault PKI, AMQ broker federation.',
      tags: ['OpenShift', 'ArgoCD', 'Istio', 'Vault', 'F5'],
    },
    {
      no: '02', year: 'Jul — Aug 2025', client: 'IBM Wires Services · via Expertus',
      title: 'Release management remediation',
      blurb: 'Re-designed the release management strategy for the Wires Services team — safer rollbacks, fewer surprises during deploys.',
      tags: ['CI/CD', 'Release Mgmt'],
    },
    {
      no: '03', year: 'Jan 2025 — Jul 2025', client: 'IBM Payments Center',
      title: 'Cloud platform engineering',
      blurb: 'Migrated 800+ Docker images from JFrog to IBM Cloud Container Registry. Provisioned EKS add-ons via Terraform; built CloudWatch → Instana alerting.',
      tags: ['Terraform', 'AWS', 'EKS', 'IBM Cloud'],
    },
  ];

  return (
    <div style={{ background: A_TOK.bg, color: A_TOK.ink, font: `400 15px/1.55 ${A_TOK.sans}`, minHeight: '100%' }}>
      {/* TOP BAR */}
      <div style={{
        display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24,
        padding: '24px 64px', borderBottom: `1px solid ${A_TOK.rule}`,
        position: 'sticky', top: 0, background: A_TOK.bg, zIndex: 5,
      }}>
        <ANumber>idx · 2026</ANumber>
        <div style={{ display: 'flex', gap: 32, fontFamily: A_TOK.mono, fontSize: 12, color: A_TOK.ink2 }}>
          <a style={{ color: A_TOK.ink, textDecoration: 'none' }}>index</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>work</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>photography</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>cv</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>contact</a>
        </div>
        <div style={{ fontFamily: A_TOK.mono, fontSize: 12, color: A_TOK.ink2, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: '#3a8a5a', display: 'inline-block' }} />
          Toronto · live
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: '160px 64px 140px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
          <ANumber>00 / intro</ANumber>
          <div style={{ maxWidth: 980 }}>
            <h1 style={{
              margin: 0,
              font: `500 80px/1.02 ${A_TOK.sans}`,
              letterSpacing: '-0.03em',
              color: A_TOK.ink,
              textWrap: 'pretty',
            }}>
              <span style={{ color: A_TOK.ink3 }}>Nicholaus Suprapto.</span><br />
              Software engineer. Payments platforms. <span style={{ color: A_TOK.accent }}>Toronto.</span>
            </h1>
            <div style={{ display: 'flex', gap: 56, marginTop: 72, fontFamily: A_TOK.mono, fontSize: 12, color: A_TOK.ink2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <div>
                <div style={{ color: A_TOK.ink3, marginBottom: 6 }}>Role</div>
                <div style={{ color: A_TOK.ink }}>Associate DevOps</div>
              </div>
              <div>
                <div style={{ color: A_TOK.ink3, marginBottom: 6 }}>Organization</div>
                <div style={{ color: A_TOK.ink }}>IBM Payments Center</div>
              </div>
              <div>
                <div style={{ color: A_TOK.ink3, marginBottom: 6 }}>Now</div>
                <div style={{ color: A_TOK.ink }}>Payments Canada · RTR</div>
              </div>
              <div>
                <div style={{ color: A_TOK.ink3, marginBottom: 6 }}>Based</div>
                <div style={{ color: A_TOK.ink }}>Toronto, CA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ARule style={{ marginLeft: 64, marginRight: 64 }} />

      {/* ABOUT */}
      <ASection num="01" label="About">
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, maxWidth: 1080, alignItems: 'start' }}>
          <div>
            <p style={{ margin: 0, font: `400 22px/1.5 ${A_TOK.sans}`, color: A_TOK.ink, letterSpacing: '-0.005em', textWrap: 'pretty' }}>
              Waterloo CS grad, now at the IBM Payments Center. I came up through cloud-engineering co-ops — State Street, Manulife, then back to IBM full-time — and ended up specialising in the platform layer for high-availability payment infrastructure.
            </p>
            <p style={{ margin: '24px 0 0', font: `400 16px/1.65 ${A_TOK.sans}`, color: A_TOK.ink2 }}>
              Outside of work I've started taking photographs — mostly walking around Toronto. This site is half CV, half slowly-growing gallery.
            </p>
          </div>
          <PhotoBlock
            i={6}
            ratio="4/5"
            caption="Portrait · placeholder"
            label="drop image here"
            captionStyle={{ color: A_TOK.ink2 }}
          />
        </div>
      </ASection>

      {/* WORK */}
      <ASection num="02" label="Selected work" style={{ paddingTop: 120 }}>
        <div style={{ display: 'grid', gap: 0 }}>
          {projects.map((p, i) => (
            <article key={p.no} style={{
              padding: '32px 0',
              borderTop: `1px solid ${A_TOK.rule}`,
              borderBottom: i === projects.length - 1 ? `1px solid ${A_TOK.rule}` : 'none',
              display: 'grid', gridTemplateColumns: '60px 1fr 1fr auto', gap: 32, alignItems: 'baseline',
            }}>
              <ANumber>{p.no}</ANumber>
              <div>
                <div style={{ font: `500 22px/1.2 ${A_TOK.sans}`, color: A_TOK.ink, letterSpacing: '-0.01em' }}>{p.title}</div>
                <div style={{ marginTop: 6, fontFamily: A_TOK.mono, fontSize: 11, letterSpacing: '0.06em', color: A_TOK.ink2, textTransform: 'uppercase' }}>{p.client} · {p.year}</div>
              </div>
              <p style={{ margin: 0, color: A_TOK.ink2, fontSize: 14, lineHeight: 1.55, maxWidth: 380 }}>{p.blurb}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 220 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ fontFamily: A_TOK.mono, fontSize: 11, padding: '4px 8px', border: `1px solid ${A_TOK.rule}`, borderRadius: 99, color: A_TOK.ink2 }}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </ASection>

      {/* PHOTOGRAPHY */}
      <ASection num="03" label="Photography" style={{ paddingTop: 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
          <p style={{ margin: 0, color: A_TOK.ink2, maxWidth: 480, fontSize: 14 }}>
            A working selection. Mostly 35mm, mostly Toronto, occasionally further. Updated when I find one I like.
          </p>
          <a style={{ fontFamily: A_TOK.mono, fontSize: 12, color: A_TOK.ink, textDecoration: 'none', letterSpacing: '0.04em' }}>
            view all (52) →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[0, 4, 7, 12].map((i, k) => (
            <PhotoBlock
              key={i}
              i={i}
              ratio="4/5"
              caption={['Kensington, 04 · 25', 'Union, 02 · 25', 'Trinity Bellwoods, 11 · 24', 'Don Valley, 09 · 24'][k]}
              label={['001', '014', '022', '038'][k]}
              captionStyle={{ color: A_TOK.ink2 }}
            />
          ))}
        </div>
      </ASection>

      {/* CONTACT */}
      <ASection num="04" label="Contact" style={{ paddingTop: 120, paddingBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, maxWidth: 1000 }}>
          <div>
            <p style={{ margin: 0, font: `500 36px/1.15 ${A_TOK.sans}`, color: A_TOK.ink, letterSpacing: '-0.02em', textWrap: 'pretty' }}>
              The fastest way is email<span style={{ color: A_TOK.accent }}>.</span>
            </p>
            <a style={{ display: 'inline-block', marginTop: 28, padding: '14px 22px', border: `1px solid ${A_TOK.ink}`, color: A_TOK.ink, textDecoration: 'none', fontFamily: A_TOK.mono, fontSize: 13, letterSpacing: '0.03em' }}>
              nsuprapt@uwaterloo.ca  ↗
            </a>
          </div>
          <dl style={{ margin: 0, fontFamily: A_TOK.mono, fontSize: 12, color: A_TOK.ink2, lineHeight: 2, display: 'grid', gridTemplateColumns: '80px 1fr', columnGap: 16, rowGap: 0 }}>
            <dt>GITHUB</dt><dd style={{ margin: 0, color: A_TOK.ink }}>github.com/nicholaus</dd>
            <dt>LINKEDIN</dt><dd style={{ margin: 0, color: A_TOK.ink }}>in/nicholaus-suprapto</dd>
            <dt>RESUME</dt><dd style={{ margin: 0, color: A_TOK.ink }}>resume.pdf  ↓</dd>
            <dt>LOCATION</dt><dd style={{ margin: 0, color: A_TOK.ink }}>Toronto, ON</dd>
          </dl>
        </div>
      </ASection>

      <ARule style={{ marginLeft: 64, marginRight: 64 }} />

      <footer style={{ padding: '32px 64px', display: 'flex', justifyContent: 'space-between', fontFamily: A_TOK.mono, fontSize: 11, color: A_TOK.ink3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span>© 2026 — built by hand</span>
        <span>v 1.0 · last updated may 2026</span>
      </footer>
    </div>
  );
}

window.HomeA = HomeA;
