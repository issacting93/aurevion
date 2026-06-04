# Aurevion — Design & Systems Review

## 1. Current System Audit

### What exists
The shared component library (`shared.jsx`) provides 18 primitives:

| Component | Purpose | Density-aware? |
|-----------|---------|:-:|
| `Phone` | 402x874 device frame | no |
| `FNavBar` | Page chrome (title + leading/trailing) | no |
| `FLabel` | Uppercase mono label | no |
| `FMono` | Inline monospace value | no |
| `FNum` | Large thin numeral + optional unit | partial (size prop) |
| `FTexBar` | Textured progress bar (hatching, animated) | partial (height prop) |
| `FSegBar` | Staggered segment gauge | partial |
| `FScale` | Tick mark ruler | no |
| `FIcon` | SVG icon wrapper (48 icons) | no |
| `FTag` | Mono chip (5 tones, 2 sizes) | no |
| `FBtn` | Button system (6 variants) | partial (3 sizes) |
| `FIconBtn` | Icon-only round button | no |
| `FTabBar` | Bottom navigation (5 fixed tabs) | no |
| `FSection` | Block with label header | no |
| `FToolbar` | 3-cell bottom bar | no |
| `FJewel` | Iridescent hero button | no |
| `FPulseBtn` | Play button with pulse ring | no |
| `FStagger` | Staggered entrance animation | no |

### Design tokens
Solid foundation. `F` object (13 colors), `FF` (2 font stacks), plus the motion system (`motion.jsx`) with well-defined timing hierarchy and reduced-motion support.

### What's missing

**No density-aware container system.** Every screen is a bespoke vertical stack. Cards are built inline with hardcoded padding, radii, and gaps. There's no concept of a "tile" that can render the same data at different information densities.

**No grid system.** All layouts are single-column flex stacks. The 402px phone width can support a 2-column grid (2 x 175px tiles with 10px gap and 16px side padding).

**No dashboard.** The app has 8 feature modules but no unified home screen that surfaces the most relevant data from each. Users must navigate into each module separately.

**Ad-hoc patterns repeated inline:**
- Stat cards (surface + border + padding + label + number) — reimplemented in every feature
- List rows (divider + flex + metadata) — different spacing in macros vs. fridge vs. profile
- Expandable panels — custom in 03-macros, no shared component
- Slider input — custom in 01-goal-setting, not reusable
- SVG charts — inline in 02-tdee and 05-meal-prep, not abstracted

---

## 2. Tile System Architecture

### The problem
The app has rich data across 8 domains (goal, TDEE, macros, calendar, training, prep, fridge, check-ins). On dedicated feature screens, each domain gets full real estate. But a dashboard needs to show a cross-section — and different users care about different things at different times.

### The solution: 3-state density tiles

Every tile component renders at three density levels:

```
full     — expanded view with all context
mid      — default, balanced information density
compact  — glanceable data point, minimal chrome
```

This isn't "responsive breakpoints" — it's information design. A cutting athlete sees macros at `full` and training at `compact`. A strength athlete sees the inverse. The density is a user preference tied to their current goal phase.

### Density affects:

| Property | Full | Mid | Compact |
|----------|------|-----|---------|
| Padding | 16px | 14px | 10px |
| Border radius | 14px | 12px | 10px |
| Number size | 28-36px | 22-28px | 18-22px |
| Label | visible + tag | visible | 8px micro or hidden |
| Metadata | 2-3 lines | 1 line | none |
| Progress bar | 6-8px tall | 4-6px | 3-4px |
| Lists | full rows | summary count | hidden |
| Charts | with band + axis | sparkline | sparkline mini |

### Grid column span:

| Density | Default span | Override? |
|---------|-------------|-----------|
| Full | 2 (full width) | yes |
| Mid | 1 or 2 | yes |
| Compact | 1 (half width) | no |

---

## 3. Tile Component Catalog

### Built (9 tiles)

| Tile | Data domain | Full | Mid | Compact |
|------|-------------|------|-----|---------|
| `GoalTile` | Active contract | Range + bar + weeks remaining | Range + bar + week count | Arrow notation + mini bar |
| `TDEETile` | Energy model | Number + band graph + confidence | Number + tag + sparkline | Number + micro sparkline |
| `MacroTile` | Nutrition | 3-col grid with bars | Inline P/C/F values | Number + stacked ratio bar |
| `CalendarTile` | Plan health | 7-day grid with hatching + detail | 7-day dots with checks | Done count + segment bar |
| `SessionTile` | Training | Exercise list with sets | Name + time + count | Icon + name + time |
| `PrepTile` | Meal prep | Recipe list with portions | Recipe count + readiness | Icon + count + time |
| `CheckInTile` | Body metrics | 3-row history with deltas | Weight + BF + trend arrow | Weight + trend icon |
| `FridgeTile` | Pantry inventory | Missing items list + expiring | Item count + missing tag | Missing count only |
| `StreakTile` | Consistency | Flame + days + best + bar | Flame + days | Flame + number |

### Possible future tiles

- `SleepTile` — hours + quality + trend
- `HydrationTile` — daily intake vs target
- `RecoveryTile` — HRV / readiness score
- `SupplementTile` — today's stack with timing
- `NoteTile` — freeform user annotation

---

## 4. Dashboard Design

### Principle: one personalised screen, uniform flows

The dashboard is the **only** screen that adapts to the individual. Every other flow (goal setting, TDEE, training session, meal prep) is uniform — same layout for every user. This keeps the core experience consistent and testable.

The dashboard is where personalisation lives.

### Layout presets (3 shipped)

**Balanced** — equal weight across domains:
```
[goal         mid  span-2]
[calendar     mid  span-2]
[macros       mid  span-2]
[session mid][prep     mid]
[tdee    mid][checkin  mid]
[fridge comp][streak comp]
```

**Nutrition Focus** — cutting phase, macros and prep front-and-centre:
```
[macros      full  span-2]
[goal   comp][streak  mid]
[prep        full  span-2]
[fridge full][checkin  mid]
[cal    comp][tdee   comp]
[session           compact]
```

**Training Focus** — strength block, session detail first:
```
[session     full  span-2]
[goal    mid][streak  mid]
[calendar    full  span-2]
[checkin     full  span-2]
[tdee    mid][macros comp]
[fridge comp][prep  comp]
```

### Personalisation model

Layout presets are a starting point. The full personalisation model supports:

1. **Tile selection** — show/hide tiles
2. **Density per tile** — full/mid/compact per tile
3. **Ordering** — drag to reorder
4. **Column span** — 1 or 2 columns per tile
5. **Context-aware defaults** — system suggests layout based on:
   - Current goal phase (cutting → nutrition focus)
   - Day type (training day → session tile promoted)
   - Time of day (evening → prep tile promoted)
   - Missing data (no check-in this week → check-in tile promoted)

---

## 5. Grid System Dimensions

```
Phone width:     402px
Side padding:     16px each = 32px
Available grid:  370px
Column count:     2
Gap:             10px
Column width:    180px each

Tile padding:
  full:    16px → content area: 148px (span-1) or 338px (span-2)
  mid:     14px → content area: 152px (span-1) or 342px (span-2)
  compact: 10px → content area: 160px (span-1) or 350px (span-2)
```

---

## 6. Component hierarchy

```
Phone
└── DashboardScreen
    ├── Header (greeting + avatar)
    ├── DensityControl (BAL / NUT / TRN toggle)
    └── FTileGrid (2-col CSS grid)
        ├── GoalTile      { density, span }
        ├── CalendarTile   { density, span }
        ├── MacroTile      { density, span }
        ├── SessionTile    { density, span }
        ├── PrepTile       { density, span }
        ├── TDEETile       { density, span }
        ├── CheckInTile    { density, span }
        ├── FridgeTile     { density, span }
        └── StreakTile      { density, span }
```

Each tile internally uses existing primitives (`FLabel`, `FNum`, `FMono`, `FTexBar`, `FTag`, `FIcon`) — no new primitives were needed. The tile system is a composition layer, not a replacement.

---

## 7. What this changes

### Before
- 19 screens, no home base
- Every screen is a bespoke single-column layout
- No way to surface cross-domain data at a glance
- Same layout for all users

### After
- 22 screens (3 dashboard variants added)
- Modular tile system with 9 tile types
- 3 density states per tile (full / mid / compact)
- 2-column grid on dashboard
- 3 layout presets showing personalisation in action
- Core flows unchanged — only the dashboard is personalised

### Files added
- `src/features/tiles.jsx` — `FTileGrid`, `FTile`, and 9 density-aware tile components
- `src/features/11-dashboard.jsx` — Dashboard screen with 3 layout presets + density control

### Files modified
- `pages/demo.html` — added script includes for tiles + dashboard
- `src/features/demo.jsx` — added 3 dashboard screens to SCREENS array, renumbered flows
