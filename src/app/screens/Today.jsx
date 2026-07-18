// ════════════════════════════════════════════════════════════
// Today — the default landing screen. One directive per day.
// Greeting → stats → session hero → schedule → goal → macros → trackers → actions
// ════════════════════════════════════════════════════════════

import { useMemo } from 'react'
import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FMono, FIcon, FBtn, FAvatar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { flattenSessionExercises } from './fitness-data'
import { BodyMap, musclesToIntensities } from './BodyMap'
import { MOCK_WATER, MOCK_VOLUME_WEEKS, MOCK_HEATMAP } from '../../context/mockUser'

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning.'
  if (h < 17) return 'Good afternoon.'
  return 'Good evening.'
}

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

export function TodayContent({ onStartSession }) {
  const { workoutPlan: plan, activityLog, profile, markSessionComplete } = useUser()
  const { pushDetail } = useNav()
  const todayIndex = getTodayIndex()

  // ── Analytics signals ──
  const volDelta = useMemo(() => {
    if (MOCK_VOLUME_WEEKS.length < 2) return null
    const cur = MOCK_VOLUME_WEEKS[MOCK_VOLUME_WEEKS.length - 1].value
    const prev = MOCK_VOLUME_WEEKS[MOCK_VOLUME_WEEKS.length - 2].value
    return Math.round(((cur - prev) / prev) * 100)
  }, [])
  const proteinHitDays = useMemo(() => {
    const lastWeek = MOCK_HEATMAP.protein[MOCK_HEATMAP.protein.length - 1] || []
    return lastWeek.filter(v => v >= 85).length
  }, [])
  const waterAvgStr = useMemo(() => {
    const avg = MOCK_WATER.trend7d.reduce((a, b) => a + b, 0) / MOCK_WATER.trend7d.length
    return (avg / 1000).toFixed(1)
  }, [])

  const missedSession = useMemo(() => {
    if (!plan) return null
    const yIdx = todayIndex === 0 ? 6 : todayIndex - 1
    return plan.schedule.find(s => s.dayIndex === yIdx && !s.isRest && !s.completed) || null
  }, [plan, todayIndex])

  const todayIntensities = useMemo(() => {
    if (!plan) return {}
    const entry = plan.schedule.find(s => s.dayIndex === todayIndex)
    if (!entry || entry.isRest) return {}
    const flat = flattenSessionExercises(entry.exercises || [])
    return musclesToIntensities(flat)
  }, [plan, todayIndex])

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
  const lastWeights = !isRest && todayEntry ? getLastTimeWeights(activityLog, todayEntry.name) : null
  const equipment = !isRest && todayEntry ? getEquipmentList(todayEntry) : []

  const handleStart = (session) => {
    const target = session || todayEntry
    if (onStartSession && target) onStartSession(target)
  }

  const nextAvailable = plan.schedule.find(s => !s.isRest && !s.completed)
  const showTrainNow = (isRest || isDone) && nextAvailable

  // Initials for avatar
  const initials = profile?.name ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'Z'

  return (
    <div style={{ flex: 1, padding: '20px 24px 100px', overflowY: 'auto' }}>

      {/* ── Greeting + Avatar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ ...Type.displaySm, color: Color.text }}>{getGreeting()}</div>
        <FAvatar initials={initials} size={36} />
      </div>

      {/* ── Date header ── */}
      <FMono size={10} color={Color.mute}>
        TODAY · {DAY_NAMES[todayIndex].toUpperCase()} {new Date().getDate()} {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][new Date().getMonth()]}
      </FMono>

      {/* ── Body Map (training days only) ── */}
      {!isRest && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <FMono size={9} color={Color.mute} style={{ display: 'block', marginBottom: 10, letterSpacing: 1 }}>
            TODAY'S TARGET
          </FMono>
          <BodyMap intensities={todayIntensities} style={{ width: '50%', margin: '0 auto' }} />
        </div>
      )}

      {/* ── REST DAY ── */}
      {isRest && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1, marginBottom: 8 }}>
            Rest day
          </div>
          <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5, marginBottom: 10 }}>
            Recovery is part of the program. Your body builds muscle during rest, not during the workout.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <FMono size={10} color={Color.dim}>Protein {proteinHitDays}/7 days</FMono>
            <FMono size={10} color={Color.faint}>·</FMono>
            <FMono size={10} color={Color.dim}>Water avg {waterAvgStr}L</FMono>
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
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <FIcon path={ICONS.check} size={20} color={Color.green} stroke={2.5} />
            <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1 }}>Done</div>
          </div>
          <div style={{ ...Type.bodyMd, color: Color.dim, marginBottom: 10 }}>
            {todayEntry.name} — session complete.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <FMono size={10} color={Color.dim}>Protein {proteinHitDays}/7 days</FMono>
            <FMono size={10} color={Color.faint}>·</FMono>
            <FMono size={10} color={Color.dim}>Water avg {waterAvgStr}L</FMono>
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
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1, marginBottom: 4 }}>
            {todayEntry.name}
          </div>
          {/* Duration + equipment chips */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            <FMono size={10} color={Color.mute}>~{todayEntry.estimatedMins} min</FMono>
            {equipment.slice(0, 3).map(e => (
              <FMono key={e} size={9} color={Color.faint} style={{
                padding: '2px 7px', borderRadius: 4,
                border: `1px solid ${Color.borderSoft}`,
                textTransform: 'lowercase',
              }}>{e.replace(/_/g, ' ')}</FMono>
            ))}
          </div>
          <FBtn variant="split" full iconLeading={ICONS.play} onClick={handleStart} data-stay="true">
            Start session
          </FBtn>
          {/* Signals: volume trend + last-time weights */}
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {volDelta !== null && (
              <FMono size={10} color={volDelta >= 0 ? Color.green : Color.accent}>
                {volDelta >= 0 ? '↑' : '↓'}{Math.abs(volDelta)}% volume vs last week
              </FMono>
            )}
            {lastWeights?.length > 0 && (
              <FMono size={10} color={Color.faint}>
                Last time · {lastWeights.map(w => `${w.name.split(' ')[0]} ${w.load}kg`).join(' · ')}
              </FMono>
            )}
          </div>
        </div>
      )}

      {/* ── Remaining sessions ── */}
      <div style={{ marginTop: 20, marginBottom: missedSession ? 12 : 24 }}>
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
              <FMono size={10} color={Color.mute} style={{ width: 30, flexShrink: 0 }}>{entry.day.slice(0, 3).toUpperCase()}</FMono>
              <div style={{ flex: 1, ...Type.bodySm, color: Color.text }}>{entry.name}</div>
              {entry.completed
                ? <FMono size={10} color={Color.green}>DONE</FMono>
                : <FIcon path={ICONS.play} size={12} color={Color.faint} />
              }
            </div>
          ))}
      </div>

      {/* ── Missed session nudge ── */}
      {missedSession && (
        <div style={{
          marginBottom: 24, padding: '8px 10px', borderRadius: Radius.md,
          background: `${Color.amber}08`, border: `1px solid ${Color.amber}20`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `${Color.amber}18`,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <FIcon path={ICONS.timer} size={14} color={Color.amber} stroke={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FMono size={10} color={Color.amber} style={{ display: 'block' }}>Missed</FMono>
            <FMono size={9} color={Color.dim} style={{ display: 'block', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {missedSession.name}
            </FMono>
          </div>
          <button
            onClick={() => handleStart(missedSession)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `${Color.accent}18`, border: `1px solid ${Color.accent}30`,
              display: 'grid', placeItems: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <FIcon path={ICONS.play} size={12} color={Color.accent} stroke={2} />
          </button>
          <button
            onClick={() => markSessionComplete(missedSession.id || missedSession.dayIndex)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${Color.borderSoft}`,
              display: 'grid', placeItems: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <FIcon path={ICONS.close} size={12} color={Color.mute} stroke={2} />
          </button>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
