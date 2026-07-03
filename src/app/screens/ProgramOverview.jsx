// ════════════════════════════════════════════════════════════
// Program Overview — structured program view with phases,
// week navigation, session cards, and cross-tab links.
// Bold hierarchy, generous spacing, hero data treatment.
// ════════════════════════════════════════════════════════════

import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, FTag, FTexBar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { MODALITY_COLORS, getProgramPhase } from './fitness-data'

const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

const PHASE_COLORS = {
  Base:  Color.blue,
  Build: Color.accent,
  Peak:  Color.purple,
}

export function ProgramOverviewContent({ onStartSession }) {
  const { workoutPlan: plan, advanceWeek } = useUser()
  const { pushDetail, switchTab } = useNav()

  if (!plan) {
    return (
      <div style={{ flex: 1, padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${Color.accent}15`, display: 'grid', placeItems: 'center' }}>
          <FIcon path={ICONS.dumb} size={28} color={Color.accent} />
        </div>
        <div style={{ ...Type.headingLg }}>No program yet</div>
        <div style={{ ...Type.bodyLg, color: Color.dim, maxWidth: 280 }}>
          Complete onboarding to generate a training program based on your goals.
        </div>
      </div>
    )
  }

  const currentWeek = plan.currentWeek || 1
  const totalWeeks = plan.totalWeeks || 12
  const phase = getProgramPhase(currentWeek)
  const phaseColor = PHASE_COLORS[phase.name] || Color.accent
  const goalLabels = (plan.goals || []).map(g => g.replace(/_/g, ' ')).join(' · ')
  const completedSessions = plan.sessions.filter(s => s.completed).length

  const getStatus = (entry) => {
    if (entry.completed) return 'done'
    if (entry.dayIndex === TODAY_INDEX) return 'today'
    if (entry.dayIndex < TODAY_INDEX) return 'missed'
    return 'upcoming'
  }

  const restDays = plan.schedule.filter(d => d.isRest)
  const trainingDays = plan.schedule.filter(d => !d.isRest)

  return (
    <div style={{ flex: 1, padding: '24px 24px 48px', overflowY: 'auto' }}>

      {/* ── Hero Header ── */}
      <FMono color={Color.mute} size={10}>YOUR PROGRAM</FMono>
      <div style={{ ...Type.headingLg, fontSize: 24, marginTop: 8, marginBottom: 6 }}>
        {plan.programName || `${plan.splitLabel} Split`}
      </div>
      {goalLabels && (
        <FMono color={Color.mute} size={10}>BASED ON: {goalLabels.toUpperCase()}</FMono>
      )}

      {/* ── Week Hero ── */}
      <div style={{ marginTop: 32, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <FNum size={56} weight={200}>{String(currentWeek).padStart(2, '0')}</FNum>
        <div>
          <FMono color={Color.mute} size={10}>/ {totalWeeks} WEEKS</FMono>
          <div style={{ marginTop: 4 }}>
            <FTag tone="mute" size="sm">{phase.name.toUpperCase()} PHASE</FTag>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <FTexBar pct={(currentWeek / totalWeeks) * 100} height={4} />
      </div>

      {/* ── Phase Timeline ── */}
      <div style={{ display: 'flex', gap: 6, marginTop: 32 }}>
        {[
          { name: 'Base', weeks: [1, 4], color: PHASE_COLORS.Base },
          { name: 'Build', weeks: [5, 8], color: PHASE_COLORS.Build },
          { name: 'Peak', weeks: [9, 12], color: PHASE_COLORS.Peak },
        ].map(p => {
          const isActive = phase.name === p.name
          return (
            <div key={p.name} style={{
              flex: 1, padding: '12px 10px', borderRadius: Radius.lg,
              background: isActive ? `${p.color}15` : Color.surface,
              border: `1px solid ${isActive ? `${p.color}40` : Color.borderSoft}`,
              textAlign: 'center',
            }}>
              <FMono color={isActive ? p.color : Color.mute} size={11}>
                {p.name.toUpperCase()}
              </FMono>
              <div style={{ marginTop: 4 }}>
                <FMono color={Color.faint} size={9}>WK {p.weeks[0]}–{p.weeks[1]}</FMono>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── This Week ── */}
      <div style={{ marginTop: 40 }}>
        <FMono color={Color.mute} size={10}>THIS WEEK</FMono>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
          <FNum size={32} weight={300}>{completedSessions} / {plan.sessions.length}</FNum>
          <FMono color={completedSessions === plan.sessions.length ? Color.green : Color.dim} size={10}>
            {completedSessions === plan.sessions.length ? 'ALL DONE' : 'SESSIONS'}
          </FMono>
        </div>
      </div>

      {/* ── Training Session Cards ── */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {trainingDays.map((entry) => {
          const status = getStatus(entry)
          const color = MODALITY_COLORS[entry.modalityLabel] || Color.faint
          const isToday = status === 'today'
          const isDone = status === 'done'
          const isMissed = status === 'missed'
          const coreExercises = entry.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')

          return (
            <FSurface key={entry.day} style={{
              padding: 20,
              border: isToday ? `1px solid ${color}40` : `1px solid ${Color.borderSoft}`,
              background: isToday ? `${color}06` : Color.surface,
              opacity: isMissed ? 0.45 : 1,
            }}>
              {/* Day + status row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  fontFamily: Font.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1,
                  color: isToday ? Color.accent : Color.dim,
                }}>{entry.day.toUpperCase()}</div>
                {isToday && <FTag tone="accent" size="sm">TODAY</FTag>}
                {isDone && <FTag tone="green" size="sm">DONE</FTag>}
                {isMissed && <FTag tone="mute" size="sm">MISSED</FTag>}
                <div style={{ marginLeft: 'auto' }}>
                  <FTag tone="mute" size="sm">{entry.modalityLabel.toUpperCase()}</FTag>
                </div>
              </div>

              {/* Session name */}
              <div style={{ ...Type.headingMd, fontSize: 18, marginBottom: 8 }}>{entry.name}</div>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <FMono color={Color.mute} size={10}>{coreExercises.length} EXERCISES</FMono>
                <FMono color={Color.faint} size={10}>·</FMono>
                <FMono color={Color.mute} size={10}>~{entry.estimatedMins} MIN</FMono>
              </div>

              {/* Exercise preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {coreExercises.slice(0, 3).map((ex, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 2.5, background: color, flexShrink: 0 }} />
                      <FMono color={Color.dim} size={10}>{ex.name}</FMono>
                      <FMono color={Color.faint} size={10} style={{ marginLeft: 'auto' }}>
                        {ex.load > 0 ? `${ex.sets}×${ex.reps} @ ${ex.load}kg` : ex.duration > 0 ? `${ex.duration} min` : `${ex.sets}×${ex.reps}`}
                      </FMono>
                    </div>
                  ))}
                {coreExercises.length > 3 && (
                  <FMono color={Color.faint} size={9} style={{ paddingLeft: 15 }}>
                    +{coreExercises.length - 3} more
                  </FMono>
                )}
              </div>

              {/* Start button */}
              {!isDone && onStartSession && (
                <FBtn
                  variant="primary"
                  size="sm"
                  icon={ICONS.play}
                  onClick={() => onStartSession(entry)}
                  data-stay="true"
                >
                  {isToday ? 'Start session' : 'Preview'}
                </FBtn>
              )}
            </FSurface>
          )
        })}
      </div>

      {/* ── Rest Days ── */}
      {restDays.length > 0 && (
        <div style={{
          marginTop: 12, padding: '14px 20px', borderRadius: Radius.lg,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: Color.faint }} />
          <FMono color={Color.mute} size={10}>
            REST · {restDays.map(d => d.day.toUpperCase()).join(', ')}
          </FMono>
          <FMono color={Color.faint} size={10} style={{ marginLeft: 'auto' }}>{restDays.length} DAYS</FMono>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <FBtn variant="ghost" size="sm" icon={ICONS.search} onClick={() => pushDetail('exercises', 'Exercises')} data-stay="true">
          Browse exercises
        </FBtn>
        {plan.goals?.[0] && (
          <FBtn variant="ghost" size="sm" icon={ICONS.goal} onClick={() => pushDetail('goal-detail', 'Goal', { goalKey: plan.goals[0] })} data-stay="true">
            Goal details
          </FBtn>
        )}
        <FBtn variant="ghost" size="sm" icon={ICONS.fwd} onClick={() => switchTab('plan')} data-stay="true">
          View in calendar
        </FBtn>
      </div>

      {/* ── Program Stats ── */}
      <div style={{ marginTop: 32, display: 'flex', gap: 10 }}>
        <FSurface style={{ flex: 1, padding: 20, textAlign: 'center' }}>
          <FLabel mb={8}>Sessions</FLabel>
          <FNum size={28} weight={300}>{plan.sessions.length}</FNum>
          <FMono color={Color.mute} size={9}>/WEEK</FMono>
        </FSurface>
        <FSurface style={{ flex: 1, padding: 20, textAlign: 'center' }}>
          <FLabel mb={8}>Phase</FLabel>
          <FMono color={phaseColor} size={12}>{phase.name.toUpperCase()}</FMono>
          <div style={{ marginTop: 4 }}>
            <FMono color={Color.faint} size={9}>WK {phase.weeks}</FMono>
          </div>
        </FSurface>
        <FSurface style={{ flex: 1, padding: 20, textAlign: 'center' }}>
          <FLabel mb={8}>Split</FLabel>
          <FMono color={Color.accent} size={12}>{plan.splitLabel.toUpperCase()}</FMono>
        </FSurface>
      </div>

      {/* ── Advance Week (prototype) ── */}
      {currentWeek < totalWeeks && (
        <div style={{ marginTop: 24 }}>
          <FBtn variant="ghost" size="sm" full onClick={advanceWeek} data-stay="true">
            Advance to week {currentWeek + 1} →
          </FBtn>
        </div>
      )}
    </div>
  )
}

export function ProgramOverviewScreen() {
  return (
    <Phone label="Program Overview" group="TRAINING">
      <FNavBar
        title="Training"
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text} />}
      />
      <ProgramOverviewContent />
    </Phone>
  )
}
