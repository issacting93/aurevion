import { memo, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from './tokens'

/* ═══════════════════════════════════════════════════════════════════════════
   Aurevion Chart System
   ─────────────────────
   LineChart      — smooth organic curve with soft area fill
   BarChart       — vertical bars for category comparisons
   Sparkline      — minimal inline trend (no card, no axes)
   AreaChart      — filled area, multi-series layering
   GaugeChart     — semi-circular arc with center value
   LollipopChart  — thin stems with dots (sleep, sales, discrete data)
   WaveformChart  — dense thin bars (heartbeat, activity, signal data)
   ═══════════════════════════════════════════════════════════════════════════ */

const VW = 400

/* ── Catmull-Rom smoothing ─────────────────────────────────────────────── */

function catmullRomCurves(points, tension = 0.35) {
  const curves = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    curves.push({
      cp1: [p1[0] + (p2[0] - p0[0]) * tension, p1[1] + (p2[1] - p0[1]) * tension],
      cp2: [p2[0] - (p3[0] - p1[0]) * tension, p2[1] - (p3[1] - p1[1]) * tension],
      end: p2,
    })
  }
  return curves
}

function catmullRomPath(points, tension = 0.35) {
  if (points.length < 2) return ''
  if (points.length === 2)
    return `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`
  const curves = catmullRomCurves(points, tension)
  const d = [`M${points[0][0]},${points[0][1]}`]
  for (const c of curves)
    d.push(`C${c.cp1[0]},${c.cp1[1]} ${c.cp2[0]},${c.cp2[1]} ${c.end[0]},${c.end[1]}`)
  return d.join(' ')
}

function reversedCurvePath(points, tension = 0.35) {
  if (points.length < 2) return ''
  if (points.length === 2)
    return `M${points[1][0]},${points[1][1]} L${points[0][0]},${points[0][1]}`
  const curves = catmullRomCurves(points, tension)
  const last = curves[curves.length - 1].end
  const d = [`M${last[0]},${last[1]}`]
  for (let i = curves.length - 1; i >= 0; i--) {
    const c = curves[i]
    const start = i === 0 ? points[0] : curves[i - 1].end
    d.push(`C${c.cp2[0]},${c.cp2[1]} ${c.cp1[0]},${c.cp1[1]} ${start[0]},${start[1]}`)
  }
  return d.join(' ')
}

/* ── Shared primitives ─────────────────────────────────────────────────── */

function niceRange(data, target, band) {
  let min = Infinity, max = -Infinity
  for (let i = 0; i < data.length; i++) {
    const v = data[i]
    if (v < min) min = v
    if (v > max) max = v
    if (band != null) {
      const t = i / Math.max(1, data.length - 1)
      const spread = typeof band === 'function' ? band(t) : band
      const lo = v - spread / 2, hi = v + spread / 2
      if (lo < min) min = lo
      if (hi > max) max = hi
    }
  }
  if (target != null) {
    if (target < min) min = target
    if (target > max) max = target
  }
  return { min, max, range: max - min || 1 }
}

function ChartCard({ children, style }) {
  return (
    <div style={{
      background: Color.surface,
      border: `1px solid ${Color.border}`,
      borderRadius: Radius.xl,
      padding: Space[5],
      ...style,
    }}>
      {children}
    </div>
  )
}

function ChartHeader({ title, titleSublabel, titleValue, titleUnit, yLabel }) {
  return (
    <>
      {(title || titleSublabel || yLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Space[2] }}>
          {title && <span style={{ ...Type.labelMd, color: Color.mute }}>{title}</span>}
          {(titleSublabel || yLabel) && (
            <span style={{ ...Type.labelMd, color: Color.mute }}>{titleSublabel || yLabel}</span>
          )}
        </div>
      )}
      {titleValue != null && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[2], marginBottom: Space[4] }}>
          <span style={{
            fontFamily: Font.sans, fontSize: 40, fontWeight: 200,
            letterSpacing: -40 * 0.028, lineHeight: 1, color: Color.text,
          }}>{titleValue}</span>
          {titleUnit && <span style={{ ...Type.labelMd, color: Color.mute }}>{titleUnit}</span>}
        </div>
      )}
    </>
  )
}

// Inject chart keyframes once into document head
let _keyframesInjected = false
function ensureKeyframes() {
  if (_keyframesInjected || typeof document === 'undefined') return
  _keyframesInjected = true
  const s = document.createElement('style')
  s.id = 'aurevion-chart-keyframes'
  s.textContent = `
    @keyframes chart-reveal {
      from { width: 0 }
      to   { width: ${VW} }
    }
    @keyframes chart-pulse {
      0%   { r: 4; opacity: 0.6 }
      100% { r: 16; opacity: 0 }
    }
    @keyframes chart-bar-grow {
      from { transform: scaleY(0); transform-origin: bottom }
      to   { transform: scaleY(1); transform-origin: bottom }
    }
    @keyframes chart-gauge-draw {
      from { stroke-dashoffset: var(--gauge-circ) }
      to   { stroke-dashoffset: var(--gauge-offset) }
    }
  `
  document.head.appendChild(s)
}

/* ═══════════════════════════════════════════════════════════════════════════
   LineChart — smooth organic curve with soft area fill
   ═══════════════════════════════════════════════════════════════════════════ */

export const LineChart = memo(function LineChart({
  data = [],
  target,
  band,
  hatched = false,
  pulse = false,
  xLabels,
  yLabel,
  title,
  titleValue,
  titleUnit,
  titleSublabel,
  height = 140,
  color = Color.accent,
  dotSize = 4,
  showDots = true,
  animated = false,
  annotation,       // { index, label } — floating annotation on a data point
  style,
}) {
  if (animated) ensureKeyframes()
  const padX = 32
  const padTop = 12
  const padBottom = 8
  const xLabelH = xLabels ? 28 : 0
  const totalH = height + xLabelH

  const activeColor = useMemo(() => {
    if (target != null && data.length > 0 && data[data.length - 1] >= target) return Color.green
    return color
  }, [data, target, color])

  const { points, upperPts, lowerPts, targetY } = useMemo(() => {
    if (data.length === 0) return { points: [], upperPts: null, lowerPts: null, targetY: null }
    const { min, range } = niceRange(data, target, band)
    const chartH = height - padTop - padBottom
    const toY = (v) => padTop + chartH - ((v - min) / range) * chartH
    const toX = (i) => padX + (i / Math.max(1, data.length - 1)) * (VW - padX * 2)

    const pts = data.map((v, i) => [toX(i), toY(v)])

    let upper = null, lower = null
    if (band != null) {
      upper = data.map((v, i) => {
        const t = i / Math.max(1, data.length - 1)
        const spread = typeof band === 'function' ? band(t) : band
        return [toX(i), toY(v + spread / 2)]
      })
      lower = data.map((v, i) => {
        const t = i / Math.max(1, data.length - 1)
        const spread = typeof band === 'function' ? band(t) : band
        return [toX(i), toY(v - spread / 2)]
      })
    }

    return { points: pts, upperPts: upper, lowerPts: lower, targetY: target != null ? toY(target) : null }
  }, [data, target, band, height])

  const uid = useMemo(() => `lc-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <ChartCard style={style}>
      <ChartHeader title={title} titleSublabel={titleSublabel} titleValue={titleValue} titleUnit={titleUnit} yLabel={yLabel} />
      <svg width="100%" viewBox={`0 0 ${VW} ${totalH}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={activeColor} stopOpacity={band ? 0.18 : 0.25} />
            <stop offset="100%" stopColor={activeColor} stopOpacity={0} />
          </linearGradient>
          {hatched && (
            <pattern id={`${uid}-h`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke={activeColor} strokeWidth="1" strokeOpacity="0.3" />
            </pattern>
          )}
          {animated && (
            <clipPath id={`${uid}-r`}>
              <rect x="0" y="0" width={VW} height={totalH}
                style={{ animation: 'chart-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both' }} />
            </clipPath>
          )}
        </defs>

        {points.length >= 2 && (() => {
          const linePath = catmullRomPath(points)
          const first = points[0]
          const last = points[points.length - 1]

          let bandPath = null
          if (upperPts && lowerPts) {
            bandPath = catmullRomPath(upperPts) + ' L' + reversedCurvePath(lowerPts).slice(1) + ' Z'
          }
          const fillPath = bandPath || `${linePath} L${last[0]},${height} L${first[0]},${height} Z`

          const inner = (
            <>
              <path d={fillPath} fill={`url(#${uid}-g)`} />
              {hatched && bandPath && <path d={bandPath} fill={`url(#${uid}-h)`} fillOpacity="0.4" />}
              <path d={linePath} fill="none" stroke={activeColor} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {targetY != null && (
                <line x1={padX} y1={targetY} x2={VW - padX} y2={targetY}
                  stroke={Color.mute} strokeWidth={1} strokeDasharray="6 4" />
              )}
              {showDots && points.map(([x, y], i) => {
                const isLast = i === points.length - 1
                return <circle key={i} cx={x} cy={y} r={isLast ? dotSize + 1.5 : dotSize * 0.6} fill={isLast ? activeColor : activeColor} fillOpacity={isLast ? 1 : 0.7} />
              })}
              {pulse && points.length > 0 && (() => {
                const [px, py] = points[points.length - 1]
                return <circle cx={px} cy={py} r="10" fill="none" stroke={activeColor} strokeWidth="2" opacity="0"
                  style={{ animation: 'chart-pulse 2s ease-out infinite 1.2s' }} />
              })()}
              {annotation && points[annotation.index] && (() => {
                const [ax, ay] = points[annotation.index]
                return (
                  <g>
                    <line x1={ax} y1={ay - 8} x2={ax} y2={padTop - 4} stroke={Color.faint} strokeWidth={1} strokeDasharray="2 2" />
                    <text x={ax} y={padTop - 8} textAnchor="middle" fill={Color.dim}
                      style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500 }}>
                      {annotation.label}
                    </text>
                  </g>
                )
              })()}
            </>
          )

          return animated ? <g clipPath={`url(#${uid}-r)`}>{inner}</g> : <g>{inner}</g>
        })()}

        {xLabels && xLabels.map((label, i) => {
          const x = padX + (i / Math.max(1, xLabels.length - 1)) * (VW - padX * 2)
          return (
            <text key={i} x={x} y={height + xLabelH - 6} textAnchor="middle"
              fill={i === xLabels.length - 1 ? activeColor : Color.mute}
              style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 0.5 }}>
              {label}
            </text>
          )
        })}
      </svg>
          </ChartCard>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   GaugeChart — semi-circular arc with center value
   ═══════════════════════════════════════════════════════════════════════════ */

export const GaugeChart = memo(function GaugeChart({
  value = 0,         // 0–100 percentage, or use min/max
  min = 0,
  max = 100,
  label,
  displayValue,      // what to show in center (string)
  unit,
  sublabel,
  size = 160,
  strokeWidth = 14,
  color = Color.accent,
  trackColor = Color.border,
  animated = false,
  style,
}) {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min || 1)))
  if (animated) ensureKeyframes()
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = Math.PI * r  // half circumference
  const offset = circ * (1 - pct)

  const uid = useMemo(() => `gc-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...style }}>
      <div style={{ position: 'relative', width: size, height: size / 2 + 12 }}>
        <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} style={{ display: 'block', overflow: 'visible' }}>
          {/* Track */}
          <path
            d={`M ${strokeWidth / 2} ${cy} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
            fill="none" stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${cy} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={animated ? {
              '--gauge-circ': circ,
              '--gauge-offset': offset,
              animation: 'chart-gauge-draw 1s cubic-bezier(0.16, 1, 0.3, 1) both',
            } : undefined}
          />
          {/* Tick at end of value */}
          {pct > 0 && pct < 1 && (() => {
            const angle = Math.PI * (1 - pct)
            const tx = cx + r * Math.cos(angle)
            const ty = cy - r * Math.sin(angle)
            return <circle cx={tx} cy={ty} r={strokeWidth / 2 + 2} fill={color} />
          })()}
        </svg>
        {/* Center value */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{
              fontFamily: Font.sans, fontSize: size * 0.22, fontWeight: 200,
              letterSpacing: -1, lineHeight: 1, color: Color.text,
            }}>{displayValue ?? value}</span>
            {unit && <span style={{ ...Type.labelMd, color: Color.mute }}>{unit}</span>}
          </div>
        </div>
      </div>
      {(label || sublabel) && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          {label && <div style={{ ...Type.labelMd, color: Color.mute }}>{label}</div>}
          {sublabel && <div style={{ ...Type.dataSm, color: Color.faint, marginTop: 2 }}>{sublabel}</div>}
        </div>
      )}
          </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   LollipopChart — thin stems with round dots
   Great for discrete data (sleep hours, sales, events per day)
   ═══════════════════════════════════════════════════════════════════════════ */

export const LollipopChart = memo(function LollipopChart({
  data = [],         // [{ label, value, highlight? }]
  title,
  titleValue,
  titleUnit,
  titleSublabel,
  goal,              // horizontal goal line
  goalLabel,
  height = 140,
  color = Color.accent,
  stemColor = Color.text,
  dotSize = 5,
  animated = false,
  style,
}) {
  if (animated) ensureKeyframes()
  const padX = 32
  const padTop = 16
  const padBottom = 28
  const chartH = height - padTop - padBottom

  const { maxVal } = useMemo(() => {
    const vals = data.map(d => d.value)
    if (goal) vals.push(goal)
    return { maxVal: Math.max(...vals) || 1 }
  }, [data, goal])

  const n = data.length
  const chartW = VW - padX * 2
  const spacing = chartW / Math.max(1, n - 1)

  return (
    <ChartCard style={style}>
      <ChartHeader title={title} titleSublabel={titleSublabel} titleValue={titleValue} titleUnit={titleUnit} />
      <svg width="100%" viewBox={`0 0 ${VW} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        {/* Goal line */}
        {goal != null && (() => {
          const gy = padTop + chartH - (goal / maxVal) * chartH
          return (
            <g>
              <line x1={padX} y1={gy} x2={VW - padX} y2={gy}
                stroke={Color.faint} strokeWidth={1} strokeDasharray="4 4" />
              {goalLabel && (
                <g>
                  <rect x={padX - 4} y={gy - 14} width={goalLabel.length * 7 + 16} height={20} rx={10}
                    fill={Color.surface} stroke={Color.border} strokeWidth={1} />
                  <text x={padX + 4} y={gy} fill={Color.dim}
                    style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>
                    {goalLabel}
                  </text>
                </g>
              )}
            </g>
          )
        })()}

        {data.map((d, i) => {
          const x = n === 1 ? VW / 2 : padX + i * spacing
          const barH = (d.value / maxVal) * chartH
          const y = padTop + chartH - barH
          const isHighlight = d.highlight
          const dotColor = isHighlight ? color : stemColor

          return (
            <g key={i}>
              {/* Stem */}
              <line x1={x} y1={padTop + chartH} x2={x} y2={y + dotSize}
                stroke={isHighlight ? color : Color.faint} strokeWidth={isHighlight ? 2 : 1.5}
                strokeLinecap="round"
                style={animated ? { animation: `chart-bar-grow 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s both` } : undefined} />
              {/* Dot */}
              <circle cx={x} cy={y} r={isHighlight ? dotSize + 1 : dotSize}
                fill={dotColor} fillOpacity={isHighlight ? 1 : 0.85}
                style={animated ? { animation: `chart-bar-grow 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04 + 0.1}s both` } : undefined} />
              {/* Label */}
              {d.label && (
                <text x={x} y={height - 6} textAnchor="middle" fill={Color.mute}
                  style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 0.5 }}>
                  {d.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
          </ChartCard>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   WaveformChart — dense thin vertical bars (heartbeat, activity, signal)
   ═══════════════════════════════════════════════════════════════════════════ */

export const WaveformChart = memo(function WaveformChart({
  data = [],         // number[] — values to plot as vertical bars
  title,
  titleValue,
  titleUnit,
  xLabels,           // [string] — labels at start and end
  height = 48,
  color = Color.accent,
  barWidth = 2,
  gap = 1,
  animated = false,
  style,
}) {
  if (animated) ensureKeyframes()
  const xLabelH = xLabels ? 20 : 0
  const totalH = height + xLabelH
  const n = data.length
  const totalBarW = n * (barWidth + gap)

  const maxVal = useMemo(() => Math.max(...data) || 1, [data])

  return (
    <div style={style}>
      <svg width="100%" viewBox={`0 0 ${totalBarW} ${totalH}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        {data.map((v, i) => {
          const barH = Math.max(1, (v / maxVal) * height)
          const x = i * (barWidth + gap)
          const y = height - barH
          return (
            <rect key={i} x={x} y={y} width={barWidth} height={barH}
              rx={barWidth / 2} fill={color} fillOpacity={0.85}
              style={animated ? { animation: `chart-bar-grow 0.3s ease-out ${i * 0.005}s both` } : undefined} />
          )
        })}
        {xLabels && (
          <>
            <text x={0} y={totalH - 2} fill={Color.mute}
              style={{ fontFamily: Font.mono, fontSize: Math.max(8, totalBarW * 0.04), fontWeight: 500 }}>
              {xLabels[0]}
            </text>
            <text x={totalBarW} y={totalH - 2} textAnchor="end" fill={Color.mute}
              style={{ fontFamily: Font.mono, fontSize: Math.max(8, totalBarW * 0.04), fontWeight: 500 }}>
              {xLabels[xLabels.length - 1]}
            </text>
          </>
        )}
      </svg>
          </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   BarChart — vertical bars for category comparisons
   ═══════════════════════════════════════════════════════════════════════════ */

export const BarChart = memo(function BarChart({
  data = [],        // [{ label, value, color? }] or [{ label, values: [{ value, color, key }] }]
  title,
  titleValue,
  titleUnit,
  titleSublabel,
  height = 140,
  color = Color.accent,
  barRadius = 6,
  showValues = false,
  stacked = false,
  animated = false,
  style,
}) {
  if (animated) ensureKeyframes()
  const padX = 32
  const padTop = 16
  const padBottom = 28
  const chartH = height - padTop - padBottom

  const { bars, maxVal } = useMemo(() => {
    const normalized = data.map(d => ({
      label: d.label,
      segments: d.values
        ? d.values
        : [{ value: d.value, color: d.color || color, key: d.label }],
    }))
    let max = 0
    normalized.forEach(b => {
      if (stacked) {
        max = Math.max(max, b.segments.reduce((s, seg) => s + seg.value, 0))
      } else {
        b.segments.forEach(seg => { max = Math.max(max, seg.value) })
      }
    })
    return { bars: normalized, maxVal: max || 1 }
  }, [data, color, stacked])

  const n = bars.length
  const chartW = VW - padX * 2
  const groupW = chartW / n
  const gap = Math.max(6, groupW * 0.25)
  const barW = (groupW - gap) / (stacked ? 1 : Math.max(1, bars[0]?.segments.length || 1))

  return (
    <ChartCard style={style}>
      <ChartHeader title={title} titleSublabel={titleSublabel} titleValue={titleValue} titleUnit={titleUnit} />
      <svg width="100%" viewBox={`0 0 ${VW} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        {bars.map((bar, bi) => {
          const groupX = padX + bi * groupW + gap / 2
          if (stacked) {
            let yOffset = 0
            return (
              <g key={bi}>
                {bar.segments.map((seg, si) => {
                  const h = (seg.value / maxVal) * chartH
                  const y = padTop + chartH - yOffset - h
                  yOffset += h
                  return (
                    <rect key={si} x={groupX} y={y} width={groupW - gap} height={h}
                      rx={si === bar.segments.length - 1 ? barRadius : 0}
                      fill={seg.color || color} fillOpacity={0.85}
                      style={animated ? { animation: `chart-bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${bi * 0.05}s both` } : undefined} />
                  )
                })}
                <text x={groupX + (groupW - gap) / 2} y={height - 6} textAnchor="middle" fill={Color.mute}
                  style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 0.5 }}>
                  {bar.label}
                </text>
              </g>
            )
          }
          return (
            <g key={bi}>
              {bar.segments.map((seg, si) => {
                const h = (seg.value / maxVal) * chartH
                const x = groupX + si * barW
                const y = padTop + chartH - h
                return (
                  <g key={si}>
                    <rect x={x} y={y} width={barW - 2} height={h}
                      rx={barRadius} fill={seg.color || color} fillOpacity={0.85}
                      style={animated ? { animation: `chart-bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${bi * 0.05}s both` } : undefined} />
                    {showValues && (
                      <text x={x + (barW - 2) / 2} y={y - 8} textAnchor="middle" fill={Color.dim}
                        style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 600 }}>
                        {seg.value}
                      </text>
                    )}
                  </g>
                )
              })}
              <text x={groupX + (groupW - gap) / 2} y={height - 6} textAnchor="middle" fill={Color.mute}
                style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 0.5 }}>
                {bar.label}
              </text>
            </g>
          )
        })}
      </svg>
          </ChartCard>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   Sparkline — minimal inline trend
   ═══════════════════════════════════════════════════════════════════════════ */

export const Sparkline = memo(function Sparkline({
  data = [],
  width = '100%',
  height = 24,
  color = Color.accent,
  strokeWidth = 1.5,
  fill = false,
  dot = false,
  style,
}) {
  const vw = 100
  const pad = 4

  const { d, lastPt, fillD } = useMemo(() => {
    if (data.length < 2) return { d: '', lastPt: null, fillD: '' }
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const pts = data.map((v, i) => [
      pad + (i / (data.length - 1)) * (vw - pad * 2),
      pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2),
    ])
    const line = catmullRomPath(pts)
    const last = pts[pts.length - 1]
    const area = fill ? `${line} L${last[0]},${height} L${pts[0][0]},${height} Z` : ''
    return { d: line, lastPt: last, fillD: area }
  }, [data, height])

  /* Dot is rendered outside the SVG so preserveAspectRatio="none" doesn't squash it */
  const dotSize = 8
  const dotLeft = lastPt ? `${(lastPt[0] / vw) * 100}%` : 0
  const dotTop = lastPt ? `${(lastPt[1] / height) * 100}%` : 0

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg width="100%" height={height} viewBox={`0 0 ${vw} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        {fill && fillD && <path d={fillD} fill={color} fillOpacity={0.1} />}
        {d && <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
      </svg>
      {dot && lastPt && (
        <div style={{
          position: 'absolute', left: dotLeft, top: dotTop,
          width: dotSize, height: dotSize, borderRadius: '50%',
          background: color, transform: 'translate(-50%, -50%)',
        }} />
      )}
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
   AreaChart — filled area, multi-series
   ═══════════════════════════════════════════════════════════════════════════ */

export const AreaChart = memo(function AreaChart({
  series = [],
  data,
  xLabels,
  title,
  titleValue,
  titleUnit,
  titleSublabel,
  height = 140,
  color = Color.accent,
  showLine = true,
  showDots = false,
  animated = false,
  style,
}) {
  if (animated) ensureKeyframes()
  const padX = 32
  const padTop = 12
  const padBottom = 8
  const xLabelH = xLabels ? 28 : 0
  const totalH = height + xLabelH

  const allSeries = useMemo(() => {
    if (data) return [{ data, color, label: '' }]
    return series
  }, [data, series, color])

  const curves = useMemo(() => {
    const allVals = allSeries.flatMap(s => s.data)
    const min = Math.min(...allVals)
    const max = Math.max(...allVals)
    const range = max - min || 1
    const chartH = height - padTop - padBottom
    const toY = (v) => padTop + chartH - ((v - min) / range) * chartH

    return allSeries.map(s => ({
      ...s,
      points: s.data.map((v, i) => [
        padX + (i / Math.max(1, s.data.length - 1)) * (VW - padX * 2),
        toY(v),
      ]),
    }))
  }, [allSeries, height])

  const uid = useMemo(() => `ac-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <ChartCard style={style}>
      <ChartHeader title={title} titleSublabel={titleSublabel} titleValue={titleValue} titleUnit={titleUnit} />
      <svg width="100%" viewBox={`0 0 ${VW} ${totalH}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        <defs>
          {curves.map((c, i) => (
            <linearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.color || color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={c.color || color} stopOpacity={0.02} />
            </linearGradient>
          ))}
          {animated && (
            <clipPath id={`${uid}-r`}>
              <rect x="0" y="0" width={VW} height={totalH}
                style={{ animation: 'chart-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both' }} />
            </clipPath>
          )}
        </defs>

        {(() => {
          const inner = curves.map((c, ci) => {
            if (c.points.length < 2) return null
            const linePath = catmullRomPath(c.points)
            const first = c.points[0]
            const last = c.points[c.points.length - 1]
            const fillPath = `${linePath} L${last[0]},${height} L${first[0]},${height} Z`
            const sc = c.color || color
            return (
              <g key={ci}>
                <path d={fillPath} fill={`url(#${uid}-g${ci})`} />
                {showLine && <path d={linePath} fill="none" stroke={sc} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />}
                {showDots && c.points.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={i === c.points.length - 1 ? 4 : 2.5} fill={sc} fillOpacity={i === c.points.length - 1 ? 1 : 0.7} />
                ))}
              </g>
            )
          })
          return animated ? <g clipPath={`url(#${uid}-r)`}>{inner}</g> : <g>{inner}</g>
        })()}

        {xLabels && xLabels.map((label, i) => {
          const x = padX + (i / Math.max(1, xLabels.length - 1)) * (VW - padX * 2)
          return (
            <text key={i} x={x} y={height + xLabelH - 6} textAnchor="middle" fill={Color.mute}
              style={{ fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 0.5 }}>
              {label}
            </text>
          )
        })}
      </svg>
          </ChartCard>
  )
})
