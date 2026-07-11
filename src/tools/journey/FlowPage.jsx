/* FlowPage — parameterized CRUD flow page at /journey/:mode/:flow */

import { useParams, Navigate, Link } from 'react-router-dom'
import { Color, Font } from '../../ui/tokens'
import { FLabel, FMono, FTag, FIcon } from '../../ui/components'
import { MODE_CONFIG, screenById } from './journey-data'
import { ScreenFlowStrip } from './journey-shared'
import { useJourneyContext } from './JourneyLayout'

const CRUD_TAGS = { create: 'C', edit: 'U', delete: 'D' }
const CRUD_TONES = { create: '#4ade80', edit: '#FF6E50', delete: '#f87171' }

export default function FlowPage({ mode }) {
  const { flow } = useParams()
  const { compact, setExpanded } = useJourneyContext()
  const cfg = MODE_CONFIG[mode]

  const flowData = cfg.flows[flow]
  if (!flowData) return <Navigate to={cfg.routePrefix} replace />

  const tone = CRUD_TONES[flow]
  const crudTag = CRUD_TAGS[flow]

  // Resolve screen components from IDs
  const screens = flowData.screens.map(s => ({
    ...s,
    C: s.id ? screenById(s.id) : null,
  }))

  const builtCount = screens.filter(s => s.C).length

  return (
    <div>
      {/* Breadcrumb + header */}
      <div style={{ padding: '30px 60px 0' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
          <Link to="/journey" style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, textDecoration: 'none', letterSpacing: 0.8 }}>Journey</Link>
          <FMono size={10} color={Color.faint}>/</FMono>
          <Link to={cfg.routePrefix} style={{ fontFamily: Font.mono, fontSize: 10, color: cfg.color, textDecoration: 'none', letterSpacing: 0.8 }}>{cfg.breadcrumb}</Link>
          <FMono size={10} color={Color.faint}>/</FMono>
          <FMono size={10} color={tone} letter={0.8}>{flowData.label}</FMono>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${tone}12`, display: 'grid', placeItems: 'center',
          }}>
            <FIcon path={cfg.icon} size={20} color={tone} stroke={1.5} />
          </div>
          <div>
            <FMono size={14} color={tone} letter={2}>{cfg.titlePrefix} / {flowData.label.toUpperCase()}</FMono>
            <div style={{ fontSize: 13, color: Color.dim, marginTop: 2 }}>{flowData.description}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
          <FTag tone={flow === 'create' ? 'green' : flow === 'edit' ? 'accent' : 'red'} size="sm">
            {screens.length} SCREENS
          </FTag>
          <FMono size={10} color={builtCount === screens.length ? Color.green : Color.dim}>
            {builtCount}/{screens.length} BUILT
          </FMono>
        </div>

        {/* Sibling flow links */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {Object.entries(cfg.flows).map(([key, f]) => (
            <Link key={key} to={`${cfg.routePrefix}/${key}`} style={{
              padding: '5px 12px', borderRadius: 9999,
              fontFamily: Font.mono, fontSize: 10, letterSpacing: 1,
              color: key === flow ? Color.bg : CRUD_TONES[key],
              textDecoration: 'none',
              border: `1px solid ${CRUD_TONES[key]}30`,
              background: key === flow ? CRUD_TONES[key] : `${CRUD_TONES[key]}08`,
              fontWeight: key === flow ? 600 : 400,
            }}>
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding: '24px 60px 10px' }}>
        <div style={{ borderTop: `1px solid ${Color.border}`, paddingTop: 20 }}>
          <FLabel size={10} mb={0} letter={1.6}>{flowData.label.toUpperCase()} FLOW</FLabel>
        </div>
      </div>

      {/* Flow strip */}
      <div style={{
        padding: '20px 40px 120px 28px',
        overflowX: 'auto',
      }}>
        <ScreenFlowStrip
          screens={screens}
          compact={compact}
          onExpand={setExpanded}
          crudTag={crudTag}
        />
      </div>
    </div>
  )
}
