import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { computeMacros } from '../app/screens/Onboarding'
import { generateProgram, getProgramPhase, estimateLoad, getExerciseById } from '../app/screens/fitness-data'
import { generateMealPlan } from '../app/screens/nutrition-data'
import { MOCK_PROFILE, MOCK_TARGETS, MOCK_CHECKINS, MOCK_WORKOUT_PLAN, MOCK_ACTIVITY_LOG } from './mockUser'
import { deriveMealPrep, isNutritionGoal } from './goalEngine'
import { PERSONAS } from './personas'

const STORAGE_KEY = 'aurevion'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

const UserContext = createContext(null)

const INITIAL = {
  profile: null,
  targets: null,
  mealPlan: null,
  pantry: {},
  mealPrepApproach: null,
  preferences: { layout: 'balanced' },
  onboarded: false,
  checkins: [],
  interventions: [],
  activityLog: [],
  workoutPlan: null,
  activeSession: null,
  exerciseHistory: {},
}

/* ── Behavioral metrics (derived, not stored) ── */

function computeBehavioralMetrics(activityLog, targets) {
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const recent = (activityLog || []).filter(e => new Date(e.timestamp).getTime() > sevenDaysAgo)

  const meals = recent.filter(e => e.type === 'meal')
  const waters = recent.filter(e => e.type === 'water')
  const workouts = recent.filter(e => e.type === 'workout')
  const cooks = recent.filter(e => e.type === 'cook')

  const mealDays = new Set(meals.map(m => m.timestamp.slice(0, 10))).size
  const totalProtein = meals.reduce((sum, m) => sum + (m.data.protein || 0), 0)

  return {
    adherence: mealDays / 7,
    protein_hit_ratio_7d: mealDays > 0 ? totalProtein / (mealDays * (targets?.protein || 140)) : 0,
    home_cook_7d: cooks.length,
    water_intake_rate_7d: waters.reduce((sum, w) => sum + (w.data.ml || 0), 0) / 7,
    workouts_7d: workouts.length,
  }
}

export function UserProvider({ children, _override }) {
  const [state, setState] = useState(() => {
    if (_override) return _override
    const saved = load() || INITIAL
    // Auto-generate workout plan for existing users who onboarded before this feature
    if (saved.onboarded && saved.profile && !saved.workoutPlan) {
      saved.workoutPlan = generateProgram({
        goals: saved.profile.goals || [],
        equipment: saved.profile.equipment || 'full_gym',
        availableDays: saved.profile.availableDays || ['Mon', 'Wed', 'Fri'],
        injuries: saved.profile.injuries || [],
        experience: saved.profile.liftingExp || 'intermediate',
      })
    }
    // Auto-generate meal plan for existing users who onboarded before this feature
    if (saved.onboarded && saved.targets && !saved.mealPlan) {
      saved.mealPlan = generateMealPlan({
        targets: saved.targets,
        dietary: saved.profile?.dietary || [],
        schedule: saved.workoutPlan?.schedule || [],
      })
    }
    return saved
  })

  // Re-seed when override changes (journey profile switching)
  useEffect(() => {
    if (_override) setState(_override)
  }, [_override])

  useEffect(() => { if (!_override) save(state) }, [state, _override])

  const completeOnboarding = useCallback((profile) => {
    const targets = computeMacros(profile)
    const workoutPlan = generateProgram({
      goals: profile.goals || [],
      equipment: profile.equipment || 'full_gym',
      availableDays: profile.availableDays || ['Mon', 'Wed', 'Fri'],
      injuries: profile.injuries || [],
      experience: profile.liftingExp || 'intermediate',
    })
    const mealPlan = generateMealPlan({
      targets,
      dietary: profile.dietary || [],
      schedule: workoutPlan.schedule,
    })
    const nutritionGoals = (profile.goals || []).filter(isNutritionGoal)
    const mealPrepApproach = deriveMealPrep(profile.goal, nutritionGoals)
    setState(prev => ({ ...prev, profile, targets, mealPrepApproach, onboarded: true, workoutPlan, mealPlan }))
  }, [])

  const updateProfile = useCallback((updates) => {
    setState(prev => {
      const profile = { ...prev.profile, ...updates }
      const targets = computeMacros(profile)
      const nutritionGoals = (profile.goals || []).filter(isNutritionGoal)
      const mealPrepApproach = deriveMealPrep(profile.goal, nutritionGoals)
      return { ...prev, profile, targets, mealPrepApproach }
    })
  }, [])

  const setLayout = useCallback((layout) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, layout },
    }))
  }, [])

  const resetAll = useCallback(() => {
    setState(INITIAL)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const loadPersona = useCallback((personaId) => {
    const persona = PERSONAS.find(p => p.id === personaId)
    if (!persona) return
    const profile = persona.profile
    const targets = computeMacros(profile)
    const workoutPlan = generateProgram({
      goals: profile.goals || [],
      equipment: profile.equipment || 'full_gym',
      availableDays: profile.availableDays || ['Mon', 'Wed', 'Fri'],
      injuries: profile.injuries || [],
      experience: profile.liftingExp || 'intermediate',
    })
    const mealPlan = generateMealPlan({
      targets,
      dietary: profile.dietary || [],
      schedule: workoutPlan.schedule,
    })
    const nutritionGoals = (profile.goals || []).filter(isNutritionGoal)
    const mealPrepApproach = deriveMealPrep(profile.goal, nutritionGoals)
    setState({
      ...INITIAL,
      profile,
      targets,
      workoutPlan,
      mealPlan,
      mealPrepApproach,
      onboarded: true,
      checkins: persona.checkins || [],
    })
  }, [])

  /* ── Check-ins ── */

  const logCheckin = useCallback((entry) => {
    setState(prev => {
      const checkins = [entry, ...(prev.checkins || [])].slice(0, 52)
      const profile = { ...prev.profile, weight: entry.weight }
      const targets = computeMacros(profile)
      return { ...prev, profile, targets, checkins }
    })
  }, [])

  /* ── Interventions ── */

  const addIntervention = useCallback((intervention) => {
    setState(prev => ({
      ...prev,
      interventions: [
        { ...intervention, id: intervention.id || Date.now(), dismissed: false },
        ...(prev.interventions || []),
      ],
    }))
  }, [])

  const dismissIntervention = useCallback((id) => {
    setState(prev => ({
      ...prev,
      interventions: (prev.interventions || []).map(i =>
        i.id === id ? { ...i, dismissed: true } : i
      ),
    }))
  }, [])

  /* ── Activity logging ── */

  const appendActivity = (prev, type, data) => ({
    ...prev,
    activityLog: [
      ...(prev.activityLog || []),
      { type, timestamp: new Date().toISOString(), data },
    ].slice(-500),
  })

  const logMeal = useCallback((data) => {
    setState(prev => appendActivity(prev, 'meal', data))
  }, [])

  const logWater = useCallback((ml) => {
    setState(prev => appendActivity(prev, 'water', { ml }))
  }, [])

  const logWorkout = useCallback((data) => {
    setState(prev => {
      const next = appendActivity(prev, 'workout', data)
      // Update per-exercise history for cross-session load progression
      const exerciseHistory = { ...(next.exerciseHistory || {}) }
      if (data.loggedSets) {
        for (const ex of data.loggedSets) {
          const id = ex.exerciseId
          if (!exerciseHistory[id]) exerciseHistory[id] = []
          const avgLoad = ex.logged.reduce((s, set) => s + (set.load || 0), 0) / (ex.logged.length || 1)
          const avgRpe = ex.logged.reduce((s, set) => s + (set.rpe || 0), 0) / (ex.logged.length || 1)
          const rirSets = ex.logged.filter(s => s.rir != null)
          const avgRir = rirSets.reduce((s, set) => s + set.rir, 0) / (rirSets.length || 1)
          exerciseHistory[id].push({
            date: new Date().toISOString().slice(0, 10),
            load: Math.round(avgLoad * 10) / 10,
            reps: ex.planned?.reps || ex.logged[0]?.reps || 0,
            rpe: Math.round(avgRpe * 10) / 10,
            rir: Math.round(avgRir * 10) / 10,
          })
          // Keep last 20 entries per exercise
          if (exerciseHistory[id].length > 20) exerciseHistory[id] = exerciseHistory[id].slice(-20)
        }
      }
      return { ...next, exerciseHistory }
    })
  }, [])

  const logCook = useCallback((data) => {
    setState(prev => appendActivity(prev, 'cook', data))
  }, [])

  const regeneratePlan = useCallback(() => {
    setState(prev => {
      if (!prev.profile) return prev
      const workoutPlan = generateProgram({
        goals: prev.profile.goals || [],
        equipment: prev.profile.equipment || 'full_gym',
        availableDays: prev.profile.availableDays || ['Mon', 'Wed', 'Fri'],
        injuries: prev.profile.injuries || [],
        experience: prev.profile.liftingExp || 'intermediate',
      })
      return { ...prev, workoutPlan }
    })
  }, [])

  const advanceWeek = useCallback(() => {
    setState(prev => {
      if (!prev.workoutPlan) return prev
      const nextWeek = Math.min((prev.workoutPlan.currentWeek || 1) + 1, prev.workoutPlan.totalWeeks || 12)
      const sessions = prev.workoutPlan.sessions.map(s => ({
        ...s, completed: false,
        exercises: s.exercises?.map(ex => ({ ...ex })),
      }))
      const schedule = prev.workoutPlan.schedule.map(s => s.isRest ? s : {
        ...s, completed: false,
        exercises: s.exercises?.map(ex => ({ ...ex })),
      })
      return {
        ...prev,
        workoutPlan: {
          ...prev.workoutPlan,
          sessions,
          schedule,
          currentWeek: nextWeek,
          phase: getProgramPhase(nextWeek).name,
        },
      }
    })
  }, [])

  const markSessionComplete = useCallback((sessionIdOrDayIndex) => {
    setState(prev => {
      if (!prev.workoutPlan) return prev
      // Match by session.id first, fall back to dayIndex for backward compat
      const matchSession = (s) =>
        (s.id && s.id === sessionIdOrDayIndex) || s.dayIndex === sessionIdOrDayIndex
      const sessions = prev.workoutPlan.sessions.map(s =>
        matchSession(s) ? { ...s, completed: true } : s
      )
      const schedule = prev.workoutPlan.schedule.map(s =>
        matchSession(s) && !s.isRest ? { ...s, completed: true } : s
      )
      return { ...prev, workoutPlan: { ...prev.workoutPlan, sessions, schedule } }
    })
  }, [])

  /* ── Active session persistence ── */

  const saveActiveSession = useCallback((sessionData) => {
    setState(prev => ({ ...prev, activeSession: sessionData }))
  }, [])

  const clearActiveSession = useCallback(() => {
    setState(prev => ({ ...prev, activeSession: null }))
  }, [])

  /* ── Meal plan ── */

  const regenerateMealPlan = useCallback(() => {
    setState(prev => {
      if (!prev.targets) return prev
      const mealPlan = generateMealPlan({
        targets: prev.targets,
        dietary: prev.profile?.dietary || [],
        schedule: prev.workoutPlan?.schedule || [],
      })
      return { ...prev, mealPlan }
    })
  }, [])

  const updatePantry = useCallback((itemName, qty) => {
    setState(prev => ({ ...prev, pantry: { ...prev.pantry, [itemName]: { have: qty, unit: 'g' } } }))
  }, [])

  /* ── Exercise swap ── */

  const swapExercise = useCallback((sessionId, oldExerciseId, newExerciseId) => {
    setState(prev => {
      if (!prev.workoutPlan) return prev
      const newEx = getExerciseById(newExerciseId)
      if (!newEx) return prev
      const experience = prev.profile?.liftingExp || 'intermediate'

      const replaceInList = (exercises) => exercises.map(ex => {
        if (ex.groupType && ex.items) {
          return { ...ex, items: ex.items.map(item =>
            item.exerciseId === oldExerciseId
              ? { ...item, exerciseId: newEx.id, name: newEx.name, category: newEx.category, muscles: newEx.muscles, cue: newEx.cue, load: estimateLoad(newEx, experience) }
              : item
          )}
        }
        return ex.exerciseId === oldExerciseId
          ? { ...ex, exerciseId: newEx.id, name: newEx.name, category: newEx.category, muscles: newEx.muscles, cue: newEx.cue, load: estimateLoad(newEx, experience) }
          : ex
      })

      const schedule = prev.workoutPlan.schedule.map(s =>
        s.id === sessionId && s.exercises ? { ...s, exercises: replaceInList(s.exercises) } : s
      )
      const sessions = prev.workoutPlan.sessions.map(s =>
        s.id === sessionId && s.exercises ? { ...s, exercises: replaceInList(s.exercises) } : s
      )
      return { ...prev, workoutPlan: { ...prev.workoutPlan, sessions, schedule } }
    })
  }, [])

  const getCompletedWorkouts = useCallback(() => {
    return (state.activityLog || [])
      .filter(e => e.type === 'workout')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [state.activityLog])

  /* ── Derived behavioral metrics ── */

  const behavioralMetrics = useMemo(
    () => computeBehavioralMetrics(state.activityLog, state.targets),
    [state.activityLog, state.targets]
  )

  return (
    <UserContext.Provider value={{
      ...state,
      behavioralMetrics,
      completeOnboarding,
      updateProfile,
      setLayout,
      resetAll,
      loadPersona,
      logCheckin,
      addIntervention,
      dismissIntervention,
      logMeal,
      logWater,
      logWorkout,
      logCook,
      regeneratePlan,
      regenerateMealPlan,
      updatePantry,
      advanceWeek,
      markSessionComplete,
      swapExercise,
      getCompletedWorkouts,
      saveActiveSession,
      clearActiveSession,
      state,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) return {
    ...INITIAL,
    profile: MOCK_PROFILE,
    targets: MOCK_TARGETS,
    checkins: MOCK_CHECKINS,
    workoutPlan: MOCK_WORKOUT_PLAN,
    activityLog: MOCK_ACTIVITY_LOG,
    behavioralMetrics: computeBehavioralMetrics(MOCK_ACTIVITY_LOG, MOCK_TARGETS),
    completeOnboarding() {}, updateProfile() {}, setLayout() {}, resetAll() {},
    logCheckin() {}, addIntervention() {}, dismissIntervention() {},
    logMeal() {}, logWater() {}, logWorkout() {}, logCook() {},
    regeneratePlan() {}, regenerateMealPlan() {}, updatePantry() {},
    advanceWeek() {}, markSessionComplete() {},
    swapExercise() {}, getCompletedWorkouts() {
      return MOCK_ACTIVITY_LOG.filter(e => e.type === 'workout').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },
    saveActiveSession() {}, clearActiveSession() {},
    state: INITIAL,
  }
  return ctx
}
