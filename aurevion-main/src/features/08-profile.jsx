// 08 Profile — account hub. Surfaces avatar, current goal state, recent check-ins, settings entry.

function ProfileScreen() {
  return (
    <Phone label="Profile" group="ACCOUNT">
      <FNavBar
        title="Profile"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8 }}>
          <Avatar size={72} initials="DL" tone="warm"/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 400 }}>Daniel Lacayo</div>
            <FMono color={F.mute}>JOINED · 12 APR 2026</FMono>
          </div>
        </div>

        {/* Active goal card */}
        <div style={{
          marginTop: 32, padding: 16, borderRadius: 12,
          background: F.surface, border: `1px solid ${F.accent}40`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FLabel color={F.accent}>Active contract</FLabel>
            <FMono color={F.accent}>W04 / 16</FMono>
          </div>
          <div style={{ marginTop: 8 }}>
            <FNum size={36} weight={200}>22.4 → 15.0%</FNum>
          </div>
          <FMono color={F.mute}>BODY FAT · ENDS 04 SEP</FMono>
          <div style={{ marginTop: 18 }}>
            <FTexBar pct={28} height={6}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <FMono color={F.mute} size={9}>28% COMPLETE</FMono>
            <FMono color={F.green} size={9}>−1.4 KG SO FAR</FMono>
          </div>
        </div>

        {/* Recent check-ins */}
        <FSection label="Recent check-ins" mt={40} mb={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FNum size={26} weight={200}>4 / 4 wks</FNum>
            <FMono color={F.green}>STREAK</FMono>
          </div>
        </FSection>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { d: 'Sat 23 May', sub: 'BODY FAT · WEIGHT', delta: '−0.4 kg', dtone: F.green },
            { d: 'Sat 16 May', sub: 'BODY FAT · WEIGHT', delta: '−0.6 kg', dtone: F.green },
            { d: 'Sat 09 May', sub: 'BODY FAT · WEIGHT', delta: '−0.2 kg', dtone: F.green },
            { d: 'Sat 02 May', sub: 'BODY FAT · WEIGHT', delta: '−0.3 kg', dtone: F.green },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 0', borderTop: `1px solid ${F.borderSoft}`,
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 400 }}>{row.d}</div>
                <FMono color={F.mute} size={10}>{row.sub}</FMono>
              </div>
              <FMono color={row.dtone}>{row.delta}</FMono>
            </div>
          ))}
        </div>

        {/* Settings rows */}
        <FSection label="Settings" mt={40} mb={12}>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
            {[
              { i: ICONS.goal,   t: 'Goal & contract',     sub: 'EDIT, PAUSE, OR RESET' },
              { i: ICONS.dumb,   t: 'Training preferences', sub: '4 LIFT · 2 ZONE 2 · 5.5 H/WK' },
              { i: ICONS.meal,   t: 'Diet preferences',     sub: 'OMNIVORE · NO PORK · NUT-FREE' },
              { i: ICONS.bell,   t: 'Reminders',            sub: 'MEAL, TRAIN, CHECK-IN' },
              { i: ICONS.user,   t: 'Account',              sub: 'EMAIL, PASSWORD, DATA' },
            ].map((row, i) => (
              <button key={i}
                data-stay="true"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '20px 0', borderTop: `1px solid ${F.borderSoft}`,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: F.text, textAlign: 'left', fontFamily: FF.sans,
                  width: '100%',
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                  color: F.dim,
                }}>
                  <FIcon path={row.i} size={18} stroke={1.8}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 400 }}>{row.t}</div>
                  <FMono color={F.mute} size={10}>{row.sub}</FMono>
                </div>
                <FIcon path={ICONS.fwd} size={16} color={F.mute}/>
              </button>
            ))}
          </div>
        </FSection>

        <div style={{ marginTop: 32 }}>
          <FBtn variant="ghost" size="md" full data-stay="true">Sign out</FBtn>
        </div>
      </div>
      <FTabBar active={4}/>
    </Phone>
  );
}

// Avatar primitive — surfaces the Avatar component from the audit.
function Avatar({ initials, tone = 'neutral', size = 48, image }) {
  const tones = {
    neutral: '#2a2a2a',
    warm:    '#5a3a35',
    cool:    '#1f2a3a',
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: image ? `url(${image}) center/cover` : tones[tone] || tones.neutral,
      border: `1.5px solid ${F.borderSoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: FF.mono, fontWeight: 600,
      fontSize: size * 0.32, letterSpacing: 0.5, flexShrink: 0,
    }}>{!image && initials}</div>
  );
}

Object.assign(window, { ProfileScreen, Avatar });
