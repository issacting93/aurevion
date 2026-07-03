# AUREVI0N — App Store Product Trailer

**Format:** 30–40s · 1080×1920 (vertical, 9:16) · 60fps
**Audio:** Dark electronic/ambient pulse, no VO — text supers carry the story
**Palette:** Black (#000) background, coral accent (#FF6E50), Geist Mono for supers

---

## Script + Timing Sheet

### Act 1: Hook (0:00–0:06)

| Time | Screen | Camera/Motion | Super | Duration |
|------|--------|--------------|-------|----------|
| 0:00 | Black | — | — | 0.3s |
| 0:00.3 | **Onboarding Welcome** | Fade in from black. Phone frame centered, subtle float (2px up-down, 6s loop). Logo jewel ring pulses. | — | 2.0s |
| 0:02.3 | — | Hold on welcome screen | `YOUR BODY. YOUR DATA.` fades in below phone (Geist Mono, 14pt, coral, tracking 4) | 1.5s |
| 0:03.8 | **Onboarding Sex → Birthday → Height** | Quick morph cuts (0.4s each) — phone content slides left as if swiping through steps. Show 3 steps in rapid succession. | `10 questions. Your plan.` (bottom center, white, 12pt) | 2.2s |

### Act 2: The Plan Comes Together (0:06–0:16)

| Time | Screen | Camera/Motion | Super | Duration |
|------|--------|--------------|-------|----------|
| 0:06 | **TDEE Result (Onboarding step 9)** | Ring draws on (stroke animation, 1.4s). Counter animates from 0 → 2,420. Camera holds. | — | 2.5s |
| 0:08.5 | **Ready screen (step 10)** | Slide in from right. Macro bars fill with stagger (P → C → F). Tags appear. | `Built for you.` (bottom, coral) | 2.0s |
| 0:10.5 | **Dashboard (Balanced)** | Morph transition — the Ready card shrinks into the Goal tile, revealing the full dashboard. Tiles stagger in (40ms delay each). | — | 2.5s |
| 0:13 | — | Slow scroll down the dashboard, revealing all tiles. Slight parallax (tiles move 1.1× vs scroll). | `Everything. One screen.` | 3.0s |

### Act 3: Feature Beats (0:16–0:30)

Each feature gets 2.5s. Hard cut between features — each cut zooms into a tile, then the full screen reveals.

| Time | Screen | Camera/Motion | Super | Duration |
|------|--------|--------------|-------|----------|
| 0:16 | **TDEE Expenditure** | Zoom into TDEE tile → full screen. Confidence band draws left-to-right, hatching reveals. Pulse ring on current point. | `Your energy. Modeled.` | 2.5s |
| 0:18.5 | **Macro Targets** | Cut. P/C/F bars fill from left. Weekly strip lights up day by day. | `Macros hit. Every day.` | 2.5s |
| 0:21 | **Meal Prep Cook Mode** | Cut. Timer bar ticks down. Heat rings pulse behind the sear icon. "DONE · ADVANCE" button glows. | `Cook smarter. Not longer.` | 2.5s |
| 0:23.5 | **Training Session** | Cut. Exercise timeline with done/active/idle rings. Set tracker fills a block. Rest timer counts. | `Train with precision.` | 2.5s |
| 0:26 | **Calendar Week → Day** | Cut to week view. Dots under days pulse in. Quick morph to day view — timeline events slide into place, NOW marker appears. | `Plan the week. Own the day.` | 2.5s |
| 0:28.5 | **TDEE Confidence Compare** | Cut. Side-by-side: Day 3 (wide band) morphs into Day 87 (tight band). Band physically narrows with animation. | `The longer you log, the sharper it gets.` | 2.5s |

### Act 4: Close (0:31–0:38)

| Time | Screen | Camera/Motion | Super | Duration |
|------|--------|--------------|-------|----------|
| 0:31 | **Dashboard** | Pull back to full dashboard. All tiles alive — sparklines moving, bars filled, streak flame flickering. | — | 2.0s |
| 0:33 | — | Dashboard fades to 30% opacity. | `AUREVI0N` (center, Geist, 44pt, weight 200, tracking 6, coral) | 1.5s |
| 0:34.5 | — | Logo jewel ring fades in above wordmark | `Nutrition. Training. Body composition.` (below, 12pt, dim) | 2.0s |
| 0:36.5 | — | Hold. Subtle background pulse on accent. | `Available soon.` or App Store badge | 1.5s |
| 0:38 | Black | Fade to black | — | — |

---

## Animation Sequences — After Effects Specs

### Global Setup

- **Comp:** 1080×1920, 60fps, 38s duration
- **Phone frame:** 402×874px asset, centered at (540, 960), scaled to fit with ~80px margin on each side. Add subtle drop shadow (0, 30, 80, black 40%).
- **Background:** Solid black (#000000). Optional: very subtle noise grain (1-2%, monochrome).
- **Accent glow:** Radial gradient at 50% 20%, coral at 4% opacity, 600px radius. Fades in at 0:00, persists.

### Sequence 1: Phone Float (persistent)

```
Property: Position Y
Expression: value + Math.sin(time * 1.05) * 2
// 2px amplitude, ~6s period, always active
```

### Sequence 2: Screen Swipe Transitions (Act 1, steps)

```
For each onboarding step transition:
  - Outgoing screen: Position X animates 0 → -402 over 0.4s (ease: [0.16, 1, 0.3, 1])
  - Incoming screen: Position X animates 402 → 0 over 0.4s (same ease)
  - Opacity: both stay at 100% during swipe
  - Overlap: 0.05s (start incoming at 0.35s into outgoing)
```

### Sequence 3: TDEE Ring Draw (0:06)

```
Shape Layer: Circle (140px diameter, 5px stroke, coral)
  - Trim Paths: Start 0%, End animates 0% → 100%
  - Duration: 1.4s
  - Ease: [0.16, 1, 0.3, 1] (cubic out)
  
Text Layer: Counter "2,420"
  - Expression on Source Text:
    t = linear(time, inPoint, inPoint + 1.2, 0, 2420);
    Math.round(t).toLocaleString()
  - Ease: cubic-out (1 - Math.pow(1 - t, 3))
```

### Sequence 4: Macro Bar Fill (0:08.5)

```
3 bars (Protein, Carbs, Fat):
  - Scale X: 0% → 100%
  - Anchor: left edge
  - Stagger: 120ms between each
  - Duration: 0.6s per bar
  - Ease: [0.34, 1.56, 0.64, 1] (spring)
  
Hatching pattern on protein bar:
  - 45° diagonal lines, 6px spacing, 1px width, 35% opacity
  - Mask: same shape as bar, animated with bar scale
```

### Sequence 5: Dashboard Tile Stagger (0:10.5)

```
9 tiles, arranged in 2-column grid:
  - Enter animation per tile:
    - Opacity: 0 → 1
    - Scale: 0.92 → 1
    - Position Y: +12px → 0
  - Duration: 0.3s per tile
  - Stagger: 40ms between tiles (reading order: top-left, top-right, row 2 left, etc.)
  - Ease: [0.16, 1, 0.3, 1]
  - Total entrance: ~0.66s for all 9 tiles
```

### Sequence 6: Confidence Band Draw (0:16)

```
Band shape (two bezier paths forming a filled area):
  - Reveal via rectangular mask, left-to-right
  - Mask Position X: -100% → 0%
  - Duration: 1.2s
  - Ease: [0.16, 1, 0.3, 1]

Center line (stroke):
  - Trim Paths End: 0% → 100%, same timing as band

Data point dots:
  - Scale: 0 → 100%
  - Stagger: 80ms each, starting at 0.3s into the band reveal
  
Pulse ring on last dot:
  - Scale: 100% → 350%, Opacity: 60% → 0%
  - Duration: 2s, loop
  - Starts after dots finish
```

### Sequence 7: Cook Mode Heat Rings (0:21)

```
3 concentric circles, centered on icon:
  - Scale: 20px → 140px
  - Opacity: 50% → 0%
  - Duration: 2.4s each
  - Stagger: 0.8s
  - Loop: continuous during 2.5s hold
  - Stroke: 1.5px, coral, no fill
```

### Sequence 8: Training Set Fill (0:23.5)

```
4 set blocks in a row:
  - Block 1-2: filled (coral, hatched)
  - Block 3: fills during shot
    - Background: transparent → coral
    - Duration: 0.3s
    - Ease: spring
  - Block 4: stays empty (border only)
  
Rest timer countdown:
  - Text counter: "1:30" → "1:24" (counts down during shot)
  - Update every 1s
```

### Sequence 9: Calendar Dot Pulse (0:26)

```
7 day columns, each with 1-3 dots:
  - Dots scale in: 0 → 100%
  - Stagger: 60ms per column (left to right)
  - Duration: 0.2s per dot
  - Ease: spring [0.34, 1.56, 0.64, 1]
  
Week → Day morph:
  - Week grid scales down (100% → 85%, 0.2s)
  - Day timeline scales up from behind (85% → 100%, 0.3s)
  - Cross-dissolve: 0.15s overlap
```

### Sequence 10: Band Narrowing (0:28.5)

```
Two states of the confidence chart:
  - State A (Day 3): wide band, spread = 420 kcal
  - State B (Day 87): narrow band, spread = 140 kcal

Morph approach:
  - Animate the upper/lower bezier paths inward
  - Duration: 1.5s
  - Ease: [0.16, 1, 0.3, 1]
  - Data points shift position to match narrowed band
  
Label transition:
  - "±420 KCAL" → "±142 KCAL"
  - Cross-dissolve, 0.3s
```

### Sequence 11: Final Logo (0:33)

```
Dashboard layer:
  - Opacity: 100% → 30%
  - Duration: 0.8s
  - Ease: linear

"AUREVI0N" wordmark:
  - Opacity: 0 → 100%
  - Position Y: +20px → 0
  - Duration: 0.6s
  - Ease: [0.16, 1, 0.3, 1]
  - Delay: 0.3s after dashboard fade starts

Jewel ring logo:
  - Scale: 80% → 100%
  - Opacity: 0 → 100%
  - Duration: 0.5s
  - Ease: spring
  - Delay: 0.6s after wordmark starts

Tagline:
  - Opacity: 0 → 100%
  - Delay: 0.3s after logo
  - Duration: 0.4s
```

---

## Screen Capture Checklist

Screens to capture from `/demo` (use PhoneScaler at 1× for crisp frames):

| # | Screen | Source in demo sidebar | Notes |
|---|--------|----------------------|-------|
| 1 | Welcome | Welcome → Begin | Wait for logo animation to complete |
| 2 | Sex selection | Onboarding → Sex | Select "Male" for the capture |
| 3 | Birthday | Onboarding → Birthday | Set to visible date |
| 4 | Height + Weight | Onboarding → Body Metrics | Sliders at mid position |
| 5 | TDEE Result | Onboarding → TDEE | Wait for ring + counter animation |
| 6 | Ready | Onboarding → Ready | All bars filled |
| 7 | Dashboard Balanced | Dashboard → Balanced | Full tile grid visible |
| 8 | TDEE Expenditure | TDEE → Today | Band fully drawn |
| 9 | TDEE Confidence | TDEE → Confidence | Both charts visible |
| 10 | Macro Targets | Macros → Weekly targets | Bars filled |
| 11 | Cook Mode | Meal Prep → Cook mode | Heat rings active (step 4) |
| 12 | Training Session | Training → Session | Set 3 active |
| 13 | Calendar Week | Calendar → Week | Dots visible |
| 14 | Calendar Day | Calendar → Day | NOW marker visible |

**Capture method:** Screen record at 2× resolution (Retina), crop to phone frame, or screenshot each and rebuild in AE as pre-comps.

---

## Audio Guide

| Time | Audio beat |
|------|-----------|
| 0:00 | Low sub bass hit on fade-in |
| 0:06 | Soft tonal rise as TDEE ring draws |
| 0:10.5 | Percussive tick pattern as tiles stagger in |
| 0:16 | Each feature beat gets a subtle bass pulse on the cut |
| 0:31 | Music opens up — release, wider stereo |
| 0:33 | Single clean tone on logo reveal |
| 0:38 | Tail fade to silence |

**Suggested tracks:** Search "dark minimal tech" or "UI reveal" on Artlist/Epidemic Sound. Avoid anything with lyrics or heavy melody — the visuals lead.
