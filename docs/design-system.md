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

### alpha() helper

`alpha(color, opacity)` converts any hex Color token to `rgba(r,g,b, opacity)`. Use this instead of hex suffix concatenation (`${color}0a`) — it's readable, consistent, and caches the RGB conversion.

```jsx
import { alpha } from '../../ui/tokens'

alpha(Color.accent, 0.08)   // tinted card background
alpha(Color.accent, 0.10)   // pill/badge background
alpha(Color.accent, 0.25)   // active border
alpha(Color.text, 0.08)     // neutral track (progress bars)
```

**Common opacity tiers:**

| Opacity | Use |
|---|---|
| 0.06–0.08 | Tinted card backgrounds (hero cards, category surfaces) |
| 0.10 | Badge/pill backgrounds (goal pills, sets badges) |
| 0.15 | Dim token backgrounds (greenDim, redDim) |
| 0.25 | Active/selected borders |

### Category Colors (used in Goal Network + journey)

| Category | Color | Hex |
|---|---|---|
| Fitness goals | Accent | #FF6E50 |
| Nutrition goals | Green | #4ade80 |
| Training modalities | Blue | #60a5fa |
| Meal prep approaches | Purple | #a78bfa |
| Caloric states | Amber | #F59E0B |
| Cooking mode | Green | #4ade80 |
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
| `labelLg` | Geist Mono | 13px | 500 | 1.4 | Section labels (uppercase) |
| `labelMd` | Geist Mono | 11px | 500 | 1.2 | Tag labels (uppercase) |
| `labelSm` | Geist Mono | 10px | 500 | 1.2 | Micro labels (uppercase) |
| `dataLg` | Geist Mono | 14px | 400 | 0 | Data values |
| `dataMd` | Geist Mono | 12px | 400 | 0 | Secondary data |
| `dataSm` | Geist Mono | 11px | 400 | 0 | Micro data |

**Rule of thumb:** If it's a label, tag, or number, use mono. If it's a sentence, use sans.

**Minimum font size:** 10px (`labelSm` is the floor). Only dense data grids (heatmaps) may use 9px for axis labels.

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
- `MotionGroup` — wrapper component for staggered children
- `MotionEase` — extended easing presets
- `MotionDuration` — timing constants (80, 120, 200, 300, 340, 400ms)

All hooks respect `prefers-reduced-motion`.

## Cards & Surfaces

### Padding tiers

| Context | Padding | Token |
|---|---|---|
| Standard card (FSurface default) | 20px | `Space[5]` |
| Compact stat cell (grid items) | 16px | `Space[4]` |
| **Never less than** | **16px** | — |

### Internal spacing

| Context | Gap | Value |
|---|---|---|
| Label → content below it | 14px | FLabel default `mb` |
| FSurface title → body | 12px | `Space[3]` |
| Row icon → text gap | 16px | FListRow `gap` |
| Row vertical padding | 18px compact / 20px default | FListRow |
| List item name → subtitle | 5px | FListRow internal |
| Between sections inside card | 16px | `Space[4]` |
| Between major screen sections | 28px | `Space[7]` |
| Screen horizontal inset | 24px | Content padding |

### Border radius

| Context | Radius | Token |
|---|---|---|
| Cards, panels | 12px | `Radius.lg` (FSurface default) |
| Chips, pills | 20px / full | `Radius.full` |
| Icon circles | 50% | — |

### Section weight tiers (R4)

Every detail page uses three visual weight tiers below the hero. These are concrete CSS recipes — not FSurface variants, just inline styles that enforce the hierarchy.

**Primary — tinted card or data visualization:**
Used for content that benefits from containment: data visualizations (macro bar chart, form cues with context). Only the content that *needs* a boundary gets one.

```jsx
// Tinted card (for visualizations, form cues)
{ background: alpha(catColor, 0.06), borderRadius: Radius.lg, padding: '16px 18px' }

// Surface card (for data grids like macro split)
{ background: Color.surface, borderRadius: Radius.lg, border: `1px solid ${Color.borderSoft}`, padding: 16 }
```

**Secondary — flat type + dividers:**
The default for most content. Label → content, separated by `borderSoft` dividers. No background, no border-radius. Prescriptions, stat rows, exercise lists, modality lists all use this tier.

```jsx
<div style={{
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 0',
  borderTop: `1px solid ${Color.borderSoft}`,
}}>
  {/* label left, value right */}
</div>
```

**Tertiary — muted plain text:**
Used for edge-case info (injury cautions, body profile, supplementary context). No card, no border, smallest type.

```jsx
<div>
  <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 4 }}>INJURY CAUTIONS</div>
  <div style={{ ...Type.bodySm, color: Color.mute, lineHeight: 1.5 }}>Plain sentence here.</div>
</div>
```

### Content grouping principle

Group sections by the user's question, not by data type. Each detail page should flow like a conversation:

**Goal Detail**: "What's the deal?" (hero + caloric state) → "How do I train?" (modalities + sessions) → "How do I eat?" (macros + meal prep) → "Is this right for me?" (body profile)

**Exercise Detail**: "What is this?" (hero + muscles) → "How do I do it?" (form cue) → "How much?" (prescriptions) → "Where does it fit?" (goals + injury) → "Can I change it?" (swap)

**Workout Template**: "What's the protocol?" (hero + caloric contract) → "What does a week look like?" (frequency + split, inline) → "What does a day look like?" (session exercises) → "How does it adapt?" (protocol note) → "What can I do?" (actions)

### Hero pattern — flat, not carded

Heroes on detail pages use flat type on the page background. No tinted card, no border. The category label + large title + subtitle + optional anchor number (caloric modifier, etc.) sit directly on `Color.bg`. A thin `borderSoft` divider closes the hero section.

```jsx
<div style={{ marginBottom: 20 }}>
  <div style={{ ...Type.labelSm, color: goalColor, marginBottom: 6 }}>{category}</div>
  <div style={{ fontFamily: Font.sans, fontSize: 28, fontWeight: 300, color: Color.text, lineHeight: 1.1, marginBottom: 6 }}>{title}</div>
  <div style={{ ...Type.bodyMd, color: Color.dim, marginBottom: 12 }}>{subtitle}</div>
  {/* Optional: caloric anchor number */}
  <div style={{ height: 1, background: Color.borderSoft, marginTop: 16 }} />
</div>
```

Exception: ExerciseDetail keeps the hero icon circle (44px, category-colored) alongside the flat type for visual landmark.

### Hero icon circle

A category-colored filled circle with a white-on-dark icon. Used as the visual landmark on detail pages (R3). Always paired with a title to the right.

```jsx
<div style={{
  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
  background: catColor,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
  <FIcon path={catIcon} size={22} color={Color.bg} stroke={1.8} />
</div>
```

Icon mapping: `compound → ICONS.dumb`, `isolation → ICONS.dumb`, `core → ICONS.flame`, `cardio → ICONS.timer`, `hiit → ICONS.flame`, `mobility → ICONS.expand`.

### Dot-label pill

Replaces bordered mono-text goal badges. Used for secondary-weight tag displays where you need color grouping at a glance without the visual weight of FTag.

```jsx
<span style={{
  display: 'flex', alignItems: 'center', gap: 5,
  fontSize: 12, fontFamily: Font.sans,
  padding: '4px 10px', borderRadius: 999,
  background: alpha(meta.color, 0.10), color: meta.color,
}}>
  <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
  {meta.label}
</span>
```

**When to use dot-label pills vs FTag:** Pills are for read-only association lists (goals an exercise belongs to, modalities a session uses). FTag is for interactive or status contexts (TODAY, DONE, category filters).

### Inline stat row

For 2–4 key numbers on a detail page. Uses flat `space-between` rows with `borderSoft` dividers — no card background. Labels in `labelSm` above values at 15px/500.

```jsx
<div style={{
  display: 'flex', justifyContent: 'space-between',
  padding: '14px 0',
  borderTop: `1px solid ${Color.borderSoft}`,
  borderBottom: `1px solid ${Color.borderSoft}`,
}}>
  <div>
    <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>FREQUENCY</div>
    <div style={{ fontFamily: Font.sans, fontSize: 15, fontWeight: 500, color: Color.text }}>3-4</div>
    <div style={{ ...Type.bodySm, color: Color.mute, marginTop: 2 }}>days/wk</div>
  </div>
  <div style={{ textAlign: 'right' }}>
    <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>SPLIT</div>
    <div style={{ fontFamily: Font.sans, fontSize: 15, fontWeight: 500, color: Color.text }}>Full-Body</div>
  </div>
</div>
```

Pair two stats per row. If 4 stats, use two rows — first bordered top/bottom, second with no bottom border. This replaces the 2×2 card grid for plan parameter display.

### Rules

1. Never set card padding below 16px (`Space[4]`).
2. Default card `borderRadius` is `Radius.lg` (12px) — don't override unless intentional.
3. Use `FSurface` for all card containers — don't hand-roll `background + border + borderRadius`. Exception: tinted hero cards and left-border callouts use inline styles intentionally (they're not generic containers).
4. Stat cells in 2–3 column grids may use `padding: 16` with `textAlign: 'center'`.
5. Standalone content cards should use the default 20px padding (no override needed).
6. List row names: 14px / 500 weight. Subtitles: 5px gap below name.
7. Use `alpha()` for all color tinting — never concatenate hex suffixes (`${color}0a`).
8. Detail pages follow the three-tier weight hierarchy: primary (tinted card for visualizations) → secondary (flat type + dividers) → tertiary (muted text only).
9. Detail page heroes are flat type on `Color.bg` — no card background. Only data visualizations and form cues get contained cards.
10. Group content by user question, not by data type. See "Content grouping principle" above.

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
| `FDataCard` | Hero data card with metrics | `category`, `categoryColor`, `title`, `subtitle`, `metrics`, `footer` |
| `FAvatar` | User initials/image circle | `initials`, `tone`, `size`, `image` |
| `FSection` | Section wrapper with label | `label`, `action`, `children`, `mb`, `mt` |

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

28 general icons in `ICONS` object (`src/ui/components.jsx`, SVG path strings): back, fwd, close, plus, minus, check, more, search, flame, dumb, person, meal, cart, chart, goal, timer, pause, play, pan, fire, bowl, bell, filter, trend_up, trend_dn, swap, sparkle, expand.

24 cooking action icons in `COOK_ICONS` (`src/ui/icons.jsx`): dice, chop, slice, sear, roast, bake, sauté, grill, boil, simmer, steam, pour, mix, fold, whisk, blend, prep, measure, season, rest, plate, garnish, serve, portion.

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
