// ════════════════════════════════════════════════════════════
// Exercise Browser — 3-mode browser: Program / For You / All
// ════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FIcon, FTag, FBtn, FButtonGroup, Phone } from '../../ui/components'
import { EXERCISES, flattenSessionExercises } from './fitness-data'
import { GOAL_META } from '../../tools/ontology/ontology-data'
import { useNav } from '../../context/NavigationContext'
import { useUser } from '../../context/UserContext'
import { deriveModalities } from '../../context/goalEngine'

const CATEGORIES = ['all', 'compound', 'isolation', 'core', 'cardio', 'hiit', 'mobility']
const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c, label: c === 'all' ? 'ALL' : c.toUpperCase() }))

const CATEGORY_COLORS = {
  compound: Color.accent, isolation: Color.blue, core: Color.amber,
  cardio: Color.green, hiit: Color.red, mobility: Color.purple,
}
const CATEGORY_ICONS = {
  compound: ICONS.dumb, isolation: ICONS.dumb, core: ICONS.flame,
  cardio: ICONS.timer, hiit: ICONS.flame, mobility: ICONS.expand,
}

const MODE_OPTIONS = [
  { value: 'program', label: 'PROGRAM' },
  { value: 'foryou', label: 'FOR YOU' },
  { value: 'all', label: 'ALL' },
]

const EQUIP_LEVELS = {
  full_gym: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bands'],
  home_full: ['barbell', 'dumbbell', 'bodyweight', 'bands'],
  home_basic: ['dumbbell', 'bodyweight', 'bands'],
  bands: ['bodyweight', 'bands'],
  bodyweight: ['bodyweight'],
}

/* ── Goal dot-pill ── */
function GoalDot({ goalKey }) {
  const meta = GOAL_META[goalKey]
  if (!meta) return null
  return (
    <span style={{
      display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
      fontFamily: Font.sans, padding: '4px 10px', borderRadius: 999,
      background: alpha(meta.color, 0.10), color: meta.color,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: 999, background: meta.color, flexShrink: 0,
      }} />
      {meta.label}
    </span>
  )
}

/* ── Mode 1: Program ── */
function ProgramMode({ workoutPlan, pushDetail }) {
  if (!workoutPlan) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <FMono size={11} color={Color.mute}>Complete onboarding to see your program</FMono>
      </div>
    )
  }

  const trainingDays = workoutPlan.schedule.filter(d => !d.isRest)

  return (
    <div style={{ padding: '0 20px 40px' }}>
      {trainingDays.map((session) => {
        const flat = flattenSessionExercises(session.exercises || [])
          .filter(ex => ex.category !== 'warmup' && ex.category !== 'cooldown')

        return (
          <div key={session.id} style={{ marginBottom: 24 }}>
            {/* Day header */}
            <div style={{ padding: '16px 0 8px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <FMono size={12} color={Color.text} style={{ fontWeight: 600, letterSpacing: 1 }}>
                {session.day.toUpperCase()}
              </FMono>
              <FMono size={10} color={Color.mute}>{session.name}</FMono>
            </div>

            {/* Exercise rows */}
            {flat.map((ex, i) => {
              const goalSources = session.goalSources || []
              return (
                <div key={`${ex.exerciseId}-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                  borderTop: `1px solid ${Color.borderSoft}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...Type.bodyMd, color: Color.text }}>{ex.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <FMono size={10} color={Color.mute}>
                        {ex.sets} × {ex.reps}
                      </FMono>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {goalSources.map(g => <GoalDot key={g} goalKey={g} />)}
                      </div>
                    </div>
                  </div>
                  <FBtn variant="ghost" size="sm" style={{ flexShrink: 0 }} onClick={(e) => {
                    e.stopPropagation()
                    const full = EXERCISES.find(e2 => e2.id === ex.exerciseId)
                    pushDetail('exercise-detail', ex.name, {
                      exercise: full || ex,
                      fromProgram: true,
                      sessionId: session.id,
                      exerciseId: ex.exerciseId,
                    })
                  }}>Swap</FBtn>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/* ── Mode 2: For You ── */
function ForYouMode({ pushDetail }) {
  const { profile, workoutPlan } = useUser()
  const goals = profile?.goals || []
  const equipment = profile?.equipment || 'bodyweight'
  const injuries = profile?.injuries || []

  const recommended = useMemo(() => {
    const goalMods = deriveModalities(goals)
    const availableEquip = EQUIP_LEVELS[equipment] || EQUIP_LEVELS.bodyweight
    const injurySet = new Set(injuries.map(i => i.toLowerCase().replace(/ /g, '_')))

    // Collect exercise IDs already in program
    const programIds = new Set()
    if (workoutPlan?.sessions) {
      for (const session of workoutPlan.sessions) {
        const flat = flattenSessionExercises(session.exercises || [])
        flat.forEach(ex => { if (ex.exerciseId) programIds.add(ex.exerciseId) })
      }
    }

    return EXERCISES
      .filter(ex => {
        if (programIds.has(ex.id)) return false
        if (!ex.modality.some(m => goalMods.includes(m))) return false
        if (!availableEquip.includes(ex.equipment)) return false
        if (ex.injury_exclude?.some(inj => injurySet.has(inj))) return false
        return true
      })
      .map(ex => {
        const score = ex.modality.filter(m => goalMods.includes(m)).length
        // Figure out which user goals this exercise serves
        const servesGoals = goals.filter(g => {
          const gMods = deriveModalities([g])
          return ex.modality.some(m => gMods.includes(m))
        })
        return { ...ex, _score: score, _servesGoals: servesGoals }
      })
      .sort((a, b) => b._score - a._score)
  }, [goals, equipment, injuries, workoutPlan])

  if (recommended.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <FMono size={11} color={Color.mute}>No recommendations — update your goals or equipment</FMono>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 20px 40px' }}>
      <FMono size={10} color={Color.dim} style={{ display: 'block', padding: '0 0 8px' }}>
        {recommended.length} exercise{recommended.length !== 1 ? 's' : ''} for your goals
      </FMono>
      {recommended.map((ex, i) => (
        <div key={ex.id}
          onClick={() => pushDetail('exercise-detail', ex.name, { exercise: ex })}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
            borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...Type.bodyLg, color: Color.text }}>{ex.name}</div>
            <FMono size={10} color={Color.mute} style={{ marginTop: 2 }}>
              {ex.equipment.toUpperCase()}
            </FMono>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
              {ex._servesGoals.map(g => <GoalDot key={g} goalKey={g} />)}
            </div>
          </div>
          <FIcon path={ICONS.fwd} size={12} color={Color.faint} />
        </div>
      ))}
    </div>
  )
}

/* ── Mode 3: All (full library) ── */
function AllMode({ data, pushDetail }) {
  const { profile } = useUser()
  const goals = profile?.goals || []
  const injuries = profile?.injuries || []
  const [category, setCategory] = useState('all')

  const goalMods = useMemo(() => deriveModalities(goals), [goals])
  const injurySet = useMemo(() => new Set(injuries.map(i => i.toLowerCase().replace(/ /g, '_'))), [injuries])
  const filterGoalKey = data?.goalKey

  const filtered = useMemo(() => {
    let pool = EXERCISES
    if (filterGoalKey) {
      const mods = deriveModalities([filterGoalKey])
      pool = pool.filter(ex => ex.modality.some(m => mods.includes(m)))
    }
    if (category !== 'all') {
      pool = pool.filter(ex => ex.category === category)
    }
    return pool
  }, [category, filterGoalKey])

  return (
    <>
      {/* Filter bar */}
      <div style={{ padding: '12px 20px', flexShrink: 0, borderBottom: `1px solid ${Color.borderSoft}` }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CATEGORY_OPTIONS.map(opt => {
            const active = category === opt.value
            const catColor = CATEGORY_COLORS[opt.value] || Color.accent
            return (
              <button key={opt.value} onClick={() => setCategory(opt.value)} style={{
                padding: '5px 10px', borderRadius: 9999,
                border: `1px solid ${active ? catColor : Color.borderSoft}`,
                background: active ? alpha(catColor, 0.08) : 'transparent',
                color: active ? catColor : Color.mute,
                fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8,
                fontWeight: active ? 600 : 400, cursor: 'pointer',
              }}>{opt.label}</button>
            )
          })}
        </div>
        <FMono size={10} color={Color.dim} style={{ marginTop: 8, display: 'block' }}>
          {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
          {filterGoalKey && ` · filtered for ${filterGoalKey.replace(/_/g, ' ')}`}
        </FMono>
      </div>

      {/* Exercise list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {filtered.map((ex, i) => {
          const catColor = CATEGORY_COLORS[ex.category] || Color.mute
          const catIcon = CATEGORY_ICONS[ex.category] || ICONS.dumb
          const matchesGoal = ex.modality.some(m => goalMods.includes(m))
          const isExcluded = ex.injury_exclude?.some(inj => injurySet.has(inj))
          return (
            <div key={ex.id}
              onClick={() => !isExcluded && pushDetail('exercise-detail', ex.name, { exercise: ex })}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
                cursor: isExcluded ? 'default' : 'pointer',
                opacity: isExcluded ? 0.4 : 1,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: Radius.md, flexShrink: 0,
                background: alpha(catColor, 0.06), display: 'grid', placeItems: 'center',
                position: 'relative',
              }}>
                <FIcon path={catIcon} size={16} color={catColor} />
                {matchesGoal && !isExcluded && (
                  <span style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 8, height: 8, borderRadius: 999,
                    background: Color.green, border: `2px solid ${Color.bg}`,
                  }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...Type.bodyLg, color: Color.text }}>{ex.name}</div>
                <FMono size={10} color={Color.mute} style={{ marginTop: 2 }}>
                  {ex.equipment.toUpperCase()}
                </FMono>
              </div>
              {isExcluded ? (
                <FTag tone="mute" size="sm" style={{ flexShrink: 0 }}>EXCLUDED</FTag>
              ) : (
                <FTag tone="mute" size="sm" style={{ flexShrink: 0 }}>
                  {ex.category.toUpperCase()}
                </FTag>
              )}
              <FIcon path={ICONS.fwd} size={12} color={Color.faint} />
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── Main content ── */

export function ExerciseBrowserContent({ data }) {
  const { pushDetail } = useNav()
  const { workoutPlan } = useUser()
  const [mode, setMode] = useState(data?.initialMode || (data?.goalKey ? 'all' : 'program'))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Mode switcher */}
      <div style={{ padding: '12px 20px', flexShrink: 0 }}>
        <FButtonGroup options={MODE_OPTIONS} value={mode} onChange={setMode} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
        {mode === 'program' && <ProgramMode workoutPlan={workoutPlan} pushDetail={pushDetail} />}
        {mode === 'foryou' && <ForYouMode pushDetail={pushDetail} />}
        {mode === 'all' && <AllMode data={data} pushDetail={pushDetail} />}
      </div>
    </div>
  )
}

export function ExerciseBrowserScreen({ goalKey } = {}) {
  return (
    <Phone label="Exercise Browser" group="TRAINING">
      <FNavBar title="Exercises" leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} trailing={<FIcon path={ICONS.search} size={20} color={Color.text} />} />
      <ExerciseBrowserContent data={goalKey ? { goalKey } : undefined} />
    </Phone>
  )
}
