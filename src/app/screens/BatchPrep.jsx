// 10 Batch Prep — View suggested meals as production batches.
// Grouping portions into production runs to visualize the efficiency of the plan.

import { useMemo } from 'react'
import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FBtn, FTabBar, Phone } from '../../ui/components'
import { useNav } from '../../context/NavigationContext'
import { useUser } from '../../context/UserContext'
import { deriveBatches } from './nutrition-data'

const BATCH_TYPE_COLORS = { 'FRESH PREP': Color.green, 'BATCH COOK': Color.blue, 'SLOW COOK': Color.accent }

function BatchStat({ label, val }) {
  return (
    <div>
      <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, marginRight: 4 }}>{label}</span>
      <span style={{ fontFamily: Font.mono, fontSize: 12, color: Color.text, fontWeight: 500 }}>{val}g</span>
    </div>
  );
}

export function BatchPrepContent() {
  const { pushDetail } = useNav()
  const { mealPlan } = useUser()

  const HARDCODED_BATCHES = [
    {
      n: 'Cook Fresh',
      portions: 4,
      type: 'FRESH PREP',
      time: '32m',
      tone: BATCH_TYPE_COLORS['FRESH PREP'],
      macros: { p: 42, c: 12, f: 22 },
      recipes: [{ name: 'Garlic Salmon & Greens', servings: 4 }],
    },
    {
      n: 'Batch Prep',
      portions: 5,
      type: 'BATCH COOK',
      time: '48m',
      tone: BATCH_TYPE_COLORS['BATCH COOK'],
      macros: { p: 48, c: 62, f: 12 },
      recipes: [{ name: 'Chicken & Rice Bowls', servings: 3 }, { name: 'Breakfast Burritos', servings: 2 }],
    },
    {
      n: 'Slow Cook',
      portions: 5,
      type: 'SLOW COOK',
      time: '1h 05m',
      tone: BATCH_TYPE_COLORS['SLOW COOK'],
      macros: { p: 38, c: 14, f: 24 },
      recipes: [{ name: 'High-Protein Beef Chili', servings: 3 }, { name: 'Slow-Cook Pulled Pork', servings: 2 }],
    },
  ];

  const TYPE_LABELS = { batch: 'BATCH COOK', slow_cook: 'SLOW COOK', fresh: 'FRESH PREP' }
  const TYPE_COLORS = { batch: BATCH_TYPE_COLORS['BATCH COOK'], slow_cook: BATCH_TYPE_COLORS['SLOW COOK'], fresh: BATCH_TYPE_COLORS['FRESH PREP'] }

  const batches = useMemo(() => {
    if (!mealPlan) return HARDCODED_BATCHES
    const derived = deriveBatches(mealPlan)
    return derived.map(b => {
      const fmtTime = b.totalTime >= 60 ? `${Math.floor(b.totalTime / 60)}h ${String(b.totalTime % 60).padStart(2, '0')}m` : `${b.totalTime}m`
      const portions = Math.round(b.totalPortions)
      const totalP = b.recipes.reduce((s, r) => s + (r.macros?.protein || 0) * r.servings, 0)
      const totalC = b.recipes.reduce((s, r) => s + (r.macros?.carbs || 0) * r.servings, 0)
      const totalF = b.recipes.reduce((s, r) => s + (r.macros?.fat || 0) * r.servings, 0)
      return {
        n: b.label,
        recipes: b.recipes.map(r => ({ name: r.name, servings: Math.round(r.servings) })),
        portions,
        type: TYPE_LABELS[b.type] || b.label,
        time: fmtTime,
        tone: TYPE_COLORS[b.type] || b.color,
        macros: { p: Math.round(totalP / portions), c: Math.round(totalC / portions), f: Math.round(totalF / portions) },
      }
    })
  }, [mealPlan]);

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <FNum size={40} weight={300}>{batches.length}</FNum>
        <div>
          <div style={{ fontSize: 18, fontWeight: 300, color: Color.text }}>Batches</div>
          <FMono color={Color.dim} size={10}>{mealPlan?.meals?.length || 14} MEALS TOTAL · WEEK 19</FMono>
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: Space[4] }}>
        {batches.map((b, i) => (
          <FSurface key={i}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <FTag tone="mute" size="sm">{b.type}</FTag>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <FMono color={Color.text} size={14}>{b.portions}</FMono>
                <FMono color={Color.mute} size={10}>PORTIONS</FMono>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {(b.recipes || []).map((r, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 400, color: Color.text }}>{r.name}</span>
                  <FMono color={Color.mute} size={10}>{r.servings}×</FMono>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: Space[3], padding: '10px 0', borderTop: `1px solid ${Color.borderSoft}` }}>
              <BatchStat label="P" val={b.macros.p} />
              <BatchStat label="C" val={b.macros.c} />
              <BatchStat label="F" val={b.macros.f} />
              <FMono color={Color.mute} size={10} style={{ marginLeft: 'auto' }}>AVG / PORTION</FMono>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, paddingTop: 6 }}>
              <FLabel mb={0} size={10}>Est. Time</FLabel>
              <FMono color={Color.text} size={12}>{b.time}</FMono>
            </div>
          </FSurface>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: Space[5], justifyContent: 'center' }}>
        {Object.entries(BATCH_TYPE_COLORS).map(([label, c]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, flexShrink: 0 }} />
            <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 0.8 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 16, borderRadius: Radius.lg, border: `1px dashed ${Color.borderSoft}` }}>
        <FLabel mb={6}>Production efficiency</FLabel>
        <div style={{ fontSize: 13, color: Color.dim, lineHeight: 1.5 }}>
          Batching these 3 runs saves approximately <FMono color={Color.accent}>2h 15m</FMono> compared to individual daily prep.
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: Space[3] }}>
        <FBtn variant="ghost" full style={{ flex: 1 }}>Edit Meal Queue</FBtn>
        <FBtn variant="split" full style={{ flex: 1.5 }} iconLeading={ICONS.cart} onClick={() => pushDetail('fridge', 'Pantry')}>Finalize Shopping List</FBtn>
      </div>
    </div>
  );
}

export function BatchPrepScreen() {
  return (
    <Phone label="Production batches" group="MEALS">
      <FNavBar
        title="Batch Strategy"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text}/>}
      />
      <BatchPrepContent />
      <FTabBar active={1}/>
    </Phone>
  );
}
