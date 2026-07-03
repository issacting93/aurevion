# AUREVI0N — Build Progress

Last updated: 2026-07-03

## What's Been Built

### Session 1: Goal Network + Fitness Documentation
- Interactive goal network graph at `/journey/goals` — 32 nodes, 65 edges, 5 categories, click-to-highlight, detail panel
- Comprehensive `fitness.md` — goals, training modalities, body profiles, macro ratios, workout templates, constraint matrices, meal timing
- Updated all existing docs (user-flows, component-map, state-specs, focused-mode-journey)

### Session 2: Full Fitness Mode
- Program generation engine (`fitness-data.js`) — 48 exercises, equipment filtering, injury exclusion, goal→modality mapping, split selection, `generateProgram()`
- Program Overview screen — weekly training plan view with session cards, modality tags, exercise previews, Start button
- Active Training Session — 3-phase: Review (exercise list) → Execute (set logging, RPE 5-10, rest timer, progress rail) → Summary (auto-computed volume, avg RPE)
- Workout Summary — computed from logged data, not hardcoded
- UserContext extended — `workoutPlan` state, auto-generates on onboarding, `markSessionComplete()`, `regeneratePlan()`
- Dashboard wired to real data — session tile pulls from workoutPlan, calendar from schedule, layout auto-selects from goals, goal tags shown under greeting

### Session 3: Journey Explorer + Documentation
- Onboarding Mode (`/journey/seed`) — 4 phases, 13 screens
- Decide Mode (`/journey/decide`) — dashboard presets
- Observe Mode (`/journey/observe`) — check-in, daily logging, analytics, profile
- All modes added to journey nav + hub page
- New docs: `architecture.md`, `product-goals.md`, `program-generation.md`, `design-system.md`
- All existing docs rewritten with current state

### Session 4: Ontology Explorer + Domain Data
- `ontology-data.js` — codified all fitness.md prose: macro ratios, body fat ranges, somatotypes, workout templates, injury/equipment overrides, meal timing, caloric state mappings
- Ontology Explorer at `/journey/explore` — 3-tab tool (Scenario Planner, Exercise Library, Goal Cards)
- Scenario Planner — toggle goals/equipment/days/injuries → live program + macros + meal prep update
- Exercise Library (tool version) — filterable 48-exercise browser with reverse goal lookup
- Goal Detail Cards (tool version) — full cascade per goal

### Session 5: Real App Screens + Journey Cleanup
- **GoalDetail.jsx** — app screen showing caloric state, macro split, modalities, meal prep, body profile for any goal
- **ExerciseBrowser.jsx** — app screen with category filter tabs, 48 exercises, tap to drill down
- **ExerciseDetail.jsx** — app screen with form cues, muscles, injury cautions, goal usage, modality prescriptions
- **WorkoutTemplateDetail.jsx** — app screen with sample session, protocol, frequency, injury alternatives
- Shell wired — 4 new detail routes, navigation from ProgramOverview
- Journey exercise mode cleaned — goal selector + inline goal network graph + phase strips with real phone screen previews
- Exercise phases updated — Goal Detail in GOALS, Exercise Browser + Detail + Template in PROGRAM

---

## Screen Inventory

### App Screens (inside phone shell) — 29 screens

| Screen | File | Status | Notes |
|---|---|---|---|
| Welcome | Welcome.jsx | Built | Onboarding entry |
| Onboarding (12 steps) | Onboarding.jsx | Built | Full 12-step flow with TDEE/macro computation |
| Dashboard (3 presets) | Dashboard.jsx | Built | Goal-driven layout, real data from workoutPlan |
| Goal Setting + Contract | GoalSetting.jsx | Built | Slider + timeline + pace + contract |
| **Goal Detail** | GoalDetail.jsx | **New** | Caloric state, macros, modalities, meal prep, body profile |
| TDEE + Compare | TDEE.jsx | Built | Today's estimate + confidence comparison |
| Macro Targets + Meals + Shopping | Macros.jsx | Built | Weekly P/C/F + meal queue + shopping list |
| Batch Prep | BatchPrep.jsx | Built | Batch optimization strategy |
| Fridge / Pantry | Fridge.jsx | Built | Filter tabs (ALL/MISSING/EXPIRING) |
| Meal Prep (3 views) | MealPrep.jsx | Built | Merge → Timeline → Active Cook Mode |
| Cook Summary | CookSummary.jsx | Built | Post-cook recap |
| Program Overview | ProgramOverview.jsx | Built | Weekly plan, session cards, browse/goal links |
| **Exercise Browser** | ExerciseBrowser.jsx | **New** | Category filter, 48 exercises, tap to detail |
| **Exercise Detail** | ExerciseDetail.jsx | **New** | Form cues, muscles, injuries, goals, prescriptions |
| **Workout Template** | WorkoutTemplateDetail.jsx | **New** | Sample session, protocol, frequency, injury alts |
| Active Training | Training.jsx | Built | Review → Execute (RPE, rest timer) → Summary |
| Workout Summary | WorkoutSummary.jsx | Built | Auto-computed volume, sets, avg RPE |
| Plan Calendar (3 views) | PlanCalendar.jsx | Built | Month/Week/Day views |
| Check-in (4 steps) | CheckIn.jsx | Built | Weight → BF → Rating → Decision |
| Profile | Profile.jsx | Built | Account hub, streaks |
| Food Log | FoodLog.jsx | Built | Daily meal logging |
| Water Tracking | WaterTracking.jsx | Built | Hydration ring + quick add |
| Macro Heatmap | MacroHeatmap.jsx | Built | 8-week adherence grid |
| Feature Card Morph | FeatureCardMorph.jsx | Built | Card → cook mode transition |

### Journey/Tool Pages — 10 pages

| Page | Route | Status |
|---|---|---|
| Journey Hub | `/journey` | Built — SODA loop, data models, goal taxonomy, decision tree, act/observe, mode cards |
| Seed Mode | `/journey/seed` | Built — 4 phases, 13 onboarding screens |
| Decide Mode | `/journey/decide` | Built — dashboard presets |
| Cooking Mode | `/journey/cooking` | Built — 4 phases, CRUD flows |
| Exercise Mode | `/journey/exercise` | Built — goal selector, inline graph, 4 phases with new screens |
| Observe Mode | `/journey/observe` | Built — 4 phases (weekly, daily, analytics, account) |
| Goal Network | `/journey/goals` | Built — interactive SVG graph, 32 nodes, 65 edges |
| Ontology Explorer | `/journey/explore` | Built — 3-tab tool (Scenario/Exercises/GoalCards) |
| UI Library | `/library` | Built — component showcase |
| Dev Handover | `/demo` | Built — screen gallery, component catalog, tokens |

### Domain Data Files

| File | Contents |
|---|---|
| `fitness-data.js` | 48 exercises, GOAL_MODALITIES, MODALITY_CONFIG, EQUIPMENT_MAP, generateProgram() |
| `ontology-data.js` | MACRO_RATIOS, BODY_FAT_RANGES, SOMATOTYPES, GOAL_CALORIC_STATE, CALORIC_PREP, WORKOUT_TEMPLATES, INJURY_OVERRIDES, EQUIPMENT_OVERRIDES, MEAL_TIMING, TRAINING_MEAL_IMPORTANCE, GOAL_META |
| `goal-network-data.js` | 32 NODES, 65 EDGES, CATEGORIES, computeLayout, connection helpers |

---

## What's NOT Built Yet

### Critical for a working fitness app

| Feature | Status | What's needed |
|---|---|---|
| Program customization | Not built | Swap exercises, change days, adjust volume in generated plan |
| Workout history | Not built | Browse past sessions, compare to previous |
| PR tracking | Not built | Persist personal records, show on exercise detail |
| Progress analytics | Not built | Volume trends, strength curves, body comp over time |
| Calendar ↔ program sync | Not built | Calendar events should come from workoutPlan, not hardcoded |
| Exercise substitution | Not built | Swap exercises mid-session or in program |
| Periodization | Not built | Week-to-week progression (linear, undulating, block) |
| Auto-progression | Not built | Automatic weight increases based on RPE/performance |

### Critical for nutrition

| Feature | Status | What's needed |
|---|---|---|
| Recipe database | Not built | Recipes generated from macro targets |
| Meal plan generation | Not built | Algorithm: macro targets → weekly meal queue |
| Fridge ↔ shopping sync | Not built | Shopping completion updates fridge inventory |
| Cook → food log link | Not built | Completing cook mode auto-logs meals |

### Infrastructure

| Feature | Status | What's needed |
|---|---|---|
| Backend / API | Not built | Everything is localStorage |
| Authentication | Not built | No accounts, no login |
| Multi-device sync | Not built | No cloud persistence |
| Push notifications | Not built | No reminders or nudges |
| Session persistence | Not built | Active workout state lost on nav/close |
| Offline support | Not built | No service worker |

### Polish

| Feature | Status | What's needed |
|---|---|---|
| Empty states | Partial | ProgramOverview has one, most screens don't |
| Loading skeletons | Not built | All data loads instantly from localStorage |
| Error boundaries | Not built | No crash recovery |
| Audio/haptic cues | Not built | No rest timer sounds |
| Deload detection | Not built | No automatic deload scheduling |

---

## File Counts

| Directory | Files | Purpose |
|---|---|---|
| `src/app/screens/` | 29 | App screens + data |
| `src/tools/` | 21 | Journey explorer, goal network, ontology, dev tools |
| `src/ui/` | 6 | Design system (tokens, components, charts, motion, 3D, icons) |
| `src/context/` | 3 | UserContext, NavigationContext, DemoContext |
| `src/pages/` | 4 | Top-level routes (Home, AppFlow, Landing, BodyViewer) |
| `docs/` | 12 | Architecture, fitness, flows, design system, progress |
| **Total** | **75** | |
