# Navigation & Flow Architecture — React Native

Recommended library: `@react-navigation` v7

---

## Navigation Structure

```
RootNavigator (Stack)
├── OnboardingStack (Stack, modal presentation)
│   ├── Welcome
│   ├── Sex
│   ├── Birthday
│   ├── BodyMetrics
│   ├── BodyFat
│   ├── Activity
│   ├── Experience
│   ├── Goal
│   ├── TDEEResult
│   └── Ready
│
└── MainTabs (Bottom Tab Navigator)
    ├── HomeTab
    │   └── HomeStack (Stack)
    │       ├── Dashboard
    │       ├── GoalDetail
    │       ├── TDEEDetail
    │       ├── MacroDetail → MealQueue → ShoppingList
    │       ├── CalendarDetail
    │       ├── SessionDetail → WorkoutMode
    │       ├── PrepDetail → Timeline → CookMode
    │       ├── FridgeDetail
    │       └── CheckInDetail
    │
    ├── TrainTab
    │   └── TrainStack (Stack)
    │       ├── WorkoutList
    │       ├── WorkoutMode (full-screen, hide tab bar)
    │       └── ExerciseLibrary
    │
    ├── EatTab
    │   └── EatStack (Stack)
    │       ├── MacroOverview
    │       ├── MealDetail
    │       └── LogFood (modal bottom sheet)
    │
    ├── PlanTab
    │   └── PlanStack (Stack)
    │       ├── CalendarView (M/W/D toggle)
    │       └── EventDetail
    │
    └── YouTab
        └── YouStack (Stack)
            ├── Profile
            ├── CheckInHistory
            └── Settings
```

---

## Tab Bar Configuration

```javascript
const tabs = [
  { name: 'Home',  icon: 'goal',  label: 'HOME' },
  { name: 'Train', icon: 'dumb',  label: 'TRAIN' },
  { name: 'Eat',   icon: 'bowl',  label: 'EAT' },
  { name: 'Plan',  icon: 'timer', label: 'PLAN' },
  { name: 'You',   icon: 'chart', label: 'YOU' },
];
```

- Tab bar: dark surface (`Color.bg`), 60pt height, accent indicator for active tab
- Typography: `labelSm` (mono, uppercase, 9pt)
- Active color: `Color.accent`, inactive: `Color.mute`
- Icons: 20x20, from `icons.json` domain set

---

## Flow Details

### 1. Onboarding

**Type**: Stack navigator, modal full-screen presentation
**Trigger**: First launch (no user data in storage)
**Back button**: Available on steps 1-9, not on step 0

```javascript
// Navigation options
{
  headerShown: false,
  gestureEnabled: false,  // prevent swipe-back on welcome
  animation: 'slide_from_right',
}
```

**Data flow**: Single `data` state object passed via React Context through all steps. Computed values (`TDEE`, `macros`) derived at step 8-9.

**State checklist**:
- [ ] Loading: skeleton on TDEE computation (step 8)
- [ ] Error: error boundary around computation
- [ ] Validation: disabled Next until required fields filled
- [ ] Persistence: save draft to AsyncStorage on each step
- [ ] Resume: restore draft on re-open if onboarding incomplete

---

### 2. Dashboard → Feature Detail

**Type**: Stack push from HomeTab
**Pattern**: Tile tap → detail screen

Each tile should define its own `onPress` handler that navigates to the corresponding detail screen:

```javascript
<GoalTile
  density="mid"
  onPress={() => navigation.navigate('GoalDetail')}
/>
```

**State checklist per tile**:
- [ ] Loading: skeleton placeholder matching tile layout
- [ ] Error: red border + "Tap to retry"
- [ ] Empty: contextual empty message (see state-specs.md)

---

### 3. Meal Prep (deepest flow)

**Type**: Stack with immersive cook mode
**Screens**: PrepDetail → Timeline → CookMode

```javascript
// CookMode should hide tab bar and status bar
{
  tabBarStyle: { display: 'none' },
  statusBarHidden: true,
  gestureEnabled: false,  // prevent accidental back during cooking
}
```

**Timer implementation**:
- Use `setInterval` for countdown display
- Use `BackgroundTimer` (react-native-background-timer) for cooking timers that survive app backgrounding
- Trigger local notification via `notifee` when timer completes
- Persist timer state to AsyncStorage for crash recovery

**State checklist**:
- [ ] Loading: skeleton for recipe data
- [ ] Error: recovery for lost timer state
- [ ] Completion: celebration animation + "Prep complete!" summary
- [ ] Background: timers continue in background, notification on done

---

### 4. Workout Mode (immersive)

**Type**: Full-screen stack screen, hide tab bar
**Pattern**: Exercise list → active set → rest timer → next set → complete

```javascript
// Keep screen awake during workout
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

useEffect(() => {
  activateKeepAwake();
  return () => deactivateKeepAwake();
}, []);
```

**State checklist**:
- [ ] Loading: skeleton for session data
- [ ] Error: auto-save every set, recovery on crash
- [ ] Rest timer: haptic feedback on completion
- [ ] Completion: summary screen with stats (volume, duration, PRs)
- [ ] Background: pause timer if app backgrounded

---

### 5. Log Food (bottom sheet)

**Type**: Bottom sheet modal (react-native-bottom-sheet or @gorhom/bottom-sheet)
**Trigger**: "Log food" button on Eat tab

```javascript
// Sheet configuration
{
  snapPoints: ['70%'],
  backdropComponent: BottomSheetBackdrop,
  enablePanDownToClose: true,
}
```

**Quick actions**: Search, Scan barcode, Photo, Voice
**Content**: Recent foods list, search results

**State checklist**:
- [ ] Loading: search results loading skeleton
- [ ] Error: "Couldn't search foods" with retry
- [ ] Empty: "No results for [query]"
- [ ] Success: toast "Logged [food name]" on save

---

### 6. Calendar

**Type**: Single screen with segment control (Month/Week/Day)
**Animation**: Cross-fade between view modes (200ms)

**State checklist**:
- [ ] Loading: skeleton grid for month view
- [ ] Empty: "Nothing planned" per day/week
- [ ] Offline: cached calendar data with stale indicator

---

## Bottom Sheet Pattern

Used for: Log food, check-in, quick actions, confirmations

```javascript
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const snapPoints = useMemo(() => ['50%', '70%'], []);

<BottomSheet
  snapPoints={snapPoints}
  backgroundStyle={{ backgroundColor: Color.surface }}
  handleIndicatorStyle={{ backgroundColor: Color.mute, width: 40 }}
>
  <BottomSheetView>{content}</BottomSheetView>
</BottomSheet>
```

---

## Deep Linking (future)

URL scheme: `aurevion://`

| Route | Screen |
|-------|--------|
| `aurevion://onboarding` | Onboarding flow |
| `aurevion://dashboard` | Home tab |
| `aurevion://train/workout/:id` | Active workout |
| `aurevion://eat/log` | Log food sheet |
| `aurevion://plan/day/:date` | Calendar day view |
| `aurevion://profile/checkin` | New check-in |
