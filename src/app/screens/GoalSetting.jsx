// 01 Goal-Setting — onboarding as a contract.

import { useState, useEffect, useRef } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FScale, FIcon, FTag, FBtn, FListRow, FButtonGroup, Phone } from '../../ui/components'
import { MOCK_BODY, MOCK_TARGETS, MOCK_MEAL_PREP } from '../../context/mockUser'

export function GoalInputContent() {
  // Interactive: slider drag for target body fat (10–30%), timeline pick.
  const [target, setTarget] = useState(MOCK_BODY.targetBf);
  const [weeks, setWeeks] = useState(MOCK_BODY.weeks);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const NOW_FAT = MOCK_BODY.currentBf;
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
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 1.0 : 0.5;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setTarget(t => Math.max(MIN, +(t - step).toFixed(1)));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setTarget(t => Math.min(NOW_FAT - 1, +(t + step).toFixed(1)));
    }
  };
  useEffect(() => {
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
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <FLabel>Where you are</FLabel>
      <div style={{ marginTop: 8, marginBottom: 12 }}>
        <FNum size={84} weight={200} unit="%">{NOW_FAT.toFixed(1)}</FNum>
      </div>
      <FMono color={Color.mute}>BODY FAT · DEXA SCAN · 12 APR</FMono>

      {/* Slider with target marker */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <FLabel mb={0}>Target body fat</FLabel>
          <FMono color={Color.accent}>{target.toFixed(1)}%</FMono>
        </div>
        <FScale marks={[10, 15, 20, 25, 30]} suffix="%" color={Color.mute}/>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Target body fat percentage"
          aria-valuemin={MIN}
          aria-valuemax={NOW_FAT - 1}
          aria-valuenow={target}
          onPointerDown={onDown}
          onKeyDown={onKeyDown}
          style={{ position: 'relative', height: 36, cursor: 'pointer', userSelect: 'none', touchAction: 'none', outline: 'none' }}>
          <div style={{
            position: 'absolute', top: 16, left: 0, right: 0, height: 4,
            background: 'rgba(255,255,255,0.06)', borderRadius: Radius.full,
          }}/>
          {/* range fill (target → now) */}
          <div style={{
            position: 'absolute', top: 16, left: `${pctOf(target)}%`, width: `${pctOf(NOW_FAT) - pctOf(target)}%`, height: 4,
            background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.22) 0 1.5px, transparent 1.5px 5px), ${Color.accent}`,
            borderRadius: Radius.full,
          }}/>
          {/* current marker */}
          <div style={{
            position: 'absolute', top: 8, left: `${pctOf(NOW_FAT)}%`, width: 2, height: 20, background: Color.mute, borderRadius: 1,
            transform: 'translateX(-50%)',
          }}/>
          <div style={{
            position: 'absolute', top: -12, left: `${pctOf(NOW_FAT)}%`, transform: 'translateX(-50%)',
            fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 1,
          }}>NOW</div>
          {/* target handle */}
          <div style={{
            position: 'absolute', top: 8, left: `${pctOf(target)}%`, width: 20, height: 20,
            borderRadius: '50%', background: Color.accent, transform: 'translateX(-50%)',
            boxShadow: '0 0 0 4px rgba(255,110,80,0.2)',
            transition: dragging.current ? 'none' : 'left .12s ease',
          }}/>
        </div>
      </div>

      {/* Timeline picker */}
      <div style={{ marginTop: 40 }}>
        <FLabel mb={12}>Timeline</FLabel>
        <FButtonGroup
          options={[8, 12, 16, 20, 24].map(w => ({ value: w, label: `${w} WK` }))}
          value={weeks}
          onChange={setWeeks}
        />
      </div>

      {/* Pace preview — responds to slider + weeks */}
      <FSurface style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <FLabel mb={4}>Pace</FLabel>
            <div style={{ fontFamily: Font.mono, fontSize: 22, fontWeight: 300, letterSpacing: -0.3 }}>{pace.toFixed(2)}<span style={{ fontFamily: Font.mono, fontSize: 12, color: Color.mute }}> %/WK</span></div>
          </div>
          <FTag tone={paceTone}>{paceLabel}</FTag>
        </div>
      </FSurface>

      <div style={{ flex: 1 }}/>
      <FListRow title="Generate the brief" trailing={<FIcon path={ICONS.fwd} size={18} color={Color.accent} stroke={2} />} onClick={() => {}} style={{ borderTop: `1px solid ${Color.border}` }} />
    </div>
  );
}

export function GoalInputScreen() {
  return (
    <Phone label="Goal" group="ONBOARDING">
      <FNavBar
        title="Step 02 / 04"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FMono color={Color.mute}>SKIP</FMono>}
      />
      <GoalInputContent />
    </Phone>
  );
}

export function GoalContractContent() {
  const Row = ({ label, value, unit, tag, tagTone }) => (
    <div style={{ padding: '18px 0', borderBottom: `1px solid ${Color.borderSoft}` }}>
      <FLabel mb={6}>{label}</FLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <FNum size={34} weight={200} unit={unit}>{value}</FNum>
        <FTag tone={tagTone}>{tag}</FTag>
      </div>
    </div>
  );
  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <FLabel>The contract</FLabel>
        <div style={{ marginTop: 8 }}>
          <FNum size={42} weight={200}>{MOCK_BODY.currentBf} → {MOCK_BODY.targetBf}%</FNum>
        </div>
        <FMono color={Color.mute}>BODY FAT · 16 WEEKS · ENDS 04 SEP</FMono>

        <div style={{ marginTop: 32, borderTop: `1px solid ${Color.borderSoft}` }}>
          <Row label="Daily deficit"   value="−480" unit="kcal" tag="−18% TDEE" tagTone="accent"/>
          <Row label="Weekly training" value="5.5"  unit="hr"   tag="4 LIFT · 2 Z2"/>
          <Row label="Protein floor"   value={String(MOCK_TARGETS.protein)}  unit="g"    tag="2.1 G/KG"/>

          {/* Meal prep approach — from goal engine */}
          <div style={{ padding: '18px 0', borderBottom: `1px solid ${Color.borderSoft}` }}>
            <FLabel mb={6}>MEAL PREP APPROACH</FLabel>
            <FNum size={34} weight={200}>{MOCK_MEAL_PREP.primary}</FNum>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {MOCK_MEAL_PREP.supporting.map((s, i) => (
                <FTag key={i} tone="mute">{s}</FTag>
              ))}
            </div>
          </div>

          <Row label="Sleep"           value="≥ 7"  unit="hr"   tag="NON-NEG"/>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ marginTop: 32, padding: 16, borderRadius: Radius.lg, border: `1px dashed ${Color.borderSoft}` }}>
          <FLabel mb={6}>If you slip</FLabel>
          <div style={{ ...Type.bodyMd, color: Color.dim }}>
            The model re-fits weekly. Miss a day and the timeline shifts — not your standards.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 32, alignItems: 'stretch' }}>
          <FBtn variant="ghost" size="lg">Edit</FBtn>
          <FBtn variant="split" full>Sign on</FBtn>
        </div>
    </div>
  );
}

export function GoalContractScreen() {
  return (
    <Phone label="Brief" group="ONBOARDING">
      <FNavBar
        title="Your brief"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FMono color={Color.mute}>04 / 04</FMono>}
      />
      <GoalContractContent />
    </Phone>
  );
}
