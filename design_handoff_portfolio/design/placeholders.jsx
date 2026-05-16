// Photo placeholder helper — generates subtle duotone blocks with optional
// grain and a small mono caption beneath. Drop a real <img> in later.

const PHOTO_MOODS = [
  { name: 'morning fog',    from: '#d4d8d4', to: '#a5ada6' },
  { name: 'urban dusk',     from: '#5a5e66', to: '#2a2d33' },
  { name: 'shoreline',      from: '#a8b8b8', to: '#5e7079' },
  { name: 'forest interior',from: '#4a5a3d', to: '#1f2a1c' },
  { name: 'sunlit wall',    from: '#d8c2a0', to: '#a07c54' },
  { name: 'concrete',       from: '#b8b2a6', to: '#7a766c' },
  { name: 'window light',   from: '#e8e3d4', to: '#a89a7c' },
  { name: 'night street',   from: '#3a3a44', to: '#1a1c22' },
  { name: 'autumn',         from: '#c47a3e', to: '#6a3a1f' },
  { name: 'snowdrift',      from: '#eceae4', to: '#b8b5ad' },
  { name: 'rain on glass',  from: '#7e8a92', to: '#3a4248' },
  { name: 'low tide',       from: '#9aa49a', to: '#5e6864' },
  { name: 'kitchen',        from: '#dac8a8', to: '#8a7350' },
  { name: 'subway',         from: '#46484e', to: '#1c1e22' },
  { name: 'sunset highway', from: '#c47a5a', to: '#5a3a3e' },
  { name: 'overgrowth',     from: '#7a8a5e', to: '#3a4a2a' },
  { name: 'studio',         from: '#e6e2d8', to: '#aaa498' },
  { name: 'harbor',         from: '#8aa0aa', to: '#3a4a56' },
  { name: 'mountain',       from: '#a4aab0', to: '#5a6068' },
  { name: 'desert noon',    from: '#dabe96', to: '#8a6a4a' },
  { name: 'gallery wall',   from: '#e0dcd2', to: '#9a948a' },
  { name: 'overcast',       from: '#c4c6c8', to: '#7c8084' },
  { name: 'firelight',      from: '#c4724a', to: '#52261c' },
  { name: 'parking lot',    from: '#6c6e72', to: '#2c2e32' },
];

// Stable photo by index — same `i` always yields same swatch.
function PhotoBlock({ i = 0, ratio = '4/5', caption, label, style = {}, rounded = 0, captionStyle, grain = true }) {
  const m = PHOTO_MOODS[i % PHOTO_MOODS.length];
  return (
    <figure style={{ margin: 0, ...style }}>
      <div
        style={{
          aspectRatio: ratio,
          width: '100%',
          background: `linear-gradient(${145 + (i * 23) % 60}deg, ${m.from} 0%, ${m.to} 100%)`,
          borderRadius: rounded,
          position: 'relative',
          overflow: 'hidden',
        }}>
        {grain && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
            mixBlendMode: 'overlay', opacity: 0.55, pointerEvents: 'none',
          }} />
        )}
        {/* very faint vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 80% at 50% 30%, transparent 60%, rgba(0,0,0,0.22) 100%)',
          pointerEvents: 'none',
        }} />
      </div>
      {(caption || label) && (
        <figcaption style={{
          marginTop: 10,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 11,
          letterSpacing: '0.04em',
          color: 'rgba(0,0,0,0.55)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          ...captionStyle,
        }}>
          <span>{caption}</span>
          {label && <span>{label}</span>}
        </figcaption>
      )}
    </figure>
  );
}

window.PhotoBlock = PhotoBlock;
window.PHOTO_MOODS = PHOTO_MOODS;
