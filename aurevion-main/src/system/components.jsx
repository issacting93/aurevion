/* ============================================================
   Aurevion Component Library
   ============================================================
   Requires: tokens.jsx loaded first (Color, Font, Space, etc.)

   Every component documents:
     - Variants (visual style)
     - States  (interactive / data-driven)
     - Props

   Components use CSS classes injected once, combined with
   minimal inline styles for variant/state-specific overrides.
   ============================================================ */

const { useState, useRef, useEffect, useCallback, memo, forwardRef, createContext, useContext } = React;

// ── Helpers ─────────────────────────────────────────────────

function cx(...classes) { return classes.filter(Boolean).join(' '); }
function merge(...objs) { return Object.assign({}, ...objs); }


/* ============================================================
   1. CARD
   ============================================================
   A surface container. The most fundamental layout primitive.

   Variants: surface | elevated | outlined | ghost
   States:   default | hover | active | selected | disabled
   ============================================================ */

const CARD_VARIANTS = {
  surface:  { background: Color.surface,  border: `1px solid ${Color.borderSoft}` },
  elevated: { background: Color.surface2, border: `1px solid ${Color.border}`, boxShadow: Shadow.md },
  outlined: { background: 'transparent',  border: `1px solid ${Color.border}` },
  ghost:    { background: 'transparent',  border: '1px solid transparent' },
};

const Card = memo(forwardRef(function Card({
  variant = 'surface',
  padding,
  radius = Radius.xl,
  selected = false,
  disabled = false,
  onClick,
  style,
  children,
  ...rest
}, ref) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const interactive = !!onClick && !disabled;

  const base = CARD_VARIANTS[variant] || CARD_VARIANTS.surface;

  const computed = merge(
    {
      borderRadius: radius,
      padding: padding != null ? padding : Space[5],
      transition: `background ${Duration.normal} ${Ease.default}, border-color ${Duration.normal} ${Ease.default}, box-shadow ${Duration.normal} ${Ease.default}, transform ${Duration.fast} ${Ease.default}, opacity ${Duration.normal} ${Ease.default}`,
    },
    base,
    interactive && { cursor: 'pointer', userSelect: 'none' },
    interactive && hovered && {
      background: Color.surface2,
      borderColor: Color.border,
    },
    interactive && pressed && {
      transform: 'scale(0.985)',
    },
    selected && {
      borderColor: Color.accent,
      background: Color.accentFaint,
    },
    disabled && {
      opacity: 0.4,
      pointerEvents: 'none',
    },
    style,
  );

  return React.createElement('div', {
    ref,
    role: interactive ? 'button' : undefined,
    tabIndex: interactive ? 0 : undefined,
    'aria-selected': selected || undefined,
    'aria-disabled': disabled || undefined,
    style: computed,
    onPointerEnter: interactive ? () => setHovered(true) : undefined,
    onPointerLeave: interactive ? () => { setHovered(false); setPressed(false); } : undefined,
    onPointerDown:  interactive ? () => setPressed(true) : undefined,
    onPointerUp:    interactive ? () => setPressed(false) : undefined,
    onClick:        interactive ? onClick : undefined,
    onKeyDown:      interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined,
    ...rest,
  }, children);
}));


/* ============================================================
   2. BUTTON
   ============================================================
   Variants: primary | secondary | ghost | danger
   Sizes:    sm (32px) | md (44px) | lg (52px)
   States:   default | hover | active | disabled | loading
   ============================================================ */

const BTN_VARIANTS = {
  primary: {
    default:  { background: Color.accent, color: '#1a0f0a', borderColor: 'transparent' },
    hover:    { background: '#FF8166' },
    active:   { background: Color.accentHot },
    disabled: { background: Color.faint, color: Color.mute },
  },
  secondary: {
    default:  { background: 'rgba(255,255,255,0.06)', color: Color.text, borderColor: Color.border },
    hover:    { background: 'rgba(255,255,255,0.10)' },
    active:   { background: 'rgba(255,255,255,0.04)' },
    disabled: { background: 'transparent', color: Color.faint, borderColor: Color.borderSoft },
  },
  ghost: {
    default:  { background: 'transparent', color: Color.dim, borderColor: 'transparent' },
    hover:    { background: 'rgba(255,255,255,0.04)', color: Color.text },
    active:   { background: 'rgba(255,255,255,0.02)' },
    disabled: { background: 'transparent', color: Color.faint },
  },
  danger: {
    default:  { background: Color.redDim, color: Color.red, borderColor: 'transparent' },
    hover:    { background: 'rgba(248,113,113,0.22)' },
    active:   { background: 'rgba(248,113,113,0.12)' },
    disabled: { background: 'transparent', color: Color.faint },
  },
};

const BTN_SIZES = {
  sm: { height: 32, paddingLeft: 12, paddingRight: 12, fontSize: 11, gap: 6 },
  md: { height: 44, paddingLeft: 16, paddingRight: 16, fontSize: 12, gap: 8 },
  lg: { height: 52, paddingLeft: 20, paddingRight: 20, fontSize: 13, gap: 8 },
};

const Button = memo(forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconTrailing,
  onClick,
  style,
  children,
  ...rest
}, ref) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const s = BTN_SIZES[size] || BTN_SIZES.md;
  const isDisabled = disabled || loading;

  const state = isDisabled ? 'disabled' : pressed ? 'active' : hovered ? 'hover' : 'default';

  const computed = merge(
    // Reset
    { margin: 0, outline: 'none', textDecoration: 'none' },
    // Base
    {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      paddingLeft: s.paddingLeft,
      paddingRight: s.paddingRight,
      borderRadius: Radius.md,
      border: '1px solid',
      fontFamily: Font.mono,
      fontSize: s.fontSize,
      fontWeight: 500,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      cursor: isDisabled ? 'default' : 'pointer',
      userSelect: 'none',
      transition: `background ${Duration.normal} ${Ease.default}, color ${Duration.normal} ${Ease.default}, border-color ${Duration.normal} ${Ease.default}, transform ${Duration.fast} ${Ease.default}, opacity ${Duration.normal} ${Ease.default}`,
    },
    // Variant + state
    v.default,
    v[state],
    // Pressed scale
    pressed && !isDisabled && { transform: 'scale(0.97)' },
    // Full width
    fullWidth && { width: '100%' },
    // Loading opacity
    loading && { opacity: 0.7 },
    style,
  );

  const spinner = loading ? React.createElement('span', {
    style: {
      width: s.fontSize,
      height: s.fontSize,
      border: '1.5px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'aurevion-spin 0.6s linear infinite',
      flexShrink: 0,
    }
  }) : null;

  return React.createElement('button', {
    ref,
    type: 'button',
    disabled: isDisabled,
    'aria-busy': loading || undefined,
    style: computed,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => { setHovered(false); setPressed(false); },
    onPointerDown:  () => setPressed(true),
    onPointerUp:    () => setPressed(false),
    onClick: isDisabled ? undefined : onClick,
    ...rest,
  },
    spinner || (icon ? React.createElement('span', { style: { display: 'flex', flexShrink: 0 } }, icon) : null),
    !loading && children,
    !loading && iconTrailing ? React.createElement('span', { style: { display: 'flex', flexShrink: 0 } }, iconTrailing) : null,
  );
}));


/* ============================================================
   3. ICON BUTTON
   ============================================================
   Circular button for icon-only actions.

   Variants: primary | secondary | ghost
   Sizes:    sm (28px) | md (36px) | lg (44px)
   States:   default | hover | active | disabled
   ============================================================ */

const IBTN_SIZES = { sm: 28, md: 36, lg: 44 };

const IconButton = memo(forwardRef(function IconButton({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  label,
  onClick,
  style,
  children,
  ...rest
}, ref) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.ghost;
  const dim = IBTN_SIZES[size] || IBTN_SIZES.md;
  const state = disabled ? 'disabled' : pressed ? 'active' : hovered ? 'hover' : 'default';

  const computed = merge(
    { margin: 0, outline: 'none', border: '1px solid', padding: 0 },
    {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: dim, height: dim, borderRadius: Radius.full,
      cursor: disabled ? 'default' : 'pointer', userSelect: 'none', flexShrink: 0,
      transition: `background ${Duration.normal} ${Ease.default}, color ${Duration.normal} ${Ease.default}, transform ${Duration.fast} ${Ease.default}`,
    },
    v.default, v[state],
    pressed && !disabled && { transform: 'scale(0.92)' },
    style,
  );

  return React.createElement('button', {
    ref, type: 'button', disabled,
    'aria-label': label,
    style: computed,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => { setHovered(false); setPressed(false); },
    onPointerDown:  () => setPressed(true),
    onPointerUp:    () => setPressed(false),
    onClick: disabled ? undefined : onClick,
    ...rest,
  }, children);
}));


/* ============================================================
   4. TAG / BADGE
   ============================================================
   Small status indicator.

   Tones:  neutral | accent | green | red | blue
   States: default (static — no interaction)
   ============================================================ */

const TAG_TONES = {
  neutral: { background: 'rgba(255,255,255,0.06)', color: Color.dim },
  accent:  { background: Color.accentDim, color: Color.accent },
  green:   { background: Color.greenDim,  color: Color.green },
  red:     { background: Color.redDim,    color: Color.red },
  blue:    { background: Color.blueDim,   color: Color.blue },
  solid:   { background: Color.accent,    color: '#1a0f0a' },
};

function Tag({ tone = 'neutral', icon, children, style }) {
  const t = TAG_TONES[tone] || TAG_TONES.neutral;
  return React.createElement('span', {
    style: merge(
      Type.labelSm,
      {
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 8px',
        borderRadius: Radius.full,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      },
      t,
      style,
    ),
  }, icon, children);
}


/* ============================================================
   5. ROW
   ============================================================
   Horizontal list item — the workhorse layout for lists,
   settings, checkable items, shopping rows, etc.

   Variants: default | compact
   States:   default | hover | active | checked | disabled
   ============================================================ */

const Row = memo(forwardRef(function Row({
  leading,
  title,
  subtitle,
  trailing,
  checked,
  onToggle,
  disabled = false,
  compact = false,
  divider = true,
  style,
  children,
  ...rest
}, ref) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const interactive = !!onToggle && !disabled;
  const isChecked = checked === true;

  const py = compact ? Space[2] : Space[3];

  const computed = merge(
    {
      display: 'flex',
      alignItems: 'center',
      gap: Space[3],
      padding: `${py}px 0`,
      borderBottom: divider ? `1px solid ${Color.borderSoft}` : 'none',
      transition: `background ${Duration.normal} ${Ease.default}, opacity ${Duration.normal} ${Ease.default}`,
      cursor: interactive ? 'pointer' : 'default',
      userSelect: interactive ? 'none' : undefined,
    },
    interactive && hovered && { background: 'rgba(255,255,255,0.02)' },
    interactive && pressed && { background: 'rgba(255,255,255,0.01)' },
    disabled && { opacity: 0.35, pointerEvents: 'none' },
    isChecked && { opacity: 0.5 },
    style,
  );

  // Checkbox indicator
  const checkbox = onToggle != null ? React.createElement('span', {
    'aria-hidden': true,
    style: merge(
      {
        width: 18, height: 18, borderRadius: Radius.sm, flexShrink: 0,
        border: `1.5px solid ${isChecked ? Color.accent : Color.mute}`,
        background: isChecked ? Color.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `background ${Duration.normal} ${Ease.default}, border-color ${Duration.normal} ${Ease.default}`,
      }
    ),
  },
    isChecked ? React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: '#1a0f0a', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
      React.createElement('polyline', { points: '20 6 9 17 4 12' })
    ) : null
  ) : null;

  return React.createElement('div', {
    ref,
    role: interactive ? 'checkbox' : undefined,
    'aria-checked': onToggle != null ? isChecked : undefined,
    'aria-disabled': disabled || undefined,
    tabIndex: interactive ? 0 : undefined,
    style: computed,
    onPointerEnter: interactive ? () => setHovered(true) : undefined,
    onPointerLeave: interactive ? () => { setHovered(false); setPressed(false); } : undefined,
    onPointerDown:  interactive ? () => setPressed(true) : undefined,
    onPointerUp:    interactive ? () => setPressed(false) : undefined,
    onClick:        interactive ? () => onToggle(!isChecked) : undefined,
    onKeyDown:      interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(!isChecked); } } : undefined,
    ...rest,
  },
    checkbox,
    leading ? React.createElement('span', { style: { display: 'flex', flexShrink: 0 } }, leading) : null,
    React.createElement('span', { style: { flex: 1, minWidth: 0 } },
      title ? React.createElement('div', {
        style: merge(
          Type.bodyMd,
          { color: isChecked ? Color.mute : Color.text },
          isChecked && { textDecoration: 'line-through' },
        ),
      }, title) : null,
      subtitle ? React.createElement('div', {
        style: merge(Type.dataSm, { color: Color.mute, marginTop: 2 }),
      }, subtitle) : null,
      children,
    ),
    trailing ? React.createElement('span', {
      style: { display: 'flex', alignItems: 'center', flexShrink: 0, color: Color.mute },
    }, trailing) : null,
  );
}));


/* ============================================================
   6. PROGRESS BAR
   ============================================================
   Linear progress indicator.

   Variants: standard | textured | segmented
   States:   default | animated | complete | indeterminate
   ============================================================ */

function ProgressBar({
  value = 0,
  max = 100,
  variant = 'standard',
  color = Color.accent,
  height = 6,
  segments = 20,
  showScale = false,
  scaleLabels,
  animated = false,
  style,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const isComplete = pct >= 100;

  const trackStyle = {
    width: '100%',
    height: variant === 'segmented' ? height * 1.5 : height,
    borderRadius: variant === 'segmented' ? 0 : Radius.sm,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    position: 'relative',
  };

  let fill;

  if (variant === 'textured') {
    fill = React.createElement('div', {
      style: {
        width: `${pct}%`,
        height: '100%',
        borderRadius: 'inherit',
        background: `repeating-linear-gradient(135deg, ${color}, ${color} 2px, transparent 2px, transparent 5px)`,
        transition: animated ? `width ${Duration.slow} ${Ease.default}` : undefined,
      },
    });
  } else if (variant === 'segmented') {
    const lit = Math.round(segments * pct / 100);
    const segs = [];
    for (let i = 0; i < segments; i++) {
      segs.push(React.createElement('div', {
        key: i,
        style: {
          flex: 1,
          height: '100%',
          borderRadius: 1,
          background: i < lit ? color : 'rgba(255,255,255,0.06)',
          transition: animated ? `background ${Duration.normal} ${Ease.default}` : undefined,
        },
      }));
    }
    fill = React.createElement('div', {
      style: { display: 'flex', gap: 2, width: '100%', height: '100%' },
    }, ...segs);
    // Override track for segmented
    trackStyle.background = 'transparent';
    trackStyle.overflow = 'visible';
  } else {
    fill = React.createElement('div', {
      style: {
        width: `${pct}%`,
        height: '100%',
        borderRadius: 'inherit',
        background: isComplete ? Color.green : color,
        transition: animated ? `width ${Duration.slow} ${Ease.default}, background ${Duration.normal} ${Ease.default}` : undefined,
      },
    });
  }

  const scale = showScale ? React.createElement('div', {
    style: {
      display: 'flex', justifyContent: 'space-between', marginTop: 4,
      ...Type.labelSm, color: Color.mute,
    },
  },
    (scaleLabels || ['0', '50', '100']).map((l, i) =>
      React.createElement('span', { key: i, style: i === (scaleLabels || []).length - 1 || (!scaleLabels && i === 2) ? { color: Color.accent } : undefined }, l)
    )
  ) : null;

  return React.createElement('div', { style: merge({ width: '100%' }, style) },
    React.createElement('div', { style: trackStyle,
      role: 'progressbar',
      'aria-valuenow': Math.round(pct),
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    }, fill),
    scale,
  );
}


/* ============================================================
   7. PROGRESS RING
   ============================================================
   Circular progress indicator (SVG).

   States: default | complete | indeterminate
   ============================================================ */

function ProgressRing({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 5,
  color = Color.accent,
  trackColor = 'rgba(255,255,255,0.06)',
  animated = false,
  children,
  style,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const isComplete = pct >= 100;

  return React.createElement('div', {
    style: merge({ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }, style),
    role: 'progressbar',
    'aria-valuenow': Math.round(pct),
    'aria-valuemin': 0,
    'aria-valuemax': 100,
  },
    React.createElement('svg', {
      width: size, height: size,
      style: { position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' },
    },
      React.createElement('circle', {
        cx: size / 2, cy: size / 2, r,
        fill: 'none', stroke: trackColor, strokeWidth,
      }),
      React.createElement('circle', {
        cx: size / 2, cy: size / 2, r,
        fill: 'none',
        stroke: isComplete ? Color.green : color,
        strokeWidth,
        strokeDasharray: c,
        strokeDashoffset: offset,
        strokeLinecap: 'round',
        style: {
          transition: animated ? `stroke-dashoffset ${Duration.slow} ${Ease.default}, stroke ${Duration.normal} ${Ease.default}` : undefined,
        },
      }),
    ),
    children ? React.createElement('div', { style: { position: 'relative', textAlign: 'center' } }, children) : null,
  );
}


/* ============================================================
   8. METRIC DISPLAY
   ============================================================
   Large numeral with optional label and unit.
   The hero pattern of the design system.

   Sizes: lg | md | sm
   Tones: default | accent | green | red | mute
   ============================================================ */

const METRIC_TONES = {
  default: Color.text,
  accent:  Color.accent,
  green:   Color.green,
  red:     Color.red,
  mute:    Color.mute,
};

function MetricDisplay({
  value,
  unit,
  label,
  sublabel,
  size = 'md',
  tone = 'default',
  style,
}) {
  const numStyle = size === 'lg' ? Type.displayLg : size === 'sm' ? Type.displaySm : Type.displayMd;
  const color = METRIC_TONES[tone] || METRIC_TONES.default;

  return React.createElement('div', { style: merge({ display: 'flex', flexDirection: 'column', gap: 4 }, style) },
    label ? React.createElement('span', { style: merge(Type.labelMd, { color: Color.mute }) }, label) : null,
    React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 4 } },
      React.createElement('span', { style: merge(numStyle, { color }) }, value),
      unit ? React.createElement('span', {
        style: merge(Type.labelMd, { color: Color.mute, alignSelf: 'flex-start', marginTop: size === 'lg' ? 8 : 4 }),
      }, unit) : null,
    ),
    sublabel ? React.createElement('span', { style: merge(Type.dataSm, { color: Color.mute }) }, sublabel) : null,
  );
}


/* ============================================================
   9. EXPANDABLE PANEL
   ============================================================
   Collapsible content section.

   States: collapsed | expanded
   ============================================================ */

function ExpandablePanel({
  title,
  defaultOpen = false,
  variant = 'surface',
  children,
  style,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, open]);

  const chevron = React.createElement('svg', {
    width: 16, height: 16, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: {
      transform: `rotate(${open ? 90 : 0}deg)`,
      transition: `transform ${Duration.normal} ${Ease.default}`,
      flexShrink: 0,
    },
  }, React.createElement('polyline', { points: '9 18 15 12 9 6' }));

  return React.createElement(Card, {
    variant,
    padding: 0,
    style: merge({ overflow: 'hidden' }, style),
  },
    // Header (always visible, acts as toggle)
    React.createElement('button', {
      type: 'button',
      'aria-expanded': open,
      onClick: () => setOpen(o => !o),
      style: {
        display: 'flex', alignItems: 'center', gap: Space[3],
        width: '100%', padding: `${Space[4]}px ${Space[5]}px`,
        background: 'none', border: 'none', cursor: 'pointer',
        color: Color.text, textAlign: 'left', outline: 'none',
        ...Type.labelMd,
      },
    },
      chevron,
      React.createElement('span', { style: { flex: 1 } }, title),
    ),
    // Content (animated height)
    React.createElement('div', {
      style: {
        maxHeight: open ? contentHeight + 40 : 0,
        overflow: 'hidden',
        transition: `max-height ${Duration.slow} ${Ease.default}`,
      },
    },
      React.createElement('div', {
        ref: contentRef,
        style: { padding: `0 ${Space[5]}px ${Space[5]}px` },
      }, children),
    ),
  );
}


/* ============================================================
   10. FILTER GROUP
   ============================================================
   Row of toggle buttons — only one active at a time.

   States per option: active | inactive | hover
   ============================================================ */

function FilterGroup({
  options,     // [{ value, label, count? }]
  value,       // currently active value
  onChange,
  size = 'md',
  style,
}) {
  return React.createElement('div', {
    role: 'radiogroup',
    style: merge({
      display: 'flex', gap: Space[1],
      padding: Space[1],
      background: 'rgba(255,255,255,0.03)',
      borderRadius: Radius.md,
    }, style),
  },
    options.map(opt => React.createElement(FilterGroupItem, {
      key: opt.value,
      label: opt.label,
      count: opt.count,
      active: opt.value === value,
      size,
      onClick: () => onChange(opt.value),
    }))
  );
}

const FilterGroupItem = memo(function FilterGroupItem({ label, count, active, size, onClick }) {
  const [hovered, setHovered] = useState(false);
  const s = size === 'sm' ? Type.labelSm : Type.labelMd;

  return React.createElement('button', {
    type: 'button',
    role: 'radio',
    'aria-checked': active,
    onClick,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    style: merge(
      s,
      {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: `${Space[2]}px ${Space[3]}px`,
        borderRadius: Radius.sm + 2,
        border: 'none', outline: 'none',
        cursor: 'pointer',
        fontWeight: 500,
        transition: `background ${Duration.normal} ${Ease.default}, color ${Duration.normal} ${Ease.default}`,
      },
      active
        ? { background: 'rgba(255,255,255,0.08)', color: Color.text }
        : { background: 'transparent', color: Color.mute },
      !active && hovered && { background: 'rgba(255,255,255,0.04)', color: Color.dim },
    ),
  },
    label,
    count != null ? React.createElement('span', {
      style: merge(Type.dataSm, {
        color: active ? Color.accent : Color.faint,
        fontWeight: 600,
        minWidth: 16,
        textAlign: 'center',
      }),
    }, count) : null,
  );
});


/* ============================================================
   11. SECTION
   ============================================================
   Labeled content wrapper — structural grouping primitive.
   ============================================================ */

function Section({
  label,
  action,
  spacing = Space[5],
  children,
  style,
}) {
  const hasHeader = label || action;
  return React.createElement('div', {
    style: merge({ marginBottom: spacing }, style),
  },
    hasHeader ? React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: Space[3],
      },
    },
      label ? React.createElement('span', { style: merge(Type.labelMd, { color: Color.mute }) }, label) : null,
      action || null,
    ) : null,
    children,
  );
}


/* ============================================================
   12. STEP INDICATOR / TIMELINE
   ============================================================
   Vertical or horizontal step sequence.

   Step states: done | active | upcoming | skipped
   ============================================================ */

const STEP_STYLES = {
  done:     { ring: Color.accent, fill: Color.accent, text: Color.dim,  line: Color.accent },
  active:   { ring: Color.accent, fill: 'transparent', text: Color.text, line: Color.border },
  upcoming: { ring: Color.faint,  fill: 'transparent', text: Color.mute, line: Color.border },
  skipped:  { ring: Color.faint,  fill: 'transparent', text: Color.faint, line: Color.borderSoft },
};

function StepIndicator({
  steps,       // [{ label, sublabel?, state: 'done'|'active'|'upcoming'|'skipped' }]
  children,    // optional render prop: (step, index) => node (for expandable active step)
  style,
}) {
  return React.createElement('div', {
    role: 'list',
    style: merge({ display: 'flex', flexDirection: 'column' }, style),
  },
    steps.map((step, i) => {
      const s = STEP_STYLES[step.state] || STEP_STYLES.upcoming;
      const isLast = i === steps.length - 1;

      return React.createElement('div', {
        key: i,
        role: 'listitem',
        style: { display: 'flex', gap: Space[3], position: 'relative' },
      },
        // Rail (ring + line)
        React.createElement('div', {
          style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 },
        },
          // Ring
          React.createElement('div', {
            style: {
              width: 20, height: 20, borderRadius: Radius.full,
              border: `2px solid ${s.ring}`,
              background: s.fill,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
            },
          },
            step.state === 'done' ? React.createElement('svg', {
              width: 10, height: 10, viewBox: '0 0 24 24',
              fill: 'none', stroke: '#1a0f0a', strokeWidth: 3,
              strokeLinecap: 'round', strokeLinejoin: 'round',
            }, React.createElement('polyline', { points: '20 6 9 17 4 12' })) : null,
            step.state === 'active' ? React.createElement('div', {
              style: {
                width: 8, height: 8, borderRadius: Radius.full,
                background: Color.accent,
                animation: 'aurevion-pulse 2s ease-in-out infinite',
              },
            }) : null,
          ),
          // Connector line
          !isLast ? React.createElement('div', {
            style: {
              width: 1.5, flex: 1, minHeight: 16,
              background: s.line,
            },
          }) : null,
        ),
        // Content
        React.createElement('div', {
          style: { paddingBottom: isLast ? 0 : Space[4], flex: 1, minWidth: 0, paddingTop: 1 },
        },
          React.createElement('div', { style: merge(Type.bodyMd, { color: s.text, fontWeight: step.state === 'active' ? 500 : 400 }) }, step.label),
          step.sublabel ? React.createElement('div', { style: merge(Type.dataSm, { color: Color.mute, marginTop: 2 }) }, step.sublabel) : null,
          // Render prop for expanded content (e.g. active step detail)
          children && step.state === 'active' ? React.createElement('div', { style: { marginTop: Space[3] } }, children(step, i)) : null,
        ),
      );
    })
  );
}


/* ============================================================
   13. AVATAR
   ============================================================
   Circular identity indicator.

   Sizes: sm (28) | md (40) | lg (56)
   Tones: neutral | warm | cool
   ============================================================ */

const AVATAR_TONES = {
  neutral: { background: Color.surface2, color: Color.dim },
  warm:    { background: Color.accentDim, color: Color.accent },
  cool:    { background: Color.blueDim, color: Color.blue },
};

function Avatar({ initials, image, tone = 'neutral', size = 40, style }) {
  const t = AVATAR_TONES[tone] || AVATAR_TONES.neutral;
  return React.createElement('div', {
    style: merge(
      {
        width: size, height: size, borderRadius: Radius.full,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: Font.mono, fontSize: size * 0.32, fontWeight: 600,
        letterSpacing: 0.5, textTransform: 'uppercase',
        flexShrink: 0, overflow: 'hidden',
      },
      t,
      image && {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'transparent',
      },
      style,
    ),
    'aria-hidden': true,
  }, !image ? initials : null);
}


/* ============================================================
   14. DIVIDER
   ============================================================
   Horizontal rule with optional label.
   ============================================================ */

function Divider({ label, inset = 0, style }) {
  if (label) {
    return React.createElement('div', {
      style: merge({
        display: 'flex', alignItems: 'center', gap: Space[3],
        margin: `${Space[4]}px 0`,
        marginLeft: inset,
      }, style),
    },
      React.createElement('div', { style: { flex: 1, height: 1, background: Color.borderSoft } }),
      React.createElement('span', { style: merge(Type.labelSm, { color: Color.faint }) }, label),
      React.createElement('div', { style: { flex: 1, height: 1, background: Color.borderSoft } }),
    );
  }
  return React.createElement('div', {
    role: 'separator',
    style: merge({ height: 1, background: Color.borderSoft, margin: `${Space[3]}px 0`, marginLeft: inset }, style),
  });
}


/* ============================================================
   15. TOOLTIP (hover-reveal)
   ============================================================
   Wraps any element with a positioned label on hover/focus.

   States: hidden | visible
   ============================================================ */

function Tooltip({ label, position = 'top', children }) {
  const [show, setShow] = useState(false);
  const posStyles = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%',    left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    left:   { right: '100%',  top: '50%',  transform: 'translateY(-50%)', marginRight: 6 },
    right:  { left: '100%',   top: '50%',  transform: 'translateY(-50%)', marginLeft: 6 },
  };

  return React.createElement('div', {
    style: { position: 'relative', display: 'inline-flex' },
    onPointerEnter: () => setShow(true),
    onPointerLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
  },
    children,
    show ? React.createElement('div', {
      role: 'tooltip',
      style: merge(
        Type.labelSm,
        {
          position: 'absolute',
          padding: '5px 8px',
          borderRadius: Radius.sm,
          background: Color.surface3,
          color: Color.text,
          border: `1px solid ${Color.border}`,
          boxShadow: Shadow.md,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
          animation: 'aurevion-fade-in 0.12s ease',
        },
        posStyles[position],
      ),
    }, label) : null,
  );
}


/* ============================================================
   16. EMPTY STATE
   ============================================================
   Placeholder for when there's no content.
   ============================================================ */

function EmptyState({ icon, title, description, action, style }) {
  return React.createElement('div', {
    style: merge({
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: `${Space[12]}px ${Space[5]}px`,
      textAlign: 'center',
      gap: Space[3],
    }, style),
  },
    icon ? React.createElement('div', { style: { color: Color.faint, marginBottom: Space[2] } }, icon) : null,
    title ? React.createElement('div', { style: merge(Type.headingMd, { color: Color.dim }) }, title) : null,
    description ? React.createElement('div', { style: merge(Type.bodySm, { color: Color.mute, maxWidth: 280 }) }, description) : null,
    action ? React.createElement('div', { style: { marginTop: Space[3] } }, action) : null,
  );
}


/* ============================================================
   17. SKELETON
   ============================================================
   Loading placeholder.

   Shapes: text | circle | rect
   ============================================================ */

const SKELETON_CSS_ID = '__aurevion-skeleton-css';
if (!document.getElementById(SKELETON_CSS_ID)) {
  const s = document.createElement('style');
  s.id = SKELETON_CSS_ID;
  s.textContent = `
    @keyframes aurevion-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(s);
}

function Skeleton({ width, height, circle = false, radius, style }) {
  return React.createElement('div', {
    'aria-hidden': true,
    style: merge({
      width: circle ? (height || 40) : (width || '100%'),
      height: height || 14,
      borderRadius: circle ? Radius.full : (radius || Radius.sm),
      background: `linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)`,
      backgroundSize: '200% 100%',
      animation: 'aurevion-shimmer 1.5s ease-in-out infinite',
    }, style),
  });
}


/* ============================================================
   Export all components
   ============================================================ */

Object.assign(window, {
  // Layout
  Card,
  Section,
  Divider,
  Row,

  // Actions
  Button,
  IconButton,
  FilterGroup,

  // Data display
  Tag,
  MetricDisplay,
  ProgressBar,
  ProgressRing,
  StepIndicator,
  Avatar,
  Tooltip,

  // Disclosure
  ExpandablePanel,

  // Feedback
  EmptyState,
  Skeleton,
});
