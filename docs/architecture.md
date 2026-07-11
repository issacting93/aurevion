# AUREVI0N — System Architecture

## Overview

AUREVI0N is a fitness and nutrition app built as a React 18 prototype with Vite. It operates on a closed-loop cybernetic model: **Seed → Decide → Plan → Act → Observe** (SDPAO). The user's body profile, goals, and constraints seed the system; the app generates personalized training programs and meal plans; the user executes them; observation data feeds back to adjust targets.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 18.3 | Functional components, hooks only |
| Build | Vite 6.3 | ESM, HMR, no SSR |
| Routing | React Router 7.6 | Client-side SPA |
| 3D | Three.js + React Three Fiber + Drei | Body composition viewer |
| State | React Context + localStorage | No backend, no database |
| Styling | Inline styles + design tokens | No CSS framework, no Tailwind |
| Testing | Playwright | E2E only, no unit tests yet |

## Directory Structure

```
src/
├── app/
│   ├── Shell.jsx              # 5-tab navigation shell (Home/Train/Eat/Plan/You)
│   └── screens/               # All app screens (30+ files)
│       ├── Onboarding.jsx     # 12-step onboarding flow
│       ├── Dashboard.jsx      # Personalized tile grid
│       ├── fitness-data.js    # 72 exercises + program generator + grouping + RIR helpers
│       ├── ProgramOverview.jsx # Weekly plan with goal tags + superset indicators
│       ├── Training.jsx       # Active session (review → execute w/ RPE+RIR+load adjust+groups → summary)
│       ├── GoalDetail.jsx     # Goal cascade + linked sessions from plan
│       ├── ExerciseBrowser.jsx # Filter + browse 72 exercises
│       ├── ExerciseDetail.jsx # Form cues, muscles, injuries, goals
│       ├── WorkoutTemplateDetail.jsx # Sample session + protocol
│       ├── MealPrep.jsx       # Cook mode (merge → timeline → active)
│       ├── PlanCalendar.jsx   # Month/week/day calendar
│       ├── CheckIn.jsx        # Weekly weigh-in + decision engine
│       ├── tiles.jsx          # 10 dashboard tile components (incl. WaterTile)
│       └── index.js           # Screen registry (55 screens)
├── context/
│   ├── UserContext.jsx        # Global state: profile, targets, plans, activity log
│   ├── NavigationContext.jsx  # Tab + detail stack navigation
│   └── DemoContext.jsx        # Presentation demo state
├── ui/
│   ├── tokens.js              # Color, Font, Space, Radius, Type, Duration, Ease
│   ├── components.jsx         # 20+ primitives (FSurface, FBtn, FTag, FIcon, etc.)
│   ├── chart.jsx              # 7 chart types (Line, Bar, Gauge, Lollipop, etc.)
│   ├── motion.js              # useSpring, useStaggerEntrance, SpringPreset
│   ├── BodyPreview.jsx        # 3D body viewer with GLSL shaders
│   └── icons.jsx              # 26 cooking action icons
├── pages/                     # Top-level route pages
│   ├── Home.jsx               # Desktop hub with NavCards
│   ├── AppFlow.jsx            # Product demo entry
│   ├── Landing.jsx            # Marketing page
│   └── BodyViewer.jsx         # 3D body composition page
└── tools/                     # Design & dev tools
    ├── journey/               # SDAO journey explorer
    │   ├── JourneyHub.jsx     # Hub with diagrams + mode cards
    │   ├── JourneyLayout.jsx  # Shared nav shell
    │   ├── ModeOverview.jsx   # Cooking/Exercise mode detail
    │   ├── FlowPage.jsx       # CRUD flow explorer
    │   └── journey-data.jsx   # Phase definitions, flows, data models
    ├── ontology/              # Domain explorer (scenario planner, exercise library, goal cards)
    ├── goal-network/          # Interactive goal graph
    │   ├── GoalNetwork.jsx    # Main page with SVG canvas + detail panel
    │   ├── goal-network-data.js # 32 nodes, 65 edges, layout
    │   └── goal-network-shared.jsx # SVG primitives
    ├── UILibrary.jsx          # Component showcase
    ├── DevHandover.jsx        # Developer reference
    ├── Scenes.jsx             # Motion graphics
    └── Trailer.jsx            # Auto-playing product video
```

## State Architecture

### UserContext

Single React Context with localStorage persistence. No backend.

```
state = {
  profile: {
    sex, birthYear, height, weight, bodyFat,
    activityLevel, liftingExp, cardioExp,
    goal,                    // primary caloric goal (build/lose/maintain/recomp)
    goals: [],               // selected goal keys (e.g. ['recomposition', 'cook_more'])
    dietary: [],             // dietary constraints
    equipment,               // gym equipment level
    availableDays: [],       // training days
    injuries: [],            // injury exclusions
  },
  targets: {
    tdee, target,            // computed caloric targets
    protein, fat, carbs,     // computed macro targets (grams)
  },
  workoutPlan: {             // auto-generated from goals + constraints
    splitLabel,              // 'Full Body' / 'Upper / Lower' / 'Push / Pull / Legs'
    programName,             // e.g. 'Upper / Lower · Hypertrophy + HIIT'
    modalities: [],          // active training modalities
    sessions: [],            // training sessions with exercises
    schedule: [],            // full week (sessions + rest days)
    goals: [],               // goals that generated this plan
    totalWeeks: 12,          // program duration (fixed for prototype)
    currentWeek: 1,          // current week (incremented by advanceWeek)
    phase: 'Base',           // current phase: 'Base' (1-4), 'Build' (5-8), 'Peak' (9-12)
  },
  preferences: { layout },  // dashboard preset (balanced/nutrition/training)
  onboarded: boolean,
  checkins: [],              // weekly weigh-in history
  interventions: [],         // coaching alerts (active/dismissed)
  activityLog: [],           // timestamped events (meal/water/workout/cook)
}
```

### Navigation

Stack-based detail navigation within a 5-tab shell:

```
AppShell → NavigationProvider
  ├── TabRouter (home/train/eat/plan/you)
  ├── DetailRouter (pushed overlays with data passing)
  └── ShellTabBar
```

`pushDetail(screen, title, data)` opens an overlay. `popDetail()` closes it. Tab switching clears the detail stack.

## Key Pipelines

### 1. Onboarding → Targets

```
12-step onboarding
  → computeTDEE(profile)        # Mifflin-St Jeor BMR × activity multiplier
  → computeMacros(profile)      # TDEE + goal modifier → protein/fat/carbs
  → generateProgram(profile)    # goals + constraints → weekly training plan
  → completeOnboarding()        # saves profile + targets + plan to state
```

### 2. Program Generation

```
generateProgram({ goals, equipment, availableDays, injuries, experience })
  1. Map goals → training modalities (GOAL_MODALITIES lookup)
  2. Pick split: 2-3 days → Full Body, 4 → Upper/Lower, 5-6 → PPL
  3. For each day: filter exercises by equipment + injuries + modality
  4. Assign sets/reps/load by modality config
  5. Add warmup + cooldown
  6. Return { sessions, schedule, splitLabel, programName, totalWeeks, currentWeek, phase }
```

### 3. Active Session

```
ProgramOverview → tap "Start" → pushDetail('active-session', session)
  → Review phase: exercise list + goal source tags + superset/circuit grouping preview
  → Execute phase: set-by-set logging (reps, load, RPE + RIR) + load adjustment suggestions
    + group-aware flow (no rest between superset exercises) + rest timer
  → Summary phase: computed volume, avg RPE, avg RIR, load progressions, exercise breakdown
  → logWorkout() → activityLog
  → markSessionComplete() → workoutPlan
```

### 4. Check-in Feedback Loop

```
CheckIn (weekly)
  → log weight + body fat + subjective rating
  → computeDecision(checkins, targets)
  → if weight loss > threshold → addIntervention('adjust deficit')
  → updates profile.weight → recomputes macros
```

### 6. Week Advancement

```
advanceWeek()
  → increment workoutPlan.currentWeek (max totalWeeks)
  → recalculate phase via getProgramPhase(newWeek)
  → reset all session.completed and schedule.completed flags
  → persist to localStorage
```

### 5. Behavioral Metrics (derived)

```
computeBehavioralMetrics(activityLog)  // 7-day rolling window
  → adherence (meal logging consistency)
  → protein_hit_ratio_7d
  → home_cook_7d
  → water_intake_rate_7d
  → workouts_7d
```

## Design System

All visual decisions flow from `src/ui/tokens.js`:

- **Palette**: Black bg, dark surfaces (#0d0d0d → #1e1e1e), accent #FF6E50, semantic colors (green/red/blue/purple)
- **Typography**: Geist (sans), Geist Mono (mono). Mono for labels/data, sans for body/headings.
- **Motion**: Spring-based (useSpring), stagger entrances, 0.08s–0.8s durations
- **Components**: 20+ primitives — all inline styled, no className, no CSS modules

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | Home | Desktop navigation hub |
| `/app` | AppFlow | Interactive product demo (phone shell) |
| `/landing` | Landing | Marketing page |
| `/library` | UILibrary | Component showcase |
| `/demo` | DevHandover | Developer reference |
| `/journey` | JourneyLayout | Journey explorer shell |
| `/journey/cooking` | ModeOverview | Cooking mode screens |
| `/journey/exercise` | ModeOverview | Exercise mode screens |
| `/journey/goals` | GoalNetwork | Interactive goal graph |
| `/body` | BodyViewer | 3D body composition |
| `/scenes` | Scenes | Motion graphics |
| `/trailer` | Trailer | Auto-playing video |
