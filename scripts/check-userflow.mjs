#!/usr/bin/env node
/**
 * check-userflow.mjs
 * Validates UserJourney PHASES against the screen registry and Onboarding exports.
 *
 * Checks:
 *  1. Every screenById() call in PHASES resolves to a real SCREENS entry
 *  2. Every SCREENS entry is referenced by at least one PHASES phase
 *  3. Every OB_ export from Onboarding.jsx is used in the SEED phase
 *  4. Data model fields match the design notes PDF
 *  5. Goal taxonomy completeness
 *  6. Phase ordering makes sense (SEED before DECIDE, etc.)
 *
 * Usage: node scripts/check-userflow.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const journeyFile = readFileSync(resolve(root, 'src/tools/UserJourney.jsx'), 'utf-8')
const registryFile = readFileSync(resolve(root, 'src/app/screens/index.js'), 'utf-8')
const onboardingFile = readFileSync(resolve(root, 'src/app/screens/Onboarding.jsx'), 'utf-8')

let pass = 0, fail = 0, warn = 0

function ok(msg) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${msg}`) }
function er(msg) { fail++; console.log(`  \x1b[31m✗\x1b[0m ${msg}`) }
function wn(msg) { warn++; console.log(`  \x1b[33m⚠\x1b[0m ${msg}`) }

// ─────────────────────────────────────────────────────
// 1. Parse screen IDs from registry (index.js)
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m1. Screen Registry\x1b[0m')

const registryIds = []
const idRe = /id:\s*'([^']+)'/g
let m
while ((m = idRe.exec(registryFile)) !== null) registryIds.push(m[1])

console.log(`   Found ${registryIds.length} screens in registry`)

// ─────────────────────────────────────────────────────
// 2. Parse screenById() calls from PHASES in UserJourney
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m2. Journey → Registry mapping\x1b[0m')

const journeyIds = []
const sbiRe = /screenById\('([^']+)'\)/g
while ((m = sbiRe.exec(journeyFile)) !== null) journeyIds.push(m[1])

// Check every journey ref resolves
for (const id of journeyIds) {
  if (registryIds.includes(id)) {
    ok(`screenById('${id}') → found in registry`)
  } else {
    er(`screenById('${id}') → NOT FOUND in registry`)
  }
}

// Check every registry screen is referenced
console.log('\n\x1b[1m3. Registry → Journey coverage\x1b[0m')

for (const id of registryIds) {
  if (journeyIds.includes(id)) {
    ok(`${id} → mapped in journey`)
  } else {
    // welcome is handled via onboarding, not screenById
    if (id === 'welcome') {
      ok(`${id} → covered by Onboarding SEED phase (OB_Welcome)`)
    } else {
      er(`${id} → ORPHANED — not in any journey phase`)
    }
  }
}

// ─────────────────────────────────────────────────────
// 4. Parse OB_ exports from Onboarding.jsx
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m4. Onboarding exports → SEED phase\x1b[0m')

const obExports = []
const obRe = /export function (OB_\w+)/g
while ((m = obRe.exec(onboardingFile)) !== null) obExports.push(m[1])

console.log(`   Found ${obExports.length} OB_ exports`)

// Check each OB_ export is imported and used in UserJourney
for (const name of obExports) {
  if (journeyFile.includes(name)) {
    ok(`${name} → used in journey`)
  } else {
    er(`${name} → MISSING from journey SEED phase`)
  }
}

// ─────────────────────────────────────────────────────
// 5. Phase structure checks
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m5. Phase structure\x1b[0m')

const phaseOrder = ['SEED', 'DECIDE', 'PLAN', 'ACT', 'OBSERVE']
const phaseRe = /phase:\s*'(\d+)\s*(?:·|\\u00b7)\s*(\w+)'/g
const foundPhases = []
while ((m = phaseRe.exec(journeyFile)) !== null) {
  foundPhases.push({ num: m[1], name: m[2] })
}

if (foundPhases.length === phaseOrder.length) {
  ok(`${foundPhases.length} phases defined`)
} else {
  er(`Expected ${phaseOrder.length} phases, found ${foundPhases.length}`)
}

for (let i = 0; i < phaseOrder.length; i++) {
  if (foundPhases[i]?.name === phaseOrder[i]) {
    ok(`Phase ${i + 1}: ${phaseOrder[i]} in correct position`)
  } else {
    er(`Phase ${i + 1}: expected ${phaseOrder[i]}, got ${foundPhases[i]?.name || 'MISSING'}`)
  }
}

// Check numbering is sequential
for (let i = 0; i < foundPhases.length; i++) {
  const expected = String(i + 1).padStart(2, '0')
  if (foundPhases[i].num === expected) {
    ok(`Phase numbering: ${foundPhases[i].num} correct`)
  } else {
    er(`Phase numbering: expected ${expected}, got ${foundPhases[i].num}`)
  }
}

// ─────────────────────────────────────────────────────
// 6. Data model completeness (against PDF spec)
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m6. Data model fields (vs design notes)\x1b[0m')

const pdfSpec = {
  user_state: ['body', 'performance', 'recovery', 'behavioral', 'wearables'],
  user_constraints: ['dietary', 'training'],
  user_goal: ['domain', 'type', 'target', 'meta'],
}

for (const [model, expectedFields] of Object.entries(pdfSpec)) {
  // Extract field keys from the DATA_MODELS block
  const modelBlock = journeyFile.match(new RegExp(`${model}:\\s*\\{[\\s\\S]*?fields:\\s*\\[([\\s\\S]*?)\\]`, 'm'))
  if (!modelBlock) {
    er(`${model} — not found in DATA_MODELS`)
    continue
  }
  const fieldKeys = []
  const fkRe = /k:\s*'([^']+)'/g
  let fm
  while ((fm = fkRe.exec(modelBlock[1])) !== null) fieldKeys.push(fm[1])

  for (const f of expectedFields) {
    if (fieldKeys.includes(f)) {
      ok(`${model}.${f} present`)
    } else {
      er(`${model}.${f} MISSING`)
    }
  }
  for (const f of fieldKeys) {
    if (!expectedFields.includes(f)) {
      wn(`${model}.${f} — extra field not in PDF spec`)
    }
  }
}

// ─────────────────────────────────────────────────────
// 7. Goal taxonomy completeness
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m7. Goal taxonomy\x1b[0m')

const pdfFitnessGoals = [
  'Hypertrophy', 'Fat Loss', 'Recomposition',
  'Max Strength', 'Cardio Endurance', 'Power', 'Agility',
  'Flexibility', 'Balance', 'Overall Wellness',
]
const pdfNutritionGoals = [
  'Healthier Meals', 'Cook More', 'Improve Digestion', 'Drink Water', 'Save Money',
]

for (const g of pdfFitnessGoals) {
  if (journeyFile.includes(`'${g}'`)) {
    ok(`Fitness: ${g}`)
  } else {
    er(`Fitness: ${g} MISSING`)
  }
}
for (const g of pdfNutritionGoals) {
  if (journeyFile.includes(`'${g}'`)) {
    ok(`Nutrition: ${g}`)
  } else {
    er(`Nutrition: ${g} MISSING`)
  }
}

// ─────────────────────────────────────────────────────
// 8. SODA loop diagram nodes match phases
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m8. SODA loop diagram nodes\x1b[0m')

const sodaRe = /label:\s*'(SEED|DECIDE|PLAN|ACT|OBSERVE)',\s*sub:\s*'([^']+)'/g
const sodaNodes = []
while ((m = sodaRe.exec(journeyFile)) !== null) sodaNodes.push({ label: m[1], sub: m[2] })

if (sodaNodes.length === 5) {
  ok('5 SODA nodes in diagram')
} else {
  er(`Expected 5 SODA nodes, found ${sodaNodes.length}`)
}

for (const n of sodaNodes) {
  ok(`SODA node: ${n.label} (${n.sub})`)
}

// Check loop-back arrow exists (OBSERVE → DECIDE)
if (journeyFile.includes('FEEDBACK LOOP') || journeyFile.includes('Loop-back')) {
  ok('Loop-back arrow present (OBSERVE → DECIDE)')
} else {
  er('Loop-back arrow MISSING')
}

// ─────────────────────────────────────────────────────
// 9. Intervention & observation channels
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m9. Act/Observe pipeline\x1b[0m')

const pdfInterventions = ['Training', 'Nutrition', 'Notification']
const pdfObservations = ['Scale', 'CV', 'Workout', 'User State']

for (const i of pdfInterventions) {
  const found = journeyFile.match(new RegExp(`INTERVENTIONS[\\s\\S]*?label:\\s*'${i}'`))
  if (found) {
    ok(`Intervention: ${i}`)
  } else {
    er(`Intervention: ${i} MISSING`)
  }
}

for (const o of pdfObservations) {
  const found = journeyFile.match(new RegExp(`OBSERVATION_CHANNELS[\\s\\S]*?label:\\s*'${o}'`))
  if (found) {
    ok(`Observation: ${o}`)
  } else {
    er(`Observation: ${o} MISSING`)
  }
}

// ─────────────────────────────────────────────────────
// 10. Cross-check: screen files exist on disk
// ─────────────────────────────────────────────────────
console.log('\n\x1b[1m10. Screen file existence\x1b[0m')

import { existsSync } from 'fs'

const screenFiles = [
  'Welcome.jsx', 'GoalSetting.jsx', 'TDEE.jsx', 'Macros.jsx',
  'Fridge.jsx', 'MealPrep.jsx', 'PlanCalendar.jsx', 'Training.jsx',
  'WorkoutSummary.jsx', 'Profile.jsx', 'CheckInScreen.jsx', 'CheckIn.jsx',
  'FeatureCardMorph.jsx', 'BatchPrep.jsx', 'CookSummary.jsx',
  'Dashboard.jsx', 'MacroHeatmap.jsx', 'FoodLog.jsx', 'WaterTracking.jsx',
  'Onboarding.jsx', 'tiles.jsx',
]

for (const f of screenFiles) {
  const path = resolve(root, 'src/app/screens', f)
  if (existsSync(path)) {
    ok(`${f} exists`)
  } else {
    er(`${f} NOT FOUND on disk`)
  }
}

// ─────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50))
console.log(`\x1b[1mResults:\x1b[0m  \x1b[32m${pass} pass\x1b[0m  \x1b[31m${fail} fail\x1b[0m  \x1b[33m${warn} warn\x1b[0m`)
console.log('─'.repeat(50) + '\n')

process.exit(fail > 0 ? 1 : 0)
