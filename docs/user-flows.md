# User Flows — Complete Mode Map

Every user flow in AUREVI0N, organized by mode. Each mode maps to a phase of the SDPAO loop (Seed → Decide → Plan → Act → Observe). This document covers what exists, what's missing, and what the end-to-end experience should feel like.

---

## Flow Design Principles

These principles govern every flow in the app. They exist because the test agents revealed that the current architecture prioritizes system structure (tabs, detail stacks, mode separation) over user intent (what do I do, am I improving, what's next).

### 1. One tap to action

The primary action on any screen should be reachable in one tap. Opening the app on a training day should present a Start button immediately — not a dashboard that links to a tab that shows a card that has a button.

**Current**: Dashboard → Train tab → Program Overview → Review → Execute (4 taps)
**Target**: Open app → Today screen → Start (1 tap)

### 2. Direct, don't navigate

The app should tell you what to do, not show you a menu of options and let you figure it out. Five tabs, three browse modes, ten tile types — these are engineering structures. The user doesn't think in tabs. They think in moments: "I'm at the gym," "I'm in the kitchen," "I'm checking in on Sunday."

### 3. Context travels with you

Data the user needs shouldn't require navigating away. If you're resting between sets, you should see the form cue for the next exercise *right there* — not in a separate Exercise Detail screen. If you're about to start a session, you should see what you lifted last time *on the same card* — not in a History screen three taps away.

### 4. Every screen exits forward

No dead ends. The workout summary should bridge to nutrition. The check-in should preview next week. The cook summary should log the meal. Every action leads to the next natural step — the user never has to ask "now what?"

### 5. Secondary features are reachable, not in the way

Browsing exercises, viewing history, checking goal details, comparing macros — these matter, but they're not the primary flow. They should be accessible from a single swipe or long-press, not positioned between the user and their workout.

---

## Reconstructed Flows

### The Zero-Decision Path

The core loop should work without the user making any navigation decisions:

```
Open app
  │
  ├─ Training day?
  │   → TODAY screen: session name, time, equipment, last-time weights
  │   → [Start] → Execute → Summary → "Next: Thu · Eat 40g protein now"
  │
  ├─ Rest day?
  │   → TODAY screen: "Rest day" + recovery tip + next session preview
  │   → Below: macro targets, water tracking, meal prep CTA
  │
  ├─ Check-in due?
  │   → TODAY screen: "Weekly check-in" prompt at top
  │   → Tap → weigh in → body fat → rating → results → back to Today
  │
  └─ Week transition?
      → TODAY screen: "Week 3 · Build Phase" summary
      → "Last week: 4/4 sessions, volume ↑8%, protein hit 6/7 days"
      → "This week: loads adjusted, 2 exercises rotated"
```

**The "Today" screen replaces the Dashboard as the default landing.** It's not a tile grid — it's a single directive that changes based on context. The dashboard still exists for users who want the full picture, but it's one swipe away, not the front door.

### Tap Counts — Current vs Target

| Action | Current | Target | How |
|--------|:-------:|:------:|-----|
| Start today's workout | 4 taps | 1 tap | Today screen replaces Dashboard as default; Start is the hero CTA |
| Log a set | 1 tap (in execute) | 1 tap | Unchanged — already good |
| See last time weights | 3 taps (→ History → find session → scan) | 0 taps | "Last time" strip shown on Today screen before Start |
| Check form cue mid-session | 2 taps (leave execute → Exercise Detail) | 0 taps | Form cue shown during rest for the next exercise |
| Swap an exercise | 3 taps (→ Exercises → PROGRAM → Swap) | 2 taps | Long-press exercise in execute → swap sheet |
| See macro targets | 2 taps (→ Eat tab → Macros) | 1 swipe | Swipe left on Today screen → daily macros |
| Log water | 3 taps (→ Dashboard → Water tile → quick add) | 1 tap | Persistent quick-add on the Today screen |
| Start weekly check-in | 3 taps (→ Dashboard → Check-in tile → Start) | 1 tap | Check-in prompt appears on Today screen when due |
| View workout history | 2 taps (→ Train → History) | 1 tap | "History" accessible from Today screen |

### The Today Screen

This is the new default landing — replaces the Dashboard as the first thing you see.

**Training day layout:**
```
┌─────────────────────────────────────┐
│ Today · Mon 7 Jul              9:41 │
│                                     │
│ UPPER A · HYPERTROPHY               │
│ ~50 min · barbell, bench, dumbbells │
│                                     │
│ Last time:                          │
│ OHP 40kg × 10 · Bench 28kg × 10    │
│                                     │
│        [ START SESSION ]            │
│                                     │
│ ─────────────────────────────────── │
│ M● T○ W○ T○ F○ S· S·    3/5 done  │
│ ─────────────────────────────────── │
│                                     │
│ Tue  Lower A · Hypertrophy    5 ex  │
│ Wed  REST                           │
│ Thu  Upper B · Strength       4 ex  │
│                                     │
│ ─────────────────────────────────── │
│ 🔥 2,288 kg last session  ↑12%     │
│ 💧 1,250 / 2,500 ml       [+250]   │
│ 🍽 1,420 / 2,270 kcal              │
│                                     │
│ [Exercises]  [History]  [Goals]     │
└─────────────────────────────────────┘
```

**Rest day layout:**
```
┌─────────────────────────────────────┐
│ Today · Wed 9 Jul              9:41 │
│                                     │
│ REST DAY                            │
│ You trained upper body yesterday.   │
│ Stretch shoulders tonight.          │
│                                     │
│ Next: Thu · Upper B · Strength      │
│                                     │
│ ─────────────────────────────────── │
│ M● T● W• T○ F○ S· S·    2/4 done  │
│ ─────────────────────────────────── │
│                                     │
│ 💧 800 / 2,500 ml         [+250]   │
│ 🍽 620 / 2,270 kcal                │
│                                     │
│ [Meal Prep]  [History]  [Check-in]  │
└─────────────────────────────────────┘
```

The Today screen subsumes the three most common entry points (Dashboard, Train tab, Eat tab) into one context-aware surface. The 5-tab bar still exists for deep navigation, but the user's first interaction is always "here's what matters right now."

## The End-to-End Experience

```
Day 0 — ONBOARDING (Seed)
  Open app → 8-step general onboarding → 9-step fitness onboarding → program generated
  → Land on Today screen: "Your first session is tomorrow"

Day 1 — TRAIN
  Open app → Today: "Upper A · Hypertrophy · 50 min"
  → Tap Start → log sets → summary → "Next: Wed · Eat protein now"
  (1 tap to action. 0 navigation decisions.)

Day 2 — REST
  Open app → Today: "Rest day · stretch shoulders · next session Wed"
  → Log water (1 tap: +250ml button right there)
  → Start meal prep (1 tap: Meal Prep button right there)

Day 3 — TRAIN
  Open app → Today: "Lower A · Hypertrophy · 48 min"
  → "Last time: Squat 80kg × 8" (0 taps — already visible)
  → Tap Start → execute → summary: "volume ↑8% vs last Lower A"

Day 7 — CHECK-IN
  Open app → Today: "Weekly check-in due" prompt at top
  → Tap → weigh in → body fat → rating → results
  → "3/4 sessions, protein 5/7 days, volume ↑12%"
  → Back to Today with updated targets

Week 2 — THE LOOP
  Open app → Today: "Week 2 · Base Phase"
  → "Last week: all sessions done, loads increasing"
  → Loads auto-adjusted from last week's RIR data
```

---

## Mode 1: Onboarding (SEED)

**Entry**: First app open
**Exit**: Fitness Summary → "Enter AUREVI0N" → App with generated program
**Navigation**: Two sequential linear flows — general (8 steps) then fitness (9 steps)
**File**: `src/app/screens/Onboarding.jsx`
**Journey phase**: `/journey/seed` (6-phase view covering both flows)

### Phase 1: General Onboarding (8 steps)

| Step | Screen | Data Collected | Interactions |
|------|--------|----------------|-------------|
| 0 | Welcome | — | "Get Started" CTA, animated AUREVI0N mark |
| 1 | Sex | `sex` | Card selection (Female / Male) |
| 2 | Body Metrics | `height`, `weight` + units | Slider drag, cm/ft and kg/lbs toggles |
| 3 | Birthday | `birthYear`, `birthMonth`, `birthDay` | Scroll column pickers |
| 4 | Goals + Activity | `goals[]`, `goal`, `activityLevel` | Multi-select goals (max 3) + activity level cards |
| 5 | Training Frequency | `exerciseFreq` | Grid buttons (1-2 / 3-4 / 5-6 / 7 per week) |
| 6 | TDEE Reveal | Computed TDEE | Animated ring + info bubbles |
| 7 | Ready | Summary display | Daily target, macro split, stats → "Continue" |

### Phase 2: Fitness Onboarding (9 steps)

| Step | Screen | Data Collected | Interactions |
|------|--------|----------------|-------------|
| 0 | Fitness Intro | — | "Get Started" CTA |
| 1 | Body Fat (front) | `bodyFat` (numeric %) | 3D body preview + slider (5–50%) |
| 2 | Body Fat (back) | `bodyFat` (continued) | Back view of 3D model + same slider |
| 3 | Target Body Fat | `targetBodyFat` (numeric %) | 3D preview at target + slider |
| 4 | Training Experience | `liftingExp`, `cardioExp` | Grid buttons with visual experience bars |
| 5 | Equipment Access | `equipment` | Equipment selection cards |
| 6 | Focus Areas | `focusMuscles[]` | Interactive 3D muscle group picker |
| 7 | Injuries | `injuries[]` | Multi-select grid (6 zones + None) |
| 8 | Fitness Summary | Derived transformation | Current → target BF%, months, deficit, protein, sessions/wk → "Enter AUREVI0N" |

### What Happens on Completion

```
General onboarding completes → data passed to fitness onboarding
Fitness onboarding completes → completeOnboarding(mergedProfile)
  → computeTDEE(profile)          # Mifflin-St Jeor × activity multiplier
  → computeMacros(profile)        # TDEE + goal modifier → protein/fat/carbs
  → generateProgram(profile)      # goals + constraints → weekly training plan
  → generateMealPlan(profile)     # targets + dietary + schedule → meal plan
  → setState({ profile, targets, workoutPlan, mealPlan, onboarded: true })
```

Available days are auto-derived from training frequency (e.g. "3-4" → Mon/Wed/Fri/Sat).

### What's Missing

- [ ] **Draft save**: Closing the app mid-onboarding loses all progress
- [ ] **Account creation**: "I already have an account" link has no flow
- [x] ~~**Body composition viewer integration**~~: 3D body preview embedded in fitness onboarding body fat steps
- [x] ~~**Onboarding Mode in `/journey`**~~: `/journey/seed` shows both flows with live screen previews
- [ ] **Re-onboarding flow**: No way to redo onboarding to change fundamental inputs (sidebar "Reset & re-onboard" exists for dev)

---

## Mode 2: Today + Dashboard (DECIDE)

**Entry**: App open (default). Today screen is the primary surface; Dashboard is the secondary "full picture" view.
**Navigation**: Today screen (context-aware) → swipe or tab for Dashboard (tile grid) → detail push
**Files**: Today screen (to be built), `src/app/screens/Dashboard.jsx`
**Journey phase**: Phase 02 · DECIDE in SODA loop

### Today Screen (New — Primary Landing)

The Today screen replaces the Dashboard as the default view. It answers "what should I do right now?" with a single directive based on context:

- **Training day**: Session hero with name, time, equipment, last-time weights, Start CTA. Week strip + remaining sessions + daily trackers (water, macros) below.
- **Rest day**: Recovery message, next session preview, daily trackers, meal prep CTA.
- **Check-in due**: Check-in prompt at top, above the regular content.
- **Week transition**: Last week summary + this week's changes.

### Dashboard (Secondary — Full Picture)

### Layout Presets

| Preset | Focus | Lead Tiles |
|--------|-------|-----------|
| Balanced | Equal weight across all metrics | Goal + Calendar → Macros → Session/Prep |
| Nutrition | Cutting phase, macro-heavy | Macros (full) → Goal/Streak → Prep (full) |
| Training | Strength block, session-heavy | Session (full) → Goal/Streak → Calendar (full) |

### 10 Tile Types

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
| **WaterTile** | compact/mid/full | Water Tracking detail |

### Intervention System

Dashboard renders active interventions from `UserContext.interventions`:
- Generated by check-in decision engine
- Types: Training (modify program), Nutrition (adjust deficit), Notification (behavioral nudge)
- Can be dismissed by user
- Displayed as accent-toned FSurface alerts above the tile grid

### What's Missing

- [ ] **Time-of-day adaptive messaging**: "Good morning" exists but no "rest day" or "session in 2 hours" context
- [ ] **Intervention trigger logic**: Only weight-loss-too-fast is implemented; no protein/adherence/recovery triggers
- [x] ~~**Calendar tile real data**~~: Plan calendar now reads from workoutPlan for training events. Meal/check-in events remain illustrative.
- [ ] **Prep tile real data**: Prep tile still uses hardcoded mock data

---

## Mode 3: Fitness Mode (ACT — Training)

**Entry**: Today screen → Start (1 tap). Also reachable via Train tab or Calendar.
**Exit**: Workout summary → bridges to nutrition + next session preview → back to Today
**Navigation**: Today screen → Execute → Summary. Side paths: Exercise Browser, History, Goals (all 1 tap from Today).
**Files**: Today screen (to be built), `src/app/screens/Training.jsx`, `src/app/screens/ExerciseBrowser.jsx`, `src/app/screens/ExerciseDetail.jsx`, `src/app/screens/ProgramOverview.jsx`, `src/app/screens/fitness-data.js`
**Journey phase**: Exercise Mode in `/journey/exercise`

### The Primary Path (Zero Decisions)

```
Open app → Today screen (training day)
  → See: session name, time, equipment, last-time weights
  → Tap "Start" (1 tap, no navigation)
  → Execute: set-by-set logging
     → During rest: form cue for next exercise + "last time" weight
     → Load suggestions when RIR drifts
  → Summary: volume, PRs, next session, post-workout meal bridge
  → Done → back to Today (session marked complete, dot turns green)
```

### Side Paths (Reachable, Not in the Way)

```
From Today screen:
  ├─ [Exercises] → Exercise Browser (PROGRAM / FOR YOU / ALL)
  │   └→ Exercise Detail → Swap alternatives → confirm → program updated
  ├─ [History] → Completed sessions with trends + PR log
  └─ [Goals] → Goal Detail with macros, modalities, sessions

From Execute phase:
  └─ Long-press exercise → quick swap (without leaving the session)
```

### Program Overview (Today-First)

| Element | Description |
|---------|-------------|
| **Today hero** | Training day: session name, time estimate, equipment checklist, "last time" key lifts from previous same-type session, prominent "Start" CTA. Rest day: "Rest day" + recovery tip + next session preview with day/name. |
| **Session rationale** | Below the hero: one line explaining why this modality today. "Hypertrophy for muscle growth (recomp goal)" or "HIIT for caloric expenditure (fat loss)". Connects the session to the user's goals. |
| Week strip | 7 dots (M–S): green = done, accent ring = today, dim = upcoming, hollow = rest. |
| Program context | Program name, phase (Base/Build/Peak) as inline text with → arrows, week X of 12, progress bar. |
| Remaining sessions | Compact rows with dividers: day, name, exercise count, status tag. Not full previews. |
| **Week comparison** | "Volume ↑8% vs last week" or "3/4 sessions completed" — a single glanceable progress signal. |
| Quick actions | **Exercises** (browse/swap), **History** (past sessions), **Goals** (goal detail), **Calendar** (Plan tab). Icon card grid. |
| Stats | Sessions/week, phase, split — inline row, not cards. |

### Active Session (Redesigned)

The review phase is eliminated. Tapping "Start" goes straight to execute. Form cues surface during rest, not on a separate screen.

**Pre-session moment** (on the today hero, before tapping Start):
- Equipment needed: "Barbell · Bench · Dumbbells"
- Last time: "Squat 80kg × 8 · Bench 60kg × 5 · Row 60kg × 8"
- Time estimate: "~50 min"

**Execute phase** (unchanged mechanically, new contextual elements):
- Progress rail, elapsed timer, set tracker, RPE/RIR selectors, log button
- **During rest**: show form cue for the *next* exercise (not just "next up: name")
- **During rest**: show "last time" weight for the next exercise if history exists
- Load adjustment suggestions when RIR drifts

**Summary phase** (enhanced):
- Duration, volume, sets, avg RPE, avg RIR (existing)
- **PR badges**: "New PR: Back Squat 85kg" if any exercise exceeded previous best
- **Volume comparison**: "↑12% vs last Upper A session"
- **Next session**: "Thursday · Lower B · Strength" with day preview
- **Nutrition bridge**: "Post-workout window: prioritize protein + carbs within 2 hours" with link to Eat tab
- **Bodyweight alternative**: For users with 0 kg volume, show total reps instead ("142 total reps · ↑8 vs last session")

### Exercise Browser (3 Modes)

The browser has three modes, toggled by `FButtonGroup` at the top: `PROGRAM` / `FOR YOU` / `ALL`

**Mode 1: PROGRAM** (default when opened from Train tab)
- Shows exercises from your current week's sessions, grouped by day
- Each exercise shows: name, sets × reps, goal source dot-pills, "Swap" button (`FBtn ghost`)
- Tapping Swap opens Exercise Detail with swap context (`fromProgram: true`)

**Mode 2: FOR YOU** (recommended)
- Exercises filtered by your active goals + available equipment − injury exclusions − already in program
- Scored by goal coverage (multi-goal exercises rank higher), sorted desc
- Shows count header ("12 exercises for your goals")
- Each exercise shows: name, equipment, active-goal dot-pills. Tap → Exercise Detail.

**Mode 3: ALL** (full library)
- Category filter tabs (All / Compound / Isolation / Core / etc.)
- Green dot indicator on exercises matching user's goal modalities
- Injury-excluded exercises at `opacity: 0.4` with "EXCLUDED" tag

### Exercise Detail (Content Grouping)

Sections are ordered by user question:

1. **What is this?** — Icon circle (44px, category-colored) + name (28px) + category label + equipment + muscle activation bars. Flat on page bg, no card.
2. **How much?** — Prescription rows (sets × reps per modality) with dividers. Large numbers (20px) with `SETS` / `REPS` labels.
3. **How do I do it?** — Form cue in a tinted card (`alpha(catColor, 0.06)`, rounded). The one card on the page.
4. **Where does it fit?** — Goal dot-pills + injury cautions (muted text). Secondary/tertiary weight.
5. **Can I change it?** — Swap alternatives section (only when `fromProgram: true`). Category icon + name + equipment + "Select" button per candidate.

### Workout Template Detail (Content Grouping)

1. **What's the protocol?** — Flat hero: group label → title (28px/300) → objective → caloric anchor (`-480 kcal · Deficit`) → divider
2. **What does a week look like?** — Two inline stat rows: Frequency + Split (bordered), Rep Range + Protocol (no bottom border)
3. **What does a day look like?** — Session header (`SESSION · 5 EXERCISES`) + exercise rows with sets in goal color. Featured first exercise gets `headingSm` + focus subtitle.
4. **How does it adapt?** — Protocol note in dashed-border container
5. **What can I do?** — Customize (ghost) + Start session (split button)

### Goal Detail (Content Grouping)

1. **What's the deal?** — Flat hero: group label → title (28px/300) → objective → caloric number in accent → divider
2. **How do I eat?** — Macro split card (`Color.surface`, `borderSoft`, 8px labels, 16px bar) + meal prep approach (flat: heading + dot-pills + timing text)
3. **How do I train?** — Modalities: S = tinted card with icon, M = dot-label pills, W = muted text. Linked sessions in compact list-in-card.
4. **Is this right for me?** — Body profile as muted text (tertiary)
5. **What can I do?** — Quick action icon cards: Template + Exercises

### Exercise Swap Flow

```
Exercise Detail (opened from PROGRAM mode with fromProgram: true)
  → bottom section: "SWAP ALTERNATIVES"
  → 4-6 ranked candidates (same muscle · your equipment · injury-safe)
  → each row: category icon + name + equipment · muscle + "Select" button
  → tap Select → swapExercise() updates workoutPlan → popDetail()
```

Swap rules (from fitness.md §4b): same primary muscle group, compatible modality, available equipment, injury-safe, not already in session. Ranked by modality match (×3) + goal coverage (×1) + category match (×1).

### Workout History

| Element | Description |
|---------|-------------|
| Entry | "History" quick action on Program Overview |
| Layout | Reverse-chronological list of completed sessions |
| Each row | Date, session name, modality tag, key stats (volume, sets, avg RPE) |
| Tap row | Opens the same Summary layout used post-workout (hero + stats grid + exercise breakdown) |
| **Trend indicators** | Volume arrow (↑↓) vs previous session of same type. RPE trend across last 4 sessions. |
| Empty state | "Complete your first session to start tracking history" |

### What History Enables
- **"Am I getting stronger?"** — volume and load trends per exercise across sessions
- **"Am I recovering?"** — RPE/RIR trends (rising RPE at same load = fatigue)
- **"What did I do last Tuesday?"** — exact session replay with all logged data

### Active Session — Review Phase

| Element | Description |
|---------|-------------|
| Goal source tags | "TARGETS:" line showing which user goals drive this session |
| Exercise list | Numbered exercises with sets/reps/load and form cues |
| **Grouped exercises** | Supersets/circuits shown with colored left border, group label tag (SUPERSET A / CIRCUIT), "NO REST" annotations between grouped items |
| Meal timing tags | Pre/post workout meal importance |

### Active Session — Execute Phase

| Element | Description |
|---------|-------------|
| **Group indicator** | When inside a superset/circuit: accent-bordered banner showing group type, position (Exercise 1/2), "NO REST →" hint |
| Progress rail | Segmented bar showing exercise completion (done/active/remaining) |
| Elapsed timer | Global workout time, ticks every second |
| Set tracker | Visual cards per set (done with checkmark, active with accent fill, upcoming empty). Shows **effective load** (may differ from planned if adjusted) |
| RPE selector | 6 buttons (5-10), tap to select before logging. **Bidirectionally synced with RIR** |
| **RIR selector** | 6 buttons (0-5) labeled "REPS IN RESERVE". Tapping RIR auto-sets RPE to (10 - RIR) and vice versa |
| Log set button | Records reps + weight + RPE + RIR, advances to next set or exercise |
| **Load adjustment** | After logging a set with RIR ≥ 3 (too easy) or RIR = 0 (too hard), shows suggestion card during rest: "Bump to Xkg?" / "Drop to Xkg?" with Keep/Use buttons. Accepted adjustments apply to remaining sets |
| Rest timer | Countdown bar with remaining time, skip button. **Group-aware**: no rest between superset exercises, `restAfterGroup` timer after the last exercise in a group |
| Bottom toolbar | Pause/Resume, Skip Exercise, End Workout |

### Active Session — Summary Phase

| Metric | Computation |
|--------|-------------|
| Duration | Elapsed timer value |
| Total volume | Σ (reps × load) across all logged sets |
| Total sets | Count of logged sets |
| Avg RPE | Mean of all RPE inputs |
| **Avg RIR** | Mean of all RIR inputs (green color) |
| Exercise breakdown | Per-exercise: actual sets × reps @ weight (shows load progression if changed mid-session, e.g., "80 → 85 kg"), volume |
| **Intensity bar** | Combined RPE/RIR display with progress bar |

### What's Built

- [x] **Periodization** — Basic week advancement via `advanceWeek()` (Base/Build/Peak phases).
- [x] **Calendar ↔ program sync** — Plan tab reads real `workoutPlan` data. Sessions launchable from calendar.
- [x] **RIR / Reps in Reserve** — Bidirectional RPE↔RIR sync, load adjustment suggestions mid-session.
- [x] **Supersets / Circuits** — Group-aware execution with rest logic.
- [x] **Goal → Training linkage** — `goalSources` on sessions, visible tags on cards and in review phase.
- [x] **Today-first program view** — Today's session hero'd at top, week dot strip, remaining sessions as compact rows.
- [x] **Exercise browser redesign** — Three modes (PROGRAM / FOR YOU / ALL) with goal-aware filtering.
- [x] **Exercise swap flow** — Swap alternatives section in ExerciseDetail, `swapExercise()` in UserContext.
- [x] **Workout history** — Completed sessions list with volume trends.
- [x] **Content grouping** — Detail pages ordered by user question.

### What's Missing — Prioritized

**P0 — Daily directive clarity** (the user doesn't know what to do right now):
- [ ] Equipment checklist on the today hero ("You'll need: barbell, bench, dumbbells")
- [x] ~~"Last time" weights from previous same-type session on the today hero and during rest~~ — `getLastTimeWeights()` in Today.jsx + `lastTimeForNext` during rest in Training.jsx
- [x] ~~Skip the review phase — Start goes straight to execute~~ — Training.jsx starts at `execute` phase directly
- [ ] Inline form cues during rest (for the next exercise, not just "next up: name")

**P1 — Forward momentum** (the session ends in a dead end):
- [x] ~~Next session preview in the summary ("Thursday · Lower B · Strength")~~ — computed and displayed in Training.jsx summary phase
- [x] ~~Post-workout meal bridge ("Prioritize protein + carbs in the next 2 hours" + Eat tab link)~~ — nutrition bridge in Training.jsx summary
- [ ] Rest day recovery guidance ("You trained upper body yesterday — stretch shoulders tonight")
- [ ] PR detection and celebration in the summary ("New PR: Back Squat 85kg")

**P2 — Progress visibility** (the user can't see if the app is working):
- [ ] Volume/load trend on the today hero card ("volume ↑12% vs last week")
- [ ] Bodyweight reps metric for non-weighted users (total reps instead of kg volume)
- [ ] Strength progression graph per exercise over time
- [ ] Week-over-week comparison at the top of Program Overview

**P3 — Program coherence** (multi-goal programs feel random):
- [ ] Session rationale: one line per session explaining why this modality for these goals
- [ ] Phase transition moment: what changes between Base → Build → Peak
- [ ] Multi-goal coherence messaging for users like Jordan (4 modalities in one week)

**P4 — System loop closure** (the app doesn't learn from you):
- [ ] Auto-progression: carry forward load adjustments from last week's RIR data
- [ ] Week transition summary: "Last week: 4/4 sessions, volume up 8%, protein hit 5/7 days"
- [ ] Intervention surfacing on the Train tab (not just the dashboard)
- [ ] Cross-muscle swap fallback when same-muscle candidates are exhausted

**P5 — Polish**:
- [ ] Audio/haptic cues on rest timer completion
- [x] ~~Session persistence (active workout state lost on nav/close)~~ — `saveActiveSession()` / `clearActiveSession()` in UserContext, restored on mount in Training.jsx
- [ ] Deload detection (automatic deload scheduling from fatigue signals)

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

- [x] ~~**Onboarding integration**~~: 3D body viewer embedded in fitness onboarding body fat steps (front/back views + target)
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
  ├── Plan tab     → PlanCalendarContent (month/week/day, wired to workoutPlan, onStartSession)
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

## Test Agent Validation (2026-07-07)

Three automated test agents run end-to-end through the app at `/test`. Each validates onboarding, program generation, constraint filtering, swap candidates, and workout history.

### Agent Profiles

| Agent | Goals | Equipment | Days | Injuries | Experience |
|-------|-------|-----------|------|----------|------------|
| Alex | Hypertrophy | Full gym | 5 | None | Intermediate |
| Sam | Fat loss + healthier meals | Home basic | 3 | Knees | Beginner |
| Jordan | Recomp + max strength | Full gym | 4 | Shoulders | Advanced |

### Results: 56/57 checks passed

| Agent | Passed | Failed | Program | Volume | Swap |
|-------|--------|--------|---------|--------|------|
| Alex | 19/19 | 0 | PPL · 5 sessions | 2,288 kg | 4 alternatives |
| Sam | 19/19 | 0 | Full Body · 3 sessions | 0 kg (bodyweight) | 3 alternatives |
| Jordan | 18/19 | 1 | Upper/Lower · 4 sessions | 1,116 kg | **0 alternatives** |

### Bugs Found & Fixed

1. **Caloric modifier not applied** — `deriveCaloricMod('build')` returned 0 because `GOAL_CALORIC_STATE` uses full keys (`hypertrophy`) but `profile.goal` uses shorthand (`build`). **Fixed**: added `CALORIC_ALIAS` mapping in `goalEngine.js`. Same fix applied to `deriveMacroSplit`.

2. **Volume = 0 for bodyweight users** — Sam's exercises are all bodyweight (load = 0), so volume = 0 kg. The metric is meaningless. **Not fixed** — needs a reps-only volume alternative (total reps × bodyweight estimate).

3. **Swap dead end** — Jordan's Push-up has 0 swap candidates. Shoulder injury excludes most chest exercises, and the rest are already in the session. **Not fixed** — edge case. Could fall back to showing cross-muscle alternatives with a "different muscle group" label.

### What the Tests Validate

| Category | Checks |
|----------|--------|
| Onboarding | TDEE > 0, target kcal > 0, macros > 0, macros sum ≈ target |
| Program | Plan generated, sessions > 0, schedule = 7 days, training ≤ available days, goal sources present, modalities align, phase = Base at week 1, total weeks = 12 |
| Constraints | No injury-excluded exercises, all exercises use available equipment |
| Browser | Recommended exercises > 0 |
| Swap | Swap candidates exist for first exercise |
| History | Volume computable from logged sets |

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
- [x] ~~Periodization~~ — basic week advancement with Base/Build/Peak phases
- [x] ~~Exercise tab redesign~~ — today-first view, 3-mode browser, swap flow, goal-aware filtering
- [x] ~~Workout history~~ — completed sessions list with volume trends
- [x] ~~Exercise substitution~~ — swap alternatives with ranked candidates
- [x] ~~"Last time" weights~~ — on Today hero + during rest between sets
- [x] ~~Review phase eliminated~~ — Start goes straight to execute
- [x] ~~Next session + nutrition bridge in summary~~ — forward exit from workout summary
- [x] ~~Session persistence~~ — active workout state saved/restored across nav
- [ ] Auto-progression (cross-session weight carry-forward based on RIR)
- [ ] PR persistence and history
- [ ] Deload week detection
- [ ] Audio/haptic cues
- [ ] Bodyweight volume metric (reps × bodyweight estimate, for users with load = 0)
- [ ] Cross-muscle swap fallback (when no same-muscle candidates exist)

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
- [x] ~~Profile toggle on exercise mode~~ — NEW USER / ONBOARDED states with goal-seeded plans
- [x] ~~Onboarding Mode page in `/journey`~~ — `/journey/seed` with 6-phase view (general + fitness onboarding)
- [x] ~~Fitness onboarding in exercise mode~~ — `/journey/exercise` includes fitness onboarding as first phase
- [ ] Tracking Mode page in `/journey`
- [x] ~~Body Composition integration in journey~~ — FOB_BodyFat screens with 3D preview in seed + exercise modes
- [ ] Screen coverage for delete flows (both cooking and exercise)

 P0 items are the highest-impact, lowest-effort changes — they make the existing screens smarter without building new ones. Specifically:                             
                                                                                                                                                                       
  1. "Last time" weights on the today hero + during rest                                                                                                               
                                                                                                                                                                       
  This is the single biggest UX win available. Right now the user has to remember what they lifted last week, or navigate to History, find the session, scan the       
  breakdown, go back, and start. The data already exists in activityLog — it just needs to be surfaced in two places:                                                  
                                                                                                                                                                       
  - Today hero: "Last time: Squat 80kg × 8 · Bench 60kg × 5" below the exercise preview                                                                                
  - Rest screen: "Next: Romanian Deadlift · last time 70kg × 10" alongside the timer                                                                                   
                                                                                                                                                                       
  This is a pure data lookup — find the most recent activity log entry with the same session name, extract the per-exercise loads. No new screens, no new components.  
  Just a useMemo + a few lines of type.                                                                                                                                
                                                                                                                                                                       
  2. Skip the review phase                                                                                                                                             
                                                                                                                                                                       
  The review phase shows the same exercise list the today hero already previews. Removing it means one less tap between "I want to work out" and actually logging a    
  set. The form cues that currently live in the review phase move to the rest screen (during the natural downtime between sets).                                       
                                                                                                                                                                       
  This is a state change in Training.jsx — skip the 'review' phase and start at 'execute'.                                                                             
                                                                                                                                                                       
  3. Enhanced summary (next session + nutrition bridge)                                                                                                                
                                                                                                                                                                       
  After completing a workout, the summary currently shows stats and a Done button. Adding two lines changes it from a dead end to a transition:                        
                                                                                                                                                                       
  - "Next session: Thursday · Lower B · Strength" — lookup from workoutPlan.schedule                                                                                   
  - "Post-workout: prioritize protein + carbs within 2 hours" — static text based on deriveMealTiming() which already exists in goalEngine                             
                                                                                                                                                                       
  4. Equipment checklist                                                                                                                                               
                                                                                                                                                                       
  Each exercise has an equipment field. Collect the unique equipment from today's session, display as a one-liner on the hero: "You'll need: barbell · bench ·         
  dumbbells". Pure derivation from existing data.                                                                                                                      
                                                                                                                                                                       
  ---                                                                                                                                                                  
  These four changes touch 2 files (ProgramOverview.jsx, Training.jsx), add zero new screens, and transform the training flow from "here's your data" to "here's what  
  to do." Want me to build them?                                                                                                                                       
                                            y

---

## Complete Navigation Diagram

Every screen, every tap target, every connection — traced from the codebase as of 2026-07-07. Includes trigger precedence, nutrition chain analysis, broken return paths, and the corrected hub model.

### Tab Bar (5 tabs)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│   HOME   │  TRAIN   │   EAT    │   PLAN   │   YOU    │
│  Today   │ Program  │  Macros  │ Calendar │ Profile  │
│ Content  │ Overview │ Targets  │  M/W/D   │   Hub    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

### Today Hero: Trigger Precedence Stack

The Today screen resolves one hero state from several that can be simultaneously true. These are **not** mutually exclusive states competing for the whole screen — check-in and week-transition are **bands** that stack above the training/rest hero. Only training-vs-rest is a true either/or.

First match wins, highest slot first:

| Priority | Trigger | Condition | Renders as |
|----------|---------|-----------|------------|
| 1 | **Check-in due** | `daysSince(lastCheckIn) >= 7` | Training day: slim prompt bar above session hero. Rest day: claims the hero slot. |
| 2 | **Week transition** | First app-open of new program week (`currentWeek !== lastSeenWeek`) | Dismissible summary band above hero. Self-clears via `lastSeenWeek` flag. |
| 3 | **Training day** | `schedule[todayIndex].isRest === false` | Session hero + Start workout. The default. |
| 4 | **Rest day** | `schedule[todayIndex].isRest === true` | Recovery message + next-session preview. |

Edge cases pinned down:

- **Missed check-in**: Does not stack. Two weeks lapsed = one check-in prompt. The flow captures current weight against the last recorded one (delta spans the gap). No queue of back-owed check-ins.
- **Missed session**: If yesterday was a training day marked incomplete, the hero carries a quiet line: "Missed: Upper A — do it today or skip?" This is a micro-state the week strip already implies (user sees the gap dot) but the app should acknowledge explicitly.
- **Training day + check-in due + week transition**: User sees: week-transition band → check-in prompt bar → session hero → Start. Start is never displaced.

### Corrected Master Flow Map

Today is the true hub. Every mode exits back to Today, not Dashboard. Nutrition chain shown with all edges.

```
                                 ┌──────────────────┐
                                 │    APP OPEN       │
                                 └────────┬─────────┘
                                          │
                              ┌───────────▼───────────┐
                              │        TODAY          │
                              │   (the hub — every    │
                              │    mode returns here)  │
                              └───┬───┬───┬───┬───┬───┘
                                  │   │   │   │   │
          ┌───────────────────────┘   │   │   │   └──────────────────────┐
          │            ┌──────────────┘   │   └────────────┐             │
          │            │                  │                │             │
          ▼            ▼                  ▼                ▼             ▼
    ┌───────────┐ ┌──────────┐    ┌────────────┐   ┌──────────┐  ┌──────────┐
    │  TRAINING │ │ EXERCISE │    │  CHECK-IN  │   │ NUTRITION│  │  COOKING │
    │   LOOP    │ │  BROWSE  │    │    LOOP    │   │   CHAIN  │  │   MODE   │
    └─────┬─────┘ └────┬─────┘    └──────┬─────┘   └────┬─────┘  └────┬─────┘
          │            │                 │              │             │
          ▼            ▼                 ▼              ▼             ▼
     (see below)  (see below)     (see below)    (see below)    (see below)
```

### Training Loop (connected, tested)

```
Today / Program Overview
  │
  ├── "Start workout" ──────────────────────────┐
  │                                              ▼
  ├── Tap session row ──────────────────► Active Session
  │                                       │ (execute phase)
  │                                       │
  │                                       ├── Log sets (RPE/RIR)
  │                                       ├── Rest: form cue + last-time weight
  │                                       ├── Load adjustment suggestions
  │                                       │
  │                                       ▼
  │                                  Workout Summary
  │                                       │
  │                                       ├── Volume, sets, avg RPE/RIR
  │                                       ├── "Next: Thu · Lower B" (forward bridge)
  │                                       ├── "Protein + carbs now" (nutrition bridge)
  │                                       │
  │                                       ▼
  │                                  ◄── TODAY (dot turns green) ──►
  │
  ├── "Browse exercises" ───────► Exercise Browser
  │                                │ ├── PROGRAM mode: Swap → Exercise Detail → Select → pop
  │                                │ ├── FOR YOU mode: Tap → Exercise Detail
  │                                │ └── ALL mode: Tap → Exercise Detail
  │                                │
  │                                └── Mode resolution when opened with { goalKey }:
  │                                    opens in ALL mode, pre-filtered to that goal
  │
  ├── [goal name] action ──────► Goal Detail
  │                                ├── "Training plan" → Workout Template
  │                                │                       ├── Tap exercise → Exercise Detail
  │                                │                       ├── "Start workout" → Active Session
  │                                │                       └── "Swap exercises" → Exercise Browser
  │                                ├── "Browse exercises" → Exercise Browser { goalKey }
  │                                └── Tap session row → Active Session
  │
  ├── "Past workouts" ─────────► Workout History
  │                                └── Tap entry → Summary Detail (replay)
  │
  └── "Schedule" ──────────────► Plan tab (switchTab)
```

### Nutrition Chain (disconnected — edges missing)

The nutrition pipeline is a linear chain with forward edges un-buttoned and two loop-closing write edges absent. Every node exists; the connections between them don't.

```
  Macro Targets ─ ─ ─► Meal Queue ─ ─ ─► Batch Strategy
  (eat tab)           (screen exists,    (screen exists,
  ❌ no "plan meals"   edge missing)      edge missing)
       │                                      │
       │                                 ─ ─ ─┘
       │                                │
       ▼                                ▼
  ┌─────────┐                     Shopping List
  │ Food Log│ ◄─ ─ ─ ─ ─ ─ ─ ─     (screen exists,
  │         │   ❌ no write-back     edge missing)
  └────┬────┘                           │
       │                           ─ ─ ─┘
       │  ❌ no remaining-macros   │
       │     update to Macros      ▼
       │                      Fridge / Pantry
       │                      (no reconciliation
       │                       with shopping)
       │                           │
       │                      ─ ─ ─┘
       │                     │
       │                     ▼
       │              Ingredient Merge ─ ─ ─► Parallel Timeline
       │                                           │
       │                                      ─ ─ ─┘
       │                                     │
       │                                     ▼
       │                              Active Cook Mode
       │                                     │
       │                                     ▼ ✅ (exists)
       │                              Cook Summary
       │                                     │
       └──── ❌ ─────────────────────────────┘
             "Log this meal" edge missing
             (the critical ACT→OBSERVE closure)
```

**Nutrition edge status table:**

| Source | Action (needed) | Target | Data | Status |
|--------|--------|--------|-------------|--------|
| Macro Targets | "Plan meals" | Meal Queue | `{ targets }` | ❌ dead end |
| Meal Queue | "Optimize batches" | Batch Strategy | `{ meals[] }` | ⚠️ screen exists, edge missing |
| Batch Strategy | "Build shopping list" | Shopping List | `{ batches[] }` | ⚠️ edge missing |
| Shopping List | "Start prep" | Fridge / Pantry | `{ items[] }` | ⚠️ edge missing |
| Shopping List | Check off item | Fridge (write) | `{ item, have: true }` | ❌ no reconciliation |
| Fridge / Pantry | "Verify → merge" | Ingredient Merge | `{ inventory }` | ⚠️ edge missing |
| Ingredient Merge | "View timeline" | Parallel Timeline | `{ mergedSteps[] }` | ⚠️ edge missing |
| Parallel Timeline | "Open cook mode" | Active Cook | `{ timeline }` | ⚠️ edge missing |
| Active Cook | "Finish" | Cook Summary | `{ portions, macros }` | ✅ exists |
| **Cook Summary** | **"Log this meal"** | **Food Log (write)** | **`{ meal, macros }`** | **❌ critical missing edge** |
| **Food Log** | **(auto)** | **Macro Targets (remaining)** | **`{ consumed }`** | **❌ no real-time update** |

The two ❌ edges that aren't just "missing button" but "missing data flow":

- **Cook Summary → Food Log** closes the ACT→OBSERVE loop for nutrition. Without it, a user cooks a tracked meal and manually re-enters it in the food log — the nutrition equivalent of finishing a workout and re-typing every set.
- **Food Log → Macro Targets (remaining)** is why Macro Targets is a dead-end display. Wire this and the "display-only" problem dissolves without a new screen.

### Broken Returns + Orphaned Entries

#### Ambiguous return paths

| Screen | Problem | Resolution |
|--------|---------|------------|
| Workout Summary → "Done" | Pops "to caller" — but caller could be Today, Program Overview, Calendar, or Workout Template (5 entry points, 1 exit). Doc promises both "bridge to nutrition" and "back to Today with green dot" — these conflict. | Force-return to Today (green-dot payoff is the reward moment). Nutrition bridge is a button *within* the summary, not the exit action. |
| Exercise Detail → Select swap | Caller can be Browser (Program mode), Workout Template, or long-press in Execute. From Execute, popping should return mid-session at the same set — but the Execute long-press swap is described in prose only, with no data-passed or return-target spec. | Document the Execute swap edge explicitly: `pushDetail('exercise-detail', ..., { fromExecute: true, setIndex, exerciseIndex })`. On pop, restore session state to same position. |
| Check-in Flow | Three entries (Today, Profile, hero prompt). Zero exits — "completes internally, no forward bridge." The intervention it generates never gets seen because it renders on Dashboard, not Today. | Exit to Today with updated targets. Surface generated interventions on Today, not Dashboard. |

#### Orphaned entry points

| Screen | Issue |
|--------|-------|
| Exercise Browser | Opens in PROGRAM mode "from Train tab" but also opened from Goal Detail and Workout Template (both pass `{ goalKey }`). Which mode opens? Unspecified — should open in ALL mode pre-filtered to that goal when `goalKey` is present. |
| Workout Template → "Start workout" | Finds "first matching session from plan" by goalKey. If no session matches (user viewing a fat-loss template but plan is recomp-only), the start button does nothing. No empty-state defined. |
| Workout Template → Tap exercise row | Uses fuzzy name match to EXERCISES array. A miss lands on… nothing. Undefined failure case on a tap that looks deterministic. |

#### Data continuity gaps

| Flow | Gap |
|------|-----|
| Goal Detail → Workout Template → Active Session | Template passes `{ goalKey }`; Template → Active Session passes `{ session }` as "first matching." If the goal has no matching session in the current week, the chain silently breaks. |
| All nutrition screens | Return to Dashboard, but Today is now the front door. User who starts meal prep from Today's "Meal Prep" button finishes cooking and gets dropped on Dashboard — a screen they didn't come from. Today migration applied to entrances but not exits. |

### Connection Tables (current state, all screens)

#### Tab: HOME (Today)

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Today | "Start workout" hero | Active Session | `{ session }` |
| Today | "Exercises" action | Exercise Browser | — |
| Today | "History" action | Workout History | — |
| Today | "Check-in" action | Check-in Flow | — |

#### Tab: TRAIN (Program Overview)

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Program Overview | "Start workout" hero | Active Session | `{ session: todayEntry }` |
| Program Overview | Tap session row | Active Session | `{ session: entry }` |
| Program Overview | "Browse exercises" | Exercise Browser | — |
| Program Overview | Goal name action | Goal Detail | `{ goalKey }` |
| Program Overview | "Schedule" | Plan tab | (switchTab) |
| Program Overview | "Past workouts" | Workout History | — |

#### Detail: Active Session → Summary

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Active Session | "End" → complete | Summary (internal) | — |
| Summary | "Done" | **→ Today** (force-return) | — |

#### Detail: Exercise Browser

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Browser (Program) | "Swap" button | Exercise Detail | `{ exercise, fromProgram, sessionId, exerciseId }` |
| Browser (For You) | Tap row | Exercise Detail | `{ exercise }` |
| Browser (All) | Tap row | Exercise Detail | `{ exercise }` |

#### Detail: Exercise Detail

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Exercise Detail | "Select" swap | Pop to caller | `swapExercise()` in UserContext |

#### Detail: Goal Detail

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Goal Detail | "Training plan" | Workout Template | `{ goalKey }` |
| Goal Detail | "Browse exercises" | Exercise Browser | `{ goalKey }` |
| Goal Detail | Tap session row | Active Session | `{ session }` |

#### Detail: Workout Template

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Workout Template | "Start workout" | Active Session | `{ session }` (first match from plan) |
| Workout Template | Tap exercise row | Exercise Detail | `{ exercise }` (fuzzy match) |
| Workout Template | "Swap exercises" | Exercise Browser | `{ goalKey }` |

#### Detail: Workout History

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Workout History | Tap entry | Summary Detail | `{ loggedSets, elapsed, session }` |

#### Detail: Profile

| Source | Action | Target | Data passed |
|--------|--------|--------|-------------|
| Profile | "Log check-in" | Check-in Flow | — |

#### Dashboard (tile taps)

| Tile | Target | Detail ID |
|------|--------|-----------|
| Goal | Goal Setting | `goal` |
| TDEE | TDEE Model | `tdee` |
| Macros | Macro Targets | `macros` |
| Calendar | Plan Calendar | `plan` |
| Session | Program Overview | `session` |
| Prep | Meal Prep Merge | `prep` |
| Check-in | Check-in Flow | `checkin-flow` |
| Fridge | Fridge / Pantry | `fridge` |
| Streak | Profile | `profile` |
| Water | Water Tracking | `water` |

### Dead Ends (no forward navigation)

| Screen | Category | Fix |
|--------|----------|-----|
| Macro Targets | Nutrition | Add "Plan meals" → Meal Queue |
| Meal Prep Merge | Nutrition | Add "View timeline" → Parallel Timeline |
| Batch Prep | Nutrition | Add "Shopping list" → Shopping List |
| Fridge / Pantry | Nutrition | Add "Start prep" → Ingredient Merge |
| Food Log | Nutrition | Wire consumed → remaining macros update |
| Cook Summary | Nutrition | Add "Log meal" → Food Log write-back |
| TDEE Model | Informational | Acceptable dead end (reference screen) |
| Water Tracking | Self-contained | Acceptable dead end (standalone tracker) |
| Macro Heatmap | Analytical | Acceptable dead end (reference screen) |
| Check-in Flow | Tracking | Add exit → Today with updated targets + intervention |

### Key User Journeys

**"I want to work out" (1 tap)**
```
Today → Start workout → Execute → Summary → Today (green dot)
```

**"I want to swap an exercise" (3 taps)**
```
Program Overview → Browse exercises → Swap → Exercise Detail → Select → pop
```

**"I want to understand my goal" (2 taps)**
```
Program Overview → [goal name] → Goal Detail → Training plan / Browse exercises
```

**"I want to see what I lifted last time" (2 taps)**
```
Program Overview → Past workouts → Tap entry → Summary Detail
```

**"I want to check in" (1 tap from Today)**
```
Today → Check-in → weigh in → body fat → rating → results → Today (targets updated)
```

**"I want to cook" (currently broken)**
```
Today (rest day) → Meal Prep → ❌ dead end (no cook mode link, no meal log write-back)
```

**"I want to cook" (target state)**
```
Today → Macros → Plan meals → Meal Queue → Batch → Shopping → Fridge
  → Merge → Timeline → Cook Mode → Summary → Log meal → Today (macros updated)
```

### Fix Prioritization

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| **1** | Cook Summary → Food Log → remaining-macros write-back | Closes nutrition ACT→OBSERVE loop. Kills Macro Targets dead-end. | Medium (data flow) |
| **2** | Standardize all mode exits to Today, not Dashboard | Fixes intervention orphaning + nutrition orphaning in one move. | Low (return targets) |
| **3** | Check-in return edge to Today with updated targets | Generated interventions actually surface where user will see them. | Low (exit target) |
| **4** | Document + build Execute-phase swap edge | Touches live session state. Currently prose-only with no data-passed or return spec. | Medium (state preservation) |
| **5** | Button the nutrition forward edges (⚠️ rows above) | Cheap — screens exist, just need pushDetail calls wired. | Low per edge |
| **6** | Exercise Browser mode resolution for `{ goalKey }` | Prevents undefined default-mode when opened from Goal Detail / Template. | Low (conditional) |
| **7** | Workout Template empty-state for no matching session | Prevents silent failure on "Start workout" when goal has no plan session. | Low (guard clause) |