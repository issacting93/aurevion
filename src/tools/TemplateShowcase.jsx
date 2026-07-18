// ════════════════════════════════════════════════════════════
// Template Showcase — live examples of every reusable pattern
// ════════════════════════════════════════════════════════════

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Color, Font, Radius, Type } from '../ui/tokens'
import { ICONS, FSurface, FLabel, FMono, FNum, FIcon, FBtn, FTag, FTexBar } from '../ui/components'
import { WaterTile } from '../app/screens/tiles'

/* ── Helpers ── */

function Section({ id, num, title, desc, files, children }) {
  return (
    <div id={id} style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span style={{ fontFamily: Font.mono, fontSize: 11, color: Color.accent, letterSpacing: 1 }}>
          {num}
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 400, letterSpacing: -0.3 }}>{title}</h2>
      </div>
      <p style={{ color: Color.dim, fontSize: 13, lineHeight: 1.6, maxWidth: 700, marginBottom: 8 }}>{desc}</p>
      {files && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {files.map(f => (
            <span key={f} style={{
              fontFamily: Font.mono, fontSize: 9, color: Color.mute,
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${Color.borderSoft}`,
            }}>{f}</span>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

function DemoBox({ label, children, style }) {
  return (
    <div style={{
      background: Color.surface, border: `1px solid ${Color.borderSoft}`,
      borderRadius: Radius.lg, padding: 20, ...style,
    }}>
      {label && <FLabel mb={12}>{label}</FLabel>}
      {children}
    </div>
  )
}

function DemoRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {children}
    </div>
  )
}

function UsedBy({ screens }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12 }}>
      <FMono size={9} color={Color.mute}>USED BY:</FMono>
      {screens.map(s => (
        <FTag key={s} tone="mute" size="sm">{s}</FTag>
      ))}
    </div>
  )
}

/* ── Nav index ── */

const PATTERNS = [
  { id: 'screen-export', num: '01', label: 'Screen Export' },
  { id: 'tile-density', num: '02', label: 'Tile Density' },
  { id: 'focused-mode', num: '03', label: 'Focused Mode' },
  { id: 'timer', num: '04', label: 'Timer Logic' },
  { id: 'derivation', num: '05', label: 'Data Derivation' },
  { id: 'grouping', num: '06', label: 'Exercise Grouping' },
  { id: 'intensity', num: '07', label: 'Intensity Grid' },
  { id: 'load-adjust', num: '08', label: 'Load Adjustment' },
  { id: 'goal-tags', num: '09', label: 'Goal Tags' },
  { id: 'nav-wiring', num: '10', label: 'Nav Wiring' },
  { id: 'state', num: '11', label: 'State Updates' },
  { id: 'mock-fallback', num: '12', label: 'Mock Fallback' },
  { id: 'tracker', num: '13', label: 'Universal Tracker' },
  { id: 'summary-page', num: '14', label: 'Summary Page' },
  { id: 'browse-filter', num: '15', label: 'Browse/Filter List' },
  { id: 'detail-cascade', num: '16', label: 'Detail Cascade' },
  { id: 'multi-step', num: '17', label: 'Multi-Step Flow' },
  { id: 'stat-grid', num: '18', label: 'Stat Card Grid' },
  { id: 'section-header', num: '19', label: 'Section Header' },
  { id: 'card-status', num: '20', label: 'Card List + Status' },
]

/* ── Main Page ── */

export default function TemplateShowcase() {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <div style={{ background: Color.bg, color: Color.text, fontFamily: Font.sans, minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar nav */}
      <nav style={{
        width: 220, flexShrink: 0, padding: '24px 16px',
        borderRight: `1px solid ${Color.borderSoft}`,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: Color.mute, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <FIcon path={ICONS.back} size={14} color={Color.mute} stroke={2} />
          <FMono size={10}>HOME</FMono>
        </Link>
        <FLabel mb={8}>TEMPLATES</FLabel>
        <FMono size={9} color={Color.mute} style={{ marginBottom: 12 }}>13 REUSABLE PATTERNS</FMono>
        {PATTERNS.map(p => (
          <a key={p.id} href={`#${p.id}`}
            onClick={() => setActiveSection(p.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 6, textDecoration: 'none',
              background: activeSection === p.id ? `${Color.accent}10` : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <FMono size={9} color={Color.accent}>{p.num}</FMono>
            <FMono size={10} color={activeSection === p.id ? Color.text : Color.dim}>{p.label}</FMono>
          </a>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 48px 100px', maxWidth: 960, overflowY: 'auto' }}>
        <div style={{ marginBottom: 40 }}>
          <FMono size={10} color={Color.accent} style={{ letterSpacing: 2 }}>MODULE-06 // TEMPLATES</FMono>
          <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: -0.5, marginTop: 8 }}>Design Templates</h1>
          <p style={{ color: Color.dim, fontSize: 14, lineHeight: 1.6, marginTop: 8, maxWidth: 600 }}>
            Every reusable pattern in the prototype — with live examples, the reasoning behind each, and which screens use them.
          </p>
        </div>

        {/* ── 01: Screen Export ── */}
        <Section id="screen-export" num="01" title="Screen Export Pattern"
          desc="Every screen exports a Content component (for Shell) and a Screen wrapper (for standalone display). The Content receives data as props, the Screen wraps it in a Phone frame."
          files={['Training.jsx', 'Dashboard.jsx', 'WaterTracking.jsx', 'GoalDetail.jsx', '+ 18 more']}>
          <DemoRow>
            <DemoBox label="CONTENT (USED IN SHELL)">
              <div style={{ padding: 12, borderRadius: 8, border: `1px dashed ${Color.accent}30`, textAlign: 'center' }}>
                <FMono size={10} color={Color.accent}>{'<ScreenNameContent data={...} />'}</FMono>
                <FMono size={9} color={Color.mute} style={{ marginTop: 6, display: 'block' }}>No Phone frame, no NavBar</FMono>
              </div>
            </DemoBox>
            <DemoBox label="SCREEN (STANDALONE)">
              <div style={{ padding: 12, borderRadius: 8, border: `1px dashed ${Color.blue}30`, textAlign: 'center' }}>
                <FMono size={10} color={Color.blue}>{'<Phone> + <FNavBar/> + <Content/>'}</FMono>
                <FMono size={9} color={Color.mute} style={{ marginTop: 6, display: 'block' }}>For journey galleries & dev tools</FMono>
              </div>
            </DemoBox>
          </DemoRow>
        </Section>

        {/* ── 02: Tile Density ── */}
        <Section id="tile-density" num="02" title="Tile Density System"
          desc="Dashboard tiles scale across 3 density levels: compact (glanceable), mid (informative), full (detailed). Same data, different levels of detail."
          files={['tiles.jsx', 'Dashboard.jsx']}>
          <DemoBox label="3 DENSITIES · WATER TILE">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <FMono size={9} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>COMPACT</FMono>
                <WaterTile current={1250} target={2500} density="compact" trend7d={[2100, 1800, 2300, 2500, 1900, 2200, 1250]} />
              </div>
              <div style={{ flex: 1 }}>
                <FMono size={9} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>MID</FMono>
                <WaterTile current={1250} target={2500} density="mid" trend7d={[2100, 1800, 2300, 2500, 1900, 2200, 1250]} />
              </div>
              <div style={{ flex: 2 }}>
                <FMono size={9} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>FULL</FMono>
                <WaterTile current={1250} target={2500} density="full" trend7d={[2100, 1800, 2300, 2500, 1900, 2200, 1250]} />
              </div>
            </div>
          </DemoBox>
          <UsedBy screens={['Dashboard', 'GoalTile', 'MacroTile', 'SessionTile', 'CalendarTile', 'WaterTile', '+ 4 more']} />
        </Section>

        {/* ── 03: Focused Mode ── */}
        <Section id="focused-mode" num="03" title="Focused Mode (3-Phase Flow)"
          desc="Timed activities follow: Review → Execute → Summary. The execute phase uses a sticky header (progress + timer), scrollable body (current item + controls), and fixed bottom toolbar (pause/skip/end)."
          files={['Training.jsx', 'MealPrep.jsx']}>
          <DemoBox label="LAYOUT SKELETON">
            <div style={{ display: 'flex', flexDirection: 'column', height: 260, border: `1px solid ${Color.borderSoft}`, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', borderBottom: `1px solid ${Color.borderSoft}`, flexShrink: 0, background: Color.surface2 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? Color.accent : Color.borderSoft, opacity: i <= 2 ? 0.5 : 1 }} />)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <FMono size={9} color={Color.dim}>ELAPSED 12:34</FMono>
                  <FMono size={9} color={Color.accent}>SETS 8/20</FMono>
                </div>
              </div>
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, background: Color.bg }}>
                <FMono size={11} color={Color.text}>Current Exercise</FMono>
                <FMono size={9} color={Color.mute}>Controls, inputs, cues</FMono>
                <div style={{ flex: 1 }} />
                <FMono size={9} color={Color.faint}>flex: 1, overflowY: auto</FMono>
              </div>
              <div style={{ padding: '8px 16px', borderTop: `1px solid ${Color.borderSoft}`, flexShrink: 0, display: 'flex', gap: 6 }}>
                <FMono size={9} color={Color.dim}>PAUSE</FMono>
                <FMono size={9} color={Color.dim}>SKIP</FMono>
                <div style={{ flex: 1 }} />
                <FMono size={9} color={Color.accent}>END</FMono>
              </div>
            </div>
          </DemoBox>
          <UsedBy screens={['Training (workout)', 'MealPrep (cook mode)']} />
        </Section>

        {/* ── 04: Timer ── */}
        <Section id="timer" num="04" title="Timer Logic"
          desc="setInterval with functional updater avoids stale closures. Dependencies on [phase, paused] restart the interval correctly. Math.max(0, s - 1) prevents negative values."
          files={['Training.jsx:74-84', 'MealPrep.jsx:329-335']}>
          <DemoBox label="PATTERN">
            <pre style={{ fontFamily: Font.mono, fontSize: 11, color: Color.dim, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{
`useEffect(() => {
  if (phase !== 'execute' || paused) return
  const t = setInterval(() => {
    setElapsed(s => s + 1)
    setRestRem(s => Math.max(0, s - 1))
  }, 1000)
  return () => clearInterval(t)
}, [phase, paused])`
            }</pre>
          </DemoBox>
          <UsedBy screens={['Training (elapsed + rest)', 'MealPrep (timeline + cook timers)']} />
        </Section>

        {/* ── 05: Derivation Pipeline ── */}
        <Section id="derivation" num="05" title="Data Derivation Pipeline"
          desc="All goal→behavior logic lives in goalEngine.js. Pure derive* functions. Changing a goal edge weight cascades through programs, macros, meal prep, and intensity targets."
          files={['goalEngine.js', 'fitness-data.js', 'goal-network-data.js']}>
          <DemoBox label="CASCADE">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { from: 'User Goals', to: 'deriveModalities()', color: Color.accent },
                { from: 'Modalities', to: 'generateProgram()', color: Color.blue },
                { from: 'Program', to: 'TrainingSession', color: Color.purple },
                { from: 'Session', to: 'activityLog', color: Color.green },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: step.color, flexShrink: 0 }} />
                  <FMono size={10} color={Color.dim}>{step.from}</FMono>
                  <FMono size={9} color={Color.faint}>→</FMono>
                  <FMono size={10} color={step.color}>{step.to}</FMono>
                </div>
              ))}
            </div>
          </DemoBox>
          <DemoBox label="PARALLEL DERIVATIONS" style={{ marginTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { fn: 'deriveCaloricMod()', out: '±kcal' },
                { fn: 'deriveMacroSplit()', out: 'P/C/F grams' },
                { fn: 'deriveRIRTarget()', out: 'RIR range' },
                { fn: 'deriveMealPrep()', out: 'prep approach' },
                { fn: 'deriveGroupingStyle()', out: 'SS/circuit' },
                { fn: 'getGoalsForModality()', out: 'goal sources' },
              ].map((d, i) => (
                <div key={i} style={{ padding: 8, borderRadius: 6, background: Color.surface2 }}>
                  <FMono size={9} color={Color.accent}>{d.fn}</FMono>
                  <FMono size={9} color={Color.mute} style={{ display: 'block', marginTop: 2 }}>→ {d.out}</FMono>
                </div>
              ))}
            </div>
          </DemoBox>
        </Section>

        {/* ── 06: Exercise Grouping ── */}
        <Section id="grouping" num="06" title="Exercise Grouping Model"
          desc="Supersets and circuits use a group wrapper in session data. Screens that don't need grouping call flattenSessionExercises() for a flat array with _groupId annotations."
          files={['fitness-data.js', 'Training.jsx', 'ProgramOverview.jsx', 'Dashboard.jsx', 'PlanCalendar.jsx']}>
          <DemoRow>
            <DemoBox label="REVIEW VISUAL">
              <div style={{ paddingLeft: 14 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <FTag tone="accent" size="sm">SUPERSET A</FTag>
                  <FMono size={9} color={Color.mute}>rest 90s after</FMono>
                </div>
                {['Lateral Raise', 'Face Pull'].map((name, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${Color.accent}50`,
                      display: 'grid', placeItems: 'center',
                      fontFamily: Font.mono, fontSize: 9, color: Color.accent,
                    }}>A{i + 1}</div>
                    <div>
                      <FMono size={10} color={Color.text}>{name}</FMono>
                      <FMono size={9} color={Color.mute}>3 x 12 @ 8KG{i === 0 ? ' · NO REST' : ''}</FMono>
                    </div>
                  </div>
                ))}
              </div>
            </DemoBox>
            <DemoBox label="EXECUTE BANNER">
              <div style={{
                padding: '6px 12px', borderRadius: 6,
                background: `${Color.accent}08`, border: `1px solid ${Color.accent}20`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <FTag tone="accent" size="sm">SUPERSET A</FTag>
                <FMono size={10} color={Color.dim}>1/2</FMono>
                <FMono size={9} color={Color.accent} style={{ marginLeft: 'auto' }}>→ Face Pull</FMono>
              </div>
            </DemoBox>
          </DemoRow>
        </Section>

        {/* ── 07: Intensity Grid ── */}
        <Section id="intensity" num="07" title="Intensity Grid (RPE + RIR)"
          desc="RPE and RIR shown side-by-side. Tapping one syncs the other (RPE = 10 - RIR). Target RIR range highlighted in green tint. Two 3x2 grids in a single row."
          files={['Training.jsx', 'goalEngine.js']}>
          <IntensityDemo />
        </Section>

        {/* ── 08: Load Adjustment ── */}
        <Section id="load-adjust" num="08" title="Load Adjustment Suggestion"
          desc="After logging a set with RIR >= 3 (too easy) or RIR = 0 (too hard), a suggestion card appears during rest. ±5% rounded to nearest 2.5kg. User can accept or dismiss."
          files={['Training.jsx', 'fitness-data.js']}>
          <DemoRow>
            <DemoBox label="ROOM TO GROW (RIR >= 3)">
              <FSurface style={{ border: `1px solid ${Color.green}40` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `${Color.green}15`, display: 'grid', placeItems: 'center',
                  }}>
                    <FMono size={14} color={Color.green}>↑</FMono>
                  </div>
                  <div>
                    <div style={{ ...Type.bodySm, color: Color.text }}>Room to grow</div>
                    <FMono size={10} color={Color.dim}>80kg → 82.5kg</FMono>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <FBtn variant="ghost" size="sm" data-stay="true" style={{ flex: 1 }}>Keep 80kg</FBtn>
                  <FBtn variant="primary" size="sm" data-stay="true" style={{ flex: 1 }}>Use 82.5kg</FBtn>
                </div>
              </FSurface>
            </DemoBox>
            <DemoBox label="DIAL IT BACK (RIR = 0)">
              <FSurface style={{ border: `1px solid ${Color.amber}40` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `${Color.amber}15`, display: 'grid', placeItems: 'center',
                  }}>
                    <FMono size={14} color={Color.amber}>↓</FMono>
                  </div>
                  <div>
                    <div style={{ ...Type.bodySm, color: Color.text }}>Dial it back</div>
                    <FMono size={10} color={Color.dim}>102kg → 97.5kg</FMono>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <FBtn variant="ghost" size="sm" data-stay="true" style={{ flex: 1 }}>Keep 102kg</FBtn>
                  <FBtn variant="primary" size="sm" data-stay="true" style={{ flex: 1 }}>Use 97.5kg</FBtn>
                </div>
              </FSurface>
            </DemoBox>
          </DemoRow>
        </Section>

        {/* ── 09: Goal Tags ── */}
        <Section id="goal-tags" num="09" title="Goal Tag Display"
          desc="goalSources on each session rendered as FTag chips. Shows which user goals drove this session. Different treatment on dashboard (inline colored badges) vs session cards (muted FTags)."
          files={['Training.jsx', 'ProgramOverview.jsx', 'Dashboard.jsx', 'GoalDetail.jsx']}>
          <DemoRow>
            <DemoBox label="SESSION CARD STYLE">
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <FMono size={9} color={Color.mute}>TARGETS:</FMono>
                <FTag tone="mute" size="sm">HYPERTROPHY</FTag>
                <FTag tone="mute" size="sm">FAT LOSS</FTag>
              </div>
            </DemoBox>
            <DemoBox label="DASHBOARD STRIP STYLE">
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(255,110,80,0.08)', color: Color.accent, fontFamily: Font.mono, fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}>Hypertrophy</span>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(255,110,80,0.08)', color: Color.accent, fontFamily: Font.mono, fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}>Fat Loss</span>
                <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(74,222,128,0.08)', color: Color.green, fontFamily: Font.mono, fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}>Hydration</span>
              </div>
            </DemoBox>
          </DemoRow>
        </Section>

        {/* ── 10: Nav Wiring ── */}
        <Section id="nav-wiring" num="10" title="Navigation Wiring"
          desc="5-tab bar + detail stack. TILE_ROUTES maps dashboard tiles to screens. DetailRouter renders the screen. pushDetail/popDetail manages the stack."
          files={['Shell.jsx', 'NavigationContext.jsx']}>
          <DemoBox label="WIRING CHECKLIST">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { step: '1', text: 'Import ScreenContent in Shell.jsx' },
                { step: '2', text: 'Add to TILE_ROUTES (if tile launches it)' },
                { step: '3', text: 'Add case to DetailRouter switch' },
                { step: '4', text: 'Navigate: pushDetail(screenId, title, data)' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: Color.accent, display: 'grid', placeItems: 'center',
                    fontFamily: Font.mono, fontSize: 10, fontWeight: 700, color: Color.accentText,
                  }}>{s.step}</div>
                  <FMono size={10} color={Color.dim}>{s.text}</FMono>
                </div>
              ))}
            </div>
          </DemoBox>
        </Section>

        {/* ── 11: State Updates ── */}
        <Section id="state" num="11" title="Immutable State Updates"
          desc="Always spread prev. Use .map() for single-item updates. appendActivity adds timestamped entries capped at 500."
          files={['UserContext.jsx']}>
          <DemoBox label="PATTERN">
            <pre style={{ fontFamily: Font.mono, fontSize: 11, color: Color.dim, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{
`setState(prev => {
  const sessions = prev.workoutPlan.sessions.map(s =>
    s.id === id ? { ...s, completed: true } : s
  )
  return { ...prev, workoutPlan: { ...prev.workoutPlan, sessions } }
})`
            }</pre>
          </DemoBox>
        </Section>

        {/* ── 12: Mock Fallback ── */}
        <Section id="mock-fallback" num="12" title="Mock Fallback Pattern"
          desc="Screens always render — mock data fills in when real data isn't available. Real data replaces mocks field-by-field."
          files={['Dashboard.jsx', 'mockUser.js']}>
          <DemoBox label="FALLBACK CHAIN">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ padding: '8px 14px', borderRadius: 6, background: `${Color.green}10`, border: `1px solid ${Color.green}30` }}>
                <FMono size={10} color={Color.green}>Real data</FMono>
              </div>
              <FMono size={12} color={Color.faint}>→</FMono>
              <div style={{ padding: '8px 14px', borderRadius: 6, background: `${Color.amber}10`, border: `1px solid ${Color.amber}30` }}>
                <FMono size={10} color={Color.amber}>Mock fallback</FMono>
              </div>
              <FMono size={12} color={Color.faint}>→</FMono>
              <div style={{ padding: '8px 14px', borderRadius: 6, background: Color.surface2, border: `1px solid ${Color.borderSoft}` }}>
                <FMono size={10} color={Color.mute}>Empty state</FMono>
              </div>
            </div>
          </DemoBox>
          <UsedBy screens={['Dashboard', 'ProgramOverview', 'Training', 'WaterTracking', 'Profile', 'all screens']} />
        </Section>

        {/* ── 13: Universal Tracker ── */}
        <Section id="tracker" num="13" title="Universal Tracker Template"
          desc="Ring + legend + sparkline + quick-add + log. Every trackable metric (water, sleep, steps, weight) fits this shape. Currently only water is implemented."
          files={['WaterTracking.jsx']}>
          <DemoBox label="TEMPLATE LAYOUT">
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${Color.blue}40`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <FNum size={16} weight={300}>1,250</FNum>
                  <FMono size={8} color={Color.mute}>/ 2,500</FMono>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div><FMono size={9} color={Color.mute}>TODAY</FMono><FMono size={10} color={Color.text}> 1,250 ml</FMono></div>
                  <div><FMono size={9} color={Color.mute}>7D AVG</FMono><FMono size={10} color={Color.text}> 2,100 ml</FMono></div>
                </div>
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 24 }}>
                  {[2100, 1800, 2300, 2500, 1900, 2200, 1250].map((v, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: 1.5, height: `${Math.max(15, (v / 2500) * 100)}%`, background: v >= 2500 ? Color.blue : `${Color.blue}40` }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[150, 250, 350, 500].map(ml => (
                    <div key={ml} style={{
                      flex: 1, padding: '4px 0', borderRadius: 4, textAlign: 'center',
                      background: Color.surface2, border: `1px solid ${Color.borderSoft}`,
                    }}>
                      <FMono size={9} color={Color.blue}>+{ml}</FMono>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DemoBox>
          <UsedBy screens={['WaterTracking (live)', 'Sleep / Steps / Weight (planned)']} />
        </Section>

        {/* ── 14: Summary Page ── */}
        <Section id="summary-page" num="14" title="Summary Page"
          desc="Post-session recap: hero celebration, stats grid, item breakdown. The hero is the dopamine hit. Stats give the 'did it matter?' answer. Breakdown satisfies the detail-curious."
          files={['Training.jsx (summary)', 'CookSummary.jsx', 'CheckIn.jsx (result)']}>
          <DemoBox label="LAYOUT">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `${Color.green}15`, border: `2px solid ${Color.green}40`,
                display: 'grid', placeItems: 'center',
              }}>
                <FIcon path={ICONS.check} size={22} color={Color.green} stroke={2.5} />
              </div>
              <FNum size={32} weight={200}>12:34</FNum>
              <FMono size={10} color={Color.mute}>SESSION COMPLETE</FMono>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
              {[{ l: 'Volume', v: '4,320', u: 'kg' }, { l: 'Sets', v: '18' }, { l: 'Avg RPE', v: '7.8' }].map(s => (
                <FSurface key={s.l} style={{ padding: 12, textAlign: 'center' }}>
                  <FLabel mb={4}>{s.l}</FLabel>
                  <FNum size={16} weight={300}>{s.v}</FNum>
                  {s.u && <FMono size={9} color={Color.mute}>{s.u}</FMono>}
                </FSurface>
              ))}
            </div>
          </DemoBox>
          <UsedBy screens={['Training (summary)', 'CookSummary', 'CheckIn (result)']} />
        </Section>

        {/* ── 15: Browse/Filter List ── */}
        <Section id="browse-filter" num="15" title="Browse/Filter List"
          desc="Filter tabs above a scrollable list. Each item shows enough to decide whether to tap in. Active tab uses accent tint. 'All' is always first."
          files={['ExerciseBrowser.jsx', 'Fridge.jsx', 'Macros.jsx (shopping)']}>
          <DemoBox label="FILTER + LIST">
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['ALL', 'COMPOUND', 'ISOLATION', 'CORE'].map((cat, i) => (
                <button key={cat} style={{
                  padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
                  background: i === 0 ? `${Color.accent}15` : 'transparent',
                  color: i === 0 ? Color.accent : Color.mute,
                  fontFamily: Font.mono, fontSize: 10, fontWeight: 600,
                  border: `1px solid ${i === 0 ? Color.accent : Color.borderSoft}`,
                }}>{cat}</button>
              ))}
            </div>
            {['Back Squat', 'Bench Press', 'Deadlift'].map((name, i) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderTop: i > 0 ? `1px solid ${Color.borderSoft}` : 'none',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: Color.accent, flexShrink: 0 }} />
                <FMono size={11} color={Color.text} style={{ flex: 1 }}>{name}</FMono>
                <FTag tone="mute" size="sm">COMPOUND</FTag>
              </div>
            ))}
          </DemoBox>
          <UsedBy screens={['ExerciseBrowser', 'Fridge', 'Macros (shopping list)']} />
        </Section>

        {/* ── 16: Detail Cascade ── */}
        <Section id="detail-cascade" num="16" title="Detail Cascade"
          desc="Detail pages show multiple sections about one entity. Each FSurface section has FLabel heading + primary content. Ghost action buttons at the bottom."
          files={['GoalDetail.jsx', 'ExerciseDetail.jsx']}>
          <DemoBox label="SECTION STACK">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${Color.accent}15`, display: 'grid', placeItems: 'center' }}>
                  <FIcon path={ICONS.goal} size={16} color={Color.accent} />
                </div>
                <div>
                  <FMono size={12} color={Color.text}>Hypertrophy</FMono>
                  <FMono size={9} color={Color.mute}>Body Composition</FMono>
                </div>
              </div>
              <FSurface>
                <FLabel size={10} mb={4}>CALORIC STATE</FLabel>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FMono size={12} color={Color.text}>Surplus</FMono>
                  <FNum size={18} weight={300} color={Color.green}>+300</FNum>
                </div>
              </FSurface>
              <FSurface>
                <FLabel size={10} mb={4}>TRAINING MODALITIES</FLabel>
                <div style={{ display: 'flex', gap: 6 }}>
                  <FTag tone="accent" size="sm">HYPERTROPHY (S)</FTag>
                  <FTag tone="mute" size="sm">CALISTHENICS (M)</FTag>
                </div>
              </FSurface>
              <div style={{ display: 'flex', gap: 8 }}>
                <FBtn variant="ghost" size="sm" data-stay="true">View template</FBtn>
                <FBtn variant="ghost" size="sm" data-stay="true">Browse exercises</FBtn>
              </div>
            </div>
          </DemoBox>
          <UsedBy screens={['GoalDetail', 'ExerciseDetail']} />
        </Section>

        {/* ── 17: Multi-Step Flow ── */}
        <Section id="multi-step" num="17" title="Multi-Step Linear Flow"
          desc="Step indicator + one input per screen + forward/back. The progress bar answers 'how much is left?' which prevents abandonment."
          files={['Onboarding.jsx', 'CheckIn.jsx']}>
          <DemoBox label="STEP INDICATOR + CONTENT">
            <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i <= 2 ? Color.accent : Color.borderSoft,
                }} />
              ))}
            </div>
            <FMono size={9} color={Color.mute} style={{ marginBottom: 8 }}>STEP 3 OF 6</FMono>
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <FNum size={48} weight={200}>72.5</FNum>
              <FMono size={10} color={Color.mute}>KG</FMono>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <FBtn variant="ghost" size="sm" data-stay="true" style={{ flex: 1 }}>Back</FBtn>
              <FBtn variant="primary" size="sm" data-stay="true" style={{ flex: 1 }}>Next</FBtn>
            </div>
          </DemoBox>
          <UsedBy screens={['Onboarding (13 steps)', 'CheckIn (4 steps)']} />
        </Section>

        {/* ── 18: Stat Card Grid ── */}
        <Section id="stat-grid" num="18" title="Stat Card Grid"
          desc="3-4 equal-width FSurface cards. Center-aligned label + number. Creates a 'scoreboard' feel. Max 4 columns on phone viewport."
          files={['Training.jsx', 'CookSummary.jsx', 'ProgramOverview.jsx', 'Macros.jsx']}>
          <DemoBox label="3-COLUMN AND 4-COLUMN">
            <FMono size={9} color={Color.mute} style={{ marginBottom: 8, display: 'block' }}>3-COL</FMono>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {[{ l: 'Portions', v: '18' }, { l: 'Batches', v: '3' }, { l: 'Saved', v: '2.5h' }].map(s => (
                <FSurface key={s.l} style={{ padding: 12, textAlign: 'center' }}>
                  <FLabel mb={4}>{s.l}</FLabel>
                  <FNum size={18} weight={300}>{s.v}</FNum>
                </FSurface>
              ))}
            </div>
            <FMono size={9} color={Color.mute} style={{ marginBottom: 8, display: 'block' }}>4-COL</FMono>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[{ l: 'Volume', v: '4.3k' }, { l: 'Sets', v: '18' }, { l: 'RPE', v: '7.8', c: Color.accent }, { l: 'RIR', v: '2.1', c: Color.green }].map(s => (
                <FSurface key={s.l} style={{ padding: 10, textAlign: 'center' }}>
                  <FLabel mb={3}>{s.l}</FLabel>
                  <FNum size={14} weight={300} color={s.c}>{s.v}</FNum>
                </FSurface>
              ))}
            </div>
          </DemoBox>
        </Section>

        {/* ── 19: Section Header ── */}
        <Section id="section-header" num="19" title="Section Header with Metadata"
          desc="FLabel on left, trailing count/status on right. justify-content: space-between with baseline alignment. Metadata is always muted."
          files={['Macros.jsx', 'ProgramOverview.jsx', 'Profile.jsx', 'Training.jsx']}>
          <DemoBox label="VARIANTS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <FLabel mb={0}>THIS WEEK</FLabel>
                <FMono size={10} color={Color.mute}>14 MEALS · 3 BATCHES</FMono>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <FLabel mb={0}>SESSIONS</FLabel>
                <FMono size={10} color={Color.accent}>3 / 5 COMPLETE</FMono>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <FLabel mb={0}>RECENT CHECK-INS</FLabel>
                <FMono size={10} color={Color.green}>4 WK STREAK</FMono>
              </div>
            </div>
          </DemoBox>
        </Section>

        {/* ── 20: Card List with Status ── */}
        <Section id="card-status" num="20" title="Card List with Status"
          desc="Actionable items with status badges (TODAY/DONE/MISSED). Active card gets tinted border. Done cards show green tag. Missed cards fade to 45% opacity."
          files={['ProgramOverview.jsx', 'Macros.jsx', 'CookSummary.jsx']}>
          <DemoBox label="SESSION CARDS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { day: 'MON', name: 'Upper A · Hypertrophy', status: 'done' },
                { day: 'TUE', name: 'Lower A · Strength', status: 'today' },
                { day: 'THU', name: 'Upper B · Hypertrophy', status: 'upcoming' },
              ].map(s => (
                <FSurface key={s.day} style={{
                  padding: 14,
                  border: `1px solid ${s.status === 'today' ? `${Color.accent}40` : Color.borderSoft}`,
                  background: s.status === 'today' ? `${Color.accent}04` : Color.surface,
                  opacity: s.status === 'missed' ? 0.45 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <FMono size={11} color={s.status === 'today' ? Color.accent : Color.dim}>{s.day}</FMono>
                    {s.status === 'today' && <FTag tone="accent" size="sm">TODAY</FTag>}
                    {s.status === 'done' && <FTag tone="green" size="sm">DONE</FTag>}
                    <FTag tone="mute" size="sm" style={{ marginLeft: 'auto' }}>HYPERTROPHY</FTag>
                  </div>
                  <FMono size={11} color={Color.text}>{s.name}</FMono>
                  {s.status === 'today' && (
                    <FBtn variant="primary" size="sm" data-stay="true" style={{ marginTop: 10 }}>Start session</FBtn>
                  )}
                </FSurface>
              ))}
            </div>
          </DemoBox>
          <UsedBy screens={['ProgramOverview', 'Macros (meals)', 'CookSummary (batches)']} />
        </Section>

      </main>
    </div>
  )
}

/* ── Interactive Intensity Grid Demo ── */

function IntensityDemo() {
  const [rpe, setRpe] = useState(null)
  const [rir, setRir] = useState(null)
  const target = { min: 1, max: 3 }

  return (
    <DemoBox label="INTERACTIVE DEMO">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <FMono size={10} color={Color.dim}>Tap either side — they sync</FMono>
        <FMono size={9} color={Color.green}>TARGET RIR 1-3</FMono>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <FMono size={9} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>RPE</FMono>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {[5, 6, 7, 8, 9, 10].map(r => (
              <button key={r} onClick={() => { setRpe(r); setRir(10 - r) }} style={{
                padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: rpe === r ? Color.accent : Color.surface,
                color: rpe === r ? Color.accentText : Color.text,
                fontFamily: Font.mono, fontSize: 13, fontWeight: rpe === r ? 700 : 400,
                transition: 'all 0.15s',
              }}>{r}</button>
            ))}
          </div>
        </div>
        <div>
          <FMono size={9} color={Color.mute} style={{ marginBottom: 6, display: 'block' }}>REPS IN RESERVE</FMono>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {[0, 1, 2, 3, 4, 5].map(r => {
              const inTarget = r >= target.min && r <= target.max
              return (
                <button key={r} onClick={() => { setRir(r); setRpe(10 - r) }} style={{
                  padding: '10px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: rir === r ? Color.green : inTarget ? `${Color.green}12` : Color.surface,
                  color: rir === r ? '#0a1a0a' : inTarget ? Color.green : Color.text,
                  fontFamily: Font.mono, fontSize: 13, fontWeight: rir === r ? 700 : 400,
                  transition: 'all 0.15s',
                }}>{r}</button>
              )
            })}
          </div>
        </div>
      </div>
      {rpe != null && (
        <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
          <FMono size={10} color={Color.accent}>RPE {rpe}</FMono>
          <FMono size={10} color={Color.green}>RIR {rir}</FMono>
          <FMono size={10} color={Color.mute}>= {rir >= target.min && rir <= target.max ? 'IN TARGET' : rir < target.min ? 'TOO HARD' : 'TOO EASY'}</FMono>
        </div>
      )}
    </DemoBox>
  )
}
