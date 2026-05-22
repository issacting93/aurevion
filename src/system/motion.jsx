/* ============================================================
   Aurevion Motion System — Micro-interaction & transition layer
   ============================================================

   PRINCIPLES
   ──────────
   1. PURPOSEFUL — Motion communicates state change, not decoration.
      Every animation answers: "what changed and where should I look?"

   2. FAST ENTRANCE, INVISIBLE EXIT — Enter: 250–350ms with deceleration.
      Exit: 150–180ms with acceleration. Users notice slow entrances
      but rarely notice fast exits.

   3. STAGGER FOR HIERARCHY — Groups of elements enter sequentially
      (30–50ms offset) to create a reading order. Never stagger more
      than 8 items; batch the rest.

   4. SPATIAL CONTINUITY — Elements enter from the direction they
      logically originate. Forward navigation slides left; backward
      slides right. New content rises from below.

   5. SPRING FOR INTERACTION, EASE-OUT FOR LAYOUT — Interactive
      feedback (buttons, toggles) uses spring curves for physicality.
      Layout shifts use deceleration curves for calm.

   6. RESPECT MOTION PREFERENCES — All motion respects
      prefers-reduced-motion. Reduced mode: instant opacity, no transform.

   TIMING HIERARCHY
   ────────────────
   Micro (hover, press):       80–120ms   Ease.default
   State change (toggle, tab): 150–200ms  Ease.out
   Entrance (section appear):  250–350ms  Ease.out / Ease.spring
   Morph (layout transform):   350–450ms  Ease.spring
   Page transition:            280–380ms  Ease.out (staggered)

   EASING REFERENCE
   ────────────────
   Ease.default  = cubic-bezier(0.4, 0, 0.2, 1)   — standard
   Ease.out      = cubic-bezier(0, 0, 0.2, 1)     — decelerate (enter)
   Ease.spring   = cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot
   Ease.enter    = cubic-bezier(0.0, 0.0, 0.2, 1) — page enter
   Ease.exit     = cubic-bezier(0.4, 0.0, 1, 1)   — page exit

   ============================================================ */

// ── Extended easing (supplement tokens.jsx) ─────────────────

const MotionEase = Object.freeze({
  ...((typeof Ease !== 'undefined') ? Ease : {}),
  enter:    'cubic-bezier(0.0, 0.0, 0.2, 1)',
  exit:     'cubic-bezier(0.4, 0.0, 1, 1)',
  spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce:   'cubic-bezier(0.34, 1.3, 0.64, 1)',
});

const MotionDuration = Object.freeze({
  micro:    80,
  fast:     120,
  normal:   200,
  enter:    300,
  morph:    400,
  page:     340,
  stagger:  40,   // per-item offset
});

// ── Page Entrance ───────────────────────────────────────────
// Auto-runs on DOMContentLoaded. The whole page body fades + rises in.

function initPageEntrance() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(6px)';
  document.body.style.transition = `opacity ${MotionDuration.page}ms ${MotionEase.enter}, transform ${MotionDuration.page}ms ${MotionEase.enter}`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    });
  });
}

// ── Page Exit (for link navigation) ─────────────────────────
// Intercepts internal link clicks and performs a smooth exit before navigating.

function initPageExit() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Only intercept internal navigation (same origin, no # anchors, no target)
    if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

    e.preventDefault();

    document.body.style.transition = `opacity ${MotionDuration.fast + 60}ms ${MotionEase.exit}, transform ${MotionDuration.fast + 60}ms ${MotionEase.exit}`;
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-4px)';

    setTimeout(() => {
      window.location.href = href;
    }, MotionDuration.fast + 80);
  });
}

// ── Section Stagger on Scroll (Intersection Observer) ───────
// Elements with [data-motion="stagger-in"] or class .motion-stagger
// will fade+rise when they enter the viewport.

function initSectionStagger() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = document.querySelectorAll('[data-motion="stagger-in"], .motion-stagger');
  if (!targets.length) return;

  targets.forEach(section => {
    const children = Array.from(section.children);
    children.forEach((child, i) => {
      if (prefersReduced) return;
      child.style.opacity = '0';
      child.style.transform = 'translateY(10px)';
      child.style.transition = `opacity ${MotionDuration.enter}ms ${MotionEase.enter} ${i * MotionDuration.stagger}ms, transform ${MotionDuration.enter}ms ${MotionEase.enter} ${i * MotionDuration.stagger}ms`;
    });
  });

  if (prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = Array.from(entry.target.children);
      children.forEach(child => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// ── React hooks & components (only defined when React is present) ──

var useStaggerEntrance, usePageTransition, MotionGroup;

if (typeof React !== 'undefined') {

  // useStaggerEntrance — staggered child entrance on mount
  useStaggerEntrance = function(itemCount, opts) {
    const { delay = 40, duration = 300, distance = 10 } = opts || {};
    const [revealed, setRevealed] = React.useState(false);

    React.useEffect(() => {
      const raf = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(raf);
    }, []);

    const getStyle = React.useCallback((index) => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return {};
      return {
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms ${MotionEase.enter} ${index * delay}ms, transform ${duration}ms ${MotionEase.enter} ${index * delay}ms`,
      };
    }, [revealed, delay, duration, distance]);

    return getStyle;
  };

  // usePageTransition — enter/exit state for route-like transitions
  usePageTransition = function(key) {
    const [state, setState] = React.useState('entering');
    const [displayKey, setDisplayKey] = React.useState(key);

    React.useEffect(() => {
      if (key !== displayKey) {
        setState('exiting');
        const timer = setTimeout(() => {
          setDisplayKey(key);
          setState('entering');
        }, MotionDuration.fast + 60);
        return () => clearTimeout(timer);
      }
    }, [key, displayKey]);

    React.useEffect(() => {
      if (state === 'entering') {
        const timer = setTimeout(() => setState('entered'), MotionDuration.enter);
        return () => clearTimeout(timer);
      }
    }, [state]);

    const style = React.useMemo(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return { opacity: 1 };
      switch (state) {
        case 'entering': return {
          opacity: 0, transform: 'translateY(8px)',
          transition: `opacity ${MotionDuration.enter}ms ${MotionEase.enter}, transform ${MotionDuration.enter}ms ${MotionEase.enter}`,
        };
        case 'entered': return {
          opacity: 1, transform: 'translateY(0)',
          transition: `opacity ${MotionDuration.enter}ms ${MotionEase.enter}, transform ${MotionDuration.enter}ms ${MotionEase.enter}`,
        };
        case 'exiting': return {
          opacity: 0, transform: 'translateY(-4px)',
          transition: `opacity ${MotionDuration.fast + 60}ms ${MotionEase.exit}, transform ${MotionDuration.fast + 60}ms ${MotionEase.exit}`,
        };
        default: return { opacity: 1 };
      }
    }, [state]);

    return { style, state, displayKey };
  };

  // MotionGroup — wraps children with staggered entrance
  // Usage: <MotionGroup stagger={40} distance={10}>{items.map(...)}</MotionGroup>
  MotionGroup = function({ children, stagger = 40, distance = 10, duration = 300, as = 'div', style = {}, ...rest }) {
    const items = React.Children.toArray(children);
    const getStyle = useStaggerEntrance(items.length, { delay: stagger, duration, distance });
    const Tag = as;
    return React.createElement(Tag, { style, ...rest },
      items.map((child, i) =>
        React.createElement('div', { key: child.key || i, style: getStyle(i) }, child)
      )
    );
  };
}

// ── CSS Keyframes injection ─────────────────────────────────

const MOTION_CSS_ID = '__aurevion-motion-css';
if (typeof document !== 'undefined' && !document.getElementById(MOTION_CSS_ID)) {
  const style = document.createElement('style');
  style.id = MOTION_CSS_ID;
  style.textContent = `
    /* Page entrance */
    @keyframes aurevion-page-enter {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Section stagger entrance */
    @keyframes aurevion-section-enter {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Scale entrance (for cards, modals) */
    @keyframes aurevion-scale-enter {
      from { opacity: 0; transform: scale(0.96) translateY(4px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Slide from right (forward navigation) */
    @keyframes aurevion-slide-right {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* Slide from left (backward navigation) */
    @keyframes aurevion-slide-left {
      from { opacity: 0; transform: translateX(-16px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* Utility classes */
    .motion-enter {
      animation: aurevion-section-enter ${MotionDuration.enter}ms ${MotionEase.enter} both;
    }
    .motion-scale-enter {
      animation: aurevion-scale-enter ${MotionDuration.enter}ms ${MotionEase.enter} both;
    }
    .motion-slide-right {
      animation: aurevion-slide-right ${MotionDuration.enter}ms ${MotionEase.enter} both;
    }
    .motion-slide-left {
      animation: aurevion-slide-left ${MotionDuration.enter}ms ${MotionEase.enter} both;
    }

    /* Stagger delay utilities (for HTML pages) */
    .motion-delay-1 { animation-delay: ${MotionDuration.stagger * 1}ms; }
    .motion-delay-2 { animation-delay: ${MotionDuration.stagger * 2}ms; }
    .motion-delay-3 { animation-delay: ${MotionDuration.stagger * 3}ms; }
    .motion-delay-4 { animation-delay: ${MotionDuration.stagger * 4}ms; }
    .motion-delay-5 { animation-delay: ${MotionDuration.stagger * 5}ms; }
    .motion-delay-6 { animation-delay: ${MotionDuration.stagger * 6}ms; }
    .motion-delay-7 { animation-delay: ${MotionDuration.stagger * 7}ms; }
    .motion-delay-8 { animation-delay: ${MotionDuration.stagger * 8}ms; }

    /* Reduced motion override */
    @media (prefers-reduced-motion: reduce) {
      .motion-enter,
      .motion-scale-enter,
      .motion-slide-right,
      .motion-slide-left {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      [data-motion] > * {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// ── Auto-init for static HTML pages ─────────────────────────

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPageEntrance();
      initPageExit();
      initSectionStagger();
    });
  } else {
    initPageEntrance();
    initPageExit();
    initSectionStagger();
  }
}

// ── Export ───────────────────────────────────────────────────

const _motionExports = { MotionEase, MotionDuration, initSectionStagger };
if (typeof useStaggerEntrance === 'function') _motionExports.useStaggerEntrance = useStaggerEntrance;
if (typeof usePageTransition === 'function') _motionExports.usePageTransition = usePageTransition;
if (typeof MotionGroup === 'function') _motionExports.MotionGroup = MotionGroup;
Object.assign(window, _motionExports);
