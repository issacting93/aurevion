// Daily Food Log — meal logging with macro tracking.

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FTag, FBtn, FSurface, FListRow, FTabBar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { MOCK_TARGETS, MOCK_MEALS } from '../../context/mockUser'

const MEAL_CATEGORIES = ['ALL', 'BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SLOT_TIMES = { breakfast: '08:30', lunch: '12:00', dinner: '19:00', snack: '15:30' }

export function FoodLogContent() {
  const { pushDetail } = useNav()
  const { targets: ctxTargets, mealPlan } = useUser()
  const [filter, setFilter] = useState('ALL')

  const todayDay = DAY_NAMES[new Date().getDay()]
  const allMeals = useMemo(() => {
    if (!mealPlan?.meals) return MOCK_MEALS
    const todayMeals = mealPlan.meals.filter(m => m.day === todayDay)
    if (todayMeals.length === 0) return MOCK_MEALS
    return todayMeals.map(m => ({
      time: SLOT_TIMES[m.slot] || m.slot,
      name: m.slot.charAt(0).toUpperCase() + m.slot.slice(1),
      items: m.recipe.name,
      kcal: m.macros.kcal,
      p: m.macros.protein,
      c: m.macros.carbs,
      f: m.macros.fat,
      batch: m.recipe.method === 'batch' || m.recipe.method === 'slow_cook',
      category: m.slot.toUpperCase(),
    }))
  }, [mealPlan, todayDay])

  const meals = filter === 'ALL' ? allMeals : allMeals.filter(m => (m.category || '').toUpperCase() === filter)
  const logged = allMeals.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });
  const t = ctxTargets || MOCK_TARGETS
  const target = { kcal: t.target, p: t.protein, c: t.carbs, f: t.fat };

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[2] }}>
        <FNum size={48} weight={200}>{logged.kcal}</FNum>
        <FMono color={Color.mute}>/ {target.kcal} KCAL</FMono>
      </div>
      <div style={{ marginTop: 8 }}>
        <FTexBar pct={(logged.kcal / target.kcal) * 100} height={8}/>
      </div>

      {/* Macro pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 20 }}>
        <FSurface style={{ padding: '14px 10px', textAlign: 'center', borderColor: `${Color.accent}55`, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div><FNum size={20} weight={300} unit="g">{logged.p}</FNum></div>
          <FMono color={Color.mute} size={10} style={{ display: 'block' }}>/ {target.p}</FMono>
          <FMono color={Color.accent} size={10} style={{ display: 'block', marginTop: 2 }}>PROTEIN</FMono>
        </FSurface>
        <FSurface style={{ padding: '14px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div><FNum size={20} weight={300} unit="g">{logged.c}</FNum></div>
          <FMono color={Color.mute} size={10} style={{ display: 'block' }}>/ {target.c}</FMono>
          <FMono color={Color.dim} size={10} style={{ display: 'block', marginTop: 2 }}>CARBS</FMono>
        </FSurface>
        <FSurface style={{ padding: '14px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div><FNum size={20} weight={300} unit="g">{logged.f}</FNum></div>
          <FMono color={Color.mute} size={10} style={{ display: 'block' }}>/ {target.f}</FMono>
          <FMono color={Color.dim} size={10} style={{ display: 'block', marginTop: 2 }}>FAT</FMono>
        </FSurface>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginTop: 24, marginBottom: 16, overflowX: 'auto' }}>
        {MEAL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: filter === cat ? `${Color.accent}15` : 'transparent',
            color: filter === cat ? Color.accent : Color.mute,
            fontFamily: Font.mono, fontSize: 10, fontWeight: 600, flexShrink: 0,
            border: `1px solid ${filter === cat ? Color.accent : Color.borderSoft}`,
          }}>{cat}</button>
        ))}
      </div>

      {/* Meal list */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <FLabel mb={0}>Logged meals</FLabel>
        <FMono size={10} color={Color.mute}>{meals.length} {filter === 'ALL' ? 'TOTAL' : filter}</FMono>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {meals.map((m, i) => (
          <FListRow key={i}
            leading={
              <div style={{
                width: 40, height: 40, borderRadius: Radius.md,
                background: Color.surface2, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <FMono color={Color.dim} size={10}>{m.time}</FMono>
              </div>
            }
            title={m.name}
            subtitle={`${m.items}`}
            trailing={
              <div style={{ textAlign: 'right' }}>
                <FMono color={Color.text}>{m.kcal}</FMono>
                {m.batch && <FTag tone="accent" style={{ marginTop: 4 }}>BATCH</FTag>}
              </div>
            }
            divider={i > 0}
          />
        ))}
      </div>

      {/* Remaining */}
      <FSurface style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <FLabel>Remaining</FLabel>
          <FNum size={24} weight={300} unit="kcal">{target.kcal - logged.kcal}</FNum>
        </div>
        <FMono color={Color.dim} size={10}>
          P {target.p - logged.p}g · C {target.c - logged.c}g · F {target.f - logged.f}g
        </FMono>
      </FSurface>

      <div style={{ marginTop: 24 }}>
        <FBtn variant="primary" full size="lg" icon={ICONS.plus}>Log meal</FBtn>
      </div>

      <button onClick={() => pushDetail('macro-heat', 'Adherence')} style={{
        width: '100%', padding: '12px 16px', marginTop: 16, borderRadius: Radius.md,
        background: Color.surface, border: `1px solid ${Color.borderSoft}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <FIcon path={ICONS.chart} size={14} color={Color.dim} stroke={1.8} />
        <FMono size={10} color={Color.dim}>View adherence trends</FMono>
        <FIcon path={ICONS.fwd} size={12} color={Color.faint} style={{ marginLeft: 'auto' }} />
      </button>
    </div>
  );
}

export function FoodLogScreen() {
  return (
    <Phone label="Food Log" group="FEEDBACK">
      <FNavBar
        title="Today"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text}/>}
      />
      <FoodLogContent />
      <FTabBar active={2}/>
    </Phone>
  );
}
