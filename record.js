import { chromium } from 'playwright'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execPromise = promisify(exec)

function printUsage() {
  console.log(`
Aurevion Animation Recorder
---------------------------
Usage:
  node record.js [options]

Options:
  --scene <id>        Record a specific scene (1-20). Example: --scene 14
  --trailer           Record the product trailer (default: 38s duration)
  --duration <secs>   Override recording duration in seconds (default: 8s for scenes, 38s for trailer)
  --out <filepath>    Specify the output MP4 file path (default: './recordings/scene-<id>.mp4')
  --url <url>         Specify the base URL of the running app (default: 'http://localhost:3000')

Examples:
  node record.js --scene 14
  node record.js --scene 6 --duration 6 --out logo-reveal.mp4
  node record.js --trailer
`)
}

// Simple CLI arg parser
function parseArgs() {
  const args = process.argv.slice(2)
  const config = {
    scene: null,
    trailer: false,
    duration: null,
    out: null,
    url: 'http://localhost:3000',
    help: false
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scene') {
      config.scene = parseInt(args[++i], 10)
    } else if (args[i] === '--trailer') {
      config.trailer = true
    } else if (args[i] === '--duration') {
      config.duration = parseFloat(args[++i])
    } else if (args[i] === '--out') {
      config.out = args[++i]
    } else if (args[i] === '--url') {
      config.url = args[++i]
    } else if (args[i] === '--help' || args[i] === '-h') {
      config.help = true
    }
  }
  return config
}

async function record() {
  const config = parseArgs()

  if (config.help || (!config.scene && !config.trailer)) {
    printUsage()
    process.exit(0)
  }

  // Determine target URL and defaults
  let targetUrl = config.url
  let defaultDuration = 8
  let defaultOut = ''

  if (config.trailer) {
    targetUrl += '/trailer'
    defaultDuration = 38
    defaultOut = './recordings/trailer.mp4'
  } else if (config.scene) {
    targetUrl += `/scenes?id=${config.scene}`
    defaultDuration = 8
    defaultOut = `./recordings/scene-${String(config.scene).padStart(2, '0')}.mp4`
  }

  const duration = config.duration || defaultDuration
  const outFile = config.out || defaultOut
  const outDir = path.dirname(outFile)

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const tempDir = './.temp-recordings'
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  console.log(`Checking connection to Vite server at ${config.url}...`)
  try {
    const res = await fetch(config.url)
    if (!res.ok && res.status !== 200) {
      throw new Error(`Server returned status ${res.status}`)
    }
  } catch (err) {
    console.error(`\nError: Could not connect to Vite dev server at ${config.url}.`)
    console.error('Make sure you have started the local development server first:')
    console.error('  npm run dev\n')
    process.exit(1)
  }

  console.log(`Launching headless browser...`)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1920, height: 1080 }
    }
  })

  const page = await context.newPage()

  console.log(`Navigating to ${targetUrl}...`)
  await page.goto(targetUrl)

  // Wait for React app to mount and layout
  await page.waitForTimeout(1000)

  if (config.scene) {
    console.log(`Activating fullscreen mode for clean capture of Scene ${config.scene}...`)
    // Press 'F' key to toggle fullscreen layout
    await page.keyboard.press('KeyF')
    // Wait for scaling transition to complete
    await page.waitForTimeout(500)
  }

  console.log(`Recording animation for ${duration} seconds...`)
  await page.waitForTimeout(duration * 1000)

  console.log('Finalizing capture...')
  // Getting the video file location before closing context
  const videoFile = await page.video()?.path()
  await context.close()
  await browser.close()

  if (!videoFile || !fs.existsSync(videoFile)) {
    console.error('Error: Playwright failed to generate the temporary video recording.')
    process.exit(1)
  }

  console.log(`Temporary recording saved: ${videoFile}`)
  console.log(`Converting to MP4 format at ${outFile} using ffmpeg...`)

  try {
    // Convert WebM to MP4 with h264 encoding for max compatibility
    // Using faststart preset so the MP4 can stream/play immediately
    const cmd = `ffmpeg -y -i "${videoFile}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "${outFile}"`
    await execPromise(cmd)
    console.log(`\n🎉 Success! MP4 saved to: ${path.resolve(outFile)}`)
  } catch (err) {
    console.error('\nError: Failed to convert video using FFmpeg.')
    console.error(err.message)
  } finally {
    // Cleanup temporary recording files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }
  }
}

record()
