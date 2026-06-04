// Progress, metric, section, expandable previews.

function ProgressBarPreview() {
  const Bar = ({ label, value, color = T.accent, stack }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex' }}>
        {stack ? stack.map((s, i) => (
          <div key={i} style={{ width: `${s.v}%`, background: s.c, height: '100%' }}/>
        )) : (
          <div style={{ width: `${value}%`, background: color, height: '100%' }}/>
        )}
      </div>
    </div>
  );
  return (
    <PreviewBase>
      <H1>Progress Bar</H1>
      <Caption>Linear progress is contextual; stacked mode for multi-value breakdowns.</Caption>
      <div style={{ marginTop: 14 }}>
        <Bar label="Low completion" value={18} color={T.red}/>
        <Bar label="Steady progress" value={56} color={T.accent}/>
        <Bar label="Goal reached" value={100} color={T.green}/>
        <Bar label="Macro split" stack={[
          { v: 22, c: T.purple },
          { v: 32, c: T.amber },
          { v: 16, c: T.red },
          { v: 30, c: 'rgba(255,255,255,0.08)' },
        ]}/>
      </div>
    </PreviewBase>
  );
}

function Ring({ value, color, size = 88, label }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="6" fill="none"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
      </svg>
      {label && (
        <>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{value}%</div>
          <div style={{ fontSize: 11, color: T.textDim }}>{label}</div>
        </>
      )}
    </div>
  );
}

function ProgressRingPreview() {
  return (
    <PreviewBase>
      <H1>Progress Ring</H1>
      <Caption>Rings stay text-free internally; the stat lives outside the circle.</Caption>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'space-between' }}>
        <Ring value={24} color={T.red} label="Recovery"/>
        <Ring value={63} color={T.amber} label="Adherence"/>
        <Ring value={92} color={T.green} label="Streak"/>
      </div>
      <SectionLabel>Multi-arc overview</SectionLabel>
      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
        <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={70} cy={70} r={62} stroke="rgba(255,255,255,0.05)" strokeWidth="9" fill="none"/>
          <circle cx={70} cy={70} r={62} stroke={T.amber}  strokeWidth="9" fill="none"
                  strokeDasharray={`90 ${2*Math.PI*62 - 90}`} strokeDashoffset={-30} strokeLinecap="round"/>
          <circle cx={70} cy={70} r={62} stroke={T.accent} strokeWidth="9" fill="none"
                  strokeDasharray={`160 ${2*Math.PI*62 - 160}`} strokeDashoffset={-130} strokeLinecap="round"/>
          <circle cx={70} cy={70} r={62} stroke={T.red}    strokeWidth="9" fill="none"
                  strokeDasharray={`60 ${2*Math.PI*62 - 60}`}  strokeDashoffset={-300} strokeLinecap="round"/>
        </svg>
      </div>
    </PreviewBase>
  );
}

function MetricProgressPreview() {
  const Card = ({ label, value, pct, color }) => (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      background: T.surface, border: `1px solid ${T.borderSoft}`,
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }}/>
      </div>
    </div>
  );
  return (
    <PreviewBase>
      <H1>Metric</H1>
      <Caption>Composition rule, not a primitive. Number + label + mini-progress bundled per card.</Caption>
      <div style={{ marginTop: 14 }}>
        <Card label="Hydration" value="72%" pct={72} color={T.accent}/>
        <Card label="Sleep target" value="61%" pct={61} color={T.amber}/>
        <Card label="Steps" value="94%" pct={94} color={T.green}/>
      </div>
    </PreviewBase>
  );
}

function MetricClusterPreview() {
  return (
    <PreviewBase>
      <H1>Metric Cluster</H1>
      <Caption>Group 2-4 related stats. Top-line headline, supporting metrics share the card.</Caption>
      <SectionLabel>Today · Compact (proposed)</SectionLabel>
      <div style={{
        padding: '14px 16px', borderRadius: 14,
        background: T.surface, border: `1px solid ${T.borderSoft}`,
        marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute, letterSpacing: 1, marginBottom: 2 }}>ADHERENCE</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.accent, lineHeight: 1 }}>78%</div>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: T.textDim }}>Protein</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>67<span style={{ color: T.textMute, fontWeight: 400 }}>g</span></div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.textDim }}>Carbs</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>82<span style={{ color: T.textMute, fontWeight: 400 }}>g</span></div>
          </div>
        </div>
      </div>

      <SectionLabel>Current · Expanded</SectionLabel>
      <div style={{
        padding: 18, borderRadius: 18,
        background: T.surface, border: `1px solid ${T.borderSoft}`,
      }}>
        <div style={{ fontSize: 14, color: T.textDim }}>Adherence</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: T.accent, lineHeight: 1, marginTop: 4 }}>78%</div>
        <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>2 of 4 meals completed</div>
        <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', marginTop: 12 }}>
          <div style={{ width: '78%', height: '100%', background: T.accent, borderRadius: 999 }}/>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.textDim }}>Protein</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.red }}>67g</div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', marginTop: 6 }}>
              <div style={{ width: '37%', height: '100%', background: T.red }}/>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.textDim }}>Carbs</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.amber }}>82g</div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', marginTop: 6 }}>
              <div style={{ width: '37%', height: '100%', background: T.amber }}/>
            </div>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

function SectionBlockPreview() {
  return (
    <PreviewBase scroll>
      <H1>Section Block</H1>
      <Caption>Visible header, optional trailing action, spacing-first grouping.</Caption>
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>This week</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Coach-led overview with one supporting action</div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: T.accent, fontWeight: 600, fontSize: 13, fontFamily: FONTS.sans, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View all <MIcon name="arrow_forward" size={14}/></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { glyph: 'event_available', tone: T.accent, t: 'Meal cadence locked', s: '4 meals aligned to training days', tag: 'Stable', tone2: T.textDim },
            { glyph: 'bolt',             tone: T.amber,  t: 'Prep block tonight',  s: '2 unfinished prep steps remain', tag: 'Pending', tone2: T.amber },
            { glyph: 'check_circle',     tone: T.green,  t: 'Recovery on track',   s: 'Sleep 7h+ five nights running',   tag: 'On',     tone2: T.green },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14, borderRadius: 14,
              background: T.surface, border: `1px solid ${T.borderSoft}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: row.tone, fontSize: 16,
              }}><MIcon name={row.glyph} size={20} color={row.tone}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{row.t}</div>
                <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{row.s}</div>
              </div>
              <div style={{ fontSize: 11, color: row.tone2, fontWeight: 600 }}>{row.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </PreviewBase>
  );
}

function ExpandablePanelPreview() {
  const [open, setOpen] = React.useState(true);
  return (
    <PreviewBase scroll>
      <H1>Expandable Panel</H1>
      <Caption>Optional intelligence stays collapsed until requested.</Caption>
      <div style={{ marginTop: 14, borderRadius: 16, background: T.surface, border: `1px solid ${T.borderSoft}`, overflow: 'hidden' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width: '100%', background: 'transparent', border: 'none', color: T.text,
          textAlign: 'left', padding: 16, cursor: 'pointer', fontFamily: FONTS.sans,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Why this recommendation</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Open the bottom sheet for deeper context without inline clutter.</div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: `1px solid ${T.borderSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s ease',
            color: T.textDim,
          }}><MIcon name="chevron_right" size={18}/></div>
        </button>
        {open && (
          <div style={{ padding: '4px 16px 18px' }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Why this week is structured this way</div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 6, lineHeight: 1.5 }}>
              Protein anchors the first half of the day so training output stays stable before dinner.
            </div>
            <div style={{
              marginTop: 14, padding: 14, borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.borderSoft}`,
              display: 'flex', gap: 14,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.textDim }}>Summary signal</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.green, marginTop: 2 }}>Balanced</div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>Prep load moderate.</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.textDim }}>Dinner load</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.amber, marginTop: 2 }}>760 kcal</div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>Largest meal follows heaviest session.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PreviewBase>
  );
}

Object.assign(window, {
  ProgressBarPreview, ProgressRingPreview, MetricProgressPreview,
  MetricClusterPreview, SectionBlockPreview, ExpandablePanelPreview,
});
