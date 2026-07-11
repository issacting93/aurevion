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

import { Color, Space, Radius } from '../../ui/tokens'
import { ICONS, FLabel, FMono, FNum, FTexBar, FIcon, FTag } from '../../ui/components'
import { MOCK_TDEE } from '../../context/mockUser'

const TILE_PAD = { full: Space[4], mid: 14, compact: 10 };
const TILE_RAD = { full: 14, mid: Space[3], compact: 10 };
const TILE_GAP = 10;

// ─── FTileGrid ───────────────────────────────────────────
// 2-column container. Tiles declare their own span.
export function FTileGrid({ children, padding = 16 }) {
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
export function FTile({ children, density = 'mid', span = 1, style = {}, onClick }) {
  const pad = TILE_PAD[density];
  const rad = TILE_RAD[density];
  return (
    <div
      onClick={onClick}
      style={{
        gridColumn: span === 2 ? '1 / -1' : 'auto',
        background: Color.surface,
        border: `1px solid ${Color.borderSoft}`,
        borderRadius: rad,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        gap: density === 'compact' ? Space[1] : density === 'mid' ? Space[2] : 10,
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
// TILE: Macros — P / C / F breakdown
// ─────────────────────────────────────────────────────────────────────────────
export function MacroTile({ kcal, protein, carbs, fat, deficit, density = 'mid', span, style, onClick }) {
  const macros = [
    { label: 'PROT', value: protein, color: Color.accent, pct: (protein * 4 / kcal * 100) },
    { label: 'CARB', value: carbs, color: Color.dim, pct: (carbs * 4 / kcal * 100) },
    { label: 'FAT', value: fat, color: Color.mute, pct: (fat * 9 / kcal * 100) },
  ];

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
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
      <FTile density={density} span={span || 2} style={style} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <FLabel size={10} mb={0} letter={1}>DAILY</FLabel>
            <FNum size={24} weight={200} unit="kcal">{kcal.toLocaleString()}</FNum>
          </div>
          {deficit && <FMono size={10} color={Color.accent}>{deficit}</FMono>}
        </div>
        <div style={{ display: 'flex', gap: Space[4] }}>
          {macros.map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
              <FMono size={10} color={Color.mute}>{m.label}</FMono>
              <FMono size={13} color={Color.text}>{m.value}g</FMono>
            </div>
          ))}
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <TileHead label="TARGETS FOR THIS WEEK" tag={deficit && <FTag tone="accent" size="sm">{deficit}</FTag>} density={density} />
      <FNum size={36} weight={200} unit="kcal">{kcal.toLocaleString()}</FNum>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: Space[2] }}>
        {macros.map(m => (
          <div key={m.label} style={{
            padding: '10px 12px', borderRadius: 10,
            background: Color.bg, border: `1px solid ${m.label === 'PROT' ? 'rgba(255,110,80,0.2)' : Color.borderSoft}`,
          }}>
            <FLabel size={10} mb={4} color={m.label === 'PROT' ? Color.accent : Color.mute}>{m.label}</FLabel>
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
export function CalendarTile({ days, density = 'mid', span, style, onClick }) {
  // days: [{ label, done, type, today }] — 7 entries
  const COLORS = { train: Color.blue, meal: Color.accent, checkin: Color.green, rest: Color.faint };

  if (density === 'compact') {
    const done = days.filter(d => d.done).length;
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <FLabel size={8} mb={0} letter={1}>THIS WEEK</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
          <FNum size={20} weight={200}>{done}</FNum>
          <FMono size={11} color={Color.mute}>/ {days.length}</FMono>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: d.done ? COLORS[d.type] || Color.accent : 'rgba(255,255,255,0.06)',
            }} />
          ))}
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 2} style={style} onClick={onClick}>
        <TileHead label="THIS WEEK" density={density} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: Space[1] }}>
          {days.map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <FMono size={10} color={d.today ? Color.accent : Color.mute}>{d.label}</FMono>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 6, marginTop: 4,
                background: d.done ? COLORS[d.type] || Color.accent : 'rgba(255,255,255,0.04)',
                border: d.today ? `1px solid ${Color.accent}` : `1px solid ${Color.borderSoft}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: d.done ? 1 : 0.5,
              }}>
                {d.done && <FIcon path={ICONS.check} size={12} color={d.type === 'train' ? '#fff' : Color.accentText} stroke={2.4} />}
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
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <TileHead label="THIS WEEK · PLAN HEALTH" tag={<FTag tone="green" size="sm">ON TRACK</FTag>} density={density} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
        <FNum size={28} weight={200}>{done}</FNum>
        <FMono size={13} color={Color.mute}>/ {days.length} completed</FMono>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: Space[1] }}>
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <FMono size={10} color={d.today ? Color.accent : Color.mute}>{d.label}</FMono>
            <div style={{
              width: '100%', aspectRatio: '1', borderRadius: Radius.md, marginTop: 4,
              background: d.done
                ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.18) 0 1.5px, transparent 1.5px 5px), ${COLORS[d.type] || Color.accent}`
                : 'rgba(255,255,255,0.03)',
              border: d.today ? `1.5px solid ${Color.accent}` : `1px solid ${Color.borderSoft}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 2, padding: 2,
            }}>
              {d.done && <FIcon path={ICONS.check} size={14} color={d.type === 'train' ? '#fff' : Color.accentText} stroke={2.4} />}
              {!d.done && d.type && (
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS[d.type], opacity: 0.5 }} />
              )}
            </div>
            {d.eventLabel && density === 'full' && (
              <FMono size={8} color={Color.mute}>{d.eventLabel}</FMono>
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
export function SessionTile({ name, time, exercises, exerciseCount, day, density = 'mid', span, style, onClick }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <FLabel size={8} mb={0} letter={1}>NEXT SESSION</FLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: 'rgba(94,170,255,0.15)', display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.dumb} size={12} color={Color.blue} stroke={1.8} />
          </div>
          <FMono size={12} color={Color.text}>{name}</FMono>
        </div>
        <FMono size={10} color={Color.mute}>{time}</FMono>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="NEXT SESSION" density={density} />
        <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: -0.3 }}>{name}</span>
        <div style={{ display: 'flex', gap: Space[2], alignItems: 'center' }}>
          <FMono size={10} color={Color.dim}>{day}</FMono>
          <FMono size={10} color={Color.mute}>·</FMono>
          <FMono size={10} color={Color.dim}>{time}</FMono>
          <FMono size={10} color={Color.mute}>·</FMono>
          <FMono size={10} color={Color.dim}>{exerciseCount} exercises</FMono>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <TileHead label="NEXT SESSION" tag={<FTag tone="mute" size="sm">{day}</FTag>} density={density} />
      <span style={{ fontSize: 18, fontWeight: 400, letterSpacing: -0.3 }}>{name}</span>
      <FMono size={10} color={Color.dim}>{time} · {exerciseCount} exercises</FMono>
      {exercises && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{
              padding: '8px 0',
              borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: Color.dim }}>{ex.name}</span>
              <FMono size={10} color={Color.mute}>{ex.sets}</FMono>
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
export function PrepTile({ recipes, totalTime, readyPct, nextLabel, density = 'mid', span, style, onClick }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <FLabel size={8} mb={0} letter={1}>PREP</FLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: Color.accentDim, display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.pan} size={12} color={Color.accent} stroke={1.8} />
          </div>
          <FMono size={12} color={Color.text}>{recipes.length} recipes</FMono>
        </div>
        <FMono size={10} color={Color.mute}>{totalTime}</FMono>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="TONIGHT'S PREP" density={density} />
        <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: -0.3 }}>{recipes.length} recipes</span>
        <div style={{ display: 'flex', gap: Space[2], alignItems: 'center' }}>
          <FMono size={10} color={Color.dim}>{totalTime}</FMono>
          <FMono size={10} color={Color.mute}>·</FMono>
          <FMono size={10} color={readyPct >= 100 ? Color.green : Color.dim}>{readyPct}% ready</FMono>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <TileHead label="TONIGHT'S PREP" tag={<FTag tone={readyPct >= 100 ? 'green' : 'accent'} size="sm">{readyPct >= 100 ? 'READY' : 'PREP NEEDED'}</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <FNum size={28} weight={200}>{recipes.length}</FNum>
        <FMono size={12} color={Color.mute}>recipes · {totalTime}</FMono>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {recipes.map((r, i) => (
          <div key={i} style={{
            padding: '7px 0',
            borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Space[2] }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: r.color }} />
              <span style={{ fontSize: 13, color: Color.text }}>{r.name}</span>
            </div>
            <FMono size={10} color={Color.mute}>{r.portions}p · {r.time}</FMono>
          </div>
        ))}
      </div>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: CheckIn — recent check-in data
// ─────────────────────────────────────────────────────────────────────────────
export function CheckInTile({ latest, trend, history, streak, density = 'mid', span, style, onClick }) {
  // latest: { weight, bf, date }
  // trend: 'down' | 'up' | 'flat'
  // history: [{ date, weight, bf, delta }]
  const trendIcon = trend === 'down' ? ICONS.trend_dn : trend === 'up' ? ICONS.trend_up : ICONS.minus;
  const trendColor = trend === 'down' ? Color.green : trend === 'up' ? Color.red : Color.dim;

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
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
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="CHECK-IN" density={density} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <FNum size={22} weight={200} unit="kg">{latest.weight}</FNum>
          </div>
          <FIcon path={trendIcon} size={16} color={trendColor} stroke={2} />
        </div>
        <div style={{ display: 'flex', gap: Space[2] }}>
          <FMono size={10} color={Color.dim}>BF {latest.bf}%</FMono>
          <FMono size={10} color={Color.mute}>·</FMono>
          <FMono size={10} color={Color.dim}>{latest.date}</FMono>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <TileHead label="RECENT CHECK-INS" tag={streak && <FTag tone="accent" size="sm"><FIcon path={ICONS.flame} size={10} color={Color.accentText} stroke={2} /> {streak}D STREAK</FTag>} density={density} />
      </div>
      <div style={{ display: 'flex', gap: Space[4], alignItems: 'baseline' }}>
        <FNum size={28} weight={200} unit="kg">{latest.weight}</FNum>
        <FMono size={12} color={Color.dim}>BF {latest.bf}%</FMono>
        <FIcon path={trendIcon} size={16} color={trendColor} stroke={2} />
      </div>
      {history && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: '6px 0',
              borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <FMono size={10} color={Color.mute}>{h.date}</FMono>
              <div style={{ display: 'flex', gap: Space[3] }}>
                <FMono size={10} color={Color.text}>{h.weight} kg</FMono>
                <FMono size={10} color={Color.dim}>{h.bf}%</FMono>
                <FMono size={10} color={h.delta < 0 ? Color.green : h.delta > 0 ? Color.red : Color.mute}>
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
export function FridgeTile({ total, missing, expiring, topMissing, density = 'mid', span, style, onClick }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <FLabel size={8} mb={0} letter={1}>FRIDGE</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
          <FNum size={20} weight={200} color={missing > 0 ? Color.accent : Color.green}>{missing}</FNum>
          <FMono size={10} color={Color.mute}>missing</FMono>
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="FRIDGE" density={density} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
            <FNum size={22} weight={200}>{total}</FNum>
            <FMono size={10} color={Color.mute}>items</FMono>
          </div>
          {missing > 0 && <FTag tone="accent" size="sm">{missing} MISSING</FTag>}
        </div>
        {expiring > 0 && (
          <FMono size={10} color={Color.red}>{expiring} expiring</FMono>
        )}
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 1} style={style} onClick={onClick}>
      <TileHead label="PANTRY STATUS" tag={missing > 0 ? <FTag tone="accent" size="sm">{missing} MISSING</FTag> : <FTag tone="green" size="sm">STOCKED</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
        <FNum size={28} weight={200}>{total}</FNum>
        <FMono size={11} color={Color.mute}>items tracked</FMono>
      </div>
      {topMissing && topMissing.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <FLabel size={10} mb={4} mt={4}>NEED TO BUY</FLabel>
          {topMissing.map((item, i) => (
            <div key={i} style={{
              padding: '5px 0',
              borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <FMono size={10} color={Color.text}>{item.name}</FMono>
              <FMono size={10} color={Color.accent}>{item.amount}</FMono>
            </div>
          ))}
        </div>
      )}
      {expiring > 0 && (
        <FMono size={10} color={Color.red}>{expiring} items expiring soon</FMono>
      )}
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Streak — consistency tracker
// ─────────────────────────────────────────────────────────────────────────────
export function StreakTile({ count, best, density = 'mid', span, style, onClick }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FIcon path={ICONS.flame} size={16} color={Color.accent} stroke={1.8} />
          <FNum size={20} weight={200}>{count}</FNum>
        </div>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="STREAK" density={density} />
        <div style={{ display: 'flex', alignItems: 'center', gap: Space[2] }}>
          <FIcon path={ICONS.flame} size={20} color={Color.accent} stroke={1.8} />
          <FNum size={26} weight={200} unit="days">{count}</FNum>
        </div>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 1} style={style} onClick={onClick}>
      <TileHead label="STREAK" density={density} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FIcon path={ICONS.flame} size={24} color={Color.accent} stroke={1.8} />
        <FNum size={32} weight={200} unit="days">{count}</FNum>
      </div>
      {best && (
        <FMono size={10} color={Color.mute}>BEST · {best} DAYS</FMono>
      )}
      <FTexBar pct={Math.min(100, (count / (best || count)) * 100)} height={6} radius={3} />
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: TDEE — energy model mini-graph
// ─────────────────────────────────────────────────────────────────────────────
export function TDEETile({ value, confidence, trend, density = 'mid', span, style, onClick }) {
  // Mini sparkline for the TDEE trend
  const points = trend || MOCK_TDEE.trend7d;
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
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <FLabel size={8} mb={0} letter={1}>TDEE</FLabel>
        <FNum size={20} weight={200} unit="kcal">{value.toLocaleString()}</FNum>
        <svg width="100%" height={16} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <path d={d} fill="none" stroke={Color.accent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="TDEE · 7-DAY" density={density} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <FNum size={24} weight={200} unit="kcal">{value.toLocaleString()}</FNum>
          <FTag tone={confidence > 70 ? 'green' : 'mute'} size="sm">{confidence}%</FTag>
        </div>
        <svg width="100%" height={20} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <path d={d} fill="none" stroke={Color.accent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
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
        fill={Color.accent} fillOpacity="0.08" />
        <path d={d} fill="none" stroke={Color.accent} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx={w} cy={h - ((points[points.length - 1] - min) / range) * h} r="3" fill={Color.accent} />
      </svg>
      <div style={{ display: 'flex', gap: Space[4], marginTop: 4 }}>
        <div>
          <FLabel size={10} mb={2}>MODEL CONFIDENCE</FLabel>
          <FTexBar pct={confidence} height={4} radius={2} />
        </div>
      </div>
      <FMono size={10} color={Color.mute}>18 DAYS LOGGED · TIGHTENS WITH USE</FMono>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Goal — active contract summary
// ─────────────────────────────────────────────────────────────────────────────
export function GoalTile({ current, target, unit, weeks, elapsed, density = 'mid', span, style, onClick }) {
  const pct = Math.round(((current - target) / (current + (current - target))) * 100);
  const progressPct = Math.min(100, Math.round((elapsed / weeks) * 100));

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <FLabel size={8} mb={0} letter={1}>GOAL</FLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
          <FNum size={18} weight={200}>{current}</FNum>
          <FMono size={10} color={Color.accent}>→ {target}</FMono>
          <FMono size={10} color={Color.mute}>{unit}</FMono>
        </div>
        <FTexBar pct={progressPct} height={3} radius={2} />
      </FTile>
    );
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="ACTIVE CONTRACT" density={density} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[1] }}>
          <FNum size={22} weight={200}>{current}</FNum>
          <FMono size={12} color={Color.accent}>→</FMono>
          <FNum size={22} weight={200} color={Color.accent}>{target}</FNum>
          <FMono size={10} color={Color.mute}>{unit}</FMono>
        </div>
        <FTexBar pct={progressPct} height={5} radius={3} />
        <FMono size={10} color={Color.mute}>WEEK {elapsed} / {weeks}</FMono>
      </FTile>
    );
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <TileHead label="ACTIVE CONTRACT" tag={<FTag tone="accent" size="sm">WEEK {elapsed}</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <FNum size={32} weight={200}>{current}</FNum>
        <FMono size={14} color={Color.accent}>→</FMono>
        <FNum size={32} weight={200} color={Color.accent}>{target}</FNum>
        <FMono size={12} color={Color.mute}>% body fat</FMono>
      </div>
      <FTexBar pct={progressPct} height={8} radius={4} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FMono size={10} color={Color.dim}>{progressPct}% elapsed</FMono>
        <FMono size={10} color={Color.mute}>{weeks - elapsed} weeks remaining</FMono>
      </div>
    </FTile>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TILE: Water — hydration progress
// ─────────────────────────────────────────────────────────────────────────────
export function WaterTile({ current = 0, target = 2500, trend7d = [], density = 'mid', span, style, onClick }) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  const DROP = 'M12 2c0 0-7 8.5-7 12.5a7 7 0 0014 0C19 10.5 12 2 12 2z'

  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FIcon path={DROP} size={14} color={Color.blue} stroke={1.5} />
          <FNum size={18} weight={200}>{current}</FNum>
          <FMono size={10} color={Color.mute}>/ {target} ml</FMono>
        </div>
        <FTexBar pct={pct} height={3} radius={2} color={Color.blue} />
      </FTile>
    )
  }

  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="HYDRATION" density={density} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <FIcon path={DROP} size={16} color={Color.blue} stroke={1.5} />
          <FNum size={22} weight={200}>{current.toLocaleString()}</FNum>
          <FMono size={10} color={Color.mute}>/ {target.toLocaleString()} ml</FMono>
        </div>
        <FTexBar pct={pct} height={5} radius={3} color={Color.blue} />
        {trend7d.length > 0 && (
          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 20, marginTop: 6 }}>
            {trend7d.slice(-7).map((v, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: 1.5,
                height: `${Math.max(15, (v / target) * 100)}%`,
                background: v >= target ? Color.blue : `${Color.blue}40`,
              }} />
            ))}
          </div>
        )}
      </FTile>
    )
  }

  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <TileHead label="HYDRATION" tag={<FTag tone="neutral" size="sm">{pct}%</FTag>} density={density} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <FIcon path={DROP} size={20} color={Color.blue} stroke={1.5} />
        <FNum size={32} weight={200}>{current.toLocaleString()}</FNum>
        <FMono size={12} color={Color.mute}>/ {target.toLocaleString()} ml</FMono>
      </div>
      <FTexBar pct={pct} height={8} radius={4} color={Color.blue} />
      {trend7d.length > 0 && (
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 32, marginTop: 8 }}>
          {trend7d.slice(-7).map((v, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 2,
              height: `${Math.max(15, (v / target) * 100)}%`,
              background: v >= target ? Color.blue : `${Color.blue}40`,
            }} />
          ))}
        </div>
      )}
    </FTile>
  )
}

export { TILE_PAD, TILE_RAD, TILE_GAP };
