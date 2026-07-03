// 05 Meal Prep — three screens: merge view, parallel timeline, active cook mode.

import { useState, useEffect } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FCheckbox, FBtn, FSection, FToolbar, FTabBar, FListRow, Phone } from '../../ui/components'
import { COOK_ICONS } from '../../ui/icons'

// ════════════════════════════════════════════════
// 5A · Recipe Merge View
// ════════════════════════════════════════════════
export function MealPrepMergeContent() {
  const ings = [
    { n: 'Garlic', d: 'Cut 4 cloves total', breakdown: 'salmon 2 · chili 2' },
    { n: 'Onion',  d: 'Dice 2 medium',       breakdown: 'rice bowl 1 · chili 1' },
    { n: 'Cumin',  d: 'Measure 1.5 tsp',     breakdown: 'rice bowl 0.5 · chili 1' },
    { n: 'Olive oil', d: 'Measure 3 tbsp',   breakdown: 'salmon 2 · chili 1' },
  ];
  const [done, setDone] = useState({});
  const toggle = (n) => setDone(s => ({ ...s, [n]: !s[n] }));
  const completed = Object.values(done).filter(Boolean).length;
  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <FLabel>Tonight's prep</FLabel>
      <div style={{ marginTop: 4 }}>
        <FMono color={Color.text} size={10} style={{ fontWeight: 700, letterSpacing: 0.8 }}>3 RECIPES · 1 KITCHEN.</FMono>
      </div>
      <FMono color={Color.mute}>EST. 1H 18M · 9 PORTIONS</FMono>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { n: 'Garlic salmon · greens', tone: Color.accent, parts: 3, dur: '32 m' },
          { n: 'Chicken rice bowls',     tone: Color.blue, parts: 5, dur: '48 m' },
          { n: 'Beef chili',              tone: Color.purple, parts: 4, dur: '1h 04m' },
        ].map((r, i) => (
          <FSurface key={i} style={{
            padding: '14px 16px', borderRadius: Radius.lg,
            display: 'flex', alignItems: 'center', gap: Space[3],
          }}>
            <div style={{ width: 4, height: 26, borderRadius: 2, background: r.tone, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 400 }}>{r.n}</div>
              <FMono color={Color.mute} size={10}>{r.parts} STEPS · {r.dur}</FMono>
            </div>
          </FSurface>
        ))}
      </div>

      <FSection label="Combined ingredients" mt={40} mb={12}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <FNum size={26} weight={200}>{completed} / {ings.length} prepped</FNum>
          <FMono color={Color.green}>3 DUPES MERGED</FMono>
        </div>
      </FSection>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ings.map((row, i) => {
          const ck = !!done[row.n];
          return (
            <FListRow key={i}
              leading={<div style={{ marginTop: 2 }}><FCheckbox checked={ck} tone="accent" size={22} /></div>}
              title={<span style={{ ...Type.bodyLg, textDecoration: ck ? 'line-through' : 'none' }}>{row.n}</span>}
              subtitle={row.d}
              onClick={() => toggle(row.n)}
            />
          );
        })}
      </div>

      <FSurface tone="red" icon={ICONS.fire} title="Oven conflict" style={{ marginTop: 40 }}>
        <div style={{ ...Type.bodyMd, color: Color.text }}>
          Salmon needs <FMono>400°F</FMono>, chili needs <FMono>325°F</FMono> overlapping at <FMono>18:42</FMono>.
        </div>
        <button style={{
          marginTop: 10, background: 'transparent', border: 'none',
          color: Color.red, fontFamily: Font.mono, fontSize: 11, fontWeight: 600,
          letterSpacing: 1.2, textTransform: 'uppercase', padding: 0, cursor: 'pointer',
        }}>Resolve · 2 options →</button>
      </FSurface>

      <div style={{ marginTop: 32 }}>
        <FBtn variant="split" full>Start parallel cook</FBtn>
      </div>
    </div>
  );
}

export function MealPrepMergeScreen() {
  return (
    <Phone label="Pre-cook merge" group="MEAL PREP">
      <FNavBar
        title="Merge · 3 recipes"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text}/>}
      />
      <MealPrepMergeContent />
      <FTabBar active={1}/>
    </Phone>
  );
}

// ════════════════════════════════════════════════
// 5B · Parallel Step Timeline (Gantt-style)
// ════════════════════════════════════════════════
export function MealPrepTimelineScreen() {
  const TOTAL = 78;
  const [elapsedSec, setElapsedSec] = useState(22 * 60);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setElapsedSec(s => Math.min(s + 1, TOTAL * 60)), 1000);
    return () => clearInterval(t);
  }, [paused]);

  const now = elapsedSec / 60;
  const elapsed = Math.floor(now);
  const fmt = (sec) => {
    const m = Math.floor(sec / 60), s = Math.round(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const lanes = [
    {
      n: 'Salmon · greens', tone: Color.accent,
      steps: [
        { s: 0,  d: 4,  l: 'Prep',     passive: false },
        { s: 4,  d: 10, l: 'Marinate',  passive: true },
        { s: 14, d: 14, l: 'Roast',     passive: true },
        { s: 28, d: 4,  l: 'Plate',     passive: false },
      ],
    },
    {
      n: 'Rice bowls', tone: Color.blue,
      steps: [
        { s: 0,  d: 6,  l: 'Prep',      passive: false },
        { s: 6,  d: 20, l: 'Simmer',    passive: true },
        { s: 26, d: 8,  l: 'Sear',      passive: false },
        { s: 34, d: 6,  l: 'Assemble',  passive: false },
        { s: 40, d: 4,  l: 'Plate',     passive: false },
      ],
    },
    {
      n: 'Chili', tone: Color.purple,
      steps: [
        { s: 8,  d: 6,  l: 'Sear',      passive: false },
        { s: 14, d: 8,  l: 'Build',     passive: false },
        { s: 22, d: 38, l: 'Reduce',    passive: true },
        { s: 60, d: 6,  l: 'Finish',    passive: false },
      ],
    },
  ];

  const getState = (st) => {
    if (now >= st.s + st.d) return 'done';
    if (now >= st.s) return 'active';
    return 'todo';
  };

  // Build sorted active-timer list
  const timers = [];
  lanes.forEach(lane => {
    lane.steps.forEach(st => {
      if (getState(st) === 'active') {
        const remainSec = Math.max(0, (st.s + st.d) * 60 - elapsedSec);
        const totalSec = st.d * 60;
        timers.push({
          label: st.l, lane: lane.n, tone: lane.tone,
          remainSec, totalSec, passive: st.passive,
          pct: ((totalSec - remainSec) / totalSec) * 100,
        });
      }
    });
  });
  timers.sort((a, b) => a.remainSec - b.remainSec);

  // Next upcoming step
  let nextStep = null;
  lanes.forEach(lane => {
    lane.steps.forEach(st => {
      if (getState(st) === 'todo' && (!nextStep || st.s < nextStep.s))
        nextStep = { ...st, lane: lane.n, tone: lane.tone };
    });
  });

  const X = (m) => (m / TOTAL) * 100;
  const W = (d) => (d / TOTAL) * 100;
  const rulerMarks = [0, 20, 40, 60, TOTAL].filter(m => Math.abs(m - now) > 3);

  return (
    <Phone label="Parallel timeline" group="MEAL PREP">
      <FNavBar
        title={`Cook · ${elapsed} m elapsed`}
        leading={<FIcon path={ICONS.close} size={22} color={Color.text}/>}
        trailing={<FIcon path={ICONS.expand} size={20} color={Color.text}/>}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 16px' }}>
        {/* Time ruler */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', height: 14, marginBottom: 6 }}>
            {rulerMarks.map(m => (
              <span key={m} style={{
                position: 'absolute', left: `${X(m)}%`, transform: 'translateX(-50%)',
                fontFamily: Font.mono, fontSize: 9, color: Color.mute, letterSpacing: 1,
              }}>{m}</span>
            ))}
            <span style={{
              position: 'absolute', left: `${X(now)}%`, transform: 'translateX(-50%)',
              fontFamily: Font.mono, fontSize: 9, color: Color.accent, letterSpacing: 1, fontWeight: 600,
            }}>NOW</span>
          </div>

          {/* Lanes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -4, bottom: -4,
              left: `${X(now)}%`, width: 1.5, background: Color.accent, zIndex: 4,
              boxShadow: '0 0 8px rgba(255,110,80,0.4)',
            }}/>

            {lanes.map((lane, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: Space[2], marginBottom: 4 }}>
                  <div style={{ width: 4, height: 14, borderRadius: 2, background: lane.tone }}/>
                  <FMono color={Color.text}>{lane.n}</FMono>
                </div>
                <div style={{
                  position: 'relative', height: 32, borderRadius: 6,
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${Color.borderSoft}`,
                }}>
                  {lane.steps.map((st, j) => {
                    const state = getState(st);
                    const isActive = state === 'active';
                    const isDone = state === 'done';
                    return (
                      <div key={j} style={{
                        position: 'absolute',
                        left: `${X(st.s)}%`, width: `${W(st.d)}%`,
                        top: 2, bottom: 2, borderRadius: Radius.sm,
                        background: isDone
                          ? 'transparent'
                          : isActive && st.passive
                            ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${lane.tone}`
                            : lane.tone,
                        opacity: isDone ? 0.25 : (st.passive && !isActive ? 0.5 : 1),
                        border: isDone ? `1px dashed ${lane.tone}66` : 'none',
                        display: 'flex', alignItems: 'center', padding: '0 6px',
                        overflow: 'hidden',
                      }}>
                        <FMono color={isDone ? Color.mute : Color.surface} size={9} letter={0.5}>
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

        {/* Active timers */}
        {timers.length > 0 && (
          <FSurface style={{ marginTop: 24, padding: 16, borderRadius: Radius.lg }}>
            <FLabel mb={10}>Active timers</FLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {timers.map((t, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 4, height: 14, borderRadius: 2, background: t.tone }}/>
                    <span style={{ ...Type.bodyMd, flex: 1 }}>{t.label} <FMono color={Color.mute} size={10}>· {t.lane}</FMono></span>
                    <FMono color={t.remainSec < 120 ? Color.accent : Color.dim}>{fmt(t.remainSec)}</FMono>
                  </div>
                  <FTexBar pct={t.pct} height={4} color={t.tone}/>
                </div>
              ))}
            </div>
          </FSurface>
        )}

        {/* Up next */}
        {nextStep && (
          <FSurface style={{ marginTop: 16, padding: 16, borderRadius: Radius.lg }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <FLabel mb={4}>Up next</FLabel>
                <span style={{ ...Type.bodyLg }}>{nextStep.l} · {nextStep.lane}</span>
              </div>
              <FMono color={Color.dim}>in {Math.max(0, Math.ceil(nextStep.s - now))}m</FMono>
            </div>
          </FSurface>
        )}
      </div>

      {/* Sticky toolbar */}
      <div style={{ padding: '12px 24px 24px', flexShrink: 0 }}>
        <FToolbar cells={[
          { icon: paused ? ICONS.play : ICONS.pause, label: paused ? 'Resume' : 'Pause', stay: true, onClick: () => setPaused(p => !p) },
          { icon: ICONS.fwd, label: 'Cook mode', primary: true },
        ]}/>
      </div>
    </Phone>
  );
}

// ════════════════════════════════════════════════
// 5C · Active Cook Mode (full focus)
// ════════════════════════════════════════════════
export function MealPrepCookModeScreen() {
  // Live countdowns + step advance.
  const [timers, setTimers] = useState([
    { c: Color.accent,  l: 'SALMON', total: 372, rem: 372 },
    { c: Color.blue, l: 'RICE',   total: 960, rem: 624, big: true },
    { c: Color.purple, l: 'CHILI',  total: 2280, rem: 2280 },
  ]);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(4);
  const totalSteps = 5;

  useEffect(() => {
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
    { t: 'Prep ingredients',                       i: COOK_ICONS.prep,    cue: 'MISE EN PLACE',   meta: '~4 min',  anim: 'chop' },
    { t: 'Rinse and start rice',                   i: COOK_ICONS.boil,    cue: 'BOIL · COVERED',  meta: '~16 min', anim: 'steam' },
    { t: 'Marinate chicken',                       i: COOK_ICONS.rest,    cue: 'REST · 10 MIN',   meta: '~10 min', anim: 'rest' },
    { t: 'Sear chicken until charred on both sides.', i: COOK_ICONS.sear, cue: 'HIGH HEAT · CAST IRON', meta: '~6 min', anim: 'heat' },
    { t: 'Assemble and plate',                     i: COOK_ICONS.plate,   cue: 'PLATE · GARNISH', meta: '~3 min',  anim: 'plate' },
  ];
  const curStep = STEPS[step - 1];

  return (
    <Phone label="Active cook mode" group="MEAL PREP">
      {/* persistent timer bar */}
      <div style={{
        padding: '8px 24px 12px', flexShrink: 0,
        borderBottom: `1px solid ${Color.borderSoft}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <FIcon path={ICONS.close} size={20} color={Color.text}/>
          <FMono color={Color.mute}>3 ACTIVE TIMERS</FMono>
          <div onClick={() => setPaused(p => !p)} style={{ cursor: 'pointer' }}>
            <FIcon path={paused ? ICONS.play : ICONS.pause} size={18} color={Color.text}/>
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
                  <FMono color={done ? Color.green : tm.c} size={10}>{done ? 'DONE' : fmt(tm.rem)}</FMono>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: Radius.full, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: done ? Color.green : tm.c, borderRadius: Radius.full, transition: 'width 1s linear' }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused step */}
      <div style={{ flex: 1, padding: '32px 24px 0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: Color.accent, animation: 'cookPulse 1.5s infinite' }}/>
          <FLabel mb={0} color={Color.accent}>Step {step} of {totalSteps} · Rice bowls</FLabel>
        </div>
          <div style={{
            fontSize: 28, fontWeight: 300, lineHeight: 1.2,
            letterSpacing: -0.5, color: Color.text, marginBottom: 20,
          }}>
            {curStep.t}
          </div>

        <FSurface style={{ marginTop: 16, padding: 16, borderRadius: Radius.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FIcon path={curStep.i} size={18} color={Color.accent} stroke={1.8}/>
            <FMono color={Color.text}>{curStep.cue}</FMono>
            <span style={{ marginLeft: 'auto', fontFamily: Font.mono, fontSize: 12, color: Color.dim }}>{curStep.meta}</span>
          </div>
        </FSurface>

        <FSurface style={{
          marginTop: 14, flex: 1,
          background: `radial-gradient(circle at 50% 40%, rgba(255,110,80,0.20), rgba(255,110,80,0.02) 60%), ${Color.surface}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          minHeight: 160, overflow: 'hidden',
        }}>
          {/* Ambient animation layer */}
          {curStep.anim === 'heat' && <>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', borderRadius: '50%',
                border: `1.5px solid ${Color.accent}`,
                animation: `cookHeatRing 2.4s ease-out ${i * 0.8}s infinite`,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              }}/>
            ))}
          </>}
          {curStep.anim === 'steam' && <>
            {[
              { x: '35%', d: '2.8s', delay: '0s', s: 6 },
              { x: '50%', d: '2.2s', delay: '0.6s', s: 8 },
              { x: '62%', d: '2.6s', delay: '1.2s', s: 5 },
              { x: '45%', d: '3.0s', delay: '0.3s', s: 7 },
            ].map((b, i) => (
              <div key={i} style={{
                position: 'absolute', bottom: '35%', left: b.x,
                width: b.s, height: b.s, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                animation: `cookSteam ${b.d} ease-out ${b.delay} infinite`,
              }}/>
            ))}
          </>}
          {curStep.anim === 'rest' && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 100, height: 100, borderRadius: '50%',
              background: Color.accentFaint,
              animation: 'cookRest 4s ease-in-out infinite',
            }}/>
          )}
          {curStep.anim === 'plate' && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80, height: 80, borderRadius: '50%',
              border: `1px solid ${Color.accentDim}`,
              animation: 'cookPlateRing 3s ease-in-out infinite',
            }}/>
          )}

          {/* Icon + label */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Space[3],
            position: 'relative', zIndex: 1,
            animation: curStep.anim === 'chop'
              ? 'cookChop 0.6s ease-in-out infinite'
              : curStep.anim === 'rest'
                ? 'cookFloat 3s ease-in-out infinite'
                : curStep.anim === 'plate'
                  ? 'cookSettle 2.5s ease-in-out infinite'
                  : undefined,
          }}>
            <FIcon path={curStep.i} size={64} color={Color.accent} stroke={1.4}/>
            <FMono color={Color.mute} size={10}>STEP {step} OF {totalSteps}</FMono>
          </div>
        </FSurface>

        <div style={{ display: 'flex', gap: 10, padding: '16px 0' }}>
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            style={{
              width: 56, height: 56, borderRadius: Radius.md,
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: Color.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}><FIcon path={ICONS.back} size={20}/></button>
          <button
            onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
            data-stay="true"
            style={{
              flex: 1, height: 56, borderRadius: Radius.md, background: Color.accent, color: Color.accentText,
              fontFamily: Font.mono, fontWeight: 700, fontSize: 13, letterSpacing: 1.4,
              textTransform: 'uppercase', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            <FIcon path={ICONS.check} size={18} color={Color.accentText} stroke={2.4}/>
            {step === totalSteps ? 'Finish' : 'Done · advance'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes cookPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } }
        @keyframes cookHeatRing {
          0%   { width: 20px; height: 20px; opacity: 0.5; }
          100% { width: 140px; height: 140px; opacity: 0; }
        }
        @keyframes cookSteam {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          20%  { opacity: 0.4; }
          100% { transform: translateY(-80px) scale(2); opacity: 0; }
        }
        @keyframes cookRest {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.4; }
          50%      { transform: translate(-50%,-50%) scale(1.4); opacity: 0.1; }
        }
        @keyframes cookFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes cookChop {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30%      { transform: translateY(-3px) rotate(-6deg); }
          60%      { transform: translateY(1px) rotate(1deg); }
        }
        @keyframes cookPlateRing {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.3; }
          50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.1; }
        }
        @keyframes cookSettle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%      { transform: scale(1.04) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </Phone>
  );
}
