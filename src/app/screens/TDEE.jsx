// 02 TDEE — living graph with narrowing confidence band.

import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FTabBar, Phone } from '../../ui/components'
import { LineChart } from '../../ui/chart'

// Mock trajectory data — 9 data points over 12 weeks
const TDEE_DATA = [2180, 2250, 2300, 2340, 2280, 2360, 2380, 2400, 2420]

// Confidence band narrows over time: wide early, tight now
const BAND_NARROW = (t) => 140 + (1 - t) * 280  // 420 → 140 kcal
const BAND_WIDE = 420                             // Day 3: constant wide band

export function TDEEContent() {
  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[3] }}>
        <FNum size={76} weight={200} unit="kcal">2,420</FNum>
      </div>

      <div style={{ marginTop: 24 }}>
        <LineChart
          data={TDEE_DATA.map(v => v - 220)}
          band={BAND_WIDE}
          animated
          title="DAY 03"
          titleSublabel="\u00b1420 KCAL"
          titleValue="2,200"
          titleUnit="kcal"
          height={160}
          showDots={true}
        />
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FSurface style={{ padding: 16, borderRadius: Radius.lg }}>
          <FLabel mb={4}>BMR estimate</FLabel>
          <FNum size={22} weight={300} unit="kcal">1,620</FNum>
        </FSurface>
        <FSurface style={{ padding: 16, borderRadius: Radius.lg }}>
          <FLabel mb={4}>Activity</FLabel>
          <FNum size={22} weight={300} unit="kcal">+800</FNum>
        </FSurface>
      </div>

      <FSurface style={{ marginTop: 24, padding: 16, borderRadius: Radius.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <FLabel mb={0}>Model confidence</FLabel>
          <FMono color={Color.text}>74%</FMono>
        </div>
        <FTexBar pct={74} height={10}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <FMono color={Color.mute} size={9}>18 DAYS LOGGED</FMono>
          <FMono color={Color.mute} size={9}>TIGHTENS WITH USE</FMono>
        </div>
      </FSurface>
    </div>
  );
}

export function TDEEScreen() {
  return (
    <Phone label="TDEE · today" group="MODEL">
      <FNavBar title="Expenditure" leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>} trailing={<FIcon path={ICONS.more} size={20} color={Color.text}/>} />
      <TDEEContent />
      <FTabBar active={3}/>
    </Phone>
  );
}

export function TDEECompareScreen() {
  return (
    <Phone label="Trust over time" group="MODEL">
      <FNavBar
        title="Confidence"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <div style={{ marginTop: 6 }}>
          <FNum size={48} weight={200}>Trust visible.</FNum>
        </div>
        <div style={{ marginTop: 12, fontSize: 14, color: Color.dim, lineHeight: 1.6, fontFamily: Font.mono }}>
          The model widens when new, narrows as you log. Uncertainty is shown, not hidden.
        </div>

        <div style={{ marginTop: 32 }}>
          <LineChart
            data={TDEE_DATA.map(v => v - 220)}
            band={BAND_WIDE}
            animated
            title="DAY 03"
            titleSublabel={"\u00b1420 KCAL"}
            titleValue="2,200"
            titleUnit="kcal"
            height={140}
            showDots={true}
          />
        </div>

        <div style={{ marginTop: 32, padding: 16, borderRadius: Radius.lg, border: `1px dashed ${Color.borderSoft}` }}>
          <FLabel mb={6}>What changed</FLabel>
          <div style={{ ...Type.bodyMd, color: Color.dim }}>
            87 weigh-ins, 81 food logs, two phase transitions. The model now estimates expenditure within a 6% window for you specifically.
          </div>
        </div>
      </div>
    </Phone>
  );
}
