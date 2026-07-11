# AUREVI0N — Build Progress

Last updated: 2026-07-05

## What's Been Built

### Session 1: Goal Network + Fitness Documentation
- Interactive goal network graph at `/journey/goals` — 32 nodes, 65 edges, 5 categories, click-to-highlight, detail panel
- Comprehensive `fitness.md` — goals, training modalities, body profiles, macro ratios, workout templates, constraint matrices, meal timing
- Updated all existing docs (user-flows, component-map, state-specs, focused-mode-journey)

### Session 2: Full Fitness Mode
- Program generation engine (`fitness-data.js`) — 72 exercises, equipment filtering, injury exclusion, goal→modality mapping, split selection, `generateProgram()`
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
- **ExerciseBrowser.jsx** — app screen with category filter tabs, 72 exercises, tap to drill down
- **ExerciseDetail.jsx** — app screen with form cues, muscles, injury cautions, goal usage, modality prescriptions
- **WorkoutTemplateDetail.jsx** — app screen with sample session, protocol, frequency, injury alternatives
- Shell wired — 4 new detail routes, navigation from ProgramOverview
- Journey exercise mode cleaned — goal selector + inline goal network graph + phase strips with real phone screen previews
- Exercise phases updated — Goal Detail in GOALS, Exercise Browser + Detail + Template in PROGRAM

### Session 6: Fitness Flow Restructure + Plan Calendar Wiring
- **fitness-data.js** — added `MODALITY_COLORS` export, `getProgramPhase(week)` helper, `generateProgram()` now returns `programName`, `totalWeeks`, `currentWeek`, `phase`
- **UserContext** — added `advanceWeek()` callback (increments week, recalculates phase, resets completed flags)
- **ProgramOverview redesigned** — program header with phase badge (Base/Build/Peak), week X of 12, progress bar, phase timeline blocks, session status tags (TODAY/DONE/MISSED), compact rest days, "View in calendar" cross-tab link, advance week button
- **PlanCalendar wired to real data** — month/week/day views now read from `workoutPlan` instead of hardcoded mock data; training sessions can be launched from calendar; illustrative meal/check-in events kept alongside real training data
- **Shell updated** — passes `onStartSession` to PlanCalendar for full session launch flow from Plan tab
- **ModeOverview** — goal network graph converted from full-height inline display to collapsible mini-map (closed by default, toggle to expand)
- Bold typography and generous spacing pass on ProgramOverview + PlanCalendar to match existing design language

### Session 7: RIR + Supersets + Goal Linkage + Hydration Access
- **fitness-data.js** — exercise grouping model (`groupType: 'superset' | 'circuit'`), `goalSources` on sessions, `flattenSessionExercises()` utility, `computeAvgRIR()`, `suggestLoadAdjustment()` for RIR-based auto-regulation; exercise count now 72
- **Training.jsx** — RIR input (0–5 buttons) with bidirectional RPE↔RIR sync, load adjustment suggestions during rest ("too easy → bump to Xkg" / "tough set → drop to Xkg"), `loadOverrides` state for mid-session weight changes, group-aware execution (skips rest between superset exercises, shows group banner), goal source tags in review phase, summary shows 4 stats (Volume / Sets / Avg RPE / Avg RIR) + load progression display
- **ProgramOverview.jsx** — goal source tags on session cards ("Driven by: HYPERTROPHY, FAT LOSS"), "HAS SUPERSETS" indicator in meta line, exercise preview shows "SS" prefix for superset exercises
- **GoalDetail.jsx** — new "YOUR SESSIONS" section showing linked sessions from the current plan that include this goal
- **tiles.jsx** — new `WaterTile` with 3 density variants (compact: number + drop icon + bar; mid: ring + ml + sparkline; full: ring + sparkline + percentage tag)
- **Dashboard.jsx** — water tile added to balanced layout, wired with mock data from MOCK_WATER, `flattenSessionExercises` used for group-aware session preview
- **Shell.jsx** — water route added to `TILE_ROUTES` + `DetailRouter`, WaterTracking import wired
- **mockUser.js** — `water` key added to `MOCK_DASHBOARD`
- **docs/meeting-notes-2026-07-04.md** — structured meeting notes with 6 action items, research checklists, priority matrix

### Session 8: Flow Demo + Nutrition Wiring + UI Polish + History + Persistence + Auto-Progression
- **FitnessFlowDemo.jsx** — new auto-advancing live demo at `/flow-demo`. Wraps fresh `UserProvider` + `NavigationProvider` + real Shell. Orchestrates: onboarding (abbreviated 4-step) → dashboard → program → training (auto-logged) → summary → return. Transport controls (play/pause/restart), phase indicator strip. ~45s total runtime.
- **Onboarding.jsx** — `demoMode` prop: pre-fills `DEMO_PROFILE`, shows only Welcome → Goals → TDEE → Ready steps, auto-advances on timer, auto-calls `completeOnboarding()`
- **Training.jsx** — `autoAdvance` prop: auto-logs sets with RPE 7/RIR 3, skips rest after 1.2s, advances through 3 exercises, auto-finishes. Summary auto-dismisses after 3s. Also: session persistence (auto-saves on every set log, restores on mount), cross-session load recommendation banner (from `exerciseHistory`)
- **Shell.jsx** — exports `ShellContent` for demo mounting, passes `autoAdvance` from detail data to `TrainingSessionContent`
- **nutrition-data.js** — new module: 25 recipes, `generateMealPlan()` (7-day plan, training-day carb modulation, dietary filtering, macro targeting within ~5%), `deriveBatches()`, `computeShoppingList()`, `getRecipeById()`
- **UserContext.jsx** — generates `mealPlan` + stores `pantry` on onboarding, `regenerateMealPlan()`, `updatePantry()`, `activeSession` persistence (`saveActiveSession`/`clearActiveSession`), `exerciseHistory` tracking (per-exercise load/RPE/RIR across sessions)
- **Macros.jsx** — wired to real `targets` + `mealPlan.meals` + `computeShoppingList()`, shopping checkboxes enlarged with pill badges and +/- steppers
- **BatchPrep.jsx** — wired to `deriveBatches(mealPlan)`, semantic color mapping (FRESH=green, BATCH=blue, SLOW=accent) with legend
- **MealPrep.jsx** — wired to real meal plan batches, cook mode icon animation for heat/steam steps
- **Fridge.jsx** — wired to `computeShoppingList()` + `pantry` from context
- **FoodLog.jsx** — wired to today's meals from `mealPlan` + real `targets`
- **CookSummary.jsx** — wired to `deriveBatches(mealPlan)` + semantic batch colors
- **PlanCalendar.jsx** — week view: replaced 38×38px icon blocks with thin 6×24px colored bars
- **TDEE.jsx** — replaced Sparkline with LineChart for 7-day trend, added day labels + target reference line
- **WorkoutHistory.jsx** — expandable exercise breakdown per session, volume trend LineChart, RPE sparkline
- **ProgramOverview.jsx** — session rationale line ("Hypertrophy session to support your muscle growth goal"), resume banner for interrupted workouts, per-exercise load arrow indicators (↑/↓)
- **fitness-data.js** — added `deriveLoadRecommendation()` for cross-session load progression

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
| Program Overview | ProgramOverview.jsx | Built | Program header with phases, week nav, session cards with status tags, cross-tab calendar link |
| **Exercise Browser** | ExerciseBrowser.jsx | **Needs redesign** | Currently flat library. Needs 3 modes: In My Program / Recommended / Full Library. See user-flows.md. |
| **Exercise Detail** | ExerciseDetail.jsx | **New** | Form cues, muscles, injuries, goals, prescriptions |
| **Workout Template** | WorkoutTemplateDetail.jsx | **New** | Sample session, protocol, frequency, injury alts |
| Active Training | Training.jsx | **Updated** | Review → Execute (RPE + RIR, load adjust, group-aware, rest timer) → Summary (volume, sets, RPE, RIR) |
| Workout Summary | WorkoutSummary.jsx | Built | Auto-computed volume, sets, avg RPE |
| Plan Calendar (3 views) | PlanCalendar.jsx | Built | Month/Week/Day views wired to real workoutPlan data, session launch from calendar |
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
| `fitness-data.js` | 72 exercises, GOAL_MODALITIES, MODALITY_CONFIG, EQUIPMENT_MAP, MODALITY_COLORS, generateProgram() (with grouping + goalSources), getProgramPhase(), flattenSessionExercises(), computeAvgRIR(), suggestLoadAdjustment(), deriveLoadRecommendation() |
| `nutrition-data.js` | 25 recipes, generateMealPlan(), deriveBatches(), computeShoppingList(), getRecipeById(), METHOD_COLORS |
| `ontology-data.js` | MACRO_RATIOS, BODY_FAT_RANGES, SOMATOTYPES, GOAL_CALORIC_STATE, CALORIC_PREP, WORKOUT_TEMPLATES, INJURY_OVERRIDES, EQUIPMENT_OVERRIDES, MEAL_TIMING, TRAINING_MEAL_IMPORTANCE, GOAL_META |
| `goal-network-data.js` | 32 NODES, 65 EDGES, CATEGORIES, computeLayout, connection helpers |

---

## What's NOT Built Yet

### Critical for a working fitness app

| Feature | Status | What's needed |
|---|---|---|
| **Exercise tab redesign** | **Built** | 3-mode browser (PROGRAM / FOR YOU / ALL), exercise swap flow, goal-aware filtering, session rationale line |
| **Workout history** | **Built** | Browse completed sessions, expandable exercise breakdown, volume trend LineChart, RPE sparkline |
| **Flow demo** | **Built** | Auto-advancing live demo at `/flow-demo` — onboarding → dashboard → program → session → summary |
| Program customization | Not built | Change days, adjust volume (swap exercises already works) |
| PR tracking | Not built | Persist personal records, show on exercise detail and in history |
| Progress analytics | Partial | Volume trends in workout history; strength curves, body comp over time not built |
| Calendar ↔ program sync | **Done** | PlanCalendar reads from workoutPlan; training events are real, meal/check-in remain illustrative |
| Periodization | **Partial** | Basic week advancement via `advanceWeek()` (Base/Build/Peak phases); exercise variation not built |
| Auto-progression | **Built** | RIR-based load suggestion mid-session + cross-session load recommendations via `exerciseHistory` + `deriveLoadRecommendation()` |
| Supersets/Circuits | **Built** | Hypertrophy/strength sessions get superset; HIIT/endurance wrapped in circuit |
| Goal → Session linkage | **Built** | `goalSources` on each session, visible tags on cards and in review phase, rationale text |
| Hydration access | **Built** | WaterTile on dashboard, taps through to WaterTracking via Shell detail route |

### Critical for nutrition

| Feature | Status | What's needed |
|---|---|---|
| Recipe database | **Built** | 25 recipes in `nutrition-data.js` with macros, dietary tags, cook methods |
| Meal plan generation | **Built** | `generateMealPlan()` — 7-day plan, training-day carb modulation, macro targeting within ~5% |
| Shopping list | **Built** | `computeShoppingList()` wired to Macros + Fridge screens, tracks pantry delta |
| Fridge ↔ shopping sync | **Built** | Shopping/fridge checkboxes call `updatePantry()` in UserContext |
| Cook → food log link | Partial | `logCook()` fires on cook summary; full meal auto-logging not connected |

### Infrastructure

| Feature | Status | What's needed |
|---|---|---|
| Backend / API | Not built | Everything is localStorage |
| Authentication | Not built | No accounts, no login |
| Multi-device sync | Not built | No cloud persistence |
| Push notifications | Not built | No reminders or nudges |
| Session persistence | **Built** | Active workout state saved to localStorage via `saveActiveSession()`, restored on mount, resume banner on ProgramOverview |
| Offline support | Not built | No service worker |

### Polish

| Feature | Status | What's needed |
|---|---|---|
| Shopping checkboxes | **Done** | Enlarged hit targets, pill badges, quantity steppers |
| Batch color bars | **Done** | Semantic: FRESH=green, BATCH=blue, SLOW=accent + legend |
| Calendar week indicators | **Done** | Thin 6×24px bars replace heavy icon blocks |
| TDEE chart | **Done** | LineChart with day labels + target reference line |
| Cook mode animation | **Done** | Icon-level glow (heat) and float (steam) animations |
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
| `docs/` | 13 | Architecture, fitness, flows, design system, progress, meeting notes |
| **Total** | **76** | |
