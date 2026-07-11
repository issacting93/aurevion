/* Feature Components — domain-specific primitives for Aurevion screens. */

import { useState, useEffect, Children, Component } from 'react'
import { Color, Font, Space, Radius, Duration, Ease, Type, alpha } from './tokens'

// ── Icons ──
export const ICONS = {
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
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 20c0-4 4-7 8-7s8 3 8 7',
  meal: 'M3 11h18 M5 11V8a7 7 0 0 1 14 0v3 M4 21h16l-1-10H5l-1 10z',
  cart: 'M2 4h2l3 12h11l2-8H6 M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  chart: 'M3 3v18h18 M7 15l3-3 4 4 7-7',
  goal: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  timer: 'M12 8v4l3 2 M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20 M9 2h6',
  pause: 'M10 4h-2v16h2V4z M16 4h-2v16h2V4z',
  play: 'M5 3l14 9-14 9V3z',
  pan: 'M3 12h18 M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6 M19 8h3l-1 4',
  fire: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0',
  bowl: 'M2 12h20 M3 12c0 5 4 9 9 9s9-4 9-9',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  trend_up: 'M23 6l-9.5 9.5-5-5L1 18',
  trend_dn: 'M23 18l-9.5-9.5-5 5L1 6',
  swap: 'M7 16V4 M3 8l4-4 4 4 M17 8v12 M21 16l-4 4-4-4',
  sparkle: 'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',
  expand: 'M3 9V3h6 M21 9V3h-6 M3 15v6h6 M21 15v6h-6',
}

// ── Surface card ──
export function FSurface({ children, accent, tone, icon, title, style, onClick }) {
  const toneColor = tone === 'green' ? Color.green : tone === 'red' ? Color.red : tone === 'accent' ? Color.accent : null
  return (
    <div data-name={title ? `Card / ${title}` : 'Card'} onClick={onClick} style={{
      padding: Space[5], borderRadius: Radius.lg,
      background: Color.surface,
      border: `1px solid ${accent ? alpha(accent, 0.25) : tone ? Color.border : Color.borderSoft}`,
      ...style,
    }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: Space[2], marginBottom: Space[3] }}>
          {icon && <FIcon path={icon} size={15} color={toneColor || Color.accent}/>}
          <span style={{ ...Type.labelMd, color: toneColor || Color.accent, fontWeight: 600 }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

// ── FDataCard — hero data card: category → large title → subtitle → metric boxes ──
export function FDataCard({ category, categoryColor, title, subtitle, metrics, footer, style }) {
  const accentC = categoryColor || Color.accent
  return (
    <div style={{
      padding: '24px 22px', borderRadius: Radius.xl,
      background: Color.surface, border: `1px solid ${Color.borderSoft}`, ...style,
    }}>
      {category && (
        <div style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500, color: accentC, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{category}</div>
      )}
      <div style={{ fontFamily: Font.sans, fontSize: 36, fontWeight: 300, letterSpacing: -1, lineHeight: 1.1, color: Color.text, marginBottom: subtitle ? 8 : 0 }}>{title}</div>
      {subtitle && (
        <div style={{ fontFamily: Font.sans, fontSize: 13, fontWeight: 300, color: Color.dim, lineHeight: 1.5, maxWidth: '90%', marginBottom: metrics ? 20 : 0 }}>{subtitle}</div>
      )}
      {metrics && metrics.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)`, gap: 8 }}>
          {metrics.map((m, i) => {
            const isPrimary = i === 0
            return (
              <div key={m.label} style={{
                padding: '12px 14px', borderRadius: Radius.lg,
                background: isPrimary ? `${accentC}06` : Color.surface2,
                border: `1px solid ${isPrimary ? `${accentC}25` : Color.borderSoft}`,
              }}>
                <div style={{ fontFamily: Font.mono, fontSize: 9, fontWeight: 600, color: isPrimary ? accentC : Color.mute, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, letterSpacing: -0.5 }}>{m.value}</span>
                  {m.unit && <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute }}>{m.unit}</span>}
                </div>
                {isPrimary && <div style={{ height: 3, borderRadius: 2, marginTop: 8, background: `linear-gradient(90deg, ${accentC}, ${accentC}40)`, width: '80%' }} />}
              </div>
            )
          })}
        </div>
      )}
      {footer && (
        <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: Radius.lg, background: Color.surface2, border: `1px solid ${Color.borderSoft}` }}>{footer}</div>
      )}
    </div>
  )
}

// ── List row ──
export function FListRow({ leading, title, subtitle, trailing, divider = true, compact, onClick, style }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: compact ? '18px 0' : '20px 0',
      borderTop: divider ? `1px solid ${Color.borderSoft}` : 'none',
      ...(onClick && { cursor: 'pointer', background: 'transparent', border: 'none', color: Color.text, textAlign: 'left', fontFamily: Font.sans, width: '100%' }),
      ...style,
    }}>
      {leading && <div style={{ flexShrink: 0 }}>{leading}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 14, fontWeight: 500, color: Color.text }}>{title}</div>}
        {subtitle && <div style={{ marginTop: 5 }}><FMono color={Color.mute}>{subtitle}</FMono></div>}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  )
}

// ── Button group (radio/filter toggle) ──
export function FButtonGroup({ options, value, onChange, size = 'md', style }) {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 3,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${Color.borderSoft}`,
      borderRadius: 10,
      ...style,
    }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            flex: 1, padding: size === 'sm' ? '6px 8px' : '8px 12px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: active ? 'rgba(255,110,80,0.12)' : 'transparent',
            color: active ? Color.accent : Color.mute,
            fontFamily: Font.mono, fontSize: size === 'sm' ? 10 : 11,
            letterSpacing: 1, textTransform: 'uppercase',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            transition: `background ${Duration.normal} ease, color ${Duration.normal} ease`,
          }}>
            {opt.icon && <FIcon path={opt.icon} size={16} color={active ? Color.accent : Color.mute} stroke={1.8}/>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Avatar ──
export function FAvatar({ initials, tone = 'neutral', size = 48, image }) {
  const tones = { neutral: '#2a2a2a', warm: '#5a3a35', cool: '#1f2a3a' }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: image ? `url(${image}) center/cover` : tones[tone] || tones.neutral,
      border: `1.5px solid ${Color.borderSoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: Font.mono, fontWeight: 600,
      fontSize: size * 0.32, letterSpacing: 0.5, flexShrink: 0,
    }}>{!image && initials}</div>
  )
}


// ── Phone shell ──
export function Phone({ children, statusTime = '9:41', label, group }) {
  return (
    <div data-name={label ? `Phone / ${label}` : 'Phone'} style={{ width: 428, height: 926, borderRadius: 56, background: Color.bg, color: Color.text, overflow: 'hidden', fontFamily: Font.sans, position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 9px #1a1a1a, 0 0 0 10px #2a2a2a', display: 'flex', flexDirection: 'column' }}>
      <div data-name="Status Bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 36px 0', fontFamily: Font.sans, fontSize: 15, fontWeight: 600, zIndex: 50, pointerEvents: 'none' }}>
        <span>{statusTime}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5" /><rect x="4.5" y="5" width="3" height="6" rx="0.5" /><rect x="9" y="2.5" width="3" height="8.5" rx="0.5" /><rect x="13.5" y="0" width="3" height="11" rx="0.5" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.4" fill="none" /><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" /><path d="M23 4v4c.8-.3 1.5-1.3 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" fillOpacity="0.4" /></svg>
        </span>
      </div>
      <div data-name="Dynamic Island" style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 22, background: '#000', zIndex: 60 }} />
      <div data-name="Content" style={{ flex: 1, minHeight: 0, paddingTop: 54, display: 'flex', flexDirection: 'column' }}>{children}</div>
      <div data-name="Home Indicator" style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.35)' }} />
    </div>
  )
}

// ── FNavBar ──
export function FNavBar({ title, leading, trailing }) {
  return (
    <div data-name="Nav Bar" style={{ padding: '12px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div data-name="Nav Leading" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 48 }}>{leading}</div>
      {title && <div data-name="Nav Title" style={{ fontFamily: Font.mono, fontSize: 12, letterSpacing: 1.4, color: Color.mute, textTransform: 'uppercase' }}>{title}</div>}
      <div data-name="Nav Trailing" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 48, justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  )
}

// ── FLabel ──
export function FLabel({ children, color = Color.mute, size = 10, mb = 6, mt = 0, letter = 0.8 }) {
  return <div style={{ fontFamily: Font.mono, fontSize: size, letterSpacing: letter, color, textTransform: 'uppercase', marginBottom: mb, marginTop: mt }}>{children}</div>
}

// ── FMono ──
export function FMono({ children, size = 11, color = Color.text, letter = 1 }) {
  return <span style={{ fontFamily: Font.mono, fontSize: size, color, letterSpacing: letter }}>{children}</span>
}

// ── FNum ──
export function FNum({ children, size = 56, weight = 200, unit, color = Color.text, unitColor }) {
  return (
    <span style={{ fontSize: size, fontWeight: weight, letterSpacing: -size * 0.028, lineHeight: 0.95, color, fontFamily: Font.mono }}>
      {children}
      {unit && <span style={{ fontSize: Math.max(11, size * 0.22), fontFamily: Font.mono, fontWeight: 400, color: unitColor || Color.mute, marginLeft: 5, verticalAlign: 'super', letterSpacing: 0 }}>{unit}</span>}
    </span>
  )
}

// ── FTexBar ──
export function FTexBar({ pct = 70, height = 22, color = Color.accent, track = 'rgba(255,255,255,0.05)', radius = 6, animate = true }) {
  const [scale, setScale] = useState(animate ? 0 : pct / 100)
  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => setScale(pct / 100), 80)
    return () => clearTimeout(t)
  }, [pct, animate])
  return (
    <div style={{ height, borderRadius: radius, background: track, overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: radius, background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${color}`, transform: `scaleX(${scale})`, transformOrigin: 'left', transition: `transform ${Duration.fill} ${Ease.expo}` }} />
    </div>
  )
}

// ── FScale ──
export function FScale({ marks = [0, 50, 100], color = Color.accent, suffix = '' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: Font.mono, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
      {marks.map((m, i) => <span key={i} style={{ color: i === marks.length - 1 ? Color.mute : color }}>{m}{suffix}</span>)}
    </div>
  )
}

// ── FIcon ──
export function FIcon({ path, size = 18, color = 'currentColor', stroke = 1.8, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill !== 'none' ? 'none' : color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {typeof path === 'string' ? <path d={path} /> : path}
    </svg>
  )
}

// ── FTag ──
export function FTag({ children, tone = 'neutral', size = 'sm', icon }) {
  const palette = {
    neutral: { bg: 'rgba(255,255,255,0.06)', fg: Color.text },
    accent: { bg: Color.accent, fg: Color.accentText },
    green: { bg: 'rgba(74,222,128,0.10)', fg: Color.green },
    mute: { bg: 'transparent', fg: Color.mute, border: Color.borderSoft },
    red: { bg: 'rgba(248,113,113,0.10)', fg: Color.red },
  }
  const p = palette[tone]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: size === 'sm' ? '4px 10px' : '6px 12px', borderRadius: 999, background: p.bg, color: p.fg, border: p.border ? `1px solid ${p.border}` : 'none', fontFamily: Font.mono, fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {icon}{children}
    </span>
  )
}

// ── FBtn ──
export function FBtn({ children, onClick, style = {}, variant, primary, size = 'md', full, icon, iconLeading, loading, labelStyle = 'mono', disabled }) {
  const v = variant || (primary ? 'primary' : 'secondary')
  const [hover, setHover] = useState(false)

  if (v === 'split') {
    return (
      <button onClick={loading || disabled ? undefined : onClick} data-stay={style?.['data-stay']} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ height: 56, padding: 0, cursor: disabled || loading ? 'not-allowed' : 'pointer', background: hover ? Color.accentHot : Color.accent, color: Color.accentText, border: 'none', borderRadius: 8, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 56px', alignItems: 'stretch', fontFamily: Font.mono, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', width: full ? '100%' : 'auto', transition: `background ${Duration.normal} ${Ease.default}`, opacity: disabled ? 0.4 : 1 }}>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
          {iconLeading && <FIcon path={iconLeading} size={14} stroke={2.4} color={Color.accentText}/>}
          {loading ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(26,15,10,0.3)', borderTopColor: Color.accentText, animation: 'fbtnSpin 0.7s linear infinite' }}/><span>WORKING</span></span> : children}
        </span>
        <span style={{ background: hover ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: `background ${Duration.normal} ${Ease.default}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Color.accentText} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </button>
    )
  }

  const [active, setActive] = useState(false)
  const sizes = {
    sm: { pad: '8px 14px', fs: 11, lh: 30, gap: 6, radius: 6, iconSize: 12 },
    md: { pad: '12px 18px', fs: 12, lh: 44, gap: 8, radius: 8, iconSize: 14 },
    lg: { pad: '16px 22px', fs: 13, lh: 56, gap: 10, radius: 8, iconSize: 16 },
  }
  const sz = sizes[size]
  const palette = {
    primary: { bg: Color.accent, bgHover: Color.accentHot, bgActive: '#E85A3E', fg: Color.accentText, border: 'transparent' },
    secondary: { bg: 'rgba(255,255,255,0.06)', bgHover: 'rgba(255,255,255,0.10)', bgActive: 'rgba(255,255,255,0.04)', fg: Color.text, border: 'transparent' },
    ghost: { bg: 'transparent', bgHover: 'rgba(255,255,255,0.04)', bgActive: 'rgba(255,255,255,0.02)', fg: Color.dim, border: Color.borderSoft },
  }
  const p = palette[v]
  const bg = disabled ? 'rgba(255,255,255,0.04)' : active ? p.bgActive : hover ? p.bgHover : p.bg
  const fg = disabled ? Color.mute : p.fg
  const isMono = labelStyle === 'mono'

  return (
    <button onClick={disabled || loading ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false) }}
      onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
      style={{ padding: sz.pad, minHeight: sz.lh, borderRadius: sz.radius, border: p.border === 'transparent' ? 'none' : `1px solid ${p.border}`, background: bg, color: fg, cursor: disabled || loading ? 'not-allowed' : 'pointer', fontFamily: isMono ? Font.mono : Font.sans, fontSize: isMono ? sz.fs : sz.fs + 2, fontWeight: 600, letterSpacing: isMono ? 1.4 : 0, textTransform: isMono ? 'uppercase' : 'none', width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sz.gap, transition: `background ${Duration.fast} ${Ease.default}, color ${Duration.fast} ${Ease.default}, transform ${Duration.micro} ${Ease.default}`, transform: active ? 'translateY(0.5px)' : 'translateY(0)', opacity: disabled ? 0.5 : 1, ...style }}>
      {loading ? <div style={{ width: sz.iconSize, height: sz.iconSize, borderRadius: '50%', border: `1.6px solid ${alpha(fg, 0.2)}`, borderTopColor: fg, animation: 'fbtnSpin 0.7s linear infinite' }} /> : iconLeading && <FIcon path={iconLeading} size={sz.iconSize} stroke={2.2} color={fg} />}
      {children}
      {icon && !loading && <FIcon path={icon} size={sz.iconSize} stroke={2.2} color={fg} />}
    </button>
  )
}

// ── FRing — circular progress ring ──
export function FRing({ value = 0, max = 100, size = 160, strokeWidth = 6, color = Color.accent, children }) {
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={Color.borderSoft} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={c - pct * c}
          strokeLinecap="round"
          style={{ transition: `stroke-dashoffset 0.8s ${Ease.expo}` }} />
      </svg>
      {children && <div style={{ position: 'relative', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

// ── FCheckbox ──
export function FCheckbox({ checked, tone = 'green', size = 20 }) {
  const fill = tone === 'accent' ? Color.accent : Color.green
  return (
    <div style={{
      width: size, height: size, borderRadius: Radius.sm,
      border: `1.5px solid ${checked ? fill : Color.borderSoft}`,
      background: checked ? fill : 'transparent',
      display: 'grid', placeItems: 'center', flexShrink: 0,
      transition: `background ${Duration.fast} ease, border-color ${Duration.fast} ease`,
    }}>
      {checked && <FIcon path={ICONS.check} size={Math.round(size * 0.6)} stroke={3} color={Color.surface} />}
    </div>
  )
}

// ── FTabBar ──
export function FTabBar({ active = 0 }) {
  const tabs = [{ i: ICONS.goal, n: 'Home' }, { i: ICONS.meal, n: 'Eat' }, { i: ICONS.fire, big: true, n: 'Train' }, { i: ICONS.chart, n: 'Plan' }, { i: ICONS.person, n: 'You' }]
  return (
    <div data-name="Tab Bar" style={{ padding: '10px 16px 26px', flexShrink: 0 }}>
      <div style={{ height: 56, borderRadius: 999, background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(16px)', border: `1px solid ${Color.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        {tabs.map((t, i) => (
          <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: i === active ? Color.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === active ? Color.accentText : Color.dim }}>
            <FIcon path={t.i} size={20} stroke={1.8} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── FSection ──
export function FSection({ label, action, children, mb = 18, mt = 0, style = {} }) {
  return (
    <div style={{ marginBottom: mb, marginTop: mt, ...style }}>
      {(label || action) && <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>{label && <FLabel mb={0}>{label}</FLabel>}{action}</div>}
      {children}
    </div>
  )
}

// ── FToolbar ──
export function FToolbar({ cells = [] }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${Color.borderSoft}`, borderRadius: 10, padding: 4, display: 'grid', gap: 4, height: 56, gridTemplateColumns: cells.map(c => c.primary ? '1.6fr' : '1fr').join(' ') }}>
      {cells.map((c, i) => <FToolbarCell key={i} cell={c} />)}
    </div>
  )
}

function FToolbarCell({ cell: c }) {
  const [h, setH] = useState(false)
  const isP = !!c.primary
  const bg = isP ? (h ? Color.accentHot : Color.accent) : (h ? 'rgba(255,255,255,0.06)' : 'transparent')
  const fg = isP ? Color.accentText : Color.dim
  return (
    <button onClick={c.onClick} data-stay={c.stay ? 'true' : undefined} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: bg, color: fg, border: 'none', cursor: 'pointer', borderRadius: 8, padding: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, transition: `background ${Duration.fast} ${Ease.default}` }}>
      {c.icon && <FIcon path={c.icon} size={isP ? 16 : 14} stroke={isP ? 2.2 : 1.9} color={fg} />}
      <span style={{ fontFamily: Font.mono, fontSize: isP ? 12 : 11, letterSpacing: 1.4, color: fg, textTransform: 'uppercase', fontWeight: isP ? 700 : 600 }}>{c.label}</span>
    </button>
  )
}

// ── FStagger ──
export function FStagger({ children, delay = 40, distance = 10, duration = 0.3 }) {
  const items = Children.toArray(children)
  return items.map((child, i) => (
    <div key={child.key || i} style={{ animation: `fStaggerIn ${duration}s ${Ease.expo} ${i * delay}ms both` }}>{child}</div>
  ))
}

// ── ErrorBoundary ──
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: Color.text, fontFamily: Font.sans }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><FIcon path={ICONS.close} size={20} color={Color.red} stroke={2.4} /></div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontFamily: Font.mono, fontSize: 11, color: Color.mute, maxWidth: 300, wordBreak: 'break-word' }}>{this.state.error.message}</div>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 20, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: 'none', color: Color.dim, cursor: 'pointer', fontFamily: Font.mono, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Retry</button>
        </div>
      )
    }
    return this.props.children
  }
}
