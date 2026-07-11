/* Aurevion UI Components — subset used by the 3D body viewer */

import { Color, Font, Space, Radius, Type } from './tokens'

// ── Phone shell ──
export function Phone({ children, statusTime = '9:41' }) {
  return (
    <div style={{ width: 402, height: 874, borderRadius: 56, background: Color.bg, color: Color.text, overflow: 'hidden', fontFamily: Font.sans, position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 9px #1a1a1a, 0 0 0 10px #2a2a2a', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 36px 0', fontFamily: Font.sans, fontSize: 15, fontWeight: 600, zIndex: 50, pointerEvents: 'none' }}>
        <span>{statusTime}</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5" /><rect x="4.5" y="5" width="3" height="6" rx="0.5" /><rect x="9" y="2.5" width="3" height="8.5" rx="0.5" /><rect x="13.5" y="0" width="3" height="11" rx="0.5" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.4" fill="none" /><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" /><path d="M23 4v4c.8-.3 1.5-1.3 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" fillOpacity="0.4" /></svg>
        </span>
      </div>
      <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 22, background: '#000', zIndex: 60 }} />
      <div style={{ flex: 1, minHeight: 0, paddingTop: 54, display: 'flex', flexDirection: 'column' }}>{children}</div>
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.35)' }} />
    </div>
  )
}

// ── FLabel ──
export function FLabel({ children, color = Color.mute, size = 11, mb = 6, mt = 0, letter = 1.4 }) {
  return <div style={{ fontFamily: Font.mono, fontSize: size, letterSpacing: letter, color, textTransform: 'uppercase', marginBottom: mb, marginTop: mt }}>{children}</div>
}
