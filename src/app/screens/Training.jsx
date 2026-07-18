// ════════════════════════════════════════════════════════════
// 07 Training · Active Session — three phases:
//    Review → Execute → Summary
// Timer pattern follows MealPrep cook mode (setInterval).
// ════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, FTag, FTexBar, FListRow, FToolbar, FWeightInput, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { formatTime, computeSessionVolume, computeAvgRPE, computeAvgRIR, flattenSessionExercises, suggestLoadAdjustment, deriveLoadRecommendation } from './fitness-data'
import { deriveMealTiming, deriveRIRTarget } from '../../context/goalEngine'

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

export function TrainingSessionContent({ session, onComplete, onBack, autoAdvance = false }) {
  const { pushDetail } = useNav()
  const { logWorkout, activityLog, activeSession, saveActiveSession, clearActiveSession, exerciseHistory } = useUser()
  const [phase, setPhase] = useState('execute') // execute | summary (review eliminated)

  // Session exercises (from plan or fallback demo)
  const exercises = useMemo(() => {
    if (!session?.exercises) return DEMO_EXERCISES
    return session.exercises
  }, [session])

  // Flatten grouped exercises into a linear sequence with group annotations
  const coreExercises = useMemo(() => {
    const nonUtil = exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
    // Check if any items are groups — if so, flatten
    const hasGroups = nonUtil.some(e => e.groupType)
    if (hasGroups) return flattenSessionExercises(nonUtil)
    return nonUtil.map(e => ({ ...e, _groupId: null }))
  }, [exercises])

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
  const [rirInput, setRirInput] = useState(null)
  const [resting, setResting] = useState(false)
  const [loadOverrides, setLoadOverrides] = useState({}) // { exIdx: adjustedLoad }
  const [loadSuggestion, setLoadSuggestion] = useState(null) // { suggested, current, exIdx }
  const [loadEditing, setLoadEditing] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  useEffect(() => { setLoadEditing(false) }, [currentExIdx])

  const currentEx = coreExercises[currentExIdx]
  const currentLog = loggedSets[currentExIdx]
  const totalSetsCompleted = loggedSets.reduce((sum, ex) => sum + ex.logged.length, 0)
  const totalSetsPlanned = coreExercises.reduce((sum, ex) => sum + ex.sets, 0)
  const effectiveLoad = loadOverrides[currentExIdx] ?? currentEx?.load

  // ─── Cross-session load recommendation ───
  const [loadRecDismissed, setLoadRecDismissed] = useState({})
  const loadRec = useMemo(() => {
    if (!currentEx || autoAdvance) return null
    const history = exerciseHistory?.[currentEx.exerciseId]
    return deriveLoadRecommendation(history, effectiveLoad)
  }, [currentEx?.exerciseId, exerciseHistory, effectiveLoad, autoAdvance])

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

  // ─── Restore active session on mount ───
  useEffect(() => {
    if (activeSession && activeSession.sessionId === session?.id) {
      setCurrentExIdx(activeSession.currentExIdx ?? 0)
      setCurrentSetIdx(activeSession.currentSetIdx ?? 0)
      if (activeSession.loggedSets) setLoggedSets(activeSession.loggedSets)
      if (activeSession.elapsed) setElapsed(activeSession.elapsed)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Persist session state when loggedSets changes ───
  useEffect(() => {
    if (phase !== 'execute' || !session?.id) return
    saveActiveSession({
      sessionId: session.id,
      sessionName: session.name,
      currentExIdx,
      currentSetIdx,
      loggedSets,
      elapsed,
      startedAt: activeSession?.startedAt || new Date().toISOString(),
    })
  }, [loggedSets]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Actions ───
  const handleBegin = useCallback(() => {
    setPhase('execute')
    setCurrentExIdx(0)
    setCurrentSetIdx(0)
  }, [])

  const handleLogSet = useCallback(() => {
    if (!currentEx) return
    const reps = currentEx.reps
    const load = effectiveLoad || 0
    const rpe = rpeInput || 7
    const rir = rirInput

    setLoggedSets(prev => {
      const next = [...prev]
      const entry = { ...next[currentExIdx] }
      entry.logged = [...entry.logged, { reps, load, rpe, rir, adjustedLoad: loadOverrides[currentExIdx] != null ? load : undefined }]
      next[currentExIdx] = entry
      return next
    })

    // Compute load suggestion based on RIR
    const suggestion = suggestLoadAdjustment(load, rir)
    if (suggestion && suggestion !== load) {
      setLoadSuggestion({ suggested: suggestion, current: load, exIdx: currentExIdx })
    } else {
      setLoadSuggestion(null)
    }

    setRpeInput(null)
    setRirInput(null)
    const nextSetIdx = currentSetIdx + 1

    if (nextSetIdx >= currentEx.sets) {
      // Move to next exercise
      const nextExIdx = currentExIdx + 1
      if (nextExIdx >= coreExercises.length) {
        handleFinish()
      } else {
        // Group-aware: skip rest if next exercise is in the same group
        const nextEx = coreExercises[nextExIdx]
        const sameGroup = currentEx._groupId && nextEx._groupId === currentEx._groupId
        setCurrentExIdx(nextExIdx)
        setCurrentSetIdx(0)
        if (sameGroup) {
          // No rest between grouped exercises
          setResting(false)
          setRestRem(0)
        } else if (currentEx._isLastInGroup && currentEx._restAfterGroup) {
          // Rest after completing the group
          setRestRem(currentEx._restAfterGroup)
          setResting(true)
        } else {
          setRestRem(currentEx.rest || 90)
          setResting(true)
        }
      }
    } else {
      setCurrentSetIdx(nextSetIdx)
      setRestRem(currentEx.rest || 90)
      setResting(true)
    }
  }, [currentEx, currentSetIdx, currentExIdx, rpeInput, rirInput, effectiveLoad, loadOverrides, coreExercises])

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
    clearActiveSession()
    setPhase('summary')
  }, [elapsed, session, loggedSets, logWorkout, clearActiveSession])

  const handleDone = useCallback(() => {
    clearActiveSession()
    onComplete?.()
  }, [onComplete, clearActiveSession])

  // ─── Auto-advance mode (demo flow) ───
  const autoAdvanceExLimit = 3
  useEffect(() => {
    if (!autoAdvance || phase !== 'execute') return
    const tick = () => {
      if (resting) {
        // Skip rest after 1.2s
        setRestRem(0)
        setResting(false)
        return
      }
      // Auto-select RPE/RIR if not set
      if (rpeInput == null) setRpeInput(7)
      if (rirInput == null) setRirInput(3)
      // Log the set
      if (currentEx) {
        const reps = currentEx.reps
        const load = effectiveLoad || 0
        setLoggedSets(prev => {
          const next = [...prev]
          const entry = { ...next[currentExIdx] }
          entry.logged = [...entry.logged, { reps, load, rpe: 7, rir: 3 }]
          next[currentExIdx] = entry
          return next
        })
        const nextSetIdx = currentSetIdx + 1
        if (nextSetIdx >= currentEx.sets) {
          const nextExIdx = currentExIdx + 1
          if (nextExIdx >= coreExercises.length || nextExIdx >= autoAdvanceExLimit) {
            handleFinish()
            return
          }
          setCurrentExIdx(nextExIdx)
          setCurrentSetIdx(0)
          setRestRem(45)
          setResting(true)
        } else {
          setCurrentSetIdx(nextSetIdx)
          setRestRem(30)
          setResting(true)
        }
      }
    }
    const interval = resting ? 1200 : 800
    const t = setTimeout(tick, interval)
    return () => clearTimeout(t)
  }, [autoAdvance, phase, resting, currentExIdx, currentSetIdx, currentEx, effectiveLoad, coreExercises.length])

  // Auto-advance: auto-dismiss summary after 3s
  useEffect(() => {
    if (!autoAdvance || phase !== 'summary') return
    const t = setTimeout(() => handleDone(), 3000)
    return () => clearTimeout(t)
  }, [autoAdvance, phase])

  // ─── Render by phase (review eliminated — Start goes straight to execute) ───

  if (phase === 'summary') {
    return <SummaryPhase loggedSets={loggedSets} elapsed={elapsed} onDone={handleDone} session={session} />
  }

  // Derived values for execute phase UI
  const rirTarget = session?.modality ? deriveRIRTarget(session.modality) : null
  const nextEx = currentExIdx + 1 < coreExercises.length ? coreExercises[currentExIdx + 1] : null

  // "Last time" lookup for the next exercise (shown during rest)
  const lastTimeForNext = useMemo(() => {
    if (!nextEx || !activityLog) return null
    const prev = activityLog
      .filter(e => e.type === 'workout' && e.data?.loggedSets)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    for (const entry of prev) {
      const match = entry.data.loggedSets.find(s => s.exerciseId === nextEx.exerciseId || s.name === nextEx.name)
      if (match?.logged?.length > 0) {
        const best = match.logged.sort((a, b) => (b.load || 0) - (a.load || 0))[0]
        return best ? `${best.load}kg \u00d7 ${best.reps}` : null
      }
    }
    return null
  }, [nextEx, activityLog])
  const inGroup = !!currentEx?._groupId
  const nextIsSameGroup = inGroup && nextEx?._groupId === currentEx?._groupId

  // Execute phase
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Sticky header — progress rail + group banner */}
      <div style={{ flexShrink: 0 }}>
        {/* Group banner — persistent across the top when inside a superset/circuit */}
        {inGroup && (
          <div style={{
            padding: '6px 24px',
            background: `${Color.accent}08`,
            borderBottom: `1px solid ${Color.accent}20`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FTag tone="accent" size="sm">
              {currentEx._groupType === 'circuit' ? 'CIRCUIT' : `SUPERSET ${currentEx._groupLabel}`}
            </FTag>
            <FMono size={10} color={Color.dim}>
              {currentEx._posInGroup + 1}/{currentEx._groupSize}
              {currentEx._groupType === 'circuit' ? ` · Round ${currentSetIdx + 1}/${currentEx._groupRounds}` : ''}
            </FMono>
            {nextIsSameGroup && (
              <FMono size={10} color={Color.accent} style={{ marginLeft: 'auto' }}>→ {nextEx?.name}</FMono>
            )}
          </div>
        )}

        {/* Progress dots + elapsed + sets */}
        <div style={{ padding: '8px 24px 12px', borderBottom: `1px solid ${Color.borderSoft}` }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {coreExercises.map((ex, i) => {
              const done = i < currentExIdx
              const active = i === currentExIdx
              const isGrouped = !!ex._groupId
              return (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: done
                    ? (isGrouped ? Color.blue : Color.accent)
                    : active ? Color.accent : 'rgba(255,255,255,0.06)',
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
      </div>

      {/* Main exercise focus */}
      <div style={{ flex: 1, padding: '20px 24px 0', overflowY: 'auto', animation: 'trainSlideIn 0.25s ease both' }} key={currentExIdx}>
        {/* Exercise name + meta — tap for detail */}
        <div
          onClick={() => pushDetail?.('exercise-detail', currentEx?.name, { exercise: currentEx })}
          style={{ marginBottom: 16, cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ ...Type.headingLg, flex: 1 }}>{currentEx?.name}</div>
            <FIcon path={ICONS.fwd} size={14} color={Color.faint} stroke={1.5} />
          </div>
          <FMono color={Color.mute} size={10}>
            {currentEx?.muscles?.join(' · ').toUpperCase()}
          </FMono>
        </div>

        {/* Load adjuster — tap to edit */}
        {!resting && currentEx && effectiveLoad > 0 && (
          loadEditing ? (
            <div style={{
              padding: '12px 16px', borderRadius: Radius.md,
              background: Color.surface, border: `1px solid ${Color.accent}40`,
              marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <FWeightInput
                value={effectiveLoad}
                onChange={v => setLoadOverrides(prev => ({ ...prev, [currentExIdx]: v }))}
                min={0} max={300} step={currentEx.load >= 20 ? 2.5 : 1}
                unit="kg" size="sm" inline
              />
              <FBtn variant="primary" size="sm" onClick={() => setLoadEditing(false)} data-stay="true">Done</FBtn>
            </div>
          ) : (
            <div
              onClick={() => setLoadEditing(true)}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 6,
                marginBottom: 16, cursor: 'pointer', padding: '8px 0',
              }}>
              <FNum size={24} weight={300}>{effectiveLoad}</FNum>
              <FMono size={10} color={Color.mute}>KG</FMono>
              <FMono size={10} color={Color.faint}>· {currentEx.sets} × {currentEx.reps}</FMono>
              <FIcon path={ICONS.swap} size={12} color={Color.faint} stroke={1.5} />
            </div>
          )
        )}

        {/* Form cue */}
        {currentEx?.cue && !resting && (
          <div style={{
            ...Type.bodyMd, color: Color.dim, lineHeight: 1.6,
            padding: '10px 14px', borderRadius: Radius.md,
            background: Color.surface, border: `1px solid ${Color.borderSoft}`,
            marginBottom: 20,
          }}>
            {currentEx.cue}
          </div>
        )}

        {/* Set tracker */}
        <FLabel mb={8}>Set {currentSetIdx + 1} of {currentEx?.sets}</FLabel>
        <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
          {Array.from({ length: currentEx?.sets || 0 }).map((_, j) => {
            const done = j < currentLog?.logged.length
            const active = j === currentSetIdx
            const logEntry = currentLog?.logged[j]
            return (
              <div key={j} style={{
                flex: 1, padding: '8px 4px', borderRadius: 6, textAlign: 'center',
                background: done ? `${Color.accent}1a` : active ? Color.accent : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? Color.accent : done ? 'rgba(255,110,80,0.3)' : Color.borderSoft}`,
              }}>
                {done ? (
                  <>
                    <FIcon path={ICONS.check} size={11} color={Color.accent} stroke={2.5} />
                    <FMono size={10} color={Color.mute}>{logEntry?.load || 'BW'}</FMono>
                    {logEntry?.rir != null && (
                      <FMono size={8} color={Color.green}>R{logEntry.rir}</FMono>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ ...Type.dataLg, fontWeight: 600, color: active ? Color.accentText : Color.text }}>
                      {currentEx?.reps}
                    </div>
                    <FMono size={10} color={active ? Color.accentText : Color.mute}>
                      {effectiveLoad > 0 ? `${effectiveLoad}kg` : 'BW'}
                    </FMono>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Cross-session load recommendation banner ── */}
        {!resting && loadRec && loadRec.direction !== 'maintain' && !loadRecDismissed[currentExIdx] && (
          <FSurface style={{
            marginBottom: 16,
            border: `1px solid ${loadRec.direction === 'up' ? `${Color.green}40` : `${Color.amber}40`}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: loadRec.direction === 'up' ? `${Color.green}15` : `${Color.amber}15`,
              display: 'grid', placeItems: 'center',
            }}>
              <FMono size={14} color={loadRec.direction === 'up' ? Color.green : Color.amber}>
                {loadRec.direction === 'up' ? '\u2191' : '\u2193'}
              </FMono>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...Type.bodySm, color: Color.text }}>
                Based on your last 2 sessions, try {loadRec.recommended}kg
              </div>
              <FMono size={10} color={Color.dim}>{loadRec.rationale}</FMono>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <FBtn variant="ghost" size="sm" onClick={() => setLoadRecDismissed(prev => ({ ...prev, [currentExIdx]: true }))} data-stay="true">
                Dismiss
              </FBtn>
              <FBtn variant="primary" size="sm" onClick={() => {
                setLoadOverrides(prev => ({ ...prev, [currentExIdx]: loadRec.recommended }))
                setLoadRecDismissed(prev => ({ ...prev, [currentExIdx]: true }))
              }} data-stay="true">
                Accept
              </FBtn>
            </div>
          </FSurface>
        )}

        {/* ── Intensity input: RPE + RIR side by side ── */}
        {!resting && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <FLabel mb={0}>Intensity</FLabel>
              {rirTarget && (
                <FMono size={10} color={Color.green}>TARGET {rirTarget.label}</FMono>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* RPE row */}
              <div>
                <FMono size={10} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>RPE</FMono>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3 }}>
                  {[5, 6, 7, 8, 9, 10].map(r => (
                    <button key={r} onClick={() => { setRpeInput(r); setRirInput(10 - r) }} style={{
                      padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: rpeInput === r ? Color.accent : Color.surface,
                      color: rpeInput === r ? Color.accentText : Color.text,
                      fontFamily: Font.mono, fontSize: 13, fontWeight: rpeInput === r ? 700 : 400,
                      transition: 'all 0.15s',
                    }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {/* RIR row */}
              <div>
                <FMono size={10} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>REPS IN RESERVE</FMono>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3 }}>
                  {[0, 1, 2, 3, 4, 5].map(r => {
                    const inTarget = rirTarget && r >= rirTarget.min && r <= rirTarget.max
                    return (
                      <button key={r} onClick={() => { setRirInput(r); setRpeInput(10 - r) }} style={{
                        padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                        background: rirInput === r ? Color.green : inTarget ? `${Color.green}12` : Color.surface,
                        color: rirInput === r ? '#0a1a0a' : inTarget ? Color.green : Color.text,
                        fontFamily: Font.mono, fontSize: 13, fontWeight: rirInput === r ? 700 : 400,
                        transition: 'all 0.15s',
                      }}>
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log set button */}
        {!resting && (
          <FBtn variant="primary" full icon={ICONS.check} onClick={handleLogSet} data-stay="true">
            Log set · {currentEx?.reps} reps {effectiveLoad > 0 ? `@ ${effectiveLoad}kg` : ''}
          </FBtn>
        )}

        {/* ── Rest state ── */}
        {resting && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {/* Load adjustment suggestion */}
            {loadSuggestion && loadSuggestion.exIdx === currentExIdx && (
              <FSurface style={{
                border: `1px solid ${loadSuggestion.suggested > loadSuggestion.current ? `${Color.green}40` : `${Color.amber}40`}`,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: loadSuggestion.suggested > loadSuggestion.current ? `${Color.green}15` : `${Color.amber}15`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <FMono size={14} color={loadSuggestion.suggested > loadSuggestion.current ? Color.green : Color.amber}>
                      {loadSuggestion.suggested > loadSuggestion.current ? '↑' : '↓'}
                    </FMono>
                  </div>
                  <div>
                    <div style={{ ...Type.bodySm, color: Color.text }}>
                      {loadSuggestion.suggested > loadSuggestion.current
                        ? 'Room to grow'
                        : 'Dial it back'}
                    </div>
                    <FMono size={10} color={Color.dim}>
                      {loadSuggestion.current}kg → {loadSuggestion.suggested}kg
                    </FMono>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <FBtn variant="ghost" size="sm" onClick={() => setLoadSuggestion(null)} data-stay="true" style={{ flex: 1 }}>
                    Keep {loadSuggestion.current}kg
                  </FBtn>
                  <FBtn variant="primary" size="sm" onClick={() => {
                    setLoadOverrides(prev => ({ ...prev, [currentExIdx]: loadSuggestion.suggested }))
                    setLoadSuggestion(null)
                  }} data-stay="true" style={{ flex: 1 }}>
                    Use {loadSuggestion.suggested}kg
                  </FBtn>
                </div>
              </FSurface>
            )}

            {/* Rest timer */}
            {restRem > 0 && (
              <FSurface style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: Color.accent,
                      animation: 'pulseRing 2s ease infinite',
                    }} />
                    <FLabel mb={0}>Rest</FLabel>
                  </div>
                  <FNum size={28} weight={200}>{formatTime(restRem)}</FNum>
                </div>
                <FTexBar pct={(1 - restRem / (currentEx?.rest || currentEx?._restAfterGroup || 90)) * 100} height={4} />
                {/* Next up: name + form cue + last-time weight */}
                {nextEx && (
                  <div style={{ borderTop: `1px solid ${Color.borderSoft}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FMono size={10} color={Color.mute}>NEXT</FMono>
                      <FMono size={10} color={Color.text} style={{ fontWeight: 500 }}>{nextEx.name}</FMono>
                      {nextEx.load > 0 && <FMono size={10} color={Color.faint}>{nextEx.load}kg</FMono>}
                    </div>
                    {nextEx.cue && (
                      <div style={{ ...Type.bodySm, color: Color.dim, lineHeight: 1.4 }}>{nextEx.cue}</div>
                    )}
                    {lastTimeForNext && (
                      <FMono size={10} color={Color.faint}>Last time: {lastTimeForNext}</FMono>
                    )}
                  </div>
                )}
                <FBtn variant="ghost" size="sm" icon={ICONS.fwd} onClick={handleSkipRest} data-stay="true">Skip rest</FBtn>
              </FSurface>
            )}

            {/* Rest done */}
            {restRem === 0 && (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <FTag tone="green" size="sm">REST COMPLETE</FTag>
                {nextEx && (
                  <div style={{ marginTop: 8 }}>
                    <FMono size={10} color={Color.dim}>Up next: {nextEx.name}</FMono>
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  <FBtn variant="primary" size="md" onClick={() => setResting(false)} data-stay="true">
                    {nextIsSameGroup ? `Next in ${currentEx._groupType}` : 'Next set'}
                  </FBtn>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      {showEndConfirm ? (
        <div style={{ padding: '10px 24px 20px', flexShrink: 0, borderTop: `1px solid ${Color.borderSoft}` }}>
          <FMono size={10} color={Color.mute} style={{ marginBottom: 8, display: 'block' }}>END THIS SESSION?</FMono>
          <div style={{ display: 'flex', gap: 8 }}>
            <FBtn variant="ghost" size="sm" onClick={() => setShowEndConfirm(false)} data-stay="true" style={{ flex: 1 }}>
              Keep going
            </FBtn>
            <FBtn variant="ghost" size="sm" onClick={() => { clearActiveSession(); onBack?.() }} data-stay="true" style={{ flex: 1 }}>
              Discard
            </FBtn>
            <FBtn variant="primary" size="sm" onClick={handleFinish} data-stay="true" style={{ flex: 1 }}>
              Save &amp; end
            </FBtn>
          </div>
        </div>
      ) : (
        <div style={{ padding: '10px 24px 20px', flexShrink: 0, borderTop: `1px solid ${Color.borderSoft}` }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <FBtn variant="ghost" size="sm" onClick={() => setPaused(p => !p)} data-stay="true">
              {paused ? '▶ Resume' : '❚❚ Pause'}
            </FBtn>
            <FBtn variant="ghost" size="sm" onClick={handleSkipExercise} data-stay="true">
              Skip exercise
            </FBtn>
            <div style={{ flex: 1 }} />
            <FBtn variant="split" size="sm" onClick={() => setShowEndConfirm(true)} data-stay="true">
              End
            </FBtn>
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Review Phase — exercise list before starting
   ════════════════════════════════════════════════════════════ */

function ReviewPhase({ exercises, session, onBegin, onBack }) {
  const coreExercises = exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
  const mealTiming = session?.mealTiming || (session?.modality ? deriveMealTiming(session.modality) : null)

  const timingTone = (level) => level === 'Strong' ? 'accent' : level === 'Moderate' ? 'green' : 'mute'

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <FLabel>{session?.modalityLabel || 'STRENGTH'}</FLabel>
        {session?.focus && <FMono color={Color.mute} size={10}>· {session.focus.toUpperCase()}</FMono>}
      </div>
      {/* Goal sources */}
      {session?.goalSources?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 4, marginBottom: 4 }}>
          <FMono size={10} color={Color.mute}>TARGETS:</FMono>
          {session.goalSources.map(g => (
            <FTag key={g} tone="mute" size="sm">{g.replace(/_/g, ' ').toUpperCase()}</FTag>
          ))}
        </div>
      )}
      <div style={{ ...Type.headingLg, marginBottom: 4 }}>{session?.name || 'Workout'}</div>
      <FMono color={Color.mute} size={10}>
        {coreExercises.length} exercises · ~{session?.estimatedMins || 45} min
      </FMono>

      {/* Meal timing indicator */}
      {mealTiming && (
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          <FTag tone={timingTone(mealTiming.pre)}>PRE: {mealTiming.pre.toUpperCase()}</FTag>
          <FTag tone={timingTone(mealTiming.post)}>POST: {mealTiming.post.toUpperCase()}</FTag>
        </div>
      )}

      {/* Exercise list */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column' }}>
        {exercises.map((ex, i) => {
          const isUtil = ex.category === 'warmup' || ex.category === 'cooldown'

          // Grouped exercise (superset or circuit)
          if (ex.groupType) {
            return (
              <div key={i} style={{
                padding: '16px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${Color.borderSoft}`,
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <FTag tone="accent" size="sm">
                    {ex.groupType === 'circuit' ? `CIRCUIT ${ex.label}` : `SUPERSET ${ex.label}`}
                  </FTag>
                  <FMono size={10} color={Color.mute}>
                    {ex.groupType === 'circuit' ? `${ex.rounds} rounds · ` : ''}rest {ex.restAfter}s after
                  </FMono>
                </div>
                <div style={{
                  paddingLeft: 14,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  {ex.items.map((gx, gi) => (
                    <div key={gi} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        border: `1.5px solid ${Color.accent}50`,
                        display: 'grid', placeItems: 'center',
                        fontFamily: Font.mono, fontSize: 10, color: Color.accent,
                      }}>
                        {ex.label}{gi + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...Type.bodyLg, color: Color.text }}>{gx.name}</div>
                        <FMono color={Color.mute} size={10}>
                          {gx.load > 0
                            ? `${gx.sets} × ${gx.reps} @ ${gx.load}KG`
                            : `${gx.sets} × ${gx.reps}`}
                          {gi < ex.items.length - 1 ? ' · NO REST' : ''}
                        </FMono>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Regular exercise
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
                  <FMono color={Color.faint} size={10}>{ex.muscles.join(' · ').toUpperCase()}</FMono>
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

export function SummaryPhase({ loggedSets, elapsed, onDone, session }) {
  const { pushDetail } = useNav()
  const { workoutPlan, activityLog } = useUser()
  const volume = computeSessionVolume(loggedSets)
  const avgRPE = computeAvgRPE(loggedSets)
  const avgRIR = computeAvgRIR(loggedSets)
  const totalSets = loggedSets.reduce((sum, ex) => sum + ex.logged.length, 0)
  const volumeStr = volume.toLocaleString()

  // Next session preview
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const nextSession = workoutPlan?.schedule?.find(s => !s.isRest && s.dayIndex > todayIndex && !s.completed)

  // Volume comparison to last same-type session
  const lastSameSession = (activityLog || [])
    .filter(e => e.type === 'workout' && e.data?.name === session?.name)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  const lastVolume = lastSameSession ? computeSessionVolume(lastSameSession.data?.loggedSets || []) : null
  const volumeDiff = lastVolume != null && lastVolume > 0 ? Math.round(((volume - lastVolume) / lastVolume) * 100) : null

  // Meal timing
  const mealTiming = session?.modality ? deriveMealTiming(session.modality) : null

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

      {/* Stats — inline rows */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '14px 0', marginBottom: 0,
        borderTop: `1px solid ${Color.borderSoft}`,
        borderBottom: `1px solid ${Color.borderSoft}`,
      }}>
        <div>
          <FLabel mb={4}>Volume</FLabel>
          <FNum size={20} weight={300} unit="kg">{volumeStr}</FNum>
        </div>
        <div style={{ textAlign: 'right' }}>
          <FLabel mb={4}>Sets</FLabel>
          <FNum size={20} weight={300}>{totalSets}</FNum>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '14px 0', marginBottom: 28,
      }}>
        <div>
          <FLabel mb={4}>Avg RPE</FLabel>
          <FNum size={20} weight={300} color={Color.accent}>{avgRPE || '—'}</FNum>
        </div>
        <div style={{ textAlign: 'right' }}>
          <FLabel mb={4}>Avg RIR</FLabel>
          <FNum size={20} weight={300} color={Color.green}>{avgRIR != null ? avgRIR : '—'}</FNum>
        </div>
      </div>

      {/* Exercise breakdown — grouped by type (R4) */}
      <FLabel mb={12}>Exercise breakdown</FLabel>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {loggedSets.filter(ex => ex.logged.length > 0).map((ex, i) => {
          const exVolume = ex.logged.reduce((s, set) => s + (set.reps * (set.load || 0)), 0)
          const loads = ex.logged.map(s => s.load || 0).filter(l => l > 0)
          const minLoad = loads.length > 0 ? Math.min(...loads) : 0
          const maxLoad = loads.length > 0 ? Math.max(...loads) : 0
          const wasAdjusted = minLoad !== maxLoad && loads.length > 1
          const loadStr = minLoad === maxLoad
            ? (maxLoad > 0 ? `${maxLoad}kg` : 'BW')
            : `${minLoad} → ${maxLoad}kg`
          const isCompound = i < 2 // first two exercises treated as compounds (bold)
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: isCompound ? '14px 0' : '10px 0',
              borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
              opacity: isCompound ? 1 : 0.85,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: isCompound ? 14 : 13, fontWeight: isCompound ? 500 : 400,
                  color: Color.text,
                }}>{ex.name}</div>
                <div style={{ marginTop: 3 }}>
                  <FMono color={Color.mute} size={10}>
                    {ex.logged.length} × {ex.planned.reps} @{' '}
                  </FMono>
                  <FMono color={wasAdjusted ? Color.accent : Color.mute} size={10}>
                    {loadStr}
                  </FMono>
                </div>
              </div>
              <FMono color={Color.dim} size={11}>{exVolume > 0 ? exVolume.toLocaleString() + ' kg' : '—'}</FMono>
            </div>
          )
        })}
      </div>

      {/* RPE + RIR bar */}
      {(avgRPE > 0 || avgRIR != null) && (
        <FSurface style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FLabel>Intensity</FLabel>
            <div style={{ display: 'flex', gap: 16 }}>
              {avgRPE > 0 && <FMono size={11} color={Color.accent}>RPE {avgRPE}</FMono>}
              {avgRIR != null && <FMono size={11} color={Color.green}>RIR {avgRIR}</FMono>}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <FTexBar pct={avgRPE * 10} height={6} />
          </div>
        </FSurface>
      )}

      {/* ── Forward exit: next session + nutrition bridge ── */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Volume comparison */}
        {volumeDiff != null && (
          <div style={{ padding: '12px 0', borderTop: `1px solid ${Color.borderSoft}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FMono size={10} color={volumeDiff >= 0 ? Color.green : Color.red}>
              {volumeDiff >= 0 ? '↑' : '↓'} {Math.abs(volumeDiff)}% volume
            </FMono>
            <FMono size={10} color={Color.faint}>vs last {session?.name?.split('·')[0]?.trim()}</FMono>
          </div>
        )}

        {/* Next session */}
        {nextSession && (
          <div style={{ padding: '12px 0', borderTop: `1px solid ${Color.borderSoft}` }}>
            <FMono size={10} color={Color.faint} style={{ marginBottom: 4, display: 'block' }}>NEXT SESSION</FMono>
            <FMono size={11} color={Color.dim}>{nextSession.day.toUpperCase()} · {nextSession.name}</FMono>
          </div>
        )}

        {/* Nutrition bridge */}
        {mealTiming?.post === 'Strong' && (
          <div style={{ padding: '12px 0', borderTop: `1px solid ${Color.borderSoft}` }}>
            <FMono size={10} color={Color.green}>Post-workout: prioritize protein + carbs within 2 hours</FMono>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd} onClick={() => pushDetail?.('tdee', 'Expenditure')} data-stay="true">See energy impact</FBtn>
        <FBtn variant="ghost" full icon={ICONS.timer} onClick={() => pushDetail?.('workout-history', 'History')} data-stay="true">
          Workout history
        </FBtn>
        <FBtn variant="ghost" full onClick={onDone} data-stay="true">Done</FBtn>
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
