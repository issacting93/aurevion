# Templates & Reusable Patterns

Every pattern here exists because we hit the same problem twice and solved it the same way. This doc captures the logic behind each pattern so new screens, features, and tracking surfaces can be built without reinventing structure.

---

## Design Rules

Seven rules that apply across every screen. These came from auditing the prototype against real fitness app references and identifying where screens felt flat, dense, or visually monotonous.

### R1. One hero per page

Every page needs a single visually dominant element — a large number, a gradient card, a muscle diagram, a progress ring. This is what gives the page identity and prevents the "wall of text" feeling.

**How to build it:**
- Size: 24px+ type for the primary value, 48px+ for hero numbers
- Color: goal-tinted gradient background (`${goalColor}0a` → `${goalColor}03`), not flat surface
- Space: generous padding (24px+), breathing room above and below
- Decoration: subtle SVG geometry, decorative corner accents, or ring visualizations — not just text

**What violates this:** A page that opens with an FLabel followed by a list. A page where every section has equal visual weight. An empty state with a tiny icon and two lines of text.

**Screens that need heroes:** ExerciseDetail (muscle hero), WorkoutTemplate (protocol card), GoalDetail (caloric state), ProgramOverview (week/phase hero), Dashboard (greeting + goals strip), every Summary page (celebration + duration).

### R2. List items breathe

Information rows should never feel overly dense or text-heavy. The most common failure is dumping metadata inline ("COMPOUND · BARBELL · quads, glutes, core") — that's a database query, not a browse experience.

**How to fix it:**
- Padding: 14-18px per row minimum
- Show only the essential info: name + one category tag. Details on tap-through
- Numeric data gets `FNum` prominence (sets × reps), not inline sentences
- Goal badges: colored dot + label in tinted cards, not packed tag rows
- If a section has 5+ items of equal weight, it's a wall. Differentiate the first item or group them

### R3. Vary icons by context

Using the same icon (`ICONS.dumb`) for every exercise header regardless of category creates visual monotony. The user's eye has no landmarks.

**How to fix it:**
- Map icons to exercise categories:
  - `compound` → `ICONS.dumb` (barbell)
  - `isolation` → `ICONS.target` or a focused icon
  - `core` → `ICONS.flame`
  - `cardio` → `ICONS.timer`
  - `hiit` → `ICONS.flame`
  - `mobility` → `ICONS.expand`
- If no distinct icon exists, vary the icon background color by category (already in `CATEGORY_COLORS`)
- On detail pages, the hero icon circle should use the category color, not always accent

### R4. Section weight hierarchy

When a page has 3+ content sections below the hero, they shouldn't all have equal visual weight. The user needs to know where to look after the hero.

**How to fix it:**
- **Primary section** (the actionable thing): FSurface with accent left border, or a card with tinted background. Form cues, prescriptions, today's session
- **Secondary sections** (supporting context): plain FLabel + content, no card wrapper. Goals, modalities, metadata
- **Tertiary sections** (edge cases): smaller type, muted color, bottom of page. Injury cautions, alternatives

Pattern: Hero → Primary (FSurface, bordered) → Secondary (flat, label + content) → Tertiary (muted, small)

### R5. Empty states should sell, not apologize

Empty states are the first thing new users see. "No program yet" with a tiny icon wastes the opportunity.

**How to fix it:**
- Large icon (64px+) in a tinted circle
- Bold heading that describes what *will* be here, not what's missing
- One-liner description with a clear CTA
- Optional: ghosted preview of what the populated state looks like — shows the user what they're working toward

### R6. Data above, interactions below

Every scrollable page should split into two zones: the **data zone** (top) and the **interaction zone** (bottom). Data is read-only context the user absorbs — hero metrics, charts, breakdowns, metadata. Interactions are things the user acts on — buttons, pickers, forms, quick-add controls.

**How to apply it:**
- Top half: hero card, stat grids, section labels, lists, charts. No primary CTAs here
- Bottom half: action buttons, navigation cards, forms, quick-add rows
- The divider is implicit (visual weight shift, not a literal line) — the page should feel like it transitions from "here's what you need to know" to "here's what you can do"
- Exceptions: focused modes (Training execute, Cook mode) where the interaction IS the screen

**What violates this:** A "Start session" button at the top of ProgramOverview before the user has seen what the session contains. An action card sandwiched between two data sections. Quick-add buttons above a sparkline instead of below it.

**Screens that should follow this:**
- GoalDetail: caloric state + macros + modalities (data) → view template / browse exercises (interaction)
- ExerciseDetail: hero + muscles + cue + prescriptions (data) → goal badges + injury info (context) — no interactions needed, this is pure data
- WorkoutTemplateDetail: protocol + sample session (data) → start/customize actions (interaction)
- WaterTracking: ring + sparkline (data) → quick-add buttons + log (interaction)
- ProgramOverview: week hero + session cards (data) → quick action grid (interaction)
- Training summary: stats + breakdown (data) → done button (interaction)

### R7. Quick actions should be discoverable

Ghost text buttons ("Browse exercises", "Goal details") at the bottom of a page are easy to miss. If an action matters, it should be visible.

**How to fix it:**
- Use small cards with icon + label instead of ghost text buttons
- Place them in a 2-column grid: `gridTemplateColumns: 'repeat(2, 1fr)'`
- Each card: FSurface with 14px padding, icon left, label right, tappable
- Position them after the hero, not at the bottom (users may not scroll)

---

## 1. Screen Export Pattern

**The problem:** Screens need to render in two contexts — inside the Shell (as tab/detail content) and standalone in journey galleries or dev tools. If you couple the Phone frame into the component, you can't reuse it.

**The pattern:**
```jsx
// Content — pure UI, receives data as props, no frame
export function ScreenNameContent({ data, onAction }) { ... }

// Screen — wraps Content in Phone + NavBar for standalone display
export function ScreenNameScreen() {
  return (
    <Phone label="Screen Name" group="GROUP">
      <FNavBar title="Title" leading={<FIcon path={ICONS.back}/>} />
      <ScreenNameContent />
    </Phone>
  )
}
```

**Why:** The Shell renders `Content` directly inside its own Phone frame. Journey pages and the dev handover gallery render `Screen`. This separation means every screen works in both contexts without conditional logic.

**Files that follow this:** Every file in `src/app/screens/` — Training, Dashboard, WaterTracking, GoalDetail, MealPrep, TDEE, Macros, Profile, ExerciseBrowser, ExerciseDetail, etc.

**To add a new screen:**
1. Create `src/app/screens/NewScreen.jsx`
2. Export `NewScreenContent` (receives props) and `NewScreenScreen` (standalone)
3. Import `NewScreenContent` in `Shell.jsx`
4. Add to `TabRouter` (if it's a tab) or `DetailRouter` (if it's a detail push)
5. If a dashboard tile should launch it, add to `TILE_ROUTES`

---

## 2. Tile Density System

**The problem:** The dashboard needs to show 10+ metrics in a 2-column grid. Some users care about macros, others about training. The same tile needs to be glanceable (compact), informative (mid), or detailed (full) depending on the layout preset.

**The pattern:**
```jsx
export function MetricTile({ value, target, density = 'mid', span, style, onClick }) {
  if (density === 'compact') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        {/* Metric only — one number, maybe a bar */}
      </FTile>
    )
  }
  if (density === 'mid') {
    return (
      <FTile density={density} span={span || 1} style={style} onClick={onClick}>
        <TileHead label="METRIC NAME" density={density} />
        {/* Number + one supporting line */}
      </FTile>
    )
  }
  // full
  return (
    <FTile density={density} span={span || 2} style={style} onClick={onClick}>
      <TileHead label="METRIC NAME" tag={<FTag>...</FTag>} density={density} />
      {/* Number + context + chart/sparkline + metadata */}
    </FTile>
  )
}
```

**Why:** Three density levels give the layout engine enough range to build presets. Compact is ~48px tall, mid is ~90px, full is ~150px+. The span prop controls whether the tile takes 1 column (half width) or 2 (full width). This system lets us add new tracking surfaces (sleep, steps, mood) without redesigning the dashboard — just define 3 densities and register in the layout.

**Density specs:**

| Density | Padding | Radius | Typical height | Use |
|---------|---------|--------|----------------|-----|
| compact | 10px | 10px | ~48px | Glanceable number |
| mid | 14px | 12px | ~90px | Number + one line of context |
| full | 16px | 14px | ~150px+ | Full card with chart/sparkline |

**To add a new tile:**
1. Create the function in `tiles.jsx` with 3 density branches
2. Export it
3. Import in `Dashboard.jsx`
4. Add case to `renderTile()` switch
5. Add data to `useDashData()` return (with mock fallback from `mockUser.js`)
6. Add to one or more `LAYOUTS` presets with chosen density + span

---

## 3. Focused Mode (3-Phase Flow)

**The problem:** Both workout sessions and cook sessions follow the same UX arc: preview what you're about to do, actively do it with timers and controls, then see a summary of what you did. Building each as a one-off means duplicated layout logic, timer code, and toolbar patterns.

**The pattern:**

```
Phase 1: Review/Preview
  - Scrollable list of what's coming (exercises, recipe steps)
  - Metadata header (modality, goal tags, timing)
  - Single CTA: "Begin Workout" / "Start Cooking"

Phase 2: Execute/Active
  - Sticky header: progress indicator + elapsed time + count
  - Scrollable body: current item focus + input controls
  - Bottom toolbar: Pause/Resume, Skip, End

Phase 3: Summary
  - Hero celebration (green check circle + duration)
  - Stats grid (3-4 key metrics in equal columns)
  - Item breakdown (per-exercise or per-recipe rows)
  - Single CTA: "Done"
```

**Layout skeleton:**
```jsx
<div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
  {/* Sticky header — flexShrink: 0 */}
  <div style={{ flexShrink: 0, borderBottom: `1px solid ${Color.borderSoft}` }}>
    {/* Progress + timer */}
  </div>

  {/* Scrollable body — flex: 1, overflow */}
  <div style={{ flex: 1, padding: '20px 24px 0', overflowY: 'auto' }}>
    {/* Current item + controls */}
  </div>

  {/* Bottom toolbar — flexShrink: 0 */}
  <div style={{ padding: '10px 24px 20px', flexShrink: 0, borderTop: `1px solid ${Color.borderSoft}` }}>
    {/* Pause, Skip, End */}
  </div>
</div>
```

**Why:** The sticky header + flex body + fixed toolbar layout is the only way to keep the timer always visible while allowing the main content to scroll in the small phone viewport. `minHeight: 0` on the outer flex container is critical — without it, the flex child won't shrink below its content height, breaking the scroll.

**Used by:** `Training.jsx` (workout mode), `MealPrep.jsx` (cook mode). Any future focused mode (stretching routine, meditation timer, guided check-in) should follow this skeleton.

---

## 4. Timer Logic

**The problem:** Multiple screens need a ticking timer that respects pause state and cleans up on unmount. Copy-pasting `setInterval` leads to stale closures and leaked intervals.

**The pattern:**
```jsx
const [elapsed, setElapsed] = useState(0)
const [paused, setPaused] = useState(false)

useEffect(() => {
  if (phase !== 'execute' || paused) return
  const t = setInterval(() => {
    setElapsed(s => s + 1)
    // Optional: count down a separate timer
    setRestRem(s => {
      if (s <= 1 && s > 0) setResting(false)  // Auto-trigger at zero
      return Math.max(0, s - 1)
    })
  }, 1000)
  return () => clearInterval(t)
}, [phase, paused])
```

**Why:** The functional updater (`s => s + 1`) avoids stale closure issues. The cleanup function prevents leaked timers. `[phase, paused]` restarts the interval when pause state changes. `Math.max(0, s - 1)` prevents negative values. Display with `formatTime(seconds)` from `fitness-data.js`.

---

## 5. Data Derivation Pipeline

**The problem:** Goals, modalities, caloric states, macro splits, meal prep approaches, and RIR targets all depend on each other. Scattering this logic across screens makes it impossible to change a goal and have everything update.

**The pattern:** Goal-to-plan derivation lives in `src/context/goalEngine.js`. Program generation and session utilities live in `src/app/screens/fitness-data.js`. Functions follow the `derive*` naming convention and are pure (no side effects, no state).

```
User Goals (selected in onboarding)
    |                                        [goalEngine.js]
    |--> deriveModalities(goals)         --> modalities sorted by edge weight
    |--> deriveCaloricMod(goal)          --> kcal offset (+300, -480, etc.)
    |--> deriveMacroSplit(goal, w, kcal) --> { protein, carbs, fat }
    |--> deriveMealPrep(goal, nutGoals)  --> { primary, supporting, timing }
    |
    v                                        [fitness-data.js]
generateProgram({ goals, equipment, days, injuries, experience })
    |
    |--> deriveRIRTarget(modality)       --> { min, max, label }  [goalEngine.js]
    |--> deriveGroupingStyle(modality)   --> { type, rule, minExercises }  [goalEngine.js]
    |--> getGoalsForModality(mod, goals) --> which goals drove this session  [goalEngine.js]
    |--> flattenSessionExercises(exs)    --> flat list with group metadata  [fitness-data.js]
    |--> suggestLoadAdjustment(load,rir) --> adjusted load or null  [fitness-data.js]
    |
    v
Weekly Program --> Sessions --> Activity Log --> Dashboard
```

**Why:** Centralizing derivation means changing a goal edge weight in `goal-network-data.js` automatically changes programs, macros, meal prep, and intensity targets. No screen needs to know how the cascade works.

**To add a new derived value:**
1. Add a `derive*` function to `goalEngine.js`
2. Source it from EDGES/NODES or ontology-data lookup tables
3. Import and call from the screen that needs it

---

## 6. Exercise Grouping Model

**The problem:** Supersets and circuits need to live in the data model, display in review, and execute with modified rest logic — but screens that don't care about grouping shouldn't break.

**The pattern:** Two layers — a group wrapper in the session data, and a flattener utility.

**Session data (from generateProgram):**
```jsx
session.exercises = [
  { exerciseId, name, sets, reps, load, rest, ... },    // plain exercise
  {                                                        // group wrapper
    groupType: 'superset' | 'circuit',
    label: 'A',
    items: [exerciseObj, exerciseObj],
    restAfter: 90,
    rounds: 1 | 3,
  },
]
```

**Flat view (for screens that don't need grouping):**
```jsx
const flat = flattenSessionExercises(session.exercises)
// Each item gets: _groupId, _groupType, _groupLabel, _posInGroup,
//                 _groupSize, _isLastInGroup, _restAfterGroup
```

**Review visual:**
```jsx
{ex.groupType && (
  <div style={{ paddingLeft: 14 }}>
    <FTag tone="accent">SUPERSET A</FTag>
    {ex.items.map((gx, gi) => (
      <div>{/* circle label + name + sets/reps + "NO REST" */}</div>
    ))}
  </div>
)}
```

**Execute rest logic:**
```jsx
const sameGroup = currentEx._groupId && nextEx._groupId === currentEx._groupId
if (sameGroup) { setResting(false) }                          // no rest within group
else if (currentEx._isLastInGroup) { setRestRem(currentEx._restAfterGroup) }  // rest after group
else { setRestRem(currentEx.rest || 90) }                     // normal rest
```

**Why:** The wrapper + flattener approach means the generator controls grouping, screens that care render groups, and screens that don't call `flattenSessionExercises()`. Adding a new group type (tri-set, EMOM, AMRAP) = one new `groupType` value.

---

## 7. Intensity Input (RPE + RIR Grid)

**The problem:** RPE and RIR are inverses (RPE 10 = RIR 0). Two separate rows wastes space and hides the relationship. The user also needs to know the target range for their modality.

**The pattern:** Side-by-side 2-column grid. Tapping either side syncs the other. Target range highlighted.

```jsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
  <div>  {/* RPE: 3x2 grid of [5,6,7,8,9,10], accent when selected */}  </div>
  <div>  {/* RIR: 3x2 grid of [0,1,2,3,4,5], green when selected, tint when in target */}  </div>
</div>
```

**Sync:** `onClick={() => { setRpeInput(r); setRirInput(10 - r) }`

**Target range:** `deriveRIRTarget(modality)` returns `{ min, max }`. Buttons in range get `Color.green` tint even when unselected.

**Why:** The 2-column layout makes the RPE-RIR relationship spatial. The target tint says "aim here" without text. Green for RIR (recovery) vs accent for RPE (effort) matches the semantic color system.

---

## 8. Load Adjustment Suggestion

**The problem:** After logging a set, the user might have been working too far from failure (too easy) or right at failure (too hard). We want to suggest a load change without interrupting flow.

**The pattern:** Conditional `FSurface` card during rest, with directional icon + clear accept/dismiss.

```jsx
{resting && loadSuggestion && (
  <FSurface style={{ border: `1px solid ${isUp ? Color.green : Color.amber}40` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Circle: green ↑ or amber ↓ */}
      <div>Room to grow / Dial it back</div>
      <FMono>{current}kg -> {suggested}kg</FMono>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <FBtn variant="ghost">Keep {current}kg</FBtn>
      <FBtn variant="primary">Use {suggested}kg</FBtn>
    </div>
  </FSurface>
)}
```

**Logic:** `suggestLoadAdjustment(load, rir)` rounds to nearest 2.5kg:
- RIR 0 → load * 0.95 (too hard)
- RIR 1-2 → no suggestion (sweet spot)
- RIR 3+ → load * 1.05 (too easy)

**State:** Accepted adjustments stored in `loadOverrides: { [exIdx]: newLoad }`. Subsequent sets use the override. Set log stores `adjustedLoad` if different from planned.

**Why:** Only shown during rest = no interruption. Directional icon communicates faster than text. Equal-width buttons prevent "primary is bigger" bias.

---

## 9. Goal Tag Display

**The problem:** Sessions are driven by goals, but the UI never showed which goals were responsible. Users couldn't see *why* they were doing HIIT instead of hypertrophy.

**The pattern:** `goalSources` array on each session, rendered as `FTag` chips.

**On session cards (ProgramOverview):**
```jsx
{entry.goalSources?.map(g => (
  <FTag tone="mute" size="sm">{g.replace(/_/g, ' ').toUpperCase()}</FTag>
))}
```

**On review phase (Training):**
```jsx
<FMono size={9} color={Color.mute}>TARGETS:</FMono>
{session.goalSources.map(g => (
  <FTag tone="mute" size="sm">{g.replace(/_/g, ' ').toUpperCase()}</FTag>
))}
```

**On dashboard (active goals strip) — different treatment:**
```jsx
<span style={{
  background: isFitness ? 'rgba(255,110,80,0.08)' : 'rgba(74,222,128,0.08)',
  color: isFitness ? Color.accent : Color.green,
}}>{GOAL_LABELS[g]}</span>
```

**Why:** `tone="mute"` keeps goal tags secondary to session name and modality. The Dashboard uses inline colored badges (not FTag) because that context is about user identity, not a specific session — fitness goals get accent, nutrition goals get green.

---

## 10. Navigation Wiring Checklist

**To make a new screen reachable:**

1. **Import** the Content component at the top of `Shell.jsx`
2. **TILE_ROUTES** — if a dashboard tile should open it:
   ```jsx
   newscreen: { screen: 'newscreen', title: 'Title' }
   ```
3. **DetailRouter** — add the case:
   ```jsx
   case 'newscreen': return <NewScreenContent data={data} />
   ```
4. **TabRouter** — only if it's a new tab (rare):
   ```jsx
   case 'newtab': return <NewScreenContent />
   ```
5. **Navigate with:** `pushDetail('newscreen', 'Title', { optionalData })`

**Why:** Shell.jsx is the single routing authority. You can trace any navigation path by reading that one file.

---

## 11. State Update Pattern

**The problem:** React state must be immutable. Nested object mutation causes stale renders.

**Immutable nested update:**
```jsx
setState(prev => {
  const sessions = prev.workoutPlan.sessions.map(s =>
    s.id === targetId ? { ...s, completed: true } : s
  )
  return { ...prev, workoutPlan: { ...prev.workoutPlan, sessions } }
})
```

**Activity logging:**
```jsx
const appendActivity = (prev, type, data) => ({
  ...prev,
  activityLog: [
    ...(prev.activityLog || []),
    { type, timestamp: new Date().toISOString(), data },
  ].slice(-500),
})
```

**Why:** Always spread `prev`. Use `.map()` for single-item updates. `.slice(-500)` caps localStorage growth. Timestamp added at log time for consistency.

---

## 12. Mock Fallback Pattern

**The problem:** Screens must render even when UserContext hasn't been populated (no onboarding). Null references crash the prototype.

**The pattern:**
```jsx
function useDashData() {
  const { targets, workoutPlan } = useUser()
  if (!targets) return MOCK_DASHBOARD  // full fallback

  return {
    ...MOCK_DASHBOARD,                               // base
    session: workoutPlan ? compute(workoutPlan) : MOCK_DASHBOARD.session,  // real or mock
    macros: { kcal: targets.target, ... },            // real
  }
}
```

**Why:** Mock-first means every screen always renders. Real data replaces mocks field-by-field. Critical for the prototype — any screen works without onboarding.

---

## 13. Universal Tracker Template (Planned)

**The problem:** Water, sleep, steps, body weight, mood, soreness, supplements all need tracking. Building each bespoke is wasteful — they follow the same UX.

**The template:**
```
[Ring/Gauge]         -> value vs target, animated fill
[Legend row]         -> today / 7d avg / streak
[Sparkline]          -> 7-day trend bars
[Quick-add buttons]  -> 3-4 preset increments
[Today's log]        -> timestamped entries
```

**Data shape per tracker:**
```jsx
{
  current: number,
  target: number,
  trend7d: number[],
  log: [{ time, value }],
  unit: 'ml' | 'hrs' | 'steps' | 'kg',
  presets: [150, 250, 350, 500],
}
```

**Currently implemented for:** Water only (WaterTracking.jsx). Not yet extracted as a reusable component. When building sleep/steps/weight, extract a `TrackerLayout` that takes `{ metric, unit, target, presets, color, icon }`.

**Why:** Ring + sparkline + quick-add gives three levels at a glance: "how am I doing now" (ring), "how have I been doing" (sparkline), "do something about it" (quick-add). Every trackable metric fits this shape.

---

## 14. Summary Page

**The problem:** Multiple flows end with a recap: workouts, cook sessions, check-ins. Each needs a celebration moment + key stats + breakdown of what happened.

**The pattern:**
```
[Hero]           → green check circle (64px) + duration in large FNum + "COMPLETE" label
[Stats grid]     → 3-4 equal-width FSurface cards in a grid row, each: FLabel + FNum
[Breakdown list] → FLabel section header + FListRow per item (title, subtitle, trailing metric)
[Intensity bar]  → optional FTexBar showing effort level
[Done CTA]       → single full-width FBtn at bottom
```

**Why:** The hero celebrates completion (dopamine hit). The stats grid gives the "did it matter?" answer at a glance. The breakdown satisfies the detail-curious without cluttering the hero. One CTA — no decision fatigue.

**Used by:** Training.jsx (summary phase), CookSummary.jsx, CheckIn.jsx (result step).

---

## 15. Browse/Filter List

**The problem:** Users need to explore collections (exercises, ingredients, meals) with the ability to narrow by category. Each item needs enough info to decide whether to tap into it.

**The pattern:**
```
[Filter tabs]    → horizontal row of pill buttons, one active, tap to toggle
[Results list]   → vertical flex column of items, each with:
                    leading icon/color → title → subtitle → trailing metadata
[Empty state]    → centered icon + "No matches" when filter yields nothing
```

Filter tab style:
```jsx
<button style={{
  padding: '6px 14px', borderRadius: 999,
  background: active ? `${color}15` : 'transparent',
  border: `1px solid ${active ? color : Color.borderSoft}`,
  color: active ? color : Color.mute,
}}>CATEGORY</button>
```

**Why:** Tabs above the list (not in a sidebar) work on mobile. Pill shape distinguishes filters from actions. The "all" tab always comes first as the default. Each list item follows the FListRow pattern for consistency.

**Used by:** ExerciseBrowser.jsx (category tabs), Fridge.jsx (ALL/MISSING/EXPIRING), Macros.jsx (shopping list categories).

---

## 16. Detail Cascade

**The problem:** Detail pages need to show multiple related data sections about a single entity (a goal, an exercise, a meal). Each section has a different shape but they need to feel cohesive.

**The pattern:**
```
[Header]         → icon in colored circle + title + subtitle
[Section 1]      → FSurface with FLabel heading + primary content
[Section 2]      → FSurface with FLabel heading + list or visual
[Section N]      → ...
[Actions]        → row of ghost buttons at bottom (View template, Browse exercises, etc.)
```

Each section follows:
```jsx
<FSurface style={{ marginTop: 20 }}>
  <FLabel size={10} mb={4}>SECTION TITLE</FLabel>
  {/* Primary content: FNum, visual bar, list rows, etc. */}
</FSurface>
```

**Why:** FSurface cards create visual separation between sections without needing horizontal rules. The consistent FLabel → content → FMono metadata rhythm trains the eye. Ghost buttons at the bottom keep actions discoverable but secondary.

**Weight hierarchy (R4):** Not every section should be an FSurface. After the hero, sections should descend in visual weight:
- **Primary** (form cue, prescriptions): tinted card or left-border callout — see design-system.md "Section weight tiers"
- **Secondary** (goal associations, modality lists): flat label + dot-label pills or plain rows, no card wrapper
- **Tertiary** (injury cautions, alternatives): plain muted text, `Type.bodySm` + `Color.mute`, no card at all

**Used by:** GoalDetail.jsx (caloric state → macros → modalities → meal prep → body profile → linked sessions), ExerciseDetail.jsx (hero → form cue → prescriptions → goal pills → injury text), WorkoutTemplateDetail.jsx (contract hero → stat grid → session list → note → actions).

---

## 17. Multi-Step Linear Flow

**The problem:** Onboarding, check-ins, and goal setting all need to collect data one input at a time. Showing everything on one screen overwhelms; a wizard keeps focus.

**The pattern:**
```
[Step indicator]  → segmented progress bar or numbered dots
[Content area]    → single focused input or display per step
[Navigation]      → Next/Back buttons, sometimes skip
```

State:
```jsx
const [step, setStep] = useState(0)
const steps = [StepOne, StepTwo, StepThree, ...]
const CurrentStep = steps[step]
```

Step indicator:
```jsx
<div style={{ display: 'flex', gap: 3 }}>
  {steps.map((_, i) => (
    <div style={{
      flex: 1, height: 3, borderRadius: 2,
      background: i <= step ? Color.accent : Color.borderSoft,
    }} />
  ))}
</div>
```

**Why:** One input per screen reduces cognitive load. The progress bar answers "how much is left?" which prevents abandonment. Forward/back gives control without breaking linearity.

**Used by:** Onboarding.jsx (13 steps), CheckIn.jsx (4 steps), GoalSetting.jsx (multi-step contract flow).

---

## 18. Stat Card Grid

**The problem:** Summary and overview pages need to display 3-4 key metrics at equal prominence. Inline text doesn't give enough visual weight; full cards waste space.

**The pattern:**
```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
  <FSurface style={{ padding: 14, textAlign: 'center' }}>
    <FLabel mb={4}>METRIC</FLabel>
    <FNum size={20} weight={300}>42</FNum>
  </FSurface>
  {/* ... 2 more */}
</div>
```

**Why:** Equal-width columns prevent any single metric from dominating. Center-aligned text in small cards creates a "scoreboard" feel. 3 columns is the max that fits the phone viewport without cramping; 4 columns works if you reduce FNum size.

**Used by:** Training.jsx (Volume/Sets/RPE/RIR), CookSummary.jsx (Portions/Batches/Time), ProgramOverview.jsx (Sessions/Phase/Split), Macros.jsx (P/C/F targets).

---

## 19. Section Header with Metadata

**The problem:** Section labels need to show both the section name and a relevant count or status without taking a full line each.

**The pattern:**
```jsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
  <FLabel>SECTION TITLE</FLabel>
  <FMono size={10} color={Color.mute}>3 ITEMS</FMono>
</div>
```

**Why:** `justify-content: space-between` is the simplest way to put a label and its metadata on one line. `alignItems: baseline` keeps text aligned regardless of font size differences. The metadata is always muted — it's context, not content.

**Used by:** Macros.jsx ("THIS WEEK" → "14 meals"), ProgramOverview.jsx ("THIS WEEK" → "0/7 SESSIONS"), Profile.jsx ("RECENT CHECK-INS" → "4 wk STREAK"), Training.jsx summary ("Exercise breakdown"), every tile in mid/full density.

---

## 20. Card List with Status

**The problem:** Lists of actionable items (sessions, meals, batches) need to show status (done/today/missed/upcoming) and provide a contextual action button.

**The pattern:**
```jsx
<FSurface style={{
  border: `1px solid ${isActive ? alpha(color, 0.25) : Color.borderSoft}`,
  opacity: isMissed ? 0.45 : 1,
}}>
  {/* Header: label + status tags */}
  <div style={{ display: 'flex', gap: 6 }}>
    <FMono>{day}</FMono>
    {isToday && <FTag tone="accent" size="sm">TODAY</FTag>}
    {isDone && <FTag tone="green" size="sm">DONE</FTag>}
  </div>
  {/* Content: title + preview */}
  <div style={{ ...Type.headingMd }}>{name}</div>
  {/* Action */}
  {!isDone && <FBtn variant="primary" size="sm">Start</FBtn>}
</FSurface>
```

**Why:** Status tags at the top right give instant classification. The active card gets a tinted border and background to draw the eye. Done cards aren't hidden (user wants to see their history) but get a green tag. Missed cards fade to 45% opacity — present but not pressuring.

**Used by:** ProgramOverview.jsx (session cards), Macros.jsx (meal cards with swap action), CookSummary.jsx (batch cards with DONE tags).

---

## 21. Contract Hero Card

**The problem:** Pages that present a plan, protocol, or commitment need a hero that feels like a deal the user is signing — not just a title card. FDataCard is too flat and generic for this. The hero needs to carry the page's emotional weight: "here's what you're committing to."

**The pattern:**
```jsx
<div style={{
  background: alpha(goalColor, 0.08), borderRadius: Radius.xl,
  padding: '20px 20px 22px',
}}>
  <div style={{ ...Type.labelSm, color: goalColor }}>{groupLabel}</div>
  <div style={{
    fontFamily: Font.sans, fontSize: 32, fontWeight: 300,
    letterSpacing: -1, color: Color.text, lineHeight: 1.1, marginBottom: 8,
  }}>{title}</div>
  <div style={{ ...Type.bodyMd, color: Color.dim, marginBottom: 16 }}>{subtitle}</div>

  {/* Anchor numbers — the commitment */}
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
    <span style={{ fontFamily: Font.sans, fontSize: 26, fontWeight: 500, color: valueColor }}>
      {commitmentValue}
    </span>
    <span style={{ ...Type.labelSm, color: Color.mute }}>{unit}</span>
    <span style={{ ...Type.bodySm, color: Color.mute }}>·</span>
    <span style={{ ...Type.bodySm, color: Color.dim }}>{metadata}</span>
  </div>
</div>
```

**Why:** The tinted background (`alpha(goalColor, 0.08)`) gives the card a warm identity that FDataCard's flat `Color.surface` doesn't. The large commitment number (26–32px, weight 500) is the "contract" — it's the thing the user anchors on. The dot-separated metadata line (`kcal · Surplus`, `body fat · 16 weeks · ends 04 sep`) keeps context tight without a separate row.

**Used by:** GoalSetting.jsx (Your Brief — body fat contract), WorkoutTemplateDetail.jsx (protocol hero with caloric modifier).

**When to use this vs FDataCard:** Contract Hero is for pages where the user is reviewing a plan or commitment. FDataCard is for detail pages showing an entity's attributes (exercises, goals).

---

## 22. Compact List-in-Card

**The problem:** Showing N items as N individual cards creates a visual wall (R2). Each card has its own border, padding, and background — the eye can't scan quickly. But a flat list with no container loses grouping.

**The pattern:** Wrap all items in a single card container. Use divider lines between rows instead of separate cards. Feature the first item.

```jsx
<div style={{
  padding: '16px 16px 12px', borderRadius: Radius.lg,
  background: Color.surface2, border: `1px solid ${Color.borderSoft}`,
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
    <div style={{ ...Type.labelSm, color: Color.mute }}>SECTION LABEL</div>
    <div style={{ ...Type.labelSm, color: Color.mute }}>{count} ITEMS</div>
  </div>

  {items.map((item, i) => (
    <div key={i} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: i === 0 ? '12px 0 14px' : '10px 0',
      borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
    }}>
      <div>
        <div style={{ ...(i === 0 ? Type.headingSm : Type.bodyMd), color: Color.text }}>{item.name}</div>
        {i === 0 && <div style={{ ...Type.bodySm, color: Color.mute, marginTop: 2 }}>{item.detail}</div>}
      </div>
      <div style={{
        padding: '4px 10px', borderRadius: 6,
        background: alpha(goalColor, 0.10),
      }}>
        <span style={{ fontFamily: Font.mono, fontSize: 11, color: goalColor }}>{item.badge}</span>
      </div>
    </div>
  ))}
</div>
```

**Why:** One container with dividers scans 2–3× faster than individual cards. The featured first row (headingSm + subtitle) gives the eye a starting point (R4). Trailing badges in `alpha(goalColor, 0.10)` are glanceable without competing with the name. Detail info (rest times, alternatives, focus tags) lives on the tap-through, not inline (R2).

**Used by:** WorkoutTemplateDetail.jsx (sample session exercises).

**When to use this vs individual FListRow/FSurface cards:** When you have 4+ items of the same type and equal importance. If items have different statuses or actions (done/today/missed), use Card List with Status (#20) instead.

---

## 23. Dashed Motivational Note

**The problem:** Some pages need a soft contextual message — how the system works, what happens if you miss a day, what the protocol means. It's not a warning (no red), not a stat (no number), not an action (no button). It's reassurance or explanation that shouldn't compete with the data above it.

**The pattern:**
```jsx
<div style={{
  padding: 16, borderRadius: Radius.lg,
  border: `1px dashed ${Color.borderSoft}`,
}}>
  <div style={{ ...Type.labelSm, color: Color.mute, marginBottom: 6 }}>NOTE TITLE</div>
  <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5 }}>
    Explanatory text. Keep it to 1-2 sentences.
  </div>
</div>
```

**Why:** The dashed border signals "this is informational, not interactive." It's visually lighter than a solid-bordered FSurface, which tells the user they can absorb this passively. Positioned near the bottom of the data zone, just above the action zone (R6) — the user reads it right before deciding to act.

**Used by:** GoalSetting.jsx ("If you slip — the model re-fits weekly"), WorkoutTemplateDetail.jsx ("How it works — volume auto-adjusts").

**When NOT to use this:** For warnings (use red-tinted FSurface), for stats (use stat grid), for actions (use FBtn). This is strictly for low-urgency context.

---

## When to Use What

| Building... | Use pattern |
|-------------|-------------|
| New app screen | Screen Export (#1) + Nav Wiring (#10) |
| New dashboard metric | Tile Density (#2) |
| New timed activity | Focused Mode (#3) + Timer (#4) |
| New goal-derived value | Derivation Pipeline (#5) |
| New exercise grouping type | Grouping Model (#6) |
| Effort/intensity input | Intensity Grid (#7) |
| Smart mid-session adjustment | Load Suggestion (#8) |
| Showing what drives a feature | Goal Tags (#9) |
| Persisting user actions | State Update (#11) + Mock Fallback (#12) |
| New daily tracker | Universal Tracker (#13) |
| Post-session recap | Summary Page (#14) |
| Browsing a collection | Browse/Filter List (#15) |
| Showing entity details | Detail Cascade (#16) |
| Collecting user input step-by-step | Multi-Step Flow (#17) |
| Displaying key metrics side-by-side | Stat Card Grid (#18) |
| Labeling sections with counts | Section Header (#19) |
| List of actionable items with status | Card List with Status (#20) |
| Plan/protocol hero with commitment numbers | Contract Hero Card (#21) |
| 4+ same-type items in a scannable list | Compact List-in-Card (#22) |
| Soft context/reassurance message | Dashed Motivational Note (#23) |
