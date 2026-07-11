import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE = 'http://localhost:3000'

const ROUTES = [
  { path: '/journey',                   file: 'index' },
  { path: '/journey/seed',              file: 'seed' },
  { path: '/journey/decide',            file: 'decide' },
  { path: '/journey/cooking',           file: 'cooking' },
  { path: '/journey/cooking/create',    file: 'cooking-create' },
  { path: '/journey/cooking/edit',      file: 'cooking-edit' },
  { path: '/journey/cooking/delete',    file: 'cooking-delete' },
  { path: '/journey/exercise',          file: 'exercise' },
  { path: '/journey/exercise/create',   file: 'exercise-create' },
  { path: '/journey/exercise/edit',     file: 'exercise-edit' },
  { path: '/journey/exercise/delete',   file: 'exercise-delete' },
  { path: '/journey/observe',           file: 'observe' },
  { path: '/journey/goals',             file: 'goals' },
  { path: '/journey/explore',           file: 'explore' },
  { path: '/journey/explore/scenario',  file: 'explore-scenario' },
  { path: '/journey/explore/exercises', file: 'explore-exercises' },
  { path: '/journey/explore/goal-cards',file: 'explore-goal-cards' },
]

const OUT_DIR = './export'

async function exportJourney() {
  // Check dev server
  try {
    const res = await fetch(BASE)
    if (!res.ok) throw new Error(`Status ${res.status}`)
  } catch {
    console.error(`\nCannot reach dev server at ${BASE}.`)
    console.error('Start it first:  npm run dev\n')
    process.exit(1)
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  // Fetch Google Fonts CSS and inline it
  console.log('Fetching Google Fonts for inlining...')
  let fontCSS = ''
  try {
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700&family=Geist+Mono:wght@100;200;300;400;500;600;700&display=swap'
    const res = await fetch(fontUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    })
    fontCSS = await res.text()
  } catch {
    console.warn('Could not fetch fonts — exported pages will use fallback fonts')
  }

  // Fetch logo SVG
  let logoDataUri = '/logo.svg'
  try {
    const res = await fetch(`${BASE}/logo.svg`)
    const svg = await res.text()
    logoDataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`
  } catch { /* keep relative path */ }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  })

  console.log(`\nExporting ${ROUTES.length} journey pages...\n`)

  for (const route of ROUTES) {
    const page = await context.newPage()
    const url = `${BASE}${route.path}`

    process.stdout.write(`  ${route.path.padEnd(35)}`)

    await page.goto(url, { waitUntil: 'networkidle' })
    // Extra settle time for React rendering + animations
    await page.waitForTimeout(1500)

    // Scroll down to trigger any lazy renders, then back up
    await page.evaluate(async () => {
      const el = document.querySelector('[style*="overflow"]') || document.documentElement
      el.scrollTop = el.scrollHeight
      await new Promise(r => setTimeout(r, 300))
      el.scrollTop = 0
    })
    await page.waitForTimeout(500)

    // Get computed page content
    const html = await page.content()

    // Build self-contained HTML
    const doc = html
      // Inline font CSS
      .replace(
        /<link[^>]*fonts\.googleapis\.com[^>]*>/,
        `<style>${fontCSS}</style>`
      )
      // Inline logo
      .replace(/href="\/logo\.svg"/g, `href="${logoDataUri}"`)
      // Remove the script tag (not needed for static snapshot)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    const outPath = path.join(OUT_DIR, `${route.file}.html`)
    fs.writeFileSync(outPath, doc)

    const sizeKB = Math.round(fs.statSync(outPath).size / 1024)
    console.log(`${sizeKB}KB`)

    await page.close()
  }

  await browser.close()

  console.log(`\nDone — ${ROUTES.length} files in ${path.resolve(OUT_DIR)}/`)
}

exportJourney()
