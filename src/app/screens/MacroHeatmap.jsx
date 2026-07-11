// 12 Macro Adherence Heatmap — 7×N grid (days × weeks) showing how closely
// the user hit protein/carb/fat targets. Surfaces patterns invisible in daily views.

import { useState } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, Phone, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FTabBar } from '../../ui/components'
import { MOCK_HEATMAP, MOCK_TARGETS } from '../../context/mockUser'

// ── Sample data: 8 weeks of adherence percentages ──
// 100 = exact target, <100 = under, >100 = over

const HEATMAP_DATA = MOCK_HEATMAP

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const WEEKS = ['W12', 'W13', 'W14', 'W15', 'W16', 'W17', 'W18', 'W19']

// ── Color mapping: adherence % → cell opacity ──
function adherenceAlpha(pct) {
  const dist = Math.abs(pct - 100)
  return Math.max(0.08, 1 - (dist / 45))
}

function cellBg(pct, rgb) {
  const alpha = adherenceAlpha(pct)
  return `rgba(${rgb}, ${alpha.toFixed(2)})`
}

// ── Single macro grid ──
function MacroHeatmap({ label, data, rgb, color, target, unit }) {
  const [hoveredCell, setHoveredCell] = useState(null)

  const flat = data.flat()
  const hitDays = flat.filter(v => v >= 85 && v <= 115).length
  const hitPct = Math.round((hitDays / flat.length) * 100)
  const avg = Math.round(flat.reduce((a, b) => a + b, 0) / flat.length)

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          <span style={{
            fontFamily: Font.mono, fontSize: 10, fontWeight: 600,
            letterSpacing: 1.2, color, textTransform: 'uppercase',
          }}>{label}</span>
        </div>
        <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute }}>{target}{unit}</span>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 3 }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontFamily: Font.mono, fontSize: 9,
            color: i >= 5 ? `${color}88` : Color.mute, letterSpacing: 0.5,
          }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {week.map((val, di) => {
              const isHovered = hoveredCell && hoveredCell[0] === wi && hoveredCell[1] === di
              const over = val > 110
              return (
                <div
                  key={di}
                  onMouseEnter={() => setHoveredCell([wi, di])}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 3,
                    background: cellBg(val, rgb),
                    border: isHovered
                      ? `1.5px solid ${color}`
                      : over
                        ? `1px solid rgba(${rgb}, 0.3)`
                        : '1px solid transparent',
                    cursor: 'default',
                    position: 'relative',
                    transition: 'border-color 0.1s ease',
                  }}
                >
                  {isHovered && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: '50%',
                      transform: 'translateX(-50%)', marginBottom: 4,
                      padding: '3px 6px', borderRadius: Radius.sm,
                      background: 'rgba(0,0,0,0.9)', border: `1px solid ${Color.borderSoft}`,
                      whiteSpace: 'nowrap', zIndex: 10,
                      fontFamily: Font.mono, fontSize: 10, color: Color.text,
                    }}>
                      {val}%
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
        <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute }}>{hitPct}% ON TARGET</span>
        <span style={{ fontFamily: Font.mono, fontSize: 10, color: avg >= 85 && avg <= 110 ? Color.green : Color.accent }}>
          AVG {avg}%
        </span>
      </div>
    </div>
  )
}

// ── Insight row ──
function HeatmapInsight({ icon, color, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 0', borderTop: `1px solid ${Color.borderSoft}`,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background: `${color}15`, flexShrink: 0,
        display: 'grid', placeItems: 'center', marginTop: 1,
      }}>
        <FIcon path={icon} size={13} color={color} stroke={2} />
      </div>
      <div style={{ ...Type.bodyMd, color: Color.dim, flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ── Legend ──
function HeatmapLegend() {
  const steps = [0.08, 0.2, 0.4, 0.65, 0.85, 1.0]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute }}>MISS</span>
      <div style={{ display: 'flex', gap: 2 }}>
        {steps.map((a, i) => (
          <div key={i} style={{
            width: 12, height: 8, borderRadius: 2,
            background: `rgba(255,110,80, ${a})`,
          }} />
        ))}
      </div>
      <span style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute }}>HIT</span>
    </div>
  )
}

// ── Content (for Shell) ──
export function MacroHeatmapContent() {
  const allVals = [
    ...HEATMAP_DATA.protein.flat(),
    ...HEATMAP_DATA.carbs.flat(),
    ...HEATMAP_DATA.fat.flat(),
  ]
  const overallHit = allVals.filter(v => v >= 85 && v <= 115).length
  const overallPct = Math.round((overallHit / allVals.length) * 100)

  // Weekend protein gap
  const protWkday = HEATMAP_DATA.protein.flatMap(w => w.slice(0, 5))
  const protWkend = HEATMAP_DATA.protein.flatMap(w => w.slice(5))
  const protWkdayAvg = Math.round(protWkday.reduce((a, b) => a + b, 0) / protWkday.length)
  const protWkendAvg = Math.round(protWkend.reduce((a, b) => a + b, 0) / protWkend.length)

  // Carb weekend overshoot
  const carbWkend = HEATMAP_DATA.carbs.flatMap(w => w.slice(5))
  const carbWkendAvg = Math.round(carbWkend.reduce((a, b) => a + b, 0) / carbWkend.length)

  // Trend: first 4 vs last 4 weeks
  const first4 = [
    ...HEATMAP_DATA.protein.slice(0, 4).flat(),
    ...HEATMAP_DATA.carbs.slice(0, 4).flat(),
    ...HEATMAP_DATA.fat.slice(0, 4).flat(),
  ]
  const last4 = [
    ...HEATMAP_DATA.protein.slice(4).flat(),
    ...HEATMAP_DATA.carbs.slice(4).flat(),
    ...HEATMAP_DATA.fat.slice(4).flat(),
  ]
  const first4Hit = Math.round(first4.filter(v => v >= 85 && v <= 115).length / first4.length * 100)
  const last4Hit = Math.round(last4.filter(v => v >= 85 && v <= 115).length / last4.length * 100)
  const improving = last4Hit > first4Hit

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Hero stat */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[3] }}>
          <FNum size={40} weight={200} unit="%">{overallPct}</FNum>
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
          <FMono color={Color.dim}>DAYS WITHIN ±15% OF TARGET</FMono>
          {improving && (
            <FTag tone="green" icon={<FIcon path={ICONS.trend_up} size={11} stroke={2.4} />}>
              IMPROVING
            </FTag>
          )}
        </div>

        {/* Three heatmaps */}
        <FSurface style={{
          marginTop: 32,
        }}>
          <div style={{ display: 'flex', gap: Space[3] }}>
            {/* Week labels */}
            <div style={{ width: 24, flexShrink: 0, paddingTop: 22 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {WEEKS.map((w, i) => (
                  <div key={i} style={{
                    aspectRatio: '3 / 1', display: 'flex', alignItems: 'center',
                    fontFamily: Font.mono, fontSize: 7, color: Color.faint,
                    letterSpacing: 0.5, lineHeight: 1,
                    height: 0, paddingBottom: 'calc(100% / 3)', position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
                      {w}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <MacroHeatmap label="Protein" data={HEATMAP_DATA.protein}
              rgb="255,110,80" color={Color.accent} target={String(MOCK_TARGETS.protein)} unit="g" />

            <div style={{ width: 1, background: Color.borderSoft, flexShrink: 0 }} />

            <MacroHeatmap label="Carbs" data={HEATMAP_DATA.carbs}
              rgb="96,165,250" color={Color.blue} target={String(MOCK_TARGETS.carbs)} unit="g" />

            <div style={{ width: 1, background: Color.borderSoft, flexShrink: 0 }} />

            <MacroHeatmap label="Fat" data={HEATMAP_DATA.fat}
              rgb="161,161,161" color={Color.dim} target={String(MOCK_TARGETS.fat)} unit="g" />
          </div>

          {/* Legend */}
          <div style={{
            marginTop: 14, paddingTop: 12,
            borderTop: `1px solid ${Color.borderSoft}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <HeatmapLegend />
            <FMono color={Color.faint} size={9}>BRIGHTER = CLOSER TO TARGET</FMono>
          </div>
        </FSurface>

        {/* Weekend vs weekday */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FSurface style={{ padding: 16, borderRadius: Radius.lg }}>
            <FLabel mb={4}>Weekdays</FLabel>
            <FNum size={22} weight={300} unit="%">{protWkdayAvg}</FNum>
            <FMono color={Color.mute} size={10}>PROTEIN AVG</FMono>
          </FSurface>
          <FSurface accent={Color.accent} style={{ padding: 16, borderRadius: Radius.lg }}>
            <FLabel mb={4} color={Color.accent}>Weekends</FLabel>
            <FNum size={22} weight={300} unit="%" color={Color.accent}>{protWkendAvg}</FNum>
            <FMono color={Color.accent} size={10}>PROTEIN AVG</FMono>
          </FSurface>
        </div>

        {/* Insights */}
        <FSurface style={{
          marginTop: 24,
        }}>
          <FLabel mb={8}>Patterns detected</FLabel>

          <HeatmapInsight icon={ICONS.trend_dn} color={Color.accent}>
            <strong style={{ color: Color.text }}>Protein drops {protWkdayAvg - protWkendAvg}% on weekends.</strong>{' '}
            Sat–Sun average is {protWkendAvg}% of target vs {protWkdayAvg}% on weekdays. Pre-prepping a high-protein weekend meal could close this.
          </HeatmapInsight>

          <HeatmapInsight icon={ICONS.trend_up} color={Color.blue}>
            <strong style={{ color: Color.text }}>Carbs overshoot weekends by ~{carbWkendAvg - 100}%.</strong>{' '}
            Social eating and less structured meals push carbs above target consistently on Sat–Sun.
          </HeatmapInsight>

          {improving && (
            <HeatmapInsight icon={ICONS.sparkle} color={Color.green}>
              <strong style={{ color: Color.text }}>Adherence improving.</strong>{' '}
              Last 4 weeks: {last4Hit}% on-target days vs {first4Hit}% in the first 4. The model is working.
            </HeatmapInsight>
          )}
        </FSurface>

        {/* 8-week trend bar */}
        <FSurface style={{
          marginTop: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <FLabel mb={0}>8-week trend</FLabel>
            <FMono color={improving ? Color.green : Color.accent}>
              {improving ? '+' : ''}{last4Hit - first4Hit}% IMPROVEMENT
            </FMono>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 48 }}>
            {Array.from({ length: 8 }).map((_, wi) => {
              const weekVals = [
                ...HEATMAP_DATA.protein[wi],
                ...HEATMAP_DATA.carbs[wi],
                ...HEATMAP_DATA.fat[wi],
              ]
              const weekHit = Math.round(
                weekVals.filter(v => v >= 85 && v <= 115).length / weekVals.length * 100
              )
              return (
                <div key={wi} style={{
                  flex: 1, borderRadius: 3,
                  height: `${Math.max(8, weekHit)}%`,
                  background: wi >= 4
                    ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${Color.accent}`
                    : 'rgba(255,255,255,0.10)',
                  transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <FMono color={Color.mute} size={9}>W12</FMono>
            <FMono color={Color.accent} size={9}>W19</FMono>
          </div>
        </FSurface>
    </div>
  )
}

// ── Screen (standalone) ──
export function MacroHeatmapScreen() {
  return (
    <Phone label="Macro adherence" group="ANALYTICS">
      <FNavBar
        title="Adherence"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text} />}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text} />}
      />
      <MacroHeatmapContent />
      <FTabBar active={3} />
    </Phone>
  )
}
