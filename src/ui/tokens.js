/* Aurevion Design Tokens — Single source of truth */

export const Color = Object.freeze({
  bg:         '#000',
  surface:    '#0d0d0d',
  surface2:   '#161616',
  surface3:   '#1e1e1e',
  text:       '#fafafa',
  dim:        '#a1a1a1',
  mute:       '#6b6b6b',
  faint:      '#3a3a3a',
  border:     'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.04)',
  accent:     '#FF6E50',
  accentHot:  '#FF5A1F',
  accentDim:  'rgba(255,110,80,0.15)',
  accentFaint:'rgba(255,110,80,0.06)',
  green:      '#4ade80',
  greenDim:   'rgba(74,222,128,0.15)',
  red:        '#f87171',
  redDim:     'rgba(248,113,113,0.15)',
  blue:       '#60a5fa',
  blueDim:    'rgba(96,165,250,0.15)',
  purple:     '#a78bfa',
  purpleDim:  'rgba(167,139,250,0.15)',
  amber:      '#F59E0B',
  amberDim:   'rgba(245,158,11,0.15)',
  yellow:     '#E3BC2C',
  yellowDim:  'rgba(227,188,44,0.15)',
  accentText: '#1a0f0a',
})

/* ── Color alpha helper — replaces inline hex suffix concatenation ── */
const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}
const rgbCache = {}
/** Returns `rgba(r,g,b, opacity)` from any hex Color token. */
export function alpha(color, opacity) {
  if (!rgbCache[color]) rgbCache[color] = hexToRgb(color)
  return `rgba(${rgbCache[color]},${opacity})`
}

/* SODA loop phase colors — saturated variants for data viz and journey UI */
export const Phase = Object.freeze({
  seed:    '#FF6E50',   // = Color.accent
  decide:  '#3DADFF',
  plan:    '#874FFF',
  act:     '#66D575',
  observe: '#E3BC2C',   // = Color.yellow
})

export const Font = Object.freeze({
  sans: '"Geist", -apple-system, system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
})

export const Space = Object.freeze({
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
})

export const Radius = Object.freeze({
  none: 0,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  '2xl':20,
  full: 9999,
})

export const Shadow = Object.freeze({
  sm:   '0 1px 2px rgba(0,0,0,0.4)',
  md:   '0 2px 8px rgba(0,0,0,0.4)',
  lg:   '0 4px 24px rgba(0,0,0,0.5)',
  glow: `0 0 20px ${Color.accentDim}`,
})

export const Duration = Object.freeze({
  micro:  '0.08s',
  fast:   '0.1s',
  normal: '0.15s',
  slow:   '0.25s',
  morph:  '0.4s',
  fill:   '0.8s',
})

export const Ease = Object.freeze({
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  out:     'cubic-bezier(0, 0, 0.2, 1)',
  expo:    'cubic-bezier(0.16, 1, 0.3, 1)',
})

export const Type = Object.freeze({
  displayLg: { fontFamily: Font.sans, fontSize: 56, fontWeight: 200, letterSpacing: -56 * 0.028, lineHeight: 1 },
  displayMd: { fontFamily: Font.sans, fontSize: 40, fontWeight: 200, letterSpacing: -40 * 0.028, lineHeight: 1 },
  displaySm: { fontFamily: Font.sans, fontSize: 28, fontWeight: 300, letterSpacing: -28 * 0.02,  lineHeight: 1.1 },
  headingLg: { fontFamily: Font.sans, fontSize: 22, fontWeight: 500, letterSpacing: -0.5,  lineHeight: 1.2 },
  headingMd: { fontFamily: Font.sans, fontSize: 17, fontWeight: 500, letterSpacing: -0.3,  lineHeight: 1.3 },
  headingSm: { fontFamily: Font.sans, fontSize: 15, fontWeight: 500, letterSpacing: -0.2,  lineHeight: 1.3 },
  bodyLg:    { fontFamily: Font.sans, fontSize: 15, fontWeight: 400, letterSpacing: 0,     lineHeight: 1.5 },
  bodyMd:    { fontFamily: Font.sans, fontSize: 13, fontWeight: 400, letterSpacing: 0,     lineHeight: 1.45 },
  bodySm:    { fontFamily: Font.sans, fontSize: 12, fontWeight: 400, letterSpacing: 0,     lineHeight: 1.4 },
  labelLg:   { fontFamily: Font.mono, fontSize: 12, fontWeight: 500, letterSpacing: 1.4, lineHeight: 1, textTransform: 'uppercase' },
  labelMd:   { fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 1.2, lineHeight: 1, textTransform: 'uppercase' },
  labelSm:   { fontFamily: Font.mono, fontSize:  9, fontWeight: 500, letterSpacing: 1.0, lineHeight: 1, textTransform: 'uppercase' },
  dataLg:    { fontFamily: Font.mono, fontSize: 14, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3 },
  dataMd:    { fontFamily: Font.mono, fontSize: 12, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3 },
  dataSm:    { fontFamily: Font.mono, fontSize: 10, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3 },
})
