// Proposed component variants — same functionality, reskinned in the mono-instrumentation aesthetic.
// Principles applied: mono labels, light-weight numerals, single accent, textured/segmented bars, visible scale.

// ───────── shared helpers ─────────
const MLabel = ({ children, color = T.textMute, size = 10, mb = 6, mt = 0 }) => (
  <div style={{
    fontFamily: FONTS.mono, fontSize: size, letterSpacing: 1.5,
    color, textTransform: 'uppercase', marginBottom: mb, marginTop: mt,
  }}>{children}</div>
);

const Num = ({ children, size = 48, weight = 200, unit, color = T.text }) => (
  <span style={{ fontSize: size, fontWeight: weight, letterSpacing: -size * 0.025, lineHeight: 0.95, color }}>
    {children}
    {unit && <span style={{
      fontSize: size * 0.25, fontFamily: FONTS.mono, fontWeight: 400,
      color: T.textMute, marginLeft: 6, verticalAlign: 'super', letterSpacing: 0,
    }}>{unit}</span>}
  </span>
);

const TexBar = ({ pct = 70, height = 28, color = T.accent }) => (
  <div style={{
    height, borderRadius: 6, background: 'rgba(255,255,255,0.05)',
    overflow: 'hidden', position: 'relative',
  }}>
    <div style={{
      width: `${pct}%`, height: '100%', borderRadius: 6,
      background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${color}`,
    }}/>
  </div>
);

const SegBar = ({ pct = 70, segments = 20, height = 56 }) => {
  const lit = Math.round(segments * pct / 100);
  return (
    <div style={{ display: 'flex', gap: 3, height, alignItems: 'flex-end' }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 2,
          background: i < lit ? T.accent : 'rgba(255,255,255,0.10)',
          height: i < lit ? '100%' : '70%',
        }}/>
      ))}
    </div>
  );
};

const ScaleTicks = ({ marks = [0, 50, 100], color = T.accent }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1,
    color, marginBottom: 6,
  }}>
    {marks.map((m, i) => (
      <span key={i} style={{ color: i === marks.length - 1 ? T.textMute : color }}>{m}</span>
    ))}
  </div>
);

// ═════════════════════════════════════════════════
// FEATURE CARD — strip subtitle, mono label, lightweight
// ═════════════════════════════════════════════════
function FeatureCardProposedPreview() {
  return (
    <PreviewBase>
      <MLabel mb={14}>Tonight · Cook mode</MLabel>
      <div style={{
        background: T.surface, borderRadius: 18, padding: 20,
        border: `1px solid ${T.borderSoft}`,
      }}>
        <Num size={36} weight={300}>Salmon &amp; greens</Num>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <MLabel mb={4}>Est. time</MLabel>
            <Num size={22} weight={300} unit="min">28</Num>
          </div>
          <button style={{
            background: T.accent, color: '#1a0f0a', border: 'none',
            padding: '12px 22px', borderRadius: 10, fontWeight: 600,
            fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
          }}>Start →</button>
        </div>
        <div style={{
          marginTop: 14, height: 88, borderRadius: 10,
          background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 12px, rgba(255,255,255,0.02) 12px 24px)`,
        }}/>
      </div>
      <MLabel mt={10}>Card → fullscreen morph on tap</MLabel>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// TIMELINE — mono row labels, light names
// ═════════════════════════════════════════════════
function TimelineProposedPreview() {
  const items = [
    { name: 'Warm-up walk',     sub: 'MOBILITY · 5 MIN',   state: 'done' },
    { name: 'Squats',            sub: 'PRIMARY · 4 × 6',    state: 'active' },
    { name: 'Romanian deadlift', sub: 'POSTERIOR · 3 × 8',  state: 'idle' },
    { name: 'Walking lunge',     sub: 'UNILATERAL · 3 × 10',state: 'idle' },
    { name: 'Cooldown',          sub: 'DOWNSHIFT · 3 MIN',  state: 'idle' },
  ];
  return (
    <PreviewBase scroll>
      <MLabel mb={4}>Today · Strength</MLabel>
      <Num size={32} weight={200}>Sequential flow</Num>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22 }}>
        {items.map((it, i) => {
          const done = it.state === 'done';
          const active = it.state === 'active';
          return (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.borderSoft}`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                background: done ? T.accent : 'transparent',
                border: `1.5px solid ${active || done ? T.accent : 'rgba(255,110,80,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a0f0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent }}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 300, color: done ? T.textDim : T.text, letterSpacing: -0.3 }}>{it.name}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1.2, marginTop: 4 }}>{it.sub}</div>
                {active && (
                  <div style={{ display: 'flex', gap: 18, marginTop: 12,
                                fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.4 }}>
                    <span style={{ color: T.accent }}>COMPLETE</span>
                    <span style={{ color: T.textMute }}>SKIP</span>
                    <span style={{ color: T.textMute }}>NEXT</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// CALENDAR DAY — huge thin time + meal window
// ═════════════════════════════════════════════════
function CalDayProposedPreview() {
  return (
    <PreviewBase>
      <CalHeader mode="D"/>
      <div style={{ marginTop: 10 }}>
        <MLabel>Friday · May 22</MLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <Num size={88} weight={200}>22</Num>
          <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: T.textMute }}>/ 31</span>
        </div>
        <MLabel mt={28} mb={8}>Meal window · 12:00–20:00</MLabel>
        <ScaleTicks marks={['12', '16', '20']}/>
        <SegBar pct={55} segments={16} height={42}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <MLabel mb={0}>Logged</MLabel>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: T.text }}>3 of 4 meals</span>
        </div>
        <div style={{ height: 1, background: T.borderSoft, margin: '20px 0' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <MLabel mb={4}>Training</MLabel>
            <Num size={20} weight={300}>06:30</Num>
          </div>
          <div>
            <MLabel mb={4}>Sleep target</MLabel>
            <Num size={20} weight={300} unit="H">7.5</Num>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// TYPOGRAPHY — illustrate new ladder
// ═════════════════════════════════════════════════
function TypographyProposedPreview() {
  return (
    <PreviewBase scroll>
      <MLabel>Type system</MLabel>
      <Num size={32} weight={200}>Two roles, three weights.</Num>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 30 }}>
        <div>
          <MLabel mb={6}>Numeral · Display</MLabel>
          <Num size={64} weight={200} unit="kcal">1,847</Num>
        </div>
        <div>
          <MLabel mb={6}>Numeral · Body</MLabel>
          <Num size={28} weight={300} unit="g">128</Num>
        </div>
        <div>
          <MLabel mb={6}>Label · Mono ALL CAPS</MLabel>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.4, color: T.text }}>RESTING HEART RATE</div>
        </div>
        <div>
          <MLabel mb={6}>Prose · Sans, sentence case</MLabel>
          <div style={{ fontSize: 15, color: T.text, lineHeight: 1.5 }}>Drive through the floor and keep the chest organized.</div>
        </div>
        <div style={{ height: 1, background: T.borderSoft, margin: '4px 0' }}/>
        <div>
          <MLabel mb={6}>Inline tone (sparingly)</MLabel>
          <div style={{ fontSize: 14 }}>On track. Recovery <span style={{ color: '#4ade80', fontFamily: FONTS.mono, fontSize: 12 }}>+12%</span> this week.</div>
        </div>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// BUTTON — slimmer silhouette, mono labels for some
// ═════════════════════════════════════════════════
function ButtonProposedPreview() {
  const base = {
    padding: '12px 20px', borderRadius: 8, border: 'none',
    fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600,
    letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'pointer',
  };
  return (
    <PreviewBase>
      <MLabel>Button</MLabel>
      <Num size={28} weight={200}>One accent. One scale.</Num>
      <MLabel mt={26} mb={10}>Emphasis</MLabel>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={{ ...base, background: T.accent, color: '#1a0f0a' }}>Start</button>
        <button style={{ ...base, background: 'rgba(255,255,255,0.06)', color: T.text }}>Secondary</button>
        <button style={{ ...base, background: 'transparent', color: T.textDim }}>Skip</button>
      </div>
      <MLabel mt={22} mb={10}>State</MLabel>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={{ ...base, background: 'rgba(255,110,80,0.6)', color: '#1a0f0a', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid rgba(26,15,10,0.3)', borderTopColor: '#1a0f0a', animation: 'spin 1s linear infinite' }}/>
          Saving
        </button>
        <button style={{ ...base, background: 'transparent', color: T.textMute, opacity: 0.5 }} disabled>Disabled</button>
      </div>
      <MLabel mt={22} mb={10}>Destructive · separated</MLabel>
      <button style={{ ...base, background: 'transparent', color: '#f87171', border: `1px solid rgba(248,113,113,0.3)` }}>Delete plan</button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// CHIP — replace with verb buttons + inline tone
// ═════════════════════════════════════════════════
function ChipProposedPreview() {
  return (
    <PreviewBase scroll>
      <MLabel>Status pattern</MLabel>
      <Num size={28} weight={200}>Verbs and tone, not pills.</Num>

      <MLabel mt={26} mb={10}>Before</MLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, opacity: 0.4 }}>
        {['Focused','Filter','Passive','On track','Review','Off track','Locked'].map((l, i) => (
          <span key={i} style={{
            padding: '6px 12px', borderRadius: 999,
            border: `1px solid ${T.border}`, fontSize: 12, color: T.textDim,
            fontFamily: FONTS.sans,
          }}>{l}</span>
        ))}
      </div>

      <MLabel mt={26} mb={10}>After · Filter as verb</MLabel>
      <div style={{ display: 'flex', gap: 14 }}>
        <button style={{ background: 'transparent', border: 'none', color: T.accent, fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>Filter results →</button>
        <button style={{ background: 'transparent', border: 'none', color: T.textMute, fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>Clear</button>
      </div>

      <MLabel mt={26} mb={10}>After · Status as tone</MLabel>
      <div style={{ fontSize: 15, color: T.text, lineHeight: 1.5, padding: '14px 16px', background: T.surface, borderRadius: 12, border: `1px solid ${T.borderSoft}` }}>
        Plan <span style={{ color: '#4ade80', fontFamily: FONTS.mono, fontSize: 13 }}>on track</span> — one step pending review.
      </div>

      <MLabel mt={22} mb={10}>After · Multi-select filter (only place chips earn it)</MLabel>
      <div style={{ display: 'flex', gap: 6 }}>
        {[['ALL', true], ['BREAKFAST', false], ['LUNCH', false], ['DINNER', false]].map(([l, on], i) => (
          <button key={i} style={{
            padding: '8px 12px', borderRadius: 6,
            background: on ? T.accent : 'transparent',
            color: on ? '#1a0f0a' : T.textDim,
            border: `1px solid ${on ? T.accent : T.borderSoft}`,
            fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1,
            cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// PROGRESS BAR — textured + scale ticks
// ═════════════════════════════════════════════════
function ProgressBarProposedPreview() {
  return (
    <PreviewBase>
      <MLabel>Progress · Linear</MLabel>
      <Num size={28} weight={200}>Bars look measured.</Num>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 30 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <MLabel mb={0}>Hydration</MLabel>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.text }}>70%</span>
          </div>
          <ScaleTicks marks={[0, 50, 100]}/>
          <TexBar pct={70} height={24}/>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <MLabel mb={0}>Sleep target</MLabel>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.text }}>96%</span>
          </div>
          <ScaleTicks marks={[0, 50, 100]}/>
          <TexBar pct={96} height={24}/>
        </div>

        <div>
          <MLabel>Macro split · stacked</MLabel>
          <div style={{ height: 18, borderRadius: 4, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ width: '28%', background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.2) 0 1.5px, transparent 1.5px 5px), ${T.accent}` }}/>
            <div style={{ width: '34%', background: 'rgba(255,255,255,0.18)' }}/>
            <div style={{ width: '18%', background: 'rgba(255,255,255,0.10)' }}/>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: T.textMute }}>
            <span style={{ color: T.accent }}>● PROTEIN 28%</span>
            <span>● CARBS 34%</span>
            <span>● FAT 18%</span>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// PROGRESS RING — number outside, mono label
// ═════════════════════════════════════════════════
function ProgressRingProposedPreview() {
  const Ring = ({ pct, color = T.accent, size = 110 }) => {
    const r = (size - 6) / 2;
    const c = 2 * Math.PI * r;
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="4" fill="none"
                strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} strokeLinecap="round"/>
      </svg>
    );
  };
  return (
    <PreviewBase>
      <MLabel>Progress · Ring</MLabel>
      <Num size={28} weight={200}>Text-free internally.</Num>

      <div style={{ display: 'flex', gap: 20, marginTop: 30, justifyContent: 'space-between' }}>
        {[
          { p: 24, l: 'Recovery' },
          { p: 63, l: 'Adherence' },
          { p: 92, l: 'Streak' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Ring pct={r.p} size={96}/>
            <Num size={20} weight={300}>{r.p}<span style={{ fontSize: 12, color: T.textMute, fontFamily: FONTS.mono, fontWeight: 400 }}>%</span></Num>
            <MLabel mb={0} size={9}>{r.l}</MLabel>
          </div>
        ))}
      </div>

      <MLabel mt={36}>Multi-arc summary</MLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 8 }}>
        <div style={{ position: 'relative' }}>
          <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={70} cy={70} r={62} stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="none"/>
            <circle cx={70} cy={70} r={62} stroke={T.accent} strokeWidth="5" fill="none"
                    strokeDasharray={`260 ${2*Math.PI*62 - 260}`} strokeDashoffset={0} strokeLinecap="round"/>
            <circle cx={70} cy={70} r={48} stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="none"/>
            <circle cx={70} cy={70} r={48} stroke="rgba(255,255,255,0.4)" strokeWidth="5" fill="none"
                    strokeDasharray={`180 ${2*Math.PI*48 - 180}`} strokeDashoffset={0} strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <MLabel mb={2}>Move</MLabel>
            <Num size={24} weight={300} unit="%">78</Num>
          </div>
          <div>
            <MLabel mb={2}>Recovery</MLabel>
            <Num size={24} weight={300} unit="%">61</Num>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// METRIC PROGRESS — compact horizontal
// ═════════════════════════════════════════════════
function MetricProgressProposedPreview() {
  const Row = ({ label, value, pct, unit }) => (
    <div style={{ padding: '14px 0', borderTop: `1px solid ${T.borderSoft}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <MLabel mb={0}>{label}</MLabel>
        <Num size={22} weight={300} unit={unit}>{value}</Num>
      </div>
      <TexBar pct={pct} height={6}/>
    </div>
  );
  return (
    <PreviewBase>
      <MLabel>Metric · composition rule</MLabel>
      <Num size={28} weight={200}>Label, value, bar.</Num>
      <div style={{ marginTop: 24 }}>
        <Row label="Hydration"  value="72" unit="%" pct={72}/>
        <Row label="Sleep target" value="61" unit="%" pct={61}/>
        <Row label="Steps"      value="94" unit="%" pct={94}/>
        <Row label="Recovery"   value="42" unit="%" pct={42}/>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// METRIC CLUSTER — compact version
// ═════════════════════════════════════════════════
function MetricClusterProposedPreview() {
  return (
    <PreviewBase>
      <MLabel>Today · Cluster</MLabel>
      <Num size={28} weight={200}>Compact by default.</Num>

      <MLabel mt={26}>Compact</MLabel>
      <div style={{
        padding: 16, borderRadius: 14, background: T.surface, border: `1px solid ${T.borderSoft}`,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ flex: '0 0 auto' }}>
          <MLabel mb={4}>Adherence</MLabel>
          <Num size={36} weight={200}>78<span style={{ fontSize: 14, color: T.textMute, fontFamily: FONTS.mono, fontWeight: 400 }}>%</span></Num>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 16 }}>
          <div>
            <MLabel mb={2} size={9}>Protein</MLabel>
            <span style={{ fontSize: 16, fontWeight: 300 }}>67<span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.textMute }}>g</span></span>
          </div>
          <div>
            <MLabel mb={2} size={9}>Carbs</MLabel>
            <span style={{ fontSize: 16, fontWeight: 300 }}>82<span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.textMute }}>g</span></span>
          </div>
        </div>
      </div>

      <MLabel mt={22}>Expanded · Doconomy-style</MLabel>
      <div style={{ padding: 18, borderRadius: 14, background: T.surface, border: `1px solid ${T.borderSoft}` }}>
        <MLabel>Adherence</MLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <Num size={56} weight={200}>78<span style={{ fontSize: 18, color: T.textMute, fontFamily: FONTS.mono, fontWeight: 400 }}>%</span></Num>
        </div>
        <MLabel mt={4}>2 of 4 meals · 293 kcal left</MLabel>
        <TexBar pct={78} height={6}/>
        <div style={{ display: 'flex', gap: 20, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${T.borderSoft}` }}>
          <div style={{ flex: 1 }}>
            <MLabel mb={2}>Protein</MLabel>
            <Num size={24} weight={300} unit="g">67</Num>
            <div style={{ marginTop: 8 }}><TexBar pct={37} height={3}/></div>
          </div>
          <div style={{ flex: 1 }}>
            <MLabel mb={2}>Carbs</MLabel>
            <Num size={24} weight={300} unit="g">82</Num>
            <div style={{ marginTop: 8 }}><div style={{ height: 3, background: 'rgba(255,255,255,0.1)' }}/></div>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// CHARTS — bar, arc, line, comparison, bodyweight
// ═════════════════════════════════════════════════
function BarChartProposedPreview() {
  const data = [42, 88, 71, 56];
  const days = ['MON', 'TUE', 'WED', 'THU'];
  return (
    <PreviewBase>
      <MLabel>BarMark</MLabel>
      <Num size={28} weight={200}>One accent + neutral.</Num>
      <div style={{ marginTop: 18 }}>
        <ScaleTicks marks={[0, 50, 100]}/>
      </div>
      <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 22 }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: '100%', height: `${v}%`, borderRadius: 2,
              background: i === 1
                ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${T.accent}`
                : 'rgba(255,255,255,0.10)' }}/>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: i === 1 ? T.accent : T.textMute, letterSpacing: 1 }}>{days[i]}</div>
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

function ArcChartProposedPreview() {
  return (
    <PreviewBase>
      <MLabel>ArcMark</MLabel>
      <Num size={28} weight={200}>Single emphasis.</Num>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, position: 'relative' }}>
        <svg width={220} height={220} viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={110} cy={110} r={92} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none"/>
          <circle cx={110} cy={110} r={92} stroke={T.accent} strokeWidth="10" fill="none"
                  strokeDasharray={2*Math.PI*92} strokeDashoffset={2*Math.PI*92 * (1 - 0.68)} strokeLinecap="round"/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Num size={40} weight={200}>68<span style={{ fontSize: 14, color: T.textMute, fontFamily: FONTS.mono, fontWeight: 400 }}>%</span></Num>
          <MLabel mt={4} mb={0}>Macros today</MLabel>
        </div>
      </div>
    </PreviewBase>
  );
}

function LineChartProposedPreview() {
  return (
    <PreviewBase>
      <MLabel>LineMark · Trend-only</MLabel>
      <Num size={28} weight={200}>Reserved for long trends.</Num>
      <div style={{ marginTop: 22 }}>
        <svg width="100%" viewBox="0 0 260 130">
          <line x1="0" y1="60" x2="260" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4"/>
          <path d="M 5 90 L 35 85 L 65 75 L 95 70 L 125 55 L 155 45 L 185 40 L 215 35 L 245 30"
                stroke={T.accent} strokeWidth="1.5" fill="none"/>
          <circle cx="245" cy="30" r="3" fill={T.accent}/>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1, marginTop: 6 }}>
          <span>W-12</span><span>W-8</span><span>W-4</span><span style={{ color: T.accent }}>NOW</span>
        </div>
      </div>
      <div style={{ height: 1, background: T.borderSoft, margin: '24px 0' }}/>
      <MLabel>Demoted from</MLabel>
      <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>Daily metrics, target bands, reference lines — those move to bars or comparison pairs.</div>
    </PreviewBase>
  );
}

function ComparisonChartProposedPreview() {
  const data = [
    { d: 'MON', a: 45, t: 60 },
    { d: 'TUE', a: 80, t: 70 },
    { d: 'WED', a: 32, t: 60 },
    { d: 'THU', a: 95, t: 85 },
    { d: 'FRI', a: 70, t: 72 },
  ];
  return (
    <PreviewBase>
      <MLabel>Comparison</MLabel>
      <Num size={28} weight={200}>Actual + target only.</Num>
      <div style={{ display: 'flex', gap: 24, marginTop: 18, fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1 }}>
        <span style={{ color: T.accent }}>● ACTUAL</span>
        <span>● TARGET</span>
      </div>
      <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 14, padding: '18px 0 22px', marginTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: 140 }}>
              <div style={{ flex: 1, height: `${d.a}%`,
                background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${T.accent}`,
                borderRadius: '2px 2px 0 0' }}/>
              <div style={{ flex: 1, height: `${d.t}%`, background: 'rgba(255,255,255,0.10)', borderRadius: '2px 2px 0 0' }}/>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute, letterSpacing: 1 }}>{d.d}</div>
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

function BodyweightProposedPreview() {
  const days = [
    { l: 'M',  v: 71.9, h: 72 },
    { l: 'T',  v: 71.6, h: 70 },
    { l: 'W',  v: 71.3, h: 68 },
    { l: 'T',  v: 71.0, h: 65 },
    { l: 'F',  v: 70.8, h: 63 },
    { l: 'S',  v: 70.6, h: 61 },
    { l: '·NOW·', v: 70.4, h: 58, hot: true },
  ];
  return (
    <PreviewBase>
      <MLabel>Bodyweight · 7-day</MLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <Num size={56} weight={200} unit="kg">70.4</Num>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#4ade80', letterSpacing: 1 }}>−2.1 KG</span>
      </div>

      <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-end', gap: 8, height: 130 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 8 }}>
            <div style={{
              width: '100%', height: `${d.h}%`, borderRadius: 3,
              background: d.hot
                ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${T.accent}`
                : 'rgba(255,255,255,0.08)',
            }}/>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: d.hot ? T.accent : T.textMute }}>{d.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontFamily: FONTS.mono, fontSize: 10, color: d.hot ? T.accent : T.textMute, letterSpacing: 1 }}>{d.l}</div>
        ))}
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// INPUT — flatter resting state
// ═════════════════════════════════════════════════
function InputProposedPreview() {
  const Field = ({ label, value, placeholder, error, disabled }) => (
    <div>
      <MLabel mb={6}>{label}</MLabel>
      <div style={{
        padding: '12px 14px', borderRadius: 6,
        background: 'transparent',
        borderBottom: `1px solid ${error ? '#f87171' : (disabled ? T.borderSoft : T.border)}`,
        fontSize: 16, fontWeight: 300, color: disabled ? T.textMute : T.text,
        opacity: disabled ? 0.5 : 1,
      }}>{value || placeholder}</div>
      {error && <div style={{ marginTop: 6, fontFamily: FONTS.mono, fontSize: 10, color: '#f87171', letterSpacing: 1 }}>MACRO TARGET UNAVAILABLE</div>}
    </div>
  );
  return (
    <PreviewBase scroll>
      <MLabel>Input</MLabel>
      <Num size={28} weight={200}>Quieter resting state.</Num>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 26 }}>
        <Field label="Plan title" placeholder="Untitled plan" value=""/>
        <Field label="Phase" value="Hypertrophy block"/>
        <Field label="Macro target" value="0g" error/>
        <Field label="Notes" placeholder="Disabled" disabled/>
        <div>
          <MLabel mb={6}>Search</MLabel>
          <div style={{
            padding: '12px 14px', borderRadius: 6,
            background: 'rgba(255,110,80,0.06)',
            border: `1px solid rgba(255,110,80,0.25)`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            color: T.accent,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              Search routines
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: T.textDim }}>⌘ K</span>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// SECTION BLOCK — header + items, no chip filter
// ═════════════════════════════════════════════════
function SectionBlockProposedPreview() {
  return (
    <PreviewBase scroll>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <MLabel>Week 19</MLabel>
          <Num size={32} weight={200}>This week</Num>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: T.accent, fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>View all →</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          { t: 'Meal cadence locked', s: '4 MEALS · ALIGNED', tag: 'STABLE', color: T.textMute },
          { t: 'Prep block tonight', s: '2 STEPS · REMAINING', tag: 'PENDING', color: T.accent },
          { t: 'Recovery on track', s: 'SLEEP · 5 NIGHTS', tag: 'ON', color: '#4ade80' },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 0', borderBottom: `1px solid ${T.borderSoft}`,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 300, marginBottom: 4 }}>{row.t}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1.2 }}>{row.s}</div>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: row.color, letterSpacing: 1.2 }}>{row.tag}</div>
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

// ═════════════════════════════════════════════════
// EXPANDABLE PANEL — refined type
// ═════════════════════════════════════════════════
function ExpandablePanelProposedPreview() {
  return (
    <PreviewBase scroll>
      <MLabel>Optional intelligence</MLabel>
      <Num size={28} weight={200}>Collapse until asked.</Num>
      <div style={{ marginTop: 22, borderRadius: 14, background: T.surface, border: `1px solid ${T.borderSoft}`, overflow: 'hidden' }}>
        <div style={{ padding: 18, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <MLabel mb={4}>Why this week</MLabel>
            <div style={{ fontSize: 17, fontWeight: 300, color: T.text }}>Protein anchors the first half so training output stays stable before dinner.</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textDim, fontFamily: FONTS.mono, fontSize: 14 }}>↓</div>
        </div>
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{
            padding: 16, borderRadius: 10,
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', gap: 22,
          }}>
            <div style={{ flex: 1 }}>
              <MLabel mb={4}>Summary</MLabel>
              <Num size={22} weight={300} color="#4ade80">Balanced</Num>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, marginTop: 4, letterSpacing: 1 }}>PREP LOAD · MODERATE</div>
            </div>
            <div style={{ width: 1, background: T.borderSoft }}/>
            <div style={{ flex: 1 }}>
              <MLabel mb={4}>Dinner load</MLabel>
              <Num size={22} weight={300} unit="kcal">760</Num>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, marginTop: 4, letterSpacing: 1 }}>POST-SESSION</div>
            </div>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

Object.assign(window, {
  FeatureCardProposedPreview, TimelineProposedPreview, CalDayProposedPreview,
  TypographyProposedPreview, ButtonProposedPreview, ChipProposedPreview,
  ProgressBarProposedPreview, ProgressRingProposedPreview, MetricProgressProposedPreview,
  MetricClusterProposedPreview,
  BarChartProposedPreview, ArcChartProposedPreview, LineChartProposedPreview,
  ComparisonChartProposedPreview, BodyweightProposedPreview,
  InputProposedPreview, SectionBlockProposedPreview, ExpandablePanelProposedPreview,
});
