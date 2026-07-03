# AUREVI0N Design System

## Source of Truth

All tokens live in `src/ui/tokens.js`. Components in `src/ui/components.jsx`. Charts in `src/ui/chart.jsx`. Motion in `src/ui/motion.js`.

## Color

```
bg:          #000000        // app background
surface:     #0d0d0d        // card background (level 1)
surface2:    #161616        // card background (level 2)
surface3:    #1e1e1e        // card background (level 3)

text:        #fafafa        // primary text
dim:         #a1a1a1        // secondary text
mute:        #6b6b6b        // tertiary text
faint:       #3a3a3a        // ghost text, guide lines

accent:      #FF6E50        // primary action, fitness goals
accentHot:   #FF5A1F        // hover/active accent
green:       #4ade80        // success, nutrition goals, cooking mode
red:         #f87171        // error, destructive, missing
blue:        #60a5fa        // info, training modalities
purple:      #a78bfa        // meal prep, goal network
```

Each semantic color has a `Dim` variant at 15% opacity (e.g., `greenDim: rgba(74,222,128,0.15)`) for backgrounds.

### Category Colors (used in Goal Network + journey)

| Category | Color | Hex |
|---|---|---|
| Fitness goals | Accent | #FF6E50 |
| Nutrition goals | Green | #4ade80 |
| Training modalities | Blue | #60a5fa |
| Meal prep approaches | Purple | #a78bfa |
| Caloric states | Amber | #F59E0B |
| Cooking mode | Green | #66D575 |
| Exercise mode | Accent | #FF6E50 |

## Typography

**Families:**
- `Geist` — sans-serif, used for body text, headings
- `Geist Mono` — monospace, used for labels, data, tags

**Scale:**

| Token | Family | Size | Weight | Spacing | Use |
|---|---|---|---|---|---|
| `displayLg` | Geist | 56px | 200 | -1.57 | Hero numbers |
| `displayMd` | Geist | 40px | 200 | -1.12 | Page titles |
| `displaySm` | Geist | 28px | 300 | -0.56 | Section titles |
| `headingLg` | Geist | 22px | 500 | -0.5 | Card headings |
| `headingMd` | Geist | 17px | 500 | -0.3 | Subheadings |
| `headingSm` | Geist | 15px | 500 | -0.2 | Small headings |
| `bodyLg` | Geist | 15px | 400 | 0 | Primary body |
| `bodyMd` | Geist | 13px | 400 | 0 | Secondary body |
| `bodySm` | Geist | 12px | 400 | 0 | Tertiary body |
| `labelLg` | Geist Mono | 12px | 500 | 1.4 | Section labels (uppercase) |
| `labelMd` | Geist Mono | 10px | 500 | 1.2 | Tag labels (uppercase) |
| `labelSm` | Geist Mono | 9px | 500 | 1.0 | Micro labels (uppercase) |
| `dataLg` | Geist Mono | 14px | 400 | 0 | Data values |
| `dataMd` | Geist Mono | 12px | 400 | 0 | Secondary data |
| `dataSm` | Geist Mono | 10px | 400 | 0 | Micro data |

**Rule of thumb:** If it's a label, tag, or number, use mono. If it's a sentence, use sans.

## Spacing

`Space` object with keys 0–20 mapping to 0–80px:

```
0:0  1:4  2:8  3:12  4:16  5:20  6:24  7:28  8:32  10:40  12:48  16:64  20:80
```

## Radius

```
none: 0    sm: 4    md: 8    lg: 12    xl: 16    2xl: 20    full: 9999
```

## Motion

### Durations
```
micro: 0.08s    fast: 0.1s    normal: 0.15s    slow: 0.25s    morph: 0.4s    fill: 0.8s
```

### Easing
```
default: cubic-bezier(0.4, 0, 0.2, 1)     // standard ease
spring:  cubic-bezier(0.34, 1.56, 0.64, 1) // overshoot
out:     cubic-bezier(0, 0, 0.2, 1)         // decelerate
expo:    cubic-bezier(0.16, 1, 0.3, 1)      // fast out
```

### Hooks
- `useSpring(target, preset)` — physics-based animation
- `useScrollReveal(ref)` — intersection observer reveal
- `useStaggerEntrance(count, delay)` — timed list entrance
- `useTransitionLock(duration)` — prevents double-trigger
- `usePageTransition()` — page transition state machine
- `SpringPreset`: default, snappy, gentle, stiff

All hooks respect `prefers-reduced-motion`.

## Core Components

| Component | Purpose | Key Props |
|---|---|---|
| `Phone` | iPhone frame (402×874) | `statusTime`, `label`, `group` |
| `FSurface` | Card container | `accent`, `tone`, `icon`, `title` |
| `FBtn` | Button | `variant` (primary/ghost/split), `size`, `icon`, `full` |
| `FLabel` | Section label (mono, uppercase) | `size`, `mb`, `letter`, `color` |
| `FMono` | Monospace text | `size`, `color`, `letter` |
| `FNum` | Large number display | `size`, `weight`, `unit`, `color` |
| `FTag` | Badge/tag | `tone` (accent/green/red/mute), `size` |
| `FIcon` | SVG icon wrapper | `path`, `size`, `color`, `stroke` |
| `FTexBar` | Animated progress bar | `pct`, `height`, `color`, `radius` |
| `FRing` | Circular progress ring | `pct`, `size`, `stroke`, `color` |
| `FListRow` | List item | `leading`, `title`, `subtitle`, `trailing` |
| `FTabBar` | Bottom tab navigation | `active`, `items` |
| `FToolbar` | Action toolbar | `cells: [{icon, label, primary}]` |
| `FNavBar` | Navigation header | `title`, `leading`, `trailing` |
| `FCheckbox` | Checkbox with tone | `checked`, `tone`, `onChange` |
| `FStagger` | Staggered entrance wrapper | `children`, `delay` |
| `FScale` | Marks ruler (for sliders) | `marks`, `active` |
| `FButtonGroup` | Radio button group | `items`, `active`, `onChange` |

## Chart System

7 chart types in `src/ui/chart.jsx`, all pure SVG:

| Chart | Use Case | Key Feature |
|---|---|---|
| `LineChart` | Weight trends, TDEE over time | Catmull-Rom smoothing, confidence bands |
| `BarChart` | Macro comparison, weekly volume | Single or stacked segments |
| `GaugeChart` | Body fat %, completion | Semi-circular arc with tick |
| `LollipopChart` | Sleep, discrete data | Thin stems with dots |
| `WaveformChart` | Heart rate, activity signal | Dense thin bars |
| `Sparkline` | Inline trend (no card) | Minimal, no axes |
| `AreaChart` | Multi-series stacked | Multiple filled areas |

## Icon Set

31 general icons in `ICONS` object (SVG path strings): back, fwd, close, plus, minus, check, more, search, flame, dumb, person, meal, cart, chart, goal, timer, pause, play, pan, fire, bowl, bell, filter, trend_up, trend_dn, swap, sparkle, expand.

26 cooking action icons in `COOK_ICONS`: dice, chop, slice, sear, roast, bake, sauté, grill, boil, simmer, steam, pour, mix, fold, whisk, blend, prep, measure, season, rest, plate, garnish, serve, portion.

## Screen Patterns

### Content + Screen Wrapper
Every screen exports two components:
```jsx
export function ScreenNameContent({ props }) {
  // Logic + UI, no Phone frame
  return <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>...</div>
}

export function ScreenNameScreen() {
  return (
    <Phone label="description" group="SECTION">
      <FNavBar title="Title" />
      <ScreenNameContent />
    </Phone>
  )
}
```

`Content` is used in the Shell (no wrapper). `Screen` is used in the journey explorer and galleries (needs the Phone frame).

### Active Mode Pattern (Cook/Workout)
```
Sticky header (timers, progress) — flexShrink: 0
Main content (step focus) — flex: 1, overflowY: auto
Bottom toolbar (controls) — flexShrink: 0
```

Timer logic: `setInterval` with 1000ms tick, pause/resume via state flag, `Math.max(0, rem - 1)` for countdown.
