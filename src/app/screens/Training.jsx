// ════════════════════════════════════════════════════════════
// 07 Training · Active Session — three phases:
//    Review → Execute → Summary
// Timer pattern follows MealPrep cook mode (setInterval).
// ════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, FTag, FTexBar, FListRow, FToolbar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { formatTime, computeSessionVolume, computeAvgRPE } from './fitness-data'

/* ── CSS (injected once) ── */
if (typeof document !== 'undefined' && !document.getElementById('train-css')) {
  const s = document.createElement('style')
  s.id = 'train-css'
  s.textContent = `
    @keyframes pulseRing { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.5; } }
    @keyframes trainSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; } }
  `
  document.head.appendChild(s)
}

/* ── Main Content Component ── */

export function TrainingSessionContent({ session, onComplete, onBack }) {
  const { logWorkout } = useUser()
  const [phase, setPhase] = useState('review') // review | execute | summary

  // Session exercises (from plan or fallback demo)
  const exercises = useMemo(() => {
    if (!session?.exercises) return DEMO_EXERCISES
    return session.exercises
  }, [session])

  const coreExercises = useMemo(() =>
    exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown'),
    [exercises]
  )

  // ─── Execute phase state ───
  const [currentExIdx, setCurrentExIdx] = useState(0)
  const [currentSetIdx, setCurrentSetIdx] = useState(0)
  const [loggedSets, setLoggedSets] = useState(() =>
    coreExercises.map(ex => ({
      exerciseId: ex.exerciseId || ex.name,
      name: ex.name,
      planned: { sets: ex.sets, reps: ex.reps, load: ex.load },
      logged: [],
    }))
  )
  const [elapsed, setElapsed] = useState(0)
  const [restRem, setRestRem] = useState(0)
  const [paused, setPaused] = useState(false)
  const [rpeInput, setRpeInput] = useState(null)
  const [resting, setResting] = useState(false)

  const currentEx = coreExercises[currentExIdx]
  const currentLog = loggedSets[currentExIdx]
  const totalSetsCompleted = loggedSets.reduce((sum, ex) => sum + ex.logged.length, 0)
  const totalSetsPlanned = coreExercises.reduce((sum, ex) => sum + ex.sets, 0)

  // ─── Timer ───
  useEffect(() => {
    if (phase !== 'execute' || paused) return
    const t = setInterval(() => {
      setElapsed(s => s + 1)
      setRestRem(s => {
        if (s <= 1 && s > 0) setResting(false)
        return Math.max(0, s - 1)
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase, paused])

  // ─── Actions ───
  const handleBegin = useCallback(() => {
    setPhase('execute')
    setCurrentExIdx(0)
    setCurrentSetIdx(0)
  }, [])

  const handleLogSet = useCallback(() => {
    if (!currentEx) return
    const reps = currentEx.reps
    const load = currentEx.load
    const rpe = rpeInput || 7

    setLoggedSets(prev => {
      const next = [...prev]
      const entry = { ...next[currentExIdx] }
      entry.logged = [...entry.logged, { reps, load, rpe }]
      next[currentExIdx] = entry
      return next
    })

    setRpeInput(null)
    const nextSetIdx = currentSetIdx + 1

    if (nextSetIdx >= currentEx.sets) {
      // Move to next exercise
      const nextExIdx = currentExIdx + 1
      if (nextExIdx >= coreExercises.length) {
        // All done → summary
        handleFinish()
      } else {
        setCurrentExIdx(nextExIdx)
        setCurrentSetIdx(0)
        setRestRem(currentEx.rest || 90)
        setResting(true)
      }
    } else {
      setCurrentSetIdx(nextSetIdx)
      setRestRem(currentEx.rest || 90)
      setResting(true)
    }
  }, [currentEx, currentSetIdx, currentExIdx, rpeInput, coreExercises.length])

  const handleSkipRest = useCallback(() => {
    setRestRem(0)
    setResting(false)
  }, [])

  const handleSkipExercise = useCallback(() => {
    const nextExIdx = currentExIdx + 1
    if (nextExIdx >= coreExercises.length) {
      handleFinish()
    } else {
      setCurrentExIdx(nextExIdx)
      setCurrentSetIdx(0)
      setResting(false)
      setRestRem(0)
    }
  }, [currentExIdx, coreExercises.length])

  const handleFinish = useCallback(() => {
    const duration = Math.round(elapsed / 60)
    logWorkout({
      duration,
      type: session?.modality || 'strength',
      name: session?.name || 'Workout',
      loggedSets,
    })
    setPhase('summary')
  }, [elapsed, session, loggedSets, logWorkout])

  const handleDone = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  // ─── Render by phase ───
  if (phase === 'review') {
    return <ReviewPhase exercises={exercises} session={session} onBegin={handleBegin} onBack={onBack} />
  }

  if (phase === 'summary') {
    return <SummaryPhase loggedSets={loggedSets} elapsed={elapsed} onDone={handleDone} session={session} />
  }

  // Execute phase
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Sticky header — progress rail */}
      <div style={{ padding: '8px 24px 12px', flexShrink: 0, borderBottom: `1px solid ${Color.borderSoft}` }}>
        {/* Exercise dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {coreExercises.map((_, i) => {
            const done = i < currentExIdx
            const active = i === currentExIdx
            return (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: done ? Color.accent : active ? Color.accent : 'rgba(255,255,255,0.08)',
                opacity: done ? 0.5 : 1,
                transition: 'background 0.3s',
              }} />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <FLabel mb={2}>Elapsed</FLabel>
            <FNum size={32} weight={200}>{formatTime(elapsed)}</FNum>
          </div>
          <div style={{ textAlign: 'right' }}>
            <FLabel mb={2}>Sets</FLabel>
            <FMono color={Color.accent} size={14}>{totalSetsCompleted} / {totalSetsPlanned}</FMono>
          </div>
        </div>
      </div>

      {/* Main exercise focus */}
      <div style={{ flex: 1, padding: '24px 24px 0', overflowY: 'auto', animation: 'trainSlideIn 0.25s ease both' }} key={currentExIdx}>
        {/* Exercise name + meta */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...Type.headingLg, marginBottom: 4 }}>{currentEx?.name}</div>
          <FMono color={Color.mute} size={10}>
            {currentEx?.muscles?.join(' · ').toUpperCase()}
          </FMono>
        </div>

        {/* Form cue */}
        {currentEx?.cue && (
          <div style={{
            ...Type.bodyMd, color: Color.dim, lineHeight: 1.6,
            padding: '12px 16px', borderRadius: Radius.md,
            background: Color.surface, border: `1px solid ${Color.borderSoft}`,
            marginBottom: 24,
          }}>
            {currentEx.cue}
          </div>
        )}

        {/* Set tracker */}
        <FLabel mb={10}>Set {currentSetIdx + 1} of {currentEx?.sets}</FLabel>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {Array.from({ length: currentEx?.sets || 0 }).map((_, j) => {
            const done = j < currentLog?.logged.length
            const active = j === currentSetIdx
            const logEntry = currentLog?.logged[j]
            return (
              <div key={j} style={{
                flex: 1, padding: '10px 6px', borderRadius: 6, textAlign: 'center',
                background: done ? `${Color.accent}1a` : active ? Color.accent : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? Color.accent : done ? 'rgba(255,110,80,0.3)' : Color.borderSoft}`,
              }}>
                {done ? (
                  <>
                    <FIcon path={ICONS.check} size={12} color={Color.accent} stroke={2.5} />
                    <FMono size={10} color={Color.mute}>{logEntry?.reps}×{logEntry?.load || 'BW'}</FMono>
                  </>
                ) : (
                  <>
                    <div style={{ ...Type.dataLg, fontWeight: 600, color: active ? Color.accentText : Color.text }}>
                      {currentEx?.reps}
                    </div>
                    <FMono size={9} color={active ? Color.accentText : Color.mute}>
                      {currentEx?.load > 0 ? `${currentEx.load}kg` : 'BW'}
                    </FMono>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* RPE selector */}
        {!resting && (
          <div style={{ marginBottom: 20 }}>
            <FLabel mb={8}>RPE</FLabel>
            <div style={{ display: 'flex', gap: 4 }}>
              {[5, 6, 7, 8, 9, 10].map(r => (
                <button key={r} onClick={() => setRpeInput(r)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: rpeInput === r ? Color.accent : Color.surface,
                  color: rpeInput === r ? Color.accentText : Color.text,
                  ...Type.dataLg, fontWeight: rpeInput === r ? 600 : 400,
                  transition: 'all 0.15s',
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Log set button */}
        {!resting && (
          <FBtn variant="primary" full icon={ICONS.check} onClick={handleLogSet} data-stay="true">
            Log set · {currentEx?.reps} reps {currentEx?.load > 0 ? `@ ${currentEx.load}kg` : ''}
          </FBtn>
        )}

        {/* Rest timer */}
        {resting && restRem > 0 && (
          <FSurface style={{
            marginTop: 8, padding: 16, borderRadius: Radius.lg,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FIcon path={ICONS.timer} size={16} color={Color.accent} stroke={2} />
                <FLabel mb={0}>Rest</FLabel>
              </div>
              <FNum size={28} weight={200}>{formatTime(restRem)}</FNum>
            </div>
            <FTexBar pct={(1 - restRem / (currentEx?.rest || 90)) * 100} height={4} />
            <FBtn variant="ghost" size="sm" icon={ICONS.fwd} onClick={handleSkipRest} data-stay="true">Skip rest</FBtn>
          </FSurface>
        )}

        {/* Rest done indicator */}
        {resting && restRem === 0 && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <FTag tone="green" size="sm">REST COMPLETE</FTag>
            <div style={{ marginTop: 12 }}>
              <FBtn variant="primary" size="md" onClick={() => setResting(false)} data-stay="true">Next set</FBtn>
            </div>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div style={{ padding: '12px 24px 24px', flexShrink: 0, borderTop: `1px solid ${Color.borderSoft}` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <FBtn variant="ghost" size="sm" onClick={() => setPaused(p => !p)} data-stay="true">
            {paused ? '▶ Resume' : '❚❚ Pause'}
          </FBtn>
          <FBtn variant="ghost" size="sm" onClick={handleSkipExercise} data-stay="true">
            Skip exercise
          </FBtn>
          <div style={{ flex: 1 }} />
          <FBtn variant="split" size="sm" onClick={handleFinish} data-stay="true">
            End
          </FBtn>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Review Phase — exercise list before starting
   ════════════════════════════════════════════════════════════ */

function ReviewPhase({ exercises, session, onBegin, onBack }) {
  const coreExercises = exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <FLabel>{session?.modalityLabel || 'STRENGTH'}</FLabel>
        {session?.focus && <FMono color={Color.mute} size={9}>· {session.focus.toUpperCase()}</FMono>}
      </div>
      <div style={{ ...Type.headingLg, marginBottom: 4 }}>{session?.name || 'Workout'}</div>
      <FMono color={Color.mute} size={10}>
        {coreExercises.length} exercises · ~{session?.estimatedMins || 45} min
      </FMono>

      {/* Exercise list */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column' }}>
        {exercises.map((ex, i) => {
          const isUtil = ex.category === 'warmup' || ex.category === 'cooldown'
          return (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '16px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${Color.borderSoft}`,
              opacity: isUtil ? 0.5 : 1,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                background: 'transparent',
                border: `1.5px solid ${isUtil ? Color.faint : 'rgba(255,110,80,0.3)'}`,
                display: 'grid', placeItems: 'center',
                fontFamily: Font.mono, fontSize: 11, color: isUtil ? Color.mute : Color.dim,
              }}>
                {isUtil ? '—' : i}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...Type.bodyLg, color: Color.text }}>
                  {ex.name}
                </div>
                <FMono color={Color.mute} size={10}>
                  {ex.duration > 0
                    ? `${ex.duration} MIN`
                    : ex.load > 0
                      ? `${ex.sets} × ${ex.reps} @ ${ex.load}KG · REST ${ex.rest}S`
                      : `${ex.sets} × ${ex.reps} · REST ${ex.rest || 0}S`}
                </FMono>
                {ex.muscles?.length > 0 && (
                  <FMono color={Color.faint} size={9}>{ex.muscles.join(' · ').toUpperCase()}</FMono>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24 }}>
        <FBtn variant="primary" full icon={ICONS.play} onClick={onBegin} data-stay="true">
          Begin Workout
        </FBtn>
      </div>
      {onBack && (
        <div style={{ marginTop: 8 }}>
          <FBtn variant="ghost" full onClick={onBack} data-stay="true">Back to plan</FBtn>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Summary Phase — post-session recap (computed from logged data)
   ════════════════════════════════════════════════════════════ */

function SummaryPhase({ loggedSets, elapsed, onDone, session }) {
  const volume = computeSessionVolume(loggedSets)
  const avgRPE = computeAvgRPE(loggedSets)
  const totalSets = loggedSets.reduce((sum, ex) => sum + ex.logged.length, 0)
  const volumeStr = volume.toLocaleString()

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `${Color.green}15`, border: `2px solid ${Color.green}40`,
          display: 'grid', placeItems: 'center', margin: '0 auto 16px',
        }}>
          <FIcon path={ICONS.check} size={28} color={Color.green} stroke={2.5} />
        </div>
        <FNum size={42} weight={200}>{formatTime(elapsed)}</FNum>
        <FMono color={Color.mute}>SESSION COMPLETE</FMono>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Volume</FLabel>
          <FNum size={18} weight={300} unit="kg">{volumeStr}</FNum>
        </FSurface>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Sets</FLabel>
          <FNum size={22} weight={300}>{totalSets}</FNum>
        </FSurface>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Avg RPE</FLabel>
          <FNum size={22} weight={300} color={Color.accent}>{avgRPE || '—'}</FNum>
        </FSurface>
      </div>

      {/* Exercise breakdown */}
      <FLabel mb={12}>Exercise breakdown</FLabel>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {loggedSets.filter(ex => ex.logged.length > 0).map((ex, i) => {
          const exVolume = ex.logged.reduce((s, set) => s + (set.reps * (set.load || 0)), 0)
          const topLoad = Math.max(...ex.logged.map(s => s.load || 0))
          return (
            <FListRow key={i}
              title={ex.name}
              subtitle={`${ex.logged.length} × ${ex.planned.reps} @ ${topLoad > 0 ? topLoad + 'kg' : 'BW'}`}
              trailing={
                <FMono color={Color.dim}>{exVolume > 0 ? exVolume.toLocaleString() + ' kg' : '—'}</FMono>
              }
              divider={i > 0}
            />
          )
        })}
      </div>

      {/* RPE bar */}
      {avgRPE > 0 && (
        <FSurface style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FLabel>Avg RPE</FLabel>
            <FNum size={24} weight={300}>{avgRPE}</FNum>
          </div>
          <div style={{ marginTop: 12 }}>
            <FTexBar pct={avgRPE * 10} height={6} />
          </div>
        </FSurface>
      )}

      <div style={{ marginTop: 24 }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd} onClick={onDone} data-stay="true">Done</FBtn>
      </div>
    </div>
  )
}

/* ── Demo fallback data ── */

const DEMO_EXERCISES = [
  { exerciseId: '_warmup', name: 'Warm-up walk', category: 'warmup', muscles: [], cue: 'Light movement to raise heart rate', sets: 1, reps: 1, load: 0, rest: 0, duration: 5 },
  { exerciseId: 'goblet_squat', name: 'Goblet squat', category: 'compound', muscles: ['quads', 'glutes'], cue: 'Hold bell at chest, sit deep between knees', sets: 2, reps: 8, load: 24, rest: 90, duration: 0 },
  { exerciseId: 'back_squat', name: 'Back squat', category: 'compound', muscles: ['quads', 'glutes', 'core'], cue: 'Drive through the floor and keep the chest organized on every rep.', sets: 4, reps: 6, load: 102, rest: 120, duration: 0 },
  { exerciseId: 'rdl', name: 'Romanian deadlift', category: 'compound', muscles: ['hamstrings', 'glutes'], cue: 'Soft knees, push hips back, feel hamstring stretch', sets: 3, reps: 8, load: 80, rest: 90, duration: 0 },
  { exerciseId: 'db_lunge', name: 'Walking lunge', category: 'compound', muscles: ['quads', 'glutes'], cue: 'Long stride, front knee tracks toe, drive through heel', sets: 3, reps: 10, load: 24, rest: 60, duration: 0 },
  { exerciseId: '_cooldown', name: 'Cooldown breathing', category: 'cooldown', muscles: [], cue: 'Light stretching and controlled breathing', sets: 1, reps: 1, load: 0, rest: 0, duration: 3 },
]

/* ── Screen wrapper (for journey/gallery) ── */

export function TrainingSessionScreen() {
  return (
    <Phone label="Training Session" group="TRAINING">
      <FNavBar
        title="Training"
        leading={<FIcon path={ICONS.close} size={20} color={Color.text} />}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text} />}
      />
      <TrainingSessionContent />
    </Phone>
  )
}
