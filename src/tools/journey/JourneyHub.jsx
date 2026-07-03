/* JourneyHub — index page at /journey.
   Shows SODA loop diagrams + navigation cards to cooking/exercise modes. */

import { Link } from 'react-router-dom'
import { Color, Font, Phase } from '../../ui/tokens'
import { FLabel, FMono, FTag, ICONS, FIcon } from '../../ui/components'
import { DATA_MODELS, GOAL_TAXONOMY, INTERVENTIONS, OBSERVATION_CHANNELS, COOKING_FLOWS, EXERCISE_FLOWS, COOKING_COLOR, EXERCISE_COLOR, SEED_PHASES, SEED_COLOR, DECIDE_PHASES, DECIDE_COLOR, OBSERVE_PHASES, OBSERVE_COLOR, MODE_CONFIG } from './journey-data'
import { SvgArrow, SvgNode, SvgEntityBox } from './journey-shared'

const mono = Font.mono
const sans = Font.sans
const OBS_COLOR = Phase.observe

/* ── SODA Loop — SVG flowchart ── */
function SODALoop() {
  const nodes = [
    { label: 'SEED', sub: 'Onboarding', color: Phase.seed, x: 100 },
    { label: 'DECIDE', sub: 'Dashboard', color: Phase.decide, x: 300 },
    { label: 'PLAN', sub: 'Setup', color: Phase.plan, x: 500 },
    { label: 'ACT', sub: 'Execute', color: Phase.act, x: 700 },
    { label: 'OBSERVE', sub: 'Feedback', color: Phase.observe, x: 900 },
  ]
  const nw = 140, nh = 50, cy = 80

  return (
    <div style={{ padding: '30px 60px 10px' }}>
      <svg width="100%" viewBox="0 0 1000 170" fill="none" style={{ overflow: 'visible' }}>
        {nodes.slice(0, -1).map((n, i) => (
          <SvgArrow key={i} x1={n.x + nw / 2 + 2} y1={cy} x2={nodes[i + 1].x - nw / 2 - 2} y2={cy} />
        ))}
        <path
          d={`M ${nodes[4].x} ${cy + nh / 2 + 2} C ${nodes[4].x} ${cy + 70}, ${nodes[1].x} ${cy + 70}, ${nodes[1].x} ${cy + nh / 2 + 2}`}
          stroke={Color.faint} strokeWidth="1" strokeDasharray="4 3" fill="none"
          markerEnd="url(#loopArrow)"
        />
        <defs>
          <marker id="loopArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill={Color.faint} />
          </marker>
        </defs>
        <text x={(nodes[4].x + nodes[1].x) / 2} y={cy + 68} textAnchor="middle" fontFamily={mono} fontSize="9" letterSpacing="1.5" fill={Color.mute}>FEEDBACK LOOP</text>
        {nodes.map(n => (
          <SvgNode key={n.label} x={n.x} y={cy} w={nw} h={nh} label={n.label} sub={n.sub} color={n.color} />
        ))}
        <text x={200} y={cy - 32} textAnchor="middle" fontFamily={mono} fontSize="8" fill={Color.mute} letterSpacing="0.8">state + goals</text>
        <text x={200} y={cy - 22} textAnchor="middle" fontFamily={mono} fontSize="8" fill={Color.mute} letterSpacing="0.8">+ constraints</text>
        <text x={800} y={cy - 28} textAnchor="middle" fontFamily={mono} fontSize="8" fill={Color.mute} letterSpacing="0.8">interventions</text>
      </svg>
    </div>
  )
}

/* ── Data Model ER Diagram ── */
function DataModelDiagram() {
  const models = [
    { ...DATA_MODELS.user_state, x: 20, y: 20, w: 310 },
    { ...DATA_MODELS.user_constraints, x: 355, y: 20, w: 290 },
    { ...DATA_MODELS.user_goal, x: 670, y: 20, w: 300 },
  ]
  const maxFields = Math.max(...Object.values(DATA_MODELS).map(m => m.fields.length))
  const svgH = 32 + maxFields * 22 + 40

  return (
    <div style={{ padding: '20px 60px' }}>
      <FLabel size={10} mb={12} letter={1.6}>DATA MODELS</FLabel>
      <svg width="100%" viewBox={`0 0 990 ${svgH}`} fill="none">
        {models.map(m => (
          <SvgEntityBox key={m.label} x={m.x} y={m.y} w={m.w} label={m.label.toUpperCase()} color={m.color} fields={m.fields} />
        ))}
        <SvgArrow x1={330} y1={50} x2={355} y2={50} color={Color.faint} dashed />
        <SvgArrow x1={645} y1={50} x2={670} y2={50} color={Color.faint} dashed />
        <text x={495} y={svgH - 6} textAnchor="middle" fontFamily={mono} fontSize="9" fill={Color.mute} letterSpacing="1">
          ALL THREE COLLECTED DURING ONBOARDING · UPDATED VIA OBSERVE LOOP
        </text>
      </svg>
    </div>
  )
}

/* ── Goal Taxonomy tree ── */
function GoalTaxonomyDiagram() {
  const fitness = GOAL_TAXONOMY.fitness.groups
  const nutrition = GOAL_TAXONOMY.nutrition.items
  const rootX = 495, rootY = 30
  const fitX = 260, nutX = 780, branchY = 90
  const groupY = 160, leafY0 = 220, leafGap = 20

  return (
    <div style={{ padding: '20px 60px' }}>
      <FLabel size={10} mb={12} letter={1.6}>GOAL TAXONOMY</FLabel>
      <svg width="100%" viewBox="0 0 990 380" fill="none">
        <rect x={rootX - 60} y={rootY - 14} width={120} height={28} rx={6} fill={Color.surface} stroke={Color.border} strokeWidth="1" />
        <text x={rootX} y={rootY + 4} textAnchor="middle" fontFamily={mono} fontSize="10" fontWeight="600" fill={Color.text} letterSpacing="1">USER GOAL</text>
        <line x1={rootX} y1={rootY + 14} x2={rootX} y2={rootY + 30} stroke={Color.faint} strokeWidth="1" />
        <line x1={fitX} y1={rootY + 30} x2={nutX} y2={rootY + 30} stroke={Color.faint} strokeWidth="1" />
        <line x1={fitX} y1={rootY + 30} x2={fitX} y2={branchY - 14} stroke={Color.faint} strokeWidth="1" />
        <line x1={nutX} y1={rootY + 30} x2={nutX} y2={branchY - 14} stroke={Color.faint} strokeWidth="1" />
        <rect x={fitX - 65} y={branchY - 14} width={130} height={28} rx={6} fill={`${Color.accent}10`} stroke={Color.accent} strokeWidth="1" strokeOpacity="0.4" />
        <text x={fitX} y={branchY + 4} textAnchor="middle" fontFamily={mono} fontSize="10" fontWeight="600" fill={Color.accent} letterSpacing="1">FITNESS</text>
        <rect x={nutX - 65} y={branchY - 14} width={130} height={28} rx={6} fill={`${Color.green}10`} stroke={Color.green} strokeWidth="1" strokeOpacity="0.4" />
        <text x={nutX} y={branchY + 4} textAnchor="middle" fontFamily={mono} fontSize="10" fontWeight="600" fill={Color.green} letterSpacing="1">NUTRITION</text>
        <line x1={fitX} y1={branchY + 14} x2={fitX} y2={branchY + 30} stroke={Color.faint} strokeWidth="1" />
        {fitness.map((g, gi) => {
          const gx = 100 + gi * 200
          const items = g.items
          return (
            <g key={g.name}>
              {gi === 0 && <line x1={100} y1={branchY + 30} x2={100 + (fitness.length - 1) * 200} y2={branchY + 30} stroke={Color.faint} strokeWidth="1" />}
              <line x1={gx} y1={branchY + 30} x2={gx} y2={groupY - 14} stroke={Color.faint} strokeWidth="1" />
              <rect x={gx - 75} y={groupY - 14} width={150} height={26} rx={5} fill={Color.surface} stroke={Color.borderSoft} strokeWidth="1" />
              <text x={gx} y={groupY + 3} textAnchor="middle" fontFamily={sans} fontSize="11" fontWeight="500" fill={Color.text}>{g.name}</text>
              <line x1={gx} y1={groupY + 12} x2={gx} y2={leafY0 - 8} stroke={Color.faint} strokeWidth="1" />
              {items.map((item, li) => {
                const ly = leafY0 + li * leafGap
                return (
                  <g key={item}>
                    <line x1={gx} y1={ly} x2={gx - 6} y2={ly} stroke={Color.faint} strokeWidth="1" />
                    <circle cx={gx - 6} cy={ly} r={2.5} fill={Color.accent} fillOpacity="0.5" />
                    <text x={gx + 4} y={ly + 3.5} fontFamily={mono} fontSize="9" fill={Color.dim}>{item}</text>
                  </g>
                )
              })}
              {items.length > 1 && <line x1={gx} y1={leafY0} x2={gx} y2={leafY0 + (items.length - 1) * leafGap} stroke={Color.faint} strokeWidth="1" />}
            </g>
          )
        })}
        <line x1={nutX} y1={branchY + 14} x2={nutX} y2={groupY - 8} stroke={Color.faint} strokeWidth="1" />
        {nutrition.map((item, i) => {
          const ly = groupY + i * leafGap
          return (
            <g key={item}>
              <line x1={nutX} y1={ly} x2={nutX - 6} y2={ly} stroke={Color.faint} strokeWidth="1" />
              <circle cx={nutX - 6} cy={ly} r={2.5} fill={Color.green} fillOpacity="0.5" />
              <text x={nutX + 4} y={ly + 3.5} fontFamily={mono} fontSize="9" fill={Color.dim}>{item}</text>
            </g>
          )
        })}
        {nutrition.length > 1 && <line x1={nutX} y1={groupY} x2={nutX} y2={groupY + (nutrition.length - 1) * leafGap} stroke={Color.faint} strokeWidth="1" />}
      </svg>
    </div>
  )
}

/* ── Decision tree SVG helpers ── */

function DTPill({ x, y, w, h, fill, label }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} />
      <text x={x} y={y + 4} textAnchor="middle" fontFamily={mono} fontSize="9" fontWeight="700" letterSpacing="0.8" fill="#111">{label}</text>
    </g>
  )
}

function DTLeaf({ x, y, color, name, goals, flow, track }) {
  const lines = []
  lines.push({ text: name, font: sans, size: 10, weight: '600', fill: Color.text })
  if (goals) lines.push({ text: goals, font: mono, size: 7.5, weight: '400', fill: Color.mute })
  lines.push({ text: flow, font: mono, size: 8, weight: '500', fill: color })
  if (track) lines.push({ text: `↻ ${track}`, font: mono, size: 7.5, weight: '400', fill: OBS_COLOR })
  return (
    <g>
      <line x1={x} y1={y} x2={x + 8} y2={y} stroke={Color.faint} strokeWidth="1" />
      <circle cx={x + 8} cy={y} r={3} fill={color} fillOpacity="0.5" />
      {lines.map((l, i) => (
        <text key={i} x={x + 16} y={y + 4 + i * 12} fontFamily={l.font} fontSize={l.size} fontWeight={l.weight} fill={l.fill}>{l.text}</text>
      ))}
    </g>
  )
}

/* ── Goal Decision Tree ── */
function GoalDecisionTree() {
  const fitColor = Phase.seed, nutColor = Phase.act, bothColor = Phase.decide
  const colL = 165, colC = 495, colR = 825
  const rootY = 28, classifyY = 80, dashY = 145, modeY = 205, subY0 = 270

  /* sub-goal data */
  const fitLeaves = [
    { name: 'Body Composition', goals: 'Hypertrophy · Fat Loss · Recomp', flow: 'Goals → TDEE++ → Calendar → Training', track: 'Check-in, Macro Heatmap' },
    { name: 'Performance', goals: 'Strength · Cardio · Power · Agility', flow: 'Goals → Calendar → Training', track: 'Check-in (PR focus)' },
    { name: 'Functional', goals: 'Flexibility · Balance · Wellness', flow: 'Goals → Light Schedule → Training', track: 'Check-in' },
  ]
  const bothLeaves = [
    { name: 'Exercise Pipeline', flow: 'Goals → TDEE → Calendar → Train → Track' },
    { name: 'Cooking Pipeline', flow: 'Macros → Meals → Prep → Cook → Log' },
    { name: 'Most Common', goals: '"Recomp + Cook More"', flow: 'All tracking surfaces active', track: 'Full dashboard' },
  ]
  const nutLeaves = [
    { name: 'Cook More / Healthier', flow: 'Macros → Meals → Batch → Shop → Cook', track: 'Food Log, Macro Heat' },
    { name: 'Save Money', flow: 'Meals → Batch → Shopping → Cook', track: 'Food Log' },
    { name: 'Improve Digestion', flow: 'Macros → Meals (filtered) → Cook', track: 'Food Log' },
    { name: 'Drink Water', flow: 'Water Tracking only', track: 'Water' },
  ]

  const leafGap = 52

  return (
    <div style={{ padding: '20px 60px' }}>
      <FLabel size={10} mb={12} letter={1.6}>GOAL DECISION TREE</FLabel>
      <svg width="100%" viewBox="0 0 990 540" fill="none" style={{ overflow: 'visible' }}>
        {/* ── Root node ── */}
        <SvgNode x={colC} y={rootY} w={160} h={36} label="GOAL SELECTION" sub="onboarding step 10" color={Color.text} />

        {/* ── Root → classify lines ── */}
        <line x1={colC} y1={rootY + 18} x2={colC} y2={rootY + 30} stroke={Color.faint} strokeWidth="1" />
        <line x1={colL} y1={rootY + 30} x2={colR} y2={rootY + 30} stroke={Color.faint} strokeWidth="1" />
        <line x1={colL} y1={rootY + 30} x2={colL} y2={classifyY - 18} stroke={Color.faint} strokeWidth="1" />
        <line x1={colC} y1={rootY + 30} x2={colC} y2={classifyY - 18} stroke={Color.faint} strokeWidth="1" />
        <line x1={colR} y1={rootY + 30} x2={colR} y2={classifyY - 18} stroke={Color.faint} strokeWidth="1" />

        {/* ── Classify row ── */}
        <SvgNode x={colL} y={classifyY} w={130} h={36} label="FITNESS" sub="yes · no" color={fitColor} />
        <SvgNode x={colC} y={classifyY} w={130} h={36} label="BOTH" sub="yes + yes" color={bothColor} />
        <SvgNode x={colR} y={classifyY} w={130} h={36} label="NUTRITION" sub="no · yes" color={nutColor} />

        {/* ── Classify → Dashboard lines ── */}
        <line x1={colL} y1={classifyY + 18} x2={colL} y2={dashY - 14} stroke={Color.faint} strokeWidth="1" />
        <line x1={colC} y1={classifyY + 18} x2={colC} y2={dashY - 14} stroke={Color.faint} strokeWidth="1" />
        <line x1={colR} y1={classifyY + 18} x2={colR} y2={dashY - 14} stroke={Color.faint} strokeWidth="1" />

        {/* ── Dashboard preset pills ── */}
        <text x={colC} y={dashY - 20} textAnchor="middle" fontFamily={mono} fontSize="7.5" fill={Color.mute} letterSpacing="1.2">DASHBOARD PRESET</text>
        <DTPill x={colL} y={dashY} w={130} h={24} fill={fitColor} label="Training Focus" />
        <DTPill x={colC} y={dashY} w={130} h={24} fill={bothColor} label="Balanced" />
        <DTPill x={colR} y={dashY} w={130} h={24} fill={nutColor} label="Nutrition Focus" />

        {/* ── Dashboard → Mode lines ── */}
        <line x1={colL} y1={dashY + 12} x2={colL} y2={modeY - 18} stroke={Color.faint} strokeWidth="1" />
        <line x1={colC} y1={dashY + 12} x2={colC} y2={modeY - 18} stroke={Color.faint} strokeWidth="1" />
        <line x1={colR} y1={dashY + 12} x2={colR} y2={modeY - 18} stroke={Color.faint} strokeWidth="1" />

        {/* ── Mode badges ── */}
        <text x={colC} y={modeY - 24} textAnchor="middle" fontFamily={mono} fontSize="7.5" fill={Color.mute} letterSpacing="1.2">ACTIVE MODES</text>
        <SvgNode x={colL} y={modeY} w={130} h={32} label="EXERCISE" sub="Mode" color={fitColor} r={8} />
        {/* Both: two side-by-side badges */}
        <SvgNode x={colC - 52} y={modeY} w={100} h={32} label="EXERCISE" sub="" color={fitColor} r={8} />
        <SvgNode x={colC + 52} y={modeY} w={100} h={32} label="COOKING" sub="" color={nutColor} r={8} />
        <SvgNode x={colR} y={modeY} w={130} h={32} label="COOKING" sub="Mode" color={nutColor} r={8} />

        {/* ── Mode → Sub-goals lines ── */}
        <line x1={colL} y1={modeY + 16} x2={colL} y2={subY0 - 10} stroke={Color.faint} strokeWidth="1" />
        <line x1={colC} y1={modeY + 16} x2={colC} y2={subY0 - 10} stroke={Color.faint} strokeWidth="1" />
        <line x1={colR} y1={modeY + 16} x2={colR} y2={subY0 - 10} stroke={Color.faint} strokeWidth="1" />

        {/* ── Sub-goal label ── */}
        <text x={colL} y={subY0 - 16} textAnchor="middle" fontFamily={mono} fontSize="7.5" fill={Color.mute} letterSpacing="1">SUB-GOALS → SCREEN FLOW</text>
        <text x={colC} y={subY0 - 16} textAnchor="middle" fontFamily={mono} fontSize="7.5" fill={Color.mute} letterSpacing="1">DUAL PIPELINE</text>
        <text x={colR} y={subY0 - 16} textAnchor="middle" fontFamily={mono} fontSize="7.5" fill={Color.mute} letterSpacing="1">SUB-GOALS → PIPELINE</text>

        {/* ── Left column: Fitness sub-goals ── */}
        <line x1={colL - 75} y1={subY0} x2={colL - 75} y2={subY0 + (fitLeaves.length - 1) * leafGap} stroke={Color.faint} strokeWidth="1" />
        {fitLeaves.map((leaf, i) => (
          <DTLeaf key={leaf.name} x={colL - 75} y={subY0 + i * leafGap} color={fitColor} {...leaf} />
        ))}

        {/* ── Center column: Both sub-goals ── */}
        <line x1={colC - 75} y1={subY0} x2={colC - 75} y2={subY0 + (bothLeaves.length - 1) * leafGap} stroke={Color.faint} strokeWidth="1" />
        {bothLeaves.map((leaf, i) => (
          <DTLeaf key={leaf.name} x={colC - 75} y={subY0 + i * leafGap} color={bothColor} {...leaf} />
        ))}

        {/* ── Right column: Nutrition sub-goals ── */}
        <line x1={colR - 75} y1={subY0} x2={colR - 75} y2={subY0 + (nutLeaves.length - 1) * leafGap} stroke={Color.faint} strokeWidth="1" />
        {nutLeaves.map((leaf, i) => (
          <DTLeaf key={leaf.name} x={colR - 75} y={subY0 + i * leafGap} color={nutColor} {...leaf} />
        ))}
      </svg>
    </div>
  )
}

/* ── Act/Observe Pipeline ── */
function ActObserveDiagram() {
  const actColor = Phase.act, obsColor = Phase.observe
  const midX = 495, actX = 220, obsX = 770
  const nodeW = 180, nodeH = 36

  return (
    <div style={{ padding: '20px 60px' }}>
      <FLabel size={10} mb={12} letter={1.6}>ACT / OBSERVE PIPELINE</FLabel>
      <svg width="100%" viewBox="0 0 990 280" fill="none">
        <rect x={actX - 55} y={10} width={110} height={30} rx={6} fill={`${actColor}10`} stroke={actColor} strokeWidth="1.5" strokeOpacity="0.4" />
        <text x={actX} y={29} textAnchor="middle" fontFamily={mono} fontSize="11" fontWeight="600" fill={actColor} letterSpacing="1.2">ACT</text>
        <text x={actX} y={55} textAnchor="middle" fontFamily={mono} fontSize="8" fill={Color.mute} letterSpacing="1">ML INTERVENTIONS</text>
        {INTERVENTIONS.map((int, i) => {
          const iy = 80 + i * (nodeH + 12)
          return (
            <g key={int.label}>
              <rect x={actX - nodeW / 2} y={iy} width={nodeW} height={nodeH} rx={8} fill={Color.surface} stroke={Color.borderSoft} strokeWidth="1" />
              <circle cx={actX - nodeW / 2 + 18} cy={iy + nodeH / 2} r={5} fill={`${actColor}30`} />
              <text x={actX - nodeW / 2 + 32} y={iy + 14} fontFamily={mono} fontSize="10" fontWeight="500" fill={Color.text}>{int.label}</text>
              <text x={actX - nodeW / 2 + 32} y={iy + 28} fontFamily={mono} fontSize="8" fill={Color.mute}>{int.desc}</text>
            </g>
          )
        })}
        <SvgArrow x1={actX + nodeW / 2 + 20} y1={130} x2={obsX - nodeW / 2 - 20} y2={130} color={Color.faint} />
        <text x={midX} y={118} textAnchor="middle" fontFamily={mono} fontSize="9" fill={Color.mute} letterSpacing="1">USER EXECUTES</text>
        <text x={midX} y={148} textAnchor="middle" fontFamily={mono} fontSize="8" fill={Color.faint} letterSpacing="0.8">workouts, meals, check-ins</text>
        <rect x={obsX - 55} y={10} width={110} height={30} rx={6} fill={`${obsColor}10`} stroke={obsColor} strokeWidth="1.5" strokeOpacity="0.4" />
        <text x={obsX} y={29} textAnchor="middle" fontFamily={mono} fontSize="11" fontWeight="600" fill={obsColor} letterSpacing="1.2">OBSERVE</text>
        <text x={obsX} y={55} textAnchor="middle" fontFamily={mono} fontSize="8" fill={Color.mute} letterSpacing="1">DATA CHANNELS</text>
        {OBSERVATION_CHANNELS.map((ch, i) => {
          const iy = 70 + i * (nodeH + 10)
          return (
            <g key={ch.label}>
              <rect x={obsX - nodeW / 2} y={iy} width={nodeW} height={nodeH} rx={8} fill={Color.surface} stroke={Color.borderSoft} strokeWidth="1" />
              <circle cx={obsX - nodeW / 2 + 18} cy={iy + nodeH / 2} r={5} fill={`${obsColor}30`} />
              <text x={obsX - nodeW / 2 + 32} y={iy + 14} fontFamily={mono} fontSize="10" fontWeight="500" fill={Color.text}>{ch.label}</text>
              <text x={obsX - nodeW / 2 + 32} y={iy + 28} fontFamily={mono} fontSize="8" fill={Color.mute}>{ch.desc}</text>
            </g>
          )
        })}
        <path
          d={`M ${obsX + nodeW / 2 + 10} ${130} Q ${obsX + nodeW / 2 + 60} ${130}, ${obsX + nodeW / 2 + 60} ${250} L 50 ${250} Q 20 ${250}, 20 ${230} L 20 ${200}`}
          stroke={Color.faint} strokeWidth="1" strokeDasharray="4 3" fill="none"
          markerEnd="url(#loopArrow2)"
        />
        <defs>
          <marker id="loopArrow2" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill={Color.faint} />
          </marker>
        </defs>
        <text x={midX} y={244} textAnchor="middle" fontFamily={mono} fontSize="9" fill={Color.mute} letterSpacing="1.5">UPDATES USER STATE &rarr; FEEDS BACK TO DECIDE</text>
      </svg>
    </div>
  )
}

/* ── Mode navigation card ── */
function ModeCard({ to, label, color, icon, flows, phases }) {
  let builtCount, totalCount
  if (flows) {
    builtCount = Object.values(flows).reduce((sum, f) => sum + f.screens.filter(s => s.id).length, 0)
    totalCount = Object.values(flows).reduce((sum, f) => sum + f.screens.length, 0)
  } else if (phases) {
    builtCount = phases.reduce((sum, p) => sum + p.screens.filter(s => s.C).length, 0)
    totalCount = phases.reduce((sum, p) => sum + p.screens.length, 0)
  }

  return (
    <Link to={to} style={{
      flex: 1, minWidth: 280, textDecoration: 'none', color: 'inherit',
      background: Color.surface, borderRadius: 20,
      border: `2px solid ${color}30`,
      padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16,
      transition: 'border-color 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = 'translateY(0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}12`, display: 'grid', placeItems: 'center',
        }}>
          <FIcon path={icon} size={22} color={color} stroke={1.5} />
        </div>
        <div>
          <FMono size={12} color={color} letter={1.8}>{label}</FMono>
          <div style={{ fontSize: 14, color: Color.dim, marginTop: 2 }}>{builtCount} of {totalCount} screens built</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {flows ? Object.entries(flows).map(([key, flow]) => (
          <FTag key={key} tone={key === 'create' ? 'green' : key === 'edit' ? 'accent' : 'red'} size="sm">
            {flow.label} ({flow.screens.length})
          </FTag>
        )) : phases?.map(p => (
          <FTag key={p.id} tone="mute" size="sm">
            {p.phase} ({p.screens.length})
          </FTag>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: Font.mono, fontSize: 11, color, letterSpacing: 0.6,
      }}>
        View screens
        <FIcon path={ICONS.fwd} size={14} color={color} stroke={1.5} />
      </div>
    </Link>
  )
}

/* ── Main ── */

export default function JourneyHub() {
  return (
    <div>
      <SODALoop />
      <DataModelDiagram />
      <GoalTaxonomyDiagram />
      <GoalDecisionTree />
      <ActObserveDiagram />

      {/* Mode navigation */}
      <div style={{ padding: '30px 60px 10px' }}>
        <div style={{ borderTop: `1px solid ${Color.border}`, paddingTop: 24 }}>
          <FLabel size={10} mb={16} letter={1.6}>ALL MODES</FLabel>
        </div>
      </div>
      <div style={{ padding: '0 60px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        <ModeCard to="/journey/seed" label="SEED" color={SEED_COLOR} icon={ICONS.person} phases={SEED_PHASES} />
        <ModeCard to="/journey/decide" label="DECIDE" color={DECIDE_COLOR} icon={ICONS.sparkle} phases={DECIDE_PHASES} />
        <ModeCard to="/journey/cooking" label="COOKING" color={COOKING_COLOR} icon={ICONS.meal} flows={COOKING_FLOWS} />
        <ModeCard to="/journey/exercise" label="EXERCISE" color={EXERCISE_COLOR} icon={ICONS.dumb} flows={EXERCISE_FLOWS} />
        <ModeCard to="/journey/observe" label="OBSERVE" color={OBSERVE_COLOR} icon={ICONS.chart} phases={OBSERVE_PHASES} />
      </div>

      {/* Tools */}
      <div style={{ padding: '0 60px 10px' }}>
        <div style={{ borderTop: `1px solid ${Color.border}`, paddingTop: 24 }}>
          <FLabel size={10} mb={16} letter={1.6}>EXPLORATION TOOLS</FLabel>
        </div>
      </div>
      <div style={{ padding: '0 60px 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/journey/goals" style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '20px 28px', borderRadius: 16,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          textDecoration: 'none', color: 'inherit',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = Color.purple}
        onMouseLeave={e => e.currentTarget.style.borderColor = Color.borderSoft}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[Color.accent, Color.green, Color.blue, Color.purple, Color.amber].map(c => (
              <div key={c} style={{ width: 8, height: 8, borderRadius: 4, background: c }} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <FMono size={11} color={Color.purple} letter={1.4}>GOAL NETWORK</FMono>
            <div style={{ fontSize: 13, color: Color.dim, marginTop: 2 }}>
              Interactive graph — how goals drive training modalities, caloric states, and meal prep
            </div>
          </div>
          <FIcon path={ICONS.fwd} size={16} color={Color.mute} />
        </Link>

        <Link to="/journey/explore" style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '20px 28px', borderRadius: 16,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          textDecoration: 'none', color: 'inherit',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = Color.purple}
        onMouseLeave={e => e.currentTarget.style.borderColor = Color.borderSoft}>
          <FIcon path={ICONS.search} size={18} color={Color.purple} />
          <div style={{ flex: 1 }}>
            <FMono size={11} color={Color.purple} letter={1.4}>ONTOLOGY EXPLORER</FMono>
            <div style={{ fontSize: 13, color: Color.dim, marginTop: 2 }}>
              Scenario planner, exercise library, and goal deep-dives — fitness.md as a living tool
            </div>
          </div>
          <FIcon path={ICONS.fwd} size={16} color={Color.mute} />
        </Link>
      </div>
    </div>
  )
}
