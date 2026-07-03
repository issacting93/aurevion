/* OntologyExplorer — Tab container for Scenario Planner, Exercise Library, Goal Cards.
   Renders inside JourneyLayout at /journey/explore. */

import { Link, Outlet, useLocation } from 'react-router-dom'
import { Color, Font, Space, Type } from '../../ui/tokens'
import { FLabel } from '../../ui/components'

const TABS = [
  { label: 'SCENARIO',   to: '/journey/explore',           match: ['/journey/explore', '/journey/explore/scenario'] },
  { label: 'EXERCISES',  to: '/journey/explore/exercises',  match: ['/journey/explore/exercises'] },
  { label: 'GOAL CARDS', to: '/journey/explore/goal-cards', match: ['/journey/explore/goal-cards'] },
]

export default function OntologyExplorer() {
  const { pathname } = useLocation()

  return (
    <div style={{ padding: '30px 60px 60px' }}>
      <FLabel size={10} mb={8} letter={1.6}>ONTOLOGY EXPLORER</FLabel>
      <h2 style={{ ...Type.headingLg, margin: 0, marginBottom: 6 }}>
        Browse the fitness domain
      </h2>
      <p style={{ ...Type.bodyMd, color: Color.dim, margin: 0, maxWidth: 600, marginBottom: Space[6] }}>
        Explore how goals drive training, nutrition, and meal prep. Toggle scenarios, browse exercises, or drill into individual goals.
      </p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: Space[6] }}>
        {TABS.map(tab => {
          const active = tab.match.includes(pathname)
          return (
            <Link key={tab.to} to={tab.to} style={{
              padding: '7px 16px', borderRadius: 9999,
              fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.2,
              color: active ? Color.bg : Color.accent, textDecoration: 'none',
              border: `1px solid ${Color.accent}30`,
              background: active ? Color.accent : `${Color.accent}08`,
              fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
            }}>
              {tab.label}
            </Link>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
