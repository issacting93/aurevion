/* Goal Network SVG Primitives — NetworkNode, NetworkEdge, NetworkLegend. */

import { Color, Font } from '../../ui/tokens'
import { CATEGORIES } from './goal-network-data'

const mono = Font.mono
const sans = Font.sans

/* ── NetworkNode ── */

export function NetworkNode({ x, y, node, selected, highlighted, dimmed, onClick, onMouseEnter, onMouseLeave }) {
  const cat = CATEGORIES[node.category]
  const color = cat.color
  const r = node.category === 'caloric_state' ? 22 : 26
  const opacity = dimmed ? 0.1 : 1
  const strokeW = selected ? 2.5 : highlighted ? 1.8 : 1
  const fillOpacity = selected ? 0.2 : highlighted ? 0.12 : 0.06

  return (
    <g
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer', opacity, transition: 'opacity 0.3s ease' }}
    >
      {/* Glow ring for selected */}
      {selected && (
        <circle cx={x} cy={y} r={r + 8} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.2">
          <animate attributeName="r" values={`${r + 6};${r + 12};${r + 6}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.25;0.08;0.25" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Node circle */}
      <circle cx={x} cy={y} r={r} fill={color} fillOpacity={fillOpacity} stroke={color} strokeWidth={strokeW} strokeOpacity={selected ? 0.8 : highlighted ? 0.5 : 0.25} />

      {/* Icon */}
      <g transform={`translate(${x - 9}, ${y - 9}) scale(0.75)`}>
        <path d={node.icon} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={selected || highlighted ? 1 : 0.7} />
      </g>

      {/* Label */}
      <text
        x={x} y={y + r + 14}
        textAnchor="middle"
        fontFamily={mono}
        fontSize="9"
        fontWeight={selected ? 600 : 400}
        letterSpacing="0.6"
        fill={selected ? color : highlighted ? Color.text : Color.dim}
      >
        {node.label.toUpperCase()}
      </text>

      {/* Group label for fitness goals */}
      {node.group && (selected || highlighted) && (
        <text
          x={x} y={y + r + 24}
          textAnchor="middle"
          fontFamily={sans}
          fontSize="9"
          fill={Color.mute}
        >
          {node.group}
        </text>
      )}
    </g>
  )
}

/* ── NetworkEdge ── */

export function NetworkEdge({ x1, y1, x2, y2, edge, highlighted, dimmed }) {
  const fromCat = CATEGORIES[edge._fromCategory]
  const toCat = CATEGORIES[edge._toCategory]
  const color = highlighted ? (fromCat?.color || Color.faint) : Color.faint

  const strokeW = edge.strength === 'strong' ? 1.5 : edge.strength === 'moderate' ? 1 : 0.6
  const dashArray = edge.strength === 'weak' ? '3 4' : edge.strength === 'moderate' ? '6 3' : 'none'
  const opacity = dimmed ? 0.03 : highlighted ? 0.6 : 0.07

  // Quadratic bezier: curve toward center for visual separation
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  // Pull control point toward center
  const cx = 550, cy = 400
  const pull = 0.15
  const qx = mx + (cx - mx) * pull
  const qy = my + (cy - my) * pull

  return (
    <path
      d={`M${x1},${y1} Q${qx},${qy} ${x2},${y2}`}
      stroke={color}
      strokeWidth={highlighted ? strokeW + 0.4 : strokeW}
      strokeOpacity={opacity}
      strokeDasharray={dashArray}
      fill="none"
      strokeLinecap="round"
      style={{ transition: 'stroke-opacity 0.3s ease, stroke 0.3s ease' }}
    />
  )
}

/* ── NetworkLegend ── */

export function NetworkLegend({ x = 30, y = 30, activeCategories, onToggle }) {
  const cats = Object.entries(CATEGORIES)
  const gap = 22

  return (
    <g>
      <text x={x} y={y - 10} fontFamily={mono} fontSize="9" fontWeight="600" letterSpacing="1.4" fill={Color.mute}>
        CATEGORIES
      </text>
      {cats.map(([key, cat], i) => {
        const active = activeCategories.has(key)
        return (
          <g
            key={key}
            onClick={() => onToggle(key)}
            style={{ cursor: 'pointer' }}
          >
            <rect x={x - 4} y={y + i * gap - 4} width={150} height={18} rx={4} fill="transparent" />
            <circle cx={x + 6} cy={y + i * gap + 5} r={4} fill={cat.color} fillOpacity={active ? 1 : 0.2} stroke={cat.color} strokeWidth="1" strokeOpacity={active ? 0.6 : 0.15} />
            <text x={x + 18} y={y + i * gap + 9} fontFamily={mono} fontSize="9" letterSpacing="0.8" fill={active ? Color.text : Color.mute} fillOpacity={active ? 1 : 0.4}>
              {cat.label.toUpperCase()}
            </text>
          </g>
        )
      })}

      {/* Strength legend */}
      <text x={x} y={y + cats.length * gap + 16} fontFamily={mono} fontSize="9" fontWeight="600" letterSpacing="1.4" fill={Color.mute}>
        STRENGTH
      </text>
      {[['strong', 'none', 1.5], ['moderate', '6 3', 1], ['weak', '3 4', 0.6]].map(([label, dash, sw], i) => (
        <g key={label}>
          <line x1={x} y1={y + cats.length * gap + 34 + i * 18} x2={x + 30} y2={y + cats.length * gap + 34 + i * 18} stroke={Color.dim} strokeWidth={sw} strokeDasharray={dash} />
          <text x={x + 38} y={y + cats.length * gap + 38 + i * 18} fontFamily={mono} fontSize="9" letterSpacing="0.6" fill={Color.mute}>
            {label.toUpperCase()}
          </text>
        </g>
      ))}
    </g>
  )
}
