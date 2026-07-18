# Design Fixes — 2026-07-07

Status as of 2026-07-11.

---

## 1. Standardise weight selection

~~Currently three different patterns for picking a weight value.~~

**Fixed** (2026-07-11): Created shared `FWeightInput` component in `components.jsx` — spinner with −/+ buttons, configurable step/range/unit, `size` (sm/md/lg) and `inline` mode variants.

| Context | Before | After |
|---------|--------|-------|
| Onboarding body weight | `OBSlider` (drag slider) | `FWeightInput` size="lg" |
| Check-in weight | `CINumberInput` (local component) | `FWeightInput` (shared) |
| Check-in body fat | `CINumberInput` | `FWeightInput` |
| Training exercise load | No direct input | `FWeightInput` inline — tap load display to adjust, Done to confirm |

`CINumberInput` deleted. All weight/load entry now uses the same component.

**Status**: Done.

---

## 2. Analytics page flow

What should the analytics/observe page contain? How do we edit it? What do we see?

**Current state** (`/journey/observe`): 5 sections by cadence:
- **WEEKLY** — Check-in flow (weight, BF, subjective rating)
- **DAILY** — Food log, water tracking
- **ANALYTICS** — Macro adherence heatmap (8wk × 7d)
- **ACCOUNT** — Profile hub
- **SURPLUS** — TDEE model + confidence (energy model over time)

**What's missing**:
- [ ] Weight/BF trend visualization (check-in captures data but no trend graph)
- [ ] Training volume trends over weeks
- [ ] Strength progression graphs per exercise
- [ ] Food log → macro targets real-time update (logging a meal doesn't update remaining)
- [ ] Entry point from Today screen (no "Analytics" quick action)

**Status**: SURPLUS tab added (2026-07-11). Remaining items not started.

---

## 3. Today view vs Home page for fitness

**Was confusing**: Today screen and Dashboard/Home competed as landing pages with overlapping content.

**Fixed** (2026-07-11): Today screen is now the definitive fitness landing with:
- Greeting + avatar
- Streak + Active Contract cards (side by side)
- Session hero (training/rest/completed states)
- Weekly schedule rows
- Goal section (name, description, deficit)
- Macro split card
- Water + calorie trackers
- Quick actions (Exercises, History, Check-in)

Dashboard still exists as secondary "full picture" tile grid, one tab away. Today is the front door — one directive per day, zero navigation decisions.

**Also fixed** (2026-07-11):
- GoalSetting.jsx deleted — was duplicating onboarding's body fat + timeline + contract screens
- FOB_Summary replaced with Goal Contract layout ("Sign on" CTA)
- Drag slider from GoalSetting ported to FOB_BodyComp for target BF
- Journey flows reorganized: ONBOARDING → PROGRAM → TRAIN → TRACK → SURPLUS

**Status**: Done.
