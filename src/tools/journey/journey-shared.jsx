/* Journey Shared Components — PhoneFrame, FlowArrow, MissingFrame, etc.
   Used across all journey sub-pages. */

import { Fragment } from 'react'
import { Color, Font, Radius } from '../../ui/tokens'
import { FIcon, ICONS, FLabel, FMono, FTag, FTexBar } from '../../ui/components'
import { PW, PH, FW, FH, SCALE, COMPACT_FW, COMPACT_FH, COMPACT_SCALE, DATA_MODELS } from './journey-data'
import { getScreenLens } from './goal-lens'

/* ── Phone frame ── */

export function PhoneFrame({ children, scale = SCALE, frameWidth = FW, frameHeight = FH }) {
  return (
    <div style={{
      flexShrink: 0, width: frameWidth, height: frameHeight,
      overflow: 'hidden', borderRadius: 56 * scale, background: Color.bg,
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: PW, height: PH,
      }}>
        {children}
      </div>
    </div>
  )
}

/* ── Missing screen placeholder ── */

export function MissingFrame({ label, frameWidth = FW, frameHeight = FH, scale = SCALE }) {
  return (
    <div style={{
      flexShrink: 0, width: frameWidth, height: frameHeight,
      borderRadius: 56 * scale, background: Color.surface,
      border: `2px dashed ${Color.red}40`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: 24,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: Radius.full,
        background: `${Color.red}15`, display: 'grid', placeItems: 'center',
      }}>
        <FIcon path={ICONS.plus} size={18} color={Color.red} stroke={2} />
      </div>
      <div style={{
        fontFamily: Font.mono, fontSize: 11, letterSpacing: 1,
        color: Color.red, textTransform: 'uppercase',
      }}>NOT BUILT</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: Color.text, textAlign: 'center' }}>{label}</div>
    </div>
  )
}

/* ── Screen label card ── */

export function ScreenLabel({ label, missing, reads, writes, crudTag, lensBadge, lensColor, lensRelevance }) {
  const isPrimary = lensRelevance === 'primary'
  const isAffected = lensRelevance === 'affected'

  return (
    <div style={{
      padding: '10px 12px',
      background: missing ? `${Color.red}08` : isPrimary ? `${lensColor}08` : Color.surface,
      border: `1px solid ${missing ? `${Color.red}30` : isPrimary ? `${lensColor}40` : Color.borderSoft}`,
      borderLeft: isPrimary ? `3px solid ${lensColor}` : isAffected ? `3px solid ${lensColor}30` : undefined,
      borderRadius: 10, marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {missing && <div style={{ width: 6, height: 6, borderRadius: 3, background: Color.red, flexShrink: 0 }} />}
        <div style={{ fontSize: 13, fontWeight: 500, color: Color.text, letterSpacing: -0.2, flex: 1 }}>{label}</div>
        {crudTag && <FTag tone={crudTag === 'C' ? 'green' : crudTag === 'U' ? 'accent' : 'red'} size="sm">{crudTag}</FTag>}
      </div>
      {(reads?.length > 0 || writes?.length > 0) && (
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 4 }}>
          {writes?.map(w => <FTag key={`w-${w}`} tone="green" size="sm">{w}</FTag>)}
          {reads?.map(r => <FTag key={`r-${r}`} tone="mute" size="sm">{r}</FTag>)}
        </div>
      )}
      {lensBadge && (
        <div style={{
          marginTop: 4, padding: '2px 6px', borderRadius: 4,
          background: `${lensColor}12`, display: 'inline-block',
          fontFamily: Font.mono, fontSize: 8, letterSpacing: 0.6, color: lensColor,
        }}>
          {lensBadge}
        </div>
      )}
    </div>
  )
}

/* ── Flow arrow between screens ── */

export function FlowArrow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      color: Color.faint, flexShrink: 0, paddingTop: 44,
    }}>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
        <path d="M16 2l6 4-6 4" stroke="currentColor" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  )
}

/* ── Phase header card ── */

export function PhaseHeader({ phase, title, description, color, screenCount, dataFlow, builtCount, totalCount }) {
  return (
    <div style={{
      width: 200, flexShrink: 0, borderRadius: 20,
      background: Color.surface,
      border: `2px solid ${color}40`,
      display: 'flex', flexDirection: 'column',
      gap: 10, padding: '28px 20px',
      height: FH, position: 'sticky', left: 0, zIndex: 2,
    }}>
      <span style={{
        fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.4,
        color, textTransform: 'uppercase', fontWeight: 600,
      }}>PHASE {phase}</span>
      <span style={{
        fontSize: 17, fontWeight: 500, letterSpacing: -0.3,
        color: Color.text, lineHeight: 1.2,
      }}>{title}</span>
      <span style={{ fontSize: 12, color: Color.dim, lineHeight: 1.4, flex: 1 }}>{description}</span>

      {dataFlow && dataFlow.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <FLabel size={8} mb={0} letter={1}>DATA PRODUCED</FLabel>
          {dataFlow.map(key => {
            const m = DATA_MODELS[key]
            return (
              <div key={key} style={{
                padding: '6px 8px', borderRadius: Radius.md,
                background: `${m.color}10`, border: `1px solid ${m.color}25`,
              }}>
                <FMono size={9} color={m.color}>{m.label.toUpperCase()}</FMono>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 8, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <FMono size={9} color={Color.mute}>COVERAGE</FMono>
          <FMono size={9} color={builtCount === totalCount ? Color.green : Color.dim}>{builtCount}/{totalCount}</FMono>
        </div>
        <FTexBar pct={(builtCount / totalCount) * 100} height={4} color={color} radius={2} />
      </div>

      <FMono size={10} color={Color.mute}>{screenCount} screens</FMono>
    </div>
  )
}

/* ── Screen flow strip — renders a list of screens with arrows ── */

export function ScreenFlowStrip({ screens, compact, onExpand, crudTag, goalKey }) {
  const fw = compact ? COMPACT_FW : FW
  const fh = compact ? COMPACT_FH : FH
  const sc = compact ? COMPACT_SCALE : SCALE

  return (
    <div style={{ display: 'flex', gap: compact ? 4 : 8, alignItems: 'flex-start' }}>
      {screens.map((screen, si) => {
        const lens = getScreenLens(screen.label, goalKey)
        const dimmed = lens?.relevance === 'unchanged'

        return (
          <Fragment key={si}>
            {si > 0 && !compact && <FlowArrow />}
            <div style={{
              flexShrink: 0, width: fw,
              opacity: dimmed ? 0.4 : 1,
              filter: dimmed ? 'grayscale(1)' : 'none',
              transition: 'opacity 0.2s ease, filter 0.2s ease',
            }}>
              <ScreenLabel
                label={screen.label} missing={!screen.C}
                reads={screen.reads} writes={screen.writes} crudTag={crudTag}
                lensBadge={lens?.badge} lensColor={lens?.color} lensRelevance={lens?.relevance}
              />
              {screen.C ? (
                <div onClick={() => onExpand?.({ C: screen.C, label: screen.label, goalKey })} style={{ cursor: 'pointer' }}>
                  <PhoneFrame scale={sc} frameWidth={fw} frameHeight={fh}><screen.C goalKey={goalKey} /></PhoneFrame>
                </div>
              ) : (
                <MissingFrame label={screen.label} frameWidth={fw} frameHeight={fh} scale={sc} />
              )}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

/* ── SVG Helpers ── */

const mono = Font.mono
const sans = Font.sans

export function SvgArrow({ x1, y1, x2, y2, color = Color.faint, dashed = true }) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const ax = x2 - ux * 8, ay = y2 - uy * 8
  const px = -uy * 4, py = ux * 4
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={color} strokeWidth="1" strokeDasharray={dashed ? '4 3' : 'none'} />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  )
}

export function SvgNode({ x, y, w, h, label, sub, color, r = 10 }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={r} fill={`${color}0a`} stroke={color} strokeWidth="1.5" strokeOpacity="0.35" />
      <text x={x} y={sub ? y - 6 : y + 4} textAnchor="middle" fontFamily={mono} fontSize="11" fontWeight="600" letterSpacing="1.2" fill={color}>{label}</text>
      {sub && <text x={x} y={y + 12} textAnchor="middle" fontFamily={sans} fontSize="10" fill={Color.dim}>{sub}</text>}
    </g>
  )
}

export function SvgEntityBox({ x, y, w, label, color, fields }) {
  const rowH = 22, headerH = 32
  const h = headerH + fields.length * rowH + 12
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={Color.surface} stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
      <rect x={x} y={y} width={w} height={headerH} rx={10} fill={`${color}12`} />
      <rect x={x} y={y + headerH - 5} width={w} height={5} fill={`${color}12`} />
      <circle cx={x + 14} cy={y + headerH / 2} r={4} fill={color} />
      <text x={x + 24} y={y + headerH / 2 + 4} fontFamily={mono} fontSize="10" fontWeight="600" letterSpacing="1" fill={color}>{label}</text>
      {fields.map((f, i) => (
        <g key={i}>
          {i > 0 && <line x1={x + 10} y1={y + headerH + i * rowH} x2={x + w - 10} y2={y + headerH + i * rowH} stroke={Color.borderSoft} strokeWidth="1" />}
          <text x={x + 14} y={y + headerH + i * rowH + 15} fontFamily={mono} fontSize="9" fill={Color.accent}>{f.k}</text>
          <text x={x + 100} y={y + headerH + i * rowH + 15} fontFamily={mono} fontSize="9" fill={Color.mute}>{f.v}</text>
        </g>
      ))}
    </g>
  )
}
