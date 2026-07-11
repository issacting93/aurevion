/* ════════════════════════════════════════════════════════════
   Nutrition Data — Recipe database + meal plan generation
   Generates weekly meal plans from user macro targets,
   dietary restrictions, and training schedule.
   ════════════════════════════════════════════════════════════ */

/* ── Recipe Database ── */

export const RECIPES = [
  // ─── BREAKFAST ───
  { id: 'protein_oats',         name: 'Protein Oats',              category: 'breakfast', ingredients: [{ name: 'rolled oats', amount: 80, unit: 'g' }, { name: 'whey protein', amount: 30, unit: 'g' }, { name: 'banana', amount: 1, unit: 'whole' }, { name: 'almond milk', amount: 200, unit: 'ml' }, { name: 'peanut butter', amount: 15, unit: 'g' }], macros: { protein: 38, carbs: 62, fat: 14, kcal: 526 }, servings: 1, prepTime: 5, cookTime: 5, method: 'fresh', dietary: ['vegetarian'], tags: ['high_protein', 'quick'] },
  { id: 'egg_veggie_scramble',  name: 'Egg & Veggie Scramble',     category: 'breakfast', ingredients: [{ name: 'eggs', amount: 4, unit: 'whole' }, { name: 'spinach', amount: 60, unit: 'g' }, { name: 'cherry tomatoes', amount: 80, unit: 'g' }, { name: 'feta cheese', amount: 30, unit: 'g' }, { name: 'olive oil', amount: 5, unit: 'ml' }], macros: { protein: 30, carbs: 6, fat: 24, kcal: 360 }, servings: 1, prepTime: 5, cookTime: 8, method: 'fresh', dietary: ['gluten_free', 'vegetarian'], tags: ['high_protein', 'low_carb', 'quick'] },
  { id: 'greek_yogurt_bowl',    name: 'Greek Yogurt Power Bowl',   category: 'breakfast', ingredients: [{ name: 'greek yogurt', amount: 200, unit: 'g' }, { name: 'mixed berries', amount: 100, unit: 'g' }, { name: 'granola', amount: 40, unit: 'g' }, { name: 'honey', amount: 10, unit: 'g' }, { name: 'chia seeds', amount: 10, unit: 'g' }], macros: { protein: 24, carbs: 48, fat: 10, kcal: 378 }, servings: 1, prepTime: 5, cookTime: 0, method: 'fresh', dietary: ['gluten_free', 'vegetarian'], tags: ['high_protein', 'quick'] },
  { id: 'breakfast_burrito',    name: 'Breakfast Burrito',         category: 'breakfast', ingredients: [{ name: 'eggs', amount: 3, unit: 'whole' }, { name: 'chicken sausage', amount: 80, unit: 'g' }, { name: 'tortilla wrap', amount: 1, unit: 'whole' }, { name: 'cheddar cheese', amount: 30, unit: 'g' }, { name: 'salsa', amount: 30, unit: 'g' }], macros: { protein: 36, carbs: 32, fat: 22, kcal: 474 }, servings: 1, prepTime: 5, cookTime: 10, method: 'batch', dietary: [], tags: ['high_protein', 'meal_prep'] },
  { id: 'overnight_oats',       name: 'Overnight Protein Oats',    category: 'breakfast', ingredients: [{ name: 'rolled oats', amount: 70, unit: 'g' }, { name: 'greek yogurt', amount: 100, unit: 'g' }, { name: 'whey protein', amount: 25, unit: 'g' }, { name: 'almond milk', amount: 150, unit: 'ml' }, { name: 'mixed berries', amount: 80, unit: 'g' }], macros: { protein: 34, carbs: 54, fat: 8, kcal: 424 }, servings: 1, prepTime: 5, cookTime: 0, method: 'batch', dietary: ['vegetarian'], tags: ['high_protein', 'meal_prep', 'no_cook'] },

  // ─── LUNCH ───
  { id: 'chicken_rice_bowl',    name: 'Chicken & Rice Bowl',       category: 'lunch', ingredients: [{ name: 'chicken breast', amount: 200, unit: 'g' }, { name: 'jasmine rice', amount: 100, unit: 'g' }, { name: 'broccoli', amount: 120, unit: 'g' }, { name: 'soy sauce', amount: 15, unit: 'ml' }, { name: 'sesame oil', amount: 5, unit: 'ml' }], macros: { protein: 48, carbs: 82, fat: 8, kcal: 594 }, servings: 1, prepTime: 10, cookTime: 20, method: 'batch', dietary: ['dairy_free', 'gluten_free'], tags: ['high_protein', 'meal_prep'] },
  { id: 'turkey_wrap',          name: 'Turkey & Avocado Wrap',     category: 'lunch', ingredients: [{ name: 'turkey breast', amount: 150, unit: 'g' }, { name: 'avocado', amount: 80, unit: 'g' }, { name: 'tortilla wrap', amount: 1, unit: 'whole' }, { name: 'mixed greens', amount: 40, unit: 'g' }, { name: 'mustard', amount: 10, unit: 'g' }], macros: { protein: 40, carbs: 30, fat: 18, kcal: 442 }, servings: 1, prepTime: 10, cookTime: 0, method: 'fresh', dietary: ['dairy_free'], tags: ['high_protein', 'quick'] },
  { id: 'tuna_salad',           name: 'Tuna Protein Salad',        category: 'lunch', ingredients: [{ name: 'tuna (canned)', amount: 160, unit: 'g' }, { name: 'mixed greens', amount: 100, unit: 'g' }, { name: 'cherry tomatoes', amount: 80, unit: 'g' }, { name: 'cucumber', amount: 80, unit: 'g' }, { name: 'olive oil', amount: 10, unit: 'ml' }, { name: 'lemon juice', amount: 15, unit: 'ml' }], macros: { protein: 42, carbs: 8, fat: 14, kcal: 326 }, servings: 1, prepTime: 10, cookTime: 0, method: 'fresh', dietary: ['gluten_free', 'dairy_free'], tags: ['high_protein', 'low_carb', 'quick'] },
  { id: 'beef_stir_fry',        name: 'Beef & Veggie Stir-Fry',    category: 'lunch', ingredients: [{ name: 'beef strips', amount: 180, unit: 'g' }, { name: 'bell pepper', amount: 100, unit: 'g' }, { name: 'snap peas', amount: 80, unit: 'g' }, { name: 'jasmine rice', amount: 80, unit: 'g' }, { name: 'soy sauce', amount: 15, unit: 'ml' }, { name: 'ginger', amount: 5, unit: 'g' }], macros: { protein: 44, carbs: 70, fat: 14, kcal: 582 }, servings: 1, prepTime: 10, cookTime: 15, method: 'fresh', dietary: ['dairy_free'], tags: ['high_protein'] },
  { id: 'chicken_pasta',        name: 'Chicken Pesto Pasta',       category: 'lunch', ingredients: [{ name: 'chicken breast', amount: 180, unit: 'g' }, { name: 'penne pasta', amount: 100, unit: 'g' }, { name: 'pesto', amount: 30, unit: 'g' }, { name: 'cherry tomatoes', amount: 80, unit: 'g' }, { name: 'parmesan', amount: 15, unit: 'g' }], macros: { protein: 50, carbs: 76, fat: 18, kcal: 666 }, servings: 1, prepTime: 10, cookTime: 20, method: 'batch', dietary: [], tags: ['high_protein', 'meal_prep'] },
  { id: 'lentil_soup',          name: 'Red Lentil & Tomato Soup',  category: 'lunch', ingredients: [{ name: 'red lentils', amount: 100, unit: 'g' }, { name: 'diced tomatoes', amount: 200, unit: 'g' }, { name: 'onion', amount: 80, unit: 'g' }, { name: 'garlic', amount: 5, unit: 'g' }, { name: 'vegetable broth', amount: 300, unit: 'ml' }, { name: 'cumin', amount: 3, unit: 'g' }], macros: { protein: 22, carbs: 52, fat: 4, kcal: 332 }, servings: 2, prepTime: 10, cookTime: 25, method: 'batch', dietary: ['vegan', 'gluten_free', 'dairy_free'], tags: ['meal_prep', 'high_fiber'] },

  // ─── DINNER ───
  { id: 'salmon_sweet_potato',  name: 'Salmon & Sweet Potato',     category: 'dinner', ingredients: [{ name: 'salmon fillet', amount: 200, unit: 'g' }, { name: 'sweet potato', amount: 200, unit: 'g' }, { name: 'asparagus', amount: 120, unit: 'g' }, { name: 'olive oil', amount: 10, unit: 'ml' }, { name: 'lemon juice', amount: 15, unit: 'ml' }], macros: { protein: 44, carbs: 46, fat: 22, kcal: 558 }, servings: 1, prepTime: 10, cookTime: 25, method: 'fresh', dietary: ['gluten_free', 'dairy_free'], tags: ['high_protein', 'omega_3'] },
  { id: 'chicken_stir_fry',     name: 'Chicken Teriyaki Stir-Fry', category: 'dinner', ingredients: [{ name: 'chicken thigh', amount: 200, unit: 'g' }, { name: 'broccoli', amount: 100, unit: 'g' }, { name: 'bell pepper', amount: 80, unit: 'g' }, { name: 'jasmine rice', amount: 100, unit: 'g' }, { name: 'teriyaki sauce', amount: 30, unit: 'ml' }], macros: { protein: 42, carbs: 84, fat: 12, kcal: 612 }, servings: 1, prepTime: 10, cookTime: 15, method: 'fresh', dietary: ['dairy_free'], tags: ['high_protein', 'quick'] },
  { id: 'beef_chili',           name: 'High-Protein Beef Chili',   category: 'dinner', ingredients: [{ name: 'lean ground beef', amount: 200, unit: 'g' }, { name: 'kidney beans', amount: 120, unit: 'g' }, { name: 'diced tomatoes', amount: 200, unit: 'g' }, { name: 'onion', amount: 80, unit: 'g' }, { name: 'bell pepper', amount: 80, unit: 'g' }, { name: 'chili powder', amount: 5, unit: 'g' }, { name: 'garlic', amount: 5, unit: 'g' }], macros: { protein: 48, carbs: 36, fat: 16, kcal: 480 }, servings: 2, prepTime: 15, cookTime: 40, method: 'slow_cook', dietary: ['gluten_free', 'dairy_free'], tags: ['high_protein', 'meal_prep', 'high_fiber'] },
  { id: 'turkey_meatballs',     name: 'Turkey Meatball Bowl',      category: 'dinner', ingredients: [{ name: 'ground turkey', amount: 200, unit: 'g' }, { name: 'quinoa', amount: 80, unit: 'g' }, { name: 'zucchini', amount: 100, unit: 'g' }, { name: 'marinara sauce', amount: 100, unit: 'g' }, { name: 'parmesan', amount: 15, unit: 'g' }], macros: { protein: 46, carbs: 58, fat: 14, kcal: 542 }, servings: 1, prepTime: 15, cookTime: 25, method: 'batch', dietary: [], tags: ['high_protein', 'meal_prep'] },
  { id: 'shrimp_bowl',          name: 'Garlic Shrimp & Grain Bowl',category: 'dinner', ingredients: [{ name: 'shrimp', amount: 200, unit: 'g' }, { name: 'brown rice', amount: 100, unit: 'g' }, { name: 'edamame', amount: 60, unit: 'g' }, { name: 'garlic', amount: 5, unit: 'g' }, { name: 'olive oil', amount: 10, unit: 'ml' }, { name: 'soy sauce', amount: 10, unit: 'ml' }], macros: { protein: 46, carbs: 72, fat: 12, kcal: 584 }, servings: 1, prepTime: 10, cookTime: 20, method: 'fresh', dietary: ['dairy_free'], tags: ['high_protein'] },
  { id: 'slow_cook_pulled_pork',name: 'Slow-Cook Pulled Pork',     category: 'dinner', ingredients: [{ name: 'pork shoulder', amount: 250, unit: 'g' }, { name: 'bbq sauce', amount: 40, unit: 'g' }, { name: 'coleslaw mix', amount: 80, unit: 'g' }, { name: 'brioche buns', amount: 1, unit: 'whole' }, { name: 'apple cider vinegar', amount: 15, unit: 'ml' }], macros: { protein: 52, carbs: 42, fat: 22, kcal: 574 }, servings: 3, prepTime: 10, cookTime: 240, method: 'slow_cook', dietary: ['dairy_free'], tags: ['meal_prep', 'high_protein'] },
  { id: 'veggie_curry',         name: 'Chickpea & Spinach Curry',  category: 'dinner', ingredients: [{ name: 'chickpeas', amount: 200, unit: 'g' }, { name: 'spinach', amount: 100, unit: 'g' }, { name: 'coconut milk', amount: 150, unit: 'ml' }, { name: 'diced tomatoes', amount: 150, unit: 'g' }, { name: 'onion', amount: 80, unit: 'g' }, { name: 'curry powder', amount: 8, unit: 'g' }], macros: { protein: 20, carbs: 48, fat: 18, kcal: 434 }, servings: 2, prepTime: 10, cookTime: 30, method: 'batch', dietary: ['vegan', 'gluten_free', 'dairy_free'], tags: ['meal_prep', 'high_fiber'] },
  { id: 'steak_veg',            name: 'Steak & Roasted Veg',       category: 'dinner', ingredients: [{ name: 'sirloin steak', amount: 220, unit: 'g' }, { name: 'sweet potato', amount: 150, unit: 'g' }, { name: 'broccoli', amount: 100, unit: 'g' }, { name: 'olive oil', amount: 10, unit: 'ml' }, { name: 'garlic butter', amount: 10, unit: 'g' }], macros: { protein: 52, carbs: 38, fat: 24, kcal: 576 }, servings: 1, prepTime: 10, cookTime: 25, method: 'fresh', dietary: ['gluten_free'], tags: ['high_protein'] },

  // ─── SNACKS ───
  { id: 'protein_shake',        name: 'Protein Shake',             category: 'snack', ingredients: [{ name: 'whey protein', amount: 35, unit: 'g' }, { name: 'banana', amount: 1, unit: 'whole' }, { name: 'almond milk', amount: 250, unit: 'ml' }, { name: 'peanut butter', amount: 15, unit: 'g' }], macros: { protein: 34, carbs: 32, fat: 10, kcal: 354 }, servings: 1, prepTime: 3, cookTime: 0, method: 'fresh', dietary: ['gluten_free', 'vegetarian'], tags: ['high_protein', 'quick', 'post_workout'] },
  { id: 'cottage_cheese_fruit', name: 'Cottage Cheese & Fruit',    category: 'snack', ingredients: [{ name: 'cottage cheese', amount: 200, unit: 'g' }, { name: 'pineapple', amount: 80, unit: 'g' }, { name: 'honey', amount: 10, unit: 'g' }], macros: { protein: 24, carbs: 22, fat: 6, kcal: 238 }, servings: 1, prepTime: 3, cookTime: 0, method: 'fresh', dietary: ['gluten_free', 'vegetarian'], tags: ['high_protein', 'quick'] },
  { id: 'protein_balls',        name: 'Protein Energy Balls',      category: 'snack', ingredients: [{ name: 'rolled oats', amount: 60, unit: 'g' }, { name: 'whey protein', amount: 25, unit: 'g' }, { name: 'peanut butter', amount: 30, unit: 'g' }, { name: 'honey', amount: 20, unit: 'g' }, { name: 'dark chocolate chips', amount: 20, unit: 'g' }], macros: { protein: 28, carbs: 46, fat: 16, kcal: 440 }, servings: 4, prepTime: 10, cookTime: 0, method: 'batch', dietary: ['vegetarian'], tags: ['high_protein', 'meal_prep', 'no_cook'] },
  { id: 'trail_mix',            name: 'High-Protein Trail Mix',    category: 'snack', ingredients: [{ name: 'almonds', amount: 30, unit: 'g' }, { name: 'walnuts', amount: 20, unit: 'g' }, { name: 'pumpkin seeds', amount: 15, unit: 'g' }, { name: 'dried cranberries', amount: 15, unit: 'g' }], macros: { protein: 14, carbs: 16, fat: 26, kcal: 354 }, servings: 1, prepTime: 2, cookTime: 0, method: 'fresh', dietary: ['vegan', 'gluten_free', 'dairy_free'], tags: ['quick', 'no_cook'] },
  { id: 'beef_jerky_crackers',  name: 'Jerky & Rice Cakes',        category: 'snack', ingredients: [{ name: 'beef jerky', amount: 50, unit: 'g' }, { name: 'rice cakes', amount: 2, unit: 'whole' }, { name: 'cream cheese', amount: 20, unit: 'g' }], macros: { protein: 22, carbs: 18, fat: 8, kcal: 232 }, servings: 1, prepTime: 2, cookTime: 0, method: 'fresh', dietary: ['gluten_free'], tags: ['high_protein', 'quick', 'no_cook'] },

  // ─── EXTRA ───
  { id: 'slow_cook_chicken',    name: 'Slow-Cook Honey Garlic Chicken', category: 'dinner', ingredients: [{ name: 'chicken thigh', amount: 250, unit: 'g' }, { name: 'honey', amount: 25, unit: 'g' }, { name: 'garlic', amount: 10, unit: 'g' }, { name: 'soy sauce', amount: 20, unit: 'ml' }, { name: 'brown rice', amount: 100, unit: 'g' }, { name: 'green beans', amount: 100, unit: 'g' }], macros: { protein: 46, carbs: 74, fat: 14, kcal: 610 }, servings: 3, prepTime: 10, cookTime: 180, method: 'slow_cook', dietary: ['dairy_free'], tags: ['high_protein', 'meal_prep'] },
]

/* ── Batch method colors (shared with BatchPrep) ── */

export const METHOD_COLORS = {
  fresh:     '#4ade80',
  batch:     '#60a5fa',
  slow_cook: '#FF6E50',
}

/* ── Deterministic pseudo-random using seed ── */

function seededRng(seed) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── Meal Plan Generator ── */

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack']

/**
 * generateMealPlan — produces a 7-day meal plan from macro targets,
 * dietary restrictions, and the workout schedule.
 *
 * @param {Object} params
 * @param {Object} params.targets       - { protein, carbs, fat, target (kcal) }
 * @param {string[]} params.dietary     - restriction tags, e.g. ['gluten_free']
 * @param {Object[]} params.schedule    - workoutPlan.schedule array from fitness-data
 * @returns {{ meals, weeklyMacros, batches }}
 */
export function generateMealPlan({ targets = {}, dietary = [], schedule = [] } = {}) {
  const dailyKcal   = targets.target || 2400
  const dailyProtein = targets.protein || 180
  const dailyCarbs   = targets.carbs || 260
  const dailyFat     = targets.fat || 70

  const dietarySet = new Set(dietary.map(d => d.toLowerCase()))

  // Filter recipes by dietary restrictions
  const pool = RECIPES.filter(recipe => {
    if (dietarySet.size === 0) return true
    for (const restriction of dietarySet) {
      if (!recipe.dietary.includes(restriction)) return false
    }
    return true
  })

  // Build category pools
  const poolByCategory = {
    breakfast: pool.filter(r => r.category === 'breakfast'),
    lunch:     pool.filter(r => r.category === 'lunch'),
    dinner:    pool.filter(r => r.category === 'dinner'),
    snack:     pool.filter(r => r.category === 'snack'),
  }

  // Fallback — if a pool is empty, allow any recipe in that slot
  for (const cat of SLOTS) {
    if (poolByCategory[cat].length === 0) {
      poolByCategory[cat] = pool.length > 0 ? pool : RECIPES.filter(r => r.category === cat)
    }
  }

  // Determine which days are training days vs rest
  const trainingDays = new Set()
  for (const entry of schedule) {
    if (entry && !entry.isRest) {
      trainingDays.add(entry.day || entry.dayIndex)
    }
  }

  const meals = []
  const seed = 42 // deterministic

  for (let d = 0; d < 7; d++) {
    const dayLabel = DAY_LABELS[d]
    const isTraining = trainingDays.has(dayLabel) || trainingDays.has(d)

    // On training days: +10% carbs, -10% fat
    // On rest days: -10% carbs, +10% fat
    const carbMod = isTraining ? 1.10 : 0.90
    const fatMod  = isTraining ? 0.90 : 1.10

    const dayTargets = {
      protein: dailyProtein,
      carbs:   Math.round(dailyCarbs * carbMod),
      fat:     Math.round(dailyFat * fatMod),
      kcal:    Math.round(dailyKcal + (isTraining ? 100 : -100)),
    }

    // Target distribution across slots (% of daily)
    const slotWeights = {
      breakfast: 0.25,
      lunch:     0.30,
      dinner:    0.30,
      snack:     0.15,
    }

    for (const slot of SLOTS) {
      const slotPool = poolByCategory[slot]
      const weight = slotWeights[slot]
      const slotKcal = dayTargets.kcal * weight

      // Shuffle pool deterministically per day+slot
      const shuffled = seededShuffle(slotPool, seed + d * 7 + SLOTS.indexOf(slot) * 31)

      // Score each recipe — lower is better
      let bestRecipe = shuffled[0]
      let bestScore = Infinity

      for (const recipe of shuffled) {
        // Calorie fit (primary factor)
        const scaledKcal = recipe.macros.kcal
        const kcalDelta = Math.abs(scaledKcal - slotKcal)

        // Protein fit — bonus for hitting protein target share
        const slotProtein = dayTargets.protein * weight
        const proteinDelta = Math.abs(recipe.macros.protein - slotProtein)

        // Batch/slow_cook bonus — reduces weekly cooking effort
        const methodBonus = recipe.method === 'batch' ? -30 : recipe.method === 'slow_cook' ? -40 : 0

        // Variety penalty — penalize repeating the same recipe across days
        const recentUse = meals.filter(m => m.recipeId === recipe.id).length
        const repeatPenalty = recentUse * 80

        const score = kcalDelta + proteinDelta * 0.5 + methodBonus + repeatPenalty
        if (score < bestScore) {
          bestScore = score
          bestRecipe = recipe
        }
      }

      // Compute ideal servings for this slot
      const idealServings = Math.max(0.5, Math.min(2, Math.round((slotKcal / bestRecipe.macros.kcal) * 4) / 4))

      const mealMacros = {
        protein: Math.round(bestRecipe.macros.protein * idealServings),
        carbs:   Math.round(bestRecipe.macros.carbs * idealServings),
        fat:     Math.round(bestRecipe.macros.fat * idealServings),
        kcal:    Math.round(bestRecipe.macros.kcal * idealServings),
      }

      meals.push({
        day: dayLabel,
        dayIndex: d,
        slot,
        recipeId: bestRecipe.id,
        recipe: bestRecipe,
        servings: idealServings,
        macros: mealMacros,
        isTrainingDay: isTraining,
      })
    }
  }

  // Compute weekly totals
  const weeklyMacros = { protein: 0, carbs: 0, fat: 0, kcal: 0 }
  for (const meal of meals) {
    weeklyMacros.protein += meal.macros.protein
    weeklyMacros.carbs   += meal.macros.carbs
    weeklyMacros.fat     += meal.macros.fat
    weeklyMacros.kcal    += meal.macros.kcal
  }

  // Compute daily averages
  weeklyMacros.avgProtein = Math.round(weeklyMacros.protein / 7)
  weeklyMacros.avgCarbs   = Math.round(weeklyMacros.carbs / 7)
  weeklyMacros.avgFat     = Math.round(weeklyMacros.fat / 7)
  weeklyMacros.avgKcal    = Math.round(weeklyMacros.kcal / 7)

  // Derive batches
  const batches = deriveBatches({ meals })

  return { meals, weeklyMacros, batches }
}

/* ── Batch Derivation ── */

/**
 * deriveBatches — groups meal plan recipes by cooking method
 * and computes prep summaries for each batch type.
 *
 * @param {{ meals: Object[] }} mealPlan
 * @returns {Object[]} batches
 */
export function deriveBatches(mealPlan) {
  const methodMap = { fresh: {}, batch: {}, slow_cook: {} }
  const methodLabels = {
    fresh:     'Cook Fresh',
    batch:     'Batch Prep',
    slow_cook: 'Slow Cook',
  }

  for (const meal of mealPlan.meals) {
    const method = meal.recipe.method || 'fresh'
    const key = meal.recipeId

    if (!methodMap[method]) methodMap[method] = {}
    if (!methodMap[method][key]) {
      methodMap[method][key] = {
        name: meal.recipe.name,
        servings: 0,
        prepTime: meal.recipe.prepTime,
        cookTime: meal.recipe.cookTime,
        macros: meal.recipe.macros || { protein: 0, carbs: 0, fat: 0, kcal: 0 },
      }
    }
    methodMap[method][key].servings += meal.servings
  }

  const batches = []

  for (const method of ['batch', 'slow_cook', 'fresh']) {
    const recipesInMethod = methodMap[method]
    if (!recipesInMethod) continue

    const recipeList = Object.values(recipesInMethod)
    if (recipeList.length === 0) continue

    const totalTime = recipeList.reduce((sum, r) => sum + r.prepTime + r.cookTime, 0)
    const totalPortions = recipeList.reduce((sum, r) => sum + r.servings, 0)

    batches.push({
      type: method,
      label: methodLabels[method],
      color: METHOD_COLORS[method],
      recipes: recipeList,
      totalTime,
      totalPortions: Math.round(totalPortions * 10) / 10,
    })
  }

  return batches
}

/* ── Shopping List ── */

/**
 * computeShoppingList — aggregates all ingredients from a meal plan,
 * subtracts pantry stock, and returns a sorted shopping list.
 *
 * @param {{ meals: Object[] }} mealPlan
 * @param {Object} pantry - { [ingredientName]: { have: number, unit: string } }
 * @returns {Object[]} sorted shopping list
 */
export function computeShoppingList(mealPlan, pantry = {}) {
  const aggregated = {}

  for (const meal of mealPlan.meals) {
    const recipe = meal.recipe
    const mult = meal.servings

    for (const ing of recipe.ingredients) {
      const key = ing.name.toLowerCase()
      if (!aggregated[key]) {
        aggregated[key] = { name: ing.name, need: 0, unit: ing.unit }
      }
      aggregated[key].need += ing.amount * mult
    }
  }

  const list = Object.values(aggregated).map(item => {
    const key = item.name.toLowerCase()
    const pantryItem = pantry[key] || pantry[item.name] || null
    const have = pantryItem ? pantryItem.have : 0
    const need = Math.round(item.need * 10) / 10
    const delta = Math.max(0, Math.round((need - have) * 10) / 10)

    return {
      name: item.name,
      need,
      have,
      unit: item.unit,
      delta,
      bought: false,
    }
  })

  // Sort by delta descending (biggest shortfall first)
  list.sort((a, b) => b.delta - a.delta)

  return list
}

/* ── Helpers ── */

export function getRecipeById(id) {
  return RECIPES.find(r => r.id === id)
}
