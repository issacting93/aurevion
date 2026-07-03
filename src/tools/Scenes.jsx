// ─────────────────────────────────────────────────────────────────────────────
// AUREVI0N · Motion Scenes — 20 standalone motion graphics compositions
// 16:9 landscape · self-playing loops · fullscreen for recording
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Color, Font, Space, Radius, Duration, Ease, Type as OriginalType } from '../ui/tokens'
import { ICONS, FIcon, FMono, FTexBar, FNum } from '../ui/components'
import { COOK_ICONS } from '../ui/icons'
import { AurevionMarkAnimated } from '../app/screens/Onboarding'

const Type = Object.freeze(
  Object.fromEntries(
    Object.entries(OriginalType).map(([key, val]) => [
      key,
      { ...val, fontSize: Math.max(16, val.fontSize || 0) }
    ])
  )
)

const C = Color
const FF = Font
const W = 1920
const H = 1080

// ─── Shared utilities ────────────────────────────────────
function Scene({ children, bg = '#000' }) {
  return (
    <div style={{
      width: W, height: H, background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: FF.sans, color: C.text, overflow: 'hidden', position: 'relative',
    }}>
      {children}
    </div>
  )
}

function usePhase(intervals) {
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)
  const total = intervals.reduce((a, b) => a + b, 0)
  useEffect(() => {
    const timers = []
    let acc = 0
    intervals.forEach((dur, i) => {
      acc += dur
      timers.push(setTimeout(() => setPhase(i + 1), acc))
    })
    timers.push(setTimeout(() => { setPhase(0); setCycle(c => c + 1) }, total + 800))
    return () => timers.forEach(clearTimeout)
  }, [cycle])
  return phase
}

function seededRandom(seed) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function useScramble(text, active, duration = 1200) {
  const [display, setDisplay] = useState('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&'
  useEffect(() => {
    if (!active) { setDisplay(''); return }
    const len = text.length
    const frames = duration / 16
    let frame = 0, raf
    const tick = () => {
      let out = ''
      for (let i = 0; i < len; i++) {
        if (text[i] === ' ') { out += ' '; continue }
        const reveal = (i / len) * frames
        out += frame >= reveal ? text[i] : chars[Math.floor(Math.random() * chars.length)]
      }
      setDisplay(out)
      frame++
      if (frame < frames) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return display
}

function useCountUp(target, active, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) { setVal(0); return }
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return val
}

// ═══════════════════════════════════════════════════════════
// ORIGINAL SCENES 1-10 (now 16:9)
// ═══════════════════════════════════════════════════════════

function Scene1() {
  const phase = usePhase([200, 1400, 800, 2000, 500])
  const val = useCountUp(2420, phase >= 1, 1400)
  const ringPct = phase >= 1 ? 100 : 0
  const size = 280, sw = 6, r = (size - sw) / 2, circ = 2 * Math.PI * r

  return (
    <Scene>
      <div style={{ display: 'flex', alignItems: 'center', gap: 120 }}>
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.faint} strokeWidth={sw} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.accent} strokeWidth={sw}
              strokeDasharray={circ} strokeDashoffset={circ - (ringPct / 100) * circ}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </svg>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 80, fontWeight: 200, letterSpacing: -3 }}>{val.toLocaleString()}</div>
            <div style={{ ...Type.labelLg, color: C.mute, letterSpacing: 4 }}>KCAL / DAY</div>
          </div>
        </div>
        <div style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ ...Type.labelMd, color: C.accent, letterSpacing: 3, marginBottom: 12 }}>YOUR TOTAL DAILY</div>
          <div style={{ ...Type.labelMd, color: C.accent, letterSpacing: 3 }}>ENERGY EXPENDITURE</div>
          <div style={{ ...Type.bodySm, color: C.dim, marginTop: 20, maxWidth: 300 }}>The number refines itself as you log data.</div>
        </div>
      </div>
    </Scene>
  )
}

const MACROS = [
  { label: 'PROTEIN', val: 147, pct: 85, color: C.accent },
  { label: 'CARBS', val: 160, pct: 72, color: C.dim },
  { label: 'FAT', val: 60, pct: 45, color: C.mute },
]

function Scene2() {
  const phase = usePhase([500, 600, 600, 600, 1200, 500])
  return (
    <Scene>
      <div style={{ width: 900 }}>
        <div style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease', textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 64, fontWeight: 200, letterSpacing: -2 }}>
            1,660 <span style={{ fontSize: 20, color: C.mute, fontFamily: FF.mono }}>KCAL</span>
          </div>
          <div style={{ ...Type.labelMd, color: C.accent, letterSpacing: 3, marginTop: 12 }}>DAILY TARGET · −480 DEFICIT</div>
        </div>
        {MACROS.map((m, i) => (
          <div key={m.label} style={{
            marginBottom: 40, opacity: phase >= i + 2 ? 1 : 0,
            transform: phase >= i + 2 ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ ...Type.labelLg, color: m.color, letterSpacing: 3 }}>{m.label}</span>
              <span style={{ fontFamily: FF.mono, fontSize: 28, fontWeight: 300 }}>{m.val}<span style={{ fontSize: 16, color: C.mute }}>G</span></span>
            </div>
            <FTexBar pct={phase >= i + 2 ? m.pct : 0} height={14} color={m.color} />
          </div>
        ))}
      </div>
    </Scene>
  )
}

function Scene3() {
  const phase = usePhase([600, 1500, 1000, 1500, 1000])
  return (
    <Scene>
      <div style={{ width: 1200 }}>
        <div style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease', textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 56, fontWeight: 200, letterSpacing: -1 }}>Trust visible.</div>
          <div style={{ ...Type.bodyLg, color: C.dim, marginTop: 12 }}>The model widens when new, narrows as you log.</div>
        </div>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
          <div style={{ flex: 1, maxWidth: 500, padding: 40, borderRadius: 20, background: C.surface, border: `1px solid ${C.faint}`, opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ ...Type.labelMd, color: C.mute }}>DAY 03</div>
            <div style={{ fontSize: 48, fontWeight: 200, marginTop: 8 }}>±420 <span style={{ fontSize: 16, color: C.mute }}>KCAL</span></div>
            <div style={{ marginTop: 24, height: 60, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: phase >= 2 ? 50 : 0, background: C.accentDim, borderRadius: 6, transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: C.accent }} />
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 500, padding: 40, borderRadius: 20, background: C.surface, border: `1px solid ${C.accent}40`, opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' }}>
            <div style={{ ...Type.labelMd, color: C.accent }}>DAY 87</div>
            <div style={{ fontSize: 48, fontWeight: 200, marginTop: 8, color: C.accent }}>±142 <span style={{ fontSize: 16, color: C.mute }}>KCAL</span></div>
            <div style={{ marginTop: 24, height: 60, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: phase >= 3 ? 12 : 50, background: C.accentDim, borderRadius: 4, transition: 'height 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: C.accent }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 60, textAlign: 'center', ...Type.labelMd, color: C.dim, letterSpacing: 3, opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          THE LONGER YOU LOG, THE SHARPER IT GETS.
        </div>
      </div>
    </Scene>
  )
}

const COOK_GRID = [
  { path: COOK_ICONS.sear, label: 'SEAR' }, { path: COOK_ICONS.boil, label: 'BOIL' }, { path: COOK_ICONS.roast, label: 'ROAST' },
  { path: COOK_ICONS.prep, label: 'PREP' }, { path: COOK_ICONS.saute, label: 'SAUTÉ' }, { path: COOK_ICONS.steam, label: 'STEAM' },
  { path: COOK_ICONS.grill, label: 'GRILL' }, { path: COOK_ICONS.plate, label: 'PLATE' }, { path: COOK_ICONS.blend, label: 'BLEND' },
]

function Scene4() {
  const [visible, setVisible] = useState(0)
  const [visCycle, setVisCycle] = useState(0)
  useEffect(() => {
    const timers = COOK_GRID.map((_, i) => setTimeout(() => setVisible(i + 1), 400 + i * 120))
    const reset = setTimeout(() => { setVisible(0); setVisCycle(c => c + 1) }, 400 + COOK_GRID.length * 120 + 2500)
    return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
  }, [visCycle])

  return (
    <Scene>
      <div style={{ ...Type.labelLg, fontSize: 24, color: C.mute, letterSpacing: 4, marginBottom: 50 }}>COOK WITH PRECISION</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 32 }}>
        {COOK_GRID.map((ic, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: i < visible ? 1 : 0, transform: i < visible ? 'scale(1)' : 'scale(0.7)', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: C.accentFaint, border: `1px solid ${C.accentDim}`, display: 'grid', placeItems: 'center' }}>
              <FIcon path={ic.path} size={32} color={C.accent} stroke={1.5} />
            </div>
            <span style={{ ...Type.labelSm, color: C.dim, letterSpacing: 2 }}>{ic.label}</span>
          </div>
        ))}
      </div>
    </Scene>
  )
}

const DAYS = [
  { d: 'MON', events: [C.accent, '#60a5fa'] }, { d: 'TUE', events: ['#a78bfa'] },
  { d: 'WED', events: [C.accent, '#60a5fa'] }, { d: 'THU', events: [C.accent, '#60a5fa'] },
  { d: 'FRI', events: [C.accent], today: true }, { d: 'SAT', events: [] },
  { d: 'SUN', events: ['#a78bfa'] },
]

function Scene5() {
  const [revealed, setRevealed] = useState(0)
  const [revCycle, setRevCycle] = useState(0)
  useEffect(() => {
    const timers = DAYS.map((_, i) => setTimeout(() => setRevealed(i + 1), 600 + i * 180))
    const reset = setTimeout(() => { setRevealed(0); setRevCycle(c => c + 1) }, 600 + DAYS.length * 180 + 2500)
    return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
  }, [revCycle])

  return (
    <Scene>
      <div style={{ display: 'flex', alignItems: 'center', gap: 120 }}>
        <div>
          <div style={{ ...Type.labelLg, fontSize: 24, color: C.mute, letterSpacing: 4, marginBottom: 16 }}>THIS WEEK</div>
          <div style={{ fontSize: 80, fontWeight: 200, letterSpacing: -3 }}>11 <span style={{ color: C.mute }}>/</span> 14</div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {DAYS.map((day, i) => (
            <div key={i} style={{ width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: i < revealed ? 1 : 0, transform: i < revealed ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <span style={{ ...Type.labelMd, color: day.today ? C.accent : C.mute }}>{day.d}</span>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: day.today ? C.accentFaint : C.surface, border: `1.5px solid ${day.today ? C.accent : C.faint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                {day.events.length > 0 ? day.events.map((c, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />) : <span style={{ ...Type.labelSm, color: C.faint }}>—</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 60, ...Type.labelMd, fontSize: 24, color: C.accent, letterSpacing: 3, opacity: revealed >= 7 ? 1 : 0, transition: 'opacity 0.5s ease' }}>PLAN THE WEEK. OWN THE DAY.</div>
    </Scene>
  )
}

function Scene6() {
  const word = 'AUREVI0N'
  const phase = usePhase([800, 400, 1200, 800, 2000, 500])
  return (
    <Scene>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,110,80,0.06) 0%, transparent 70%)', opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1s ease' }} />
      <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'scale(1)' : 'scale(0.6)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <AurevionMarkAnimated size={100} animate={phase >= 1} />
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 6 }}>
        {word.split('').map((ch, i) => (
          <span key={i} style={{ fontSize: 72, fontWeight: 200, letterSpacing: 10, color: C.text, opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(24px)', transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s` }}>{ch}</span>
        ))}
      </div>
      <div style={{ marginTop: 24, ...Type.labelMd, color: C.dim, letterSpacing: 4, opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.5s ease' }}>NUTRITION · TRAINING · BODY COMPOSITION</div>
    </Scene>
  )
}

function Scene7() {
  const phase = usePhase([500, 2000, 1500, 500])
  const pct = useCountUp(74, phase >= 1, 2000)
  return (
    <Scene>
      <div style={{ display: 'flex', alignItems: 'center', gap: 100 }}>
        <div style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <div style={{ ...Type.labelLg, color: C.mute, letterSpacing: 3, marginBottom: 16 }}>MODEL CONFIDENCE</div>
          <div style={{ fontSize: 120, fontWeight: 200, letterSpacing: -4 }}>{pct}<span style={{ fontSize: 48, color: C.mute }}>%</span></div>
        </div>
        <div style={{ width: 600, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <FTexBar pct={pct} height={48} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <span style={{ ...Type.labelMd, color: C.mute }}>18 DAYS LOGGED</span>
            <span style={{ ...Type.labelMd, color: C.accent }}>TIGHTENS WITH USE</span>
          </div>
        </div>
      </div>
    </Scene>
  )
}

const COOK_TIMERS = [
  { c: C.accent, l: 'SALMON', t: '03:10' },
  { c: '#60a5fa', l: 'RICE', t: '07:22' },
  { c: '#a78bfa', l: 'CHILI', t: '34:58' },
]

function Scene8() {
  const phase = usePhase([400, 800, 600, 600, 2500, 500])
  return (
    <Scene bg="radial-gradient(circle at 50% 50%, rgba(255,110,80,0.12) 0%, #000 60%)">
      {[0,1,2,3].map(i => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          borderRadius: '50%', border: `2px solid ${C.accent}`,
          animation: phase >= 1 ? `sceneHeatRing 3s ease-out ${i * 0.75}s infinite` : 'none',
          opacity: 0,
        }} />
      ))}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 80 }}>
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: phase >= 1 ? `drop-shadow(0 0 24px ${C.accent}50)` : 'none',
        }}>
          <FIcon path={COOK_ICONS.sear} size={100} color={C.accent} stroke={1.2} />
        </div>
        <div>
          <div style={{
            fontSize: 40, fontWeight: 300, letterSpacing: -0.5, maxWidth: 500,
            opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>Sear chicken until charred on both sides.</div>
          <div style={{
            marginTop: 16, ...Type.labelMd, color: C.mute, letterSpacing: 3,
            opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.4s ease',
          }}>HIGH HEAT · CAST IRON · ~6 MIN</div>
          <div style={{ marginTop: 32, display: 'flex', gap: 32 }}>
            {COOK_TIMERS.map((tm, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: phase >= 4 ? 1 : 0,
                transform: phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: tm.c }} />
                <span style={{ ...Type.labelSm, color: tm.c }}>{tm.l}</span>
                <span style={{ fontFamily: FF.mono, fontSize: 16, color: C.text }}>{tm.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scene>
  )
}

const STATS = [
  { val: '2,420', unit: 'KCAL', label: 'TDEE', x: 10, y: 20 },
  { val: '147', unit: 'G', label: 'PROTEIN', x: 55, y: 15 },
  { val: '20.1', unit: '%', label: 'BODY FAT', x: 8, y: 60 },
  { val: '82.1', unit: 'KG', label: 'WEIGHT', x: 60, y: 55 },
  { val: '14', unit: 'DAYS', label: 'STREAK', x: 35, y: 80 },
  { val: '74', unit: '%', label: 'CONFIDENCE', x: 75, y: 75 },
]

function Scene9() {
  const [visible, setVisible] = useState(0)
  const [visCycle, setVisCycle] = useState(0)
  useEffect(() => {
    const timers = STATS.map((_, i) => setTimeout(() => setVisible(i + 1), 400 + i * 250))
    const reset = setTimeout(() => { setVisible(0); setVisCycle(c => c + 1) }, 400 + STATS.length * 250 + 3000)
    return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
  }, [visCycle])

  return (
    <Scene>
      {STATS.map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, opacity: i < visible ? 1 : 0, transform: i < visible ? 'scale(1)' : 'scale(0.8) translateY(20px)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div style={{ fontSize: 48, fontWeight: 200, letterSpacing: -1, whiteSpace: 'nowrap' }}>{s.val}<span style={{ fontSize: 18, color: C.mute, fontFamily: FF.mono, marginLeft: 4 }}>{s.unit}</span></div>
          <div style={{ ...Type.labelSm, color: C.accent, letterSpacing: 2, marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: 100, textAlign: 'center', opacity: visible >= STATS.length ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <div style={{ ...Type.labelLg, color: C.dim, letterSpacing: 4 }}>YOUR BODY. YOUR DATA.</div>
      </div>
    </Scene>
  )
}

function Scene10() {
  const phase = usePhase([600, 1200, 800, 1500, 500])
  const progress = useCountUp(38, phase >= 2, 1200)
  const size = 240, sw = 6, r = (size - sw) / 2, circ = 2 * Math.PI * r
  return (
    <Scene>
      <div style={{ display: 'flex', alignItems: 'center', gap: 100 }}>
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.faint} strokeWidth={sw} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.accent} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={circ - (progress / 100) * circ} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
          </svg>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 52, fontWeight: 200 }}>{progress > 0 ? `${progress}%` : '—'}</div>
            <div style={{ ...Type.labelSm, color: C.mute }}>ELAPSED</div>
          </div>
        </div>
        <div style={{ opacity: phase >= 1 ? 1 : 0, transition: 'all 0.5s ease' }}>
          <div style={{ ...Type.labelLg, color: C.mute, letterSpacing: 4, marginBottom: 24 }}>ACTIVE CONTRACT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div><div style={{ fontSize: 48, fontWeight: 200 }}>20.1</div><div style={{ ...Type.labelSm, color: C.mute }}>CURRENT %BF</div></div>
            <div style={{ fontFamily: FF.mono, fontSize: 24, color: C.accent }}>→</div>
            <div><div style={{ fontSize: 48, fontWeight: 200, color: C.accent }}>15.0</div><div style={{ ...Type.labelSm, color: C.accent }}>TARGET %BF</div></div>
          </div>
          <div style={{ width: 400, marginTop: 32, opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <FTexBar pct={progress} height={8} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ ...Type.labelSm, color: C.dim }}>WEEK 6 / 16</span>
              <span style={{ ...Type.labelSm, color: C.mute }}>10 WEEKS LEFT</span>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  )
}

// ═══════════════════════════════════════════════════════════
// NEW SCENES 11-20 — Typography & advanced animation
// ═══════════════════════════════════════════════════════════

// 11 — "Scramble Decode" — Text decrypts from random chars
function Scene11() {
  const phase = usePhase([300, 1500, 1000, 1500, 1500])
  const line1 = useScramble('YOUR BODY', phase >= 1, 1200)
  const line2 = useScramble('YOUR DATA', phase >= 2, 1200)
  return (
    <Scene>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: FF.mono, fontSize: 96, fontWeight: 700, letterSpacing: 8, color: C.text, minHeight: 110 }}>{line1}</div>
        <div style={{ fontFamily: FF.mono, fontSize: 96, fontWeight: 700, letterSpacing: 8, color: C.accent, minHeight: 110, marginTop: 8 }}>{line2}</div>
        <div style={{ marginTop: 48, ...Type.labelMd, color: C.dim, letterSpacing: 3, opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          PRECISION, NOT GUESSWORK.
        </div>
      </div>
    </Scene>
  )
}

// 12 — "Clip Reveal" — Large text reveals via clip-path wipe
function Scene12() {
  const phase = usePhase([400, 800, 600, 800, 600, 2000, 500])
  const lines = ['NUTRITION.', 'TRAINING.', 'BODY COMPOSITION.']
  return (
    <Scene>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontSize: 80, fontWeight: 700, letterSpacing: -2, lineHeight: 1,
            color: i === 2 ? C.accent : C.text,
            clipPath: phase >= i + 1 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
            transition: 'clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {line}
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 60,
        opacity: phase >= 5 ? 1 : 0, transition: 'opacity 0.5s ease',
      }}>
        {[ICONS.dumb, ICONS.meal, ICONS.chart, ICONS.flame, ICONS.goal].map((icon, i) => (
          <FIcon key={i} path={icon} size={28} color={C.faint} stroke={1.5} />
        ))}
      </div>
    </Scene>
  )
}

// 13 — "Split Stack" — Words split and reassemble
function Scene13() {
  const phase = usePhase([500, 800, 800, 800, 1500, 500])
  const words = ['TRACK', 'TRAIN', 'TRANSFORM']
  return (
    <Scene>
      {words.map((word, wi) => (
        <div key={wi} style={{ display: 'flex', overflow: 'hidden', marginBottom: 12 }}>
          {word.split('').map((ch, ci) => (
            <span key={ci} style={{
              fontSize: 120, fontWeight: 800, letterSpacing: 4, lineHeight: 1,
              color: wi === 2 ? C.accent : C.text,
              display: 'inline-block',
              transform: phase >= wi + 1 ? 'translateY(0)' : 'translateY(100%)',
              transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${ci * 0.04}s`,
            }}>
              {ch}
            </span>
          ))}
        </div>
      ))}
    </Scene>
  )
}

// 14 — "Glitch Title" — CSS keyframe glitch with chromatic aberration + skew
function Scene14() {
  const phase = usePhase([400, 3000, 1200, 500])
  const glitching = phase >= 1 && phase < 2

  return (
    <Scene>
      <div style={{ position: 'relative' }}>
        {/* Scanline overlay */}
        <div style={{
          position: 'absolute', inset: -60, zIndex: 10, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          mixBlendMode: 'overlay',
          opacity: glitching ? 0.6 : 0, transition: 'opacity 0.3s ease',
        }} />

        <div style={{
          fontSize: 140, fontWeight: 800, letterSpacing: 12, color: C.text, position: 'relative',
          animation: glitching ? 'glitchSkew 1s linear infinite' : 'none',
        }}>
          {/* Red / accent channel */}
          <span style={{
            position: 'absolute', left: 0, top: 0,
            color: C.accent, opacity: 0.8,
            textShadow: `-2px 0 ${C.accent}`,
            animation: glitching ? 'glitchTop 0.7s steps(1) infinite' : 'none',
            clipPath: glitching ? undefined : 'inset(0 0 100% 0)',
          }}>AUREVI0N</span>

          {/* Cyan / blue channel */}
          <span style={{
            position: 'absolute', left: 0, top: 0,
            color: '#60a5fa', opacity: 0.8,
            textShadow: '2px 0 #60a5fa',
            animation: glitching ? 'glitchBottom 0.8s steps(1) infinite' : 'none',
            clipPath: glitching ? undefined : 'inset(0 0 100% 0)',
          }}>AUREVI0N</span>

          {/* Main text */}
          <span style={{
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}>AUREVI0N</span>
        </div>

        <div style={{
          textAlign: 'center', marginTop: 24, ...Type.labelLg, color: C.mute, letterSpacing: 4,
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s ease',
        }}>
          AI-NATIVE FITNESS PLATFORM
        </div>
      </div>

    </Scene>
  )
}

// 15 — "Rolling Counter" — Slot-machine digit roll (2 full cycles + landing)
function Scene15() {
  const phase = usePhase([400, 2500, 1500, 500])
  const digits = [2, 4, 2, 0]
  const h = 150

  const slots = []
  digits.forEach((d, i) => {
    if (i === 1) {
      slots.push(
        <span key="comma" style={{
          fontSize: 72, fontWeight: 200, color: C.faint, alignSelf: 'flex-end', marginBottom: 12,
          opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease 0.8s',
        }}>,</span>
      )
    }
    const count = 20 + d + 1
    const target = count - 1
    slots.push(
      <div key={`d${i}`} style={{
        width: 110, height: h, overflow: 'hidden', borderRadius: 18,
        background: C.surface, border: `1px solid ${phase >= 1 ? C.accent + '30' : C.faint}`,
        transition: 'border-color 0.5s ease',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: phase >= 1 ? `translateY(${-target * h}px)` : 'translateY(0)',
          transition: `transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`,
        }}>
          {Array.from({ length: count }, (_, n) => (
            <div key={n} style={{
              width: 110, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 96, fontWeight: 200, flexShrink: 0,
              color: n === target && phase >= 1 ? C.accent : C.text,
            }}>{n % 10}</div>
          ))}
        </div>
      </div>
    )
  })

  return (
    <Scene>
      <div style={{ ...Type.labelLg, color: C.mute, letterSpacing: 4, marginBottom: 32 }}>TOTAL DAILY ENERGY EXPENDITURE</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {slots}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
          <span style={{ fontFamily: FF.mono, fontSize: 24, color: C.mute, letterSpacing: 2, opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s ease' }}>KCAL/DAY</span>
        </div>
      </div>
    </Scene>
  )
}

// 16 — "Typewriter" — Cursor typing with blink
const TERMINAL_LINES = [
  { text: '> Analyzing biometrics...', color: C.mute, delay: 0 },
  { text: '> BMR computed: 1,620 kcal', color: C.dim, delay: 1200 },
  { text: '> Activity multiplier: 1.55×', color: C.dim, delay: 2200 },
  { text: '> TDEE estimate: 2,420 kcal', color: C.accent, delay: 3200 },
  { text: '> Confidence: 74% (±142 kcal)', color: C.green, delay: 4200 },
  { text: '> Ready.', color: C.text, delay: 5200 },
]

function Scene16() {
  const [revealed, setRevealed] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [typeCycle, setTypeCycle] = useState(0)

  useEffect(() => {
    const timers = TERMINAL_LINES.map((l, i) => setTimeout(() => { setRevealed(i + 1); setCharCount(0) }, l.delay))
    const reset = setTimeout(() => { setRevealed(0); setCharCount(0); setTypeCycle(c => c + 1) }, 7000)
    return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
  }, [typeCycle])

  useEffect(() => {
    if (revealed === 0) return
    const line = TERMINAL_LINES[revealed - 1]
    if (!line) return
    const interval = setInterval(() => setCharCount(c => Math.min(c + 1, line.text.length)), 30)
    return () => clearInterval(interval)
  }, [revealed])

  return (
    <Scene>
      <div style={{ fontFamily: FF.mono, fontSize: 24, lineHeight: 2.2, maxWidth: 800 }}>
        {TERMINAL_LINES.slice(0, revealed).map((l, i) => {
          const isActive = i === revealed - 1
          const text = isActive ? l.text.slice(0, charCount) : l.text
          return (
            <div key={i} style={{ color: l.color, whiteSpace: 'nowrap' }}>
              {text}
              {isActive && charCount < l.text.length && <span style={{ animation: 'cursorBlink 0.6s step-end infinite', color: C.accent }}>▌</span>}
            </div>
          )
        })}
      </div>
    </Scene>
  )
}

// 17 — "Particle Burst" — Dots explode from center on beat
const PARTICLES = (() => {
  const rand = seededRandom(42)
  return Array.from({ length: 40 }, () => ({
    angle: rand() * Math.PI * 2,
    dist: 100 + rand() * 400,
    size: 3 + rand() * 6,
    delay: rand() * 0.3,
    dur: 0.8 + rand() * 0.8,
  }))
})()

function Scene17() {
  const [burst, setBurst] = useState(false)
  const [burstCycle, setBurstCycle] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setBurst(true), 500)
    const t2 = setTimeout(() => { setBurst(false); setBurstCycle(c => c + 1) }, 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [burstCycle])

  return (
    <Scene>
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: p.size, height: p.size, borderRadius: '50%',
          background: i % 3 === 0 ? C.accent : i % 3 === 1 ? '#60a5fa' : '#a78bfa',
          transform: burst
            ? `translate(${Math.cos(p.angle) * p.dist}px, ${Math.sin(p.angle) * p.dist}px) scale(0)`
            : 'translate(-50%, -50%) scale(1)',
          opacity: burst ? 0 : 0.8,
          transition: `all ${p.dur}s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}s`,
        }} />
      ))}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: 4, opacity: burst ? 1 : 0, transform: burst ? 'scale(1)' : 'scale(0.5)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s' }}>
          AUREVI0N
        </div>
      </div>
    </Scene>
  )
}

// 18 — "Horizontal Scroll" — Features scroll like a ticker tape
const FEATURES = ['TDEE MODELING', '·', 'MACRO TRACKING', '·', 'MEAL PREP', '·', 'TRAINING SESSIONS', '·', 'BODY COMPOSITION', '·', 'CONFIDENCE BANDS', '·']

function Scene18() {
  return (
    <Scene>
      <div style={{ fontSize: 48, fontWeight: 200, letterSpacing: -1, textAlign: 'center', marginBottom: 80 }}>
        Everything you need.
      </div>
      <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 40, animation: 'tickerScroll 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...FEATURES, ...FEATURES].map((f, i) => (
            <span key={i} style={{ fontFamily: FF.mono, fontSize: 20, letterSpacing: 3, color: f === '·' ? C.faint : C.accent, flexShrink: 0 }}>{f}</span>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', overflow: 'hidden', position: 'relative', marginTop: 20 }}>
        <div style={{ display: 'flex', gap: 40, animation: 'tickerScrollR 25s linear infinite', whiteSpace: 'nowrap' }}>
          {[...FEATURES, ...FEATURES].reverse().map((f, i) => (
            <span key={i} style={{ fontFamily: FF.mono, fontSize: 16, letterSpacing: 3, color: f === '·' ? C.faint : C.mute, flexShrink: 0 }}>{f}</span>
          ))}
        </div>
      </div>
    </Scene>
  )
}

// 19 — "Stacked Numbers" — Big numbers with line-through reveals
const STAT_ROWS = [
  { val: '2,420', label: 'KCAL BURNED', accent: false },
  { val: '147G', label: 'PROTEIN HIT', accent: false },
  { val: '−480', label: 'DEFICIT LOCKED', accent: true },
  { val: '74%', label: 'MODEL CONFIDENCE', accent: false },
]

function Scene19() {
  const phase = usePhase([300, 600, 600, 600, 600, 2000, 500])
  return (
    <Scene>
      {STAT_ROWS.map((row, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'baseline', gap: 32, marginBottom: 16,
          opacity: phase >= i + 1 ? 1 : 0,
          transform: phase >= i + 1 ? 'translateX(0)' : 'translateX(-60px)',
          transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}>
          <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: -4, color: row.accent ? C.accent : C.text, fontFamily: FF.sans, lineHeight: 1 }}>{row.val}</span>
          <span style={{ fontFamily: FF.mono, fontSize: 16, letterSpacing: 3, color: C.mute }}>{row.label}</span>
        </div>
      ))}
    </Scene>
  )
}

// 20 — "Breathing Grid" — Pulsing grid of dots forming the logo shape
function Scene20() {
  const GRID = 20
  const phase = usePhase([500, 2000, 2000, 500])
  return (
    <Scene>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 8, width: 500, height: 500 }}>
        {Array.from({ length: GRID * GRID }, (_, idx) => {
          const row = Math.floor(idx / GRID), col = idx % GRID
          const cx = col / GRID, cy = row / GRID
          const dist = Math.hypot(cx - 0.5, cy - 0.5)
          const inCircle = dist < 0.4
          const delay = dist * 1.5
          return (
            <div key={idx} style={{
              width: '100%', aspectRatio: '1', borderRadius: '50%',
              background: inCircle ? C.accent : C.faint,
              opacity: phase >= 1 ? (inCircle ? 0.8 : 0.15) : 0,
              transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
              transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
              animation: phase >= 2 && inCircle ? `dotPulse 2s ease-in-out ${delay * 0.3}s infinite` : 'none',
            }} />
          )
        })}
      </div>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <AurevionMarkAnimated size={80} animate={phase >= 2} />
        <span style={{ fontFamily: FF.mono, fontSize: 16, letterSpacing: 4, color: C.dim }}>AUREVI0N</span>
      </div>
    </Scene>
  )
}

// ═══════════════════════════════════════════════════════════
// SCENE PICKER + FULLSCREEN
// ═══════════════════════════════════════════════════════════
const SCENES = [
  { id: 1, label: 'The Number', desc: 'TDEE ring + counter', C: Scene1 },
  { id: 2, label: 'Macro Stack', desc: 'P/C/F bars stagger', C: Scene2 },
  { id: 3, label: 'Confidence Band', desc: 'Day 3 vs Day 87', C: Scene3 },
  { id: 4, label: 'Icon Grid', desc: 'Cook icons stagger', C: Scene4 },
  { id: 5, label: 'The Week', desc: '7-day strip reveal', C: Scene5 },
  { id: 6, label: 'Wordmark Reveal', desc: 'Logo letter-by-letter', C: Scene6 },
  { id: 7, label: 'Segment Meter', desc: 'Confidence bar fill', C: Scene7 },
  { id: 8, label: 'Heat Pulse', desc: 'Sear + heat rings', C: Scene8 },
  { id: 9, label: 'Data Points', desc: 'Floating metrics', C: Scene9 },
  { id: 10, label: 'Progress Arc', desc: 'Goal ring fill', C: Scene10 },
  { id: 11, label: 'Scramble Decode', desc: 'Text decrypts from noise', C: Scene11 },
  { id: 12, label: 'Clip Reveal', desc: 'Clip-path text wipe', C: Scene12 },
  { id: 13, label: 'Split Stack', desc: 'Chars slide up staggered', C: Scene13 },
  { id: 14, label: 'Glitch Title', desc: 'Chromatic glitch effect', C: Scene14 },
  { id: 15, label: 'Rolling Counter', desc: 'Slot machine digits', C: Scene15 },
  { id: 16, label: 'Typewriter', desc: 'Terminal-style typing', C: Scene16 },
  { id: 17, label: 'Particle Burst', desc: 'Dots explode on reveal', C: Scene17 },
  { id: 18, label: 'Ticker Tape', desc: 'Feature scroll marquee', C: Scene18 },
  { id: 19, label: 'Stacked Numbers', desc: 'Bold stat reveal', C: Scene19 },
  { id: 20, label: 'Breathing Grid', desc: 'Dot grid with logo', C: Scene20 },
]

function ScenePickerItem({ scene: s, active, onClick }) {
  const [hover, setHover] = useState(false)
  const isLit = active || hover
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Scene ${s.id}: ${s.label}`}
      style={{
        position: 'relative', display: 'flex', alignItems: 'baseline', gap: 10,
        padding: '8px 12px 8px 16px', borderRadius: 8,
        background: active ? C.accentFaint : hover ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: `1px solid ${active ? C.accent + '40' : 'transparent'}`,
        cursor: 'pointer', textAlign: 'left', color: C.text, fontFamily: FF.sans,
        transition: `all ${Duration.normal} ${Ease.default}`,
        transform: hover && !active ? 'translateX(2px)' : 'translateX(0)',
        overflow: 'hidden',
      }}
    >
      {/* Active indicator bar */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2,
        background: C.accent,
        transform: isLit ? 'scaleY(1)' : 'scaleY(0)',
        opacity: active ? 1 : 0.5,
        transition: `transform ${Duration.slow} ${Ease.spring}, opacity ${Duration.normal} ${Ease.default}`,
      }} />
      <span style={{
        fontFamily: FF.mono, fontSize: 16, fontWeight: 600, flexShrink: 0,
        color: isLit ? C.accent : C.mute,
        transition: `color ${Duration.normal} ${Ease.default}`,
      }}>{String(s.id).padStart(2, '0')}</span>
      <div>
        <div style={{ fontSize: 16, fontWeight: active ? 500 : 400, transition: `font-weight ${Duration.normal}` }}>{s.label}</div>
        <div style={{ ...Type.labelSm, color: isLit ? C.dim : C.mute, marginTop: 1, transition: `color ${Duration.normal} ${Ease.default}` }}>{s.desc}</div>
      </div>
    </button>
  )
}

export default function ScenesPage() {
  const [active, setActive] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const id = parseInt(params.get('id') || params.get('scene'), 10)
    return id >= 1 && id <= SCENES.length ? id : 1
  })
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('id') !== String(active)) {
      params.set('id', active)
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
    }
  }, [active])
  const [fullscreen, setFullscreen] = useState(false)
  const viewportRef = useRef(null)
  const ActiveScene = SCENES.find(s => s.id === active)?.C || Scene1

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewportRef.current?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyF') toggleFullscreen()
      if (e.code === 'ArrowRight') setActive(a => Math.min(SCENES.length, a + 1))
      if (e.code === 'ArrowLeft') setActive(a => Math.max(1, a - 1))
    }
    const onFsChange = () => { if (!document.fullscreenElement) setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFsChange) }
  }, [toggleFullscreen])

  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => {
      const sw = fullscreen ? window.innerWidth : window.innerWidth - 281
      const sh = fullscreen ? window.innerHeight : window.innerHeight - 48
      setScale(Math.min(1, sw / W, sh / H))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [fullscreen])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', fontFamily: FF.sans, color: C.text }}>
      <style>{`
        @keyframes sceneHeatRing { 0% { width: 40px; height: 40px; opacity: 0.6; } 100% { width: 400px; height: 400px; opacity: 0; } }
        @keyframes glitchTop {
          0% { clip-path: inset(0 0 85% 0); transform: translateX(-4px); }
          5% { clip-path: inset(15% 0 65% 0); transform: translateX(3px); }
          10% { clip-path: inset(50% 0 30% 0); transform: translateX(-6px); }
          15% { clip-path: inset(10% 0 80% 0); transform: translateX(2px); }
          20% { clip-path: inset(70% 0 10% 0); transform: translateX(-3px); }
          25% { clip-path: inset(25% 0 55% 0); transform: translateX(5px); }
          30% { clip-path: inset(60% 0 20% 0); transform: translateX(-2px); }
          35% { clip-path: inset(5% 0 75% 0); transform: translateX(4px); }
          40% { clip-path: inset(40% 0 40% 0); transform: translateX(-7px); }
          45% { clip-path: inset(80% 0 5% 0); transform: translateX(1px); }
          50% { clip-path: inset(20% 0 60% 0); transform: translateX(-4px); }
          55% { clip-path: inset(45% 0 35% 0); transform: translateX(6px); }
          60% { clip-path: inset(75% 0 15% 0); transform: translateX(-1px); }
          65% { clip-path: inset(30% 0 50% 0); transform: translateX(3px); }
          70% { clip-path: inset(55% 0 25% 0); transform: translateX(-5px); }
          75% { clip-path: inset(10% 0 70% 0); transform: translateX(7px); }
          80% { clip-path: inset(65% 0 15% 0); transform: translateX(-3px); }
          85% { clip-path: inset(35% 0 45% 0); transform: translateX(2px); }
          90% { clip-path: inset(85% 0 5% 0); transform: translateX(-6px); }
          95% { clip-path: inset(15% 0 75% 0); transform: translateX(4px); }
          100% { clip-path: inset(0 0 85% 0); transform: translateX(-4px); }
        }
        @keyframes glitchBottom {
          0% { clip-path: inset(65% 0 0 0); transform: translateX(5px); }
          5% { clip-path: inset(40% 0 25% 0); transform: translateX(-3px); }
          10% { clip-path: inset(80% 0 0 0); transform: translateX(7px); }
          15% { clip-path: inset(30% 0 40% 0); transform: translateX(-5px); }
          20% { clip-path: inset(55% 0 10% 0); transform: translateX(2px); }
          25% { clip-path: inset(70% 0 5% 0); transform: translateX(-8px); }
          30% { clip-path: inset(20% 0 50% 0); transform: translateX(4px); }
          35% { clip-path: inset(85% 0 0 0); transform: translateX(-2px); }
          40% { clip-path: inset(45% 0 20% 0); transform: translateX(6px); }
          45% { clip-path: inset(60% 0 10% 0); transform: translateX(-4px); }
          50% { clip-path: inset(35% 0 30% 0); transform: translateX(3px); }
          55% { clip-path: inset(75% 0 5% 0); transform: translateX(-6px); }
          60% { clip-path: inset(50% 0 15% 0); transform: translateX(5px); }
          65% { clip-path: inset(25% 0 45% 0); transform: translateX(-1px); }
          70% { clip-path: inset(90% 0 0 0); transform: translateX(4px); }
          75% { clip-path: inset(40% 0 30% 0); transform: translateX(-7px); }
          80% { clip-path: inset(70% 0 10% 0); transform: translateX(2px); }
          85% { clip-path: inset(15% 0 55% 0); transform: translateX(-3px); }
          90% { clip-path: inset(55% 0 15% 0); transform: translateX(8px); }
          95% { clip-path: inset(80% 0 5% 0); transform: translateX(-5px); }
          100% { clip-path: inset(65% 0 0 0); transform: translateX(5px); }
        }
        @keyframes glitchSkew {
          0% { transform: skewX(0deg); }
          20% { transform: skewX(0deg); }
          21% { transform: skewX(2deg); }
          23% { transform: skewX(0deg); }
          40% { transform: skewX(0deg); }
          41% { transform: skewX(-1deg) scaleY(1.006); }
          44% { transform: skewX(0deg); }
          60% { transform: skewX(0deg); }
          61% { transform: skewX(3deg); }
          62% { transform: skewX(0deg); }
          80% { transform: skewX(0deg); }
          81% { transform: skewX(-2deg) scaleY(0.994); }
          83% { transform: skewX(0deg); }
          100% { transform: skewX(0deg); }
        }
        @keyframes cursorBlink { 50% { opacity: 0; } }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes tickerScrollR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes dotPulse { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.6); } }
      `}</style>

      {/* Sidebar — hidden in fullscreen */}
      {!fullscreen && (
        <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${C.faint}`, padding: 20, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          <div style={{ ...Type.labelLg, color: C.mute, letterSpacing: 3, marginBottom: 12 }}>SCENES</div>
          {SCENES.map(s => (
            <ScenePickerItem key={s.id} scene={s} active={active === s.id} onClick={() => setActive(s.id)} />
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.faint}` }}>
            <button onClick={toggleFullscreen} style={{
              width: '100%', padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              background: C.accentFaint, border: `1px solid ${C.accent}40`, color: C.accent,
              fontFamily: FF.mono, fontSize: 16, letterSpacing: 1, textTransform: 'uppercase',
              transition: `background ${Duration.fast} ${Ease.default}`,
            }}>Fullscreen (F)</button>
            <div style={{ ...Type.labelSm, color: C.faint, marginTop: 8 }}>1920 × 1080 · 16:9 · LOOPING</div>
            <div style={{ ...Type.labelSm, color: C.faint, marginTop: 2 }}>← → NAVIGATE · F FULLSCREEN</div>
          </div>
        </div>
      )}

      {/* Scene viewport */}
      <div ref={viewportRef} style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#0a0a0a',
      }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
          <ActiveScene key={active} />
        </div>
      </div>
    </div>
  )
}
