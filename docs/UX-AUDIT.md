# AUREVI0N — UX Audit & Ideal User Journey

**Date:** 2026-06-06
**Scope:** Full product experience — onboarding through daily use
**Status:** Prototype (no backend, mock data, no persistence)

---

## Part 1: Current State Audit

### What Actually Exists

The prototype has **31 screens** across 10 modules. Everything runs inside a fixed 402×874px phone frame. No backend, no auth, no persistence — every screen is a self-contained React component fed mock data.

| Module | Screens | Interactive? | Connected to rest of app? |
|--------|---------|-------------|--------------------------|
| Onboarding | 10 | Yes — full data intake | No — data dies on completion |
| Dashboard | 3 variants | No — view only | No — tiles don't navigate |
| Goal Setting | 2 | Slider only | No |
| TDEE/Energy | 2 | No | No |
| Nutrition/Macros | 4 | Checkboxes only | No |
| Meal Prep | 4 | Step buttons, timers | No |
| Training | 1 | Set tracker, rest timer | No |
| Calendar | 3 (month/week/day) | Date/day selection | No |
| Fridge/Pantry | 1 | Filters, checkboxes | No |
| Profile | 1 | No | No |

---

### What's Working

**1. Onboarding flow is legit.**
10 steps, smooth slide transitions, real TDEE math (Harris-Benedict + activity multiplier), computes macros. It collects sex, age, height, weight, body fat, activity level, training experience, and goal — then spits out a daily calorie target and P/C/F split. The animated TDEE ring reveal is satisfying. The "contract" summary at the end creates commitment.

**2. Design system is tight.**
Tokens are clean: dark-first palette, coral accent (#FF6E50), Geist/Geist Mono type stack, 4px spacing scale, well-defined radii. Motion system respects `prefers-reduced-motion`, uses proper spring easing for interactive elements, and staggers entrances. The visual language — hatched bars, mono labels, instrument-panel density — feels distinct.

**3. Meal prep flow is the standout feature.**
Pre-cook merge → parallel Gantt timeline → active cook mode with persistent timers. This is the thing nobody else does. The oven conflict detection (red alert when two recipes need the oven simultaneously) is a genuinely useful detail. Multi-timer management during cooking solves a real problem.

**4. Dashboard tile concept is smart.**
Three layout presets (Balanced / Nutrition Focus / Training Focus) that adapt to the user's current phase. Tile density control (full/mid/compact) is well-conceived. Nine tile types covering the full feature surface.

**5. The training session screen works.**
Exercise timeline with done/active/idle rings, per-set tracking (reps × weight), rest timer with skip — this covers the core gym interaction loop.

---

### What's Broken or Missing

#### Critical Gaps

**1. Nothing connects to anything.**
The onboarding computes your TDEE and macros — then throws it away. The dashboard shows tiles — but tapping them does nothing. The meal prep flow exists — but you can't get to it from the dashboard. Every module is an island. The user has no way to actually *use* the app as a continuous experience.

**2. No data persistence.**
Close the tab, lose everything. Onboarding results don't carry forward. Check-in history is hardcoded. Progress tracking is fake. Without at minimum local storage (and ideally a backend), the app is a slideshow.

**3. No way to log anything.**
The app tracks macros, weight, body fat, meals, and workouts — but there's no input mechanism for any of it beyond onboarding. No "log meal" screen. No "record weight" flow. No way to mark a workout as done outside the active session view. The system shows you data but gives you no way to create it.

**4. No check-in flow.**
The profile screen shows 4 weeks of check-in history, but there's no screen to actually *do* a check-in. Body composition is the core metric — the app needs a weekly ritual where you weigh in, optionally update body fat, and see how your trend is moving.

**5. The shopping/fridge loop is disconnected.**
Shopping list exists. Fridge exists. But checking items off the shopping list doesn't update the fridge. Buying groceries doesn't reduce the "missing" count. These two screens should be one continuous flow.

#### UX Issues

**6. Dashboard is passive.**
Tiles show information but offer no actions. The macro tile shows P/C/F bars — but you can't tap to log food. The session tile shows today's workout — but you can't tap to start it. The fridge tile says "4 missing" — but you can't tap to shop. Every tile should be a doorway.

**7. Calendar has no creation flow.**
Month/week/day views display events, but there's no way to create, edit, or reschedule them. You can't add a rest day, move a training session, or block time for meal prep. It's read-only.

**8. No notifications or reminders.**
No push notification hooks. No "time to meal prep" nudge. No "weigh-in day" reminder. No "you haven't logged today" prompt. The app is entirely pull-based — the user has to remember to open it.

**9. Onboarding birthday picker is awkward.**
Scroll columns for month/day/year are functional but feel dated. A native date input or a more modern wheel picker would reduce friction. Currently users have to scroll through ~80 years of options.

**10. No empty/error/loading states.**
Every screen assumes perfect data. What happens when there are no meals planned? No training sessions this week? No check-in history? The user sees either mock data or nothing. Real apps need skeleton loaders, empty states with CTAs ("Plan your first meal"), and error recovery.

#### Technical Debt

**11. Duplicate file structure.**
Old numbered files (`01-goal-setting.jsx`) coexist with new organized files (`screens/GoalSetting.jsx`). `_old_index.html` is still in the repo. `onboarding_fitness/` has 24 PNGs that nothing references. This makes it unclear what's canonical.

**12. shared.jsx is 1000+ lines.**
18 components in one file. Should be split by domain (nutrition components, training components, layout primitives).

**13. No type safety.**
Large data objects passed around with no prop validation or TypeScript. Easy to break things silently.

---

### Friction Map: Current Screens

```
HIGH FRICTION                                              LOW FRICTION
|                                                                    |
|  Logging food    Check-in     Calendar      Shopping    Dashboard  |
|  (doesn't       (doesn't     (read-only)   → Fridge    tiles      |
|   exist)         exist)                     (broken     (dead      |
|                                              loop)      ends)      |
|                                                                    |
|  ← These flows DON'T EXIST →    ← These flows EXIST but BREAK →  |
```

---

## Part 2: Ideal User Journey

### The Big Picture

AUREVI0N has three time horizons that matter:

1. **First 5 minutes** — Onboarding: who are you, what do you want, here's your plan
2. **Daily loop** — Log, train, eat, check progress
3. **Weekly rhythm** — Check in, see trends, adjust plan

The ideal journey nails all three. Here's each one, beat by beat.

---

### Journey 1: First Contact → First Plan (Day 0)

```
DISCOVER → LAND → ONBOARD → CONTRACT → DASHBOARD
```

#### Step 1: Landing (pre-app)
The user finds AUREVI0N through social, search, or word of mouth. They hit a landing page that communicates the value prop in under 5 seconds:

> **Your body. Your data.**
> AI-native nutrition, training, and body composition — tracked with precision, not guesswork.

One CTA: **"Build your plan"** — goes straight to onboarding. No sign-up wall. No email gate. Get them into the experience immediately.

#### Step 2: Onboarding (5-7 minutes)
The current 10-step flow is solid. Keep it, with these refinements:

| Step | Current | Ideal |
|------|---------|-------|
| 1. Welcome | Logo + tagline | Add "takes 3 minutes" to reduce abandonment |
| 2. Sex | Binary buttons | Add "Prefer not to say" with note that it affects TDEE accuracy |
| 3. Birthday | Scroll picker | Native date input or age-range selector for speed |
| 4. Height + Weight | Sliders + unit toggle | Keep — works well. Add "I don't know my exact weight" option |
| 5. Body Fat | 8-range grid | Add visual body silhouettes for each range (most people can't estimate %) |
| 6. Activity | Frequency + daily level | Keep — good granularity |
| 7. Experience | Lifting + cardio | Keep |
| 8. Goal | 4 cards | Add brief outcome preview ("Lose fat → ~0.5kg/week at your stats") |
| 9. TDEE Result | Animated ring + bubbles | Add comparison ("That's about 8 eggs and a steak worth of energy") |
| 10. Ready | Contract summary | Add "Your first week" preview — show what Mon-Sun looks like |

#### Step 3: Account Creation (post-onboard)
After the contract screen — not before. The user already has a plan. Now give them a reason to save it:

> **Save your plan.** Email or Apple/Google sign-in.

Minimal fields. No profile photo. No username. Just auth so their data persists.

#### Step 4: First Dashboard
Drop them into their personalized dashboard with their computed data populated. Every tile is real — their TDEE, their macro targets, their first training session suggestion, their first meal queue. The dashboard should feel alive from minute one.

**First-run affordance:** A subtle pulsing indicator on the first actionable tile (e.g., "Today's session" or "Plan your meals") with a micro-tooltip: "Start here."

---

### Journey 2: The Daily Loop (Day 1+)

This is where retention lives or dies. The daily loop has to be fast, useful, and rewarding.

```
OPEN → GLANCE → ACT → LOG → CLOSE
       (10s)    (variable)  (30s)
```

#### Morning: Glance + Plan

**Open app → Dashboard.**
The user sees:
- **Top card: Today's focus.** One sentence: "Pull day. 1,940 kcal target. 3 meals prepped."
- **Tiles below:** Macro budget remaining, today's session, next meal, streak count.

This takes 10 seconds. The user knows what their day looks like.

#### Midday: Log a Meal

**Tap macro tile → Meal log screen (NEW).**

The meal logging flow — which doesn't exist yet — should work like this:

1. **Quick log:** Tap a prepped meal from the queue → auto-fills macros → done in 2 taps
2. **Search log:** Type food name → select from database → adjust portion → log
3. **Scan log:** Barcode scanner → auto-fill → confirm
4. **Manual log:** Enter kcal/P/C/F directly (power users)

After logging, the macro tile updates in real-time. The progress bars fill. If you're over on fat, the bar turns amber. Simple visual feedback.

**Key principle:** Logging should take under 15 seconds for a prepped meal. The meal queue (which AUREVI0N already generates) should make most logs a single tap.

#### Afternoon: Train

**Tap session tile → Training session screen.**

The current training screen is good. Add:
- **Auto-start rest timer** when a set is completed (currently manual)
- **Progressive overload suggestion:** "Last time: 4×80kg. Try 4×82.5kg?" shown per exercise
- **Session summary** at the end: total volume, time, PRs hit
- **Auto-log** the session to today's calendar on completion

#### Evening: Check Progress

**Tap TDEE tile → Energy trend screen.**

Show today's intake vs. TDEE. The confidence band visualization already exists and is excellent — make it accessible from the dashboard. Add a simple "+/- from target" number front and center.

#### Any time: Quick Actions

The dashboard needs a floating action button (FAB) or quick-action row for the 4 most common actions:
1. **Log meal** (fork icon)
2. **Start session** (dumbbell icon)
3. **Quick weigh-in** (scale icon)
4. **Snap progress photo** (camera icon)

These bypass navigation entirely and drop the user into a single-purpose flow.

---

### Journey 3: The Weekly Rhythm (Week 1+)

#### Check-in Day (e.g., Sunday morning)

**Notification:** "Weekly check-in. Step on the scale?"

**Tap → Check-in flow (NEW):**

```
WEIGH IN → BODY FAT (optional) → PROGRESS PHOTO (optional) → WEEKLY SUMMARY
```

1. **Weigh-in:** Number input with last week's value shown. Auto-calculates delta.
2. **Body fat:** Optional. Same range selector as onboarding, or manual % input.
3. **Progress photo:** Optional. Front/side pose guide overlay. Stored privately.
4. **Weekly summary:** 
   - Weight trend (4-week sparkline)
   - Average daily intake vs. target
   - Training compliance (sessions completed / planned)
   - TDEE confidence update
   - **Pace check:** "You're losing 0.4kg/week. Target pace: 0.5kg/week. ON PACE." (green) or "AHEAD / BEHIND" with suggestion

This weekly summary is the emotional core of the app. It answers: **"Is this working?"**

#### Plan Next Week

After check-in, prompt:

> **Plan next week?** Your training split and meal queue are ready.

**Tap → Week planner (NEW):**
- Pre-populated with AI-suggested training split + meal plan based on macro targets
- User can swap sessions, move days, replace meals
- Confirm → populates calendar for the week
- Shopping list auto-generates from confirmed meals

#### Monthly Review (Every 4 weeks)

**Notification:** "Month 1 complete. See your progress?"

**Tap → Monthly review screen (NEW):**
- 4-week weight/BF trend chart
- Total deficit/surplus achieved
- Training volume trend
- TDEE model accuracy (confidence band narrowing over time)
- Goal progress bar: "32% of the way to 15% BF"
- Option to **adjust goal** if pace needs changing

---

### Journey 4: Meal Prep Day (Weekly)

This is AUREVI0N's killer feature. The flow should be seamless:

```
SHOPPING LIST → SHOP → UPDATE FRIDGE → PREP → COOK → DONE
```

1. **Sunday morning:** Open app → "Prep day" card on dashboard → tap
2. **Shopping list:** Delta-based (already built). Check items as you shop. Mark "done" when back home.
3. **Fridge update:** Completing the shopping list auto-updates fridge inventory. New items appear, quantities adjust.
4. **Start prep:** Pre-cook merge screen (already built). See all recipes, combined ingredients, conflict alerts.
5. **Cook:** Parallel timeline (already built) → active cook mode with timers (already built).
6. **Done:** Mark meals as prepped → they appear in the meal queue for the week → logging them later is one tap.

The fridge ↔ shopping list ↔ meal queue loop is what makes this sticky. Buy ingredients → cook meals → log meals → see macros fill up → feel good → repeat.

---

### The Emotional Arc

```
WEEK 0:  "Let's see if this works"     → Curiosity
WEEK 1:  "Okay the plan makes sense"   → Trust
WEEK 2:  "I actually hit my macros"    → Confidence  
WEEK 4:  "The scale is moving"         → Belief
WEEK 8:  "I can see the difference"    → Commitment
WEEK 16: "I hit my goal"              → Pride → Set new goal → Loop
```

Every screen, every interaction, every notification should serve this arc. The app's job is to make the user feel like they're making progress — because they are, and AUREVI0N is showing them the proof.

---

## Part 3: Gap Analysis — Current vs. Ideal

### What Needs to Be Built

| Priority | Feature | Why | Effort |
|----------|---------|-----|--------|
| P0 | **Data persistence** | Nothing works without it | Backend API or local storage |
| P0 | **Screen-to-screen navigation** | Users can't actually use the app | Router + state management |
| P0 | **Meal logging** | Core daily action doesn't exist | New screens + food database |
| P0 | **Onboarding → Dashboard data flow** | Computed values die on completion | State management / context |
| P1 | **Check-in flow** | Weekly retention ritual | 4 new screens |
| P1 | **Dashboard tile actions** | Tiles are dead ends | onClick handlers + navigation |
| P1 | **Session auto-logging** | Training data doesn't persist | Post-session write |
| P1 | **Shopping → Fridge sync** | Two disconnected inventories | Shared data model |
| P2 | **Week planner** | Users can't plan ahead | New screen + calendar integration |
| P2 | **Quick action FAB** | Reduces daily friction | UI component + routes |
| P2 | **Monthly review** | Long-term engagement | New screen |
| P2 | **Progressive overload suggestions** | Training intelligence | Algorithm + UI |
| P3 | **Push notifications** | Passive → active engagement | Service worker + permissions |
| P3 | **Barcode scanning** | Faster meal logging | Camera API + food DB |
| P3 | **Progress photos** | Visual tracking | Camera + storage |
| P3 | **Empty/error/loading states** | Production readiness | Per-screen |

### Existing Screens → P0 Map

Every existing screen either feeds into a P0, benefits from a P0, or both. Here's which screens depend on which plumbing.

---

#### P0-1: Screen-to-Screen Navigation (Router + State Management)

This is the wiring. Every screen that currently exists as an island needs a route and a way to push/pop detail views within the app shell's 5-tab structure.

| Existing Screen | Tab | Navigation needed |
|----------------|-----|-------------------|
| **Dashboard** (3 variants) | Home | Tile tap → pushes detail screen onto stack |
| **Goal Setting** (2 screens) | Home | Goal tile tap → Goal Input → Goal Contract → back |
| **TDEE Today** | Home | TDEE tile tap → TDEE trend → back |
| **TDEE Confidence Compare** | Home | Accessible from TDEE Today (secondary view) |
| **Macro Targets** | Eat | Macro tile tap → Macro Targets → Meal Queue → back |
| **Meal Queue** | Eat | From Macro Targets or dashboard prep tile |
| **Batch Strategy** | Eat | From Meal Queue ("Start prep") |
| **Shopping List** | Eat | From Batch Strategy or dashboard fridge tile |
| **Fridge/Pantry** | Eat | From Shopping List completion or direct tab |
| **MealPrep Merge** | Eat | From Batch Strategy ("Cook now") |
| **MealPrep Timeline** | Eat | From MealPrep Merge ("Start cooking") |
| **MealPrep Cook Mode** | Eat | From Timeline (tap active step) |
| **Training Session** | Train | Session tile tap or "Start session" from calendar |
| **Calendar Month** | Plan | Default Plan tab view |
| **Calendar Week** | Plan | Toggle from Month view |
| **Calendar Day** | Plan | Tap a day from Month/Week |
| **Profile** | You | Direct tab |

**What this unlocks:** The app shell's `DetailStack` already exists in `app-shell.jsx` with push/pop logic and cross-fade transitions. The 5-tab bottom nav is built. What's missing is `onClick` handlers on tiles and screens that call `pushDetail(screenComponent)`, plus route definitions so deep-linking works.

**Dependency chain within the app:**
```
Dashboard ──tile tap──→ Goal Setting
                        TDEE
                        Macro Targets ──→ Meal Queue ──→ Batch ──→ Shopping
                                                                      │
                        Fridge ◄──────────────────────────────────────┘
                        
                        Training Session
                        
Calendar Day ──event tap──→ Training Session
                           Meal Queue
                           
Profile ──settings row──→ Goal Setting (edit)
```

---

#### P0-2: Meal Logging (New Screens + Food Database)

This P0 is the only one that requires building new screens. But it plugs directly into 6 existing screens that are already waiting for the data it produces.

**New screens needed:**
- Meal Log (quick-log from queue, search, manual entry)
- Food Search/Detail (portion adjustment, macro preview)

**Existing screens that consume meal log data:**

| Existing Screen | What it needs from meal logging |
|----------------|-------------------------------|
| **Dashboard — Macro tile** | Today's logged kcal / P / C / F vs. target (currently hardcoded `1,660 kcal`) |
| **Dashboard — Streak tile** | "Logged today" contributes to streak count (currently hardcoded `14`) |
| **Macro Targets** | Weekly logged totals vs. weekly budget — the bars should reflect real intake |
| **Meal Queue** | Which suggested meals have been logged (mark as "eaten" vs. upcoming) |
| **TDEE Today** | Actual intake data points feed the TDEE model's accuracy over time |
| **Profile — Check-in history** | Weekly average intake shown alongside weight/BF trend |

**Entry points (where the user triggers a log):**
```
Dashboard macro tile ──tap──→ Meal Log
Dashboard FAB ──tap──→ Meal Log (quick action)
Meal Queue ──tap meal──→ Meal Log (pre-filled from queue — 1 tap confirm)
Calendar Day ──tap meal event──→ Meal Log
```

The meal queue is the key accelerant here. AUREVI0N already generates 14 suggested meals with macro breakdowns. If those meals are in the system, logging a prepped meal = tapping it and confirming. That's a 2-second interaction vs. the 60-second search-and-enter flow in MyFitnessPal.

---

#### P0-3: Onboarding → Dashboard Data Flow (State Management / Context)

The onboarding already computes everything the dashboard needs. The math is done — `computeTDEE()` and `computeMacros()` in `Onboarding.jsx` produce real numbers. The problem is those numbers live in local React state that dies when the onboarding component unmounts.

**Data produced by onboarding:**

```
sex, age, height, weight, bodyFat, exerciseFreq,
activityLevel, liftingExp, cardioExp, goal
→ tdee, target, protein, carbs, fat
```

**Existing screens that need this data:**

| Existing Screen | Fields consumed | How it's currently handled |
|----------------|----------------|--------------------------|
| **Dashboard — Goal tile** | `goal`, `bodyFat` (current), target BF | Hardcoded: `current: 20.1, target: 15.0` |
| **Dashboard — TDEE tile** | `tdee`, confidence % | Hardcoded: `2420, 74%` |
| **Dashboard — Macro tile** | `target` (kcal), `protein`, `carbs`, `fat` | Hardcoded: `1660, 147, 160, 60` |
| **Dashboard — Session tile** | `liftingExp`, `exerciseFreq` → training split | Hardcoded: `Pull · Upper B` |
| **Goal Setting — Input** | `bodyFat` (current), `weight`, `goal` | Hardcoded slider start values |
| **Goal Setting — Contract** | `target` (kcal), `protein`, `carbs`, `fat`, goal pace | Hardcoded summary |
| **TDEE Today** | `tdee`, weight history, activity history | Hardcoded SVG data points |
| **TDEE Confidence Compare** | `tdee`, days of data | Hardcoded Day 3 vs Day 87 |
| **Macro Targets** | `target`, `protein`, `carbs`, `fat` | Hardcoded: `1660 / 147 / 160 / 60` |
| **Meal Queue** | `target`, macro split → meal selection algorithm | Hardcoded 14 meals |
| **Batch Strategy** | macro targets → recipe optimization | Hardcoded 3 recipes |
| **Training Session** | `liftingExp`, `goal` → program selection | Hardcoded exercises |
| **Calendar** (all views) | `exerciseFreq` → training day placement | Hardcoded schedule |
| **Profile** | All biometric fields, goal, computed targets | Hardcoded summary |

**Every screen with a number on it currently lies.** The onboarding computes real, personalized values — then every downstream screen ignores them and shows mock data instead. This P0 is about replacing every hardcoded `DASH_DATA` value with the real output of onboarding.

**Implementation:** A React context (`UserContext`) or state manager that:
1. Receives onboarding output on completion
2. Persists it (→ depends on P0-4)
3. Exposes it to every screen via provider

---

#### P0-4: Data Persistence (Backend API or Local Storage)

The foundation. P0-1 through P0-3 all produce or move data — this P0 is where that data lives between sessions.

**Every piece of state that needs to survive a tab close:**

| Data | Source (which P0 creates it) | Screens that read it |
|------|------------------------------|---------------------|
| **User biometrics** | P0-3 (onboarding output) | Dashboard, Goal Setting, TDEE, Profile |
| **TDEE + macro targets** | P0-3 (computed from biometrics) | Dashboard, Macro Targets, Meal Queue, Batch Strategy |
| **Goal contract** | P0-3 + Goal Setting screen | Dashboard goal tile, Profile, weekly pace check |
| **Meal logs** | P0-2 (meal logging) | Dashboard macro tile, Macro Targets, TDEE model, streak |
| **Training session logs** | Training Session screen (post-P0-1 routing) | Dashboard session tile, Calendar, Profile, streak |
| **Shopping list state** | Shopping List screen (checkbox state) | Fridge (items purchased → inventory update) |
| **Fridge inventory** | Fridge screen + shopping sync | Shopping List (delta calc), Meal Queue (what's cookable) |
| **Check-in history** | Profile screen (currently hardcoded) | Profile, Goal Setting (pace check), TDEE model |
| **Calendar events** | Calendar screens (post-creation flow) | Dashboard calendar tile, Day view, training/meal scheduling |
| **Prep status** | MealPrep screens (meals cooked) | Meal Queue (prepped badge), Dashboard prep tile |

**Persistence tiers (what to build first):**

```
Tier 1 — localStorage (day 1, no backend needed):
  ├── User biometrics + computed targets (from onboarding)
  ├── Goal contract
  └── Onboarding completion flag

Tier 2 — localStorage or IndexedDB (before meal logging ships):
  ├── Meal logs (daily entries)
  ├── Training session logs
  ├── Check-in history (weekly entries)
  └── Streak counter

Tier 3 — Backend API (when multi-device matters):
  ├── All of the above, synced
  ├── Fridge inventory
  ├── Shopping list state
  ├── Calendar events
  ├── Prep status
  └── Progress photos
```

**Tier 1 is the minimum viable persistence.** With just localStorage holding onboarding output, the dashboard stops lying immediately — and you've unblocked P0-3 entirely.

---

### P0 Dependency Graph

```
P0-4: DATA PERSISTENCE
  │
  │  ← everything writes here, everything reads from here
  │
  ├──→ P0-3: ONBOARDING → DASHBOARD DATA FLOW
  │      │
  │      │  ← needs persistence to survive page reload
  │      │  ← feeds real values to 14 existing screens
  │      │
  │      └──→ P0-1: SCREEN-TO-SCREEN NAVIGATION
  │             │
  │             │  ← needs data flow so navigated-to screens
  │             │     show real data, not mock
  │             │  ← connects 17 existing screens
  │             │
  │             └──→ P0-2: MEAL LOGGING
  │                    │
  │                    │  ← needs navigation to be reachable
  │                    │  ← needs persistence to store logs
  │                    │  ← needs data flow for macro targets
  │                    │  ← feeds data back to 6 existing screens
  │
  BUILD ORDER: P0-4 → P0-3 → P0-1 → P0-2
```

P0-4 (persistence) first because it's load-bearing for everything else. P0-3 (data flow) next because it makes the existing 14 screens real. P0-1 (navigation) next because it lets users reach those now-real screens. P0-2 (meal logging) last because it needs all three predecessors — routes to get there, data flow for targets, persistence to store logs.

### What's Already Done and Good

- Onboarding flow (keep, refine)
- Design system and tokens (keep)
- Meal prep flow — merge, timeline, cook mode (keep, connect)
- Training session screen (keep, add auto-log)
- TDEE visualization (keep, make accessible from dashboard)
- Dashboard tile concept (keep, make interactive)
- Calendar views (keep, add creation flow)
- Goal Setting (keep — 2 screens with slider, just needs data flow + persistence)

---

## Part 4: Ideal Screen Map

```
                        ┌─────────────┐
                        │   LANDING   │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  ONBOARDING │ 10 steps
                        │  (existing) │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  SIGN UP    │ post-onboard auth
                        └──────┬──────┘
                               │
            ┌──────────────────▼──────────────────┐
            │            DASHBOARD                 │
            │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
            │  │Goal│ │TDEE│ │Meal│ │Sesh│ ...    │
            │  └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘       │
            └─────┼──────┼─────┼──────┼───────────┘
                  │      │     │      │
    ┌─────────────┤      │     │      ├─────────────┐
    │             │      │     │      │             │
┌───▼───┐  ┌─────▼─┐ ┌──▼──┐ ┌▼─────┐  ┌─────┐ ┌──▼──┐
│ Goal  │  │ TDEE  │ │Macro│ │Train │  │Plan │ │ You │
│Setting│  │Trends │ │Log  │ │Sesh  │  │Cal  │ │Prof │
└───┬───┘  └───────┘ └──┬──┘ └──┬───┘  └──┬──┘ └──┬──┘
    │                   │       │         │       │
    │              ┌────▼────┐  │    ┌────▼───┐   │
    │              │Meal     │  │    │Week    │   │
    │              │Queue    │  │    │Planner │   │
    │              └────┬────┘  │    └────────┘   │
    │              ┌────▼────┐  │                  │
    │              │Shopping │  │           ┌──────▼──────┐
    │              │List     │  │           │  Check-in   │
    │              └────┬────┘  │           │  Flow       │
    │              ┌────▼────┐  │           └──────┬──────┘
    │              │Fridge   │  │           ┌──────▼──────┐
    │              └────┬────┘  │           │  Weekly     │
    │              ┌────▼────┐  │           │  Summary    │
    │              │Meal Prep│  │           └──────┬──────┘
    │              │Cook Mode│  │           ┌──────▼──────┐
    │              └─────────┘  │           │  Monthly    │
    │                           │           │  Review     │
    │                           │           └─────────────┘
    │                           │
    └───────────────────────────┘
         All roads lead back
           to Dashboard
```

---

## TL;DR

**AUREVI0N's prototype is a collection of excellent screens that don't talk to each other.** The design system is solid. The onboarding flow works. The meal prep flow is genuinely differentiated. But the app has no daily loop — you can't log food, you can't persist data, and tapping anything on the dashboard leads nowhere.

**The path to a real product:**
1. Connect the screens (routing + state management)
2. Add meal logging (the core daily action)
3. Build the check-in flow (the core weekly action)
4. Make tiles interactive (dashboard as command center, not wallpaper)
5. Persist data (the app remembers you)

Do those five things and AUREVI0N goes from "impressive prototype" to "app people actually open every day."
