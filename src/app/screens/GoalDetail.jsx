// ════════════════════════════════════════════════════════════
// Goal Detail — what a selected fitness goal activates
// Shows: caloric state, macro split, training modalities,
// meal prep approach, body profile recommendations.
// ════════════════════════════════════════════════════════════

import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FTexBar, FBtn, FListRow, Phone } from '../../ui/components'
import { MACRO_RATIOS, GOAL_CALORIC_STATE, CALORIC_PREP, BODY_FAT_RANGES, SOMATOTYPES, GOAL_META, WORKOUT_TEMPLATES } from '../../tools/ontology/ontology-data'
import { useNav } from '../../context/NavigationContext'
import { useUser } from '../../context/UserContext'

const MACRO_COLORS = { protein: Color.accent, carbs: Color.blue, fat: Color.amber }

const MODALITY_MATRIX = {
  hypertrophy: [['Hypertrophy Lifting', 'S'], ['Calisthenics', 'M']],
  fat_loss: [['HIIT', 'S'], ['Strength Lifting', 'M'], ['Zone 2 Cardio', 'M'], ['Circuits', 'M']],
  recomposition: [['Hypertrophy Lifting', 'S'], ['HIIT', 'M'], ['Zone 2 Cardio', 'W']],
  max_strength: [['Strength Lifting', 'S'], ['Plyometrics', 'M']],
  cardio_endurance: [['Zone 2 Cardio', 'S'], ['Circuits', 'M']],
  power: [['Plyometrics', 'S'], ['Strength Lifting', 'M']],
  agility: [['Circuits', 'S'], ['Plyometrics', 'M']],
  flexibility: [['Mobility / Yoga', 'S']],
  balance: [['Mobility / Yoga', 'M'], ['Calisthenics', 'M']],
  overall_wellness: [['Zone 2 Cardio', 'M'], ['Mobility / Yoga', 'M'], ['Circuits', 'W']],
}

const STRENGTH_COLORS = { S: Color.accent, M: Color.blue, W: Color.faint }

export function GoalDetailContent({ goalKey: propGoalKey, data }) {
  const goalKey = propGoalKey || data?.goalKey || 'hypertrophy'
  const { pushDetail } = useNav()

  const meta = GOAL_META[goalKey]
  const caloric = GOAL_CALORIC_STATE[goalKey]
  const macros = MACRO_RATIOS[goalKey]
  const mealPrep = caloric ? CALORIC_PREP[caloric.state] : null
  const template = WORKOUT_TEMPLATES[goalKey]
  const modalities = MODALITY_MATRIX[goalKey] || []
  const suitableBodies = BODY_FAT_RANGES.filter(r => r.goals.includes(goalKey))
  const suitableSomato = Object.entries(SOMATOTYPES).filter(([, s]) => s.bestGoals.includes(goalKey))

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 40, height: 40, borderRadius: Radius.lg, background: `${meta?.color || Color.accent}15`, display: 'grid', placeItems: 'center' }}>
          <FIcon path={ICONS.goal} size={20} color={meta?.color || Color.accent} />
        </div>
        <div>
          <div style={{ ...Type.headingLg }}>{meta?.label || goalKey}</div>
          <FMono size={10} color={Color.mute}>{meta?.group}</FMono>
        </div>
      </div>

      {/* Caloric state */}
      <FSurface style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <FLabel size={9} mb={4}>CALORIC STATE</FLabel>
            <div style={{ ...Type.headingMd }}>{caloric?.state}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <FNum size={28} weight={300} color={caloric?.modifier >= 0 ? Color.green : Color.red}>
              {caloric?.modifier >= 0 ? '+' : ''}{caloric?.modifier}
            </FNum>
            <FMono size={9} color={Color.mute}>KCAL / DAY</FMono>
          </div>
        </div>
      </FSurface>

      {/* Macro split */}
      {macros && (
        <FSurface style={{ marginTop: 12 }}>
          <FLabel size={9} mb={10}>MACRO SPLIT</FLabel>
          <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ width: `${(macros.protein[0] + macros.protein[1]) / 2}%`, background: MACRO_COLORS.protein }} />
            <div style={{ width: `${(macros.carbs[0] + macros.carbs[1]) / 2}%`, background: MACRO_COLORS.carbs }} />
            <div style={{ width: `${(macros.fat[0] + macros.fat[1]) / 2}%`, background: MACRO_COLORS.fat }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FMono size={10} color={MACRO_COLORS.protein}>P {macros.protein[0]}-{macros.protein[1]}%</FMono>
            <FMono size={10} color={MACRO_COLORS.carbs}>C {macros.carbs[0]}-{macros.carbs[1]}%</FMono>
            <FMono size={10} color={MACRO_COLORS.fat}>F {macros.fat[0]}-{macros.fat[1]}%</FMono>
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${Color.borderSoft}` }}>
            <FMono size={9} color={Color.dim}>PROTEIN TARGET: {macros.gPerKg}g/kg lean body mass</FMono>
            <FMono size={9} color={Color.faint} style={{ marginTop: 4, display: 'block' }}>{macros.notes}</FMono>
          </div>
        </FSurface>
      )}

      {/* Training modalities */}
      <div style={{ marginTop: 20 }}>
        <FLabel size={9} mb={10}>TRAINING MODALITIES</FLabel>
        {modalities.map(([name, strength]) => (
          <FListRow key={name}
            leading={
              <span style={{
                display: 'inline-flex', width: 22, height: 22, borderRadius: 4,
                background: `${STRENGTH_COLORS[strength]}15`, color: STRENGTH_COLORS[strength],
                fontFamily: Font.mono, fontSize: 11, fontWeight: 600,
                alignItems: 'center', justifyContent: 'center',
              }}>{strength}</span>
            }
            title={name}
            subtitle={strength === 'S' ? 'Primary driver' : strength === 'M' ? 'Supporting' : 'Supplementary'}
            divider
          />
        ))}
      </div>

      {/* Meal prep */}
      {mealPrep && (
        <FSurface style={{ marginTop: 20 }}>
          <FLabel size={9} mb={8}>MEAL PREP APPROACH</FLabel>
          <div style={{ ...Type.headingSm, color: Color.green, marginBottom: 4 }}>{mealPrep.primary}</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {mealPrep.supporting.map(s => <FTag key={s} tone="mute" size="sm">{s}</FTag>)}
          </div>
          <FMono size={9} color={Color.dim}>{mealPrep.timing}</FMono>
        </FSurface>
      )}

      {/* Recommended body profile */}
      <div style={{ marginTop: 20 }}>
        <FLabel size={9} mb={10}>RECOMMENDED FOR</FLabel>
        {suitableBodies.map((r, i) => (
          <FListRow key={i}
            title={r.label}
            subtitle={`Men ${r.men[0]}-${r.men[1] === 99 ? '∞' : r.men[1]}% · Women ${r.women[0]}-${r.women[1] === 99 ? '∞' : r.women[1]}%`}
            divider={i > 0}
          />
        ))}
        {suitableSomato.map(([, s]) => (
          <FListRow key={s.label}
            leading={<div style={{ width: 10, height: 10, borderRadius: 5, background: s.color }} />}
            title={`${s.label} tendency`}
            subtitle={s.training}
            divider
          />
        ))}
        {suitableBodies.length === 0 && suitableSomato.length === 0 && (
          <FMono size={10} color={Color.faint}>Suitable for all body types</FMono>
        )}
      </div>

      {/* Actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
        {template && (
          <FBtn variant="ghost" size="sm" icon={ICONS.dumb} onClick={() => pushDetail('workout-template', template.label, { goalKey })} data-stay="true">
            View template
          </FBtn>
        )}
        <FBtn variant="ghost" size="sm" icon={ICONS.search} onClick={() => pushDetail('exercises', 'Exercises', { goalKey })} data-stay="true">
          Browse exercises
        </FBtn>
      </div>
    </div>
  )
}

export function GoalDetailScreen({ goalKey: propKey } = {}) {
  const { profile } = useUser()
  const goalKey = propKey || profile?.goals?.[0] || 'recomposition'
  const meta = GOAL_META[goalKey]
  return (
    <Phone label="Goal Detail" group="TRAINING">
      <FNavBar title={meta?.label || 'Goal Detail'} leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <GoalDetailContent goalKey={goalKey} />
    </Phone>
  )
}
