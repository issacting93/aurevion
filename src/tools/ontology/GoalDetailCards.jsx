/* GoalDetailCards — Select a goal, see the full cascade:
   training modalities → caloric state → macros → meal prep → workout template → exercise pool → body profile fit */

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FLabel, FMono, FNum, FIcon, FTag, FTexBar } from '../../ui/components'
import { EXERCISES } from '../../app/screens/fitness-data'
import { NODES, EDGES, CATEGORIES, getConnectedNodeIds, getConnectedEdges } from '../../tools/goal-network/goal-network-data'
import { MACRO_RATIOS, GOAL_CALORIC_STATE, CALORIC_PREP, WORKOUT_TEMPLATES, BODY_FAT_RANGES, SOMATOTYPES, TRAINING_MEAL_IMPORTANCE, GOAL_META } from './ontology-data'

// Modality config (from fitness-data.js)
const MODALITY_CONFIG = {
  hypertrophy: { label: 'Hypertrophy', sets: '3-4', reps: '8-12', rest: '90s', mins: 50 },
  strength:    { label: 'Strength',    sets: '4-5', reps: '3-6',  rest: '180s', mins: 55 },
  hiit:        { label: 'HIIT',        sets: '3-4', reps: '8-15', rest: '30s',  mins: 30 },
  cardio:      { label: 'Cardio',      sets: '1',   reps: 'duration', rest: '—', mins: 35 },
  power:       { label: 'Power',       sets: '4-5', reps: '3-5',  rest: '150s', mins: 45 },
  mobility:    { label: 'Mobility',    sets: '2-3', reps: '10',   rest: '30s',  mins: 20 },
  endurance:   { label: 'Endurance',   sets: '3-4', reps: '12-20',rest: '45s',  mins: 40 },
}

const GOAL_MODALITIES = {
  hypertrophy: ['hypertrophy'], fat_loss: ['hiit', 'strength', 'cardio'],
  recomposition: ['hypertrophy', 'hiit'], max_strength: ['strength', 'power'],
  cardio_endurance: ['cardio', 'endurance'], power: ['power', 'strength'],
  agility: ['hiit', 'power'], flexibility: ['mobility'],
  balance: ['mobility', 'endurance'], overall_wellness: ['cardio', 'mobility', 'hypertrophy'],
}

const MACRO_COLORS = { protein: Color.accent, carbs: Color.blue, fat: Color.amber }

const FITNESS_GOALS = Object.entries(GOAL_META)
const GOAL_IDS = FITNESS_GOALS.map(([k]) => k)

export default function GoalDetailCards() {
  const [selectedGoal, setSelectedGoal] = useState('hypertrophy')

  const meta = GOAL_META[selectedGoal]
  const node = NODES.find(n => n.id === selectedGoal)
  const caloric = GOAL_CALORIC_STATE[selectedGoal]
  const macros = MACRO_RATIOS[selectedGoal]
  const mealPrep = caloric ? CALORIC_PREP[caloric.state] : null
  const template = WORKOUT_TEMPLATES[selectedGoal]
  const modalities = GOAL_MODALITIES[selectedGoal] || []

  // Get connected training modalities from goal network edges
  const connectedEdges = useMemo(() => {
    return getConnectedEdges(selectedGoal).filter(e => {
      const otherId = e.from === selectedGoal ? e.to : e.from
      const other = NODES.find(n => n.id === otherId)
      return other?.category === 'training'
    })
  }, [selectedGoal])

  // Exercise pool
  const exercisePool = useMemo(() => {
    return EXERCISES.filter(ex => ex.modality.some(m => modalities.includes(m)))
  }, [selectedGoal])

  // Body profile fit
  const suitableBodies = useMemo(() => {
    return BODY_FAT_RANGES.filter(r => r.goals.includes(selectedGoal))
  }, [selectedGoal])

  const suitableSomatotypes = useMemo(() => {
    return Object.entries(SOMATOTYPES).filter(([, s]) => s.bestGoals.includes(selectedGoal))
  }, [selectedGoal])

  // Meal timing importance for this goal's modalities
  const mealTimingEntries = useMemo(() => {
    return modalities.map(mod => {
      const key = mod === 'hypertrophy' ? 'lifting_hyp' : mod === 'strength' ? 'lifting_str' : mod === 'cardio' ? 'zone2_cardio' : mod
      return { modality: MODALITY_CONFIG[mod]?.label || mod, ...TRAINING_MEAL_IMPORTANCE[key] }
    }).filter(e => e.pre || e.post)
  }, [selectedGoal])

  return (
    <div>
      {/* Goal selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
        {FITNESS_GOALS.map(([key, m]) => {
          const active = key === selectedGoal
          return (
            <button key={key} onClick={() => setSelectedGoal(key)} style={{
              padding: '8px 16px', borderRadius: Radius.lg,
              border: `1.5px solid ${active ? m.color : Color.borderSoft}`,
              background: active ? `${m.color}12` : Color.surface,
              color: active ? m.color : Color.dim,
              fontFamily: Font.sans, fontSize: 13, fontWeight: active ? 500 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {m.label}
            </button>
          )
        })}
      </div>

      {/* Cascade */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 1. Header */}
        <FSurface style={{ borderColor: `${meta.color}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: Radius.lg, background: `${meta.color}15`, display: 'grid', placeItems: 'center' }}>
              <FIcon path={node?.icon || ICONS.goal} size={22} color={meta.color} />
            </div>
            <div>
              <div style={{ ...Type.headingLg }}>{meta.label}</div>
              <FMono size={10} color={Color.mute}>{meta.group.toUpperCase()}</FMono>
            </div>
          </div>
          <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.6 }}>{node?.sub}</div>
        </FSurface>

        {/* 2. Training modalities */}
        <FSurface>
          <FLabel size={9} mb={12} letter={1.2}>TRAINING MODALITIES</FLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {connectedEdges.map(edge => {
              const otherId = edge.from === selectedGoal ? edge.to : edge.from
              const other = NODES.find(n => n.id === otherId)
              const modKey = modalities.find(m => otherId.includes(m)) || modalities[0]
              const config = MODALITY_CONFIG[modKey]
              return (
                <div key={otherId} style={{
                  padding: '12px 14px', borderRadius: Radius.md,
                  background: Color.surface2, border: `1px solid ${Color.borderSoft}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ ...Type.headingSm }}>{other?.label}</span>
                    <FTag tone={edge.strength === 'strong' ? 'accent' : 'mute'} size="sm">
                      {edge.strength.toUpperCase()}
                    </FTag>
                  </div>
                  <FMono size={9} color={Color.mute}>{other?.sub}</FMono>
                  {config && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <FMono size={8} color={Color.faint}>{config.sets} sets</FMono>
                      <FMono size={8} color={Color.faint}>{config.reps} reps</FMono>
                      <FMono size={8} color={Color.faint}>{config.rest} rest</FMono>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </FSurface>

        {/* 3. Caloric state + 4. Macros side by side */}
        <div style={{ display: 'flex', gap: 12 }}>
          <FSurface style={{ flex: 1 }}>
            <FLabel size={9} mb={8} letter={1.2}>CALORIC STATE</FLabel>
            <div style={{ ...Type.headingMd, marginBottom: 4 }}>{caloric?.state}</div>
            <FMono color={caloric?.modifier >= 0 ? Color.green : caloric?.modifier < 0 ? Color.red : Color.dim} size={14}>
              {caloric?.modifier >= 0 ? '+' : ''}{caloric?.modifier} kcal
            </FMono>
            <FMono size={9} color={Color.mute} style={{ marginTop: 6 }}>{caloric?.label}</FMono>
          </FSurface>

          <FSurface style={{ flex: 1 }}>
            <FLabel size={9} mb={8} letter={1.2}>MACRO SPLIT</FLabel>
            {macros && (
              <>
                <div style={{ display: 'flex', height: 16, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${(macros.protein[0] + macros.protein[1]) / 2}%`, background: MACRO_COLORS.protein }} />
                  <div style={{ width: `${(macros.carbs[0] + macros.carbs[1]) / 2}%`, background: MACRO_COLORS.carbs }} />
                  <div style={{ width: `${(macros.fat[0] + macros.fat[1]) / 2}%`, background: MACRO_COLORS.fat }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <FMono size={9} color={MACRO_COLORS.protein}>P {macros.protein[0]}-{macros.protein[1]}%</FMono>
                  <FMono size={9} color={MACRO_COLORS.carbs}>C {macros.carbs[0]}-{macros.carbs[1]}%</FMono>
                  <FMono size={9} color={MACRO_COLORS.fat}>F {macros.fat[0]}-{macros.fat[1]}%</FMono>
                </div>
                <FMono size={9} color={Color.mute} style={{ marginTop: 6 }}>PROTEIN: {macros.gPerKg}g/kg LBM · {macros.notes}</FMono>
              </>
            )}
          </FSurface>
        </div>

        {/* 5. Meal prep approach */}
        {mealPrep && (
          <FSurface>
            <FLabel size={9} mb={10} letter={1.2}>MEAL PREP APPROACH</FLabel>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <div>
                <FMono size={8} color={Color.faint}>PRIMARY</FMono>
                <div style={{ ...Type.headingSm, color: Color.green, marginTop: 2 }}>{mealPrep.primary}</div>
              </div>
              <div>
                <FMono size={8} color={Color.faint}>SUPPORTING</FMono>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  {mealPrep.supporting.map(s => <FTag key={s} tone="mute" size="sm">{s}</FTag>)}
                </div>
              </div>
            </div>
            <FMono size={9} color={Color.dim}>{mealPrep.timing}</FMono>
          </FSurface>
        )}

        {/* 5b. Meal timing importance */}
        {mealTimingEntries.length > 0 && (
          <FSurface>
            <FLabel size={9} mb={10} letter={1.2}>MEAL TIMING BY MODALITY</FLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {mealTimingEntries.map(e => (
                <div key={e.modality} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${Color.borderSoft}` }}>
                  <FMono size={9} color={Color.text} style={{ width: 100 }}>{e.modality}</FMono>
                  <FTag tone={e.pre === 'Strong' ? 'accent' : 'mute'} size="sm">PRE: {e.pre}</FTag>
                  <FTag tone={e.post === 'Strong' ? 'accent' : 'mute'} size="sm">POST: {e.post}</FTag>
                  <FMono size={8} color={Color.faint} style={{ flex: 1 }}>{e.note}</FMono>
                </div>
              ))}
            </div>
          </FSurface>
        )}

        {/* 6. Workout template */}
        {template && (
          <FSurface>
            <FLabel size={9} mb={10} letter={1.2}>WORKOUT TEMPLATE</FLabel>
            <div style={{ ...Type.headingSm, marginBottom: 4 }}>{template.label}</div>
            <div style={{ ...Type.bodySm, color: Color.dim, marginBottom: 12 }}>{template.objective}</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <FMono size={9} color={Color.accent}>{template.frequency}</FMono>
              <FMono size={9} color={Color.mute}>{template.split}</FMono>
              <FMono size={9} color={Color.mute}>{template.repRange}</FMono>
            </div>
            <FMono size={9} color={Color.blue}>{template.protocol}</FMono>

            {template.sampleSession.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <FLabel size={8} mb={8} letter={1}>SAMPLE SESSION</FLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {template.sampleSession.map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                      borderRadius: Radius.sm, background: Color.surface2,
                    }}>
                      <FMono size={9} color={Color.text} style={{ flex: 2 }}>{row.exercise}</FMono>
                      <FMono size={8} color={Color.accent} style={{ flex: 1 }}>{row.sets}</FMono>
                      <FMono size={8} color={Color.mute} style={{ flex: 1 }}>{row.rest}</FMono>
                      <FMono size={8} color={Color.dim} style={{ flex: 2 }}>{row.focus}</FMono>
                      {row.injuryAlt && <FMono size={7} color={Color.faint} style={{ flex: 2 }}>ALT: {row.injuryAlt}</FMono>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FSurface>
        )}

        {/* 7. Exercise pool */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>EXERCISE POOL ({exercisePool.length})</FLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
            {exercisePool.slice(0, 20).map(ex => (
              <div key={ex.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                borderRadius: Radius.sm, background: Color.surface2,
              }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: meta.color, flexShrink: 0 }} />
                <FMono size={9} color={Color.text}>{ex.name}</FMono>
                <FMono size={7} color={Color.faint} style={{ marginLeft: 'auto' }}>{ex.equipment}</FMono>
              </div>
            ))}
            {exercisePool.length > 20 && <FMono size={9} color={Color.faint}>+{exercisePool.length - 20} more</FMono>}
          </div>
        </FSurface>

        {/* 8. Body profile fit */}
        <div style={{ display: 'flex', gap: 12 }}>
          <FSurface style={{ flex: 1 }}>
            <FLabel size={9} mb={10} letter={1.2}>BODY FAT RANGES</FLabel>
            {suitableBodies.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suitableBodies.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FTag tone="mute" size="sm">{r.label}</FTag>
                    <FMono size={9} color={Color.dim}>Men {r.men[0]}-{r.men[1] === 99 ? '∞' : r.men[1]}%</FMono>
                    <FMono size={9} color={Color.dim}>Women {r.women[0]}-{r.women[1] === 99 ? '∞' : r.women[1]}%</FMono>
                  </div>
                ))}
              </div>
            ) : <FMono size={9} color={Color.faint}>Suitable for all ranges</FMono>}
          </FSurface>

          <FSurface style={{ flex: 1 }}>
            <FLabel size={9} mb={10} letter={1.2}>SOMATOTYPE FIT</FLabel>
            {suitableSomatotypes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {suitableSomatotypes.map(([key, s]) => (
                  <div key={key}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: s.color }} />
                      <span style={{ ...Type.headingSm, color: s.color }}>{s.label}</span>
                    </div>
                    <FMono size={8} color={Color.dim}>{s.training}</FMono>
                    <FMono size={8} color={Color.faint} style={{ marginTop: 2 }}>{s.nutrition}</FMono>
                  </div>
                ))}
              </div>
            ) : <FMono size={9} color={Color.faint}>All body types can pursue this goal</FMono>}
          </FSurface>
        </div>
      </div>
    </div>
  )
}
