# User Flows — Complete Mode Map

Every user flow in AUREVI0N, organized by mode. Each mode maps to a phase of the SDPAO loop (Seed → Decide → Plan → Act → Observe). This document covers what exists, what's missing, and what the end-to-end experience should feel like.

---

## The End-to-End Experience

A new user opens the app for the first time and hits the full loop in their first week:

```
Day 0 — ONBOARDING MODE (Seed)
  Open app → Welcome → enter body metrics, goals, constraints
  → TDEE computed, macros calculated, training program generated
  → Land on personalized dashboard

Day 1 — FITNESS MODE (Act)
  Train tab → see weekly program → tap "Start" on today's session
  → Review exercises → Begin → log sets with RPE → rest timers
  → Session complete → volume + avg RPE summary → logged

Day 2 — COOKING MODE (Act)
  Eat tab → macro targets → build meal queue → batch prep
  → Ingredient merge → parallel timeline → active cook mode
  → Multi-timer cook session → cook summary → logged

Day 3-6 — TRACKING MODE (Observe)
  Daily: log meals → log water → track macro adherence
  End of session: workout auto-logged
  Heatmap builds over the week

Day 7 — CHECK-IN (Observe → Decide)
  Weekly check-in → weigh in → body fat → subjective rating
  → Decision engine evaluates: on track? too aggressive? falling behind?
  → Intervention generated if needed (adjust deficit, modify program)
  → Dashboard updates with new targets

Week 2+ — THE LOOP CONTINUES
  Program adapts → meals adjust → check-in refines → repeat
```

---

## Mode 1: Onboarding (SEED)

**Entry**: First app open
**Exit**: "Enter AUREVI0N" → Dashboard with generated program
**Navigation**: Linear 12-step stack (back allowed, no skip)
**File**: `src/app/screens/Onboarding.jsx`
**Journey phase**: Not yet in `/journey` — needs ONBOARDING MODE page

### Screen Sequence

| Step | Screen | Data Collected | Interactions |
|------|--------|----------------|-------------|
| 1 | Welcome | — | "Get Started" CTA, animated AUREVI0N mark |
| 2 | Sex | `sex` (male/female) | Card selection with body silhouettes |
| 3 | Birthday | `birthYear`, `birthMonth` | Scroll column pickers |
| 4 | Body Metrics | `height`, `weight` + unit toggles | Slider drag, cm/ft and kg/lbs toggles |
| 5 | Body Fat | `bodyFat` (range string, e.g. "18-23%") | 3×3 grid with sex-dependent body visuals |
| 6 | Activity | `exerciseFreq`, `activityLevel` | Grid buttons (frequency) + card selection (level) |
| 7 | Experience | `liftingExp`, `cardioExp` | Grid buttons with visual experience bars |
| 8 | Diet Constraints | `dietary[]` | Multi-select tags (12 options: Gluten Free, Dairy Free, Vegan, etc.) |
| 9 | Training Constraints | `equipment`, `availableDays[]`, `injuries[]` | Equipment cards, day checkboxes, injury tags |
| 10 | Goals | `goal`, `goals[]` | Multi-select from 3 sections (Body Comp, Performance, Functional) + nutrition goals |
| 11 | Focus Areas | Additional focus refinement | Multi-select nutrition sub-goals |
| 12 | TDEE Reveal + Ready | Computed TDEE, macros, program | Animated ring reveal → "Enter AUREVI0N" CTA |

### What Happens on Completion

```
completeOnboarding(profile)
  → computeTDEE(profile)          # Mifflin-St Jeor × activity multiplier
  → computeMacros(profile)        # TDEE + goal modifier → protein/fat/carbs
  → generateProgram(profile)      # goals + constraints → weekly training plan
  → setState({ profile, targets, workoutPlan, onboarded: true })
```

### What's Missing

- [ ] **Draft save**: Closing the app mid-onboarding loses all progress
- [ ] **Account creation**: "I already have an account" link has no flow
- [ ] **Body composition viewer integration**: The 3D body viewer exists (`/body`) but isn't embedded in the onboarding body fat step
- [ ] **Onboarding Mode in `/journey`**: No journey page shows the 12-step flow with live screen previews
- [ ] **Re-onboarding flow**: No way to redo onboarding to change fundamental inputs

---

## Mode 2: Dashboard (DECIDE)

**Entry**: App open (default tab) or Home tab tap
**Navigation**: Single screen with tile grid → detail push
**File**: `src/app/screens/Dashboard.jsx`
**Journey phase**: Phase 02 · DECIDE in SODA loop

### Layout Presets

| Preset | Focus | Lead Tiles |
|--------|-------|-----------|
| Balanced | Equal weight across all metrics | Goal + Calendar → Macros → Session/Prep |
| Nutrition | Cutting phase, macro-heavy | Macros (full) → Goal/Streak → Prep (full) |
| Training | Strength block, session-heavy | Session (full) → Goal/Streak → Calendar (full) |

### 9 Tile Types

| Tile | Densities | Taps To |
|------|-----------|---------|
| GoalTile | compact/mid/full | Goal Setting detail |
| TDEETile | compact/mid/full | TDEE Model detail |
| MacroTile | compact/mid/full | Macro Targets detail |
| CalendarTile | compact/mid/full | Plan Calendar detail |
| SessionTile | compact/mid/full | Program Overview detail |
| PrepTile | compact/mid/full | Meal Prep detail |
| CheckInTile | compact/mid/full | Check-in Flow detail |
| FridgeTile | compact/mid/full | Fridge/Pantry detail |
| StreakTile | compact/mid/full | Profile detail |

### Intervention System

Dashboard renders active interventions from `UserContext.interventions`:
- Generated by check-in decision engine
- Types: Training (modify program), Nutrition (adjust deficit), Notification (behavioral nudge)
- Can be dismissed by user
- Displayed as accent-toned FSurface alerts above the tile grid

### What's Missing

- [ ] **Time-of-day adaptive messaging**: "Good morning" exists but no "rest day" or "session in 2 hours" context
- [ ] **Intervention trigger logic**: Only weight-loss-too-fast is implemented; no protein/adherence/recovery triggers
- [ ] **Real data in tiles**: Session tile pulls from workoutPlan now, but Calendar/Prep tiles still use hardcoded mock data

---

## Mode 3: Fitness Mode (ACT — Training)

**Entry**: Train tab or Session tile tap
**Exit**: Workout summary → back to program overview
**Navigation**: Tab (Program Overview) → Detail push (Active Session with 3 internal phases)
**Files**: `src/app/screens/ProgramOverview.jsx`, `src/app/screens/Training.jsx`, `src/app/screens/fitness-data.js`
**Journey phase**: Exercise Mode in `/journey/exercise`

### Screen Sequence

```
Train Tab → Program Overview
  ↓ tap "Start session"
Detail Push → Active Session
  ↓ Review Phase (exercise list, form cues)
  ↓ tap "Begin Workout"
  ↓ Execute Phase (set-by-set logging)
  ↓   → Log set (reps, weight, RPE)
  ↓   → Rest timer countdown → skip or wait
  ↓   → Auto-advance to next exercise
  ↓   → Repeat until all exercises done
  ↓ Summary Phase (auto-computed stats)
  ↓ tap "Done"
Pop Detail → Program Overview (session marked complete)
```

### Program Overview

| Element | Description |
|---------|-------------|
| Week schedule | 7-day card list with session cards + rest day cards |
| Session card | Name, modality tag, exercise count, duration estimate, first 3 exercises, "Start" button |
| Rest card | Minimal row with recovery dot |
| Stats footer | Sessions/week, rest days, split label |

### Active Session — Execute Phase

| Element | Description |
|---------|-------------|
| Progress rail | Segmented bar showing exercise completion (done/active/remaining) |
| Elapsed timer | Global workout time, ticks every second |
| Set tracker | Visual cards per set (done with checkmark, active with accent fill, upcoming empty) |
| RPE selector | 6 buttons (5-10), tap to select before logging |
| Log set button | Records reps + weight + RPE, advances to next set or exercise |
| Rest timer | Countdown bar with remaining time, skip button |
| Bottom toolbar | Pause/Resume, Skip Exercise, End Workout |

### Active Session — Summary Phase

| Metric | Computation |
|--------|-------------|
| Duration | Elapsed timer value |
| Total volume | Σ (reps × load) across all logged sets |
| Total sets | Count of logged sets |
| Avg RPE | Mean of all RPE inputs |
| Exercise breakdown | Per-exercise: actual sets × reps @ weight, volume |

### What's Missing

- [ ] **Periodization**: No week-to-week progression (programs are static)
- [ ] **Auto-progression**: No automatic weight increases based on RPE/performance
- [ ] **PR tracking**: Summary computes volume but doesn't persist PRs for comparison
- [ ] **Exercise substitution UI**: Can't swap exercises within a session
- [ ] **Audio cues**: No sound on rest timer completion
- [ ] **Workout history**: No screen to browse past sessions
- [ ] **Deload detection**: No automatic deload week scheduling

---

## Mode 4: Cooking Mode (ACT — Nutrition)

**Entry**: Eat tab or Prep tile tap
**Exit**: Cook summary → back to dashboard
**Navigation**: Tab (Macros) → Detail push (Prep flow with 3 sub-screens)
**Files**: `src/app/screens/MealPrep.jsx`, `src/app/screens/Macros.jsx`
**Journey phase**: Cooking Mode in `/journey/cooking`

### Screen Sequence

```
Eat Tab → Macro Targets (weekly P/C/F)
  ↓ "Review meals"
Meal Queue → swap meals → "Optimize into batches"
  ↓
Batch Strategy → "Build shopping list"
  ↓
Shopping List → check off items → "Start prep"
  ↓
Fridge / Pantry → verify inventory
  ↓
Ingredient Merge (5A) → check off prepped ingredients
  ↓
Parallel Timeline (5B) → Gantt-style view → "Open cook mode"
  ↓
Active Cook Mode (5C) → step-by-step with multi-timers
  ↓
Cook Summary → portions, time saved, macro accuracy
```

### Active Cook Mode

| Element | Description |
|---------|-------------|
| Timer bar | 3 independent countdown timers (one per recipe), color-coded |
| Step card | Current instruction with contextual animation (sear, steam, chop, plate, etc.) |
| Step navigation | Back/Forward with bounds checking |
| Pause/Resume | Pauses all timers simultaneously |
| Conflict detection | Red alert when oven temperatures overlap across recipes |

### What's Missing

- [ ] **Recipe database**: Recipes are hardcoded, not generated from macro targets
- [ ] **Fridge ↔ Shopping reconciliation**: Completing shopping doesn't update fridge inventory
- [ ] **Meal plan generation**: No algorithm that takes macro targets → builds a weekly meal queue
- [ ] **Portion calculation**: No computation from servings × days → ingredient quantities
- [ ] **Expiration tracking**: Fridge shows expiring items but doesn't predict or alert proactively
- [ ] **Consumption tracking**: No flow from cooked meal → food log (currently separate)

---

## Mode 5: Tracking Mode (OBSERVE)

**Entry**: Various — check-in tile, food log from Eat tab, water from quick actions
**Exit**: Back to dashboard (data feeds into behavioral metrics)
**Navigation**: Detail push from dashboard tiles or tabs
**Files**: `src/app/screens/CheckIn.jsx`, `src/app/screens/FoodLog.jsx`, `src/app/screens/WaterTracking.jsx`, `src/app/screens/MacroHeatmap.jsx`
**Journey phase**: Phase 05 · OBSERVE in SODA loop — **needs TRACKING MODE page in `/journey`**

### Check-in Flow (Weekly)

| Step | Screen | Data |
|------|--------|------|
| 1 | Weight input | `weight` (number spinner) |
| 2 | Body fat input | `bodyFat` (number spinner) |
| 3 | Subjective rating | 1-5 scale (Terrible → Amazing) |
| 4 | Summary | Delta vs previous, decision engine result, intervention if triggered |

**Decision logic** (`computeDecision`):
- Evaluates weight trend over recent check-ins
- If loss > 0.5kg/week → flags as potentially too aggressive
- Generates intervention to adjust caloric deficit
- Updates `profile.weight` → triggers macro recomputation

### Daily Food Log

| Element | Description |
|---------|-------------|
| Meal cards | Breakfast/Lunch/Dinner/Snacks with macro breakdown |
| Quick add | Protein, carbs, fat, calories per meal |
| Daily totals | Running sum vs targets with progress bars |

### Water Tracking

| Element | Description |
|---------|-------------|
| Ring progress | Daily intake vs target (based on body weight) |
| Quick add buttons | +250ml, +500ml, custom |
| 7-day trend | Sparkline of daily intake |

### Macro Heatmap

| Element | Description |
|---------|-------------|
| 8-week × 7-day grid | Color-coded adherence cells (green = hit, red = missed) |
| Protein/Carbs/Fat rows | Separate heatmap per macro |
| Weekly averages | Summary column on the right |

### Behavioral Metrics (Derived — not a screen, computed in UserContext)

```
adherence              — meal logging consistency (days logged / 7)
protein_hit_ratio_7d   — % of days where protein target met
home_cook_7d           — home-cooked meals in last 7 days
water_intake_rate_7d   — average daily water intake
workouts_7d            — completed workout sessions in last 7 days
```

### What's Missing

- [ ] **Tracking Mode in `/journey`**: No journey page groups these 5 screens as a mode
- [ ] **Food log ↔ macro targets**: Logging a meal doesn't update daily remaining targets in real-time
- [ ] **Workout auto-log**: Completing a session logs to activityLog but food log doesn't know about it
- [ ] **Photo food logging**: No camera/scan flow
- [ ] **Trend analysis**: No screen showing weight/BF trends over time (check-in captures data but doesn't visualize history)
- [ ] **Notification triggers**: Behavioral metrics are computed but don't fire any nudges

---

## Mode 6: Body Composition (SEED + OBSERVE)

**Entry**: `/body` route or body fat step in onboarding
**Navigation**: Standalone page with 3D viewer
**Files**: `src/pages/BodyViewer.jsx`, `src/ui/BodyPreview.jsx`
**Journey phase**: Not in `/journey` — **needs integration**

### 3D Body Viewer

| Element | Description |
|---------|-------------|
| GLB models | 10 models: male/female × lean/average/athletic/heavy/stocky |
| Orbit controls | Drag to rotate, pinch to zoom |
| Muscle highlighting | Tap a muscle group → GLSL shader highlights it with wave animation |
| Fresnel rim lighting | Edge glow for depth perception |
| Turntable | Auto-rotate when not interacting |

### What's Missing

- [ ] **Onboarding integration**: Body viewer should be embedded in the body fat selection step (step 5) so users can visualize their selection
- [ ] **Check-in integration**: After logging a check-in, show body composition change over time on the 3D model
- [ ] **Muscle group ↔ training link**: Tapping a muscle group could show which exercises in the current program target it
- [ ] **Progress overlay**: Show before/after body composition on the same model

---

## Mode 7: Goal Network (PLAN)

**Entry**: `/journey/goals` or GOALS pill in journey nav
**Navigation**: Single page with interactive SVG graph
**Files**: `src/tools/goal-network/GoalNetwork.jsx`, `src/tools/goal-network/goal-network-data.js`
**Journey phase**: Standalone tool page under `/journey`

### Interactive Graph

| Element | Description |
|---------|-------------|
| 32 nodes | 5 categories: fitness goals (10), nutrition goals (5), training modalities (8), meal prep (5), caloric states (4) |
| 65 edges | Connections with strength (strong/moderate/weak) |
| Concentric rings | Goals (outer) → Training/Meal prep (middle) → Caloric states (inner) |
| Click interaction | Select node → highlight connections, dim others, show detail panel |
| Category filter | Toggle buttons to show/hide entire node types |
| Detail panel | Selected node info, all connections with strength tags, edge/category counts |

### What's Missing

- [ ] **User's active goals highlighted**: Should show which nodes are "active" based on the user's selected goals from onboarding
- [ ] **Connection to program**: Clicking a training modality should show which exercises in the generated program serve it
- [ ] **"What if" mode**: Toggle goals on/off to preview how it changes the training program and caloric state

---

## Navigation Architecture

### Shell (5-tab + detail stack)

```
AppShell → NavigationProvider → Phone frame
  ├── Home tab     → DashboardContent (tiles → detail push)
  ├── Train tab    → ProgramOverviewContent (start session → detail push)
  ├── Eat tab      → MacroTargetsContent (review meals → detail push)
  ├── Plan tab     → PlanCalendarContent (month/week/day toggle)
  └── You tab      → ProfileContent (account hub)
```

`pushDetail(screen, title, data)` opens a slide-in overlay. `popDetail()` closes it. Tab switching clears the detail stack.

### Tile → Detail Routing

| Tile Tap | Detail Screen |
|----------|---------------|
| Goal | GoalInputContent |
| TDEE | TDEEContent |
| Macros | MacroTargetsContent |
| Calendar | PlanCalendarContent |
| Session | ProgramOverviewContent |
| Prep | MealPrepMergeContent |
| Check-in | CheckInFlowContent |
| Fridge | FridgeContent |
| Streak | ProfileContent |

---

## What's Not Built (Full Gaps List)

### Infrastructure
- [ ] Backend / API / database (everything is localStorage)
- [ ] Authentication and user accounts
- [ ] Multi-device sync
- [ ] Push notifications
- [ ] Offline support

### Decision Engine
- [ ] Intervention trigger logic beyond weight-loss check
- [ ] Behavioral metric thresholds (when does low adherence fire an alert?)
- [ ] Goal change → automatic program + meal plan regeneration
- [ ] Caloric transition handling (switching goals mid-week)

### Training
- [ ] Periodization (linear, undulating, block)
- [ ] Auto-progression (weight increases based on RPE)
- [ ] PR persistence and history
- [ ] Workout history browsing
- [ ] Exercise substitution UI
- [ ] Deload week detection
- [ ] Audio/haptic cues

### Nutrition
- [ ] Recipe database and meal generation from macro targets
- [ ] Fridge ↔ shopping list sync
- [ ] Portion calculation from servings × prep days
- [ ] Food photo logging
- [ ] Meal timing integration with training schedule

### Tracking
- [ ] Weight/BF trend visualization
- [ ] Training volume trends over weeks
- [ ] Strength progression graphs per exercise
- [ ] Sleep and recovery tracking
- [ ] Wearable integration (Apple Health, Garmin)

### Journey Explorer
- [ ] Onboarding Mode page in `/journey`
- [ ] Tracking Mode page in `/journey`
- [ ] Body Composition integration in journey
- [ ] Screen coverage for delete flows (both cooking and exercise)
