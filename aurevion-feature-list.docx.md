**Aurevion**

# **1\. Executive Feature Map**

Aurevion is positioned as an AI-native fitness, nutrition, planning, progress, and lifestyle platform. The core product loop is not just logging. It is: capture behavior, predict the user state, guide the next action, and learn from outcomes.

| Core product thesis Aurevion should compete by using AI and ML as the product edge: expenditure prediction, body composition estimation, adaptive meal planning, recovery-aware workout planning, and guided execution modes for workouts and cooking. |
| :---- |

| Product Area | Core Purpose | Major Feature Clusters |
| :---- | :---- | :---- |
| Fitness and Training | Help users train, track, progress, and recover across multiple workout styles. | Wearables, activity tracking, workout tracking, exercise library, Workout Mode, strength profile, muscle recovery, body/muscle visualization. |
| Nutrition and Meals | Help users understand intake, log food, plan meals, cook, and shop. | Daily nutrition dashboard, food logging, saved meals, Meal Planning Mode, Cook Mode, recipe library, grocery list, ingredient cart. |
| Planning and Personalization | Help users plan around real life with AI support and user control. | Meals per day, cooking days, workout split, ingredient swaps, AI suggestions, protocol and skincare routines. |
| Progress and Metrics | Show body, strength, recovery, adherence, and energy trends over time. | Body fat estimates, expenditure predictions, body scans, recovery, muscle-group volume, strength trend, energy balance. |
| Professional and Gym Ecosystem | Connect users with trainers, nutritionists, and eventually gym software from inside the consumer app. | Trainer connections, nutritionist connections, gym integration, oversight workflows. |
| Community | Create motivation through social accountability and friendly competition. | Compete with friends, challenges, leaderboards, accountability groups, shared milestones. |

# **2\. Product Positioning and MVP Edge**

The updated decision is that AI and ML are not optional advanced features. They are the product edge. The MVP should still be focused, but it should not feel like a generic tracker with AI added later.

| MVP Edge | What It Means | Product Expression |
| :---- | :---- | :---- |
| Wearable-first signal capture | Wearable integration is a must-have for the MVP. | Use activity, heart rate, steps, sleep, and recovery-adjacent signals where available. |
| Expenditure prediction | The app should estimate energy expenditure using user data and adapt like MacroFactor-style systems. | Show expenditure trend, confidence, and changes over time instead of only static calorie targets. |
| Body composition intelligence | Body fat percentage should be treated as a serious metric, not a novelty. | Combine user scans, body-fat scale inputs, weight trend, and logged behavior where possible. |
| AI meal planning | AI can generate plans, suggest approved recipes, and rank/filter meals the user already likes. | Keep user control high while allowing the system to propose complete plans. |
| Guided execution modes | Workout Mode and Cook Mode should turn plans into active experiences. | Workout tracking, rest timers, current exercise focus, combined multi-recipe meal prep, cooking timers, resume states. |
| Adaptive progress feedback | Progress should synthesize adherence, recovery, strength, body composition, and energy balance. | Show what changed, why it matters, and what the user should do next. |

# **3\. Fitness and Training**

Fitness should support both structured training and broader movement. Launch support should cover the main modalities users are likely to track, with a data model flexible enough to expand later.

## **Core Tracking and Wearables**

* Activity tracking.  
* MVP wearable device integration.  
* Progress tracking tied to training, recovery, and energy expenditure.  
* Track weight used for lifting.  
* Strength profile across 12 muscle groups.  
* Suggested increases based on the user’s training strategy and recent performance.

## **Body and Muscle Visualization**

* Body scanning should support visual progress, body fat estimation, and muscle targeting.  
* 3D personalization is a later-stage expansion, not the first required use case.  
* Clickable muscles can lead users to relevant workouts.  
* Muscle recovery status should help users understand readiness.  
* Muscle advancement or development should be shown over time.

## **Workout Tracking**

* Reps, sets, weight, and rest timers.  
* Exercise library with muscle group, equipment, modality, difficulty, and progression tags.  
* Workout Mode for live sessions with current exercise, next exercise, sets, rest, and progress.

## **Workout Strategy**

* Progressive overload.  
* Periodization.  
* Autoregulation.  
* Deloading.  
* Specificity.  
* Mind-muscle connection.

| Workout Family | Launch Support | Product Meaning |
| :---- | :---- | :---- |
| Lifting | Full support | Sets, reps, load, rest, progression, muscle-group volume, strength trend. |
| Calisthenics | Full support | Bodyweight progression, reps, holds, skill difficulty, explosive variations. |
| Cardio | Full support | Duration, distance, pace, heart-rate zones, energy expenditure contribution. |
| HIIT and Circuits | Full support | Intervals, rounds, rest windows, mixed movement blocks, circuit completion. |
| Mobility and Yoga | Full support | Mobility sessions, flows, duration, recovery contribution, flexibility work. |
| Combat Sports | Full support | Rounds, conditioning, skill sessions, sparring/drill tagging, intensity. |
| Plyometrics | Full support | Explosive work, jumps, contacts, power/speed emphasis, recovery sensitivity. |
| Later expansion | Secondary support later | Unconventional training, Pilates, Tai Chi, sandbags, tires, neuromotor/agility details. |

# **4\. Nutrition and Meal Systems**

Nutrition should combine tracking, planning, cooking, and shopping. The strongest version does not stop at food logs; it helps users decide what to eat, prepare it efficiently, and connect the plan to training and progress.

## **Daily Nutrition Dashboard**

* Calories.  
* Protein.  
* Carbs.  
* Fat.  
* Water.  
* Micronutrients.  
* Today’s meals split into planned and eaten meals.

## **Quick Food Logging**

* Search food.  
* Scan barcode.  
* Take photo of food.  
* Voice logging as an optional input.  
* Quick-add calories and protein.  
* Quick-add previous meals.

## **Saved Meals**

* Favorites.  
* Recent meals.  
* Custom meals and snacks.

## **Meal Planning Mode**

* Weekly meal plan.  
* Meals per day selected by the user.  
* Move meals around the day or week.  
* Plan meals around workouts.  
* AI meal suggestions that can generate plans, suggest approved recipes, and rank/filter meals the user already likes.

## **Cook Mode**

* Step-by-step recipe view.  
* Combined meal-prep steps across multiple recipes should be included in the strong first version.  
* Ingredients needed.  
* Quick ingredient swaps.  
* Resume cooking later.  
* Cooking timers.

## **Recipe Library, Grocery, and Cart**

* Recipe library.  
* Grocery list.  
* Buy ingredients for weekly meals.  
* Support a cart for buying ingredients and related products.

| Diet Category | Diet Types | Implementation Notes |
| :---- | :---- | :---- |
| Plant-forward | Vegan, vegetarian, flexitarian, pescatarian | Use as user preference filters, recipe constraints, and meal-plan generation inputs. |
| Macro and lifestyle patterns | Low carb, paleo, Atkins, Mediterranean, DASH, intermittent fasting, gluten-free, low sodium | Can influence meal suggestions, macro targets, food exclusions, and dashboard hero states. |
| Medical-adjacent later | Diabetic | Not MVP. Potentially supported later after review, with careful language and safety boundaries. |

# **5\. Planning and Personalization**

Planning is the connective tissue between fitness, meals, cooking, protocols, and progress. The user should remain in control, while the system recommends and adapts.

## **Meal Planning Controls**

* Users select how many meals they want per day.  
* Users select which days include eating sessions or batched meals.  
* Users can set cooking days.  
* Users can move meals around the week.  
* Users can plan meals around workout timing.

## **Ingredient Flexibility**

* Users can swap ingredients when an ingredient is undesired.  
* Users can swap ingredients when something is missing.  
* Ingredient swaps should work during both planning and Cook Mode.

## **Workout Planning**

* Users can set their workout split.  
* The planning engine should consider workout days, workout timing, cooking days, recovery, and adherence.

## **Protocols and Skincare**

* Protocols and skincare are part of the Aurevion brand.  
* Users can subscribe to skincare routines.  
* Users can add skincare and routine products to a shopping cart.  
* Peptides should only be manually entered by users because of the legal gray area.  
* The app should avoid recommending, prescribing, or selling peptides in the first version.

# **6\. Progress and Body Metrics**

Progress should synthesize user behavior and body change rather than only listing measurements. The key idea is to show what changed, what probably caused it, and what the user should do next.

## **Progress Dashboard**

* Show expenditure estimates.  
* Show body fat percentage estimates as a serious metric.  
* Show adherence, recovery, muscle-group volume, body composition, strength trend, and energy balance.  
* Show confidence or uncertainty where estimates rely on prediction.

## **Body Scan and Estimation**

* Users should be able to scan their body for visual progress.  
* The app should estimate body fat percentage from available signals where possible.  
* If users have body-fat percentage scales, those readings should help calibrate or compare against app estimates.  
* The system should combine scan data, scale data, weight trend, expenditure estimates, nutrition adherence, and training behavior where available.

| Metric | Why It Matters | Feature Expression |
| :---- | :---- | :---- |
| Adherence | Shows whether the plan is realistic and followed. | Workout completion, meal-plan completion, logging consistency. |
| Recovery | Helps prevent overload and supports better planning. | Wearable signals, soreness/fatigue inputs, rest days, readiness. |
| Muscle-group volume | Connects training behavior to specific body regions. | Volume by 12 muscle groups, weekly changes, undertrained areas. |
| Body composition | Makes progress more meaningful than body weight alone. | BF percentage, lean mass trend, scan comparisons, scale inputs. |
| Strength trend | Shows training progress over time. | Estimated 1RM, rep PRs, load progression, exercise trends. |
| Energy balance | Connects intake, expenditure, and body changes. | Predicted expenditure, calories, weight trend, macro adherence. |

# **7\. Professional, Gym, and Partner Ecosystem**

The updated decision is that trainer and nutritionist connections should live inside the consumer app, not only in a separate professional portal. This keeps the user experience unified while leaving room for professional tools later.

* Add trainer inside the consumer app.  
* Connect trainers to user accounts or plans.  
* Connect nutritionists inside the consumer app later.  
* Allow professional oversight or plan review as the product expands.  
* Connect software to gyms later, potentially supporting gym-owned workflows, trainer dashboards, equipment data, or facility-linked accounts.

# **8\. Community**

Community should be broader than competing with friends. The updated scope includes competition, challenges, leaderboards, accountability groups, and shared milestones.

* Compete with friends.  
* Create challenges.  
* Show leaderboards.  
* Support accountability groups.  
* Celebrate shared milestones.

# **9\. Commerce and Shopping**

Shopping should not stop at static grocery lists. The product direction now includes carts for ingredients and products, especially around weekly meals, skincare, and routines.

* Grocery lists generated from weekly meal plans.  
* Cart support for buying ingredients.  
* Cart support for buying skincare and routine products.  
* Potential future support for partner marketplaces, retailer integrations, and affiliate marketing.

# **10\. Roadmap Prioritization**

This updated roadmap keeps the MVP focused but AI-native. The MVP should prove that Aurevion is more intelligent than normal fitness apps, not merely more polished.

| Priority | Features | Reason |
| :---- | :---- | :---- |
| MVP Must-Haves | Wearable integration; daily nutrition dashboard; quick food logging; saved meals; workout tracking; exercise library; basic planning; body progress tracking; expenditure prediction; serious body fat estimation; core AI meal/workout suggestions. | These establish the data loop and prove the AI/ML edge early. |
| MVP v1 | Workout Mode; Cook Mode with combined multi-recipe meal-prep steps; grocery list and cart; plan meals around workouts; muscle-group volume; recovery/adherence insights; community basics. | These turn tracking into guided execution and make the app feel next-generation. |
| V1.5 / Early Expansion | Trainer connections inside the consumer app; challenges and leaderboards; shared milestones; more advanced AI planning controls; ingredient swaps at planning and cooking time. | These deepen accountability, personalization, and user retention. |
| V2 / Advanced Personalization | 3D personalization; richer body scan interpretation; professional nutritionist workflows; gym software connections; advanced protocol and skincare subscriptions. | These require more data, review, partnerships, and operational maturity. |
| Careful / Reviewed Later | Diabetic diet support; peptide-related features beyond manual tracking; high-confidence medical-adjacent claims; direct peptide recommendations or sales. | These need legal, medical, and safety review before becoming productized. |

# **11\. Recommended App Structure**

A clean navigation model should keep the core product focused while supporting future expansion. The strongest structure keeps action-heavy domains visible and moves riskier or deeper systems into secondary modules until they mature.

| App Area | Primary Responsibilities | Feature Examples |
| :---- | :---- | :---- |
| Home | Daily overview and next best action. | Today summary, next workout or meal action, progress snapshot, resume Workout Mode or Cook Mode. |
| Train | Workout tracking, exercise library, and live workout execution. | Workout Mode, workout logs, exercise library, workout strategies, strength profile, muscle targeting. |
| Nutrition | Nutrition state, food logging, meals, recipes, cooking, and shopping. | Daily dashboard, quick logging, saved meals, Meal Planning Mode, Cook Mode, recipe library, grocery cart. |
| Plan | Weekly scheduling across meals, workouts, cooking, and routines. | Meals per day, cooking days, workout split, ingredient swaps, plan around workouts. |
| Progress | Body, strength, recovery, adherence, and energy trends. | Body fat estimates, expenditure estimates, scans, recovery, strength trends, body composition. |
| Community | Social motivation and accountability. | Friends, challenges, leaderboards, accountability groups, shared milestones. |
| Protocols / Routines | Skincare and user-entered protocol tracking. | Skincare routines, products, shopping cart, user-entered peptide logs only. |
| Professional / Partners | Consumer-facing trainer and nutritionist connections, with later pro tools. | Trainer connection, nutritionist connection, gym integrations, professional review. |

## **Key Product Dependencies**

* User profile: goals, schedule, diet preferences, equipment, injuries, experience level, training split, wearable sources, and body metrics.  
* Food and recipe data: searchable food database, barcode data, recipes, ingredients, substitutions, nutrition normalization, and shopping data.  
* Exercise data: exercise library, muscle mappings, equipment needs, difficulty, progression rules, modality tags, and workout strategy metadata.  
* Planning engine: weekly meal and workout scheduling, cooking days, batch prep logic, ingredient availability, and workout timing.  
* Progress data model: workout logs, food logs, body metrics, expenditure estimates, adherence, recovery, and body composition signals.  
* Safety layer: medical-adjacent claims, body scan uncertainty, diet restrictions, peptides, professional oversight, and cart/product review.

# **12\. Product Decisions**

| Question Area | Updated Decision | Product Impact |
| :---- | :---- | :---- |
| Body scanning value | Visual progress, body fat estimation, and muscle targeting. 3D personalization later. | Body scanning becomes a core progress and training signal, not just a future visual gimmick. |
| Body fat estimation | Treat as a serious metric. Use expenditure predictions and body-fat scale readings when available. | Requires confidence, calibration, and careful wording. |
| Launch workout types | Support lifting, calisthenics, cardio, HIIT/circuits, mobility/yoga, combat sports, and plyometrics. | Exercise and workout data models must support diverse modalities from the start. |
| Cook Mode scope | Include combined meal-prep steps across multiple recipes. | Cook Mode should be a major differentiator, not only a single-recipe stepper. |
| AI meal suggestions | Use all modes: generate plans, suggest approved recipes, and rank/filter user-liked meals. | AI should be powerful but controllable. |
| Trainer/nutritionist connections | Place inside the consumer app. | Professional support becomes part of the user journey rather than an external product. |
| Protocols, skincare, peptides | Part of the Aurevion brand. Peptides are manual user input only due to legal gray area. | Skincare can be productized sooner; peptide features need strict boundaries. |
| Progress metrics | Adherence, recovery, muscle-group volume, body composition, strength trend, and energy balance. | Progress dashboard should synthesize behavior, training, and body metrics. |
| Diabetic support | Not MVP. Potential later support after review. | Keep medical-adjacent diet support out of the first release. |
| Wearables | MVP must-have. | The MVP should capture real signals early to power predictions. |
| Community | Include competition, challenges, leaderboards, accountability groups, and shared milestones. | Community is a retention and motivation layer, not a single friend-competition feature. |
| Shopping | Support buying ingredients and products in a cart. | Nutrition and skincare can connect to commerce flows. |
| MVP philosophy | AI and ML features are the edge in the market. | Do not defer all intelligence to later versions. |

# **13\. Caution and Review Areas**

The caution areas are no longer open product questions, but they still need review boundaries. These are implementation guardrails, not reasons to remove the features.

| Area | Risk | Recommended Boundary |
| :---- | :---- | :---- |
| Body fat estimation | Prediction error, overconfidence, and body-image sensitivity. | Show confidence/uncertainty, allow scale calibration, focus on trends, avoid diagnostic language. |
| Body scanning | Computer vision complexity and potential privacy concerns. | Start with visual progress and user-controlled scans. Make data retention, deletion, and privacy clear. |
| Expenditure prediction | Bad estimates can hurt trust and plan quality. | Use adaptive trend-based estimates, compare against observed weight changes, and avoid pretending the number is exact. |
| Diabetic support | Medical-adjacent dietary guidance. | Keep out of MVP. Later support should be reviewed and framed as preferences/education unless medically validated. |
| Peptides | Legal and medical gray area. | Manual user-entered tracking only. No recommendations, prescribing, sourcing, or sales in early versions. |
| Professionals | Scope of responsibility and liability. | Clarify whether trainers/nutritionists are collaborators, coaches, or independent providers. |
| Shopping cart | Commerce, affiliate, fulfillment, and product safety obligations. | Start with ingredients/products that fit the brand and avoid restricted or medical products without review. |
| AI generation | Over-automation and unsafe suggestions. | Keep user-editable plans, validation gates, safety rules, and clear rationale for important recommendations. |

