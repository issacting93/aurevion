// 01 Goal-Setting — onboarding as a contract.

function GoalInputScreen() {
  // Interactive: slider drag for target body fat (10–30%), timeline pick.
  const [target, setTarget] = React.useState(15.0);
  const [weeks, setWeeks] = React.useState(16);
  const trackRef = React.useRef(null);
  const dragging = React.useRef(false);

  const NOW_FAT = 22.4;
  const MIN = 10, MAX = 30;
  const pctOf = (v) => ((v - MIN) / (MAX - MIN)) * 100;

  // Pace = (now − target) / weeks. Sustainable ≤ 0.6%/wk.
  const pace = Math.max(0, ((NOW_FAT - target) / weeks));
  const paceTone = pace > 0.75 ? 'red' : pace > 0.55 ? 'accent' : 'green';
  const paceLabel = pace > 0.75 ? 'TOO FAST' : pace > 0.55 ? 'AGGRESSIVE' : 'SUSTAINABLE';

  const updateFromClient = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const v = MIN + (x / rect.width) * (MAX - MIN);
    setTarget(Math.max(MIN, Math.min(NOW_FAT - 1, +v.toFixed(1))));
  };

  const onDown = (e) => {
    dragging.current = true;
    updateFromClient(e.clientX ?? e.touches?.[0]?.clientX);
  };
  React.useEffect(() => {
    const onMove = (e) => { if (dragging.current) updateFromClient(e.clientX ?? e.touches?.[0]?.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <Phone label="Goal" group="ONBOARDING">
      <FNavBar
        title="Step 02 / 04"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FMono color={F.mute}>SKIP</FMono>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <FLabel>Where you are</FLabel>
        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <FNum size={84} weight={200} unit="%">{NOW_FAT.toFixed(1)}</FNum>
        </div>
        <FMono color={F.mute}>BODY FAT · DEXA SCAN · 12 APR</FMono>

        {/* Slider with target marker */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <FLabel mb={0}>Target body fat</FLabel>
            <FMono color={F.accent}>{target.toFixed(1)}%</FMono>
          </div>
          <FScale marks={[10, 15, 20, 25, 30]} suffix="%" color={F.mute}/>
          <div
            ref={trackRef}
            onPointerDown={onDown}
            style={{ position: 'relative', height: 36, cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}>
            <div style={{
              position: 'absolute', top: 16, left: 0, right: 0, height: 4,
              background: 'rgba(255,255,255,0.06)', borderRadius: 999,
            }}/>
            {/* range fill (target → now) */}
            <div style={{
              position: 'absolute', top: 16, left: `${pctOf(target)}%`, width: `${pctOf(NOW_FAT) - pctOf(target)}%`, height: 4,
              background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${F.accent}`,
              borderRadius: 999,
            }}/>
            {/* current marker */}
            <div style={{
              position: 'absolute', top: 8, left: `${pctOf(NOW_FAT)}%`, width: 2, height: 20, background: F.mute, borderRadius: 1,
              transform: 'translateX(-50%)',
            }}/>
            <div style={{
              position: 'absolute', top: -12, left: `${pctOf(NOW_FAT)}%`, transform: 'translateX(-50%)',
              fontFamily: FF.mono, fontSize: 9, color: F.mute, letterSpacing: 1,
            }}>NOW</div>
            {/* target handle */}
            <div style={{
              position: 'absolute', top: 8, left: `${pctOf(target)}%`, width: 20, height: 20,
              borderRadius: '50%', background: F.accent, transform: 'translateX(-50%)',
              boxShadow: '0 0 0 4px rgba(255,110,80,0.2)',
              transition: dragging.current ? 'none' : 'left .12s ease',
            }}/>
          </div>
        </div>

        {/* Timeline picker */}
        <div style={{ marginTop: 40 }}>
          <FLabel mb={12}>Timeline</FLabel>
          <div style={{ display: 'flex', gap: 6 }}>
            {[8, 12, 16, 20, 24].map((w) => {
              const on = w === weeks;
              return (
                <button key={w} onClick={() => setWeeks(w)} style={{
                  flex: 1, padding: '14px 0', borderRadius: 8,
                  background: on ? F.accent : 'transparent',
                  color: on ? '#1a0f0a' : F.dim,
                  border: `1px solid ${on ? F.accent : F.borderSoft}`,
                  fontFamily: FF.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1,
                  cursor: 'pointer',
                }}>{w} WK</button>
              );
            })}
          </div>
        </div>

        {/* Pace preview — responds to slider + weeks */}
        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel mb={4}>Pace</FLabel>
              <div style={{ fontFamily: FF.mono, fontSize: 22, fontWeight: 300, letterSpacing: -0.3 }}>{pace.toFixed(2)}<span style={{ fontFamily: FF.mono, fontSize: 12, color: F.mute }}> %/WK</span></div>
            </div>
            <FTag tone={paceTone}>{paceLabel}</FTag>
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <FBtn variant="editorial">Generate the brief</FBtn>
      </div>
    </Phone>
  );
}

function GoalContractScreen() {
  const Row = ({ label, value, unit, tag, tagTone }) => (
    <div style={{ padding: '18px 0', borderBottom: `1px solid ${F.borderSoft}` }}>
      <FLabel mb={6}>{label}</FLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <FNum size={34} weight={200} unit={unit}>{value}</FNum>
        <FTag tone={tagTone}>{tag}</FTag>
      </div>
    </div>
  );
  return (
    <Phone label="Brief" group="ONBOARDING">
      <FNavBar
        title="Your brief"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FMono color={F.mute}>04 / 04</FMono>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <FLabel>The contract</FLabel>
        <div style={{ marginTop: 8 }}>
          <FNum size={42} weight={200}>22.4 → 15.0%</FNum>
        </div>
        <FMono color={F.mute}>BODY FAT · 16 WEEKS · ENDS 04 SEP</FMono>

        <div style={{ marginTop: 32, borderTop: `1px solid ${F.borderSoft}` }}>
          <Row label="Daily deficit"   value="−480" unit="kcal" tag="−18% TDEE" tagTone="accent"/>
          <Row label="Weekly training" value="5.5"  unit="hr"   tag="4 LIFT · 2 Z2"/>
          <Row label="Protein floor"   value="147"  unit="g"    tag="2.1 G/KG"/>
          <Row label="Sleep"           value="≥ 7"  unit="hr"   tag="NON-NEG"/>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, border: `1px dashed ${F.borderSoft}` }}>
          <FLabel mb={6}>If you slip</FLabel>
          <div style={{ fontSize: 13, color: F.dim, lineHeight: 1.5 }}>
            The model re-fits weekly. Miss a day and the timeline shifts — not your standards.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 32, alignItems: 'stretch' }}>
          <FBtn variant="ghost" size="lg">Edit</FBtn>
          <FBtn variant="split" full>Sign on</FBtn>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { GoalInputScreen, GoalContractScreen });
