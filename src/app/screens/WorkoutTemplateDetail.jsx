// ════════════════════════════════════════════════════════════
// Workout Template Detail — Brief-style card layout
// R1: tinted hero with caloric contract
// R2: compact session rows (name + sets badge only)
// R4: 2×2 stat grid, weighted sections
// R6/R7: Start/Customize action zone at bottom
// ════════════════════════════════════════════════════════════

import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, Phone } from '../../ui/components'
import { WORKOUT_TEMPLATES, GOAL_META, GOAL_CALORIC_STATE } from '../../tools/ontology/ontology-data'
import { EXERCISES } from './fitness-data'
import { useNav } from '../../context/NavigationContext'
import { useUser } from '../../context/UserContext'

export function WorkoutTemplateContent({ data }) {
  const goalKey = data?.goalKey || 'hypertrophy'
  const template = WORKOUT_TEMPLATES[goalKey]
  const meta = GOAL_META[goalKey]
  const caloric = GOAL_CALORIC_STATE[goalKey]
  const goalColor = meta?.color || Color.accent
  const { pushDetail } = useNav()
  const { workoutPlan } = useUser()

  const handleStart = () => {
    const session = workoutPlan?.schedule?.find(s => !s.isRest && !s.completed && s.goalSources?.includes(goalKey))
      || workoutPlan?.schedule?.find(s => !s.isRest && !s.completed)
    if (session) pushDetail('active-session', session.name, { session })
    else pushDetail('exercises', 'Exercises', { goalKey })
  }

  const handleExerciseTap = (exerciseName) => {
    const match = EXERCISES.find(e => exerciseName.toLowerCase().includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(exerciseName.toLowerCase()))
    if (match) pushDetail('exercise-detail', match.name, { exercise: match })
  }

  if (!template) {
    return (
      <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
        <FIcon path={ICONS.dumb} size={28} color={Color.faint} />
        <FMono size={10} color={Color.mute}>No template defined for this goal</FMono>
      </div>
    )
  }

  /* Parse frequency number for hero display */
  const freqMatch = template.frequency.match(/(\d[\d-]*)/)
  const freqNum = freqMatch ? freqMatch[1] : template.frequency

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>

      {/* ── Hero — flat label + title + caloric anchor ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...Type.labelSm, color: goalColor, marginBottom: 6 }}>{meta?.group?.toUpperCase()}</div>
        <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, letterSpacing: -1, color: Color.text, lineHeight: 1.1, marginBottom: 6 }}>
          {template.label}
        </div>
        <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5, marginBottom: 12 }}>
          {template.objective}
        </div>

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
      </div>

      {/* ── Stats — two rows of two ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '14px 0',
        borderTop: `1px solid ${Color.borderSoft}`,
        borderBottom: `1px solid ${Color.borderSoft}`,
      }}>
        <div>
          <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>FREQUENCY</div>
          <div style={{ fontFamily: Font.sans, fontSize: 15, fontWeight: 500, color: Color.text }}>{freqNum}</div>
          <div style={{ ...Type.bodySm, color: Color.mute, marginTop: 2 }}>days/wk</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>SPLIT</div>
          <div style={{ fontFamily: Font.sans, fontSize: 15, fontWeight: 500, color: Color.text }}>{template.split}</div>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '14px 0', marginBottom: 24,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>REP RANGE</div>
          <div style={{ fontFamily: Font.sans, fontSize: 15, fontWeight: 500, color: Color.text }}>{template.repRange}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>PROTOCOL</div>
          <div style={{ fontFamily: Font.sans, fontSize: 15, fontWeight: 500, color: Color.text }}>{caloric?.label || '—'}</div>
        </div>
      </div>

      {/* ── Sample session — open rows, no container ── */}
      {template.sampleSession.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>
            SESSION{' '}<span style={{ color: Color.faint }}>·</span>{' '}{template.sampleSession.length} EXERCISES
          </div>

          {template.sampleSession.map((row, i) => {
            const isFeatured = i === 0
            return (
              <div key={i} onClick={() => handleExerciseTap(row.exercise)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: isFeatured ? '14px 0' : '11px 0',
                borderTop: `1px solid ${Color.borderSoft}`,
                cursor: 'pointer',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    ...(isFeatured ? Type.headingSm : Type.bodyMd),
                    color: Color.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{row.exercise}</div>
                  {isFeatured && (
                    <div style={{ ...Type.bodySm, color: Color.mute, marginTop: 2 }}>{row.focus}</div>
                  )}
                </div>
                <span style={{ fontFamily: Font.mono, fontSize: 11, color: goalColor, fontWeight: 500, letterSpacing: 0.5, flexShrink: 0, marginLeft: 12 }}>
                  {row.sets}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {template.sampleSession.length === 0 && (
        <div style={{ padding: '20px 0', textAlign: 'center', marginBottom: 20 }}>
          <FMono size={10} color={Color.mute}>Sample session coming soon</FMono>
        </div>
      )}

      {/* ── Protocol note — dashed border ── */}
      <div style={{
        padding: 16, borderRadius: Radius.lg,
        border: `1px dashed ${Color.borderSoft}`, marginBottom: 28,
      }}>
        <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5 }}>
          {template.protocol}. Volume adjusts weekly based on your recovery.
        </div>
      </div>

      {/* ── R6/R7: Action zone — visible without scrolling past session ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <FBtn variant="ghost" size="lg" onClick={() => pushDetail('exercises', 'Exercises', { goalKey })}>Swap exercises</FBtn>
        <FBtn variant="split" full iconLeading={ICONS.play} onClick={handleStart}>Start workout</FBtn>
      </div>
    </div>
  )
}

export function WorkoutTemplateScreen({ goalKey } = {}) {
  const key = goalKey || 'fat_loss'
  const template = WORKOUT_TEMPLATES[key]
  return (
    <Phone label="Workout Template" group="TRAINING">
      <FNavBar title={template?.label || 'Template'} leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <WorkoutTemplateContent data={{ goalKey: key }} />
    </Phone>
  )
}
