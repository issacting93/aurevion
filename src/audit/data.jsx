// Audit data — verdict per component, original note, proposed direction.
// Verdict scale: love | keep | change | replace
// "note" is the user's handwritten reaction (paraphrased from the PDF).

const AUDIT = [
  // ───────── Surface & Motion ─────────
  {
    id: 'feature-card',
    name: 'FeatureCard',
    group: 'Surface & motion',
    verdict: 'change',
    note: 'Not a huge fan — but I want something that opens fullscreen, like cook-mode or plan-mode.',
    proposed: [
      'Treat as a launch surface, not a content card.',
      'Add card→fullscreen morph transition for cook-mode / plan-mode entry.',
      'Strip the helper subtitle; lead with intent + single primary action.',
    ],
    breaking: 'Subtitle prop deprecated. New `mode` prop: "inline" | "fullscreen".',
    render: 'featureCard',
  },
  {
    id: 'stack-window',
    name: 'StackWindow',
    group: 'Surface & motion',
    verdict: 'change',
    note: 'I like the bar / tab bar though. Open to changing tabs.',
    proposed: [
      'Keep the stacked-preview interaction, retire the demo copy.',
      'Tab-bar identity locked; visual treatment of pills open to revision.',
    ],
    render: 'stackWindow',
  },

  // ───────── Timeline ─────────
  {
    id: 'timeline',
    name: 'Timeline (execution rail)',
    group: 'Timeline',
    verdict: 'keep',
    note: 'I like the component itself — don\'t like the content inside.',
    proposed: [
      'Keep the rail, ring states, and grouping.',
      'Rewrite content: drop "primary lift" / RPE jargon outside coach mode.',
      'Action row (complete / skip / next) needs a tighter visual treatment.',
    ],
    render: 'timeline',
  },

  // ───────── Calendar ─────────
  {
    id: 'calendar-month',
    name: 'PlanCalendar · Month',
    group: 'Calendar',
    verdict: 'love',
    note: 'Love this calendar. Meh about the M / W / D controls.',
    proposed: [
      'Keep grid, dots, selection ring exactly as-is.',
      'Rework the M / W / D switcher — currently feels like a SaaS toggle.',
    ],
    render: 'calMonth',
  },
  {
    id: 'calendar-week',
    name: 'PlanCalendar · Week',
    group: 'Calendar',
    verdict: 'change',
    note: 'Love it, but not sure how useful. Maybe for workout / meal planning specifically.',
    proposed: [
      'Reserve week view for planning-mode contexts only.',
      'Dynamic column heights distract — try fixed-height with stacked chip rows.',
    ],
    render: 'calWeek',
  },
  {
    id: 'calendar-day',
    name: 'PlanCalendar · Day',
    group: 'Calendar',
    verdict: 'replace',
    note: 'Meh. Empty canvas with one label feels wasted.',
    proposed: [
      'Replace with a day-focus surface: hero metric + 2-3 timeline rows.',
      'Reuse Timeline + MetricCluster instead of a bespoke layout.',
    ],
    render: 'calDay',
  },

  // ───────── Type & Icons ─────────
  {
    id: 'typography',
    name: 'Typography roles',
    group: 'Type & icons',
    verdict: 'keep',
    note: 'Type is fine — colors are meh.',
    proposed: [
      'Hold the role set (display / body / caption).',
      'Re-tone success/warning/danger off-spectrum; current greens/reds are stocky.',
    ],
    render: 'typography',
  },
  {
    id: 'icons-line',
    name: 'Line icons (semantic)',
    group: 'Type & icons',
    verdict: 'keep',
    note: 'Okay icons lol.',
    proposed: ['Keep — sized + tone-driven, no decorative variant needed.'],
    render: 'iconsLine',
  },
  {
    id: 'icons-cooking',
    name: 'Cooking action icons',
    group: 'Type & icons',
    verdict: 'replace',
    note: 'I want icons that are actually representative of the step in a given recipe.',
    proposed: [
      'Drop the generic Tabler set for cooking actions specifically.',
      'Commission/illustrate a step-aware set: dice, sear, fold, plate, etc.',
      'Keep generic Tabler for non-recipe surfaces.',
    ],
    breaking: 'Icon name registry will shift. Plan a migration map.',
    render: 'iconsCooking',
  },

  // ───────── Actions ─────────
  {
    id: 'button',
    name: 'Button',
    group: 'Actions',
    verdict: 'change',
    note: 'Meh buttons.',
    proposed: [
      'Keep emphasis / scale / state model.',
      'Reshape silhouette — current radius + weight reads SaaS.',
      'Tighten loading state; the "Saving" spinner has visual debt.',
    ],
    render: 'button',
  },
  {
    id: 'chip',
    name: 'Chip',
    group: 'Actions',
    verdict: 'replace',
    note: 'Chips piss me off — hard to do well in consumer apps. Feels too SaaS.',
    proposed: [
      'Audit every chip usage and ask: would a verb-led button work?',
      'Reserve chip pattern for true multi-select filters (one place: meal log).',
      'For status, prefer inline tone + glyph over a pill.',
    ],
    breaking: 'Most current chip surfaces become buttons or tone spans.',
    render: 'chip',
  },

  // ───────── Progress ─────────
  {
    id: 'progress-bar',
    name: 'ProgressBar',
    group: 'Progress',
    verdict: 'keep',
    note: 'Basic but ok.',
    proposed: [
      'Keep linear + stacked (macro split) variants.',
      'Consider 6px tall variant for dense card use.',
    ],
    render: 'progressBar',
  },
  {
    id: 'progress-ring',
    name: 'ProgressRing',
    group: 'Progress',
    verdict: 'love',
    note: 'I like progress rings.',
    proposed: [
      'Promote to a hero pattern — use on Home, profile, day summary.',
      'Add multi-arc as the canonical "overview" card visual.',
    ],
    render: 'progressRing',
  },
  {
    id: 'metric-progress',
    name: 'Metric (composition rule)',
    group: 'Progress',
    verdict: 'keep',
    note: 'Composition rule, not a primitive — keep it that way.',
    proposed: [
      'Document as a recipe, not a component.',
      'Used inside MetricCluster compact variant.',
    ],
    render: 'metricProgress',
  },

  // ───────── Charts ─────────
  {
    id: 'chart-bar',
    name: 'BarMark',
    group: 'Charts',
    verdict: 'keep',
    note: 'Bars feel okay.',
    proposed: ['Keep. Default mark for week-over-week comparison.'],
    render: 'barChart',
  },
  {
    id: 'chart-arc',
    name: 'ArcMark',
    group: 'Charts',
    verdict: 'keep',
    note: 'Arcs feel okay.',
    proposed: ['Keep. Pair with ProgressRing for macro composition.'],
    render: 'arcChart',
  },
  {
    id: 'chart-line',
    name: 'LineMark + AreaMark',
    group: 'Charts',
    verdict: 'change',
    note: 'Maybe not the line chart — feel less sure about it.',
    proposed: [
      'Demote line/area to a single use: bodyweight trend.',
      'For everything else, prefer BarMark or ComparisonBar.',
      'Strip the target-band + ref-line stack; too much chart vocab at once.',
    ],
    render: 'lineChart',
  },
  {
    id: 'chart-comparison',
    name: 'ComparisonBarChart',
    group: 'Charts',
    verdict: 'love',
    note: 'I LOVE — though I don\'t know all the use cases yet.',
    proposed: [
      'Promote to a top-level chart, not a variant.',
      'Use cases: actual vs target (training, calories, sleep, steps).',
      'Add a compact embedded variant for in-card use.',
    ],
    render: 'comparisonChart',
  },
  {
    id: 'chart-bodyweight',
    name: 'Bodyweight trend',
    group: 'Charts',
    verdict: 'change',
    note: 'Meh.',
    proposed: [
      'Move from line to weekly-average BarMark to reduce noise.',
      'Keep the "check-in" point overlay — it\'s the only signal that matters.',
    ],
    render: 'bodyweight',
  },

  // ───────── Interaction & semantics ─────────
  {
    id: 'interaction-states',
    name: 'Interaction & semantic states',
    group: 'Interaction',
    verdict: 'replace',
    note: 'AI slop.',
    proposed: [
      'Remove the surfaced "GestureState / SeriesKey / ThresholdState" cards from any user-facing audit doc.',
      'These belong in code-level typedefs, not in a design system gallery.',
    ],
    render: 'interaction',
  },

  // ───────── Identity & forms ─────────
  {
    id: 'avatar',
    name: 'Avatar',
    group: 'Identity & forms',
    verdict: 'keep',
    note: 'Okay avatars.',
    proposed: ['Keep size + tone API. Grouping is layout, not a prop.'],
    render: 'avatar',
  },
  {
    id: 'input',
    name: 'Input',
    group: 'Identity & forms',
    verdict: 'change',
    note: 'Do not like.',
    proposed: [
      'Tighten the resting state — too tall, too quiet.',
      'Error state should not feel like a destructive button.',
      'Search variant needs a distinct silhouette from text input.',
    ],
    render: 'input',
  },
  {
    id: 'divider',
    name: 'Divider',
    group: 'Identity & forms',
    verdict: 'keep',
    note: 'Fine.',
    proposed: ['Keep. Inset + split variants are composition only.'],
    render: 'divider',
  },

  // ───────── Section primitives ─────────
  {
    id: 'section-block',
    name: 'SectionBlock',
    group: 'Section primitives',
    verdict: 'change',
    note: 'These are okay — don\'t like the chips inside them.',
    proposed: [
      'Keep the block (header + trailing action + spacing).',
      'Kill the chip-based filter pattern at the header.',
      'Trailing action should be a single text button or icon, not a chip row.',
    ],
    render: 'sectionBlock',
  },
  {
    id: 'metric-cluster',
    name: 'MetricCluster',
    group: 'Section primitives',
    verdict: 'change',
    note: 'Okay, but needs to be more compact.',
    proposed: [
      'Default = 1-line variant (headline metric + 2 nested metrics inline).',
      'Today\'s "card-takes-a-screen" version becomes the expanded mode.',
      'Drop the inline progress bars at compact size.',
    ],
    render: 'metricCluster',
  },
  {
    id: 'expandable-panel',
    name: 'ExpandablePanel',
    group: 'Section primitives',
    verdict: 'keep',
    note: 'I like it — don\'t know all the use cases yet though.',
    proposed: [
      'Keep as the canonical "why" / coach-explainer surface.',
      'Document use cases: meal reasoning, workout deviation, plan changes.',
      'Cap to one panel per screen.',
    ],
    render: 'expandablePanel',
  },
];

const GROUPS = [
  'Surface & motion',
  'Timeline',
  'Calendar',
  'Type & icons',
  'Actions',
  'Progress',
  'Charts',
  'Interaction',
  'Identity & forms',
  'Section primitives',
];

const VERDICTS = {
  love:    { label: 'Love',    short: 'L', color: '#22c55e', dim: 'rgba(34,197,94,0.14)',  border: 'rgba(34,197,94,0.4)' },
  keep:    { label: 'Keep',    short: 'K', color: '#e5e5e5', dim: 'rgba(229,229,229,0.10)', border: 'rgba(229,229,229,0.25)' },
  change:  { label: 'Change',  short: 'C', color: '#f59e0b', dim: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.4)' },
  replace: { label: 'Replace', short: 'R', color: '#ef4444', dim: 'rgba(239,68,68,0.14)',  border: 'rgba(239,68,68,0.4)' },
};

Object.assign(window, { AUDIT, GROUPS, VERDICTS });
