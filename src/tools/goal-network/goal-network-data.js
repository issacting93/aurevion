/* Goal Network Data — nodes, edges, layout, and helpers.
   Defines the relationship graph between fitness goals, nutrition goals,
   training modalities, meal prep approaches, and caloric states. */

import { Color } from '../../ui/tokens'
import { ICONS } from '../../ui/components'

/* ── Category definitions ── */

export const CATEGORIES = {
  fitness_goal:   { label: 'Fitness Goals',    color: Color.accent,  ring: 3 },
  nutrition_goal: { label: 'Nutrition Goals',  color: Color.green,   ring: 3 },
  training:       { label: 'Training',         color: Color.blue,    ring: 2 },
  meal_prep:      { label: 'Meal Prep',        color: Color.purple,  ring: 2 },
  caloric_state:  { label: 'Caloric State',    color: Color.amber,   ring: 1 },
}

/* ── Nodes ── */

export const NODES = [
  // Fitness Goals — Body Composition
  { id: 'hypertrophy',      category: 'fitness_goal', label: 'Hypertrophy',       sub: 'Maximize muscle growth via progressive overload',         icon: ICONS.trend_up, group: 'Body Composition' },
  { id: 'fat_loss',         category: 'fitness_goal', label: 'Fat Loss',          sub: 'Reduce body fat while preserving lean mass',              icon: ICONS.trend_dn, group: 'Body Composition' },
  { id: 'recomposition',    category: 'fitness_goal', label: 'Recomposition',     sub: 'Build muscle and lose fat simultaneously',                icon: ICONS.swap,     group: 'Body Composition' },
  // Fitness Goals — Performance
  { id: 'max_strength',     category: 'fitness_goal', label: 'Max Strength',      sub: 'Increase 1RM on compound lifts',                         icon: ICONS.dumb,     group: 'Performance' },
  { id: 'cardio_endurance', category: 'fitness_goal', label: 'Cardio Endurance',  sub: 'Improve aerobic capacity and VO2 max',                   icon: ICONS.flame,    group: 'Performance' },
  { id: 'power',            category: 'fitness_goal', label: 'Power',             sub: 'Explosive force production and rate of development',      icon: ICONS.play,     group: 'Performance' },
  { id: 'agility',          category: 'fitness_goal', label: 'Agility',           sub: 'Speed, coordination, and directional control',            icon: ICONS.swap,     group: 'Performance' },
  // Fitness Goals — Functional Fitness
  { id: 'flexibility',      category: 'fitness_goal', label: 'Flexibility',       sub: 'Range of motion and joint mobility',                     icon: ICONS.expand,   group: 'Functional' },
  { id: 'balance',          category: 'fitness_goal', label: 'Balance',           sub: 'Stability, proprioception, and core control',            icon: ICONS.pause,    group: 'Functional' },
  { id: 'overall_wellness', category: 'fitness_goal', label: 'Wellness',          sub: 'General health, consistency, and sustainability',        icon: ICONS.sparkle,  group: 'Functional' },

  // Nutrition Goals
  { id: 'healthier_meals',   category: 'nutrition_goal', label: 'Healthier Meals',   sub: 'Improve food quality and nutrient density',    icon: ICONS.meal },
  { id: 'cook_more',         category: 'nutrition_goal', label: 'Cook More',         sub: 'Prepare meals at home instead of eating out',  icon: ICONS.pan },
  { id: 'improve_digestion', category: 'nutrition_goal', label: 'Digestion',         sub: 'Gut health, fiber intake, and comfort',        icon: ICONS.bowl },
  { id: 'drink_water',       category: 'nutrition_goal', label: 'Hydration',         sub: 'Stay hydrated — track daily water intake',     icon: ICONS.fire },
  { id: 'save_money',        category: 'nutrition_goal', label: 'Save Money',        sub: 'Reduce food spending via batch prep',           icon: ICONS.chart },

  // Training Modalities
  { id: 'lifting_hyp',   category: 'training', label: 'Hypertrophy Lifting', sub: '6-12 reps, 60-90s rest, volume focus',                icon: ICONS.dumb },
  { id: 'lifting_str',   category: 'training', label: 'Strength Lifting',    sub: '1-5 reps, heavy compound, 3-5 min rest',              icon: ICONS.dumb },
  { id: 'hiit',          category: 'training', label: 'HIIT',                sub: 'High-intensity intervals, 15-30 min sessions',        icon: ICONS.flame },
  { id: 'zone2_cardio',  category: 'training', label: 'Zone 2 Cardio',       sub: '60-70% max HR, 30-90 min aerobic base',               icon: ICONS.timer },
  { id: 'circuits',      category: 'training', label: 'Circuits',            sub: 'Multi-exercise rounds, minimal rest, metabolic',       icon: ICONS.swap },
  { id: 'plyometrics',   category: 'training', label: 'Plyometrics',         sub: 'Jump training, explosive movements, CNS-heavy',       icon: ICONS.play },
  { id: 'mobility_yoga', category: 'training', label: 'Mobility / Yoga',     sub: 'Flexibility, recovery, parasympathetic activation',   icon: ICONS.expand },
  { id: 'calisthenics',  category: 'training', label: 'Calisthenics',        sub: 'Bodyweight progressive overload, no equipment',       icon: ICONS.person },

  // Meal Prep Approaches
  { id: 'lean_prep',      category: 'meal_prep', label: 'Lean Prep',          sub: 'High protein, high volume, low calorie — grilled, steamed',   icon: ICONS.meal },
  { id: 'bulk_prep',      category: 'meal_prep', label: 'Bulk Prep',          sub: 'Calorie-dense staples — rice, pasta, nut butters, oils',      icon: ICONS.cart },
  { id: 'balanced_prep',  category: 'meal_prep', label: 'Balanced Prep',      sub: 'Moderate portions, mixed macros, variety focus',              icon: ICONS.bowl },
  { id: 'pre_workout',    category: 'meal_prep', label: 'Pre-Workout Fuel',   sub: 'Carbs + moderate protein, low fat, 1-3h before session',     icon: ICONS.timer },
  { id: 'post_recovery',  category: 'meal_prep', label: 'Post-Workout',       sub: 'Fast protein + carbs within 2h for synthesis + glycogen',    icon: ICONS.sparkle },

  // Caloric States
  { id: 'surplus',     category: 'caloric_state', label: 'Surplus',      sub: 'TDEE +10-15% — supports muscle growth and strength gains',      icon: ICONS.trend_up },
  { id: 'deficit',     category: 'caloric_state', label: 'Deficit',      sub: 'TDEE -500 to -750 kcal — drives fat loss while preserving LBM', icon: ICONS.trend_dn },
  { id: 'maintenance', category: 'caloric_state', label: 'Maintenance',  sub: 'Eat at TDEE — sustain current composition',                     icon: ICONS.pause },
  { id: 'recomp_cal',  category: 'caloric_state', label: 'Recomp',       sub: 'TDEE -150 kcal — slight deficit to recompose',                  icon: ICONS.swap },
]

/* ── Edges ── */

export const EDGES = [
  // ─── Fitness Goals → Training ───
  { from: 'hypertrophy',      to: 'lifting_hyp',   strength: 'strong' },
  { from: 'hypertrophy',      to: 'calisthenics',  strength: 'moderate' },
  { from: 'fat_loss',         to: 'hiit',          strength: 'strong' },
  { from: 'fat_loss',         to: 'lifting_str',   strength: 'moderate' },
  { from: 'fat_loss',         to: 'zone2_cardio',  strength: 'moderate' },
  { from: 'fat_loss',         to: 'circuits',      strength: 'moderate' },
  { from: 'recomposition',    to: 'lifting_hyp',   strength: 'strong' },
  { from: 'recomposition',    to: 'hiit',          strength: 'moderate' },
  { from: 'recomposition',    to: 'zone2_cardio',  strength: 'weak' },
  { from: 'max_strength',     to: 'lifting_str',   strength: 'strong' },
  { from: 'max_strength',     to: 'plyometrics',   strength: 'moderate' },
  { from: 'cardio_endurance', to: 'zone2_cardio',  strength: 'strong' },
  { from: 'cardio_endurance', to: 'circuits',      strength: 'moderate' },
  { from: 'power',            to: 'plyometrics',   strength: 'strong' },
  { from: 'power',            to: 'lifting_str',   strength: 'moderate' },
  { from: 'agility',          to: 'plyometrics',   strength: 'moderate' },
  { from: 'agility',          to: 'circuits',      strength: 'strong' },
  { from: 'flexibility',      to: 'mobility_yoga', strength: 'strong' },
  { from: 'balance',          to: 'mobility_yoga', strength: 'moderate' },
  { from: 'balance',          to: 'calisthenics',  strength: 'moderate' },
  { from: 'overall_wellness', to: 'zone2_cardio',  strength: 'moderate' },
  { from: 'overall_wellness', to: 'mobility_yoga', strength: 'moderate' },
  { from: 'overall_wellness', to: 'circuits',      strength: 'weak' },

  // ─── Fitness Goals → Caloric State ───
  { from: 'hypertrophy',      to: 'surplus',      strength: 'strong' },
  { from: 'fat_loss',         to: 'deficit',      strength: 'strong' },
  { from: 'recomposition',    to: 'recomp_cal',   strength: 'strong' },
  { from: 'max_strength',     to: 'surplus',      strength: 'moderate' },
  { from: 'cardio_endurance', to: 'maintenance',  strength: 'moderate' },
  { from: 'power',            to: 'surplus',      strength: 'moderate' },
  { from: 'agility',          to: 'maintenance',  strength: 'moderate' },
  { from: 'flexibility',      to: 'maintenance',  strength: 'weak' },
  { from: 'balance',          to: 'maintenance',  strength: 'weak' },
  { from: 'overall_wellness', to: 'maintenance',  strength: 'moderate' },

  // ─── Caloric State → Meal Prep ───
  { from: 'surplus',     to: 'bulk_prep',      strength: 'strong' },
  { from: 'surplus',     to: 'pre_workout',    strength: 'moderate' },
  { from: 'surplus',     to: 'post_recovery',  strength: 'moderate' },
  { from: 'deficit',     to: 'lean_prep',      strength: 'strong' },
  { from: 'deficit',     to: 'post_recovery',  strength: 'moderate' },
  { from: 'maintenance', to: 'balanced_prep',  strength: 'strong' },
  { from: 'maintenance', to: 'pre_workout',    strength: 'moderate' },
  { from: 'recomp_cal',  to: 'lean_prep',      strength: 'moderate' },
  { from: 'recomp_cal',  to: 'post_recovery',  strength: 'strong' },
  { from: 'recomp_cal',  to: 'balanced_prep',  strength: 'moderate' },

  // ─── Training → Meal Prep (timing) ───
  { from: 'lifting_hyp',   to: 'post_recovery', strength: 'strong' },
  { from: 'lifting_hyp',   to: 'pre_workout',   strength: 'moderate' },
  { from: 'lifting_str',   to: 'post_recovery', strength: 'strong' },
  { from: 'lifting_str',   to: 'pre_workout',   strength: 'moderate' },
  { from: 'hiit',          to: 'pre_workout',   strength: 'strong' },
  { from: 'hiit',          to: 'post_recovery', strength: 'moderate' },
  { from: 'zone2_cardio',  to: 'balanced_prep', strength: 'moderate' },
  { from: 'circuits',      to: 'post_recovery', strength: 'moderate' },
  { from: 'plyometrics',   to: 'pre_workout',   strength: 'strong' },
  { from: 'plyometrics',   to: 'post_recovery', strength: 'moderate' },

  // ─── Nutrition Goals → Meal Prep ───
  { from: 'healthier_meals',   to: 'balanced_prep',  strength: 'strong' },
  { from: 'healthier_meals',   to: 'lean_prep',      strength: 'moderate' },
  { from: 'cook_more',         to: 'lean_prep',      strength: 'moderate' },
  { from: 'cook_more',         to: 'bulk_prep',      strength: 'moderate' },
  { from: 'cook_more',         to: 'balanced_prep',  strength: 'moderate' },
  { from: 'cook_more',         to: 'pre_workout',    strength: 'weak' },
  { from: 'cook_more',         to: 'post_recovery',  strength: 'weak' },
  { from: 'improve_digestion', to: 'balanced_prep',  strength: 'moderate' },
  { from: 'save_money',        to: 'bulk_prep',      strength: 'strong' },
  { from: 'save_money',        to: 'lean_prep',      strength: 'moderate' },

  // ─── Cross-domain: Nutrition Goals → Caloric State ───
  { from: 'healthier_meals',   to: 'maintenance',   strength: 'weak' },
  { from: 'improve_digestion', to: 'maintenance',   strength: 'weak' },
]

/* ── Layout computation ── */

const CX = 550, CY = 400
const RING_RADII = { 1: 110, 2: 260, 3: 390 }

function distributeOnArc(count, startAngle, endAngle) {
  const angles = []
  const step = (endAngle - startAngle) / Math.max(1, count - 1)
  for (let i = 0; i < count; i++) {
    angles.push(count === 1 ? (startAngle + endAngle) / 2 : startAngle + step * i)
  }
  return angles
}

export function computeLayout() {
  const positions = {}

  // Caloric states — ring 1, cardinal-ish positions
  const caloricNodes = NODES.filter(n => n.category === 'caloric_state')
  const caloricAngles = distributeOnArc(caloricNodes.length, -Math.PI * 0.6, Math.PI * 0.6)
  caloricNodes.forEach((n, i) => {
    const a = caloricAngles[i]
    positions[n.id] = { x: CX + Math.cos(a) * RING_RADII[1], y: CY + Math.sin(a) * RING_RADII[1] }
  })

  // Training — ring 2, upper arc
  const trainingNodes = NODES.filter(n => n.category === 'training')
  const trainingAngles = distributeOnArc(trainingNodes.length, -Math.PI * 0.85, Math.PI * 0.15)
  trainingNodes.forEach((n, i) => {
    const a = trainingAngles[i]
    positions[n.id] = { x: CX + Math.cos(a) * RING_RADII[2], y: CY + Math.sin(a) * RING_RADII[2] }
  })

  // Meal prep — ring 2, lower arc
  const mealNodes = NODES.filter(n => n.category === 'meal_prep')
  const mealAngles = distributeOnArc(mealNodes.length, Math.PI * 0.25, Math.PI * 0.75)
  mealNodes.forEach((n, i) => {
    const a = mealAngles[i]
    positions[n.id] = { x: CX + Math.cos(a) * RING_RADII[2], y: CY + Math.sin(a) * RING_RADII[2] }
  })

  // Fitness goals — ring 3, upper arc
  const fitnessNodes = NODES.filter(n => n.category === 'fitness_goal')
  const fitnessAngles = distributeOnArc(fitnessNodes.length, -Math.PI * 0.9, Math.PI * 0.15)
  fitnessNodes.forEach((n, i) => {
    const a = fitnessAngles[i]
    positions[n.id] = { x: CX + Math.cos(a) * RING_RADII[3], y: CY + Math.sin(a) * RING_RADII[3] }
  })

  // Nutrition goals — ring 3, lower arc
  const nutritionNodes = NODES.filter(n => n.category === 'nutrition_goal')
  const nutritionAngles = distributeOnArc(nutritionNodes.length, Math.PI * 0.22, Math.PI * 0.78)
  nutritionNodes.forEach((n, i) => {
    const a = nutritionAngles[i]
    positions[n.id] = { x: CX + Math.cos(a) * RING_RADII[3], y: CY + Math.sin(a) * RING_RADII[3] }
  })

  return positions
}

/* ── Helpers ── */

const _edgeIndex = new Map()
function buildEdgeIndex() {
  if (_edgeIndex.size > 0) return
  for (const edge of EDGES) {
    if (!_edgeIndex.has(edge.from)) _edgeIndex.set(edge.from, [])
    if (!_edgeIndex.has(edge.to)) _edgeIndex.set(edge.to, [])
    _edgeIndex.get(edge.from).push(edge)
    _edgeIndex.get(edge.to).push(edge)
  }
}

export function getConnectedEdges(nodeId) {
  buildEdgeIndex()
  return _edgeIndex.get(nodeId) || []
}

export function getConnectedNodeIds(nodeId) {
  const edges = getConnectedEdges(nodeId)
  const ids = new Set()
  for (const e of edges) {
    if (e.from === nodeId) ids.add(e.to)
    else ids.add(e.from)
  }
  return ids
}

export function getNodeById(id) {
  return NODES.find(n => n.id === id)
}
