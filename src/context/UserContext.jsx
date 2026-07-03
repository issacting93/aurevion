import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { computeMacros } from '../app/screens/Onboarding'
import { generateProgram, getProgramPhase } from '../app/screens/fitness-data'

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
  preferences: { layout: 'balanced' },
  onboarded: false,
  checkins: [],
  interventions: [],
  activityLog: [],
  workoutPlan: null,
}

/* ── Behavioral metrics (derived, not stored) ── */

function computeBehavioralMetrics(activityLog) {
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
    protein_hit_ratio_7d: mealDays > 0 ? totalProtein / (mealDays * 140) : 0,
    home_cook_7d: cooks.length,
    water_intake_rate_7d: waters.reduce((sum, w) => sum + (w.data.ml || 0), 0) / 7,
    workouts_7d: workouts.length,
  }
}

export function UserProvider({ children }) {
  const [state, setState] = useState(() => {
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
    return saved
  })

  useEffect(() => { save(state) }, [state])

  const completeOnboarding = useCallback((profile) => {
    const targets = computeMacros(profile)
    const workoutPlan = generateProgram({
      goals: profile.goals || [],
      equipment: profile.equipment || 'full_gym',
      availableDays: profile.availableDays || ['Mon', 'Wed', 'Fri'],
      injuries: profile.injuries || [],
      experience: profile.liftingExp || 'intermediate',
    })
    setState(prev => ({ ...prev, profile, targets, onboarded: true, workoutPlan }))
  }, [])

  const updateProfile = useCallback((updates) => {
    setState(prev => {
      const profile = { ...prev.profile, ...updates }
      const targets = computeMacros(profile)
      return { ...prev, profile, targets }
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
    setState(prev => appendActivity(prev, 'workout', data))
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
      const sessions = prev.workoutPlan.sessions.map(s => ({ ...s, completed: false }))
      const schedule = prev.workoutPlan.schedule.map(s => s.isRest ? s : { ...s, completed: false })
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

  const markSessionComplete = useCallback((dayIndex) => {
    setState(prev => {
      if (!prev.workoutPlan) return prev
      const sessions = prev.workoutPlan.sessions.map(s =>
        s.dayIndex === dayIndex ? { ...s, completed: true } : s
      )
      const schedule = prev.workoutPlan.schedule.map(s =>
        s.dayIndex === dayIndex && !s.isRest ? { ...s, completed: true } : s
      )
      return { ...prev, workoutPlan: { ...prev.workoutPlan, sessions, schedule } }
    })
  }, [])

  /* ── Derived behavioral metrics ── */

  const behavioralMetrics = useMemo(
    () => computeBehavioralMetrics(state.activityLog),
    [state.activityLog]
  )

  return (
    <UserContext.Provider value={{
      ...state,
      behavioralMetrics,
      completeOnboarding,
      updateProfile,
      setLayout,
      resetAll,
      logCheckin,
      addIntervention,
      dismissIntervention,
      logMeal,
      logWater,
      logWorkout,
      logCook,
      regeneratePlan,
      advanceWeek,
      markSessionComplete,
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
    behavioralMetrics: computeBehavioralMetrics([]),
    completeOnboarding() {}, updateProfile() {}, setLayout() {}, resetAll() {},
    logCheckin() {}, addIntervention() {}, dismissIntervention() {},
    logMeal() {}, logWater() {}, logWorkout() {}, logCook() {},
    regeneratePlan() {}, advanceWeek() {}, markSessionComplete() {},
    state: INITIAL,
  }
  return ctx
}
