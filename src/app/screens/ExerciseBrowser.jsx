// ════════════════════════════════════════════════════════════
// Exercise Browser — filter and browse all exercises
// Follows Fridge.jsx filter pattern with category tabs.
// ════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FIcon, FTag, FBtn, FButtonGroup, FListRow, Phone } from '../../ui/components'
import { EXERCISES } from './fitness-data'
import { useNav } from '../../context/NavigationContext'

const CATEGORIES = ['all', 'compound', 'isolation', 'core', 'cardio', 'hiit', 'mobility']
const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c, label: c === 'all' ? 'ALL' : c.toUpperCase() }))

const CATEGORY_COLORS = {
  compound: Color.accent, isolation: Color.blue, core: Color.amber,
  cardio: Color.green, hiit: Color.red, mobility: Color.purple,
  warmup: Color.faint, cooldown: Color.faint,
}

export function ExerciseBrowserContent({ data }) {
  const { pushDetail } = useNav()
  const [category, setCategory] = useState('all')
  const filterGoalKey = data?.goalKey

  const GOAL_MODALITIES = {
    hypertrophy: ['hypertrophy'], fat_loss: ['hiit', 'strength', 'cardio'],
    recomposition: ['hypertrophy', 'hiit'], max_strength: ['strength', 'power'],
    cardio_endurance: ['cardio', 'endurance'], power: ['power', 'strength'],
    agility: ['hiit', 'power'], flexibility: ['mobility'],
    balance: ['mobility', 'endurance'], overall_wellness: ['cardio', 'mobility', 'hypertrophy'],
  }

  const filtered = useMemo(() => {
    let pool = EXERCISES
    if (filterGoalKey) {
      const mods = GOAL_MODALITIES[filterGoalKey] || []
      pool = pool.filter(ex => ex.modality.some(m => mods.includes(m)))
    }
    if (category !== 'all') {
      pool = pool.filter(ex => ex.category === category)
    }
    return pool
  }, [category, filterGoalKey])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Filter bar */}
      <div style={{ padding: '12px 20px', flexShrink: 0, borderBottom: `1px solid ${Color.borderSoft}` }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CATEGORY_OPTIONS.map(opt => {
            const active = category === opt.value
            const catColor = CATEGORY_COLORS[opt.value] || Color.accent
            return (
              <button key={opt.value} onClick={() => setCategory(opt.value)} style={{
                padding: '5px 10px', borderRadius: 9999,
                border: `1px solid ${active ? catColor : Color.borderSoft}`,
                background: active ? `${catColor}15` : 'transparent',
                color: active ? catColor : Color.mute,
                fontFamily: Font.mono, fontSize: 10, letterSpacing: 0.8,
                fontWeight: active ? 600 : 400, cursor: 'pointer',
              }}>{opt.label}</button>
            )
          })}
        </div>
        <FMono size={9} color={Color.dim} style={{ marginTop: 8, display: 'block' }}>
          {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
          {filterGoalKey && ` · filtered for ${filterGoalKey.replace(/_/g, ' ')}`}
        </FMono>
      </div>

      {/* Exercise list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {filtered.map((ex, i) => {
          const catColor = CATEGORY_COLORS[ex.category] || Color.mute
          return (
            <FListRow key={ex.id}
              leading={
                <div style={{ width: 32, height: 32, borderRadius: Radius.md, background: `${catColor}12`, display: 'grid', placeItems: 'center' }}>
                  <FIcon path={ICONS.dumb} size={14} color={catColor} />
                </div>
              }
              title={ex.name}
              subtitle={`${ex.category.toUpperCase()} · ${ex.equipment.toUpperCase()} · ${ex.muscles.join(', ')}`}
              trailing={<FIcon path={ICONS.fwd} size={14} color={Color.faint} />}
              divider={i > 0}
              onClick={() => pushDetail('exercise-detail', ex.name, { exercise: ex })}
            />
          )
        })}
      </div>
    </div>
  )
}

export function ExerciseBrowserScreen({ goalKey } = {}) {
  return (
    <Phone label="Exercise Browser" group="TRAINING">
      <FNavBar title="Exercises" leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} trailing={<FIcon path={ICONS.search} size={20} color={Color.text} />} />
      <ExerciseBrowserContent data={goalKey ? { goalKey } : undefined} />
    </Phone>
  )
}
