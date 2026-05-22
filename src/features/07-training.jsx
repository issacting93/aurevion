// 07 Training · Session — execution rail (uses Timeline component from audit).

function TrainingSessionScreen() {
  const items = [
    { name: 'Warm-up walk',       sub: 'MOBILITY · 5 MIN',         state: 'done' },
    { name: 'Goblet squat',        sub: 'ACTIVATION · 2 × 8',      state: 'done' },
    { name: 'Back squat',          sub: 'PRIMARY · 4 × 6 @ 102KG', state: 'active',
      cues: 'Drive through the floor and keep the chest organized on every rep.',
      meta: '4 × 6  ·  16 MIN  ·  QUADS · GLUTES · RPE 8' },
    { name: 'Romanian deadlift',   sub: 'POSTERIOR · 3 × 8',        state: 'idle' },
    { name: 'Walking lunge',       sub: 'UNILATERAL · 3 × 10',      state: 'idle' },
    { name: 'Cooldown breathing',  sub: 'DOWNSHIFT · 3 MIN',        state: 'idle' },
  ];

  return (
    <Phone label="Strength · A" group="TRAINING">
      <FNavBar
        title="Day 04 · Lower"
        leading={<FIcon path={ICONS.close} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Session header */}
        <FLabel>Elapsed</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <FNum size={68} weight={200}>22:14</FNum>
          <FMono color={F.accent}>3 / 6</FMono>
        </div>
        <FMono color={F.mute}>SESSION · 48 MIN PLANNED · RPE 8</FMono>

        {/* Timeline rail */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column' }}>
          {items.map((it, i) => {
            const done = it.state === 'done';
            const active = it.state === 'active';
            return (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '20px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${F.borderSoft}`,
              }}>
                {/* ring */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                  background: done ? F.accent : 'transparent',
                  border: `1.5px solid ${active || done ? F.accent : 'rgba(255,110,80,0.25)'}`,
                  display: 'grid', placeItems: 'center',
                  position: 'relative',
                }}>
                  {done && <FIcon path={ICONS.check} size={14} color="#1a0f0a" stroke={3}/>}
                  {active && <div style={{ width: 9, height: 9, borderRadius: '50%', background: F.accent, animation: 'pulseRing 1.6s infinite' }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 300, color: done ? F.dim : F.text, letterSpacing: -0.3 }}>
                    {it.name}
                  </div>
                  <FMono color={F.mute} size={10}>{it.sub}</FMono>
                  {active && (
                    <>
                      {it.cues && (
                        <div style={{ marginTop: 20, fontSize: 14, color: F.text, lineHeight: 1.5 }}>
                          {it.cues}
                        </div>
                      )}
                      {it.meta && (
                        <FMono color={F.mute} size={10}>
                          <div style={{ marginTop: 14 }}>{it.meta}</div>
                        </FMono>
                      )}
                      {/* set tracker */}
                      <div style={{ marginTop: 24 }}>
                        <FLabel mb={8}>Sets</FLabel>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {[
                            { reps: 6, w: '102', done: true },
                            { reps: 6, w: '102', done: true },
                            { reps: 6, w: '102', active: true },
                            { reps: 6, w: '102' },
                          ].map((s, j) => (
                            <div key={j} style={{
                              flex: 1, padding: '10px 6px', borderRadius: 6,
                              background: s.done ? `${F.accent}1a` : s.active ? F.accent : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${s.active ? F.accent : (s.done ? 'rgba(255,110,80,0.3)' : F.borderSoft)}`,
                              textAlign: 'center',
                            }}>
                              <div style={{ fontFamily: FF.mono, fontSize: 14, fontWeight: 600, color: s.active ? '#1a0f0a' : F.text }}>{s.reps}</div>
                              <FMono size={9} color={s.active ? 'rgba(26,15,10,0.6)' : F.mute}>{s.w}KG</FMono>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Quick actions */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                        <FBtn variant="primary" size="md" icon={ICONS.check} data-stay="true">Complete set</FBtn>
                        <FBtn variant="ghost" size="md">Skip</FBtn>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom rest-timer / metrics row */}
        <div style={{
          marginTop: 32, padding: 16, borderRadius: 12,
          background: F.surface, border: `1px solid ${F.borderSoft}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FIcon path={ICONS.timer} size={16} color={F.accent} stroke={2}/>
            <div>
              <FLabel mb={2}>Rest</FLabel>
              <FNum size={20} weight={300}>01:24</FNum>
            </div>
          </div>
          <FBtn variant="ghost" size="sm" icon={ICONS.fwd} data-stay="true">Skip rest</FBtn>
        </div>

        <div style={{ marginTop: 14 }}>
          <FBtn variant="split" full>End workout</FBtn>
        </div>
      </div>
      <style>{`@keyframes pulseRing { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.5; } }`}</style>
    </Phone>
  );
}

Object.assign(window, { TrainingSessionScreen });
