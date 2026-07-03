#!/usr/bin/env node
/**
 * check-consistency.mjs
 * Audits design consistency across all routes, component libraries, and screens.
 *
 * Checks:
 *  1. Parallel component systems (ui/components vs tools/primitives vs tools/domain)
 *  2. Token adoption per file (Color, Font, Space, Radius, Duration, Ease, Type)
 *  3. Hardcoded colors that should be tokens
 *  4. Hardcoded borderRadius / gap / fontSize not using tokens
 *  5. Dead imports (imported but not used in JSX)
 *  6. Screen consistency (same screen rendered the same across /demo, /journey, /app)
 *  7. Duplicate inline helpers (local Mono, merge, etc.)
 *  8. Hardcoded font families
 *
 * Usage: node scripts/check-consistency.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src = resolve(root, 'src')

let pass = 0, fail = 0, warn = 0
function ok(msg) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${msg}`) }
function er(msg) { fail++; console.log(`  \x1b[31m✗\x1b[0m ${msg}`) }
function wn(msg) { warn++; console.log(`  \x1b[33m⚠\x1b[0m ${msg}`) }

// Collect all JSX/JS source files
function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(p))
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) files.push(p)
  }
  return files
}

const allFiles = walk(src)
const screenFiles = allFiles.filter(f => f.includes('/app/screens/') && !f.includes('index.js'))
const toolFiles = allFiles.filter(f => f.includes('/tools/'))
const pageFiles = allFiles.filter(f => f.includes('/pages/'))
const allSrcFiles = [...screenFiles, ...toolFiles, ...pageFiles]

function relPath(f) { return f.replace(src + '/', '') }
function readSrc(f) { return readFileSync(f, 'utf-8') }

// ═══════════════════════════════════════════════════════
// 1. PARALLEL COMPONENT SYSTEMS
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m1. Parallel component systems\x1b[0m')

const componentSources = {
  'ui/components': /from\s+['"](?:\.\.\/)*ui\/components['"]/,
  'tools/primitives': /from\s+['"](?:\.\.\/)*(?:\.\/)?primitives['"]/,
  'tools/domain': /from\s+['"](?:\.\.\/)*(?:\.\/)?domain['"]/,
  'ui/chart': /from\s+['"](?:\.\.\/)*ui\/chart['"]/,
}

const systemUsage = {}
for (const f of allSrcFiles) {
  const content = readSrc(f)
  const rel = relPath(f)
  const sources = []
  for (const [name, re] of Object.entries(componentSources)) {
    if (re.test(content)) sources.push(name)
  }
  if (sources.length > 0) systemUsage[rel] = sources
}

// Flag files using multiple component systems
for (const [file, sources] of Object.entries(systemUsage)) {
  if (sources.length > 1 && sources.includes('tools/primitives')) {
    wn(`${file} mixes: ${sources.join(' + ')} — primitives is a parallel system to ui/components`)
  } else if (sources.length === 1 && sources[0] === 'ui/components') {
    ok(`${file} → ui/components only`)
  }
}

// Count files using primitives
const primitivesUsers = Object.entries(systemUsage).filter(([, s]) => s.includes('tools/primitives'))
if (primitivesUsers.length === 0) {
  ok('tools/primitives not imported by any file')
} else {
  for (const [f] of primitivesUsers) {
    wn(`${f} imports tools/primitives (parallel component system)`)
  }
}

// Count files using domain
const domainUsers = Object.entries(systemUsage).filter(([, s]) => s.includes('tools/domain'))
if (domainUsers.length === 0) {
  ok('tools/domain not imported by any file')
} else {
  for (const [f] of domainUsers) {
    wn(`${f} imports tools/domain (extra component layer)`)
  }
}

// ═══════════════════════════════════════════════════════
// 2. TOKEN ADOPTION PER FILE
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m2. Token adoption\x1b[0m')

const tokens = ['Color', 'Font', 'Space', 'Radius', 'Duration', 'Ease', 'Type']
const tokenResults = []

for (const f of screenFiles) {
  const content = readSrc(f)
  const rel = relPath(f)
  const imported = tokens.filter(t => new RegExp(`\\b${t}\\b`).test(content.split('\n').find(l => l.includes('from') && l.includes('tokens')) || ''))
  const missing = []

  // Check if file NEEDS tokens it doesn't import
  if (!imported.includes('Space') && /gap:\s*\d|margin|padding/.test(content)) missing.push('Space')
  if (!imported.includes('Radius') && /borderRadius:\s*\d/.test(content)) missing.push('Radius')
  if (!imported.includes('Type') && /fontSize:\s*\d/.test(content)) missing.push('Type')
  if (!imported.includes('Duration') && /transition:/.test(content) && !/Duration/.test(content)) missing.push('Duration')

  tokenResults.push({ file: rel, imported, missing })
}

// Report
for (const r of tokenResults) {
  const score = r.imported.length
  const indicator = score >= 5 ? '\x1b[32m' : score >= 3 ? '\x1b[33m' : '\x1b[31m'
  const needs = r.missing.length > 0 ? ` — needs: ${r.missing.join(', ')}` : ''
  if (r.missing.length > 0) {
    wn(`${r.file}: imports ${indicator}${r.imported.join(', ')}\x1b[0m${needs}`)
  }
}

// Summary
const avgTokens = tokenResults.reduce((s, r) => s + r.imported.length, 0) / tokenResults.length
ok(`Average token imports per screen: ${avgTokens.toFixed(1)} / ${tokens.length}`)

// ═══════════════════════════════════════════════════════
// 3. HARDCODED COLORS
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m3. Hardcoded colors in screens\x1b[0m')

let totalHardcodedColors = 0
for (const f of screenFiles) {
  if (basename(f) === 'DevMode.jsx') continue
  const content = readSrc(f)
  const rel = relPath(f)
  let fileCount = 0
  // Match hex colors in style props, skip SVG fill attributes (artwork, not UI)
  for (const line of content.split('\n')) {
    if (/fill=/.test(line)) continue // SVG artwork
    const matches = line.match(/'#[0-9a-fA-F]{6}'|"#[0-9a-fA-F]{6}"/g) || []
    fileCount += matches.length
  }
  if (fileCount > 0) {
    wn(`${rel}: ${fileCount} hardcoded hex colors`)
    totalHardcodedColors += fileCount
  }
}
if (totalHardcodedColors === 0) {
  ok('No hardcoded hex colors in screen files')
} else {
  er(`${totalHardcodedColors} total hardcoded hex colors across screens`)
}

// ═══════════════════════════════════════════════════════
// 4. HARDCODED VALUES (borderRadius, gap, fontSize)
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m4. Hardcoded layout values in screens\x1b[0m')

const layoutChecks = [
  { re: /borderRadius:\s*(\d+)/g, name: 'borderRadius', tokenizable: [4, 8, 12, 16, 20] },
  { re: /gap:\s*(\d+)/g, name: 'gap', tokenizable: [4, 8, 12, 16, 20, 24] },
]

for (const check of layoutChecks) {
  let violations = 0
  const violationFiles = []
  for (const f of screenFiles) {
    if (basename(f) === 'DevMode.jsx') continue
    const content = readSrc(f)
    const rel = relPath(f)
    let m
    const re = new RegExp(check.re.source, 'g')
    let fileViolations = 0
    while ((m = re.exec(content)) !== null) {
      const val = parseInt(m[1])
      if (check.tokenizable.includes(val)) {
        fileViolations++
      }
    }
    if (fileViolations > 0) {
      violations += fileViolations
      violationFiles.push(`${rel} (${fileViolations})`)
    }
  }
  if (violations === 0) {
    ok(`No tokenizable hardcoded ${check.name} values`)
  } else {
    er(`${violations} hardcoded ${check.name} values should use tokens: ${violationFiles.join(', ')}`)
  }
}

// fontSize check — count hardcoded font sizes vs Type usage
let hardcodedFontSizes = 0
let typeUsages = 0
for (const f of screenFiles) {
  if (basename(f) === 'DevMode.jsx') continue
  const content = readSrc(f)
  const fsMatches = content.match(/fontSize:\s*\d+/g) || []
  hardcodedFontSizes += fsMatches.length
  const typeMatches = content.match(/Type\.\w+/g) || []
  typeUsages += typeMatches.length
}
const fsPct = typeUsages > 0 ? Math.round(typeUsages / (typeUsages + hardcodedFontSizes) * 100) : 0
if (fsPct > 80) {
  ok(`Type scale adoption: ${fsPct}% (${typeUsages} Type vs ${hardcodedFontSizes} hardcoded)`)
} else if (fsPct > 40) {
  wn(`Type scale adoption: ${fsPct}% (${typeUsages} Type vs ${hardcodedFontSizes} hardcoded)`)
} else {
  er(`Type scale adoption: ${fsPct}% (${typeUsages} Type vs ${hardcodedFontSizes} hardcoded)`)
}

// ═══════════════════════════════════════════════════════
// 5. HARDCODED FONT FAMILIES
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m5. Hardcoded font families\x1b[0m')

const fontFamilyRe = /fontFamily:\s*['"](Geist|Geist Mono|monospace|sans-serif)['"]/g
let hardcodedFonts = 0
for (const f of allSrcFiles) {
  const content = readSrc(f)
  const rel = relPath(f)
  const matches = content.match(fontFamilyRe) || []
  if (matches.length > 0) {
    wn(`${rel}: ${matches.length} hardcoded fontFamily (should use Font.sans/Font.mono)`)
    hardcodedFonts += matches.length
  }
}
if (hardcodedFonts === 0) ok('No hardcoded font families')

// ═══════════════════════════════════════════════════════
// 6. DUPLICATE INLINE HELPERS
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m6. Duplicate inline helpers\x1b[0m')

const helperPatterns = [
  { re: /const merge\s*=/, name: 'merge()' },
  { re: /function Mono\s*\(/, name: 'Mono()' },
  { re: /function PhoneScaler\s*\(/, name: 'PhoneScaler()' },
]

for (const h of helperPatterns) {
  const found = []
  for (const f of allSrcFiles) {
    if (h.re.test(readSrc(f))) found.push(relPath(f))
  }
  if (found.length > 1) {
    wn(`${h.name} defined in ${found.length} files: ${found.join(', ')}`)
  } else if (found.length === 1) {
    ok(`${h.name} → ${found[0]} (single definition)`)
  }
}

// ═══════════════════════════════════════════════════════
// 7. PAGE BACKGROUND CONSISTENCY
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m7. Page backgrounds & wrapper consistency\x1b[0m')

const pages = [
  { route: '/app', file: 'pages/AppFlow.jsx' },
  { route: '/demo', file: 'tools/DevHandover.jsx' },
  { route: '/library', file: 'tools/UILibrary.jsx' },
  { route: '/journey', file: 'tools/UserJourney.jsx' },
  { route: '/', file: 'pages/Home.jsx' },
  { route: '/landing', file: 'pages/Landing.jsx' },
]

for (const p of pages) {
  const fp = resolve(src, p.file)
  if (!existsSync(fp)) { er(`${p.route} → ${p.file} NOT FOUND`); continue }
  const content = readSrc(fp)

  // Check if using Color.bg or hardcoded background
  const usesColorBg = /Color\.bg/.test(content)
  const hardcodedBg = content.match(/background:\s*['"]#[0-9a-f]+['"]/gi) || []
  const hardcodedBgVar = content.match(/bg:\s*['"]#[0-9a-f]+['"]/gi) || []

  if (usesColorBg) {
    ok(`${p.route} (${p.file}) → uses Color.bg`)
  } else if (hardcodedBg.length > 0 || hardcodedBgVar.length > 0) {
    wn(`${p.route} (${p.file}) → hardcoded background colors`)
  }
}

// ═══════════════════════════════════════════════════════
// 8. TOOLS FILES — TOKEN ADOPTION
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m8. Tools/pages token & component hygiene\x1b[0m')

for (const f of [...toolFiles, ...pageFiles]) {
  const content = readSrc(f)
  const rel = relPath(f)

  // Check for hardcoded hex colors (outside comments)
  const hexMatches = (content.match(/'#[0-9a-fA-F]{6}'/g) || []).concat(content.match(/"#[0-9a-fA-F]{6}"/g) || [])
  const hardcodedRadius = (content.match(/borderRadius:\s*(999|12|8|4)\b/g) || [])
  const hardcodedGap = (content.match(/gap:\s*(4|8|12|16|20|24)\b/g) || [])

  const issues = []
  if (hexMatches.length > 3) issues.push(`${hexMatches.length} hex colors`)
  if (hardcodedRadius.length > 0) issues.push(`${hardcodedRadius.length} hardcoded radii`)
  if (hardcodedGap.length > 0) issues.push(`${hardcodedGap.length} hardcoded gaps`)

  if (issues.length > 0) {
    wn(`${rel}: ${issues.join(', ')}`)
  } else {
    ok(`${rel}: clean`)
  }
}

// ═══════════════════════════════════════════════════════
// 9. SCREEN CONTENT PADDING CONSISTENCY
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m9. Screen content padding\x1b[0m')

const paddingRe = /padding:\s*['"](\d+px\s+\d+px(?:\s+\d+px)?)['"]/g
const paddingMap = {}
for (const f of screenFiles) {
  const content = readSrc(f)
  const rel = relPath(f)
  let pm
  const re = new RegExp(paddingRe.source, 'g')
  while ((pm = re.exec(content)) !== null) {
    const val = pm[1]
    if (!paddingMap[val]) paddingMap[val] = []
    paddingMap[val].push(rel)
  }
}

const paddingEntries = Object.entries(paddingMap).sort((a, b) => b[1].length - a[1].length)
if (paddingEntries.length <= 2) {
  ok(`Content padding consistent: ${paddingEntries.length} variants`)
} else {
  wn(`Content padding has ${paddingEntries.length} variants:`)
  for (const [val, files] of paddingEntries) {
    console.log(`       "${val}" → ${files.length} files`)
  }
}

// ═══════════════════════════════════════════════════════
// 10. DEAD/UNUSED IMPORTS
// ═══════════════════════════════════════════════════════
console.log('\n\x1b[1m10. Unused imports in screen files\x1b[0m')

const componentNames = [
  'FSurface', 'FListRow', 'FButtonGroup', 'FAvatar', 'Phone',
  'FNavBar', 'FLabel', 'FMono', 'FNum', 'FTexBar', 'FScale',
  'FIcon', 'FTag', 'FBtn', 'FRing', 'FCheckbox', 'FTabBar',
  'FSection', 'FToolbar', 'FStagger', 'ErrorBoundary', 'ICONS',
]

let deadImports = 0
for (const f of screenFiles) {
  const content = readSrc(f)
  const rel = relPath(f)
  const importLine = content.split('\n').find(l => l.includes('from') && l.includes('components'))
  if (!importLine) continue

  for (const name of componentNames) {
    // Check if imported
    const imported = new RegExp(`\\b${name}\\b`).test(importLine)
    if (!imported) continue

    // Check if used in the rest of the file (beyond import)
    const afterImport = content.slice(content.indexOf(importLine) + importLine.length)
    const used = new RegExp(`\\b${name}\\b`).test(afterImport)
    if (!used) {
      wn(`${rel}: imports ${name} but never uses it`)
      deadImports++
    }
  }
}
if (deadImports === 0) ok('No dead imports in screen files')

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(55))
console.log(`\x1b[1mConsistency Audit Results:\x1b[0m`)
console.log(`  \x1b[32m${pass} pass\x1b[0m  \x1b[31m${fail} fail\x1b[0m  \x1b[33m${warn} warn\x1b[0m`)
console.log('═'.repeat(55) + '\n')

process.exit(fail > 0 ? 1 : 0)
