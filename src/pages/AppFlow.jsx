import { useState, useEffect, useCallback } from 'react'
import { useUser } from '../context/UserContext'
import { OnboardingFlow, FitnessOnboardingFlow } from '../app/screens/Onboarding'
import { AppShell } from '../app/Shell'
import { NavigationProvider, useNav } from '../context/NavigationContext'
import { ShellContent } from '../app/Shell'
import { Phone, ICONS, FIcon } from '../ui/components'
import { Color, Font, Space, Radius, alpha } from '../ui/tokens'
import { DevModeOverlay } from '../app/screens/DevMode'
import { PERSONAS } from '../context/personas'

/* ── Flow definitions ── */

const FLOWS = [
  {
    group: 'Tabs',
    items: [
      { id: 'tab:calendar', label: 'Calendar',  type: 'tab', tab: 'calendar' },
      { id: 'tab:eat',      label: 'Eat',       type: 'tab', tab: 'eat' },
      { id: 'tab:home',     label: 'Home',      type: 'tab', tab: 'home' },
      { id: 'tab:stats',    label: 'Dashboard', type: 'tab', tab: 'stats' },
      { id: 'tab:you',      label: 'Profile',   type: 'tab', tab: 'you' },
    ],
  },
  {
    group: 'Training',
    items: [
      { id: 'active-session',  label: 'Active session',   type: 'detail', screen: 'active-session',  title: 'Training', needsSession: true },
      { id: 'exercises',       label: 'Exercise browser', type: 'detail', screen: 'exercises',       title: 'Exercises' },
      { id: 'exercise-detail', label: 'Exercise detail',  type: 'detail', screen: 'exercise-detail', title: 'Exercise' },
      { id: 'workout-history', label: 'Workout history',  type: 'detail', screen: 'workout-history', title: 'History' },
      { id: 'workout-template',label: 'Workout template', type: 'detail', screen: 'workout-template',title: 'Template' },
      { id: 'goal-detail',     label: 'Goal detail',      type: 'detail', screen: 'goal-detail',     title: 'Goal' },
      { id: 'calendar',        label: 'Calendar',         type: 'detail', screen: 'plan',            title: 'Calendar' },
    ],
  },
  {
    group: 'Nutrition',
    items: [
      { id: 'meal-queue',   label: 'Meal queue',      type: 'detail', screen: 'meal-queue',   title: 'Meals' },
      { id: 'shopping',     label: 'Shopping list',    type: 'detail', screen: 'shopping',     title: 'Shopping' },
      { id: 'batch',        label: 'Batch strategy',   type: 'detail', screen: 'batch',        title: 'Batch Strategy' },
      { id: 'food-log',     label: 'Food log',         type: 'detail', screen: 'food-log',     title: 'Food Log' },
      { id: 'fridge',       label: 'Pantry / fridge',  type: 'detail', screen: 'fridge',       title: 'Pantry' },
      { id: 'macro-heat',   label: 'Macro adherence',  type: 'detail', screen: 'macro-heat',   title: 'Adherence' },
    ],
  },
  {
    group: 'Cooking',
    items: [
      { id: 'prep',          label: 'Ingredient merge', type: 'detail', screen: 'prep',          title: 'Meal Prep' },
      { id: 'prep-timeline', label: 'Parallel timeline',type: 'detail', screen: 'prep-timeline', title: 'Timeline' },
      { id: 'prep-cook',     label: 'Active cook mode', type: 'detail', screen: 'prep-cook',     title: 'Cook Mode' },
      { id: 'cook-summary',  label: 'Cook summary',     type: 'detail', screen: 'cook-summary',  title: 'Summary' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { id: 'tdee',         label: 'Energy model', type: 'detail', screen: 'tdee',         title: 'Expenditure' },
      { id: 'checkin-flow', label: 'Check-in',     type: 'detail', screen: 'checkin-flow', title: 'Check-in' },
      { id: 'water',        label: 'Water',        type: 'detail', screen: 'water',        title: 'Hydration' },
    ],
  },
  {
    group: 'Setup',
    items: [
      { id: 'onboarding', label: 'Onboarding', type: 'onboarding' },
      { id: 'fitness-onboarding', label: 'Fitness Onboarding', type: 'fitness-onboarding' },
    ],
  },
]

/* ── Mono label ── */

function M({ children, color = Color.mute }) {
  return <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 1.2, color, textTransform: 'uppercase' }}>{children}</span>
}

/* ── PhoneScaler ── */

function PhoneScaler({ children }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => {
      const availH = Math.max(420, window.innerHeight - 80)
      const availW = Math.max(320, window.innerWidth - 320)
      setScale(Math.min(1, availH / 926, availW / 428))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return (
    <div style={{
      width: 428, height: 926,
      transform: `scale(${scale})`, transformOrigin: 'top center',
    }}>
      {children}
    </div>
  )
}

/* ── Nav controller (inside NavigationProvider) ── */

function NavController({ target, onReady }) {
  const { switchTab, pushDetail } = useNav()
  const { workoutPlan } = useUser()

  useEffect(() => {
    if (!target) return
    if (target.type === 'tab') {
      switchTab(target.tab)
    } else if (target.type === 'detail') {
      // Switch to a sensible base tab first, then push detail
      switchTab('home')
      setTimeout(() => {
        let data = {}
        if (target.needsSession && workoutPlan?.schedule) {
          const session = workoutPlan.schedule.find(s => !s.isRest)
          data = { session }
        }
        pushDetail(target.screen, target.title, data)
      }, 200)
    }
    onReady?.()
  }, [target])

  return null
}

/* ── Icon Exporter Modal ── */

function IconExporterModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null)
  const [search, setSearch] = useState('')
  
  if (!isOpen) return null

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    })
  }

  const filteredIcons = Object.entries(ICONS).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  const getSvgString = (path) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <path d="${path}" />\n</svg>`
  }

  const getReactString = (name) => {
    return `<FIcon path={ICONS.${name}} size={20} />`
  }

  const handleExportAllJSON = () => {
    const jsonStr = JSON.stringify(ICONS, null, 2)
    handleCopy(jsonStr, 'all-json')
  }

  const handleExportAllJS = () => {
    const jsStr = `export const ICONS = {\n${Object.entries(ICONS)
      .map(([name, path]) => `  ${name}: '${path}',`)
      .join('\n')}\n}`
    handleCopy(jsStr, 'all-js')
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(12, 13, 16, 0.9)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000,
    }}>
      <div style={{
        width: 800, maxHeight: '90vh',
        background: '#141519', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 32, display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 1.5, color: Color.accent, textTransform: 'uppercase' }}>DEVELOPER TOOLS</span>
            <h2 style={{ margin: '4px 0 0', fontFamily: Font.sans, fontSize: 24, fontWeight: 300, color: Color.text }}>Aurevion Icon Set</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: Color.mute, cursor: 'pointer',
            padding: 8, display: 'flex', alignItems: 'center', outline: 'none',
          }}>
            <FIcon path={ICONS.close} size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 38px', borderRadius: 6,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: Color.text, fontFamily: Font.sans, fontSize: 14, outline: 'none',
              }}
            />
            <div style={{ position: 'absolute', left: 14, top: 12, color: Color.mute }}>
              <FIcon path={ICONS.search} size={14} />
            </div>
          </div>

          {/* Bulk actions */}
          <button
            onClick={handleExportAllJS}
            style={{
              padding: '10px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', color: Color.dim, cursor: 'pointer',
              fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 0.8,
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
              outline: 'none',
            }}
          >
            <FIcon path={ICONS.sparkle} size={12} />
            {copiedKey === 'all-js' ? 'Copied Module!' : 'Copy JS Module'}
          </button>

          <button
            onClick={handleExportAllJSON}
            style={{
              padding: '10px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', color: Color.dim, cursor: 'pointer',
              fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 0.8,
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
              outline: 'none',
            }}
          >
            <FIcon path={ICONS.chart} size={12} />
            {copiedKey === 'all-json' ? 'Copied JSON!' : 'Copy JSON'}
          </button>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {filteredIcons.map(([name, path]) => (
              <div key={name} style={{
                background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 6, background: 'rgba(255,255,255,0.02)',
                  display: 'grid', placeItems: 'center', marginBottom: 12,
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <FIcon path={path} size={20} color={Color.text} stroke={1.8} />
                </div>
                
                <span style={{
                  fontFamily: '"Geist Mono", monospace', fontSize: 10, color: Color.dim,
                  letterSpacing: 0.5, marginBottom: 12,
                }}>{name}</span>

                {/* Quick copy options */}
                <div style={{ display: 'flex', width: '100%', gap: 4 }}>
                  <button
                    onClick={() => handleCopy(getSvgString(path), `${name}-svg`)}
                    style={{
                      flex: 1, padding: '4px 0', border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)', color: Color.mute, borderRadius: 4,
                      fontSize: 8, fontFamily: '"Geist Mono", monospace', cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {copiedKey === `${name}-svg` ? '✓ SVG' : 'SVG'}
                  </button>
                  <button
                    onClick={() => handleCopy(getReactString(name), `${name}-react`)}
                    style={{
                      flex: 1, padding: '4px 0', border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)', color: Color.mute, borderRadius: 4,
                      fontSize: 8, fontFamily: '"Geist Mono", monospace', cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {copiedKey === `${name}-react` ? '✓ JSX' : 'JSX'}
                  </button>
                  <button
                    onClick={() => handleCopy(path, `${name}-path`)}
                    style={{
                      flex: 1, padding: '4px 0', border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)', color: Color.mute, borderRadius: 4,
                      fontSize: 8, fontFamily: '"Geist Mono", monospace', cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {copiedKey === `${name}-path` ? '✓ Path' : 'PATH'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          <span style={{ fontSize: 11, color: Color.mute }}>
            Total {Object.keys(ICONS).length} icons · 24x24 viewBox · Stroke 1.8px
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', borderRadius: 6, background: Color.surface,
              border: `1px solid ${Color.border}`, color: Color.text, cursor: 'pointer',
              fontFamily: Font.sans, fontSize: 12, outline: 'none',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */

export default function AppFlow() {
  const { onboarded, resetAll, loadPersona, profile } = useUser()
  const [mode, setMode] = useState(onboarded ? 'app' : 'onboarding') // 'app' | 'onboarding' | 'fitness-onboarding'
  const [navTarget, setNavTarget] = useState(null)
  const [activeId, setActiveId] = useState('tab:home')
  const [shellKey, setShellKey] = useState(0)
  const [onboardingData, setOnboardingData] = useState({})
  const [showIconExporter, setShowIconExporter] = useState(false)

  // If onboarding completes externally (e.g. persona load), switch to app mode
  useEffect(() => {
    if (onboarded && mode === 'onboarding') setMode('app')
  }, [onboarded])

  const handleFlowClick = useCallback((item) => {
    setActiveId(item.id)
    if (item.type === 'onboarding') {
      resetAll()
      setOnboardingData({})
      setMode('onboarding')
      setShellKey(k => k + 1)
      return
    }
    if (item.type === 'fitness-onboarding') {
      // Jump straight to fitness onboarding with current profile or demo data
      setMode('fitness-onboarding')
      setShellKey(k => k + 1)
      return
    }
    if (mode === 'onboarding' || mode === 'fitness-onboarding') {
      return
    }
    setNavTarget({ ...item, _ts: Date.now() })
  }, [mode, resetAll])

  const handleReset = useCallback(() => {
    resetAll()
    setOnboardingData({})
    setMode('onboarding')
    setActiveId('onboarding')
    setShellKey(k => k + 1)
  }, [resetAll])

  const handlePersona = useCallback((personaId) => {
    loadPersona(personaId)
    setMode('app')
    setActiveId('tab:home')
    setShellKey(k => k + 1)
  }, [loadPersona])

  return (
    <DevModeOverlay>
    <div style={{
      minHeight: '100vh',
      background: '#0e0e0e',
      color: Color.text,
      fontFamily: Font.sans,
      display: 'flex',
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, flexShrink: 0, height: '100vh',
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto',
        padding: '20px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.svg" width="24" height="24" alt="" style={{ borderRadius: 5 }} />
          <div>
            <M color={Color.dim}>AUREVI0N</M>
            <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, color: Color.faint, letterSpacing: 1, marginTop: 2 }}>FLOW CONTROL</div>
          </div>
        </div>

        {/* Flow groups */}
        {FLOWS.map(group => (
          <div key={group.group} style={{ marginBottom: 4 }}>
            <div style={{ padding: '10px 20px 6px' }}>
              <M color={Color.faint}>{group.group}</M>
            </div>
            {group.items.map(item => {
              const active = activeId === item.id
              const disabled = (mode === 'onboarding' || mode === 'fitness-onboarding') && item.type !== 'onboarding' && item.type !== 'fitness-onboarding'
              return (
                <button
                  key={item.id}
                  onClick={() => !disabled && handleFlowClick(item)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '8px 20px',
                    background: active ? 'rgba(255,110,80,0.08)' : 'transparent',
                    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                    color: disabled ? Color.faint : active ? Color.text : Color.dim,
                    fontFamily: Font.sans, fontSize: 13,
                    opacity: disabled ? 0.4 : 1,
                    transition: 'background 0.1s, color 0.1s',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                  onMouseEnter={e => { if (!disabled && !active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  {active && <div style={{ width: 4, height: 4, borderRadius: 2, background: Color.accent, flexShrink: 0 }} />}
                  <span>{item.label}</span>
                  {item.type === 'tab' && <M color={Color.faint} style={{ marginLeft: 'auto' }}>TAB</M>}
                </button>
              )
            })}
          </div>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Personas */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <M color={Color.faint}>Personas</M>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PERSONAS.map(p => {
              const active = profile?.name === p.profile.name
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersona(p.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 12px',
                    borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: Font.sans, fontSize: 13,
                    color: active ? Color.text : Color.dim,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{
                    fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: 0.8,
                    padding: '2px 6px', borderRadius: 4,
                    background: active ? `${p.tagColor}20` : 'transparent',
                    color: active ? p.tagColor : Color.faint,
                    border: `1px solid ${active ? `${p.tagColor}40` : Color.faint}`,
                  }}>{p.tag}</span>
                  <span>{p.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => setShowIconExporter(true)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 6,
              background: 'rgba(255, 110, 80, 0.1)', border: `1px solid ${Color.accent}30`,
              cursor: 'pointer', fontFamily: '"Geist Mono", monospace',
              fontSize: 10, letterSpacing: 1, color: Color.accent,
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.2s',
              outline: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 110, 80, 0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 110, 80, 0.1)'}
          >
            <FIcon path={ICONS.sparkle} size={12} color={Color.accent} />
            <span>Export Icons</span>
          </button>
          <button
            onClick={handleReset}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 6,
              background: 'transparent', border: `1px solid ${Color.faint}`,
              cursor: 'pointer', fontFamily: '"Geist Mono", monospace',
              fontSize: 10, letterSpacing: 1, color: Color.mute,
              textTransform: 'uppercase',
              outline: 'none',
            }}
          >
            Reset &amp; re-onboard
          </button>
          <div style={{ textAlign: 'center' }}>
            <M color={Color.faint}>{mode === 'onboarding' ? 'ONBOARDING' : mode === 'fitness-onboarding' ? 'FITNESS SETUP' : 'APP'}</M>
          </div>
        </div>
      </aside>

      {/* ── Phone stage ── */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,110,80,0.03) 0%, transparent 60%)',
      }}>
        <PhoneScaler key={shellKey}>
          {mode === 'onboarding' ? (
            <Phone statusTime="9:41">
              <OnboardingFlow onComplete={(data) => {
                setOnboardingData(data)
                setMode('fitness-onboarding')
                setShellKey(k => k + 1)
              }} />
            </Phone>
          ) : mode === 'fitness-onboarding' ? (
            <Phone statusTime="9:41">
              <FitnessOnboardingFlowWithCallback
                initialData={onboardingData}
                onComplete={() => setMode('app')}
              />
            </Phone>
          ) : (
            <NavigationProvider>
              <NavController target={navTarget} onReady={() => setNavTarget(null)} />
              <Phone statusTime="9:41">
                <ShellContent />
              </Phone>
            </NavigationProvider>
          )}
        </PhoneScaler>
      </main>

      <IconExporterModal isOpen={showIconExporter} onClose={() => setShowIconExporter(false)} />
    </div>
    </DevModeOverlay>
  )
}

/* ── Fitness onboarding callback wrapper ── */

function FitnessOnboardingFlowWithCallback({ initialData, onComplete }) {
  const { onboarded } = useUser()
  const [wasOnboarded] = useState(onboarded)

  if (onboarded && !wasOnboarded) {
    setTimeout(onComplete, 0)
  }

  return <FitnessOnboardingFlow initialData={initialData} />
}
