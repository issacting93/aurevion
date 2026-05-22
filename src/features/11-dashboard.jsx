// ─────────────────────────────────────────────────────────────────────────────
// Aurevion · Dashboard — personalised 2-column modular tile grid
// ─────────────────────────────────────────────────────────────────────────────
// The ONLY personalised screen. Every other flow is uniform.
// Users configure which tiles appear, at what density, and in what order.
// The layout adapts to what matters most to THIS individual right now.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Sample user data (would come from state/API) ────────
const DASH_DATA = {
  goal: { current: 20.1, target: 15.0, unit: '% BF', weeks: 16, elapsed: 6 },
  tdee: { value: 2420, confidence: 74, trend: [2380, 2420, 2350, 2400, 2440, 2410, 2420] },
  macros: { kcal: 1660, protein: 147, carbs: 160, fat: 60, deficit: '−480' },
  calendar: [
    { label: 'M', done: true,  type: 'train', eventLabel: 'Upper' },
    { label: 'T', done: true,  type: 'meal',  eventLabel: 'Prep' },
    { label: 'W', done: true,  type: 'train', eventLabel: 'Lower' },
    { label: 'T', done: true,  type: 'checkin', today: true, eventLabel: 'Check-in' },
    { label: 'F', done: false, type: 'train', eventLabel: 'Pull' },
    { label: 'S', done: false, type: 'rest' },
    { label: 'S', done: false, type: 'meal',  eventLabel: 'Prep' },
  ],
  session: {
    name: 'Pull · Upper B',
    time: '48 min planned',
    day: 'FRI',
    exerciseCount: 6,
    exercises: [
      { name: 'Warm-up walk', sets: '5 min' },
      { name: 'Pull-up', sets: '4 × 8' },
      { name: 'Barbell row', sets: '4 × 6' },
      { name: 'Face pull', sets: '3 × 12' },
      { name: 'Bicep curl', sets: '3 × 10' },
      { name: 'Cooldown stretch', sets: '5 min' },
    ],
  },
  prep: {
    recipes: [
      { name: 'Salmon + greens', color: '#FF6E50', portions: 4, time: '25m' },
      { name: 'Rice bowls', color: '#5eaaff', portions: 6, time: '35m' },
      { name: 'Chili', color: '#a78bfa', portions: 8, time: '55m' },
    ],
    totalTime: '~78 min',
    readyPct: 85,
  },
  checkin: {
    latest: { weight: 82.1, bf: 20.1, date: '12 May' },
    trend: 'down',
    streak: 14,
    history: [
      { date: '12 May', weight: 82.1, bf: 20.1, delta: -0.4 },
      { date: '05 May', weight: 82.5, bf: 20.4, delta: -0.3 },
      { date: '28 Apr', weight: 82.8, bf: 20.6, delta: -0.5 },
    ],
  },
  fridge: {
    total: 24,
    missing: 4,
    expiring: 2,
    topMissing: [
      { name: 'Salmon fillet', amount: '600g' },
      { name: 'Brown rice', amount: '500g' },
      { name: 'Greek yoghurt', amount: '400g' },
      { name: 'Spinach', amount: '200g' },
    ],
  },
  streak: { count: 14, best: 21 },
};

// ─── Layout presets (personalisation configs) ────────────
// Each entry: { tile, density, span? }
// Three example personas showing how the same tile set adapts:

const LAYOUTS = {
  balanced: {
    label: 'Balanced',
    description: 'Equal weight to training, nutrition, and progress',
    tiles: [
      { tile: 'goal',     density: 'mid',     span: 2 },
      { tile: 'calendar', density: 'mid',     span: 2 },
      { tile: 'macros',   density: 'mid',     span: 2 },
      { tile: 'session',  density: 'mid',     span: 1 },
      { tile: 'prep',     density: 'mid',     span: 1 },
      { tile: 'tdee',     density: 'mid',     span: 1 },
      { tile: 'checkin',  density: 'mid',     span: 1 },
      { tile: 'fridge',   density: 'compact', span: 1 },
      { tile: 'streak',   density: 'compact', span: 1 },
    ],
  },
  nutrition: {
    label: 'Nutrition Focus',
    description: 'Cutting phase — macros and meal prep front and centre',
    tiles: [
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
  },
  training: {
    label: 'Training Focus',
    description: 'Strength block — session detail and recovery first',
    tiles: [
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
  },
};

// ─── Tile renderer ───────────────────────────────────────
function renderTile(config, data) {
  const { tile, density, span } = config;
  const props = { density, span };

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
    default:
      return null;
  }
}

// ─── Density toggle control ──────────────────────────────
function DensityControl({ active, onChange }) {
  const modes = [
    { key: 'balanced', icon: ICONS.sparkle, label: 'BAL' },
    { key: 'nutrition', icon: ICONS.meal, label: 'NUT' },
    { key: 'training', icon: ICONS.dumb, label: 'TRN' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 3,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${F.borderSoft}`,
      borderRadius: 10,
    }}>
      {modes.map(m => {
        const isActive = active === m.key;
        return (
          <button
            key={m.key}
            data-stay="true"
            onClick={() => onChange(m.key)}
            style={{
              flex: 1, padding: '8px 6px', borderRadius: 8,
              border: 'none', cursor: 'pointer',
              background: isActive ? 'rgba(255,110,80,0.12)' : 'transparent',
              color: isActive ? F.accent : F.mute,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
          >
            <FIcon path={m.icon} size={16} color={isActive ? F.accent : F.mute} stroke={1.8} />
            <span style={{
              fontFamily: FF.mono, fontSize: 9, letterSpacing: 1,
              textTransform: 'uppercase',
            }}>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Dashboard Screen ────────────────────────────────────
function DashboardScreen() {
  const [layoutKey, setLayoutKey] = React.useState('balanced');
  const layout = LAYOUTS[layoutKey];

  return (
    <Phone label="Dashboard" group="HOME">
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80, WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel size={10} mb={2}>DASHBOARD</FLabel>
              <div style={{
                fontSize: 22, fontWeight: 300, letterSpacing: -0.5, lineHeight: 1.2,
              }}>
                Good evening.
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2a2a2e, #1a1a1e)',
              border: `1px solid ${F.borderSoft}`,
              display: 'grid', placeItems: 'center',
            }}>
              <FMono size={14} color={F.dim}>Z</FMono>
            </div>
          </div>
        </div>

        {/* Layout selector */}
        <div style={{ padding: '14px 20px 6px' }}>
          <DensityControl active={layoutKey} onChange={setLayoutKey} />
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FMono size={10} color={F.mute}>{layout.label.toUpperCase()}</FMono>
            <FMono size={9} color={F.faint}>{layout.tiles.length} tiles</FMono>
          </div>
        </div>

        {/* Tile grid */}
        <div style={{ paddingTop: 6 }}>
          <FTileGrid padding={16}>
            {layout.tiles.map(config => renderTile(config, DASH_DATA))}
          </FTileGrid>
        </div>
      </div>

      {/* Tab bar */}
      <FTabBar active={2} />
    </Phone>
  );
}

// ─── Second dashboard variant to show contrast ───────────
function DashboardNutritionScreen() {
  return (
    <Phone label="Dashboard · Nutrition" group="HOME">
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80, WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel size={10} mb={2}>DASHBOARD</FLabel>
              <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.5, lineHeight: 1.2 }}>
                Good evening.
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2a2a2e, #1a1a1e)',
              border: `1px solid ${F.borderSoft}`,
              display: 'grid', placeItems: 'center',
            }}>
              <FMono size={14} color={F.dim}>Z</FMono>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 20px 6px' }}>
          <DensityControl active="nutrition" onChange={() => {}} />
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FMono size={10} color={F.mute}>NUTRITION FOCUS</FMono>
            <FMono size={9} color={F.faint}>9 tiles</FMono>
          </div>
        </div>

        <div style={{ paddingTop: 6 }}>
          <FTileGrid padding={16}>
            {LAYOUTS.nutrition.tiles.map(config => renderTile(config, DASH_DATA))}
          </FTileGrid>
        </div>
      </div>

      <FTabBar active={2} />
    </Phone>
  );
}

function DashboardTrainingScreen() {
  return (
    <Phone label="Dashboard · Training" group="HOME">
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80, WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel size={10} mb={2}>DASHBOARD</FLabel>
              <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.5, lineHeight: 1.2 }}>
                Good evening.
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2a2a2e, #1a1a1e)',
              border: `1px solid ${F.borderSoft}`,
              display: 'grid', placeItems: 'center',
            }}>
              <FMono size={14} color={F.dim}>Z</FMono>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 20px 6px' }}>
          <DensityControl active="training" onChange={() => {}} />
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FMono size={10} color={F.mute}>TRAINING FOCUS</FMono>
            <FMono size={9} color={F.faint}>9 tiles</FMono>
          </div>
        </div>

        <div style={{ paddingTop: 6 }}>
          <FTileGrid padding={16}>
            {LAYOUTS.training.tiles.map(config => renderTile(config, DASH_DATA))}
          </FTileGrid>
        </div>
      </div>

      <FTabBar active={2} />
    </Phone>
  );
}

Object.assign(window, {
  DashboardScreen, DashboardNutritionScreen, DashboardTrainingScreen,
});