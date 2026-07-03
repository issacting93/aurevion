// Cook Summary — post-cook recap with portions, batches, and time saved.

import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FBtn, FSurface, FListRow, Phone } from '../../ui/components'

export function CookSummaryContent() {
  const batches = [
    { name: 'Garlic salmon + greens', portions: 4, time: '25m', color: Color.accent },
    { name: 'Chicken rice bowls',     portions: 5, time: '48m', color: Color.blue },
    { name: 'Beef chili · slow cook', portions: 5, time: '1h 05m', color: Color.purple },
  ];

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
        <FNum size={42} weight={200}>1:38</FNum>
        <FMono color={Color.mute}>COOK SESSION COMPLETE</FMono>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Portions</FLabel>
          <FNum size={22} weight={300}>14</FNum>
        </FSurface>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Batches</FLabel>
          <FNum size={22} weight={300}>3</FNum>
        </FSurface>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
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
            <FNum size={20} weight={300} unit="g">588</FNum>
          </div>
          <div style={{ flex: 1 }}>
            <FMono color={Color.mute} size={10}>CARBS</FMono>
            <FNum size={20} weight={300} unit="g">720</FNum>
          </div>
          <div style={{ flex: 1 }}>
            <FMono color={Color.mute} size={10}>FAT</FMono>
            <FNum size={20} weight={300} unit="g">252</FNum>
          </div>
        </div>
      </FSurface>

      <div style={{ marginTop: 24 }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd}>Done</FBtn>
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
