// 06 Plan Calendar — the hub. Month + Week + Day applied with the new direction.

function PlanCalendarHubScreen({ initialView = 'M' }) {
  const [view, setView] = React.useState(initialView);
  return (
    <Phone label="Plan" group="CALENDAR">
      <FNavBar
        title="May 2026"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.plus} size={22} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <FLabel>This week · plan health</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <FNum size={56} weight={200}>11 / 14</FNum>
          <FMono color={F.green}>ON TRACK</FMono>
        </div>
        <FMono color={F.mute}>EVENTS COMPLETED · WEEK 19</FMono>

        {/* View switch + arrows */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['M', 'W', 'D'].map(m => (
              <button key={m} onClick={() => setView(m)} style={{
                width: 32, height: 32, borderRadius: 8,
                background: view === m ? F.accent : 'transparent',
                color: view === m ? '#1a0f0a' : F.dim,
                border: `1px solid ${view === m ? F.accent : F.borderSoft}`,
                fontFamily: FF.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1,
                cursor: 'pointer',
              }}>{m}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{
              width: 32, height: 32, borderRadius: 8, background: 'transparent',
              border: `1px solid ${F.borderSoft}`, color: F.dim, cursor: 'pointer',
              display: 'grid', placeItems: 'center',
            }}><FIcon path={ICONS.back} size={14}/></button>
            <button style={{
              width: 32, height: 32, borderRadius: 8, background: 'transparent',
              border: `1px solid ${F.borderSoft}`, color: F.dim, cursor: 'pointer',
              display: 'grid', placeItems: 'center',
            }}><FIcon path={ICONS.fwd} size={14}/></button>
          </div>
        </div>

        <div style={{ marginTop: 16, flex: 1 }}>
          {view === 'M' && <MonthGrid/>}
          {view === 'W' && <WeekGrid/>}
          {view === 'D' && <DayView/>}
        </div>
      </div>
      <FTabBar active={0}/>
    </Phone>
  );
}

// ── Month grid ──
function MonthGrid() {
  const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [selected, setSelected] = React.useState(16);
  const cells = [];
  for (let i = 26; i <= 30; i++) cells.push({ n: i, mute: true });
  for (let i = 1; i <= 30; i++) {
    const c = { n: i };
    if ([1, 4, 7, 11, 14, 18, 22, 25, 28].includes(i)) c.train = true;
    if ([2, 5, 9, 12, 16, 19, 23, 27, 30].includes(i)) c.meal = true;
    if ([6, 13, 20, 27].includes(i)) c.checkin = true;
    if (i === 13) c.today = true;
    cells.push(c);
  }
  while (cells.length < 35) cells.push({ n: cells.length - 30 + 1, mute: true, next: true });

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
        {headers.map((h, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: FF.mono, fontSize: 10, color: F.mute, padding: '4px 0' }}>{h}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {cells.map((c, i) => {
          const isSel = !c.mute && c.n === selected;
          return (
            <div key={i}
              onClick={() => !c.mute && setSelected(c.n)}
              style={{
                aspectRatio: '1 / 1.0',
                borderRadius: 6,
                border: `1px solid ${isSel ? F.accent : (c.today ? 'rgba(255,255,255,0.06)' : F.borderSoft)}`,
                background: isSel ? 'rgba(255,110,80,0.10)' : (c.today ? 'rgba(255,110,80,0.04)' : 'transparent'),
                padding: '4px 5px', cursor: c.mute ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'background .12s, border-color .12s',
              }}>
              <div style={{
                fontFamily: FF.mono, fontSize: 11,
                color: c.mute ? F.mute : (isSel || c.today ? F.accent : F.text),
                fontWeight: isSel || c.today ? 600 : 400,
              }}>{c.n}</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {c.train   && <span style={{ width: 4, height: 4, borderRadius: 1, background: F.accent }}/>}
                {c.meal    && <span style={{ width: 4, height: 4, borderRadius: 1, background: '#60a5fa' }}/>}
                {c.checkin && <span style={{ width: 4, height: 4, borderRadius: 1, background: F.green }}/>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <FLabel mb={2}>May {selected}</FLabel>
          <FMono color={F.text} size={11}>3 EVENTS · TRAIN, MEAL, CHECK-IN</FMono>
        </div>
        <FBtn variant="ghost" size="sm" icon={ICONS.fwd} data-stay="true">View day</FBtn>
      </div>
    </>
  );
}

function Legend({ color, l, n }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
      <span style={{ fontFamily: FF.mono, fontSize: 11, color: F.mute, letterSpacing: 1 }}>{l}</span>
      <span style={{ fontFamily: FF.mono, fontSize: 11, color: F.text }}>{n}</span>
    </div>
  );
}

// ── Week grid ──
function WeekGrid() {
  const TODAY_IDX = 5; // Friday
  const days = [
    { d: 'SUN', n: 17, e: [
      { k: 'train', i: ICONS.dumb, c: F.accent, label: 'Lower body',  t: '06:30', dur: '60 m', sub: 'Strength · 4 lifts', done: true },
      { k: 'meal',  i: ICONS.meal, c: '#60a5fa', label: 'Dinner',      t: '19:00', dur: '540 kcal', sub: 'Salmon · greens', done: true },
    ]},
    { d: 'MON', n: 18, e: [
      { k: 'sleep', i: ICONS.timer, c: F.green, label: 'Sleep',         t: '23:00', dur: '7.5 h', sub: 'Recovery target', done: true },
    ]},
    { d: 'TUE', n: 19, e: [
      { k: 'train', i: ICONS.dumb, c: F.accent, label: 'Push',          t: '07:00', dur: '55 m', sub: 'Bench focus', done: true },
      { k: 'meal',  i: ICONS.meal, c: '#60a5fa', label: 'Lunch',         t: '13:00', dur: '620 kcal', sub: 'Chicken bowl', done: true },
    ]},
    { d: 'WED', n: 20, e: [] },
    { d: 'THU', n: 21, e: [
      { k: 'train', i: ICONS.dumb, c: F.accent, label: 'Pull',          t: '07:00', dur: '55 m', sub: 'Posterior chain', done: true },
      { k: 'meal',  i: ICONS.meal, c: '#60a5fa', label: 'Dinner',        t: '19:00', dur: '580 kcal', sub: 'Tofu stir-fry', done: true },
    ]},
    { d: 'FRI', n: 22, today: true, e: [
      { k: 'meal',  i: ICONS.meal, c: '#60a5fa', label: 'Dinner',        t: '19:00', dur: '540 kcal', sub: 'Salmon · greens' },
    ]},
    { d: 'SAT', n: 23, e: [
      { k: 'train', i: ICONS.dumb, c: F.accent, label: 'Zone 2 walk',    t: '08:00', dur: '60 m', sub: 'Easy cardio' },
      { k: 'check', i: ICONS.goal, c: F.green, label: 'Weigh-in',         t: '08:00', dur: 'check-in', sub: 'Body fat + weight' },
    ]},
  ];

  const [sel, setSel] = React.useState({ d: 4, e: 0 });
  const [detailKey, setDetailKey] = React.useState(0); // for transition
  const selDay = days[sel.d];
  const selEvent = selDay && selDay.e[sel.e];

  const selectDay = (dayIdx) => {
    const day = days[dayIdx];
    const eventIdx = day.e.length > 0 ? 0 : -1;
    setSel({ d: dayIdx, e: eventIdx });
    setDetailKey(k => k + 1);
  };

  const selectEvent = (dayIdx, eventIdx) => {
    setSel({ d: dayIdx, e: eventIdx });
    setDetailKey(k => k + 1);
  };

  // Navigate events within selected day
  const nextEvent = () => {
    if (!selDay || selDay.e.length <= 1) return;
    const next = (sel.e + 1) % selDay.e.length;
    setSel(s => ({ ...s, e: next }));
    setDetailKey(k => k + 1);
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((day, i) => {
          const dayActive = sel.d === i;
          const isPast = i < TODAY_IDX;
          return (
            <div key={i}
              onClick={() => selectDay(i)}
              style={{
                border: `1px solid ${day.today ? F.accent : (dayActive ? 'rgba(255,110,80,0.5)' : F.borderSoft)}`,
                background: day.today ? 'rgba(255,110,80,0.04)' : (dayActive ? 'rgba(255,255,255,0.03)' : 'transparent'),
                borderRadius: 10, padding: '8px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 168,
                cursor: 'pointer',
                transition: 'border-color .15s ease, background .15s ease',
              }}>
              <div style={{ fontFamily: FF.mono, fontSize: 10, color: F.mute, letterSpacing: 1 }}>{day.d}</div>
              <div style={{
                fontFamily: FF.mono, fontSize: 15,
                color: day.today ? F.accent : (dayActive ? F.text : (isPast ? F.dim : F.text)),
                fontWeight: day.today || dayActive ? 600 : 400,
              }}>{day.n}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
                {day.e.length === 0 && dayActive && (
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    border: `1.5px dashed ${F.borderSoft}`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <FIcon path={ICONS.plus} size={14} color={F.mute} stroke={1.5}/>
                  </div>
                )}
                {day.e.map((ev, j) => {
                  const active = sel.d === i && sel.e === j;
                  return (
                    <button key={j}
                      onClick={(e) => { e.stopPropagation(); selectEvent(i, j); }}
                      style={{
                        position: 'relative',
                        width: 36, height: 36, borderRadius: 9,
                        background: ev.c,
                        display: 'grid', placeItems: 'center', cursor: 'pointer',
                        border: 'none', padding: 0,
                        boxShadow: active ? `0 0 0 2px ${F.bg}, 0 0 0 3.5px ${ev.c}` : 'none',
                        transition: 'box-shadow .15s ease, transform .12s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: active ? 'scale(1.08)' : 'scale(1)',
                        opacity: ev.done && !active ? 0.55 : 1,
                      }}>
                      <FIcon path={ev.i} size={18} color="#0d0d0d" stroke={1.8}/>
                      {ev.done && (
                        <div style={{
                          position: 'absolute', top: -3, right: -3,
                          width: 12, height: 12, borderRadius: '50%',
                          background: F.green, border: `2px solid ${F.bg}`,
                          display: 'grid', placeItems: 'center',
                        }}>
                          <FIcon path={ICONS.check} size={7} color="#0d0d0d" stroke={3}/>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected event detail — animated on swap */}
      <div key={detailKey} style={{ animation: 'fStaggerIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        {selEvent ? (
          <div style={{
            marginTop: 32, padding: 16, borderRadius: 12,
            background: F.surface, border: `1px solid ${selEvent.c}55`,
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: selEvent.c,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <FIcon path={selEvent.i} size={22} color="#0d0d0d" stroke={1.8}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <FLabel mb={2} color={selEvent.c}>{selDay.d} {selDay.n} · {selEvent.t}</FLabel>
                <FMono color={F.mute}>{selEvent.dur}</FMono>
              </div>
              <div style={{ fontSize: 18, fontWeight: 400, marginTop: 4 }}>
                {selEvent.label}
                {selEvent.done && <span style={{ marginLeft: 8 }}><FIcon path={ICONS.check} size={14} color={F.green} stroke={2.4}/></span>}
              </div>
              <div style={{ fontSize: 13, color: F.dim, marginTop: 2 }}>{selEvent.sub}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <FBtn variant="ghost" size="sm" icon={ICONS.fwd} data-stay="true">Open details</FBtn>
                {selDay.e.length > 1 && (
                  <button onClick={nextEvent} data-stay="true" style={{
                    background: 'transparent', border: `1px solid ${F.borderSoft}`,
                    borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: F.dim,
                    fontFamily: FF.mono, fontSize: 10, letterSpacing: 1,
                  }}>{sel.e + 1}/{selDay.e.length} ↓</button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            marginTop: 24, padding: 16, borderRadius: 12,
            background: F.surface, border: `1px dashed ${F.borderSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <FIcon path={ICONS.plus} size={14} color={F.mute} stroke={1.5}/>
            <FMono color={F.mute}>{selDay.d} {selDay.n} · REST DAY</FMono>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}`, display: 'flex', gap: 18 }}>
        <Legend color={F.accent} l="TRAIN" n={4}/>
        <Legend color="#60a5fa" l="MEAL" n={4}/>
        <Legend color={F.green} l="CHECK-IN" n={2}/>
      </div>
    </>
  );
}

// ── Day view ──
function DayView() {
  // Single-day vertical timeline with hours, plus the event blocks anchored to time.
  const hours = ['06', '08', '10', '12', '14', '16', '18', '20', '22'];
  const events = [
    { l: 'Zone 2 walk',  sub: '45 MIN · CARDIO',         c: F.accent,  start: 0.25, dur: 0.4, done: true },
    { l: 'Breakfast',    sub: '420 KCAL',                c: '#60a5fa', start: 1.0,  dur: 0.4, done: true },
    { l: 'Lunch',        sub: '540 KCAL · CHICKEN BOWL', c: '#60a5fa', start: 3.0,  dur: 0.4, done: true },
    { l: 'Strength · Push',sub: '60 MIN · 4 LIFTS',     c: F.accent,  start: 5.5,  dur: 0.7,  active: true },
    { l: 'Dinner',       sub: '620 KCAL · SALMON',       c: '#60a5fa', start: 6.5,  dur: 0.4 },
    { l: 'Sleep',        sub: '7.5 H TARGET',            c: F.green,   start: 8.5,  dur: 0.5 },
  ];
  // Convert hour positions to percentage of total height
  const totalSpan = hours.length - 1; // 8 intervals
  const HEIGHT = 480;
  const pctOf = (s) => (s / totalSpan) * 100;
  return (
    <div>
      <div style={{ padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.accent}40`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <FLabel mb={4} color={F.accent}>Friday · May 22</FLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <FNum size={42} weight={200}>22</FNum>
            <FMono color={F.mute}>6 EVENTS · 3 DONE</FMono>
          </div>
        </div>
        <FMono color={F.green}>ON PACE</FMono>
      </div>

      {/* Up-next hero row — jewel paired with the active workout context */}
      <div style={{
        marginTop: 24, padding: 16, borderRadius: 12,
        background: F.surface, border: `1px solid ${F.borderSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <FLabel mb={2}>Up next · 17:30</FLabel>
          <div style={{ fontSize: 14, fontWeight: 400, color: F.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Strength · Push</div>
        </div>
        <FPulseBtn size={48} icon={ICONS.play} />
      </div>

      <div style={{ marginTop: 24, position: 'relative', height: HEIGHT,
        background: F.surface, borderRadius: 12, border: `1px solid ${F.borderSoft}`,
        padding: '14px 16px 14px 44px',
      }}>
        {/* hour gridlines + labels */}
        {hours.map((h, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 14,
            top: `calc(12px + ${(i / (hours.length - 1)) * (HEIGHT - 24)}px)`,
            height: 1, background: F.borderSoft,
          }}>
            <span style={{
              position: 'absolute', left: 4, top: -6,
              fontFamily: FF.mono, fontSize: 9, color: F.mute, letterSpacing: 0.8,
            }}>{h}</span>
          </div>
        ))}
        {/* current-time marker */}
        <div style={{
          position: 'absolute', left: 30, right: 14,
          top: `calc(12px + ${pctOf(5.5)/100 * (HEIGHT - 24)}px)`,
          height: 1.5, background: F.accent, zIndex: 2,
        }}>
          <div style={{
            position: 'absolute', right: 4, top: -7,
            fontFamily: FF.mono, fontSize: 9, color: F.accent, letterSpacing: 1,
            background: F.bg, padding: '0 4px',
          }}>NOW · 17:30</div>
        </div>
        {/* events */}
        {events.map((ev, i) => {
          const top = 12 + pctOf(ev.start)/100 * (HEIGHT - 24);
          const h = Math.max(36, ev.dur / totalSpan * (HEIGHT - 24));
          return (
            <div key={i} style={{
              position: 'absolute', left: 44, right: 14,
              top, height: h,
              borderRadius: 6, padding: '6px 8px',
              background: ev.active
                ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${ev.c}`
                : `${ev.c}1f`,
              borderLeft: `2px solid ${ev.c}`,
              opacity: ev.done ? 0.5 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: ev.active ? '#1a0f0a' : F.text,
                              textDecoration: ev.done ? 'line-through' : 'none' }}>{ev.l}</div>
                {ev.done && <FIcon path={ICONS.check} size={11} color={F.green} stroke={2.4}/>}
              </div>
              <FMono size={9} color={ev.active ? 'rgba(26,15,10,0.6)' : F.mute}>{ev.sub}</FMono>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  PlanCalendarHubScreen,
  PlanCalendarMonthScreen: () => <PlanCalendarHubScreen initialView="M"/>,
  PlanCalendarWeekScreen:  () => <PlanCalendarHubScreen initialView="W"/>,
  PlanCalendarDayScreen:   () => <PlanCalendarHubScreen initialView="D"/>,
});
