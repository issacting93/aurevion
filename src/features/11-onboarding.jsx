// 11 Onboarding · 10-step fitness onboarding with Aurevion micro-interactions
// Consolidates 16-step MacroFactor-style flow into a tighter, branded experience.

/* ── Animated Logo Mark (SVG draw + pulse) ──────────────── */

let _obmId = 0;
function AurevionMarkAnimated({ size = 64, animate = true }) {
  const [id] = React.useState(() => 'avm' + (++_obmId));
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <style>{`
        @keyframes ob-draw-path {
          0%   { stroke-dashoffset: 240; fill-opacity: 0; }
          50%  { stroke-dashoffset: 0;   fill-opacity: 0; }
          100% { stroke-dashoffset: 0;   fill-opacity: 1; }
        }
        @keyframes ob-bg-pulse {
          0%, 100% { fill: #FF6E50; }
          50%      { fill: #ff856c; }
        }
        .ob-bg-${id} { ${animate ? 'animation: ob-bg-pulse 6s ease-in-out infinite;' : ''} }
        .ob-gl-${id} {
          stroke: #131316; stroke-width: 0.3;
          stroke-dasharray: 240; stroke-dashoffset: 240;
          fill-opacity: 0;
          ${animate ? 'animation: ob-draw-path 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;' : 'stroke-dashoffset: 0; fill-opacity: 1;'}
        }
        .ob-gr-${id} {
          stroke: #131316; stroke-width: 0.3;
          stroke-dasharray: 240; stroke-dashoffset: 240;
          fill-opacity: 0;
          ${animate ? 'animation: ob-draw-path 2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;' : 'stroke-dashoffset: 0; fill-opacity: 1;'}
        }
      `}</style>
      <circle className={`ob-bg-${id}`} cx="21" cy="21" r="21" fill="#FF6E50"/>
      <path className={`ob-gr-${id}`} fill="#131316" d="M19.9152 34.9523C19.7386 34.9042 19.616 34.743 19.616 34.559L19.616 22.9266C19.616 22.7016 19.7973 22.5192 20.021 22.5192H22.4509C22.6745 22.5192 22.8559 22.7016 22.8559 22.9266V28.5167C22.8559 28.8954 23.3245 29.0692 23.5689 28.7812L29.2786 22.0511C29.3556 21.9604 29.4681 21.9082 29.5867 21.9082H32.3914C32.7212 21.9082 32.9127 22.2834 32.7205 22.553L23.3987 35.6264C23.3003 35.7645 23.1269 35.8266 22.9638 35.7822L19.9152 34.9523Z"/>
      <path className={`ob-gl-${id}`} fill="#131316" d="M9.60841 23.0191C9.29717 23.0191 9.10226 22.6806 9.25711 22.4091L18.3802 6.40847C18.4687 6.25331 18.6475 6.17435 18.8209 6.21381L22.5402 7.05996C22.7248 7.10196 22.8558 7.26694 22.8558 7.4573L22.8558 26.2342C22.8558 26.4011 22.7546 26.5511 22.6004 26.6128L20.1705 27.584C19.9046 27.6903 19.616 27.4933 19.616 27.2054V21.8042C19.616 21.5764 19.4303 21.3929 19.2039 21.3969L14.6125 21.4775C14.5256 21.4791 14.4415 21.5087 14.3727 21.562L12.5986 22.9346C12.5278 22.9894 12.441 23.0191 12.3516 23.0191H9.60841ZM19.5311 12.8761C19.5365 12.4416 18.9523 12.3017 18.7624 12.692L16.3969 17.5548C16.2653 17.8255 16.4612 18.1413 16.7607 18.1413L19.0665 18.1413C19.2882 18.1413 19.4687 17.9619 19.4714 17.7389L19.5311 12.8761Z"/>
    </svg>
  );
}

function AurevionMark({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="21" fill="#FF6E50"/>
      <path fill="#131316" d="M19.9152 34.9523C19.7386 34.9042 19.616 34.743 19.616 34.559L19.616 22.9266C19.616 22.7016 19.7973 22.5192 20.021 22.5192H22.4509C22.6745 22.5192 22.8559 22.7016 22.8559 22.9266V28.5167C22.8559 28.8954 23.3245 29.0692 23.5689 28.7812L29.2786 22.0511C29.3556 21.9604 29.4681 21.9082 29.5867 21.9082H32.3914C32.7212 21.9082 32.9127 22.2834 32.7205 22.553L23.3987 35.6264C23.3003 35.7645 23.1269 35.8266 22.9638 35.7822L19.9152 34.9523Z"/>
      <path fill="#131316" d="M9.60841 23.0191C9.29717 23.0191 9.10226 22.6806 9.25711 22.4091L18.3802 6.40847C18.4687 6.25331 18.6475 6.17435 18.8209 6.21381L22.5402 7.05996C22.7248 7.10196 22.8558 7.26694 22.8558 7.4573L22.8558 26.2342C22.8558 26.4011 22.7546 26.5511 22.6004 26.6128L20.1705 27.584C19.9046 27.6903 19.616 27.4933 19.616 27.2054V21.8042C19.616 21.5764 19.4303 21.3929 19.2039 21.3969L14.6125 21.4775C14.5256 21.4791 14.4415 21.5087 14.3727 21.562L12.5986 22.9346C12.5278 22.9894 12.441 23.0191 12.3516 23.0191H9.60841ZM19.5311 12.8761C19.5365 12.4416 18.9523 12.3017 18.7624 12.692L16.3969 17.5548C16.2653 17.8255 16.4612 18.1413 16.7607 18.1413L19.0665 18.1413C19.2882 18.1413 19.4687 17.9619 19.4714 17.7389L19.5311 12.8761Z"/>
    </svg>
  );
}

/* ── Inject onboarding-specific CSS once ────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('ob-css')) {
  const s = document.createElement('style');
  s.id = 'ob-css';
  s.textContent = `
    @keyframes ob-slide-in-right {
      from { opacity: 0; transform: translateX(24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ob-slide-in-left {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ob-scale-in {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes ob-count-pulse {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    @keyframes ob-ring-fill {
      from { stroke-dashoffset: var(--ob-ring-circumference); }
      to   { stroke-dashoffset: var(--ob-ring-target); }
    }
    .ob-step-forward { animation: ob-slide-in-right 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .ob-step-back    { animation: ob-slide-in-left 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .ob-scale-in     { animation: ob-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    @media (prefers-reduced-motion: reduce) {
      .ob-step-forward, .ob-step-back, .ob-scale-in {
        animation: none !important;
        opacity: 1 !important; transform: none !important;
      }
    }
  `;
  document.head.appendChild(s);
}

/* ── Segmented Progress Bar ─────────────────────────────── */

function OBProgress({ current, total }) {
  return (
    <div style={{ padding: '0 24px', marginBottom: 4 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= current ? Color.accent : 'rgba(255,255,255,0.06)',
            transition: `background ${Duration.slow} ${Ease.out}`
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ── Nav Bar ────────────────────────────────────────────── */

function OBNav({ title, onBack }) {
  return (
    <div style={{
      padding: '12px 24px 8px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
    }}>
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: '50%', border: 'none',
        background: 'rgba(255,255,255,0.06)', color: Color.text,
        cursor: 'pointer', display: 'grid', placeItems: 'center',
        transition: `background ${Duration.fast} ease, transform ${Duration.fast} ${Ease.spring}`
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FIcon path={ICONS.back} size={16} stroke={2}/>
      </button>
      <div style={{ fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.4, color: Color.mute, textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ width: 36 }}/>
    </div>
  );
}

/* ── Question Header ────────────────────────────────────── */

function OBQuestion({ children, sub }) {
  return (
    <div style={{ padding: '0 24px', marginTop: 8 }}>
      <div style={{
        fontFamily: Font.sans, fontSize: 26, fontWeight: 500,
        letterSpacing: -0.5, lineHeight: 1.2, color: Color.text
      }}>{children}</div>
      {sub && <div style={{
        fontFamily: Font.sans, fontSize: 14, color: Color.dim,
        marginTop: 8, lineHeight: 1.5
      }}>{sub}</div>}
    </div>
  );
}

/* ── Next Button ────────────────────────────────────────── */

function OBNextBtn({ onClick, disabled, label = 'Next' }) {
  return (
    <div style={{ padding: '16px 24px 20px', flexShrink: 0 }}>
      <FBtn variant="primary" full disabled={disabled} onClick={onClick}
            size="lg" labelStyle="mono">{label}</FBtn>
    </div>
  );
}

/* ── Selection Card (uses spring bounce) ────────────────── */

function OBCard({ selected, onClick, icon, label, sub }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: '16px 18px', borderRadius: 14,
      background: selected ? 'rgba(255,110,80,0.06)' : Color.surface,
      border: selected ? `2px solid ${Color.accent}` : `2px solid ${Color.border}`,
      color: Color.text, display: 'flex', alignItems: 'center', gap: 14,
      transition: `border-color ${Duration.normal} ease, background ${Duration.normal} ease, transform ${Duration.fast} ${Ease.spring}`,
      fontFamily: Font.sans,
      transform: pressed ? 'scale(0.97)' : 'scale(1)',
    }}
    onPointerDown={() => setPressed(true)}
    onPointerUp={() => setPressed(false)}
    onPointerLeave={() => setPressed(false)}
    >
      {icon && <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: selected ? 'rgba(255,110,80,0.15)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: `background ${Duration.normal} ease`
      }}>
        {typeof icon === 'string' ? <span style={{ fontSize: 18 }}>{icon}</span> : icon}
      </div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: Color.dim, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: selected ? 'none' : '2px solid rgba(255,255,255,0.15)',
        background: selected ? Color.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `all ${Duration.normal} ${Ease.spring}`
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a0f0a' }}/>}
      </div>
    </button>
  );
}

/* ── Unit Toggle (segmented pill) ───────────────────────── */

function OBUnitToggle({ options, value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', borderRadius: 999, overflow: 'hidden',
      border: `1px solid ${Color.border}`
    }}>
      {options.map(u => (
        <button key={u.value} onClick={() => onChange(u.value)} style={{
          padding: '8px 20px', border: 'none', cursor: 'pointer',
          fontFamily: Font.mono, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
          background: value === u.value ? Color.accent : 'transparent',
          color: value === u.value ? '#1a0f0a' : Color.dim,
          fontWeight: 600, transition: `all ${Duration.normal} ease`
        }}>{u.label}</button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 0 · Welcome
   SVG draw animation + jewel CTA
   ══════════════════════════════════════════════════════════ */

function OB_Welcome({ onNext }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setReady(true), 1800); return () => clearTimeout(t); }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '60px 28px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 28 }}>
          {/* Animated logo with jewel ring */}
          <div className="aurevion-jewel-icon" style={{
            position: 'relative', width: 80, height: 80, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div className="aurevion-jewel-face" style={{
              position: 'relative', width: 'calc(100% - 7px)', height: 'calc(100% - 7px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 30%, #2a2a2d 0%, #131316 55%, #0a0a0b 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 5px rgba(0,0,0,0.7)'
            }}>
              <AurevionMarkAnimated size={42}/>
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: Font.sans, fontSize: 44, fontWeight: 200,
              letterSpacing: -1.4, lineHeight: 1, color: Color.text, marginBottom: 12,
              opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
            }}>
              YOUR BODY.<br/>YOUR DATA.
            </div>
            <div style={{
              fontFamily: Font.mono, fontSize: 12, letterSpacing: 2,
              color: Color.accent, textTransform: 'uppercase',
              opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease 0.5s'
            }}>AUREVI0N</div>
          </div>
          <div style={{
            fontSize: 15, lineHeight: 1.6, color: Color.dim, maxWidth: 300,
            opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease 0.7s'
          }}>
            Nutrition, training, and body composition — tracked with precision, not guesswork.
          </div>
        </div>
      </div>
      <div style={{
        padding: '0 24px 8px',
        opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.4s ease 0.9s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s'
      }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd} onClick={onNext}>Get Started</FBtn>
      </div>
      <div style={{
        padding: '8px 24px 20px', textAlign: 'center',
        opacity: ready ? 1 : 0, transition: 'opacity 0.3s ease 1.1s'
      }}>
        <button style={{
          background: 'transparent', border: 'none', color: Color.dim, padding: 0,
          fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.4,
          textTransform: 'uppercase', cursor: 'pointer'
        }}>I already have an account</button>
      </div>
      <div style={{
        padding: '0 24px 8px', textAlign: 'center',
        opacity: ready ? 0.4 : 0, transition: 'opacity 0.3s ease 1.2s'
      }}>
        <span style={{ fontFamily: Font.mono, fontSize: 9, letterSpacing: 1, color: Color.mute }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 1 · Sex
   ══════════════════════════════════════════════════════════ */

function OB_Sex({ onNext, onBack, data, setData }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={0} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px' }}>
        <OBQuestion>What is your sex?</OBQuestion>
        <FStagger delay={60}>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <OBCard selected={data.sex === 'female'} onClick={() => setData({ ...data, sex: 'female' })}
              icon="&#9792;" label="Female"/>
            <OBCard selected={data.sex === 'male'} onClick={() => setData({ ...data, sex: 'male' })}
              icon="&#9794;" label="Male"/>
          </div>
        </FStagger>
      </div>
      <OBNextBtn onClick={onNext} disabled={!data.sex}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 2 · Birthday
   ══════════════════════════════════════════════════════════ */

function OB_Birthday({ onNext, onBack, data, setData }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [month, setMonth] = React.useState(data.birthMonth || 5);
  const [day, setDay] = React.useState(data.birthDay || 15);
  const [year, setYear] = React.useState(data.birthYear || 2000);

  React.useEffect(() => {
    setData({ ...data, birthMonth: month, birthDay: day, birthYear: year });
  }, [month, day, year]);

  function ScrollColumn({ items, value, onChange }) {
    const idx = items.indexOf(value);
    const getSlice = () => {
      const result = [];
      for (let i = idx - 2; i <= idx + 2; i++) {
        if (i >= 0 && i < items.length) result.push({ val: items[i], offset: i - idx });
        else result.push({ val: null, offset: i - idx });
      }
      return result;
    };
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {getSlice().map((item, i) => {
          const isCentre = item.offset === 0;
          const dist = Math.abs(item.offset);
          return (
            <button key={i} onClick={() => item.val != null && onChange(item.val)} style={{
              background: 'transparent', border: 'none', cursor: item.val != null ? 'pointer' : 'default',
              padding: '10px 0', width: '100%', textAlign: 'center',
              fontFamily: Font.sans, fontSize: isCentre ? 22 : 18,
              fontWeight: isCentre ? 600 : 400,
              color: item.val == null ? 'transparent' : isCentre ? Color.text : dist === 1 ? Color.mute : Color.faint,
              transition: `all ${Duration.normal} ${Ease.spring}`
            }}>
              {item.val != null ? item.val : '-'}
            </button>
          );
        })}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 44, transform: 'translateY(-50%)',
          borderTop: `1px solid ${Color.border}`,
          borderBottom: `1px solid ${Color.border}`,
          pointerEvents: 'none'
        }}/>
        <button onClick={() => { const i = items.indexOf(value); if (i > 0) onChange(items[i-1]); }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'transparent', border: 'none', cursor: 'pointer' }}/>
        <button onClick={() => { const i = items.indexOf(value); if (i < items.length - 1) onChange(items[i+1]); }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'transparent', border: 'none', cursor: 'pointer' }}/>
      </div>
    );
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2010 - i);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={1} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px' }}>
        <OBQuestion>When were you born?</OBQuestion>
        <div style={{ marginTop: 40, display: 'flex', gap: 0, height: 220 }}>
          <ScrollColumn items={months} value={months[month]} onChange={(v) => setMonth(months.indexOf(v))}/>
          <ScrollColumn items={days} value={day} onChange={setDay}/>
          <ScrollColumn items={years} value={year} onChange={setYear}/>
        </div>
      </div>
      <OBNextBtn onClick={onNext}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 3 · Height + Weight (combined)
   Uses FNum display, textured slider tracks, unit toggles
   ══════════════════════════════════════════════════════════ */

function OB_BodyMetrics({ onNext, onBack, data, setData }) {
  const [hUnit, setHUnit] = React.useState(data.heightUnit || 'cm');
  const [hVal, setHVal] = React.useState(data.height || 175);
  const [wUnit, setWUnit] = React.useState(data.weightUnit || 'kg');
  const [wVal, setWVal] = React.useState(data.weight || 70);

  React.useEffect(() => {
    setData({ ...data, height: hVal, heightUnit: hUnit, weight: wVal, weightUnit: wUnit });
  }, [hVal, hUnit, wVal, wUnit]);

  const heightDisplay = hUnit === 'cm'
    ? `${hVal}`
    : `${Math.floor(hVal / 30.48)}' ${Math.round((hVal / 2.54) % 12)}"`;
  const heightSuffix = hUnit === 'cm' ? 'CM' : '';

  const weightDisplay = wUnit === 'kg' ? `${wVal}` : `${Math.round(wVal * 2.205)}`;
  const weightSuffix = wUnit === 'kg' ? 'KG' : 'LBS';

  const hMin = 120, hMax = 220, wMin = 40, wMax = 160;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={2} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Height section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <OBQuestion>Height</OBQuestion>
            <OBUnitToggle value={hUnit} onChange={setHUnit}
              options={[{ value: 'cm', label: 'CM' }, { value: 'ft', label: 'FT' }]}/>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <FNum size={40} weight={300} unit={heightSuffix}>{heightDisplay}</FNum>
          </div>
          <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0 }}>
              <FTexBar pct={((hVal - hMin) / (hMax - hMin)) * 100} height={6} animate={false}/>
            </div>
            <input type="range" min={hMin} max={hMax} value={hVal}
              onChange={e => setHVal(Number(e.target.value))}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer', zIndex: 2, margin: 0
              }}/>
          </div>
          <FScale marks={[hMin, Math.round((hMin + hMax) / 2), hMax]} suffix={hUnit === 'cm' ? '' : ''}/>
        </div>

        {/* Weight section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <OBQuestion>Weight</OBQuestion>
            <OBUnitToggle value={wUnit} onChange={setWUnit}
              options={[{ value: 'kg', label: 'KG' }, { value: 'lbs', label: 'LBS' }]}/>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <FNum size={40} weight={300} unit={weightSuffix}>{weightDisplay}</FNum>
          </div>
          {/* Ruler ticks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 20, marginBottom: 6 }}>
            {Array.from({ length: 25 }, (_, i) => {
              const tickVal = wMin + i * ((wMax - wMin) / 24);
              const isMajor = i % 6 === 0;
              const isActive = Math.abs(tickVal - wVal) < 3;
              return (
                <div key={i} style={{
                  width: 1, height: isMajor ? 16 : 8,
                  background: isActive ? Color.accent : 'rgba(255,255,255,0.15)',
                  transition: `background ${Duration.normal} ease`
                }}/>
              );
            })}
          </div>
          <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0 }}>
              <FTexBar pct={((wVal - wMin) / (wMax - wMin)) * 100} height={6} animate={false}/>
            </div>
            <input type="range" min={wMin} max={wMax} step={0.5} value={wVal}
              onChange={e => setWVal(Number(e.target.value))}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer', zIndex: 2, margin: 0
              }}/>
          </div>
          <FScale marks={[wMin, Math.round((wMin + wMax) / 2), wMax]}/>
        </div>
      </div>
      <OBNextBtn onClick={onNext}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 4 · Body Fat
   Grid with staggered entrance + spring bounce selection
   ══════════════════════════════════════════════════════════ */

function OB_BodyFat({ onNext, onBack, data, setData }) {
  const ranges = data.sex === 'female'
    ? ['10-14%','15-19%','20-24%','25-29%','30-34%','35-39%','40-44%','45%+']
    : ['3-7%','8-12%','13-17%','18-23%','24-29%','30-34%','35-39%','40%+'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Basics" onBack={onBack}/>
      <OBProgress current={3} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px', overflowY: 'auto' }}>
        <OBQuestion sub="Use a rough visual estimate — precision isn't needed here.">
          What is your body fat level?
        </OBQuestion>
        <FStagger delay={40}>
          <div style={{
            marginTop: 20, display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: 10
          }}>
            {ranges.map((r) => {
              const sel = data.bodyFat === r;
              return (
                <button key={r} onClick={() => setData({ ...data, bodyFat: r })} style={{
                  aspectRatio: '1', borderRadius: 14, cursor: 'pointer',
                  background: sel ? 'rgba(255,110,80,0.08)' : Color.surface,
                  border: sel ? `2px solid ${Color.accent}` : `2px solid ${Color.border}`,
                  color: Color.text, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end',
                  padding: '8px 4px', gap: 6,
                  transition: `border-color ${Duration.normal} ease, background ${Duration.normal} ease, transform ${Duration.normal} ${Ease.spring}`,
                  transform: sel ? 'scale(1.03)' : 'scale(1)'
                }}>
                  <div style={{
                    flex: 1, width: '60%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                    borderRadius: '12px 12px 4px 4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FIcon path="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"
                      size={24} color={sel ? Color.accent : 'rgba(255,255,255,0.2)'} fill={sel ? Color.accent : 'rgba(255,255,255,0.12)'} stroke={0}/>
                  </div>
                  <div style={{
                    fontFamily: Font.mono, fontSize: 10, fontWeight: 600,
                    letterSpacing: 0.5,
                    color: sel ? Color.accent : Color.dim,
                    background: sel ? 'rgba(255,110,80,0.15)' : 'rgba(255,255,255,0.06)',
                    padding: '3px 8px', borderRadius: 6,
                    transition: `all ${Duration.normal} ease`
                  }}>{r}</div>
                </button>
              );
            })}
          </div>
        </FStagger>
      </div>
      <OBNextBtn onClick={onNext} disabled={!data.bodyFat}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 5 · Activity (merged exercise freq + daily activity)
   ══════════════════════════════════════════════════════════ */

function OB_Activity({ onNext, onBack, data, setData }) {
  const freqOptions = [
    { val: '0', label: '0 / week' },
    { val: '1-3', label: '1-3 / week' },
    { val: '4-6', label: '4-6 / week' },
    { val: '7+', label: '7+ / week' },
  ];
  const levelOptions = [
    { val: 'sedentary', label: 'Mostly Sedentary', sub: 'Under 5,000 steps a day' },
    { val: 'moderate', label: 'Moderately Active', sub: '5,000 - 15,000 steps a day' },
    { val: 'active', label: 'Very Active', sub: 'More than 15,000 steps a day' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Activity" onBack={onBack}/>
      <OBProgress current={4} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px', overflowY: 'auto' }}>
        {/* Exercise frequency — compact 2x2 grid */}
        <OBQuestion>How often do you train?</OBQuestion>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
          {freqOptions.map(o => {
            const sel = data.exerciseFreq === o.val;
            return (
              <button key={o.val} onClick={() => setData({ ...data, exerciseFreq: o.val })} style={{
                padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                background: sel ? 'rgba(255,110,80,0.06)' : Color.surface,
                border: sel ? `2px solid ${Color.accent}` : `2px solid ${Color.border}`,
                color: sel ? Color.accent : Color.text,
                fontFamily: Font.mono, fontSize: 13, fontWeight: 600,
                letterSpacing: 0.8, textAlign: 'center',
                transition: `all ${Duration.normal} ${Ease.spring}`,
                transform: sel ? 'scale(1.03)' : 'scale(1)'
              }}>{o.label}</button>
            );
          })}
        </div>

        {/* Daily activity level */}
        <OBQuestion sub="Outside of exercise — work and leisure time.">Daily activity level</OBQuestion>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {levelOptions.map(o => (
            <OBCard key={o.val} selected={data.activityLevel === o.val}
              onClick={() => setData({ ...data, activityLevel: o.val })}
              label={o.label} sub={o.sub}
              icon={<FIcon path={o.val === 'sedentary' ? 'M5 18l3-3h8l3 3 M9 10V6 M15 10V6' : o.val === 'moderate' ? 'M13 4v16 M7 8l6-4 6 4 M7 16l6 4 6-4' : ICONS.flame} size={18} color={data.activityLevel === o.val ? Color.accent : Color.dim}/>}
            />
          ))}
        </div>
      </div>
      <OBNextBtn onClick={onNext} disabled={!data.exerciseFreq || !data.activityLevel}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 6 · Training Experience (merged lifting + cardio)
   Uses FSegBar for visual gauge
   ══════════════════════════════════════════════════════════ */

function OB_Experience({ onNext, onBack, data, setData }) {
  const levels = [
    { val: 'none', label: 'None', sub: 'Not currently training' },
    { val: 'beginner', label: 'Beginner', sub: 'Less than a year' },
    { val: 'intermediate', label: 'Intermediate', sub: '1-4 years' },
    { val: 'advanced', label: 'Advanced', sub: '4+ years' },
  ];
  const barPct = { none: 0, beginner: 25, intermediate: 60, advanced: 100 };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Experience" onBack={onBack}/>
      <OBProgress current={5} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px', overflowY: 'auto' }}>
        <OBQuestion>Training experience</OBQuestion>

        {/* Lifting */}
        <FLabel mt={24} mb={10}>Lifting</FLabel>
        <div style={{ marginBottom: 10 }}>
          <FSegBar pct={barPct[data.liftingExp] || 0} segments={12} height={28} animate={true}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
          {levels.map(o => {
            const sel = data.liftingExp === o.val;
            return (
              <button key={o.val} onClick={() => setData({ ...data, liftingExp: o.val })} style={{
                padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
                background: sel ? 'rgba(255,110,80,0.06)' : Color.surface,
                border: sel ? `2px solid ${Color.accent}` : `2px solid ${Color.border}`,
                color: Color.text, fontFamily: Font.sans, fontSize: 13, fontWeight: 500,
                textAlign: 'center',
                transition: `all ${Duration.normal} ${Ease.spring}`,
                transform: sel ? 'scale(1.03)' : 'scale(1)'
              }}>
                <div>{o.label}</div>
                <div style={{ fontSize: 10, color: Color.mute, marginTop: 2 }}>{o.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Cardio */}
        <FLabel mb={10}>Cardio</FLabel>
        <div style={{ marginBottom: 10 }}>
          <FSegBar pct={barPct[data.cardioExp] || 0} segments={12} height={28} animate={true}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {levels.map(o => {
            const sel = data.cardioExp === o.val;
            return (
              <button key={o.val} onClick={() => setData({ ...data, cardioExp: o.val })} style={{
                padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
                background: sel ? 'rgba(255,110,80,0.06)' : Color.surface,
                border: sel ? `2px solid ${Color.accent}` : `2px solid ${Color.border}`,
                color: Color.text, fontFamily: Font.sans, fontSize: 13, fontWeight: 500,
                textAlign: 'center',
                transition: `all ${Duration.normal} ${Ease.spring}`,
                transform: sel ? 'scale(1.03)' : 'scale(1)'
              }}>
                <div>{o.label}</div>
                <div style={{ fontSize: 10, color: Color.mute, marginTop: 2 }}>{o.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
      <OBNextBtn onClick={onNext} disabled={!data.liftingExp || !data.cardioExp}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 7 · Goal
   ══════════════════════════════════════════════════════════ */

function OB_Goal({ onNext, onBack, data, setData }) {
  const options = [
    { val: 'lose', label: 'Lose fat', sub: 'Cut body fat while preserving muscle', icon: ICONS.trend_dn },
    { val: 'build', label: 'Build muscle', sub: 'Lean bulk with controlled surplus', icon: ICONS.trend_up },
    { val: 'maintain', label: 'Maintain', sub: 'Hold current weight and composition', icon: ICONS.pause },
    { val: 'recomp', label: 'Recomposition', sub: 'Build muscle and lose fat simultaneously', icon: ICONS.swap },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Goal" onBack={onBack}/>
      <OBProgress current={6} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px' }}>
        <OBQuestion sub="This determines your caloric strategy.">
          What's your primary goal?
        </OBQuestion>
        <FStagger delay={50}>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {options.map(o => (
              <OBCard key={o.val} selected={data.goal === o.val}
                onClick={() => setData({ ...data, goal: o.val })}
                label={o.label} sub={o.sub}
                icon={<FIcon path={o.icon} size={18} color={data.goal === o.val ? Color.accent : Color.dim}/>}/>
            ))}
          </div>
        </FStagger>
      </div>
      <OBNextBtn onClick={onNext} disabled={!data.goal}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 8 · TDEE Result
   ProgressRing reveal + staggered info bubbles
   ══════════════════════════════════════════════════════════ */

function OB_TDEE({ onNext, onBack, data }) {
  const actMult = { sedentary: 1.2, moderate: 1.55, active: 1.9 };
  const mult = actMult[data.activityLevel] || 1.5;
  const age = data.birthYear ? (2026 - data.birthYear) : 25;
  const w = data.weight || 70;
  const h = data.height || 175;
  let bmr;
  if (data.sex === 'female') {
    bmr = 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
  } else {
    bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * age;
  }
  const tdee = Math.round(bmr * mult);

  const [phase, setPhase] = React.useState(0);
  const [ringPct, setRingPct] = React.useState(0);
  const [countVal, setCountVal] = React.useState(0);

  React.useEffect(() => {
    // Ring fill animation
    const r1 = setTimeout(() => setRingPct(100), 200);
    // Counter animation
    const duration = 1200;
    const start = performance.now();
    let raf;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCountVal(Math.round(tdee * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    const r2 = setTimeout(() => { raf = requestAnimationFrame(animate); }, 400);
    // Phase reveals
    const t1 = setTimeout(() => setPhase(1), 1600);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(3), 3200);
    return () => {
      clearTimeout(r1); clearTimeout(r2);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const ringSize = 140;
  const strokeW = 5;
  const r = (ringSize - strokeW) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (ringPct / 100) * c;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <OBNav title="Your Estimate" onBack={onBack}/>
      <OBProgress current={7} total={9}/>
      <div style={{ flex: 1, padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Ring + number */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, marginTop: 12 }}>
          <div style={{ position: 'relative', width: ringSize, height: ringSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={ringSize} height={ringSize} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
              <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW}/>
              <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none"
                stroke={Color.accent} strokeWidth={strokeW}
                strokeDasharray={c} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)` }}/>
            </svg>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <FNum size={32} weight={300}>{countVal}</FNum>
              <div style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute, letterSpacing: 1.4, marginTop: 2 }}>KCAL / DAY</div>
            </div>
          </div>
        </div>

        {phase >= 1 && <div style={{
          padding: '14px 18px', borderRadius: 14,
          background: Color.surface, border: `1px solid ${Color.border}`,
          fontSize: 14, lineHeight: 1.6, color: Color.dim,
          animation: 'fStaggerIn 0.3s ease both'
        }}>
          This is your estimated <span style={{ color: Color.accent, fontWeight: 600 }}>Total Daily Energy Expenditure</span> — how many Calories you burn each day.
        </div>}

        {phase >= 2 && <div style={{
          padding: '14px 18px', borderRadius: 14,
          background: Color.surface, border: `1px solid ${Color.border}`,
          fontSize: 14, lineHeight: 1.6, color: Color.dim,
          animation: 'fStaggerIn 0.3s ease both'
        }}>
          Understanding this is key to managing your weight. Your goal adjusts this number to create the right deficit or surplus.
        </div>}

        {phase >= 3 && <div style={{
          padding: '14px 18px', borderRadius: 14,
          background: 'rgba(255,110,80,0.06)', border: '1px solid rgba(255,110,80,0.15)',
          fontSize: 13, lineHeight: 1.6, color: Color.dim,
          animation: 'fStaggerIn 0.3s ease both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <FIcon path={ICONS.sparkle} size={14} color={Color.accent}/>
            <span style={{ fontFamily: Font.mono, fontSize: 10, color: Color.accent, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>Initial estimate</span>
          </div>
          This number refines itself as you log data. After ~6 weeks, expect accuracy within ±80 kcal.
        </div>}
      </div>
      <OBNextBtn onClick={onNext} disabled={phase < 3} label="Continue"/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 9 · Ready
   Jewel ring celebration + macro bars + split CTA
   ══════════════════════════════════════════════════════════ */

function OB_Ready({ data }) {
  const actMult = { sedentary: 1.2, moderate: 1.55, active: 1.9 };
  const mult = actMult[data.activityLevel] || 1.5;
  const age = data.birthYear ? (2026 - data.birthYear) : 25;
  const w = data.weight || 70;
  const h = data.height || 175;
  let bmr;
  if (data.sex === 'female') {
    bmr = 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
  } else {
    bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * age;
  }
  const tdee = Math.round(bmr * mult);
  const goalMod = { lose: -480, build: 300, maintain: 0, recomp: -150 };
  const target = tdee + (goalMod[data.goal] || 0);
  const protein = Math.round(w * 2);
  const fatCals = Math.round(target * 0.25);
  const fat = Math.round(fatCals / 9);
  const carbCals = target - (protein * 4) - fatCals;
  const carbs = Math.round(carbCals / 4);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '32px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        {/* Logo with jewel ring */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 16 }}>
            <div className="aurevion-jewel-icon" style={{
              position: 'relative', width: 64, height: 64, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div className="aurevion-jewel-face" style={{
                position: 'relative', width: 'calc(100% - 7px)', height: 'calc(100% - 7px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 50% 30%, #2a2a2d 0%, #131316 55%, #0a0a0b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 5px rgba(0,0,0,0.7)'
              }}>
                <AurevionMark size={32}/>
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: Font.sans, fontSize: 32, fontWeight: 200,
            letterSpacing: -1, color: Color.text, lineHeight: 1.1
          }}>YOU'RE ALL SET</div>
          <div style={{ fontFamily: Font.mono, fontSize: 11, color: Color.mute, letterSpacing: 1.4, marginTop: 8, textTransform: 'uppercase' }}>
            Your plan is ready
          </div>
        </div>

        <FStagger delay={80}>
          {/* Daily target */}
          <div style={{
            padding: '18px 20px', borderRadius: 16,
            background: Color.surface, border: `1px solid ${Color.border}`,
            marginBottom: 10
          }}>
            <FLabel>Daily Target</FLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <FNum size={40} weight={200} unit="KCAL">{target}</FNum>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              <FTag tone="accent">{data.goal ? data.goal.toUpperCase() : 'MAINTAIN'}</FTag>
              <FTag tone="mute">{goalMod[data.goal] > 0 ? '+' : ''}{goalMod[data.goal] || 0} KCAL</FTag>
            </div>
          </div>

          {/* Macros with textured bars */}
          <div style={{
            padding: '18px 20px', borderRadius: 16,
            background: Color.surface, border: `1px solid ${Color.border}`,
            marginBottom: 10
          }}>
            <FLabel>Macro Targets</FLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
              {[
                { label: 'Protein', val: protein, max: Math.max(protein, carbs, fat), color: Color.accent },
                { label: 'Carbs', val: carbs, max: Math.max(protein, carbs, fat), color: Color.dim },
                { label: 'Fat', val: fat, max: Math.max(protein, carbs, fat), color: Color.mute },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontFamily: Font.mono, fontSize: 10, letterSpacing: 1, color: Color.mute, textTransform: 'uppercase' }}>{m.label}</span>
                    <FNum size={20} weight={300} unit="G">{m.val}</FNum>
                  </div>
                  <FTexBar pct={(m.val / m.max) * 100} height={10} color={m.color}/>
                </div>
              ))}
            </div>
          </div>

          {/* Stats summary */}
          <div style={{
            padding: '14px 20px', borderRadius: 16,
            background: Color.surface, border: `1px solid ${Color.border}`,
            display: 'flex', gap: 8, flexWrap: 'wrap'
          }}>
            <FTag tone="mute">{data.weight} {data.weightUnit || 'kg'}</FTag>
            <FTag tone="mute">{data.height} cm</FTag>
            <FTag tone="mute">{data.exerciseFreq} / WK</FTag>
            <FTag tone="mute">{data.bodyFat || '—'} BF</FTag>
          </div>
        </FStagger>

        <div style={{ flex: 1 }}/>
      </div>
      <div style={{ padding: '16px 24px 20px' }}>
        <FBtn variant="split" full iconLeading={ICONS.fwd}>Enter AUREVI0N</FBtn>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Master Onboarding Flow — 10 steps with directional transitions
   ══════════════════════════════════════════════════════════ */

function OnboardingFlow() {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({});
  const [direction, setDirection] = React.useState('forward');
  const [transKey, setTransKey] = React.useState(0);

  const next = () => { setDirection('forward'); setTransKey(k => k + 1); setStep(s => s + 1); };
  const back = () => { setDirection('back'); setTransKey(k => k + 1); setStep(s => Math.max(0, s - 1)); };

  const steps = [
    <OB_Welcome key="welcome" onNext={next}/>,
    <OB_Sex key="sex" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_Birthday key="birthday" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_BodyMetrics key="metrics" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_BodyFat key="bodyFat" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_Activity key="activity" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_Experience key="experience" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_Goal key="goal" onNext={next} onBack={back} data={data} setData={setData}/>,
    <OB_TDEE key="tdee" onNext={next} onBack={back} data={data}/>,
    <OB_Ready key="ready" data={data}/>,
  ];

  const currentStep = steps[step] || steps[0];

  return (
    <div key={transKey}
      className={step === 0 ? '' : direction === 'forward' ? 'ob-step-forward' : 'ob-step-back'}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {currentStep}
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

Object.assign(window, {
  OnboardingFlow, OnboardingScreen,
  OB_Welcome, OB_Sex, OB_Birthday, OB_BodyMetrics,
  OB_BodyFat, OB_Activity, OB_Experience, OB_Goal,
  OB_TDEE, OB_Ready, AurevionMark, AurevionMarkAnimated
});
