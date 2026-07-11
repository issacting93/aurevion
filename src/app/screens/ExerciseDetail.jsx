// ════════════════════════════════════════════════════════════
// Exercise Detail — single exercise deep-dive
// R1–R4 compliant: hero icon + muscle bars, weighted sections,
// dot-label goal pills, muted injury text.
// ════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, Phone } from '../../ui/components'
import { GOAL_META } from '../../tools/ontology/ontology-data'
import { EXERCISES, getSwapCandidates, flattenSessionExercises } from './fitness-data'
import { deriveModalities } from '../../context/goalEngine'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'

const MODALITY_CONFIG = {
  hypertrophy: { label: 'Hypertrophy', sets: '3-4', reps: '8-12', rest: '90s' },
  strength:    { label: 'Strength',    sets: '4-5', reps: '3-6',  rest: '180s' },
  hiit:        { label: 'HIIT',        sets: '3-4', reps: '8-15', rest: '30s' },
  cardio:      { label: 'Cardio',      sets: '1',   reps: 'duration', rest: '—' },
  power:       { label: 'Power',       sets: '4-5', reps: '3-5',  rest: '150s' },
  mobility:    { label: 'Mobility',    sets: '2-3', reps: '10',   rest: '30s' },
  endurance:   { label: 'Endurance',   sets: '3-4', reps: '12-20',rest: '45s' },
}

const CATEGORY_COLORS = {
  compound: Color.accent, isolation: Color.blue, core: Color.amber,
  cardio: Color.green, hiit: Color.red, mobility: Color.purple,
}

const CATEGORY_ICONS = {
  compound: ICONS.dumb, isolation: ICONS.dumb, core: ICONS.flame,
  cardio: ICONS.timer, hiit: ICONS.flame, mobility: ICONS.expand,
}

/* Muscle activation % derived from array position */
const MUSCLE_PCT = [90, 55, 35, 20]

const fmt = s => s.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())

export function ExerciseDetailContent({ data }) {
  const exercise = data?.exercise
  if (!exercise) return (
    <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: Radius.lg, background: Color.surface2, display: 'grid', placeItems: 'center' }}>
        <FIcon path={ICONS.dumb} size={22} color={Color.faint} />
      </div>
      <div style={{ ...Type.headingSm, color: Color.dim }}>No exercise selected</div>
      <FMono size={10} color={Color.faint}>Tap an exercise from the browser to view details</FMono>
    </div>
  )

  const catColor = CATEGORY_COLORS[exercise.category] || Color.mute
  const catIcon = CATEGORY_ICONS[exercise.category] || ICONS.dumb

  const ALL_GOAL_KEYS = ['hypertrophy','fat_loss','recomposition','max_strength','cardio_endurance','power','agility','flexibility','balance','overall_wellness']
  const goalKeys = useMemo(() => {
    return ALL_GOAL_KEYS.filter(g => {
      const mods = deriveModalities([g])
      return exercise.modality.some(m => mods.includes(m))
    })
  }, [exercise])

  const modalityConfigs = exercise.modality.map(m => MODALITY_CONFIG[m]).filter(Boolean)

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>

      {/* ── Hero — icon circle + flat label + title + muscle bars ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: catColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FIcon path={catIcon} size={22} color={Color.bg} stroke={1.8} />
          </div>
          <div>
            <div style={{ ...Type.labelSm, color: catColor, marginBottom: 2 }}>{exercise.category.toUpperCase()}</div>
            <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 500, color: Color.text, lineHeight: 1.1 }}>{exercise.name}</div>
          </div>
        </div>
        <div style={{ ...Type.bodyMd, color: Color.dim, marginBottom: 16 }}>
          {fmt(exercise.equipment)} exercise
        </div>

        {/* Muscle activation bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exercise.muscles.map((m, i) => {
            const pct = MUSCLE_PCT[i] || 15
            return (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...Type.bodySm, color: i === 0 ? catColor : Color.dim, width: 46, flexShrink: 0 }}>
                  {fmt(m)}
                </span>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: alpha(Color.text, 0.08) }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: catColor, opacity: i === 0 ? 1 : 0.5 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Prescriptions — flat rows with dividers, large numbers ── */}
      <div style={{ marginBottom: 28 }}>
        {modalityConfigs.map((config, i) => (
          <div key={config.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0',
            borderTop: `1px solid ${Color.borderSoft}`,
          }}>
            <div>
              <div style={{ ...Type.bodyMd, fontWeight: 500, color: Color.text }}>{config.label}</div>
              <div style={{ ...Type.labelSm, color: Color.mute, marginTop: 3 }}>REST {config.rest}</div>
            </div>
            <div style={{ fontFamily: Font.sans, fontSize: 20, fontWeight: 500, color: Color.text }}>
              {config.sets} <span style={{ ...Type.labelSm, color: Color.mute, fontWeight: 400 }}>sets</span>
              {' '}× {config.reps} <span style={{ ...Type.labelSm, color: Color.mute, fontWeight: 400 }}>reps</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Form cue — tinted card ── */}
      <div style={{
        background: alpha(catColor, 0.06), borderRadius: Radius.lg,
        padding: '16px 18px', marginBottom: 28,
      }}>
        <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>FORM CUE</div>
        <div style={{ ...Type.bodyMd, color: Color.text, lineHeight: 1.6 }}>{exercise.cue}</div>
      </div>

      {/* ── Goals — dot + label pills ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 8 }}>USED IN GOALS</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {goalKeys.map(key => {
            const meta = GOAL_META[key]
            if (!meta) return null
            return (
              <span key={key} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontFamily: Font.sans,
                padding: '4px 10px', borderRadius: 999,
                background: alpha(meta.color, 0.10), color: meta.color,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                {meta.label}
              </span>
            )
          })}
        </div>
      </div>

      {/* ── R4-tertiary: Injury cautions — muted plain text ── */}
      {exercise.injury_exclude.length > 0 && (
        <div style={{ marginBottom: data?.fromProgram ? 28 : 0 }}>
          <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 4 }}>INJURY CAUTIONS</div>
          <div style={{ ...Type.bodySm, color: Color.mute, lineHeight: 1.5 }}>
            Avoid heavy loading with active {exercise.injury_exclude.map(i => fmt(i).toLowerCase()).join(' or ')} injuries. Reduce ROM if mobility is limited.
          </div>
        </div>
      )}

      {/* ── Swap section — only when opened from program ── */}
      {data?.fromProgram && <SwapSection exercise={exercise} data={data} />}
    </div>
  )
}

function SwapSection({ exercise, data }) {
  const { swapExercise, workoutPlan, profile } = useUser()
  const { popDetail } = useNav()

  const sessionExercises = useMemo(() => {
    if (!workoutPlan?.schedule || !data.sessionId) return []
    const session = workoutPlan.schedule.find(s => s.id === data.sessionId)
    if (!session?.exercises) return []
    return flattenSessionExercises(session.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown'))
  }, [workoutPlan, data.sessionId])

  const candidates = useMemo(() => {
    if (!profile) return []
    return getSwapCandidates(exercise, sessionExercises, {
      equipment: profile.equipment || 'full_gym',
      injuries: profile.injuries || [],
      goals: profile.goals || [],
    })
  }, [exercise, sessionExercises, profile])

  const handleSwap = (candidate) => {
    swapExercise(data.sessionId, data.exerciseId, candidate.id)
    popDetail()
  }

  if (candidates.length === 0) return null

  return (
    <div>
      <div style={{ borderTop: `1px solid ${Color.borderSoft}`, paddingTop: 20 }}>
        <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 4 }}>SWAP ALTERNATIVES</div>
        <div style={{ ...Type.bodySm, color: Color.faint, marginBottom: 14 }}>Same muscle · your equipment · injury-safe</div>
      </div>
      {candidates.map((c, i) => {
        const cColor = CATEGORY_COLORS[c.category] || Color.mute
        const cIcon = CATEGORY_ICONS[c.category] || ICONS.dumb
        return (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 0',
            borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: Radius.md, flexShrink: 0,
              background: alpha(cColor, 0.10), display: 'grid', placeItems: 'center',
            }}>
              <FIcon path={cIcon} size={14} color={cColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...Type.bodyMd, color: Color.text }}>{c.name}</div>
              <FMono size={10} color={Color.mute} style={{ marginTop: 2 }}>
                {fmt(c.equipment)} · {fmt(c.muscles[0])}
              </FMono>
            </div>
            <FBtn variant="ghost" size="sm" onClick={() => handleSwap(c)} data-stay="true">Select</FBtn>
          </div>
        )
      })}
    </div>
  )
}

export function ExerciseDetailScreen({ goalKey } = {}) {
  const exercise = useMemo(() => {
    if (goalKey) {
      const mods = deriveModalities([goalKey])
      const match = EXERCISES?.find(ex => ex.modality.some(m => mods.includes(m)))
      if (match) return match
    }
    return {
      id: 'back_squat', name: 'Back Squat', category: 'compound',
      muscles: ['quads', 'glutes', 'core'], equipment: 'barbell',
      modality: ['hypertrophy', 'strength'],
      cue: 'Drive through the floor, chest up, knees track toes',
      injury_exclude: ['knees', 'lower_back'],
    }
  }, [goalKey])

  return (
    <Phone label="Exercise Detail" group="TRAINING">
      <FNavBar title={exercise.name} leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <ExerciseDetailContent data={{ exercise }} />
    </Phone>
  )
}
