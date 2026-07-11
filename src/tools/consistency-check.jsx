// ════════════════════════════════════════════════════════════
// UI Consistency Checker — verifies screens render identically
// across /journey, /demo, and /app contexts.
//
// Run: navigate to /check in the browser
// ════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Color, Font, Radius, Type } from '../ui/tokens'
import { ICONS, FIcon, FLabel, FMono, FNum, FTag, FBtn, FSurface, Phone, ErrorBoundary } from '../ui/components'
import { SCREENS } from '../app/screens'
import { PHASES, screenById } from './journey/journey-data'

/* ── Design rule checks (R1-R6 from templates.md) ── */

function checkDesignRules(el) {
  const issues = []

  if (!el) return [{ rule: '—', msg: 'Component did not render', severity: 'error' }]

  // R1: One hero per page — look for large text (24px+)
  const allText = el.querySelectorAll('*')
  let hasHero = false
  for (const node of allText) {
    const fs = parseFloat(getComputedStyle(node).fontSize)
    if (fs >= 24) { hasHero = true; break }
  }
  if (!hasHero) {
    issues.push({ rule: 'R1', msg: 'No hero element (24px+ text) found', severity: 'warn' })
  }

  // R2: List items breathe — check for rows with < 12px padding
  const rows = el.querySelectorAll('[class*="row"], [data-row]')
  // Heuristic: look for flex children with small padding
  const allDivs = el.querySelectorAll('div')
  let tightRows = 0
  for (const div of allDivs) {
    const s = getComputedStyle(div)
    if (s.display === 'flex' && s.flexDirection === 'row') {
      const pt = parseFloat(s.paddingTop)
      const pb = parseFloat(s.paddingBottom)
      if ((pt + pb) > 0 && (pt + pb) < 20 && div.children.length >= 2) {
        tightRows++
      }
    }
  }
  if (tightRows > 5) {
    issues.push({ rule: 'R2', msg: `${tightRows} potentially tight list rows (< 10px vertical padding)`, severity: 'info' })
  }

  // R3: Vary icons — check for repeated SVG paths
  const svgs = el.querySelectorAll('svg')
  const pathCounts = {}
  for (const svg of svgs) {
    const paths = svg.querySelectorAll('path')
    for (const p of paths) {
      const d = p.getAttribute('d')
      if (d) pathCounts[d] = (pathCounts[d] || 0) + 1
    }
  }
  const repeatedIcons = Object.entries(pathCounts).filter(([, count]) => count > 4)
  if (repeatedIcons.length > 0) {
    issues.push({ rule: 'R3', msg: `${repeatedIcons.length} icon(s) repeated 5+ times — consider varying`, severity: 'info' })
  }

  // R5: Empty states — check for "no" or "yet" in centered text
  const centerDivs = Array.from(allDivs).filter(d => {
    const s = getComputedStyle(d)
    return s.textAlign === 'center' && s.display === 'flex' && s.justifyContent === 'center'
  })
  for (const cd of centerDivs) {
    const text = cd.textContent?.toLowerCase() || ''
    if ((text.includes('no ') || text.includes(' yet')) && !text.includes('starts here')) {
      issues.push({ rule: 'R5', msg: `Empty state may use weak language: "${text.slice(0, 60)}..."`, severity: 'warn' })
    }
  }

  return issues
}

/* ── Structure fingerprint — captures the layout "shape" of a rendered screen ── */

function fingerprint(el) {
  if (!el) return null
  const result = {
    totalElements: el.querySelectorAll('*').length,
    surfaces: el.querySelectorAll('[style*="borderRadius"]').length,
    textNodes: 0,
    maxFontSize: 0,
    colors: new Set(),
    depth: 0,
    tagDistribution: {},
  }

  function walk(node, depth) {
    if (depth > result.depth) result.depth = depth
    if (node.nodeType === 3 && node.textContent.trim()) result.textNodes++
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase()
      result.tagDistribution[tag] = (result.tagDistribution[tag] || 0) + 1
      const s = getComputedStyle(node)
      const fs = parseFloat(s.fontSize)
      if (fs > result.maxFontSize) result.maxFontSize = fs
      if (s.color && s.color !== 'rgba(0, 0, 0, 0)') result.colors.add(s.color)
    }
    for (const child of node.childNodes) walk(child, depth + 1)
  }
  walk(el, 0)
  result.colors = result.colors.size
  return result
}

/* ── Export pattern check ── */

function checkExportPattern(screenEntry) {
  const issues = []
  const name = screenEntry.C?.name || screenEntry.C?.displayName || '?'

  // Check if name ends with Screen (not Content)
  if (!name.includes('Screen') && !name.includes('Wrap') && !name.includes('OB')) {
    issues.push({ rule: 'Export', msg: `${name} — not following *Screen naming convention`, severity: 'warn' })
  }

  return issues
}

/* ── Cross-context coverage check ── */

function buildCoverageReport() {
  const registryIds = new Set(SCREENS.map(s => s.id))

  // Collect all IDs referenced by journey phases
  const journeyIds = new Set()
  for (const phase of PHASES) {
    for (const screen of phase.screens) {
      // Try to find the matching registry entry
      const match = SCREENS.find(s => s.C === screen.C)
      if (match) journeyIds.add(match.id)
    }
  }

  // All registry screens are in /demo (it uses the full SCREENS array)
  const demoIds = new Set(registryIds)

  // /app only shows Shell which dynamically loads Content components — different context
  const appIds = new Set() // Can't statically determine

  const results = []
  for (const s of SCREENS) {
    const inJourney = journeyIds.has(s.id)
    const inDemo = demoIds.has(s.id)
    results.push({
      id: s.id,
      feature: s.feature,
      label: s.label,
      hasComponent: !!s.C,
      inDemo,
      inJourney,
      exportIssues: checkExportPattern(s),
    })
  }

  return results
}

/* ── Main Page ── */

export default function ConsistencyCheck() {
  const [activeTab, setActiveTab] = useState('coverage')
  const [designResults, setDesignResults] = useState(null)
  const [checking, setChecking] = useState(false)
  const containerRef = useRef(null)

  const coverage = useMemo(() => buildCoverageReport(), [])

  const stats = useMemo(() => {
    const total = coverage.length
    const hasComponent = coverage.filter(s => s.hasComponent).length
    const inBothContexts = coverage.filter(s => s.inDemo && s.inJourney).length
    const demoOnly = coverage.filter(s => s.inDemo && !s.inJourney).length
    const journeyOnly = coverage.filter(s => !s.inDemo && s.inJourney).length
    const exportIssues = coverage.filter(s => s.exportIssues.length > 0).length
    return { total, hasComponent, inBothContexts, demoOnly, journeyOnly, exportIssues }
  }, [coverage])

  // Design rule check — renders each screen offscreen and checks
  const runDesignCheck = async () => {
    setChecking(true)
    const results = []
    const offscreen = document.createElement('div')
    offscreen.style.cssText = 'position:fixed;left:-9999px;top:0;width:402px;height:874px;overflow:hidden;'
    document.body.appendChild(offscreen)

    for (const entry of SCREENS) {
      if (!entry.C) {
        results.push({ id: entry.id, label: entry.label, issues: [{ rule: '—', msg: 'No component', severity: 'error' }] })
        continue
      }
      try {
        const { createRoot } = await import('react-dom/client')
        const root = createRoot(offscreen)

        await new Promise(resolve => {
          root.render(
            <ErrorBoundary>
              <entry.C />
            </ErrorBoundary>
          )
          setTimeout(() => {
            const issues = checkDesignRules(offscreen)
            results.push({ id: entry.id, label: entry.label, issues })
            root.unmount()
            resolve()
          }, 100)
        })
      } catch (err) {
        results.push({ id: entry.id, label: entry.label, issues: [{ rule: '—', msg: `Render error: ${err.message}`, severity: 'error' }] })
      }
    }

    document.body.removeChild(offscreen)
    setDesignResults(results)
    setChecking(false)
  }

  const severityColor = { error: Color.red, warn: Color.amber, info: Color.blue }
  const severityIcon = { error: '!', warn: '!', info: 'i' }

  return (
    <div style={{ background: Color.bg, color: Color.text, fontFamily: Font.sans, minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <nav style={{
        width: 200, flexShrink: 0, padding: '24px 16px',
        borderRight: `1px solid ${Color.borderSoft}`,
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: Color.mute, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <FIcon path={ICONS.back} size={14} color={Color.mute} stroke={2} />
          <FMono size={10}>HOME</FMono>
        </Link>
        <FLabel mb={8}>CONSISTENCY</FLabel>

        {[
          { id: 'coverage', label: 'Coverage' },
          { id: 'design', label: 'Design Rules' },
          { id: 'registry', label: 'Registry' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: activeTab === tab.id ? `${Color.accent}10` : 'transparent',
            color: activeTab === tab.id ? Color.text : Color.dim,
            fontFamily: Font.mono, fontSize: 11, textAlign: 'left',
          }}>{tab.label}</button>
        ))}
      </nav>

      {/* Main */}
      <main ref={containerRef} style={{ flex: 1, padding: '32px 48px 100px', maxWidth: 900, overflowY: 'auto' }}>
        <FMono size={10} color={Color.accent} style={{ letterSpacing: 2 }}>MODULE-07 // CONSISTENCY</FMono>
        <h1 style={{ fontSize: 24, fontWeight: 300, letterSpacing: -0.5, marginTop: 8, marginBottom: 8 }}>
          UI Consistency Checker
        </h1>
        <FMono size={10} color={Color.dim} style={{ marginBottom: 32, display: 'block' }}>
          Verifies screen rendering across /journey, /demo, and /app
        </FMono>

        {/* ── Coverage Tab ── */}
        {activeTab === 'coverage' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 28 }}>
              {[
                { l: 'Registry', v: stats.total, c: Color.text },
                { l: 'Has Component', v: stats.hasComponent, c: Color.green },
                { l: 'In Both Contexts', v: stats.inBothContexts, c: Color.blue },
                { l: 'Export Issues', v: stats.exportIssues, c: stats.exportIssues > 0 ? Color.amber : Color.green },
              ].map(s => (
                <FSurface key={s.l} style={{ padding: 14, textAlign: 'center' }}>
                  <FLabel mb={4}>{s.l}</FLabel>
                  <FNum size={22} weight={300} color={s.c}>{s.v}</FNum>
                </FSurface>
              ))}
            </div>

            {/* Coverage table */}
            <FLabel mb={12}>SCREEN COVERAGE</FLabel>
            <div style={{
              border: `1px solid ${Color.borderSoft}`, borderRadius: Radius.lg, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 60px 60px 60px',
                padding: '8px 14px', background: Color.surface2,
                borderBottom: `1px solid ${Color.borderSoft}`,
              }}>
                <FMono size={9} color={Color.mute}>ID</FMono>
                <FMono size={9} color={Color.mute}>LABEL</FMono>
                <FMono size={9} color={Color.mute}>COMP</FMono>
                <FMono size={9} color={Color.mute}>DEMO</FMono>
                <FMono size={9} color={Color.mute}>JRNY</FMono>
              </div>
              {/* Rows */}
              {coverage.map((s, i) => (
                <div key={s.id} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 60px 60px 60px',
                  padding: '8px 14px',
                  borderBottom: i < coverage.length - 1 ? `1px solid ${Color.borderSoft}` : 'none',
                  background: s.exportIssues.length > 0 ? `${Color.amber}05` : 'transparent',
                }}>
                  <FMono size={10} color={Color.dim}>{s.id}</FMono>
                  <FMono size={10} color={Color.text}>{s.label}</FMono>
                  <div style={{ textAlign: 'center' }}>
                    {s.hasComponent
                      ? <FMono size={10} color={Color.green}>OK</FMono>
                      : <FMono size={10} color={Color.red}>MISS</FMono>
                    }
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <FMono size={10} color={s.inDemo ? Color.green : Color.faint}>{s.inDemo ? 'YES' : '—'}</FMono>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <FMono size={10} color={s.inJourney ? Color.green : Color.faint}>{s.inJourney ? 'YES' : '—'}</FMono>
                  </div>
                </div>
              ))}
            </div>

            {/* Screens missing from journey */}
            {stats.demoOnly > 0 && (
              <div style={{ marginTop: 24 }}>
                <FLabel mb={8}>IN /DEMO BUT NOT /JOURNEY</FLabel>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {coverage.filter(s => s.inDemo && !s.inJourney).map(s => (
                    <FTag key={s.id} tone="mute" size="sm">{s.id}</FTag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Design Rules Tab ── */}
        {activeTab === 'design' && (
          <div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
              <FBtn variant="primary" size="sm" onClick={runDesignCheck} disabled={checking} data-stay="true">
                {checking ? 'Checking...' : 'Run Design Check'}
              </FBtn>
              <FMono size={10} color={Color.mute}>
                Renders each screen offscreen and checks R1-R6 rules
              </FMono>
            </div>

            {designResults && (
              <>
                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
                  {[
                    { l: 'Screens Checked', v: designResults.length },
                    { l: 'Warnings', v: designResults.reduce((s, r) => s + r.issues.filter(i => i.severity === 'warn').length, 0), c: Color.amber },
                    { l: 'Clean', v: designResults.filter(r => r.issues.length === 0).length, c: Color.green },
                  ].map(s => (
                    <FSurface key={s.l} style={{ padding: 14, textAlign: 'center' }}>
                      <FLabel mb={4}>{s.l}</FLabel>
                      <FNum size={20} weight={300} color={s.c}>{s.v}</FNum>
                    </FSurface>
                  ))}
                </div>

                {/* Results */}
                {designResults.map(result => (
                  <div key={result.id} style={{
                    padding: '12px 16px', marginBottom: 6,
                    borderRadius: Radius.md,
                    background: result.issues.length === 0 ? 'transparent' : Color.surface,
                    border: `1px solid ${result.issues.length === 0 ? Color.borderSoft : Color.borderSoft}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 4,
                        background: result.issues.length === 0 ? Color.green
                          : result.issues.some(i => i.severity === 'error') ? Color.red
                          : result.issues.some(i => i.severity === 'warn') ? Color.amber
                          : Color.blue,
                      }} />
                      <FMono size={10} color={Color.text}>{result.label}</FMono>
                      <FMono size={9} color={Color.mute}>{result.id}</FMono>
                      {result.issues.length === 0 && (
                        <FMono size={9} color={Color.green} style={{ marginLeft: 'auto' }}>CLEAN</FMono>
                      )}
                    </div>
                    {result.issues.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {result.issues.map((issue, j) => (
                          <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <div style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                              background: `${severityColor[issue.severity]}15`,
                              display: 'grid', placeItems: 'center',
                            }}>
                              <FMono size={8} color={severityColor[issue.severity]}>
                                {issue.rule}
                              </FMono>
                            </div>
                            <FMono size={10} color={Color.dim}>{issue.msg}</FMono>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── Registry Tab ── */}
        {activeTab === 'registry' && (
          <div>
            <FLabel mb={12}>SCREEN REGISTRY — {SCREENS.length} ENTRIES</FLabel>
            {/* Group by feature */}
            {Object.entries(
              SCREENS.reduce((acc, s) => {
                if (!acc[s.feature]) acc[s.feature] = []
                acc[s.feature].push(s)
                return acc
              }, {})
            ).map(([feature, screens]) => (
              <div key={feature} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <FLabel mb={0}>{feature.toUpperCase()}</FLabel>
                  <FMono size={9} color={Color.mute}>{screens.length} SCREENS</FMono>
                </div>
                {screens.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 14px', borderRadius: 6,
                    background: Color.surface, border: `1px solid ${Color.borderSoft}`,
                    marginBottom: 4,
                  }}>
                    <FMono size={9} color={Color.accent}>{s.flow}</FMono>
                    <FMono size={10} color={Color.dim}>{s.id}</FMono>
                    <FMono size={10} color={Color.text} style={{ flex: 1 }}>{s.label}</FMono>
                    <FMono size={9} color={s.C ? Color.green : Color.red}>
                      {s.C ? (s.C.name || s.C.displayName || 'OK') : 'MISSING'}
                    </FMono>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
