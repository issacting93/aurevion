// Goal Engine — derives system behavior from the goal network.
// This is the bridge between the network visualization (goal-network-data.js)
// and the execution layer (fitness-data.js, Onboarding.jsx, UserContext.jsx).

import { EDGES, NODES } from '../tools/goal-network/goal-network-data'
import { GOAL_CALORIC_STATE, MACRO_RATIOS, CALORIC_PREP, TRAINING_MEAL_IMPORTANCE } from '../tools/ontology/ontology-data'

// ── Mapping: network training node IDs → fitness-data modality keys ──

const TRAINING_TO_MODALITY = {
  lifting_hyp:  'hypertrophy',
  lifting_str:  'strength',
  hiit:         'hiit',
  zone2_cardio: 'cardio',
  circuits:     'endurance',
  plyometrics:  'power',
  mobility_yoga:'mobility',
  calisthenics: 'hypertrophy',   // bodyweight variant shares modality config
}

const MODALITY_TO_TRAINING = Object.fromEntries(
  Object.entries(TRAINING_TO_MODALITY).map(([k, v]) => [v, k])
)

const STRENGTH_WEIGHT = { strong: 3, moderate: 2, weak: 1 }

// ── Nutrition goal IDs ──

const NUTRITION_GOAL_IDS = new Set(
  NODES.filter(n => n.category === 'nutrition_goal').map(n => n.id)
)

// ── Derive training modalities from goals ──
// Walks goal→training edges, returns modality keys sorted by cumulative
// edge strength (strong=3, moderate=2, weak=1). Stronger modalities first.

export function deriveModalities(goals) {
  const weights = {}
  for (const goal of goals) {
    for (const edge of EDGES) {
      if (edge.from !== goal) continue
      const target = NODES.find(n => n.id === edge.to)
      if (!target || target.category !== 'training') continue
      const modality = TRAINING_TO_MODALITY[edge.to]
      if (!modality) continue
      weights[modality] = (weights[modality] || 0) + STRENGTH_WEIGHT[edge.strength]
    }
  }
  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .map(([mod]) => mod)
}

// ── Derive caloric modifier from a fitness goal ──
// Returns the kcal offset (e.g., -480 for fat_loss, +300 for hypertrophy).

/* Maps shorthand caloric goals (from onboarding) to ontology keys */
const CALORIC_ALIAS = { build: 'hypertrophy', lose: 'fat_loss', recomp: 'recomposition', maintain: 'overall_wellness' }

export function deriveCaloricMod(goal) {
  const key = CALORIC_ALIAS[goal] || goal
  const state = GOAL_CALORIC_STATE[key]
  return state ? state.modifier : 0
}

// ── Derive macro split from goal + body weight + target kcal ──
// Uses MACRO_RATIOS for goal-specific protein (gPerKg) and fat %.
// Falls back to generic formula if goal has no entry.

export function deriveMacroSplit(goal, weight, targetKcal) {
  const ratios = MACRO_RATIOS[CALORIC_ALIAS[goal] || goal]
  if (!ratios) {
    const protein = Math.round(weight * 2)
    const fat = Math.round(targetKcal * 0.25 / 9)
    const carbs = Math.round((targetKcal - protein * 4 - fat * 9) / 4)
    return { protein, fat, carbs }
  }

  const protein = Math.round(weight * ratios.gPerKg)
  const fatPct = (ratios.fat[0] + ratios.fat[1]) / 200     // midpoint as decimal
  const fat = Math.round(targetKcal * fatPct / 9)
  const carbs = Math.round((targetKcal - protein * 4 - fat * 9) / 4)
  return { protein, fat, carbs }
}

// ── Derive meal prep approach from goal + nutrition goals ──
// Combines CALORIC_PREP lookup with nutrition goal → meal_prep edges.

export function deriveMealPrep(goal, nutritionGoals = []) {
  const caloricState = GOAL_CALORIC_STATE[goal]?.state
  const base = caloricState ? CALORIC_PREP[caloricState] : null

  // Walk nutrition goal → meal_prep edges for additional preferences
  const prepScores = {}
  for (const ng of nutritionGoals) {
    for (const edge of EDGES) {
      if (edge.from !== ng) continue
      const target = NODES.find(n => n.id === edge.to)
      if (!target || target.category !== 'meal_prep') continue
      prepScores[target.label] = (prepScores[target.label] || 0) + STRENGTH_WEIGHT[edge.strength]
    }
  }

  return {
    primary: base?.primary || 'Balanced Prep',
    supporting: base?.supporting || [],
    timing: base?.timing || '',
    nutritionInfluence: Object.entries(prepScores)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name),
  }
}

// ── Derive meal timing importance for a training modality ──
// Returns { pre, post } importance levels (Strong/Moderate/Weak).

export function deriveMealTiming(modalityKey) {
  const nodeId = MODALITY_TO_TRAINING[modalityKey]
  return TRAINING_MEAL_IMPORTANCE[nodeId] || { pre: 'Weak', post: 'Weak', note: '' }
}

// ── Reverse lookup: which goals drive a given modality ──
// Used by generateProgram() to populate session.goalSources.

export function getGoalsForModality(modalityKey, userGoals) {
  return userGoals.filter(goal => {
    for (const edge of EDGES) {
      if (edge.from !== goal) continue
      const target = NODES.find(n => n.id === edge.to)
      if (!target || target.category !== 'training') continue
      if (TRAINING_TO_MODALITY[edge.to] === modalityKey) return true
    }
    return false
  })
}

// ── RIR target range for a modality ──
// Returns the recommended RIR range for auto-regulation.
// RPE = 10 - RIR. Sweet spot is RIR 1-2 for most modalities.

const RIR_TARGETS = {
  hypertrophy: { min: 1, max: 3, label: 'RIR 1-3' },
  strength:    { min: 0, max: 2, label: 'RIR 0-2' },
  hiit:        { min: 0, max: 1, label: 'RIR 0-1' },
  cardio:      { min: 3, max: 5, label: 'RIR 3-5' },
  power:       { min: 1, max: 2, label: 'RIR 1-2' },
  mobility:    { min: 3, max: 5, label: 'RIR 3-5' },
  endurance:   { min: 2, max: 4, label: 'RIR 2-4' },
}

export function deriveRIRTarget(modalityKey) {
  return RIR_TARGETS[modalityKey] || { min: 1, max: 3, label: 'RIR 1-3' }
}

// ── Exercise grouping style for a modality ──
// Determines how exercises are grouped within a session.

const GROUPING_STYLES = {
  hypertrophy: { type: 'superset', rule: 'Last 2 isolations paired', minExercises: 4 },
  strength:    { type: 'superset', rule: 'Last 2 isolations paired', minExercises: 4 },
  hiit:        { type: 'circuit',  rule: 'All exercises, 3 rounds',  minExercises: 0 },
  endurance:   { type: 'circuit',  rule: 'All exercises, 3 rounds',  minExercises: 0 },
  cardio:      { type: 'none',     rule: 'Straight sets',            minExercises: 0 },
  power:       { type: 'none',     rule: 'Straight sets',            minExercises: 0 },
  mobility:    { type: 'none',     rule: 'Straight sets',            minExercises: 0 },
}

export function deriveGroupingStyle(modalityKey) {
  return GROUPING_STYLES[modalityKey] || { type: 'none', rule: 'Straight sets', minExercises: 0 }
}

// ── Check if a goal ID is a nutrition goal ──

export function isNutritionGoal(goalId) {
  return NUTRITION_GOAL_IDS.has(goalId)
}
