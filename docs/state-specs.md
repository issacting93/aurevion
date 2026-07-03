# State Specifications

Every screen needs to handle more than just the "happy path." This document specifies missing states across all flows and recommends patterns.

---

## Available Patterns

The UI layer provides these components for state handling:

- **`FTexBar`** — Progress bar with animated fill, usable as skeleton placeholder
- **`FSurface`** with `tone="red"` — Error/alert container
- **`FTag`** with `tone="red"` — Inline error indicator
- **`FLabel`** + centered content — Empty state pattern
- **`FIcon`** with muted color — Empty state icon

No dedicated `Skeleton` or `EmptyState` components exist yet. Empty states are built inline with `FIcon` + `FLabel` + description text (see `ProgramOverviewContent` for reference pattern).

---

## State Categories

### 1. Loading / Skeleton

**When**: Data is being fetched, computed, or synced.

**Pattern**: Replace content areas with pulsing placeholder blocks. Use `background: Color.surface2` with `animation: pulse 1.6s infinite` (opacity 0.3 → 0.7 → 0.3).

| Screen | What to Skeleton |
|--------|-----------------|
| Dashboard tiles | Number + label + bar per tile |
| TDEE graph | Full chart area as rect |
| Macro targets | P/C/F bars as 3 horizontal blocks |
| Calendar grid | 7-day row as circle placeholders |
| Program overview | 7 session cards as rect blocks |
| Training session | Exercise list as 4-5 row blocks |
| Meal prep merge | Ingredient list as text line blocks |
| Fridge inventory | Category groups as row blocks |
| Goal network | Node circles at positions without labels |

**Status**: None implemented. All screens render immediately from localStorage (no async fetch).

---

### 2. Error

**When**: Computation failure, data corruption, missing dependencies.

**Pattern**: Use `FSurface` with `tone="red"` and `icon={ICONS.close}`. Include descriptive message and "Try again" `FBtn`.

| Screen | Error Scenario | Message |
|--------|---------------|---------|
| Dashboard | Failed to load user data | "Couldn't load your data. Try refreshing." |
| TDEE | Calculation failure (bad input) | "We need valid body metrics to estimate TDEE." |
| Program overview | No goals selected | "Select fitness goals in onboarding to generate a program." |
| Training session | Session data missing | "Session data couldn't be loaded." |
| Meal prep | Recipe data missing | "Recipe data unavailable." |
| Check-in | No previous check-in for comparison | Handled gracefully (shows "First check-in" instead of delta) |

**Status**: Only check-in handles this gracefully. Others would crash or show empty content on bad data.

---

### 3. Empty

**When**: First use, no data yet, or no items match filter.

**Pattern**: Centered layout with `FIcon` (muted) + heading + description + optional CTA. See `ProgramOverviewContent` empty state as reference.

| Screen | Empty Scenario | Title | CTA |
|--------|---------------|-------|-----|
| Dashboard (new user) | Not onboarded | "Welcome to AUREVI0N" | "Start onboarding" |
| Program overview | No workout plan | "No program yet" | "Complete onboarding to generate..." |
| TDEE (< 3 days) | Insufficient data | "Keep logging" | — |
| Macros (no plan) | No meals planned | "No meals planned this week" | "Create meal plan" |
| Fridge (no items) | Empty pantry | "Your fridge is empty" | "Add items" |
| Fridge (filter miss) | Filter returns nothing | "Nothing expiring soon" | "View all items" |
| Calendar (no events) | No events | "Nothing planned" | "Add event" |
| Training (no sessions) | Empty activity log | "Ready to train?" | "Start a session" |
| Check-in (no history) | No check-ins | "Log your first check-in" | "Check in now" |
| Food log (no entries) | Nothing logged today | "No meals logged today" | "Log a meal" |
| Macro heatmap (new) | < 1 week of data | "Start logging to build your heatmap" | — |

**Status**: Program overview has an empty state. Dashboard shows mock data as fallback. Others show hardcoded content regardless.

---

### 4. Validation Feedback

**When**: User input is invalid, out of range, or conflicts.

**Pattern**: Inline `FTag` with `tone="red"` for errors, `tone="accent"` for warnings. Never block with a modal.

| Screen | Validation | Current Status |
|--------|-----------|---------------|
| Goal setting — pace | > 1% BF/week → red pace indicator | Built (pace tone changes to red) |
| Goal setting — timeline | < 8 weeks for major change → warning | Built (accent indicator) |
| Onboarding — body metrics | Out of range height/weight | Not built (accepts any number) |
| Onboarding — goals | No goals selected | Built (Next disabled until selected) |
| Training — RPE input | RPE not selected before logging | Not built (defaults to 7 if not selected) |
| Meal prep — oven conflict | Temperature overlap | Built (red alert card, but not interactive) |

---

### 5. Success / Completion

**When**: User completes a meaningful action.

**Pattern**: 
- **Inline update**: Value changes with accent highlight. For lightweight actions.
- **Hero celebration**: Green checkmark circle + stats. For milestone completions.
- **Toast**: Small bar at bottom, auto-dismiss 3s. Not yet implemented.

| Screen | Action | Feedback | Status |
|--------|--------|----------|--------|
| Onboarding — complete | "Enter AUREVI0N" | Transition to dashboard with generated program | Built |
| Goal contract — signed | Goal activated | Button changes to "Signed" state | Partially (no celebration) |
| Training — set logged | Set completed | Set card fills with checkmark, counter updates | Built |
| Training — session done | All exercises complete | Hero celebration (green check + stats summary) | Built |
| Cook mode — all steps | Cooking complete | Timer shows "DONE" in green | Built |
| Check-in — logged | Body data recorded | Summary card with decision result | Built |
| Food log — entry saved | Intake logged | Not implemented |
| Shopping — all checked | Shopping complete | Not implemented |

---

### 6. Offline / Persistence

**When**: App is closed, backgrounded, or loses connectivity.

**Current status**: All state persists via localStorage (survives page refresh). Active session state (timers, set progress) does NOT persist — it's local `useState` and is lost on navigation or app close.

**What's needed**:
- **Session persistence**: Save active workout/cook state to localStorage so it survives interruptions
- **Abandon recovery**: On next app open, detect incomplete session and offer "Resume" or "Discard"
- **Offline banner**: Show connectivity status (not critical for prototype, critical for RN)

---

## Priority Matrix

| State | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Empty states for new users | High — first impression | Low | P1 |
| Session persistence | High — lost workout data | Medium | P1 |
| Validation on onboarding inputs | Medium — bad data → bad targets | Low | P2 |
| Loading skeletons | Low — data is local/instant | Medium | P3 |
| Error boundaries | Medium — crash recovery | Low | P2 |
| Offline banner | Low — prototype only | Low | P3 |
| Toast notifications | Medium — feedback quality | Medium | P2 |
