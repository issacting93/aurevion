/* ============================================================
   Aurevion Design Tokens — Single source of truth
   ============================================================
   Usage: include via <script> before any component files.
   All values exported on `window` for cross-file access.
   ============================================================ */

// ── Colour ──────────────────────────────────────────────────

const Color = Object.freeze({
  // Backgrounds
  bg:         '#000',
  surface:    '#0d0d0d',
  surface2:   '#161616',
  surface3:   '#1e1e1e',

  // Text
  text:       '#fafafa',
  dim:        '#a1a1a1',
  mute:       '#6b6b6b',
  faint:      '#3a3a3a',

  // Borders
  border:     'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.04)',

  // Brand
  accent:     '#FF6E50',
  accentHot:  '#FF5A1F',
  accentDim:  'rgba(255,110,80,0.15)',
  accentFaint:'rgba(255,110,80,0.06)',

  // Semantic
  green:      '#4ade80',
  greenDim:   'rgba(74,222,128,0.15)',
  red:        '#f87171',
  redDim:     'rgba(248,113,113,0.15)',
  blue:       '#60a5fa',
  blueDim:    'rgba(96,165,250,0.15)',
});

// ── Typography ──────────────────────────────────────────────

const Font = Object.freeze({
  sans: '"Geist", -apple-system, system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
});

// ── Spacing ─────────────────────────────────────────────────

const Space = Object.freeze({
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
});

// ── Radii ───────────────────────────────────────────────────

const Radius = Object.freeze({
  none: 0,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  '2xl':20,
  full: 9999,
});

// ── Shadows ─────────────────────────────────────────────────

const Shadow = Object.freeze({
  sm:   '0 1px 2px rgba(0,0,0,0.4)',
  md:   '0 2px 8px rgba(0,0,0,0.4)',
  lg:   '0 4px 24px rgba(0,0,0,0.5)',
  glow: `0 0 20px ${Color.accentDim}`,
});

// ── Transitions ─────────────────────────────────────────────

const Duration = Object.freeze({
  fast:   '0.1s',
  normal: '0.15s',
  slow:   '0.25s',
  morph:  '0.4s',
});

const Ease = Object.freeze({
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  out:     'cubic-bezier(0, 0, 0.2, 1)',
});

// ── Typography presets ──────────────────────────────────────

const Type = Object.freeze({
  // Display — large numerals
  displayLg: { fontFamily: Font.sans, fontSize: 56, fontWeight: 200, letterSpacing: -56 * 0.028, lineHeight: 1 },
  displayMd: { fontFamily: Font.sans, fontSize: 40, fontWeight: 200, letterSpacing: -40 * 0.028, lineHeight: 1 },
  displaySm: { fontFamily: Font.sans, fontSize: 28, fontWeight: 300, letterSpacing: -28 * 0.02,  lineHeight: 1.1 },

  // Headings
  headingLg: { fontFamily: Font.sans, fontSize: 22, fontWeight: 500, letterSpacing: -0.5,  lineHeight: 1.2 },
  headingMd: { fontFamily: Font.sans, fontSize: 17, fontWeight: 500, letterSpacing: -0.3,  lineHeight: 1.3 },
  headingSm: { fontFamily: Font.sans, fontSize: 15, fontWeight: 500, letterSpacing: -0.2,  lineHeight: 1.3 },

  // Body
  bodyLg:    { fontFamily: Font.sans, fontSize: 15, fontWeight: 400, letterSpacing: 0,     lineHeight: 1.5 },
  bodyMd:    { fontFamily: Font.sans, fontSize: 13, fontWeight: 400, letterSpacing: 0,     lineHeight: 1.45 },
  bodySm:    { fontFamily: Font.sans, fontSize: 12, fontWeight: 400, letterSpacing: 0,     lineHeight: 1.4 },

  // Labels — mono, uppercase, structural
  labelLg:   { fontFamily: Font.mono, fontSize: 12, fontWeight: 500, letterSpacing: 1.4, lineHeight: 1, textTransform: 'uppercase' },
  labelMd:   { fontFamily: Font.mono, fontSize: 10, fontWeight: 500, letterSpacing: 1.2, lineHeight: 1, textTransform: 'uppercase' },
  labelSm:   { fontFamily: Font.mono, fontSize:  9, fontWeight: 500, letterSpacing: 1.0, lineHeight: 1, textTransform: 'uppercase' },

  // Data — mono, normal case
  dataLg:    { fontFamily: Font.mono, fontSize: 14, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3 },
  dataMd:    { fontFamily: Font.mono, fontSize: 12, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3 },
  dataSm:    { fontFamily: Font.mono, fontSize: 10, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3 },
});

// ── Inject global styles (focus rings, scrollbars, animations) ──

const SYSTEM_CSS_ID = '__aurevion-system-css';
if (!document.getElementById(SYSTEM_CSS_ID)) {
  const style = document.createElement('style');
  style.id = SYSTEM_CSS_ID;
  style.textContent = `
    /* Focus ring — keyboard only */
    :focus-visible {
      outline: 2px solid ${Color.accent};
      outline-offset: 2px;
    }
    :focus:not(:focus-visible) {
      outline: none;
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${Color.border}; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Keyframes */
    @keyframes aurevion-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes aurevion-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes aurevion-fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// ── Export ───────────────────────────────────────────────────

Object.assign(window, { Color, Font, Space, Radius, Shadow, Duration, Ease, Type });
