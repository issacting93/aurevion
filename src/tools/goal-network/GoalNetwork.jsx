/* GoalNetwork — Interactive graph visualization of fitness/nutrition goal connections.
   Shows how goals drive training modalities, caloric states, and meal prep approaches. */

import { useState, useMemo, useCallback } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { FLabel, FMono, FTag, FIcon, ICONS } from '../../ui/components'
import { NODES, EDGES, CATEGORIES, computeLayout, getConnectedEdges, getConnectedNodeIds, getNodeById } from './goal-network-data'
import { NetworkNode, NetworkEdge, NetworkLegend } from './goal-network-shared'

const VB_W = 1100, VB_H = 800

export default function GoalNetwork() {
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [activeCategories, setActiveCategories] = useState(() => new Set(Object.keys(CATEGORIES)))

  const positions = useMemo(() => computeLayout(), [])

  const connectedIds = useMemo(() => {
    if (!selectedId) return null
    return getConnectedNodeIds(selectedId)
  }, [selectedId])

  const connectedEdgeKeys = useMemo(() => {
    if (!selectedId) return null
    const edges = getConnectedEdges(selectedId)
    return new Set(edges.map(e => `${e.from}-${e.to}`))
  }, [selectedId])

  // Precompute edge metadata (attach category info for coloring)
  const enrichedEdges = useMemo(() => {
    return EDGES.map(e => ({
      ...e,
      _fromCategory: getNodeById(e.from)?.category,
      _toCategory: getNodeById(e.to)?.category,
    }))
  }, [])

  const visibleNodes = useMemo(() => {
    return NODES.filter(n => activeCategories.has(n.category))
  }, [activeCategories])

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes])

  const visibleEdges = useMemo(() => {
    return enrichedEdges.filter(e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to))
  }, [enrichedEdges, visibleNodeIds])

  const handleNodeClick = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id)
  }, [])

  const handleBgClick = useCallback(() => {
    setSelectedId(null)
  }, [])

  const handleToggleCategory = useCallback((key) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const selectedNode = selectedId ? getNodeById(selectedId) : null
  const selectedConnections = useMemo(() => {
    if (!selectedId) return []
    const edges = getConnectedEdges(selectedId)
    return edges.map(e => {
      const otherId = e.from === selectedId ? e.to : e.from
      const other = getNodeById(otherId)
      const direction = e.from === selectedId ? 'outgoing' : 'incoming'
      return { edge: e, node: other, direction }
    }).sort((a, b) => {
      const sOrder = { strong: 0, moderate: 1, weak: 2 }
      return (sOrder[a.edge.strength] || 0) - (sOrder[b.edge.strength] || 0)
    })
  }, [selectedId])

  // Tooltip
  const tooltipNode = hoveredId && hoveredId !== selectedId ? getNodeById(hoveredId) : null
  const tooltipPos = tooltipNode ? positions[tooltipNode.id] : null

  return (
    <div style={{ padding: '30px 60px 60px', position: 'relative' }}>
      {/* Title */}
      <div style={{ marginBottom: Space[6] }}>
        <FLabel size={10} mb={8} letter={1.6}>GOAL NETWORK</FLabel>
        <h2 style={{ ...Type.headingLg, margin: 0, marginBottom: 6 }}>How goals drive training and nutrition</h2>
        <p style={{ ...Type.bodyMd, color: Color.dim, margin: 0, maxWidth: 600 }}>
          Select any node to see how fitness goals, training modalities, caloric states, and meal prep approaches connect.
          The graph shows the bridge between what you train and what you cook.
        </p>
      </div>

      {/* Main layout: graph + detail panel */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* SVG Canvas */}
        <div style={{
          flex: 1, minWidth: 0,
          background: Color.surface,
          borderRadius: Radius.xl,
          border: `1px solid ${Color.borderSoft}`,
          overflow: 'hidden',
        }}>
          <svg
            width="100%"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={{ display: 'block' }}
            onClick={handleBgClick}
          >
            {/* Ring guides */}
            <circle cx={550} cy={400} r={110} fill="none" stroke={Color.borderSoft} strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx={550} cy={400} r={260} fill="none" stroke={Color.borderSoft} strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx={550} cy={400} r={390} fill="none" stroke={Color.borderSoft} strokeWidth="0.5" strokeDasharray="4 8" />

            {/* Ring labels */}
            <text x={550} y={400 - 110 + 8} textAnchor="middle" fontFamily={Font.mono} fontSize="10" letterSpacing="1.5" fill={Color.faint}>CALORIC STATE</text>
            <text x={550} y={400 + 260 + 6} textAnchor="middle" fontFamily={Font.mono} fontSize="10" letterSpacing="1.5" fill={Color.faint}>MODALITIES</text>
            <text x={550} y={400 + 390 + 6} textAnchor="middle" fontFamily={Font.mono} fontSize="10" letterSpacing="1.5" fill={Color.faint}>GOALS</text>

            {/* Edges */}
            {visibleEdges.map((edge, i) => {
              const p1 = positions[edge.from]
              const p2 = positions[edge.to]
              if (!p1 || !p2) return null
              const isConnected = connectedEdgeKeys?.has(`${edge.from}-${edge.to}`)
              return (
                <NetworkEdge
                  key={`${edge.from}-${edge.to}`}
                  x1={p1.x} y1={p1.y}
                  x2={p2.x} y2={p2.y}
                  edge={edge}
                  highlighted={!selectedId || isConnected}
                  dimmed={selectedId && !isConnected}
                />
              )
            })}

            {/* Nodes */}
            {visibleNodes.map(node => {
              const pos = positions[node.id]
              if (!pos) return null
              const isSelected = selectedId === node.id
              const isHighlighted = connectedIds?.has(node.id)
              const isDimmed = selectedId && !isSelected && !isHighlighted
              return (
                <NetworkNode
                  key={node.id}
                  x={pos.x} y={pos.y}
                  node={node}
                  selected={isSelected}
                  highlighted={isHighlighted}
                  dimmed={isDimmed}
                  onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id) }}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              )
            })}

            {/* Legend */}
            <NetworkLegend x={30} y={30} activeCategories={activeCategories} onToggle={handleToggleCategory} />

            {/* Tooltip */}
            {tooltipNode && tooltipPos && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={tooltipPos.x - 90} y={tooltipPos.y - 56}
                  width={180} height={32} rx={6}
                  fill={Color.surface2} stroke={Color.border} strokeWidth="1"
                />
                <text x={tooltipPos.x} y={tooltipPos.y - 44} textAnchor="middle" fontFamily={Font.sans} fontSize="10" fill={Color.text} fontWeight="500">
                  {tooltipNode.label}
                </text>
                <text x={tooltipPos.x} y={tooltipPos.y - 32} textAnchor="middle" fontFamily={Font.mono} fontSize="10" fill={Color.mute} letterSpacing="0.8">
                  {CATEGORIES[tooltipNode.category].label.toUpperCase()}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <div style={{
            width: 320, flexShrink: 0,
            background: Color.surface,
            border: `1px solid ${Color.borderSoft}`,
            borderRadius: Radius.xl,
            padding: Space[6],
            maxHeight: 'calc(100vh - 240px)',
            overflowY: 'auto',
            animation: 'goalnet-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: Space[2], marginBottom: Space[1] }}>
              <FTag tone={selectedNode.category === 'fitness_goal' ? 'accent' : selectedNode.category === 'nutrition_goal' ? 'green' : 'mute'} size="sm">
                {CATEGORIES[selectedNode.category].label.toUpperCase()}
              </FTag>
              {selectedNode.group && <FMono size={9} color={Color.mute}>{selectedNode.group}</FMono>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: Space[3], marginBottom: Space[3] }}>
              <div style={{
                width: 36, height: 36, borderRadius: Radius.lg,
                background: `${CATEGORIES[selectedNode.category].color}15`,
                display: 'grid', placeItems: 'center',
              }}>
                <FIcon path={selectedNode.icon} size={18} color={CATEGORIES[selectedNode.category].color} />
              </div>
              <h3 style={{ ...Type.headingMd, margin: 0 }}>{selectedNode.label}</h3>
            </div>

            <p style={{ ...Type.bodyMd, color: Color.dim, margin: 0, marginBottom: Space[6] }}>
              {selectedNode.sub}
            </p>

            {/* Connections */}
            <FLabel size={10} mb={10} letter={1.2}>
              CONNECTIONS ({selectedConnections.filter(c => visibleNodeIds.has(c.node.id)).length})
            </FLabel>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedConnections.filter(c => visibleNodeIds.has(c.node.id)).map(({ edge, node, direction }) => {
                const cat = CATEGORIES[node.category]
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: Space[2],
                      padding: `${Space[2]}px ${Space[3]}px`,
                      borderRadius: Radius.md,
                      background: Color.surface2,
                      border: `1px solid ${Color.borderSoft}`,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${cat.color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = Color.borderSoft}
                  >
                    {/* Direction arrow */}
                    <FIcon path={direction === 'outgoing' ? ICONS.fwd : ICONS.back} size={10} color={Color.mute} />

                    {/* Node dot */}
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: cat.color, flexShrink: 0 }} />

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...Type.bodySm, fontWeight: 500, color: Color.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {node.label}
                      </div>
                      <FMono size={9} color={Color.mute}>{cat.label}</FMono>
                    </div>

                    {/* Strength */}
                    <FTag tone={edge.strength === 'strong' ? 'accent' : 'mute'} size="sm">
                      {edge.strength === 'strong' ? 'STRONG' : edge.strength === 'moderate' ? 'MOD' : 'WEAK'}
                    </FTag>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div style={{ marginTop: Space[6], paddingTop: Space[4], borderTop: `1px solid ${Color.borderSoft}` }}>
              <div style={{ display: 'flex', gap: Space[4] }}>
                <div>
                  <FMono size={10} color={Color.mute}>EDGES</FMono>
                  <div style={{ ...Type.headingMd, color: CATEGORIES[selectedNode.category].color, marginTop: 2 }}>
                    {getConnectedEdges(selectedId).length}
                  </div>
                </div>
                <div>
                  <FMono size={10} color={Color.mute}>STRONG</FMono>
                  <div style={{ ...Type.headingMd, color: Color.text, marginTop: 2 }}>
                    {getConnectedEdges(selectedId).filter(e => e.strength === 'strong').length}
                  </div>
                </div>
                <div>
                  <FMono size={10} color={Color.mute}>CATEGORIES</FMono>
                  <div style={{ ...Type.headingMd, color: Color.text, marginTop: 2 }}>
                    {new Set(selectedConnections.map(c => c.node.category)).size}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Injected CSS ── */
if (typeof document !== 'undefined' && !document.getElementById('goalnet-css')) {
  const s = document.createElement('style')
  s.id = 'goalnet-css'
  s.textContent = `
    @keyframes goalnet-slide-in {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0s !important; transition-duration: 0s !important; }
    }
  `
  document.head.appendChild(s)
}
