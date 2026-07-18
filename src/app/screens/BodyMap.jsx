import { useState, useMemo, memo } from 'react'

// ════════════════════════════════════════════════════════════
// BodyMap v2 — path-based anatomical heatmap
//
// Drop-in upgrade for the Today screen's ellipse BodyMap.
// - Real muscle shapes (SVG paths, one side defined + mirrored)
// - Intensity levels 0–1 (primary vs secondary movers), not binary
// - Front / back views with active-count badges on the toggle
// - Tap a muscle → selected state + info readout
// - Back-compat: still accepts activeMuscles={['chest', ...]}
//
// To integrate: lift BodyMap, FRONT_REGIONS, BACK_REGIONS,
// SILHOUETTE_HALF and musclesToIntensities into your codebase,
// swap the local tokens below for imports from ui/tokens.
// ════════════════════════════════════════════════════════════

/* ── local stand-ins for ui/tokens (replace with imports) ── */
const Color = {
  bg: '#0c0d10', surface: '#141519', text: '#f2f2f0',
  dim: '#9a9aa0', mute: '#6b6b72', faint: '#4a4a52',
  accent: '#FF6E50', green: '#4ade80',
  borderSoft: 'rgba(255,255,255,0.07)',
}
const alpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
const Mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }

/* ════════════════════════════════════════════════════════════
   Geometry — everything is the LEFT half, mirrored around x=100.
   viewBox 0 0 200 400.
   ════════════════════════════════════════════════════════════ */

const SILHOUETTE_HALF =
  'M 100 42 L 93 44 ' +
  'C 84 50, 70 56, 58 64 C 50 70, 47 76, 47 86 ' +
  'C 46 100, 45 112, 45 124 C 43 140, 41 154, 40 168 ' +
  'C 39 176, 37 184, 38 190 C 41 194, 46 192, 47 184 ' +
  'C 49 172, 52 150, 55 128 C 57 116, 60 104, 65 94 ' +
  'C 68 104, 71 128, 73 146 C 72 160, 68 172, 66 186 ' +
  'C 63 204, 62 220, 64 238 C 66 254, 68 262, 71 272 ' +
  'C 73 286, 74 294, 75 304 C 76 324, 77 342, 79 358 ' +
  'C 79 366, 76 372, 74 376 C 78 380, 88 380, 91 376 ' +
  'C 92 368, 91 362, 90 356 C 88 336, 86 316, 86 300 ' +
  'C 87 288, 89 278, 90 268 C 93 248, 95 226, 97 208 ' +
  'C 98 202, 100 199, 100 198 Z'

// Each region: one left-side path (auto-mirrored), a label,
// and the alias keys it matches from exercise data.
export const FRONT_REGIONS = [
  { id: 'traps-f', label: 'Traps', keys: ['traps', 'trapezius', 'upper back'],
    d: 'M 94 46 C 84 49, 72 54, 63 61 C 74 60, 86 58, 93 56 C 94 53, 94 49, 94 46 Z' },
  { id: 'delts-f', label: 'Shoulders', keys: ['shoulders', 'delts', 'deltoids'],
    d: 'M 58 63 C 51 68, 48 76, 49 85 C 52 91, 60 91, 64 85 C 66 76, 64 67, 58 63 Z' },
  { id: 'chest', label: 'Chest', keys: ['chest', 'pecs', 'pectorals'],
    d: 'M 98 63 C 82 63, 70 68, 66 76 C 64 87, 70 95, 79 98 C 89 100, 97 97, 98 92 C 99 82, 99 72, 98 63 Z' },
  { id: 'biceps', label: 'Biceps', keys: ['biceps', 'bicep'],
    d: 'M 55 94 C 50 100, 47 110, 48 122 C 50 128, 56 128, 59 122 C 61 111, 61 100, 59 94 C 58 91, 56 92, 55 94 Z' },
  { id: 'forearms-f', label: 'Forearms', keys: ['forearms', 'forearm'],
    d: 'M 47 132 C 43 144, 41 156, 41 166 C 43 171, 48 171, 50 166 C 53 154, 54 142, 54 133 C 51 128, 48 128, 47 132 Z' },
  { id: 'abs', label: 'Abs', keys: ['abs', 'core', 'abdominals'],
    d: 'M 99 104 C 91 104, 87 110, 87 118 L 87 154 C 88 162, 93 167, 99 168 Z' },
  { id: 'obliques', label: 'Obliques', keys: ['obliques', 'core'],
    d: 'M 84 108 C 78 116, 76 128, 77 142 C 78 152, 81 158, 84 160 C 86 144, 86 124, 84 108 Z' },
  { id: 'quads', label: 'Quads', keys: ['quads', 'quadriceps', 'quad', 'legs'],
    d: 'M 72 200 C 64 210, 62 228, 65 250 C 68 264, 73 270, 79 268 C 87 262, 92 244, 93 224 C 93 210, 90 200, 84 197 C 79 195, 75 196, 72 200 Z' },
  { id: 'shins', label: 'Calves', keys: ['calves', 'calf'],
    d: 'M 78 288 C 74 300, 73 316, 76 334 C 79 342, 84 341, 86 333 C 88 314, 87 298, 84 288 C 82 282, 80 283, 78 288 Z' },
]

export const BACK_REGIONS = [
  { id: 'traps-b', label: 'Traps', keys: ['traps', 'trapezius', 'upper back'],
    d: 'M 100 44 C 88 48, 74 54, 63 61 C 74 68, 86 82, 92 100 C 96 106, 100 108, 100 108 Z' },
  { id: 'delts-b', label: 'Rear delts', keys: ['shoulders', 'delts', 'deltoids', 'rear delts'],
    d: 'M 58 63 C 51 68, 48 76, 49 85 C 52 91, 60 91, 64 85 C 66 76, 64 67, 58 63 Z' },
  { id: 'lats', label: 'Lats', keys: ['lats', 'latissimus', 'back'],
    d: 'M 67 94 C 64 110, 66 126, 75 140 C 84 150, 94 154, 99 154 L 99 122 C 94 106, 82 96, 67 94 Z' },
  { id: 'triceps', label: 'Triceps', keys: ['triceps', 'tricep'],
    d: 'M 55 94 C 49 102, 46 112, 47 124 C 49 130, 55 130, 58 124 C 61 112, 61 101, 59 94 C 58 91, 56 92, 55 94 Z' },
  { id: 'forearms-b', label: 'Forearms', keys: ['forearms', 'forearm'],
    d: 'M 47 132 C 43 144, 41 156, 41 166 C 43 171, 48 171, 50 166 C 53 154, 54 142, 54 133 C 51 128, 48 128, 47 132 Z' },
  { id: 'erectors', label: 'Lower back', keys: ['lower back', 'erectors', 'back'],
    d: 'M 99 140 C 92 142, 89 148, 89 156 L 89 172 C 92 178, 96 180, 99 180 Z' },
  { id: 'glutes', label: 'Glutes', keys: ['glutes', 'glute', 'gluteus'],
    d: 'M 98 184 C 84 183, 74 190, 72 200 C 71 212, 78 220, 88 221 C 95 221, 98 216, 98 208 Z' },
  { id: 'hamstrings', label: 'Hamstrings', keys: ['hamstrings', 'hamstring'],
    d: 'M 71 226 C 65 240, 64 258, 68 272 C 72 281, 79 282, 84 276 C 90 266, 92 248, 92 234 C 90 226, 84 222, 78 223 C 75 224, 72 224, 71 226 Z' },
  { id: 'calves', label: 'Calves', keys: ['calves', 'calf'],
    d: 'M 76 288 C 70 300, 69 316, 74 330 C 79 339, 86 338, 89 328 C 92 312, 90 297, 85 288 C 82 282, 78 283, 76 288 Z' },
]

/* ════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════ */

// Frequency → intensity. Feed it the flattened exercise list;
// the most-hit muscle becomes 1.0, everything else scales off it.
export function musclesToIntensities(exercises = []) {
  const counts = {}
  exercises.forEach(ex => (ex.muscles || []).forEach(m => {
    const k = m.toLowerCase()
    counts[k] = (counts[k] || 0) + 1
  }))
  const max = Math.max(1, ...Object.values(counts))
  const out = {}
  Object.entries(counts).forEach(([k, v]) => { out[k] = 0.35 + 0.65 * (v / max) })
  return out
}

const regionIntensity = (region, intensities) =>
  Math.max(0, ...region.keys.map(k => intensities[k] || 0))

const viewActiveCount = (regions, intensities) =>
  regions.filter(r => regionIntensity(r, intensities) > 0).length

/* ════════════════════════════════════════════════════════════
   BodyMap
   props:
     intensities    { chest: 0.9, triceps: 0.5, ... }  (0–1)
     activeMuscles  ['chest','triceps']  (legacy — treated as 1.0)
     view           'front' | 'back'    (controlled, optional)
     showToggle     bool (default true)
     onRegionTap    (region, intensity) => void  (optional)
   ════════════════════════════════════════════════════════════ */

export const BodyMap = memo(function BodyMap({
  intensities: intensitiesProp,
  activeMuscles,
  view: viewProp,
  showToggle = true,
  onRegionTap,
  style,
}) {
  const intensities = useMemo(() => {
    if (intensitiesProp) {
      const out = {}
      Object.entries(intensitiesProp).forEach(([k, v]) => { out[k.toLowerCase()] = v })
      return out
    }
    const out = {}
    ;(activeMuscles || []).forEach(m => { out[m.toLowerCase()] = 1 })
    return out
  }, [intensitiesProp, activeMuscles])

  const frontCount = viewActiveCount(FRONT_REGIONS, intensities)
  const backCount = viewActiveCount(BACK_REGIONS, intensities)

  // Uncontrolled default: open on whichever side has more work
  const [viewState, setViewState] = useState(null)
  const view = viewProp || viewState || (backCount > frontCount ? 'back' : 'front')
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS

  const [selected, setSelected] = useState(null)
  const selectedRegion = regions.find(r => r.id === selected) || null

  const handleTap = (region, intensity) => {
    setSelected(s => (s === region.id ? null : region.id))
    onRegionTap?.(region, intensity)
  }

  const renderRegion = (region) => {
    const i = regionIntensity(region, intensities)
    const isSel = selected === region.id
    const lit = i > 0
    return (
      <g key={region.id}
        onClick={(e) => { e.stopPropagation(); handleTap(region, i) }}
        style={{ cursor: 'pointer' }}>
        <path
          d={region.d}
          fill={lit ? alpha(Color.accent, 0.15 + i * 0.65) : alpha(Color.green, 0.09)}
          stroke={isSel ? Color.text : lit ? alpha(Color.accent, 0.9) : alpha(Color.green, 0.16)}
          strokeWidth={isSel ? 1.4 : 0.8}
          filter={lit ? 'url(#bm2-glow)' : undefined}
          style={{ transition: 'fill 400ms ease, stroke 200ms ease' }}
        />
        <title>{`${region.label} — ${lit ? `${Math.round(i * 100)}%` : 'rest'}`}</title>
      </g>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {/* view toggle */}
      {showToggle && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[['front', frontCount], ['back', backCount]].map(([v, count]) => (
            <button key={v}
              onClick={() => { setViewState(v); setSelected(null) }}
              style={{
                ...Mono, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase',
                padding: '4px 12px', borderRadius: 5, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: view === v ? alpha(Color.accent, 0.12) : 'transparent',
                border: `1px solid ${view === v ? alpha(Color.accent, 0.35) : Color.borderSoft}`,
                color: view === v ? Color.accent : Color.mute,
              }}>
              {v}
              {count > 0 && (
                <span style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: view === v ? Color.accent : Color.faint,
                }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* the body */}
      <svg viewBox="0 0 200 400" style={{ width: '100%', height: 'auto' }}
        onClick={() => setSelected(null)}>
        <defs>
          <filter id="bm2-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* head + neck */}
        <ellipse cx="100" cy="24" rx="13" ry="15"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <rect x="93" y="36" width="14" height="9"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* left half + mirrored right half */}
        {[null, 'translate(200,0) scale(-1,1)'].map((t, hi) => (
          <g key={hi} transform={t || undefined}>
            <path d={SILHOUETTE_HALF}
              fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            {regions.map(renderRegion)}
          </g>
        ))}
      </svg>

      {/* tapped-region readout */}
      <div style={{ minHeight: 16, textAlign: 'center' }}>
        {selectedRegion && (() => {
          const i = regionIntensity(selectedRegion, intensities)
          return (
            <span style={{ ...Mono, fontSize: 10, color: i > 0 ? Color.accent : Color.mute }}>
              {selectedRegion.label} · {i > 0 ? `${Math.round(i * 100)}% activation` : 'resting today'}
            </span>
          )
        })()}
      </div>

      {/* legend */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
        {[
          [alpha(Color.accent, 0.8), 'Primary'],
          [alpha(Color.accent, 0.35), 'Secondary'],
          [alpha(Color.green, 0.25), 'Rest'],
        ].map(([c, label]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
            <span style={{ ...Mono, fontSize: 8.5, letterSpacing: 1, textTransform: 'uppercase', color: Color.mute }}>
              {label}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
})

/* ════════════════════════════════════════════════════════════
   Demo wrapper — preview only, delete on integration.
   Mimics real session data shapes from fitness-data.
   ════════════════════════════════════════════════════════════ */

const DEMO_SESSIONS = {
  'Push A': [
    { name: 'Barbell bench press', muscles: ['chest', 'triceps', 'shoulders'] },
    { name: 'Incline DB press', muscles: ['chest', 'shoulders'] },
    { name: 'Cable fly', muscles: ['chest'] },
    { name: 'Overhead press', muscles: ['shoulders', 'triceps'] },
    { name: 'Rope pushdown', muscles: ['triceps'] },
    { name: 'Hanging leg raise', muscles: ['abs'] },
  ],
  'Pull A': [
    { name: 'Weighted pull-up', muscles: ['lats', 'biceps'] },
    { name: 'Barbell row', muscles: ['lats', 'traps', 'lower back'] },
    { name: 'Face pull', muscles: ['rear delts', 'traps'] },
    { name: 'DB curl', muscles: ['biceps', 'forearms'] },
    { name: 'Hammer curl', muscles: ['biceps', 'forearms'] },
  ],
  'Legs A': [
    { name: 'Back squat', muscles: ['quads', 'glutes', 'lower back'] },
    { name: 'Romanian deadlift', muscles: ['hamstrings', 'glutes', 'lower back'] },
    { name: 'Walking lunge', muscles: ['quads', 'glutes'] },
    { name: 'Leg curl', muscles: ['hamstrings'] },
    { name: 'Standing calf raise', muscles: ['calves'] },
  ],
  'Full body': [
    { name: 'Deadlift', muscles: ['hamstrings', 'glutes', 'lower back', 'traps', 'forearms'] },
    { name: 'Bench press', muscles: ['chest', 'triceps', 'shoulders'] },
    { name: 'Pull-up', muscles: ['lats', 'biceps'] },
    { name: 'Front squat', muscles: ['quads', 'abs'] },
  ],
}

export default function BodyMapDemo() {
  const [session, setSession] = useState('Push A')
  const exercises = DEMO_SESSIONS[session]
  const intensities = useMemo(() => musclesToIntensities(exercises), [exercises])

  return (
    <div style={{
      minHeight: '100vh', background: Color.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: 320, padding: '20px 20px 24px', borderRadius: 20,
        background: Color.surface, border: `1px solid ${Color.borderSoft}`,
      }}>
        <div style={{ ...Mono, fontSize: 9, letterSpacing: 1.4, color: Color.mute, marginBottom: 4 }}>
          TODAY'S TARGET
        </div>
        <div style={{
          fontFamily: 'system-ui, sans-serif', fontSize: 22, fontWeight: 300,
          color: Color.text, marginBottom: 14,
        }}>
          {session}
        </div>

        {/* session picker */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {Object.keys(DEMO_SESSIONS).map(s => (
            <button key={s} onClick={() => setSession(s)}
              style={{
                ...Mono, fontSize: 9, padding: '5px 10px', borderRadius: 5, cursor: 'pointer',
                background: s === session ? alpha(Color.accent, 0.12) : 'transparent',
                border: `1px solid ${s === session ? alpha(Color.accent, 0.35) : Color.borderSoft}`,
                color: s === session ? Color.accent : Color.dim,
              }}>
              {s}
            </button>
          ))}
        </div>

        <BodyMap intensities={intensities} />

        <div style={{ ...Mono, fontSize: 8.5, color: Color.faint, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          Tap a muscle to inspect · intensity scales with how many exercises hit it
        </div>
      </div>
    </div>
  )
}
