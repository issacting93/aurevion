// 09 FeatureCard · Fullscreen morph — the card → cook-mode entry transition.
// Tap the card, it expands to fill the phone, revealing the cook-mode shell.

import { useState, useEffect } from 'react'
import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FIcon, FTag, FBtn, FSection, Phone } from '../../ui/components'
import { COOK_ICONS } from '../../ui/icons'
import { MotionEase } from '../../ui/motion'

/* ── Small stat pill for the card face ── */
function StatPill({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.2, color: Color.mute, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: Font.mono, fontSize: 16, fontWeight: 300, color: Color.text, letterSpacing: -0.5 }}>{value}</span>
    </div>
  );
}

function MorphCard({ open, onToggle }) {
  const [pressed, setPressed] = useState(false);
  const [step, setStep] = useState(0);
  const [stepTransition, setStepTransition] = useState(false);

  // Reset step when closing
  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  const steps = [
    { num: '01', action: 'Pat salmon dry, season both sides.', icon: COOK_ICONS.season, detail: 'SALT \u00B7 PEPPER \u00B7 OLIVE OIL', time: '2 min' },
    { num: '02', action: 'Heat pan med-high until oil shimmers.', icon: COOK_ICONS.sear, detail: 'STAINLESS \u00B7 MED-HIGH', time: '3 min' },
    { num: '03', action: 'Sear skin-side down, don\u2019t move.', icon: COOK_ICONS.saute, detail: 'SKIN DOWN \u00B7 4 MIN', time: '4 min' },
    { num: '04', action: 'Flip, add greens beside. Finish together.', icon: COOK_ICONS.plate, detail: 'FLIP \u00B7 GREENS \u00B7 3 MIN', time: '3 min' },
  ];

  const goStep = (next) => {
    if (next < 0 || next >= steps.length || next === step) return;
    setStepTransition(true);
    setTimeout(() => {
      setStep(next);
      setStepTransition(false);
    }, 140);
  };

  const currentStep = steps[step];

  return (
    <div
      onClick={(e) => {
        if (open) return; // don't toggle when open (use close btn)
        onToggle();
      }}
      onMouseDown={() => !open && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      data-stay="true"
      style={{
        position: open ? 'absolute' : 'relative',
        zIndex: open ? 90 : 1,
        marginTop: open ? 0 : 0,
        inset: open ? 0 : 'auto',
        cursor: open ? 'default' : 'pointer',
        background: open
          ? Color.bg
          : `linear-gradient(160deg, rgba(255,110,80,0.14) 0%, rgba(255,110,80,0.03) 50%, ${Color.surface} 100%)`,
        borderRadius: open ? 0 : 16,
        border: open ? 'none' : `1px solid rgba(255,110,80,0.25)`,
        overflow: 'hidden',
        height: open ? '100%' : 180,
        boxSizing: 'border-box',
        transform: pressed ? 'scale(0.975)' : 'scale(1)',
        boxShadow: open
          ? '0 24px 80px rgba(0,0,0,0.6)'
          : pressed
            ? '0 2px 8px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.25), 0 0 0 0 rgba(255,110,80,0)',
        transition: [
          `border-radius 0.38s ${MotionEase.spring}`,
          `inset 0.01s ${open ? '0s' : '0.38s'}`,
          `position 0.01s ${open ? '0s' : '0.38s'}`,
          `height 0.4s ${MotionEase.spring}`,
          `transform 0.14s ${MotionEase.enter}`,
          'box-shadow 0.35s ease',
          'background 0.3s ease',
          'border 0.2s ease',
        ].join(', '),
      }}>

      {/* ── COLLAPSED CARD CONTENT ── */}
      <div style={{
        position: 'absolute', inset: 0, padding: '18px 20px', zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        opacity: open ? 0 : 1,
        transform: open ? 'scale(0.94)' : 'scale(1)',
        transition: `opacity .16s ease, transform .24s ${MotionEase.enter}`,
        pointerEvents: open ? 'none' : 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <FLabel color={Color.accent} mb={8} letter={1.6}>Start cooking</FLabel>
            <div style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.3 }}>
              Salmon &amp; greens
            </div>
          </div>
          <FBtn variant="primary" style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, minHeight: 0 }}>
            <FIcon path={ICONS.play} size={17} color={Color.accentText} stroke={2.4} />
          </FBtn>
        </div>

        {/* Bottom stats row */}
        <div style={{ display: 'flex', gap: Space[5], alignItems: 'baseline' }}>
          <StatPill label="Steps" value="4"/>
          <StatPill label="Time" value="28m"/>
          <StatPill label="Start" value="19:00"/>
        </div>
      </div>

      {/* ── EXPANDED COOK MODE ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(16px)',
        transition: open
          ? `opacity .28s ease .12s, transform .36s ${MotionEase.spring} .1s`
          : 'opacity .12s ease, transform .12s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 20px 10px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={onToggle} data-stay="true" style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            transition: 'background .12s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
            <FIcon path={ICONS.close} size={16} color={Color.text}/>
          </button>
          <FMono color={Color.mute} size={10}>COOK MODE</FMono>
          <div style={{ width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
            <FIcon path={ICONS.timer} size={16} color={Color.dim}/>
          </div>
        </div>

        {/* Step progress dots */}
        <div style={{ padding: '0 20px 14px', display: 'flex', gap: Space[1] }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => goStep(i)} data-stay="true" style={{
              flex: 1, height: 3, borderRadius: 2, border: 'none', cursor: 'pointer',
              background: i <= step ? Color.accent : 'rgba(255,255,255,0.08)',
              opacity: i === step ? 1 : i < step ? 0.6 : 0.4,
              transition: 'background .2s ease, opacity .2s ease',
            }}/>
          ))}
        </div>

        {/* Step content — animate on step change */}
        <div style={{
          flex: 1, padding: '0 24px 32px', display: 'flex', flexDirection: 'column',
          opacity: stepTransition ? 0 : 1,
          transform: stepTransition ? 'translateX(-8px)' : 'translateX(0)',
          transition: stepTransition
            ? 'opacity .1s ease, transform .1s ease'
            : `opacity .24s ${MotionEase.enter} .04s, transform .28s ${MotionEase.spring}`,
        }}>
          {/* Step label */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: Space[2], marginBottom: 14 }}>
            <span style={{
              fontFamily: Font.mono, fontSize: 28, fontWeight: 200,
              color: Color.accent, letterSpacing: -1, lineHeight: 1,
            }}>{currentStep.num}</span>
            <span style={{
              fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.4,
              color: Color.mute, textTransform: 'uppercase',
            }}>of {String(steps.length).padStart(2, '0')}</span>
          </div>

          {/* Instruction */}
          <div style={{
            fontSize: 28, fontWeight: 300, lineHeight: 1.2,
            letterSpacing: -0.5, color: Color.text, marginBottom: 20,
          }}>
            {currentStep.action}
          </div>

          {/* Detail chip */}
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: Color.surface, border: `1px solid ${Color.borderSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FIcon path={currentStep.icon} size={16} color={Color.accent} stroke={1.8}/>
              <FMono color={Color.text} size={10}>{currentStep.detail}</FMono>
            </div>
            <FTag tone="accent" size="sm">{currentStep.time}</FTag>
          </div>

          {/* Illustration zone */}
          <div style={{
            flex: 1, borderRadius: 14, minHeight: 120,
            background: `radial-gradient(ellipse at 50% 35%, rgba(255,110,80,0.18) 0%, rgba(255,110,80,0.02) 60%), ${Color.surface}`,
            border: `1px solid ${Color.borderSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Subtle grid overlay */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}/>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              opacity: 0.9,
            }}>
              <FIcon path={currentStep.icon} size={52} color={Color.accent} stroke={1.2}/>
              <FMono color={Color.mute} size={10}>STEP {currentStep.num}</FMono>
            </div>
          </div>

          {/* Step nav buttons */}
          <div style={{
            display: 'flex', gap: 10, marginTop: 20,
          }}>
            <button onClick={() => goStep(step - 1)} data-stay="true"
              disabled={step === 0}
              style={{
                flex: 1, height: 56, borderRadius: Radius.lg, border: `1px solid ${Color.borderSoft}`,
                background: 'rgba(255,255,255,0.03)', color: step === 0 ? Color.mute : Color.text,
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                fontFamily: Font.mono, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Space[2],
                opacity: step === 0 ? 0.4 : 1,
                transition: 'opacity .15s ease, background .12s ease',
              }}>
              <FIcon path={ICONS.back} size={14} color={step === 0 ? Color.mute : Color.text} stroke={2.2}/>
              Prev
            </button>
            <button onClick={() => step < steps.length - 1 ? goStep(step + 1) : onToggle()} data-stay="true"
              style={{
                flex: 2, height: 56, borderRadius: Radius.lg, border: 'none',
                background: Color.accent, color: Color.accentText,
                cursor: 'pointer',
                fontFamily: Font.mono, fontSize: 12, fontWeight: 700,
                letterSpacing: 1.6, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Space[2],
                transition: 'background .12s ease, transform .08s ease',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              {step < steps.length - 1 ? 'Next step' : 'Done'}
              <FIcon path={step < steps.length - 1 ? ICONS.fwd : ICONS.check} size={14} color={Color.accentText} stroke={2.6}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureCardMorphScreen() {
  const [open, setOpen] = useState(false);
  return (
    <Phone label="Card → cook morph" group="MEAL PREP">
      <FNavBar
        title="Tonight"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FIcon path={ICONS.bell} size={20} color={Color.dim}/>}
      />

      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto', position: 'relative' }}>
        {/* Header context */}
        <div style={{ marginBottom: 28 }}>
          <FLabel>Up next</FLabel>
          <FNum size={28} weight={200}>Salmon &amp; greens</FNum>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: Space[2] }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: Color.green, boxShadow: '0 0 8px rgba(74,222,128,0.4)',
            }}/>
            <FMono color={Color.dim} size={10}>ALL INGREDIENTS READY</FMono>
          </div>
        </div>

        {/* Macros strip */}
        <div style={{
          display: 'flex', gap: 2, marginBottom: 32,
        }}>
          {[
            { label: 'KCAL', val: '540', color: Color.accent },
            { label: 'PROT', val: '42g', color: Color.text },
            { label: 'CARB', val: '28g', color: Color.dim },
            { label: 'FAT', val: '22g', color: Color.dim },
          ].map((m, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              background: i === 0 ? Color.accentFaint : Color.surface,
              borderRadius: i === 0 ? '8px 0 0 8px' : i === 3 ? '0 8px 8px 0' : 0,
              borderRight: i < 3 ? `1px solid ${Color.borderSoft}` : 'none',
            }}>
              <div style={{ fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.2, color: Color.mute, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontFamily: Font.mono, fontSize: 15, fontWeight: 500, color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>

        {/* THE MORPHING CARD */}
        <MorphCard open={open} onToggle={() => setOpen(o => !o)}/>

        {/* Context below card (only when collapsed) */}
        {!open && (
          <div style={{ marginTop: 32 }}>
            <FSection label="Why this dish" mb={20}>
              <div style={{ fontSize: 13, color: Color.dim, lineHeight: 1.55 }}>
                Salmon hits your protein floor in one move. Pairs with greens to keep carbs low after today's session.
              </div>
            </FSection>

            <div style={{ display: 'flex', gap: Space[2] }}>
              {['28 min', '4 steps', 'Beginner'].map((tag, i) => (
                <FTag key={i} tone="mute" size="sm">{tag}</FTag>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', top: 68, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', zIndex: 100,
        pointerEvents: 'none',
      }}>
        <div style={{
          padding: '6px 14px', borderRadius: Radius.full,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          border: `1px solid ${Color.borderSoft}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          <FMono color={Color.dim} size={10} letter={1.2}>{open ? 'TAP \u00D7 TO COLLAPSE' : 'TAP CARD TO ENTER COOK MODE'}</FMono>
        </div>
      </div>
    </Phone>
  );
}
