#!/usr/bin/env node
/* Export journey pages as self-contained HTML files.
   Usage: node scripts/export-journey.mjs [--goals hypertrophy,fat_loss]
   Requires: dev server running on localhost:3000, playwright installed */

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const BASE = 'http://localhost:3000'
const OUT = join(import.meta.dirname, '..', 'export')

// Default pages to export
const PAGES = [
  { path: '/journey', name: 'index' },
  { path: '/journey/seed', name: 'seed' },
  { path: '/journey/decide', name: 'decide' },
  { path: '/journey/cooking', name: 'cooking' },
  { path: '/journey/cooking/create', name: 'cooking-create' },
  { path: '/journey/cooking/edit', name: 'cooking-edit' },
  { path: '/journey/cooking/delete', name: 'cooking-delete' },
  { path: '/journey/exercise', name: 'exercise' },
  { path: '/journey/exercise/create', name: 'exercise-create' },
  { path: '/journey/exercise/edit', name: 'exercise-edit' },
  { path: '/journey/exercise/delete', name: 'exercise-delete' },
  { path: '/journey/observe', name: 'observe' },
  { path: '/journey/goals', name: 'goals' },
  { path: '/journey/explore', name: 'explore' },
  { path: '/journey/all', name: 'all' },
  { path: '/journey/all/export', name: 'all-export-428' },
]

// Parse --goals flag
const goalsArg = process.argv.find(a => a.startsWith('--goals'))
const goals = goalsArg
  ? (process.argv[process.argv.indexOf(goalsArg) + 1] || '').split(',').filter(Boolean)
  : []

// Add goal-specific exercise pages
for (const goal of goals) {
  PAGES.push({ path: `/journey/exercise?goal=${goal}`, name: `exercise-${goal}` })
}

mkdirSync(OUT, { recursive: true })

async function exportPage(browser, page) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const tab = await ctx.newPage()

  console.log(`  ${page.name} ...`)
  await tab.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle' })
  // Extra wait for React renders + font loading
  await tab.waitForTimeout(2000)

  // Collect all stylesheets
  const styles = await tab.evaluate(() => {
    const sheets = []
    for (const s of document.styleSheets) {
      try {
        sheets.push([...s.cssRules].map(r => r.cssText).join('\n'))
      } catch {}
    }
    return sheets
  })

  // Get body HTML
  const bodyHTML = await tab.evaluate(() => {
    // Remove scripts + probe UI
    const clone = document.body.cloneNode(true)
    clone.querySelectorAll('script, [data-probe-ui]').forEach(el => el.remove())
    return clone.outerHTML
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AUREVI0N — ${page.name}</title>
<meta name="description" content="AUREVI0N journey export — ${page.name}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 42 42'><rect width='42' height='42' rx='8' fill='%23FF6E50'/></svg>" type="image/svg+xml">
<style>
${styles.join('\n')}
</style>
</head>
${bodyHTML}
</html>`

  const outPath = join(OUT, `${page.name}.html`)
  writeFileSync(outPath, html)
  await ctx.close()
}

;(async () => {
  console.log(`Exporting ${PAGES.length} journey pages to ${OUT}/\n`)
  const browser = await chromium.launch({ headless: true })

  for (const page of PAGES) {
    await exportPage(browser, page)
  }

  await browser.close()
  console.log(`\nDone — ${PAGES.length} files written to export/`)
})()
