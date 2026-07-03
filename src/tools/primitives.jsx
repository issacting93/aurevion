/* Aurevion Component Library — Spec-Grade Primitives */

import { useState, useRef, useEffect, memo, forwardRef } from 'react'
import { Color, Font, Space, Radius, Shadow, Duration, Ease, Type } from '../ui/tokens'

function merge(...objs) { return Object.assign({}, ...objs) }

/* ── CARD ── */
const CARD_VARIANTS = {
  surface:  { background: Color.surface,  border: `1px solid ${Color.borderSoft}` },
  elevated: { background: Color.surface2, border: `1px solid ${Color.border}`, boxShadow: Shadow.md },
  outlined: { background: 'transparent',  border: `1px solid ${Color.border}` },
  ghost:    { background: 'transparent',  border: '1px solid transparent' },
}

export const Card = memo(forwardRef(function Card({
  variant = 'surface', padding, radius = Radius.xl, selected = false,
  disabled = false, onClick, style, children, ...rest
}, ref) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const interactive = !!onClick && !disabled
  const base = CARD_VARIANTS[variant] || CARD_VARIANTS.surface

  const computed = merge(
    { borderRadius: radius, padding: padding != null ? padding : Space[5],
      transition: `background ${Duration.normal} ${Ease.default}, border-color ${Duration.normal} ${Ease.default}, box-shadow ${Duration.normal} ${Ease.default}, transform ${Duration.fast} ${Ease.default}, opacity ${Duration.normal} ${Ease.default}` },
    base,
    interactive && { cursor: 'pointer', userSelect: 'none' },
    interactive && hovered && { background: Color.surface2, borderColor: Color.border },
    interactive && pressed && { transform: 'scale(0.985)' },
    selected && { borderColor: Color.accent, background: Color.accentFaint },
    disabled && { opacity: 0.4, pointerEvents: 'none' },
    style,
  )

  return (
    <div ref={ref} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined}
      aria-selected={selected || undefined} aria-disabled={disabled || undefined}
      style={computed}
      onPointerEnter={interactive ? () => setHovered(true) : undefined}
      onPointerLeave={interactive ? () => { setHovered(false); setPressed(false) } : undefined}
      onPointerDown={interactive ? () => setPressed(true) : undefined}
      onPointerUp={interactive ? () => setPressed(false) : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) } } : undefined}
      {...rest}>
      {children}
    </div>
  )
}))

/* ── BUTTON ── */
const BTN_VARIANTS = {
  primary:   { default: { background: Color.accent, color: '#1a0f0a', borderColor: 'transparent' }, hover: { background: '#FF8166' }, active: { background: Color.accentHot }, disabled: { background: Color.faint, color: Color.mute } },
  secondary: { default: { background: 'rgba(255,255,255,0.06)', color: Color.text, borderColor: Color.border }, hover: { background: 'rgba(255,255,255,0.10)' }, active: { background: 'rgba(255,255,255,0.04)' }, disabled: { background: 'transparent', color: Color.faint, borderColor: Color.borderSoft } },
  ghost:     { default: { background: 'transparent', color: Color.dim, borderColor: 'transparent' }, hover: { background: 'rgba(255,255,255,0.04)', color: Color.text }, active: { background: 'rgba(255,255,255,0.02)' }, disabled: { background: 'transparent', color: Color.faint } },
  danger:    { default: { background: Color.redDim, color: Color.red, borderColor: 'transparent' }, hover: { background: 'rgba(248,113,113,0.22)' }, active: { background: 'rgba(248,113,113,0.12)' }, disabled: { background: 'transparent', color: Color.faint } },
}
const BTN_SIZES = {
  sm: { height: 32, paddingLeft: 12, paddingRight: 12, fontSize: 11, gap: 6 },
  md: { height: 44, paddingLeft: 16, paddingRight: 16, fontSize: 12, gap: 8 },
  lg: { height: 52, paddingLeft: 20, paddingRight: 20, fontSize: 13, gap: 8 },
}

export const Button = memo(forwardRef(function Button({
  variant = 'primary', size = 'md', disabled = false, loading = false,
  fullWidth = false, icon, iconTrailing, onClick, style, children, ...rest
}, ref) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary
  const s = BTN_SIZES[size] || BTN_SIZES.md
  const isDisabled = disabled || loading
  const state = isDisabled ? 'disabled' : pressed ? 'active' : hovered ? 'hover' : 'default'

  const computed = merge(
    { margin: 0, outline: 'none', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap, height: s.height, paddingLeft: s.paddingLeft, paddingRight: s.paddingRight, borderRadius: Radius.md, border: '1px solid', fontFamily: Font.mono, fontSize: s.fontSize, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: isDisabled ? 'default' : 'pointer', userSelect: 'none', transition: `background ${Duration.normal} ${Ease.default}, color ${Duration.normal} ${Ease.default}, border-color ${Duration.normal} ${Ease.default}, transform ${Duration.fast} ${Ease.default}, opacity ${Duration.normal} ${Ease.default}` },
    v.default, v[state],
    pressed && !isDisabled && { transform: 'scale(0.97)' },
    fullWidth && { width: '100%' },
    loading && { opacity: 0.7 },
    style,
  )

  const spinner = loading ? <span style={{ width: s.fontSize, height: s.fontSize, border: '1.5px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'aurevion-spin 0.6s linear infinite', flexShrink: 0 }} /> : null

  return (
    <button ref={ref} type="button" disabled={isDisabled} aria-busy={loading || undefined} style={computed}
      onPointerEnter={() => setHovered(true)} onPointerLeave={() => { setHovered(false); setPressed(false) }}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)}
      onClick={isDisabled ? undefined : onClick} {...rest}>
      {spinner || (icon ? <span style={{ display: 'flex', flexShrink: 0 }}>{icon}</span> : null)}
      {!loading && children}
      {!loading && iconTrailing ? <span style={{ display: 'flex', flexShrink: 0 }}>{iconTrailing}</span> : null}
    </button>
  )
}))

/* ── TAG ── */
const TAG_TONES = {
  neutral: { background: 'rgba(255,255,255,0.06)', color: Color.dim },
  accent:  { background: Color.accentDim, color: Color.accent },
  green:   { background: Color.greenDim,  color: Color.green },
  red:     { background: Color.redDim,    color: Color.red },
  blue:    { background: Color.blueDim,   color: Color.blue },
  solid:   { background: Color.accent,    color: '#1a0f0a' },
}

export function Tag({ tone = 'neutral', icon, children, style }) {
  const t = TAG_TONES[tone] || TAG_TONES.neutral
  return (
    <span style={merge(Type.labelSm, { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: Radius.full, fontWeight: 600, whiteSpace: 'nowrap' }, t, style)}>
      {icon}{children}
    </span>
  )
}

/* ── ROW ── */
export const Row = memo(forwardRef(function Row({
  leading, title, subtitle, trailing, checked, onToggle,
  disabled = false, compact = false, divider = true, style, children, ...rest
}, ref) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const interactive = !!onToggle && !disabled
  const isChecked = checked === true
  const py = compact ? Space[2] : Space[3]

  const computed = merge(
    { display: 'flex', alignItems: 'center', gap: Space[3], padding: `${py}px 0`, borderBottom: divider ? `1px solid ${Color.borderSoft}` : 'none', transition: `background ${Duration.normal} ${Ease.default}, opacity ${Duration.normal} ${Ease.default}`, cursor: interactive ? 'pointer' : 'default', userSelect: interactive ? 'none' : undefined },
    interactive && hovered && { background: 'rgba(255,255,255,0.02)' },
    interactive && pressed && { background: 'rgba(255,255,255,0.01)' },
    disabled && { opacity: 0.35, pointerEvents: 'none' },
    style,
  )

  const checkbox = onToggle != null ? (
    <span aria-hidden style={merge({ width: 18, height: 18, borderRadius: Radius.sm, flexShrink: 0, border: `1.5px solid ${isChecked ? Color.accent : Color.mute}`, background: isChecked ? Color.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: `background ${Duration.normal} ${Ease.default}, border-color ${Duration.normal} ${Ease.default}` })}>
      {isChecked && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#1a0f0a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
    </span>
  ) : null

  return (
    <div ref={ref} role={interactive ? 'checkbox' : undefined} aria-checked={onToggle != null ? isChecked : undefined} aria-disabled={disabled || undefined} tabIndex={interactive ? 0 : undefined} style={computed}
      onPointerEnter={interactive ? () => setHovered(true) : undefined}
      onPointerLeave={interactive ? () => { setHovered(false); setPressed(false) } : undefined}
      onPointerDown={interactive ? () => setPressed(true) : undefined}
      onPointerUp={interactive ? () => setPressed(false) : undefined}
      onClick={interactive ? () => onToggle(!isChecked) : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(!isChecked) } } : undefined}
      {...rest}>
      {checkbox}
      {leading && <span style={{ display: 'flex', flexShrink: 0 }}>{leading}</span>}
      <span style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={merge(Type.bodyMd, { color: isChecked ? Color.mute : Color.text }, isChecked && { textDecoration: 'line-through' })}>{title}</div>}
        {subtitle && <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 2 })}>{subtitle}</div>}
        {children}
      </span>
      {trailing && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: Color.mute }}>{trailing}</span>}
    </div>
  )
}))

/* ── PROGRESS BAR ── */
export function ProgressBar({ value = 0, max = 100, variant = 'standard', color = Color.accent, height = 6, segments = 20, showScale = false, scaleLabels, animated = false, style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const isComplete = pct >= 100

  if (variant === 'segmented') {
    const lit = Math.round(segments * pct / 100)
    return (
      <div style={merge({ width: '100%' }, style)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ display: 'flex', gap: 2, width: '100%', height: height * 1.5 }}>
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: '100%', borderRadius: 1, background: i < lit ? color : 'rgba(255,255,255,0.06)', transition: animated ? `background ${Duration.normal} ${Ease.default}` : undefined }} />
          ))}
        </div>
      </div>
    )
  }

  const bg = variant === 'textured'
    ? `repeating-linear-gradient(135deg, ${color}, ${color} 2px, transparent 2px, transparent 5px)`
    : (isComplete ? Color.green : color)

  const labels = scaleLabels || ['0', '50', '100']
  const scale = showScale ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, ...Type.labelSm, color: Color.mute }}>
      {labels.map((l, i) => <span key={i} style={i === labels.length - 1 ? { color: Color.accent } : undefined}>{l}</span>)}
    </div>
  ) : null

  return (
    <div style={merge({ width: '100%' }, style)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: '100%', height, borderRadius: Radius.sm, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'inherit', background: bg, transition: animated ? `width ${Duration.slow} ${Ease.default}` : undefined }} />
      </div>
      {scale}
    </div>
  )
}

/* ── PROGRESS RING ── */
export function ProgressRing({ value = 0, max = 100, size = 80, strokeWidth = 5, color = Color.accent, trackColor = 'rgba(255,255,255,0.06)', animated = false, children, style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div style={merge({ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }, style)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pct >= 100 ? Color.green : color} strokeWidth={strokeWidth} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: animated ? `stroke-dashoffset ${Duration.slow} ${Ease.default}` : undefined }} />
      </svg>
      {children && <div style={{ position: 'relative', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/* ── METRIC DISPLAY ── */
const METRIC_TONES = { default: Color.text, accent: Color.accent, green: Color.green, red: Color.red, mute: Color.mute }

export function MetricDisplay({ value, unit, label, sublabel, size = 'md', tone = 'default', style }) {
  const numStyle = size === 'lg' ? Type.displayLg : size === 'sm' ? Type.displaySm : Type.displayMd
  const color = METRIC_TONES[tone] || METRIC_TONES.default

  return (
    <div style={merge({ display: 'flex', flexDirection: 'column', gap: 4 }, style)}>
      {label && <span style={merge(Type.labelMd, { color: Color.mute })}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={merge(numStyle, { color })}>{value}</span>
        {unit && <span style={merge(Type.labelMd, { color: Color.mute, alignSelf: 'flex-start', marginTop: size === 'lg' ? 8 : 4 })}>{unit}</span>}
      </div>
      {sublabel && <span style={merge(Type.dataSm, { color: Color.mute })}>{sublabel}</span>}
    </div>
  )
}

/* ── EXPANDABLE PANEL ── */
export function ExpandablePanel({ title, defaultOpen = false, variant = 'surface', children, style }) {
  const [open, setOpen] = useState(defaultOpen)
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight)
  }, [children, open])

  return (
    <Card variant={variant} padding={0} style={merge({ overflow: 'hidden' }, style)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: Space[3], width: '100%', padding: `${Space[4]}px ${Space[5]}px`, background: 'none', border: 'none', cursor: 'pointer', color: Color.text, textAlign: 'left', outline: 'none', ...Type.labelMd }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${open ? 90 : 0}deg)`, transition: `transform ${Duration.normal} ${Ease.default}`, flexShrink: 0 }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ flex: 1 }}>{title}</span>
      </button>
      <div style={{ maxHeight: open ? contentHeight + 40 : 0, overflow: 'hidden', transition: `max-height ${Duration.slow} ${Ease.default}` }}>
        <div ref={contentRef} style={{ padding: `0 ${Space[5]}px ${Space[5]}px` }}>{children}</div>
      </div>
    </Card>
  )
}

/* ── FILTER GROUP ── */
export function FilterGroup({ options, value, onChange, size = 'md', style }) {
  return (
    <div role="radiogroup" style={merge({ display: 'flex', gap: Space[1], padding: Space[1], background: 'rgba(255,255,255,0.03)', borderRadius: Radius.md }, style)}>
      {options.map(opt => (
        <FilterGroupItem key={opt.value} label={opt.label} count={opt.count} active={opt.value === value} size={size} onClick={() => onChange(opt.value)} />
      ))}
    </div>
  )
}

const FilterGroupItem = memo(function FilterGroupItem({ label, count, active, size, onClick }) {
  const [hovered, setHovered] = useState(false)
  const s = size === 'sm' ? Type.labelSm : Type.labelMd
  return (
    <button type="button" role="radio" aria-checked={active} onClick={onClick}
      onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}
      style={merge(s, { display: 'flex', alignItems: 'center', gap: 6, padding: `${Space[2]}px ${Space[3]}px`, borderRadius: Radius.sm + 2, border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 500, transition: `background ${Duration.normal} ${Ease.default}, color ${Duration.normal} ${Ease.default}` },
        active ? { background: 'rgba(255,255,255,0.08)', color: Color.text } : { background: 'transparent', color: Color.mute },
        !active && hovered && { background: 'rgba(255,255,255,0.04)', color: Color.dim },
      )}>
      {label}
      {count != null && <span style={merge(Type.dataSm, { color: active ? Color.accent : Color.faint, fontWeight: 600, minWidth: 16, textAlign: 'center' })}>{count}</span>}
    </button>
  )
})

/* ── SECTION ── */
export function Section({ label, action, spacing = Space[5], children, style }) {
  return (
    <div style={merge({ marginBottom: spacing }, style)}>
      {(label || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space[3] }}>
          {label && <span style={merge(Type.labelMd, { color: Color.mute })}>{label}</span>}
          {action || null}
        </div>
      )}
      {children}
    </div>
  )
}

/* ── STEP INDICATOR ── */
const STEP_STYLES = {
  done:     { ring: Color.accent, fill: Color.accent, text: Color.dim,  line: Color.accent },
  active:   { ring: Color.accent, fill: 'transparent', text: Color.text, line: Color.border },
  upcoming: { ring: Color.faint,  fill: 'transparent', text: Color.mute, line: Color.border },
  skipped:  { ring: Color.faint,  fill: 'transparent', text: Color.faint, line: Color.borderSoft },
}

export function StepIndicator({ steps, children, style }) {
  return (
    <div role="list" style={merge({ display: 'flex', flexDirection: 'column' }, style)}>
      {steps.map((step, i) => {
        const s = STEP_STYLES[step.state] || STEP_STYLES.upcoming
        const isLast = i === steps.length - 1
        return (
          <div key={i} role="listitem" style={{ display: 'flex', gap: Space[3], position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: Radius.full, border: `2px solid ${s.ring}`, background: s.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {step.state === 'done' && <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#1a0f0a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                {step.state === 'active' && <div style={{ width: 8, height: 8, borderRadius: Radius.full, background: Color.accent, animation: 'aurevion-pulse 2s ease-in-out infinite' }} />}
              </div>
              {!isLast && <div style={{ width: 1.5, flex: 1, minHeight: 16, background: s.line }} />}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : Space[4], flex: 1, minWidth: 0, paddingTop: 1 }}>
              <div style={merge(Type.bodyMd, { color: s.text, fontWeight: step.state === 'active' ? 500 : 400 })}>{step.label}</div>
              {step.sublabel && <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 2 })}>{step.sublabel}</div>}
              {children && step.state === 'active' && <div style={{ marginTop: Space[3] }}>{children(step, i)}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── AVATAR ── */
const AVATAR_TONES = {
  neutral: { background: Color.surface2, color: Color.dim },
  warm:    { background: Color.accentDim, color: Color.accent },
  cool:    { background: Color.blueDim, color: Color.blue },
}

export function Avatar({ initials, image, tone = 'neutral', size = 40, style }) {
  const t = AVATAR_TONES[tone] || AVATAR_TONES.neutral
  return (
    <div aria-hidden style={merge({ width: size, height: size, borderRadius: Radius.full, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: Font.mono, fontSize: size * 0.32, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', flexShrink: 0, overflow: 'hidden' }, t, image && { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' }, style)}>
      {!image ? initials : null}
    </div>
  )
}

/* ── DIVIDER ── */
export function Divider({ label, inset = 0, style }) {
  if (label) {
    return (
      <div style={merge({ display: 'flex', alignItems: 'center', gap: Space[3], margin: `${Space[4]}px 0`, marginLeft: inset }, style)}>
        <div style={{ flex: 1, height: 1, background: Color.borderSoft }} />
        <span style={merge(Type.labelSm, { color: Color.faint })}>{label}</span>
        <div style={{ flex: 1, height: 1, background: Color.borderSoft }} />
      </div>
    )
  }
  return <div role="separator" style={merge({ height: 1, background: Color.borderSoft, margin: `${Space[3]}px 0`, marginLeft: inset }, style)} />
}

/* ── TOOLTIP ── */
export function Tooltip({ label, position = 'top', children }) {
  const [show, setShow] = useState(false)
  const pos = { top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 }, bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 }, left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 }, right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 } }

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} onPointerEnter={() => setShow(true)} onPointerLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && <div role="tooltip" style={merge(Type.labelSm, { position: 'absolute', padding: '5px 8px', borderRadius: Radius.sm, background: Color.surface3, color: Color.text, border: `1px solid ${Color.border}`, boxShadow: Shadow.md, whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100, animation: 'aurevion-fade-in 0.12s ease' }, pos[position])}>{label}</div>}
    </div>
  )
}

/* ── EMPTY STATE ── */
export function EmptyState({ icon, title, description, action, style }) {
  return (
    <div style={merge({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${Space[12]}px ${Space[5]}px`, textAlign: 'center', gap: Space[3] }, style)}>
      {icon && <div style={{ color: Color.faint, marginBottom: Space[2] }}>{icon}</div>}
      {title && <div style={merge(Type.headingMd, { color: Color.dim })}>{title}</div>}
      {description && <div style={merge(Type.bodySm, { color: Color.mute, maxWidth: 280 })}>{description}</div>}
      {action && <div style={{ marginTop: Space[3] }}>{action}</div>}
    </div>
  )
}

/* ── SKELETON ── */
export function Skeleton({ width, height, circle = false, radius, style }) {
  return (
    <div aria-hidden style={merge({ width: circle ? (height || 40) : (width || '100%'), height: height || 14, borderRadius: circle ? Radius.full : (radius || Radius.sm), background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'aurevion-shimmer 1.5s ease-in-out infinite' }, style)} />
  )
}

/* ── ICON BUTTON ── */
const IBTN_SIZES = { sm: 28, md: 36, lg: 44 }

export const IconButton = memo(forwardRef(function IconButton({
  variant = 'ghost', size = 'md', disabled = false, label, onClick, style, children, ...rest
}, ref) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.ghost
  const dim = IBTN_SIZES[size] || IBTN_SIZES.md
  const state = disabled ? 'disabled' : pressed ? 'active' : hovered ? 'hover' : 'default'

  const computed = merge(
    { margin: 0, outline: 'none', border: '1px solid', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: dim, height: dim, borderRadius: Radius.full, cursor: disabled ? 'default' : 'pointer', userSelect: 'none', flexShrink: 0, transition: `background ${Duration.normal} ${Ease.default}, color ${Duration.normal} ${Ease.default}, transform ${Duration.fast} ${Ease.default}` },
    v.default, v[state],
    pressed && !disabled && { transform: 'scale(0.92)' },
    style,
  )

  return (
    <button ref={ref} type="button" disabled={disabled} aria-label={label} style={computed}
      onPointerEnter={() => setHovered(true)} onPointerLeave={() => { setHovered(false); setPressed(false) }}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)}
      onClick={disabled ? undefined : onClick} {...rest}>
      {children}
    </button>
  )
}))
