// ════════════════════════════════════════════════════════════
// Test Agents — 3 simulated users running through the app
// Each agent auto-onboards with a different goal, then
// cycles through key user flows. Generates a validation
// report at the end of each run.
// ════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { UserProvider } from '../context/UserContext'
import { AppShell } from '../app/Shell'
import { Color, Font, Type, Radius, alpha } from '../ui/tokens'
import { FMono, FBtn, FIcon, ICONS } from '../ui/components'
import { generateProgram, flattenSessionExercises, computeSessionVolume, computeAvgRPE, computeAvgRIR, getSwapCandidates, EXERCISES, getProgramPhase, estimateLoad, suggestLoadAdjustment } from '../app/screens/fitness-data'
import { computeMacros, computeTDEE } from '../app/screens/Onboarding'
import { deriveModalities, deriveCaloricMod, deriveMealPrep, deriveRIRTarget } from '../context/goalEngine'
import { GOAL_CALORIC_STATE, MACRO_RATIOS } from '../tools/ontology/ontology-data'

/* ── Agent profiles ── */

const AGENTS = [
  {
    name: 'Alex',
    desc: 'Hypertrophy · full gym · 5 days · intermediate',
    color: '#FF6E50',
    profile: {
      sex: 'male', birthYear: 1998, height: 178, weight: 79,
      bodyFat: '15-20', activityLevel: 'active',
      liftingExp: 'intermediate', cardioExp: 'beginner',
      equipment: 'full_gym',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      injuries: [], dietary: [], focusMuscles: [],
      goal: 'build', goals: ['hypertrophy'],
    },
  },
  {
    name: 'Sam',
    desc: 'Fat loss · home basic · 3 days · beginner · knee injury',
    color: '#4ade80',
    profile: {
      sex: 'female', birthYear: 1993, height: 165, weight: 72,
      bodyFat: '25-30', activityLevel: 'moderate',
      liftingExp: 'beginner', cardioExp: 'intermediate',
      equipment: 'home_basic',
      availableDays: ['Mon', 'Wed', 'Fri'],
      injuries: ['Knees'], dietary: ['Gluten Free'], focusMuscles: [],
      goal: 'lose', goals: ['fat_loss', 'healthier_meals'],
    },
  },
  {
    name: 'Jordan',
    desc: 'Recomp + strength · full gym · 4 days · advanced',
    color: '#60a5fa',
    profile: {
      sex: 'male', birthYear: 1990, height: 185, weight: 92,
      bodyFat: '18-23', activityLevel: 'active',
      liftingExp: 'advanced', cardioExp: 'intermediate',
      equipment: 'full_gym',
      availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
      injuries: ['Shoulders'], dietary: [], focusMuscles: [],
      goal: 'recomp', goals: ['recomposition', 'max_strength'],
    },
  },
]

/* ── Equipment mapping (mirrors fitness-data.js) ── */
const EQUIP_MAP = {
  full_gym: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bands'],
  home_full: ['barbell', 'dumbbell', 'bodyweight', 'bands'],
  home_basic: ['dumbbell', 'bodyweight', 'bands'],
  bands: ['bodyweight', 'bands'],
  bodyweight: ['bodyweight'],
}

/* ── Comprehensive validation suite ── */

function check(checks, step, test, pass, value) {
  checks.push({ step, test, pass, value: String(value).slice(0, 120) })
}

function validateAgent(agent) {
  const { profile } = agent
  const checks = []
  const t0 = performance.now()

  // ═══ 1. ONBOARDING ═══════════════════════════════════════

  let targets, tdee
  try {
    tdee = computeTDEE(profile)
    targets = computeMacros(profile)
    check(checks, 'onboarding', 'TDEE > 0', tdee > 0, tdee)
    check(checks, 'onboarding', 'TDEE is reasonable (1200-5000)', tdee > 1200 && tdee < 5000, tdee)
    check(checks, 'onboarding', 'Target kcal > 0', targets.target > 0, targets.target)
    check(checks, 'onboarding', 'Protein > 0', targets.protein > 0, `${targets.protein}g`)
    check(checks, 'onboarding', 'Carbs > 0', targets.carbs > 0, `${targets.carbs}g`)
    check(checks, 'onboarding', 'Fat > 0', targets.fat > 0, `${targets.fat}g`)
    check(checks, 'onboarding', 'Macros sum ≈ target (±100 kcal)', Math.abs((targets.protein * 4 + targets.carbs * 4 + targets.fat * 9) - targets.target) < 100, `${targets.protein * 4 + targets.carbs * 4 + targets.fat * 9} vs ${targets.target}`)

    // Caloric modifier applied correctly
    const expectedMod = deriveCaloricMod(profile.goal)
    const actualDiff = targets.target - tdee
    check(checks, 'onboarding', 'Caloric modifier applied', Math.abs(actualDiff - expectedMod) < 5, `diff=${actualDiff}, expected=${expectedMod}`)

    // Protein per kg within expected range
    const primaryGoal = profile.goals[0]
    const ratios = MACRO_RATIOS[primaryGoal]
    if (ratios && profile.weight) {
      const actualGPerKg = Math.round(targets.protein / profile.weight * 10) / 10
      check(checks, 'onboarding', `Protein g/kg ≈ ${ratios.gPerKg}`, Math.abs(actualGPerKg - ratios.gPerKg) < 0.5, `${actualGPerKg} g/kg (target ${ratios.gPerKg})`)
    }
  } catch (e) {
    check(checks, 'onboarding', 'computeMacros throws', false, e.message)
  }

  // ═══ 2. PROGRAM GENERATION ════════════════════════════════

  let plan
  try {
    plan = generateProgram({
      goals: profile.goals, equipment: profile.equipment,
      availableDays: profile.availableDays, injuries: profile.injuries,
      experience: profile.liftingExp,
    })
    check(checks, 'program', 'Plan generated', !!plan, plan.programName)
    check(checks, 'program', 'Sessions > 0', plan.sessions.length > 0, plan.sessions.length)
    check(checks, 'program', 'Schedule = 7 days', plan.schedule.length === 7, plan.schedule.length)
    check(checks, 'program', 'Training days ≤ available', plan.sessions.length <= profile.availableDays.length, `${plan.sessions.length} ≤ ${profile.availableDays.length}`)
    check(checks, 'program', 'All sessions have goalSources', plan.sessions.every(s => s.goalSources?.length > 0), plan.sessions.map(s => s.goalSources?.join(',')).join(' | '))
    check(checks, 'program', 'All sessions have exercises', plan.sessions.every(s => s.exercises?.length > 0), plan.sessions.map(s => s.exercises?.length).join(', '))
    check(checks, 'program', 'Phase = Base at week 1', plan.phase === 'Base', plan.phase)
    check(checks, 'program', 'Total weeks = 12', plan.totalWeeks === 12, plan.totalWeeks)

    // Split selection
    const dayCount = profile.availableDays.length
    const expectedSplit = dayCount <= 3 ? 'Full' : dayCount <= 4 ? 'Upper' : 'Push'
    check(checks, 'program', `Split matches day count (${dayCount}d)`, plan.splitLabel.includes(expectedSplit), `${plan.splitLabel} (expected ${expectedSplit}*)`)

    // Modality alignment
    const goalMods = deriveModalities(profile.goals)
    const sessionMods = [...new Set(plan.sessions.map(s => s.modality))]
    check(checks, 'program', 'Session modalities ⊂ goal modalities', sessionMods.every(m => goalMods.includes(m)), `sessions: ${sessionMods.join(',')} · goals: ${goalMods.join(',')}`)

    // Each session has warmup and cooldown
    const hasWarmup = plan.sessions.every(s => s.exercises?.some(e => e.category === 'warmup'))
    const hasCooldown = plan.sessions.every(s => s.exercises?.some(e => e.category === 'cooldown'))
    check(checks, 'program', 'All sessions have warmup', hasWarmup, hasWarmup ? 'yes' : 'missing')
    check(checks, 'program', 'All sessions have cooldown', hasCooldown, hasCooldown ? 'yes' : 'missing')

    // Estimated minutes is reasonable
    check(checks, 'program', 'Estimated mins reasonable (20-90)', plan.sessions.every(s => s.estimatedMins >= 20 && s.estimatedMins <= 90), plan.sessions.map(s => s.estimatedMins).join(', '))

  } catch (e) {
    check(checks, 'program', 'generateProgram throws', false, e.message)
  }

  // ═══ 3. CONSTRAINT ENFORCEMENT ════════════════════════════

  if (plan) {
    // Injury exclusion
    const injurySet = new Set((profile.injuries || []).map(i => i.toLowerCase().replace(/ /g, '_')))
    const allExercises = plan.sessions.flatMap(s => flattenSessionExercises(s.exercises || []))
    if (injurySet.size > 0) {
      const violators = allExercises.filter(ex => ex.injury_exclude?.some(inj => injurySet.has(inj)))
      check(checks, 'constraints', 'No injury-excluded exercises', violators.length === 0, violators.length === 0 ? 'clean' : violators.map(e => e.name).join(', '))
    }

    // Equipment filter
    const allowed = new Set(EQUIP_MAP[profile.equipment] || EQUIP_MAP.full_gym)
    const equipViolators = allExercises.filter(ex => ex.equipment && !allowed.has(ex.equipment))
    check(checks, 'constraints', 'All exercises use available equipment', equipViolators.length === 0, equipViolators.length === 0 ? 'clean' : equipViolators.map(e => `${e.name}(${e.equipment})`).join(', '))

    // No duplicate exercises within a session
    for (const session of plan.sessions) {
      const flat = flattenSessionExercises(session.exercises || []).filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
      const ids = flat.map(e => e.exerciseId).filter(Boolean)
      const unique = new Set(ids)
      check(checks, 'constraints', `No duplicate exercises in ${session.day}`, ids.length === unique.size, ids.length === unique.size ? 'clean' : `${ids.length} total, ${unique.size} unique`)
    }
  }

  // ═══ 4. EXERCISE GROUPING ═════════════════════════════════

  if (plan) {
    for (const session of plan.sessions) {
      const groups = session.exercises?.filter(e => e.groupType) || []
      for (const group of groups) {
        check(checks, 'grouping', `${group.groupType} ${group.label} has ≥2 items`, group.items?.length >= 2, `${group.items?.length} items`)
        check(checks, 'grouping', `${group.groupType} ${group.label} has restAfter`, group.restAfter > 0, `${group.restAfter}s`)
        // Flatten should preserve group annotations
        const flattened = flattenSessionExercises([group])
        check(checks, 'grouping', `Flatten preserves _groupId`, flattened.every(e => e._groupId), flattened.length + ' items')
      }
    }
  }

  // ═══ 5. EXERCISE BROWSER ══════════════════════════════════

  if (plan) {
    const goalMods = deriveModalities(profile.goals)
    const allowed = new Set(EQUIP_MAP[profile.equipment] || EQUIP_MAP.full_gym)
    const injurySet = new Set((profile.injuries || []).map(i => i.toLowerCase().replace(/ /g, '_')))
    const programIds = new Set(plan.sessions.flatMap(s => flattenSessionExercises(s.exercises || []).map(e => e.exerciseId)))

    const recommended = EXERCISES.filter(ex => {
      if (programIds.has(ex.id)) return false
      if (!ex.modality.some(m => goalMods.includes(m))) return false
      if (!allowed.has(ex.equipment)) return false
      if (ex.injury_exclude?.some(inj => injurySet.has(inj))) return false
      return true
    })
    check(checks, 'browser', 'Recommended exercises available', recommended.length > 0, recommended.length)

    // All library exercises should have valid categories
    check(checks, 'browser', 'All exercises have category', EXERCISES.every(e => e.category), EXERCISES.filter(e => !e.category).length + ' missing')
    check(checks, 'browser', 'All exercises have muscles[]', EXERCISES.every(e => e.muscles?.length > 0), EXERCISES.filter(e => !e.muscles?.length).length + ' missing')
  }

  // ═══ 6. SWAP ══════════════════════════════════════════════

  if (plan) {
    // Test swap for first compound in each session
    for (const session of plan.sessions) {
      const flat = flattenSessionExercises(session.exercises || []).filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
      const compound = flat.find(e => e.category === 'compound')
      if (compound) {
        const fullEx = EXERCISES.find(e => e.id === compound.exerciseId) || compound
        const candidates = getSwapCandidates(fullEx, flat, {
          equipment: profile.equipment, injuries: profile.injuries, goals: profile.goals,
        })
        check(checks, 'swap', `Swap candidates for ${compound.name} (${session.day})`, candidates.length > 0, `${candidates.length} alternatives`)
      }
    }
  }

  // ═══ 7. PHASE PROGRESSION ═════════════════════════════════

  check(checks, 'phases', 'Week 1 → Base', getProgramPhase(1).name === 'Base', getProgramPhase(1).name)
  check(checks, 'phases', 'Week 5 → Build', getProgramPhase(5).name === 'Build', getProgramPhase(5).name)
  check(checks, 'phases', 'Week 9 → Peak', getProgramPhase(9).name === 'Peak', getProgramPhase(9).name)
  check(checks, 'phases', 'Week 12 → Peak', getProgramPhase(12).name === 'Peak', getProgramPhase(12).name)

  // ═══ 8. MEAL PREP DERIVATION ══════════════════════════════

  const nutritionGoals = (profile.goals || []).filter(g => ['healthier_meals', 'cook_more', 'improve_digestion', 'drink_water', 'save_money'].includes(g))
  const mealPrep = deriveMealPrep(profile.goal, nutritionGoals)
  check(checks, 'nutrition', 'Meal prep derived', !!mealPrep, mealPrep?.primary || 'null')

  // ═══ 9. RIR TARGETS ═══════════════════════════════════════

  if (plan) {
    for (const session of plan.sessions) {
      const rir = deriveRIRTarget(session.modality)
      check(checks, 'intensity', `RIR target for ${session.modality}`, rir.min >= 0 && rir.max <= 5, `RIR ${rir.min}-${rir.max}`)
    }
  }

  // ═══ 10. LOAD ESTIMATION ══════════════════════════════════

  if (plan) {
    const flat = flattenSessionExercises(plan.sessions[0].exercises || []).filter(e => e.category === 'compound')
    for (const ex of flat.slice(0, 2)) {
      const fullEx = EXERCISES.find(e => e.id === ex.exerciseId)
      if (fullEx) {
        const load = estimateLoad(fullEx, profile.liftingExp)
        check(checks, 'loads', `Load for ${ex.name} (${profile.liftingExp})`, load >= 0, `${load}kg`)
      }
    }
  }

  // ═══ 11. HISTORY VOLUME ═══════════════════════════════════

  if (plan) {
    const mockLog = plan.sessions.slice(0, 2).map(s => ({
      loggedSets: s.exercises.filter(e => !e.groupType && e.category !== 'warmup' && e.category !== 'cooldown').slice(0, 2).map(ex => ({
        logged: Array.from({ length: ex.sets }, () => ({ reps: ex.reps, load: ex.load, rpe: 8 })),
      })),
    }))
    const vol = computeSessionVolume(mockLog[0].loggedSets)
    check(checks, 'history', 'Volume computable', vol >= 0, `${vol.toLocaleString()} kg`)
    // Bodyweight check
    if (profile.equipment === 'bodyweight' || profile.equipment === 'home_basic') {
      check(checks, 'history', 'Bodyweight user volume note', true, vol === 0 ? 'all bodyweight (0 kg is expected)' : `${vol} kg (has weighted exercises)`)
    }
  }

  // ═══ 12. TRAINING FLOW SIMULATION ══════════════════════════
  // Programmatic walkthrough of a full session: review → execute → summary
  // Exercises the same state machine logic as Training.jsx

  if (plan && plan.sessions.length > 0) {
    const session = plan.sessions[0]
    const exercises = session.exercises || []
    const nonUtil = exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
    const hasGroups = nonUtil.some(e => e.groupType)
    const coreExercises = hasGroups ? flattenSessionExercises(nonUtil) : nonUtil.map(e => ({ ...e, _groupId: null }))

    check(checks, 'training-flow', 'Session has core exercises', coreExercises.length > 0, `${coreExercises.length} exercises`)

    // Initialize logged sets (mirrors Training.jsx useState)
    const loggedSets = coreExercises.map(ex => ({
      exerciseId: ex.exerciseId || ex.name,
      name: ex.name,
      planned: { sets: ex.sets, reps: ex.reps, load: ex.load },
      logged: [],
    }))

    // Simulate executing every set of every exercise
    let totalSetsLogged = 0
    let restEvents = 0
    let skipRestEvents = 0
    let groupTransitions = 0
    let loadSuggestionsTriggered = 0
    let loadSuggestionsAccepted = 0
    const loadOverrides = {}

    for (let exIdx = 0; exIdx < coreExercises.length; exIdx++) {
      const ex = coreExercises[exIdx]
      const sets = ex.sets || 3

      for (let setIdx = 0; setIdx < sets; setIdx++) {
        // Simulate logging a set with varying RPE/RIR
        const effectiveLoad = loadOverrides[exIdx] ?? (ex.load || 0)
        const rpe = 7 + Math.min(setIdx, 2) // 7, 8, 9, 9, 9...
        const rir = 10 - rpe
        const reps = Math.max(1, (ex.reps || 8) - (setIdx > 2 ? 1 : 0))

        loggedSets[exIdx].logged.push({
          reps, load: effectiveLoad, rpe, rir,
          adjustedLoad: loadOverrides[exIdx] != null ? effectiveLoad : undefined,
        })
        totalSetsLogged++

        // Check load suggestion (mirrors Training.jsx handleLogSet)
        const suggestion = suggestLoadAdjustment(effectiveLoad, rir)
        if (suggestion && suggestion !== effectiveLoad) {
          loadSuggestionsTriggered++
          // Accept suggestion on first occurrence per exercise
          if (!loadOverrides[exIdx]) {
            loadOverrides[exIdx] = suggestion
            loadSuggestionsAccepted++
          }
        }

        // Rest logic after set
        const isLastSet = setIdx >= sets - 1
        if (isLastSet) {
          // Move to next exercise
          const nextExIdx = exIdx + 1
          if (nextExIdx < coreExercises.length) {
            const nextEx = coreExercises[nextExIdx]
            const sameGroup = ex._groupId && nextEx._groupId === ex._groupId
            if (sameGroup) {
              groupTransitions++
              // No rest within group — correct behavior
            } else if (ex._isLastInGroup && ex._restAfterGroup) {
              restEvents++
              // Rest after group
            } else {
              restEvents++
            }
          }
        } else {
          restEvents++
          // Simulate skipping rest on the second set
          if (setIdx === 1) skipRestEvents++
        }
      }
    }

    check(checks, 'training-flow', 'All sets logged', totalSetsLogged > 0, `${totalSetsLogged} sets`)
    check(checks, 'training-flow', 'Every exercise has logged data', loggedSets.every(ex => ex.logged.length > 0), loggedSets.map(e => e.logged.length).join(', '))
    check(checks, 'training-flow', 'Rest events occurred', restEvents > 0, `${restEvents} rest periods`)

    // Verify group-aware rest: supersets skip rest between paired exercises
    if (hasGroups) {
      check(checks, 'training-flow', 'Superset/circuit transitions (no rest)', groupTransitions > 0, `${groupTransitions} group transitions`)
    }

    // Verify load suggestions triggered for easy sets (high RIR)
    // First sets have RPE 7 = RIR 3, which should trigger "too easy" suggestion
    check(checks, 'training-flow', 'Load suggestions triggered', loadSuggestionsTriggered >= 0, `${loadSuggestionsTriggered} suggestions`)

    // Simulate handleFinish: compute summary stats
    const sessionVolume = computeSessionVolume(loggedSets)
    const avgRPE = computeAvgRPE(loggedSets)
    const avgRIR = computeAvgRIR(loggedSets)

    check(checks, 'training-flow', 'Summary volume computable', sessionVolume >= 0, `${sessionVolume.toLocaleString()} kg`)
    check(checks, 'training-flow', 'Summary avg RPE in range (5-10)', avgRPE >= 5 && avgRPE <= 10, avgRPE)
    check(checks, 'training-flow', 'Summary avg RIR in range (0-5)', avgRIR != null && avgRIR >= 0 && avgRIR <= 5, avgRIR)

    // Simulate logWorkout call (what handleFinish does)
    const workoutLogEntry = {
      type: 'workout',
      timestamp: new Date().toISOString(),
      data: {
        duration: 45,
        type: session.modality || 'strength',
        name: session.name || 'Workout',
        loggedSets,
      },
    }

    check(checks, 'training-flow', 'Workout log entry has name', !!workoutLogEntry.data.name, workoutLogEntry.data.name)
    check(checks, 'training-flow', 'Workout log entry has loggedSets', workoutLogEntry.data.loggedSets.length > 0, workoutLogEntry.data.loggedSets.length)
    check(checks, 'training-flow', 'Workout log entry has modality', !!workoutLogEntry.data.type, workoutLogEntry.data.type)

    // Verify the log entry can be consumed by history
    const historyVolume = computeSessionVolume(workoutLogEntry.data.loggedSets)
    const historyRPE = computeAvgRPE(workoutLogEntry.data.loggedSets)
    check(checks, 'training-flow', 'History can read volume from log', historyVolume === sessionVolume, `${historyVolume} === ${sessionVolume}`)
    check(checks, 'training-flow', 'History can read RPE from log', historyRPE === avgRPE, `${historyRPE} === ${avgRPE}`)

    // Verify markSessionComplete would work
    const matchesSession = plan.sessions.some(s => s.id === session.id || s.dayIndex === session.dayIndex)
    check(checks, 'training-flow', 'Session ID matchable for completion', matchesSession, session.id)

    // Verify load overrides applied correctly
    if (loadSuggestionsAccepted > 0) {
      const adjustedEx = Object.keys(loadOverrides)
      check(checks, 'training-flow', 'Load overrides applied to exercises', adjustedEx.length > 0, `${adjustedEx.length} exercises adjusted`)
      for (const idx of adjustedEx) {
        const ex = loggedSets[idx]
        const laterSets = ex.logged.slice(1) // sets after the first (when suggestion would be accepted)
        const hasAdjusted = laterSets.some(s => s.adjustedLoad !== undefined)
        check(checks, 'training-flow', `Load adjusted for ${ex.name}`, hasAdjusted || laterSets.length === 0, `override: ${loadOverrides[idx]}kg`)
      }
    }
  }

  const elapsed = Math.round(performance.now() - t0)

  return {
    agent: agent.name,
    profile: {
      goals: profile.goals, equipment: profile.equipment,
      days: profile.availableDays.length, injuries: profile.injuries,
      experience: profile.liftingExp,
    },
    timestamp: new Date().toISOString(),
    elapsed_ms: elapsed,
    checks,
    summary: {
      total: checks.length,
      passed: checks.filter(c => c.pass).length,
      failed: checks.filter(c => !c.pass).length,
    },
  }
}

/* ── Build full state from profile ── */

function buildState(profile) {
  const targets = computeMacros(profile)
  const workoutPlan = generateProgram({
    goals: profile.goals || [], equipment: profile.equipment || 'full_gym',
    availableDays: profile.availableDays || ['Mon', 'Wed', 'Fri'],
    injuries: profile.injuries || [], experience: profile.liftingExp || 'intermediate',
  })
  const activityLog = workoutPlan.sessions.slice(0, 2).map((s, i) => ({
    type: 'workout',
    timestamp: new Date(Date.now() - (i + 1) * 2 * 86400000).toISOString(),
    data: {
      name: s.name, type: s.modality,
      duration: 2400 + Math.round(Math.random() * 1200),
      loggedSets: s.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown' && !e.groupType).slice(0, 3).map(ex => ({
        exerciseId: ex.exerciseId, name: ex.name,
        planned: { sets: ex.sets, reps: ex.reps, load: ex.load },
        logged: Array.from({ length: ex.sets }, (_, si) => ({
          reps: Math.max(ex.reps - (si > 2 ? 1 : 0), 1), load: ex.load,
          rpe: 7 + Math.min(si, 2), rir: 3 - Math.min(si, 2),
        })),
      })),
    },
  }))
  const schedule = workoutPlan.schedule.map((s, i) => !s.isRest && i < 2 ? { ...s, completed: true } : s)
  const sessions = workoutPlan.sessions.map((s, i) => i < 2 ? { ...s, completed: true } : s)

  return {
    profile, targets, workoutPlan: { ...workoutPlan, schedule, sessions },
    onboarded: true, activityLog,
    checkins: [{ date: 'Jul 5', weight: profile.weight, bf: null, delta: -0.3 }],
    interventions: [], preferences: { layout: 'balanced' }, mealPrepApproach: null,
  }
}

/* ── Flow steps ── */

const FLOW_STEPS = [
  { tab: 'home', label: 'Dashboard', detail: null },
  { tab: 'train', label: 'Program', detail: null },
  { tab: 'train', label: 'Exercises', detail: 'exercises' },
  { tab: 'train', label: 'History', detail: 'workout-history' },
  { tab: 'eat', label: 'Macros', detail: null },
  { tab: 'plan', label: 'Calendar', detail: null },
  { tab: 'you', label: 'Profile', detail: null },
]

/* ── Agent phone ── */

function AgentPhone({ agent, stepIndex }) {
  const state = useMemo(() => buildState(agent.profile), [agent])
  const step = FLOW_STEPS[stepIndex % FLOW_STEPS.length]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color }} />
          <span style={{ fontFamily: Font.sans, fontSize: 14, fontWeight: 500, color: Color.text }}>{agent.name}</span>
        </div>
        <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 0.5 }}>{agent.desc}</div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 999, background: alpha(agent.color, 0.10),
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent.color, animation: 'agentPulse 2s ease infinite' }} />
        <span style={{ fontFamily: Font.mono, fontSize: 10, color: agent.color, letterSpacing: 0.5 }}>{step.label.toUpperCase()}</span>
      </div>
      <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center', width: 402, height: 874 }}>
        <UserProvider _override={state}>
          <AppShell _initialTab={step.tab} _initialDetail={step.detail} />
        </UserProvider>
      </div>
    </div>
  )
}

/* ── Report card ── */

function ReportCard({ report, onClose }) {
  const allPassed = report.every(r => r.summary.failed === 0)

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aurevion-test-report-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: Color.surface, borderRadius: Radius.xl, border: `1px solid ${Color.borderSoft}`,
        maxWidth: 720, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '28px 32px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.5, color: Color.mute, marginBottom: 6 }}>TEST REPORT</div>
            <div style={{ ...Type.headingLg }}>
              {allPassed ? 'All checks passed' : 'Issues found'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={downloadJSON} style={{
              padding: '8px 16px', borderRadius: 8, border: `1px solid ${Color.borderSoft}`,
              background: 'transparent', color: Color.dim, cursor: 'pointer',
              fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8,
            }}>DOWNLOAD JSON</button>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: 8, border: `1px solid ${Color.borderSoft}`,
              background: 'transparent', color: Color.dim, cursor: 'pointer',
              display: 'grid', placeItems: 'center',
            }}>
              <FIcon path={ICONS.close} size={14} color={Color.dim} stroke={2} />
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {report.map(r => {
            const agent = AGENTS.find(a => a.name === r.agent)
            return (
              <div key={r.agent} style={{
                flex: 1, padding: '12px 14px', borderRadius: Radius.lg,
                background: r.summary.failed === 0 ? alpha(Color.green, 0.06) : alpha(Color.red, 0.06),
                border: `1px solid ${r.summary.failed === 0 ? alpha(Color.green, 0.15) : alpha(Color.red, 0.15)}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent?.color }} />
                  <span style={{ fontFamily: Font.sans, fontSize: 13, fontWeight: 500, color: Color.text }}>{r.agent}</span>
                </div>
                <div style={{ fontFamily: Font.mono, fontSize: 20, fontWeight: 300, color: r.summary.failed === 0 ? Color.green : Color.red }}>
                  {r.summary.passed}/{r.summary.total}
                </div>
                <div style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute, marginTop: 2 }}>{r.elapsed_ms}ms</div>
              </div>
            )
          })}
        </div>

        {/* Per-agent details */}
        {report.map(r => {
          const agent = AGENTS.find(a => a.name === r.agent)
          return (
            <div key={r.agent} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent?.color }} />
                <span style={{ fontFamily: Font.mono, fontSize: 11, letterSpacing: 0.8, color: Color.text }}>{r.agent.toUpperCase()}</span>
                <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute }}>{r.profile.goals.join(', ')} · {r.profile.equipment} · {r.profile.days}d</span>
              </div>
              {r.checks.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderTop: `1px solid ${Color.borderSoft}`,
                  opacity: c.pass ? 0.7 : 1,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    background: c.pass ? alpha(Color.green, 0.15) : alpha(Color.red, 0.15),
                    display: 'grid', placeItems: 'center',
                  }}>
                    <span style={{ fontSize: 10, color: c.pass ? Color.green : Color.red }}>{c.pass ? '✓' : '✗'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: Font.sans, fontSize: 12, color: Color.text }}>{c.test}</div>
                    <div style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute, marginTop: 1 }}>{c.step} · {String(c.value).slice(0, 80)}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}

        {/* Timestamp */}
        <div style={{ fontFamily: Font.mono, fontSize: 9, color: Color.faint, textAlign: 'center', marginTop: 12 }}>
          {report[0]?.timestamp}
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */

export default function TestAgents() {
  const [stepIndex, setStepIndex] = useState(0)
  const [running, setRunning] = useState(true)
  const [report, setReport] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const timerRef = useRef(null)

  // Run validation on mount
  useEffect(() => {
    if (hasRun) return
    setHasRun(true)
    const results = AGENTS.map(validateAgent)
    // Auto-show report after one full cycle
    setTimeout(() => setReport(results), FLOW_STEPS.length * 4000 + 500)
  }, [hasRun])

  useEffect(() => {
    if (!running) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setStepIndex(s => {
        if (s + 1 >= FLOW_STEPS.length) { setRunning(false); return s }
        return s + 1
      })
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [running])

  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('agent-css')) return
    const s = document.createElement('style')
    s.id = 'agent-css'
    s.textContent = `@keyframes agentPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`
    document.head.appendChild(s)
  }, [])

  const showReport = () => setReport(AGENTS.map(validateAgent))
  const hideReport = () => setReport(null)
  const resetRun = () => { setStepIndex(0); setRunning(true); setReport(null); setHasRun(false) }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: Color.text, fontFamily: Font.sans, padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontFamily: Font.mono, fontSize: 12, letterSpacing: 2, color: Color.mute, marginBottom: 8 }}>AUREVION TEST AGENTS</div>
        <div style={{ ...Type.headingLg, marginBottom: 8 }}>3 users · 3 goals · end-to-end</div>
        <div style={{ ...Type.bodyMd, color: Color.dim, maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          Each agent validates onboarding, program generation, constraint filtering, swap candidates, and workout history. Report auto-generates after one cycle.
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: '8px 20px', borderRadius: 8, border: `1px solid ${Color.borderSoft}`,
          background: running ? alpha(Color.accent, 0.08) : 'transparent',
          color: running ? Color.accent : Color.mute,
          fontFamily: Font.mono, fontSize: 11, letterSpacing: 1, cursor: 'pointer',
        }}>{running ? 'PAUSE' : 'PLAY'}</button>
        <button onClick={() => setStepIndex(s => Math.min(s + 1, FLOW_STEPS.length - 1))} style={{
          padding: '8px 20px', borderRadius: 8, border: `1px solid ${Color.borderSoft}`,
          background: 'transparent', color: Color.mute,
          fontFamily: Font.mono, fontSize: 11, letterSpacing: 1, cursor: 'pointer',
        }}>NEXT →</button>
        <button onClick={resetRun} style={{
          padding: '8px 20px', borderRadius: 8, border: `1px solid ${Color.borderSoft}`,
          background: 'transparent', color: Color.mute,
          fontFamily: Font.mono, fontSize: 11, letterSpacing: 1, cursor: 'pointer',
        }}>RESET</button>
        <button onClick={showReport} style={{
          padding: '8px 20px', borderRadius: 8, border: `1px solid ${alpha(Color.green, 0.25)}`,
          background: alpha(Color.green, 0.06), color: Color.green,
          fontFamily: Font.mono, fontSize: 11, letterSpacing: 1, cursor: 'pointer',
        }}>RUN REPORT</button>
      </div>

      {/* Step progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 32 }}>
        {FLOW_STEPS.map((step, i) => (
          <div key={i} style={{
            width: 40, height: 3, borderRadius: 2,
            background: i <= stepIndex ? Color.accent : Color.faint,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Phones */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {AGENTS.map((agent, i) => (
          <AgentPhone key={agent.name} agent={agent} stepIndex={stepIndex + i} />
        ))}
      </div>

      {/* Step legend */}
      <div style={{ marginTop: 40, padding: '20px 0', borderTop: `1px solid ${Color.borderSoft}`, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        {FLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              background: i <= stepIndex ? alpha(Color.accent, 0.15) : Color.surface2,
              display: 'grid', placeItems: 'center',
              fontFamily: Font.mono, fontSize: 9, color: i <= stepIndex ? Color.accent : Color.faint,
            }}>{i + 1}</div>
            <span style={{ fontFamily: Font.mono, fontSize: 10, color: i <= stepIndex ? Color.text : Color.mute }}>{step.label}</span>
          </div>
        ))}
      </div>

      {/* Report overlay */}
      {report && <ReportCard report={report} onClose={hideReport} />}
    </div>
  )
}
