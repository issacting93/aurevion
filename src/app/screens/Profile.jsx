// 08 Profile — account hub. Surfaces avatar, current goal state, recent check-ins, settings entry.

import { Color, Space, Radius } from '../../ui/tokens'
import { ICONS, FNavBar, FMono, FIcon, FBtn, FTabBar, FSection, FListRow, FAvatar, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'

export function ProfileContent() {
  const { profile } = useUser();

  return (
    <div style={{ flex: 1, padding: '20px 24px 100px', overflowY: 'auto' }}>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: Space[5], marginTop: 8 }}>
        <FAvatar size={72} initials="DL" tone="warm"/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 400 }}>Daniel Lacayo</div>
          <FMono color={Color.mute}>JOINED · 12 APR 2026</FMono>
        </div>
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
