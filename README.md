# Aurevion

Your personal looksmaxxing tool. AI-native fitness, nutrition, and body intelligence platform.

## What is this

Aurevion is a unified system that connects goal setting, TDEE modeling, macro planning, meal prep, training, and body composition tracking into one app. AI runs through every layer — expenditure prediction, recovery-aware scheduling, adaptive meal planning, and body fat estimation.

## Repo structure

```
landing.html              Marketing landing page
pitch-deck/               Investor pitch deck + app screenshots
src/
  app/                    App router, Shell layout, and core screens
    Shell.jsx             Tab navigation router and details modal overlay manager
    screens/              30+ React components representing app views (Today, Stats, Macros, etc.)
  ui/
    components.jsx        Shared component library (Phone, FBtn, FNum, FIcon, FWeightInput, etc.)
  pages/                  Interactive demo flows and playgrounds
    AppFlow.jsx           Flow selection control panel
  tools/                  Showcases, journey mapping files, and handover manifests
  context/                Mock user context providers and data definitions
  index.css               Global CSS style definitions & color tokens
```

## Run locally

```bash
npm install
npm run dev
```

Key pages:

- `/` — Interactive dashboard and landing explorer
- `/app` — Full interactive prototype of the AUREVI0N mobile app
- `/demo` — Dev handover and showcase dashboard
- `/landing` — Marketing landing page
- `/journey` — Interactive visual roadmap and flow catalog

## Design system

- **Dark-first**: `#0c0d10` background, `#FF6E50` accent
- **Typography**: Geist (sans) + Geist Mono
- **Mono-instrumentation aesthetic**: monospace labels, hatching patterns, data as visual language
- **Motion**: purposeful — fast entrance, invisible exit, stagger for hierarchy

## Product modules

| Module | What it does |
|--------|-------------|
| Today (Home) | Interactive landing with workout streaks, scheduled sessions, dynamic missed-session recovery nudges, and quick actions. |
| Progress (Dashboard) | Weekly overview monitoring body composition, workout volume progress, and detailed macronutrient split adherence. |
| Check-in Flow | Simplified 2-step tracking wizard (Weight and Body Fat percentages) leveraging unified input fields. |
| Calendar (Plan) | Coordinates month, week, and day schedules mapping training sessions and meal times. |
| Nutrition (Eat) | Advanced hub displaying meal plans, fridge inventory status, pending batch/meal preps, and shopping lists. |
| Body intelligence | Path-based muscle heatmap (`BodyMap` v2) indicating training intensity on anatomical diagrams. |
| TDEE & Energy Model | Adaptive energy expenditure prediction charts and confidence intervals. |
| Training | Real-time workout tracking, progressive overload guidance, and active-set logs. |

## Tech

- **Framework**: Vite + React 18
- **Routing**: React Router DOM (v7)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Testing**: Playwright for end-to-end integration flows and screen captures
- **Styling**: Tailored dark-mode CSS theme tokens with high-contrast accents

