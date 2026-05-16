// Photography subpage — masonry-ish grid that "loads more" as you scroll.
// Styled against Direction A's palette. The variety in column widths gives
// the page a quiet editorial rhythm without going full Pinterest.

const G_TOK = {
  bg:    '#fbf7ef',
  paper: '#ffffff',
  ink:   '#191917',
  ink2:  '#6b675f',
  ink3:  '#a09b91',
  accent:'#1f70c1',
  rule:  'rgba(25,25,23,0.12)',
  sans:  '"Switzer", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

function GalleryPage() {
  // Spread the 24 placeholder photos across an irregular 3-col layout, then
  // a "load more" affordance, then a faded second batch (showing the
  // infinite scroll behavior).
  const COLS = 3;
  const photos = Array.from({ length: 18 }, (_, k) => ({
    i: k,
    place: ['Kensington', 'Spadina', 'Union', 'Don Valley', 'Bellwoods', 'Lakeshore', 'Annex', 'Distillery', 'Roncesvalles'][k % 9],
    when: ['05·25','04·25','04·25','03·25','03·25','02·25','01·25','12·24','11·24','11·24','10·24','09·24','08·24','07·24','06·24','05·24','04·24','03·24'][k],
    id: String(k + 1).padStart(3, '0'),
    ratio: ['4/5', '3/4', '1/1', '4/3', '3/4', '4/5', '1/1', '3/4', '4/5'][k % 9],
  }));
  // Stripe them into columns so we get a masonry-ish stagger.
  const cols = Array.from({ length: COLS }, () => []);
  photos.forEach((p, k) => cols[k % COLS].push(p));

  return (
    <div style={{ background: G_TOK.bg, color: G_TOK.ink, font: `400 15px/1.55 ${G_TOK.sans}`, minHeight: '100%' }}>
      {/* TOP BAR */}
      <header style={{
        display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24,
        padding: '24px 64px', borderBottom: `1px solid ${G_TOK.rule}`, background: G_TOK.bg,
      }}>
        <span style={{ fontFamily: G_TOK.mono, fontSize: 11, color: G_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>idx · 2026</span>
        <nav style={{ display: 'flex', gap: 32, fontFamily: G_TOK.mono, fontSize: 12, color: G_TOK.ink2 }}>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>index</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>work</a>
          <a style={{ color: G_TOK.ink, textDecoration: 'none' }}>photography</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>cv</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>contact</a>
        </nav>
        <span style={{ fontFamily: G_TOK.mono, fontSize: 12, color: G_TOK.ink2 }}>52 photos · since 2023</span>
      </header>

      {/* PAGE TITLE */}
      <section style={{ padding: '88px 64px 56px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <span style={{ fontFamily: G_TOK.mono, fontSize: 11, color: G_TOK.ink2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>03 / photography</span>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, font: `500 48px/1.05 ${G_TOK.sans}`, letterSpacing: '-0.025em', maxWidth: 720, textWrap: 'pretty' }}>
            Things I've noticed while walking around<span style={{ color: G_TOK.accent }}>.</span>
          </h1>
          <div style={{ display: 'flex', gap: 14, fontFamily: G_TOK.mono, fontSize: 11, color: G_TOK.ink2, letterSpacing: '0.04em' }}>
            <button style={btnG(true)}>All</button>
            <button style={btnG()}>Toronto</button>
            <button style={btnG()}>Travel</button>
            <button style={btnG()}>Film</button>
            <button style={btnG()}>Digital</button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ padding: '0 64px 56px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <div />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 24 }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {col.map(p => (
                <PhotoBlock
                  key={p.i}
                  i={p.i}
                  ratio={p.ratio}
                  caption={`${p.place} · ${p.when}`}
                  label={`#${p.id}`}
                  captionStyle={{ color: G_TOK.ink2 }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* LOAD MORE */}
      <section style={{ padding: '32px 64px 0', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
          <div style={{ height: 1, flex: 1, background: G_TOK.rule }} />
          <button style={{
            padding: '14px 28px',
            background: G_TOK.ink, color: G_TOK.paper, border: 'none', cursor: 'pointer',
            fontFamily: G_TOK.mono, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Load 18 more
          </button>
          <div style={{ height: 1, flex: 1, background: G_TOK.rule }} />
        </div>
        <div />
        <p style={{ margin: '14px 0 0', textAlign: 'center', fontFamily: G_TOK.mono, fontSize: 11, color: G_TOK.ink3, letterSpacing: '0.04em' }}>
          18 of 52 · scroll or click to continue
        </p>
      </section>

      {/* FADED PREVIEW OF NEXT BATCH (visual hint that it's an infinite list) */}
      <section style={{
        padding: '56px 64px 24px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24,
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%)',
      }}>
        <div />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 24 }}>
          {[19, 20, 21].map(i => (
            <PhotoBlock key={i} i={i} ratio="4/5" />
          ))}
        </div>
      </section>

      <footer style={{ padding: '16px 64px 32px', display: 'flex', justifyContent: 'space-between', fontFamily: G_TOK.mono, fontSize: 11, color: G_TOK.ink3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span>← back to index</span>
        <span>52 photos · updated 05·26</span>
      </footer>
    </div>
  );
}

function btnG(active) {
  return {
    padding: '6px 12px',
    border: active ? `1px solid ${G_TOK.ink}` : `1px solid ${G_TOK.rule}`,
    background: active ? G_TOK.ink : 'transparent',
    color: active ? G_TOK.paper : G_TOK.ink2,
    fontFamily: G_TOK.mono, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
    cursor: 'pointer', borderRadius: 99,
  };
}

window.GalleryPage = GalleryPage;
