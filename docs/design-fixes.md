# Design Fixes — Screen-by-Screen Audit

Applying the 6 design rules (R1-R6 from templates.md) across every screen. Each fix references the rule it enforces.

---

## Priority 1 — Visibly Broken

### ExerciseBrowser.jsx — List rows too dense (R2)

**Problem:** Each row dumps "COMPOUND · BARBELL · quads, glutes, core" as inline mono text. Reads like a database query.

**Fix:**
- Row shows: exercise name (bodyLg) + single category tag (colored FTag)
- Remove inline muscle list — that's what ExerciseDetail is for
- Add equipment as a small muted icon or mono label, not another tag
- Increase row padding from 12px to 16px
- Keep the arrow (→) trailing indicator

**Before:** `Back Squat · COMPOUND · BARBELL · quads, glutes, core →`
**After:** `Back Squat [COMPOUND] →` with barbell icon muted below

### ProgramOverview.jsx — Empty state too weak (R5)

**Problem:** "No program yet" has a tiny icon + two lines in a massive blank area. Bottom metadata disconnected.

**Fix:**
- 64px icon in a tinted accent circle
- Heading: "Your program starts here" (not "No program yet")
- Subtitle: "Complete onboarding to generate a training plan built for your goals"
- Large accent CTA button below
- Move "DATA PRODUCED" badges inline with the CTA area, not floating at bottom

### ProgramOverview.jsx — Quick actions buried (R6)

**Problem:** "Browse exercises" and "Goal details" are ghost text buttons at the very bottom.

**Fix:**
- Move to a 2-column grid of small icon cards directly below the week hero
- Each card: FSurface with 14px padding, icon + label, tappable
- Cards: "Exercises" (browse icon), "Goals" (goal icon), "Calendar" (calendar icon), "Templates" (template icon)

---

## Priority 2 — Design Inconsistency

### ExerciseDetail.jsx — Section weight flat (R4)

**Problem:** After the hero, Form Cue / Prescriptions / Goals / Injuries all have equal visual weight. No hierarchy.

**Fix:**
- Form Cue: **primary** — keep the accent left border FSurface, make it the dominant section after hero
- Prescriptions: **primary** — keep the spacious cards with FNum
- Used In Goals: **secondary** — remove the card wrappers, just colored pills with dots (already done)
- Injury Cautions: **tertiary** — smaller text, muted treatment, move to bottom

### WorkoutTemplateDetail.jsx — Stats strip too tight (R2)

**Problem:** FREQUENCY / SPLIT / REP RANGE values wrap on narrow screens.

**Fix:**
- Increase gap between stat items from 16px to 20px
- If 3 items don't fit, switch to 2-row layout: frequency+split on row 1, rep range on row 2
- Or: move stats out of the hero card into a separate horizontal strip below it

### WorkoutTemplateDetail.jsx — Sample session wall (R2, R4)

**Problem:** 5 exercise cards of identical size/shape = visual wall.

**Fix:**
- First exercise (typically the main compound): larger card, accent border, exercise name at headingMd
- Remaining exercises: compact rows (not full FSurface cards), just name + sets pill + rest + alt
- This creates a visual hierarchy: one featured exercise + supporting list

### All detail pages — Icon monotony (R3)

**Problem:** Every header uses `ICONS.dumb` regardless of category.

**Fix (implement in ExerciseDetail, ExerciseBrowser, ProgramOverview):**
```js
const CATEGORY_ICONS = {
  compound:  ICONS.dumb,
  isolation: ICONS.target || ICONS.dumb,
  core:      ICONS.flame,
  cardio:    ICONS.timer,
  hiit:      ICONS.flame,
  mobility:  ICONS.expand,
  warmup:    ICONS.play,
  cooldown:  ICONS.pause,
}
```
- ExerciseDetail hero: use category icon instead of always dumbbell
- ExerciseBrowser rows: use category icon as leading element
- ProgramOverview exercise preview: dot color already varies, add icon variation

---

## Priority 3 — Polish

### GoalDetail.jsx — Modality list equally weighted (R4)

**Problem:** All modalities listed with same visual weight (S/M/W tags).

**Fix:**
- Strong (S) modalities: full card with accent tint
- Moderate (M): plain row with blue dot
- Weak (W): muted text, no dot, indented

### Dashboard.jsx — Greeting area (R1)

**Problem:** Greeting + goals strip works but isn't a true hero. No visual dominance.

**Fix:**
- The session tile (when present) should be the hero: larger, accent-bordered, with a "Start now" CTA
- If no session today, the greeting itself becomes the hero: larger type, more dramatic spacing

### Profile.jsx — Settings section flat (R4)

**Problem:** Settings rows all identical FListRow items. No grouping or hierarchy.

**Fix:**
- Group into sections: "Account", "Preferences", "Data"
- Add section headers with the Section Header pattern (#19)
- Destructive actions (reset, delete) get red tone treatment

### Training.jsx Summary — Exercise breakdown monotone (R4)

**Problem:** All exercises listed as identical FListRow items.

**Fix:**
- Group exercises by type: compounds first (bolder), then accessories (lighter)
- If supersets were used, show the grouping bracket in the breakdown
- Highlight exercises where load was adjusted (show the arrow: 80 → 85kg in accent)

---

## Implementation Checklist

| Fix | File | Rule | Priority | Effort |
|-----|------|------|----------|--------|
| ExerciseBrowser row simplification | ExerciseBrowser.jsx | R2 | P1 | Small |
| ProgramOverview empty state | ProgramOverview.jsx | R5 | P1 | Small |
| ProgramOverview quick actions | ProgramOverview.jsx | R6 | P1 | Small |
| Category icon mapping | ExerciseDetail, ExerciseBrowser, ProgramOverview | R3 | P2 | Medium |
| ExerciseDetail section hierarchy | ExerciseDetail.jsx | R4 | P2 | Small |
| WorkoutTemplate stats strip spacing | WorkoutTemplateDetail.jsx | R2 | P2 | Tiny |
| WorkoutTemplate featured exercise | WorkoutTemplateDetail.jsx | R4 | P2 | Small |
| GoalDetail modality hierarchy | GoalDetail.jsx | R4 | P3 | Small |
| Dashboard session hero | Dashboard.jsx | R1 | P3 | Medium |
| Profile settings grouping | Profile.jsx | R4 | P3 | Small |
| Training summary grouped breakdown | Training.jsx | R4 | P3 | Small |
