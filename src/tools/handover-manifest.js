/* Handover Manifest — screen anatomy + component catalog + screen states
   Static data for the developer handover page. */

// ── SCREEN STATES ───────────────────────────────────────────
// Each screen can be viewed in multiple states via the handover dropdown.
// 'default' is always the first state. Additional states describe
// edge cases, loading, empty, error, and completion scenarios.

export const SCREEN_STATES = {
  'dash-bal': [
    { key: 'default', label: 'Default', description: 'Balanced layout with mid-density tiles, data populated for week 19.' },
    { key: 'empty', label: 'Empty — new user', description: 'First session — no check-ins, no meals planned, no training history. Tiles show zero/placeholder states.' },
    { key: 'complete', label: 'All goals met', description: 'Every tile at 100%. Goal progress bar full, all meals logged, session done.' },
    { key: 'loading', label: 'Loading', description: 'Skeleton placeholders while API fetches dashboard data.' },
  ],
  'dash-nut': [
    { key: 'default', label: 'Default', description: 'Nutrition focus — macro and prep tiles at full density.' },
    { key: 'over-target', label: 'Over target', description: 'User exceeded calorie target. Deficit shows positive, macro bars in red.' },
  ],
  'dash-trn': [
    { key: 'default', label: 'Default', description: 'Training focus — session and check-in tiles promoted.' },
    { key: 'rest-day', label: 'Rest day', description: 'No session scheduled. Session tile shows "REST DAY" with recovery focus.' },
  ],
  'welcome': [
    { key: 'default', label: 'Default', description: 'Hero intro with jewel CTA. Static — no state variations.' },
  ],
  'goal-a': [
    { key: 'default', label: 'Default', description: 'Slider at 15% BF target, 16-week timeline.' },
    { key: 'aggressive', label: 'Aggressive pace', description: 'Target at 10% BF, 8-week timeline. Pace warning tag shows red.' },
    { key: 'conservative', label: 'Conservative pace', description: 'Target at 18% BF, 24-week timeline. Pace tag shows green "SAFE".' },
  ],
  'goal-b': [
    { key: 'default', label: 'Default', description: 'Contract summary with all fields populated.' },
  ],
  'tdee-a': [
    { key: 'default', label: 'Default', description: 'Day 87 — high confidence (74%), narrow band.' },
    { key: 'early', label: 'Early days (Day 3)', description: 'Low confidence (12%), wide band, few data points.' },
    { key: 'converged', label: 'Fully converged', description: 'Confidence at 95%+, band nearly flat, model stable.' },
  ],
  'tdee-b': [
    { key: 'default', label: 'Default', description: 'Side-by-side Day 3 vs Day 87 comparison.' },
  ],
  'plan-m': [
    { key: 'default', label: 'Default', description: 'Month view with mixed dot indicators, day 16 selected.' },
    { key: 'empty-month', label: 'Empty month', description: 'No events planned — all cells blank, CTA to start planning.' },
  ],
  'plan-w': [
    { key: 'default', label: 'Default', description: 'Week view with icon blocks, Thursday selected.' },
    { key: 'all-done', label: 'All done', description: 'Every event has a green check overlay. Summary shows 10/10.' },
  ],
  'plan-d': [
    { key: 'default', label: 'Default', description: 'Day view with 6 events, 3 done, NOW at 17:30.' },
    { key: 'morning', label: 'Morning — nothing done', description: 'NOW marker at 06:00, all events upcoming.' },
    { key: 'rest-day', label: 'Rest day', description: 'No events. Single "rest" block with recovery tips.' },
  ],
  'train-prog': [
    { key: 'default', label: 'With program', description: 'Weekly plan generated from goals — session cards with modality tags, exercise previews, Start buttons.' },
    { key: 'no-plan', label: 'No program', description: 'User has not completed onboarding. Empty state with prompt to complete onboarding.' },
    { key: 'mid-week', label: 'Mid-week progress', description: 'Some sessions marked complete, others upcoming. Today highlighted.' },
  ],
  'train-a': [
    { key: 'default', label: 'Review phase', description: 'Exercise list preview with sets/reps/load and form cues. "Begin Workout" button.' },
    { key: 'execute', label: 'Execute phase', description: 'Active set logging with RPE, progress rail, elapsed timer, rest countdown.' },
    { key: 'rest', label: 'Rest timer', description: 'Between sets — rest countdown with progress bar and skip button.' },
    { key: 'summary', label: 'Summary phase', description: 'Post-session: computed volume, avg RPE, exercise breakdown. Green hero checkmark.' },
  ],
  'macro-a': [
    { key: 'default', label: 'Default', description: 'Targets for week 19, 1,660 kcal budget, P/C/F breakdown.' },
    { key: 'deficit-high', label: 'High deficit', description: 'Deficit at -30% TDEE. Warning tag and adjusted macro targets.' },
    { key: 'surplus', label: 'Surplus mode', description: 'Building phase — positive calorie delta, higher carbs.' },
  ],
  'macro-b': [
    { key: 'default', label: 'Default', description: '14 meals suggested, all visible in queue.' },
    { key: 'swapped', label: 'After swap', description: 'One meal swapped — diff indicator showing old → new.' },
  ],
  'batch-a': [
    { key: 'default', label: 'Default', description: '3 batch recipes with portions and ingredients.' },
  ],
  'macro-c': [
    { key: 'default', label: 'Default', description: 'Shopping list with items to buy, grouped by category.' },
    { key: 'all-checked', label: 'All checked off', description: 'Every item purchased. Empty state with "You\'re all set" message.' },
    { key: 'partial', label: 'Partially checked', description: 'Some items checked, progress shown.' },
  ],
  'fridge-a': [
    { key: 'default', label: 'Default', description: 'Pantry with mixed stock — some items missing, some expiring.' },
    { key: 'well-stocked', label: 'Well stocked', description: 'All items available, no missing, filter shows "0 MISSING".' },
    { key: 'low-stock', label: 'Low stock', description: 'Multiple items missing, expiring alerts prominent.' },
  ],
  'prep-a': [
    { key: 'default', label: 'Default', description: 'Pre-cook merge of 3 recipes, ingredient list visible.' },
    { key: 'conflict', label: 'Oven conflict', description: 'Red alert: two recipes need oven at same time, resolve options shown.' },
  ],
  'morph': [
    { key: 'default', label: 'Collapsed', description: 'Recipe card in collapsed state with pulse button.' },
    { key: 'expanded', label: 'Expanded — cook mode', description: 'Card morphed into full cook mode with step-by-step instructions.' },
  ],
  'prep-b': [
    { key: 'default', label: 'Default', description: 'Parallel timeline with 3 lanes, NOW at 22 min.' },
    { key: 'early', label: 'Just started', description: 'NOW at 0 min, all steps upcoming.' },
  ],
  'prep-c': [
    { key: 'default', label: 'Default', description: 'Active cook mode — step instruction with timer bar.' },
    { key: 'timer-alert', label: 'Timer alert', description: 'A timer has expired — pulsing alert, attention needed.' },
  ],
  'profile': [
    { key: 'default', label: 'Default', description: 'Profile with active contract, 14-day check-in streak.' },
    { key: 'no-contract', label: 'No active contract', description: 'Goal completed or not set. CTA to start new goal.' },
  ],
}

// ── SCREEN ANATOMY ──────────────────────────────────────────
// Each entry maps a screen ID to its component tree + notes.

export const SCREEN_ANATOMY = {
  'dash-bal': {
    notes: 'Personalised 2-column tile grid. Three layout presets (balanced/nutrition/training) control tile density and ordering.',
    tree: { component: 'Phone', children: [
      { component: 'FLabel', props: { children: 'DASHBOARD' } },
      { component: 'DensityControl', note: 'Screen-local toggle: BAL / NUT / TRN' },
      { component: 'FTileGrid', props: { padding: 16 }, children: [
        { component: 'GoalTile', props: { density: 'mid', span: 2 } },
        { component: 'CalendarTile', props: { density: 'mid', span: 2 } },
        { component: 'MacroTile', props: { density: 'mid', span: 2 } },
        { component: 'SessionTile', props: { density: 'mid', span: 1 } },
        { component: 'PrepTile', props: { density: 'mid', span: 1 } },
        { component: 'CheckInTile', props: { density: 'compact', span: 2 } },
        { component: 'FridgeTile', props: { density: 'compact', span: 1 } },
        { component: 'StreakTile', props: { density: 'compact', span: 1 } },
        { component: 'TDEETile', props: { density: 'compact', span: 1 } },
      ]},
      { component: 'FTabBar', props: { active: 2 } },
    ]},
  },
  'dash-nut': {
    notes: 'Nutrition-focused dashboard — macro and prep tiles promoted to full density.',
    tree: { component: 'Phone', children: [
      { component: 'FLabel' }, { component: 'DensityControl' },
      { component: 'FTileGrid', children: [
        { component: 'MacroTile', props: { density: 'full', span: 2 } },
        { component: 'PrepTile', props: { density: 'full', span: 2 } },
        { component: 'GoalTile', props: { density: 'compact', span: 2 } },
        { component: 'CalendarTile', props: { density: 'compact', span: 2 } },
        { component: 'SessionTile', props: { density: 'compact', span: 1 } },
      ]},
      { component: 'FTabBar', props: { active: 2 } },
    ]},
  },
  'dash-trn': {
    notes: 'Training-focused dashboard — session and check-in tiles promoted.',
    tree: { component: 'Phone', children: [
      { component: 'FLabel' }, { component: 'DensityControl' },
      { component: 'FTileGrid', children: [
        { component: 'SessionTile', props: { density: 'full', span: 2 } },
        { component: 'CheckInTile', props: { density: 'full', span: 2 } },
        { component: 'GoalTile', props: { density: 'compact', span: 2 } },
        { component: 'CalendarTile', props: { density: 'compact', span: 2 } },
      ]},
      { component: 'FTabBar', props: { active: 2 } },
    ]},
  },
  'welcome': {
    notes: 'First-impression hero. No nav bar — intentionally open. Jewel CTA.',
    tree: { component: 'Phone', children: [
      { component: 'FMono', props: { children: 'V0.2' } },
      { component: 'FJewel', props: { glyph: 'ICONS.fwd', children: 'Begin' } },
    ]},
  },
  'goal-a': {
    notes: 'Interactive goal setting — slider for target BF%, timeline picker.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Step 02 / 04' } },
      { component: 'FLabel', props: { children: 'Where you are' } },
      { component: 'FNum', props: { size: 84, unit: '%' } },
      { component: 'FLabel', props: { children: 'Target body fat' } },
      { component: 'FScale', props: { marks: [10,15,20,25,30], suffix: '%' } },
      { component: 'input[range]', note: 'Interactive slider' },
      { component: 'FBtn', props: { variant: 'editorial' } },
    ]},
  },
  'goal-b': {
    notes: 'Goal contract summary — confirms the brief before commitment.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Your brief' } },
      { component: 'FLabel', props: { children: 'The contract' } },
      { component: 'FNum', props: { size: 42 } },
      { component: 'Row', note: 'Multiple data rows with label/value/unit/tag' },
      { component: 'FBtn', props: { variant: 'ghost' } },
      { component: 'FBtn', props: { variant: 'split' } },
    ]},
  },
  'tdee-a': {
    notes: 'Live TDEE estimate with 7-day trajectory graph and confidence band.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Expenditure' } },
      { component: 'FLabel', props: { children: 'TDEE 7-day average' } },
      { component: 'FNum', props: { size: 76, children: '2,420' } },
      { component: 'FTag', props: { tone: 'green', children: 'NARROWING' } },
      { component: 'TDEEPath', note: 'SVG trajectory visualization (screen-local)' },
      { component: 'FLabel', props: { children: 'Model confidence' } },
      { component: 'FTexBar', props: { pct: 74, height: 10 } },
      { component: 'FTabBar', props: { active: 3 } },
    ]},
  },
  'tdee-b': {
    notes: 'How the confidence band narrows from Day 3 to Day 87.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Confidence' } },
      { component: 'FNum', props: { size: 36 } },
      { component: 'TDEEPath', note: 'Wide band (Day 3)' },
      { component: 'TDEEPath', note: 'Narrow band (Day 87)' },
    ]},
  },
  'plan-m': {
    notes: 'Calendar month view with color-coded dot indicators and day detail card.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'May 2026' } },
      { component: 'FLabel' }, { component: 'FNum', props: { size: 56 } },
      { component: 'ViewSwitcher', note: 'M / W / D toggle + nav arrows' },
      { component: 'MonthGrid', note: '7-col calendar with dots per day' },
      { component: 'FTabBar', props: { active: 0 } },
    ]},
  },
  'plan-w': {
    notes: 'Calendar week view with event type icons and drill-down detail.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar' },
      { component: 'ViewSwitcher' },
      { component: 'WeekGrid', note: '7-col with colored event buttons per day' },
      { component: 'EventDetailCard', note: 'Selected event detail' },
      { component: 'Legend', note: 'TRAIN / MEAL / CHECK-IN counts' },
      { component: 'FTabBar', props: { active: 0 } },
    ]},
  },
  'plan-d': {
    notes: 'Calendar day view with 24h timeline, NOW marker, and up-next card.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar' },
      { component: 'ViewSwitcher' },
      { component: 'DateHeader', note: 'Day name, date, event count, ON PACE status' },
      { component: 'UpNextCard', children: [
        { component: 'FPulseBtn', props: { size: 44 } },
      ]},
      { component: 'HourTimeline', note: 'Hour labels + positioned event blocks + NOW marker' },
      { component: 'FTabBar', props: { active: 0 } },
    ]},
  },
  'train-prog': {
    notes: 'Program overview — weekly training plan generated from user goals + constraints. Shows session cards with modality tags, exercise previews, and Start buttons.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Training' } },
      { component: 'FLabel', props: { children: 'THIS WEEK' } },
      { component: 'FMono', note: 'Split label and goal attribution' },
      { component: 'WeekSchedule', note: '7-day card list', children: [
        { component: 'SessionCard', note: 'Training day — name, modality tag, exercises, Start button', children: [
          { component: 'FTag', note: 'Modality tag (HYPERTROPHY, HIIT, etc.)' },
          { component: 'ExercisePreview', note: 'First 3 exercises with sets/reps/load' },
          { component: 'FBtn', props: { variant: 'primary', children: 'Start session' } },
        ]},
        { component: 'RestDayRow', note: 'Recovery day — minimal row with dot' },
      ]},
      { component: 'StatsFooter', note: 'Sessions/week, rest days, split label', children: [
        { component: 'FSurface', note: '3-column stat cards' },
      ]},
    ]},
  },
  'train-a': {
    notes: 'Active training session — three phases: Review (exercise list) → Execute (set logging with RPE, rest timers) → Summary (auto-computed volume, avg RPE).',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Training' } },
      { component: 'ProgressRail', note: 'Segmented bar — done/active/remaining exercises' },
      { component: 'ElapsedTimer', children: [
        { component: 'FNum', props: { size: 32, children: '22:14' } },
        { component: 'FMono', note: 'Set counter: 8 / 16' },
      ]},
      { component: 'ExerciseFocus', note: 'Current exercise name, muscles, form cue', children: [
        { component: 'SetTracker', note: 'Visual cards per set — checkmark/accent/empty' },
        { component: 'RPESelector', note: '6 buttons (5-10) for perceived exertion' },
        { component: 'FBtn', props: { variant: 'primary', children: 'Log set' } },
      ]},
      { component: 'RestTimer', note: 'Countdown bar with skip button' },
      { component: 'Toolbar', note: 'Pause/Resume, Skip Exercise, End' },
    ]},
  },
  'macro-a': {
    notes: 'Weekly macro targets — calorie budget, P/C/F breakdown, 7-day meal strip.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Week 19' } },
      { component: 'FNum', props: { size: 68, children: '1,660' } },
      { component: 'MacroCards', note: '3-col: Protein / Carbs / Fat with bars' },
      { component: 'FSection', props: { label: "This week's plan" } },
      { component: 'DayStrip', note: '7-col with meal counts per day' },
      { component: 'FBtn', props: { variant: 'editorial' } },
      { component: 'FTabBar', props: { active: 1 } },
    ]},
  },
  'macro-b': {
    notes: 'Meal queue — 14 meals suggested by the planner, swappable.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: '14 meals 7 days' } },
      { component: 'FNum', props: { size: 32 } },
      { component: 'MealCards', note: 'List of meal cards with image, name, macros, BATCH tag' },
      { component: 'FTabBar', props: { active: 1 } },
    ]},
  },
  'batch-a': {
    notes: 'Batch cooking strategy — 3 recipes optimized for efficiency.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Batch Strategy' } },
      { component: 'FNum', props: { size: 64, children: '03' } },
      { component: 'BatchCards', note: 'Recipe cards with FTag, portions, P/C/F, ingredient chips' },
      { component: 'FBtn', props: { variant: 'editorial' } },
    ]},
  },
  'macro-c': {
    notes: 'Shopping list — delta-based, grouped by category, with have/need tracking.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Shopping list' } },
      { component: 'FNum', props: { children: 'To buy count' } },
      { component: 'CategorySections', note: 'Grouped ingredient rows with checkboxes' },
      { component: 'FToolbar', props: { cells: ['Export', 'Send to Instacart', 'More'] } },
    ]},
  },
  'fridge-a': {
    notes: 'Pantry inventory — what\'s home, what\'s missing, what\'s expiring.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Pantry' } },
      { component: 'FNum', props: { size: 64 } },
      { component: 'FilterButtons', note: 'ALL / MISSING / EXPIRING' },
      { component: 'CategorySections', note: 'Grouped items with have/need quantities' },
      { component: 'FToolbar', props: { cells: ['Scan', 'Buy missing', 'Filter'] } },
    ]},
  },
  'prep-a': {
    notes: 'Pre-cook audit — merges 3 recipes into one combined prep session.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Merge 3 recipes' } },
      { component: 'FNum', props: { size: 36 } },
      { component: 'RecipeCards', note: '3 cards with colored left border' },
      { component: 'FSection', props: { label: 'Combined ingredients' } },
      { component: 'CheckableRows', note: 'Ingredient list with checkmarks' },
      { component: 'ConflictAlert', note: 'Red alert box for oven conflict' },
      { component: 'FBtn', props: { variant: 'split' } },
    ]},
  },
  'morph': {
    notes: 'Card-to-cook morph animation — collapsed recipe card expands into cook mode.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Tonight' } },
      { component: 'FNum' },
      { component: 'MacroStrip', note: '4-col: KCAL / PROT / CARB / FAT' },
      { component: 'MorphCard', note: 'Collapses/expands between recipe and cook mode', children: [
        { component: 'FPulseBtn', props: { size: 44 } },
        { component: 'StepContent', note: 'Instruction, detail chip, illustration' },
      ]},
      { component: 'FSection', props: { label: 'Why this dish' } },
      { component: 'FTag' },
    ]},
  },
  'prep-b': {
    notes: 'Parallel cooking timeline — Gantt-style lanes with NOW marker.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Cook 22m elapsed' } },
      { component: 'FLabel' }, { component: 'FNum' },
      { component: 'TimeRuler', note: 'Horizontal time scale' },
      { component: 'GanttLanes', note: 'Per-recipe lanes with positioned step blocks' },
      { component: 'ActiveStepCard', note: 'Focused step with instruction + FTexBar' },
      { component: 'FToolbar', props: { cells: ['Pause', 'Cook mode', 'More'] } },
    ]},
  },
  'prep-c': {
    notes: 'Active cook mode — full-screen step-by-step with persistent timer bar.',
    tree: { component: 'Phone', children: [
      { component: 'TimerBar', note: 'Persistent bar with 3 active timers' },
      { component: 'StepIndicator', note: 'Pulsing dot + step N of M' },
      { component: 'InstructionHeading', note: 'Large instruction text' },
      { component: 'CueChip', note: 'FIcon + FMono + FTag' },
      { component: 'NavButtons', note: 'Prev / Done buttons' },
    ]},
  },
  'profile': {
    notes: 'Account hub — avatar, active goal contract, check-in history, settings.',
    tree: { component: 'Phone', children: [
      { component: 'FNavBar', props: { title: 'Profile' } },
      { component: 'Avatar', props: { size: 72, tone: 'warm' } },
      { component: 'GoalCard', note: 'Active contract with FTexBar progress' },
      { component: 'FSection', props: { label: 'Recent check-ins' } },
      { component: 'CheckinRows', note: 'Date, weight, BF%, delta' },
      { component: 'FSection', props: { label: 'Settings' } },
      { component: 'SettingRows', note: 'Icon + label + sub + arrow' },
      { component: 'FBtn', props: { variant: 'ghost', children: 'Sign out' } },
      { component: 'FTabBar', props: { active: 4 } },
    ]},
  },
}

// ── COMPONENT CATALOG ───────────────────────────────────────
// Each entry describes a reusable component's API.

export const COMPONENT_CATALOG = [
  // ── Primitives ──
  { id: 'card', name: 'Card', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Surface container with variant-based styling. Supports interactive mode, selection, and disabled state.',
    props: [
      { name: 'variant', type: "'surface' | 'elevated' | 'outlined' | 'ghost'", default: "'surface'", description: 'Visual treatment' },
      { name: 'padding', type: 'number', default: 'Space[5]', description: 'Inner padding (px)' },
      { name: 'radius', type: 'number', default: 'Radius.xl', description: 'Border radius' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Accent border + background' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims card, disables interaction' },
      { name: 'onClick', type: '(e) => void', default: '-', description: 'Makes card interactive' },
    ], examples: ['card-variants', 'card-states'] },

  { id: 'button', name: 'Button', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Action button with 4 semantic variants, 3 sizes. Loading spinner and icon slots.',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", description: 'Color scheme' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and font size' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows spinner' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches to 100%' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Leading icon' },
      { name: 'iconTrailing', type: 'ReactNode', default: '-', description: 'Trailing icon' },
    ], examples: ['button-variants', 'button-sizes', 'button-states'] },

  { id: 'icon-button', name: 'IconButton', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Circular button for icon-only actions.',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'ghost'", description: 'Visual style' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '28 / 36 / 44px' },
      { name: 'label', type: 'string', default: '-', description: 'Accessible label (aria-label)' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction' },
    ], examples: ['icon-button-variants'] },

  { id: 'tag', name: 'Tag', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Small status badge with semantic tones.',
    props: [
      { name: 'tone', type: "'neutral' | 'accent' | 'green' | 'red' | 'blue' | 'solid'", default: "'neutral'", description: 'Color scheme' },
      { name: 'icon', type: 'ReactNode', default: '-', description: 'Leading icon' },
    ], examples: ['tag-tones'] },

  { id: 'row', name: 'Row', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Horizontal list item — the workhorse for lists, settings, checkable items.',
    props: [
      { name: 'title', type: 'string', default: '-', description: 'Primary text' },
      { name: 'subtitle', type: 'string', default: '-', description: 'Secondary text' },
      { name: 'leading', type: 'ReactNode', default: '-', description: 'Left element' },
      { name: 'trailing', type: 'ReactNode', default: '-', description: 'Right element' },
      { name: 'checked', type: 'boolean', default: '-', description: 'Checkbox state' },
      { name: 'onToggle', type: '(checked) => void', default: '-', description: 'Makes row checkable' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Reduces padding' },
      { name: 'divider', type: 'boolean', default: 'true', description: 'Bottom border' },
    ], examples: ['row-variants'] },

  { id: 'progress-bar', name: 'ProgressBar', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Linear progress indicator with standard, textured, and segmented variants.',
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current value' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
      { name: 'variant', type: "'standard' | 'textured' | 'segmented'", default: "'standard'", description: 'Visual style' },
      { name: 'color', type: 'string', default: 'Color.accent', description: 'Fill color' },
      { name: 'height', type: 'number', default: '6', description: 'Bar height (px)' },
      { name: 'animated', type: 'boolean', default: 'false', description: 'Transition animation' },
      { name: 'showScale', type: 'boolean', default: 'false', description: 'Show scale labels below' },
    ], examples: ['progress-bar-variants'] },

  { id: 'progress-ring', name: 'ProgressRing', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Circular SVG progress indicator. Turns green at 100%.',
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current value' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
      { name: 'size', type: 'number', default: '80', description: 'Diameter (px)' },
      { name: 'strokeWidth', type: 'number', default: '5', description: 'Ring thickness' },
      { name: 'animated', type: 'boolean', default: 'false', description: 'Transition animation' },
    ], examples: ['progress-ring-variants'] },

  { id: 'metric-display', name: 'MetricDisplay', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Large numeral with label and unit. The hero pattern of the design system.',
    props: [
      { name: 'value', type: 'string | number', default: '-', description: 'Display value' },
      { name: 'unit', type: 'string', default: '-', description: 'Unit suffix' },
      { name: 'label', type: 'string', default: '-', description: 'Upper label' },
      { name: 'sublabel', type: 'string', default: '-', description: 'Lower sublabel' },
      { name: 'size', type: "'lg' | 'md' | 'sm'", default: "'md'", description: 'Numeral size' },
      { name: 'tone', type: "'default' | 'accent' | 'green' | 'red' | 'mute'", default: "'default'", description: 'Color tone' },
    ], examples: ['metric-display-variants'] },

  { id: 'filter-group', name: 'FilterGroup', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Row of toggle buttons — single active selection (radio group).',
    props: [
      { name: 'options', type: '[{value, label, count?}]', default: '-', description: 'Option list' },
      { name: 'value', type: 'string', default: '-', description: 'Active value' },
      { name: 'onChange', type: '(value) => void', default: '-', description: 'Selection handler' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Label size' },
    ], examples: ['filter-group-demo'] },

  { id: 'avatar', name: 'Avatar', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Circular identity indicator with initials or image.',
    props: [
      { name: 'initials', type: 'string', default: '-', description: 'Displayed when no image' },
      { name: 'image', type: 'string', default: '-', description: 'Background image URL' },
      { name: 'tone', type: "'neutral' | 'warm' | 'cool'", default: "'neutral'", description: 'Color tone' },
      { name: 'size', type: 'number', default: '40', description: 'Diameter (px)' },
    ], examples: ['avatar-tones'] },

  { id: 'skeleton', name: 'Skeleton', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Shimmer loading placeholder.',
    props: [
      { name: 'width', type: 'number | string', default: "'100%'", description: 'Element width' },
      { name: 'height', type: 'number', default: '14', description: 'Element height' },
      { name: 'circle', type: 'boolean', default: 'false', description: 'Round shape' },
    ], examples: ['skeleton-shapes'] },

  { id: 'divider', name: 'Divider', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Horizontal rule with optional centered label.',
    props: [
      { name: 'label', type: 'string', default: '-', description: 'Centered text' },
      { name: 'inset', type: 'number', default: '0', description: 'Left margin' },
    ], examples: ['divider-variants'] },

  { id: 'step-indicator', name: 'StepIndicator', layer: 'primitive', source: 'system/primitives.jsx',
    description: 'Vertical step sequence with done/active/upcoming/skipped states.',
    props: [
      { name: 'steps', type: '[{label, sublabel?, state}]', default: '-', description: 'Step list' },
      { name: 'children', type: '(step, i) => node', default: '-', description: 'Render prop for active step content' },
    ], examples: ['step-indicator-demo'] },

  // ── Feature Components ──
  { id: 'phone', name: 'Phone', layer: 'feature', source: 'components/shared.jsx',
    description: 'iOS device shell (402x874px) with status bar, dynamic island, and home indicator.',
    props: [
      { name: 'statusTime', type: 'string', default: "'9:41'", description: 'Clock text' },
    ], examples: ['phone-demo'] },

  { id: 'fnavbar', name: 'FNavBar', layer: 'feature', source: 'components/shared.jsx',
    description: 'Top navigation bar with leading/title/trailing slots.',
    props: [
      { name: 'title', type: 'string', default: '-', description: 'Center mono label' },
      { name: 'leading', type: 'ReactNode', default: '-', description: 'Left element(s)' },
      { name: 'trailing', type: 'ReactNode', default: '-', description: 'Right element(s)' },
    ], examples: ['fnavbar-demo'] },

  { id: 'fbtn', name: 'FBtn', layer: 'feature', source: 'components/shared.jsx',
    description: 'Feature button with 6 variants including editorial and split CTA styles.',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'editorial' | 'split'", default: "'secondary'", description: 'Visual style' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
      { name: 'full', type: 'boolean', default: 'false', description: 'Full width' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner state' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
      { name: 'icon', type: 'string', default: '-', description: 'Trailing icon path' },
      { name: 'iconLeading', type: 'string', default: '-', description: 'Leading icon path' },
      { name: 'labelStyle', type: "'mono' | 'sans'", default: "'mono'", description: 'Label typography' },
    ], examples: ['fbtn-variants', 'fbtn-special'] },

  { id: 'fnum', name: 'FNum', layer: 'feature', source: 'components/shared.jsx',
    description: 'Big thin numeral with optional super-unit. Core display primitive.',
    props: [
      { name: 'size', type: 'number', default: '56', description: 'Font size (px)' },
      { name: 'weight', type: 'number', default: '200', description: 'Font weight' },
      { name: 'unit', type: 'string', default: '-', description: 'Super-positioned unit label' },
      { name: 'color', type: 'string', default: 'Color.text', description: 'Text color' },
    ], examples: ['fnum-sizes'] },

  { id: 'ftexbar', name: 'FTexBar', layer: 'feature', source: 'components/shared.jsx',
    description: 'Textured progress bar with hatching pattern and animated reveal.',
    props: [
      { name: 'pct', type: 'number', default: '70', description: 'Fill percentage' },
      { name: 'height', type: 'number', default: '22', description: 'Bar height' },
      { name: 'color', type: 'string', default: 'Color.accent', description: 'Fill color' },
      { name: 'animate', type: 'boolean', default: 'true', description: 'Animated reveal' },
    ], examples: ['ftexbar-demo'] },

  { id: 'fsegbar', name: 'FSegBar', layer: 'feature', source: 'components/shared.jsx',
    description: 'Segmented gauge bar with staggered reveal animation.',
    props: [
      { name: 'pct', type: 'number', default: '70', description: 'Fill percentage' },
      { name: 'segments', type: 'number', default: '18', description: 'Segment count' },
      { name: 'height', type: 'number', default: '56', description: 'Bar height' },
      { name: 'animate', type: 'boolean', default: 'true', description: 'Staggered reveal' },
    ], examples: ['fsegbar-demo'] },

  { id: 'ftabbar', name: 'FTabBar', layer: 'feature', source: 'components/shared.jsx',
    description: 'Bottom icon tab navigation — 5 fixed tabs with blur backdrop.',
    props: [
      { name: 'active', type: 'number', default: '0', description: 'Active tab index (0-4)' },
    ], examples: ['ftabbar-demo'] },

  { id: 'ftoolbar', name: 'FToolbar', layer: 'feature', source: 'components/shared.jsx',
    description: '3-cell persistent bottom action bar.',
    props: [
      { name: 'cells', type: '[{icon?, label, primary?, onClick, stay?}]', default: '[]', description: 'Cell configuration' },
    ], examples: ['ftoolbar-demo'] },

  { id: 'fjewel', name: 'FJewel', layer: 'feature', source: 'components/shared.jsx',
    description: 'Iridescent hero button with conic gradient ring and glow. Used sparingly.',
    props: [
      { name: 'glyph', type: 'string', default: '-', description: 'SVG path d attribute' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Smaller 48px size' },
    ], examples: ['fjewel-demo'] },

  { id: 'fpulsebtn', name: 'FPulseBtn', layer: 'feature', source: 'components/shared.jsx',
    description: 'Pulsing round action button with animated ring.',
    props: [
      { name: 'icon', type: 'string', default: 'ICONS.play', description: 'Icon path' },
      { name: 'size', type: 'number', default: '44', description: 'Button diameter' },
      { name: 'color', type: 'string', default: 'Color.accent', description: 'Fill color' },
    ], examples: ['fpulsebtn-demo'] },

  { id: 'flabel', name: 'FLabel', layer: 'feature', source: 'components/shared.jsx',
    description: 'Mono uppercase label — structural text primitive.',
    props: [
      { name: 'color', type: 'string', default: 'Color.mute', description: 'Text color' },
      { name: 'size', type: 'number', default: '10', description: 'Font size' },
      { name: 'mb', type: 'number', default: '6', description: 'Margin bottom' },
    ], examples: ['flabel-demo'] },

  { id: 'ficon', name: 'FIcon', layer: 'feature', source: 'components/shared.jsx',
    description: 'Inline SVG icon helper. 30+ paths available via ICONS constant.',
    props: [
      { name: 'path', type: 'string', default: '-', description: 'SVG path d or JSX element' },
      { name: 'size', type: 'number', default: '18', description: 'Width/height' },
      { name: 'color', type: 'string', default: "'currentColor'", description: 'Stroke color' },
      { name: 'stroke', type: 'number', default: '1.8', description: 'Stroke width' },
      { name: 'fill', type: 'string', default: "'none'", description: 'Fill (overrides stroke)' },
    ], examples: ['ficon-grid'] },

  // ── Domain ──
  { id: 'macro-block', name: 'MacroBlock', layer: 'domain', source: 'system/domain.jsx',
    description: 'Labeled metric with accent bottom bar — for protein/carbs/fat display.',
    props: [
      { name: 'label', type: 'string', default: '-', description: 'Upper label' },
      { name: 'value', type: 'number', default: '-', description: 'Display value' },
      { name: 'unit', type: 'string', default: "'g'", description: 'Unit suffix' },
      { name: 'color', type: 'string', default: 'Color.accent', description: 'Bar color' },
    ], examples: ['macro-block-demo'] },

  { id: 'recipe-card', name: 'RecipeCard', layer: 'domain', source: 'system/domain.jsx',
    description: 'Meal plan card with tag, macros, prep time, and ingredient chips.',
    props: [
      { name: 'tag', type: "'fresh prep' | 'batch cook' | 'slow cook'", default: '-', description: 'Recipe type badge' },
      { name: 'name', type: 'string', default: '-', description: 'Recipe name' },
      { name: 'portions', type: 'number', default: '-', description: 'Portion count' },
      { name: 'estTime', type: 'string', default: '-', description: 'Estimated prep time' },
      { name: 'macros', type: '{p, c, f}', default: '-', description: 'Macro grams' },
      { name: 'ingredients', type: 'string[]', default: '[]', description: 'Ingredient list' },
    ], examples: ['recipe-card-demo'] },

  { id: 'set-tracker', name: 'SetTracker', layer: 'domain', source: 'system/domain.jsx',
    description: 'Exercise set progress blocks with complete/skip CTAs.',
    props: [
      { name: 'exercise', type: 'string', default: '-', description: 'Exercise name' },
      { name: 'category', type: 'string', default: '-', description: 'Category label' },
      { name: 'sets', type: '[{reps, weight}]', default: '[]', description: 'Set data' },
      { name: 'currentSet', type: 'number', default: '0', description: 'Active set index' },
    ], examples: ['set-tracker-demo'] },

  { id: 'shopping-row', name: 'ShoppingRow', layer: 'domain', source: 'system/domain.jsx',
    description: 'Need/have ingredient tracker with +add action.',
    props: [
      { name: 'name', type: 'string', default: '-', description: 'Ingredient name' },
      { name: 'need', type: 'number', default: '-', description: 'Amount needed' },
      { name: 'have', type: 'number', default: '-', description: 'Amount available' },
      { name: 'onAdd', type: '() => void', default: '-', description: 'Add-to-cart handler' },
    ], examples: ['shopping-row-demo'] },

  // ── Chart ──
  { id: 'line-chart', name: 'LineChart', layer: 'chart', source: 'system/chart.jsx',
    description: 'SVG line chart with gradient fill, dot markers, and optional target line.',
    props: [
      { name: 'data', type: 'number[]', default: '[]', description: 'Y-values (evenly spaced)' },
      { name: 'target', type: 'number', default: '-', description: 'Horizontal target line' },
      { name: 'title', type: 'string', default: '-', description: 'Top-left label' },
      { name: 'titleValue', type: 'string', default: '-', description: 'Large display value' },
      { name: 'xLabels', type: 'string[]', default: '-', description: 'X-axis labels' },
      { name: 'height', type: 'number', default: '180', description: 'Chart area height' },
    ], examples: ['line-chart-demo'] },

  // ── Calendar ──
  { id: 'calendar-month', name: 'CalendarMonth', layer: 'calendar', source: 'system/calendar.jsx',
    description: 'Month grid with dot indicators, today ring, selected pill, detail card.',
    props: [
      { name: 'dates', type: '[{day, inMonth, dots?, selected?, today?}]', default: '-', description: 'Date cell data (35-42)' },
      { name: 'monthLabel', type: 'string', default: '-', description: 'Month header text' },
      { name: 'selectedDetail', type: '{date, events[], onViewDay?}', default: '-', description: 'Selected day detail card' },
      { name: 'onSelectDate', type: '(index) => void', default: '-', description: 'Date click handler' },
    ], examples: ['calendar-month-demo'] },

  { id: 'calendar-week', name: 'CalendarWeek', layer: 'calendar', source: 'system/calendar.jsx',
    description: '7-day column grid with icon blocks, detail card, summary bar.',
    props: [
      { name: 'days', type: '[{label, date, blocks[], selected?, today?}]', default: '-', description: 'Day column data' },
      { name: 'summary', type: '{train, meal, checkIn}', default: '-', description: 'Summary bar counts' },
      { name: 'onSelectDay', type: '(index) => void', default: '-', description: 'Day click handler' },
    ], examples: ['calendar-week-demo'] },

  { id: 'calendar-day', name: 'CalendarDay', layer: 'calendar', source: 'system/calendar.jsx',
    description: 'Single day with 24h timeline, NOW marker, and up-next card.',
    props: [
      { name: 'date', type: '{dayName, month, day, eventCount, doneCount, status?}', default: '-', description: 'Date header data' },
      { name: 'upNext', type: '{time, label, onStart?}', default: '-', description: 'Up-next card data' },
      { name: 'events', type: '[{startHour, endHour, label, sublabel?, done?, isNow?}]', default: '-', description: 'Timeline events' },
    ], examples: ['calendar-day-demo'] },

  // ── New domain components ──
  { id: 'info-row', name: 'InfoRow', layer: 'domain', source: 'system/domain.jsx',
    description: 'Horizontal KPI metric row — label + large value + unit + optional trailing tag badge.',
    props: [
      { name: 'label', type: 'string', default: '-', description: 'Upper label text' },
      { name: 'value', type: 'string | number', default: '-', description: 'Large display value' },
      { name: 'unit', type: 'string', default: '-', description: 'Unit suffix' },
      { name: 'tag', type: 'string', default: '-', description: 'Trailing badge text' },
      { name: 'tagTone', type: "'accent' | 'green'", default: "'accent'", description: 'Badge color tone' },
    ], examples: ['info-row-demo'] },

  { id: 'cook-status', name: 'CookStatus', layer: 'domain', source: 'system/domain.jsx',
    description: 'Active cooking state card — pulsing dot, recipe context, step instruction, timer + progress bar.',
    props: [
      { name: 'recipe', type: 'string', default: '-', description: 'Recipe name context' },
      { name: 'step', type: 'string', default: '-', description: 'Current instruction text' },
      { name: 'totalTime', type: 'string', default: '-', description: 'Total time label' },
      { name: 'remaining', type: 'string', default: '-', description: 'Remaining time label' },
      { name: 'mode', type: 'string', default: "'PASSIVE'", description: 'Step mode (PASSIVE / ACTIVE)' },
    ], examples: ['cook-status-demo'] },

  { id: 'meal-list-item', name: 'MealListItem', layer: 'domain', source: 'system/domain.jsx',
    description: 'Meal card with letter badge (A/B/C/D), name, time, day, macro breakdown, optional BATCH tag.',
    props: [
      { name: 'badge', type: 'string', default: '-', description: 'Letter badge (A-E)' },
      { name: 'name', type: 'string', default: '-', description: 'Meal name' },
      { name: 'time', type: 'string', default: '-', description: 'Meal time' },
      { name: 'day', type: 'string', default: '-', description: 'Day label' },
      { name: 'kcal', type: 'number', default: '-', description: 'Calorie count' },
      { name: 'macros', type: '{p, c, f}', default: '-', description: 'Macro grams' },
      { name: 'batch', type: 'boolean', default: 'false', description: 'Show BATCH badge' },
    ], examples: ['meal-list-item-demo'] },

  { id: 'up-next-card', name: 'UpNextCard', layer: 'domain', source: 'system/domain.jsx',
    description: 'Task preview card — "UP NEXT · time" label, task name, and play button.',
    props: [
      { name: 'time', type: 'string', default: '-', description: 'Scheduled time' },
      { name: 'label', type: 'string', default: '-', description: 'Task name' },
      { name: 'onStart', type: '() => void', default: '-', description: 'Play button handler' },
    ], examples: ['up-next-card-demo'] },

  { id: 'week-plan-summary', name: 'WeekPlanSummary', layer: 'domain', source: 'system/domain.jsx',
    description: 'Week overview card — meal count, batch count, and 7-day strip with per-day counts.',
    props: [
      { name: 'meals', type: 'number', default: '14', description: 'Total meal count' },
      { name: 'batches', type: 'number', default: '3', description: 'Batch count' },
      { name: 'days', type: 'number[]', default: '[]', description: 'Per-day meal counts (7 values)' },
    ], examples: ['week-plan-summary-demo'] },

  { id: 'exercise-timeline', name: 'ExerciseTimeline', layer: 'domain', source: 'system/domain.jsx',
    description: 'Vertical exercise rail — ring indicators (done/active/idle), exercise name, subtitle, expandable active content.',
    props: [
      { name: 'exercises', type: '[{name, subtitle, state, ...}]', default: '[]', description: 'Exercise list with done/active/idle states' },
      { name: 'renderActive', type: '(exercise, index) => ReactNode', default: '-', description: 'Render prop for active exercise expanded content' },
    ], examples: ['exercise-timeline-demo'] },
]
