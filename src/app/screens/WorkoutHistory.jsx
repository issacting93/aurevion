// ════════════════════════════════════════════════════════════
// Workout History — chronological log of completed sessions
// Type-driven, no card backgrounds except hero. Volume trend
// arrows compare same-name sessions over time. Expandable
// exercise breakdown per session, volume + RPE trend charts.
// ════════════════════════════════════════════════════════════

import { useMemo, useState, useCallback } from 'react'
import { Color, Font, Space, Radius, Type, alpha } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FBtn, Phone } from '../../ui/components'
import { LineChart, Sparkline } from '../../ui/chart'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { computeSessionVolume, computeAvgRPE, computeAvgRIR, formatTime } from './fitness-data'

/* ── Date formatting helper ── */

const fmtDate = (iso) => {
  const d = new Date(iso)
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

const fmtDateShort = (iso) => {
  const d = new Date(iso)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d.getDate()} ${months[d.getMonth()]}`
}

/* ── Summarize an exercise's logged sets into a compact string ── */
function summarizeExercise(ex) {
  const sets = ex.logged || []
  if (sets.length === 0) return null
  const setCount = sets.length
  const reps = sets.map(s => s.reps || 0)
  const loads = sets.map(s => s.load || 0).filter(l => l > 0)
  const rpes = sets.map(s => s.rpe).filter(Boolean)
  const rirs = sets.map(s => s.rir).filter(r => r != null)

  const repDisplay = new Set(reps).size === 1 ? `${reps[0]}` : `${Math.min(...reps)}-${Math.max(...reps)}`
  let parts = [`${setCount}×${repDisplay}`]

  if (loads.length > 0) {
    const minL = Math.min(...loads)
    const maxL = Math.max(...loads)
    parts.push(minL === maxL ? `@ ${minL}kg` : `@ ${minL}-${maxL}kg`)
  }
  if (rpes.length > 0) {
    const avgRpe = Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10
    parts.push(`RPE ${avgRpe}`)
  }
  if (rirs.length > 0) {
    const avgRir = Math.round((rirs.reduce((a, b) => a + b, 0) / rirs.length) * 10) / 10
    parts.push(`RIR ${avgRir}`)
  }
  return parts.join(' · ')
}

export function WorkoutHistoryContent() {
  const { getCompletedWorkouts } = useUser()
  const { pushDetail } = useNav()
  const workouts = useMemo(() => getCompletedWorkouts(), [getCompletedWorkouts])

  /* ── Expanded workout IDs ── */
  const [expanded, setExpanded] = useState(new Set())
  const toggleExpanded = useCallback((id) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  /* ── Compute volume trends — compare each workout to the previous session with the same name ── */
  const trends = useMemo(() => {
    const map = {}
    // workouts are sorted newest-first; iterate oldest-first for trend calc
    const reversed = [...workouts].reverse()
    const result = new Map()
    for (const entry of reversed) {
      const name = entry.data?.name
      const vol = computeSessionVolume(entry.data?.loggedSets || [])
      const prev = map[name]
      if (prev != null) {
        result.set(entry, vol > prev ? 'up' : vol < prev ? 'down' : 'same')
      }
      map[name] = vol
    }
    return result
  }, [workouts])

  /* ── Chart data: volume + RPE trends (oldest-first, last 12 sessions) ── */
  const { volumeData, volumeLabels, avgVolume, rpeData } = useMemo(() => {
    if (!workouts || workouts.length === 0) return { volumeData: [], volumeLabels: [], avgVolume: 0, rpeData: [] }
    const recent = [...workouts].reverse().slice(-12)
    const vols = recent.map(w => computeSessionVolume(w.data?.loggedSets || []))
    const labels = recent.map(w => fmtDateShort(w.timestamp))
    const avg = vols.length > 0 ? Math.round(vols.reduce((a, b) => a + b, 0) / vols.length) : 0
    const rpes = recent.map(w => computeAvgRPE(w.data?.loggedSets || [])).map(v => v || 0)
    return { volumeData: vols, volumeLabels: labels, avgVolume: avg, rpeData: rpes }
  }, [workouts])

  /* ── Empty state ── */
  if (!workouts || workouts.length === 0) {
    return (
      <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: alpha(Color.green, 0.10),
          display: 'grid', placeItems: 'center',
        }}>
          <FIcon path={ICONS.timer} size={28} color={Color.green} stroke={1.8} />
        </div>
        <div style={{ ...Type.headingSm, color: Color.text, marginTop: 8 }}>Your history starts here</div>
        <FMono size={11} color={Color.mute}>Complete your first session to start tracking</FMono>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>

      {/* ── Hero — total workout count ── */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <FNum size={28} weight={300}>{workouts.length}</FNum>
        <div style={{ marginTop: 6 }}>
          <FLabel size={10} mb={0} color={Color.mute}>WORKOUTS LOGGED</FLabel>
        </div>
      </div>

      {/* ── Volume trend chart ── */}
      {volumeData.length >= 2 && (
        <div style={{ marginBottom: Space[5] }}>
          <LineChart
            data={volumeData}
            target={avgVolume}
            xLabels={volumeLabels.length <= 8 ? volumeLabels : [volumeLabels[0], volumeLabels[Math.floor(volumeLabels.length / 2)], volumeLabels[volumeLabels.length - 1]]}
            title="Volume trend"
            titleValue={volumeData[volumeData.length - 1]?.toLocaleString()}
            titleUnit="kg"
            titleSublabel={`avg ${avgVolume.toLocaleString()} kg`}
            height={140}
            color={Color.accent}
            showDots
            style={{ marginBottom: 0 }}
          />
        </div>
      )}

      {/* ── RPE sparkline ── */}
      {rpeData.length >= 2 && rpeData.some(v => v > 0) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: Space[3],
          padding: `${Space[3]}px ${Space[4]}px`,
          background: Color.surface,
          border: `1px solid ${Color.border}`,
          borderRadius: Radius.lg,
          marginBottom: Space[5],
        }}>
          <div style={{ flex: '0 0 auto' }}>
            <FLabel size={10} mb={0} color={Color.mute}>AVG RPE</FLabel>
            <FMono size={14} color={Color.accent}>{rpeData.filter(v => v > 0).length > 0 ? (rpeData.filter(v => v > 0).reduce((a, b) => a + b, 0) / rpeData.filter(v => v > 0).length).toFixed(1) : '—'}</FMono>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Sparkline
              data={rpeData}
              height={32}
              color={Color.accent}
              strokeWidth={1.5}
              fill
              dot
            />
          </div>
        </div>
      )}

      {/* ── Chronological list ── */}
      {workouts.map((entry, i) => {
        const vol = computeSessionVolume(entry.data?.loggedSets || [])
        const rpe = computeAvgRPE(entry.data?.loggedSets || [])
        const trend = trends.get(entry)
        const volStr = vol.toLocaleString() + ' kg'
        const entryId = entry.timestamp + '-' + i
        const isExpanded = expanded.has(entryId)
        const loggedSets = entry.data?.loggedSets || []

        return (
          <div key={entryId} style={{ borderTop: `1px solid ${Color.borderSoft}` }}>
            {/* ── Row header ── */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(entryId)
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', cursor: 'pointer',
              }}
            >
              {/* Left side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                {/* Expand/collapse chevron */}
                <span style={{
                  fontSize: 10, color: Color.mute, flexShrink: 0,
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  display: 'inline-block', width: 14, textAlign: 'center',
                }}>▶</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ ...Type.bodyMd, fontWeight: 500, color: Color.text }}>{entry.data?.name || 'Workout'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <FMono size={10} color={Color.dim}>{fmtDate(entry.timestamp)}</FMono>
                    {entry.data?.type && (
                      <FMono size={10} color={Color.mute}>{entry.data.type}</FMono>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FMono size={11} color={Color.text}>{volStr}</FMono>
                  {trend === 'up' && <span style={{ fontSize: 12, color: Color.green }}>↑</span>}
                  {trend === 'down' && <span style={{ fontSize: 12, color: Color.red }}>↓</span>}
                </div>
                {rpe > 0 && (
                  <FMono size={10} color={Color.accent}>RPE {rpe}</FMono>
                )}
              </div>
            </div>

            {/* ── Expanded exercise breakdown ── */}
            {isExpanded && loggedSets.length > 0 && (
              <div style={{
                paddingLeft: 22, paddingBottom: 14,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                {loggedSets
                  .filter(ex => ex.exerciseId !== '_warmup' && ex.exerciseId !== '_cooldown')
                  .map((ex, j) => {
                    const summary = summarizeExercise(ex)
                    if (!summary) return null
                    return (
                      <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ ...Type.bodySm, color: Color.dim }}>{ex.name || ex.exerciseId}</div>
                        <FMono size={10} color={Color.mute}>{summary}</FMono>
                      </div>
                    )
                  })}
                {/* Detail link */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    pushDetail('workout-summary-detail', entry.data.name, {
                      loggedSets: entry.data.loggedSets,
                      elapsed: entry.data.duration,
                      session: { name: entry.data.name, modality: entry.data.type },
                    })
                  }}
                  style={{
                    ...Type.labelSm, color: Color.accent, cursor: 'pointer',
                    marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                >
                  Full summary →
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function WorkoutHistoryScreen() {
  return (
    <Phone label="Workout History" group="TRAINING">
      <FNavBar title="History" leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <WorkoutHistoryContent />
    </Phone>
  )
}
