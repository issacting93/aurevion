// Water Tracking — daily hydration logging with visual progress.

import { useState } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FRing, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FSurface, FTabBar, FListRow, Phone } from '../../ui/components'

export function WaterTrackingContent() {
  const [glasses, setGlasses] = useState(5);
  const glassSize = 250;
  const current = glasses * glassSize;
  const target = 2500;

  const log = [
    { time: '07:15', ml: 250 },
    { time: '09:30', ml: 250 },
    { time: '11:00', ml: 500 },
    { time: '13:45', ml: 250 },
  ];

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      {/* Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 28 }}>
        <FRing value={current} max={target} size={160} color={Color.blue}>
          <FNum size={36} weight={200} color={Color.blue}>{current}</FNum>
          <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 1.4, marginTop: 2 }}>/ {target} ML</div>
        </FRing>
      </div>

      {/* Quick add */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Space[2], marginBottom: 28 }}>
        {[150, 250, 350, 500].map(ml => (
          <button key={ml} onClick={() => setGlasses(g => g + 1)} style={{
            padding: `${Space[3]}px ${Space[1]}px`, borderRadius: Radius.lg,
            background: Color.surface, border: `1px solid ${Color.borderSoft}`,
            color: Color.text, cursor: 'pointer', textAlign: 'center',
            fontFamily: Font.mono, fontSize: 13, fontWeight: 500,
            transition: 'border-color 0.15s ease',
          }}>
            <div style={{ color: Color.blue, marginBottom: 2 }}>+{ml}</div>
            <div style={{ fontSize: 9, color: Color.mute }}>ML</div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Today</FLabel>
          <FNum size={20} weight={300} unit="ml">{current}</FNum>
        </FSurface>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Avg 7d</FLabel>
          <FNum size={20} weight={300} unit="ml">2,100</FNum>
        </FSurface>
        <FSurface style={{ padding: 14, textAlign: 'center' }}>
          <FLabel mb={4}>Streak</FLabel>
          <FNum size={20} weight={300}>3d</FNum>
        </FSurface>
      </div>

      {/* Progress bar */}
      <FSurface style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <FLabel>Daily progress</FLabel>
          <FMono color={current >= target ? Color.green : Color.blue}>{Math.round(current / target * 100)}%</FMono>
        </div>
        <FTexBar pct={(current / target) * 100} height={8} color={Color.blue}/>
      </FSurface>

      {/* Log */}
      <FLabel mb={12}>Today's log</FLabel>
      {log.map((entry, i) => (
        <FListRow key={i}
          title={<FMono color={Color.mute}>{entry.time}</FMono>}
          trailing={<FMono color={Color.blue}>+{entry.ml} ml</FMono>}
          divider={i > 0}
          compact
        />
      ))}
    </div>
  );
}

export function WaterTrackingScreen() {
  return (
    <Phone label="Water" group="FEEDBACK">
      <FNavBar
        title="Hydration"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
      />
      <WaterTrackingContent />
      <FTabBar active={2}/>
    </Phone>
  );
}
