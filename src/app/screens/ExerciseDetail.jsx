// ════════════════════════════════════════════════════════════
// Exercise Detail — single exercise deep-dive
// Form cues, muscles, equipment, injury exclusions, goals.
// ════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FIcon, FTag, FListRow, Phone } from '../../ui/components'
import { GOAL_META } from '../../tools/ontology/ontology-data'
import { EXERCISES } from './fitness-data'

const GOAL_MODALITIES = {
  hypertrophy: ['hypertrophy'], fat_loss: ['hiit', 'strength', 'cardio'],
  recomposition: ['hypertrophy', 'hiit'], max_strength: ['strength', 'power'],
  cardio_endurance: ['cardio', 'endurance'], power: ['power', 'strength'],
  agility: ['hiit', 'power'], flexibility: ['mobility'],
  balance: ['mobility', 'endurance'], overall_wellness: ['cardio', 'mobility', 'hypertrophy'],
}

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

  const goalKeys = useMemo(() => {
    return Object.entries(GOAL_MODALITIES)
      .filter(([, mods]) => exercise.modality.some(m => mods.includes(m)))
      .map(([key]) => key)
  }, [exercise])

  const modalityConfigs = exercise.modality.map(m => MODALITY_CONFIG[m]).filter(Boolean)

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{ width: 44, height: 44, borderRadius: Radius.lg, background: `${catColor}15`, display: 'grid', placeItems: 'center' }}>
          <FIcon path={ICONS.dumb} size={22} color={catColor} />
        </div>
        <div>
          <div style={{ ...Type.headingLg }}>{exercise.name}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <FTag tone="mute" size="sm">{exercise.category.toUpperCase()}</FTag>
            <FTag tone="mute" size="sm">{exercise.equipment.toUpperCase()}</FTag>
          </div>
        </div>
      </div>

      {/* Muscles */}
      <div style={{ marginTop: 24 }}>
        <FLabel size={9} mb={10}>MUSCLES</FLabel>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {exercise.muscles.map((m, i) => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: i === 0 ? catColor : Color.dim }} />
              <span style={{ ...Type.bodyMd, color: i === 0 ? Color.text : Color.dim, textTransform: 'capitalize' }}>{m.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form cue */}
      <FSurface style={{ marginTop: 20 }}>
        <FLabel size={9} mb={8}>FORM CUE</FLabel>
        <div style={{ ...Type.bodyMd, color: Color.text, lineHeight: 1.6 }}>{exercise.cue}</div>
      </FSurface>

      {/* Injury cautions */}
      {exercise.injury_exclude.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <FLabel size={9} mb={10}>INJURY CAUTIONS</FLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {exercise.injury_exclude.map(inj => (
              <FTag key={inj} tone="red" size="sm">{inj.replace(/_/g, ' ').toUpperCase()}</FTag>
            ))}
          </div>
          <FMono size={9} color={Color.dim} style={{ marginTop: 6, display: 'block' }}>
            This exercise is excluded from programs when these injuries are selected.
          </FMono>
        </div>
      )}

      {/* Used in goals */}
      <div style={{ marginTop: 20 }}>
        <FLabel size={9} mb={10}>USED IN GOALS</FLabel>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {goalKeys.map(key => {
            const meta = GOAL_META[key]
            return meta ? (
              <span key={key} style={{
                padding: '4px 10px', borderRadius: 9999,
                background: `${meta.color}12`, color: meta.color,
                fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8, fontWeight: 500,
              }}>{meta.label}</span>
            ) : null
          })}
        </div>
      </div>

      {/* Modality prescriptions */}
      <div style={{ marginTop: 20 }}>
        <FLabel size={9} mb={10}>MODALITY PRESCRIPTIONS</FLabel>
        {modalityConfigs.map(config => (
          <FListRow key={config.label}
            title={config.label}
            subtitle={`${config.sets} sets × ${config.reps} reps · ${config.rest} rest`}
            divider
          />
        ))}
      </div>
    </div>
  )
}

export function ExerciseDetailScreen({ goalKey } = {}) {
  const exercise = useMemo(() => {
    if (goalKey) {
      const mods = GOAL_MODALITIES[goalKey] || []
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
