// 05 Meal Prep — three screens: merge view, parallel timeline, active cook mode.

// ════════════════════════════════════════════════
// 5A · Recipe Merge View
// ════════════════════════════════════════════════
function MealPrepMergeScreen() {
  const ings = [
    { n: 'Garlic', d: 'Cut 4 cloves total', breakdown: 'salmon 2 · chili 2' },
    { n: 'Onion',  d: 'Dice 2 medium',       breakdown: 'rice bowl 1 · chili 1' },
    { n: 'Cumin',  d: 'Measure 1.5 tsp',     breakdown: 'rice bowl 0.5 · chili 1' },
    { n: 'Olive oil', d: 'Measure 3 tbsp',   breakdown: 'salmon 2 · chili 1' },
  ];
  const [done, setDone] = React.useState({});
  const toggle = (n) => setDone(s => ({ ...s, [n]: !s[n] }));
  const completed = Object.values(done).filter(Boolean).length;
  return (
    <Phone label="Pre-cook audit" group="PREP">
      <FNavBar
        title="Merge · 3 recipes"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <FLabel>Tonight's prep</FLabel>
        <div style={{ marginTop: 4 }}>
          <FNum size={36} weight={200}>3 recipes · 1 kitchen.</FNum>
        </div>
        <FMono color={F.mute}>EST. 1H 18M · 9 PORTIONS</FMono>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n: 'Garlic salmon · greens', tone: F.accent, parts: 3, dur: '32 m' },
            { n: 'Chicken rice bowls',     tone: '#60a5fa', parts: 5, dur: '48 m' },
            { n: 'Beef chili',              tone: '#a78bfa', parts: 4, dur: '1h 04m' },
          ].map((r, i) => (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 12,
              background: F.surface, border: `1px solid ${F.borderSoft}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 4, height: 26, borderRadius: 2, background: r.tone, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 400 }}>{r.n}</div>
                <FMono color={F.mute} size={10}>{r.parts} STEPS · {r.dur}</FMono>
              </div>
            </div>
          ))}
        </div>

        <FSection label="Combined ingredients" mt={40} mb={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FNum size={26} weight={200}>{completed} / {ings.length} prepped</FNum>
            <FMono color={F.green}>3 DUPES MERGED</FMono>
          </div>
        </FSection>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ings.map((row, i) => {
            const ck = !!done[row.n];
            return (
              <div key={i} onClick={() => toggle(row.n)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '18px 0', borderTop: `1px solid ${F.borderSoft}`,
                cursor: 'pointer', opacity: ck ? 0.45 : 1,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5,
                  border: `1.4px solid ${ck ? F.accent : F.borderSoft}`,
                  background: ck ? F.accent : 'transparent',
                  flexShrink: 0, marginTop: 2,
                  display: 'grid', placeItems: 'center',
                  transition: 'background .12s, border-color .12s',
                }}>{ck && <FIcon path={ICONS.check} size={12} stroke={3} color="#1a0f0a"/>}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 400, textDecoration: ck ? 'line-through' : 'none' }}>{row.n}</div>
                  <FMono color={F.dim} size={10}>{row.d}</FMono>
                  <div style={{ marginTop: 2 }}>
                    <FMono color={F.mute} size={9}>{row.breakdown}</FMono>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 40, padding: 16, borderRadius: 12,
          background: 'rgba(248,113,113,0.05)', border: `1px solid rgba(248,113,113,0.25)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <FIcon path={ICONS.fire} size={18} color={F.red} stroke={1.8}/>
            <div style={{ flex: 1 }}>
              <FLabel color={F.red} mb={4}>Oven conflict</FLabel>
              <div style={{ fontSize: 13, color: F.text, lineHeight: 1.5 }}>
                Salmon needs <FMono>400°F</FMono>, chili needs <FMono>325°F</FMono> overlapping at <FMono>18:42</FMono>.
              </div>
              <button style={{
                marginTop: 10, background: 'transparent', border: 'none',
                color: F.red, fontFamily: FF.mono, fontSize: 11, fontWeight: 600,
                letterSpacing: 1.2, textTransform: 'uppercase', padding: 0, cursor: 'pointer',
              }}>Resolve · 2 options →</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <FBtn variant="split" full>Start parallel cook</FBtn>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════
// 5B · Parallel Step Timeline (Gantt-style)
// ════════════════════════════════════════════════
function MealPrepTimelineScreen() {
  // 3 lanes × time blocks (in minutes from start). Each step has start,duration,state.
  // total time = ~70 min
  const TOTAL = 78;
  const NOW = 22;
  const lanes = [
    {
      n: 'Salmon · greens', tone: F.accent,
      steps: [
        { s: 0,  d: 4,  l: 'Prep',     state: 'done' },
        { s: 4,  d: 8,  l: 'Marinate', state: 'done', passive: true },
        { s: 14, d: 14, l: 'Roast',    state: 'active', passive: true },
        { s: 28, d: 4,  l: 'Plate',    state: 'todo' },
      ],
    },
    {
      n: 'Rice bowls', tone: '#60a5fa',
      steps: [
        { s: 0,  d: 6,  l: 'Prep',    state: 'done' },
        { s: 6,  d: 16, l: 'Simmer',  state: 'active', passive: true, focusable: true },
        { s: 22, d: 8,  l: 'Sear',    state: 'todo' },
        { s: 30, d: 6,  l: 'Assemble',state: 'todo' },
        { s: 36, d: 4,  l: 'Plate',   state: 'todo' },
      ],
    },
    {
      n: 'Chili', tone: '#a78bfa',
      steps: [
        { s: 8,  d: 6,  l: 'Sear',    state: 'done' },
        { s: 14, d: 8,  l: 'Build',   state: 'done' },
        { s: 22, d: 38, l: 'Reduce',  state: 'active', passive: true },
        { s: 60, d: 6,  l: 'Finish',  state: 'todo' },
      ],
    },
  ];
  // Helpers
  const X = (m) => (m / TOTAL) * 100;
  const W = (d) => (d / TOTAL) * 100;
  return (
    <Phone label="Parallel · live" group="PREP">
      <FNavBar
        title="Cook · 22 m elapsed"
        leading={<FIcon path={ICONS.close} size={22} color={F.text}/>}
        trailing={<FIcon path={ICONS.expand} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        {/* Top KPIs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <FLabel>Up next</FLabel>
            <FNum size={32} weight={200}>Sear · rice bowls</FNum>
          </div>
          <div style={{ textAlign: 'right' }}>
            <FLabel mb={2}>In</FLabel>
            <FNum size={22} weight={300} unit="MM:SS">00:42</FNum>
          </div>
        </div>

        {/* Time ruler */}
        <div style={{ marginTop: 32, position: 'relative' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: FF.mono, fontSize: 9, color: F.mute, letterSpacing: 1, marginBottom: 6,
          }}>
            <span>0</span>
            <span>20</span>
            <span style={{ color: F.accent }}>NOW</span>
            <span>40</span>
            <span>60</span>
            <span>78</span>
          </div>

          {/* Lanes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            {/* NOW vertical line */}
            <div style={{
              position: 'absolute', top: -4, bottom: -4,
              left: `${X(NOW)}%`, width: 1.5, background: F.accent, zIndex: 4,
              boxShadow: '0 0 8px rgba(255,110,80,0.4)',
            }}/>

            {lanes.map((lane, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 4, height: 14, borderRadius: 2, background: lane.tone }}/>
                  <FMono color={F.text}>{lane.n}</FMono>
                </div>
                <div style={{
                  position: 'relative', height: 32, borderRadius: 6,
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${F.borderSoft}`,
                }}>
                  {lane.steps.map((st, j) => {
                    const isActive = st.state === 'active';
                    const isDone = st.state === 'done';
                    const isFocus = st.focusable;
                    return (
                      <div key={j} style={{
                        position: 'absolute',
                        left: `${X(st.s)}%`, width: `${W(st.d)}%`,
                        top: 2, bottom: 2, borderRadius: 4,
                        background: isDone
                          ? 'transparent'
                          : isActive && st.passive
                            ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${lane.tone}`
                            : lane.tone,
                        opacity: isDone ? 0.25 : (st.passive && !isActive ? 0.5 : 1),
                        border: isDone ? `1px dashed ${lane.tone}66` : 'none',
                        display: 'flex', alignItems: 'center', padding: '0 6px',
                        overflow: 'hidden',
                        boxShadow: isFocus ? `0 0 0 1.5px ${F.accent}` : 'none',
                      }}>
                        <FMono color={isDone ? F.mute : '#0d0d0d'} size={9} letter={0.5}>
                          {st.l}
                        </FMono>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active step focus card */}
        <div style={{
          marginTop: 24, padding: 16, borderRadius: 12,
          background: F.surface, border: `1px solid ${F.accent}55`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: F.accent }}/>
            <FLabel mb={0} color={F.accent}>Focused now · Rice bowls</FLabel>
          </div>
          <FNum size={26} weight={200}>Simmer rice — covered, low heat</FNum>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <FMono color={F.dim} size={10}>16 MIN TOTAL · PASSIVE</FMono>
            </div>
            <div>
              <FMono color={F.accent}>10:24</FMono>
              <FMono color={F.mute} size={10}> REMAINING</FMono>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <FTexBar pct={37} height={6}/>
          </div>
        </div>

        {/* Tray of pending timers */}
        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <FLabel mb={8}>Other timers</FLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { c: F.accent, l: 'Salmon roast',  t: '06:12' },
              { c: '#a78bfa', l: 'Chili reduce', t: '38:00' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 4, height: 14, borderRadius: 2, background: t.c }}/>
                <span style={{ fontSize: 13, flex: 1 }}>{t.l}</span>
                <FMono color={F.dim}>{t.t}</FMono>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <FToolbar cells={[
            { icon: ICONS.pause, label: 'Pause', stay: true },
            { icon: ICONS.fwd,   label: 'Open cook mode', primary: true },
            { icon: ICONS.more,  label: 'More', stay: true },
          ]}/>
        </div>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════
// 5C · Active Cook Mode (full focus)
// ════════════════════════════════════════════════
function MealPrepCookModeScreen() {
  // Live countdowns + step advance.
  const [timers, setTimers] = React.useState([
    { c: F.accent,  l: 'SALMON', total: 372, rem: 372 },
    { c: '#60a5fa', l: 'RICE',   total: 960, rem: 624, big: true },
    { c: '#a78bfa', l: 'CHILI',  total: 2280, rem: 2280 },
  ]);
  const [paused, setPaused] = React.useState(false);
  const [step, setStep] = React.useState(4);
  const totalSteps = 5;

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setTimers(ts => ts.map(t => ({ ...t, rem: Math.max(0, t.rem - 1) })));
    }, 1000);
    return () => clearInterval(t);
  }, [paused]);

  const fmt = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const STEPS = [
    { t: 'Prep ingredients',                       i: COOK_ICONS.prep,    cue: 'MISE EN PLACE',   meta: '~4 min' },
    { t: 'Rinse and start rice',                   i: COOK_ICONS.boil,    cue: 'BOIL · COVERED',  meta: '~16 min' },
    { t: 'Marinate chicken',                       i: COOK_ICONS.rest,    cue: 'REST · 10 MIN',   meta: '~10 min' },
    { t: 'Sear chicken until charred on both sides.', i: COOK_ICONS.sear, cue: 'HIGH HEAT · CAST IRON', meta: '~6 min' },
    { t: 'Assemble and plate',                     i: COOK_ICONS.plate,   cue: 'PLATE · GARNISH', meta: '~3 min' },
  ];
  const curStep = STEPS[step - 1];

  return (
    <Phone label="Cook mode" group="PREP">
      {/* persistent timer bar */}
      <div style={{
        padding: '8px 24px 12px', flexShrink: 0,
        borderBottom: `1px solid ${F.borderSoft}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <FIcon path={ICONS.close} size={20} color={F.text}/>
          <FMono color={F.mute}>3 ACTIVE TIMERS</FMono>
          <div onClick={() => setPaused(p => !p)} style={{ cursor: 'pointer' }}>
            <FIcon path={paused ? ICONS.play : ICONS.pause} size={18} color={F.text}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {timers.map((tm, i) => {
            const pct = (1 - tm.rem / tm.total) * 100;
            const done = tm.rem === 0;
            return (
              <div key={i} style={{ flex: tm.big ? 2 : 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <FMono color={tm.c} size={9} letter={1}>{tm.l}</FMono>
                  <FMono color={done ? F.green : tm.c} size={10}>{done ? 'DONE' : fmt(tm.rem)}</FMono>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: done ? F.green : tm.c, borderRadius: 999, transition: 'width 1s linear' }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused step */}
      <div style={{ flex: 1, padding: '32px 24px 0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: F.accent, animation: 'cookPulse 1.5s infinite' }}/>
          <FLabel mb={0} color={F.accent}>Step {step} of {totalSteps} · Rice bowls</FLabel>
        </div>
          <div style={{
            fontSize: 28, fontWeight: 300, lineHeight: 1.2,
            letterSpacing: -0.5, color: F.text, marginBottom: 20,
          }}>
            {curStep.t}
          </div>

        <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FIcon path={curStep.i} size={18} color={F.accent} stroke={1.8}/>
            <FMono color={F.text}>{curStep.cue}</FMono>
            <span style={{ marginLeft: 'auto', fontFamily: FF.mono, fontSize: 12, color: F.dim }}>{curStep.meta}</span>
          </div>
        </div>

        <div style={{
          marginTop: 14, flex: 1, borderRadius: 16,
          background: `radial-gradient(circle at 50% 40%, rgba(255,110,80,0.30), rgba(255,110,80,0.02) 60%), ${F.surface}`,
          border: `1px solid ${F.borderSoft}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          minHeight: 160,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <FIcon path={curStep.i} size={64} color={F.accent} stroke={1.4}/>
            <FMono color={F.mute} size={10}>STEP {step} OF {totalSteps}</FMono>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '16px 0' }}>
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: F.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}><FIcon path={ICONS.back} size={20}/></button>
          <button
            onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
            data-stay="true"
            style={{
              flex: 1, height: 56, borderRadius: 999, background: F.accent, color: '#1a0f0a',
              fontFamily: FF.mono, fontWeight: 700, fontSize: 13, letterSpacing: 1.4,
              textTransform: 'uppercase', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            <FIcon path={ICONS.check} size={18} color="#1a0f0a" stroke={2.4}/>
            {step === totalSteps ? 'Finish' : 'Done · advance'}
          </button>
        </div>
      </div>
      <style>{`@keyframes cookPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } }`}</style>
    </Phone>
  );
}

Object.assign(window, { MealPrepMergeScreen, MealPrepTimelineScreen, MealPrepCookModeScreen });
