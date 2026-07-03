/* ════════════════════════════════════════════════════════════
   Ontology Data — codified fitness.md prose tables
   Every table from the fitness architecture doc, importable.
   ════════════════════════════════════════════════════════════ */

/* ── A. Macro ratios by goal (fitness.md §1d) ── */

export const MACRO_RATIOS = {
  hypertrophy:      { protein: [30, 35], carbs: [40, 50], fat: [20, 25], gPerKg: 2.2, notes: 'Higher carbs support volume and recovery' },
  fat_loss:         { protein: [40, 45], carbs: [30, 40], fat: [20, 25], gPerKg: 2.4, notes: 'Elevated protein for protein-sparing effect' },
  recomposition:    { protein: [35, 40], carbs: [35, 45], fat: [20, 25], gPerKg: 2.2, notes: 'Balanced approach' },
  max_strength:     { protein: [25, 30], carbs: [45, 50], fat: [20, 25], gPerKg: 2.0, notes: 'Higher carbs for CNS recovery' },
  cardio_endurance: { protein: [20, 25], carbs: [50, 60], fat: [15, 20], gPerKg: 1.6, notes: 'Carb-dominant for sustained fuel' },
  power:            { protein: [25, 30], carbs: [45, 50], fat: [20, 25], gPerKg: 2.0, notes: 'Similar to strength' },
  agility:          { protein: [25, 30], carbs: [45, 50], fat: [20, 25], gPerKg: 1.8, notes: 'Performance carbs with moderate protein' },
  flexibility:      { protein: [25, 30], carbs: [40, 50], fat: [25, 30], gPerKg: 1.8, notes: 'Balanced, sustainable' },
  balance:          { protein: [25, 30], carbs: [40, 50], fat: [25, 30], gPerKg: 1.8, notes: 'Balanced, sustainable' },
  overall_wellness: { protein: [25, 30], carbs: [40, 50], fat: [25, 30], gPerKg: 1.8, notes: 'Balanced, sustainable' },
}

/* ── B. Body fat ranges (fitness.md §1c) ── */

export const BODY_FAT_RANGES = [
  { men: [2, 5],   women: [10, 13], label: 'Essential fat',  goals: ['hypertrophy'] },
  { men: [6, 13],  women: [14, 20], label: 'Athletic',       goals: ['hypertrophy', 'max_strength', 'power', 'cardio_endurance'] },
  { men: [14, 17], women: [21, 24], label: 'Fitness',        goals: ['recomposition', 'max_strength', 'hypertrophy'] },
  { men: [18, 24], women: [25, 31], label: 'Average',        goals: ['fat_loss', 'recomposition'] },
  { men: [25, 99], women: [32, 99], label: 'Overweight',     goals: ['fat_loss', 'cardio_endurance', 'overall_wellness'] },
]

/* ── C. Somatotype profiles (fitness.md §1c) ── */

export const SOMATOTYPES = {
  ectomorph: {
    label: 'Ectomorph',
    desc: 'Lean frame, fast metabolism, difficulty gaining weight',
    bestGoals: ['hypertrophy', 'max_strength'],
    training: 'Heavy, compound-focused, lower volume',
    nutrition: 'Frequent meals, calorie-dense foods, higher carb ratio',
    surplus: '+15-20%',
    color: '#60a5fa',
  },
  mesomorph: {
    label: 'Mesomorph',
    desc: 'Athletic build, responds quickly to training',
    bestGoals: ['hypertrophy', 'recomposition', 'max_strength', 'power'],
    training: 'Standard approaches work well — most responsive body type',
    nutrition: 'Moderate flexibility but must track to prevent unwanted fat gain',
    surplus: '+10%',
    color: '#4ade80',
  },
  endomorph: {
    label: 'Endomorph',
    desc: 'Solid build, slower metabolism, gains fat easily',
    bestGoals: ['fat_loss', 'recomposition'],
    training: 'Higher frequency, metabolic conditioning + resistance',
    nutrition: 'Controlled deficit, protein-heavy, may benefit from lower carbs',
    surplus: '+5-10%',
    color: '#a78bfa',
  },
}

/* ── D. Goal → caloric state mapping (fitness.md §1b) ── */

export const GOAL_CALORIC_STATE = {
  hypertrophy:      { state: 'Surplus',      modifier: +300,  label: 'Build' },
  fat_loss:         { state: 'Deficit',      modifier: -480,  label: 'Lose' },
  recomposition:    { state: 'Recomp',       modifier: -150,  label: 'Recomp' },
  max_strength:     { state: 'Surplus',      modifier: +300,  label: 'Build' },
  cardio_endurance: { state: 'Maintenance',  modifier: 0,     label: 'Maintain' },
  power:            { state: 'Surplus',      modifier: +300,  label: 'Build' },
  agility:          { state: 'Maintenance',  modifier: 0,     label: 'Maintain' },
  flexibility:      { state: 'Maintenance',  modifier: 0,     label: 'Maintain' },
  balance:          { state: 'Maintenance',  modifier: 0,     label: 'Maintain' },
  overall_wellness: { state: 'Maintenance',  modifier: 0,     label: 'Maintain' },
}

/* ── E. Caloric state → meal prep approach (fitness.md §1e) ── */

export const CALORIC_PREP = {
  Surplus:     { primary: 'Bulk Prep',     supporting: ['Pre-Workout Fuel', 'Post-Workout Recovery'], timing: 'Large portions, frequent meals, calorie density' },
  Deficit:     { primary: 'Lean Prep',     supporting: ['Post-Workout Recovery'], timing: 'High volume/low cal, strict portions by weight' },
  Maintenance: { primary: 'Balanced Prep', supporting: ['Pre-Workout Fuel'], timing: 'Normal variety, controlled portions' },
  Recomp:      { primary: 'Lean Prep',     supporting: ['Post-Workout Recovery', 'Balanced Prep'], timing: 'Carb cycling — more carbs on training days' },
}

/* ── F. Workout plan templates (fitness.md §4) ── */

export const WORKOUT_TEMPLATES = {
  hypertrophy: {
    label: 'Hypertrophy Plan',
    objective: 'Stimulate muscular hypertrophy via progressive volume',
    protocol: 'Build (+300 kcal), Protein 2.2g/kg LBM',
    frequency: '4-5 days/week',
    split: 'Upper/Lower or Push/Pull/Legs',
    repRange: '8-12 reps at RPE 7.5-9',
    sampleSession: [
      { exercise: 'Incline DB Bench Press', sets: '4 × 8-10', rest: '120s', focus: 'Primary chest driver', injuryAlt: 'DB Floor Press (shoulder)' },
      { exercise: 'Chest-Supported Row',    sets: '4 × 10',   rest: '90s',  focus: 'Upper back density',   injuryAlt: 'Lat Pulldown (lower back)' },
      { exercise: 'Overhead Press (DB)',     sets: '3 × 10',   rest: '90s',  focus: 'Shoulder hypertrophy', injuryAlt: 'Lateral Raises (shoulder)' },
      { exercise: 'Incline DB Curls',        sets: '3 × 12',   rest: '60s',  focus: 'Biceps long head',     injuryAlt: 'Hammer Curls (wrist)' },
      { exercise: 'Triceps Overhead Ext',    sets: '3 × 12',   rest: '60s',  focus: 'Triceps long head',    injuryAlt: 'Cable Pushdowns (elbow)' },
    ],
  },
  fat_loss: {
    label: 'Fat Loss Plan',
    objective: 'Preserve lean tissue while maximizing caloric expenditure',
    protocol: 'Lose (-480 kcal), Protein 2.4g/kg LBM',
    frequency: '3-4 days/week',
    split: 'Full-Body focus',
    repRange: '6-10 reps compound + supersets',
    sampleSession: [
      { exercise: 'Trap Bar Deadlift',       sets: '4 × 6',     rest: '150s', focus: 'Posterior chain strength',  injuryAlt: 'DB Goblet Box Squat (lower back)' },
      { exercise: 'DB Flat Bench Press',     sets: '3 × 8',     rest: '0s',   focus: 'Superset A1 — push',       injuryAlt: 'Cable Crossover (shoulder)' },
      { exercise: 'Lat Pulldown',            sets: '3 × 10',    rest: '90s',  focus: 'Superset A2 — pull',       injuryAlt: 'Single-arm DB Row (shoulder)' },
      { exercise: 'Walking Lunges',          sets: '3 × 12/leg',rest: '0s',   focus: 'Superset B1 — unilateral', injuryAlt: 'Glute Bridges (knee)' },
      { exercise: 'Hanging Knee Raises',     sets: '3 × Max',   rest: '60s',  focus: 'Superset B2 — core',       injuryAlt: 'Dead Bug (lower back)' },
    ],
  },
  recomposition: {
    label: 'Recomposition Plan',
    objective: 'Build muscle and burn fat simultaneously',
    protocol: 'Recomp (-150 kcal), Protein 2.2g/kg',
    frequency: '4 days/week',
    split: 'Upper/Lower',
    repRange: 'Wave: heavy 5-6 reps → accessory 10-12 reps',
    sampleSession: [],
  },
  max_strength: {
    label: 'Max Strength Plan',
    objective: 'Increase neuromuscular adaptation and maximum force output',
    protocol: 'Build (+300 kcal) or Maintain',
    frequency: '3-4 days/week',
    split: 'Squat/Bench/Deadlift/OHP focus',
    repRange: '1-5 reps at RPE 8.5-10, 3-5 min rest',
    sampleSession: [
      { exercise: 'Back Squat',           sets: '5 × 3 @ 85%', rest: '180-240s', focus: 'Primary strength driver',    injuryAlt: 'Leg Press (knee/back)' },
      { exercise: 'Romanian Deadlift',    sets: '3 × 6',       rest: '120s',     focus: 'Hamstring/glute hypertrophy',injuryAlt: 'Hamstring Curl (lower back)' },
      { exercise: 'Bulgarian Split Squat',sets: '3 × 8/leg',   rest: '90s',      focus: 'Unilateral stability',      injuryAlt: 'Single-leg Leg Press (knee)' },
      { exercise: 'Ab Wheel Rollout',     sets: '3 × 8',       rest: '60s',      focus: 'Anti-extension core',       injuryAlt: 'Plank (lower back)' },
    ],
  },
  cardio_endurance: {
    label: 'Cardio Endurance Plan',
    objective: 'Improve aerobic capacity (VO₂ max) and mitochondrial efficiency',
    protocol: 'Maintain (TDEE + output tracking)',
    frequency: '3-5 days/week',
    split: 'Zone 2 (80%) + HIIT (20%)',
    repRange: 'Zone 2: 60-70% max HR; Zone 5: intervals',
    sampleSession: [],
  },
  power: {
    label: 'Power & Agility Plan',
    objective: 'Enhance rate of force development and explosive power',
    protocol: 'Maintain',
    frequency: '3 days/week',
    split: 'Plyometrics + Olympic lift variations',
    repRange: '1-5 explosive reps',
    sampleSession: [],
  },
  flexibility: {
    label: 'Flexibility & Balance Plan',
    objective: 'Increase active range of motion and proprioception',
    protocol: 'Maintain',
    frequency: '5-7 days/week (15-20 min daily)',
    split: 'Daily mobility routine',
    repRange: 'Holds and flows',
    sampleSession: [
      { exercise: 'Cat-Cow',           sets: '10 reps',      rest: '—', focus: 'Mobilize thoracic and lumbar spine' },
      { exercise: '90/90 Hip Swivels', sets: '10 reps/side', rest: '—', focus: 'Open internal/external rotation' },
      { exercise: 'Kettlebell Halos',  sets: '8 reps/dir',   rest: '—', focus: 'Lubricate rotator cuffs' },
      { exercise: 'Single-Leg Stand',  sets: '60s/leg',      rest: '—', focus: 'Proprioception & ankle stabilizers' },
      { exercise: 'Deep Squat Hold',   sets: '90s',          rest: '—', focus: 'Open hips and stretch posterior chain' },
    ],
  },
}

/* ── G. Injury overrides (fitness.md §5) ── */

export const INJURY_OVERRIDES = {
  Knees:       { exclude: ['Back Squat', 'Front Squat', 'Leg Extensions', 'Walking Lunges'], include: ['Glute Bridges', 'Romanian Deadlifts', 'Leg Press (High Foot)', 'Box Squats'] },
  'Lower Back': { exclude: ['Barbell Deadlift', 'Barbell Row', 'Overhead Press (Standing)'], include: ['Chest-Supported DB Rows', 'Glute Ham Raises', 'Belt Squats', 'DB Bench Press'] },
  Shoulders:   { exclude: ['Barbell Bench Press', 'Standing Overhead Press', 'Barbell Incline Press'], include: ['Neutral Grip DB Bench', 'Landmine Press', 'Push-ups', 'Face Pulls'] },
}

export const EQUIPMENT_OVERRIDES = {
  bodyweight: { squat: 'Pistol Squats or Tempo Air Squats', bench: 'Deficit Push-ups or Dips', deadlift: 'Single-Leg RDL or Nordic Curls', row: 'Inverted Bodyweight Rows' },
  bands:      { squat: 'Banded Goblet Squats', bench: 'Banded Floor Press', deadlift: 'Banded Good Mornings', row: 'Banded Seated Rows' },
}

/* ── H. Meal timing windows (fitness.md §1e) ── */

export const MEAL_TIMING = [
  { window: 'Pre-workout (1-3h)',    focus: 'Carbs + moderate protein, low fat/fiber',  examples: 'Toast + banana, rice + chicken, oats + protein' },
  { window: 'Pre-workout (30-60m)',  focus: 'Light, fast-digesting carbs',               examples: 'Rice cake, fruit, small shake' },
  { window: 'Post-workout (< 2h)',   focus: 'Protein + carbs, faster-digesting',         examples: 'Protein shake + fruit, chicken + white rice' },
  { window: 'Between sessions',      focus: 'Protein every 3-4h for optimal synthesis',  examples: 'Balanced meals with protein anchor' },
  { window: 'Recovery days',         focus: 'Moderate carbs, adequate protein, higher fat', examples: 'Balanced prep, whole food focus' },
]

export const TRAINING_MEAL_IMPORTANCE = {
  lifting_hyp:   { pre: 'Moderate', post: 'Strong',   note: 'Post-workout protein critical for MPS' },
  lifting_str:   { pre: 'Moderate', post: 'Strong',   note: 'Glycogen replenishment for CNS' },
  hiit:          { pre: 'Strong',   post: 'Moderate', note: 'Needs glycogen availability for intensity' },
  zone2_cardio:  { pre: 'Weak',     post: 'Moderate', note: 'Can train fasted; balanced post-session' },
  circuits:      { pre: 'Moderate', post: 'Moderate', note: 'Moderate demands across both' },
  plyometrics:   { pre: 'Strong',   post: 'Moderate', note: 'High carb pre for explosive output' },
  mobility_yoga: { pre: 'Weak',     post: 'Weak',     note: 'Flexible timing' },
  calisthenics:  { pre: 'Moderate', post: 'Moderate', note: 'Similar to lifting' },
}

/* ── I. Goal display metadata ── */

export const GOAL_META = {
  hypertrophy:      { label: 'Hypertrophy',       group: 'Body Composition', color: '#FF6E50' },
  fat_loss:         { label: 'Fat Loss',           group: 'Body Composition', color: '#FF6E50' },
  recomposition:    { label: 'Recomposition',      group: 'Body Composition', color: '#FF6E50' },
  max_strength:     { label: 'Max Strength',       group: 'Performance',      color: '#60a5fa' },
  cardio_endurance: { label: 'Cardio Endurance',   group: 'Performance',      color: '#60a5fa' },
  power:            { label: 'Power',              group: 'Performance',      color: '#60a5fa' },
  agility:          { label: 'Agility',            group: 'Performance',      color: '#60a5fa' },
  flexibility:      { label: 'Flexibility',        group: 'Functional',       color: '#a78bfa' },
  balance:          { label: 'Balance',            group: 'Functional',       color: '#a78bfa' },
  overall_wellness: { label: 'Overall Wellness',   group: 'Functional',       color: '#a78bfa' },
}

export const NUTRITION_GOAL_META = {
  healthier_meals:   { label: 'Healthier Meals',   color: '#4ade80' },
  cook_more:         { label: 'Cook More',         color: '#4ade80' },
  improve_digestion: { label: 'Digestion',         color: '#4ade80' },
  drink_water:       { label: 'Hydration',         color: '#4ade80' },
  save_money:        { label: 'Save Money',        color: '#4ade80' },
}

export const ALL_GOALS = { ...GOAL_META, ...NUTRITION_GOAL_META }
