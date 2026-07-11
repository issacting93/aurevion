/* ════════════════════════════════════════════════════════════
   Fitness Flow Demo — auto-advancing live walkthrough
   Onboarding → Dashboard → Program → Session → Summary → Home
   ════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef } from 'react'
import { UserProvider, useUser } from '../context/UserContext'
import { NavigationProvider, useNav } from '../context/NavigationContext'
import { ShellContent } from '../app/Shell'
import { OnboardingFlow } from '../app/screens/Onboarding'
import { Phone, FIcon, ICONS } from '../ui/components'
import { Color, Font, Space, Radius } from '../ui/tokens'

/* ── Constants ── */

const PHASE_LABELS = ['ONBOARDING', 'DASHBOARD', 'PROGRAM', 'SESSION', 'SUMMARY', 'DONE']

const INITIAL_STATE = {
  profile: null, targets: null, mealPrepApproach: null,
  preferences: { layout: 'balanced' }, onboarded: false,
  checkins: [], interventions: [], activityLog: [], workoutPlan: null,
}

/* ── PhoneScaler (from AppFlow) ── */

function PhoneScaler({ children }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => {
      const availH = Math.max(420, window.innerHeight - 220)
      const availW = Math.max(320, window.innerWidth - 48)
      setScale(Math.min(1, availH / 874, availW / 402))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return (
    <div style={{
      width: 402, height: 874,
      transform: `scale(${scale})`, transformOrigin: 'top center',
    }}>
      {children}
    </div>
  )
}

/* ── Mono label ── */

function Mono({ children, color = Color.text, style }) {
  return (
    <span style={{
      fontFamily: '"Geist Mono", ui-monospace, monospace',
      fontSize: 11, letterSpacing: 1.4, color,
      textTransform: 'uppercase', ...style,
    }}>{children}</span>
  )
}

/* ── Demo Orchestrator (lives inside both providers) ── */

function DemoOrchestrator({ playing, onPhaseChange }) {
  const { onboarded, workoutPlan } = useUser()
  const { switchTab, pushDetail, activeTab, showingDetail } = useNav()
  const [phase, setPhase] = useState(0) // 0=onboarding, 1=dashboard, 2=program, 3=session, 4=summary, 5=done
  const phaseRef = useRef(0)
  const hasStartedSession = useRef(false)

  const updatePhase = useCallback((p) => {
    phaseRef.current = p
    setPhase(p)
    onPhaseChange?.(p)
  }, [onPhaseChange])

  // Phase 0→1: Onboarding completes → land on dashboard
  useEffect(() => {
    if (phaseRef.current === 0 && onboarded) {
      // Onboarding just completed, now on home tab
      const t = setTimeout(() => updatePhase(1), 500)
      return () => clearTimeout(t)
    }
  }, [onboarded])

  // Phase 1→2: Dwell on dashboard, then switch to Train tab
  useEffect(() => {
    if (!playing || phaseRef.current !== 1) return
    const t = setTimeout(() => {
      switchTab('train')
      setTimeout(() => updatePhase(2), 400)
    }, 3500)
    return () => clearTimeout(t)
  }, [playing, phase])

  // Phase 2→3: Dwell on program, then start a session
  useEffect(() => {
    if (!playing || phaseRef.current !== 2 || hasStartedSession.current) return
    const t = setTimeout(() => {
      if (!workoutPlan?.schedule) return
      const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
      const todaySession = workoutPlan.schedule.find(s => !s.isRest && s.dayIndex === todayIdx)
      const firstSession = workoutPlan.schedule.find(s => !s.isRest)
      const session = todaySession || firstSession
      if (session) {
        hasStartedSession.current = true
        pushDetail('active-session', session.name, { session, autoAdvance: true })
        setTimeout(() => updatePhase(3), 400)
      }
    }, 3500)
    return () => clearTimeout(t)
  }, [playing, phase, workoutPlan])

  // Phase 3→4: Training auto-advance handles itself via the autoAdvance prop
  // The summary phase will show, then auto-dismiss → onComplete fires → returns to home
  // We detect this transition by watching for showingDetail going false after phase 3
  useEffect(() => {
    if (phaseRef.current === 3 && !showingDetail) {
      // Session completed and returned to home
      updatePhase(5)
    }
  }, [showingDetail, phase])

  // Render the right content based on phase
  if (phaseRef.current === 0 && !onboarded) {
    return (
      <Phone statusTime="9:41">
        <OnboardingFlow demoMode />
      </Phone>
    )
  }

  return (
    <Phone statusTime="9:41">
      <ShellContent />
    </Phone>
  )
}

/* ── Transport controls ── */

function TransportBar({ playing, onPlay, onPause, onRestart, phase }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '12px 24px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: Radius.xl,
      border: `1px solid rgba(255,255,255,0.06)`,
    }}>
      {/* Play / Pause */}
      <button onClick={playing ? onPause : onPlay} style={{
        width: 40, height: 40, borderRadius: '50%',
        background: playing ? 'rgba(255,110,80,0.15)' : Color.accent,
        border: 'none', cursor: 'pointer',
        display: 'grid', placeItems: 'center',
        transition: 'background 0.15s',
      }}>
        <FIcon
          path={playing ? 'M10 4h1v16h-1zM14 4h1v16h-1z' : ICONS.play}
          size={16}
          color={playing ? Color.accent : Color.accentText}
        />
      </button>

      {/* Restart */}
      <button onClick={onRestart} style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(255,255,255,0.06)`,
        cursor: 'pointer', display: 'grid', placeItems: 'center',
      }}>
        <FIcon path="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" size={14} color={Color.dim} />
      </button>

      {/* Phase indicator */}
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {PHASE_LABELS.map((label, i) => (
          <div key={label} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              height: 3, width: '100%', borderRadius: 2,
              background: i <= phase ? Color.accent : 'rgba(255,255,255,0.06)',
              transition: 'background 0.3s',
            }} />
            <Mono color={i <= phase ? Color.accent : Color.mute} style={{ fontSize: 8, letterSpacing: 1 }}>
              {label}
            </Mono>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main page component ── */

export default function FitnessFlowDemo() {
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState(0)
  const [key, setKey] = useState(0) // remount key for restart

  const handleRestart = useCallback(() => {
    setPhase(0)
    setPlaying(true)
    setKey(k => k + 1)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,110,80,0.04) 0%, transparent 60%)',
      color: Color.text,
      fontFamily: Font.sans,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', gap: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo.svg" width="28" height="28" alt="AUREVI0N" style={{ borderRadius: 6 }} />
        <div>
          <Mono color={Color.dim}>AUREVI0N · FITNESS FLOW</Mono>
        </div>
      </div>

      {/* Phone with live app */}
      <PhoneScaler>
        <UserProvider key={key} _override={{ ...INITIAL_STATE }}>
          <NavigationProvider>
            <DemoOrchestrator
              playing={playing}
              onPhaseChange={setPhase}
            />
          </NavigationProvider>
        </UserProvider>
      </PhoneScaler>

      {/* Transport */}
      <TransportBar
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onRestart={handleRestart}
        phase={phase}
      />

      {/* Keyboard hint */}
      <Mono color={Color.faint} style={{ fontSize: 9 }}>
        Auto-advancing demo · ~45 seconds
      </Mono>
    </div>
  )
}
