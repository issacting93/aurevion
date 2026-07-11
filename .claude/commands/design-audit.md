Run a design audit against `docs/how-not-to-design.md`.

First read `docs/how-not-to-design.md` to load the anti-pattern checklist.

Then launch **4 agents in parallel** (use the Agent tool, subagent_type Explore):

**Agent 1 — Typography**
Check for: eyebrow + oversized headline (FLabel above FNum/heading), kicker labels on every section (count FLabel usage), flat type hierarchy (sizes without 1.25x jumps), all-caps body copy (textTransform uppercase on multi-word text), single typeface (no display font contrast), letter-spacing on body text (>0.05em on non-labels), body text under 12px. Read tokens/type scale file first, then sample 5-8 screen files. Report file:line for each violation.

**Agent 2 — Layout & Spacing**
Check for: hero-metric blocks (big FNum + small label + supporting stats), cards inside cards (nested FSurface or redundant card wrappers), 01/02/03 as decoration (padStart on non-sequential numbers), identical card grids (same-sized repeated tiles), one spacing value everywhere (uniform gaps without rhythm), lines that run too wide (text without maxWidth past 75ch). Read 5-8 screen files. Report file:line for each violation.

**Agent 3 — Visual, Color & Motion**
Check for: border fights radius (thick colored border on rounded cards), glass for the sake of glass (backdropFilter blur as decoration), side-tab stripe (thick colored bar on card edge), hairline + wide shadow both at once, rounding everything into a blob (borderRadius >16px on non-pills), neon glow on dark mode (colored boxShadow), gradient text (background-clip text), low-contrast text (check Color.mute/Color.faint values against dark surfaces for WCAG AA 4.5:1), bounce/elastic easing (spring cubic-bezier with overshoot), animating layout properties (transition on width/height/padding/margin instead of transform/opacity). Read tokens file + 5-8 screen files. Report file:line for each violation.

**Agent 4 — Copy & Content**
Check for: em-dash overload (more than 2 per screen in user-facing strings), buzzword soup ("supercharge", "streamline", "world-class", "next-generation", "enterprise-grade", "elevate", "empower", "unlock", "leverage", "seamless"), manufactured-contrast aphorism ("Not a X. A Y." pattern), "theater"/"performative" framing. Search all JSX files and any landing page HTML. Report file:line for each violation.

After all 4 agents complete, compile results into a single report with:

1. A summary table of all violations grouped by severity:
   - **P0 (Critical)** — systemic patterns that shape the whole feel
   - **P1 (High)** — widespread, noticeable issues
   - **P2 (Medium)** — present, worth addressing
   - **P3 (Low)** — minor or isolated

2. A **CLEAN** section listing which anti-patterns were NOT found

3. A prioritized **fix plan** table with columns: Priority | What | How | Touches
