/* ModeOverview — parameterized overview for all journey modes.
   Exercise mode adds: goal selector → inline goal network graph → phase strips. */

import { Fragment, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Color, Font, Radius, Space, Type } from '../../ui/tokens'
import { FLabel, FMono, FIcon, FTag, ICONS } from '../../ui/components'
import { MODE_CONFIG } from './journey-data'
import { PhaseHeader, ScreenFlowStrip } from './journey-shared'
import { useJourneyContext } from './JourneyLayout'
import { NODES, EDGES, CATEGORIES, computeLayout, getConnectedEdges, getConnectedNodeIds, getNodeById } from '../goal-network/goal-network-data'
import { NetworkNode, NetworkEdge } from '../goal-network/goal-network-shared'
import { GOAL_META } from '../ontology/ontology-data'

const mono = Font.mono

const FLOW_PILLS = [
  { key: 'create', label: 'CREATE', tone: '#4ade80' },
  { key: 'edit',   label: 'EDIT',   tone: '#FF6E50' },
  { key: 'delete', label: 'DELETE', tone: '#f87171' },
]

/* ── Goal Selector ── */

function GoalSelector({ selected, onChange }) {
  return (
    <div style={{
      position: 'sticky', top: 60, zIndex: 15,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${Color.borderSoft}`,
      padding: '12px 60px', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
    }}>
      <FMono size={9} color={Color.mute} style={{ marginRight: 6 }}>VIEW AS</FMono>
      <button onClick={() => onChange(null)} style={{
        padding: '5px 12px', borderRadius: 9999,
        border: `1px solid ${!selected ? Color.accent : Color.borderSoft}`,
        background: !selected ? `${Color.accent}15` : 'transparent',
        color: !selected ? Color.accent : Color.mute,
        ...Type.labelMd, fontWeight: !selected ? 600 : 400,
        cursor: 'pointer', transition: 'all 0.15s',
      }}>ALL</button>
      {Object.entries(GOAL_META).map(([key, meta]) => (
        <button key={key} onClick={() => onChange(selected === key ? null : key)} style={{
          padding: '5px 12px', borderRadius: 9999,
          border: `1px solid ${selected === key ? meta.color : Color.borderSoft}`,
          background: selected === key ? `${meta.color}15` : 'transparent',
          color: selected === key ? meta.color : Color.mute,
          ...Type.labelMd, fontWeight: selected === key ? 600 : 400,
          cursor: 'pointer', transition: 'all 0.15s',
        }}>{meta.label}</button>
      ))}
    </div>
  )
}

/* ── Inline Goal Network Graph ── */

function GoalNetworkInline({ selectedGoal }) {
  const [hoveredId, setHoveredId] = useState(null)
  const positions = useMemo(() => computeLayout(), [])
  const connectedIds = useMemo(() => getConnectedNodeIds(selectedGoal), [selectedGoal])
  const connectedEdgeKeys = useMemo(() => {
    return new Set(getConnectedEdges(selectedGoal).map(e => `${e.from}-${e.to}`))
  }, [selectedGoal])

  const enrichedEdges = useMemo(() => EDGES.map(e => ({
    ...e, _fromCategory: getNodeById(e.from)?.category, _toCategory: getNodeById(e.to)?.category,
  })), [])

  const tooltipNode = hoveredId && hoveredId !== selectedGoal ? getNodeById(hoveredId) : null
  const tooltipPos = tooltipNode ? positions[tooltipNode.id] : null

  return (
    <div style={{ padding: '20px 60px 10px' }}>
      <FLabel size={10} mb={12} letter={1.6}>GOAL NETWORK — {GOAL_META[selectedGoal]?.label.toUpperCase()}</FLabel>
      <div style={{ background: Color.surface, borderRadius: Radius.xl, border: `1px solid ${Color.borderSoft}`, overflow: 'hidden', height: '50vh' }}>
        <svg width="100%" height="100%" viewBox="0 0 1100 800" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
          <circle cx={550} cy={400} r={110} fill="none" stroke={Color.borderSoft} strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx={550} cy={400} r={260} fill="none" stroke={Color.borderSoft} strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx={550} cy={400} r={390} fill="none" stroke={Color.borderSoft} strokeWidth="0.5" strokeDasharray="4 8" />
          {enrichedEdges.map(edge => {
            const p1 = positions[edge.from], p2 = positions[edge.to]
            if (!p1 || !p2) return null
            return <NetworkEdge key={`${edge.from}-${edge.to}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} edge={edge} highlighted={connectedEdgeKeys.has(`${edge.from}-${edge.to}`)} dimmed={!connectedEdgeKeys.has(`${edge.from}-${edge.to}`)} />
          })}
          {NODES.map(node => {
            const pos = positions[node.id]
            if (!pos) return null
            return <NetworkNode key={node.id} x={pos.x} y={pos.y} node={node} selected={selectedGoal === node.id} highlighted={connectedIds.has(node.id)} dimmed={selectedGoal !== node.id && !connectedIds.has(node.id)} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)} />
          })}
          {tooltipNode && tooltipPos && (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tooltipPos.x - 90} y={tooltipPos.y - 56} width={180} height={32} rx={6} fill={Color.surface2} stroke={Color.border} strokeWidth="1" />
              <text x={tooltipPos.x} y={tooltipPos.y - 44} textAnchor="middle" fontFamily={Font.sans} fontSize="10" fill={Color.text} fontWeight="500">{tooltipNode.label}</text>
              <text x={tooltipPos.x} y={tooltipPos.y - 32} textAnchor="middle" fontFamily={Font.mono} fontSize="9" fill={Color.mute} letterSpacing="0.8">{CATEGORIES[tooltipNode.category].label.toUpperCase()}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}

/* ── Main Component ── */

export default function ModeOverview({ mode }) {
  const { compact, setExpanded } = useJourneyContext()
  const cfg = MODE_CONFIG[mode]
  const [selectedGoal, setSelectedGoal] = useState(null)
  const isExercise = mode === 'exercise'

  return (
    <div>
      {/* Mode header */}
      <div style={{ padding: '30px 60px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cfg.color}12`, display: 'grid', placeItems: 'center' }}>
            <FIcon path={cfg.icon} size={20} color={cfg.color} stroke={1.5} />
          </div>
          <FMono size={14} color={cfg.color} letter={2}>{cfg.label}</FMono>
        </div>
        <div style={{ fontSize: 14, color: Color.dim, marginBottom: 20, maxWidth: 600 }}>{cfg.description}</div>
        {cfg.flows && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {FLOW_PILLS.map(pill => (
              <Link key={pill.key} to={`${cfg.routePrefix}/${pill.key}`} style={{
                padding: '6px 14px', borderRadius: 9999, fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.2,
                color: pill.tone, textDecoration: 'none', border: `1px solid ${pill.tone}30`, background: `${pill.tone}08`,
              }}>{pill.label} FLOW ({cfg.flows[pill.key].screens.length})</Link>
            ))}
          </div>
        )}
      </div>

      {/* Goal selector — filters all modes via Goal Lens */}
      <GoalSelector selected={selectedGoal} onChange={setSelectedGoal} />

      {/* Goal network graph (exercise mode only, when a goal is selected) */}
      {isExercise && selectedGoal && <GoalNetworkInline selectedGoal={selectedGoal} />}

      {/* Section label */}
      <div style={{ padding: '20px 60px 10px' }}>
        <div style={{ borderTop: `1px solid ${Color.border}`, paddingTop: 20 }}>
          <FLabel size={10} mb={0} letter={1.6}>{cfg.sectionLabel}</FLabel>
        </div>
      </div>

      {/* Phase strips */}
      <div style={{ padding: '20px 40px 120px 28px', display: 'flex', flexDirection: 'column', gap: 64 }}>
        {cfg.phases.map(phase => (
          <div key={phase.id} id={`phase-${phase.id}`} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8, scrollMarginTop: 120 }}>
              <PhaseHeader phase={phase.phase} title={phase.title} description={phase.description} color={phase.color} screenCount={phase.screens.length} dataFlow={phase.dataFlow} builtCount={phase.screens.filter(s => s.C).length} totalCount={phase.screens.length} />
              <ScreenFlowStrip screens={phase.screens} compact={compact} onExpand={setExpanded} goalKey={selectedGoal} />
            </div>
            {/* Scroll fade hint */}
            <div style={{
              position: 'absolute', top: 0, right: -40, width: 80, height: '100%',
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.9))',
              pointerEvents: 'none',
            }} />
          </div>
        ))}
      </div>
    </div>
  )
}
