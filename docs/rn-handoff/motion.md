# Motion System — React Native Translation

Source: `src/system/motion.jsx` and `src/system/tokens.jsx`

---

## Principles (unchanged from web)

1. **Purposeful** — motion communicates state change, not decoration
2. **Fast entrance, invisible exit** — enter: 250-350ms, exit: 150-180ms
3. **Stagger for hierarchy** — 30-50ms offset per item, max 8 items
4. **Spatial continuity** — elements enter from logical origin direction
5. **Spring for interaction, ease-out for layout**
6. **Respect motion preferences** — honor device-level reduced motion

---

## Timing Hierarchy

| Category | Duration (ms) | Use case | RN API |
|----------|--------------|----------|--------|
| Micro | 80-120 | Press feedback, toggle | `Animated.timing({ duration: 100 })` |
| State change | 150-200 | Tab switch, filter toggle | `Animated.timing({ duration: 175 })` |
| Entrance | 250-350 | Section appear, card reveal | `Animated.timing({ duration: 300 })` |
| Morph | 350-450 | Layout transform, card expand | `Animated.spring()` or `timing({ duration: 400 })` |
| Page transition | 280-380 | Screen push/pop | `@react-navigation` `transitionSpec` |
| Stagger offset | 40 | Per-item delay in lists | `Animated.stagger(40, [...])` |

---

## Easing Curves

All values are `[x1, y1, x2, y2]` for `Easing.bezier()`:

```javascript
import { Easing } from 'react-native';

const AurevionEasing = {
  default: Easing.bezier(0.4, 0, 0.2, 1),     // standard
  out:     Easing.bezier(0, 0, 0.2, 1),        // decelerate (enter)
  spring:  Easing.bezier(0.34, 1.56, 0.64, 1), // overshoot
  enter:   Easing.bezier(0.0, 0.0, 0.2, 1),    // page enter
  exit:    Easing.bezier(0.4, 0.0, 1, 1),       // page exit
  bounce:  Easing.bezier(0.34, 1.3, 0.64, 1),  // subtle overshoot
};
```

For physical spring interactions (buttons, toggles), prefer `Animated.spring()`:

```javascript
Animated.spring(value, {
  toValue: 1,
  tension: 180,    // stiffness
  friction: 12,    // damping
  useNativeDriver: true,
});
```

---

## Common Patterns

### Press feedback (buttons, cards)

```javascript
const scale = useRef(new Animated.Value(1)).current;

const onPressIn = () => {
  Animated.spring(scale, {
    toValue: 0.97,
    tension: 200,
    friction: 10,
    useNativeDriver: true,
  }).start();
};

const onPressOut = () => {
  Animated.spring(scale, {
    toValue: 1,
    tension: 200,
    friction: 10,
    useNativeDriver: true,
  }).start();
};
```

### Staggered list entrance

```javascript
const animations = items.map((_, i) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(8);
  return { opacity, translateY };
});

Animated.stagger(40,
  animations.map(({ opacity, translateY }) =>
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: AurevionEasing.out,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: AurevionEasing.out,
        useNativeDriver: true,
      }),
    ])
  )
).start();
```

### Page transitions (@react-navigation)

```javascript
const screenOptions = {
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 340, easing: AurevionEasing.enter },
    },
    close: {
      animation: 'timing',
      config: { duration: 280, easing: AurevionEasing.exit },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      opacity: current.progress,
      transform: [{
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),
      }],
    },
  }),
};
```

### Loading pulse (skeleton)

```javascript
const pulse = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 0.5,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
```

---

## Reduced Motion

```javascript
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  const sub = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    setReduceMotion
  );
  return () => sub.remove();
}, []);

// When reduceMotion is true:
// - Set all durations to 0
// - Skip transform animations
// - Keep opacity transitions (instant)
```

---

## Reanimated Alternative

For complex, gesture-driven animations (workout mode, meal prep timeline), consider `react-native-reanimated` v3:

```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

// Spring press
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const onPressIn = () => { scale.value = withSpring(0.97); };
const onPressOut = () => { scale.value = withSpring(1); };

// Staggered entrance
items.forEach((_, i) => {
  opacity[i].value = withDelay(i * 40, withTiming(1, { duration: 300 }));
  translateY[i].value = withDelay(i * 40, withTiming(0, { duration: 300 }));
});
```

Reanimated runs on the UI thread, avoiding JS bridge overhead. Recommended for:
- Gesture-driven animations (swipe to dismiss, drag to reorder)
- Continuous animations (progress rings, timers)
- Complex choreography (cook mode transitions)
