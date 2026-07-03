# Component Specifications — React Native

Source of truth: `src/system/components.jsx`
Token reference: `tokens.json` in this directory

---

## Button

Interactive action trigger.

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'secondary'` | Visual style |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Touch target size |
| disabled | `boolean` | `false` | Prevents interaction |
| loading | `boolean` | `false` | Shows spinner, prevents interaction |
| fullWidth | `boolean` | `false` | Stretches to container width |
| icon | `ReactNode` | — | Leading icon |
| iconTrailing | `ReactNode` | — | Trailing icon |
| onPress | `() => void` | — | Press handler |

**Sizes**:
| Size | Height | Padding H | Font size | Font |
|------|--------|-----------|-----------|------|
| sm | 32 | 14 | 12 | mono, uppercase, 600 |
| md | 44 | 20 | 13 | mono, uppercase, 600 |
| lg | 52 | 28 | 14 | mono, uppercase, 600 |

**Variants**:
| Variant | Background | Text | Border |
|---------|------------|------|--------|
| primary | `accent` | `#1a0f0a` | none |
| secondary | transparent | `text` | `border` |
| ghost | transparent | `dim` | none |
| danger | `redDim` | `red` | none |

**States**:
| State | Change |
|-------|--------|
| default | as above |
| pressed | scale(0.97) spring, background opacity +0.1 |
| disabled | opacity 0.4, no press response |
| loading | spinner replaces content, no press response |

**RN notes**:
- Use `Pressable` with `onPressIn`/`onPressOut` for press feedback
- Scale animation via `Animated.spring` (see motion.md)
- Loading spinner: `Animated.loop` rotation on accent-colored `ActivityIndicator`
- Font: `fontFamily: 'GeistMono'` (no CSS stack needed)
- `borderRadius: radius.full` for pill shape

---

## Card

Surface container for content grouping.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| variant | `'surface' \| 'elevated' \| 'outlined' \| 'ghost'` | `'surface'` |
| padding | `number` | `Space[4]` (16) |
| radius | `number` | `Radius.lg` (12) |
| selected | `boolean` | `false` |
| disabled | `boolean` | `false` |
| onPress | `() => void` | — |

**Variants**:
| Variant | Background | Border | Shadow |
|---------|------------|--------|--------|
| surface | `surface` | `border` | none |
| elevated | `surface2` | `border` | `shadow.md` |
| outlined | transparent | `border` | none |
| ghost | transparent | none | none |

**RN notes**:
- Selected state: border changes to `accent`, add `shadow.glow`
- On Android, use `elevation` prop instead of shadow objects
- Use `Pressable` wrapper when `onPress` is provided

---

## Row

Interactive list item with optional checkbox.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| leading | `ReactNode` | — |
| title | `string` | — |
| subtitle | `string` | — |
| trailing | `ReactNode` | — |
| checked | `boolean` | — |
| onToggle | `() => void` | — |
| disabled | `boolean` | `false` |
| compact | `boolean` | `false` |
| divider | `boolean` | `true` |

**Layout**: `[checkbox?] [leading] [title + subtitle] [trailing]`
- Height: 56 (default) / 44 (compact)
- Padding: `Space[4]` horizontal
- Gap: `Space[3]` between elements

**RN notes**:
- Use `Pressable` with full-width hit area
- Checkbox: custom 20x20 circle, animated check mark (spring 200ms)
- Divider: 1px `border` color, inset by leading width

---

## ProgressBar

Linear progress indicator.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| value | `number` | 0 |
| max | `number` | 100 |
| variant | `'standard' \| 'textured' \| 'segmented'` | `'standard'` |
| color | `string` | `accent` |
| height | `number` | 6 |
| segments | `number` | — |
| animated | `boolean` | `true` |

**Textured variant**: Diagonal hatching pattern (45deg stripes). In RN, use a `LinearGradient` overlay or SVG pattern.

**Segmented variant**: Discrete segments (lit/unlit). Render as row of rounded rects with 2px gap.

**RN notes**:
- Standard: simple `View` with width animation (`Animated.timing`)
- Track: `surface2`, corner radius: `height / 2`
- Animate width on value change: 300ms, `easing.out`
- For textured variant, consider `react-native-svg` pattern fill

---

## ProgressRing

Circular SVG progress indicator.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| value | `number` | 0 |
| max | `number` | 100 |
| size | `number` | 64 |
| strokeWidth | `number` | 4 |
| color | `string` | `accent` |
| trackColor | `string` | `surface2` |
| animated | `boolean` | `true` |

**RN notes**:
- Use `react-native-svg` `Circle` with `strokeDasharray` / `strokeDashoffset`
- Animate `strokeDashoffset` with `Animated` (needs `setNativeProps` or Reanimated)
- Rotation: -90deg to start from top

---

## MetricDisplay

Large numeral with contextual label.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| value | `string \| number` | — |
| unit | `string` | — |
| label | `string` | — |
| sublabel | `string` | — |
| size | `'lg' \| 'md' \| 'sm'` | `'md'` |
| tone | `'default' \| 'accent' \| 'green' \| 'red' \| 'mute'` | `'default'` |

**Sizes**:
| Size | Value font | Unit font | Label font |
|------|-----------|-----------|------------|
| lg | displayLg (56) | headingSm (15) | labelMd |
| md | displayMd (40) | bodyMd (13) | labelMd |
| sm | displaySm (28) | bodySm (12) | labelSm |

---

## Tag

Small status indicator chip.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| tone | `'neutral' \| 'accent' \| 'green' \| 'red' \| 'blue'` | `'neutral'` |
| icon | `ReactNode` | — |
| children | `string` | — |

**Style**: Pill shape, mono uppercase 10px, 600 weight, `Space[1]` vertical / `Space[2]` horizontal padding.

**Tones**:
| Tone | Background | Text |
|------|-----------|------|
| neutral | `rgba(255,255,255,0.06)` | `text` |
| accent | `accent` | `#1a0f0a` |
| green | `greenDim` | `green` |
| red | `redDim` | `red` |
| blue | `blueDim` | `blue` |

---

## EmptyState

Placeholder for screens/sections with no content.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| icon | `ReactNode` | — |
| title | `string` | — |
| description | `string` | — |
| action | `ReactNode` | — |

**Layout**: Centered column, `Space[6]` gap between elements.
- Icon: 48x48, `mute` color
- Title: `headingMd`, `text` color
- Description: `bodyMd`, `dim` color
- Action: typically a `Button` variant="secondary"

---

## Skeleton

Loading placeholder with pulse animation.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| width | `number \| string` | `'100%'` |
| height | `number` | 16 |
| circle | `boolean` | `false` |
| radius | `number` | `Radius.sm` (4) |

**Style**: Background `surface2`, opacity pulses 1 → 0.5 → 1 over 1.6s loop.

**RN notes**: Use `Animated.loop` with `Animated.sequence` for pulse (see motion.md skeleton example).

---

## FilterGroup

Mutually exclusive toggle button row.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| options | `Array<{ value: string, label: string }>` | — |
| value | `string` | — |
| onChange | `(value: string) => void` | — |
| size | `'sm' \| 'md'` | `'md'` |

**Layout**: Horizontal `ScrollView` with `Space[2]` gap.
- Active: `accent` background, dark text
- Inactive: transparent, `dim` text, `border` border
- Transition: 150ms background color change

---

## Avatar

Circular identity indicator.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| initials | `string` | — |
| image | `string` (URI) | — |
| tone | `'neutral' \| 'warm' \| 'cool'` | `'neutral'` |
| size | `28 \| 40 \| 56` | `40` |

**RN notes**: Use `Image` with `borderRadius: size / 2` for photo avatars.

---

## ExpandablePanel

Collapsible content with animated chevron.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| title | `string` | — |
| defaultOpen | `boolean` | `false` |
| variant | `'surface' \| 'elevated' \| 'outlined' \| 'ghost'` | `'surface'` |

**Animation**:
- Chevron rotates 180deg (spring, 200ms)
- Content height animates from 0 to measured height
- Use `LayoutAnimation` or Reanimated `useAnimatedStyle` with height interpolation

---

## StepIndicator

Vertical step sequence for multi-step flows.

**Props**:
| Prop | Type | Default |
|------|------|---------|
| steps | `Array<{ label: string, status: 'done' \| 'active' \| 'upcoming' \| 'skipped' }>` | — |

**Visual**:
- Done: `green` circle with check icon, `dim` label
- Active: `accent` circle with number, `text` label (bold)
- Upcoming: `surface2` circle with number, `mute` label
- Skipped: `surface2` circle with dash, `mute` label (strikethrough)
- Connector line between steps: 2px, `border` color
