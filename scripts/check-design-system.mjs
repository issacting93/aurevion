#!/usr/bin/env node
/**
 * check-design-system.mjs
 * Comprehensive design system checklist — tokens, components, screens, journey, consistency.
 *
 * Usage: node scripts/check-design-system.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src = resolve(root, 'src')

let pass = 0, fail = 0, warn = 0, skip = 0
const sections = []
let currentSection = null

function section(name) {
  currentSection = { name, items: [] }
  sections.push(currentSection)
  console.log(`\n\x1b[1;36m━━ ${name} ━━\x1b[0m`)
}
function ok(msg)   { pass++; currentSection.items.push({ s: 'pass', msg }); console.log(`  \x1b[32m✓\x1b[0m ${msg}`) }
function er(msg)   { fail++; currentSection.items.push({ s: 'fail', msg }); console.log(`  \x1b[31m✗\x1b[0m ${msg}`) }
function wn(msg)   { warn++; currentSection.items.push({ s: 'warn', msg }); console.log(`  \x1b[33m⚠\x1b[0m ${msg}`) }
function sk(msg)   { skip++; currentSection.items.push({ s: 'skip', msg }); console.log(`  \x1b[90m○\x1b[0m ${msg}`) }

function walk(dir) {
  const files = []
  if (!existsSync(dir)) return files
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(p))
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) files.push(p)
  }
  return files
}

function readSrc(f) { return readFileSync(f, 'utf-8') }
function rel(f) { return f.replace(src + '/', '') }

const screenDir = resolve(src, 'app/screens')
const screenFiles = walk(screenDir).filter(f => !f.endsWith('index.js'))
const toolFiles = walk(resolve(src, 'tools'))
const pageFiles = walk(resolve(src, 'pages'))

// ════════════════════════════════════════════════════════
// A. TOKENS
// ════════════════════════════════════════════════════════
section('A. Tokens')

const tokensFile = resolve(src, 'ui/tokens.js')
const tokens = readSrc(tokensFile)

const requiredTokenGroups = {
  Color: ['bg', 'surface', 'surface2', 'text', 'dim', 'mute', 'faint', 'border', 'borderSoft', 'accent', 'accentHot', 'accentDim', 'accentFaint', 'green', 'red', 'blue', 'purple', 'accentText'],
  Font: ['sans', 'mono'],
  Space: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
  Radius: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
  Shadow: ['sm', 'md', 'lg', 'glow'],
  Duration: ['micro', 'fast', 'normal', 'slow', 'morph'],
  Ease: ['default', 'spring', 'out', 'expo'],
}

const typePresets = ['displayLg', 'displayMd', 'displaySm', 'headingLg', 'headingMd', 'headingSm', 'bodyLg', 'bodyMd', 'bodySm', 'labelLg', 'labelMd', 'labelSm', 'dataLg', 'dataMd', 'dataSm']

for (const [group, keys] of Object.entries(requiredTokenGroups)) {
  const missing = keys.filter(k => !new RegExp(`${k}[:\\s]`).test(tokens))
  if (missing.length === 0) ok(`${group}: all ${keys.length} keys present`)
  else er(`${group}: missing ${missing.join(', ')}`)
}

const typeMissing = typePresets.filter(k => !tokens.includes(k))
if (typeMissing.length === 0) ok(`Type: all ${typePresets.length} presets present`)
else er(`Type: missing ${typeMissing.join(', ')}`)

// ════════════════════════════════════════════════════════
// B. COMPONENTS
// ════════════════════════════════════════════════════════
section('B. Components')

const compFile = resolve(src, 'ui/components.jsx')
const comp = readSrc(compFile)

const requiredComponents = [
  'ICONS', 'FIcon', 'FBtn', 'FLabel', 'FMono', 'FNum', 'FTag', 'FCheckbox',
  'FSurface', 'FSection', 'FListRow', 'FNavBar', 'Phone',
  'FButtonGroup', 'FToolbar', 'FTabBar',
  'FTexBar', 'FScale', 'FRing', 'FAvatar',
  'FStagger', 'ErrorBoundary',
]

const deadComponents = ['FAlertCard', 'FJewel', 'FPulseBtn', 'FIconBtn', 'FStepDots', 'FSegBar', 'FStatGrid', 'F ', 'FF ']

for (const c of requiredComponents) {
  if (new RegExp(`export (function|class|const) ${c}\\b`).test(comp)) ok(`${c} exported`)
  else er(`${c} NOT exported`)
}

for (const c of deadComponents) {
  const name = c.trim()
  if (new RegExp(`export (function|class|const) ${name}\\b`).test(comp)) er(`${name} still exported (should be removed)`)
  else ok(`${name} removed`)
}

// Check ICONS — no dead entries
// Parse icon keys from the ICONS object block only (between `ICONS = {` and the closing `}`)
const iconsBlock = comp.match(/ICONS\s*=\s*\{([\s\S]*?)\n\}/)?.[1] || ''
const iconKeys = (iconsBlock.match(/^\s+(\w+):\s*'/gm) || []).map(m => m.trim().split(':')[0])
for (const icon of iconKeys) {
  let used = false
  for (const f of [...screenFiles, ...toolFiles, ...pageFiles]) {
    const content = readSrc(f)
    if (new RegExp(`ICONS\\.${icon}\\b`).test(content)) { used = true; break }
  }
  if (!used) wn(`ICONS.${icon} defined but never used`)
}

// ════════════════════════════════════════════════════════
// C. CHARTS & MOTION
// ════════════════════════════════════════════════════════
section('C. Charts & Motion')

const chartFile = resolve(src, 'ui/chart.jsx')
if (existsSync(chartFile)) {
  const charts = ['LineChart', 'BarChart', 'GaugeChart', 'LollipopChart', 'WaveformChart', 'Sparkline', 'AreaChart']
  const chartContent = readSrc(chartFile)
  for (const c of charts) {
    if (chartContent.includes(`function ${c}(`)) ok(`Chart: ${c}`)
    else er(`Chart: ${c} missing`)
  }
} else er('ui/chart.jsx not found')

const motionFile = resolve(src, 'ui/motion.js')
if (existsSync(motionFile)) {
  const motionExports = ['useSpring', 'useScrollReveal', 'useTransitionLock', 'useStaggerEntrance', 'usePageTransition', 'MotionGroup', 'MotionEase', 'MotionDuration', 'SpringPreset']
  const motionContent = readSrc(motionFile)
  const motionMissing = motionExports.filter(e => !motionContent.includes(e))
  if (motionMissing.length === 0) ok(`Motion: all ${motionExports.length} exports present`)
  else er(`Motion: missing ${motionMissing.join(', ')}`)
} else er('ui/motion.js not found')

// ════════════════════════════════════════════════════════
// D. SCREEN REGISTRY
// ════════════════════════════════════════════════════════
section('D. Screen Registry')

const registryFile = resolve(src, 'app/screens/index.js')
const registry = readSrc(registryFile)
const registryIds = []
let m
const idRe = /id:\s*'([^']+)'/g
while ((m = idRe.exec(registry)) !== null) registryIds.push(m[1])

const requiredScreens = {
  'Dashboard': ['dash-bal', 'dash-nut', 'dash-trn'],
  'Welcome': ['welcome'],
  'Goal Setting': ['goal-a', 'goal-b'],
  'TDEE Model': ['tdee-a', 'tdee-b'],
  'Plan': ['plan-m', 'plan-w', 'plan-d'],
  'Training': ['train-a', 'train-sum'],
  'Macros': ['macro-a', 'macro-b', 'batch-a', 'macro-c'],
  'Fridge': ['fridge-a'],
  'Meal Prep': ['prep-a', 'morph', 'prep-b', 'prep-c', 'cook-sum'],
  'Profile': ['profile'],
  'Feedback': ['checkin', 'food-log', 'water'],
  'Analytics': ['macro-heat'],
}

let totalExpected = 0
for (const [feature, ids] of Object.entries(requiredScreens)) {
  const missing = ids.filter(id => !registryIds.includes(id))
  totalExpected += ids.length
  if (missing.length === 0) ok(`${feature}: ${ids.length} screens registered`)
  else er(`${feature}: missing ${missing.join(', ')}`)
}

if (registryIds.length === totalExpected) ok(`Registry count: ${registryIds.length} (exact match)`)
else wn(`Registry count: ${registryIds.length} (expected ${totalExpected})`)

// Check each screen file exists
for (const f of screenFiles) {
  const name = basename(f)
  if (name === 'DevMode.jsx') { sk(`${name} (dev tool, excluded)`); continue }
  ok(`${name} exists`)
}

// ════════════════════════════════════════════════════════
// E. USER JOURNEY (SODA LOOP)
// ════════════════════════════════════════════════════════
section('E. User Journey')

const journeyFile = resolve(src, 'tools/UserJourney.jsx')
const journey = readSrc(journeyFile)

// Phase structure
const phaseOrder = ['SEED', 'DECIDE', 'PLAN', 'ACT', 'OBSERVE']
const phaseRe = /phase:\s*'(\d+)\s*(?:·|\\u00b7)\s*(\w+)'/g
const foundPhases = []
while ((m = phaseRe.exec(journey)) !== null) foundPhases.push({ num: m[1], name: m[2] })

for (let i = 0; i < phaseOrder.length; i++) {
  if (foundPhases[i]?.name === phaseOrder[i]) ok(`Phase ${i + 1}: ${phaseOrder[i]}`)
  else er(`Phase ${i + 1}: expected ${phaseOrder[i]}, got ${foundPhases[i]?.name || 'MISSING'}`)
}

// Journey ↔ registry coverage
const journeyScreenIds = []
const sbiRe = /screenById\('([^']+)'\)/g
while ((m = sbiRe.exec(journey)) !== null) journeyScreenIds.push(m[1])

const orphanedScreens = registryIds.filter(id => !journeyScreenIds.includes(id) && id !== 'welcome')
if (orphanedScreens.length === 0) ok('All registry screens mapped in journey')
else er(`Orphaned screens: ${orphanedScreens.join(', ')}`)

// Onboarding steps
const obExports = (readSrc(resolve(screenDir, 'Onboarding.jsx')).match(/export function (OB_\w+)/g) || []).map(m => m.replace('export function ', ''))
const obInJourney = obExports.filter(name => journey.includes(name))
if (obInJourney.length === obExports.length) ok(`All ${obExports.length} onboarding steps in SEED phase`)
else er(`${obExports.length - obInJourney.length} onboarding steps missing from SEED`)

// Data models
const requiredModels = ['user_state', 'user_constraints', 'user_goal']
for (const model of requiredModels) {
  if (journey.includes(model)) ok(`Data model: ${model}`)
  else er(`Data model: ${model} missing`)
}

// Goal taxonomy
const requiredGoals = ['Hypertrophy', 'Fat Loss', 'Recomposition', 'Max Strength', 'Cardio Endurance', 'Power', 'Agility', 'Flexibility', 'Balance', 'Overall Wellness', 'Healthier Meals', 'Cook More', 'Improve Digestion', 'Drink Water', 'Save Money']
const missingGoals = requiredGoals.filter(g => !journey.includes(g))
if (missingGoals.length === 0) ok(`Goal taxonomy: all ${requiredGoals.length} goals`)
else er(`Goal taxonomy: missing ${missingGoals.join(', ')}`)

// Loop-back arrow
if (journey.includes('FEEDBACK LOOP') || journey.includes('Loop-back')) ok('SODA loop-back arrow present')
else er('SODA loop-back arrow missing')

// SVG diagrams
const svgDiagrams = ['SODALoop', 'DataModelDiagram', 'GoalTaxonomyDiagram', 'ActObserveDiagram']
for (const d of svgDiagrams) {
  if (journey.includes(`function ${d}`)) ok(`SVG diagram: ${d}`)
  else er(`SVG diagram: ${d} missing`)
}

// ════════════════════════════════════════════════════════
// F. TOKEN ADOPTION (SCREENS)
// ════════════════════════════════════════════════════════
section('F. Token Adoption')

const tokenNames = ['Color', 'Font', 'Space', 'Radius', 'Type']

for (const f of screenFiles) {
  const name = basename(f)
  if (name === 'DevMode.jsx' || name === 'index.js') continue
  const content = readSrc(f)
  const importLine = content.split('\n').find(l => l.includes('tokens')) || ''
  const imported = tokenNames.filter(t => new RegExp(`\\b${t}\\b`).test(importLine))
  const missing = []

  // Only flag missing tokens if the file has inline styles that need them
  if (!imported.includes('Color') && /Color\./.test(content) === false && /color:\s/.test(content)) missing.push('Color')
  if (!imported.includes('Space') && /gap:\s*\d+[,\s}]/.test(content)) missing.push('Space')
  if (!imported.includes('Radius') && /borderRadius:\s*\d/.test(content)) missing.push('Radius')

  if (missing.length > 0) er(`${name}: missing ${missing.join(', ')} import`)
}

// Hardcoded values audit
let hardcodedHex = 0, hardcodedRadius = 0, hardcodedGap = 0
for (const f of screenFiles) {
  if (basename(f) === 'DevMode.jsx') continue
  const content = readSrc(f)
  for (const line of content.split('\n')) {
    if (/fill=/.test(line)) continue
    hardcodedHex += (line.match(/'#[0-9a-fA-F]{6}'|"#[0-9a-fA-F]{6}"/g) || []).length
  }
  const radii = content.match(/borderRadius:\s*(4|8|12|16|20)\b/g) || []
  hardcodedRadius += radii.length
  const gaps = content.match(/gap:\s*(4|8|12|16|20|24)\b/g) || []
  hardcodedGap += gaps.length
}

if (hardcodedHex === 0) ok('No hardcoded hex colors in screens')
else er(`${hardcodedHex} hardcoded hex colors`)
if (hardcodedRadius === 0) ok('No tokenizable borderRadius values')
else er(`${hardcodedRadius} borderRadius should use Radius tokens`)
if (hardcodedGap === 0) ok('No tokenizable gap values')
else er(`${hardcodedGap} gap values should use Space tokens`)

// Type adoption
let typeCount = 0, fontSizeCount = 0
for (const f of screenFiles) {
  if (basename(f) === 'DevMode.jsx') continue
  const content = readSrc(f)
  typeCount += (content.match(/Type\.\w+/g) || []).length
  fontSizeCount += (content.match(/fontSize:\s*\d+/g) || []).length
}
const typePct = Math.round(typeCount / (typeCount + fontSizeCount) * 100)
if (typePct >= 50) ok(`Type scale: ${typePct}% adoption (${typeCount} Type / ${fontSizeCount} hardcoded)`)
else if (typePct >= 25) wn(`Type scale: ${typePct}% adoption (${typeCount} Type / ${fontSizeCount} hardcoded)`)
else er(`Type scale: ${typePct}% adoption (${typeCount} Type / ${fontSizeCount} hardcoded)`)

// Dead imports
let deadCount = 0
for (const f of screenFiles) {
  const content = readSrc(f)
  const importLine = content.split('\n').find(l => l.includes('components'))
  if (!importLine) continue
  for (const name of requiredComponents) {
    if (!new RegExp(`\\b${name}\\b`).test(importLine)) continue
    const after = content.slice(content.indexOf(importLine) + importLine.length)
    if (!new RegExp(`\\b${name}\\b`).test(after)) { deadCount++; wn(`${basename(f)}: dead import ${name}`) }
  }
}
if (deadCount === 0) ok('No dead imports')

// ════════════════════════════════════════════════════════
// G. ROUTES & NAVIGATION
// ════════════════════════════════════════════════════════
section('G. Routes & Navigation')

const appFile = resolve(src, 'App.jsx')
const app = readSrc(appFile)

const requiredRoutes = ['/', '/app', '/landing', '/library', '/demo', '/journey']
for (const route of requiredRoutes) {
  if (app.includes(`path="${route}"`)) ok(`Route: ${route}`)
  else er(`Route: ${route} missing`)
}

// Shell tabs
const shellFile = resolve(src, 'app/Shell.jsx')
if (existsSync(shellFile)) {
  const shell = readSrc(shellFile)
  const tabs = ['home', 'train', 'eat', 'plan', 'you']
  for (const tab of tabs) {
    if (shell.includes(`'${tab}'`) || shell.includes(`"${tab}"`)) ok(`Tab: ${tab}`)
    else er(`Tab: ${tab} missing`)
  }
} else er('Shell.jsx not found')

// Context providers
const contexts = ['UserProvider', 'DemoProvider']
for (const ctx of contexts) {
  if (app.includes(ctx)) ok(`Provider: ${ctx}`)
  else er(`Provider: ${ctx} missing`)
}

// ════════════════════════════════════════════════════════
// H. PARALLEL SYSTEMS
// ════════════════════════════════════════════════════════
section('H. Parallel Systems')

// No screen should import from primitives or domain
for (const f of screenFiles) {
  const content = readSrc(f)
  const name = basename(f)
  if (/from.*primitives/.test(content)) er(`${name} imports from primitives (parallel system)`)
  if (/from.*domain/.test(content)) er(`${name} imports from domain (parallel system)`)
}
ok('No screens import from parallel systems')

// Check tools files for mixed systems
for (const f of toolFiles) {
  const content = readSrc(f)
  const name = basename(f)
  const sources = []
  if (/from.*ui\/components/.test(content)) sources.push('components')
  if (/from.*primitives/.test(content)) sources.push('primitives')
  if (/from.*domain/.test(content)) sources.push('domain')
  if (sources.length > 1 && sources.includes('primitives')) {
    wn(`${name}: mixes ${sources.join(' + ')}`)
  }
}

// Duplicate helpers
const helpers = [
  { re: /const merge\s*=/, name: 'merge()' },
  { re: /function PhoneScaler/, name: 'PhoneScaler()' },
]
for (const h of helpers) {
  const found = [...screenFiles, ...toolFiles, ...pageFiles].filter(f => h.re.test(readSrc(f))).map(f => basename(f))
  if (found.length > 1) wn(`${h.name} duplicated in: ${found.join(', ')}`)
  else if (found.length === 1) ok(`${h.name}: single definition`)
}

// ════════════════════════════════════════════════════════
// I. FILE EXISTENCE
// ════════════════════════════════════════════════════════
section('I. File Structure')

const requiredFiles = [
  'ui/tokens.js', 'ui/components.jsx', 'ui/chart.jsx', 'ui/motion.js', 'ui/icons.jsx',
  'app/Shell.jsx', 'app/screens/index.js',
  'context/UserContext.jsx', 'context/NavigationContext.jsx', 'context/DemoContext.jsx',
  'App.jsx', 'main.jsx', 'index.css',
  'tools/UserJourney.jsx',
]

for (const f of requiredFiles) {
  if (existsSync(resolve(src, f))) ok(f)
  else er(`${f} NOT FOUND`)
}

// Scripts
const requiredScripts = ['scripts/check-userflow.mjs', 'scripts/check-consistency.mjs', 'scripts/check-design-system.mjs']
for (const s of requiredScripts) {
  if (existsSync(resolve(root, s))) ok(s)
  else er(`${s} NOT FOUND`)
}

// ════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════
console.log('\n\x1b[1;36m━━ SUMMARY ━━\x1b[0m\n')

for (const s of sections) {
  const p = s.items.filter(i => i.s === 'pass').length
  const f = s.items.filter(i => i.s === 'fail').length
  const w = s.items.filter(i => i.s === 'warn').length
  const indicator = f > 0 ? '\x1b[31m✗' : w > 0 ? '\x1b[33m~' : '\x1b[32m✓'
  console.log(`  ${indicator}\x1b[0m ${s.name}: ${p} pass${f > 0 ? `, ${f} fail` : ''}${w > 0 ? `, ${w} warn` : ''}`)
}

console.log(`\n${'═'.repeat(55)}`)
console.log(`\x1b[1mDesign System Check:\x1b[0m  \x1b[32m${pass} pass\x1b[0m  \x1b[31m${fail} fail\x1b[0m  \x1b[33m${warn} warn\x1b[0m  \x1b[90m${skip} skip\x1b[0m`)
console.log('═'.repeat(55) + '\n')

process.exit(fail > 0 ? 1 : 0)
