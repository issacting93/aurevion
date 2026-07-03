// ════════════════════════════════════════════════════════════
// Plan Calendar — Month + Week + Day views wired to real
// workout plan data. Bold hierarchy, generous spacing.
// ════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, FTag, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { MODALITY_COLORS } from './fitness-data'

// ── Date helpers ──

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function getWeekDates() {
  const now = new Date()
  const todayIdx = getTodayIndex()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - todayIdx + i)
    return d
  })
}

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells = []
  const prevDays = new Date(year, month, 0).getDate()
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ n: prevDays - i, mute: true, dayIndex: -1 })
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    const dow = d.getDay()
    cells.push({ n: i, dayIndex: dow === 0 ? 6 : dow - 1 })
  }
  let next = 1
  while (cells.length < 35) cells.push({ n: next++, mute: true, dayIndex: -1 })
  return cells
}

// ── Illustrative non-training events ──

const ILLUSTRATIVE_MEALS = {
  1: { k: 'meal', i: ICONS.meal, c: Color.blue, label: 'Lunch', t: '12:30', dur: '540 kcal', sub: 'Chicken bowl' },
  3: { k: 'meal', i: ICONS.meal, c: Color.blue, label: 'Dinner', t: '19:00', dur: '620 kcal', sub: 'Salmon + greens' },
  5: { k: 'meal', i: ICONS.meal, c: Color.blue, label: 'Dinner', t: '19:00', dur: '580 kcal', sub: 'Tofu stir-fry' },
}

const ILLUSTRATIVE_CHECKINS = {
  6: { k: 'check', i: ICONS.goal, c: Color.purple, label: 'Weigh-in', t: '08:00', dur: 'check-in', sub: 'Body fat + weight' },
}

// ── Month grid ──

function MonthGrid({ plan, trainingDaySet, selected, onSelect }) {
  const now = new Date()
  const todayDate = now.getDate()
  const cells = useMemo(() => getMonthGrid(now.getFullYear(), now.getMonth()), [])
  const headers = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const mealDays = new Set(Object.keys(ILLUSTRATIVE_MEALS).map(Number))
  const checkinDays = new Set(Object.keys(ILLUSTRATIVE_CHECKINS).map(Number))

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 8 }}>
        {headers.map((h, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: Font.mono, fontSize: 10, color: Color.mute, padding: '6px 0' }}>{h}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((c, i) => {
          const isSel = !c.mute && c.n === selected
          const isToday = !c.mute && c.n === todayDate
          const hasTrain = !c.mute && trainingDaySet.has(c.dayIndex)
          const hasMeal = !c.mute && mealDays.has(c.dayIndex)
          const hasCheckin = !c.mute && checkinDays.has(c.dayIndex)

          return (
            <div key={i}
              onClick={() => !c.mute && onSelect(c.n)}
              style={{
                aspectRatio: '1 / 1.05',
                borderRadius: 8,
                border: `1px solid ${isSel ? Color.accent : (isToday ? 'rgba(255,255,255,0.06)' : Color.borderSoft)}`,
                background: isSel ? 'rgba(255,110,80,0.10)' : (isToday ? 'rgba(255,110,80,0.04)' : 'transparent'),
                padding: '5px 6px', cursor: c.mute ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'background .12s, border-color .12s',
              }}>
              <div style={{
                fontFamily: Font.mono, fontSize: 12, fontWeight: isSel || isToday ? 600 : 400,
                color: c.mute ? Color.faint : (isSel || isToday ? Color.accent : Color.text),
              }}>{c.n}</div>
              <div style={{ display: 'flex', gap: 3 }}>
                {hasTrain   && <span style={{ width: 5, height: 5, borderRadius: 1.5, background: Color.accent }} />}
                {hasMeal    && <span style={{ width: 5, height: 5, borderRadius: 1.5, background: Color.blue }} />}
                {hasCheckin && <span style={{ width: 5, height: 5, borderRadius: 1.5, background: Color.purple }} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected day summary */}
      <FSurface style={{ marginTop: 28, padding: 20, borderRadius: Radius.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <FLabel mb={4}>{MONTH_NAMES[now.getMonth()]} {selected}</FLabel>
          <FMono color={Color.text} size={11}>
            {(() => {
              const selDate = new Date(now.getFullYear(), now.getMonth(), selected)
              const selDow = selDate.getDay()
              const selIdx = selDow === 0 ? 6 : selDow - 1
              const events = []
              if (trainingDaySet.has(selIdx)) events.push('TRAIN')
              if (mealDays.has(selIdx)) events.push('MEAL')
              if (checkinDays.has(selIdx)) events.push('CHECK-IN')
              return events.length > 0 ? `${events.length} EVENTS · ${events.join(', ')}` : 'REST DAY'
            })()}
          </FMono>
        </div>
        <FBtn variant="ghost" size="sm" icon={ICONS.fwd} data-stay="true">View day</FBtn>
      </FSurface>
    </>
  )
}

function Legend({ color, l, n }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Space[2] }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      <span style={{ fontFamily: Font.mono, fontSize: 11, color: Color.mute, letterSpacing: 1 }}>{l}</span>
      <span style={{ fontFamily: Font.mono, fontSize: 11, color: Color.text }}>{n}</span>
    </div>
  )
}

// ── Week grid ──

function WeekGrid({ plan, onStartSession }) {
  const todayIdx = getTodayIndex()
  const weekDates = useMemo(() => getWeekDates(), [])

  const days = useMemo(() => {
    if (!plan?.schedule) return []
    return plan.schedule.map((entry, i) => {
      const date = weekDates[i]
      const events = []

      if (!entry.isRest) {
        events.push({
          k: 'train',
          i: ICONS.dumb,
          c: MODALITY_COLORS[entry.modalityLabel] || Color.accent,
          label: entry.name,
          t: '07:00',
          dur: `${entry.estimatedMins} m`,
          sub: `${entry.modalityLabel} · ${entry.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown').length} exercises`,
          done: entry.completed || false,
          session: entry,
        })
      }

      if (ILLUSTRATIVE_MEALS[entry.dayIndex]) {
        events.push({ ...ILLUSTRATIVE_MEALS[entry.dayIndex], done: entry.dayIndex < todayIdx })
      }
      if (ILLUSTRATIVE_CHECKINS[entry.dayIndex]) {
        events.push({ ...ILLUSTRATIVE_CHECKINS[entry.dayIndex], done: entry.dayIndex < todayIdx })
      }

      return {
        d: entry.day.toUpperCase().slice(0, 3),
        n: date ? date.getDate() : i + 1,
        today: entry.dayIndex === todayIdx,
        e: events,
      }
    })
  }, [plan, weekDates, todayIdx])

  const [sel, setSel] = useState({ d: Math.min(todayIdx, days.length - 1), e: 0 })
  const [detailKey, setDetailKey] = useState(0)
  const selDay = days[sel.d]
  const selEvent = selDay && selDay.e[sel.e]

  const selectDay = (dayIdx) => {
    const day = days[dayIdx]
    setSel({ d: dayIdx, e: day?.e.length > 0 ? 0 : -1 })
    setDetailKey(k => k + 1)
  }

  const selectEvent = (dayIdx, eventIdx) => {
    setSel({ d: dayIdx, e: eventIdx })
    setDetailKey(k => k + 1)
  }

  const nextEvent = () => {
    if (!selDay || selDay.e.length <= 1) return
    setSel(s => ({ ...s, e: (s.e + 1) % selDay.e.length }))
    setDetailKey(k => k + 1)
  }

  const trainCount = days.reduce((s, d) => s + d.e.filter(e => e.k === 'train').length, 0)
  const mealCount = days.reduce((s, d) => s + d.e.filter(e => e.k === 'meal').length, 0)
  const checkinCount = days.reduce((s, d) => s + d.e.filter(e => e.k === 'check').length, 0)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: Space[2] }}>
        {days.map((day, i) => {
          const dayActive = sel.d === i
          const isPast = i < todayIdx
          return (
            <div key={i}
              onClick={() => selectDay(i)}
              style={{
                border: `1.5px solid ${dayActive || day.today ? Color.accent : 'transparent'}`,
                background: dayActive || day.today ? 'rgba(255,110,80,0.03)' : 'transparent',
                borderRadius: 12, padding: '10px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 130,
                cursor: 'pointer',
                transition: 'border-color .15s ease, background .15s ease',
              }}>
              <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 1 }}>{day.d}</div>
              <div style={{
                fontFamily: Font.mono, fontSize: 16, fontWeight: day.today || dayActive ? 600 : 400,
                color: day.today ? Color.accent : (isPast ? Color.dim : Color.text),
              }}>{day.n}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {day.e.map((ev, j) => {
                  const active = sel.d === i && sel.e === j
                  return (
                    <button key={j}
                      onClick={(e) => { e.stopPropagation(); selectEvent(i, j) }}
                      style={{
                        position: 'relative',
                        width: 38, height: 38, borderRadius: 10,
                        background: ev.c,
                        display: 'grid', placeItems: 'center', cursor: 'pointer',
                        border: 'none', padding: 0,
                        boxShadow: active ? `0 0 0 2px ${Color.bg}, 0 0 0 3.5px ${ev.c}` : 'none',
                        transition: 'box-shadow .15s ease, transform .12s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: active ? 'scale(1.08)' : 'scale(1)',
                        opacity: ev.done && !active ? 0.65 : 1,
                      }}>
                      <FIcon path={ev.i} size={18} color={Color.surface} stroke={1.8} />
                      {ev.done && (
                        <div style={{
                          position: 'absolute', top: -3, right: -3,
                          width: 14, height: 14, borderRadius: '50%',
                          background: Color.green, border: `2px solid ${Color.bg}`,
                          display: 'grid', placeItems: 'center',
                        }}>
                          <FIcon path={ICONS.check} size={8} color={Color.surface} stroke={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected event detail */}
      <div key={detailKey} style={{ animation: 'fStaggerIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        {selEvent ? (
          <FSurface style={{
            marginTop: 36, padding: 20, borderRadius: Radius.lg,
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: selEvent.c,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <FIcon path={selEvent.i} size={24} color={Color.surface} stroke={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <FLabel mb={2} color={selEvent.c}>{selDay.d} {selDay.n} · {selEvent.t}</FLabel>
                <FMono color={Color.mute}>{selEvent.dur}</FMono>
              </div>
              <div style={{ ...Type.headingMd, fontSize: 20, marginTop: 6 }}>
                {selEvent.label}
                {selEvent.done && <span style={{ marginLeft: 8 }}><FIcon path={ICONS.check} size={14} color={Color.green} stroke={2.4} /></span>}
              </div>
              <div style={{ ...Type.bodyMd, color: Color.dim, marginTop: 4 }}>{selEvent.sub}</div>
              <div style={{ marginTop: 16, display: 'flex', gap: Space[2], alignItems: 'center' }}>
                {selEvent.session && !selEvent.done && onStartSession ? (
                  <FBtn variant="primary" size="sm" icon={ICONS.play}
                    onClick={() => onStartSession(selEvent.session)} data-stay="true">
                    Start session
                  </FBtn>
                ) : selEvent.session && selEvent.done ? (
                  <FTag tone="green" size="sm">COMPLETED</FTag>
                ) : (
                  <FBtn variant="ghost" size="sm" icon={ICONS.fwd} data-stay="true">Open details</FBtn>
                )}
                {selDay.e.length > 1 && (
                  <button onClick={nextEvent} data-stay="true" style={{
                    background: 'transparent', border: `1px solid ${Color.borderSoft}`,
                    borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: Color.dim,
                    fontFamily: Font.mono, fontSize: 10, letterSpacing: 1,
                  }}>{sel.e + 1}/{selDay.e.length} ↓</button>
                )}
              </div>
            </div>
          </FSurface>
        ) : (
          <div style={{
            marginTop: 28, padding: 20, borderRadius: Radius.lg,
            background: Color.surface, border: `1px dashed ${Color.borderSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <FIcon path={ICONS.plus} size={14} color={Color.mute} stroke={1.5} />
            <FMono color={Color.mute}>{selDay?.d} {selDay?.n} · REST DAY</FMono>
          </div>
        )}
      </div>

      <FSurface style={{ marginTop: 28, padding: 18, borderRadius: Radius.lg, display: 'flex', gap: 20 }}>
        <Legend color={Color.accent} l="TRAIN" n={trainCount} />
        <Legend color={Color.blue} l="MEAL" n={mealCount} />
        <Legend color={Color.purple} l="CHECK-IN" n={checkinCount} />
      </FSurface>
    </>
  )
}

// ── Day view ──

function DayView({ plan, onStartSession }) {
  const todayIdx = getTodayIndex()
  const todayEntry = plan?.schedule?.find(e => e.dayIndex === todayIdx)
  const now = new Date()
  const dayLabel = DAY_NAMES[todayIdx]

  const START_HOUR = 6
  const END_HOUR = 23
  const HOUR_PX = 52
  const TOTAL_HOURS = END_HOUR - START_HOUR
  const HEIGHT = TOTAL_HOURS * HOUR_PX

  const events = useMemo(() => {
    const evs = []
    if (todayEntry && !todayEntry.isRest) {
      evs.push({
        l: todayEntry.name,
        time: '07:00',
        sub: `${todayEntry.estimatedMins} MIN · ${todayEntry.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown').length} EXERCISES`,
        c: MODALITY_COLORS[todayEntry.modalityLabel] || Color.accent,
        startH: 7,
        durH: todayEntry.estimatedMins / 60,
        done: todayEntry.completed || false,
        session: todayEntry,
      })
    }
    evs.push(
      { l: 'Breakfast', time: '08:30', sub: '420 KCAL', c: Color.blue, startH: 8.5, durH: 0.5, done: true },
      { l: 'Lunch', time: '12:30', sub: '540 KCAL · CHICKEN BOWL', c: Color.blue, startH: 12.5, durH: 0.75, done: true },
      { l: 'Dinner', time: '19:00', sub: '620 KCAL · SALMON', c: Color.blue, startH: 19, durH: 0.75 },
      { l: 'Sleep', time: '22:30', sub: '7.5 H TARGET', c: Color.purple, startH: 22.5, durH: 0.5 },
    )
    return evs.sort((a, b) => a.startH - b.startH)
  }, [todayEntry])

  const currentHour = now.getHours() + now.getMinutes() / 60
  const toY = (h) => (h - START_HOUR) * HOUR_PX
  const nextEv = events.find(e => !e.done && e.startH >= currentHour) || events.find(e => !e.done)
  const completedCount = events.filter(e => e.done).length

  const hourLabels = []
  for (let h = START_HOUR; h <= END_HOUR; h += 2) hourLabels.push(h)

  return (
    <div>
      {/* Day hero */}
      <FSurface accent={Color.accent} style={{ padding: 20, borderRadius: Radius.lg }}>
        <FMono color={Color.accent} size={10}>{dayLabel.toUpperCase()} · {MONTH_NAMES[now.getMonth()].toUpperCase()} {now.getDate()}</FMono>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
          <FNum size={56} weight={200}>{now.getDate()}</FNum>
          <div>
            <FMono color={Color.mute} size={10}>{events.length} EVENTS · {completedCount} DONE</FMono>
            <div style={{ marginTop: 6 }}>
              <FMono color={completedCount > 0 ? Color.green : Color.dim} size={10}>
                {completedCount > 0 ? 'ON PACE' : 'PENDING'}
              </FMono>
            </div>
          </div>
        </div>
      </FSurface>

      {/* Up next */}
      {nextEv && (
        <FSurface style={{
          marginTop: 28, padding: 20, borderRadius: Radius.lg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <FMono color={Color.mute} size={10}>UP NEXT · {nextEv.time}</FMono>
            <div style={{ ...Type.headingMd, fontSize: 18, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextEv.l}</div>
          </div>
          {nextEv.session && onStartSession ? (
            <FBtn variant="primary" style={{ width: 52, height: 52, borderRadius: '50%', padding: 0, minHeight: 0 }}
              onClick={() => onStartSession(nextEv.session)}>
              <FIcon path={ICONS.play} size={20} color={Color.accentText} stroke={2.4} />
            </FBtn>
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: nextEv.c, display: 'grid', placeItems: 'center',
            }}>
              <FIcon path={ICONS.fwd} size={20} color={Color.surface} stroke={2.4} />
            </div>
          )}
        </FSurface>
      )}

      {/* Timeline */}
      <FSurface style={{ marginTop: 28, position: 'relative', height: HEIGHT,
        borderRadius: Radius.lg, padding: '0 16px 0 48px', overflow: 'hidden',
      }}>
        {hourLabels.map((h) => (
          <div key={h} style={{
            position: 'absolute', left: 0, right: 16,
            top: toY(h), height: 1, background: Color.borderSoft,
          }}>
            <span style={{
              position: 'absolute', left: 6, top: -7,
              fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 0.8,
            }}>{String(h).padStart(2, '0')}</span>
          </div>
        ))}

        {currentHour >= START_HOUR && currentHour <= END_HOUR && (
          <div style={{
            position: 'absolute', left: 34, right: 16,
            top: toY(currentHour), height: 2, background: Color.accent, zIndex: 2,
          }}>
            <div style={{
              position: 'absolute', right: 4, top: -8,
              fontFamily: Font.mono, fontSize: 10, color: Color.accent, letterSpacing: 1,
              background: Color.surface, padding: '1px 6px', borderRadius: 3,
            }}>NOW · {String(Math.floor(currentHour)).padStart(2, '0')}:{String(Math.round((currentHour % 1) * 60)).padStart(2, '0')}</div>
          </div>
        )}

        {events.map((ev, i) => {
          const top = toY(ev.startH)
          const h = Math.max(44, ev.durH * HOUR_PX)
          const isActive = nextEv === ev
          return (
            <div key={i}
              onClick={() => ev.session && onStartSession && !ev.done && onStartSession(ev.session)}
              style={{
                position: 'absolute', left: 48, right: 16,
                top, height: h,
                borderRadius: 8, padding: '8px 12px',
                background: isActive ? `${ev.c}25` : `${ev.c}0f`,
                opacity: ev.done ? 0.45 : 1,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                cursor: ev.session && !ev.done ? 'pointer' : 'default',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: ev.c, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: Color.text,
                                textDecoration: ev.done ? 'line-through' : 'none' }}>{ev.l}</span>
                </div>
                {ev.done && <FIcon path={ICONS.check} size={12} color={Color.green} stroke={2.4} />}
              </div>
              <FMono size={9} color={Color.mute} style={{ marginLeft: 14, marginTop: 2 }}>{ev.sub}</FMono>
            </div>
          )
        })}
      </FSurface>
    </div>
  )
}

// ── Main export ──

export function PlanCalendarContent({ initialView = 'M', onStartSession }) {
  const { workoutPlan: plan } = useUser()
  const [view, setView] = useState(initialView)

  const trainingDaySet = useMemo(() => {
    if (!plan?.schedule) return new Set()
    return new Set(plan.schedule.filter(s => !s.isRest).map(s => s.dayIndex))
  }, [plan])

  const completedSessions = plan?.sessions?.filter(s => s.completed).length || 0
  const totalSessions = plan?.sessions?.length || 0
  const currentWeek = plan?.currentWeek || 1

  const [selectedDate, setSelectedDate] = useState(new Date().getDate())

  return (
    <div style={{ flex: 1, padding: '24px 24px 48px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero header */}
      <FMono color={Color.mute} size={10}>PLAN HEALTH</FMono>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8 }}>
        <FNum size={56} weight={200}>{completedSessions}</FNum>
        <div>
          <FMono color={Color.mute} size={11}>/ {totalSessions} SESSIONS</FMono>
          <div style={{ marginTop: 6 }}>
            <FMono color={completedSessions === totalSessions ? Color.green : Color.dim} size={10}>
              {completedSessions === totalSessions ? 'ALL DONE' : completedSessions > 0 ? 'IN PROGRESS' : 'PENDING'}
            </FMono>
          </div>
        </div>
      </div>
      <FMono color={Color.faint} size={10} style={{ marginTop: 8 }}>WEEK {currentWeek}</FMono>

      {/* View switch */}
      <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['M', 'W', 'D'].map(m => (
            <button key={m} onClick={() => setView(m)} style={{
              width: 36, height: 36, borderRadius: Radius.md,
              background: view === m ? Color.accent : 'transparent',
              color: view === m ? Color.accentText : Color.dim,
              border: `1px solid ${view === m ? Color.accent : Color.borderSoft}`,
              fontFamily: Font.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1,
              cursor: 'pointer',
            }}>{m}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{
            width: 36, height: 36, borderRadius: Radius.md, background: 'transparent',
            border: `1px solid ${Color.borderSoft}`, color: Color.dim, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}><FIcon path={ICONS.back} size={14} /></button>
          <button style={{
            width: 36, height: 36, borderRadius: Radius.md, background: 'transparent',
            border: `1px solid ${Color.borderSoft}`, color: Color.dim, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}><FIcon path={ICONS.fwd} size={14} /></button>
        </div>
      </div>

      <div style={{ marginTop: 20, flex: 1 }}>
        {view === 'M' && <MonthGrid plan={plan} trainingDaySet={trainingDaySet} selected={selectedDate} onSelect={setSelectedDate} />}
        {view === 'W' && <WeekGrid plan={plan} onStartSession={onStartSession} />}
        {view === 'D' && <DayView plan={plan} onStartSession={onStartSession} />}
      </div>
    </div>
  )
}

export function PlanCalendarHubScreen({ initialView = 'M' }) {
  const now = new Date()
  return (
    <Phone label="Plan" group="CALENDAR">
      <FNavBar
        title={`${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`}
        leading={<FIcon path={ICONS.back} size={20} color={Color.text} />}
        trailing={<FIcon path={ICONS.plus} size={22} color={Color.text} />}
      />
      <PlanCalendarContent initialView={initialView} />
    </Phone>
  )
}

export const PlanCalendarMonthScreen = () => <PlanCalendarHubScreen initialView="M" />
export const PlanCalendarWeekScreen = () => <PlanCalendarHubScreen initialView="W" />
export const PlanCalendarDayScreen = () => <PlanCalendarHubScreen initialView="D" />
