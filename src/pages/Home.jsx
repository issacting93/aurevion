import { Link } from 'react-router-dom'
import { Color, Font } from '../ui/tokens'

const D = {
  bg: '#000',
  surface: '#0d0d0d',
  surfaceHover: '#161616',
  border: 'rgba(255,255,255,0.08)',
  borderActive: 'rgba(255,110,80,0.35)',
  text: '#fafafa',
  dim: '#a1a1a1',
  mute: '#6b6b6b',
  accent: '#FF6E50',
  green: '#4ade80',
}

function NavCard({ to, module, tag, tagColor, title, description, widget, highlight }) {
  return (
    <Link to={to} style={{
      background: highlight ? 'rgba(255,110,80,0.015)' : D.surface,
      border: `1px solid ${highlight ? D.borderActive : D.border}`,
      borderRadius: 12, padding: 24, textDecoration: 'none', color: 'inherit',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 220, position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = D.borderActive; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = D.surfaceHover; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.5), 0 0 30px rgba(255,110,80,0.03)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = highlight ? D.borderActive : D.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = highlight ? 'rgba(255,110,80,0.015)' : D.surface; e.currentTarget.style.boxShadow = 'none' }}>
      {/* top shimmer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      {/* reg marks */}
      {['top:10px;left:10px','top:10px;right:10px','bottom:10px;left:10px','bottom:10px;right:10px'].map((pos, i) => {
        const s = {}; pos.split(';').forEach(p => { const [k,v] = p.split(':'); s[k] = v })
        return <span key={i} style={{ position: 'absolute', width: 10, height: 10, opacity: 0.2, ...s }}>
          <span style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', transform: 'translateX(-0.5px)', background: D.dim }} />
          <span style={{ position: 'absolute', top: '50%', left: 0, height: 1, width: '100%', transform: 'translateY(-0.5px)', background: D.dim }} />
        </span>
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ fontFamily: Font.mono, fontSize: 9, color: D.mute, letterSpacing: 1 }}>{module}</div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: Font.mono, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 999, fontWeight: 600,
          background: tagColor === 'accent' ? 'rgba(255,110,80,0.08)' : tagColor === 'green' ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.02)',
          color: tagColor === 'accent' ? D.accent : tagColor === 'green' ? D.green : D.dim,
          border: `1px solid ${tagColor === 'accent' ? 'rgba(255,110,80,0.2)' : tagColor === 'green' ? 'rgba(74,222,128,0.2)' : D.border}`,
        }}>{tag}</span>
      </div>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 400, letterSpacing: -0.4, marginBottom: 8 }}>{title}</h2>
        <p style={{ color: D.dim, fontSize: 13, fontWeight: 300, lineHeight: 1.5 }}>{description}</p>
      </div>
      {widget && <div style={{ marginTop: 20, background: 'rgba(0,0,0,0.2)', border: `1px dashed ${D.border}`, borderRadius: 6, padding: 12 }}>{widget}</div>}
    </Link>
  )
}

export default function Home() {
  return (
    <div style={{ background: D.bg, color: D.text, fontFamily: Font.sans, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Grid overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(to right, ${D.border} 1px, transparent 1px), linear-gradient(to bottom, ${D.border} 1px, transparent 1px)`, backgroundSize: '140px 140px', pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 1000, height: 600, background: 'radial-gradient(circle, rgba(255,110,80,0.06), transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '40px 24px 100px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${D.border}`, paddingBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/logo.svg" width="56" height="56" alt="AUREVI0N" style={{ borderRadius: 12, boxShadow: '0 8px 30px rgba(255,110,80,0.2)' }} />
            <div>
              <h1 style={{ fontFamily: Font.mono, fontSize: 24, fontWeight: 200, letterSpacing: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                AUREVI0N <span style={{ fontSize: 10, fontWeight: 500, color: D.accent, letterSpacing: 2 }}>SYS-Σ</span>
              </h1>
              <p style={{ fontFamily: Font.mono, fontSize: 11, color: D.dim, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>Design Workspace & Telemetry Control</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'right', fontFamily: Font.mono, fontSize: 10, lineHeight: 1.6, color: D.mute }}>
              <div>HOST: <span style={{ color: D.dim }}>localhost:3000</span></div>
              <div>ENV: <span style={{ color: D.dim }}>production</span></div>
            </div>
            <div style={{ fontFamily: Font.mono, fontSize: 10, lineHeight: 1.6, color: D.mute, borderLeft: `1px solid ${D.border}`, paddingLeft: 32 }}>
              <div>SYSTEM: <span style={{ color: D.green }}>ONLINE</span></div>
              <div>LATENCY: <span style={{ color: D.dim }}>0.14 ms</span></div>
            </div>
          </div>
        </header>

        {/* 3-card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20, width: '100%' }}>
          <NavCard
            to="/app"
            module="MODULE-00 // LIVE APP"
            tag="E2E"
            tagColor="green"
            title="End-to-End App"
            description="Full interactive flow — complete onboarding, land on your personalised dashboard with real computed TDEE and macros. Data persists across sessions."
            highlight
            widget={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: D.accent, fontSize: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.green, fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>&#10003; ONBOARDING &rarr; DASHBOARD</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.dim, fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>&#9638; LOCALSTORAGE PERSISTENCE</div>
              </div>
            }
          />

          <NavCard
            to="/demo"
            module="MODULE-01 // PRESENTATION"
            tag="FLOW"
            tagColor="accent"
            title="Presentation Demo"
            description="Step-by-step sequential review of all app screens — onboarding, energy models, calendar, training, meal prep, and the kitchen timeline."
            highlight
            widget={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: Font.mono, fontSize: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.accent }}>✓ 22 SCREENS · KEYBOARD NAV</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.dim }}>⎔ SIDEBAR + PHONE STAGE</div>
              </div>
            }
          />

          <NavCard
            to="/library"
            module="MODULE-02 // LIBRARY"
            tag="TOKENS"
            tagColor="default"
            title="UI Library"
            description="Reference tokens, color swatches, layout dimensions, typography, component gallery, and brand identity specs in a single reference view."
            widget={
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#FF6E50' }} />
                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#4ade80' }} />
                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#0d0d0d', border: `1px solid ${D.border}` }} />
                <span style={{ fontFamily: Font.mono, fontSize: 9, color: D.mute, marginLeft: 'auto' }}>GEIST / GEIST MONO</span>
              </div>
            }
          />

          <NavCard
            to="/journey"
            module="MODULE-03 // JOURNEY"
            tag="SDAO"
            tagColor="accent"
            title="User Journey Map"
            description="End-to-end SDAO flow — every screen mapped to its journey phase. Built screens shown live, missing screens highlighted in red."
            widget={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: Font.mono, fontSize: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.green }}>&#10003; 42 SCREENS · 5 PHASES</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: D.dim }}>&#9638; SEED &rarr; DECIDE &rarr; ACT &rarr; OBSERVE</div>
              </div>
            }
          />

          <NavCard
            to="/journey/goals"
            module="MODULE-05 // NETWORK"
            tag="GRAPH"
            tagColor="accent"
            title="Goal Network"
            description="Interactive graph showing how fitness goals, training modalities, caloric states, and meal prep approaches connect. The bridge between what you train and what you cook."
            widget={
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: Color.accent }} />
                <div style={{ width: 8, height: 8, borderRadius: 4, background: Color.green }} />
                <div style={{ width: 8, height: 8, borderRadius: 4, background: Color.blue }} />
                <div style={{ width: 8, height: 8, borderRadius: 4, background: Color.purple }} />
                <div style={{ width: 8, height: 8, borderRadius: 4, background: Color.amber }} />
                <span style={{ fontFamily: Font.mono, fontSize: 9, color: D.mute, marginLeft: 'auto' }}>32 NODES · 65 EDGES</span>
              </div>
            }
          />

          <NavCard
            to="/landing"
            module="MODULE-04 // PRODUCT"
            tag="MARKETING"
            tagColor="green"
            title="Consumer Landing Page"
            description="Public-facing marketing landing page with waitlist signups, adaptive TDEE models, parallel meal prep timelines, and scroll reveals."
            widget={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 45 }}>
                <span style={{ fontFamily: Font.mono, fontSize: 9, color: D.accent }}>WAITLIST: ACTIVE</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
