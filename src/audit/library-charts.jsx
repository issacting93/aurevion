// Chart previews — line, bar, arc, comparison, bodyweight, interaction states.

function BarChartPreview() {
  const data = [40, 90, 75, 60];
  const days = ['M', 'T', 'W', 'T'];
  return (
    <PreviewBase>
      <H1>BarMark</H1>
      <Caption>Geometry-first; titles, values, and legends compose outside.</Caption>
      <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute, letterSpacing: 1, marginTop: 6 }}>BARS · BASELINE</div>
      <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 28, padding: '20px 8px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 18, left: 8, fontSize: 22, fontWeight: 700 }}>72</div>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: '100%', height: `${v}%`, background: T.green, borderRadius: 2 }}/>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textDim }}>{days[i]}</div>
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

function ArcChartPreview() {
  return (
    <PreviewBase>
      <H1>ArcMark</H1>
      <Caption>Concentric arcs with labels rendered as separate composition.</Caption>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, position: 'relative' }}>
        <svg width={240} height={240} viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={120} cy={120} r={100} stroke="rgba(255,255,255,0.05)" strokeWidth="14" fill="none"/>
          <circle cx={120} cy={120} r={100} stroke={T.cyan} strokeWidth="14" fill="none"
                  strokeDasharray={2*Math.PI*100} strokeDashoffset={2*Math.PI*100 * (1 - 0.78)} strokeLinecap="round"/>
          <circle cx={120} cy={120} r={78} stroke="rgba(255,255,255,0.05)" strokeWidth="14" fill="none"/>
          <circle cx={120} cy={120} r={78} stroke={T.amber} strokeWidth="14" fill="none"
                  strokeDasharray={2*Math.PI*78} strokeDashoffset={2*Math.PI*78 * (1 - 0.58)} strokeLinecap="round"/>
          <circle cx={120} cy={120} r={56} stroke="rgba(255,255,255,0.05)" strokeWidth="14" fill="none"/>
          <circle cx={120} cy={120} r={56} stroke={T.purple} strokeWidth="14" fill="none"
                  strokeDasharray={2*Math.PI*56} strokeDashoffset={2*Math.PI*56 * (1 - 0.32)} strokeLinecap="round"/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>68%</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute, letterSpacing: 1 }}>MACRO TARGETS</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 18, fontFamily: FONTS.mono, fontSize: 10 }}>
        <span style={{ color: T.cyan }}>● protein</span>
        <span style={{ color: T.amber }}>● carbs</span>
        <span style={{ color: T.purple }}>● fat</span>
      </div>
    </PreviewBase>
  );
}

function LineChartPreview() {
  const path = "M 10 130 L 50 120 L 90 115 L 130 95 L 170 75 L 210 78 L 250 65";
  const area = "M 10 130 L 50 120 L 90 115 L 130 95 L 170 75 L 210 78 L 250 65 L 250 180 L 10 180 Z";
  return (
    <PreviewBase>
      <H1>LineMark + AreaMark</H1>
      <Caption>Flagged: line work is being demoted. Most surfaces should use Bar / Comparison.</Caption>
      <div style={{ marginTop: 14, position: 'relative' }}>
        <svg width="100%" viewBox="0 0 260 200">
          <line x1="0" y1="100" x2="260" y2="100" stroke={T.amber} strokeDasharray="4 4" strokeOpacity="0.5"/>
          <text x="220" y="94" fontSize="9" fill={T.textMute} fontFamily={FONTS.mono}>avg</text>
          <rect x="10" y="60" width="240" height="50" fill={T.cyan} fillOpacity="0.08"/>
          <text x="10" y="55" fontSize="9" fill={T.textMute} fontFamily={FONTS.mono}>target band</text>
          <path d={area} fill={T.cyan} fillOpacity="0.12"/>
          <path d={path} stroke={T.cyan} strokeWidth="2" fill="none"/>
          <circle cx="130" cy="95" r="3" fill={T.cyan}/>
          <text x="115" y="80" fontSize="12" fill="#fff" fontWeight="600">2710</text>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.mono, fontSize: 9, color: T.textMute }}>
          <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
        </div>
      </div>
    </PreviewBase>
  );
}

function ComparisonChartPreview() {
  const data = [
    { d: 'Mon', a: 45, t: 60 },
    { d: 'Tue', a: 80, t: 70 },
    { d: 'Thu', a: 95, t: 85 },
    { d: 'Sat', a: 70, t: 72 },
  ];
  return (
    <PreviewBase>
      <H1>Comparison Bars</H1>
      <Caption>Grouped pairs for actual vs target. The strongest chart in the system.</Caption>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14, fontFamily: FONTS.mono, fontSize: 10 }}>
        <span style={{ color: T.green }}>● actual</span>
        <span style={{ color: T.amber }}>● target</span>
      </div>
      <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 24, padding: '18px 6px 24px', borderTop: `1px solid ${T.borderSoft}`, marginTop: 12 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end', height: 150 }}>
              <div style={{ flex: 1, height: `${d.a}%`, background: T.green, borderRadius: '2px 2px 0 0' }}/>
              <div style={{ flex: 1, height: `${d.t}%`, background: T.amber, borderRadius: '2px 2px 0 0' }}/>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textDim }}>{d.d}</div>
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

function BodyweightPreview() {
  return (
    <PreviewBase scroll>
      <H1>Bodyweight trend</H1>
      <Caption>Current: line/area. Proposed: weekly-average bar with check-in overlay.</Caption>
      <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: T.surface, border: `1px solid ${T.borderSoft}` }}>
        <SectionLabel>Embedded</SectionLabel>
        <div style={{ display: 'flex', gap: 14, marginBottom: 8, fontFamily: FONTS.mono, fontSize: 10 }}>
          <span style={{ color: T.cyan }}>━ actual</span>
          <span style={{ color: T.amber }}>━ trend</span>
        </div>
        <svg width="100%" viewBox="0 0 260 100">
          <line x1="0" y1="60" x2="260" y2="60" stroke={T.blue} strokeDasharray="3 3" strokeOpacity="0.6"/>
          <path d="M 10 10 L 50 25 L 90 30 L 130 40 L 170 55 L 210 70 L 250 80" stroke={T.cyan} strokeWidth="2" fill="none"/>
          <path d="M 10 15 L 50 28 L 90 38 L 130 50 L 170 62 L 210 72 L 250 82" stroke={T.amber} strokeWidth="2" fill="none"/>
          <circle cx="210" cy="70" r="3" fill={T.blue}/>
          <text x="210" y="92" fontSize="8" fill={T.textMute} fontFamily={FONTS.mono} textAnchor="middle">check-in</text>
        </svg>
      </div>

      <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: 'rgba(255,110,80,0.04)', border: `1px solid rgba(255,110,80,0.25)` }}>
        <SectionLabel>Proposed · weekly average</SectionLabel>
        <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '14px 4px 0' }}>
          {[85, 82, 78, 76, 74, 71, 70].map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${v}%`, background: T.cyan, opacity: 0.45 + i * 0.08, borderRadius: '2px 2px 0 0' }}/>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute, marginTop: 8, textAlign: 'center' }}>W-7 → W-1 · simpler signal</div>
      </div>
    </PreviewBase>
  );
}

function InteractionPreview() {
  const Pill = ({ label, color }) => (
    <span style={{
      padding: '6px 12px', borderRadius: 999,
      background: `${color}1f`, color, border: `1px solid ${color}55`,
      fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500,
    }}>{label}</span>
  );
  return (
    <PreviewBase scroll>
      <H1>Interaction & semantics</H1>
      <Caption>Flagged as &quot;AI slop&quot; — these are typedefs, not a public design surface.</Caption>

      <div style={{
        marginTop: 14, padding: 14, borderRadius: 14,
        background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.25)`,
      }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.red, letterSpacing: 1, marginBottom: 6 }}>REMOVE FROM PUBLIC GALLERY</div>
        <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.55 }}>
          These state enums (gesture, series key, threshold) belong in code-level typedefs. Surfacing them in a design audit creates noise without product value.
        </div>
      </div>

      <SectionLabel>GestureState</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <Pill label="idle" color={T.textDim}/>
        <Pill label="pressed" color={T.textDim}/>
        <Pill label="dragging" color={T.amber}/>
        <Pill label="selected" color={T.accent}/>
        <Pill label="disabled" color={T.red}/>
      </div>
      <SectionLabel>ThresholdState</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Pill label="below" color={T.amber}/>
        <Pill label="near"  color={T.red}/>
        <Pill label="within" color={T.green}/>
        <Pill label="above" color={T.red}/>
      </div>
    </PreviewBase>
  );
}

Object.assign(window, {
  BarChartPreview, ArcChartPreview, LineChartPreview,
  ComparisonChartPreview, BodyweightPreview, InteractionPreview,
});
