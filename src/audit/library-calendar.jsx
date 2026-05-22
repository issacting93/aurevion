// Calendar previews — Month/Week/Day variants of PlanCalendarHero.

function CalSwitcher({ active = 'M' }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {['M', 'W', 'D'].map((m) => (
        <div key={m} style={{
          width: 30, height: 30, borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: m === active ? T.accent : 'transparent',
          border: m === active ? `1px solid ${T.accent}` : `1px solid rgba(255,110,80,0.5)`,
          color: m === active ? '#1a0f0a' : T.accent,
          fontSize: 12, fontWeight: 700, fontFamily: FONTS.mono,
        }}>{m}</div>
      ))}
    </div>
  );
}

function CalHeader({ mode = 'M' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: 30, height: 30, border: `1px solid ${T.borderSoft}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textDim }}>‹</div>
        <div style={{ width: 30, height: 30, border: `1px solid ${T.borderSoft}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textDim }}>›</div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 600 }}>May 2026</div>
      <CalSwitcher active={mode}/>
    </div>
  );
}

function CalMonthPreview() {
  // Build a simple 5-week May 2026-ish grid. Fri (May 1) starts it.
  const headers = ['S','M','T','W','T','F','S'];
  const cells = [];
  // first row: 26..30 from prev, 1, 2
  cells.push({n: 26, mute: true});
  cells.push({n: 27, mute: true});
  cells.push({n: 28, mute: true});
  cells.push({n: 29, mute: true});
  cells.push({n: 30, mute: true});
  cells.push({n: 1, dots: [T.accent, T.amber, T.cyan]});
  cells.push({n: 2});
  for (let i = 3; i <= 30; i++) {
    const ent = { n: i };
    if (i === 3) ent.dots = [T.accent, T.green];
    if (i === 4) ent.dots = [T.purple];
    if (i === 5) ent.dots = [T.accent, T.cyan];
    if (i === 7) ent.dots = [T.accent, T.cyan];
    if (i === 8) ent.dots = [T.green];
    if (i === 9) ent.dots = [T.accent, T.cyan];
    if (i === 10) ent.dots = [T.purple];
    if (i === 11) ent.dots = [T.accent];
    if (i === 13) { ent.dots = [T.accent, T.purple, T.cyan]; ent.selected = true; }
    if (i === 14) ent.dots = [T.accent];
    if (i === 15) ent.dots = [T.accent];
    if (i === 17) ent.dots = [T.accent, T.cyan];
    if (i === 18) ent.dots = [T.green];
    if (i === 19) ent.dots = [T.accent, T.cyan];
    if (i === 21) ent.dots = [T.accent, T.cyan];
    if (i === 22) { ent.dots = [T.purple]; ent.today = true; }
    if (i === 23) ent.dots = [T.accent, T.green];
    if (i === 25) ent.dots = [T.accent, T.accent, T.cyan];
    if (i === 27) ent.dots = [T.accent, T.textMute];
    if (i === 28) ent.dots = [T.purple, T.cyan];
    if (i === 29) ent.dots = [T.cyan, T.cyan];
    cells.push(ent);
  }
  return (
    <PreviewBase scroll>
      <CalHeader mode="M"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
        {headers.map((h, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, padding: '4px 0' }}>{h}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            aspectRatio: '1 / 1.05',
            borderRadius: 7, border: `1px solid ${c.selected ? T.accent : (c.today ? 'rgba(255,255,255,0.05)' : T.borderSoft)}`,
            background: c.today ? 'rgba(255,255,255,0.04)' : 'transparent',
            padding: '4px 6px', position: 'relative',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: c.mute ? T.textMute : T.text }}>{c.n}</div>
            {c.dots && (
              <div style={{ display: 'flex', gap: 2 }}>
                {c.dots.map((d, j) => (
                  <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: d }}/>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

function CalWeekPreview() {
  const days = [
    { d: 'SUN', n: 17, blocks: [{ g: 'fitness_center', c: T.accent }, { g: 'bedtime', c: T.cyan }] },
    { d: 'MON', n: 18, blocks: [{ g: 'science', c: T.green }] },
    { d: 'TUE', n: 19, blocks: [{ g: 'fitness_center', c: T.accent }, { g: 'restaurant', c: T.purple }] },
    { d: 'WED', n: 20, blocks: [] },
    { d: 'THU', n: 21, blocks: [{ g: 'fitness_center', c: T.accent }, { g: 'bedtime', c: T.cyan }] },
    { d: 'FRI', n: 22, blocks: [{ g: 'restaurant', c: T.purple }] },
    { d: 'SAT', n: 23, blocks: [{ g: 'fitness_center', c: T.accent }, { g: 'science', c: T.green }] },
  ];
  return (
    <PreviewBase>
      <CalHeader mode="W"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((d, i) => (
          <div key={i} style={{
            border: `1px solid ${T.borderSoft}`,
            borderRadius: 12, padding: '8px 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            minHeight: 200,
          }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute }}>{d.d}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{d.n}</div>
            {d.blocks.map((b, j) => (
              <div key={j} style={{
                width: 26, height: 26, borderRadius: 6,
                background: `${b.c}22`, border: `1px solid ${b.c}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><MIcon name={b.g} size={14} color={b.c}/></div>
            ))}
          </div>
        ))}
      </div>
    </PreviewBase>
  );
}

function CalDayPreview() {
  return (
    <PreviewBase>
      <CalHeader mode="D"/>
      <div style={{
        marginTop: 10, padding: 18, borderRadius: 16,
        background: T.surface, border: `1px solid ${T.borderSoft}`,
        minHeight: 340, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, letterSpacing: 1 }}>FRIDAY</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>22</div>
          <div style={{ fontSize: 13, color: T.textDim }}>Selected</div>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px',
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.borderSoft}`,
            borderRadius: 999, fontSize: 11, color: T.textDim,
          }}>Meal window</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute }}>1 total</div>
        </div>
      </div>
    </PreviewBase>
  );
}

Object.assign(window, { CalMonthPreview, CalWeekPreview, CalDayPreview });
