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
Active Session (set logging, RPE, rest timers)
    ↓
Workout Summary (auto-computed volume, PRs)
```

## Exercise Database

48 exercises in `src/app/screens/fitness-data.js`, each with:

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
4. Fill remaining days as rest/recovery
5. Return full weekly schedule
```

## Load Estimation

Rough starting weights by experience level:

| Multiplier | Level |
|---|---|
| 0.6× | Beginner |
| 1.0× | Intermediate |
| 1.3× | Advanced |

Applied to base weights per exercise (e.g., back squat base = 80kg → beginner starts at 48kg, advanced at 104kg).

## Where It's Used

- **`UserContext.completeOnboarding()`** — auto-generates plan after onboarding
- **`UserContext.regeneratePlan()`** — manual regeneration (e.g., after goal change)
- **`ProgramOverviewContent`** — displays the weekly plan on the Train tab
- **`TrainingSessionContent`** — receives a session's exercise data for execution
- **Dashboard `SessionTile`** — shows next upcoming session from the plan

## What's Not Built Yet

- **Periodization**: No week-to-week progression (linear, undulating, block)
- **Auto-progression**: No automatic weight increases based on performance
- **PR tracking**: Summary computes PRs but doesn't persist them for comparison
- **Deload weeks**: No automatic deload detection or scheduling
- **Exercise substitution UI**: Can't swap exercises within a session (data supports it, UI doesn't)
- **Custom exercises**: User can't add their own exercises to the database
