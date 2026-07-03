/* ExerciseLibrary — Filter and browse all exercises by muscle, equipment, modality, category.
   Click to expand and see form cues, injury exclusions, and which goals use it. */

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FLabel, FMono, FIcon, FTag } from '../../ui/components'
import { EXERCISES } from '../../app/screens/fitness-data'
import { GOAL_META } from './ontology-data'

// Extract unique values for filters
const ALL_MUSCLES = [...new Set(EXERCISES.flatMap(e => e.muscles))].sort()
const ALL_EQUIPMENT = [...new Set(EXERCISES.map(e => e.equipment))].sort()
const ALL_MODALITIES = [...new Set(EXERCISES.flatMap(e => e.modality))].sort()
const ALL_CATEGORIES = [...new Set(EXERCISES.map(e => e.category))].sort()

// Goal → modality mapping (from fitness-data.js, duplicated here for reverse lookup)
const GOAL_MODALITIES = {
  hypertrophy: ['hypertrophy'], fat_loss: ['hiit', 'strength', 'cardio'],
  recomposition: ['hypertrophy', 'hiit'], max_strength: ['strength', 'power'],
  cardio_endurance: ['cardio', 'endurance'], power: ['power', 'strength'],
  agility: ['hiit', 'power'], flexibility: ['mobility'],
  balance: ['mobility', 'endurance'], overall_wellness: ['cardio', 'mobility', 'hypertrophy'],
}

function getGoalsForExercise(exercise) {
  return Object.entries(GOAL_MODALITIES)
    .filter(([, mods]) => exercise.modality.some(m => mods.includes(m)))
    .map(([goalKey]) => goalKey)
}

const CATEGORY_COLORS = {
  compound: Color.accent, isolation: Color.blue, core: Color.amber,
  cardio: Color.green, hiit: Color.red, mobility: Color.purple,
}

function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: 9999,
      border: `1px solid ${active ? Color.accent : Color.borderSoft}`,
      background: active ? `${Color.accent}15` : 'transparent',
      color: active ? Color.accent : Color.mute,
      fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8, fontWeight: active ? 600 : 400,
      cursor: 'pointer', transition: 'all 0.15s', textTransform: 'uppercase',
    }}>{label}</button>
  )
}

export default function ExerciseLibrary() {
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState(new Set())
  const [equipFilter, setEquipFilter] = useState(new Set())
  const [modFilter, setModFilter] = useState(new Set())
  const [catFilter, setCatFilter] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)

  const toggleFilter = (set, setter, val) => {
    setter(prev => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
  }

  const filtered = useMemo(() => {
    return EXERCISES.filter(ex => {
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false
      if (muscleFilter.size > 0 && !ex.muscles.some(m => muscleFilter.has(m))) return false
      if (equipFilter.size > 0 && !equipFilter.has(ex.equipment)) return false
      if (modFilter.size > 0 && !ex.modality.some(m => modFilter.has(m))) return false
      if (catFilter.size > 0 && !catFilter.has(ex.category)) return false
      return true
    })
  }, [search, muscleFilter, equipFilter, modFilter, catFilter])

  const activeFilterCount = muscleFilter.size + equipFilter.size + modFilter.size + catFilter.size + (search ? 1 : 0)

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises..."
          style={{
            width: '100%', maxWidth: 400, padding: '8px 14px',
            borderRadius: Radius.md, border: `1px solid ${Color.borderSoft}`,
            background: Color.surface, color: Color.text,
            fontFamily: Font.sans, fontSize: 13, outline: 'none',
          }}
        />
      </div>

      {/* Filter rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <FMono size={8} color={Color.faint} style={{ width: 70 }}>MUSCLE</FMono>
          {ALL_MUSCLES.map(m => <FilterChip key={m} label={m} active={muscleFilter.has(m)} onClick={() => toggleFilter(muscleFilter, setMuscleFilter, m)} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <FMono size={8} color={Color.faint} style={{ width: 70 }}>EQUIPMENT</FMono>
          {ALL_EQUIPMENT.map(e => <FilterChip key={e} label={e} active={equipFilter.has(e)} onClick={() => toggleFilter(equipFilter, setEquipFilter, e)} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <FMono size={8} color={Color.faint} style={{ width: 70 }}>MODALITY</FMono>
          {ALL_MODALITIES.map(m => <FilterChip key={m} label={m} active={modFilter.has(m)} onClick={() => toggleFilter(modFilter, setModFilter, m)} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <FMono size={8} color={Color.faint} style={{ width: 70 }}>CATEGORY</FMono>
          {ALL_CATEGORIES.map(c => <FilterChip key={c} label={c} active={catFilter.has(c)} onClick={() => toggleFilter(catFilter, setCatFilter, c)} />)}
        </div>
      </div>

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <FMono size={10} color={Color.dim}>{filtered.length} of {EXERCISES.length} exercises</FMono>
        {activeFilterCount > 0 && (
          <button onClick={() => { setSearch(''); setMuscleFilter(new Set()); setEquipFilter(new Set()); setModFilter(new Set()); setCatFilter(new Set()) }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: Font.mono, fontSize: 9, color: Color.accent, letterSpacing: 0.6,
          }}>CLEAR FILTERS</button>
        )}
      </div>

      {/* Exercise grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
        {filtered.map(ex => {
          const expanded = expandedId === ex.id
          const goalKeys = getGoalsForExercise(ex)
          const catColor = CATEGORY_COLORS[ex.category] || Color.mute

          return (
            <div
              key={ex.id}
              onClick={() => setExpandedId(expanded ? null : ex.id)}
              style={{
                background: Color.surface,
                border: `1px solid ${expanded ? `${catColor}40` : Color.borderSoft}`,
                borderRadius: Radius.lg,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ ...Type.headingSm, flex: 1 }}>{ex.name}</span>
                <FTag tone="mute" size="sm">{ex.category.toUpperCase()}</FTag>
              </div>

              {/* Tags row */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: expanded ? 12 : 0 }}>
                <span style={{ padding: '2px 6px', borderRadius: 4, background: `${catColor}12`, color: catColor, fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  {ex.equipment}
                </span>
                {ex.muscles.map(m => (
                  <span key={m} style={{ padding: '2px 6px', borderRadius: 4, background: Color.surface2, color: Color.dim, fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.6 }}>
                    {m}
                  </span>
                ))}
                {ex.modality.map(m => (
                  <span key={m} style={{ padding: '2px 6px', borderRadius: 4, background: `${Color.blue}10`, color: Color.blue, fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.6 }}>
                    {m}
                  </span>
                ))}
              </div>

              {/* Expanded detail */}
              {expanded && (
                <div style={{ borderTop: `1px solid ${Color.borderSoft}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Form cue */}
                  <div>
                    <FLabel size={8} mb={4} letter={1}>FORM CUE</FLabel>
                    <div style={{ ...Type.bodySm, color: Color.dim, lineHeight: 1.5 }}>{ex.cue}</div>
                  </div>

                  {/* Injury exclusions */}
                  {ex.injury_exclude.length > 0 && (
                    <div>
                      <FLabel size={8} mb={4} letter={1}>INJURY EXCLUSIONS</FLabel>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {ex.injury_exclude.map(inj => (
                          <FTag key={inj} tone="red" size="sm">{inj.replace(/_/g, ' ').toUpperCase()}</FTag>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Goals that use this exercise */}
                  <div>
                    <FLabel size={8} mb={4} letter={1}>USED BY GOALS</FLabel>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {goalKeys.map(g => {
                        const meta = GOAL_META[g]
                        return meta ? (
                          <span key={g} style={{
                            padding: '2px 8px', borderRadius: 9999,
                            background: `${meta.color}12`, color: meta.color,
                            fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8,
                          }}>{meta.label}</span>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
