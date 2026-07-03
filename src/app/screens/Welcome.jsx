// 00 Onboarding · Welcome — first-impression hero with the jewel.

import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FMono, FBtn, Phone } from '../../ui/components'

export function WelcomeScreen() {
  return (
    <Phone label="Welcome" group="ONBOARDING">
      <div style={{ flex: 1, padding: '40px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <FMono color={Color.mute} size={10}>AUREVION · v0.1</FMono>
        <div style={{ marginTop: 18 }}>
          <FMono color={Color.accent}>BUILD THE BRIEF</FMono>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          <div style={{ fontFamily: Font.sans, fontSize: 40, fontWeight: 300, letterSpacing: -1.2, lineHeight: 1.05 }}>
            A health system that reads like<br/>
            <span style={{ color: Color.accent, fontFamily: Font.mono, fontStyle: 'normal' }}>instrumentation</span>,<br/>
            not a brochure.
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.55, color: Color.dim }}>
            Set a real goal. Get a real plan. We'll handle the bookkeeping — you handle the work.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
          <FBtn variant="primary" size="lg" icon={ICONS.fwd}>
            Begin
          </FBtn>
          <button style={{
            background: 'transparent', border: 'none', color: Color.dim, padding: 0,
            fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer'
          }}>I already have an account</button>
        </div>
      </div>
    </Phone>
  );
}
