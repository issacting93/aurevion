/* ════════════════════════════════════════════════════════════
   Fitness Data — Exercise database + program generation
   Generates weekly training programs from user goals,
   equipment, available days, injuries, and experience.
   ════════════════════════════════════════════════════════════ */

/* ── Exercise Database ── */

export const EXERCISES = [
  // ─── COMPOUND · BARBELL ───
  { id: 'back_squat',    name: 'Back Squat',         category: 'compound', muscles: ['quads', 'glutes', 'core'],          equipment: 'barbell',    modality: ['hypertrophy', 'strength'], cue: 'Drive through the floor, chest up, knees track toes',              injury_exclude: ['knees', 'lower_back'] },
  { id: 'front_squat',   name: 'Front Squat',        category: 'compound', muscles: ['quads', 'core'],                    equipment: 'barbell',    modality: ['hypertrophy', 'strength'], cue: 'Elbows high, sit between hips, upright torso',                    injury_exclude: ['knees', 'wrists'] },
  { id: 'deadlift',      name: 'Deadlift',           category: 'compound', muscles: ['hamstrings', 'glutes', 'back'],     equipment: 'barbell',    modality: ['strength'],                cue: 'Hinge at hips, brace core, pull the slack out of the bar',        injury_exclude: ['lower_back'] },
  { id: 'bench_press',   name: 'Bench Press',        category: 'compound', muscles: ['chest', 'triceps', 'shoulders'],    equipment: 'barbell',    modality: ['hypertrophy', 'strength'], cue: 'Retract scapulae, arch upper back, touch chest',                  injury_exclude: ['shoulders'] },
  { id: 'ohp',           name: 'Overhead Press',     category: 'compound', muscles: ['shoulders', 'triceps', 'core'],     equipment: 'barbell',    modality: ['hypertrophy', 'strength'], cue: 'Brace core, press straight up, head through at lockout',          injury_exclude: ['shoulders', 'lower_back'] },
  { id: 'barbell_row',   name: 'Barbell Row',        category: 'compound', muscles: ['back', 'biceps'],                   equipment: 'barbell',    modality: ['hypertrophy', 'strength'], cue: 'Hinge to 45°, pull to lower chest, squeeze shoulder blades',      injury_exclude: ['lower_back'] },
  { id: 'rdl',           name: 'Romanian Deadlift',  category: 'compound', muscles: ['hamstrings', 'glutes'],             equipment: 'barbell',    modality: ['hypertrophy'],             cue: 'Soft knees, push hips back, feel hamstring stretch',              injury_exclude: ['lower_back'] },

  // ─── COMPOUND · DUMBBELL ───
  { id: 'goblet_squat',  name: 'Goblet Squat',       category: 'compound', muscles: ['quads', 'glutes', 'core'],          equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Hold bell at chest, sit deep between knees',                     injury_exclude: ['knees'] },
  { id: 'db_bench',      name: 'DB Bench Press',     category: 'compound', muscles: ['chest', 'triceps'],                 equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Arc dumbbells together at top, control the negative',             injury_exclude: ['shoulders'] },
  { id: 'db_ohp',        name: 'DB Shoulder Press',  category: 'compound', muscles: ['shoulders', 'triceps'],             equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Press straight up from shoulder height, control descent',         injury_exclude: ['shoulders'] },
  { id: 'db_row',        name: 'DB Row',             category: 'compound', muscles: ['back', 'biceps'],                   equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Brace on bench, pull to hip, squeeze at top',                    injury_exclude: [] },
  { id: 'db_rdl',        name: 'DB Romanian DL',     category: 'compound', muscles: ['hamstrings', 'glutes'],             equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Dumbbells track shins, push hips back, feel the stretch',         injury_exclude: ['lower_back'] },
  { id: 'db_lunge',      name: 'DB Walking Lunge',   category: 'compound', muscles: ['quads', 'glutes'],                  equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Long stride, front knee tracks toe, drive through heel',          injury_exclude: ['knees'] },
  { id: 'db_incline',    name: 'Incline DB Press',   category: 'compound', muscles: ['chest', 'shoulders'],               equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: '30-45° incline, press up and together, control negative',         injury_exclude: ['shoulders'] },

  // ─── COMPOUND · BODYWEIGHT ───
  { id: 'pushup',        name: 'Push-up',            category: 'compound', muscles: ['chest', 'triceps', 'core'],          equipment: 'bodyweight', modality: ['hypertrophy', 'endurance'], cue: 'Hands under shoulders, body straight line, chest to floor',       injury_exclude: ['wrists'] },
  { id: 'pullup',        name: 'Pull-up',            category: 'compound', muscles: ['back', 'biceps'],                    equipment: 'bodyweight', modality: ['hypertrophy', 'strength'],  cue: 'Full dead hang, pull chin over bar, squeeze lats',                injury_exclude: ['shoulders'] },
  { id: 'dip',           name: 'Dip',                category: 'compound', muscles: ['chest', 'triceps', 'shoulders'],     equipment: 'bodyweight', modality: ['hypertrophy'],              cue: 'Lean forward for chest, upright for triceps, control descent',    injury_exclude: ['shoulders', 'wrists'] },
  { id: 'pistol_squat',  name: 'Pistol Squat',       category: 'compound', muscles: ['quads', 'glutes'],                   equipment: 'bodyweight', modality: ['strength'],                 cue: 'Extend one leg, sit deep, drive up through planted heel',         injury_exclude: ['knees'] },
  { id: 'inverted_row',  name: 'Inverted Row',       category: 'compound', muscles: ['back', 'biceps'],                    equipment: 'bodyweight', modality: ['hypertrophy'],              cue: 'Body straight line, pull chest to bar, squeeze shoulder blades',  injury_exclude: [] },

  // ─── ISOLATION ───
  { id: 'bicep_curl',    name: 'Bicep Curl',         category: 'isolation', muscles: ['biceps'],                            equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'No swinging, control the negative, full range of motion',         injury_exclude: ['wrists'] },
  { id: 'tricep_ext',    name: 'Tricep Extension',   category: 'isolation', muscles: ['triceps'],                           equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Elbows locked in place, extend fully, squeeze at top',            injury_exclude: [] },
  { id: 'lateral_raise', name: 'Lateral Raise',      category: 'isolation', muscles: ['shoulders'],                         equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Slight bend in elbows, lead with pinkies, pause at top',          injury_exclude: ['shoulders'] },
  { id: 'face_pull',     name: 'Face Pull',          category: 'isolation', muscles: ['rear_delts', 'rotator_cuff'],        equipment: 'cable',      modality: ['hypertrophy'],             cue: 'Pull to face, externally rotate, squeeze rear delts',             injury_exclude: [] },
  { id: 'leg_curl',      name: 'Leg Curl',           category: 'isolation', muscles: ['hamstrings'],                        equipment: 'machine',    modality: ['hypertrophy'],             cue: 'Control the eccentric, full contraction, no momentum',            injury_exclude: [] },
  { id: 'leg_ext',       name: 'Leg Extension',      category: 'isolation', muscles: ['quads'],                             equipment: 'machine',    modality: ['hypertrophy'],             cue: 'Pause at top, control descent, avoid locking out violently',       injury_exclude: ['knees'] },
  { id: 'calf_raise',    name: 'Calf Raise',         category: 'isolation', muscles: ['calves'],                            equipment: 'dumbbell',   modality: ['hypertrophy'],             cue: 'Full stretch at bottom, pause at top, slow negative',              injury_exclude: [] },

  // ─── CORE ───
  { id: 'plank',         name: 'Plank',              category: 'core',     muscles: ['core'],                               equipment: 'bodyweight', modality: ['endurance'],               cue: 'Straight line head to heels, squeeze glutes and brace',           injury_exclude: ['wrists'] },
  { id: 'deadbug',       name: 'Dead Bug',           category: 'core',     muscles: ['core'],                               equipment: 'bodyweight', modality: ['endurance'],               cue: 'Press lower back into floor, move opposite arm and leg slowly',    injury_exclude: [] },
  { id: 'ab_wheel',      name: 'Ab Wheel Rollout',   category: 'core',     muscles: ['core'],                               equipment: 'bodyweight', modality: ['strength'],                cue: 'Roll out slow, keep core braced, don\'t let hips sag',            injury_exclude: ['lower_back', 'wrists'] },
  { id: 'hanging_raise', name: 'Hanging Leg Raise',  category: 'core',     muscles: ['core', 'hip_flexors'],                equipment: 'bodyweight', modality: ['hypertrophy'],             cue: 'Control the swing, curl pelvis up, slow negative',                injury_exclude: ['shoulders'] },
  { id: 'pallof_press',  name: 'Pallof Press',       category: 'core',     muscles: ['core'],                               equipment: 'cable',      modality: ['endurance'],               cue: 'Press straight out, resist rotation, hold 2 seconds',             injury_exclude: [] },

  // ─── CARDIO ───
  { id: 'treadmill_run', name: 'Treadmill Run',      category: 'cardio',   muscles: ['legs', 'cardio'],                     equipment: 'machine',    modality: ['cardio'],                  cue: 'Zone 2 pace — conversational, 60-70% max HR',                    injury_exclude: ['knees'] },
  { id: 'bike',          name: 'Stationary Bike',    category: 'cardio',   muscles: ['legs', 'cardio'],                     equipment: 'machine',    modality: ['cardio'],                  cue: 'Steady cadence 80-90 RPM, keep heart rate in zone',               injury_exclude: [] },
  { id: 'rowing',        name: 'Rowing Machine',     category: 'cardio',   muscles: ['back', 'legs', 'cardio'],             equipment: 'machine',    modality: ['cardio'],                  cue: 'Drive with legs first, then pull with arms, lean back slightly',   injury_exclude: ['lower_back'] },
  { id: 'jump_rope',     name: 'Jump Rope',          category: 'cardio',   muscles: ['calves', 'cardio'],                   equipment: 'bodyweight', modality: ['cardio', 'hiit'],           cue: 'Stay on balls of feet, small jumps, wrists do the work',          injury_exclude: ['knees'] },

  // ─── HIIT ───
  { id: 'box_jump',      name: 'Box Jump',           category: 'hiit',     muscles: ['quads', 'glutes'],                    equipment: 'bodyweight', modality: ['hiit', 'power'],            cue: 'Swing arms, land soft with bent knees, step down',                injury_exclude: ['knees'] },
  { id: 'kb_swing',      name: 'Kettlebell Swing',   category: 'hiit',     muscles: ['hamstrings', 'glutes', 'core'],       equipment: 'dumbbell',   modality: ['hiit', 'power'],            cue: 'Hip hinge, snap hips forward, arms are just ropes',               injury_exclude: ['lower_back'] },
  { id: 'burpees',       name: 'Burpees',            category: 'hiit',     muscles: ['full_body'],                          equipment: 'bodyweight', modality: ['hiit'],                     cue: 'Chest to floor, explode up, jump and clap overhead',              injury_exclude: ['wrists', 'knees'] },
  { id: 'battle_ropes',  name: 'Battle Ropes',       category: 'hiit',     muscles: ['shoulders', 'core'],                  equipment: 'cable',      modality: ['hiit'],                     cue: 'Alternating waves, keep core tight, full arm extension',           injury_exclude: ['shoulders'] },
  { id: 'med_ball_slam', name: 'Med Ball Slam',      category: 'hiit',     muscles: ['core', 'shoulders'],                  equipment: 'dumbbell',   modality: ['hiit', 'power'],            cue: 'Reach overhead, slam with full force, squat to pick up',           injury_exclude: ['shoulders', 'lower_back'] },
  { id: 'sled_push',     name: 'Sled Push',          category: 'hiit',     muscles: ['quads', 'glutes', 'core'],            equipment: 'machine',    modality: ['hiit'],                     cue: 'Low body position, drive through legs, short powerful steps',      injury_exclude: ['knees'] },

  // ─── MOBILITY ───
  { id: 'cat_cow',       name: 'Cat-Cow',            category: 'mobility', muscles: ['spine'],                              equipment: 'bodyweight', modality: ['mobility'],                cue: 'Slow breaths, arch and round through full range',                  injury_exclude: [] },
  { id: 'hip_90_90',     name: '90/90 Hip Swivels',  category: 'mobility', muscles: ['hips'],                               equipment: 'bodyweight', modality: ['mobility'],                cue: 'Both knees at 90°, rotate smoothly, feel hip opening',            injury_exclude: [] },
  { id: 'worlds_greatest', name: 'World\'s Greatest', category: 'mobility', muscles: ['hips', 'thoracic', 'hamstrings'],    equipment: 'bodyweight', modality: ['mobility'],                cue: 'Lunge, plant hand, rotate to open, reach high',                   injury_exclude: [] },
  { id: 'band_pull',     name: 'Band Pull-Apart',    category: 'mobility', muscles: ['rear_delts', 'upper_back'],           equipment: 'bands',      modality: ['mobility'],                cue: 'Straight arms, pull band to chest level, squeeze rear delts',      injury_exclude: [] },
  { id: 'foam_roll',     name: 'Foam Roll',          category: 'mobility', muscles: ['full_body'],                          equipment: 'bodyweight', modality: ['mobility'],                cue: 'Slow passes, pause on tender spots, breathe through it',          injury_exclude: [] },
  { id: 'deep_squat',    name: 'Deep Squat Hold',    category: 'mobility', muscles: ['hips', 'ankles'],                     equipment: 'bodyweight', modality: ['mobility'],                cue: 'Sit deep, elbows push knees out, hold for time',                  injury_exclude: ['knees'] },
]

/* ── Equipment mapping ── */

const EQUIPMENT_MAP = {
  full_gym:   ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bands'],
  home_full:  ['barbell', 'dumbbell', 'bodyweight', 'bands'],
  home_basic: ['dumbbell', 'bodyweight', 'bands'],
  bands:      ['bodyweight', 'bands'],
  bodyweight: ['bodyweight'],
}

/* ── Modality colors (shared with PlanCalendar) ── */

export const MODALITY_COLORS = {
  Hypertrophy: '#FF6E50',
  Strength:    '#60a5fa',
  HIIT:        '#f87171',
  Cardio:      '#4ade80',
  Power:       '#a78bfa',
  Mobility:    '#F59E0B',
  Endurance:   '#34d399',
  Rest:        'rgba(255,255,255,0.06)',
}

/* ── Program phases ── */

export function getProgramPhase(week) {
  const w = Math.max(1, Math.min(week || 1, 12))
  if (w <= 4)  return { name: 'Base',  description: 'Foundation building, moderate intensity', weeks: '1–4' }
  if (w <= 8)  return { name: 'Build', description: 'Progressive overload, increasing volume', weeks: '5–8' }
  return                { name: 'Peak',  description: 'Intensity peaks, taper in final week', weeks: '9–12' }
}

/* ── Modality config ── */

const MODALITY_CONFIG = {
  hypertrophy: { sets: [3, 4], reps: [8, 12], rest: 90,  exerciseCount: 6,  label: 'Hypertrophy',     estimateMins: 50 },
  strength:    { sets: [4, 5], reps: [3, 6],  rest: 180, exerciseCount: 5,  label: 'Strength',        estimateMins: 55 },
  hiit:        { sets: [3, 4], reps: [8, 15], rest: 30,  exerciseCount: 5,  label: 'HIIT',            estimateMins: 30 },
  cardio:      { sets: [1, 1], reps: [1, 1],  rest: 0,   exerciseCount: 2,  label: 'Cardio',          estimateMins: 35 },
  power:       { sets: [4, 5], reps: [3, 5],  rest: 150, exerciseCount: 5,  label: 'Power',           estimateMins: 45 },
  mobility:    { sets: [2, 3], reps: [10, 10],rest: 30,  exerciseCount: 5,  label: 'Mobility',        estimateMins: 20 },
  endurance:   { sets: [3, 4], reps: [12, 20],rest: 45,  exerciseCount: 5,  label: 'Endurance',       estimateMins: 40 },
}

/* ── Goal → modality mapping (derived from goal network) ── */

import { deriveModalities, deriveMealTiming, getGoalsForModality } from '../../context/goalEngine'

/* ── Split templates ── */

const SPLITS = {
  full_body: {
    label: 'Full Body',
    days: (n) => Array.from({ length: n }, (_, i) => ({ focus: 'full', label: `Full Body ${String.fromCharCode(65 + i)}` })),
  },
  upper_lower: {
    label: 'Upper / Lower',
    days: () => [
      { focus: 'upper', label: 'Upper A' },
      { focus: 'lower', label: 'Lower A' },
      { focus: 'upper', label: 'Upper B' },
      { focus: 'lower', label: 'Lower B' },
    ],
  },
  ppl: {
    label: 'Push / Pull / Legs',
    days: () => [
      { focus: 'push',  label: 'Push' },
      { focus: 'pull',  label: 'Pull' },
      { focus: 'legs',  label: 'Legs' },
      { focus: 'push',  label: 'Push B' },
      { focus: 'pull',  label: 'Pull B' },
      { focus: 'legs',  label: 'Legs B' },
    ],
  },
}

const FOCUS_MUSCLES = {
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'rear_delts', 'rotator_cuff', 'upper_back'],
  lower: ['quads', 'hamstrings', 'glutes', 'calves', 'hip_flexors', 'hips'],
  push:  ['chest', 'shoulders', 'triceps'],
  pull:  ['back', 'biceps', 'rear_delts', 'rotator_cuff'],
  legs:  ['quads', 'hamstrings', 'glutes', 'calves', 'hip_flexors'],
  full:  null, // all muscles
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/* ── Deterministic pseudo-random using seed ── */
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

/* ── Program Generator ── */

export function generateProgram({ goals = [], equipment = 'full_gym', availableDays = [], injuries = [], experience = 'intermediate' } = {}) {
  const availableEquipment = EQUIPMENT_MAP[equipment] || EQUIPMENT_MAP.full_gym
  const injurySet = new Set((injuries || []).map(i => i.toLowerCase().replace(/ /g, '_')))
  const dayCount = availableDays.length || 4

  // 1. Determine modalities from goals (derived from goal network edges)
  const modalities = deriveModalities(goals)
  if (modalities.length === 0) modalities.push('hypertrophy') // fallback

  // 2. Pick split based on day count
  const splitType = dayCount <= 3 ? 'full_body' : dayCount <= 4 ? 'upper_lower' : 'ppl'
  const split = SPLITS[splitType]
  const splitDays = split.days(dayCount).slice(0, dayCount)

  // 3. Filter exercises by equipment and injuries
  const pool = EXERCISES.filter(ex => {
    if (!availableEquipment.includes(ex.equipment)) return false
    if (ex.injury_exclude.some(inj => injurySet.has(inj))) return false
    return true
  })

  // 4. Generate each session
  const sessions = []
  const usedDays = availableDays.length > 0 ? availableDays : ALL_DAYS.slice(0, dayCount)

  for (let i = 0; i < splitDays.length; i++) {
    const sd = splitDays[i]
    const day = usedDays[i] || ALL_DAYS[i]
    const modality = modalities[i % modalities.length]
    const config = MODALITY_CONFIG[modality] || MODALITY_CONFIG.hypertrophy
    const focusMuscles = FOCUS_MUSCLES[sd.focus]

    // Filter pool for this session's focus + modality
    let sessionPool = pool.filter(ex => {
      const modalityMatch = ex.modality.includes(modality) || (modality === 'hiit' && ex.category === 'hiit') || (modality === 'cardio' && ex.category === 'cardio') || (modality === 'mobility' && ex.category === 'mobility')
      const muscleMatch = focusMuscles === null || ex.muscles.some(m => focusMuscles.includes(m))
      return modalityMatch && muscleMatch
    })

    // If pool too small, relax modality constraint
    if (sessionPool.length < config.exerciseCount) {
      sessionPool = pool.filter(ex => {
        const muscleMatch = focusMuscles === null || ex.muscles.some(m => focusMuscles.includes(m))
        return muscleMatch
      })
    }

    // Deterministic shuffle + pick exercises
    const shuffled = seededShuffle(sessionPool, i * 31 + day.charCodeAt(0))
    const picked = []
    const usedMuscleGroups = new Set()

    // Prioritize compounds first, then isolation/accessories
    const compounds = shuffled.filter(e => e.category === 'compound' || e.category === 'hiit' || e.category === 'cardio')
    const accessories = shuffled.filter(e => e.category === 'isolation' || e.category === 'core' || e.category === 'mobility')

    const targetCount = Math.min(config.exerciseCount, sessionPool.length)
    for (const ex of [...compounds, ...accessories]) {
      if (picked.length >= targetCount) break
      // Avoid too many exercises hitting the same primary muscle
      const primary = ex.muscles[0]
      const groupCount = [...usedMuscleGroups].filter(m => m === primary).length
      if (groupCount >= 2 && picked.length < targetCount - 1) continue
      picked.push(ex)
      ex.muscles.forEach(m => usedMuscleGroups.add(m))
    }

    // Assign sets/reps/load
    const exercises = picked.map((ex, idx) => {
      const isCompound = ex.category === 'compound'
      const sets = isCompound ? config.sets[1] : config.sets[0]
      const reps = modality === 'cardio' ? 1 : (config.reps[0] + Math.round((config.reps[1] - config.reps[0]) * (idx / Math.max(1, picked.length - 1))))
      const load = modality === 'cardio' || modality === 'mobility' || ex.equipment === 'bodyweight' ? 0 : (isCompound ? estimateLoad(ex, experience) : Math.round(estimateLoad(ex, experience) * 0.4))
      const duration = modality === 'cardio' ? 20 : modality === 'mobility' ? 0 : 0 // minutes for cardio

      return {
        exerciseId: ex.id,
        name: ex.name,
        category: ex.category,
        muscles: ex.muscles,
        cue: ex.cue,
        sets,
        reps,
        load,
        rest: config.rest,
        duration,
      }
    })

    // Add warmup + cooldown for all sessions except pure mobility
    if (modality !== 'mobility') {
      exercises.unshift({
        exerciseId: '_warmup',
        name: 'Warm-up',
        category: 'warmup',
        muscles: [],
        cue: 'Light movement to raise heart rate and prime the joints',
        sets: 1, reps: 1, load: 0, rest: 0, duration: 5,
      })
      exercises.push({
        exerciseId: '_cooldown',
        name: 'Cooldown',
        category: 'cooldown',
        muscles: [],
        cue: 'Light stretching and controlled breathing',
        sets: 1, reps: 1, load: 0, rest: 0, duration: 3,
      })
    }

    // ── Apply exercise grouping based on modality ──
    const coreOnly = exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown')
    const warmup = exercises.filter(e => e.category === 'warmup')
    const cooldown = exercises.filter(e => e.category === 'cooldown')

    let groupedExercises
    if ((modality === 'hypertrophy' || modality === 'strength') && coreOnly.length >= 4) {
      // Pair last 2 isolation exercises as a superset
      const isolations = coreOnly.filter(e => e.category === 'isolation' || e.category === 'core')
      if (isolations.length >= 2) {
        const supersetPair = isolations.slice(-2)
        const rest = coreOnly.filter(e => !supersetPair.includes(e))
        groupedExercises = [
          ...warmup,
          ...rest,
          { groupType: 'superset', label: 'A', items: supersetPair, restAfter: config.rest, rounds: 1 },
          ...cooldown,
        ]
      } else {
        groupedExercises = exercises
      }
    } else if (modality === 'hiit' || modality === 'endurance') {
      // Wrap core exercises in a circuit
      groupedExercises = [
        ...warmup,
        { groupType: 'circuit', label: '1', items: coreOnly, restAfter: 60, rounds: 3 },
        ...cooldown,
      ]
    } else {
      groupedExercises = exercises
    }

    // Track which goals drove this session's modality
    const goalSources = getGoalsForModality(modality, goals)

    sessions.push({
      id: `${day}-${i}`,
      day,
      dayIndex: ALL_DAYS.indexOf(day),
      modality,
      modalityLabel: config.label,
      name: `${sd.label} · ${config.label}`,
      focus: sd.focus,
      exercises: groupedExercises,
      estimatedMins: config.estimateMins,
      mealTiming: deriveMealTiming(modality),
      completed: false,
      goalSources,
    })
  }

  // Fill rest days
  const sessionDaySet = new Set(sessions.map(s => s.day))
  const restDays = ALL_DAYS.filter(d => !sessionDaySet.has(d)).map(d => ({
    day: d,
    dayIndex: ALL_DAYS.indexOf(d),
    isRest: true,
    name: 'Recovery',
    modalityLabel: 'Rest',
    estimatedMins: 0,
  }))

  const allDays = [...sessions, ...restDays].sort((a, b) => a.dayIndex - b.dayIndex)

  const programName = `${split.label} · ${[...new Set(modalities.map(m => MODALITY_CONFIG[m]?.label))].join(' + ')}`

  return {
    splitLabel: split.label,
    modalities,
    sessions,
    schedule: allDays,
    goals,
    programName,
    totalWeeks: 12,
    currentWeek: 1,
    phase: getProgramPhase(1).name,
  }
}

/* ── Load estimation (rough, based on experience) ── */

export function estimateLoad(exercise, experience) {
  const base = {
    back_squat: 80, front_squat: 60, deadlift: 100, bench_press: 60,
    ohp: 40, barbell_row: 60, rdl: 70,
    goblet_squat: 24, db_bench: 28, db_ohp: 18, db_row: 24, db_rdl: 24,
    db_lunge: 20, db_incline: 24,
    bicep_curl: 12, tricep_ext: 10, lateral_raise: 8, face_pull: 15,
    leg_curl: 30, leg_ext: 30, calf_raise: 20,
    kb_swing: 20, med_ball_slam: 8, box_jump: 0, burpees: 0,
  }
  const mult = experience === 'beginner' ? 0.6 : experience === 'advanced' ? 1.3 : 1.0
  return Math.round((base[exercise.id] || 20) * mult)
}

/* ── Helpers ── */

export function getExerciseById(id) {
  return EXERCISES.find(e => e.id === id)
}

export function computeSessionVolume(loggedSets) {
  let total = 0
  for (const ex of loggedSets) {
    for (const set of (ex.logged || [])) {
      total += (set.reps || 0) * (set.load || 0)
    }
  }
  return total
}

export function computeAvgRPE(loggedSets) {
  let sum = 0, count = 0
  for (const ex of loggedSets) {
    for (const set of (ex.logged || [])) {
      if (set.rpe) { sum += set.rpe; count++ }
    }
  }
  return count > 0 ? Math.round(sum / count * 10) / 10 : 0
}

export function countPRs(loggedSets, previousBests = {}) {
  let prs = 0
  for (const ex of loggedSets) {
    const best = previousBests[ex.exerciseId] || 0
    for (const set of (ex.logged || [])) {
      if (set.load > best) { prs++; break }
    }
  }
  return prs
}

export function computeAvgRIR(loggedSets) {
  let sum = 0, count = 0
  for (const ex of loggedSets) {
    for (const set of (ex.logged || [])) {
      if (set.rir != null) { sum += set.rir; count++ }
    }
  }
  return count > 0 ? Math.round(sum / count * 10) / 10 : null
}

/* ── Flatten grouped exercises into a linear array ──
   Each item gets _groupId and _isLastInGroup annotations.
   Screens that don't care about grouping can use this. */
export function flattenSessionExercises(exercises) {
  const flat = []
  let groupCounter = 0
  for (const item of exercises) {
    if (item.groupType) {
      groupCounter++
      const gid = `${item.groupType}-${item.label}-${groupCounter}`
      item.items.forEach((ex, idx) => {
        flat.push({
          ...ex,
          _groupId: gid,
          _groupType: item.groupType,
          _groupLabel: item.label,
          _groupRounds: item.rounds || 1,
          _restAfterGroup: item.restAfter,
          _isLastInGroup: idx === item.items.length - 1,
          _posInGroup: idx,
          _groupSize: item.items.length,
        })
      })
    } else {
      flat.push({ ...item, _groupId: null })
    }
  }
  return flat
}

/* ── Cross-session load recommendation (based on RIR history) ── */
export function deriveLoadRecommendation(history, currentLoad) {
  // Need at least 2 sessions of history
  if (!history || history.length < 2) return null
  const recent = history.slice(-2)
  const avgRir = recent.reduce((s, h) => s + h.rir, 0) / recent.length

  if (avgRir >= 3) {
    // Too easy — suggest increase
    const bump = currentLoad >= 100 ? 5 : currentLoad >= 40 ? 2.5 : 1
    return {
      recommended: currentLoad + bump,
      direction: 'up',
      rationale: `Avg RIR ${avgRir.toFixed(1)} over last 2 sessions — room to push harder`,
    }
  }
  if (avgRir <= 1) {
    // Too hard — suggest decrease
    const drop = currentLoad >= 100 ? 5 : currentLoad >= 40 ? 2.5 : 1
    return {
      recommended: Math.max(0, currentLoad - drop),
      direction: 'down',
      rationale: `Avg RIR ${avgRir.toFixed(1)} over last 2 sessions — dial it back for quality reps`,
    }
  }
  return { recommended: currentLoad, direction: 'maintain', rationale: 'On track' }
}

/* ── RIR-based load suggestion ── */
export function suggestLoadAdjustment(currentLoad, rir) {
  if (rir == null || currentLoad === 0) return null
  if (rir >= 3) {
    // Too easy — suggest +5%
    return Math.round((currentLoad * 1.05) / 2.5) * 2.5
  }
  if (rir === 0) {
    // Too hard — suggest -5%
    return Math.round((currentLoad * 0.95) / 2.5) * 2.5
  }
  return null // RIR 1-2 is the sweet spot
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/* ── Swap candidates — ranked alternatives for an exercise ── */
export function getSwapCandidates(exercise, sessionExercises, userProfile) {
  const { equipment, injuries, goals } = userProfile
  const availableEquip = EQUIPMENT_MAP[equipment] || EQUIPMENT_MAP.full_gym
  const injurySet = new Set((injuries || []).map(i => i.toLowerCase().replace(/ /g, '_')))
  const sessionIds = new Set(sessionExercises.map(e => e.exerciseId || e.id))
  const primaryMuscle = exercise.muscles?.[0]
  const goalMods = goals ? deriveModalities(goals) : []

  return EXERCISES
    .filter(ex => {
      if (ex.id === exercise.id) return false
      if (sessionIds.has(ex.id)) return false
      if (!availableEquip.includes(ex.equipment)) return false
      if (ex.injury_exclude?.some(inj => injurySet.has(inj))) return false
      if (!ex.muscles?.includes(primaryMuscle)) return false
      return true
    })
    .map(ex => {
      let score = 0
      if (ex.category === exercise.category) score += 1
      const modMatch = ex.modality?.filter(m => exercise.modality?.includes(m)).length || 0
      score += modMatch * 3
      const goalMatch = ex.modality?.filter(m => goalMods.includes(m)).length || 0
      score += goalMatch
      return { ...ex, _swapScore: score }
    })
    .sort((a, b) => b._swapScore - a._swapScore)
    .slice(0, 6)
}
