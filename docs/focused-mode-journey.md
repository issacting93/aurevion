# Focused Mode — User Journey

Workout Mode and Cook Mode share a unified focused-mode system. Both follow the same structural pattern: preview → active execution with timers → summary.

## Flow

```mermaid
flowchart TD
    dash([Dashboard])

    subgraph program ["Program Generation"]
        progOverview[Program Overview]
        weekPlan[Weekly Plan Grid]
        sessionCard[Session Card]
    end

    subgraph workout ["Workout Mode"]
        reviewPhase[Exercise Review + Goal Tags]
        executePhase[Active Execution]
        setTracker[Set Logger + RPE + RIR]
        loadAdjust[Load Adjustment Suggestion]
        groupExec[Group-Aware Flow · Supersets/Circuits]
        restTimer[Rest Timer + Skip]
        progressRail[Progress Rail]
        trainSum[Session Summary + Avg RIR]
    end

    subgraph cook ["Cook Mode"]
        merge[Ingredient Merge]
        gantt[Parallel Timeline]
        cookActive[Cook Mode Active]
        timers[Multi-Timer Bar]
        stepCard[Step Focus + Animations]
        cookSum[Cook Summary]
    end

    subgraph shared ["Shared Primitives"]
        pauseResume[Pause / Resume]
        skipAction[Skip Step / Exercise]
        progressBar[Progress Bars]
        timerLogic[Timer Logic · setInterval 1s]
        phaseNav[Phase Navigation]
    end

    subgraph observe ["Observe Loop"]
        activityLog[Activity Log]
        checkIn[Weekly Check-in]
        decisionEng[Decision Engine]
        intervention[Intervention]
    end

    dash --> progOverview
    dash --> merge

    progOverview --> weekPlan --> sessionCard
    sessionCard -->|"Start session"| reviewPhase
    reviewPhase -->|"Begin workout"| executePhase
    executePhase --> setTracker
    setTracker --> loadAdjust
    executePhase --> groupExec
    executePhase --> restTimer
    executePhase --> progressRail
    executePhase -->|"All exercises done"| trainSum
    trainSum -->|"Done"| dash

    merge --> gantt --> cookActive
    cookActive --> timers
    cookActive --> stepCard
    cookActive -->|"All steps done"| cookSum
    cookSum --> dash

    setTracker --> pauseResume
    restTimer --> pauseResume
    cookActive --> pauseResume
    executePhase --> skipAction
    cookActive --> skipAction
    setTracker --> progressBar
    timers --> progressBar
    restTimer --> timerLogic
    timers --> timerLogic
    executePhase --> phaseNav
    cookActive --> phaseNav

    trainSum --> activityLog
    cookSum --> activityLog
    activityLog --> checkIn
    checkIn --> decisionEng
    decisionEng --> intervention
    intervention -->|"Adjust program"| progOverview
    intervention -->|"Adjust nutrition"| dash

    style program fill:#DDE8FF,stroke:#3DADFF
    style workout fill:#DCCCFF,stroke:#874FFF
    style cook fill:#C2E5FF,stroke:#66D575
    style shared fill:#CDF4D3,stroke:#66D575
    style observe fill:#FFF3C2,stroke:#E3BC2C
    style dash fill:#CDF4D3,stroke:#66D575
```

## Legend

| Color | Meaning |
|-------|---------|
| Light blue | Program Generation — goal-driven plan output |
| Purple | Workout Mode — 3-phase active session |
| Blue-green | Cook Mode — 3-screen prep and execution |
| Green | Shared primitives — timer, pause, progress |
| Yellow | Observe loop — logging, check-in, intervention |

---

## Workout Mode (Current Implementation)

### Phase 1: Program Overview
**File**: `src/app/screens/ProgramOverview.jsx`
**Entry**: Train tab (default) or Session tile tap

- **Program header**: program name, phase badge (Base/Build/Peak), week X of 12 indicator, progress bar
- **Phase timeline**: 3-block visualization (Base/Build/Peak) with active phase highlighted and week ranges
- **Week status**: hero number showing completed/total sessions for the current week
- **Session cards**: name, modality tag, **goal source tags** (showing which user goals drive this session), exercise count, duration estimate, "HAS SUPERSETS" indicator, first 3 exercises with right-aligned sets/reps (SS prefix for grouped exercises), status tags (TODAY/DONE/MISSED/UPCOMING), "Start session" button
- **Rest days**: compact single row listing all rest days
- **Quick actions**: Browse exercises, Goal details, View in calendar (cross-tab link to Plan tab via `switchTab('plan')`)
- **Stats footer**: sessions/week, phase name + week range, split label
- **Advance week**: prototype button to step week progression (calls `advanceWeek()` — resets completed, increments week, recalculates phase)
- Auto-generated from `UserContext.workoutPlan` via `generateProgram()`
- **Plan tab also launches sessions**: `PlanCalendarContent` receives `onStartSession` and can start workouts from the calendar week/day views

### Phase 2: Active Session
**File**: `src/app/screens/Training.jsx`
**Entry**: "Start session" pushes detail with session data

Three internal phases:

**Review** — Exercise list with sets/reps/load and form cues. Goal source tags ("TARGETS: HYPERTROPHY, FAT LOSS"). Grouped exercises shown with colored left border, group label tag (SUPERSET A / CIRCUIT), "NO REST" annotations. "Begin Workout" button.

**Execute** — The core workout experience:
- **Group indicator** — when inside a superset/circuit: accent-bordered banner showing type, position (Exercise 1/2), "NO REST →" hint
- Progress rail (segmented bar, done/active/remaining)
- Elapsed timer (global, ticks every second via `setInterval`)
- Current exercise focus card (name, muscles, form cue)
- Set tracker (visual cards per set with checkmark/accent/empty states, shows **effective load** which may differ from planned)
- RPE selector (buttons 5-10, **bidirectionally synced with RIR**)
- **RIR selector** (buttons 0-5, "REPS IN RESERVE" — tapping auto-sets RPE to 10 - RIR)
- "Log set" button (records reps + weight + RPE + RIR, advances set)
- **Load adjustment suggestion** — after logging, if RIR ≥ 3 or RIR = 0, shows FSurface card: "Bump to Xkg?" / "Drop to Xkg?" with Keep/Use buttons. Accepted adjustments apply to remaining sets via `loadOverrides` state
- Rest timer (countdown from exercise's rest period, skip button). **Group-aware**: skips rest between superset exercises, uses `restAfterGroup` timer after last exercise in a group
- Auto-advance to next exercise when all sets logged
- Bottom toolbar: Pause/Resume, Skip Exercise, End Workout

**Summary** — Auto-computed from logged data:
- Hero green checkmark + duration
- 4-stat row: Volume (Σ reps × load), total sets, avg RPE, **avg RIR**
- Exercise breakdown with per-exercise volume, **load progression** shown if weight changed mid-session (e.g., "80 → 85 kg")
- **Intensity bar** — combined RPE/RIR display with FTexBar
- "Done" button → pops detail, marks session complete

### State
```js
phase: 'review' | 'execute' | 'summary'
currentExIdx, currentSetIdx    // exercise and set position
loggedSets: [{                 // per-exercise log
  exerciseId, name,
  planned: { sets, reps, load },
  logged: [{ reps, load, rpe, rir, adjustedLoad }]  // rir: 0-5, adjustedLoad: if different from planned
}]
elapsed: number                // seconds since workout start
restRem: number                // rest countdown (seconds)
paused: boolean                // pause flag
rpeInput: number | null        // current RPE selection (bidirectionally synced with rirInput)
rirInput: number | null        // current RIR selection (0-5)
resting: boolean               // in rest period
loadOverrides: { [exIdx]: number }  // accepted load adjustments per exercise
loadSuggestion: { suggested, current, exIdx } | null  // active suggestion during rest
```

### Exercise Grouping
Exercises in the `coreExercises` array may carry group annotations (from `flattenSessionExercises()`):
```js
{
  ...exercise,
  _groupId: string | null,     // shared ID for exercises in the same group
  _groupType: 'superset' | 'circuit',
  _groupLabel: 'A',            // label shown in UI
  _isLastInGroup: boolean,     // controls when rest timer fires
  _posInGroup: number,         // 0-indexed position within group
  _groupSize: number,          // total exercises in group
  _restAfterGroup: number,     // rest seconds after completing all items
}
```

---

## Cook Mode (Current Implementation)

### Screen 5A: Ingredient Merge
**File**: `src/app/screens/MealPrep.jsx` (MealPrepMergeContent)

- 3+ recipes merged into single ingredient list
- Ingredient deduplication across recipes
- Checkbox to mark prepped items
- Color-coded recipe attribution ("salmon 2 · chili 2")
- "Check pantry" link to Fridge screen

### Screen 5B: Parallel Timeline
**File**: `src/app/screens/MealPrep.jsx` (MealPrepTimelineContent)

- Gantt-style lanes (one per recipe)
- Time ruler (0–78 min)
- NOW cursor with elapsed time
- Step state: done (dashed border) / active (solid fill) / todo (full opacity)
- Active passive steps: striped pattern overlay
- Active timers list sorted by remaining time
- Pause/resume for all timers

### Screen 5C: Active Cook Mode
**File**: `src/app/screens/MealPrep.jsx` (MealPrepCookModeContent)

- 3 independent countdown timers (per recipe)
- Step focus card with contextual animation (26 animations: sear, steam, chop, plate, etc.)
- Step navigation (back/forward)
- Conflict detection: red alert when oven temperatures overlap
- Pause/resume for all timers simultaneously

### State
```js
step: number           // 1-indexed current step
timers: [{             // per-recipe timer
  color, label,
  total: seconds,
  rem: seconds,        // remaining (decremented every 1s)
  big?: boolean
}]
paused: boolean
done: Set<number>      // checked ingredients (merge view)
elapsedSec: number     // timeline elapsed (timeline view)
```

---

## Shared Primitives

### Timer Pattern
Both modes use the same `setInterval` approach:
```js
useEffect(() => {
  if (paused) return
  const t = setInterval(() => {
    setElapsed(s => s + 1)
    setRestRem(s => Math.max(0, s - 1))  // or setTimers for cook mode
  }, 1000)
  return () => clearInterval(t)
}, [paused])
```

### Progress Display
- `FTexBar` for horizontal progress
- Segmented bar for exercise progression (done/active/remaining)
- `FNum` for elapsed time display
- `formatTime(sec)` → "MM:SS"

### Controls
- Pause/Resume toggle (`FBtn variant="ghost"`)
- Skip (exercise or step) (`FBtn variant="ghost"`)
- End session (`FBtn variant="split"`)

### Layout Structure
```
Sticky header    — flexShrink: 0, borderBottom
Main content     — flex: 1, overflowY: auto, minHeight: 0
Bottom toolbar   — flexShrink: 0, borderTop (workout) or padding (cook)
```

---

## Observe Loop (Post-Session)

Both modes write to `UserContext.activityLog` on completion:

```js
// Workout
logWorkout({ duration, type, name, loggedSets })

// Cook
logCook({ duration, recipes, portions })
```

This feeds into:
- **Behavioral metrics**: `workouts_7d`, `home_cook_7d` (7-day rolling window)
- **Weekly check-in**: Decision engine evaluates adherence + body metrics
- **Interventions**: Generated if thresholds crossed (e.g., too-aggressive weight loss)

---

## Remaining Gaps

| Gap | Impact | Notes |
|-----|--------|-------|
| **Session persistence** | High | Active state is `useState` — lost on navigation or app close |
| **Abandon recovery** | High | No way to resume a dropped workout or cook session |
| **Audio/haptic cues** | Medium | No sound on rest timer completion or cook timer done |
| **Exercise substitution** | Medium | Can't swap exercises during a session |
| **Recipe ↔ Macro connection** | High | Cook mode recipes are hardcoded, not generated from targets |
| **PR tracking** | Medium | Summary computes volume but doesn't persist bests |
| ~~**Periodization**~~ | ~~High~~ | Basic week advancement now works via `advanceWeek()` (Base/Build/Peak phases, week counter). Auto-progression of weights and exercise variation across weeks still not built. |
| ~~**RIR input**~~ | ~~High~~ | RIR selector (0-5) with bidirectional RPE sync now built. Load adjustment suggestions based on RIR values. |
| ~~**Supersets/Circuits**~~ | ~~High~~ | Exercise grouping model with group-aware execution. Hypertrophy/strength → supersets, HIIT/endurance → circuits. |
| ~~**Goal linkage in UI**~~ | ~~Medium~~ | Goal source tags on session cards and review phase. GoalDetail shows linked sessions. |
| **Cook ↔ Food log** | Medium | Completing cook mode doesn't auto-log meals |
| **Cross-session progression** | Medium | RIR-based load suggestion works mid-session; auto-progression of weights across sessions not built |
