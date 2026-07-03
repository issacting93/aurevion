# Component Map — System to Feature Layer

The Aurevion prototype has two component layers:

- **UI layer** (`src/ui/`) — Design tokens, primitives, charts, motion, 3D body viewer. This is the source of truth for visual decisions.
- **Screen layer** (`src/app/screens/`) — Domain-specific screens that compose UI primitives into flows. Each screen exports a `Content` component (used in Shell) and a `Screen` wrapper (used in journey/galleries).

Tokens derive from `src/ui/tokens.js`. All styling is inline — no CSS modules, no Tailwind.

---

## UI Primitives (`src/ui/components.jsx`)

| Component | Purpose | Key Props | Notes |
|---|---|---|---|
| `Phone` | iPhone frame (402×874) with status bar | `statusTime`, `label`, `group` | Not needed in RN |
| `FSurface` | Card container with optional accent border | `accent`, `tone`, `icon`, `title` | → RN `View` with `borderRadius` |
| `FBtn` | Button (6 variants) | `variant` (primary/ghost/split), `size` (sm/md/lg), `icon`, `full` | → RN `Pressable` |
| `FTag` | Badge/tag | `tone` (accent/green/red/mute), `size` | → RN `View` + `Text` |
| `FLabel` | Mono uppercase section label | `size`, `mb`, `letter`, `color` | Trivial in RN |
| `FMono` | Inline monospace text | `size`, `color`, `letter` | Trivial in RN |
| `FNum` | Large number display | `size`, `weight`, `unit`, `color` | Trivial in RN |
| `FIcon` | SVG icon wrapper | `path`, `size`, `color`, `stroke` | → `react-native-svg` |
| `FTexBar` | Animated progress bar | `pct`, `height`, `color`, `radius` | → RN Animated width |
| `FRing` | Circular progress ring | `pct`, `size`, `stroke`, `color` | → SVG arc |
| `FScale` | Visual tick ruler | `marks`, `active` | Pattern only |
| `FCheckbox` | Checkbox with tone | `checked`, `tone`, `onChange` | → RN Pressable |
| `FListRow` | List item | `leading`, `title`, `subtitle`, `trailing`, `divider` | → RN FlatList row |
| `FNavBar` | Navigation header | `title`, `leading`, `trailing` | → RN `@react-navigation` header |
| `FTabBar` | Bottom tab navigation | `active`, `items` | → `@react-navigation` BottomTabs |
| `FToolbar` | Action toolbar | `cells: [{icon, label, primary}]` | Pattern only |
| `FButtonGroup` | Radio button group | `items`, `active`, `onChange` | Pattern only |
| `FStagger` | Staggered entrance wrapper | `children`, `delay` | → Reanimated |
| `ErrorBoundary` | Error catch wrapper | `children` | Standard React pattern |

## Chart System (`src/ui/chart.jsx`)

| Chart | Use Case | Key Props |
|---|---|---|
| `LineChart` | Weight trends, TDEE | `data[]`, `target`, `band`, `xLabels`, `animated` |
| `BarChart` | Macro comparison, volume | `data[]`, `stacked`, `showValues` |
| `GaugeChart` | Body fat %, completion | `value`, `min`, `max`, `size`, `color` |
| `LollipopChart` | Sleep, discrete data | `data[]`, `goal`, `highlight` |
| `WaveformChart` | Heart rate, activity | `data[]`, `barWidth`, `gap` |
| `Sparkline` | Inline trend (no card) | `data[]`, `width`, `height`, `fill`, `dot` |
| `AreaChart` | Multi-series stacked | `series[]`, `showLine`, `showDots` |

All charts are pure SVG with Catmull-Rom smoothing. Viewbox: 400px wide.

## Motion System (`src/ui/motion.js`)

| Hook | Purpose |
|---|---|
| `useSpring(target, preset)` | Physics-based spring animation |
| `useScrollReveal(ref)` | Intersection observer entrance |
| `useStaggerEntrance(count, delay)` | Timed list entrance |
| `useTransitionLock(duration)` | Prevents double-trigger |
| `usePageTransition()` | Page transition state machine |

Presets: `SpringPreset.default`, `.snappy`, `.gentle`, `.stiff`

## 3D Body System (`src/ui/BodyPreview.jsx`)

- React Three Fiber + Drei (OrbitControls, useGLTF)
- 10 GLB models: male/female × lean/average/athletic/heavy/stocky
- GLSL shader for muscle group highlighting with wave animation
- Fresnel rim lighting, auto-rotate turntable

## Icon Libraries

| Set | File | Count | Type |
|---|---|---|---|
| `ICONS` | `src/ui/components.jsx` | 31 | General UI (back, fwd, check, flame, dumb, meal, etc.) |
| `COOK_ICONS` | `src/ui/icons.jsx` | 26 | Kitchen actions (dice, sear, boil, whisk, plate, etc.) |

Both use `viewBox="0 0 24 24"`, stroke-based, portable to `react-native-svg`.

---

## Screen Layer (`src/app/screens/`)

### Export Pattern

Every screen exports two components:

```jsx
// Content: used in Shell (no frame wrapper)
export function ScreenNameContent({ props }) { ... }

// Screen: used in journey explorer, galleries, demo (has Phone frame)
export function ScreenNameScreen() {
  return <Phone><FNavBar /><ScreenNameContent /><FTabBar /></Phone>
}
```

### Screen Registry (`src/app/screens/index.js`)

51 screens registered with `{ id, feature, flow, label, C }`. Used by the Demo, Library, and Journey tools.

### Active Mode Pattern (Fitness + Cooking)

Both focused modes follow the same structure:

```
Sticky header (timers, progress rail)     — flexShrink: 0
Main content (step/exercise focus)        — flex: 1, overflowY: auto
Bottom toolbar (pause, skip, end)         — flexShrink: 0
```

Timer: `setInterval(1000ms)` with pause flag, `Math.max(0, rem - 1)` countdown.

---

## Domain Logic Files

| File | Purpose |
|---|---|
| `fitness-data.js` | 48 exercises, equipment mapping, goal→modality, `generateProgram()` |
| `goal-network-data.js` | 32 nodes, 65 edges, concentric ring layout, connection helpers |
| `Onboarding.jsx` | Goal taxonomies (`OB_FITNESS_GOALS`, `OB_NUTRITION_GOALS`), TDEE/macro computation |

## Context Layer (`src/context/`)

| Context | Purpose | Key Methods |
|---|---|---|
| `UserContext` | Global state with localStorage persistence | `completeOnboarding`, `logWorkout`, `logMeal`, `logCheckin`, `regeneratePlan`, `markSessionComplete` |
| `NavigationContext` | Tab + detail stack navigation | `switchTab`, `pushDetail(screen, title, data)`, `popDetail` |
| `DemoContext` | Presentation demo state | Demo flow control |
