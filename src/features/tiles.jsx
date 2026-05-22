// ─────────────────────────────────────────────────────────────────────────────
// Aurevion · Modular Tile System
// ─────────────────────────────────────────────────────────────────────────────
// Every tile renders at 3 density levels: full | mid | compact
// Tiles live inside a 2-column grid (FTileGrid). Each tile can span 1 or 2 cols.
//
// Density determines information density, NOT importance.
//   full    — expanded: label + metric + context + progress + metadata
//   mid     — default: label + metric + one supporting line
//   compact — glanceable: metric only, minimal chrome
// ─────────────────────────────────────────────────────────────────────────────

const TILE_PAD = { full: 16, mid: 14, compact: 10 };
const TILE_RAD = { full: 14, mid: 12, compact: 10 };
const TILE_GAP = 10;

// ─── FTileGrid ───────────────────────────────────────────
// 2-column container. Tiles declare their own span.
function FTileGrid({ children, padding = 16 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: TILE_GAP,
      padding: `0 ${padding}px`,
    }}>
      {children}
    </div>
  );
}

// ─── FTile ───────────────────────────────────────────────
// Base wrapper. Handles surface, padding, radius, span.
function FTile({ children, density = 'mid', span = 1, style = {}, onClick }) {
  const pad = TILE_PAD[density];
  const rad = TILE_RAD[density];
  return (
    <div
      onClick={onClick}
      style={{
        gridColumn: span === 2 ? '1 / -1' : 'auto',
        background: F.surface,
        border: `1px solid ${F.borderSoft}`,
        borderRadius: rad,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        gap: density === 'compact' ? 4 : density === 'mid' ? 8 : 10,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s ease',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Tile header (reused inside tiles) ───────────────────
function TileHead({ label, tag, density }) {
  if (density === 'compact') return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
      <FLabel size={density === 'full' ? 10 : 9} mb={0} letter={1.2}>{label}</FLabel>
      {tag && density === 'full' && tag}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Metric — a single big number with context
// ─────────────────────────────────────────────────────────────────────────────
function MetricTile({ label, value, unit, meta, tag, density = 'mid', span, style }) {
  const numSize = { full: 36, mid: 28, compact: 22 }[density];
  return (
    <FTile density={density} span={span} style={style}>
      <TileHead label={label} tag={tag} density={density} />
      {density === 'compact' && (
        <FLabel size={8} mb={0} letter={1}>{label}</FLabel>
      )}
      <FNum size={numSize} weight={200} unit={unit}>{value}</FNum>
      {meta && density === 'full' && (
        <FMono size={10} color={F.dim}>{meta}</FMono>
      )}
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Progress — goal progress, model confidence, etc.
// ─────────────────────────────────────────────────────────────────────────────
function ProgressTile({ label, pct, description, meta, tag, color = F.accent, density = 'mid', span, style }) {
  const numSize = { full: 32, mid: 24, compact: 20 }[density];
  return (
    <FTile density={density} span={span || (density === 'full' ? 2 : 1)} style={style}>
      <TileHead label={label} tag={tag} density={density} />
      {density === 'compact' && (
        <FLabel size={8} mb={0} letter={1}>{label}</FLabel>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <FNum size={numSize} weight={200} unit="%" color={color}>{pct}</FNum>
      </div>
      <FTexBar pct={pct} height={density === 'compact' ? 4 : density === 'mid' ? 6 : 8} color={color} radius={3} />
      {description && density === 'full' && (
        <span style={{ fontSize: 12, color: F.dim, lineHeight: 1.4 }}>{description}</span>
      )}
      {meta && density === 'full' && (
        <FMono size={10} color={F.mute}>{meta}</FMono>
      )}
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Macros — P / C / F breakdown
// ─────────────────────────────────────────────────────────────────────────────
function MacroTile({ kcal, protein, carbs, fat, deficit, density = 'mid', span, style }) {
  const macros = [
    { label: 'PROT', value: protein, color: F.accent, pct: (protein * 4 / kcal * 100) },
    { label: 'CARB', value: carbs, color: F.dim, pct: (carbs * 4 / kcal * 100) },
    { label: 'FAT', value: fat, color: F.mute, pct: (fat * 9 / kcal * 100) },
  ];

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>MACROS</FLabel>
        <FNum size={20} weight={200} unit="kcal">{kcal.toLocaleString()}</FNum>
        <div style={{ display: 'flex', gap: 3, height: 4 }}>
          {macros.map(m => (
            <div key={m.label} style={{
              flex: m.pct, height: '100%', borderRadius: 2,
              background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${m.color}`,
            }} />
          ))}
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 2} style={style}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <FLabel size={9} mb={0} letter={1}>DAILY</FLabel>
            <FNum size={24} weight={200} unit="kcal">{kcal.toLocaleString()}</FNum>
          </div>
          {deficit && <FMono size={10} color={F.accent}>{deficit}</FMono>}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {macros.map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <FMono size={9} color={F.mute}>{m.label}</FMono>
              <FMono size={13} color={F.text}>{m.value}g</FMono>
            </div>
          ))}
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style}>
      <TileHead label="TARGETS FOR THIS WEEK" tag={deficit && <FTag tone="accent" size="sm">{deficit}</FTag>} density={density} />
      <FNum size={36} weight={200} unit="kcal">{kcal.toLocaleString()}</FNum>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {macros.map(m => (
          <div key={m.label} style={{
            padding: '10px 12px', borderRadius: 10,
            background: F.bg, border: `1px solid ${m.label === 'PROT' ? 'rgba(255,110,80,0.2)' : F.borderSoft}`,
          }}>
            <FLabel size={9} mb={4} color={m.label === 'PROT' ? F.accent : F.mute}>{m.label}</FLabel>
            <FNum size={22} weight={300} unit="g">{m.value}</FNum>
            <div style={{ marginTop: 6 }}>
              <FTexBar pct={m.pct} height={4} color={m.color} radius={2} />
            </div>
          </div>
        ))}
      </div>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Calendar — week strip
// ─────────────────────────────────────────────────────────────────────────────
function CalendarTile({ days, density = 'mid', span, style }) {
  // days: [{ label, done, type, today }] — 7 entries
  const COLORS = { train: '#5eaaff', meal: F.accent, checkin: F.green, rest: F.faint };

  if (density === 'compact') {
    const done = days.filter(d => d.done).length;
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>THIS WEEK</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <FNum size={20} weight={200}>{done}</FNum>
          <FMono size={11} color={F.mute}>/ {days.length}</FMono>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: d.done ? COLORS[d.type] || F.accent : 'rgba(255,255,255,0.06)',
            }} />
          ))}
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 2} style={style}>
        <TileHead label="THIS WEEK" density={density} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {days.map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <FMono size={9} color={d.today ? F.accent : F.mute}>{d.label}</FMono>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 6, marginTop: 4,
                background: d.done ? COLORS[d.type] || F.accent : 'rgba(255,255,255,0.04)',
                border: d.today ? `1px solid ${F.accent}` : `1px solid ${F.borderSoft}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: d.done ? 1 : 0.5,
              }}>
                {d.done && <FIcon path={ICONS.check} size={12} color={d.type === 'train' ? '#fff' : '#1a0f0a'} stroke={2.4} />}
              </div>
            </div>
          ))}
        </div>
      </FTile>
    );
  }

  // full
  const done = days.filter(d => d.done).length;
  return (
    <FTile density={density} span={span || 2} style={style}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <TileHead label="THIS WEEK · PLAN HEALTH" tag={<FTag tone="green" size="sm">ON TRACK</FTag>} density={density} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <FNum size={28} weight={200}>{done}</FNum>
        <FMono size={13} color={F.mute}>/ {days.length} completed</FMono>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <FMono size={9} color={d.today ? F.accent : F.mute}>{d.label}</FMono>
            <div style={{
              width: '100%', aspectRatio: '1', borderRadius: 8, marginTop: 4,
              background: d.done
                ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.18) 0 1.5px, transparent 1.5px 5px), ${COLORS[d.type] || F.accent}`
                : 'rgba(255,255,255,0.03)',
              border: d.today ? `1.5px solid ${F.accent}` : `1px solid ${F.borderSoft}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 2, padding: 2,
            }}>
              {d.done && <FIcon path={ICONS.check} size={14} color={d.type === 'train' ? '#fff' : '#1a0f0a'} stroke={2.4} />}
              {!d.done && d.type && (
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS[d.type], opacity: 0.5 }} />
              )}
            </div>
            {d.eventLabel && density === 'full' && (
              <FMono size={8} color={F.mute}>{d.eventLabel}</FMono>
            )}
          </div>
        ))}
      </div>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Session — next training session
// ─────────────────────────────────────────────────────────────────────────────
function SessionTile({ name, time, exercises, exerciseCount, day, density = 'mid', span, style }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>NEXT SESSION</FLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: 'rgba(94,170,255,0.15)', display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.dumb} size={12} color="#5eaaff" stroke={1.8} />
          </div>
          <FMono size={12} color={F.text}>{name}</FMono>
        </div>
        <FMono size={9} color={F.mute}>{time}</FMono>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="NEXT SESSION" density={density} />
        <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: -0.3 }}>{name}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <FMono size={10} color={F.dim}>{day}</FMono>
          <FMono size={10} color={F.mute}>·</FMono>
          <FMono size={10} color={F.dim}>{time}</FMono>
          <FMono size={10} color={F.mute}>·</FMono>
          <FMono size={10} color={F.dim}>{exerciseCount} exercises</FMono>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style}>
      <TileHead label="NEXT SESSION" tag={<FTag tone="mute" size="sm">{day}</FTag>} density={density} />
      <span style={{ fontSize: 18, fontWeight: 400, letterSpacing: -0.3 }}>{name}</span>
      <FMono size={10} color={F.dim}>{time} · {exerciseCount} exercises</FMono>
      {exercises && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{
              padding: '8px 0',
              borderTop: i > 0 ? `1px solid ${F.borderSoft}` : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: F.dim }}>{ex.name}</span>
              <FMono size={10} color={F.mute}>{ex.sets}</FMono>
            </div>
          ))}
        </div>
      )}
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Prep — upcoming meal prep status
// ─────────────────────────────────────────────────────────────────────────────
function PrepTile({ recipes, totalTime, readyPct, nextLabel, density = 'mid', span, style }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>PREP</FLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: 'rgba(255,110,80,0.15)', display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.pan} size={12} color={F.accent} stroke={1.8} />
          </div>
          <FMono size={12} color={F.text}>{recipes.length} recipes</FMono>
        </div>
        <FMono size={9} color={F.mute}>{totalTime}</FMono>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="TONIGHT'S PREP" density={density} />
        <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: -0.3 }}>{recipes.length} recipes</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <FMono size={10} color={F.dim}>{totalTime}</FMono>
          <FMono size={10} color={F.mute}>·</FMono>
          <FMono size={10} color={readyPct >= 100 ? F.green : F.dim}>{readyPct}% ready</FMono>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style}>
      <TileHead label="TONIGHT'S PREP" tag={<FTag tone={readyPct >= 100 ? 'green' : 'accent'} size="sm">{readyPct >= 100 ? 'READY' : 'PREP NEEDED'}</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <FNum size={28} weight={200}>{recipes.length}</FNum>
        <FMono size={12} color={F.mute}>recipes · {totalTime}</FMono>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {recipes.map((r, i) => (
          <div key={i} style={{
            padding: '7px 0',
            borderTop: i > 0 ? `1px solid ${F.borderSoft}` : 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: r.color }} />
              <span style={{ fontSize: 13, color: F.text }}>{r.name}</span>
            </div>
            <FMono size={10} color={F.mute}>{r.portions}p · {r.time}</FMono>
          </div>
        ))}
      </div>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: CheckIn — recent check-in data
// ─────────────────────────────────────────────────────────────────────────────
function CheckInTile({ latest, trend, history, streak, density = 'mid', span, style }) {
  // latest: { weight, bf, date }
  // trend: 'down' | 'up' | 'flat'
  // history: [{ date, weight, bf, delta }]
  const trendIcon = trend === 'down' ? ICONS.trend_dn : trend === 'up' ? ICONS.trend_up : ICONS.minus;
  const trendColor = trend === 'down' ? F.green : trend === 'up' ? F.red : F.dim;

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>LAST CHECK-IN</FLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FNum size={20} weight={200} unit="kg">{latest.weight}</FNum>
          <FIcon path={trendIcon} size={14} color={trendColor} stroke={2} />
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="CHECK-IN" density={density} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <FNum size={22} weight={200} unit="kg">{latest.weight}</FNum>
          </div>
          <FIcon path={trendIcon} size={16} color={trendColor} stroke={2} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <FMono size={10} color={F.dim}>BF {latest.bf}%</FMono>
          <FMono size={10} color={F.mute}>·</FMono>
          <FMono size={10} color={F.dim}>{latest.date}</FMono>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <TileHead label="RECENT CHECK-INS" tag={streak && <FTag tone="accent" size="sm"><FIcon path={ICONS.flame} size={10} color="#1a0f0a" stroke={2} /> {streak}D STREAK</FTag>} density={density} />
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
        <FNum size={28} weight={200} unit="kg">{latest.weight}</FNum>
        <FMono size={12} color={F.dim}>BF {latest.bf}%</FMono>
        <FIcon path={trendIcon} size={16} color={trendColor} stroke={2} />
      </div>
      {history && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: '6px 0',
              borderTop: i > 0 ? `1px solid ${F.borderSoft}` : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <FMono size={10} color={F.mute}>{h.date}</FMono>
              <div style={{ display: 'flex', gap: 12 }}>
                <FMono size={10} color={F.text}>{h.weight} kg</FMono>
                <FMono size={10} color={F.dim}>{h.bf}%</FMono>
                <FMono size={10} color={h.delta < 0 ? F.green : h.delta > 0 ? F.red : F.mute}>
                  {h.delta > 0 ? '+' : ''}{h.delta} kg
                </FMono>
              </div>
            </div>
          ))}
        </div>
      )}
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Fridge — pantry status
// ─────────────────────────────────────────────────────────────────────────────
function FridgeTile({ total, missing, expiring, topMissing, density = 'mid', span, style }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>FRIDGE</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <FNum size={20} weight={200} color={missing > 0 ? F.accent : F.green}>{missing}</FNum>
          <FMono size={9} color={F.mute}>missing</FMono>
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="FRIDGE" density={density} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <FNum size={22} weight={200}>{total}</FNum>
            <FMono size={10} color={F.mute}>items</FMono>
          </div>
          {missing > 0 && <FTag tone="accent" size="sm">{missing} MISSING</FTag>}
        </div>
        {expiring > 0 && (
          <FMono size={10} color={F.red}>{expiring} expiring</FMono>
        )}
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 1} style={style}>
      <TileHead label="PANTRY STATUS" tag={missing > 0 ? <FTag tone="accent" size="sm">{missing} MISSING</FTag> : <FTag tone="green" size="sm">STOCKED</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <FNum size={28} weight={200}>{total}</FNum>
        <FMono size={11} color={F.mute}>items tracked</FMono>
      </div>
      {topMissing && topMissing.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <FLabel size={9} mb={4} mt={4}>NEED TO BUY</FLabel>
          {topMissing.map((item, i) => (
            <div key={i} style={{
              padding: '5px 0',
              borderTop: i > 0 ? `1px solid ${F.borderSoft}` : 'none',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <FMono size={10} color={F.text}>{item.name}</FMono>
              <FMono size={10} color={F.accent}>{item.amount}</FMono>
            </div>
          ))}
        </div>
      )}
      {expiring > 0 && (
        <FMono size={10} color={F.red}>{expiring} items expiring soon</FMono>
      )}
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Streak — consistency tracker
// ─────────────────────────────────────────────────────────────────────────────
function StreakTile({ count, best, density = 'mid', span, style }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FIcon path={ICONS.flame} size={16} color={F.accent} stroke={1.8} />
          <FNum size={20} weight={200}>{count}</FNum>
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="STREAK" density={density} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FIcon path={ICONS.flame} size={20} color={F.accent} stroke={1.8} />
          <FNum size={26} weight={200} unit="days">{count}</FNum>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 1} style={style}>
      <TileHead label="STREAK" density={density} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FIcon path={ICONS.flame} size={24} color={F.accent} stroke={1.8} />
        <FNum size={32} weight={200} unit="days">{count}</FNum>
      </div>
      {best && (
        <FMono size={10} color={F.mute}>BEST · {best} DAYS</FMono>
      )}
      <FTexBar pct={Math.min(100, (count / (best || count)) * 100)} height={6} radius={3} />
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: TDEE — energy model mini-graph
// ─────────────────────────────────────────────────────────────────────────────
function TDEETile({ value, confidence, trend, density = 'mid', span, style }) {
  // Mini sparkline for the TDEE trend
  const points = trend || [2380, 2420, 2350, 2400, 2440, 2410, 2420];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const d = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>TDEE</FLabel>
        <FNum size={20} weight={200} unit="kcal">{value.toLocaleString()}</FNum>
        <svg width="100%" height={16} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <path d={d} fill="none" stroke={F.accent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="TDEE · 7-DAY" density={density} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <FNum size={24} weight={200} unit="kcal">{value.toLocaleString()}</FNum>
          <FTag tone={confidence > 70 ? 'green' : 'mute'} size="sm">{confidence}%</FTag>
        </div>
        <svg width="100%" height={20} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <path d={d} fill="none" stroke={F.accent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style}>
      <TileHead label="TDEE · 7-DAY AVERAGE" tag={<FTag tone="green" size="sm">NARROWING</FTag>} density={density} />
      <FNum size={32} weight={200} unit="kcal">{value.toLocaleString()}</FNum>
      <svg width="100%" height={32} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ marginTop: 4 }}>
        {/* Confidence band */}
        <path d={points.map((p, i) => {
          const x = (i / (points.length - 1)) * w;
          const yLow = h - ((p - min - range * 0.15) / range) * h;
          return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${Math.min(h, yLow).toFixed(1)}`;
        }).join(' ') + points.slice().reverse().map((p, i) => {
          const x = ((points.length - 1 - i) / (points.length - 1)) * w;
          const yHigh = h - ((p - min + range * 0.15) / range) * h;
          return `L${x.toFixed(1)},${Math.max(0, yHigh).toFixed(1)}`;
        }).join(' ') + 'Z'}
        fill={F.accent} fillOpacity="0.08" />
        <path d={d} fill="none" stroke={F.accent} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx={w} cy={h - ((points[points.length - 1] - min) / range) * h} r="3" fill={F.accent} />
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
        <div>
          <FLabel size={9} mb={2}>MODEL CONFIDENCE</FLabel>
          <FTexBar pct={confidence} height={4} radius={2} />
        </div>
      </div>
      <FMono size={10} color={F.mute}>18 DAYS LOGGED · TIGHTENS WITH USE</FMono>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Goal — active contract summary
// ─────────────────────────────────────────────────────────────────────────────
function GoalTile({ current, target, unit, weeks, elapsed, density = 'mid', span, style }) {
  const pct = Math.round(((current - target) / (current + (current - target))) * 100);
  const progressPct = Math.min(100, Math.round((elapsed / weeks) * 100));

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <FLabel size={8} mb={0} letter={1}>GOAL</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <FNum size={18} weight={200}>{current}</FNum>
          <FMono size={10} color={F.accent}>→ {target}</FMono>
          <FMono size={9} color={F.mute}>{unit}</FMono>
        </div>
        <FTexBar pct={progressPct} height={3} radius={2} />
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style}>
        <TileHead label="ACTIVE CONTRACT" density={density} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <FNum size={22} weight={200}>{current}</FNum>
          <FMono size={12} color={F.accent}>→</FMono>
          <FNum size={22} weight={200} color={F.accent}>{target}</FNum>
          <FMono size={10} color={F.mute}>{unit}</FMono>
        </div>
        <FTexBar pct={progressPct} height={5} radius={3} />
        <FMono size={10} color={F.mute}>WEEK {elapsed} / {weeks}</FMono>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style}>
      <TileHead label="ACTIVE CONTRACT" tag={<FTag tone="accent" size="sm">WEEK {elapsed}</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <FNum size={32} weight={200}>{current}</FNum>
        <FMono size={14} color={F.accent}>→</FMono>
        <FNum size={32} weight={200} color={F.accent}>{target}</FNum>
        <FMono size={12} color={F.mute}>% body fat</FMono>
      </div>
      <FTexBar pct={progressPct} height={8} radius={4} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FMono size={10} color={F.dim}>{progressPct}% elapsed</FMono>
        <FMono size={10} color={F.mute}>{weeks - elapsed} weeks remaining</FMono>
      </div>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Export all
// ─────────────────────────────────────────────────────────────────────────────
Object.assign(window, {
  FTileGrid, FTile,
  MetricTile, ProgressTile, MacroTile, CalendarTile,
  SessionTile, PrepTile, CheckInTile, FridgeTile,
  StreakTile, TDEETile, GoalTile,
  TILE_PAD, TILE_RAD, TILE_GAP,
});