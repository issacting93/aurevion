// ════════════════════════════════════════════════════════════
// Check-in Flow — 4-step weekly weigh-in that closes the SDAO loop
// ════════════════════════════════════════════════════════════

import { useState } from 'react'
import { Color, Font, Space, Radius, Duration, Ease, Type } from '../../ui/tokens'
import { ICONS, FBtn, FIcon, FNum, FLabel, FMono, FTag, FStagger, FSurface, FNavBar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'

/* ── Helpers ───────────────────────────────────────────── */

function CINav({ title, onBack }) {
  return (
    <FNavBar
      title={title}
      leading={onBack ? <FIcon path={ICONS.back} size={20} color={Color.text} onClick={onBack}/> : null}
    />
  );
}

/* Step dots inlined below */

function CINumberInput({ value, onChange, min, max, step = 0.1, unit }) {
  const adjust = (delta) => {
    const next = Math.round((value + delta) * 10) / 10;
    if (next >= min && next <= max) onChange(next);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Space[6] }}>
      <button onClick={() => adjust(-step)} style={{
        width: 48, height: 48, borderRadius: Radius.full, border: `1px solid ${Color.border}`,
        background: Color.surface, color: Color.text, cursor: 'pointer',
        display: 'grid', placeItems: 'center', fontSize: 20, fontFamily: Font.sans,
      }}>−</button>
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        <FNum size={48} weight={200}>{value}</FNum>
        {unit && <div style={{ ...Type.labelSm, color: Color.mute, letterSpacing: 1.4, marginTop: 4 }}>{unit}</div>}
      </div>
      <button onClick={() => adjust(step)} style={{
        width: 48, height: 48, borderRadius: Radius.full, border: `1px solid ${Color.border}`,
        background: Color.surface, color: Color.text, cursor: 'pointer',
        display: 'grid', placeItems: 'center', fontSize: 20, fontFamily: Font.sans,
      }}>+</button>
    </div>
  );
}

/* ── Decision logic ────────────────────────────────────── */

function computeDecision(checkins, targets) {
  if (checkins.length < 2) return null;
  const delta = checkins[0].weight - checkins[1].weight;
  if (delta < -0.75) {
    return {
      type: 'deficit_too_aggressive',
      title: 'Slow it down',
      body: `You lost ${Math.abs(delta).toFixed(1)} kg this week. Consider increasing intake by ~200 kcal to preserve muscle.`,
      tone: 'red',
    };
  }
  if (delta > 0.3 && targets?.target < targets?.tdee) {
    return {
      type: 'deficit_not_working',
      title: 'Deficit not tracking',
      body: `Weight increased ${delta.toFixed(1)} kg despite a deficit. Review logging accuracy.`,
      tone: 'accent',
    };
  }
  return {
    type: 'on_track',
    title: 'On track',
    body: 'Your progress is consistent with your targets. Keep going.',
    tone: 'green',
  };
}

/* ── Steps ─────────────────────────────────────────────── */

function CIWeight({ data, setData }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
      <FLabel mb={Space[6]}>Current weight</FLabel>
      <CINumberInput
        value={data.weight}
        onChange={w => setData({ ...data, weight: w })}
        min={30} max={200} step={0.1}
        unit="KG"
      />
    </div>
  );
}

function CIBodyFat({ data, setData, onSkip }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: Space[6] }}>
        <FLabel>Body fat estimate</FLabel>
        <button onClick={onSkip} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          ...Type.labelSm, color: Color.dim,
        }}>SKIP</button>
      </div>
      <CINumberInput
        value={data.bf || 20}
        onChange={bf => setData({ ...data, bf })}
        min={3} max={50} step={0.5}
        unit="% BF"
      />
    </div>
  );
}

function CIRating({ data, setData }) {
  const options = [
    { val: 1, label: 'Struggling' },
    { val: 2, label: 'Off' },
    { val: 3, label: 'Neutral' },
    { val: 4, label: 'Good' },
    { val: 5, label: 'Excellent' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
      <FLabel mb={Space[4]}>How was your week?</FLabel>
      <FStagger delay={40}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: Space[2] }}>
          {options.map(o => {
            const sel = data.rating === o.val;
            return (
              <button key={o.val} onClick={() => setData({ ...data, rating: o.val })} style={{
                padding: `${Space[4]}px ${Space[1]}px`, borderRadius: Radius.lg,
                background: sel ? Color.accentFaint : Color.surface,
                border: `2px solid ${sel ? Color.accent : Color.border}`,
                color: sel ? Color.accent : Color.text, cursor: 'pointer',
                fontFamily: Font.sans, fontSize: 11, fontWeight: 500,
                textAlign: 'center',
                transition: `all ${Duration.normal} ${Ease.spring}`,
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{o.val}</div>
                {o.label}
              </button>
            );
          })}
        </div>
      </FStagger>
    </div>
  );
}

function CISummary({ data, checkins, targets, onSave }) {
  const prev = checkins[0];
  const delta = prev ? +(data.weight - prev.weight).toFixed(1) : null;
  const decision = prev ? computeDecision([data, ...checkins], targets) : null;

  return (
    <div style={{ flex: 1, padding: '0 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <FStagger delay={60}>
        {/* Weight result */}
        <FSurface style={{ marginBottom: Space[3] }}>
          <FLabel>Weight</FLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[3], marginTop: Space[2] }}>
            <FNum size={36} weight={200}>{data.weight}</FNum>
            <FMono size={11} color={Color.mute}>KG</FMono>
            {delta !== null && (
              <FTag tone={delta < 0 ? 'green' : delta > 0 ? 'red' : 'neutral'}>
                {delta > 0 ? '+' : ''}{delta} KG
              </FTag>
            )}
          </div>
          {prev && <FMono color={Color.mute} size={10}>PREV: {prev.weight} KG · {prev.date}</FMono>}
        </FSurface>

        {/* Body fat (if provided) */}
        {data.bf && (
          <FSurface style={{ marginBottom: Space[3] }}>
            <FLabel>Body Fat</FLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[3], marginTop: Space[2] }}>
              <FNum size={28} weight={200}>{data.bf}</FNum>
              <FMono size={11} color={Color.mute}>%</FMono>
            </div>
          </FSurface>
        )}

        {/* Rating */}
        <FSurface style={{ marginBottom: Space[3] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FLabel>Weekly rating</FLabel>
            <FMono color={Color.accent}>{data.rating} / 5</FMono>
          </div>
        </FSurface>

        {/* Decision card */}
        {decision && (
          <FSurface tone={decision.tone} icon={ICONS.sparkle} title={decision.title} style={{ marginBottom: Space[3] }}>
            <div style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 1.5 }}>
              {decision.body}
            </div>
          </FSurface>
        )}
      </FStagger>

      <div style={{ flex: 1 }}/>

      <div style={{ padding: `${Space[4]}px 0 ${Space[5]}px` }}>
        <FBtn variant="primary" full size="lg" onClick={onSave}>Save check-in</FBtn>
      </div>
    </div>
  );
}

/* ── Flow ──────────────────────────────────────────────── */

export function CheckInFlowContent({ onComplete }) {
  const { profile, targets, checkins, logCheckin, addIntervention } = useUser();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    weight: checkins?.[0]?.weight || profile?.weight || 70,
    bf: null,
    rating: 3,
  });

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSave = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const entry = { ...data, date: dateStr };
    logCheckin(entry);

    // Generate intervention if applicable
    const allCheckins = [entry, ...(checkins || [])];
    const decision = computeDecision(allCheckins, targets);
    if (decision && decision.type !== 'on_track') {
      addIntervention({
        ...decision,
        id: `checkin-${now.getTime()}`,
      });
    }

    onComplete?.();
  };

  const skipBf = () => {
    setData({ ...data, bf: null });
    next();
  };

  const titles = ['Weight', 'Body Fat', 'Rating', 'Summary'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CINav
        title={titles[step]}
        onBack={step > 0 ? back : undefined}
      />
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '8px 0' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: i === step ? 16 : 6, height: 6, borderRadius: 9999,
            background: i <= step ? Color.accent : Color.faint,
            transition: 'all 0.25s ease',
          }}/>
        ))}
      </div>

      {step === 0 && <CIWeight data={data} setData={setData}/>}
      {step === 1 && <CIBodyFat data={data} setData={setData} onSkip={skipBf}/>}
      {step === 2 && <CIRating data={data} setData={setData}/>}
      {step === 3 && <CISummary data={data} checkins={checkins || []} targets={targets} onSave={handleSave}/>}

      {step < 3 && (
        <div style={{ padding: `${Space[4]}px 24px ${Space[5]}px`, flexShrink: 0 }}>
          <FBtn variant="primary" full size="lg"
            disabled={step === 2 && !data.rating}
            onClick={next}>
            {step === 1 ? 'Next' : 'Continue'}
          </FBtn>
        </div>
      )}
    </div>
  );
}

export function CheckInFlowScreen() {
  return (
    <Phone label="Check-in" group="OBSERVE">
      <FNavBar title="Weekly Check-in" leading={<FIcon path={ICONS.back} size={20} color={Color.text} />} />
      <CheckInFlowContent />
    </Phone>
  )
}
