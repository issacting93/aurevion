/* ModeOverview — parameterized overview for all journey modes.
   Exercise mode adds: goal selector → inline goal network graph → phase strips.
   Profile toggle: NEW USER (empty) vs ONBOARDED (goal-seeded plan). */

import { Fragment, useState, useMemo, createContext, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Color, Font, Radius, Space, Type, alpha } from '../../ui/tokens'
import { FLabel, FMono, FIcon, FTag, ICONS } from '../../ui/components'
import { MODE_CONFIG } from './journey-data'
import { PhaseHeader, ScreenFlowStrip } from './journey-shared'
import { useJourneyContext } from './JourneyLayout'
import { NODES, EDGES, CATEGORIES, computeLayout, getConnectedEdges, getConnectedNodeIds, getNodeById } from '../goal-network/goal-network-data'
import { NetworkNode, NetworkEdge } from '../goal-network/goal-network-shared'
import { GOAL_META } from '../ontology/ontology-data'
import { UserProvider } from '../../context/UserContext'
import { generateProgram } from '../../app/screens/fitness-data'
import { MOCK_PROFILE, MOCK_TARGETS, MOCK_ACTIVITY_LOG } from '../../context/mockUser'
import { computeMacros } from '../../app/screens/Onboarding'

const mono = Font.mono

const FLOW_PILLS = [
  { key: 'create', label: 'CREATE', tone: '#4ade80' },
  { key: 'edit',   label: 'EDIT',   tone: '#FF6E50' },
  { key: 'delete', label: 'DELETE', tone: '#f87171' },
]

/* ── Profile presets for journey preview ── */

function buildProfileForGoal(goalKey) {
  const profile = {
    ...MOCK_PROFILE,
    goal: goalKey,
    goals: [goalKey],
  }
  const targets = computeMacros(profile)
  const workoutPlan = generateProgram({
    goals: [goalKey],
    equipment: profile.equipment,
    availableDays: profile.availableDays,
    injuries: profile.injuries,
    experience: profile.liftingExp,
  })
  return { profile, targets, workoutPlan, onboarded: true, activityLog: MOCK_ACTIVITY_LOG, checkins: [], interventions: [], preferences: { layout: 'balanced' }, mealPrepApproach: null }
}

const EMPTY_STATE = {
  profile: null, targets: null, workoutPlan: null, onboarded: false,
  activityLog: [], checkins: [], interventions: [],
  preferences: { layout: 'balanced' }, mealPrepApproach: null,
}

/* ── Journey profile context — overrides useUser() for screen previews ── */

const JourneyProfileCtx = createContext(null)
export const useJourneyProfile = () => useContext(JourneyProfileCtx)

function JourneyProfileProvider({ goalKey, profileMode, children }) {
  const state = useMemo(() => {
    if (profileMode === 'new' || !goalKey) return EMPTY_STATE
    return buildProfileForGoal(goalKey)
  }, [goalKey, profileMode])

  return (
    <UserProvider _override={state}>
      {children}
    </UserProvider>
  )
}

/* ── Goal Selector + Profile Toggle ── */

function GoalSelector({ selected, onChange, profileMode, onProfileChange }) {
  return (
    <div style={{
      position: 'sticky', top: 60, zIndex: 15,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${Color.borderSoft}`,
      padding: '12px 60px', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
    }}>
      {/* Profile toggle */}
      <div style={{ display: 'flex', gap: 2, marginRight: 10, background: alpha(Color.text, 0.03), borderRadius: 6, padding: 2 }}>
        {['new', 'onboarded'].map(mode => (
          <button key={mode} onClick={() => onProfileChange(mode)} style={{
            padding: '4px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
            background: profileMode === mode ? alpha(Color.text, 0.08) : 'transparent',
            color: profileMode === mode ? Color.text : Color.faint,
            fontFamily: Font.mono, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}>{mode === 'new' ? 'New user' : 'Onboarded'}</button>
        ))}
      </div>

      <FMono size={10} color={Color.mute} style={{ marginRight: 6 }}>GOAL</FMono>
      <button onClick={() => onChange(null)} style={{
        padding: '5px 12px', borderRadius: 9999,
        border: `1px solid ${!selected ? Color.accent : Color.borderSoft}`,
        background: !selected ? alpha(Color.accent, 0.08) : 'transparent',
        color: !selected ? Color.accent : Color.mute,
        ...Type.labelMd, fontWeight: !selected ? 600 : 400,
        cursor: 'pointer', transition: 'all 0.15s',
      }}>ALL</button>
      {Object.entries(GOAL_META).map(([key, meta]) => (
        <button key={key} onClick={() => {
          onChange(selected === key ? null : key)
          if (selected !== key) onProfileChange('onboarded')
        }} style={{
          padding: '5px 12px', borderRadius: 9999,
          border: `1px solid ${selected === key ? meta.color : Color.borderSoft}`,
          background: selected === key ? alpha(meta.color, 0.08) : 'transparent',
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
  const [open, setOpen] = useState(false)
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
  const connectedCount = connectedIds.size
  const goalMeta = GOAL_META[selectedGoal]

  return (
    <div style={{ padding: '20px 60px 10px' }}>
      {/* Toggle bar */}
      <button aria-expanded={open} onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderRadius: open ? `${Radius.xl}px ${Radius.xl}px 0 0` : Radius.xl,
        background: Color.surface, border: `1px solid ${open ? alpha(goalMeta?.color || Color.accent, 0.2) : Color.borderSoft}`,
        borderBottom: open ? 'none' : undefined,
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: alpha(goalMeta?.color || Color.accent, 0.08),
            display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={ICONS.goal} size={14} color={goalMeta?.color || Color.accent} stroke={1.5} />
          </div>
          <FMono size={10} color={Color.mute} letter={1.2}>GOAL NETWORK</FMono>
          <FMono size={10} color={goalMeta?.color || Color.accent} letter={1.2}>{goalMeta?.label.toUpperCase()}</FMono>
          <FMono size={10} color={Color.faint}>{connectedCount} CONNECTED</FMono>
        </div>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: 'transparent', display: 'grid', placeItems: 'center',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>
          <FIcon path="M19 9l-7 7-7-7" size={14} color={Color.dim} stroke={2} />
        </div>
      </button>

      {/* Graph panel */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '50vh' : 0,
        opacity: open ? 1 : 0,
        transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
      }}>
        <div style={{
          background: Color.surface, borderRadius: `0 0 ${Radius.xl}px ${Radius.xl}px`,
          border: `1px solid ${alpha(goalMeta?.color || Color.accent, 0.2)}`, borderTop: 'none',
          overflow: 'hidden', height: '50vh',
        }}>
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
                <text x={tooltipPos.x} y={tooltipPos.y - 32} textAnchor="middle" fontFamily={Font.mono} fontSize="10" fill={Color.mute} letterSpacing="0.8">{CATEGORIES[tooltipNode.category].label.toUpperCase()}</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ── */

export default function ModeOverview({ mode }) {
  const { compact, setExpanded } = useJourneyContext()
  const cfg = MODE_CONFIG[mode]
  const [searchParams] = useSearchParams()
  const initialGoal = searchParams.get('goal') || null
  const [selectedGoal, setSelectedGoal] = useState(initialGoal)
  const [profileMode, setProfileMode] = useState(initialGoal ? 'onboarded' : 'new')
  const isExercise = mode === 'exercise'

  // When a goal is selected, auto-switch to onboarded
  const handleGoalChange = (goal) => {
    setSelectedGoal(goal)
    if (goal) setProfileMode('onboarded')
  }

  const handleProfileChange = (mode) => {
    setProfileMode(mode)
    if (mode === 'new') setSelectedGoal(null)
  }

  // Build the override state for the UserProvider
  const profileState = useMemo(() => {
    if (profileMode === 'new' || !selectedGoal) return EMPTY_STATE
    return buildProfileForGoal(selectedGoal)
  }, [profileMode, selectedGoal])

  return (
    <div>
      {/* Mode header */}
      <div style={{ padding: '30px 60px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: alpha(cfg.color, 0.07), display: 'grid', placeItems: 'center' }}>
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
                color: pill.tone, textDecoration: 'none', border: `1px solid ${alpha(pill.tone, 0.2)}`, background: alpha(pill.tone, 0.03),
              }}>{pill.label} FLOW ({cfg.flows[pill.key].screens.length})</Link>
            ))}
          </div>
        )}
      </div>

      {/* Goal selector + profile toggle */}
      <GoalSelector selected={selectedGoal} onChange={handleGoalChange} profileMode={profileMode} onProfileChange={handleProfileChange} />

      {/* Profile indicator */}
      {isExercise && (
        <div style={{ padding: '10px 60px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: profileMode === 'onboarded' ? Color.green : Color.faint }} />
          <FMono size={9} color={profileMode === 'onboarded' ? Color.dim : Color.faint}>
            {profileMode === 'onboarded' && selectedGoal
              ? `Previewing as ${GOAL_META[selectedGoal]?.label} user`
              : 'Previewing as new user (no program)'}
          </FMono>
        </div>
      )}

      {/* Goal network graph (exercise mode only, when a goal is selected) */}
      {isExercise && selectedGoal && <GoalNetworkInline selectedGoal={selectedGoal} />}

      {/* Section label */}
      <div style={{ padding: '20px 60px 10px' }}>
        <div style={{ borderTop: `1px solid ${Color.border}`, paddingTop: 20 }}>
          <FLabel size={10} mb={0} letter={1.6}>{cfg.sectionLabel}</FLabel>
        </div>
      </div>

      {/* Phase strips — wrapped in UserProvider with profile state */}
      <UserProvider _override={profileState}>
        <div style={{ padding: '20px 40px 120px 28px', display: 'flex', flexDirection: 'column', gap: 64 }}>
          {cfg.phases.map(phase => (
            <div key={phase.id} id={`phase-${phase.id}`} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8, scrollMarginTop: 120 }}>
                <PhaseHeader phase={phase.phase} title={phase.title} description={phase.description} color={phase.color} screenCount={phase.screens.length} dataFlow={phase.dataFlow} builtCount={phase.screens.filter(s => s.C).length} totalCount={phase.screens.length} />
                <ScreenFlowStrip screens={phase.screens} compact={compact} onExpand={(s) => setExpanded({ ...s, _profileState: profileState })} goalKey={selectedGoal} />
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
      </UserProvider>
    </div>
  )
}
