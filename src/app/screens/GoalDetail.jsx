// ════════════════════════════════════════════════════════════
// Goal Detail — R1–R7 compliant
// Contract hero, macro bar chart (kept), weighted modalities,
// flat secondary sections, icon-card actions.
// ════════════════════════════════════════════════════════════

import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FBtn, Phone } from '../../ui/components'
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
  const goalColor = meta?.color || Color.accent

  const strong = modalities.filter(([, s]) => s === 'S')
  const moderate = modalities.filter(([, s]) => s === 'M')
  const weak = modalities.filter(([, s]) => s === 'W')

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>

      {/* ── Hero — flat label + title + caloric anchor ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...Type.labelSm, color: goalColor, marginBottom: 6 }}>{meta?.group?.toUpperCase()}</div>
        <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, letterSpacing: -1, color: Color.text, lineHeight: 1.1, marginBottom: 6 }}>
          {meta?.label || goalKey}
        </div>
        {template && (
          <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5, marginBottom: 12 }}>
            {template.objective}
          </div>
        )}
        {caloric && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: Font.sans, fontSize: 26, fontWeight: 500,
              color: caloric.modifier >= 0 ? Color.green : Color.accent,
            }}>
              {caloric.modifier >= 0 ? '+' : ''}{caloric.modifier}
            </span>
            <span style={{ ...Type.labelSm, color: Color.mute }}>kcal</span>
            <span style={{ ...Type.bodySm, color: Color.mute, marginLeft: 4 }}>·</span>
            <span style={{ ...Type.bodySm, color: Color.dim, marginLeft: 4 }}>{caloric.state}</span>
          </div>
        )}
        <div style={{ height: 1, background: Color.borderSoft, marginTop: 16 }} />
      </div>

      {/* ── Macro split card ── */}
      {macros && (
        <div style={{
          background: Color.surface, borderRadius: Radius.lg,
          border: `1px solid ${Color.borderSoft}`,
          padding: 16, marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ fontFamily: Font.mono, fontSize: 8, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', color: Color.mute }}>MACRO SPLIT</div>
          <div style={{ display: 'flex', height: 16, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(macros.protein[0] + macros.protein[1]) / 2}%`, background: MACRO_COLORS.protein }} />
            <div style={{ width: `${(macros.carbs[0] + macros.carbs[1]) / 2}%`, background: MACRO_COLORS.carbs }} />
            <div style={{ width: `${(macros.fat[0] + macros.fat[1]) / 2}%`, background: MACRO_COLORS.fat }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: Font.mono, fontSize: 8, letterSpacing: 0.8, color: MACRO_COLORS.protein }}>P {macros.protein[0]}-{macros.protein[1]}%</span>
            <span style={{ fontFamily: Font.mono, fontSize: 8, letterSpacing: 0.8, color: MACRO_COLORS.carbs }}>C {macros.carbs[0]}-{macros.carbs[1]}%</span>
            <span style={{ fontFamily: Font.mono, fontSize: 8, letterSpacing: 0.8, color: MACRO_COLORS.fat }}>F {macros.fat[0]}-{macros.fat[1]}%</span>
          </div>
          <div style={{ fontFamily: Font.sans, fontSize: 10, color: Color.dim, lineHeight: 1.4 }}>
            Protein {macros.gPerKg}g/kg LBM{macros.notes ? ` · ${macros.notes.toLowerCase()}` : ''}
          </div>
        </div>
      )}

      {/* ── Training modalities — no section label ── */}
      <div style={{ marginBottom: 16 }}>
        {/* Strong — tinted card row */}
        {strong.map(([name]) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: Radius.lg,
            background: alpha(goalColor, 0.06), marginBottom: 6,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: goalColor, display: 'grid', placeItems: 'center',
            }}>
              <FIcon path={ICONS.flame} size={14} color={Color.bg} stroke={2} />
            </div>
            <div>
              <div style={{ ...Type.bodyMd, fontWeight: 500, color: Color.text }}>{name}</div>
              <div style={{ ...Type.bodySm, color: goalColor, marginTop: 1 }}>Primary</div>
            </div>
          </div>
        ))}

        {/* Moderate — dot-label pills */}
        {moderate.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: strong.length > 0 ? 6 : 0, marginBottom: weak.length > 0 ? 6 : 0 }}>
            {moderate.map(([name]) => (
              <span key={name} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontFamily: Font.sans,
                padding: '4px 10px', borderRadius: 999,
                background: alpha(Color.blue, 0.10), color: Color.blue,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: Color.blue, flexShrink: 0 }} />
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Weak — muted inline text */}
        {weak.length > 0 && (
          <div style={{ ...Type.bodySm, color: Color.mute, marginTop: 6 }}>
            Supplementary: {weak.map(([n]) => n).join(', ')}
          </div>
        )}
      </div>

      {/* ── Meal prep — flat label + content ── */}
      {mealPrep && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...Type.labelMd, color: Color.mute, marginBottom: 8 }}>MEAL PREP APPROACH</div>
          <div style={{ ...Type.headingSm, color: Color.green, marginBottom: 4 }}>{mealPrep.primary}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            {mealPrep.supporting.map(s => (
              <span key={s} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontFamily: Font.sans,
                padding: '4px 10px', borderRadius: 999,
                background: alpha(Color.green, 0.10), color: Color.green,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: Color.green, flexShrink: 0 }} />
                {s}
              </span>
            ))}
          </div>
          <div style={{ ...Type.bodySm, color: Color.mute }}>{mealPrep.timing}</div>
        </div>
      )}

      {/* ── Body profile — muted text ── */}
      {(suitableBodies.length > 0 || suitableSomato.length > 0) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...Type.labelMd, color: Color.mute, marginBottom: 4 }}>RECOMMENDED FOR</div>
          <div style={{ ...Type.bodySm, color: Color.mute, lineHeight: 1.5 }}>
            {suitableBodies.map(r => r.label).join(', ')}{suitableBodies.length > 0 && suitableSomato.length > 0 ? ' · ' : ''}
            {suitableSomato.map(([, s]) => `${s.label} tendency`).join(', ')}
          </div>
        </div>
      )}

      {/* ── Linked sessions — compact list-in-card ── */}
      <LinkedSessions goalKey={goalKey} goalColor={goalColor} />

      {/* ── Quick actions ── */}
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {template && (
          <FSurface onClick={() => pushDetail('workout-template', template.label, { goalKey })} style={{
            padding: '12px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: alpha(Color.text, 0.04), display: 'grid', placeItems: 'center',
            }}>
              <FIcon path={ICONS.dumb} size={14} color={Color.dim} stroke={1.8} />
            </div>
            <FMono size={10} color={Color.dim}>Training plan</FMono>
          </FSurface>
        )}
        <FSurface onClick={() => pushDetail('exercises', 'Exercises', { goalKey })} style={{
          padding: '12px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: alpha(Color.text, 0.04), display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.search} size={14} color={Color.dim} stroke={1.8} />
          </div>
          <FMono size={10} color={Color.dim}>Browse exercises</FMono>
        </FSurface>
      </div>
    </div>
  )
}

function LinkedSessions({ goalKey, goalColor }) {
  const { workoutPlan } = useUser()
  const { pushDetail } = useNav()
  if (!workoutPlan?.sessions) return null
  const linked = workoutPlan.sessions.filter(s => s.goalSources?.includes(goalKey))
  if (linked.length === 0) return null

  return (
    <div style={{
      padding: '16px 16px 12px', borderRadius: Radius.lg,
      background: Color.surface2, border: `1px solid ${Color.borderSoft}`,
      marginBottom: 4,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ ...Type.labelSm, color: Color.mute }}>YOUR SESSIONS</div>
        <div style={{ ...Type.labelSm, color: Color.mute }}>{linked.length}</div>
      </div>
      {linked.map((s, i) => (
        <div key={s.id} onClick={() => pushDetail('active-session', s.name, { session: s })} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 0', cursor: 'pointer',
          borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
        }}>
          <FMono color={goalColor} size={11}>{s.day.toUpperCase()}</FMono>
          <div style={{ flex: 1, ...Type.bodyMd, color: Color.text }}>{s.name}</div>
          <div style={{
            padding: '3px 8px', borderRadius: 6,
            background: alpha(goalColor, 0.10),
          }}>
            <FMono size={10} color={goalColor}>{s.modalityLabel.toUpperCase()}</FMono>
          </div>
          <FIcon path={ICONS.fwd} size={10} color={Color.faint} />
        </div>
      ))}
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
