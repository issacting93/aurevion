// ════════════════════════════════════════════════════════════
// 11 · Onboarding — 10-step fitness onboarding
// Tokens: Color, Font, Space, Radius, Duration, Ease, Type
// Components: FBtn, FIcon, FNum, FTexBar, FRing, FScale,
//             FLabel, FTag, FStagger, Phone, ErrorBoundary
// ════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import { Color, Font, Space, Radius, Duration, Ease, Type } from '../../ui/tokens'
import { useSpring, useTransitionLock, SpringPreset } from '../../ui/motion'
import { ICONS, FRing, FBtn, FIcon, FNum, FTexBar, FScale, FLabel, FTag, FStagger, Phone, ErrorBoundary } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import BodyPreview from '../../ui/BodyPreview'

function SegBar({ pct = 0, segments = 12, height = 28 }) {
  const lit = Math.round(segments * pct / 100)
  return (
    <div style={{ display: 'flex', gap: 3, height, alignItems: 'flex-end' }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderRadius: 2, background: i < lit ? Color.accent : 'rgba(255,255,255,0.08)', height: i < lit ? '100%' : '60%', transition: 'height 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s' }} />
      ))}
    </div>
  )
}

/* ── CSS (injected once) ────────────────────────────────── */

if (typeof document !== 'undefined' && !document.getElementById('ob-css')) {
  const s = document.createElement('style');
  s.id = 'ob-css';
  s.textContent = `
    @keyframes ob-slide-right {
      from { opacity: 0; transform: translateX(24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ob-slide-left {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ob-draw-path {
      0%   { stroke-dashoffset: 240; fill-opacity: 0; }
      50%  { stroke-dashoffset: 0;   fill-opacity: 0; }
      100% { stroke-dashoffset: 0;   fill-opacity: 1; }
    }
    @keyframes ob-bg-pulse {
      0%, 100% { fill: #FF6E50; }
      50%      { fill: #ff856c; }
    }
    .ob-fwd  { animation: ob-slide-right 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .ob-back { animation: ob-slide-left  0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @media (prefers-reduced-motion: reduce) {
      .ob-fwd, .ob-back { animation: none !important; opacity: 1 !important; transform: none !important; }
    }
  `;
  document.head.appendChild(s);
}

/* ── Shared constants ───────────────────────────────────── */

const OB_TOTAL_STEPS = 12;
const OB_GUTTER = `${Space[6]}px`;             // 24px
const OB_ACTIVITY_MULT = { sedentary: 1.2, moderate: 1.55, active: 1.9 };
const OB_GOAL_MOD = { lose: -480, build: 300, maintain: 0, recomp: -150 };

/* ── Goal & constraint taxonomies ──────────────────────── */

const OB_FITNESS_GOALS = [
  { section: 'Body Composition', items: [
    { val: 'hypertrophy',    label: 'Hypertrophy',    sub: 'Maximize muscle growth',     icon: ICONS.trend_up, caloricGoal: 'build' },
    { val: 'fat_loss',       label: 'Fat Loss',       sub: 'Reduce body fat percentage', icon: ICONS.trend_dn, caloricGoal: 'lose' },
    { val: 'recomposition',  label: 'Recomposition',  sub: 'Build muscle, lose fat',     icon: ICONS.swap,     caloricGoal: 'recomp' },
  ]},
  { section: 'Performance', items: [
    { val: 'max_strength',     label: 'Max Strength',     sub: 'Increase 1RM lifts',        icon: ICONS.dumb,   caloricGoal: 'build' },
    { val: 'cardio_endurance', label: 'Cardio Endurance', sub: 'Improve aerobic capacity',  icon: ICONS.flame,  caloricGoal: 'maintain' },
    { val: 'power',            label: 'Power',            sub: 'Explosive force production', icon: ICONS.play,   caloricGoal: 'build' },
    { val: 'agility',          label: 'Agility',          sub: 'Speed and coordination',     icon: ICONS.swap,   caloricGoal: 'maintain' },
  ]},
  { section: 'Functional Fitness', items: [
    { val: 'flexibility',      label: 'Flexibility',      sub: 'Range of motion and mobility', icon: ICONS.expand,  caloricGoal: 'maintain' },
    { val: 'balance',          label: 'Balance',          sub: 'Stability and proprioception', icon: ICONS.pause,   caloricGoal: 'maintain' },
    { val: 'overall_wellness', label: 'Overall Wellness', sub: 'General health and vitality',  icon: ICONS.sparkle, caloricGoal: 'maintain' },
  ]},
];

const OB_NUTRITION_GOALS = [
  { val: 'healthier_meals',  label: 'Healthier Meals',  sub: 'Improve food quality',    icon: ICONS.meal },
  { val: 'cook_more',        label: 'Cook More',        sub: 'Prepare meals at home',   icon: ICONS.pan },
  { val: 'improve_digestion',label: 'Improve Digestion',sub: 'Gut health and comfort',  icon: ICONS.bowl },
  { val: 'drink_water',      label: 'Drink More Water', sub: 'Stay hydrated daily',     icon: ICONS.fire },
  { val: 'save_money',       label: 'Save Money',       sub: 'Reduce food spending',    icon: ICONS.chart },
];

const OB_DIETARY_OPTIONS = [
  'Gluten Free','Dairy Free','Nut Free','Vegetarian','Vegan','Halal',
  'Kosher','Shellfish Allergy','Soy Free','Egg Free','Low FODMAP','Pescatarian',
];

const OB_EQUIPMENT_OPTIONS = [
  { val: 'full_gym',    label: 'Full Gym',         sub: 'Barbell, machines, cables' },
  { val: 'home_basic',  label: 'Home (Basic)',      sub: 'Dumbbells and a bench' },
  { val: 'home_full',   label: 'Home (Full)',       sub: 'Rack, barbell, dumbbells' },
  { val: 'bodyweight',  label: 'Bodyweight Only',   sub: 'No equipment needed' },
  { val: 'bands',       label: 'Resistance Bands',  sub: 'Portable band set' },
];

const OB_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const OB_INJURY_OPTIONS = ['Knees','Shoulders','Lower Back','Wrists','Hips','None'];
const OB_GLYPH_R = 'M19.9152 34.9523C19.7386 34.9042 19.616 34.743 19.616 34.559L19.616 22.9266C19.616 22.7016 19.7973 22.5192 20.021 22.5192H22.4509C22.6745 22.5192 22.8559 22.7016 22.8559 22.9266V28.5167C22.8559 28.8954 23.3245 29.0692 23.5689 28.7812L29.2786 22.0511C29.3556 21.9604 29.4681 21.9082 29.5867 21.9082H32.3914C32.7212 21.9082 32.9127 22.2834 32.7205 22.553L23.3987 35.6264C23.3003 35.7645 23.1269 35.8266 22.9638 35.7822L19.9152 34.9523Z';
const OB_GLYPH_L = 'M9.60841 23.0191C9.29717 23.0191 9.10226 22.6806 9.25711 22.4091L18.3802 6.40847C18.4687 6.25331 18.6475 6.17435 18.8209 6.21381L22.5402 7.05996C22.7248 7.10196 22.8558 7.26694 22.8558 7.4573L22.8558 26.2342C22.8558 26.4011 22.7546 26.5511 22.6004 26.6128L20.1705 27.584C19.9046 27.6903 19.616 27.4933 19.616 27.2054V21.8042C19.616 21.5764 19.4303 21.3929 19.2039 21.3969L14.6125 21.4775C14.5256 21.4791 14.4415 21.5087 14.3727 21.562L12.5986 22.9346C12.5278 22.9894 12.441 23.0191 12.3516 23.0191H9.60841ZM19.5311 12.8761C19.5365 12.4416 18.9523 12.3017 18.7624 12.692L16.3969 17.5548C16.2653 17.8255 16.4612 18.1413 16.7607 18.1413L19.0665 18.1413C19.2882 18.1413 19.4687 17.9619 19.4714 17.7389L19.5311 12.8761Z';

/* ── Nutrition math ─────────────────────────────────────── */

export function computeTDEE(data) {
  const mult = OB_ACTIVITY_MULT[data.activityLevel] || 1.5;
  const age  = data.birthYear ? (2026 - data.birthYear) : 25;
  const w = data.weight || 70;
  const h = data.height || 175;
  const bmr = data.sex === 'female'
    ? 447.593 + 9.247 * w + 3.098 * h - 4.330 * age
    : 88.362  + 13.397 * w + 4.799 * h - 5.677 * age;
  return Math.round(bmr * mult);
}

export function computeMacros(data) {
  const tdee   = computeTDEE(data);
  const target = tdee + (OB_GOAL_MOD[data.goal] || 0);
  const w       = data.weight || 70;
  const protein = Math.round(w * 2);
  const fatCals = Math.round(target * 0.25);
  const fat     = Math.round(fatCals / 9);
  const carbs   = Math.round((target - protein * 4 - fatCals) / 4);
  return { tdee, target, protein, fat, carbs };
}

/* ── Logo marks ─────────────────────────────────────────── */

export function AurevionMark({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="21" fill={Color.accent}/>
      <path fill="#131316" d={OB_GLYPH_R}/>
      <path fill="#131316" d={OB_GLYPH_L}/>
    </svg>
  );
}

let _obmId = 0;
export function AurevionMarkAnimated({ size = 64, animate = true }) {
  const [id] = useState(() => 'avm' + (++_obmId));
  const drawCss = 'animation: ob-draw-path 2s cubic-bezier(0.16, 1, 0.3, 1)';
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <style>{`
        .ob-bg-${id} { ${animate ? 'animation: ob-bg-pulse 6s ease-in-out infinite;' : ''} }
        .ob-gl-${id} { stroke:#131316; stroke-width:0.3; stroke-dasharray:240; stroke-dashoffset:240; fill-opacity:0;
          ${animate ? `${drawCss} forwards;` : 'stroke-dashoffset:0; fill-opacity:1;'} }
        .ob-gr-${id} { stroke:#131316; stroke-width:0.3; stroke-dasharray:240; stroke-dashoffset:240; fill-opacity:0;
          ${animate ? `${drawCss} 0.3s forwards;` : 'stroke-dashoffset:0; fill-opacity:1;'} }
      `}</style>
      <circle className={`ob-bg-${id}`} cx="21" cy="21" r="21" fill={Color.accent}/>
      <path className={`ob-gr-${id}`} fill="#131316" d={OB_GLYPH_R}/>
      <path className={`ob-gl-${id}`} fill="#131316" d={OB_GLYPH_L}/>
    </svg>
  );
}

/* Jewel ring — wraps logo on Welcome and Ready */
function JewelRing({ size = 80, children }) {
  return (
    <div className="aurevion-jewel-icon" style={{
      position: 'relative', width: size, height: size, borderRadius: Radius.full,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="aurevion-jewel-face" style={{
        position: 'relative', width: 'calc(100% - 7px)', height: 'calc(100% - 7px)',
        borderRadius: Radius.full,
        background: 'radial-gradient(circle at 50% 30%, #2a2a2d 0%, #131316 55%, #0a0a0b 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 5px rgba(0,0,0,0.7)'
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── Shared onboarding primitives ───────────────────────── */

function OBProgress({ current, total }) {
  return (
    <div style={{ padding: `0 ${OB_GUTTER}`, marginBottom: Space[1] }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: Radius.sm,
            background: i <= current ? Color.accent : Color.borderSoft,
            transition: `background ${Duration.slow} ${Ease.out}`
          }}/>
        ))}
      </div>
    </div>
  );
}

function OBNav({ title, onBack }) {
  return (
    <div style={{
      padding: `${Space[3]}px ${OB_GUTTER} ${Space[2]}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
    }}>
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: Radius.full, border: 'none',
        background: Color.borderSoft, color: Color.text,
        cursor: 'pointer', display: 'grid', placeItems: 'center',
        transition: `background ${Duration.fast} ease, transform ${Duration.fast} ${Ease.spring}`
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FIcon path={ICONS.back} size={16} stroke={2}/>
      </button>
      <div style={{ ...Type.labelMd, color: Color.mute }}>{title}</div>
      <div style={{ width: 36 }}/>
    </div>
  );
}

function OBQuestion({ children, sub }) {
  return (
    <div style={{ padding: `0 ${OB_GUTTER}`, marginTop: Space[2] }}>
      <div style={{ ...Type.headingLg, fontSize: 26, letterSpacing: -0.5, color: Color.text }}>
        {children}
      </div>
      {sub && <div style={{ ...Type.bodyLg, fontSize: 14, color: Color.dim, marginTop: Space[2] }}>
        {sub}
      </div>}
    </div>
  );
}

function OBNextBtn({ onClick, disabled, label = 'Next' }) {
  return (
    <div style={{ padding: `${Space[4]}px ${OB_GUTTER} ${Space[5]}px`, flexShrink: 0 }}>
      <FBtn variant="primary" full disabled={disabled} onClick={onClick}
            size="lg" labelStyle="mono">{label}</FBtn>
    </div>
  );
}

/* Step layout wrapper — every step uses this */
function OBStep({ children }) {
  return <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>;
}

/* Scrollable body area */
function OBBody({ children, scroll, style }) {
  return (
    <div style={{
      flex: 1, minHeight: 0, padding: `${Space[3]}px ${OB_GUTTER}`,
      ...(scroll && { overflowY: 'auto' }),
      display: 'flex', flexDirection: 'column',
      ...style
    }}>{children}</div>
  );
}

/* Card-shaped surface */
function OBSurface({ children, style }) {
  return (
    <div style={{
      padding: `${Space[4]}px ${Space[5]}px`, borderRadius: Radius.xl,
      background: Color.surface, border: `1px solid ${Color.border}`,
      ...style
    }}>{children}</div>
  );
}

/* Selection card with spring bounce + unified selected state */
function OBCard({ selected, onClick, icon, label, sub }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: `${Space[4]}px ${Space[4]}px`, borderRadius: Radius.xl,
      background: selected ? Color.accentFaint : Color.surface,
      border: `2px solid ${selected ? Color.accent : Color.border}`,
      color: Color.text, display: 'flex', alignItems: 'center', gap: Space[3],
      transition: `border-color ${Duration.normal} ease, background ${Duration.normal} ease, transform ${Duration.fast} ${Ease.spring}`,
      fontFamily: Font.sans,
      transform: pressed ? 'scale(0.97)' : 'scale(1)',
      position: 'relative', zIndex: pressed ? 2 : selected ? 1 : 0,
    }}
    onPointerDown={() => setPressed(true)}
    onPointerUp={() => setPressed(false)}
    onPointerLeave={() => setPressed(false)}
    >
      {icon && <div style={{
        width: 36, height: 36, borderRadius: Radius.lg - 2,
        background: selected ? Color.accentDim : Color.borderSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: `background ${Duration.normal} ease`
      }}>
        {typeof icon === 'string' ? <span style={{ fontSize: 18 }}>{icon}</span> : icon}
      </div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...Type.headingSm }}>{label}</div>
        {sub && <div style={{ ...Type.bodySm, color: Color.dim, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: Radius.full, flexShrink: 0,
        border: selected ? 'none' : `2px solid ${Color.faint}`,
        background: selected ? Color.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `all ${Duration.normal} ${Ease.spring}`
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: Radius.full, background: Color.accentText }}/>}
      </div>
    </button>
  );
}

/* Compact grid button — used in Activity freq + Experience level grids */
function OBGridBtn({ selected, onClick, children, mono }) {
  return (
    <button onClick={onClick} style={{
      padding: `${Space[3]}px ${Space[2]}px`, borderRadius: Radius.lg, cursor: 'pointer',
      background: selected ? Color.accentFaint : Color.surface,
      border: `2px solid ${selected ? Color.accent : Color.border}`,
      color: selected && mono ? Color.accent : Color.text,
      fontFamily: mono ? Font.mono : Font.sans,
      fontSize: 13, fontWeight: mono ? 600 : 500,
      letterSpacing: mono ? 0.8 : 0, textAlign: 'center',
      transition: `all ${Duration.normal} ${Ease.spring}`,
      position: 'relative', zIndex: selected ? 1 : 0,
    }}>{children}</button>
  );
}

/* Unit toggle pill */
function OBUnitToggle({ options, value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', borderRadius: Radius.full, overflow: 'hidden',
      border: `1px solid ${Color.border}`
    }}>
      {options.map(u => (
        <button key={u.value} onClick={() => onChange(u.value)} style={{
          padding: `${Space[2]}px ${Space[5]}px`, border: 'none', cursor: 'pointer',
          ...Type.labelMd,
          background: value === u.value ? Color.accent : 'transparent',
          color: value === u.value ? Color.accentText : Color.dim,
          fontWeight: 600, transition: `all ${Duration.normal} ease`
        }}>{u.label}</button>
      ))}
    </div>
  );
}

/* Info bubble — used on TDEE screen */
function OBBubble({ accent, children }) {
  return (
    <div style={{
      padding: `${Space[3]}px ${Space[4]}px`, borderRadius: Radius.xl,
      background: accent ? Color.accentFaint : Color.surface,
      border: `1px solid ${accent ? Color.accentDim : Color.border}`,
      ...Type.bodyMd, fontSize: accent ? 13 : 14, lineHeight: 1.6, color: Color.dim,
      animation: 'fStaggerIn 0.3s ease both'
    }}>{children}</div>
  );
}

/* Slider with FTexBar track — uses pointer events instead of native range
   to work correctly inside CSS-transformed (scaled) containers.
   Optional `ticks` prop: { count, majorEvery } renders tick marks above the bar. */
function OBSlider({ min, max, step, value, onChange, ticks }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const pct = ((value - min) / (max - min)) * 100;
  const smoothPct = useSpring(pct, SpringPreset.stiff);

  const resolve = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let raw = min + p * (max - min);
    if (step) raw = Math.round(raw / step) * step;
    else raw = Math.round(raw);
    onChange(Math.max(min, Math.min(max, raw)));
  };

  const onDown = (e) => {
    dragging.current = true;
    resolve(e.clientX);
    const onMove = (ev) => { if (dragging.current) resolve(ev.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={onDown}
      style={{ position: 'relative', cursor: 'pointer', touchAction: 'none',
               height: ticks ? 52 : 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
    >
      {/* Tick marks (optional) */}
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 20, marginBottom: Space[1], pointerEvents: 'none' }}>
          {Array.from({ length: ticks.count }, (_, i) => {
            const tickPct = i / (ticks.count - 1);
            const thumbPct = (value - min) / (max - min);
            const dist = Math.abs(tickPct - thumbPct);
            const active = dist < 0.07;
            return (
              <div key={i} style={{
                width: 1, height: i % (ticks.majorEvery || 6) === 0 ? 16 : 8,
                background: active ? Color.accent : Color.faint,
                opacity: active ? Math.max(0.4, 1 - dist / 0.07) : 1,
                transition: `background ${Duration.normal} ease, opacity ${Duration.normal} ease`
              }}/>
            );
          })}
        </div>
      )}
      {/* Bar + thumb */}
      <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0 }}>
          <FTexBar pct={pct} height={6} animate={false}/>
        </div>
        <div style={{
          position: 'absolute', top: '50%',
          left: `${smoothPct}%`,
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: Color.accent,
          boxShadow: '0 0 8px rgba(255,110,80,0.3)',
          pointerEvents: 'none',
        }}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 0 · Welcome
   ══════════════════════════════════════════════════════════ */

export function OB_Welcome({ onNext }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 1800); return () => clearTimeout(t); }, []);

  const fade = (delay, extra) => ({
    opacity: ready ? 1 : 0, transition: `opacity 0.4s ease ${delay}s`,
    ...extra
  });

  return (
    <OBStep>
      <div style={{ flex: 1, padding: `60px 28px ${OB_GUTTER}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: Space[7] }}>
          <JewelRing size={80}>
            <AurevionMarkAnimated size={42}/>
          </JewelRing>
          <div>
            <div style={{
              fontFamily: Font.sans, fontSize: 44, fontWeight: 200,
              letterSpacing: -1.4, lineHeight: 1, color: Color.text, marginBottom: Space[3],
              ...fade(0.2, {
                transform: ready ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
              })
            }}>
              YOUR BODY.<br/>YOUR DATA.
            </div>
            <div style={{ ...Type.labelMd, letterSpacing: 2, color: Color.accent, ...fade(0.5) }}>
              AUREVI0N
            </div>
          </div>
          <div style={{ ...Type.bodyLg, color: Color.dim, maxWidth: 300, ...fade(0.7) }}>
            Nutrition, training, and body composition — tracked with precision, not guesswork.
          </div>
        </div>
      </div>
      <div style={{
        padding: `0 ${OB_GUTTER} ${Space[2]}px`,
        ...fade(0.9, {
          transform: ready ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.4s ease 0.9s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s'
        })
      }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd} onClick={onNext}>Get Started</FBtn>
      </div>
      <div style={{ padding: `${Space[2]}px ${OB_GUTTER} ${Space[5]}px`, textAlign: 'center', ...fade(1.1) }}>
        <button style={{
          background: 'transparent', border: 'none', color: Color.dim, padding: 0,
          ...Type.labelMd, cursor: 'pointer'
        }}>I already have an account</button>
      </div>
      <div style={{ padding: `0 ${OB_GUTTER} ${Space[2]}px`, textAlign: 'center', ...fade(1.2, { opacity: ready ? 0.4 : 0 }) }}>
        <span style={{ ...Type.labelSm, color: Color.mute }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </span>
      </div>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 1 · Sex
   ══════════════════════════════════════════════════════════ */

export function OB_Sex({ onNext, onBack, data, setData }) {
  return (
    <OBStep>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={0} total={OB_TOTAL_STEPS}/>
      <OBBody>
        <OBQuestion>What is your sex?</OBQuestion>
        <FStagger delay={60}>
          <div style={{ marginTop: OB_GUTTER, display: 'flex', flexDirection: 'column', gap: Space[3] }}>
            <OBCard selected={data.sex === 'female'} onClick={() => setData({ ...data, sex: 'female' })}
              icon="&#9792;" label="Female"/>
            <OBCard selected={data.sex === 'male'} onClick={() => setData({ ...data, sex: 'male' })}
              icon="&#9794;" label="Male"/>
          </div>
        </FStagger>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={!data.sex}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 2 · Birthday
   ══════════════════════════════════════════════════════════ */

export function OB_Birthday({ onNext, onBack, data, setData }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [month, setMonth] = useState(data.birthMonth || 5);
  const [day, setDay]     = useState(data.birthDay || 15);
  const [year, setYear]   = useState(data.birthYear || 2000);

  useEffect(() => {
    setData({ ...data, birthMonth: month, birthDay: day, birthYear: year });
  }, [month, day, year]);

  function ScrollColumn({ items, value, onChange }) {
    const idx = items.indexOf(value);
    const slice = [];
    for (let i = idx - 2; i <= idx + 2; i++) {
      slice.push(i >= 0 && i < items.length ? { val: items[i], off: i - idx } : { val: null, off: i - idx });
    }
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {slice.map((item, i) => {
          const centre = item.off === 0;
          const dist = Math.abs(item.off);
          return (
            <button key={i} onClick={() => item.val != null && onChange(item.val)} style={{
              background: 'transparent', border: 'none',
              cursor: item.val != null ? 'pointer' : 'default',
              padding: '10px 0', width: '100%', textAlign: 'center',
              fontFamily: Font.sans, fontSize: centre ? 22 : 18,
              fontWeight: centre ? 600 : 400,
              color: item.val == null ? 'transparent' : centre ? Color.text : dist === 1 ? Color.mute : Color.faint,
              transition: `all ${Duration.normal} ${Ease.spring}`
            }}>
              {item.val ?? '-'}
            </button>
          );
        })}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 44,
          transform: 'translateY(-50%)', pointerEvents: 'none',
          borderTop: `1px solid ${Color.border}`, borderBottom: `1px solid ${Color.border}`
        }}/>
        <button onClick={() => { const i = items.indexOf(value); if (i > 0) onChange(items[i - 1]); }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'transparent', border: 'none', cursor: 'pointer' }}/>
        <button onClick={() => { const i = items.indexOf(value); if (i < items.length - 1) onChange(items[i + 1]); }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'transparent', border: 'none', cursor: 'pointer' }}/>
      </div>
    );
  }

  return (
    <OBStep>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={1} total={OB_TOTAL_STEPS}/>
      <OBBody>
        <OBQuestion>When were you born?</OBQuestion>
        <div style={{ marginTop: Space[10], display: 'flex', height: 220 }}>
          <ScrollColumn items={months} value={months[month]} onChange={v => setMonth(months.indexOf(v))}/>
          <ScrollColumn items={Array.from({ length: 31 }, (_, i) => i + 1)} value={day} onChange={setDay}/>
          <ScrollColumn items={Array.from({ length: 80 }, (_, i) => 2010 - i)} value={year} onChange={setYear}/>
        </div>
      </OBBody>
      <OBNextBtn onClick={onNext}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 3 · Height + Weight
   ══════════════════════════════════════════════════════════ */

export function OB_BodyMetrics({ onNext, onBack, data, setData }) {
  const [hUnit, setHUnit] = useState(data.heightUnit || 'cm');
  const [hVal, setHVal]   = useState(data.height || 175);
  const [wUnit, setWUnit] = useState(data.weightUnit || 'kg');
  const [wVal, setWVal]   = useState(data.weight || 70);

  useEffect(() => {
    setData({ ...data, height: hVal, heightUnit: hUnit, weight: wVal, weightUnit: wUnit });
  }, [hVal, hUnit, wVal, wUnit]);

  const heightDisplay = hUnit === 'cm' ? `${hVal}` : `${Math.floor(hVal / 30.48)}' ${Math.round((hVal / 2.54) % 12)}"`;
  const weightDisplay = wUnit === 'kg' ? `${wVal}` : `${Math.round(wVal * 2.205)}`;
  const hMin = 120, hMax = 220, wMin = 40, wMax = 160;

  return (
    <OBStep>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={2} total={OB_TOTAL_STEPS}/>
      <OBBody scroll style={{ gap: Space[8] }}>
        {/* Height */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: Space[4] }}>
            <OBQuestion>Height</OBQuestion>
            <OBUnitToggle value={hUnit} onChange={setHUnit}
              options={[{ value: 'cm', label: 'CM' }, { value: 'ft', label: 'FT' }]}/>
          </div>
          <div style={{ textAlign: 'center', marginBottom: Space[3] }}>
            <FNum size={40} weight={300} unit={hUnit === 'cm' ? 'CM' : ''}>{heightDisplay}</FNum>
          </div>
          <OBSlider min={hMin} max={hMax} value={hVal} onChange={setHVal}/>
          <FScale marks={[hMin, Math.round((hMin + hMax) / 2), hMax]}/>
        </div>

        {/* Weight */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: Space[4] }}>
            <OBQuestion>Weight</OBQuestion>
            <OBUnitToggle value={wUnit} onChange={setWUnit}
              options={[{ value: 'kg', label: 'KG' }, { value: 'lbs', label: 'LBS' }]}/>
          </div>
          <div style={{ textAlign: 'center', marginBottom: Space[3] }}>
            <FNum size={40} weight={300} unit={wUnit === 'kg' ? 'KG' : 'LBS'}>{weightDisplay}</FNum>
          </div>
          <OBSlider min={wMin} max={wMax} step={0.5} value={wVal} onChange={setWVal}
            ticks={{ count: 25, majorEvery: 6 }}/>
          <FScale marks={[wMin, Math.round((wMin + wMax) / 2), wMax]}/>
        </div>
      </OBBody>
      <OBNextBtn onClick={onNext}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 4 · Body Fat
   ══════════════════════════════════════════════════════════ */

const OB_BF_VARIANT_MAP = {
  male:   ['male-lean', 'male-lean', 'male-athletic', 'male-average', 'male-average', 'male-stocky', 'male-heavy', 'male-heavy'],
  female: ['female-lean', 'female-lean', 'female-athletic', 'female-average', 'female-average', 'female-curvy', 'female-heavy', 'female-heavy'],
};

export function OB_BodyFat({ onNext, onBack, data, setData }) {
  const isFemale = data.sex === 'female';
  const ranges = isFemale
    ? ['10-14%','15-19%','20-24%','25-29%','30-34%','35-39%','40-44%','45%+']
    : ['3-7%','8-12%','13-17%','18-23%','24-29%','30-34%','35-39%','40%+'];

  const selIdx = data.bodyFat ? ranges.indexOf(data.bodyFat) : -1;
  const gender = isFemale ? 'female' : 'male';
  const variantId = selIdx >= 0
    ? OB_BF_VARIANT_MAP[gender][selIdx]
    : `${gender}-average`;

  return (
    <OBStep>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={3} total={OB_TOTAL_STEPS}/>
      <OBBody scroll>
        <OBQuestion sub="Use a rough visual estimate — precision isn't needed here.">
          What is your body fat level?
        </OBQuestion>

        {/* 3D body preview — swaps variant based on selection */}
        <div style={{ margin: `${Space[3]}px 0`, borderRadius: Radius.xl, overflow: 'hidden', background: Color.surface }}>
          <BodyPreview variant={variantId} height={200} autoRotate />
        </div>

        <FStagger delay={40}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Space[1] }}>
            {ranges.map((r, i) => {
              const sel = data.bodyFat === r;
              return (
                <button key={r} onClick={() => setData({ ...data, bodyFat: r })} style={{
                  padding: `${Space[2]}px ${Space[1]}px`, borderRadius: Radius.lg, cursor: 'pointer',
                  background: sel ? Color.accentDim : Color.surface,
                  border: `1.5px solid ${sel ? Color.accent : Color.border}`,
                  color: sel ? Color.accent : Color.dim,
                  ...Type.labelSm, fontWeight: 600,
                  transition: `all ${Duration.normal} ease, transform ${Duration.normal} ${Ease.spring}`,
                  transform: sel ? 'scale(1.05)' : 'scale(1)',
                  textAlign: 'center',
                }}>{r}</button>
              );
            })}
          </div>
        </FStagger>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={!data.bodyFat}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 5 · Activity (exercise freq + daily activity)
   ══════════════════════════════════════════════════════════ */

export function OB_Activity({ onNext, onBack, data, setData }) {
  const freqOptions  = ['0', '1-3', '4-6', '7+'];
  const levelOptions = [
    { val: 'sedentary', label: 'Mostly Sedentary', sub: 'Under 5,000 steps a day', icon: 'M5 18l3-3h8l3 3 M9 10V6 M15 10V6' },
    { val: 'moderate',  label: 'Moderately Active', sub: '5,000 - 15,000 steps a day', icon: 'M13 4v16 M7 8l6-4 6 4 M7 16l6 4 6-4' },
    { val: 'active',    label: 'Very Active',       sub: 'More than 15,000 steps a day', icon: ICONS.flame },
  ];

  return (
    <OBStep>
      <OBNav title="Activity" onBack={onBack}/>
      <OBProgress current={4} total={OB_TOTAL_STEPS}/>
      <OBBody scroll>
        <OBQuestion>How often do you train?</OBQuestion>
        <div style={{ marginTop: Space[4], display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Space[2], marginBottom: Space[7] }}>
          {freqOptions.map(val => (
            <OBGridBtn key={val} mono selected={data.exerciseFreq === val}
              onClick={() => setData({ ...data, exerciseFreq: val })}>
              {val} / week
            </OBGridBtn>
          ))}
        </div>

        <OBQuestion sub="Outside of exercise — work and leisure time.">Daily activity level</OBQuestion>
        <div style={{ marginTop: Space[4], display: 'flex', flexDirection: 'column', gap: Space[2] }}>
          {levelOptions.map(o => (
            <OBCard key={o.val} selected={data.activityLevel === o.val}
              onClick={() => setData({ ...data, activityLevel: o.val })}
              label={o.label} sub={o.sub}
              icon={<FIcon path={o.icon} size={18} color={data.activityLevel === o.val ? Color.accent : Color.dim}/>}
            />
          ))}
        </div>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={!data.exerciseFreq || !data.activityLevel}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 6 · Training Experience (lifting + cardio)
   ══════════════════════════════════════════════════════════ */

export function OB_Experience({ onNext, onBack, data, setData }) {
  const levels = [
    { val: 'none',         label: 'None',         sub: 'Not currently training' },
    { val: 'beginner',     label: 'Beginner',     sub: 'Less than a year' },
    { val: 'intermediate', label: 'Intermediate', sub: '1-4 years' },
    { val: 'advanced',     label: 'Advanced',     sub: '4+ years' },
  ];
  const barPct = { none: 0, beginner: 25, intermediate: 60, advanced: 100 };

  function ExpSection({ label, field }) {
    return (
      <>
        <FLabel mt={Space[6]} mb={Space[2]}>{label}</FLabel>
        <div style={{ marginBottom: Space[2] }}>
          <SegBar pct={barPct[data[field]] || 0} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Space[2], marginBottom: Space[2] }}>
          {levels.map(o => (
            <OBGridBtn key={o.val} selected={data[field] === o.val}
              onClick={() => setData({ ...data, [field]: o.val })}>
              <div>{o.label}</div>
              <div style={{ ...Type.labelSm, color: Color.mute, marginTop: 2, textTransform: 'none', letterSpacing: 0 }}>{o.sub}</div>
            </OBGridBtn>
          ))}
        </div>
      </>
    );
  }

  return (
    <OBStep>
      <OBNav title="Experience" onBack={onBack}/>
      <OBProgress current={5} total={OB_TOTAL_STEPS}/>
      <OBBody scroll>
        <OBQuestion>Training experience</OBQuestion>
        <ExpSection label="Lifting" field="liftingExp"/>
        <ExpSection label="Cardio" field="cardioExp"/>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={!data.liftingExp || !data.cardioExp}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 7 · Diet Constraints
   ══════════════════════════════════════════════════════════ */

export function OB_DietConstraints({ onNext, onBack, data, setData }) {
  const selected = data.dietary || [];
  const toggle = (val) => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val];
    setData({ ...data, dietary: next });
  };

  return (
    <OBStep>
      <OBNav title="Constraints" onBack={onBack}/>
      <OBProgress current={6} total={OB_TOTAL_STEPS}/>
      <OBBody scroll>
        <OBQuestion sub="Select any that apply — or skip if none.">Any dietary needs?</OBQuestion>
        <FStagger delay={30}>
          <div style={{ marginTop: OB_GUTTER, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: Space[2] }}>
            {OB_DIETARY_OPTIONS.map(opt => (
              <OBGridBtn key={opt} selected={selected.includes(opt)}
                onClick={() => toggle(opt)}>
                {opt}
              </OBGridBtn>
            ))}
          </div>
        </FStagger>
      </OBBody>
      <OBNextBtn onClick={onNext} label={selected.length ? 'Next' : 'Skip'}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 8 · Training Constraints
   ══════════════════════════════════════════════════════════ */

export function OB_TrainingConstraints({ onNext, onBack, data, setData }) {
  const days = data.availableDays || [];
  const injuries = data.injuries || [];

  const toggleDay = (d) => {
    const next = days.includes(d) ? days.filter(v => v !== d) : [...days, d];
    setData({ ...data, availableDays: next });
  };
  const toggleInjury = (v) => {
    if (v === 'None') {
      setData({ ...data, injuries: [] });
      return;
    }
    const next = injuries.includes(v) ? injuries.filter(i => i !== v) : [...injuries, v].filter(i => i !== 'None');
    setData({ ...data, injuries: next });
  };

  return (
    <OBStep>
      <OBNav title="Constraints" onBack={onBack}/>
      <OBProgress current={7} total={OB_TOTAL_STEPS}/>
      <OBBody scroll style={{ gap: Space[7] }}>
        {/* Equipment */}
        <div>
          <OBQuestion>Equipment access</OBQuestion>
          <div style={{ marginTop: Space[4], display: 'flex', flexDirection: 'column', gap: Space[2] }}>
            {OB_EQUIPMENT_OPTIONS.map(o => (
              <OBCard key={o.val} selected={data.equipment === o.val}
                onClick={() => setData({ ...data, equipment: o.val })}
                label={o.label} sub={o.sub}/>
            ))}
          </div>
        </div>

        {/* Available days */}
        <div>
          <OBQuestion sub="Which days can you train?">Available days</OBQuestion>
          <div style={{ marginTop: Space[4], display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: Space[1] }}>
            {OB_DAYS.map(d => (
              <OBGridBtn key={d} selected={days.includes(d)} onClick={() => toggleDay(d)} mono>
                {d}
              </OBGridBtn>
            ))}
          </div>
        </div>

        {/* Injuries */}
        <div>
          <OBQuestion sub="We'll work around these.">Any injuries?</OBQuestion>
          <div style={{ marginTop: Space[4], display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: Space[2] }}>
            {OB_INJURY_OPTIONS.map(v => (
              <OBGridBtn key={v}
                selected={v === 'None' ? injuries.length === 0 : injuries.includes(v)}
                onClick={() => toggleInjury(v)}>
                {v}
              </OBGridBtn>
            ))}
          </div>
        </div>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={!data.equipment || days.length === 0}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 9 · Goals (multi-select, fitness + nutrition)
   ══════════════════════════════════════════════════════════ */

const OB_MUSCLE_GROUPS = [
  { key: 'chest',      index: 0,  label: 'Chest',      color: [220,60,60] },
  { key: 'back',       index: 1,  label: 'Back',       color: [60,130,220] },
  { key: 'shoulders',  index: 2,  label: 'Shoulders',  color: [220,160,40] },
  { key: 'biceps',     index: 3,  label: 'Biceps',     color: [180,60,200] },
  { key: 'triceps',    index: 4,  label: 'Triceps',    color: [60,200,180] },
  { key: 'forearms',   index: 5,  label: 'Forearms',   color: [200,120,60] },
  { key: 'abs',        index: 6,  label: 'Abs',        color: [100,220,60] },
  { key: 'glutes',     index: 7,  label: 'Glutes',     color: [220,60,160] },
  { key: 'quads',      index: 8,  label: 'Quads',      color: [60,180,220] },
  { key: 'hamstrings', index: 9,  label: 'Hamstrings', color: [160,100,60] },
  { key: 'calves',     index: 10, label: 'Calves',     color: [140,180,60] },
];

export function OB_Goals({ onNext, onBack, data, setData }) {
  const goals = data.goals || [];
  const MAX_GOALS = 3;

  const toggle = (item) => {
    let next;
    if (goals.includes(item.val)) {
      next = goals.filter(v => v !== item.val);
    } else if (goals.length < MAX_GOALS) {
      next = [...goals, item.val];
    } else {
      return;
    }
    let caloricGoal = data.goal || 'maintain';
    const allFitness = OB_FITNESS_GOALS.flatMap(g => g.items);
    const firstFitness = next.map(v => allFitness.find(f => f.val === v)).find(Boolean);
    if (firstFitness) caloricGoal = firstFitness.caloricGoal;
    setData({ ...data, goals: next, goal: caloricGoal });
  };

  return (
    <OBStep>
      <OBNav title="Goals" onBack={onBack}/>
      <OBProgress current={8} total={OB_TOTAL_STEPS}/>
      <OBBody scroll>
        <OBQuestion sub={`Pick up to ${MAX_GOALS} — fitness and nutrition.`}>
          What are you working toward?
        </OBQuestion>
        <div style={{ marginTop: Space[2], marginBottom: Space[3] }}>
          <FTag tone={goals.length >= MAX_GOALS ? 'accent' : 'mute'}>
            {goals.length} / {MAX_GOALS} SELECTED
          </FTag>
        </div>

        {OB_FITNESS_GOALS.map(group => (
          <div key={group.section} style={{ marginBottom: Space[4] }}>
            <FLabel mt={Space[2]} mb={Space[2]}>{group.section}</FLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: Space[2] }}>
              {group.items.map(item => (
                <OBCard key={item.val}
                  selected={goals.includes(item.val)}
                  onClick={() => toggle(item)}
                  label={item.label} sub={item.sub}
                  icon={<FIcon path={item.icon} size={18}
                    color={goals.includes(item.val) ? Color.accent : Color.dim}/>}
                />
              ))}
            </div>
          </div>
        ))}

        <FLabel mt={Space[4]} mb={Space[2]}>Nutrition</FLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Space[2], marginBottom: Space[4] }}>
          {OB_NUTRITION_GOALS.map(item => (
            <OBCard key={item.val}
              selected={goals.includes(item.val)}
              onClick={() => toggle(item)}
              label={item.label} sub={item.sub}
              icon={<FIcon path={item.icon} size={18}
                color={goals.includes(item.val) ? Color.accent : Color.dim}/>}
            />
          ))}
        </div>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={goals.length === 0}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 9b · Focus Areas — full-screen 3D muscle group picker
   ══════════════════════════════════════════════════════════ */

export function OB_FocusAreas({ onNext, onBack, data, setData }) {
  const focusMuscles = data.focusMuscles || [];
  const [activeIdx, setActiveIdx] = useState(null);

  const toggleMuscle = (key) => {
    const next = focusMuscles.includes(key)
      ? focusMuscles.filter(k => k !== key)
      : [...focusMuscles, key];
    setData({ ...data, focusMuscles: next });
  };

  const gender = data.sex === 'female' ? 'female' : 'male';
  const variantId = `${gender}-athletic`;
  const activeData = activeIdx != null
    ? OB_MUSCLE_GROUPS.find(g => g.index === activeIdx)
    : null;

  const pillRows = [
    { label: 'Upper',  keys: ['chest','back','shoulders','biceps','triceps','forearms'] },
    { label: 'Core',   keys: ['abs','glutes'] },
    { label: 'Lower',  keys: ['quads','hamstrings','calves'] },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: Color.bg }}>

      {/* ── Title + back overlaying the top of the canvas ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: `${Space[3]}px ${Space[5]}px 0`,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Space[2], marginBottom: Space[2], pointerEvents: 'auto' }}>
          <button onClick={onBack} style={{
            width: 32, height: 32, borderRadius: Radius.full,
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${Color.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <FIcon path={ICONS.back} size={16} color={Color.dim}/>
          </button>
          <span style={{ ...Type.labelSm, color: Color.mute, letterSpacing: 1.4 }}>FOCUS AREAS</span>
        </div>
        <div style={{ fontFamily: Font.sans, fontSize: 22, fontWeight: 300, color: Color.text, letterSpacing: -0.5 }}>
          Where do you want to focus?
        </div>
        <div style={{ ...Type.bodySm, color: Color.mute, marginTop: Space[1] }}>
          Flick to rotate · tap a muscle to select
        </div>
      </div>

      {/* ── 3D body — fills all space above bottom panel ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <BodyPreview
          variant={variantId}
          height="100%"
          autoRotate={false}
          activeGroup={activeIdx ?? -1}
          groupColor={activeData?.color}
          onGroupTap={(idx) => {
            if (idx == null || idx < 0) { setActiveIdx(null); return }
            const mg = OB_MUSCLE_GROUPS.find(g => g.index === idx);
            if (mg) { toggleMuscle(mg.key); setActiveIdx(idx) }
          }}
        />

        {/* Gradient fade into bottom panel */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.9))',
          pointerEvents: 'none',
        }}/>

        {/* Active group label — bottom center, above gradient */}
        {activeData && (
          <div style={{
            position: 'absolute', bottom: Space[8], left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: Space[2],
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: Radius.full, padding: `${Space[1] + 1}px ${Space[3]}px`,
            border: `1px solid rgba(${activeData.color.join(',')},0.2)`,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: Radius.full,
              background: `rgb(${activeData.color.join(',')})`,
              boxShadow: `0 0 10px rgba(${activeData.color.join(',')},0.6)`,
            }}/>
            <span style={{ fontFamily: Font.mono, fontSize: 11, color: Color.text, letterSpacing: 0.5 }}>
              {activeData.label}
            </span>
            <span style={{
              fontFamily: Font.mono, fontSize: 9, letterSpacing: 1,
              color: focusMuscles.includes(activeData.key) ? Color.accent : Color.mute,
            }}>
              {focusMuscles.includes(activeData.key) ? '✓' : 'TAP'}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom panel — grouped pills + CTA ── */}
      <div style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column',
        padding: `${Space[2]}px ${Space[5]}px ${Space[5]}px`,
      }}>
        {/* Pill rows grouped by body region */}
        {pillRows.map(row => (
          <div key={row.label} style={{ marginBottom: Space[2] }}>
            <div style={{
              ...Type.labelSm, color: Color.faint, fontSize: 9,
              letterSpacing: 1.2, marginBottom: Space[1],
            }}>{row.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: Space[1] }}>
              {row.keys.map(key => {
                const mg = OB_MUSCLE_GROUPS.find(g => g.key === key);
                if (!mg) return null;
                const sel = focusMuscles.includes(key);
                const c = mg.color.join(',');
                const isActive = activeIdx === mg.index;
                return (
                  <button key={key}
                    onClick={() => {
                      toggleMuscle(key);
                      setActiveIdx(sel ? null : mg.index);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: `${Space[1]}px ${Space[2] + 2}px`,
                      borderRadius: Radius.full, cursor: 'pointer',
                      border: `1.5px solid ${sel ? `rgba(${c},0.5)` : isActive ? `rgba(${c},0.25)` : Color.border}`,
                      background: sel ? `rgba(${c},0.12)` : 'transparent',
                      color: sel ? `rgb(${c})` : isActive ? `rgba(${c},0.7)` : Color.mute,
                      fontFamily: Font.mono, fontSize: 10, fontWeight: sel ? 600 : 400,
                      letterSpacing: 0.8, textTransform: 'uppercase',
                      transition: `all ${Duration.normal} ease`,
                    }}>
                    {sel && <div style={{
                      width: 5, height: 5, borderRadius: Radius.full,
                      background: `rgb(${c})`,
                      boxShadow: `0 0 6px rgba(${c},0.5)`,
                    }}/>}
                    {mg.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ display: 'flex', gap: Space[2], marginTop: Space[1] }}>
          <FBtn variant="primary" full onClick={onNext}>
            {focusMuscles.length ? `Continue · ${focusMuscles.length} selected` : 'Skip'}
          </FBtn>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 8 · TDEE Result
   ══════════════════════════════════════════════════════════ */

export function OB_TDEE({ onNext, onBack, data }) {
  const tdee = computeTDEE(data);
  const [phase, setPhase]     = useState(0);
  const [ringPct, setRingPct] = useState(0);
  const [countVal, setCountVal] = useState(0);

  useEffect(() => {
    const r1 = setTimeout(() => setRingPct(100), 200);
    // Animated counter
    let raf;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCountVal(Math.round(tdee * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const r2 = setTimeout(() => { raf = requestAnimationFrame(tick); }, 400);
    const t1 = setTimeout(() => setPhase(1), 1600);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(3), 3200);
    return () => { clearTimeout(r1); clearTimeout(r2); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const ringSize = 140, strokeW = 5;

  return (
    <OBStep>
      <OBNav title="Your Estimate" onBack={onBack}/>
      <OBProgress current={9} total={OB_TOTAL_STEPS}/>
      <OBBody style={{ overflowY: 'auto' }}>
        {/* Ring — vertically centered */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
          <FRing value={ringPct} max={100} size={ringSize} strokeWidth={strokeW}>
            <FNum size={32} weight={300}>{countVal}</FNum>
            <div style={{ ...Type.labelSm, color: Color.mute, letterSpacing: 1.4, marginTop: 2 }}>KCAL / DAY</div>
          </FRing>
        </div>

        {/* Info bubbles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Space[2] }}>
          {phase >= 1 && <OBBubble>
            This is your estimated <span style={{ color: Color.accent, fontWeight: 600 }}>Total Daily Energy Expenditure</span> — how many Calories you burn each day.
          </OBBubble>}
          {phase >= 2 && <OBBubble>
            Understanding this is key to managing your weight. Your goal adjusts this number to create the right deficit or surplus.
          </OBBubble>}
          {phase >= 3 && <OBBubble accent>
            <div style={{ display: 'flex', alignItems: 'center', gap: Space[2], marginBottom: Space[1] }}>
              <FIcon path={ICONS.sparkle} size={14} color={Color.accent}/>
              <span style={{ ...Type.labelSm, color: Color.accent, fontWeight: 600 }}>Initial estimate</span>
            </div>
            This number refines itself as you log data. After ~6 weeks, expect accuracy within ±80 kcal.
          </OBBubble>}
        </div>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={phase < 3} label="Continue"/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 9 · Ready
   ══════════════════════════════════════════════════════════ */

export function OB_Ready({ data }) {
  const { completeOnboarding } = useUser();
  const { target, protein, fat, carbs } = computeMacros(data);

  return (
    <OBStep>
      <div style={{ flex: 1, padding: `${Space[8]}px ${OB_GUTTER} ${OB_GUTTER}`, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: Space[7] }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: Space[4] }}>
            <JewelRing size={64}><AurevionMark size={32}/></JewelRing>
          </div>
          <div style={{ fontFamily: Font.sans, fontSize: 32, fontWeight: 200, letterSpacing: -1, color: Color.text, lineHeight: 1.1 }}>
            YOU'RE ALL SET
          </div>
          <div style={{ ...Type.labelMd, color: Color.mute, marginTop: Space[2] }}>Your plan is ready</div>
        </div>

        <FStagger delay={80}>
          {/* Daily target */}
          <OBSurface style={{ marginBottom: Space[2] }}>
            <FLabel>Daily Target</FLabel>
            <FNum size={40} weight={200} unit="KCAL">{target}</FNum>
            <div style={{ display: 'flex', gap: Space[1], marginTop: Space[2] }}>
              <FTag tone="accent">{(data.goal || 'maintain').toUpperCase()}</FTag>
              <FTag tone="mute">{(OB_GOAL_MOD[data.goal] || 0) > 0 ? '+' : ''}{OB_GOAL_MOD[data.goal] || 0} KCAL</FTag>
            </div>
          </OBSurface>

          {/* Macros */}
          <OBSurface style={{ marginBottom: Space[2] }}>
            <FLabel>Macro Targets</FLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: Space[3], marginTop: Space[2] }}>
              {[
                { label: 'Protein', val: protein, color: Color.accent },
                { label: 'Carbs',   val: carbs,   color: Color.dim },
                { label: 'Fat',     val: fat,     color: Color.mute },
              ].map(m => {
                const maxVal = Math.max(protein, carbs, fat);
                return (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Space[1] }}>
                      <span style={{ ...Type.labelSm, color: Color.mute }}>{m.label}</span>
                      <FNum size={20} weight={300} unit="G">{m.val}</FNum>
                    </div>
                    <FTexBar pct={(m.val / maxVal) * 100} height={10} color={m.color}/>
                  </div>
                );
              })}
            </div>
          </OBSurface>

          {/* Stats */}
          <OBSurface style={{ display: 'flex', gap: Space[2], flexWrap: 'wrap' }}>
            <FTag tone="mute">{data.weight} {data.weightUnit || 'kg'}</FTag>
            <FTag tone="mute">{data.height} cm</FTag>
            <FTag tone="mute">{data.exerciseFreq} / WK</FTag>
            <FTag tone="mute">{data.bodyFat || '—'} BF</FTag>
            {(data.dietary || []).length > 0 && <FTag tone="mute">{data.dietary.length} DIETARY</FTag>}
            {data.equipment && <FTag tone="mute">{data.equipment.replace('_', ' ').toUpperCase()}</FTag>}
            {(data.goals || []).length > 0 && <FTag tone="accent">{data.goals.length} GOALS</FTag>}
          </OBSurface>
        </FStagger>

        <div style={{ flex: 1 }}/>
      </div>
      <div style={{ padding: `${Space[4]}px ${OB_GUTTER} ${Space[5]}px` }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd} onClick={() => completeOnboarding(data)}>Enter AUREVI0N</FBtn>
      </div>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   Flow orchestration
   ══════════════════════════════════════════════════════════ */

export function OnboardingFlow() {
  const [step, setStep]           = useState(0);
  const [data, setData]           = useState({});
  const [direction, setDirection] = useState('forward');
  const [transKey, setTransKey]   = useState(0);
  const [rubberBand, setRubberBand] = useState(null);
  const lock = useTransitionLock(340);

  const next = () => {
    if (!lock()) return;
    if (step >= 12) {
      setRubberBand('right');
      setTimeout(() => setRubberBand(null), 400);
      return;
    }
    setDirection('forward'); setTransKey(k => k + 1); setStep(s => s + 1);
  };
  const back = () => {
    if (!lock()) return;
    if (step <= 0) {
      setRubberBand('left');
      setTimeout(() => setRubberBand(null), 400);
      return;
    }
    setDirection('back'); setTransKey(k => k + 1); setStep(s => s - 1);
  };
  const props = { onNext: next, onBack: back, data, setData };

  const steps = [
    <OB_Welcome             key="welcome"     onNext={next}/>,
    <OB_Sex                 key="sex"         {...props}/>,
    <OB_Birthday            key="birthday"    {...props}/>,
    <OB_BodyMetrics         key="metrics"     {...props}/>,
    <OB_BodyFat             key="bodyFat"     {...props}/>,
    <OB_Activity            key="activity"    {...props}/>,
    <OB_Experience          key="experience"  {...props}/>,
    <OB_DietConstraints     key="diet"        {...props}/>,
    <OB_TrainingConstraints key="training"    {...props}/>,
    <OB_Goals               key="goals"       {...props}/>,
    <OB_FocusAreas          key="focus"       {...props}/>,
    <OB_TDEE                key="tdee"        onNext={next} onBack={back} data={data}/>,
    <OB_Ready               key="ready"       data={data}/>,
  ];

  const rubberStyle = rubberBand
    ? { transform: rubberBand === 'left' ? 'translateX(16px)' : 'translateX(-16px)', transition: `transform ${Duration.morph} ${Ease.spring}` }
    : { transform: 'translateX(0)', transition: `transform ${Duration.morph} ${Ease.spring}` };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', ...rubberStyle }}>
      <div key={transKey}
        className={step === 0 ? '' : direction === 'forward' ? 'ob-fwd' : 'ob-back'}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {steps[step] || steps[0]}
      </div>
    </div>
  );
}

export function OnboardingScreen() {
  return (
    <Phone statusTime="9:41">
      <ErrorBoundary>
        <OnboardingFlow/>
      </ErrorBoundary>
    </Phone>
  );
}
