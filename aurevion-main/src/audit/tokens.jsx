// Shared design tokens for component previews — match Aurevion dark UI.
const T = {
  bg: '#000',
  surface: '#141414',
  surface2: '#1c1c1c',
  border: '#262626',
  borderSoft: 'rgba(255,255,255,0.06)',
  text: '#fafafa',
  textDim: '#a1a1a1',
  textMute: '#6b6b6b',
  accent: '#FF6E50',
  accentDim: 'rgba(255,110,80,0.14)',
  accentBorder: 'rgba(255,110,80,0.45)',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#a855f7',
  cyan: '#22d3ee',
};

// Sans + mono fonts. Geist is fresh; mono for labels/captions.
const FONTS = {
  sans: '"Geist", -apple-system, "SF Pro Display", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

// Helper: small inline tone span
function Tone({ color, children, weight = 600 }) {
  return <span style={{ color, fontWeight: weight }}>{children}</span>;
}

// Frame helpers — re-usable inside iPhone preview
function PreviewBase({ children, dark = true, scroll = false }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.text,
      fontFamily: FONTS.sans,
      padding: '8px 20px 20px',
      boxSizing: 'border-box',
      overflowY: scroll ? 'auto' : 'hidden',
    }}>
      {children}
    </div>
  );
}

function H1({ children }) {
  return (
    <h2 style={{
      fontSize: 28, fontWeight: 700, letterSpacing: -0.5,
      margin: '0 0 4px', color: T.text,
    }}>{children}</h2>
  );
}

function Caption({ children }) {
  return (
    <p style={{
      fontSize: 13, lineHeight: 1.5, color: T.textDim,
      margin: '0 0 16px',
    }}>{children}</p>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: FONTS.mono, fontSize: 10, fontWeight: 500,
      letterSpacing: 1.4, textTransform: 'uppercase',
      color: T.textMute, marginBottom: 10,
    }}>{children}</div>
  );
}

// Material Symbols Rounded — Google Icons
function MIcon({ name, size = 20, color = 'currentColor', fill = 0, weight = 400, style = {} }) {
  return (
    <span
      className="material-symbols-rounded"
      style={{
        fontFamily: '"Material Symbols Rounded"',
        fontSize: size, color, lineHeight: 1,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${Math.max(20, Math.min(48, size))}`,
        userSelect: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }}>{name}</span>
  );
}

Object.assign(window, { T, FONTS, Tone, PreviewBase, H1, Caption, SectionLabel, MIcon });
