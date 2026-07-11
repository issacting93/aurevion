// ─────────────────────────────────────────────────────────────────────────────
// Aurevion · Dashboard — personalised 2-column modular tile grid
// ─────────────────────────────────────────────────────────────────────────────
// The ONLY personalised screen. Every other flow is uniform.
// Users configure which tiles appear, at what density, and in what order.
// The layout adapts to what matters most to THIS individual right now.
// ─────────────────────────────────────────────────────────────────────────────

import { Color, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FLabel, FIcon, FTabBar, FSurface, FAvatar, FButtonGroup, Phone } from '../../ui/components'
import { GoalTile, TDEETile, MacroTile, CalendarTile, SessionTile, PrepTile, CheckInTile, FridgeTile, StreakTile, WaterTile, FTileGrid } from './tiles'
import { useUser } from '../../context/UserContext'
import { MOCK_DASHBOARD, MOCK_WATER } from '../../context/mockUser'
import { flattenSessionExercises } from './fitness-data'

// ─── Layout presets ──────────────────────────────────────
const LAYOUTS = {
  balanced: [
    { tile: 'goal',     density: 'mid',     span: 2 },
    { tile: 'calendar', density: 'mid',     span: 2 },
    { tile: 'macros',   density: 'mid',     span: 2 },
    { tile: 'session',  density: 'mid',     span: 1 },
    { tile: 'water',    density: 'mid',     span: 1 },
    { tile: 'prep',     density: 'mid',     span: 1 },
    { tile: 'tdee',     density: 'mid',     span: 1 },
    { tile: 'checkin',  density: 'mid',     span: 1 },
    { tile: 'fridge',   density: 'compact', span: 1 },
    { tile: 'streak',   density: 'compact', span: 1 },
  ],
  nutrition: [
    { tile: 'macros',   density: 'full',    span: 2 },
    { tile: 'goal',     density: 'compact', span: 1 },
    { tile: 'streak',   density: 'mid',     span: 1 },
    { tile: 'prep',     density: 'full',    span: 2 },
    { tile: 'fridge',   density: 'full',    span: 1 },
    { tile: 'checkin',  density: 'mid',     span: 1 },
    { tile: 'calendar', density: 'compact', span: 1 },
    { tile: 'tdee',     density: 'compact', span: 1 },
    { tile: 'session',  density: 'compact', span: 1 },
  ],
  training: [
    { tile: 'session',  density: 'full',    span: 2 },
    { tile: 'goal',     density: 'mid',     span: 1 },
    { tile: 'streak',   density: 'mid',     span: 1 },
    { tile: 'calendar', density: 'full',    span: 2 },
    { tile: 'checkin',  density: 'full',    span: 2 },
    { tile: 'tdee',     density: 'mid',     span: 1 },
    { tile: 'macros',   density: 'compact', span: 1 },
    { tile: 'fridge',   density: 'compact', span: 1 },
    { tile: 'prep',     density: 'compact', span: 1 },
  ],
};

// ─── Goal classification ────────────────────────────────
const FITNESS_GOAL_KEYS = new Set([
  'hypertrophy', 'fat_loss', 'recomposition', 'max_strength',
  'cardio_endurance', 'power', 'agility', 'flexibility', 'balance', 'overall_wellness',
])
const NUTRITION_GOAL_KEYS = new Set([
  'healthier_meals', 'cook_more', 'improve_digestion', 'drink_water', 'save_money',
])

function classifyGoals(goals) {
  if (!goals || goals.length === 0) return 'balanced'
  const hasFitness = goals.some(g => FITNESS_GOAL_KEYS.has(g))
  const hasNutrition = goals.some(g => NUTRITION_GOAL_KEYS.has(g))
  if (hasFitness && hasNutrition) return 'balanced'
  if (hasFitness) return 'training'
  if (hasNutrition) return 'nutrition'
  return 'balanced'
}

// ─── Merge real user data with mock fallbacks ────────────
function parseBfMidpoint(range) {
  if (!range) return null;
  const m = range.match(/(\d+)[-–](\d+)/);
  if (m) return (parseInt(m[1]) + parseInt(m[2])) / 2;
  const s = range.match(/(\d+)/);
  return s ? parseInt(s[1]) : null;
}

const TODAY_INDEX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1 // Mon=0
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function useDashData() {
  const { profile, targets, checkins, workoutPlan } = useUser();
  if (!targets) return MOCK_DASHBOARD;

  const bfCurrent = parseBfMidpoint(profile?.bodyFat);
  const mod = targets.target - targets.tdee;

  const checkinData = (checkins || []).length > 0 ? {
    latest: { weight: checkins[0].weight, bf: checkins[0].bf, date: checkins[0].date },
    trend: checkins.length >= 2 ? (checkins[0].weight < checkins[1].weight ? 'down' : 'up') : 'flat',
    streak: checkins.length,
    history: checkins.slice(0, 3).map((c, i) => ({
      date: c.date, weight: c.weight, bf: c.bf,
      delta: i < checkins.length - 1 ? +(c.weight - checkins[i + 1].weight).toFixed(1) : 0,
    })),
  } : MOCK_DASHBOARD.checkin;

  // Build session data from workout plan
  const sessionData = (() => {
    if (!workoutPlan?.sessions) return MOCK_DASHBOARD.session
    // Find today's session or next upcoming
    const todaySession = workoutPlan.sessions.find(s => s.dayIndex === TODAY_INDEX && !s.completed)
    const nextSession = todaySession || workoutPlan.sessions.find(s => s.dayIndex > TODAY_INDEX && !s.completed) || workoutPlan.sessions.find(s => !s.completed)
    if (!nextSession) return MOCK_DASHBOARD.session
    const nonUtil = nextSession.exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown' && !e.groupType)
    const grouped = nextSession.exercises.filter(e => e.groupType)
    const flatGrouped = grouped.length > 0 ? flattenSessionExercises(grouped) : []
    const coreExercises = [...nonUtil, ...flatGrouped]
    return {
      name: nextSession.name,
      time: `${nextSession.estimatedMins} min planned`,
      day: nextSession.day.toUpperCase().slice(0, 3),
      exerciseCount: coreExercises.length,
      exercises: coreExercises.slice(0, 6).map(e => ({
        name: e.name,
        sets: e.load > 0 ? `${e.sets} × ${e.reps} @ ${e.load}kg` : e.duration > 0 ? `${e.duration} min` : `${e.sets} × ${e.reps}`,
      })),
    }
  })()

  // Build calendar data from workout plan
  const calendarData = (() => {
    if (!workoutPlan?.schedule) return MOCK_DASHBOARD.calendar
    return workoutPlan.schedule.map((entry, i) => ({
      label: DAY_LABELS[i] || entry.day?.[0],
      done: entry.completed || false,
      type: entry.isRest ? 'rest' : 'train',
      today: entry.dayIndex === TODAY_INDEX,
      eventLabel: entry.isRest ? '' : entry.modalityLabel,
    }))
  })()

  return {
    ...MOCK_DASHBOARD,
    goal: {
      ...MOCK_DASHBOARD.goal,
      ...(bfCurrent != null && { current: bfCurrent }),
    },
    tdee: { ...MOCK_DASHBOARD.tdee, value: targets.tdee },
    macros: {
      kcal: targets.target,
      protein: targets.protein,
      carbs: targets.carbs,
      fat: targets.fat,
      deficit: mod >= 0 ? `+${mod}` : `−${Math.abs(mod)}`,
    },
    session: sessionData,
    calendar: calendarData,
    checkin: checkinData,
    water: { current: MOCK_WATER.trend7d[6] || 1250, target: MOCK_WATER.target, trend7d: MOCK_WATER.trend7d },
  };
}

// ─── Intervention detection ─────────────────────────────
function useActiveIntervention() {
  const { checkins, interventions } = useUser();
  const stored = (interventions || []).find(i => !i.dismissed);
  if (stored) return stored;

  if ((checkins || []).length >= 2) {
    const delta = checkins[0].weight - checkins[1].weight;
    if (delta < -0.5) {
      return {
        id: 'auto-deficit-' + checkins[0].date,
        type: 'deficit_too_aggressive',
        title: 'Deficit may be too aggressive',
        body: `You lost ${Math.abs(delta).toFixed(1)} kg this week. Consider reducing your deficit by ~200 kcal to preserve lean mass.`,
        tone: 'accent',
      };
    }
  }
  return null;
}

// ─── Tile renderer ───────────────────────────────────────
function renderTile(config, data, onTileClick) {
  const { tile, density, span } = config;
  const props = { density, span, onClick: onTileClick ? () => onTileClick(tile) : undefined };

  switch (tile) {
    case 'goal':
      return <GoalTile key={tile} {...data.goal} {...props} />;
    case 'tdee':
      return <TDEETile key={tile} {...data.tdee} {...props} />;
    case 'macros':
      return <MacroTile key={tile} {...data.macros} {...props} />;
    case 'calendar':
      return <CalendarTile key={tile} days={data.calendar} {...props} />;
    case 'session':
      return <SessionTile key={tile} {...data.session} {...props} />;
    case 'prep':
      return <PrepTile key={tile} {...data.prep} {...props} />;
    case 'checkin':
      return <CheckInTile key={tile} {...data.checkin} {...props} />;
    case 'fridge':
      return <FridgeTile key={tile} {...data.fridge} {...props} />;
    case 'streak':
      return <StreakTile key={tile} {...data.streak} {...props} />;
    case 'water':
      return <WaterTile key={tile} {...data.water} {...props} />;
    default:
      return null;
  }
}

// ─── Density toggle control ──────────────────────────────
const DENSITY_OPTIONS = [
  { value: 'balanced',  icon: ICONS.sparkle, label: 'BAL' },
  { value: 'nutrition', icon: ICONS.meal,    label: 'NUT' },
  { value: 'training',  icon: ICONS.dumb,    label: 'TRN' },
];

// ─── Goal label formatter ────────────────────────────────
const GOAL_LABELS = {
  hypertrophy: 'Hypertrophy', fat_loss: 'Fat Loss', recomposition: 'Recomp',
  max_strength: 'Strength', cardio_endurance: 'Cardio', power: 'Power',
  agility: 'Agility', flexibility: 'Flexibility', balance: 'Balance',
  overall_wellness: 'Wellness', healthier_meals: 'Healthier Meals',
  cook_more: 'Cook More', improve_digestion: 'Digestion',
  drink_water: 'Hydration', save_money: 'Save Money',
}

// ─── Dashboard Content (used by AppShell and DashboardScreen) ──
export function DashboardContent({ onTileClick }) {
  const { profile, dismissIntervention, workoutPlan } = useUser();
  const data = useDashData();
  const activeIntervention = useActiveIntervention();

  const layoutKey = classifyGoals(profile?.goals);
  const tiles = LAYOUTS[layoutKey];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';

  // Active goals for context display
  const activeGoals = (profile?.goals || []).slice(0, 3)
  const splitLabel = workoutPlan?.splitLabel

  return (
    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80, WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <FLabel size={10} mb={2}>DASHBOARD</FLabel>
            <div style={{ ...Type.headingLg }}>{greeting}</div>
          </div>
          <FAvatar initials="Z" size={36} />
        </div>
        {/* Active goals strip */}
        {activeGoals.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
            {activeGoals.map(g => {
              const isFitness = FITNESS_GOAL_KEYS.has(g)
              return (
                <span key={g} style={{
                  padding: '2px 8px', borderRadius: Radius.full,
                  background: isFitness ? 'rgba(255,110,80,0.08)' : 'rgba(74,222,128,0.08)',
                  color: isFitness ? Color.accent : Color.green,
                  ...Type.labelSm, letterSpacing: 0.8,
                  fontWeight: 500, textTransform: 'uppercase',
                }}>{GOAL_LABELS[g] || g.replace(/_/g, ' ')}</span>
              )
            })}
            {splitLabel && (
              <span style={{
                padding: '2px 8px', borderRadius: Radius.full,
                background: 'rgba(96,165,250,0.08)', color: Color.blue,
                ...Type.labelSm, letterSpacing: 0.8,
                fontWeight: 500, textTransform: 'uppercase',
              }}>{splitLabel}</span>
            )}
          </div>
        )}
      </div>


      {activeIntervention && (
        <div style={{ padding: '8px 20px 0' }}>
          <FSurface tone={activeIntervention.tone} icon={ICONS.sparkle} title={activeIntervention.title}>
            <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5 }}>{activeIntervention.body}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: Space[2] }}>
              {onTileClick && (
                <button onClick={() => onTileClick('checkin')} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', gap: Space[1], ...Type.labelSm, color: Color.accent,
                }}>
                  SEE DETAILS <FIcon path={ICONS.fwd} size={12} color={Color.accent} stroke={2}/>
                </button>
              )}
              <button onClick={() => dismissIntervention(activeIntervention.id)} style={{
                width: 24, height: 24, borderRadius: Radius.full, border: 'none',
                background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: Color.mute,
              }}>
                <FIcon path={ICONS.close} size={12} stroke={2}/>
              </button>
            </div>
          </FSurface>
        </div>
      )}

      <div style={{ paddingTop: 6 }}>
        <FTileGrid padding={16}>
          {tiles.map(config => renderTile(config, data, onTileClick))}
        </FTileGrid>
      </div>
    </div>
  );
}

// ─── Dashboard Screen (for demo/gallery) ─────────────────
export function DashboardScreen() {
  return (
    <Phone label="Dashboard" group="HOME">
      <DashboardContent />
      <FTabBar active={2} />
    </Phone>
  );
}

// ─── Layout variant screens (for demo/gallery) ─────────
export function DashboardNutritionScreen() {
  return <DashboardVariantScreen layout="nutrition" />;
}

export function DashboardTrainingScreen() {
  return <DashboardVariantScreen layout="training" />;
}

function DashboardVariantScreen({ layout }) {
  const data = useDashData();
  return (
    <Phone label={`Dashboard · ${layout}`} group="HOME">
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80, WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel size={10} mb={2}>DASHBOARD</FLabel>
              <div style={{ ...Type.headingLg }}>Good evening.</div>
            </div>
            <FAvatar initials="Z" size={36} />
          </div>
        </div>
        <div style={{ padding: '14px 20px 6px' }}>
          <FButtonGroup options={DENSITY_OPTIONS} value={layout} onChange={() => {}} />
        </div>
        <div style={{ paddingTop: 6 }}>
          <FTileGrid padding={16}>
            {LAYOUTS[layout].map(config => renderTile(config, data))}
          </FTileGrid>
        </div>
      </div>
      <FTabBar active={2} />
    </Phone>
  );
}
