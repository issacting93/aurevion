// 02 TDEE — Ring Focus design across all TDEE screens.

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type, Ease, alpha } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FBtn, FTabBar, Phone } from '../../ui/components'
import { LineChart, Sparkline } from '../../ui/chart'
import { useNav } from '../../context/NavigationContext'
import { MOCK_TARGETS, MOCK_TDEE } from '../../context/mockUser'

// ── Data ──
const TDEE_TARGET = MOCK_TARGETS.tdee
const BMR = MOCK_TDEE.bmr
const ACTIVITY_BUDGET = MOCK_TDEE.activityBudget
const ACTIVITY_TODAY = MOCK_TDEE.activityToday
const TREND_7D = MOCK_TDEE.trend7d
const CONFIDENCE_TREND = MOCK_TDEE.confidenceTrend

// ── Shared ring keyframes ──
let _ringKf = false
function ensureRingKf() {
  if (_ringKf || typeof document === 'undefined') return
  _ringKf = true
  const s = document.createElement('style')
  s.id = 'tdee-ring-kf'
  s.textContent = `
    @keyframes tdee-ring-draw {
      from { stroke-dashoffset: var(--arc); }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes tdee-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(s)
}

// ── Segmented Burn Ring (Today screen) ──
export function TDEERing({ target, bmr, activity, size = 200, strokeWidth = 14 }) {
  ensureRingKf()
  const cx = size / 2, cy = size / 2
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const total = bmr + activity
  const exceeded = total > target

  const gapDeg = 3
  const gapLen = (gapDeg / 360) * circ
  const bmrPct = bmr / target
  const bmrArc = Math.max(0, bmrPct * circ - gapLen)
  const actArc = Math.max(0, (activity / target) * circ - (activity > 0 ? gapLen : 0))
  const actStartDeg = -90 + bmrPct * 360 + gapDeg
  const overflowArc = exceeded ? ((total - target) / target) * circ : 0
  const uid = useMemo(() => `tr-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size}>
        <defs>
          <filter id={`${uid}-glow`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={Color.faint} strokeWidth={strokeWidth} opacity={0.25} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={alpha(Color.accent, 0.3)} strokeWidth={strokeWidth}
          strokeDasharray={`${bmrArc} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ '--arc': bmrArc, animation: `tdee-ring-draw 1s ${Ease.expo} 0.15s both` }} />
        {activity > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={Color.accent} strokeWidth={strokeWidth}
            strokeDasharray={`${actArc} ${circ}`} strokeLinecap="round"
            transform={`rotate(${actStartDeg} ${cx} ${cy})`}
            filter={`url(#${uid}-glow)`}
            style={{ '--arc': actArc, animation: `tdee-ring-draw 1s ${Ease.expo} 0.45s both` }} />
        )}
        {exceeded && (
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={Color.green} strokeWidth={strokeWidth}
            strokeDasharray={`${overflowArc} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ '--arc': overflowArc, animation: `tdee-ring-draw 0.8s ${Ease.expo} 0.9s both` }} />
        )}
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', animation: `tdee-fade-up 0.6s ${Ease.expo} 0.3s both` }}>
        <FNum size={42} weight={200}>2,200</FNum>
        <div style={{ ...Type.labelSm, color: Color.mute, marginTop: 4 }}>KCAL BURNED</div>
      </div>
    </div>
  )
}

// ── Confidence Ring (Compare screen) ──
function ConfidenceRing({ label, confidence, bandHalf, size = 120, delay = 0.3 }) {
  ensureRingKf()
  const maxStroke = 20, minStroke = 8
  const strokeWidth = minStroke + (bandHalf / 210) * (maxStroke - minStroke)
  const r = (size - maxStroke) / 2
  const circ = 2 * Math.PI * r
  const arcLen = (confidence / 100) * circ
  const ringColor = confidence > 50 ? Color.accent : alpha(Color.accent, 0.4)
  const uid = useMemo(() => `cr-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `tdee-fade-up 0.5s ${Ease.expo} ${delay}s both` }}>
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size}>
          <defs>
            <filter id={`${uid}-g`}>
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={Color.faint} strokeWidth={strokeWidth} opacity={0.2} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={ringColor} strokeWidth={strokeWidth}
            strokeDasharray={`${arcLen} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            filter={confidence > 50 ? `url(#${uid}-g)` : undefined}
            style={{ '--arc': arcLen, animation: `tdee-ring-draw 1s ${Ease.expo} ${delay + 0.15}s both` }} />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <span style={{ fontFamily: Font.mono, fontSize: 24, fontWeight: 300, color: Color.text, letterSpacing: -0.5 }}>{confidence}%</span>
        </div>
      </div>
      <span style={{ ...Type.labelSm, color: Color.mute, marginTop: 8 }}>{label}</span>
      <span style={{ ...Type.dataSm, color: Color.faint, marginTop: 3 }}>{'\u00b1'}{bandHalf} kcal</span>
    </div>
  )
}

// ── Legend Item ──
export function LegendItem({ color, label, value, unit, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ ...Type.labelSm, color: Color.mute }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
          <span style={{ fontFamily: Font.mono, fontSize: 16, fontWeight: 400, color: Color.text, letterSpacing: -0.3 }}>{value}</span>
          <span style={{ ...Type.labelSm, color: Color.mute }}>{unit}</span>
        </div>
        {sub && <div style={{ ...Type.dataSm, color: Color.faint, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Today screen
   ═══════════════════════════════════════════════════════════════════════ */

export function TDEEContent() {
  const nav = useNav()
  return (
    <div style={{ flex: 1, padding: '12px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: Space[4] }}>
        <TDEERing target={TDEE_TARGET} bmr={BMR} activity={ACTIVITY_TODAY} />
        <div style={{ ...Type.dataSm, color: Color.faint, marginTop: 10 }}>/ {TDEE_TARGET.toLocaleString()} target</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: Space[7] }}>
        <LegendItem color={alpha(Color.accent, 0.35)} label="BMR" value="1,620" unit="kcal" />
        <LegendItem color={Color.accent} label="Activity" value={`+${ACTIVITY_TODAY}`} unit="kcal" sub={`of ${ACTIVITY_BUDGET} budget`} />
      </div>
      <div style={{ marginTop: Space[8] }}>
        <LineChart
          data={TREND_7D}
          target={TDEE_TARGET}
          xLabels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
          title="7-DAY TREND"
          titleSublabel={`${Math.round(TREND_7D.reduce((a, b) => a + b, 0) / TREND_7D.length).toLocaleString()} avg`}
          height={100}
          color={Color.accent}
          showDots
        />
      </div>
      <FSurface style={{ marginTop: Space[7] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <FLabel mb={0}>Model confidence</FLabel>
          <FMono color={Color.text}>74%</FMono>
        </div>
        <FTexBar pct={74} height={10} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <FMono color={Color.mute} size={10}>18 DAYS LOGGED</FMono>
          <FMono color={Color.mute} size={10}>TIGHTENS WITH USE</FMono>
        </div>
      </FSurface>
      {nav?.pushDetail && (
        <div style={{ marginTop: Space[5] }}>
          <FBtn variant="ghost" full onClick={() => nav.pushDetail('tdee-compare', 'Confidence')}>Trust over time →</FBtn>
        </div>
      )}
    </div>
  )
}

export function TDEEScreen() {
  const [view, setView] = useState('today')
  return (
    <Phone label="TDEE" group="ANALYTICS">
      <FNavBar title="Expenditure" leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <div style={{ display: 'flex', borderBottom: `1px solid ${Color.borderSoft}` }}>
        {[['today', 'TODAY'], ['trend', 'OVER TIME']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{
            flex: 1, padding: '10px 0',
            fontFamily: Font.mono, fontSize: 10, letterSpacing: 1,
            color: view === id ? Color.accent : Color.mute,
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${view === id ? Color.accent : 'transparent'}`,
            transition: 'color 0.15s, border-color 0.15s',
          }}>{label}</button>
        ))}
      </div>
      {view === 'today' ? <TDEEContent /> : <TDEECompareContent />}
    </Phone>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Trust over time (compare screen)
   ═══════════════════════════════════════════════════════════════════════ */

export function TDEECompareContent() {
  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ marginTop: 6 }}>
        <FNum size={48} weight={200}>Trust visible.</FNum>
      </div>
      <div style={{ marginTop: 12, ...Type.bodyMd, color: Color.dim, lineHeight: 1.6 }}>
        The model widens when new, narrows as you log. Uncertainty is shown, not hidden.
      </div>

      {/* Ring comparison: Day 3 vs Now */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 36 }}>
        <ConfidenceRing label="DAY 3" confidence={18} bandHalf={210} delay={0.2} />
        <ConfidenceRing label="NOW" confidence={74} bandHalf={70} delay={0.5} />
      </div>

      {/* Confidence trajectory */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ ...Type.labelSm, color: Color.mute }}>CONFIDENCE OVER TIME</span>
          <span style={{ fontFamily: Font.mono, fontSize: 11, color: Color.dim }}>18% {'\u2192'} 74%</span>
        </div>
        <Sparkline data={CONFIDENCE_TREND} height={32} color={Color.accent} strokeWidth={1.5} dot />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ ...Type.labelSm, color: Color.faint }}>DAY 1</span>
          <span style={{ ...Type.labelSm, color: Color.accent }}>DAY 87</span>
        </div>
      </div>

      {/* What changed */}
      <FSurface style={{ marginTop: 28 }}>
        <FLabel mb={8}>What changed</FLabel>
        <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.6 }}>
          87 weigh-ins, 81 food logs, two phase transitions. The model now estimates expenditure within a 6% window for you specifically.
        </div>
      </FSurface>
    </div>
  )
}

export function TDEECompareScreen() {
  return (
    <Phone label="Trust over time" group="MODEL">
      <FNavBar title="Confidence" leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <TDEECompareContent />
    </Phone>
  )
}
