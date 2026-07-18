// Mock User — single source of truth for all demo/fallback data.
// Values are hand-crafted for the "Daniel" demo persona and may not
// exactly match computeMacros() output. This is intentional — the
// numbers are tuned for visual presentation in the design handover.

import { Color } from '../ui/tokens'

// ── Profile ──────────────────────────────────────────────────────────

export const MOCK_PROFILE = {
  name: 'Daniel Lacayo',
  sex: 'male',
  weight: 82.1,
  height: 180,
  birthYear: 1996,
  activityLevel: 'moderate',
  bodyFat: '20-24',
  goal: 'recomp',
  goals: ['recomposition', 'fat_loss'],
  equipment: 'full_gym',
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  liftingExp: 'intermediate',
  cardioExp: 'beginner',
  dietary: [],
  injuries: [],
  focusMuscles: [],
}

// ── Targets (matches computeMacros() return shape) ───────────────────
// Derived: TDEE 2420, recomp modifier -150 → target 2270
// MACRO_RATIOS.recomposition: gPerKg 2.2, fat [20-25]%
// protein = 82.1 × 2.2 = 181g, fat = 2270 × 22.5% / 9 = 57g, carbs = remainder

export const MOCK_TARGETS = {
  tdee: 2420,
  target: 2270,
  protein: 181,
  carbs: 258,
  fat: 57,
}

// ── TDEE model data ──────────────────────────────────────────────────

export const MOCK_TDEE = {
  bmr: 1620,
  activityBudget: 800,
  activityToday: 580,
  confidence: 74,
  trend7d: [2180, 2250, 2300, 2340, 2280, 2360, 2310],
  confidenceTrend: [18, 22, 28, 35, 42, 48, 55, 62, 68, 72, 74],
}

// ── Body composition goal ────────────────────────────────────────────

export const MOCK_BODY = {
  currentBf: 22.4,
  targetBf: 15.0,
  weeks: 16,
  elapsed: 6,
}

// ── Hydration ────────────────────────────────────────────────────────

export const MOCK_WATER = {
  target: 2500,
  trend7d: [2100, 1800, 2300, 2500, 1900, 2200, 1250],
}

// ── Meal prep approach (derived from goal network) ───────────────────

export const MOCK_MEAL_PREP = {
  primary: 'Lean Prep',
  supporting: ['Post-Workout Recovery', 'Balanced Prep'],
  timing: 'Carb cycling — more carbs on training days',
  nutritionInfluence: [],
}

// ── Check-ins ────────────────────────────────────────────────────────

export const MOCK_CHECKINS = [
  { date: '12 May', weight: 82.1, bf: 20.1, delta: -0.4 },
  { date: '05 May', weight: 82.5, bf: 20.4, delta: -0.3 },
  { date: '28 Apr', weight: 82.8, bf: 20.6, delta: -0.5 },
  { date: '21 Apr', weight: 83.3, bf: 20.9, delta: -0.2 },
]

// ── Meals ────────────────────────────────────────────────────────────

export const MOCK_MEALS = [
  { time: '08:30', name: 'Breakfast', items: 'Oats, banana, whey', kcal: 420, p: 32, c: 58, f: 8 },
  { time: '12:00', name: 'Lunch', items: 'Chicken rice bowl (batch)', kcal: 620, p: 48, c: 64, f: 14, batch: true },
  { time: '15:30', name: 'Snack', items: 'Greek yoghurt, berries', kcal: 180, p: 18, c: 16, f: 6 },
]

// ── Macro adherence heatmap (8 weeks × 7 days, % of target) ─────────

export const MOCK_HEATMAP = {
  protein: [
    [96,  102, 94,  98,  92,  74,  68],
    [98,  95,  100, 97,  88,  70,  72],
    [102, 98,  96,  100, 94,  78,  65],
    [97,  104, 98,  96,  90,  82,  70],
    [100, 98,  102, 100, 96,  80,  76],
    [104, 100, 98,  102, 98,  86,  80],
    [100, 102, 104, 98,  100, 88,  84],
    [102, 100, 100, 104, 102, 92,  88],
  ],
  carbs: [
    [92,  98,  96,  90,  104, 128, 134],
    [96,  94,  100, 96,  108, 122, 130],
    [98,  100, 94,  98,  102, 118, 126],
    [94,  96,  98,  94,  100, 114, 120],
    [100, 98,  96,  100, 98,  112, 116],
    [98,  102, 100, 96,  96,  108, 112],
    [100, 98,  102, 100, 100, 106, 108],
    [98,  100, 98,  102, 98,  104, 106],
  ],
  fat: [
    [110, 104, 108, 102, 114, 126, 130],
    [106, 100, 104, 98,  110, 120, 124],
    [104, 102, 100, 104, 106, 116, 118],
    [100, 98,  102, 100, 104, 112, 114],
    [98,  100, 98,  102, 100, 108, 110],
    [102, 98,  100, 98,  98,  106, 108],
    [100, 100, 98,  100, 100, 104, 104],
    [98,  100, 100, 98,  98,  102, 102],
  ],
}

// ── Mock workout plan (for journey/demo screens) ────────────────────

export const MOCK_WORKOUT_PLAN = {
  programName: 'Recomp · Upper/Lower',
  splitLabel: 'Upper/Lower',
  totalWeeks: 12,
  currentWeek: 4,
  phase: 'Base',
  goals: ['recomposition', 'fat_loss'],
  modalities: ['hypertrophy', 'strength', 'hiit'],
  sessions: [
    { id: 'Mon-0', day: 'Mon', dayIndex: 0, modality: 'hypertrophy', modalityLabel: 'Hypertrophy', name: 'Upper A · Hypertrophy', focus: 'upper', completed: true, goalSources: ['recomposition'], estimatedMins: 52,
      exercises: [
        { exerciseId: 'db_incline', name: 'Incline DB Bench', category: 'compound', muscles: ['chest','shoulders'], cue: 'Control eccentric', sets: 4, reps: 10, load: 28, rest: 90, duration: 0 },
        { exerciseId: 'barbell_row', name: 'Barbell Row', category: 'compound', muscles: ['back','biceps'], cue: 'Drive elbows back', sets: 4, reps: 8, load: 60, rest: 90, duration: 0 },
        { exerciseId: 'ohp', name: 'Overhead Press', category: 'compound', muscles: ['shoulders','triceps'], cue: 'Brace core', sets: 3, reps: 10, load: 40, rest: 90, duration: 0 },
        { exerciseId: 'bicep_curl', name: 'Bicep Curl', category: 'isolation', muscles: ['biceps'], cue: 'No swing', sets: 3, reps: 12, load: 12, rest: 60, duration: 0 },
        { exerciseId: 'tricep_ext', name: 'Tricep Extension', category: 'isolation', muscles: ['triceps'], cue: 'Elbows stationary', sets: 3, reps: 12, load: 10, rest: 60, duration: 0 },
      ],
    },
    { id: 'Tue-1', day: 'Tue', dayIndex: 1, modality: 'hypertrophy', modalityLabel: 'Hypertrophy', name: 'Lower A · Hypertrophy', focus: 'lower', completed: true, goalSources: ['recomposition'], estimatedMins: 48,
      exercises: [
        { exerciseId: 'back_squat', name: 'Back Squat', category: 'compound', muscles: ['quads','glutes','core'], cue: 'Chest up, drive through floor', sets: 4, reps: 8, load: 80, rest: 120, duration: 0 },
        { exerciseId: 'rdl', name: 'Romanian Deadlift', category: 'compound', muscles: ['hamstrings','glutes'], cue: 'Push hips back', sets: 3, reps: 10, load: 70, rest: 90, duration: 0 },
        { exerciseId: 'db_lunge', name: 'Walking Lunge', category: 'compound', muscles: ['quads','glutes'], cue: 'Long stride', sets: 3, reps: 12, load: 20, rest: 60, duration: 0 },
        { exerciseId: 'leg_curl', name: 'Leg Curl', category: 'isolation', muscles: ['hamstrings'], cue: 'Squeeze at top', sets: 3, reps: 12, load: 30, rest: 60, duration: 0 },
      ],
    },
    { id: 'Thu-3', day: 'Thu', dayIndex: 3, modality: 'strength', modalityLabel: 'Strength', name: 'Upper B · Strength', focus: 'upper', completed: false, goalSources: ['fat_loss'], estimatedMins: 55,
      exercises: [
        { exerciseId: 'bench_press', name: 'Bench Press', category: 'compound', muscles: ['chest','triceps'], cue: 'Retract scapulae', sets: 5, reps: 5, load: 60, rest: 180, duration: 0 },
        { exerciseId: 'db_row', name: 'DB Row', category: 'compound', muscles: ['back','biceps'], cue: 'Row to hip', sets: 4, reps: 8, load: 24, rest: 90, duration: 0 },
        { exerciseId: 'lateral_raise', name: 'Lateral Raise', category: 'isolation', muscles: ['shoulders'], cue: 'Slight lean forward', sets: 3, reps: 15, load: 8, rest: 60, duration: 0 },
        { exerciseId: 'face_pull', name: 'Face Pull', category: 'isolation', muscles: ['rear_delts','rotator_cuff'], cue: 'Pull to ears', sets: 3, reps: 15, load: 15, rest: 60, duration: 0 },
      ],
    },
    { id: 'Fri-4', day: 'Fri', dayIndex: 4, modality: 'hiit', modalityLabel: 'HIIT', name: 'Lower B · HIIT Circuit', focus: 'lower', completed: false, goalSources: ['fat_loss'], estimatedMins: 35,
      exercises: [
        { exerciseId: 'goblet_squat', name: 'Goblet Squat', category: 'compound', muscles: ['quads','glutes'], cue: 'Hold bell at chest', sets: 3, reps: 15, load: 24, rest: 30, duration: 0 },
        { exerciseId: 'kb_swing', name: 'KB Swing', category: 'compound', muscles: ['glutes','hamstrings'], cue: 'Hinge, don\'t squat', sets: 3, reps: 15, load: 20, rest: 30, duration: 0 },
        { exerciseId: 'burpees', name: 'Burpees', category: 'hiit', muscles: ['full_body'], cue: 'Chest to floor', sets: 3, reps: 10, load: 0, rest: 30, duration: 0 },
      ],
    },
  ],
  schedule: [
    { id: 'Mon-0', day: 'Mon', dayIndex: 0, isRest: false, modality: 'hypertrophy', modalityLabel: 'Hypertrophy', name: 'Upper A · Hypertrophy', focus: 'upper', completed: true, goalSources: ['recomposition'], estimatedMins: 52,
      exercises: [
        { exerciseId: 'db_incline', name: 'Incline DB Bench', category: 'compound', muscles: ['chest','shoulders'], cue: 'Control eccentric', sets: 4, reps: 10, load: 28, rest: 90, duration: 0 },
        { exerciseId: 'barbell_row', name: 'Barbell Row', category: 'compound', muscles: ['back','biceps'], cue: 'Drive elbows back', sets: 4, reps: 8, load: 60, rest: 90, duration: 0 },
        { exerciseId: 'ohp', name: 'Overhead Press', category: 'compound', muscles: ['shoulders','triceps'], cue: 'Brace core', sets: 3, reps: 10, load: 40, rest: 90, duration: 0 },
        { exerciseId: 'bicep_curl', name: 'Bicep Curl', category: 'isolation', muscles: ['biceps'], cue: 'No swing', sets: 3, reps: 12, load: 12, rest: 60, duration: 0 },
        { exerciseId: 'tricep_ext', name: 'Tricep Extension', category: 'isolation', muscles: ['triceps'], cue: 'Elbows stationary', sets: 3, reps: 12, load: 10, rest: 60, duration: 0 },
      ],
    },
    { id: 'Tue-1', day: 'Tue', dayIndex: 1, isRest: false, modality: 'hypertrophy', modalityLabel: 'Hypertrophy', name: 'Lower A · Hypertrophy', focus: 'lower', completed: true, goalSources: ['recomposition'], estimatedMins: 48,
      exercises: [
        { exerciseId: 'back_squat', name: 'Back Squat', category: 'compound', muscles: ['quads','glutes','core'], cue: 'Chest up, drive through floor', sets: 4, reps: 8, load: 80, rest: 120, duration: 0 },
        { exerciseId: 'rdl', name: 'Romanian Deadlift', category: 'compound', muscles: ['hamstrings','glutes'], cue: 'Push hips back', sets: 3, reps: 10, load: 70, rest: 90, duration: 0 },
        { exerciseId: 'db_lunge', name: 'Walking Lunge', category: 'compound', muscles: ['quads','glutes'], cue: 'Long stride', sets: 3, reps: 12, load: 20, rest: 60, duration: 0 },
        { exerciseId: 'leg_curl', name: 'Leg Curl', category: 'isolation', muscles: ['hamstrings'], cue: 'Squeeze at top', sets: 3, reps: 12, load: 30, rest: 60, duration: 0 },
      ],
    },
    { id: 'Wed-2', day: 'Wed', dayIndex: 2, isRest: true },
    { id: 'Thu-3', day: 'Thu', dayIndex: 3, isRest: false, modality: 'strength', modalityLabel: 'Strength', name: 'Upper B · Strength', focus: 'upper', completed: false, goalSources: ['fat_loss'], estimatedMins: 55,
      exercises: [
        { exerciseId: 'bench_press', name: 'Bench Press', category: 'compound', muscles: ['chest','triceps'], cue: 'Retract scapulae', sets: 5, reps: 5, load: 60, rest: 180, duration: 0 },
        { exerciseId: 'db_row', name: 'DB Row', category: 'compound', muscles: ['back','biceps'], cue: 'Row to hip', sets: 4, reps: 8, load: 24, rest: 90, duration: 0 },
        { exerciseId: 'lateral_raise', name: 'Lateral Raise', category: 'isolation', muscles: ['shoulders'], cue: 'Slight lean forward', sets: 3, reps: 15, load: 8, rest: 60, duration: 0 },
        { exerciseId: 'face_pull', name: 'Face Pull', category: 'isolation', muscles: ['rear_delts','rotator_cuff'], cue: 'Pull to ears', sets: 3, reps: 15, load: 15, rest: 60, duration: 0 },
      ],
    },
    { id: 'Fri-4', day: 'Fri', dayIndex: 4, isRest: false, modality: 'hiit', modalityLabel: 'HIIT', name: 'Lower B · HIIT Circuit', focus: 'lower', completed: false, goalSources: ['fat_loss'], estimatedMins: 35,
      exercises: [
        { exerciseId: 'goblet_squat', name: 'Goblet Squat', category: 'compound', muscles: ['quads','glutes'], cue: 'Hold bell at chest', sets: 3, reps: 15, load: 24, rest: 30, duration: 0 },
        { exerciseId: 'kb_swing', name: 'KB Swing', category: 'compound', muscles: ['glutes','hamstrings'], cue: 'Hinge, don\'t squat', sets: 3, reps: 15, load: 20, rest: 30, duration: 0 },
        { exerciseId: 'burpees', name: 'Burpees', category: 'hiit', muscles: ['full_body'], cue: 'Chest to floor', sets: 3, reps: 10, load: 0, rest: 30, duration: 0 },
      ],
    },
    { id: 'Sat-5', day: 'Sat', dayIndex: 5, isRest: true },
    { id: 'Sun-6', day: 'Sun', dayIndex: 6, isRest: true },
  ],
}

// ── Mock workout history (activity log entries) ─────────────────────

export const MOCK_ACTIVITY_LOG = [
  { type: 'workout', timestamp: '2026-07-05T08:30:00Z', data: { name: 'Upper A · Hypertrophy', type: 'hypertrophy', duration: 3120, loggedSets: [
    { exerciseId: 'db_incline', name: 'Incline DB Bench', planned: { sets: 4, reps: 10, load: 28 }, logged: [{ reps: 10, load: 28, rpe: 7 }, { reps: 10, load: 28, rpe: 8 }, { reps: 9, load: 28, rpe: 8 }, { reps: 8, load: 28, rpe: 9 }] },
    { exerciseId: 'barbell_row', name: 'Barbell Row', planned: { sets: 4, reps: 8, load: 60 }, logged: [{ reps: 8, load: 60, rpe: 7 }, { reps: 8, load: 60, rpe: 8 }, { reps: 7, load: 60, rpe: 9 }, { reps: 7, load: 60, rpe: 9 }] },
    { exerciseId: 'ohp', name: 'Overhead Press', planned: { sets: 3, reps: 10, load: 40 }, logged: [{ reps: 10, load: 40, rpe: 8 }, { reps: 9, load: 40, rpe: 8 }, { reps: 8, load: 40, rpe: 9 }] },
  ]}},
  { type: 'workout', timestamp: '2026-07-03T09:15:00Z', data: { name: 'Lower A · Hypertrophy', type: 'hypertrophy', duration: 2880, loggedSets: [
    { exerciseId: 'back_squat', name: 'Back Squat', planned: { sets: 4, reps: 8, load: 80 }, logged: [{ reps: 8, load: 80, rpe: 8 }, { reps: 8, load: 80, rpe: 8 }, { reps: 7, load: 80, rpe: 9 }, { reps: 6, load: 80, rpe: 9 }] },
    { exerciseId: 'rdl', name: 'Romanian Deadlift', planned: { sets: 3, reps: 10, load: 70 }, logged: [{ reps: 10, load: 70, rpe: 7 }, { reps: 10, load: 70, rpe: 8 }, { reps: 9, load: 70, rpe: 8 }] },
    { exerciseId: 'db_lunge', name: 'Walking Lunge', planned: { sets: 3, reps: 12, load: 20 }, logged: [{ reps: 12, load: 20, rpe: 7 }, { reps: 12, load: 20, rpe: 8 }, { reps: 10, load: 20, rpe: 9 }] },
  ]}},
  { type: 'workout', timestamp: '2026-06-30T08:45:00Z', data: { name: 'Upper A · Hypertrophy', type: 'hypertrophy', duration: 3240, loggedSets: [
    { exerciseId: 'db_incline', name: 'Incline DB Bench', planned: { sets: 4, reps: 10, load: 26 }, logged: [{ reps: 10, load: 26, rpe: 7 }, { reps: 10, load: 26, rpe: 7 }, { reps: 10, load: 26, rpe: 8 }, { reps: 9, load: 26, rpe: 8 }] },
    { exerciseId: 'barbell_row', name: 'Barbell Row', planned: { sets: 4, reps: 8, load: 57.5 }, logged: [{ reps: 8, load: 57.5, rpe: 7 }, { reps: 8, load: 57.5, rpe: 7 }, { reps: 8, load: 57.5, rpe: 8 }, { reps: 7, load: 57.5, rpe: 8 }] },
    { exerciseId: 'ohp', name: 'Overhead Press', planned: { sets: 3, reps: 10, load: 37.5 }, logged: [{ reps: 10, load: 37.5, rpe: 7 }, { reps: 10, load: 37.5, rpe: 8 }, { reps: 9, load: 37.5, rpe: 8 }] },
  ]}},
  { type: 'workout', timestamp: '2026-06-28T09:00:00Z', data: { name: 'Lower A · Hypertrophy', type: 'hypertrophy', duration: 2700, loggedSets: [
    { exerciseId: 'back_squat', name: 'Back Squat', planned: { sets: 4, reps: 8, load: 77.5 }, logged: [{ reps: 8, load: 77.5, rpe: 7 }, { reps: 8, load: 77.5, rpe: 8 }, { reps: 7, load: 77.5, rpe: 8 }, { reps: 7, load: 77.5, rpe: 9 }] },
    { exerciseId: 'rdl', name: 'Romanian Deadlift', planned: { sets: 3, reps: 10, load: 67.5 }, logged: [{ reps: 10, load: 67.5, rpe: 7 }, { reps: 10, load: 67.5, rpe: 7 }, { reps: 10, load: 67.5, rpe: 8 }] },
  ]}},
]

// ── Dashboard-specific display data ──────────────────────────────────

export const MOCK_DASHBOARD = {
  goal: { current: 20.1, target: 15.0, unit: '% BF', weeks: 16, elapsed: 6 },
  tdee: { value: MOCK_TARGETS.tdee, confidence: MOCK_TDEE.confidence, trend: MOCK_TDEE.trend7d },
  macros: {
    kcal: MOCK_TARGETS.target,
    protein: MOCK_TARGETS.protein,
    carbs: MOCK_TARGETS.carbs,
    fat: MOCK_TARGETS.fat,
    deficit: `${'\u2212'}${Math.abs(MOCK_TARGETS.target - MOCK_TARGETS.tdee)}`,
    mealPrep: MOCK_MEAL_PREP.primary,
  },
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
    name: 'Pull \u00b7 Upper B',
    time: '48 min planned',
    day: 'FRI',
    exerciseCount: 6,
    exercises: [
      { name: 'Warm-up walk', sets: '5 min' },
      { name: 'Pull-up', sets: '4 \u00d7 8' },
      { name: 'Barbell row', sets: '4 \u00d7 6' },
      { name: 'Face pull', sets: '3 \u00d7 12' },
      { name: 'Bicep curl', sets: '3 \u00d7 10' },
      { name: 'Cooldown stretch', sets: '5 min' },
    ],
  },
  prep: {
    recipes: [
      { name: 'Salmon + greens', color: Color.accent, portions: 4, time: '25m' },
      { name: 'Rice bowls', color: Color.blue, portions: 6, time: '35m' },
      { name: 'Chili', color: Color.purple, portions: 8, time: '55m' },
    ],
    totalTime: '~78 min',
    readyPct: 85,
  },
  checkin: {
    latest: { weight: MOCK_CHECKINS[0].weight, bf: MOCK_CHECKINS[0].bf, date: MOCK_CHECKINS[0].date },
    trend: 'down',
    streak: 14,
    history: MOCK_CHECKINS.slice(0, 3),
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
  water: { current: MOCK_WATER.trend7d[6] || 1250, target: MOCK_WATER.target, trend7d: MOCK_WATER.trend7d },
}

// ── Weekly training volume (for Stats screen) ────────────────────────

export const MOCK_VOLUME_WEEKS = [
  { label: 'W1', value: 8200 },
  { label: 'W2', value: 9100 },
  { label: 'W3', value: 9800 },
  { label: 'W4', value: 7400 },
]
