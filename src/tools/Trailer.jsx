// ─────────────────────────────────────────────────────────────────────────────
// AUREVI0N · Trailer Player — auto-playing product video asset generator
// Screen-record this at 60fps for After Effects.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { Color, Font, Space, Radius } from '../ui/tokens'
import { Phone, FIcon, ICONS, FMono } from '../ui/components'

// Screen content imports
import { OB_Welcome, OB_Sex, OB_BodyMetrics, OB_TDEE, OB_Ready, AurevionMark, AurevionMarkAnimated } from '../app/screens/Onboarding'
import { DashboardContent } from '../app/screens/Dashboard'
import { TDEEContent } from '../app/screens/TDEE'
import { MacroTargetsContent } from '../app/screens/Macros'
import { TrainingSessionContent } from '../app/screens/Training'
import { PlanCalendarContent } from '../app/screens/PlanCalendar'

// Mock onboarding data for TDEE + Ready screens
const MOCK_DATA = {
  sex: 'male', birthYear: 2000, birthMonth: 5, birthDay: 15,
  height: 178, heightUnit: 'cm', weight: 82, weightUnit: 'kg',
  bodyFat: '18-23%', exerciseFreq: '4-6', activityLevel: 'moderate',
  liftingExp: 'intermediate', cardioExp: 'beginner', goal: 'lose',
}

const TOTAL_DURATION = 38

// ─── Timeline beats ──────────────────────────────────────
// { at: seconds, dur: seconds, screen: key, anim: transition type }
const BEATS = [
  // Act 1: Hook
  { at: 0.3,  dur: 2.5, screen: 'welcome',    anim: 'fadeIn' },
  { at: 3.0,  dur: 0.8, screen: 'ob-sex',      anim: 'swipeLeft' },
  { at: 3.8,  dur: 0.8, screen: 'ob-metrics',  anim: 'swipeLeft' },
  { at: 4.6,  dur: 1.4, screen: 'ob-metrics',  anim: 'swipeLeft' },

  // Act 2: The Plan
  { at: 6.0,  dur: 2.5, screen: 'ob-tdee',     anim: 'fadeIn' },
  { at: 8.5,  dur: 2.0, screen: 'ob-ready',    anim: 'swipeLeft' },
  { at: 10.5, dur: 5.5, screen: 'dashboard',   anim: 'zoomIn' },

  // Act 3: Feature beats
  { at: 16.0, dur: 2.5, screen: 'tdee',        anim: 'zoomIn' },
  { at: 18.5, dur: 2.5, screen: 'macros',      anim: 'zoomIn' },
  { at: 21.0, dur: 2.5, screen: 'training',    anim: 'zoomIn' },
  { at: 23.5, dur: 2.5, screen: 'calendar',    anim: 'zoomIn' },

  // Act 4: Close
  { at: 26.0, dur: 5.0, screen: 'dashboard',   anim: 'fadeIn' },
  { at: 31.0, dur: 7.0, screen: 'logo',        anim: 'fadeIn' },
]

// ─── Super text overlays ─────────────────────────────────
const SUPERS = [
  { at: 2.3,  dur: 1.5, text: 'YOUR BODY. YOUR DATA.' },
  { at: 3.8,  dur: 2.0, text: '10 questions. Your plan.', size: 13 },
  { at: 8.5,  dur: 2.0, text: 'Built for you.', color: Color.accent },
  { at: 13.0, dur: 3.0, text: 'Everything. One screen.' },
  { at: 16.0, dur: 2.2, text: 'Your energy. Modeled.' },
  { at: 18.5, dur: 2.2, text: 'Macros hit. Every day.' },
  { at: 21.0, dur: 2.2, text: 'Train with precision.' },
  { at: 23.5, dur: 2.2, text: 'Plan the week. Own the day.' },
  { at: 34.5, dur: 3.0, text: 'Nutrition. Training. Body composition.', size: 12, color: Color.dim },
]

// ─── Screen renderer ─────────────────────────────────────
function TrailerScreen({ screenId }) {
  const noop = () => {}
  const obProps = { onNext: noop, onBack: noop, data: MOCK_DATA, setData: noop }

  switch (screenId) {
    case 'welcome':
      return <OB_Welcome onNext={noop} />
    case 'ob-sex':
      return <OB_Sex {...obProps} />
    case 'ob-metrics':
      return <OB_BodyMetrics {...obProps} />
    case 'ob-tdee':
      return <OB_TDEE onNext={noop} onBack={noop} data={MOCK_DATA} />
    case 'ob-ready':
      return <OB_Ready data={MOCK_DATA} />
    case 'dashboard':
      return <DashboardContent />
    case 'tdee':
      return <TDEEContent />
    case 'macros':
      return <MacroTargetsContent />
    case 'training':
      return <TrainingSessionContent />
    case 'calendar':
      return <PlanCalendarContent />
    case 'logo':
      return <LogoClose />
    default:
      return null
  }
}

// ─── Logo close sequence ─────────────────────────────────
function LogoClose() {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setPhase(3), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: Space[5],
      padding: 40,
    }}>
      <div style={{
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <AurevionMarkAnimated size={64} />
      </div>
      <div style={{
        fontFamily: Font.sans, fontSize: 44, fontWeight: 200,
        letterSpacing: 6, color: Color.text,
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        AUREVI0N
      </div>
      <div style={{
        fontFamily: Font.mono, fontSize: 11, letterSpacing: 2,
        color: Color.dim, textTransform: 'uppercase',
        opacity: phase >= 3 ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        Nutrition · Training · Body composition
      </div>
    </div>
  )
}

// ─── Animation wrapper ───────────────────────────────────
function AnimatedBeat({ anim, beatKey, children }) {
  return (
    <div
      key={beatKey}
      className={`trailer-${anim}`}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}

// ─── Player ──────────────────────────────────────────────
export default function Trailer() {
  const [time, setTime] = useState(-0.5) // start with brief black
  const [playing, setPlaying] = useState(true)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const pausedAtRef = useRef(0)

  const tick = useCallback((now) => {
    if (!startRef.current) startRef.current = now
    const elapsed = (now - startRef.current) / 1000 + pausedAtRef.current
    if (elapsed >= TOTAL_DURATION) {
      setTime(TOTAL_DURATION)
      return
    }
    setTime(elapsed)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (playing) {
      startRef.current = null
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [playing, tick])

  const togglePlay = () => {
    if (playing) {
      pausedAtRef.current = time
      setPlaying(false)
    } else {
      setPlaying(true)
    }
  }

  const restart = () => {
    pausedAtRef.current = 0
    startRef.current = null
    setTime(-0.5)
    setPlaying(true)
  }

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
      if (e.code === 'KeyR') restart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Find active beat
  const activeBeat = [...BEATS].reverse().find(b => time >= b.at && time < b.at + b.dur)

  // Find active supers
  const activeSupers = SUPERS.filter(s => time >= s.at && time < s.at + s.dur)

  // Progress bar
  const progress = Math.max(0, Math.min(1, time / TOTAL_DURATION))

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: Font.sans, color: Color.text,
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(circle, rgba(255,110,80,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Phone frame with content */}
      <div style={{
        transform: `scale(${Math.min(1, (window.innerHeight - 180) / 874, (window.innerWidth - 80) / 402)})`,
        transformOrigin: 'center center',
      }}>
        <Phone statusTime="9:41">
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {activeBeat ? (
              <AnimatedBeat anim={activeBeat.anim} beatKey={`${activeBeat.screen}-${activeBeat.at}`}>
                <TrailerScreen screenId={activeBeat.screen} />
              </AnimatedBeat>
            ) : (
              <div style={{ flex: 1, background: Color.bg }} />
            )}
          </div>
        </Phone>
      </div>

      {/* Super text overlay */}
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        pointerEvents: 'none',
      }}>
        {activeSupers.map((s, i) => {
          const fadeIn = time - s.at < 0.3
          const fadeOut = (s.at + s.dur) - time < 0.3
          return (
            <div key={i} style={{
              fontFamily: Font.mono, fontSize: s.size || 14,
              letterSpacing: s.size ? 1.5 : 3, textTransform: 'uppercase',
              color: s.color || Color.text, fontWeight: 400,
              opacity: fadeIn ? (time - s.at) / 0.3 : fadeOut ? ((s.at + s.dur) - time) / 0.3 : 1,
              transform: fadeIn ? 'translateY(8px)' : 'translateY(0)',
              transition: 'transform 0.3s ease',
            }}>
              {s.text}
            </div>
          )
        })}
      </div>

      {/* Controls bar */}
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        padding: '0 40px',
      }}>
        {/* Progress bar — click to scrub */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
            const seekTo = pct * TOTAL_DURATION
            pausedAtRef.current = seekTo
            startRef.current = null
            setTime(seekTo)
            if (!playing) setPlaying(true)
          }}
          style={{
            width: '100%', maxWidth: 500, height: 12, borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            padding: '4px 0',
          }}
        >
          <div style={{
            width: `${progress * 100}%`, height: 3, borderRadius: 2,
            background: Color.accent,
          }} />
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <button onClick={restart} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: Color.mute, fontFamily: Font.mono, fontSize: 10,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>Restart</button>

          <button onClick={togglePlay} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid rgba(255,255,255,0.1)`,
            cursor: 'pointer', display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={playing ? ICONS.pause : ICONS.play} size={14} color={Color.text} stroke={2} />
          </button>

          <FMono size={10} color={Color.mute}>
            {Math.max(0, time).toFixed(1)}s / {TOTAL_DURATION}s
          </FMono>
        </div>

        <FMono size={9} color={Color.faint}>
          SPACE to play/pause · R to restart
        </FMono>
      </div>

      {/* CSS animations */}
      <style>{`
        .trailer-fadeIn {
          animation: trailerFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .trailer-swipeLeft {
          animation: trailerSwipeLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .trailer-zoomIn {
          animation: trailerZoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .trailer-fadeOut {
          animation: trailerFadeOut 0.3s ease both;
        }

        @keyframes trailerFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes trailerSwipeLeft {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes trailerZoomIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes trailerFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
