// ════════════════════════════════════════════════════════════
// Check-in — Weekly progress overview
// ════════════════════════════════════════════════════════════

import { useState } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { FMono, FSurface, FBtn, FWeightInput, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { MOCK_BODY, MOCK_VOLUME_WEEKS, MOCK_TARGETS } from '../../context/mockUser'

/* ── Mock daily weight data (Mon → Sun) ───────────────────── */
const DAILY_WEIGHTS = [82.4, 82.2, 82.5, 82.8, 82.9, 82.6, 82.1]
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const PREV_CHECKIN_WEIGHT = 82.5

/* ── 7-Day Weight Trend Chart ─────────────────────────────── */
function WeightTrendChart({ weights, refWeight }) {
  const W = 360, H = 116
  const padX = 8, padY = 12
  const innerW = W - padX * 2
  const innerH = H - padY * 2

  const allVals = [...weights, refWeight]
  const minV = Math.min(...allVals) - 0.35
  const maxV = Math.max(...allVals) + 0.35

  const px = (i) => padX + (i / (weights.length - 1)) * innerW
  const py = (v) => H - padY - ((v - minV) / (maxV - minV)) * innerH

  const pts = weights.map((w, i) => [px(i), py(w)])

  // Smooth cubic bezier path
  let linePath = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cpx = (x0 + x1) / 2
    linePath += ` C ${cpx} ${y0} ${cpx} ${y1} ${x1} ${y1}`
  }

  const areaPath = linePath +
    ` L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`

  const refY = py(refWeight)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="ci-wgr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6E50" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF6E50" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Reference dashed line */}
      <line
        x1={padX} y1={refY} x2={W - padX} y2={refY}
        stroke="rgba(255,255,255,0.16)" strokeWidth="1" strokeDasharray="4,4"
      />
      {/* Area fill */}
      <path d={areaPath} fill="url(#ci-wgr)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#FF6E50" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {pts.map(([x, y], i) => {
        const isLast = i === pts.length - 1
        return (
          <circle key={i} cx={x} cy={y}
            r={isLast ? 4 : 2.5}
            fill={isLast ? '#FF6E50' : 'rgba(255,110,80,0.65)'}
            stroke={isLast ? '#111' : 'none'}
            strokeWidth={isLast ? 1.5 : 0}
          />
        )
      })}
    </svg>
  )
}

/* ── Section label ────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: Font.sans, fontSize: 14, fontWeight: 500, color: Color.text, marginBottom: 14,
    }}>
      {children}
      <span style={{ color: Color.mute, fontSize: 16, lineHeight: 1 }}>›</span>
    </div>
  )
}

/* ── Main content ─────────────────────────────────────────── */
export function CheckInOverviewContent({ onComplete }) {
  const { checkins, workoutPlan } = useUser()
  const { switchTab, pushDetail } = useNav()

  /* Contract */
  const { currentBf, targetBf, weeks, elapsed } = MOCK_BODY
  const endDate = '04 SEP'

  /* Body */
  const latestWeight = DAILY_WEIGHTS[DAILY_WEIGHTS.length - 1]
  const weeklyDelta = (latestWeight - PREV_CHECKIN_WEIGHT).toFixed(1)
  const checkInCount = checkins?.length ?? 4

  /* Training */
  const schedule = workoutPlan?.schedule || []
  const sessionsDone  = schedule.filter(s => !s.isRest && s.completed).length
  const sessionsTotal = schedule.filter(s => !s.isRest).length

  const currentVol = MOCK_VOLUME_WEEKS[MOCK_VOLUME_WEEKS.length - 1]
  const prevVol    = MOCK_VOLUME_WEEKS[MOCK_VOLUME_WEEKS.length - 2]
  const volDeltaPct = prevVol
    ? Math.round(((currentVol.value - prevVol.value) / prevVol.value) * 100)
    : 0

  /* Nutrition */
  const adherencePct = 88
  const allOnTrack   = true

  /* Macro split proportions (target ranges) */
  const pPct = 0.375, cPct = 0.395, fPct = 0.23

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>

      {/* ── The Contract ── */}
      <div style={{ padding: '24px 24px 28px' }}>
        <FMono size={9} color={Color.mute} style={{ display: 'block', marginBottom: 10, letterSpacing: 1 }}>
          THE CONTRACT
        </FMono>
        <div style={{ marginBottom: 8, lineHeight: 1 }}>
          <span style={{
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            fontSize: 46, fontWeight: 200, color: Color.text,
            whiteSpace: 'nowrap', display: 'block',
          }}>{currentBf}% → {targetBf}%</span>
        </div>
        <FMono size={9} color={Color.mute} style={{ display: 'block', marginBottom: 10, letterSpacing: 0.8 }}>
          BODY FAT · {weeks} WEEKS · ENDS {endDate}
        </FMono>
        <FMono size={11} color={Color.accent} style={{ display: 'block' }}>
          WEEK {elapsed} OF {weeks}
        </FMono>
      </div>

      {/* ── Body ── */}
      <section style={{ padding: '0 24px 24px', cursor: 'pointer' }} onClick={() => switchTab('stats')}>
        <SectionLabel>BODY</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
        }}>
          <span style={{ fontFamily: Font.sans, fontSize: 18, color: Color.text, fontWeight: 300 }}>
            {latestWeight} kg
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: Color.amber }} />
            <FMono size={10} color={Color.dim}>
              {weeklyDelta} kg/wk · {checkInCount} check-ins
            </FMono>
          </div>
        </div>
        <FSurface style={{ padding: '16px 16px 12px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14,
          }}>
            <FMono size={9} color={Color.mute} style={{ letterSpacing: 1 }}>7-DAY TREND</FMono>
            <FMono size={9} color={Color.dim}>{latestWeight} KG</FMono>
          </div>
          <WeightTrendChart weights={DAILY_WEIGHTS} refWeight={PREV_CHECKIN_WEIGHT} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '0 4px',
          }}>
            {WEEK_DAYS.map((d, i) => (
              <FMono key={i} size={9} color={i === WEEK_DAYS.length - 1 ? Color.accent : Color.mute}>
                {d}
              </FMono>
            ))}
          </div>
        </FSurface>
      </section>

      {/* ── Training ── */}
      <section style={{ padding: '0 24px 24px', cursor: 'pointer' }} onClick={() => switchTab('train')}>
        <SectionLabel>TRAINING</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
        }}>
          <span style={{ fontFamily: Font.sans, fontSize: 15, color: Color.text, fontWeight: 300 }}>
            {sessionsDone}/{sessionsTotal} Sessions done
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: volDeltaPct < 0 ? Color.accent : Color.green,
            }} />
            <FMono size={10} color={Color.dim}>
              {volDeltaPct > 0 ? '+' : ''}{volDeltaPct}% volume vs last week
            </FMono>
          </div>
        </div>
        <FSurface style={{ padding: 16 }}>
          <FMono size={9} color={Color.mute} style={{ display: 'block', marginBottom: 10, letterSpacing: 1 }}>
            TRAINING
          </FMono>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10,
          }}>
            <FMono size={11} color={Color.text}>{sessionsDone} / {sessionsTotal} sessions</FMono>
            <FMono size={11} color={volDeltaPct >= 0 ? Color.green : Color.accent}>
              {volDeltaPct >= 0 ? '↑' : '↓'}{Math.abs(volDeltaPct)}% vol
            </FMono>
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {Array.from({ length: sessionsTotal || 4 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < sessionsDone ? Color.accent : Color.borderSoft,
              }} />
            ))}
          </div>
          <FMono size={10} color={Color.dim}>
            {currentVol.value.toLocaleString()} kg total volume this week
          </FMono>
        </FSurface>
      </section>

      {/* ── Nutrition ── */}
      <section style={{ padding: '0 24px 24px', cursor: 'pointer' }} onClick={() => switchTab('eat')}>
        <SectionLabel>NUTRITION</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
        }}>
          <span style={{ fontFamily: Font.sans, fontSize: 15, color: Color.text, fontWeight: 300 }}>
            {adherencePct}% on target
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: allOnTrack ? Color.green : Color.amber,
            }} />
            <FMono size={10} color={Color.dim}>
              {allOnTrack ? 'all macros on track' : 'macros need attention'}
            </FMono>
          </div>
        </div>
        <FSurface style={{ padding: 16 }}>
          <FMono size={9} color={Color.mute} style={{ display: 'block', marginBottom: 12, letterSpacing: 1 }}>
            MACRO SPLIT
          </FMono>
          {/* Tri-color bar */}
          <div style={{
            display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10, gap: 2,
          }}>
            <div style={{ flex: pPct, background: Color.accent }} />
            <div style={{ flex: cPct, background: Color.blue }} />
            <div style={{ flex: fPct, background: Color.amber }} />
          </div>
          {/* Range labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <FMono size={9} color={Color.accent}>P 35–40%</FMono>
            <FMono size={9} color={Color.blue}>C 35–45%</FMono>
            <FMono size={9} color={Color.amber}>F 20–25%</FMono>
          </div>
          <FMono size={10} color={Color.dim}>
            Protein 2.2g/kg LBM · balanced approach
          </FMono>
        </FSurface>
      </section>

      {/* ── Log CTA ── */}
      <div style={{ padding: '8px 24px 32px' }}>
        <FBtn variant="primary" full onClick={() => pushDetail('checkin-flow', 'Log Check-in')}>
          Log this week
        </FBtn>
      </div>

    </div>
  )
}

/* ── Entry form (pushed from Today banner + Progress LOG button) ── */
export function CheckInFlowContent({ onComplete }) {
  const { checkins, targets, logCheckin } = useUser()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    weight: checkins?.[0]?.weight || 82.1,
    bf: checkins?.[0]?.bf || 20.1,
  })

  const handleSave = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    logCheckin({ ...data, date: dateStr })
    onComplete?.()
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '8px 0' }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            width: i === step ? 16 : 6, height: 6, borderRadius: 9999,
            background: i <= step ? Color.accent : Color.faint,
            transition: 'all 0.25s ease',
          }} />
        ))}
      </div>

      {/* Step 0: Weight */}
      {step === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
          <FMono size={9} color={Color.mute} style={{ display: 'block', marginBottom: 24, letterSpacing: 1 }}>CURRENT WEIGHT</FMono>
          <FWeightInput
            value={data.weight}
            onChange={w => setData({ ...data, weight: w })}
            min={30} max={200} step={0.1}
            unit="KG"
          />
        </div>
      )}

      {/* Step 1: Body fat */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <FMono size={9} color={Color.mute} style={{ letterSpacing: 1 }}>BODY FAT ESTIMATE</FMono>
            <button onClick={() => handleSave()} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: Font.mono, fontSize: 10, color: Color.dim, letterSpacing: 0.8,
            }}>SKIP</button>
          </div>
          <FWeightInput
            value={data.bf}
            onChange={bf => setData({ ...data, bf })}
            min={3} max={50} step={0.5}
            unit="% BF"
          />
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: `16px 24px 32px`, flexShrink: 0 }}>
        {step === 0 ? (
          <FBtn variant="primary" full size="lg" onClick={() => setStep(1)}>Continue</FBtn>
        ) : (
          <FBtn variant="primary" full size="lg" onClick={handleSave}>Save</FBtn>
        )}
      </div>
    </div>
  )
}

export function CheckInFlowScreen() {
  return (
    <Phone label="Check-in" group="OBSERVE">
      <CheckInOverviewContent />
    </Phone>
  )
}
