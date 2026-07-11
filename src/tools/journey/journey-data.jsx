/* Journey Data — constants, phase definitions, and CRUD flow mappings.
   Extracted from UserJourney.jsx for use across journey sub-pages. */

import { Color, Phase } from '../../ui/tokens'
import { ICONS, Phone, ErrorBoundary } from '../../ui/components'
import { SCREENS } from '../../app/screens'
import { OB_Welcome, OB_Sex, OB_Birthday, OB_BodyMetrics, OB_GoalsActivity, OB_TrainingFreq, OB_TDEE, OB_Ready, FOB_Intro, FOB_BodyComp, FOB_Timeline, FOB_Experience, FOB_Equipment, FOB_FocusAreas, FOB_Injuries, FOB_Summary } from '../../app/screens/Onboarding'

/* ── Layout constants ── */
export const PW = 428, PH = 926
export const FW = 320, FH = 694
export const SCALE = FW / PW
export const COMPACT_FW = 180, COMPACT_FH = Math.round(874 * 180 / 402)
export const COMPACT_SCALE = COMPACT_FW / PW

/* ── Helpers ── */
export function screenById(id) {
  const entry = SCREENS.find(s => s.id === id)
  return entry ? entry.C : null
}

const OB_SAMPLE = { sex: 'male', birthYear: 1993, birthMonth: 3, height: 180, weight: 82, bodyFat: 22.4, targetBodyFat: 15, exerciseFreq: '4-6', activityLevel: 'moderate', liftingExp: 'intermediate', cardioExp: 'beginner', goal: 'recomp', goals: ['recomposition', 'cook_more'], dietary: ['Nut Free'], equipment: 'full_gym', availableDays: ['Mon','Tue','Wed','Fri'], injuries: [], focusMuscles: ['chest', 'back', 'quads'] }
const noop = () => {}
export function obWrap(Step, props = {}) {
  return function OBScreen() {
    return <Phone statusTime="9:41"><ErrorBoundary><Step onNext={noop} onBack={noop} data={OB_SAMPLE} setData={noop} {...props} /></ErrorBoundary></Phone>
  }
}

/* ── Data Models ── */
export const DATA_MODELS = {
  user_state: {
    label: 'User State',
    color: Color.accent,
    fields: [
      { k: 'body', v: 'tdee, weight_kg, lean_mass, fat_mass, body_fat_pct' },
      { k: 'performance', v: '1rm_kg per lift, dynamic workouts' },
      { k: 'recovery', v: '... needs more research' },
      { k: 'behavioral', v: 'adherence, protein_hit_ratio_7d, home_cook_7d, water_intake_rate_7d' },
      { k: 'wearables', v: '...' },
      { k: 'nutrition', v: 'mealPrepApproach (primary + supporting), mealTiming per session' },
      { k: 'goal_engine', v: 'derived modalities, caloric modifier, macro split from goal network' },
    ],
  },
  user_constraints: {
    label: 'User Constraints',
    color: Color.purple,
    fields: [
      { k: 'dietary', v: 'allergies, religious, intolerances, disliked_foods' },
      { k: 'training', v: 'equipment, available_days, injuries, disliked_exercises' },
    ],
  },
  user_goal: {
    label: 'User Goal',
    color: Color.blue,
    fields: [
      { k: 'domain', v: 'fitness | nutrition' },
      { k: 'type', v: 'from goal taxonomy' },
      { k: 'target', v: 'metric, direction (\u2191\u2193=), value, unit' },
      { k: 'meta', v: 'time_bound, depends_on, status, created_at, updated_at' },
    ],
  },
}

export const GOAL_TAXONOMY = {
  fitness: {
    label: 'Fitness Goals',
    groups: [
      { name: 'Body Composition', items: ['Hypertrophy', 'Fat Loss', 'Recomposition'] },
      { name: 'Performance', items: ['Max Strength', 'Cardio Endurance', 'Power', 'Agility'] },
      { name: 'Functional Fitness', items: ['Flexibility', 'Balance', 'Overall Wellness'] },
    ],
  },
  nutrition: {
    label: 'Nutrition Goals',
    items: ['Healthier Meals', 'Cook More', 'Improve Digestion', 'Drink Water', 'Save Money'],
  },
}

export const INTERVENTIONS = [
  { label: 'Training', desc: 'New workouts, increase flexibility', icon: ICONS.dumb },
  { label: 'Nutrition', desc: 'Plan caloric intake, adjust deficit', icon: ICONS.meal },
  { label: 'Notification', desc: 'Push alerts, behavioural nudges', icon: ICONS.bell },
  { label: 'Macro Adjustment', desc: 'Check-in triggered target recalculation via goal engine', icon: ICONS.chart },
  { label: 'Meal Prep', desc: 'Approach recommendation derived from goal network edges', icon: ICONS.pan },
]

export const OBSERVATION_CHANNELS = [
  { label: 'Scale', desc: 'Weight, BF%', icon: ICONS.chart },
  { label: 'CV', desc: 'Computer vision body fat scan', icon: ICONS.goal },
  { label: 'Workout', desc: 'Volume, PRs, RPE', icon: ICONS.dumb },
  { label: 'User State', desc: 'Behavioural + wearable signals', icon: ICONS.person },
]

/* ── Phase definitions (full SODA loop) ── */
export const PHASES = [
  {
    id: 'onboarding',
    phase: '01 \u00b7 SEED',
    title: 'Onboarding & Profiling',
    description: 'General onboarding (8 steps) captures demographics, goals, and TDEE. Fitness onboarding (9 steps) captures body composition, experience, equipment, and focus areas.',
    color: Phase.seed,
    dataFlow: ['user_state', 'user_constraints', 'user_goal'],
    screens: [
      // General onboarding (8 steps)
      { label: 'Welcome', C: obWrap(OB_Welcome, { onBack: undefined, setData: undefined }), reads: [], writes: [] },
      { label: 'Sex', C: obWrap(OB_Sex), reads: [], writes: ['user_state'] },
      { label: 'Body Metrics', C: obWrap(OB_BodyMetrics), reads: [], writes: ['user_state'] },
      { label: 'Birthday', C: obWrap(OB_Birthday), reads: [], writes: ['user_state'] },
      { label: 'Goals + Activity', C: obWrap(OB_GoalsActivity), reads: [], writes: ['user_goal', 'user_state'] },
      { label: 'Training Freq', C: obWrap(OB_TrainingFreq), reads: [], writes: ['user_state'] },
      { label: 'TDEE Reveal', C: obWrap(OB_TDEE, { setData: undefined }), reads: ['user_state'], writes: [] },
      { label: 'Ready', C: obWrap(OB_Ready, { onNext: undefined, onBack: undefined, setData: undefined }), reads: ['user_state', 'user_goal'], writes: [] },
      // Fitness onboarding (8 steps)
      { label: 'Fitness Intro', C: obWrap(FOB_Intro, { onBack: undefined, setData: undefined }), reads: [], writes: [] },
      { label: 'Body Composition', C: obWrap(FOB_BodyComp), reads: [], writes: ['user_state', 'user_goal'] },
      { label: 'Timeline', C: obWrap(FOB_Timeline), reads: ['user_state'], writes: ['user_goal'] },
      { label: 'Experience', C: obWrap(FOB_Experience), reads: [], writes: ['user_state'] },
      { label: 'Equipment', C: obWrap(FOB_Equipment), reads: [], writes: ['user_constraints'] },
      { label: 'Focus Areas', C: obWrap(FOB_FocusAreas), reads: [], writes: ['user_constraints'] },
      { label: 'Injuries', C: obWrap(FOB_Injuries), reads: [], writes: ['user_constraints'] },
      { label: 'Fitness Summary', C: obWrap(FOB_Summary, { onNext: undefined, onBack: undefined, setData: undefined }), reads: ['user_state', 'user_constraints', 'user_goal'], writes: [] },
    ],
  },
  {
    id: 'dashboard',
    phase: '02 \u00b7 DECIDE',
    title: 'Dashboard Hub',
    description: 'Decide(state, goals, constraints) \u2192 central navigation with personalised tile presets.',
    color: Phase.decide,
    dataFlow: ['user_state', 'user_constraints', 'user_goal'],
    screens: [
      { label: 'Today',           C: screenById('today'),    reads: ['user_state', 'user_constraints', 'user_goal'], writes: [] },
      { label: 'Balanced',        C: screenById('dash-bal'), reads: ['user_state', 'user_constraints', 'user_goal'], writes: [] },
      { label: 'Nutrition Focus', C: screenById('dash-nut'), reads: ['user_state', 'user_constraints', 'user_goal'], writes: [] },
      { label: 'Training Focus',  C: screenById('dash-trn'), reads: ['user_state', 'user_constraints', 'user_goal'], writes: [] },
    ],
  },
  {
    id: 'planning',
    phase: '03 \u00b7 PLAN',
    title: 'Setup & Planning',
    description: 'Set goals, customize meals, check inventory, schedule the week.',
    color: Phase.plan,
    dataFlow: [],
    screens: [
      { label: 'Set Goal',        C: screenById('goal-a'), reads: ['user_goal'], writes: ['user_goal', 'meal_prep_approach'] },
      { label: 'Goal Contract',   C: screenById('goal-b'), reads: ['user_goal'], writes: ['user_goal', 'meal_prep_approach'] },
      { label: 'Goal Detail',     C: screenById('goal-det'), reads: ['user_goal', 'goal_engine'], writes: [] },
      { label: 'TDEE Model',      C: screenById('tdee-a'), reads: ['user_state', 'goal_engine'], writes: [] },
      { label: 'TDEE Confidence', C: screenById('tdee-b'), reads: ['user_state', 'goal_engine'], writes: [] },
      { label: 'Macro Targets',   C: screenById('macro-a'), reads: ['user_state', 'user_goal', 'goal_engine'], writes: [] },
      { label: 'Meal Queue',      C: screenById('macro-b'), reads: ['user_state', 'user_goal', 'goal_engine'], writes: [] },
      { label: 'Batch Strategy',  C: screenById('batch-a'), reads: ['user_constraints'], writes: [] },
      { label: 'Shopping List',   C: screenById('macro-c'), reads: ['user_constraints'], writes: [] },
      { label: 'Fridge / Pantry', C: screenById('fridge-a'), reads: ['user_constraints'], writes: [] },
      { label: 'Calendar Month',  C: screenById('plan-m'), reads: ['user_constraints'], writes: [] },
      { label: 'Calendar Week',   C: screenById('plan-w'), reads: ['user_constraints'], writes: [] },
      { label: 'Calendar Day',    C: screenById('plan-d'), reads: ['user_constraints'], writes: [] },
    ],
  },
  {
    id: 'execution',
    phase: '04 \u00b7 ACT',
    title: 'Focused Mode Execution',
    description: 'ML-driven interventions \u2192 program generation, immersive workout tracking, and parallel meal prep.',
    color: Phase.act,
    dataFlow: [],
    screens: [
      { label: 'Program Overview',   C: screenById('train-prog'), reads: ['user_goal', 'user_constraints'], writes: [] },
      { label: 'Exercise Browser',   C: screenById('ex-browse'), reads: ['user_goal', 'user_constraints'], writes: [] },
      { label: 'Exercise Detail',    C: screenById('ex-detail'), reads: ['user_goal'], writes: [] },
      { label: 'Workout Template',   C: screenById('wk-template'), reads: ['user_goal', 'user_constraints'], writes: [] },
      { label: 'Active Session',     C: screenById('train-a'), reads: ['user_state'], writes: ['user_state'] },
      { label: 'Workout Summary',    C: screenById('train-sum'), reads: ['user_state'], writes: ['user_state'] },
      { label: 'Workout History',    C: screenById('wk-history'), reads: ['user_state'], writes: [] },
      { label: 'Ingredient Merge',  C: screenById('prep-a'), reads: ['user_constraints'], writes: [] },
      { label: 'Card \u2192 Cook',  C: screenById('morph'), reads: ['user_constraints'], writes: [] },
      { label: 'Parallel Timeline', C: screenById('prep-b'), reads: ['user_constraints'], writes: [] },
      { label: 'Active Cook Mode',  C: screenById('prep-c'), reads: ['user_constraints'], writes: [] },
      { label: 'Cook Summary',      C: screenById('cook-sum'), reads: ['user_constraints'], writes: [] },
    ],
  },
  {
    id: 'feedback',
    phase: '05 \u00b7 OBSERVE',
    title: 'Feedback & Adaptation',
    description: 'Check-ins, logging, and AI-driven adjustments. Feeds back to DECIDE.',
    color: Phase.observe,
    dataFlow: ['user_state'],
    screens: [
      { label: 'Profile Hub',     C: screenById('profile'), reads: ['user_state', 'user_constraints', 'user_goal'], writes: [] },
      { label: 'Check-in Flow',   C: screenById('checkin'), reads: [], writes: ['user_state'] },
      { label: 'Macro Heatmap',   C: screenById('macro-heat'), reads: ['user_state'], writes: ['user_state'] },
      { label: 'Daily Food Log',  C: screenById('food-log'), reads: ['user_state'], writes: ['user_state'] },
      { label: 'Water Tracking',  C: screenById('water'), reads: ['user_state'], writes: ['user_state'] },
    ],
  },
]

export const TOTAL_SCREENS = PHASES.reduce((sum, p) => sum + p.screens.length, 0)
export const BUILT_SCREENS = PHASES.reduce((sum, p) => sum + p.screens.filter(s => s.C).length, 0)
export const COVERAGE_PCT = Math.round((BUILT_SCREENS / TOTAL_SCREENS) * 100)

/* ── Cooking mode ── */

export const COOKING_COLOR = Phase.act

export const COOKING_PHASES = [
  {
    id: 'cook-plan',
    phase: 'PLAN',
    title: 'Meal Planning',
    description: 'Set macro targets, build meal queue, optimize batches, finalize shopping.',
    color: Phase.plan,
    dataFlow: [],
    screens: [
      { label: 'Macro Targets',   C: screenById('macro-a'), reads: ['user_state', 'user_goal'], writes: [] },
      { label: 'Meal Queue',      C: screenById('macro-b'), reads: ['user_state', 'user_goal'], writes: [] },
      { label: 'Batch Strategy',  C: screenById('batch-a'), reads: ['user_constraints'], writes: [] },
      { label: 'Shopping List',   C: screenById('macro-c'), reads: ['user_constraints'], writes: [] },
      { label: 'Fridge / Pantry', C: screenById('fridge-a'), reads: ['user_constraints'], writes: [] },
    ],
  },
  {
    id: 'cook-prep',
    phase: 'PREP',
    title: 'Pre-Cook Setup',
    description: 'Merge ingredients, transition from card to cook mode, build parallel timeline.',
    color: COOKING_COLOR,
    dataFlow: [],
    screens: [
      { label: 'Ingredient Merge',  C: screenById('prep-a'), reads: ['user_constraints'], writes: [] },
      { label: 'Card \u2192 Cook',  C: screenById('morph'), reads: ['user_constraints'], writes: [] },
      { label: 'Parallel Timeline', C: screenById('prep-b'), reads: ['user_constraints'], writes: [] },
    ],
  },
  {
    id: 'cook-exec',
    phase: 'COOK',
    title: 'Active Cooking',
    description: 'Step-by-step cook mode with timers. Post-cook summary and batch tracking.',
    color: COOKING_COLOR,
    dataFlow: [],
    screens: [
      { label: 'Active Cook Mode',  C: screenById('prep-c'), reads: ['user_constraints'], writes: [] },
      { label: 'Cook Summary',      C: screenById('cook-sum'), reads: ['user_constraints'], writes: [] },
    ],
  },
  {
    id: 'cook-log',
    phase: 'LOG',
    title: 'Food Logging',
    description: 'Track daily meals and macro adherence.',
    color: Phase.observe,
    dataFlow: ['user_state'],
    screens: [
      { label: 'Daily Food Log',  C: screenById('food-log'), reads: ['user_state'], writes: ['user_state'] },
    ],
  },
]

export const COOKING_FLOWS = {
  create: {
    label: 'Create',
    description: 'Plan meals, prep ingredients, and cook a batch session.',
    screens: [
      { id: 'macro-a', label: 'Macro Targets' },
      { id: 'macro-b', label: 'Meal Queue' },
      { id: 'batch-a', label: 'Batch Strategy' },
      { id: 'macro-c', label: 'Shopping List' },
      { id: 'fridge-a', label: 'Fridge / Pantry' },
      { id: 'prep-a', label: 'Ingredient Merge' },
      { id: 'morph', label: 'Card \u2192 Cook' },
      { id: 'prep-b', label: 'Parallel Timeline' },
      { id: 'prep-c', label: 'Active Cook Mode' },
      { id: 'cook-sum', label: 'Cook Summary' },
    ],
  },
  edit: {
    label: 'Edit',
    description: 'Adjust macro targets, swap meals, re-optimize batches.',
    screens: [
      { id: 'macro-a', label: 'Macro Targets (adjust)' },
      { id: 'macro-b', label: 'Meal Queue (swap)' },
      { id: 'batch-a', label: 'Batch Strategy (re-optimize)' },
      { id: 'macro-c', label: 'Shopping List (update)' },
    ],
  },
  delete: {
    label: 'Delete',
    description: 'Remove meals from the plan or cancel a prep session.',
    screens: [
      { id: null, label: 'Remove Meal Plan' },
      { id: null, label: 'Cancel Prep Session' },
    ],
  },
}

/* ── Exercise mode ── */

export const EXERCISE_COLOR = Phase.seed

export const EXERCISE_PHASES = [
  {
    id: 'ex-onboarding',
    phase: 'ONBOARDING',
    title: 'Fitness Onboarding',
    description: 'Body composition, training experience, equipment access, focus areas, and injury accommodations — everything needed to generate a personalized program.',
    color: Phase.seed,
    dataFlow: ['user_state', 'user_constraints'],
    screens: [
      // Pulls from PHASES[0] fitness onboarding screens (indices 8–15)
      ...PHASES[0].screens.slice(8, 16),
    ],
  },
  {
    id: 'ex-goals',
    phase: 'GOALS',
    title: 'Goal Setting & TDEE',
    description: 'Define fitness goals, sign the contract, compute TDEE model. Goals drive the entire downstream pipeline.',
    color: Phase.plan,
    dataFlow: ['user_goal'],
    screens: [
      { label: 'Goal Input',       C: screenById('goal-a'), reads: ['user_goal'], writes: ['user_goal'] },
      { label: 'Goal Contract',    C: screenById('goal-b'), reads: ['user_goal'], writes: ['user_goal'] },
      { label: 'Goal Detail',      C: screenById('goal-det'), reads: ['user_goal'], writes: [] },
      { label: 'TDEE Model',       C: screenById('tdee-a'), reads: ['user_state'], writes: [] },
      { label: 'TDEE Confidence',  C: screenById('tdee-b'), reads: ['user_state'], writes: [] },
    ],
  },
  {
    id: 'ex-program',
    phase: 'PROGRAM',
    title: 'Program Generation',
    description: 'Goals + constraints + equipment + injuries → weekly training plan. Browse exercises, view workout templates, customize the program.',
    color: Phase.decide,
    dataFlow: ['user_goal', 'user_constraints'],
    screens: [
      { label: 'Today',              C: screenById('today'), reads: ['user_goal', 'user_state'], writes: [] },
      { label: 'Program Overview',   C: screenById('train-prog'), reads: ['user_goal', 'user_constraints'], writes: [] },
      { label: 'Exercise Browser',   C: screenById('ex-browse'), reads: ['user_constraints'], writes: [] },
      { label: 'Exercise Detail',    C: screenById('ex-detail'), reads: [], writes: [] },
      { label: 'Workout Template',   C: screenById('wk-template'), reads: ['user_goal'], writes: [] },
      { label: 'Calendar Week',      C: screenById('plan-w'), reads: ['user_constraints'], writes: [] },
    ],
  },
  {
    id: 'ex-train',
    phase: 'TRAIN',
    title: 'Active Session',
    description: 'Three-phase focused mode: Review (exercise list + form cues) → Execute (set-by-set logging with RPE, rest timers, progress rail) → Summary (auto-computed volume, avg RPE).',
    color: EXERCISE_COLOR,
    dataFlow: ['user_state'],
    screens: [
      { label: 'Active Session',     C: screenById('train-a'), reads: ['user_state'], writes: ['user_state'] },
      { label: 'Workout Summary',    C: screenById('train-sum'), reads: ['user_state'], writes: ['user_state'] },
    ],
  },
  {
    id: 'ex-track',
    phase: 'TRACK',
    title: 'Progress Tracking',
    description: 'Weekly check-ins feed the decision engine. Daily logging builds the macro heatmap. Behavioral metrics (workouts_7d, adherence) drive interventions.',
    color: Phase.observe,
    dataFlow: ['user_state'],
    screens: [
      { label: 'Workout History',  C: screenById('wk-history'), reads: ['user_state'], writes: [] },
      { label: 'Check-in Flow',   C: screenById('checkin'), reads: [], writes: ['user_state'] },
      { label: 'Macro Heatmap',   C: screenById('macro-heat'), reads: ['user_state'], writes: ['user_state'] },
      { label: 'Water Tracking',  C: screenById('water'), reads: ['user_state'], writes: ['user_state'] },
    ],
  },
]

export const EXERCISE_FLOWS = {
  create: {
    label: 'Create',
    description: 'Set a goal, generate a program, execute a workout, and log results.',
    screens: [
      { id: 'goal-a', label: 'Goal Input' },
      { id: 'goal-b', label: 'Goal Contract' },
      { id: 'tdee-a', label: 'TDEE Model' },
      { id: 'train-prog', label: 'Program Overview' },
      { id: 'plan-w', label: 'Calendar (schedule)' },
      { id: 'train-a', label: 'Active Session' },
      { id: 'train-sum', label: 'Workout Summary' },
    ],
  },
  edit: {
    label: 'Edit',
    description: 'Modify an existing goal, regenerate program, or reschedule.',
    screens: [
      { id: 'goal-a', label: 'Goal Input (modify)' },
      { id: 'goal-b', label: 'Goal Contract (re-sign)' },
      { id: 'train-prog', label: 'Program Overview (adjust)' },
      { id: 'plan-w', label: 'Calendar (reschedule)' },
    ],
  },
  delete: {
    label: 'Delete',
    description: 'Remove a workout or cancel a goal.',
    screens: [
      { id: null, label: 'Remove Workout' },
      { id: null, label: 'Cancel Goal' },
    ],
  },
}

/* ── Seed mode (Onboarding) ── */

export const SEED_COLOR = Phase.seed

export const SEED_PHASES = [
  {
    id: 'seed-profile',
    phase: 'PROFILE',
    title: 'Identity & Body',
    description: 'Capture biological sex, body metrics, and age.',
    color: Phase.seed,
    dataFlow: ['user_state'],
    screens: PHASES[0].screens.slice(0, 4),   // Welcome, Sex, Body Metrics, Birthday
  },
  {
    id: 'seed-goals',
    phase: 'GOALS',
    title: 'Goals & Activity',
    description: 'Goal selection, daily activity level, and training frequency.',
    color: Phase.decide,
    dataFlow: ['user_goal', 'user_state'],
    screens: PHASES[0].screens.slice(4, 6),   // GoalsActivity, TrainingFreq
  },
  {
    id: 'seed-compute',
    phase: 'COMPUTE',
    title: 'TDEE & Summary',
    description: 'Mifflin-St Jeor × activity multiplier → macro split → daily targets.',
    color: Phase.act,
    dataFlow: ['user_state', 'user_goal'],
    screens: PHASES[0].screens.slice(6, 8),   // TDEE Reveal, Ready
  },
  {
    id: 'seed-body-comp',
    phase: 'BODY COMP',
    title: 'Body Composition',
    description: 'Current and target body fat estimation with 3D body preview.',
    color: Phase.seed,
    dataFlow: ['user_state', 'user_goal'],
    screens: PHASES[0].screens.slice(8, 11),  // Fitness Intro, Body Comp, Timeline
  },
  {
    id: 'seed-training',
    phase: 'TRAINING',
    title: 'Training Setup',
    description: 'Experience level, equipment access, focus areas, and injury accommodations.',
    color: Phase.plan,
    dataFlow: ['user_constraints', 'user_state'],
    screens: PHASES[0].screens.slice(11, 15), // Experience, Equipment, Focus Areas, Injuries
  },
  {
    id: 'seed-program',
    phase: 'PROGRAM',
    title: 'Program Generation',
    description: 'Body composition target → training constraints → personalized program summary.',
    color: Phase.act,
    dataFlow: ['user_state', 'user_constraints', 'user_goal'],
    screens: PHASES[0].screens.slice(15, 16), // Fitness Summary
  },
]

/* ── Decide mode (Dashboard) ── */

export const DECIDE_COLOR = Phase.decide

export const DECIDE_PHASES = [
  {
    id: 'decide-presets',
    phase: 'PRESETS',
    title: 'Layout Presets',
    description: 'Goal-driven tile configurations. Balanced for dual goals, nutrition or training focus for single-domain users.',
    color: Phase.decide,
    dataFlow: ['user_state', 'user_constraints', 'user_goal'],
    screens: PHASES[1].screens,
  },
]

/* ── Observe mode (Tracking) ── */

export const OBSERVE_COLOR = Phase.observe

export const OBSERVE_PHASES = [
  {
    id: 'obs-checkin',
    phase: 'WEEKLY',
    title: 'Weekly Check-in',
    description: 'Weight, body fat, subjective rating → decision engine evaluation → intervention if needed.',
    color: Phase.observe,
    dataFlow: ['user_state'],
    screens: [PHASES[4].screens[1]],
  },
  {
    id: 'obs-daily',
    phase: 'DAILY',
    title: 'Daily Logging',
    description: 'Meal tracking and hydration monitoring against computed targets.',
    color: Phase.act,
    dataFlow: ['user_state'],
    screens: [PHASES[4].screens[3], PHASES[4].screens[4]],
  },
  {
    id: 'obs-analytics',
    phase: 'ANALYTICS',
    title: 'Adherence Analytics',
    description: '8-week × 7-day macro heatmap showing protein/carb/fat adherence patterns.',
    color: Phase.plan,
    dataFlow: ['user_state'],
    screens: [PHASES[4].screens[2]],
  },
  {
    id: 'obs-profile',
    phase: 'ACCOUNT',
    title: 'Profile Hub',
    description: 'Account overview, streaks, and all user state in one view.',
    color: Phase.decide,
    dataFlow: ['user_state', 'user_constraints', 'user_goal'],
    screens: [PHASES[4].screens[0]],
  },
]

/* ── Mode config (shared by ModeOverview + FlowPage) ── */

export const MODE_CONFIG = {
  seed: {
    phases: SEED_PHASES,
    flows: null,
    color: SEED_COLOR,
    icon: ICONS.person,
    label: 'SEED MODE',
    breadcrumb: 'Seed',
    titlePrefix: 'SEED',
    sectionLabel: 'ONBOARDING SCREENS BY PHASE',
    description: 'Two-phase onboarding — general (8 steps: demographics, goals, TDEE) then fitness (9 steps: body composition, experience, equipment, focus, program).',
    routePrefix: '/journey/seed',
  },
  decide: {
    phases: DECIDE_PHASES,
    flows: null,
    color: DECIDE_COLOR,
    icon: ICONS.sparkle,
    label: 'DECIDE MODE',
    breadcrumb: 'Decide',
    titlePrefix: 'DECIDE',
    sectionLabel: 'DASHBOARD PRESETS',
    description: 'Central decision hub — goal-driven tile layouts that adapt to the user\'s primary focus. Entry point to all modes.',
    routePrefix: '/journey/decide',
  },
  cooking: {
    phases: COOKING_PHASES,
    flows: COOKING_FLOWS,
    color: COOKING_COLOR,
    icon: ICONS.meal,
    label: 'COOKING MODE',
    breadcrumb: 'Cooking',
    titlePrefix: 'COOKING',
    sectionLabel: 'ALL COOKING SCREENS BY PHASE',
    description: 'End-to-end meal planning, batch prep, and cooking execution. From macro targets to cook summary.',
    routePrefix: '/journey/cooking',
  },
  exercise: {
    phases: EXERCISE_PHASES,
    flows: EXERCISE_FLOWS,
    color: EXERCISE_COLOR,
    icon: ICONS.dumb,
    label: 'EXERCISE MODE',
    breadcrumb: 'Exercise',
    titlePrefix: 'EXERCISE',
    sectionLabel: 'FITNESS MODE — GOALS → PROGRAM → TRAIN → TRACK',
    description: 'Full fitness pipeline: fitness onboarding (body comp, experience, equipment, focus) → goals → program generation → session execution → progress tracking.',
    routePrefix: '/journey/exercise',
  },
  observe: {
    phases: OBSERVE_PHASES,
    flows: null,
    color: OBSERVE_COLOR,
    icon: ICONS.chart,
    label: 'OBSERVE MODE',
    breadcrumb: 'Observe',
    titlePrefix: 'OBSERVE',
    sectionLabel: 'TRACKING SCREENS BY CADENCE',
    description: 'Feedback loop — check-ins, daily food/water logging, and macro adherence analytics. Feeds data back to DECIDE for interventions.',
    routePrefix: '/journey/observe',
  },
}
