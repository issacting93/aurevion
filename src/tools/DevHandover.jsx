/* DevHandover — Storybook-like developer reference for Aurevion fitness app.
   Three-mode layout: Screens | Components | Tokens
   Sidebar (300px) + scrollable main content. */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'
import { Color, Font, Space, Radius, Shadow, Duration, Ease, Type } from '../ui/tokens'
import { Card, Button, IconButton, Tag, Row, ProgressBar, ProgressRing, MetricDisplay, Avatar, Divider, FilterGroup, Section, StepIndicator, Skeleton, EmptyState, Tooltip, ExpandablePanel } from './primitives'
import { ICONS, Phone, FNavBar, FLabel, FMono, FNum, FTexBar, FScale, FIcon, FTag, FBtn, FTabBar, FSection, FToolbar, FStagger } from '../ui/components'
import { MacroBlock, MacroRow, ShoppingRow, SetTracker, RecipeCard, InfoRow, CookStatus, MealListItem, UpNextCard, WeekPlanSummary, ExerciseTimeline } from './domain'
import { LineChart } from '../ui/chart'
import { SCREEN_ANATOMY, COMPONENT_CATALOG, SCREEN_STATES } from './handover-manifest'
import { UserProvider } from '../context/UserContext'
import { MOCK_PROFILE, MOCK_TARGETS, MOCK_WORKOUT_PLAN, MOCK_ACTIVITY_LOG, MOCK_CHECKINS, MOCK_MEAL_PREP } from '../context/mockUser'

const DEMO_USER_STATE = {
  profile: MOCK_PROFILE,
  targets: MOCK_TARGETS,
  workoutPlan: MOCK_WORKOUT_PLAN,
  activityLog: MOCK_ACTIVITY_LOG,
  checkins: MOCK_CHECKINS,
  mealPrepApproach: MOCK_MEAL_PREP,
  onboarded: true,
  interventions: [],
  preferences: { layout: 'balanced' },
}

const EMPTY_USER_STATE = {
  profile: null, targets: null, workoutPlan: null,
  mealPrepApproach: null, onboarded: false,
  activityLog: [], checkins: [], interventions: [],
  preferences: { layout: 'balanced' },
}

const ALL_DONE_PLAN = {
  ...MOCK_WORKOUT_PLAN,
  sessions: MOCK_WORKOUT_PLAN.sessions.map(s => ({ ...s, completed: true })),
  schedule: MOCK_WORKOUT_PLAN.schedule.map(s => s.isRest ? s : { ...s, completed: true }),
}

/* Map (screenId, stateKey) → UserProvider override data.
   States marked (B) in the audit are component-internal and just return default. */
function getStateData(screenId, stateKey) {
  if (stateKey === 'default') return DEMO_USER_STATE

  // ── Universal empty / not-onboarded states ──
  if (['empty', 'no-plan', 'no-contract', 'empty-month'].includes(stateKey))
    return EMPTY_USER_STATE

  // ── All-done / complete states ──
  if (['complete', 'all-done', 'all-checked'].includes(stateKey))
    return { ...DEMO_USER_STATE, workoutPlan: ALL_DONE_PLAN }

  // ── Screen-specific data states ──
  switch (`${screenId}:${stateKey}`) {
    // Dashboard — over target
    case 'dash-nut:over-target':
      return { ...DEMO_USER_STATE, targets: { ...MOCK_TARGETS, target: MOCK_TARGETS.tdee + 200 } }

    // Dashboard — rest day (make today a rest day in schedule)
    case 'dash-trn:rest-day': {
      const todayIdx = (new Date().getDay() + 6) % 7
      return {
        ...DEMO_USER_STATE,
        workoutPlan: {
          ...MOCK_WORKOUT_PLAN,
          schedule: MOCK_WORKOUT_PLAN.schedule.map(s =>
            s.dayIndex === todayIdx ? { id: s.id, day: s.day, dayIndex: s.dayIndex, isRest: true } : s
          ),
        },
      }
    }

    // Program overview — mid-week is already the default data
    case 'train-prog:mid-week':
      return DEMO_USER_STATE

    // Macros — deficit high
    case 'macro-a:deficit-high':
      return { ...DEMO_USER_STATE, targets: { ...MOCK_TARGETS, target: Math.round(MOCK_TARGETS.tdee * 0.7), protein: 200, carbs: 160, fat: 45 } }

    // Macros — surplus
    case 'macro-a:surplus':
      return { ...DEMO_USER_STATE, targets: { ...MOCK_TARGETS, target: MOCK_TARGETS.tdee + 300, protein: 165, carbs: 340, fat: 70 } }

    // Plan day — rest day
    case 'plan-d:rest-day': {
      const todayIdx2 = (new Date().getDay() + 6) % 7
      return {
        ...DEMO_USER_STATE,
        workoutPlan: {
          ...MOCK_WORKOUT_PLAN,
          schedule: MOCK_WORKOUT_PLAN.schedule.map(s =>
            s.dayIndex === todayIdx2 ? { id: s.id, day: s.day, dayIndex: s.dayIndex, isRest: true } : s
          ),
        },
      }
    }

    // Workout history — empty
    case 'wk-history:empty':
      return { ...DEMO_USER_STATE, activityLog: [] }

    // Plan week — all done
    case 'plan-w:all-done':
      return { ...DEMO_USER_STATE, workoutPlan: ALL_DONE_PLAN }

    default:
      return DEMO_USER_STATE
  }
}

const merge = (...o) => Object.assign({}, ...o)

/* ── Helpers ─────────────────────────────────────────────────── */

function Mono({ children, color = Color.text }) {
  return <span style={{ fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.4, color, textTransform: 'uppercase' }}>{children}</span>
}

function PhoneScaler({ children }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => {
      const avail = Math.max(420, window.innerHeight - 160)
      setScale(Math.min(1, avail / 874))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>{children}</div>
}

/* ── Anatomy Tree ────────────────────────────────────────────── */

function collectComponentNames(node, set = new Set()) {
  if (!node) return set
  if (node.component) set.add(node.component)
  if (node.children) node.children.forEach(c => collectComponentNames(c, set))
  return set
}

function AnatomyTree({ tree }) {
  if (!tree) return null
  return (
    <div style={{ fontFamily: Font.mono, fontSize: 0 }}>
      <AnatomyNode node={tree} depth={0} isLast={true} parentPrefixes={[]} />
    </div>
  )
}

function AnatomyNode({ node, depth, isLast, parentPrefixes }) {
  const indent = depth * 20
  const propsStr = node.props
    ? Object.entries(node.props).map(([k, v]) => `${k}=${typeof v === 'string' ? `"${v}"` : v}`).join(' ')
    : ''

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 24 }}>
        {/* Connector lines */}
        <div style={{ width: indent, flexShrink: 0, position: 'relative' }}>
          {parentPrefixes.map((showLine, i) => (
            showLine ? (
              <div key={i} style={{ position: 'absolute', left: i * 20 + 8, top: 0, bottom: 0, width: 1, background: Color.faint }} />
            ) : null
          ))}
          {depth > 0 && (
            <>
              {!isLast && <div style={{ position: 'absolute', left: (depth - 1) * 20 + 8, top: 0, bottom: 0, width: 1, background: Color.faint }} />}
              <div style={{ position: 'absolute', left: (depth - 1) * 20 + 8, top: 0, height: 12, width: 1, background: Color.faint }} />
              <div style={{ position: 'absolute', left: (depth - 1) * 20 + 8, top: 12, width: 10, height: 1, background: Color.faint }} />
            </>
          )}
        </div>
        {/* Node content */}
        <div style={{ flex: 1, minWidth: 0, padding: '3px 0' }}>
          <span style={merge(Type.dataMd, { color: Color.accent })}>{node.component}</span>
          {propsStr && <span style={merge(Type.dataSm, { color: Color.faint, marginLeft: 8 })}>{propsStr}</span>}
          {node.note && <div style={merge(Type.dataSm, { color: Color.mute, fontStyle: 'italic', marginTop: 2 })}>{node.note}</div>}
        </div>
      </div>
      {node.children && node.children.map((child, i) => (
        <AnatomyNode
          key={i}
          node={child}
          depth={depth + 1}
          isLast={i === node.children.length - 1}
          parentPrefixes={[...parentPrefixes, depth > 0 && !isLast]}
        />
      ))}
    </div>
  )
}

/* ── Props Table ─────────────────────────────────────────────── */

function PropsTable({ props }) {
  if (!props || props.length === 0) return null
  return (
    <div style={{ overflow: 'hidden', borderRadius: Radius.lg, border: `1px solid ${Color.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: Font.sans }}>
        <thead>
          <tr style={{ background: Color.surface }}>
            {['PROP', 'TYPE', 'DEFAULT', 'DESCRIPTION'].map(h => (
              <th key={h} style={merge(Type.labelSm, { color: Color.mute, textAlign: 'left', padding: '10px 16px', borderBottom: `1px solid ${Color.borderSoft}` })}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${Color.borderSoft}` }}>
              <td style={merge(Type.dataMd, { color: Color.accent, padding: '10px 16px', fontFamily: Font.mono })}>{p.name}</td>
              <td style={merge(Type.dataSm, { color: Color.dim, padding: '10px 16px' })}>{p.type}</td>
              <td style={{ padding: '10px 16px' }}>
                {p.default !== '-' ? (
                  <span style={merge(Type.dataSm, { color: Color.text, background: Color.surface2, borderRadius: 4, padding: '2px 6px' })}>{p.default}</span>
                ) : (
                  <span style={merge(Type.dataSm, { color: Color.faint })}>-</span>
                )}
              </td>
              <td style={merge(Type.bodySm, { color: Color.dim, padding: '10px 16px' })}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Example Renderers ───────────────────────────────────────── */

const EXAMPLE_RENDERERS = {
  'card-variants': () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {['surface', 'elevated', 'outlined', 'ghost'].map(v => (
        <Card key={v} variant={v} padding={16}><Mono color={Color.mute}>{v.toUpperCase()}</Mono><div style={merge(Type.bodyMd, { marginTop: 8 })}>Card content</div></Card>
      ))}
    </div>
  ),
  'card-states': () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Card selected padding={16}><Mono color={Color.mute}>SELECTED</Mono></Card>
      <Card disabled padding={16}><Mono color={Color.mute}>DISABLED</Mono></Card>
      <Card onClick={() => {}} padding={16}><Mono color={Color.mute}>INTERACTIVE</Mono></Card>
    </div>
  ),
  'button-variants': () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  'button-sizes': () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  'button-states': () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button fullWidth>Full Width</Button>
    </div>
  ),
  'icon-button-variants': () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton variant="ghost" label="Close"><FIcon path={ICONS.close} size={16} /></IconButton>
      <IconButton variant="secondary" label="Add"><FIcon path={ICONS.plus} size={16} /></IconButton>
      <IconButton variant="primary" label="Play"><FIcon path={ICONS.play} size={16} /></IconButton>
    </div>
  ),
  'tag-tones': () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag tone="neutral">Neutral</Tag><Tag tone="accent">Accent</Tag><Tag tone="green">Green</Tag>
      <Tag tone="red">Red</Tag><Tag tone="blue">Blue</Tag><Tag tone="solid">Solid</Tag>
    </div>
  ),
  'row-variants': () => (
    <div style={{ maxWidth: 400 }}>
      <Row title="Standard row" subtitle="With subtitle" trailing={<Mono color={Color.mute}>VALUE</Mono>} />
      <Row title="With leading" leading={<Avatar initials="A" size={28} tone="warm" />} subtitle="Avatar leading" />
      <Row title="Checkable row" subtitle="Toggle me" checked={false} onToggle={() => {}} />
      <Row title="Checked + done" checked={true} onToggle={() => {}} />
    </div>
  ),
  'progress-bar-variants': () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <div><Mono color={Color.mute}>STANDARD</Mono><ProgressBar value={72} animated style={{ marginTop: 8 }} /></div>
      <div><Mono color={Color.mute}>COMPLETE</Mono><ProgressBar value={100} animated style={{ marginTop: 8 }} /></div>
      <div><Mono color={Color.mute}>TEXTURED</Mono><ProgressBar value={45} variant="textured" height={12} animated style={{ marginTop: 8 }} /></div>
      <div><Mono color={Color.mute}>SEGMENTED</Mono><ProgressBar value={60} variant="segmented" animated style={{ marginTop: 8 }} /></div>
    </div>
  ),
  'progress-ring-variants': () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <ProgressRing value={72} animated><span style={merge(Type.dataMd, { color: Color.accent })}>72%</span></ProgressRing>
      <ProgressRing value={100} size={60} strokeWidth={4} animated />
      <ProgressRing value={30} size={50} color={Color.red} animated />
    </div>
  ),
  'metric-display-variants': () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      <MetricDisplay value="2,200" unit="kcal" label="DAILY INTAKE" size="lg" />
      <MetricDisplay value="-480" unit="kcal" label="DEFICIT" tone="accent" />
      <MetricDisplay value="147" unit="g" label="PROTEIN" tone="green" size="sm" />
    </div>
  ),
  'filter-group-demo': () => {
    return <FilterGroup options={[{value:'a',label:'All'},{value:'b',label:'Active',count:3},{value:'c',label:'Done'}]} value="a" onChange={() => {}} />
  },
  'avatar-tones': () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar initials="ZM" tone="warm" size={56} />
      <Avatar initials="AU" tone="cool" />
      <Avatar initials="T" tone="neutral" size={28} />
    </div>
  ),
  'skeleton-shapes': () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Skeleton width={200} height={14} />
      <Skeleton width={100} height={24} radius={8} />
      <Skeleton circle height={40} />
    </div>
  ),
  'divider-variants': () => (
    <div style={{ maxWidth: 400 }}>
      <Divider />
      <div style={{ height: 8 }} />
      <Divider label="OR" />
    </div>
  ),
  'step-indicator-demo': () => (
    <StepIndicator steps={[
      { label: 'Set your goal', state: 'done' },
      { label: 'Build the model', sublabel: 'TDEE + macros', state: 'active' },
      { label: 'Plan the week', state: 'upcoming' },
      { label: 'Execute', state: 'upcoming' },
    ]} />
  ),
  'phone-demo': () => (
    <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left', height: 310 }}>
      <Phone><div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Color.mute }}>Content area</div></Phone>
    </div>
  ),
  'fnavbar-demo': () => (
    <div style={{ background: Color.surface, borderRadius: 12, overflow: 'hidden', maxWidth: 402 }}>
      <FNavBar title="SCREEN TITLE" leading={<FBtn variant="ghost" size="sm" icon={ICONS.back} />} trailing={<FBtn variant="ghost" size="sm" icon={ICONS.more} />} />
    </div>
  ),
  'fbtn-variants': () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <FBtn variant="primary">Primary</FBtn>
      <FBtn variant="secondary">Secondary</FBtn>
      <FBtn variant="ghost">Ghost</FBtn>
    </div>
  ),
  'fbtn-special': () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 402 }}>
      <FBtn variant="split" full>Split Action</FBtn>
    </div>
  ),
  'fnum-sizes': () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'baseline' }}>
      <FNum size={68} unit="kcal">2,420</FNum>
      <FNum size={42}>15.0</FNum>
      <FNum size={28} color={Color.accent}>+12</FNum>
    </div>
  ),
  'ftexbar-demo': () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <FTexBar pct={72} /><FTexBar pct={45} height={10} /><FTexBar pct={90} color={Color.green} />
    </div>
  ),
  'fsegbar-demo': () => (
    <div style={{ maxWidth: 400 }}><FTexBar pct={65} height={40} /></div>
  ),
  'ftabbar-demo': () => (
    <div style={{ maxWidth: 402 }}><FTabBar active={2} /></div>
  ),
  'ftoolbar-demo': () => (
    <div style={{ maxWidth: 402 }}>
      <FToolbar cells={[
        { icon: ICONS.pause, label: 'Pause' },
        { icon: ICONS.fire, label: 'Cook mode', primary: true },
        { icon: ICONS.more, label: 'More' },
      ]} />
    </div>
  ),
  'fjewel-demo': () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <FBtn variant="primary">Start Session</FBtn>
    </div>
  ),
  'fpulsebtn-demo': () => (
    <div style={{ padding: 20 }}><FBtn variant="ghost" size="sm">Pulse</FBtn></div>
  ),
  'flabel-demo': () => (
    <div><FLabel>Default label</FLabel><FLabel color={Color.accent} size={12}>Accent label</FLabel></div>
  ),
  'ficon-grid': () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {Object.entries(ICONS).slice(0, 20).map(([name, path]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 48 }}>
          <FIcon path={path} size={20} color={Color.dim} />
          <span style={merge(Type.dataSm, { color: Color.faint })}>{name}</span>
        </div>
      ))}
    </div>
  ),
  'macro-block-demo': () => <MacroRow protein={147} carbs={160} fat={60} />,
  'recipe-card-demo': () => (
    <div style={{ maxWidth: 380 }}>
      <RecipeCard tag="batch cook" name="Chicken rice bowls" portions={5} estTime="48m"
        macros={{ p: 48, c: 62, f: 12 }} ingredients={['1kg Chicken Breast', '500g Jasmine Rice', 'Broccoli', 'Soy']} />
    </div>
  ),
  'set-tracker-demo': () => (
    <div style={{ maxWidth: 400 }}>
      <SetTracker exercise="Back squat" category="PRIMARY" prescription="4 x 6 @ 102KG"
        sets={[{reps:6,weight:'102KG'},{reps:6,weight:'102KG'},{reps:6,weight:'102KG'},{reps:6,weight:'102KG'}]}
        currentSet={2} detail="4 x 6 · 16 MIN · QUADS · GLUTES · RPE 8" onComplete={() => {}} onSkip={() => {}} />
    </div>
  ),
  'shopping-row-demo': () => (
    <div style={{ maxWidth: 400 }}>
      <ShoppingRow name="Salmon fillet" need={4} have={0} onAdd={() => {}} addLabel="+4" />
      <ShoppingRow name="Chicken breast" need={1.6} have={0} onAdd={() => {}} addLabel="+1.6 kg" />
      <ShoppingRow name="Firm tofu" need={2} have={1} onAdd={() => {}} addLabel="+1 block" />
    </div>
  ),
  'line-chart-demo': () => (
    <div style={{ maxWidth: 500 }}>
      <LineChart data={[2100, 2250, 2180, 2300, 2150, 2200, 2280, 2350, 2200, 2420]}
        title="12-WEEK TRAJECTORY" titleValue="2,200" titleUnit="kcal"
        xLabels={['W-12', '', '', 'W-8', '', '', 'W-4', '', '', 'NOW']}
        target={2200} height={160} />
    </div>
  ),
  'calendar-month-demo': () => <div style={merge(Type.bodySm, { color: Color.mute, padding: 20 })}>CalendarMonth requires dates array — see system/calendar.jsx for API</div>,
  'calendar-week-demo': () => <div style={merge(Type.bodySm, { color: Color.mute, padding: 20 })}>CalendarWeek requires days array — see system/calendar.jsx for API</div>,
  'calendar-day-demo': () => <div style={merge(Type.bodySm, { color: Color.mute, padding: 20 })}>CalendarDay requires date + events — see system/calendar.jsx for API</div>,

  // ── New domain components ──
  'info-row-demo': () => (
    <div style={{ maxWidth: 440 }}>
      <InfoRow label="WEEKLY TRAINING" value="5.5" unit="hr" />
      <InfoRow label="DAILY DEFICIT" value="-480" unit="kcal" tag="-18% TDEE" tagTone="accent" />
      <InfoRow label="PROTEIN FLOOR" value="147" unit="g" />
      <InfoRow label="SLEEP" value="7.1" unit="hr" tag="ON TARGET" tagTone="green" />
    </div>
  ),
  'cook-status-demo': () => (
    <div style={{ maxWidth: 440 }}>
      <CookStatus recipe="RICE BOWLS" step="Simmer rice — covered, low heat" totalTime="16 MIN" remaining="10:24" mode="PASSIVE" />
    </div>
  ),
  'meal-list-item-demo': () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <MealListItem badge="A" name="Garlic salmon · greens" time="7 PM" day="MON" kcal={540} macros={{ p: 42, c: 28, f: 22 }} />
      <MealListItem badge="B" name="Chicken rice bowls" time="1 PM" day="TUE" kcal={620} macros={{ p: 55, c: 64, f: 14 }} batch />
      <MealListItem badge="C" name="Tofu stir-fry" time="7 PM" day="WED" kcal={480} macros={{ p: 28, c: 52, f: 12 }} />
    </div>
  ),
  'up-next-card-demo': () => (
    <div style={{ maxWidth: 440 }}>
      <UpNextCard time="17:30" label="Strength · Push" onStart={() => {}} />
    </div>
  ),
  'week-plan-summary-demo': () => (
    <div style={{ maxWidth: 440 }}>
      <WeekPlanSummary meals={14} batches={3} days={[2, 2, 2, 2, 2, 0, 0]} />
    </div>
  ),
  'exercise-timeline-demo': () => (
    <div style={{ maxWidth: 440 }}>
      <ExerciseTimeline exercises={[
        { name: 'Goblet squat', subtitle: 'ACTIVATION · 2 x 8', state: 'done' },
        { name: 'Back squat', subtitle: 'PRIMARY · 4 x 6 @ 102KG', state: 'active' },
        { name: 'Romanian deadlift', subtitle: 'POSTERIOR · 3 x 8', state: 'idle' },
      ]} />
    </div>
  ),
}

/* ── Token Display Helpers ───────────────────────────────────── */

function Swatch({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: 6, background: color, border: `1px solid ${Color.border}`, flexShrink: 0 }} />
      <div>
        <div style={merge(Type.bodySm, { color: Color.text })}>{label}</div>
        <div style={merge(Type.dataSm, { color: Color.mute })}>{color}</div>
      </div>
    </div>
  )
}

function TypeSample({ name, preset }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 4 })}>{name}</div>
      <div style={merge(preset, { color: Color.text })}>{preset.textTransform === 'uppercase' ? 'SAMPLE LABEL' : 'The quick brown fox'}</div>
      <div style={merge(Type.dataSm, { color: Color.faint, marginTop: 2 })}>{preset.fontSize}px / {preset.fontWeight} / {preset.letterSpacing}ls</div>
    </div>
  )
}

/* ── Sidebar Components ──────────────────────────────────────── */

function ScreensSidebar({ screens, idx, onSelect }) {
  const grouped = []
  let lastFeature = null
  screens.forEach((s, i) => {
    if (s.feature !== lastFeature) {
      grouped.push({ type: 'header', feature: s.feature, flow: s.flow, count: screens.filter(x => x.feature === s.feature).length })
      lastFeature = s.feature
    }
    grouped.push({ type: 'item', screen: s, index: i })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {grouped.map((g, i) => {
        if (g.type === 'header') {
          return (
            <div key={`h-${i}`} style={{ padding: '16px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Mono color={Color.mute}>{g.flow} · {g.feature.toUpperCase()}</Mono>
              <span style={merge(Type.dataSm, { color: Color.faint })}>{g.count}</span>
            </div>
          )
        }
        const active = g.index === idx
        return (
          <button key={g.screen.id} onClick={() => onSelect(g.index)}
            style={{
              display: 'block', width: '100%', textAlign: 'left', background: active ? Color.accentDim : 'transparent',
              border: 'none',
              padding: '8px 16px', cursor: 'pointer', color: active ? Color.text : Color.dim,
              fontFamily: Font.sans, fontSize: 13, fontWeight: active ? 500 : 400,
              transition: `background ${Duration.normal} ${Ease.default}`,
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
          >
            {g.screen.label}
          </button>
        )
      })}

      {/* Keyboard shortcuts */}
      <div style={{ padding: '24px 16px 16px', marginTop: 'auto' }}>
        <Mono color={Color.faint}>KEYBOARD</Mono>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['Arrow Right / Space', 'Next screen'], ['Arrow Left', 'Previous screen']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={merge(Type.dataSm, { color: Color.dim })}>{l}</span>
              <span style={merge(Type.dataSm, { color: Color.faint, fontFamily: Font.mono })}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ComponentsSidebar({ catalog, selectedId, onSelect }) {
  const LAYER_ORDER = ['primitive', 'feature', 'domain', 'chart', 'calendar']
  const LAYER_LABELS = { primitive: 'Primitives', feature: 'Feature', domain: 'Domain', chart: 'Chart', calendar: 'Calendar' }
  const [collapsed, setCollapsed] = useState({})

  const toggleLayer = (layer) => setCollapsed(prev => ({ ...prev, [layer]: !prev[layer] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {LAYER_ORDER.map(layer => {
        const items = catalog.filter(c => c.layer === layer)
        if (items.length === 0) return null
        const isCollapsed = collapsed[layer]
        return (
          <div key={layer}>
            <button onClick={() => toggleLayer(layer)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 16px 6px', color: Color.mute,
                fontFamily: Font.mono, fontSize: 10, fontWeight: 500,
                letterSpacing: 1.2, textTransform: 'uppercase',
              }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: `rotate(${isCollapsed ? 0 : 90}deg)`, transition: `transform ${Duration.normal} ${Ease.default}`, flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {LAYER_LABELS[layer]}
              <span style={merge(Type.dataSm, { color: Color.faint, marginLeft: 'auto' })}>{items.length}</span>
            </button>
            {!isCollapsed && items.map(comp => {
              const active = comp.id === selectedId
              return (
                <button key={comp.id} onClick={() => onSelect(comp.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: active ? Color.accentDim : 'transparent',
                    border: 'none',
                    padding: '7px 16px 7px 32px', cursor: 'pointer',
                    color: active ? Color.text : Color.dim,
                    fontFamily: Font.mono, fontSize: 12, fontWeight: active ? 500 : 400,
                    transition: `background ${Duration.normal} ${Ease.default}`,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  {comp.name}
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const TOKEN_SECTIONS = ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadow', 'Motion']

function TokensSidebar({ onScrollTo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 0' }}>
      {TOKEN_SECTIONS.map(section => (
        <button key={section} onClick={() => onScrollTo(section)}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            background: 'transparent', border: 'none',
            padding: '8px 16px', cursor: 'pointer', color: Color.dim,
            fontFamily: Font.mono, fontSize: 12, fontWeight: 400,
            transition: `background ${Duration.normal} ${Ease.default}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {section}
        </button>
      ))}
    </div>
  )
}

/* ── Screens Main ────────────────────────────────────────────── */

function ComponentStatePreview({ name }) {
  const entry = COMPONENT_CATALOG.find(c => c.name === name)
  if (!entry || !entry.examples || entry.examples.length === 0) return null
  const renderers = entry.examples.map(key => EXAMPLE_RENDERERS[key]).filter(Boolean)
  if (renderers.length === 0) return null

  return (
    <div style={{ background: Color.surface, borderRadius: Radius.lg, border: `1px solid ${Color.borderSoft}`, padding: Space[4], display: 'flex', flexDirection: 'column', gap: Space[3] }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={merge(Type.headingSm, { color: Color.text })}>{name}</span>
        {entry.source && <span style={merge(Type.dataSm, { color: Color.faint })}>{entry.source}</span>}
      </div>
      {renderers.map((render, i) => (
        <div key={i} style={{ padding: Space[3], background: Color.bg, borderRadius: Radius.md, border: `1px solid ${Color.borderSoft}` }}>
          {render()}
        </div>
      ))}
    </div>
  )
}

/* ── Tree → JSX code string ─────────────────────────────── */

function treeToJSX(node, depth = 0) {
  if (!node) return ''
  const pad = '  '.repeat(depth)
  const name = node.component
  const props = node.props || {}
  const children = node.children || []
  const note = node.note

  // Format props as JSX attributes
  const attrs = Object.entries(props).map(([k, v]) => {
    if (k === 'children') return null
    if (typeof v === 'string') return `${k}="${v}"`
    if (typeof v === 'number') return `${k}={${v}}`
    if (typeof v === 'boolean') return v ? k : null
    return `${k}={${JSON.stringify(v)}}`
  }).filter(Boolean)

  const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : ''
  const textChild = props.children && typeof props.children === 'string' ? props.children : null
  const commentLine = note ? `${pad}{/* ${note} */}\n` : ''

  if (children.length === 0 && !textChild) {
    return `${commentLine}${pad}<${name}${attrStr} />`
  }

  const lines = [`${commentLine}${pad}<${name}${attrStr}>`]
  if (textChild) {
    lines.push(`${pad}  ${textChild}`)
  }
  for (const child of children) {
    lines.push(treeToJSX(child, depth + 1))
  }
  lines.push(`${pad}</${name}>`)
  return lines.join('\n')
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ position: 'relative', background: '#0d0d0d', borderRadius: Radius.lg, border: `1px solid ${Color.borderSoft}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
        <button onClick={handleCopy} style={{
          background: copied ? Color.accentDim : 'rgba(255,255,255,0.06)',
          border: `1px solid ${Color.borderSoft}`, borderRadius: Radius.sm,
          padding: '4px 10px', cursor: 'pointer',
          fontFamily: Font.mono, fontSize: 10, letterSpacing: 1,
          color: copied ? Color.accent : Color.mute, textTransform: 'uppercase',
          transition: 'background 0.15s, color 0.15s',
        }}>{copied ? 'COPIED' : 'COPY'}</button>
      </div>
      <pre style={{
        margin: 0, padding: '20px 24px', overflowX: 'auto',
        fontFamily: Font.mono, fontSize: 12, lineHeight: 1.7,
        color: Color.dim, tabSize: 2,
      }}><code>{code}</code></pre>
    </div>
  )
}

function ScreensMain({ screens, idx, transition }) {
  const screen = screens[idx]
  if (!screen) return null
  const anatomy = SCREEN_ANATOMY[screen.id]
  const ScreenComponent = screen.C
  const usedComponents = anatomy ? [...collectComponentNames(anatomy.tree)] : []
  const [bottomTab, setBottomTab] = useState('states')
  const states = SCREEN_STATES[screen.id] || [{ key: 'default', label: 'Default', description: '' }]
  const [selectedState, setSelectedState] = useState('default')

  const jsxCode = anatomy?.tree ? treeToJSX(anatomy.tree) : null

  // Build import statement from components used
  const importBlock = usedComponents.length > 0 ? (() => {
    const primitiveImports = []
    const featureImports = []
    const domainImports = []
    const otherImports = []
    for (const name of usedComponents) {
      const entry = COMPONENT_CATALOG.find(c => c.name === name)
      if (!entry) { otherImports.push(name); continue }
      if (entry.layer === 'primitive') primitiveImports.push(name)
      else if (entry.layer === 'feature') featureImports.push(name)
      else if (entry.layer === 'domain') domainImports.push(name)
      else otherImports.push(name)
    }
    const lines = []
    if (primitiveImports.length) lines.push(`import { ${primitiveImports.join(', ')} } from './tools/primitives'`)
    if (featureImports.length) lines.push(`import { ${featureImports.join(', ')} } from './ui/components'`)
    if (domainImports.length) lines.push(`import { ${domainImports.join(', ')} } from './tools/domain'`)
    if (otherImports.length) lines.push(`// Screen-local: ${otherImports.join(', ')}`)
    return lines.join('\n')
  })() : ''

  const fullCode = [
    importBlock,
    '',
    `export function ${screen.label.replace(/[^a-zA-Z0-9]/g, '')}Screen() {`,
    '  return (',
    jsxCode ? jsxCode.split('\n').map(l => '    ' + l).join('\n') : '    <Phone />',
    '  )',
    '}',
  ].join('\n')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Top section: Phone + Legend */}
      <div style={{ display: 'flex', padding: '40px 40px 0', gap: 24 }}>
        {/* Phone preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <PhoneScaler>
            <div style={{ opacity: transition ? 0 : 1, transition: 'opacity 0.18s ease' }}>
              <UserProvider _override={getStateData(screen.id, selectedState)}>
                <ScreenComponent />
              </UserProvider>
            </div>
          </PhoneScaler>
          <div style={merge(Type.dataSm, { color: Color.faint })}>
            {idx + 1} / {screens.length}
          </div>
        </div>

        {/* Legend — flush right */}
        <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: Space[5] }}>
          <div>
            <Mono color={Color.mute}>{screen.flow} · {screen.feature.toUpperCase()}</Mono>
            <div style={merge(Type.headingLg, { color: Color.text, marginTop: 6 })}>{screen.label}</div>
          </div>

          {/* State selector */}
          {states.length > 1 && (
            <div>
              <Mono color={Color.faint}>STATE</Mono>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                style={{
                  marginTop: 8, width: '100%', padding: '8px 12px',
                  background: Color.surface, color: Color.text,
                  border: `1px solid ${Color.border}`, borderRadius: Radius.md,
                  fontFamily: Font.mono, fontSize: 11, letterSpacing: 0.5,
                  cursor: 'pointer', outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b6b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  paddingRight: 32,
                }}
              >
                {states.map(s => (
                  <option key={s.key} value={s.key} style={{ background: Color.surface, color: Color.text }}>{s.label}</option>
                ))}
              </select>
              {(() => {
                const active = states.find(s => s.key === selectedState)
                return active?.description ? (
                  <div style={merge(Type.dataSm, { color: Color.faint, marginTop: 6, lineHeight: 1.5 })}>{active.description}</div>
                ) : null
              })()}
            </div>
          )}

          {anatomy?.notes && (
            <div style={merge(Type.bodySm, { color: Color.dim, lineHeight: 1.6 })}>{anatomy.notes}</div>
          )}

          {anatomy?.tree && (
            <div>
              <Mono color={Color.faint}>COMPONENT TREE</Mono>
              <div style={{ marginTop: 8, padding: 12, background: Color.surface, borderRadius: Radius.md, border: `1px solid ${Color.borderSoft}`, overflow: 'auto', maxHeight: 360 }}>
                <AnatomyTree tree={anatomy.tree} />
              </div>
            </div>
          )}

          {usedComponents.length > 0 && (
            <div>
              <Mono color={Color.faint}>COMPONENTS USED · {usedComponents.length}</Mono>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {usedComponents.map(name => (
                  <span key={name} style={{
                    padding: '2px 7px', borderRadius: Radius.full,
                    background: Color.accentDim, color: Color.accent,
                    fontFamily: Font.mono, fontSize: 10, fontWeight: 600,
                    letterSpacing: 0.4,
                  }}>{name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section: tabbed States / Code */}
      <div style={{ borderTop: `1px solid ${Color.borderSoft}`, marginTop: 32 }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px', gap: 0, borderBottom: `1px solid ${Color.borderSoft}` }}>
          {[
            { key: 'states', label: 'States' },
            { key: 'code', label: 'Code' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setBottomTab(tab.key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 20px',
              fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
              color: bottomTab === tab.key ? Color.accent : Color.mute,
              borderBottom: `2px solid ${bottomTab === tab.key ? Color.accent : 'transparent'}`,
              marginBottom: -1,
              transition: 'color 0.15s',
            }}>{tab.label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={merge(Type.dataSm, { color: Color.faint })}>
            {bottomTab === 'states' ? 'Live variants and states' : 'React component structure'}
          </span>
        </div>

        {/* Tab content */}
        <div style={{ padding: '24px 40px 60px' }}>
          {bottomTab === 'states' && usedComponents.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
              {usedComponents.map(name => (
                <ComponentStatePreview key={`${screen.id}-${name}`} name={name} />
              ))}
            </div>
          )}

          {bottomTab === 'code' && (
            <CodeBlock code={fullCode} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Components Main ─────────────────────────────────────────── */

function ComponentsMain({ catalog, selectedId }) {
  const comp = catalog.find(c => c.id === selectedId)
  if (!comp) return <EmptyState title="Select a component" description="Choose from the sidebar to view its details." />

  const LAYER_LABELS = { primitive: 'Primitive', feature: 'Feature', domain: 'Domain', chart: 'Chart', calendar: 'Calendar' }
  const LAYER_TONES = { primitive: 'neutral', feature: 'accent', domain: 'green', chart: 'blue', calendar: 'blue' }

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={merge(Type.headingLg, { color: Color.text })}>{comp.name}</span>
          <Tag tone={LAYER_TONES[comp.layer] || 'neutral'}>{LAYER_LABELS[comp.layer] || comp.layer}</Tag>
        </div>
        <div style={merge(Type.dataSm, { color: Color.mute })}>{comp.source}</div>
      </div>

      {/* Description */}
      {comp.description && (
        <div style={merge(Type.bodyMd, { color: Color.dim, marginBottom: 32, lineHeight: 1.6 })}>{comp.description}</div>
      )}

      {/* Live examples */}
      {comp.examples && comp.examples.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Mono color={Color.faint}>LIVE EXAMPLES</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
            {comp.examples.map(key => {
              const renderer = EXAMPLE_RENDERERS[key]
              return (
                <div key={key}>
                  <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 8 })}>{key}</div>
                  <Card variant="outlined" padding={20}>
                    {renderer ? renderer() : <span style={merge(Type.bodySm, { color: Color.faint })}>No renderer for "{key}"</span>}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Props table */}
      {comp.props && comp.props.length > 0 && (
        <div>
          <Mono color={Color.faint}>PROPS</Mono>
          <div style={{ marginTop: 12 }}>
            <PropsTable props={comp.props} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Tokens Main ─────────────────────────────────────────────── */

function TokensMain() {
  const sectionRefs = useRef({})

  return (
    <div id="tokens-main" style={{ padding: 40, maxWidth: 900 }}>
      {/* Colors */}
      <div ref={el => sectionRefs.current['Colors'] = el} style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>COLORS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 10 })}>BACKGROUNDS</div>
            <Swatch color={Color.bg} label="bg" />
            <Swatch color={Color.surface} label="surface" />
            <Swatch color={Color.surface2} label="surface2" />
            <Swatch color={Color.surface3} label="surface3" />
          </div>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 10 })}>TEXT</div>
            <Swatch color={Color.text} label="text" />
            <Swatch color={Color.dim} label="dim" />
            <Swatch color={Color.mute} label="mute" />
            <Swatch color={Color.faint} label="faint" />
          </div>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 10 })}>BRAND & SEMANTIC</div>
            <Swatch color={Color.accent} label="accent" />
            <Swatch color={Color.accentHot} label="accentHot" />
            <Swatch color={Color.green} label="green" />
            <Swatch color={Color.red} label="red" />
            <Swatch color={Color.blue} label="blue" />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div ref={el => sectionRefs.current['Typography'] = el} style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>TYPOGRAPHY</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <TypeSample name="displayLg" preset={Type.displayLg} />
            <TypeSample name="displayMd" preset={Type.displayMd} />
            <TypeSample name="displaySm" preset={Type.displaySm} />
            <TypeSample name="headingLg" preset={Type.headingLg} />
            <TypeSample name="headingMd" preset={Type.headingMd} />
            <TypeSample name="headingSm" preset={Type.headingSm} />
          </div>
          <div>
            <TypeSample name="bodyLg" preset={Type.bodyLg} />
            <TypeSample name="bodyMd" preset={Type.bodyMd} />
            <TypeSample name="bodySm" preset={Type.bodySm} />
            <TypeSample name="labelLg" preset={Type.labelLg} />
            <TypeSample name="labelMd" preset={Type.labelMd} />
            <TypeSample name="labelSm" preset={Type.labelSm} />
            <TypeSample name="dataLg" preset={Type.dataLg} />
            <TypeSample name="dataMd" preset={Type.dataMd} />
            <TypeSample name="dataSm" preset={Type.dataSm} />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div ref={el => sectionRefs.current['Spacing'] = el} style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>SPACING</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {Object.entries(Space).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: Math.max(v, 4), height: Math.max(v, 4), background: Color.accentDim, borderRadius: 2, border: `1px solid ${Color.accent}` }} />
              <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 4 })}>{k}</div>
              <div style={merge(Type.dataSm, { color: Color.faint })}>{v}px</div>
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div ref={el => sectionRefs.current['Radius'] = el} style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>RADIUS</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {Object.entries(Radius).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, background: Color.accentDim, borderRadius: v, border: `1px solid ${Color.accent}` }} />
              <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 4 })}>{k}</div>
              <div style={merge(Type.dataSm, { color: Color.faint })}>{v}px</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div ref={el => sectionRefs.current['Shadow'] = el} style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>SHADOW</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {Object.entries(Shadow).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 64, background: Color.surface2, borderRadius: Radius.lg, boxShadow: v, border: `1px solid ${Color.border}` }} />
              <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 8 })}>{k}</div>
              <div style={merge(Type.dataSm, { color: Color.faint, maxWidth: 100, wordBreak: 'break-all', marginTop: 2 })}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Motion */}
      <div ref={el => sectionRefs.current['Motion'] = el} style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>MOTION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 12 })}>DURATION</div>
            {Object.entries(Duration).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${Color.borderSoft}` }}>
                <span style={merge(Type.dataMd, { color: Color.accent, fontFamily: Font.mono })}>{k}</span>
                <span style={merge(Type.dataMd, { color: Color.dim })}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 12 })}>EASE</div>
            {Object.entries(Ease).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${Color.borderSoft}`, gap: 12 }}>
                <span style={merge(Type.dataMd, { color: Color.accent, fontFamily: Font.mono, flexShrink: 0 })}>{k}</span>
                <span style={merge(Type.dataSm, { color: Color.dim, textAlign: 'right', wordBreak: 'break-all' })}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────────── */

export default function DevHandover() {
  const { currentScreen: idx, screens, go } = useDemo()
  const [mode, setMode] = useState('screens')
  const [selectedComponent, setSelectedComponent] = useState(COMPONENT_CATALOG[0]?.id)
  const [transition, setTransition] = useState(false)
  const mainRef = useRef(null)

  // Navigation for screens mode
  const navigate = useCallback((next) => {
    if (next < 0 || next >= screens.length || next === idx) return
    setTransition(true)
    setTimeout(() => { go(next); setTransition(false) }, 180)
  }, [idx, screens.length, go])

  // Keyboard nav (screens mode only)
  useEffect(() => {
    if (mode !== 'screens') return
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); navigate(idx + 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(idx - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, navigate, idx])

  // Scroll to token section
  const scrollToTokenSection = useCallback((sectionName) => {
    if (!mainRef.current) return
    const el = mainRef.current.querySelector(`[data-token-section="${sectionName}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: Color.bg, color: Color.text, fontFamily: Font.sans,
    }}>
      {/* ── Sidebar ── */}
      <div style={{
        width: 300, flexShrink: 0, background: Color.surface,
        borderRight: `1px solid ${Color.border}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Sidebar header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${Color.borderSoft}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.svg" width="24" height="24" alt="" style={{ borderRadius: 6 }} />
              <span style={{ fontFamily: Font.mono, fontSize: 13, fontWeight: 200, letterSpacing: 3 }}>AUREVI0N</span>
            </Link>
          </div>
          <Mono color={Color.mute}>DEV HANDOVER</Mono>
          <div style={{ marginTop: 10 }}>
            <FilterGroup
              options={[
                { value: 'screens', label: 'Screens' },
                { value: 'components', label: 'Components' },
                { value: 'tokens', label: 'Tokens' },
              ]}
              value={mode}
              onChange={setMode}
              size="sm"
            />
          </div>
        </div>

        {/* Sidebar content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {mode === 'screens' && (
            <ScreensSidebar screens={screens} idx={idx} onSelect={navigate} />
          )}
          {mode === 'components' && (
            <ComponentsSidebar catalog={COMPONENT_CATALOG} selectedId={selectedComponent} onSelect={setSelectedComponent} />
          )}
          {mode === 'tokens' && (
            <TokensSidebar onScrollTo={(section) => {
              if (!mainRef.current) return
              // Use data attribute for scrolling
              const targets = mainRef.current.querySelectorAll('[data-token-section]')
              targets.forEach(el => {
                if (el.dataset.tokenSection === section) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              })
            }} />
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div ref={mainRef} style={{ flex: 1, overflowY: 'auto', background: Color.bg }}>
        {mode === 'screens' && (
          <ScreensMain screens={screens} idx={idx} transition={transition} />
        )}
        {mode === 'components' && (
          <ComponentsMain catalog={COMPONENT_CATALOG} selectedId={selectedComponent} />
        )}
        {mode === 'tokens' && (
          <TokensMainWithSections />
        )}
      </div>
    </div>
  )
}

/* Tokens main with data-token-section attributes for scroll targeting */
function TokensMainWithSections() {
  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      {/* Colors */}
      <div data-token-section="Colors" style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>COLORS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 10 })}>BACKGROUNDS</div>
            <Swatch color={Color.bg} label="bg" />
            <Swatch color={Color.surface} label="surface" />
            <Swatch color={Color.surface2} label="surface2" />
            <Swatch color={Color.surface3} label="surface3" />
          </div>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 10 })}>TEXT</div>
            <Swatch color={Color.text} label="text" />
            <Swatch color={Color.dim} label="dim" />
            <Swatch color={Color.mute} label="mute" />
            <Swatch color={Color.faint} label="faint" />
          </div>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 10 })}>BRAND & SEMANTIC</div>
            <Swatch color={Color.accent} label="accent" />
            <Swatch color={Color.accentHot} label="accentHot" />
            <Swatch color={Color.green} label="green" />
            <Swatch color={Color.red} label="red" />
            <Swatch color={Color.blue} label="blue" />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div data-token-section="Typography" style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>TYPOGRAPHY</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <TypeSample name="displayLg" preset={Type.displayLg} />
            <TypeSample name="displayMd" preset={Type.displayMd} />
            <TypeSample name="displaySm" preset={Type.displaySm} />
            <TypeSample name="headingLg" preset={Type.headingLg} />
            <TypeSample name="headingMd" preset={Type.headingMd} />
            <TypeSample name="headingSm" preset={Type.headingSm} />
          </div>
          <div>
            <TypeSample name="bodyLg" preset={Type.bodyLg} />
            <TypeSample name="bodyMd" preset={Type.bodyMd} />
            <TypeSample name="bodySm" preset={Type.bodySm} />
            <TypeSample name="labelLg" preset={Type.labelLg} />
            <TypeSample name="labelMd" preset={Type.labelMd} />
            <TypeSample name="labelSm" preset={Type.labelSm} />
            <TypeSample name="dataLg" preset={Type.dataLg} />
            <TypeSample name="dataMd" preset={Type.dataMd} />
            <TypeSample name="dataSm" preset={Type.dataSm} />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div data-token-section="Spacing" style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>SPACING</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {Object.entries(Space).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: Math.max(v, 4), height: Math.max(v, 4), background: Color.accentDim, borderRadius: 2, border: `1px solid ${Color.accent}` }} />
              <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 4 })}>{k}</div>
              <div style={merge(Type.dataSm, { color: Color.faint })}>{v}px</div>
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div data-token-section="Radius" style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>RADIUS</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {Object.entries(Radius).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, background: Color.accentDim, borderRadius: v, border: `1px solid ${Color.accent}` }} />
              <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 4 })}>{k}</div>
              <div style={merge(Type.dataSm, { color: Color.faint })}>{v}px</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div data-token-section="Shadow" style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>SHADOW</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {Object.entries(Shadow).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 64, background: Color.surface2, borderRadius: Radius.lg, boxShadow: v, border: `1px solid ${Color.border}` }} />
              <div style={merge(Type.dataSm, { color: Color.mute, marginTop: 8 })}>{k}</div>
              <div style={merge(Type.dataSm, { color: Color.faint, maxWidth: 100, wordBreak: 'break-all', marginTop: 2 })}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Motion */}
      <div data-token-section="Motion" style={{ marginBottom: 48 }}>
        <div style={merge(Type.labelLg, { color: Color.mute, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` })}>MOTION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 12 })}>DURATION</div>
            {Object.entries(Duration).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${Color.borderSoft}` }}>
                <span style={merge(Type.dataMd, { color: Color.accent, fontFamily: Font.mono })}>{k}</span>
                <span style={merge(Type.dataMd, { color: Color.dim })}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 12 })}>EASE</div>
            {Object.entries(Ease).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${Color.borderSoft}`, gap: 12 }}>
                <span style={merge(Type.dataMd, { color: Color.accent, fontFamily: Font.mono, flexShrink: 0 })}>{k}</span>
                <span style={merge(Type.dataSm, { color: Color.dim, textAlign: 'right', wordBreak: 'break-all' })}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
