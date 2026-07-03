// ════════════════════════════════════════════════════════════
// Workout Template Detail — sample session for a goal
// Shows objective, protocol, frequency, rep range,
// and sample exercises with sets, rest, and injury alts.
// ════════════════════════════════════════════════════════════

import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FListRow, Phone } from '../../ui/components'
import { WORKOUT_TEMPLATES, GOAL_META, GOAL_CALORIC_STATE } from '../../tools/ontology/ontology-data'

export function WorkoutTemplateContent({ data }) {
  const goalKey = data?.goalKey || 'hypertrophy'
  const template = WORKOUT_TEMPLATES[goalKey]
  const meta = GOAL_META[goalKey]
  const caloric = GOAL_CALORIC_STATE[goalKey]

  if (!template) {
    return (
      <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
        <FIcon path={ICONS.dumb} size={28} color={Color.faint} />
        <FMono size={10} color={Color.mute}>No template defined for this goal</FMono>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 40, height: 40, borderRadius: Radius.lg, background: `${meta?.color || Color.accent}15`, display: 'grid', placeItems: 'center' }}>
          <FIcon path={ICONS.dumb} size={20} color={meta?.color || Color.accent} />
        </div>
        <div>
          <div style={{ ...Type.headingLg }}>{template.label}</div>
          <FMono size={10} color={Color.mute}>{meta?.group}</FMono>
        </div>
      </div>

      {/* Objective */}
      <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.6, marginTop: 12, marginBottom: 16 }}>
        {template.objective}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <FTag tone="accent" size="sm">{template.frequency}</FTag>
        <FTag tone="mute" size="sm">{template.split}</FTag>
        <FTag tone="mute" size="sm">{template.repRange}</FTag>
      </div>

      {/* Protocol */}
      <FSurface>
        <FLabel size={9} mb={6}>CALORIC PROTOCOL</FLabel>
        <div style={{ ...Type.bodyMd, color: Color.blue }}>{template.protocol}</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <div>
            <FMono size={10} color={Color.faint}>STATE</FMono>
            <FMono size={10} color={Color.text}>{caloric?.state}</FMono>
          </div>
          <div>
            <FMono size={10} color={Color.faint}>MODIFIER</FMono>
            <FMono size={10} color={caloric?.modifier >= 0 ? Color.green : Color.red}>
              {caloric?.modifier >= 0 ? '+' : ''}{caloric?.modifier} kcal
            </FMono>
          </div>
        </div>
      </FSurface>

      {/* Sample session */}
      {template.sampleSession.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <FLabel size={9} mb={12}>SAMPLE SESSION</FLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {template.sampleSession.map((row, i) => (
              <FSurface key={i} style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ ...Type.headingSm }}>{row.exercise}</div>
                  <FMono size={10} color={Color.accent}>{row.sets}</FMono>
                </div>
                <FMono size={9} color={Color.dim}>{row.focus}</FMono>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <FMono size={9} color={Color.faint}>REST: {row.rest}</FMono>
                  {row.injuryAlt && (
                    <FMono size={10} color={Color.red}>ALT: {row.injuryAlt}</FMono>
                  )}
                </div>
              </FSurface>
            ))}
          </div>
        </div>
      )}

      {template.sampleSession.length === 0 && (
        <FSurface style={{ marginTop: 20, textAlign: 'center', padding: 24 }}>
          <FIcon path={ICONS.dumb} size={24} color={Color.faint} />
          <FMono size={10} color={Color.mute} style={{ marginTop: 8, display: 'block' }}>
            Sample session coming soon
          </FMono>
        </FSurface>
      )}
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
