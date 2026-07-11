// Water Tracking — Ring Focus: hydration progress ring with micro sparkline.

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type, Ease, alpha } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FTabBar, FListRow, Phone } from '../../ui/components'
import { Sparkline } from '../../ui/chart'
import { MOCK_WATER } from '../../context/mockUser'

// ── Data ──
const WATER_7D = MOCK_WATER.trend7d

// ── Ring keyframes ──
let _waterKf = false
function ensureWaterKf() {
  if (_waterKf || typeof document === 'undefined') return
  _waterKf = true
  if (document.getElementById('water-ring-kf')) return
  const s = document.createElement('style')
  s.id = 'water-ring-kf'
  s.textContent = `
    @keyframes water-ring-draw {
      from { stroke-dashoffset: var(--arc); }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes water-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(s)
}

// ── Hydration Ring ──
function HydrationRing({ current, target, size = 200, strokeWidth = 14 }) {
  ensureWaterKf()
  const cx = size / 2, cy = size / 2
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r

  const exceeded = current >= target
  const pct = Math.min(current / target, 1)
  const fillArc = pct * circ
  const fillColor = exceeded ? Color.green : Color.blue

  const uid = useMemo(() => `wr-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size}>
        <defs>
          <filter id={`${uid}-glow`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={Color.faint} strokeWidth={strokeWidth} opacity={0.25} />

        {/* Fill */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${fillArc} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter={pct > 0.7 ? `url(#${uid}-glow)` : undefined}
          style={{ '--arc': fillArc, animation: `water-ring-draw 1s ${Ease.expo} 0.15s both` }} />
      </svg>

      {/* Center */}
      <div style={{ position: 'absolute', textAlign: 'center', animation: `water-fade-up 0.6s ${Ease.expo} 0.3s both` }}>
        <FNum size={42} weight={200} color={fillColor}>{current.toLocaleString()}</FNum>
        <div style={{ ...Type.labelSm, color: Color.mute, marginTop: 4 }}>ML TODAY</div>
      </div>
    </div>
  )
}

// ── Legend Item ──
function LegendItem({ color, label, value, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ ...Type.labelSm, color: Color.mute }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
          <span style={{ fontFamily: Font.mono, fontSize: 16, fontWeight: 400, color: Color.text, letterSpacing: -0.3 }}>{value}</span>
          <span style={{ ...Type.labelSm, color: Color.mute }}>{unit}</span>
        </div>
      </div>
    </div>
  )
}

export function WaterTrackingContent() {
  const [glasses, setGlasses] = useState(5)
  const glassSize = 250
  const current = glasses * glassSize
  const target = MOCK_WATER.target

  const log = [
    { time: '07:15', ml: 250 },
    { time: '09:30', ml: 250 },
    { time: '11:00', ml: 500 },
    { time: '13:45', ml: 250 },
  ]

  return (
    <div style={{ flex: 1, padding: '12px 24px 40px', overflowY: 'auto' }}>
      {/* Hero ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: Space[4] }}>
        <HydrationRing current={current} target={target} />
        <div style={{ ...Type.dataSm, color: Color.faint, marginTop: 10 }}>
          / {target.toLocaleString()} ml target
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: Space[7] }}>
        <LegendItem color={Color.blue} label="Today" value={current.toLocaleString()} unit="ml" />
        <LegendItem color={alpha(Color.blue, 0.35)} label="Avg 7d" value="2,100" unit="ml" />
        <LegendItem color={Color.green} label="Streak" value="3" unit="days" />
      </div>

      {/* 7-day trend */}
      <div style={{ marginTop: Space[8] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ ...Type.labelSm, color: Color.mute }}>7-DAY TREND</span>
          <span style={{ fontFamily: Font.mono, fontSize: 11, color: Color.dim }}>2,100 avg</span>
        </div>
        <Sparkline data={WATER_7D} height={36} color={Color.blue} strokeWidth={1.5} dot />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '0 2px' }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} style={{
              ...Type.labelSm,
              color: i === WATER_7D.length - 1 ? Color.blue : Color.faint,
              width: 14, textAlign: 'center',
            }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Today's log (data) */}
      <div style={{ marginTop: Space[7] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <FLabel mb={0}>Today's log</FLabel>
          <FMono size={10} color={Color.mute}>{log.length} ENTRIES</FMono>
        </div>
        {log.map((entry, i) => (
          <FListRow key={i}
            title={<FMono color={Color.mute}>{entry.time}</FMono>}
            trailing={<FMono color={Color.blue}>+{entry.ml} ml</FMono>}
            divider={i > 0}
            compact
          />
        ))}
      </div>

      {/* Quick add (interaction zone) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Space[2], marginTop: Space[7] }}>
        {[150, 250, 350, 500].map(ml => (
          <button key={ml} onClick={() => setGlasses(g => g + 1)} style={{
            padding: `${Space[3]}px ${Space[1]}px`, borderRadius: Radius.lg,
            background: Color.surface, border: `1px solid ${Color.borderSoft}`,
            color: Color.text, cursor: 'pointer', textAlign: 'center',
            fontFamily: Font.mono, fontSize: 13, fontWeight: 500,
            transition: 'border-color 0.15s ease',
          }}>
            <div style={{ color: Color.blue, marginBottom: 2 }}>+{ml}</div>
            <div style={{ fontSize: 10, color: Color.mute }}>ML</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function WaterTrackingScreen() {
  return (
    <Phone label="Water" group="FEEDBACK">
      <FNavBar
        title="Hydration"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text} />}
      />
      <WaterTrackingContent />
      <FTabBar active={2} />
    </Phone>
  )
}
