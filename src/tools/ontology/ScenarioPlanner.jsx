/* ScenarioPlanner — Toggle goals and constraints, see the resulting
   program, caloric state, macros, and meal prep approach update live. */

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FLabel, FMono, FNum, FIcon, FTag, FBtn, FTexBar } from '../../ui/components'
import { generateProgram, EXERCISES } from '../../app/screens/fitness-data'
import { MACRO_RATIOS, GOAL_CALORIC_STATE, CALORIC_PREP, GOAL_META, NUTRITION_GOAL_META, SOMATOTYPES } from './ontology-data'

const EQUIPMENT_OPTIONS = [
  { val: 'full_gym',    label: 'Full Gym' },
  { val: 'home_full',   label: 'Home (Full)' },
  { val: 'home_basic',  label: 'Home (Basic)' },
  { val: 'bands',       label: 'Bands Only' },
  { val: 'bodyweight',  label: 'Bodyweight' },
]

const INJURY_OPTIONS = ['Knees', 'Lower Back', 'Shoulders', 'Wrists', 'Hips']
const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const EXP_OPTIONS = ['beginner', 'intermediate', 'advanced']

const MACRO_COLORS = { protein: Color.accent, carbs: Color.blue, fat: Color.amber }

function Chip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 9999, border: `1px solid ${active ? color : Color.borderSoft}`,
      background: active ? `${color}15` : 'transparent',
      color: active ? color : Color.mute,
      ...Type.labelMd, fontWeight: active ? 600 : 400,
      cursor: 'pointer', transition: 'all 0.15s',
    }}>{label}</button>
  )
}

export default function ScenarioPlanner() {
  const [goals, setGoals] = useState(new Set(['recomposition']))
  const [nutritionGoals, setNutritionGoals] = useState(new Set(['cook_more']))
  const [equipment, setEquipment] = useState('full_gym')
  const [days, setDays] = useState(new Set(['Mon', 'Tue', 'Wed', 'Fri']))
  const [injuries, setInjuries] = useState(new Set())
  const [experience, setExperience] = useState('intermediate')

  const toggleSet = (set, setter, val) => {
    setter(prev => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
  }

  // Derived data
  const goalsArray = [...goals]
  const primaryGoal = goalsArray[0]
  const caloricState = primaryGoal ? GOAL_CALORIC_STATE[primaryGoal] : null
  const macros = primaryGoal ? MACRO_RATIOS[primaryGoal] : null
  const mealPrep = caloricState ? CALORIC_PREP[caloricState.state] : null

  const program = useMemo(() => {
    if (goalsArray.length === 0) return null
    return generateProgram({
      goals: goalsArray,
      equipment,
      availableDays: [...days],
      injuries: [...injuries],
      experience,
    })
  }, [goalsArray.join(','), equipment, [...days].join(','), [...injuries].join(','), experience])

  const exercisePoolSize = useMemo(() => {
    const equipMap = { full_gym: ['barbell','dumbbell','cable','machine','bodyweight','bands'], home_full: ['barbell','dumbbell','bodyweight','bands'], home_basic: ['dumbbell','bodyweight','bands'], bands: ['bodyweight','bands'], bodyweight: ['bodyweight'] }
    const avail = equipMap[equipment] || equipMap.full_gym
    const injSet = new Set([...injuries].map(i => i.toLowerCase().replace(/ /g, '_')))
    return EXERCISES.filter(e => avail.includes(e.equipment) && !e.injury_exclude.some(x => injSet.has(x))).length
  }, [equipment, [...injuries].join(',')])

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* ── Left panel: Inputs ── */}
      <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Fitness goals */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>FITNESS GOALS</FLabel>
          {['Body Composition', 'Performance', 'Functional'].map(group => (
            <div key={group} style={{ marginBottom: 10 }}>
              <FMono size={8} color={Color.faint}>{group.toUpperCase()}</FMono>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                {Object.entries(GOAL_META).filter(([, m]) => m.group === group).map(([key, meta]) => (
                  <Chip key={key} label={meta.label} active={goals.has(key)} color={meta.color} onClick={() => toggleSet(goals, setGoals, key)} />
                ))}
              </div>
            </div>
          ))}
        </FSurface>

        {/* Nutrition goals */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>NUTRITION GOALS</FLabel>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.entries(NUTRITION_GOAL_META).map(([key, meta]) => (
              <Chip key={key} label={meta.label} active={nutritionGoals.has(key)} color={meta.color} onClick={() => toggleSet(nutritionGoals, setNutritionGoals, key)} />
            ))}
          </div>
        </FSurface>

        {/* Equipment */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>EQUIPMENT</FLabel>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {EQUIPMENT_OPTIONS.map(opt => (
              <Chip key={opt.val} label={opt.label} active={equipment === opt.val} color={Color.accent} onClick={() => setEquipment(opt.val)} />
            ))}
          </div>
        </FSurface>

        {/* Available days */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>AVAILABLE DAYS</FLabel>
          <div style={{ display: 'flex', gap: 4 }}>
            {ALL_DAYS.map(d => (
              <Chip key={d} label={d.slice(0, 2)} active={days.has(d)} color={Color.accent} onClick={() => toggleSet(days, setDays, d)} />
            ))}
          </div>
        </FSurface>

        {/* Injuries */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>INJURIES</FLabel>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {INJURY_OPTIONS.map(inj => (
              <Chip key={inj} label={inj} active={injuries.has(inj)} color={Color.red} onClick={() => toggleSet(injuries, setInjuries, inj)} />
            ))}
          </div>
        </FSurface>

        {/* Experience */}
        <FSurface>
          <FLabel size={9} mb={10} letter={1.2}>EXPERIENCE</FLabel>
          <div style={{ display: 'flex', gap: 4 }}>
            {EXP_OPTIONS.map(exp => (
              <Chip key={exp} label={exp} active={experience === exp} color={Color.blue} onClick={() => setExperience(exp)} />
            ))}
          </div>
        </FSurface>
      </div>

      {/* ── Right panel: Output ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {goalsArray.length === 0 ? (
          <FSurface style={{ padding: 40, textAlign: 'center' }}>
            <FMono color={Color.mute}>SELECT AT LEAST ONE GOAL</FMono>
          </FSurface>
        ) : (
          <>
            {/* Caloric state + macro breakdown */}
            <div style={{ display: 'flex', gap: 12 }}>
              <FSurface style={{ flex: 1 }}>
                <FLabel size={9} mb={8} letter={1.2}>CALORIC STATE</FLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ ...Type.headingMd }}>{caloricState?.state}</span>
                  <FMono color={caloricState?.modifier >= 0 ? Color.green : Color.red} size={12}>
                    {caloricState?.modifier >= 0 ? '+' : ''}{caloricState?.modifier} kcal
                  </FMono>
                </div>
                {mealPrep && (
                  <div style={{ marginTop: 10 }}>
                    <FMono size={9} color={Color.mute}>MEAL PREP: {mealPrep.primary.toUpperCase()}</FMono>
                    <div style={{ ...Type.bodySm, color: Color.dim, marginTop: 4 }}>{mealPrep.timing}</div>
                  </div>
                )}
              </FSurface>

              <FSurface style={{ flex: 1 }}>
                <FLabel size={9} mb={8} letter={1.2}>MACRO SPLIT</FLabel>
                {macros && (
                  <>
                    <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ width: `${(macros.protein[0] + macros.protein[1]) / 2}%`, background: MACRO_COLORS.protein }} />
                      <div style={{ width: `${(macros.carbs[0] + macros.carbs[1]) / 2}%`, background: MACRO_COLORS.carbs }} />
                      <div style={{ width: `${(macros.fat[0] + macros.fat[1]) / 2}%`, background: MACRO_COLORS.fat }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[['P', macros.protein, MACRO_COLORS.protein], ['C', macros.carbs, MACRO_COLORS.carbs], ['F', macros.fat, MACRO_COLORS.fat]].map(([l, range, c]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: 3, background: c }} />
                          <FMono size={9} color={Color.dim}>{l} {range[0]}-{range[1]}%</FMono>
                        </div>
                      ))}
                    </div>
                    <FMono size={9} color={Color.mute} style={{ marginTop: 6 }}>PROTEIN: {macros.gPerKg}g/kg LBM</FMono>
                  </>
                )}
              </FSurface>
            </div>

            {/* Pool stats */}
            <div style={{ display: 'flex', gap: 12 }}>
              <FSurface style={{ flex: 1, textAlign: 'center', padding: 14 }}>
                <FLabel mb={4}>Exercises</FLabel>
                <FNum size={22} weight={300}>{exercisePoolSize}</FNum>
                <FMono size={9} color={Color.mute}>AVAILABLE</FMono>
              </FSurface>
              <FSurface style={{ flex: 1, textAlign: 'center', padding: 14 }}>
                <FLabel mb={4}>Sessions</FLabel>
                <FNum size={22} weight={300}>{program?.sessions?.length || 0}</FNum>
                <FMono size={9} color={Color.mute}>/WEEK</FMono>
              </FSurface>
              <FSurface style={{ flex: 1, textAlign: 'center', padding: 14 }}>
                <FLabel mb={4}>Split</FLabel>
                <FMono color={Color.accent} size={10}>{program?.splitLabel || '—'}</FMono>
              </FSurface>
            </div>

            {/* Weekly program preview */}
            <FSurface>
              <FLabel size={9} mb={12} letter={1.2}>WEEKLY PROGRAM</FLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {program?.schedule?.map((entry, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 12px', borderRadius: Radius.md,
                    background: entry.isRest ? 'transparent' : Color.surface2,
                    border: entry.isRest ? 'none' : `1px solid ${Color.borderSoft}`,
                  }}>
                    <FMono size={10} color={Color.dim} style={{ width: 30 }}>{entry.day}</FMono>
                    {entry.isRest ? (
                      <FMono size={9} color={Color.faint}>REST</FMono>
                    ) : (
                      <>
                        <span style={{ ...Type.bodySm, flex: 1 }}>{entry.name}</span>
                        <FTag tone="mute" size="sm">{entry.modalityLabel}</FTag>
                        <FMono size={9} color={Color.mute}>
                          {entry.exercises?.filter(e => e.category !== 'warmup' && e.category !== 'cooldown').length} ex · ~{entry.estimatedMins}m
                        </FMono>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </FSurface>

            {/* Session exercise details */}
            {program?.sessions?.map((session, si) => (
              <FSurface key={si}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <FMono size={10} color={Color.accent}>{session.day}</FMono>
                  <span style={{ ...Type.headingSm }}>{session.name}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {session.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown').map((ex, ei) => (
                    <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                      <div style={{ width: 4, height: 4, borderRadius: 2, background: Color.accent, flexShrink: 0 }} />
                      <FMono size={9} color={Color.text} style={{ flex: 1 }}>{ex.name}</FMono>
                      <FMono size={9} color={Color.mute}>
                        {ex.load > 0 ? `${ex.sets}×${ex.reps} @ ${ex.load}kg` : ex.duration > 0 ? `${ex.duration} min` : `${ex.sets}×${ex.reps}`}
                      </FMono>
                      <FMono size={8} color={Color.faint}>{ex.rest}s rest</FMono>
                    </div>
                  ))}
                </div>
              </FSurface>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
