# Meeting Notes — 4 Jul 2026

## Action Items

### 1. RIR (Reps in Reserve) — Add to Training Flow

**What was said:** Look at RIR — Reps in Reserve. Create an interaction to control/adjust weights during a workout.

**Current state:** The prototype only captures RPE (1–10 scale) per logged set. There is no RIR field, no proximity-to-failure metric, and no way to adjust load mid-workout based on reserve feedback.

**What needs to happen:**
- Research the RPE ↔ RIR relationship (RPE 10 = 0 RIR, RPE 9 = 1 RIR, etc.) and decide whether to show both or derive one from the other.
- Design a weight-adjustment interaction: after a set, the user reports RIR → the app suggests a load change for the next set (e.g., "You had 3 reps left — bump up 2.5 kg").
- Add an `rir` field to the logged-set data model alongside `rpe` in `fitness-data.js` and `UserContext`.
- Build the UI control in `Training.jsx` — likely a simple picker or stepper (0–5 RIR) shown after each set.

**Research needed:**
- [ ] Review how apps like Strong, Hevy, and RP Hypertrophy handle RIR/RPE input UX.
- [ ] Determine auto-regulation logic: how much load change per RIR delta (percentage-based vs. fixed increment by exercise type).
- [ ] Decide if RIR replaces RPE or sits alongside it — pros/cons for different user segments (beginner vs. advanced).
- [ ] Research up macrofactorapp app on all their user flows and functions and see how they handle the RIR/RPE input UX.

---

### 2. Goal → Training Type Linkage

**What was said:** We need a good way to control different goals. Certain workouts need to be linked to training types.

**Current state:** `goalEngine.js` maps goals → modalities (strength connections: strong/moderate/weak). `generateProgram()` in `fitness-data.js` uses these to pick exercises. But the UI doesn't surface *why* a workout was chosen or let the user see/override the goal→modality mapping.

**What needs to happen:**
- Make the goal→training-type connection visible and controllable in the app (not just engine internals).
- Show users which goal(s) drive each session — e.g., a tag on the session card saying "Driven by: Fat Loss, Cardio Endurance".
- Allow users to pin/unpin modalities per goal or adjust the weighting.

**Research needed:**
- [ ] Map out how the current `goalEngine` edge weights translate to actual program selection — document the full cascade for 2–3 example goal combos.
- [ ] Design a "training preferences" screen where users see their goal→modality map and can nudge priorities.
- [ ] Consider multi-goal conflict resolution (e.g., hypertrophy + fat loss = recomposition? or split sessions?).

---

### 3. Circuits & Supersets

**What was said:** Circuits and supersetting — supersetting combines workouts, circuit links up multiple of those.

**Current state:**
- **Circuits**: Referenced as a modality in `goalEngine` and `fitness.md`, but no special UI. Rest is just set to 0s.
- **Supersets**: Appear in `WorkoutTemplateDetail` sample sessions as labels (e.g., "Superset A1/A2") but the program generator doesn't structure them. No data model for grouping exercises.

**What needs to happen:**
- Define a data model for exercise grouping: `{ type: 'superset' | 'circuit', exercises: [...], restBetweenRounds: 60 }`.
- Update `generateProgram()` to output grouped exercises when the modality calls for it.
- Build the active-session UI to flow through grouped exercises without rest between them, then rest between rounds.
- Visual treatment: bracket or color-band linking grouped exercises in the session view.

**Research needed:**
- [ ] Catalogue the grouping types we need to support: straight sets, supersets (2 exercises), tri-sets (3), giant sets (4+), circuits (5+), EMOM, AMRAP.
- [ ] Define rules for auto-generating supersets (agonist/antagonist pairing, upper/lower pairing, pre-exhaust).
- [ ] Sketch the active-training UX for a superset — does the user swipe between exercises or see them stacked?

---

### 4. Populate with Real Context Data

**What was said:** Use the context from the repo to populate data.

**Current state:** `fitness-data.js` has 72 exercises with full metadata. `goalEngine` has the full goal network. But many screens still show illustrative/mock data (e.g., PlanCalendar has hardcoded meal events, Dashboard tiles use placeholder numbers).

**What needs to happen:**
- Audit every screen for hardcoded mock data vs. data derived from `UserContext` / `fitness-data.js`.
- Replace remaining mocks with computed values from the existing data engine.
- Ensure the demo flow tells a coherent story: onboarding goals → generated program → calendar → session → summary all use the same data thread.

**Research needed:**
- [ ] Create a screen-by-screen audit: which data is real (from engine) vs. mock (hardcoded).
- [ ] Identify the minimum "seed user profile" needed to make every screen look populated (goals, body stats, 1–2 completed sessions, a week of meals).

---

### 5. Full Fitness Flow Example

**What was said:** Get a full example of the fitness flow next week.

**Current state:** The flow exists in pieces: Onboarding → Dashboard → ProgramOverview → Training (active session) → Summary. But it hasn't been walked end-to-end as a single demo narrative.

**What needs to happen:**
- Script a single user journey: onboarding choices → first program generated → day 1 session → mid-session RIR/weight adjust → session complete → summary → dashboard updated.
- Make sure every transition works without dead ends or broken nav.
- Record or document the flow for review.

**Research needed:**
- [ ] Define the demo persona (name, goals, body stats, equipment, injuries) that showcases the most features.
- [ ] Walk the current prototype end-to-end and document every friction point or dead end.
- [ ] Prioritize which gaps from items 1–4 above must be closed before the demo vs. which can be faked.

---

### 6. Hydration Tab Access + Tracking Template

**What was said:** How would you get to the hydration tab? Create a template for all the things we are tracking.

**Current state:** Water tracking (`WaterTracking.jsx`) exists but is buried — accessible only via a Dashboard tile or deep link. It's not reachable from the main tab bar. Other trackable metrics (sleep, steps, mood, soreness) are mentioned in docs but have no screens.

**What needs to happen:**
- Decide on the entry point: dedicated tab? sub-tab under an existing tab? always-visible quick-action?
- Design a **universal tracking template** — a consistent card/widget pattern that works for: water, sleep, steps, body weight, mood, soreness, supplements, and any future metric.
- Each tracker follows the same UX: current value → ring/progress → quick-add → history sparkline.

**Research needed:**
- [ ] List every metric the app should track (from fitness.md, onboarding questions, and goal dependencies).
- [ ] Decide on information architecture: one "Track" hub vs. metrics scattered across tabs vs. customizable dashboard tiles.
- [ ] Design the universal tracker card component spec (layout, interactions, data shape).
- [ ] Review how Apple Health, Fitbit, and Cronometer organize their tracking surfaces.

---

## Priority Order (Suggested)

| # | Item | Urgency | Reason |
|---|------|---------|--------|
| 1 | Full fitness flow example | **High** | Due next week — drives what gets polished first |
| 2 | RIR + weight adjustment | **High** | Core training interaction, needed for the flow demo |
| 3 | Circuits & supersets | **High** | Defines exercise grouping model that everything else depends on |
| 4 | Goal → training linkage | **Medium** | Important for coherence but existing engine works for demo |
| 5 | Tracking template + hydration access | **Medium** | UX architecture question — needs design decision before build |
| 6 | Populate real data | **Medium** | Ongoing — do incrementally as screens are touched |
