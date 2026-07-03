// Daily Food Log — meal logging with macro tracking.

import { useState } from 'react'
import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FTag, FBtn, FSurface, FListRow, FTabBar, Phone } from '../../ui/components'

export function FoodLogContent() {
  const meals = [
    { time: '08:30', name: 'Breakfast', items: 'Oats, banana, whey', kcal: 420, p: 32, c: 58, f: 8 },
    { time: '12:00', name: 'Lunch',     items: 'Chicken rice bowl (batch)', kcal: 620, p: 48, c: 64, f: 14, batch: true },
    { time: '15:30', name: 'Snack',     items: 'Greek yoghurt, berries', kcal: 180, p: 18, c: 16, f: 6 },
  ];
  const logged = meals.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });
  const target = { kcal: 1660, p: 147, c: 160, f: 60 };

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <FLabel>Today</FLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[2], marginTop: 4 }}>
        <FNum size={48} weight={200}>{logged.kcal}</FNum>
        <FMono color={Color.mute}>/ {target.kcal} KCAL</FMono>
      </div>
      <div style={{ marginTop: 8 }}>
        <FTexBar pct={(logged.kcal / target.kcal) * 100} height={8}/>
      </div>

      {/* Macro pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 20 }}>
        <FSurface style={{ padding: 12, textAlign: 'center', borderColor: `${Color.accent}55` }}>
          <FLabel mb={2} color={Color.accent}>Protein</FLabel>
          <FNum size={20} weight={300} unit="g">{logged.p}</FNum>
          <FMono color={Color.mute} size={9}>/ {target.p}</FMono>
        </FSurface>
        <FSurface style={{ padding: 12, textAlign: 'center' }}>
          <FLabel mb={2}>Carbs</FLabel>
          <FNum size={20} weight={300} unit="g">{logged.c}</FNum>
          <FMono color={Color.mute} size={9}>/ {target.c}</FMono>
        </FSurface>
        <FSurface style={{ padding: 12, textAlign: 'center' }}>
          <FLabel mb={2}>Fat</FLabel>
          <FNum size={20} weight={300} unit="g">{logged.f}</FNum>
          <FMono color={Color.mute} size={9}>/ {target.f}</FMono>
        </FSurface>
      </div>

      {/* Meal list */}
      <FLabel mt={32} mb={12}>Logged meals</FLabel>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {meals.map((m, i) => (
          <FListRow key={i}
            leading={
              <div style={{
                width: 40, height: 40, borderRadius: Radius.md,
                background: Color.surface2, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <FMono color={Color.dim} size={9}>{m.time}</FMono>
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
