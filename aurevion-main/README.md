# Aurevion

Your personal looksmaxxing tool. AI-native fitness, nutrition, and body intelligence platform.

## What is this

Aurevion is a unified system that connects goal setting, TDEE modeling, macro planning, meal prep, training, and body composition tracking into one app. AI runs through every layer — expenditure prediction, recovery-aware scheduling, adaptive meal planning, and body fat estimation.

## Repo structure

```
landing.html              Landing page
pitch-deck/               Investor pitch deck + app screenshots
pages/                    Interactive demo, component audit, feature specs
src/
  system/                 Design tokens, motion system, base components
  features/               8 feature modules (goal, TDEE, macros, calendar, training, prep, fridge, profile)
    shared.jsx            Component library (Phone, FBtn, FTexBar, FTag, etc.)
    tiles.jsx             Dashboard tile system (9 density-aware tiles)
    demo.jsx              Presentation flow controller
    app-shell.jsx         Interactive prototype shell
assets/                   Screenshots, uploads, audit pages
```

## Run locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`. Key pages:

- `/landing` — Marketing landing page
- `/pages/demo` — Presentation demo (linear flow)
- `/pages/app` — Interactive prototype (working navigation)
- `/pitch-deck` — Investor pitch deck

## Design system

- **Dark-first**: `#000` background, `#FF6E50` accent
- **Typography**: Geist (sans) + Geist Mono
- **Mono-instrumentation aesthetic**: monospace labels, hatching patterns, data as visual language
- **Motion**: purposeful — fast entrance, invisible exit, stagger for hierarchy

## Product modules

| Module | What it does |
|--------|-------------|
| Goal Setting | Measurable target (body fat %), timeline, sustainability feedback |
| TDEE Model | Adaptive energy expenditure with confidence bands |
| Macros | Weekly targets, meal queue, auto-fit deviation tracking |
| Plan Calendar | Month/week/day views coordinating meals, training, cooking |
| Training | 7 modalities, Workout Mode, progressive overload |
| Meal Prep | Batch cooking as Gantt chart, parallel timers, Cook Mode |
| Fridge | Delta-first pantry — what's missing, not what you have |
| Profile | Goal contract dashboard, check-ins, streaks |

## Tech

Static HTML + vanilla JS with React (via CDN) for the component system. Served with `serve`. Deployed on Vercel.
