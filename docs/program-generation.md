# Program Generation — How Goals Become Workouts

## The Pipeline

```
User Profile (from onboarding)
    ↓
Goals + Constraints + Equipment + Injuries + Experience
    ↓
generateProgram()  [src/app/screens/fitness-data.js]
    ↓
Weekly Training Plan (stored in UserContext.workoutPlan)
    ↓
Program Overview Screen (Train tab)
    ↓
Active Session (set logging, RPE + RIR, load adjustment, rest timers, superset/circuit grouping)
    ↓
Workout Summary (auto-computed volume, avg RPE, avg RIR, load progressions)
```

## Exercise Database

72 exercises in `src/app/screens/fitness-data.js`. Also exports:
- `MODALITY_COLORS` — shared color map for training modality tags
- `getProgramPhase(week)` — returns phase name/description for the 12-week program
- `flattenSessionExercises(exercises)` — flattens grouped exercises (supersets/circuits) into a linear array with `_groupId`, `_isLastInGroup`, `_posInGroup` annotations
- `computeAvgRIR(loggedSets)` — mean RIR across all logged sets
- `suggestLoadAdjustment(load, rir)` — returns suggested load based on RIR (±5%, rounded to 2.5kg)

Each exercise has:

```js
{
  id: 'back_squat',
  name: 'Back Squat',
  category: 'compound',              // compound | isolation | core | cardio | hiit | mobility
  muscles: ['quads', 'glutes', 'core'],
  equipment: 'barbell',              // barbell | dumbbell | cable | machine | bodyweight | bands
  modality: ['hypertrophy', 'strength'],  // which training modalities this exercise serves
  cue: 'Drive through the floor, chest up, knees track toes',
  injury_exclude: ['knees', 'lower_back'],  // auto-excluded if user has these injuries
}
```

### Equipment Tiers

| User Selection | Available Equipment |
|---|---|
| `full_gym` | barbell, dumbbell, cable, machine, bodyweight, bands |
| `home_full` | barbell, dumbbell, bodyweight, bands |
| `home_basic` | dumbbell, bodyweight, bands |
| `bands` | bodyweight, bands |
| `bodyweight` | bodyweight only |

The program generator filters exercises by what the user has access to — someone with `home_basic` will never see barbell or machine exercises.

## Goal → Modality Mapping

Each fitness goal maps to one or more training modalities:

| Goal | Primary Modalities |
|---|---|
| Hypertrophy | hypertrophy |
| Fat Loss | hiit, strength, cardio |
| Recomposition | hypertrophy, hiit |
| Max Strength | strength, power |
| Cardio Endurance | cardio, endurance |
| Power | power, strength |
| Agility | hiit, power |
| Flexibility | mobility |
| Balance | mobility, endurance |
| Overall Wellness | cardio, mobility, hypertrophy |

These mappings match the edges in the Goal Network graph (`/journey/goals`).

## Modality Configuration

Each modality defines rep ranges, rest periods, and session structure:

| Modality | Sets | Reps | Rest | Exercises | Duration |
|---|---|---|---|---|---|
| Hypertrophy | 3-4 | 8-12 | 90s | 6 | ~50 min |
| Strength | 4-5 | 3-6 | 180s | 5 | ~55 min |
| HIIT | 3-4 | 8-15 | 30s | 5 | ~30 min |
| Cardio | 1 | 1 (duration) | 0 | 2 | ~35 min |
| Power | 4-5 | 3-5 | 150s | 5 | ~45 min |
| Mobility | 2-3 | 10 | 30s | 5 | ~20 min |
| Endurance | 3-4 | 12-20 | 45s | 5 | ~40 min |

## Split Selection

The number of available days determines the training split:

| Available Days | Split | Structure |
|---|---|---|
| 2-3 | Full Body | Full Body A, B, C |
| 4 | Upper/Lower | Upper A, Lower A, Upper B, Lower B |
| 5-6 | Push/Pull/Legs | Push, Pull, Legs, Push B, Pull B, Legs B |

### Muscle Focus by Split

| Focus | Targeted Muscles |
|---|---|
| Upper | chest, back, shoulders, biceps, triceps |
| Lower | quads, hamstrings, glutes, calves |
| Push | chest, shoulders, triceps |
| Pull | back, biceps, rear delts |
| Legs | quads, hamstrings, glutes, calves |
| Full | all muscles |

## Generation Algorithm

```
1. Collect active modalities from user's selected goals
2. Pick split template based on available days count
3. For each training day:
   a. Rotate through modalities (day 1 = modality[0], day 2 = modality[1], etc.)
   b. Filter exercise pool by: equipment ∩ !injuries ∩ modality ∩ muscle focus
   c. Deterministic shuffle (seeded by day index for consistency)
   d. Pick exercises: compounds first, then accessories, limit 2 per muscle group
   e. Assign sets/reps from modality config, load from experience-based estimation
   f. Prepend warmup, append cooldown (skipped for mobility/cardio sessions)
   g. **Apply exercise grouping based on modality:**
      - Hypertrophy/Strength (≥4 exercises): pair last 2 isolation exercises as a superset
      - HIIT/Endurance: wrap all core exercises in a circuit with 3 rounds
      - Other modalities: no grouping (flat array)
   h. **Track goal sources**: filter user goals to find which contributed to this session's modality
4. Fill remaining days as rest/recovery
5. Return full weekly schedule + program metadata (programName, totalWeeks, currentWeek, phase, goalSources per session)
```

## Program Phases

`getProgramPhase(week)` returns the current training phase:

| Phase | Weeks | Description |
|---|---|---|
| Base | 1–4 | Foundation building, moderate intensity |
| Build | 5–8 | Progressive overload, increasing volume |
| Peak | 9–12 | Intensity peaks, taper in final week |

The phase is stored in `workoutPlan.phase` and recalculated when `advanceWeek()` is called.

## Load Estimation

Rough starting weights by experience level:

| Multiplier | Level |
|---|---|
| 0.6× | Beginner |
| 1.0× | Intermediate |
| 1.3× | Advanced |

Applied to base weights per exercise (e.g., back squat base = 80kg → beginner starts at 48kg, advanced at 104kg).

## Exercise Grouping Model

Sessions can contain grouped exercises (supersets or circuits). The `exercises` array may include group wrapper objects alongside plain exercise objects:

```js
// Plain exercise (unchanged)
{ exerciseId, name, category, muscles, cue, sets, reps, load, rest, duration }

// Group wrapper
{
  groupType: 'superset' | 'circuit',
  label: 'A',                  // displayed as "SUPERSET A" or "CIRCUIT 1"
  items: [exerciseObj, ...],    // 2 for superset, 3+ for circuit
  restAfter: 90,               // rest seconds after completing all items in one round
  rounds: 1 | 3,               // 1 for supersets, 3 for circuits
}
```

Screens that don't need group awareness use `flattenSessionExercises()` to convert to a flat array with `_groupId` annotations.

### Grouping Rules

| Modality | Grouping | Logic |
|----------|----------|-------|
| Hypertrophy / Strength | Superset (if ≥ 4 exercises) | Last 2 isolation/core exercises paired |
| HIIT / Endurance | Circuit | All core exercises wrapped, 3 rounds |
| Other | None | Flat exercise array |

## Goal Source Tracking

Each session carries `goalSources: string[]` — the user goals that contributed to this session's modality selection. Populated by filtering user goals through `deriveModalities()` to see which ones include the session's modality.

Used for:
- Goal tags on ProgramOverview session cards
- "TARGETS:" line in Training review phase
- "YOUR SESSIONS" section on GoalDetail screen (reverse lookup)

## RIR-Based Load Adjustment

`suggestLoadAdjustment(currentLoad, rir)` returns a suggested load change:

| RIR | Suggestion | Logic |
|-----|-----------|-------|
| 0 | Load × 0.95 | Too hard — drop 5% |
| 1-2 | None (sweet spot) | No change |
| ≥ 3 | Load × 1.05 | Too easy — bump 5% |

Results are rounded to the nearest 2.5 kg. Shown as a suggestion card during rest; user can accept or dismiss.

## Where It's Used

- **`UserContext.completeOnboarding()`** — auto-generates plan after onboarding
- **`UserContext.regeneratePlan()`** — manual regeneration (e.g., after goal change)
- **`UserContext.advanceWeek()`** — increments `currentWeek`, recalculates `phase`, resets session `completed` flags
- **`ProgramOverviewContent`** — displays program with phase timeline, week navigation, session cards on the Train tab
- **`PlanCalendarContent`** — reads `workoutPlan.schedule` for month/week/day views, launches sessions from calendar
- **`TrainingSessionContent`** — receives a session's exercise data for execution (flattens groups, handles RIR + load adjustment)
- **Dashboard `SessionTile`** — shows next upcoming session from the plan (flattens groups for preview)
- **`GoalDetailContent`** — reads `goalSources` to show linked sessions

## What's Not Built Yet

- ~~**Periodization**~~: Basic week advancement now works via `advanceWeek()` (Base/Build/Peak phases, week counter, completed flag reset). Linear/undulating/block periodization with actual exercise variation not yet built.
- ~~**Exercise grouping**~~: Supersets and circuits now auto-generated based on modality. Group-aware execution in Training.jsx.
- ~~**Goal linkage**~~: `goalSources` tracks which goals drive each session. Visible in ProgramOverview and Training review phase.
- ~~**RIR tracking**~~: RIR selector with bidirectional RPE sync. Load adjustment suggestions based on RIR.
- **Auto-progression**: RIR-based load suggestion works mid-session; cross-session progression not built
- **PR tracking**: Summary computes PRs but doesn't persist them for comparison
- **Deload weeks**: No automatic deload detection or scheduling
- **Exercise substitution UI**: Can't swap exercises within a session (data supports it, UI doesn't)
- **Custom exercises**: User can't add their own exercises to the database
