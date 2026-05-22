// 02 TDEE — living graph with narrowing confidence band.

// Smooth catmull-rom to cubic bezier path
function smoothPath(pts) {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M${pts[0][0]} ${pts[0][1]}L${pts[1][0]} ${pts[1][1]}`;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const tension = 0.35;
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function TDEEPath({ wide = false, width = 320, height = 180 }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const center = [
    [0, 110], [40, 102], [80, 96], [120, 92], [160, 95],
    [200, 90], [240, 88], [280, 86], [320, 86],
  ];
  const top = center.map(([x], i) => {
    const t = i / (center.length - 1);
    const spread = wide ? 80 : 22 + (1 - t) * 30;
    return [x, center[i][1] - spread / 2];
  });
  const bot = center.map(([x], i) => {
    const t = i / (center.length - 1);
    const spread = wide ? 80 : 22 + (1 - t) * 30;
    return [x, center[i][1] + spread / 2];
  });

  // Smooth bezier paths
  const topPath = smoothPath(top);
  const botReversed = smoothPath(bot.slice().reverse());
  const bandD = topPath + ' L' + botReversed.slice(1) + ' Z';
  const lineD = smoothPath(center);

  const uid = React.useId ? React.useId() : `tdee-${wide}`;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={F.accent} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={F.accent} stopOpacity="0.02"/>
        </linearGradient>
        <pattern id={`${uid}-hatch`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={F.accent} strokeWidth="1" strokeOpacity="0.35"/>
        </pattern>
        <clipPath id={`${uid}-reveal`}>
          <rect x="0" y="0" width={mounted ? width : 0} height={height}
            style={{ transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}/>
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-reveal)`}>
        {/* Gradient fill under band */}
        <path d={bandD} fill={`url(#${uid}-grad)`}/>
        {/* Hatched overlay on band */}
        <path d={bandD} fill={`url(#${uid}-hatch)`} fillOpacity="0.5"/>
        {/* Smooth center line */}
        <path d={lineD} stroke={F.accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Data points */}
        {center.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === center.length - 1 ? 4 : 2}
            fill={i === center.length - 1 ? F.accent : 'transparent'}
            stroke={F.accent} strokeWidth={i === center.length - 1 ? 0 : 1.2}
            strokeOpacity={i === center.length - 1 ? 1 : 0.4}/>
        ))}
        {/* Pulse ring on current point */}
        <circle cx={center[center.length - 1][0]} cy={center[center.length - 1][1]} r="8"
          fill="none" stroke={F.accent} strokeWidth="1.5" opacity={mounted ? 0 : 0}
          style={{ animation: mounted ? 'tdeePulseRing 2s ease-out infinite 1.2s' : 'none' }}/>
      </g>
      <style>{`@keyframes tdeePulseRing { 0% { r: 4; opacity: 0.6; } 100% { r: 14; opacity: 0; } }`}</style>
    </svg>
  );
}

function TDEEScreen() {
  return (
    <Phone label="TDEE · today" group="MODEL">
      <FNavBar
        title="Expenditure"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <FLabel>TDEE · 7-day average</FLabel>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <FNum size={76} weight={200} unit="kcal">2,420</FNum>
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
          <FMono color={F.dim}>±142 KCAL · 95% CI</FMono>
          <FTag tone="green" icon={<FIcon path={ICONS.trend_dn} size={11} stroke={2.4}/>}>NARROWING</FTag>
        </div>

        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FLabel mb={0}>12-week trajectory</FLabel>
            <FMono color={F.mute}>kcal/day</FMono>
          </div>
          <div style={{ marginTop: 10, height: 180 }}>
            <TDEEPath wide={false}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <FMono color={F.mute} size={9}>W-12</FMono>
            <FMono color={F.mute} size={9}>W-8</FMono>
            <FMono color={F.mute} size={9}>W-4</FMono>
            <FMono color={F.accent} size={9} letter={1}>NOW</FMono>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
            <FLabel mb={4}>BMR estimate</FLabel>
            <FNum size={22} weight={300} unit="kcal">1,620</FNum>
          </div>
          <div style={{ padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
            <FLabel mb={4}>Activity</FLabel>
            <FNum size={22} weight={300} unit="kcal">+800</FNum>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <FLabel mb={0}>Model confidence</FLabel>
            <FMono color={F.text}>74%</FMono>
          </div>
          <FTexBar pct={74} height={10}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <FMono color={F.mute} size={9}>18 DAYS LOGGED</FMono>
            <FMono color={F.mute} size={9}>TIGHTENS WITH USE</FMono>
          </div>
        </div>
      </div>
      <FTabBar active={3}/>
    </Phone>
  );
}

function TDEECompareScreen() {
  return (
    <Phone label="Trust over time" group="MODEL">
      <FNavBar
        title="Confidence"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <FLabel>How the band tightens</FLabel>
        <div style={{ marginTop: 6 }}>
          <FNum size={36} weight={200}>Trust visible.</FNum>
        </div>
        <FMono color={F.dim} size={12}>The model widens when new, narrows as you log. Uncertainty is shown, not hidden.</FMono>

        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <FLabel mb={0}>Day 03</FLabel>
            <FMono color={F.mute}>±420 KCAL</FMono>
          </div>
          <FNum size={26} weight={200} unit="kcal">2,200</FNum>
          <div style={{ marginTop: 12, height: 130 }}>
            <TDEEPath wide={true}/>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.accent}40` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <FLabel mb={0} color={F.accent}>Day 87 · today</FLabel>
            <FMono color={F.accent}>±142 KCAL</FMono>
          </div>
          <FNum size={26} weight={200} unit="kcal">2,420</FNum>
          <div style={{ marginTop: 12, height: 130 }}>
            <TDEEPath wide={false}/>
          </div>
        </div>

        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, border: `1px dashed ${F.borderSoft}` }}>
          <FLabel mb={6}>What changed</FLabel>
          <div style={{ fontSize: 13, color: F.dim, lineHeight: 1.55 }}>
            87 weigh-ins, 81 food logs, two phase transitions. The model now estimates expenditure within a 6% window for you specifically.
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { TDEEScreen, TDEECompareScreen });
