/* Goal Lens — maps screen labels to goal-dependent relevance and badge text.
   Used by ScreenFlowStrip to dim/highlight screens when a goal is selected. */

import { GOAL_CALORIC_STATE, MACRO_RATIOS, CALORIC_PREP, GOAL_META } from '../ontology/ontology-data'

/* ── Relevance levels ──
   primary   — screen content changes significantly for this goal
   affected  — data flowing through is goal-dependent
   unchanged — goal-independent (will be dimmed)                    */

const RELEVANCE = {
  // Goal selection screens
  'Goals':           'primary',
  'Focus Areas':     'primary',
  'Goal Input':      'primary',
  'Goal Contract':   'primary',
  'Goal Detail':     'primary',

  // TDEE & macro computation
  'TDEE Reveal':     'primary',
  'TDEE Model':      'primary',
  'TDEE Confidence': 'primary',
  'Macro Targets':   'primary',
  'Ready':           'primary',

  // Program generation
  'Program Overview': 'primary',
  'Workout Template': 'primary',

  // Dashboard presets
  'Balanced':        'affected',
  'Nutrition Focus': 'affected',
  'Training Focus':  'affected',

  // Meal pipeline (follows macros)
  'Meal Queue':      'affected',
  'Batch Strategy':  'affected',
  'Shopping List':   'affected',

  // Tracking (measures against goal targets)
  'Check-in Flow':   'affected',
  'Macro Heatmap':   'affected',
  'Daily Food Log':  'affected',

  // Exercise execution (follows program)
  'Today':            'primary',
  'Exercise Browser': 'affected',
  'Exercise Detail':  'affected',
  'Workout Template': 'primary',
  'Workout History':  'affected',
  'Workout Summary':  'affected',
  'Calendar Week':    'affected',
  'Calendar Month':   'affected',
  'Calendar Day':     'affected',
  'Active Session':   'affected',
}

/* ── Badge text generators ── */

const BADGES = {
  'TDEE Model':      g => GOAL_CALORIC_STATE[g]?.state,
  'TDEE Confidence': g => { const c = GOAL_CALORIC_STATE[g]; return c ? `${c.modifier > 0 ? '+' : ''}${c.modifier} kcal` : null },
  'TDEE Reveal':     g => { const c = GOAL_CALORIC_STATE[g]; return c ? `${c.state} ${c.modifier > 0 ? '+' : ''}${c.modifier}` : null },
  'Ready':           g => GOAL_CALORIC_STATE[g]?.state,
  'Macro Targets':   g => { const r = MACRO_RATIOS[g]; return r ? `P ${r.protein[0]}–${r.protein[1]}%` : null },
  'Batch Strategy':  g => { const c = GOAL_CALORIC_STATE[g]; return c ? CALORIC_PREP[c.state]?.primary : null },
  'Balanced':        () => 'Layout adapts',
  'Nutrition Focus': () => 'Layout adapts',
  'Training Focus':  () => 'Layout adapts',
  'Goal Input':      g => GOAL_META[g]?.label,
  'Goal Contract':   g => GOAL_META[g]?.label,
  'Goal Detail':     g => GOAL_META[g]?.label,
  'Today':           g => GOAL_META[g]?.label,
  'Workout Template': g => { const c = GOAL_CALORIC_STATE[g]; return c ? `${c.state}` : null },
}

/* ── Public API ── */

export function getScreenLens(label, goalKey) {
  if (!goalKey || !GOAL_META[goalKey]) return null
  const relevance = RELEVANCE[label] || 'unchanged'
  const badgeFn = BADGES[label]
  const badge = badgeFn ? badgeFn(goalKey) : null
  return { relevance, badge, color: GOAL_META[goalKey].color }
}
