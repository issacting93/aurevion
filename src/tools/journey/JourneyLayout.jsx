/* JourneyLayout — shared shell for all /journey sub-routes.
   Provides header, sticky nav, compact/expanded state via outlet context. */

import { useState, Fragment } from 'react'
import { Outlet, Link, useLocation, useOutletContext } from 'react-router-dom'
import { Color, Font, Phase } from '../../ui/tokens'
import { FMono, FTag } from '../../ui/components'
import { DevModeOverlay } from '../../app/screens/DevMode'
import { PW, PH, TOTAL_SCREENS, COVERAGE_PCT, PHASES } from './journey-data'
import { PhoneFrame } from './journey-shared'

const NAV_ITEMS = [
  { label: 'HUB', to: '/journey', exact: true },
  { label: 'SEED', to: '/journey/seed', color: Phase.seed, sep: true },
  { label: 'DECIDE', to: '/journey/decide', color: Phase.decide },
  { label: 'COOKING', to: '/journey/cooking', color: Phase.act, sep: true },
  { label: 'EXERCISE', to: '/journey/exercise', color: Phase.seed },
  { label: 'OBSERVE', to: '/journey/observe', color: Phase.observe, sep: true },
  { label: 'GOALS', to: '/journey/goals', color: Color.purple, sep: true },
  { label: 'EXPLORE', to: '/journey/explore', color: Color.purple },
]

export default function JourneyLayout() {
  const [compact, setCompact] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const location = useLocation()

  return (
    <DevModeOverlay>
    <div style={{
      minHeight: '100vh', background: Color.bg,
      fontFamily: Font.sans, color: Color.text,
      WebkitFontSmoothing: 'antialiased',
    }}>
      <header style={{ padding: '60px 60px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.svg" width="28" height="28" alt="" style={{ borderRadius: 6 }} />
            <span style={{ fontFamily: Font.mono, fontSize: 13, fontWeight: 200, letterSpacing: 3 }}>AUREVI0N</span>
          </Link>
        </div>
        <div style={{
          fontFamily: Font.mono, fontSize: 11, letterSpacing: 1.8,
          color: Color.accent, textTransform: 'uppercase', marginBottom: 10,
        }}>USER JOURNEY</div>
        <h1 style={{ fontSize: 40, fontWeight: 300, letterSpacing: -1, margin: 0 }}>
          Seed &rarr; Decide &rarr; Plan &rarr; Act &rarr; Observe
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <FTag tone="accent" size="sm">{TOTAL_SCREENS} SCREENS</FTag>
          <FTag tone={COVERAGE_PCT === 100 ? 'green' : 'mute'} size="sm">{COVERAGE_PCT}% BUILT</FTag>
          {PHASES.map(p => {
            const built = p.screens.filter(s => s.C).length
            return (
              <FMono key={p.id} size={9} color={p.color}>
                {p.id.toUpperCase().slice(0, 4)} {built}/{p.screens.length}
              </FMono>
            )
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {['FULL', 'COMPACT'].map(mode => (
              <button key={mode} onClick={() => setCompact(mode === 'COMPACT')} style={{
                fontFamily: Font.mono, fontSize: 10, letterSpacing: 1,
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                border: `1px solid ${Color.borderSoft}`,
                background: (mode === 'COMPACT') === compact ? Color.accent : 'transparent',
                color: (mode === 'COMPACT') === compact ? Color.bg : Color.mute,
              }}>
                {mode}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Sticky nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${Color.borderSoft}`,
        padding: '12px 60px', display: 'flex', gap: 8, alignItems: 'center',
      }}>
        {NAV_ITEMS.map(item => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)
          const c = item.color || Color.accent
          return (
            <Fragment key={item.to}>
              {item.sep && <div style={{ width: 1, height: 18, background: Color.borderSoft, margin: '0 4px' }} />}
              <Link to={item.to} style={{
                padding: '6px 14px', borderRadius: 9999,
                fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.2,
                color: active ? Color.bg : c, textDecoration: 'none',
                border: `1px solid ${c}30`,
                background: active ? c : `${c}08`,
                fontWeight: active ? 600 : 400,
              }}>
                {item.label}
              </Link>
            </Fragment>
          )
        })}
      </nav>

      {/* Child route content */}
      <Outlet context={{ compact, setCompact, expanded, setExpanded }} />

      {/* Expanded screen overlay */}
      {expanded?.C && (
        <div onClick={() => setExpanded(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <FMono size={11} color={Color.mute}>{expanded.label}</FMono>
          <div onClick={e => e.stopPropagation()}>
            <PhoneFrame scale={1} frameWidth={PW} frameHeight={PH}><expanded.C goalKey={expanded.goalKey} /></PhoneFrame>
          </div>
          <FMono size={10} color={Color.faint}>CLICK ANYWHERE TO CLOSE</FMono>
        </div>
      )}
    </div>
    </DevModeOverlay>
  )
}

export function useJourneyContext() {
  return useOutletContext()
}
