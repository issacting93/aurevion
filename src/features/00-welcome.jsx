// 00 Onboarding · Welcome — first-impression hero with the jewel.

function WelcomeScreen() {
  return (
    <Phone label="Welcome" group="ONBOARDING">
      <div style={{ flex: 1, padding: '40px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <FMono color={F.mute} size={10}>AUREVION · v0.1</FMono>
        <div style={{ marginTop: 18 }}>
          <FMono color={F.accent}>BUILD THE BRIEF</FMono>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <div style={{ fontFamily: FF.sans, fontSize: 40, fontWeight: 300, letterSpacing: -1.2, lineHeight: 1.05 }}>
            A health system that reads like<br/>
            <span style={{ color: F.accent, fontFamily: FF.mono, fontStyle: 'normal' }}>instrumentation</span>,<br/>
            not a brochure.
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.55, color: F.dim }}>
            Set a real goal. Get a real plan. We'll handle the bookkeeping — you handle the work.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
          <FJewel glyph={ICONS.fwd.replace('M19 12H5 M12 19l-7-7 7-7','M5 12h14M13 5l7 7-7 7')}>
            Begin
          </FJewel>
          <button style={{
            background: 'transparent', border: 'none', color: F.dim, padding: 0,
            fontFamily: FF.mono, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer'
          }}>I already have an account</button>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { WelcomeScreen });
