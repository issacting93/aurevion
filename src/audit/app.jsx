// Storybook shell — top bar, left rail, stage, right inspector.

const RENDERERS = {
  featureCard: window.FeatureCardPreview,
  stackWindow: window.StackWindowPreview,
  timeline:    window.TimelinePreview,
  calMonth:    window.CalMonthPreview,
  calWeek:     window.CalWeekPreview,
  calDay:      window.CalDayPreview,
  typography:  window.TypographyPreview,
  iconsLine:   window.IconsLinePreview,
  iconsCooking:window.CookingIconsPreview,
  button:      window.ButtonPreview,
  chip:        window.ChipPreview,
  progressBar: window.ProgressBarPreview,
  progressRing:window.ProgressRingPreview,
  metricProgress: window.MetricProgressPreview,
  barChart:    window.BarChartPreview,
  arcChart:    window.ArcChartPreview,
  lineChart:   window.LineChartPreview,
  comparisonChart: window.ComparisonChartPreview,
  bodyweight:  window.BodyweightPreview,
  interaction: window.InteractionPreview,
  avatar:      window.AvatarPreview,
  input:       window.InputPreview,
  divider:     window.DividerPreview,
  sectionBlock:window.SectionBlockPreview,
  metricCluster:window.MetricClusterPreview,
  expandablePanel: window.ExpandablePanelPreview,
};

const PROPOSED_RENDERERS = {
  featureCard: window.FeatureCardProposedPreview,
  timeline:    window.TimelineProposedPreview,
  calDay:      window.CalDayProposedPreview,
  typography:  window.TypographyProposedPreview,
  button:      window.ButtonProposedPreview,
  chip:        window.ChipProposedPreview,
  progressBar: window.ProgressBarProposedPreview,
  progressRing:window.ProgressRingProposedPreview,
  metricProgress: window.MetricProgressProposedPreview,
  metricCluster:window.MetricClusterProposedPreview,
  barChart:    window.BarChartProposedPreview,
  arcChart:    window.ArcChartProposedPreview,
  lineChart:   window.LineChartProposedPreview,
  comparisonChart: window.ComparisonChartProposedPreview,
  bodyweight:  window.BodyweightProposedPreview,
  input:       window.InputProposedPreview,
  sectionBlock:window.SectionBlockProposedPreview,
  expandablePanel: window.ExpandablePanelProposedPreview,
};

// ───────── Verdict pill ─────────
function VerdictPill({ verdict, size = 'sm' }) {
  const v = VERDICTS[verdict];
  const padding = size === 'lg' ? '6px 14px' : '3px 9px';
  const fontSize = size === 'lg' ? 12 : 10;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding, borderRadius: 999,
      background: v.dim, color: v.color,
      border: `1px solid ${v.border}`,
      fontFamily: FONTS.mono, fontSize, fontWeight: 600, letterSpacing: 0.8,
      textTransform: 'uppercase', flexShrink: 0,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: v.color }}/>
      {v.label}
    </span>
  );
}

// ───────── Top bar ─────────
function TopBar({ filter, onFilter, counts, total }) {
  const filters = ['all', 'love', 'keep', 'change', 'replace'];
  return (
    <div style={{
      height: 60, padding: '0 24px', flexShrink: 0,
      borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: T.bg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: `linear-gradient(135deg, ${T.accent}, #c93b1d)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14, color: '#1a0f0a',
          fontFamily: FONTS.sans,
        }}>A</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.1 }}>Aurevion</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 0.6 }}>COMPONENT AUDIT · v0.1</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {filters.map(f => {
          const active = filter === f;
          const v = VERDICTS[f];
          const count = f === 'all' ? total : (counts[f] || 0);
          return (
            <button key={f} onClick={() => onFilter(f)} style={{
              padding: '6px 12px', borderRadius: 999,
              background: active ? (v ? v.dim : 'rgba(255,255,255,0.08)') : 'transparent',
              border: `1px solid ${active ? (v ? v.border : T.border) : T.border}`,
              color: active ? (v ? v.color : T.text) : T.textDim,
              fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              textTransform: 'capitalize',
            }}>
              {f}
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, opacity: 0.7 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.textMute }}>
        {total} components
      </div>
    </div>
  );
}

// ───────── Left rail ─────────
function LeftRail({ items, selectedId, onSelect }) {
  // Group by `group`
  const byGroup = {};
  items.forEach(it => {
    if (!byGroup[it.group]) byGroup[it.group] = [];
    byGroup[it.group].push(it);
  });
  return (
    <div style={{
      width: 280, flexShrink: 0, borderRight: `1px solid ${T.border}`,
      background: T.bg, overflowY: 'auto',
    }}>
      {Object.entries(byGroup).map(([group, arr]) => (
        <div key={group} style={{ padding: '18px 16px 8px' }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
            color: T.textMute, marginBottom: 8, textTransform: 'uppercase',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{group}</span>
            <span style={{ color: T.textMute, opacity: 0.6 }}>{arr.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {arr.map(it => {
              const active = it.id === selectedId;
              const v = VERDICTS[it.verdict];
              return (
                <button key={it.id} onClick={() => onSelect(it.id)} style={{
                  width: '100%', textAlign: 'left',
                  padding: '9px 10px', borderRadius: 8,
                  background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: FONTS.sans,
                  display: 'flex', alignItems: 'center', gap: 10, color: T.text,
                  borderLeft: active ? `2px solid ${T.accent}` : '2px solid transparent',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: v.color, flexShrink: 0,
                  }}/>
                  <span style={{ flex: 1, fontSize: 13, color: active ? T.text : T.textDim }}>{it.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────── Phone frame stage ─────────
function Stage({ item, mode, onMode }) {
  const proposedComp = PROPOSED_RENDERERS[item.render];
  const currentComp  = RENDERERS[item.render];
  const hasProposed = !!proposedComp;
  // Default to proposed when available; otherwise current.
  const useProposed = hasProposed && mode === 'proposed';
  const Comp = useProposed ? proposedComp : currentComp;
  return (
    <div style={{
      flex: 1, minWidth: 0, background: '#070707',
      backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,110,80,0.04), transparent 60%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      padding: '24px 32px 32px', overflow: 'hidden',
    }}>
      <StageToggle mode={mode} onMode={onMode} hasProposed={hasProposed}/>
      <div style={{ transform: 'scale(0.74)', transformOrigin: 'top center', marginTop: -10 }}>
        <IOSDevice width={402} height={874} dark>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, minHeight: 0 }}>
            <div style={{ padding: '8px 20px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1 }}>{item.group.toUpperCase()}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{item.name}</div>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {Comp ? <Comp/> : <div style={{ padding: 20, color: T.textMute }}>missing renderer</div>}
            </div>
            <TabBar/>
          </div>
        </IOSDevice>
      </div>
    </div>
  );
}

function StageToggle({ mode, onMode, hasProposed }) {
  const Pill = ({ value, label, sub, active, disabled }) => (
    <button onClick={() => !disabled && onMode(value)} style={{
      padding: '8px 14px', borderRadius: 999,
      background: active ? T.accent : 'transparent',
      color: active ? '#1a0f0a' : (disabled ? T.textMute : T.text),
      border: `1px solid ${active ? T.accent : T.border}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
      textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }}>
      {label}
      {sub && <span style={{ opacity: 0.5, fontWeight: 400 }}>{sub}</span>}
    </button>
  );
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
      <Pill value="current"  label="As-is"    active={mode === 'current'}/>
      <Pill value="proposed" label="Proposed" sub={hasProposed ? '' : '—'} active={mode === 'proposed' && hasProposed} disabled={!hasProposed}/>
      {!hasProposed && (
        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1, marginLeft: 6 }}>NO REDESIGN YET</span>
      )}
    </div>
  );
}

function TabBar() {
  const Icon = ({ d, fill, stroke = T.textDim }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fill || 'none'} stroke={fill ? 'none' : stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
  return (
    <div style={{ padding: '10px 24px 26px', flexShrink: 0 }}>
      <div style={{
        height: 56, borderRadius: 999,
        background: 'rgba(28,28,28,0.85)', backdropFilter: 'blur(20px)',
        border: `1px solid ${T.borderSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      }}>
        <Icon d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>
        <Icon d="M5 3v18M9 3v8a3 3 0 0 1-3 3M16 3l-1 7h2.5L18 3M16 14v7"/>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.textDim, fontSize: 18,
        }}>+</div>
        <Icon d="M7 8h10M7 12h10M7 16h10M5 6v12M19 6v12"/>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
        </svg>
      </div>
    </div>
  );
}

// ───────── Right inspector ─────────
function Inspector({ item, onNext, onPrev }) {
  return (
    <div style={{
      width: 360, flexShrink: 0, borderLeft: `1px solid ${T.border}`,
      background: T.bg, padding: 24, overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <VerdictPill verdict={item.verdict} size="lg"/>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onPrev} style={navBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          </button>
          <button onClick={onNext} style={navBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </button>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1, marginBottom: 4 }}>{item.group.toUpperCase()}</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>{item.name}</div>
      </div>

      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1, marginBottom: 8 }}>YOUR NOTE</div>
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          borderLeft: `2px solid ${VERDICTS[item.verdict].color}`,
          fontSize: 14, lineHeight: 1.55, color: T.text,
          fontStyle: 'italic',
        }}>
          "{item.note}"
        </div>
      </div>

      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1, marginBottom: 10 }}>PROPOSED DIRECTION</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {item.proposed.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.5, color: T.textDim }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={VERDICTS[item.verdict].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {item.breaking && (
        <div style={{
          padding: 12, borderRadius: 10,
          background: 'rgba(245,158,11,0.08)', border: `1px solid rgba(245,158,11,0.3)`,
        }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.amber, letterSpacing: 1, marginBottom: 4 }}>BREAKING CHANGE</div>
          <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{item.breaking}</div>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 18, marginTop: 'auto' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1, marginBottom: 10 }}>QUICK STATUS</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['love', 'keep', 'change', 'replace'].map(v => {
            const sel = item.verdict === v;
            const vc = VERDICTS[v];
            return (
              <div key={v} style={{
                padding: '6px 12px', borderRadius: 8,
                background: sel ? vc.dim : 'transparent',
                border: `1px solid ${sel ? vc.border : T.border}`,
                color: sel ? vc.color : T.textMute,
                fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500, letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}>{vc.label}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  width: 30, height: 30, borderRadius: 8,
  background: 'transparent', border: `1px solid ${T.border}`,
  color: T.textDim, cursor: 'pointer', fontFamily: FONTS.sans, fontSize: 14,
};

// ───────── App root ─────────
function App() {
  const [filter, setFilter] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(AUDIT[0].id);
  const [mode, setMode] = React.useState('proposed');

  const counts = React.useMemo(() => {
    const c = {};
    AUDIT.forEach(it => { c[it.verdict] = (c[it.verdict] || 0) + 1; });
    return c;
  }, []);

  const filtered = React.useMemo(() => {
    if (filter === 'all') return AUDIT;
    return AUDIT.filter(it => it.verdict === filter);
  }, [filter]);

  // If selection isn't in filtered, pick first.
  React.useEffect(() => {
    if (!filtered.find(it => it.id === selectedId) && filtered.length) {
      setSelectedId(filtered[0].id);
    }
  }, [filter, filtered, selectedId]);

  const item = AUDIT.find(it => it.id === selectedId) || AUDIT[0];

  const go = (delta) => {
    const idx = filtered.findIndex(it => it.id === selectedId);
    if (idx < 0) return;
    const next = (idx + delta + filtered.length) % filtered.length;
    setSelectedId(filtered[next].id);
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: T.bg, color: T.text, fontFamily: FONTS.sans,
      overflow: 'hidden',
    }}>
      <TopBar filter={filter} onFilter={setFilter} counts={counts} total={AUDIT.length}/>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <LeftRail items={filtered} selectedId={selectedId} onSelect={setSelectedId}/>
        <Stage item={item} mode={mode} onMode={setMode}/>
        <Inspector item={item} onNext={() => go(1)} onPrev={() => go(-1)}/>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
