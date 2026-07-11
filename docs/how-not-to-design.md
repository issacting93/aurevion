# How Not to Design

A field guide to the tells that mark an interface as generic, generated, or just careless — organized around the 46-pattern catalog from [Impeccable](https://impeccable.style/slop/), a detector for AI-generated UI. Two kinds of mistakes are mixed together here: **AI-slop tells** (the specific aesthetic every model converges on) and **quality issues** (mistakes that hurt regardless of who made them).

---

## 1. Visual Details

- **Border fights radius.** A thick colored accent border slapped on a rounded card. The straight border and the curved corner argue with each other. Pick one language: sharp edge with a border, or soft edge with none.
- **Glass for the sake of glass.** Blur, frosted panels, and glow borders used as pure decoration rather than to solve an actual layering problem.
- **The side-tab stripe.** A thick colored bar down one edge of a card. Possibly *the* single most recognizable AI tell — swap it for a subtler accent or drop it.
- **Hairline + wide shadow, both at once.** A thin 1px border paired with a big soft diffuse shadow is indecisive. Commit to a defined edge *or* a soft elevation, not both.
- **Decorative stripe textures.** Repeating gradient stripes as surface filler. Choose a deliberate texture or leave the surface alone.
- **Rounding everything into a blob.** 24px+ radius on small cards turns every element into the same soft pill shape. Cap cards around 12–16px; save full-pill rounding for tags and buttons.
- **The crude mascot doodle.** Hand-coded SVG illustrations that read as amateur sketches, not charm. If you can't ship a real asset, ship no illustration.

## 2. Typography

- **Flat hierarchy.** Heading, subheading, and body all sitting at nearly the same size. Use fewer sizes with more contrast between the steps (aim for at least 1.25× jumps).
- **Icon tile over heading.** A small rounded-square icon container stacked above a heading — the default feature-card shape every generator produces. Try the icon inline beside the heading instead.
- **Italic serif hero, by reflex.** Oversized italic serif as the primary headline has gone from "tasteful" to "the universal AI-startup landing page." Set it roman, switch faces, or make sure the register actually calls for it.
- **Eyebrow + oversized headline.** A tiny tracked uppercase label sitting right above a huge hero headline (or the pill-chip version of the same thing). Drop it, fold it into the headline, or use a real breadcrumb.
- **Kicker labels on every section.** Small uppercase tracked labels above every section heading turns a page into scaffolding. Use real structure, imagery, or a deliberate brand system instead.
- **A full sentence blown up to hero size.** Long headlines set at display scale leave nothing else above the fold. Short headlines can be huge; long ones need to be smaller.
- **Letter-spacing pulled too tight.** Characters start losing their shape. Tighten optically, not destructively.
- **The same three or four fonts everyone else uses.** Inter, Geist, Space Grotesk, Instrument Serif — technically fine faces that have become so common they read as no choice at all.
- **One font, everywhere.** Headings, body, labels, and buttons in a single family. No contrast, no hierarchy. Pair a distinctive display face with a calmer body face.
- **All-caps body copy.** We read by word shape; stripping ascenders and descenders with all-caps slows reading. Save uppercase for short labels.

## 3. Color & Contrast

- **The purple-to-blue gradient.** Buttons, text, backgrounds, glowing orbs — the most recognizable AI palette tell there is.
- **Neon glow on dark mode by default.** Colored box-shadow glows on dark backgrounds as the reflexive "cool" look. Use restrained, purposeful lighting, or skip dark mode if it's not earning its place.
- **Gradient text.** Decorative rather than functional, and it tanks scannability, especially on headings and big numbers.
- **Gray text on a colored background.** Reads washed out. Use a darker tint of the background color, or go near-white.
- **Cream/beige "tasteful default."** A warm off-white background reached for automatically because it feels safe, not because it was chosen.

## 4. Layout & Space

- **The hero-metric block.** Big number, small label, three supporting stats, gradient accent. Everyone's site has this section; it convinces no one anymore.
- **Identical card grids.** Six-plus same-sized cards, each with icon + heading + one line of copy. The default AI homepage layout, and it says nothing about the product.
- **One spacing value, used everywhere.** No rhythm — tight gaps for related items, generous gaps between sections, is what actually reads as intentional.
- **Cards inside cards inside cards.** Every extra shell adds padding and a shadow and no information. Flatten it: use type and dividers instead of nested containers.
- **01 / 02 / 03 as decoration.** Numbered markers on sections that aren't actually a sequence. Numbers should mean something, not just look tidy.
- **Lines that run too wide.** Text past ~75 characters per line makes the eye lose its place tracking back. Cap measure at 65–75ch.
- **Content that spills its container.** Text or elements wider than their box, forcing scroll or overflow. Let text wrap; constrain widths.
- **Dropdowns clipped by their own parent.** An `overflow: hidden` wrapper cutting off a tooltip or menu that needs to escape it. Free the overflow or move the positioned layer out.

## 5. Motion

- **Bounce and elastic easing.** Springy overshoot on dialogs and cards reads as dated and a little cheap. Save spring physics for things that are physically springy; ease interface motion out smoothly instead.
- **Animating layout properties.** Width, height, padding, margin — animating these causes jank. Animate `transform` and `opacity`, or use `grid-template-rows` for height changes.
- **Image hover-zoom, reflexively.** Scaling or rotating an image on hover has become a tic rather than a considered interaction. Let imagery sit still unless the motion means something.

## 6. Copy

- **Em-dash overload.** More than a couple of em-dashes in body copy reads as an AI cadence, not a voice. Reach for commas, colons, or periods instead.
- **Buzzword soup.** "Supercharge," "streamline," "world-class," "next-generation," "enterprise-grade" — vague enough to describe anything, so they say nothing. Name what the product actually does.
- **The manufactured-contrast aphorism.** "Not a feature. A platform." Landing on a short rebuttal like this once can land; doing it in every section is a tell.
- **"Theater" framing.** Dismissing something as "growth theater" or "performative" has become its own cliché. Say plainly what a thing does or doesn't do.

## 7. Imagery

- **Broken or placeholder images.** Empty or missing `src` values shipping as visibly broken boxes. Use a real asset or cut the tag.

## 8. General Quality (not AI-specific, just careless)

- **Cramped padding.** Text sitting almost against the edge of its container — give bordered or colored boxes at least 8–16px of breathing room.
- **Body text touching the viewport edge.** No container padding at all on the page level. Wrap content with at least 16px of horizontal padding or a max-width.
- **Justified text on screen.** Without hyphenation this creates uneven "rivers" of whitespace. Left-align on screen; save justification for print.
- **Low-contrast text.** Falls short of WCAG AA (4.5:1 for body, 3:1 for large text). Just increase the contrast.
- **Skipped heading levels.** Jumping from h1 to h3 breaks the outline screen readers rely on. Don't skip.
- **Line height under 1.3×.** Cramped leading makes multi-line text hard to track. Use 1.5–1.7 for body copy.
- **Body text under 12px.** Hard to read, especially on high-DPI displays. 14px minimum, 16px is the safer default.
- **Wide letter-spacing on body text.** Tracking above 0.05em breaks up natural word groupings and slows reading. Reserve wide tracking for short uppercase labels only.

---

## The pattern behind the patterns

Almost every item above comes from the same root cause: **reaching for the first plausible answer instead of a considered one.** The purple gradient, the icon-over-heading card, the eyebrow-plus-headline hero, the bounce easing, the em-dash — none of these are wrong in isolation. They become "slop" through repetition without intent: used because they're the statistically safe default, not because they were the right call for this interface.

The fix isn't a rule to avoid every item on this list — it's asking, for each choice, *why this and not something else?* If there's a real answer, it's design. If the honest answer is "it's what came out," that's the tell.

---
 
 to fix 
  CRITICAL — systemic, shapes the whole feel

  ┌─────┬──────────────────────┬────────────────────────────────────────────────────────────────────────┬────────────┐
  │  #  │       Pattern        │                                 Where                                  │   Count    │
  ├─────┼──────────────────────┼────────────────────────────────────────────────────────────────────────┼────────────┤
  │ 1   │ Eyebrow + oversized  │ FLabel → FNum on nearly every screen (Macros:74, BatchPrep:82,         │ ~10        │
  │     │ headline             │ Fridge:75, FoodLog:44, MacroHeatmap:197, PlanCalendar:384)             │ screens    │
  ├─────┼──────────────────────┼────────────────────────────────────────────────────────────────────────┼────────────┤
  │ 2   │ Kicker labels on     │ 73 FLabel instances across 18 files. Every content block opens with a  │ 73         │
  │     │ every section        │ tracked uppercase label                                                │ instances  │
  ├─────┼──────────────────────┼────────────────────────────────────────────────────────────────────────┼────────────┤
  │ 3   │ One font, everywhere │ Only Geist Sans + Geist Mono. No display face. Doc explicitly names    │ Whole app  │
  │     │                      │ Geist as "so common they read as no choice at all"                     │            │
  ├─────┼──────────────────────┼────────────────────────────────────────────────────────────────────────┼────────────┤
  │ 4   │ Flat type scale      │ headingSm (15px) = bodyLg (15px). bodySm→bodyMd is 1.08× (needs 1.25×) │ tokens.js  │
  └─────┴──────────────────────┴────────────────────────────────────────────────────────────────────────┴────────────┘

  HIGH — widespread, noticeable

  ┌─────┬────────────────────┬────────────────────────────────────────────────────────────────────┬─────────────────┐
  │  #  │      Pattern       │                               Where                                │      Count      │
  ├─────┼────────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┤
  │     │                    │ Big number + small label + 3 supporting stats on Macros,           │                 │
  │ 5   │ Hero-metric blocks │ BatchPrep, Fridge, FoodLog, MacroHeatmap, Training summary,        │ 7 screens       │
  │     │                    │ PlanCalendar                                                       │                 │
  ├─────┼────────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┤
  │ 6   │ 01/02/03 as        │ padStart(2,'0') on counts that aren't sequences: batch count       │ 2 screens       │
  │     │ decoration         │ (BatchPrep:84), step total (FeatureCardMorph:181)                  │                 │
  ├─────┼────────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┤
  │ 7   │ All-caps body copy │ FLabel forces textTransform: uppercase on multi-word content       │ Components +    │
  │     │                    │ strings, not just short labels                                     │ all screens     │
  ├─────┼────────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┤
  │ 8   │ Low-contrast text  │ Color.mute (#6b6b6b) on surface (#0d0d0d) = ~2.1:1 ratio.          │ tokens.js       │
  │     │                    │ Color.faint (#3a3a3a) = ~1.3:1. Both fail WCAG AA                  │                 │
  ├─────┼────────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┤
  │ 9   │ Spring/bounce      │ Ease.spring with 1.56 overshoot used on Onboarding selections,     │ ~15 instances   │
  │     │ easing             │ CheckIn, FeatureCardMorph, Scenes                                  │                 │
  ├─────┼────────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┤
  │ 10  │ Animating layout   │ transition: height, transition: width on Onboarding:21,            │ ~8 instances    │
  │     │ properties         │ MacroHeatmap:321, MealPrep:441, FTexBar in components.jsx          │                 │
  └─────┴────────────────────┴────────────────────────────────────────────────────────────────────┴─────────────────┘

  MEDIUM — present, worth addressing

  ┌─────┬──────────────────────────┬───────────────────────────────────────────────────────────────────┬────────────┐
  │  #  │         Pattern          │                               Where                               │   Count    │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 11  │ Letter-spacing on body   │ FLabel default letterSpacing=1.4 applied to multi-word strings    │ Components │
  │     │ text                     │                                                                   │            │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 12  │ Body text under 12px     │ FMono size={9} for content text in Today, Training; 8px in        │ ~5         │
  │     │                          │ GoalDetailCards                                                   │ instances  │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 13  │ Neon glow on dark mode   │ Colored boxShadow glows on Home.jsx hover, GoalSetting slider,    │ ~8         │
  │     │                          │ MealPrep active stat, Onboarding selections                       │ instances  │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 14  │ Decorative stripe        │ repeating-linear-gradient(135deg,...) in FTexBar and Macros day   │ 2          │
  │     │ textures                 │ grid                                                              │ components │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 15  │ Glass for the sake of    │ backdropFilter: blur(16px) on FTabBar, JourneyLayout sidebar,     │ 5          │
  │     │ glass                    │ ModeOverview nav, Onboarding                                      │ instances  │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 16  │ Em-dash overload         │ Home.jsx descriptions use 4 em-dashes. Landing.html has 2 more    │ 6          │
  │     │                          │                                                                   │ instances  │
  ├─────┼──────────────────────────┼───────────────────────────────────────────────────────────────────┼────────────┤
  │ 17  │ Manufactured-contrast    │ landing.html:780 — "Not a chatbot bolted on. Intelligence through │ 1 direct   │
  │     │ aphorism                 │  every layer." Textbook example                                   │ hit        │
  └─────┴──────────────────────────┴───────────────────────────────────────────────────────────────────┴────────────┘

  CLEAN — not found

  - No purple-to-blue gradient
  - No gradient text
  - No side-tab stripes
  - No buzzword soup (no "supercharge", "streamline", etc.)
  - No "theater" framing
  - No broken/placeholder images
  - No justified text
  - Lines stay within phone width (402px constraint helps)

  ---
  Fix plan, prioritized

  ┌──────────┬─────────────────────┬────────────────────────────────────────────────────┬───────────────────────────┐
  │ Priority │        What         │                        How                         │          Touches          │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P0       │ Fix type scale      │ headingSm: 15→18px, bodyLg: 15→14px, bodySm:       │ tokens.js                 │
  │          │ collisions          │ 12→11px. Ensure 1.25× jumps                        │                           │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │          │ Kill the            │ Remove FLabel above FNum. Let numbers speak with   │                           │
  │ P0       │ eyebrow→hero        │ inline context ("2,340 kcal" not kicker→number)    │ ~10 screens               │
  │          │ pattern             │                                                    │                           │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P1       │ Cut FLabel count in │ Replace with real headings, whitespace, or         │ ~35 of 73 instances       │
  │          │  half               │ dividers. Keep for genuine short labels only       │                           │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P1       │ Bump Color.mute     │ #6b6b6b → #8a8a8a (~3.2:1). #3a3a3a → #525252      │ tokens.js                 │
  │          │ contrast            │ (~2.1:1) for faint                                 │                           │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P1       │ Replace spring      │ Ease.spring → Ease.out or standard ease. Remove    │ tokens.js, motion.js      │
  │          │ easing              │ overshoot                                          │                           │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P2       │ Stop animating      │ width/height transitions → transform: scaleX/Y +   │ FTexBar, Onboarding,      │
  │          │ layout props        │ opacity                                            │ MacroHeatmap              │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P2       │ Remove decorative   │ padStart(2,'0') only for time/sequential values,   │ BatchPrep,                │
  │          │ zero-padding        │ not counts                                         │ FeatureCardMorph          │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P2       │ Min 10px for        │ Bump FMono size={9} → 10                           │ Today, Training,          │
  │          │ content text        │                                                    │ GoalDetailCards           │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P3       │ Tone down colored   │ Remove or reduce boxShadow with accent rgba        │ Home, GoalSetting,        │
  │          │ glows               │                                                    │ MealPrep, Onboarding      │
  ├──────────┼─────────────────────┼────────────────────────────────────────────────────┼───────────────────────────┤
  │ P3       │ Fix landing.html    │ Rewrite "Not a chatbot bolted on" line. Reduce     │ landing.html              │
  │          │ copy                │ em-dashes                                          │                           │    
  └──────────┴─────────────────────┴────────────────────────────────────────────────────┴───────────────────────────┘    
                                                                                                                         
  Want me to start with P0 (type scale + eyebrow pattern)?      