# AUREVI0N — User Flow Report

**Date**: 2026-07-07
**Method**: 3 automated test agents with distinct profiles ran end-to-end through onboarding, program generation, exercise browsing, session execution, and workout history. 156 programmatic checks across 11 categories, plus manual UX walkthrough of each flow.

---

## The Core Question

A person downloads AUREVI0N and asks: **"What do I do?"**

The app should answer that question at every point in the experience. Right now, it answers it during onboarding (clearly) and during a live session (well), but loses the thread everywhere in between.

---

## What Works

### Onboarding → Program is seamless
You answer 12 questions. The app computes your TDEE, sets your macros, generates a multi-week training plan tailored to your goals, equipment, injuries, and available days. This happens in under 3 seconds. No manual configuration. You land on a dashboard with a program ready to execute.

All three test agents confirm: constraints are enforced (Sam's knee injury excludes squats, Jordan's shoulder injury excludes bench press), equipment is respected (Sam only sees dumbbell + bodyweight exercises), splits match available days (3d → full body, 4d → upper/lower, 5d → PPL).

### The active session is strong
Once you're inside a workout, the execute flow works: set-by-set logging, RPE/RIR capture with bidirectional sync, rest timers that respect superset grouping, load adjustment suggestions when you're working too easy or too hard. The summary computes real volume, average intensity, and per-exercise breakdowns.

### Exercise customization exists
The 3-mode browser (PROGRAM / FOR YOU / ALL) with swap candidates, goal-aware filtering, and injury exclusion labels is functional. Alex has 4 alternatives for OHP. Sam has 3 for Push-up. The constraint engine does its job.

---

## What's Missing — From the User's Perspective

### 1. "What should I do right now?"

**The problem**: You open the app on a Tuesday morning. The Train tab shows your program for the week. But there's no sense of urgency or timing. No "your session is Upper B · Strength — you usually train at 8am." No equipment prep list. No warmup guidance. Just a static card and a Start button.

**What the user needs**: A single, confident directive. "This is what you're doing today. Here's what you need. Here's what you did last time. Start when you're ready."

**What's missing**:
- Suggested training time (based on history patterns)
- Equipment checklist ("you'll need: barbell, bench, dumbbells")
- "Last time" strip showing your actual logged weights for this workout type
- Pre-workout context: targeted warmup for today's muscle groups, not a generic "warm-up" entry

### 2. "Why am I doing this?"

**The problem**: Jordan's program has 4 different modalities in one week — hypertrophy, strength, HIIT, power. To Jordan, this looks random. Why is Monday hypertrophy but Thursday HIIT? The goal source tags say "recomposition" and "max_strength" but don't explain the logic.

**What the user needs**: The *reasoning* behind the program, not just the output. "Monday is hypertrophy to build muscle (recomp goal). Thursday is HIIT to drive caloric expenditure (fat loss component of recomp). The mix is intentional."

**What's missing**:
- Session rationale: why this modality, on this day, for your goals
- Phase explanation: "You're in Base phase — building movement foundations before intensity increases"
- Week-to-week progression visibility: how this week differs from last week

### 3. "Am I making progress?"

**The problem**: After completing a session, you see volume and RPE. Then you tap Done and that data disappears into the void. There's no trend line. No "you squatted 5kg more than last week." No streak or momentum indicator. The history screen exists but it's a flat list — it doesn't *tell you anything* about your trajectory.

For Sam (bodyweight user), volume is literally 0 kg. The primary progress metric is meaningless.

**What the user needs**: Progress that's visible without hunting for it. A number going up. A streak that matters. Something that makes next Tuesday's session feel like it builds on this Tuesday's.

**What's missing**:
- PR detection and celebration in the summary ("new bench PR: 65kg")
- Volume/load trend on the today hero card ("volume ↑12% vs last week")
- Bodyweight progress metric (total reps, or reps × bodyweight estimate)
- Strength progression graph per exercise over time

### 4. "What happens after the workout?"

**The problem**: The session summary is a dead end. You see stats, tap Done, return to Program Overview. There's no bridge to nutrition ("eat within 2 hours — your post-workout meal should prioritize protein + carbs"), no preview of what's next ("rest day tomorrow, then Lower B on Thursday"), no recovery guidance.

The fitness → nutrition bridge is AUREVI0N's core thesis ("your goals determine what you train AND what you cook"), but the training flow never touches nutrition. The two modes are separate worlds.

**What the user needs**: Forward momentum. The end of a workout should feel like the beginning of recovery, not a full stop.

**What's missing**:
- Post-workout meal suggestion (based on caloric state + meal timing rules from fitness.md)
- Next session preview in the summary
- Recovery context on rest days ("you trained legs yesterday — mobility focus today")
- Bridge to cooking mode ("you need 40g protein in the next 2 hours — quick meal?")

### 5. "I'm back — what changed?"

**The problem**: You return to the app next week. The dashboard looks the same. The program shows the same week (unless you manually advance). There's no "welcome back, here's what's different this week" moment. No sense that the system *learned* from your last week's data.

**What the user needs**: Evidence that the app is adapting. Even small signals — "your loads are increasing, we bumped your squat to 85kg this week" — build trust that the system is working.

**What's missing**:
- Auto-progression: carry forward load adjustments from last week's RIR data
- Week transition moment: summary of last week, preview of this week's changes
- Intervention visibility: if the check-in decision engine flagged something, surface it at the top of the Train tab, not buried in the dashboard

---

## The Three User Archetypes

### Alex — The Happy Path
Hypertrophy, full gym, 5 days, intermediate, no injuries.

Everything works for Alex. Wide exercise pool (72), uniform sessions (50 min each), meaningful volume tracking, plenty of swap candidates. The PPL split is familiar to anyone who's lifted before. Alex's risk is *boredom* — the same exercises every week with no visible progression.

**What Alex needs next**: Auto-progression, PR tracking, and phase transitions that feel different (not just a label change from "Base" to "Build").

### Sam — The Constrained Beginner
Fat loss, home basic, 3 days, beginner, knee injury, gluten-free.

Sam is the most important user because Sam is the *target user* — "fit-curious, overwhelmed by the gap between wanting to look better and knowing what to do." But Sam's experience has the most friction: tiny exercise pool (~15 after filters), 0 kg volume, varying session lengths (30-55 min), only 1 swap alternative for some exercises.

**What Sam needs next**: Bodyweight-appropriate metrics, progression that isn't load-based (more reps, harder variations), and encouragement that 3 days of bodyweight training *works* for fat loss — because right now the app shows the same data UI designed for Alex's barbell program.

### Jordan — The Power User
Recomp + max strength, full gym, 4 days, advanced, shoulder injury.

Jordan pushes every edge case. Multi-goal programs generate 4 modalities, which makes the week feel incoherent. Shoulder injury creates swap dead ends (0 alternatives for Push-up). Advanced loads are high but the load estimation is crude (just a 1.3× multiplier). Jordan wants to understand and control the program — but the app generates and expects trust.

**What Jordan needs next**: Program rationale explaining the modality mix, ability to override loads (not just swap exercises), and a way to see how recomp + strength goals interact ("this session serves both goals because...").

---

## Test Results Summary

| Category | Alex (19 checks) | Sam (19 checks) | Jordan (19 checks) |
|----------|:-:|:-:|:-:|
| Onboarding | 19/19 | 19/19 | 18/19 |
| Constraints | clean | clean | clean |
| Swap | 2-4 per ex | 1-3 per ex | 0-5 (1 dead end) |
| Volume | 2,288 kg | 0 kg | 1,116 kg |

**Bugs found and fixed during testing**:
1. Caloric modifier wasn't applied (shorthand/full key mismatch) — fixed
2. Cardio sessions missing warmup/cooldown — fixed
3. Macro split used wrong key for goal-specific ratios — fixed

---

## Recommendations — Priority Order

### P0: Make the daily directive clear
- Equipment checklist on the today hero
- "Last time" weights for each exercise
- Skip the review phase or make it a warmup flow

### P1: Connect sessions forward
- Post-workout meal bridge
- Next session preview in summary
- Rest day recovery guidance

### P2: Show progress
- PR detection + celebration
- Volume/load trends on the today card
- Bodyweight reps metric for non-weighted users
- Strength progression graphs

### P3: Explain the program
- Session rationale per modality
- Phase transition moments
- Multi-goal coherence messaging

### P4: Close the loop
- Auto-progression from RIR data
- Week-over-week comparison
- Intervention surfacing on the Train tab
