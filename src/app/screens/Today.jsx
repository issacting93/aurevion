// ════════════════════════════════════════════════════════════
// Today — the default landing screen. One directive per day.
// Training day: session hero + Start. Rest day: recovery + next.
// Replaces Dashboard as the first thing you see.
// ════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, FTag, FTexBar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { MODALITY_COLORS, flattenSessionExercises, computeSessionVolume } from './fitness-data'
import { MOCK_WATER } from '../../context/mockUser'

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

/* ── Last-time weights from activity log ── */
function getLastTimeWeights(activityLog, sessionName) {
  if (!activityLog?.length || !sessionName) return null
  const prev = [...activityLog]
    .filter(e => e.type === 'workout' && e.data?.name === sessionName)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  if (!prev?.data?.loggedSets) return null
  return prev.data.loggedSets
    .filter(ex => ex.logged?.length > 0)
    .slice(0, 3)
    .map(ex => {
      const maxLoad = Math.max(...ex.logged.map(s => s.load || 0))
      const maxReps = ex.logged[0]?.reps || 0
      return { name: ex.name, load: maxLoad, reps: maxReps }
    })
    .filter(e => e.load > 0)
}

/* ── Equipment list from session exercises ── */
function getEquipmentList(session) {
  if (!session?.exercises) return []
  const flat = flattenSessionExercises(session.exercises)
  const equip = new Set(flat.map(e => e.equipment).filter(Boolean).filter(e => e !== 'bodyweight'))
  return [...equip]
}

/* ── Last session volume for comparison ── */
function getLastVolume(activityLog, sessionName) {
  if (!activityLog?.length || !sessionName) return null
  const prev = [...activityLog]
    .filter(e => e.type === 'workout' && e.data?.name === sessionName)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  if (!prev?.data?.loggedSets) return null
  return computeSessionVolume(prev.data.loggedSets)
}

export function TodayContent({ onStartSession }) {
  const { workoutPlan: plan, targets, activityLog, checkins } = useUser()
  const { pushDetail } = useNav()
  const todayIndex = getTodayIndex()

  // Water data (mock for now)
  const water = MOCK_WATER

  if (!plan) {
    return (
      <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: alpha(Color.accent, 0.10),
          display: 'grid', placeItems: 'center',
        }}>
          <FIcon path={ICONS.flame} size={28} color={Color.accent} stroke={1.5} />
        </div>
        <div style={{ ...Type.headingLg }}>Ready when you are</div>
        <div style={{ ...Type.bodyMd, color: Color.dim, maxWidth: 260, lineHeight: 1.5 }}>
          Complete onboarding to get your personalized training plan and daily directives.
        </div>
        <FBtn variant="primary" size="lg" data-stay="true">Get started</FBtn>
      </div>
    )
  }

  const todayEntry = plan.schedule.find(s => s.dayIndex === todayIndex)
  const isRest = !todayEntry || todayEntry.isRest
  const isDone = todayEntry && !todayEntry.isRest && todayEntry.completed
  const nextTraining = plan.schedule.find(s => !s.isRest && s.dayIndex > todayIndex && !s.completed)
  // Last-time weights
  const lastWeights = !isRest && todayEntry ? getLastTimeWeights(activityLog, todayEntry.name) : null
  const equipment = !isRest && todayEntry ? getEquipmentList(todayEntry) : []
  const lastVolume = !isRest && todayEntry ? getLastVolume(activityLog, todayEntry.name) : null

  // Core exercises for preview
  const coreExercises = useMemo(() => {
    if (isRest || !todayEntry?.exercises) return []
    const nonUtil = todayEntry.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
    const hasGroups = nonUtil.some(e => e.groupType)
    return hasGroups ? flattenSessionExercises(nonUtil) : nonUtil
  }, [todayEntry, isRest])

  const handleStart = (session) => {
    const target = session || todayEntry
    if (onStartSession && target) onStartSession(target)
  }

  // Find the first available (unfinished, non-rest) session for "train now" fallback
  const nextAvailable = plan.schedule.find(s => !s.isRest && !s.completed)
  const showTrainNow = (isRest || isDone) && nextAvailable

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* ── Date header ── */}
      <FMono size={10} color={Color.mute}>
        TODAY · {DAY_NAMES[todayIndex].toUpperCase()} {new Date().getDate()} {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][new Date().getMonth()]}
      </FMono>

      {/* ── REST DAY ── */}
      {isRest && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1, marginBottom: 8 }}>
            Rest day
          </div>
          <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5, marginBottom: 20 }}>
            Recovery is part of the program. Your body builds muscle during rest, not during the workout.
          </div>
          {nextTraining && (
            <div style={{
              padding: `${Space[4]}px ${Space[5]}px`, borderRadius: Radius.xl,
              background: Color.surface, border: `1px solid ${Color.borderSoft}`,
              marginBottom: 12,
            }}>
              <FMono size={10} color={Color.mute} style={{ marginBottom: 8, display: 'block' }}>NEXT SESSION · {nextTraining.day.toUpperCase()}</FMono>
              <div style={{ ...Type.bodyLg, fontWeight: 500, color: Color.text, marginBottom: 4 }}>{nextTraining.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <FMono size={10} color={Color.mute}>~{nextTraining.estimatedMins} min</FMono>
                <FMono size={10} color={Color.faint}>·</FMono>
                <FMono size={10} color={Color.mute}>{(nextTraining.exercises?.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')?.length) || '?'} exercises</FMono>
              </div>
              <FBtn variant="primary" full icon={ICONS.play} onClick={() => handleStart(nextTraining)} data-stay="true">
                Start early
              </FBtn>
            </div>
          )}
        </div>
      )}

      {/* ── COMPLETED ── */}
      {isDone && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <FIcon path={ICONS.check} size={20} color={Color.green} stroke={2.5} />
            <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1 }}>Done</div>
          </div>
          <div style={{ ...Type.bodyMd, color: Color.dim, marginBottom: 20 }}>
            {todayEntry.name} — session complete.
          </div>
          {nextTraining && (
            <div style={{
              padding: `${Space[4]}px ${Space[5]}px`, borderRadius: Radius.xl,
              background: Color.surface, border: `1px solid ${Color.borderSoft}`,
              marginBottom: 12,
            }}>
              <FMono size={10} color={Color.mute} style={{ marginBottom: 8, display: 'block' }}>UP NEXT · {nextTraining.day.toUpperCase()}</FMono>
              <div style={{ ...Type.bodyLg, fontWeight: 500, color: Color.text, marginBottom: 4 }}>{nextTraining.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <FMono size={10} color={Color.mute}>~{nextTraining.estimatedMins} min</FMono>
                <FMono size={10} color={Color.faint}>·</FMono>
                <FMono size={10} color={Color.mute}>{(nextTraining.exercises?.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')?.length) || '?'} exercises</FMono>
              </div>
              <FBtn variant="primary" full icon={ICONS.play} onClick={() => handleStart(nextTraining)} data-stay="true">
                Start next session
              </FBtn>
            </div>
          )}
        </div>
      )}

      {/* ── TRAINING DAY ── */}
      {!isRest && !isDone && todayEntry && (
        <div style={{ marginTop: 16 }}>
          {/* Session name */}
          <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1, marginBottom: 4 }}>
            {todayEntry.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <FMono size={10} color={Color.mute}>~{todayEntry.estimatedMins} min</FMono>
            {equipment.length > 0 && (
              <>
                <FMono size={10} color={Color.faint}>·</FMono>
                <FMono size={10} color={Color.mute}>{equipment.join(' · ')}</FMono>
              </>
            )}
          </div>

          {/* Last time weights */}
          {lastWeights && lastWeights.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <FMono size={10} color={Color.faint} style={{ marginBottom: 6, display: 'block' }}>LAST TIME</FMono>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {lastWeights.map((w, i) => (
                  <FMono key={i} size={10} color={Color.dim}>{w.name} {w.load}kg × {w.reps}</FMono>
                ))}
              </div>
            </div>
          )}

          {/* Start CTA */}
          <FBtn variant="split" full iconLeading={ICONS.play} onClick={handleStart} data-stay="true" style={{ marginBottom: 20 }}>
            Start session
          </FBtn>
        </div>
      )}

      {/* ── Remaining sessions ── */}
      <div style={{ marginBottom: 20 }}>
        {plan.schedule
          .filter(s => !s.isRest && s.dayIndex !== todayIndex)
          .map((entry, i, arr) => (
            <div key={entry.day}
              onClick={() => !entry.completed && handleStart(entry)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${Color.borderSoft}` : 'none',
                opacity: entry.completed ? 0.5 : 1,
                cursor: entry.completed ? 'default' : 'pointer',
              }}>
              <FMono size={10} color={Color.mute} style={{ width: 26, flexShrink: 0 }}>{entry.day.slice(0, 3).toUpperCase()}</FMono>
              <div style={{ flex: 1, ...Type.bodySm, color: Color.text }}>{entry.name}</div>
              {entry.completed
                ? <FMono size={10} color={Color.green}>DONE</FMono>
                : <FIcon path={ICONS.play} size={12} color={Color.faint} />
              }
            </div>
          ))}
      </div>

      {/* ── Daily trackers ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', borderTop: `1px solid ${Color.borderSoft}`,
      }}>
        <div>
          <FMono size={10} color={Color.faint} style={{ display: 'block', marginBottom: 3 }}>WATER</FMono>
          <FMono size={11} color={Color.dim}>{water.trend7d[6].toLocaleString()} / {water.target.toLocaleString()} ml</FMono>
        </div>
        {targets && (
          <div style={{ textAlign: 'right' }}>
            <FMono size={10} color={Color.faint} style={{ display: 'block', marginBottom: 3 }}>TARGET</FMono>
            <FMono size={11} color={Color.dim}>{targets.target?.toLocaleString()} kcal</FMono>
          </div>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
        {showTrainNow && (
          <button onClick={() => handleStart(nextAvailable)} style={{
            padding: '10px 12px', borderRadius: Radius.md,
            background: alpha(Color.accent, 0.08), border: `1px solid ${alpha(Color.accent, 0.2)}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FIcon path={ICONS.play} size={14} color={Color.accent} stroke={1.8} />
            <FMono size={10} color={Color.accent}>Train now</FMono>
          </button>
        )}
        <button onClick={() => pushDetail('exercises', 'Exercises')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.search} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>Exercises</FMono>
        </button>
        <button onClick={() => pushDetail('workout-history', 'History')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.timer} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>History</FMono>
        </button>
        <button onClick={() => pushDetail('checkin-flow', 'Check-in')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.chart} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>Check-in</FMono>
        </button>
      </div>
    </div>
  )
}

export function TodayScreen() {
  return (
    <Phone label="Today" group="HOME">
      <TodayContent />
    </Phone>
  )
}
