/* Aurevion Domain Primitives — Fitness-specific components */

import { useState, memo } from 'react'
import { Color, Font, Space, Radius, Shadow, Type } from '../ui/tokens'

function merge(...objs) { return Object.assign({}, ...objs) }

/* ── MACRO BLOCK ──
   The protein/carbs/fat trio from Info-Blocks.png.
   Shows a labeled metric with an accent-colored bottom bar. */

export function MacroBlock({ label, value, unit = 'g', color = Color.accent, style }) {
  return (
    <div style={merge({
      background: Color.surface, borderRadius: Radius.lg, padding: `${Space[3]}px ${Space[4]}px`,
      border: `1px solid ${Color.borderSoft}`, display: 'flex', flexDirection: 'column', gap: 4,
      position: 'relative', overflow: 'hidden', minWidth: 90, flex: 1,
    }, style)}>
      <span style={merge(Type.labelSm, { color })}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontFamily: Font.mono, fontSize: 32, fontWeight: 200, letterSpacing: -1, lineHeight: 1, color: Color.text }}>{value}</span>
        <span style={merge(Type.dataSm, { color: Color.mute })}>{unit}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: color }} />
    </div>
  )
}

/* ── MACRO ROW ──
   Convenience wrapper that renders a row of MacroBlocks. */

export function MacroRow({ protein, carbs, fat, style }) {
  return (
    <div style={merge({ display: 'flex', gap: Space[2] }, style)}>
      <MacroBlock label="PROTEIN" value={protein} color={Color.accent} />
      <MacroBlock label="CARBS" value={carbs} color={Color.blue} />
      <MacroBlock label="FAT" value={fat} color={Color.dim} />
    </div>
  )
}

/* ── SHOPPING ROW ──
   Need/have ingredient tracker from Shopping List.png.
   Shows ingredient name, need/have counts, and a +add button. */

export const ShoppingRow = memo(function ShoppingRow({ name, need, have, addLabel, onAdd, category, disabled = false, style }) {
  const [hovered, setHovered] = useState(false)
  const fulfilled = have >= need

  return (
    <div style={merge({
      display: 'flex', alignItems: 'center', gap: Space[3],
      padding: `${Space[3]}px 0`,
      borderBottom: `1px solid ${Color.borderSoft}`,
      opacity: disabled ? 0.35 : 1,
    }, style)}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={merge(Type.bodyMd, { color: fulfilled ? Color.mute : Color.text }, fulfilled && { textDecoration: 'line-through' })}>{name}</div>
        <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 2 })}>
          NEED {need} · HAVE {have}
        </div>
      </div>
      {onAdd && !fulfilled && (
        <button
          onClick={disabled ? undefined : onAdd}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          style={{
            background: hovered ? 'rgba(255,110,80,0.15)' : 'transparent',
            border: 'none', cursor: disabled ? 'default' : 'pointer',
            color: Color.accent, fontFamily: Font.mono, fontSize: 12,
            fontWeight: 600, letterSpacing: 0.5, padding: `${Space[1]}px ${Space[2]}px`,
            borderRadius: Radius.sm, whiteSpace: 'nowrap',
            transition: 'background 0.15s ease',
          }}
        >
          {addLabel || `+${need - have}`}
        </button>
      )}
    </div>
  )
})

/* ── SET TRACKER ──
   Exercise set blocks from Selector.png.
   Shows segmented set progress with complete/skip CTAs. */

export function SetTracker({ exercise, category, prescription, sets = [], currentSet = 0, detail, onComplete, onSkip, style }) {
  return (
    <div style={merge({ display: 'flex', flexDirection: 'column', gap: Space[4] }, style)}>
      {/* Exercise header */}
      <div>
        <div style={merge(Type.headingMd, { color: Color.text })}>{exercise}</div>
        {category && <div style={merge(Type.labelSm, { color: Color.mute, marginTop: 4 })}>{category} · {prescription}</div>}
      </div>

      {/* Detail line */}
      {detail && <div style={merge(Type.dataSm, { color: Color.mute })}>{detail}</div>}

      {/* Set blocks */}
      {sets.length > 0 && (
        <div>
          <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: Space[2] })}>SETS</div>
          <div style={{ display: 'flex', gap: Space[2], alignItems: 'flex-end' }}>
            {sets.map((set, i) => {
              const isDone = i < currentSet
              const isActive = i === currentSet
              const bg = isDone ? Color.accentDim : isActive ? Color.accent : 'rgba(255,255,255,0.06)'
              const fg = isDone ? Color.accent : isActive ? '#1a0f0a' : Color.mute
              return (
                <div key={i} style={{
                  width: 56, height: isActive ? 56 : 48,
                  borderRadius: Radius.md, background: bg, color: fg,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontFamily: Font.mono, gap: 2,
                  transition: 'height 0.2s ease, background 0.15s ease',
                }}>
                  <span style={{ fontSize: isActive ? 20 : 16, fontWeight: isActive ? 600 : 400 }}>{set.reps}</span>
                  {set.weight && <span style={{ fontSize: 10, letterSpacing: 0.5, opacity: 0.8 }}>{set.weight}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CTAs */}
      {(onComplete || onSkip) && (
        <div style={{ display: 'flex', gap: Space[3], marginTop: Space[2] }}>
          {onComplete && (
            <button onClick={onComplete} style={{
              height: 48, padding: `0 ${Space[5]}px`, borderRadius: Radius.md,
              background: Color.accent, color: '#1a0f0a', border: 'none',
              fontFamily: Font.mono, fontSize: 12, fontWeight: 600,
              letterSpacing: 1.2, textTransform: 'uppercase',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: Space[2],
            }}>
              COMPLETE SET
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </button>
          )}
          {onSkip && (
            <button onClick={onSkip} style={{
              height: 48, padding: `0 ${Space[4]}px`, borderRadius: Radius.md,
              background: 'transparent', color: Color.mute, border: 'none',
              fontFamily: Font.mono, fontSize: 12, fontWeight: 500,
              letterSpacing: 1.2, textTransform: 'uppercase', cursor: 'pointer',
            }}>
              SKIP
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── RECIPE CARD ──
   Meal plan card from Meal Plan.png.
   Shows recipe with tag, macros, time, and ingredient chips. */

const RECIPE_TAG_COLORS = {
  'fresh prep': { bg: 'rgba(74,222,128,0.12)', fg: Color.green },
  'batch cook': { bg: Color.accentDim, fg: Color.accent },
  'slow cook': { bg: 'rgba(96,165,250,0.12)', fg: Color.blue },
}

export function RecipeCard({ tag, name, portions, estTime, macros, ingredients = [], style }) {
  const tagStyle = RECIPE_TAG_COLORS[tag?.toLowerCase()] || RECIPE_TAG_COLORS['fresh prep']

  return (
    <div style={merge({
      background: Color.surface, borderRadius: Radius.xl, padding: Space[5],
      border: `1px solid ${Color.borderSoft}`,
      display: 'flex', flexDirection: 'column', gap: Space[3],
    }, style)}>
      {/* Tag + portions row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {tag && (
          <span style={merge(Type.labelSm, {
            display: 'inline-block', padding: '3px 8px', borderRadius: Radius.sm,
            background: tagStyle.bg, color: tagStyle.fg, fontWeight: 600,
          })}>{tag.toUpperCase()}</span>
        )}
        {portions && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: Font.mono, fontSize: 24, fontWeight: 200, color: Color.text }}>{portions}</span>
            <span style={merge(Type.labelSm, { color: Color.mute, marginLeft: 4 })}>x</span>
            <div style={merge(Type.labelSm, { color: Color.mute })}>PORTIONS</div>
          </div>
        )}
      </div>

      {/* Name */}
      <div style={merge(Type.headingLg, { color: Color.text })}>{name}</div>

      {/* Macros + time row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {macros && (
          <div style={merge(Type.dataSm, { color: Color.mute, display: 'flex', gap: Space[3] })}>
            <span><span style={{ color: Color.accent }}>P</span> {macros.p}g</span>
            <span><span style={{ color: Color.blue }}>C</span> {macros.c}g</span>
            <span><span style={{ color: Color.dim }}>F</span> {macros.f}g</span>
          </div>
        )}
        {estTime && (
          <div style={{ textAlign: 'right' }}>
            <div style={merge(Type.labelSm, { color: Color.mute })}>EST. TIME</div>
            <div style={merge(Type.dataMd, { color: Color.text })}>{estTime}</div>
          </div>
        )}
      </div>

      {/* Ingredient chips */}
      {ingredients.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: Space[2], marginTop: Space[1] }}>
          {ingredients.map((ing, i) => (
            <span key={i} style={{
              padding: `${Space[1]}px ${Space[3]}px`,
              borderRadius: Radius.md, background: Color.surface2,
              border: `1px solid ${Color.borderSoft}`,
              fontFamily: Font.sans, fontSize: 13, color: Color.dim,
            }}>{ing}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── INFO ROW ──
   Horizontal KPI metric row from Info Section.png.
   Label + large value + unit, with optional trailing tag. */

export function InfoRow({ label, value, unit, tag, tagTone = 'accent', style }) {
  return (
    <div style={merge({
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${Space[5]}px 0`,
      borderBottom: `1px solid ${Color.borderSoft}`,
    }, style)}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={merge(Type.labelMd, { color: Color.mute })}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: Font.mono, fontSize: 32, fontWeight: 200, letterSpacing: -1, lineHeight: 1, color: Color.text }}>{value}</span>
          {unit && <span style={merge(Type.labelSm, { color: Color.mute })}>{unit}</span>}
        </div>
      </div>
      {tag && (
        <span style={{
          padding: '4px 10px', borderRadius: Radius.full,
          background: tagTone === 'accent' ? Color.accentDim : tagTone === 'green' ? Color.greenDim : 'rgba(255,255,255,0.06)',
          color: tagTone === 'accent' ? Color.accent : tagTone === 'green' ? Color.green : Color.dim,
          fontFamily: Font.mono, fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}>{tag}</span>
      )}
    </div>
  )
}

/* ── COOK STATUS ──
   Active cooking state from Status.png.
   Pulsing dot, recipe context, step instruction, timer + progress. */

export function CookStatus({ recipe, step, totalTime, remaining, mode = 'PASSIVE', style }) {
  return (
    <div style={merge({
      background: Color.surface, borderRadius: Radius.xl, padding: Space[5],
      border: `1px solid ${Color.borderSoft}`,
      display: 'flex', flexDirection: 'column', gap: Space[3],
    }, style)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: Space[2] }}>
        <div style={{ width: 8, height: 8, borderRadius: Radius.full, background: Color.accent, animation: 'aurevion-pulse 2s ease-in-out infinite', flexShrink: 0 }} />
        <span style={merge(Type.labelSm, { color: Color.accent })}>FOCUSED NOW</span>
        <span style={merge(Type.labelSm, { color: Color.mute })}>· {recipe}</span>
      </div>
      <div style={merge(Type.headingLg, { color: Color.text, lineHeight: 1.3 })}>{step}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={merge(Type.labelSm, { color: Color.mute })}>{totalTime} TOTAL · {mode}</span>
        <span style={merge(Type.labelSm, { color: Color.accent })}>{remaining} REMAINING</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 2, background: Color.accent, width: '35%', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

/* ── MEAL LIST ITEM ──
   Meal card with letter badge from List-Item.png.
   Badge (A/B/C/D) + name + time + macro breakdown + optional BATCH tag. */

const BADGE_COLORS = [Color.accent, Color.blue, Color.green, '#a78bfa', Color.red]

export function MealListItem({ badge, name, time, day, kcal, macros, batch = false, style }) {
  const badgeColor = BADGE_COLORS[(badge || 'A').toUpperCase().charCodeAt(0) - 65] || Color.accent
  return (
    <div style={merge({
      background: Color.surface, borderRadius: Radius.xl, padding: Space[4],
      border: `1px solid ${Color.borderSoft}`,
      display: 'flex', gap: Space[3], alignItems: 'flex-start',
    }, style)}>
      <div style={{
        width: 36, height: 36, borderRadius: Radius.md,
        background: `${badgeColor}22`, color: badgeColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: Font.mono, fontSize: 14, fontWeight: 600, flexShrink: 0,
      }}>{badge}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: Space[2] }}>
          <span style={merge(Type.headingSm, { color: Color.text })}>{name}</span>
          {batch && (
            <span style={{
              padding: '2px 8px', borderRadius: Radius.full,
              background: Color.accentDim, color: Color.accent,
              fontFamily: Font.mono, fontSize: 9, fontWeight: 600, letterSpacing: 0.8,
              textTransform: 'uppercase', flexShrink: 0,
            }}>BATCH</span>
          )}
        </div>
        <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 2 })}>{time} · {day}</div>
        <div style={merge(Type.dataSm, { color: Color.dim, marginTop: 6, display: 'flex', gap: Space[3] })}>
          <span style={{ fontWeight: 600 }}>{kcal} kcal</span>
          {macros && <>
            <span>P {macros.p}g</span>
            <span>C {macros.c}g</span>
            <span>F {macros.f}g</span>
          </>}
        </div>
      </div>
    </div>
  )
}

/* ── UP NEXT CARD ──
   Task preview card from Task.png.
   "UP NEXT · time" + label + play button. */

export function UpNextCard({ time, label, onStart, style }) {
  return (
    <div style={merge({
      background: Color.surface, borderRadius: Radius.xl, padding: Space[4],
      border: `1px solid ${Color.borderSoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: Space[3],
    }, style)}>
      <div style={{ minWidth: 0 }}>
        <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 4 })}>UP NEXT · {time}</div>
        <div style={merge(Type.headingSm, { color: Color.text })}>{label}</div>
      </div>
      {onStart && (
        <button onClick={onStart} style={{
          width: 44, height: 44, borderRadius: Radius.full,
          background: Color.accent, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: `0 4px 16px ${Color.accentDim}`,
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="#1a0f0a" stroke="none"><polygon points="6,4 20,12 6,20" /></svg>
        </button>
      )}
    </div>
  )
}

/* ── WEEK PLAN SUMMARY ──
   Week overview from Week-Meal.png + Cal-Week.png.
   Title, meal count, batch count, and 7-day strip with per-day meal counts. */

export function WeekPlanSummary({ meals = 14, batches = 3, days = [], style }) {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div style={merge({ display: 'flex', flexDirection: 'column', gap: Space[3] }, style)}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={merge(Type.labelMd, { color: Color.mute, marginBottom: 4 })}>THIS WEEK'S PLAN</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: Font.mono, fontSize: 32, fontWeight: 200, letterSpacing: -1, color: Color.text }}>{meals}</span>
            <span style={merge(Type.labelSm, { color: Color.mute })}>meals</span>
          </div>
        </div>
        <span style={merge(Type.labelMd, { color: Color.mute })}>{batches} BATCHES</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {dayLabels.map((d, i) => {
          const count = days[i] ?? 0
          const hasMeals = count > 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={merge(Type.labelSm, { color: Color.mute })}>{d}</span>
              <div style={{
                width: '100%', height: 40, borderRadius: Radius.sm,
                background: hasMeals ? Color.accent : 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: Font.mono, fontSize: 13, fontWeight: 600,
                  color: hasMeals ? '#1a0f0a' : Color.faint,
                }}>{hasMeals ? count : '–'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── EXERCISE TIMELINE ──
   Vertical exercise rail from Selector.png / Training screen.
   Ring indicators (done/active/idle) + exercise name + subtitle + expandable active content. */

const RING_STYLES = {
  done: { bg: Color.accent, border: Color.accent, icon: true },
  active: { bg: 'transparent', border: Color.accent, pulse: true },
  idle: { bg: 'transparent', border: 'rgba(255,110,80,0.25)' },
}

export function ExerciseTimeline({ exercises = [], renderActive, style }) {
  return (
    <div style={merge({ display: 'flex', flexDirection: 'column' }, style)}>
      {exercises.map((ex, i) => {
        const rs = RING_STYLES[ex.state] || RING_STYLES.idle
        const done = ex.state === 'done'
        const active = ex.state === 'active'
        return (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: `${Space[5]}px 0`,
            borderTop: i === 0 ? 'none' : `1px solid ${Color.borderSoft}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: Radius.full, marginTop: 2, flexShrink: 0,
              background: rs.bg, border: `1.5px solid ${rs.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {rs.icon && (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#1a0f0a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              )}
              {rs.pulse && (
                <div style={{ width: 9, height: 9, borderRadius: Radius.full, background: Color.accent, animation: 'aurevion-pulse 1.6s infinite' }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 18, fontWeight: 300, letterSpacing: -0.3,
                color: done ? Color.dim : Color.text,
              }}>{ex.name}</div>
              <div style={merge(Type.labelSm, { color: Color.mute, marginTop: 2 })}>{ex.subtitle}</div>
              {active && renderActive && (
                <div style={{ marginTop: Space[4] }}>{renderActive(ex, i)}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
