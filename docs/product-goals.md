# AUREVI0N — Product Goals & Vision

## What AUREVI0N Is

A fitness and nutrition app that treats training and cooking as two sides of the same system. Your goals determine what you train *and* what you cook. The app generates personalized programs for both modes, tracks execution, observes results, and adjusts.

Most fitness apps handle training OR nutrition. AUREVI0N connects them: a hypertrophy goal generates a lifting program *and* drives a caloric surplus meal plan. A fat loss goal generates HIIT + strength sessions *and* a lean prep strategy with deficit-appropriate macros.

## Core Thesis

**Your goals → your workouts → your caloric state → your meals → your check-in → your adjusted goals.**

This is the SDPAO loop:
1. **Seed**: Onboarding captures body profile, goals, constraints
2. **Decide**: Dashboard presents personalized tiles and interventions
3. **Plan**: Program generation + meal planning
4. **Act**: Focused workout mode + focused cook mode
5. **Observe**: Check-ins, food logs, behavioral metrics feed back to adjust

## What Makes It Different

### 1. The Bridge Between Fitness and Nutrition
The Goal Network (`/journey/goals`) visualizes this: 32 nodes across 5 categories (fitness goals, nutrition goals, training modalities, meal prep approaches, caloric states) connected by 65 edges. Selecting "recomposition" doesn't just assign workouts — it sets a -150 kcal caloric state, which drives a lean prep + post-recovery meal strategy.

### 2. Constraint-Aware Generation
Programs aren't templates — they're generated from the user's actual constraints:
- Equipment: full gym vs bodyweight only → completely different exercise selection
- Injuries: knees excluded → no squats, auto-substituted with leg press/bridges
- Available days: 3 days → full body split, 5 days → PPL
- Dietary restrictions: vegetarian + nut allergy → filtered meal options

### 3. Focused Execution Modes
Two immersive modes that mirror each other:
- **Fitness Mode**: Program overview → exercise review → set-by-set logging with RPE and rest timers → auto-computed summary
- **Cook Mode**: Ingredient merge → parallel Gantt timeline → step-by-step cook mode with multiple concurrent timers → cook summary

Both share navigation primitives (step nav, pause/resume, skip, progress bars).

### 4. Closed-Loop Feedback
Weekly check-ins (weight, body fat, subjective rating) feed into a decision engine:
- Weight loss too aggressive → intervention: reduce deficit
- Protein consistently under target → intervention: adjust meal plan
- Adherence dropping → intervention: simplify program

## Current State (July 2026)

### What Works End-to-End
- 12-step onboarding → computed TDEE and macros
- Auto-generated training programs from goals + constraints
- Active workout sessions with set logging, RPE, rest timers, summary
- Active cook mode with multi-timer Gantt timeline
- Weekly check-in with decision logic and interventions
- Personalized dashboard with 3 density presets
- 3D body composition viewer
- Goal network interactive graph

### What's Designed But Not Connected
- Calendar events are hardcoded (not from workout plan)
- Meal prep recipes are hardcoded (not from macro targets)
- Fridge inventory doesn't sync with shopping list
- Food log doesn't feed back into macro adherence

### What's Missing
- Backend / persistence (everything is localStorage)
- Authentication and multi-device sync
- Push notifications / behavioral nudges
- Periodization and auto-progression for training
- Wearable integration (Apple Health, Garmin, etc.)
- Recipe database and meal generation
- Social / community features

## Target Users

### Primary: "Fit-curious" 20-35 year olds
People who want to get serious about fitness but are overwhelmed by the gap between "I want to look better" and "what do I actually do today?" They don't want a bodybuilding app or a calorie counter — they want one system that tells them what to train and what to eat, adapted to their life.

### Secondary: Intermediate lifters who cook
People who already train consistently but eat randomly. They know the gym side but want their nutrition dialed in — batch prep, macro tracking, meal timing around workouts. The bridge between fitness and cooking modes is the value prop.

## Design Principles

1. **Dark-first, technical aesthetic**: Black background, monospace labels, accent highlights. Feels like a precision instrument, not a consumer health app.

2. **Data-dense, not data-heavy**: Show numbers with context (trend arrows, confidence bands, pace indicators). Every metric answers "so what?"

3. **Focused modes over feature menus**: When you're cooking, the app becomes a kitchen timer. When you're lifting, it becomes a set tracker. No distracting navigation.

4. **Generate, don't configure**: The app should make decisions for the user based on their goals, not present 50 options. Configuration is for constraints (what you can't do), not preferences (what you feel like doing).

5. **Motion with purpose**: Spring physics for interactive elements, stagger for hierarchy, hatching for uncertainty. Every animation communicates state change, not decoration.

## Metrics That Matter

For a production app, the north stars would be:
- **Program adherence**: % of scheduled sessions completed per week
- **Macro hit rate**: % of days where protein target is met within 10%
- **Check-in consistency**: weekly weigh-in streak length
- **Cook mode usage**: home-cooked meals per week (target: 5+)
- **Retention**: 8-week program completion rate

## Near-Term Roadmap

1. **Decision engine specification**: Define the threshold logic for interventions
2. **Cooking pipeline**: Connect meal plan → shopping → fridge → cook → log
3. **Periodization**: Week-to-week progression in training programs
4. **Backend + auth**: Move off localStorage for the React Native port
5. **Recipe generation**: Build a recipe database that responds to macro targets
