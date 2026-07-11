// Cook Summary — post-cook recap with portions, batches, and time saved.

import { useMemo } from 'react'
import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FBtn, FSurface, FListRow, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { deriveBatches, METHOD_COLORS } from './nutrition-data'

export function CookSummaryContent({ onDone }) {
  const { pushDetail } = useNav()
  const { logCook, mealPlan } = useUser()

  const HARDCODED_BATCHES = [
    { name: 'Garlic salmon + greens', portions: 4, time: '25m', color: Color.green },
    { name: 'Chicken rice bowls',     portions: 5, time: '48m', color: Color.blue },
    { name: 'Beef chili · slow cook', portions: 5, time: '1h 05m', color: Color.accent },
  ];

  const COLOR_MAP = { batch: Color.blue, slow_cook: Color.accent, fresh: Color.green }

  const batches = useMemo(() => {
    if (!mealPlan) return HARDCODED_BATCHES
    const derived = deriveBatches(mealPlan)
    return derived.map(b => {
      const fmtTime = b.totalTime >= 60 ? `${Math.floor(b.totalTime / 60)}h ${String(b.totalTime % 60).padStart(2, '0')}m` : `${b.totalTime}m`
      return {
        name: b.recipes.map(r => r.name).join(' · '),
        portions: b.totalPortions,
        time: fmtTime,
        color: COLOR_MAP[b.type] || b.color,
      }
    })
  }, [mealPlan]);

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `${Color.green}15`, border: `2px solid ${Color.green}40`,
          display: 'grid', placeItems: 'center', margin: '0 auto 16px',
        }}>
          <FIcon path={ICONS.check} size={28} color={Color.green} stroke={2.5}/>
        </div>
        <FNum size={40} weight={200}>1:38</FNum>
        <FMono color={Color.mute}>COOK SESSION COMPLETE</FMono>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        <FSurface style={{ padding: 16, textAlign: 'center' }}>
          <FLabel mb={4}>Portions</FLabel>
          <FNum size={22} weight={300}>{batches.reduce((s, b) => s + b.portions, 0)}</FNum>
        </FSurface>
        <FSurface style={{ padding: 16, textAlign: 'center' }}>
          <FLabel mb={4}>Batches</FLabel>
          <FNum size={22} weight={300}>{batches.length}</FNum>
        </FSurface>
        <FSurface style={{ padding: 16, textAlign: 'center' }}>
          <FLabel mb={4}>Time saved</FLabel>
          <FNum size={22} weight={300} unit="m">42</FNum>
        </FSurface>
      </div>

      {/* Batch breakdown */}
      <FLabel mt={8} mb={12}>Batch breakdown</FLabel>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {batches.map((b, i) => (
          <FListRow key={i}
            leading={<div style={{ width: 4, height: 32, borderRadius: 2, background: b.color }}/>}
            title={b.name}
            subtitle={`${b.portions} PORTIONS · ${b.time}`}
            trailing={<FTag tone="green">DONE</FTag>}
            divider={i > 0}
          />
        ))}
      </div>

      {/* Macro contribution */}
      <FSurface style={{ marginTop: 24 }}>
        <FLabel mb={8}>Macro contribution this week</FLabel>
        <div style={{ display: 'flex', gap: Space[4] }}>
          <div style={{ flex: 1 }}>
            <FMono color={Color.accent} size={10}>PROTEIN</FMono>
            <FNum size={20} weight={300} unit="g">{mealPlan?.weeklyMacros?.protein || 588}</FNum>
          </div>
          <div style={{ flex: 1 }}>
            <FMono color={Color.mute} size={10}>CARBS</FMono>
            <FNum size={20} weight={300} unit="g">{mealPlan?.weeklyMacros?.carbs || 720}</FNum>
          </div>
          <div style={{ flex: 1 }}>
            <FMono color={Color.mute} size={10}>FAT</FMono>
            <FNum size={20} weight={300} unit="g">{mealPlan?.weeklyMacros?.fat || 252}</FNum>
          </div>
        </div>
      </FSurface>

      <div style={{ marginTop: 24 }}>
        <FBtn variant="ghost" full icon={ICONS.meal} onClick={() => pushDetail('food-log', 'Food Log')} data-stay="true" style={{ marginBottom: 8 }}>
          Log these meals
        </FBtn>
        <FBtn variant="split" full iconLeading={ICONS.fwd} onClick={() => {
          logCook({
            batches: batches.length,
            portions: batches.reduce((s, b) => s + b.portions, 0),
            protein: mealPlan?.weeklyMacros?.protein || 588,
            carbs: mealPlan?.weeklyMacros?.carbs || 720,
            fat: mealPlan?.weeklyMacros?.fat || 252,
          })
          onDone?.()
        }}>Log meal &amp; finish</FBtn>
      </div>
    </div>
  );
}

export function CookSummaryScreen() {
  return (
    <Phone label="Cook Summary" group="MEAL PREP">
      <FNavBar
        title="Prep Complete"
        leading={<FIcon path={ICONS.close} size={20} color={Color.text}/>}
      />
      <CookSummaryContent />
    </Phone>
  );
}
