// 10 Batch Prep — View suggested meals as production batches.
// Grouping portions into production runs to visualize the efficiency of the plan.

import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FBtn, FTabBar, Phone } from '../../ui/components'

function BatchStat({ label, val }) {
  return (
    <div>
      <span style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute, marginRight: 4 }}>{label}</span>
      <span style={{ fontFamily: Font.mono, fontSize: 12, color: Color.text, fontWeight: 500 }}>{val}g</span>
    </div>
  );
}

export function BatchPrepContent() {
  const batches = [
    {
      n: 'Garlic salmon \u00B7 greens',
      portions: 4,
      type: 'FRESH PREP',
      time: '32m',
      tone: Color.accent,
      macros: { p: 42, c: 12, f: 22 },
      ings: ['4 Salmon fillets', '2 Bunches Asparagus', 'Lemon', 'Garlic']
    },
    {
      n: 'Chicken rice bowls',
      portions: 5,
      type: 'BATCH COOK',
      time: '48m',
      tone: Color.blue,
      macros: { p: 48, c: 62, f: 12 },
      ings: ['1kg Chicken Breast', '500g Jasmine Rice', 'Broccoli', 'Soy']
    },
    {
      n: 'Beef chili \u00B7 slow cook',
      portions: 5,
      type: 'SLOW COOK',
      time: '1h 05m',
      tone: Color.purple,
      macros: { p: 38, c: 14, f: 24 },
      ings: ['800g Lean Beef', 'Kidney Beans', 'Tomato', 'Spices']
    },
  ];

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <FLabel>The production plan</FLabel>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <FNum size={64} weight={200}>03</FNum>
        <div>
          <div style={{ fontSize: 18, fontWeight: 300, color: Color.text }}>Batches</div>
          <FMono color={Color.dim} size={10}>14 MEALS TOTAL · WEEK 19</FMono>
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: Space[4] }}>
        {batches.map((b, i) => (
          <FSurface key={i}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <FTag tone="mute" size="sm" style={{ marginBottom: 8 }}>{b.type}</FTag>
                <div style={{ fontSize: 18, fontWeight: 400, color: Color.text }}>{b.n}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <FNum size={28} weight={200} unit="X">{b.portions}</FNum>
                <FMono color={Color.mute} size={9} style={{ display: 'block', marginTop: 2 }}>PORTIONS</FMono>
              </div>
            </div>

            <div style={{ display: 'flex', gap: Space[3], marginBottom: 16 }}>
              <BatchStat label="P" val={b.macros.p} />
              <BatchStat label="C" val={b.macros.c} />
              <BatchStat label="F" val={b.macros.f} />
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <FLabel mb={0} size={9}>Est. Time</FLabel>
                <FMono color={Color.text} size={12}>{b.time}</FMono>
              </div>
            </div>

            <div style={{ padding: '12px 0', borderTop: `1px solid ${Color.borderSoft}` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {b.ings.map((ing, j) => (
                  <span key={j} style={{
                    fontSize: 11, color: Color.dim, background: 'rgba(255,255,255,0.03)',
                    padding: '4px 8px', borderRadius: Radius.sm, border: `1px solid ${Color.borderSoft}`
                  }}>{ing}</span>
                ))}
              </div>
            </div>
          </FSurface>
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
        <FBtn variant="split" full style={{ flex: 1.5 }} iconLeading={ICONS.cart}>Finalize Shopping List</FBtn>
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
