// ════════════════════════════════════════════════════════════
// Program Overview — structured program view with phases,
// week navigation, session cards, and cross-tab links.
// Bold hierarchy, generous spacing, hero data treatment.
// ════════════════════════════════════════════════════════════

import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, FTag, FTexBar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { getProgramPhase, flattenSessionExercises, formatTime } from './fitness-data'

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

const PHASE_COLORS = {
  Base:  Color.blue,
  Build: Color.accent,
  Peak:  Color.purple,
}

export function ProgramOverviewContent({ onStartSession }) {
  const { workoutPlan: plan, advanceWeek, activeSession } = useUser()
  const { pushDetail, switchTab } = useNav()

  if (!plan) {
    return (
      <div style={{ flex: 1, padding: '40px 24px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(Color.accent, 0.15)}, ${alpha(Color.accent, 0.05)})`,
          border: `2px solid ${alpha(Color.accent, 0.25)}`,
          display: 'grid', placeItems: 'center',
        }}>
          <FIcon path={ICONS.dumb} size={36} color={Color.accent} stroke={1.5} />
        </div>
        <div>
          <div style={{ ...Type.headingLg, marginBottom: 8 }}>Your program starts here</div>
          <div style={{ ...Type.bodyMd, color: Color.dim, maxWidth: 260, margin: '0 auto', lineHeight: 1.6 }}>
            Complete onboarding to generate a training plan built for your goals, equipment, and schedule.
          </div>
        </div>
        <FBtn variant="primary" size="lg" icon={ICONS.play} data-stay="true">
          Start onboarding
        </FBtn>
      </div>
    )
  }

  const todayIndex = getTodayIndex()
  const currentWeek = plan.currentWeek || 1
  const totalWeeks = plan.totalWeeks || 12
  const phase = getProgramPhase(currentWeek)
  const phaseColor = PHASE_COLORS[phase.name] || Color.accent
  const goalLabels = (plan.goals || []).map(g => g.replace(/_/g, ' ')).join(' · ')
  const completedSessions = plan.sessions.filter(s => s.completed).length

  const getStatus = (entry) => {
    if (entry.completed) return 'done'
    if (entry.dayIndex === todayIndex) return 'today'
    if (entry.dayIndex < todayIndex) return 'missed'
    return 'upcoming'
  }

  const restDays = plan.schedule.filter(d => d.isRest)
  const trainingDays = plan.schedule.filter(d => !d.isRest)

  const todayEntry = plan.schedule.find(s => s.dayIndex === todayIndex)

  return (
    <div style={{ flex: 1, padding: '24px 24px 48px', overflowY: 'auto' }}>

      {/* ── Resume Banner ── */}
      {activeSession && (
        <div style={{
          marginBottom: Space[5],
          padding: `${Space[4]}px ${Space[5]}px`,
          borderRadius: Radius.xl,
          background: `${Color.accent}10`,
          border: `1px solid ${Color.accent}30`,
          display: 'flex', alignItems: 'center', gap: Space[4],
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FMono color={Color.accent} size={10} style={{ marginBottom: 4, display: 'block' }}>RESUME WORKOUT</FMono>
            <div style={{ ...Type.bodyMd, color: Color.text, marginBottom: 4 }}>
              {activeSession.sessionName}
            </div>
            <FMono color={Color.dim} size={10}>
              {formatTime(activeSession.elapsed || 0)} elapsed
            </FMono>
          </div>
          <FBtn variant="primary" size="sm" onClick={() => {
            const matchSession = plan?.schedule?.find(s => s.id === activeSession.sessionId)
            if (matchSession) {
              pushDetail('active-session', activeSession.sessionName, { session: matchSession, restoreState: activeSession })
            }
          }} data-stay="true">
            Resume
          </FBtn>
        </div>
      )}

      {/* ── Header ── */}
      <FMono color={Color.mute} size={10}>
        WEEK {currentWeek} OF {totalWeeks} · {phase.name.toUpperCase()} PHASE
      </FMono>
      <div style={{ ...Type.headingLg, marginTop: Space[2], marginBottom: Space[1] }}>
        {plan.programName || `${plan.splitLabel} Split`}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FMono color={Color.dim} size={10}>
          {completedSessions}/{plan.sessions.length} SESSIONS
        </FMono>
        {goalLabels && (
          <>
            <FMono color={Color.faint} size={10}>·</FMono>
            <FMono color={Color.mute} size={10}>{goalLabels.toUpperCase()}</FMono>
          </>
        )}
      </div>
      <div style={{ marginTop: Space[3] }}>
        <FTexBar pct={(currentWeek / totalWeeks) * 100} height={3} />
      </div>

      {/* ── Today's Session (compact) ── */}
      {todayEntry && !todayEntry.isRest && !todayEntry.completed && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: Space[3],
          padding: `${Space[4]}px ${Space[5]}px`,
          marginTop: Space[6], marginBottom: Space[4],
          borderRadius: Radius.xl,
          background: alpha(Color.accent, 0.06),
          border: `1px solid ${alpha(Color.accent, 0.15)}`,
          cursor: 'pointer',
        }}
        onClick={() => onStartSession ? onStartSession(todayEntry) : pushDetail('active-session', todayEntry.name, { session: todayEntry })}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <FTag tone="accent" size="sm">TODAY</FTag>
              <FMono color={Color.mute} size={10}>~{todayEntry.estimatedMins} min</FMono>
            </div>
            <div style={{ ...Type.bodyLg, fontWeight: 500, color: Color.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {todayEntry.name}
            </div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: Color.accent,
            display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.play} size={14} color={Color.accentText} />
          </div>
        </div>
      )}

      {/* ── Today's Session (completed) ── */}
      {todayEntry && !todayEntry.isRest && todayEntry.completed && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: Space[3],
          padding: `${Space[3]}px ${Space[5]}px`,
          marginTop: Space[6], marginBottom: Space[4],
          borderRadius: Radius.lg,
          background: alpha(Color.green, 0.06),
          border: `1px solid ${alpha(Color.green, 0.15)}`,
        }}>
          <FIcon path={ICONS.check} size={14} color={Color.green} stroke={2.5} />
          <div style={{ ...Type.bodyMd, color: Color.text }}>{todayEntry.name}</div>
          <FTag tone="green" size="sm" style={{ marginLeft: 'auto' }}>DONE</FTag>
        </div>
      )}

      {/* ── Remaining Sessions ── */}
      <div style={{ marginTop: Space[4] }}>
        {trainingDays.filter(entry => entry.dayIndex !== todayIndex).map((entry, idx, arr) => {
          const status = getStatus(entry)
          const isDone = status === 'done'
          const isMissed = status === 'missed'
          const nonUtil = entry.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
          const hasGroups = nonUtil.some(e => e.groupType)
          const coreExercises = hasGroups ? flattenSessionExercises(nonUtil) : nonUtil

          return (
            <div key={entry.day}>
              <div onClick={() => !isDone && pushDetail('active-session', entry.name, { session: entry })} style={{
                display: 'flex', alignItems: 'center', gap: Space[3],
                padding: `${Space[4]}px 0`,
                opacity: isMissed ? 0.45 : 1,
                cursor: isDone ? 'default' : 'pointer',
              }}>
                <FMono color={Color.mute} size={11} style={{ width: 28, flexShrink: 0 }}>
                  {entry.day.slice(0, 3).toUpperCase()}
                </FMono>
                <div style={{ ...Type.bodyMd, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.name}
                </div>
                <FMono color={Color.faint} size={10}>{coreExercises.length} exercises</FMono>
                {isDone && <FTag tone="green" size="sm">DONE</FTag>}
                {isMissed && <FTag tone="mute" size="sm">MISSED</FTag>}
                {!isDone && !isMissed && (
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: alpha(Color.accent, 0.08),
                    display: 'grid', placeItems: 'center',
                  }}>
                    <FIcon path={ICONS.play} size={10} color={Color.accent} />
                  </div>
                )}
              </div>
              {idx < arr.length - 1 && (
                <div style={{ height: 1, background: Color.borderSoft }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Rest Days ── */}
      {restDays.length > 0 && (
        <div style={{
          marginTop: Space[3],
          display: 'flex', alignItems: 'center', gap: Space[2],
          padding: '10px 0',
        }}>
          <FMono color={Color.faint} size={10}>
            REST · {restDays.map(d => d.day.slice(0, 3).toUpperCase()).join(', ')}
          </FMono>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div style={{ display: 'flex', gap: 8, marginTop: Space[5], flexWrap: 'wrap' }}>
        {[
          { icon: ICONS.search, label: 'Exercises', action: () => pushDetail('exercises', 'Exercises') },
          { icon: ICONS.dumb, label: 'History', action: () => pushDetail('workout-history', 'History') },
          { icon: ICONS.goal, label: plan.goals?.[0]?.replace(/_/g, ' ') || 'Goal', action: plan.goals?.[0] ? () => pushDetail('goal-detail', 'Goal', { goalKey: plan.goals[0] }) : null },
        ].filter(a => a.action).map(a => (
          <button key={a.label} onClick={a.action} style={{
            flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: Radius.md,
            background: Color.surface, border: `1px solid ${Color.borderSoft}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FIcon path={a.icon} size={14} color={Color.dim} stroke={1.8} />
            <FMono size={10} color={Color.dim}>{a.label}</FMono>
          </button>
        ))}
      </div>

      {/* ── Advance Week (prototype) ── */}
      {currentWeek < totalWeeks && (
        <div style={{ marginTop: Space[6] }}>
          <FBtn variant="ghost" size="sm" full onClick={advanceWeek} data-stay="true">
            Next week →
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
