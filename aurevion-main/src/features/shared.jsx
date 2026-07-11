// Shared feature scaffolding — phone shell, proposed-aesthetic primitives.
// Reuse the mono-instrumentation visual language we set in Design Direction.

const F = {
  bg: '#000',
  surface: '#0d0d0d',
  surface2: '#161616',
  border: 'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.04)',
  text: '#fafafa',
  dim: '#a1a1a1',
  mute: '#6b6b6b',
  faint: '#3f3f3f',
  accent: '#FF6E50',
  accentHot: '#FF5A1F',
  green: '#4ade80',
  red: '#f87171'
};

const FF = {
  sans: '"Geist", -apple-system, system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace'
};

// ─────────── Phone shell ───────────
function Phone({ children, label, group, statusTime = '9:41' }) {
  return (
    <div style={{
      width: 402, height: 874, borderRadius: 56,
      background: F.bg, color: F.text, overflow: 'hidden',
      fontFamily: FF.sans, position: 'relative',
      boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 9px #1a1a1a, 0 0 0 10px #2a2a2a',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 36px 0', fontFamily: FF.sans, fontSize: 15, fontWeight: 600,
        zIndex: 50, pointerEvents: 'none'
      }}>
        <span>{statusTime}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* signal */}
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
            <rect x="0" y="7" width="3" height="4" rx="0.5" />
            <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
            <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" />
            <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
          </svg>
          {/* battery */}
          <svg width="25" height="12" viewBox="0 0 25 12">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.4" fill="none" />
            <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
            <path d="M23 4v4c.8-.3 1.5-1.3 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </span>
      </div>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 124, height: 36, borderRadius: 22, background: '#000', zIndex: 60
      }} />
      <div style={{ flex: 1, minHeight: 0, paddingTop: 54, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.35)'
      }} />
    </div>);

}

// ─────────── Page chrome ───────────
function FNavBar({ title, leading, trailing }) {
  return (
    <div style={{
      padding: '12px 24px 16px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 48 }}>
        {leading}
      </div>
      {title &&
      <div style={{ fontFamily: FF.mono, fontSize: 11, letterSpacing: 1.4, color: F.mute, textTransform: 'uppercase' }}>
          {title}
        </div>
      }
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 48, justifyContent: 'flex-end' }}>
        {trailing}
      </div>
    </div>);

}

// Mono label all caps
function FLabel({ children, color = F.mute, size = 10, mb = 6, mt = 0, letter = 1.4 }) {
  return (
    <div style={{
      fontFamily: FF.mono, fontSize: size, letterSpacing: letter,
      color, textTransform: 'uppercase', marginBottom: mb, marginTop: mt
    }}>{children}</div>);

}

// Mono inline value
function FMono({ children, size = 11, color = F.text, letter = 1 }) {
  return (
    <span style={{ fontFamily: FF.mono, fontSize: size, color, letterSpacing: letter }}>
      {children}
    </span>);

}

// Big thin numeral with optional super-unit
function FNum({ children, size = 56, weight = 200, unit, color = F.text, unitColor }) {
  return (
    <span style={{
      fontSize: size, fontWeight: weight, letterSpacing: -size * 0.028,
      lineHeight: 0.95, color, fontFamily: "\"Geist Mono\""
    }}>
      {children}
      {unit && <span style={{
        fontSize: Math.max(11, size * 0.22), fontFamily: FF.mono, fontWeight: 400,
        color: unitColor || F.mute, marginLeft: 5, verticalAlign: 'super', letterSpacing: 0
      }}>{unit}</span>}
    </span>);

}

// Textured fill (orange hatching) — animated reveal
function FTexBar({ pct = 70, height = 22, color = F.accent, track = 'rgba(255,255,255,0.05)', radius = 6, animate = true }) {
  const [width, setWidth] = React.useState(animate ? 0 : pct);
  React.useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct, animate]);
  return (
    <div style={{
      height, borderRadius: radius, background: track, overflow: 'hidden'
    }}>
      <div style={{
        width: `${width}%`, height: '100%', borderRadius: radius,
        background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${color}`,
        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }} />
    </div>);

}

// Segmented gauge bar — staggered reveal
function FSegBar({ pct = 70, segments = 18, height = 56, color = F.accent, animate = true }) {
  const lit = Math.round(segments * pct / 100);
  const [revealed, setRevealed] = React.useState(animate ? 0 : lit);
  React.useEffect(() => {
    if (!animate) return;
    let frame = 0;
    const step = () => {
      frame++;
      setRevealed(Math.min(frame, lit));
      if (frame < lit) setTimeout(step, 40);
    };
    const t = setTimeout(step, 100);
    return () => clearTimeout(t);
  }, [lit, animate]);
  return (
    <div style={{ display: 'flex', gap: 3, height, alignItems: 'flex-end' }}>
      {Array.from({ length: segments }).map((_, i) => {
        const on = i < revealed;
        return (
          <div key={i} style={{
            flex: 1, borderRadius: 2,
            background: on ? color : 'rgba(255,255,255,0.08)',
            height: on ? '100%' : '60%',
            transition: 'height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease'
          }} />
        );
      })}
    </div>);

}

// Scale ticks
function FScale({ marks = [0, 50, 100], color = F.accent, suffix = '' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontFamily: FF.mono, fontSize: 10, letterSpacing: 1, marginBottom: 6
    }}>
      {marks.map((m, i) =>
      <span key={i} style={{ color: i === marks.length - 1 ? F.mute : color }}>{m}{suffix}</span>
      )}
    </div>);

}

// Inline icon SVG helper
function FIcon({ path, size = 18, color = 'currentColor', stroke = 1.8, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill !== 'none' ? 'none' : color}
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {typeof path === 'string' ? <path d={path} /> : path}
    </svg>);

}

const ICONS = {
  back: 'M19 12H5 M12 19l-7-7 7-7',
  fwd: 'M5 12h14 M12 5l7 7-7 7',
  close: 'M18 6L6 18 M6 6l12 12',
  plus: 'M12 5v14 M5 12h14',
  minus: 'M5 12h14',
  check: 'M20 6L9 17l-5-5',
  more: 'M5 12h.01 M12 12h.01 M19 12h.01',
  search: 'M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M21 21l-4.3-4.3',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  dumb: 'M14.4 14.4 9.6 9.6 M18.657 21.485l-2.829-2.829 M2.343 6.343l2.829 2.829 M21.485 18.657l-1.414 1.414 M3.515 5.929 2.1 7.343 M21.9 16.657l-2.121 2.121 M5.929 3.515 7.343 2.1 M17.121 5.929 20.485 9.293 M3.515 14.071 6.879 17.435',
  fridge: 'M5 3h14v18H5z M5 9h14 M9 5v2 M9 12v3',
  meal: 'M3 11h18 M5 11V8a7 7 0 0 1 14 0v3 M4 21h16l-1-10H5l-1 10z',
  cart: 'M2 4h2l3 12h11l2-8H6 M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  chart: 'M3 3v18h18 M7 15l3-3 4 4 7-7',
  goal: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  timer: 'M12 8v4l3 2 M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20 M9 2h6',
  pause: 'M10 4h-2v16h2V4z M16 4h-2v16h2V4z',
  play: 'M5 3l14 9-14 9V3z',
  knife: 'M3 13l9-9 9 9-9 9-9-9z M14 14l4 4 M3 13l5 5',
  pan: 'M3 12h18 M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6 M19 8h3l-1 4',
  oven: 'M4 4h16v16H4z M4 9h16 M7 13h6 M16 14v.01',
  fire: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0',
  bowl: 'M2 12h20 M3 12c0 5 4 9 9 9s9-4 9-9',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  trend_up: 'M23 6l-9.5 9.5-5-5L1 18',
  trend_dn: 'M23 18l-9.5-9.5-5 5L1 6',
  swap: 'M7 16V4 M3 8l4-4 4 4 M17 8v12 M21 16l-4 4-4-4',
  drag: 'M9 5h.01 M9 12h.01 M9 19h.01 M15 5h.01 M15 12h.01 M15 19h.01',
  sparkle: 'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',
  expand: 'M3 9V3h6 M21 9V3h-6 M3 15v6h6 M21 15v6h-6'
};

// Tag chip (mono, restrained)
function FTag({ children, tone = 'neutral', size = 'sm', icon }) {
  const palette = {
    neutral: { bg: 'rgba(255,255,255,0.06)', fg: F.text },
    accent: { bg: F.accent, fg: '#1a0f0a' },
    green: { bg: 'rgba(74,222,128,0.10)', fg: F.green },
    mute: { bg: 'transparent', fg: F.mute, border: F.borderSoft },
    red: { bg: 'rgba(248,113,113,0.10)', fg: F.red }
  };
  const p = palette[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '3px 8px' : '5px 10px',
      borderRadius: 999, background: p.bg, color: p.fg,
      border: p.border ? `1px solid ${p.border}` : 'none',
      fontFamily: FF.mono, fontSize: size === 'sm' ? 10 : 11,
      fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase',
      whiteSpace: 'nowrap', flexShrink: 0
    }}>
      {icon && icon}
      {children}
    </span>);

}

// Primary button — refined system
// variants: primary | secondary | ghost | danger
// sizes: sm | md | lg
// labelStyle: 'mono' (default — uppercase) | 'sans' (sentence case)
function FBtn({
  children, onClick, style = {},
  variant, primary, // legacy `primary` boolean kept for back-compat
  size = 'md', full, icon, iconLeading, loading,
  labelStyle = 'mono', disabled
}) {
  const v = variant || (primary ? 'primary' : 'secondary');
  const [hover, setHover] = React.useState(false);

  // ── EDITORIAL ROW ─────────────────────────────────────
  // Full-bleed, no fill, top divider, optional step number, large arrow.
  if (v === 'editorial') {
    return (
      <button
        onClick={loading || disabled ? undefined : onClick}
        data-stay={style && style['data-stay']}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          borderTop: `1px solid ${F.border}`, padding: '20px 0',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          color: F.text,
          fontFamily: FF.mono, fontSize: 13, fontWeight: 600,
          letterSpacing: 1.4, textTransform: 'uppercase',
          textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
          opacity: disabled ? 0.4 : 1
        }}>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          {style && style.step &&
            <span style={{ color: F.accent }}>{style.step} ·</span>
          }
          <span>{children}</span>
        </span>
        <span style={{
          color: F.accent, display: 'inline-flex',
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform .15s ease'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </button>
    );
  }

  // ── DIRECTIONAL SPLIT ─────────────────────────────────
  // Filled mono pill with a separated arrow cell. Committed action.
  if (v === 'split') {
    return (
      <button
        onClick={loading || disabled ? undefined : onClick}
        data-stay={style && style['data-stay']}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: 56, padding: 0,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          background: hover ? '#FF8166' : F.accent, color: '#1a0f0a',
          border: 'none', borderRadius: 8, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 56px', alignItems: 'stretch',
          fontFamily: FF.mono, fontSize: 12, fontWeight: 700,
          letterSpacing: 1.4, textTransform: 'uppercase',
          width: full ? '100%' : 'auto',
          transition: 'background .14s ease',
          opacity: disabled ? 0.4 : 1
        }}>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
          {iconLeading && <FIcon path={iconLeading} size={14} stroke={2.4} color="#1a0f0a"/>}
          {loading ?
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                border: '2px solid rgba(26,15,10,0.3)', borderTopColor: '#1a0f0a',
                animation: 'fbtnSpin 0.7s linear infinite'
              }}/>
              <span>WORKING</span>
            </span>
            : children}
        </span>
        <span style={{
          background: hover ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .14s ease'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a0f0a"
               strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
        <style>{`@keyframes fbtnSpin { to { transform: rotate(360deg); } }`}</style>
      </button>
    );
  }

  const [active, setActive] = React.useState(false);

  const sizes = {
    sm: { pad: '8px 14px', fs: 11, lh: 30, gap: 6, radius: 6, iconSize: 12 },
    md: { pad: '12px 18px', fs: 12, lh: 44, gap: 8, radius: 8, iconSize: 14 },
    lg: { pad: '16px 22px', fs: 13, lh: 56, gap: 10, radius: 8, iconSize: 16 }
  };
  const sz = sizes[size];

  const palette = {
    primary: {
      bg: '#FF6E50', bgHover: '#FF8166', bgActive: '#E85A3E',
      fg: '#1a0f0a', border: 'transparent'
    },
    secondary: {
      bg: 'rgba(255,255,255,0.06)', bgHover: 'rgba(255,255,255,0.10)', bgActive: 'rgba(255,255,255,0.04)',
      fg: F.text, border: 'transparent'
    },
    ghost: {
      bg: 'transparent', bgHover: 'rgba(255,255,255,0.04)', bgActive: 'rgba(255,255,255,0.02)',
      fg: F.dim, border: F.borderSoft
    },
    danger: {
      bg: 'transparent', bgHover: 'rgba(248,113,113,0.08)', bgActive: 'rgba(248,113,113,0.04)',
      fg: '#f87171', border: 'rgba(248,113,113,0.3)'
    }
  };
  const p = palette[v];
  const bg = disabled ? 'rgba(255,255,255,0.04)' : active ? p.bgActive : hover ? p.bgHover : p.bg;
  const fg = disabled ? F.mute : p.fg;

  const isMono = labelStyle === 'mono';
  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {setHover(false);setActive(false);}}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        padding: sz.pad,
        minHeight: sz.lh,
        borderRadius: sz.radius,
        border: p.border === 'transparent' ? 'none' : `1px solid ${p.border}`,
        background: bg, color: fg,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontFamily: isMono ? FF.mono : FF.sans,
        fontSize: isMono ? sz.fs : sz.fs + 2,
        fontWeight: 600,
        letterSpacing: isMono ? 1.4 : 0,
        textTransform: isMono ? 'uppercase' : 'none',
        width: full ? '100%' : 'auto',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sz.gap,
        transition: 'background .12s ease, color .12s ease, transform .08s ease',
        transform: active ? 'translateY(0.5px)' : 'translateY(0)',
        opacity: disabled ? 0.5 : 1,
        ...style
      }}>
      {loading ?
      <div style={{
        width: sz.iconSize, height: sz.iconSize, borderRadius: '50%',
        border: `1.6px solid ${fg}33`, borderTopColor: fg,
        animation: 'fbtnSpin 0.7s linear infinite'
      }} /> :
      iconLeading && <FIcon path={iconLeading} size={sz.iconSize} stroke={2.2} color={fg} />
      }
      {children}
      {icon && !loading && <FIcon path={icon} size={sz.iconSize} stroke={2.2} color={fg} />}
      <style>{`@keyframes fbtnSpin { to { transform: rotate(360deg); } }`}</style>
    </button>);

}

// Icon-only round button (e.g. nav arrows)
function FIconBtn({ icon, onClick, size = 40, variant = 'secondary' }) {
  const [hover, setHover] = React.useState(false);
  const bg = variant === 'primary' ?
  hover ? '#FF8166' : F.accent :
  hover ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)';
  const fg = variant === 'primary' ? '#1a0f0a' : F.text;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: size, borderRadius: '50%', border: 'none',
        background: bg, color: fg, cursor: 'pointer',
        display: 'grid', placeItems: 'center',
        transition: 'background .12s ease'
      }}>
      <FIcon path={icon} size={Math.max(16, size * 0.4)} stroke={2} />
    </button>);

}

// Tab bar (proposed mono icons-only)
function FTabBar({ active = 0 }) {
  const tabs = [
  { i: ICONS.goal },
  { i: ICONS.meal },
  { i: ICONS.fire, big: true },
  { i: ICONS.chart },
  { i: ICONS.dumb }];

  return (
    <div style={{ padding: '10px 16px 26px', flexShrink: 0 }}>
      <div style={{
        height: 56, borderRadius: 999,
        background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(16px)',
        border: `1px solid ${F.borderSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around'
      }}>
        {tabs.map((t, i) =>
        <div key={i} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: i === active ? F.accent : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: i === active ? '#1a0f0a' : F.dim
        }}>
            <FIcon path={t.i} size={20} stroke={1.8} />
          </div>
        )}
      </div>
    </div>);

}

// Section block with mono label header
function FSection({ label, action, children, mb = 18, mt = 0, style = {} }) {
  return (
    <div style={{ marginBottom: mb, marginTop: mt, ...style }}>
      {(label || action) &&
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          {label && <FLabel mb={0}>{label}</FLabel>}
          {action && action}
        </div>
      }
      {children}
    </div>);

}

// ─── FToolbar ──────────────────────────────────────────
// 3-cell persistent bottom bar. cells = [{ icon, label, primary, onClick, stay }]
function FToolbar({ cells = [] }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${F.borderSoft}`,
      borderRadius: 10, padding: 4, display: 'grid', gap: 4, height: 56,
      gridTemplateColumns: cells.map(c => c.primary ? '1.6fr' : '1fr').join(' ')
    }}>
      {cells.map((c, i) => <FToolbarCell key={i} cell={c}/>)}
    </div>
  );
}

function FToolbarCell({ cell: c }) {
  const [h, setH] = React.useState(false);
  const isP = !!c.primary;
  const bg = isP
    ? (h ? '#FF8166' : F.accent)
    : (h ? 'rgba(255,255,255,0.06)' : 'transparent');
  const fg = isP ? '#1a0f0a' : F.dim;
  return (
    <button
      onClick={c.onClick}
      data-stay={c.stay ? 'true' : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: bg, color: fg, border: 'none', cursor: 'pointer',
        borderRadius: 8, padding: 4,
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        transition: 'background .12s ease'
      }}>
      {c.icon && <FIcon path={c.icon} size={isP ? 16 : 14} stroke={isP ? 2.2 : 1.9} color={fg}/>}
      <span style={{
        fontFamily: FF.mono, fontSize: isP ? 12 : 11, letterSpacing: 1.4,
        color: fg, textTransform: 'uppercase',
        fontWeight: isP ? 700 : 600
      }}>{c.label}</span>
    </button>
  );
}

// ─── FJewel ────────────────────────────────────────────
// Iridescent hero button — used sparingly. Pass `glyph` (SVG path d) + label.
function FJewel({ glyph, children, onClick, 'data-stay': dataStay, compact }) {
  const size = compact ? 48 : 56;
  return (
    <button
      onClick={onClick}
      data-stay={dataStay}
      className="aurevion-jewel"
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        height: size + 8, padding: `4px ${children ? 24 : 4}px 4px 4px`,
        border: 'none', borderRadius: 999, cursor: 'pointer',
        background: 'linear-gradient(180deg, #232325 0%, #141416 50%, #0a0a0c 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.08),' +
          'inset 0 -1px 0 rgba(0,0,0,0.6),' +
          '0 6px 20px rgba(0,0,0,0.45)',
        color: '#fafafa', fontFamily: FF.sans, fontSize: 15, fontWeight: 500,
        letterSpacing: -0.01
      }}>
      <span className="aurevion-jewel-icon" style={{
        position: 'relative', width: size, height: size, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <span className="aurevion-jewel-face" style={{
          position: 'relative', width: 'calc(100% - 7px)', height: 'calc(100% - 7px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 30%, #2a2a2d 0%, #131316 55%, #0a0a0b 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 5px rgba(0,0,0,0.7)'
        }}>
          <svg width="44%" height="44%" viewBox="0 0 24 24" fill="white"
               style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
            <path d={glyph}/>
          </svg>
        </span>
      </span>
      {children && <span style={{ marginLeft: 14, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{children}</span>}
    </button>
  );
}

function FPulseBtn({ icon = ICONS.play, onClick, size = 44, color = F.accent, ...props }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, ...props.style }}>
      <div className="f-pulse-ring" style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        border: `1.5px solid ${color}`,
        pointerEvents: 'none'
      }}/>
      <button
        onClick={onClick}
        style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: color, color: '#1a0f0a',
          display: 'grid', placeItems: 'center',
          boxShadow: `0 4px 16px ${color}55`,
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'transform 0.1s ease',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FIcon path={icon} size={Math.round(size * 0.38)} color="#1a0f0a" stroke={2.4}/>
      </button>
    </div>
  );
}

// Single-injection jewel styles (ring + spin + glow)
if (typeof document !== 'undefined' && !document.getElementById('aurevion-jewel-styles')) {
  const s = document.createElement('style');
  s.id = 'aurevion-jewel-styles';
  s.textContent = `
    .aurevion-jewel-icon::before {
      content: ''; position: absolute; inset: 0; border-radius: 50%; padding: 2.5px;
      background: conic-gradient(from 0deg,
        #000000, #FF6E50, #ffffff, #FF6E50,
        #000000, #FF6E50, #ffffff, #FF6E50, #000000);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      filter: saturate(1.4) brightness(1.1);
      animation: aurevionJewelSpin 6s linear infinite;
    }
    .aurevion-jewel-icon::after {
      content: ''; position: absolute; inset: -6px; border-radius: 50%;
      background: conic-gradient(from 0deg,
        #000000, #FF6E50, #ffffff, #FF6E50,
        #000000, #FF6E50, #ffffff, #FF6E50, #000000);
      filter: blur(10px) saturate(1.6); opacity: 0.45; z-index: -1;
      animation: aurevionJewelSpin 6s linear infinite;
    }
    @keyframes aurevionJewelSpin { to { transform: rotate(360deg); } }
    .aurevion-jewel:hover { transform: translateY(-1px); }
    .aurevion-jewel:active { transform: translateY(1px) scale(0.99); }
    .aurevion-jewel { transition: transform .15s ease; }
    @media (prefers-reduced-motion: reduce) {
      .aurevion-jewel-icon::before, .aurevion-jewel-icon::after { animation: none; }
    }
  `;
  document.head.appendChild(s);
}

// ──���──────── Staggered entrance ───────────
// Wraps children with a fade+slide-in, staggered per child.
function FStagger({ children, delay = 50, distance = 8, duration = 0.35 }) {
  const items = React.Children.toArray(children);
  return items.map((child, i) => (
    <div key={child.key || i} style={{
      animation: `fStaggerIn ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms both`,
    }}>
      {child}
    </div>
  ));
}

// Inject stagger keyframe once
if (typeof document !== 'undefined' && !document.getElementById('f-stagger-css')) {
  const s = document.createElement('style');
  s.id = 'f-stagger-css';
  s.textContent = `
    @keyframes fStaggerIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes fStaggerIn {
        from { opacity: 1; transform: none; }
        to   { opacity: 1; transform: none; }
      }
    }
    @keyframes fPulse {
      0%   { transform: scale(1); opacity: 0.6; }
      50%  { transform: scale(1.35); opacity: 0; }
      100% { transform: scale(1.35); opacity: 0; }
    }
    .f-pulse-ring {
      animation: fPulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;
  document.head.appendChild(s);
}

// ─────────── Error Boundary ───────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 32, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', textAlign: 'center', color: F.text,
          fontFamily: FF.sans
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(248,113,113,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16
          }}>
            <FIcon path={ICONS.close} size={20} color={F.red} stroke={2.4} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Something went wrong</div>
          <div style={{
            fontFamily: FF.mono, fontSize: 11, color: F.mute,
            maxWidth: 300, wordBreak: 'break-word'
          }}>
            {this.state.error.message}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 20, padding: '8px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: F.dim, cursor: 'pointer',
              fontFamily: FF.mono, fontSize: 11, letterSpacing: 1,
              textTransform: 'uppercase'
            }}
          >Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

Object.assign(window, {
  F, FF, ICONS,
  Phone, FNavBar, FLabel, FMono, FNum,
  FTexBar, FSegBar, FScale, FIcon, FTag, FBtn, FIconBtn, FTabBar, FSection,
  FToolbar, FJewel, FStagger, FPulseBtn, ErrorBoundary
});