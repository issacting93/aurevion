# probe-ui

DOM inspect overlay for React. Hover to measure, click to read specs, copy generated CSS.

![probe-ui](https://img.shields.io/npm/v/probe-ui?style=flat-square)

## Install

```bash
npm install probe-ui
```

## Usage

Wrap any subtree with `<Probe>`. Everything inside becomes inspectable.

```jsx
import { Probe } from 'probe-ui'

function App() {
  return (
    <Probe>
      <YourApp />
    </Probe>
  )
}
```

## What it does

- **Hover** any element to see its dimensions and selector
- **Click** to pin an element and open a spec panel with:
  - Layout: size, position, padding, margin, border-radius, display, gap
  - Color: background, text, border
  - Typography: font family, size, weight, line-height
  - Generated CSS: one-click copy to clipboard

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Shift + D` | Toggle probe mode |
| `Esc` | Dismiss pinned panel and exit probe mode |

## Toggle button

A small toggle button renders at the bottom-left corner of the viewport. Click it to activate/deactivate probe mode.

## Design

- Receipt-style monospace spec panel (dark theme, `#0a0a0a` background)
- Minimal hover highlight with corner ticks and dimension readout
- Non-invasive: all probe UI elements are tagged with `data-probe-ui` and excluded from inspection
- Zero dependencies beyond React 18+

## API

### `<Probe>`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | The subtree to make inspectable |

## Peer dependencies

- `react` >= 18
- `react-dom` >= 18

## License

MIT
