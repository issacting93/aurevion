/* Presentation Demo — sidebar nav + phone stage + keyboard control */

import { useState, useEffect, useCallback } from 'react'
import { useDemo } from '../context/DemoContext'
import { Font, Color } from '../ui/tokens'
import { FIcon, ICONS } from '../ui/components'

const D = {
  bg: '#0a0a0a', panel: '#0f0f0f',
  border: 'rgba(255,255,255,0.06)', text: '#fafafa',
  dim: '#a1a1a1', mute: '#6b6b6b', accent: '#FF6E50',
}

function Mono({ children, color = D.text }) {
  return <span style={{ fontFamily: '"Geist Mono", ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, color, textTransform: 'uppercase' }}>{children}</span>
}

function PhoneScaler({ children, transition, direction, onAdvance, idx, maxIdx }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => {
      const avail = Math.max(420, window.innerHeight - 160)
      setScale(Math.min(1, avail / 874))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      onClickCapture={(e) => {
        const btn = e.target.closest && e.target.closest('button')
        if (!btn) return
        if (btn.dataset.stay === 'true') return
        const bg = getComputedStyle(btn).backgroundColor
        const isAccent = bg.match(/rgb\(255,\s*110,\s*80\)/) || bg.match(/rgb\(255,\s*90,\s*31\)/)
        if (isAccent && idx < maxIdx) onAdvance()
      }}
      style={{
        transform: `scale(${scale})`, transformOrigin: 'center center',
        opacity: transition ? 0 : 1, transition: 'opacity .35s ease-in-out',
      }}>
      {children}
    </div>
  )
}

function ArrowBtn({ dir, disabled, onClick, style }) {
  const path = dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${D.border}`, color: D.text,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.25 : 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .15s, transform .15s', ...style,
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,110,80,0.15)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
    </button>
  )
}

function SidebarRow({ k, l }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{l}</span><span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, color: D.mute }}>{k}</span></div>
}

export default function PresentationDemo() {
  const { currentScreen: idx, screens, go } = useDemo()
  const [transition, setTransition] = useState(false)
  const [direction, setDirection] = useState(1)

  const navigate = useCallback((next) => {
    if (next < 0 || next >= screens.length || next === idx) return
    setDirection(next > idx ? 1 : -1)
    setTransition(true)
    setTimeout(() => { go(next); setTransition(false) }, 180)
  }, [idx, screens.length, go])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); navigate(idx + 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(idx - 1) }
      if (e.key === 'Home') navigate(0)
      if (e.key === 'End') navigate(screens.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, idx, screens.length])

  const current = screens[idx]
  const Cmp = current.C

  // Group sidebar by feature
  const groups = []
  screens.forEach(s => {
    const g = groups.find(x => x.feature === s.feature)
    if (g) g.items.push(s)
    else groups.push({ feature: s.feature, flow: s.flow, items: [s] })
  })

  return (
    <div style={{ height: '100vh', display: 'flex', background: D.bg, color: D.text, fontFamily: '"Geist", -apple-system, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: 280, flexShrink: 0, height: '100%', background: D.panel, borderRight: `1px solid ${D.border}`, overflowY: 'auto', padding: '24px 0' }}>
        <div style={{ padding: '0 24px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <img src="/logo.svg" width="30" height="30" alt="AUREVI0N" style={{ borderRadius: 8 }} />
            <div>
              <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 14, fontWeight: 200 }}>AUREVI0N</div>
              <Mono color={D.mute}>DEMO · v0.2</Mono>
            </div>
          </div>
        </div>

        {groups.map(g => (
          <div key={g.feature} style={{ marginBottom: 4 }}>
            <div style={{ padding: '10px 24px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Mono color={D.mute}>{g.flow} · {g.feature.toUpperCase()}</Mono>
              <Mono color={D.mute}>{g.items.length}</Mono>
            </div>
            {g.items.map((s, i) => {
              const active = s.id === current.id
              return (
                <button key={s.id} onClick={() => navigate(screens.findIndex(x => x.id === s.id))} style={{
                  width: '100%', textAlign: 'left', padding: '10px 24px',
                  background: active ? 'rgba(255,110,80,0.10)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderLeft: active ? `2px solid ${D.accent}` : '2px solid transparent',
                  color: active ? D.text : D.dim,
                  fontFamily: '"Geist", system-ui, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <Mono color={active ? D.accent : D.mute}>{String(i + 1).padStart(2, '0')}</Mono>
                  <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{s.label}</span>
                </button>
              )
            })}
          </div>
        ))}

        <div style={{ padding: '24px 24px 12px', borderTop: `1px solid ${D.border}`, marginTop: 18 }}>
          <Mono color={D.mute}>SHORTCUTS</Mono>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: D.dim }}>
            <SidebarRow k="→ / Space" l="Next screen" />
            <SidebarRow k="←" l="Previous" />
            <SidebarRow k="Home / End" l="Jump first/last" />
          </div>
        </div>
      </aside>

      {/* Main stage */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,110,80,0.05), transparent 60%)' }}>
        {/* Top meta */}
        <header style={{ position: 'absolute', top: 24, left: 24, right: 24, zIndex: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Mono color={D.mute}>{current.flow} · {current.feature.toUpperCase()}</Mono>
            <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: -0.3, marginTop: 4 }}>{current.label}</div>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Mono color={D.mute}>{String(idx + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}</Mono>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: `1px solid ${D.border}`, borderRadius: 999 }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: D.mute, letterSpacing: 1 }}>← →</span>
              <span style={{ fontSize: 11, color: D.dim }}>to navigate</span>
            </div>
          </div>
        </header>

        {/* Arrows */}
        <ArrowBtn dir="left" disabled={idx === 0} onClick={() => navigate(idx - 1)} style={{ position: 'absolute', left: 320, top: '50%', transform: 'translateY(-50%)', zIndex: 4 }} />
        <ArrowBtn dir="right" disabled={idx === screens.length - 1} onClick={() => navigate(idx + 1)} style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', zIndex: 4 }} />

        {/* Phone */}
        <PhoneScaler key={current.id} transition={transition} direction={direction} onAdvance={() => navigate(idx + 1)} idx={idx} maxIdx={screens.length - 1}>
          <Cmp />
        </PhoneScaler>

        {/* Bottom progress */}
        <div style={{ position: 'absolute', bottom: 28, left: 320, right: 60, zIndex: 4, display: 'flex', gap: 4 }}>
          {screens.map((s, i) => (
            <button key={s.id} onClick={() => navigate(i)} style={{
              flex: 1, height: 3, border: 'none', cursor: 'pointer', borderRadius: 2,
              background: i <= idx ? D.accent : 'rgba(255,255,255,0.08)',
              opacity: i === idx ? 1 : 0.5,
            }} title={s.label} />
          ))}
        </div>
      </main>
    </div>
  )
}
