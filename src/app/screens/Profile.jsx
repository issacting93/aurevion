// 08 Profile — account hub. Surfaces avatar, current goal state, recent check-ins, settings entry.

import { Color, Font, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FLabel, FMono, FNum, FTexBar, FIcon, FBtn, FTabBar, FSection, FSurface, FListRow, FAvatar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { MOCK_BODY } from '../../context/mockUser'

export function ProfileContent() {
  const { checkins, profile } = useUser();
  const nav = useNav();

  const MOCK_CHECKINS = [
    { d: 'Sat 23 May', sub: 'BODY FAT · WEIGHT', delta: '−0.4 kg', dtone: Color.green },
    { d: 'Sat 16 May', sub: 'BODY FAT · WEIGHT', delta: '−0.6 kg', dtone: Color.green },
    { d: 'Sat 09 May', sub: 'BODY FAT · WEIGHT', delta: '−0.2 kg', dtone: Color.green },
    { d: 'Sat 02 May', sub: 'BODY FAT · WEIGHT', delta: '−0.3 kg', dtone: Color.green },
  ];

  const realCheckins = (checkins || []).slice(0, 4).map((c, i, arr) => {
    const prev = arr[i + 1] || (checkins || [])[i + 1];
    const delta = prev ? +(c.weight - prev.weight).toFixed(1) : null;
    return {
      d: c.date,
      sub: c.bf ? 'BODY FAT · WEIGHT' : 'WEIGHT',
      delta: delta !== null ? `${delta > 0 ? '+' : ''}${delta} kg` : '—',
      dtone: delta !== null ? (delta <= 0 ? Color.green : Color.red) : Color.mute,
    };
  });
  const displayCheckins = realCheckins.length > 0 ? realCheckins : MOCK_CHECKINS;
  const streakCount = (checkins || []).length || 4;

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: Space[5], marginTop: 8 }}>
        <FAvatar size={72} initials="DL" tone="warm"/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 400 }}>Daniel Lacayo</div>
          <FMono color={Color.mute}>JOINED · 12 APR 2026</FMono>
        </div>
      </div>

      {/* Active goal card */}
      <FSurface accent={Color.accent} style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <FLabel color={Color.accent}>Active contract</FLabel>
          <FMono color={Color.accent}>W04 / 16</FMono>
        </div>
        <div style={{ marginTop: 8 }}>
          <FNum size={36} weight={200}>{MOCK_BODY.currentBf} → {MOCK_BODY.targetBf}%</FNum>
        </div>
        <FMono color={Color.mute}>BODY FAT · ENDS 04 SEP</FMono>
        <div style={{ marginTop: 18 }}>
          <FTexBar pct={28} height={6}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <FMono color={Color.mute} size={10}>28% COMPLETE</FMono>
          <FMono color={Color.green} size={10}>−1.4 KG SO FAR</FMono>
        </div>
      </FSurface>

      {/* Recent check-ins (data zone) */}
      <FSection label="Recent check-ins" mt={32} mb={12}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <FNum size={26} weight={200}>{streakCount} wks</FNum>
          <FMono color={Color.green}>STREAK</FMono>
        </div>
      </FSection>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {displayCheckins.map((row, i) => (
          <FListRow key={i}
            title={row.d}
            subtitle={row.sub}
            trailing={<FMono color={row.dtone}>{row.delta}</FMono>}
          />
        ))}
      </div>

      {/* Log check-in (interaction zone) */}
      <div style={{ marginTop: 24 }}>
        <FBtn variant="primary" full size="md"
          onClick={() => nav?.pushDetail?.('checkin-flow', 'Check-in')}>
          Log check-in
        </FBtn>
      </div>

      {/* Settings — grouped by category (R4) */}
      <FSection label="Preferences" mt={40} mb={0}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { i: ICONS.goal, t: 'Goal & contract',      sub: 'EDIT, PAUSE, OR RESET' },
            { i: ICONS.dumb, t: 'Training preferences',  sub: '4 LIFT · 2 ZONE 2 · 5.5 H/WK' },
            { i: ICONS.meal, t: 'Diet preferences',      sub: 'OMNIVORE · NO PORK · NUT-FREE' },
          ].map((row, i) => (
            <FListRow key={i}
              leading={
                <div style={{
                  width: 36, height: 36, borderRadius: Radius.md,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'grid', placeItems: 'center', color: Color.dim,
                }}>
                  <FIcon path={row.i} size={18} stroke={1.8}/>
                </div>
              }
              title={row.t}
              subtitle={row.sub}
              trailing={<FIcon path={ICONS.fwd} size={16} color={Color.mute}/>}
            />
          ))}
        </div>
      </FSection>

      <FSection label="Account" mt={28} mb={0}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { i: ICONS.bell,   t: 'Reminders',  sub: 'MEAL, TRAIN, CHECK-IN' },
            { i: ICONS.person, t: 'Account',     sub: 'EMAIL, PASSWORD, DATA' },
          ].map((row, i) => (
            <FListRow key={i}
              leading={
                <div style={{
                  width: 36, height: 36, borderRadius: Radius.md,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'grid', placeItems: 'center', color: Color.dim,
                }}>
                  <FIcon path={row.i} size={18} stroke={1.8}/>
                </div>
              }
              title={row.t}
              subtitle={row.sub}
              trailing={<FIcon path={ICONS.fwd} size={16} color={Color.mute}/>}
            />
          ))}
        </div>
      </FSection>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FBtn variant="ghost" size="md" full data-stay="true">Sign out</FBtn>
        <FBtn variant="ghost" size="sm" full data-stay="true" style={{ color: Color.red, borderColor: 'rgba(248,113,113,0.15)' }}>
          Delete account
        </FBtn>
      </div>
    </div>
  );
}

export function ProfileScreen() {
  return (
    <Phone label="Profile" group="ACCOUNT">
      <FNavBar
        title="Profile"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text}/>}
      />
      <ProfileContent />
      <FTabBar active={4}/>
    </Phone>
  );
}
