// ════════════════════════════════════════════════════════════
// 11 · Onboarding — 10-step fitness onboarding
// Tokens: Color, Font, Space, Radius, Duration, Ease, Type
// Components: FBtn, FIcon, FNum, FTexBar, FSegBar, FScale,
//             FLabel, FTag, FStagger, Phone, ErrorBoundary
// ════════════════════════════════════════════════════════════

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

const OB_TOTAL_STEPS = 9;
const OB_GUTTER = `${Space[6]}px`;             // 24px
const OB_ACTIVITY_MULT = { sedentary: 1.2, moderate: 1.55, active: 1.9 };
const OB_GOAL_MOD = { lose: -480, build: 300, maintain: 0, recomp: -150 };
const OB_GLYPH_R = 'M19.9152 34.9523C19.7386 34.9042 19.616 34.743 19.616 34.559L19.616 22.9266C19.616 22.7016 19.7973 22.5192 20.021 22.5192H22.4509C22.6745 22.5192 22.8559 22.7016 22.8559 22.9266V28.5167C22.8559 28.8954 23.3245 29.0692 23.5689 28.7812L29.2786 22.0511C29.3556 21.9604 29.4681 21.9082 29.5867 21.9082H32.3914C32.7212 21.9082 32.9127 22.2834 32.7205 22.553L23.3987 35.6264C23.3003 35.7645 23.1269 35.8266 22.9638 35.7822L19.9152 34.9523Z';
const OB_GLYPH_L = 'M9.60841 23.0191C9.29717 23.0191 9.10226 22.6806 9.25711 22.4091L18.3802 6.40847C18.4687 6.25331 18.6475 6.17435 18.8209 6.21381L22.5402 7.05996C22.7248 7.10196 22.8558 7.26694 22.8558 7.4573L22.8558 26.2342C22.8558 26.4011 22.7546 26.5511 22.6004 26.6128L20.1705 27.584C19.9046 27.6903 19.616 27.4933 19.616 27.2054V21.8042C19.616 21.5764 19.4303 21.3929 19.2039 21.3969L14.6125 21.4775C14.5256 21.4791 14.4415 21.5087 14.3727 21.562L12.5986 22.9346C12.5278 22.9894 12.441 23.0191 12.3516 23.0191H9.60841ZM19.5311 12.8761C19.5365 12.4416 18.9523 12.3017 18.7624 12.692L16.3969 17.5548C16.2653 17.8255 16.4612 18.1413 16.7607 18.1413L19.0665 18.1413C19.2882 18.1413 19.4687 17.9619 19.4714 17.7389L19.5311 12.8761Z';

/* ── Nutrition math ─────────────────────────────────────── */

function computeTDEE(data) {
  const mult = OB_ACTIVITY_MULT[data.activityLevel] || 1.5;
  const age  = data.birthYear ? (2026 - data.birthYear) : 25;
  const w = data.weight || 70;
  const h = data.height || 175;
  const bmr = data.sex === 'female'
    ? 447.593 + 9.247 * w + 3.098 * h - 4.330 * age
    : 88.362  + 13.397 * w + 4.799 * h - 5.677 * age;
  return Math.round(bmr * mult);
}

function computeMacros(data) {
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

function AurevionMark({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="21" fill={Color.accent}/>
      <path fill="#131316" d={OB_GLYPH_R}/>
      <path fill="#131316" d={OB_GLYPH_L}/>
    </svg>
  );
}

let _obmId = 0;
function AurevionMarkAnimated({ size = 64, animate = true }) {
  const [id] = React.useState(() => 'avm' + (++_obmId));
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
  return <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>;
}

/* Scrollable body area */
function OBBody({ children, scroll, style }) {
  return (
    <div style={{
      flex: 1, padding: `${Space[3]}px ${OB_GUTTER}`,
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
  const [pressed, setPressed] = React.useState(false);
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
        {selected && <div style={{ width: 8, height: 8, borderRadius: Radius.full, background: '#1a0f0a' }}/>}
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
      transform: selected ? 'scale(1.03)' : 'scale(1)'
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
          color: value === u.value ? '#1a0f0a' : Color.dim,
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

/* Slider with FTexBar track */
function OBSlider({ min, max, step, value, onChange }) {
  return (
    <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 0, right: 0 }}>
        <FTexBar pct={((value - min) / (max - min)) * 100} height={6} animate={false}/>
      </div>
      <input type="range" min={min} max={max} step={step || 1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          opacity: 0, cursor: 'pointer', zIndex: 2, margin: 0
        }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 0 · Welcome
   ══════════════════════════════════════════════════════════ */

function OB_Welcome({ onNext }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setReady(true), 1800); return () => clearTimeout(t); }, []);

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

function OB_Sex({ onNext, onBack, data, setData }) {
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

function OB_Birthday({ onNext, onBack, data, setData }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [month, setMonth] = React.useState(data.birthMonth || 5);
  const [day, setDay]     = React.useState(data.birthDay || 15);
  const [year, setYear]   = React.useState(data.birthYear || 2000);

  React.useEffect(() => {
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

function OB_BodyMetrics({ onNext, onBack, data, setData }) {
  const [hUnit, setHUnit] = React.useState(data.heightUnit || 'cm');
  const [hVal, setHVal]   = React.useState(data.height || 175);
  const [wUnit, setWUnit] = React.useState(data.weightUnit || 'kg');
  const [wVal, setWVal]   = React.useState(data.weight || 70);

  React.useEffect(() => {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 20, marginBottom: Space[1] }}>
            {Array.from({ length: 25 }, (_, i) => {
              const tickVal = wMin + i * ((wMax - wMin) / 24);
              return (
                <div key={i} style={{
                  width: 1, height: i % 6 === 0 ? 16 : 8,
                  background: Math.abs(tickVal - wVal) < 3 ? Color.accent : Color.faint,
                  transition: `background ${Duration.normal} ease`
                }}/>
              );
            })}
          </div>
          <OBSlider min={wMin} max={wMax} step={0.5} value={wVal} onChange={setWVal}/>
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

function OB_BodyFat({ onNext, onBack, data, setData }) {
  const ranges = data.sex === 'female'
    ? ['10-14%','15-19%','20-24%','25-29%','30-34%','35-39%','40-44%','45%+']
    : ['3-7%','8-12%','13-17%','18-23%','24-29%','30-34%','35-39%','40%+'];

  return (
    <OBStep>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={3} total={OB_TOTAL_STEPS}/>
      <OBBody scroll>
        <OBQuestion sub="Use a rough visual estimate — precision isn't needed here.">
          What is your body fat level?
        </OBQuestion>
        <FStagger delay={40}>
          <div style={{ marginTop: Space[5], display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: Space[2] }}>
            {ranges.map(r => {
              const sel = data.bodyFat === r;
              return (
                <button key={r} onClick={() => setData({ ...data, bodyFat: r })} style={{
                  aspectRatio: '1', borderRadius: Radius.xl, cursor: 'pointer',
                  background: sel ? Color.accentFaint : Color.surface,
                  border: `2px solid ${sel ? Color.accent : Color.border}`,
                  color: Color.text, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end',
                  padding: `${Space[2]}px ${Space[1]}px`, gap: Space[1],
                  transition: `border-color ${Duration.normal} ease, background ${Duration.normal} ease, transform ${Duration.normal} ${Ease.spring}`,
                  transform: sel ? 'scale(1.03)' : 'scale(1)'
                }}>
                  <div style={{
                    flex: 1, width: '60%',
                    background: `linear-gradient(180deg, ${Color.borderSoft} 0%, transparent 100%)`,
                    borderRadius: `${Radius.lg}px ${Radius.lg}px ${Radius.sm}px ${Radius.sm}px`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FIcon path="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"
                      size={24} color={sel ? Color.accent : Color.faint} fill={sel ? Color.accent : Color.borderSoft} stroke={0}/>
                  </div>
                  <div style={{
                    ...Type.labelSm, fontWeight: 600,
                    color: sel ? Color.accent : Color.dim,
                    background: sel ? Color.accentDim : Color.borderSoft,
                    padding: `3px ${Space[2]}px`, borderRadius: Radius.sm + 2,
                    transition: `all ${Duration.normal} ease`
                  }}>{r}</div>
                </button>
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

function OB_Activity({ onNext, onBack, data, setData }) {
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

function OB_Experience({ onNext, onBack, data, setData }) {
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
          <FSegBar pct={barPct[data[field]] || 0} segments={12} height={28}/>
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
   STEP 7 · Goal
   ══════════════════════════════════════════════════════════ */

function OB_Goal({ onNext, onBack, data, setData }) {
  const options = [
    { val: 'lose',     label: 'Lose fat',       sub: 'Cut body fat while preserving muscle', icon: ICONS.trend_dn },
    { val: 'build',    label: 'Build muscle',   sub: 'Lean bulk with controlled surplus',    icon: ICONS.trend_up },
    { val: 'maintain', label: 'Maintain',       sub: 'Hold current weight and composition',  icon: ICONS.pause },
    { val: 'recomp',   label: 'Recomposition',  sub: 'Build muscle and lose fat simultaneously', icon: ICONS.swap },
  ];

  return (
    <OBStep>
      <OBNav title="Goal" onBack={onBack}/>
      <OBProgress current={6} total={OB_TOTAL_STEPS}/>
      <OBBody>
        <OBQuestion sub="This determines your caloric strategy.">What's your primary goal?</OBQuestion>
        <FStagger delay={50}>
          <div style={{ marginTop: OB_GUTTER, display: 'flex', flexDirection: 'column', gap: Space[3] }}>
            {options.map(o => (
              <OBCard key={o.val} selected={data.goal === o.val}
                onClick={() => setData({ ...data, goal: o.val })}
                label={o.label} sub={o.sub}
                icon={<FIcon path={o.icon} size={18} color={data.goal === o.val ? Color.accent : Color.dim}/>}/>
            ))}
          </div>
        </FStagger>
      </OBBody>
      <OBNextBtn onClick={onNext} disabled={!data.goal}/>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 8 · TDEE Result
   ══════════════════════════════════════════════════════════ */

function OB_TDEE({ onNext, onBack, data }) {
  const tdee = computeTDEE(data);
  const [phase, setPhase]     = React.useState(0);
  const [ringPct, setRingPct] = React.useState(0);
  const [countVal, setCountVal] = React.useState(0);

  React.useEffect(() => {
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
  const r = (ringSize - strokeW) / 2;
  const c = 2 * Math.PI * r;

  return (
    <OBStep>
      <OBNav title="Your Estimate" onBack={onBack}/>
      <OBProgress current={7} total={OB_TOTAL_STEPS}/>
      <OBBody style={{ overflowY: 'auto' }}>
        {/* Ring — vertically centered */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
          <div style={{ position: 'relative', width: ringSize, height: ringSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={ringSize} height={ringSize} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
              <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none" stroke={Color.borderSoft} strokeWidth={strokeW}/>
              <circle cx={ringSize / 2} cy={ringSize / 2} r={r} fill="none"
                stroke={Color.accent} strokeWidth={strokeW}
                strokeDasharray={c} strokeDashoffset={c - (ringPct / 100) * c}
                strokeLinecap="round"
                style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)` }}/>
            </svg>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <FNum size={32} weight={300}>{countVal}</FNum>
              <div style={{ ...Type.labelSm, color: Color.mute, letterSpacing: 1.4, marginTop: 2 }}>KCAL / DAY</div>
            </div>
          </div>
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

function OB_Ready({ data }) {
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
          </OBSurface>
        </FStagger>

        <div style={{ flex: 1 }}/>
      </div>
      <div style={{ padding: `${Space[4]}px ${OB_GUTTER} ${Space[5]}px` }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd}>Enter AUREVI0N</FBtn>
      </div>
    </OBStep>
  );
}

/* ══════════════════════════════════════════════════════════
   Flow orchestration
   ══════════════════════════════════════════════════════════ */

function OnboardingFlow() {
  const [step, setStep]           = React.useState(0);
  const [data, setData]           = React.useState({});
  const [direction, setDirection] = React.useState('forward');
  const [transKey, setTransKey]   = React.useState(0);

  const next = () => { setDirection('forward'); setTransKey(k => k + 1); setStep(s => s + 1); };
  const back = () => { setDirection('back');    setTransKey(k => k + 1); setStep(s => Math.max(0, s - 1)); };
  const props = { onNext: next, onBack: back, data, setData };

  const steps = [
    <OB_Welcome key="welcome" onNext={next}/>,
    <OB_Sex        key="sex"        {...props}/>,
    <OB_Birthday   key="birthday"   {...props}/>,
    <OB_BodyMetrics key="metrics"   {...props}/>,
    <OB_BodyFat    key="bodyFat"    {...props}/>,
    <OB_Activity   key="activity"   {...props}/>,
    <OB_Experience key="experience" {...props}/>,
    <OB_Goal       key="goal"       {...props}/>,
    <OB_TDEE       key="tdee"       onNext={next} onBack={back} data={data}/>,
    <OB_Ready      key="ready"      data={data}/>,
  ];

  return (
    <div key={transKey}
      className={step === 0 ? '' : direction === 'forward' ? 'ob-fwd' : 'ob-back'}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {steps[step] || steps[0]}
    </div>
  );
}

function OnboardingScreen() {
  return (
    <Phone statusTime="9:41">
      <ErrorBoundary>
        <OnboardingFlow/>
      </ErrorBoundary>
    </Phone>
  );
}

/* ── Exports ────────────────────────────────────────────── */

Object.assign(window, {
  OnboardingFlow, OnboardingScreen,
  OB_Welcome, OB_Sex, OB_Birthday, OB_BodyMetrics,
  OB_BodyFat, OB_Activity, OB_Experience, OB_Goal,
  OB_TDEE, OB_Ready, AurevionMark, AurevionMarkAnimated,
  computeTDEE, computeMacros,
});
