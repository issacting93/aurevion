/* UI Library — tokens, components, and brand plate
   Shows ONLY the components actually used in Aurevion screens. */

import { useState } from 'react'
import { Color, Font, Space, Radius, Shadow, Duration, Ease, Type } from '../ui/tokens'
import {
  ICONS, Phone,
  FNavBar, FLabel, FMono, FNum,
  FTexBar, FScale,
  FIcon, FTag, FBtn,
  FTabBar, FSection, FToolbar,
  FStagger,
  FSurface, FListRow, FButtonGroup, FAvatar,
  ErrorBoundary,
} from '../ui/components'
import { SCREENS } from '../app/screens'
import { Link } from 'react-router-dom'

const merge = (...o) => Object.assign({}, ...o)

/* ── Layout helpers ── */

function Section({ title, sub, children }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${Color.borderSoft}` }}>
        <div style={merge(Type.labelLg, { color: Color.mute })}>{title}</div>
        {sub && <div style={merge(Type.labelSm, { color: Color.faint })}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

function SubSection({ title, children, style }) {
  return (
    <div style={{ marginBottom: 32, ...style }}>
      <div style={merge(Type.labelSm, { color: Color.faint, marginBottom: 12, letterSpacing: 1.4 })}>{title}</div>
      {children}
    </div>
  )
}

function Grid({ children, cols = 4, gap = 12 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>{children}</div>
}

function Demo({ label, children, bg }) {
  return (
    <div style={{ padding: 16, borderRadius: Radius.lg, background: bg || Color.surface, border: `1px solid ${Color.borderSoft}` }}>
      {label && <div style={merge(Type.labelSm, { color: Color.mute, marginBottom: 12 })}>{label}</div>}
      {children}
    </div>
  )
}

function Swatch({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: color, border: `1px solid ${Color.border}`, flexShrink: 0 }} />
      <div>
        <div style={merge(Type.bodySm, { color: Color.text })}>{label}</div>
        <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.faint }}>{color}</div>
      </div>
    </div>
  )
}

function TypeSample({ name, preset }) {
  const sample = preset.textTransform === 'uppercase' ? 'SAMPLE LABEL TEXT' : 'The quick brown fox jumps'
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: Font.mono, fontSize: 10, letterSpacing: 1, color: Color.faint, marginBottom: 4 }}>{name}</div>
      <div style={merge(preset, { color: Color.text })}>{sample}</div>
      <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.faint, marginTop: 2 }}>
        {preset.fontSize}px / w{preset.fontWeight} / ls {preset.letterSpacing}
      </div>
    </div>
  )
}

function IconGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
      {Object.entries(ICONS).map(([name, path]) => (
        <div key={name} style={{
          padding: '12px 4px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <FIcon path={path} size={20} color={Color.text} stroke={1.8} />
          <div style={{ fontFamily: Font.mono, fontSize: 9, color: Color.mute, letterSpacing: 0.5, textAlign: 'center' }}>{name}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Brand plate ── */

function BrandPlate() {
  return (
    <div style={{ background: '#0a0a0a', color: Color.text, borderRadius: 16, padding: 32, border: `1px solid ${Color.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <img src="/logo.svg" width="48" height="48" alt="" style={{ borderRadius: 12 }} />
        <div>
          <div style={{ fontFamily: Font.mono, fontSize: 20, fontWeight: 200, letterSpacing: 4 }}>AUREVI0N</div>
          <div style={{ fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.4, color: Color.mute, textTransform: 'uppercase', marginTop: 2 }}>AI-Native Fitness Platform</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, fontFamily: Font.mono, fontSize: 10, color: Color.mute }}>
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Wordmark</div>
          <div>Geist Mono · 200</div>
          <div>Tracking: 4px</div>
          <div>Zero: slashed</div>
        </div>
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Colors</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {[Color.accent, Color.green, Color.red, '#000'].map((c, i) => (
              <div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: c, border: `1px solid ${Color.border}` }} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Type</div>
          <div>Display: Geist Sans</div>
          <div>UI / Data: Geist Mono</div>
        </div>
      </div>
    </div>
  )
}

/* ── Filter bar ── */

function FilterBar({ value, onChange }) {
  const tabs = ['all', 'tokens', 'components', 'icons', 'brand']
  return (
    <div style={{ display: 'flex', gap: 4, padding: 3, background: 'rgba(255,255,255,0.03)', border: `1px solid ${Color.borderSoft}`, borderRadius: 10 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: value === t ? 'rgba(255,110,80,0.12)' : 'transparent',
          color: value === t ? Color.accent : Color.mute,
          fontFamily: Font.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          transition: 'background 0.15s ease, color 0.15s ease',
        }}>{t}</button>
      ))}
    </div>
  )
}

/* ── Main ── */

export default function UILibrary() {
  const [filter, setFilter] = useState('all')
  const show = (k) => filter === 'all' || filter === k

  return (
    <div style={{ background: Color.bg, color: Color.text, fontFamily: Font.sans, minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${Color.borderSoft}`,
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.svg" width="28" height="28" alt="" style={{ borderRadius: 6 }} />
            <span style={{ fontFamily: Font.mono, fontSize: 13, fontWeight: 200, letterSpacing: 3 }}>AUREVI0N</span>
          </Link>
          <span style={merge(Type.labelSm, { color: Color.mute, marginLeft: 8 })}>COMPONENT LIBRARY</span>
        </div>
        <FilterBar value={filter} onChange={setFilter} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 100px' }}>

        {/* ═══════════════════════ TOKENS ═══════════════════════ */}
        {show('tokens') && <>
          <Section title="COLORS" sub="Color.*">
            <Grid cols={3} gap={20}>
              <div>
                <SubSection title="BACKGROUNDS">
                  <Swatch color={Color.bg} label="bg" />
                  <Swatch color={Color.surface} label="surface" />
                  <Swatch color={Color.surface2} label="surface2" />
                  <Swatch color={Color.surface3} label="surface3" />
                </SubSection>
              </div>
              <div>
                <SubSection title="TEXT">
                  <Swatch color={Color.text} label="text" />
                  <Swatch color={Color.dim} label="dim" />
                  <Swatch color={Color.mute} label="mute" />
                  <Swatch color={Color.faint} label="faint" />
                </SubSection>
              </div>
              <div>
                <SubSection title="SEMANTIC">
                  <Swatch color={Color.accent} label="accent" />
                  <Swatch color={Color.accentHot} label="accentHot" />
                  <Swatch color={Color.green} label="green" />
                  <Swatch color={Color.red} label="red" />
                  <Swatch color={Color.blue} label="blue" />
                </SubSection>
              </div>
            </Grid>
          </Section>

          <Section title="TYPOGRAPHY" sub="Type.*">
            <Grid cols={2} gap={24}>
              <div>
                <TypeSample name="displayLg" preset={Type.displayLg} />
                <TypeSample name="displayMd" preset={Type.displayMd} />
                <TypeSample name="displaySm" preset={Type.displaySm} />
                <TypeSample name="headingLg" preset={Type.headingLg} />
                <TypeSample name="headingMd" preset={Type.headingMd} />
                <TypeSample name="headingSm" preset={Type.headingSm} />
              </div>
              <div>
                <TypeSample name="bodyLg" preset={Type.bodyLg} />
                <TypeSample name="bodyMd" preset={Type.bodyMd} />
                <TypeSample name="bodySm" preset={Type.bodySm} />
                <TypeSample name="labelLg" preset={Type.labelLg} />
                <TypeSample name="labelMd" preset={Type.labelMd} />
                <TypeSample name="labelSm" preset={Type.labelSm} />
              </div>
            </Grid>
          </Section>

          <Section title="SPACING" sub="Space.*">
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {Object.entries(Space).map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ width: Math.max(v, 4), height: Math.max(v, 4), background: Color.accentDim, borderRadius: 2, border: `1px solid ${Color.accent}` }} />
                  <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, marginTop: 4 }}>{k} · {v}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="RADIUS" sub="Radius.*">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {Object.entries(Radius).filter(([k]) => k !== 'full').map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: v, background: Color.surface, border: `1px solid ${Color.border}` }} />
                  <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, marginTop: 4 }}>{k} · {v}</div>
                </div>
              ))}
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: Radius.full, background: Color.surface, border: `1px solid ${Color.border}` }} />
                <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, marginTop: 4 }}>full</div>
              </div>
            </div>
          </Section>
        </>}

        {/* ═══════════════════════ COMPONENTS ═══════════════════════ */}
        {show('components') && <>

          {/* ── Buttons ── */}
          <Section title="BUTTONS" sub="FBtn">
            <SubSection title="FBtn — VARIANTS">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <FBtn variant="primary">Primary</FBtn>
                <FBtn variant="secondary">Secondary</FBtn>
                <FBtn variant="ghost">Ghost</FBtn>
                <FBtn variant="primary" disabled>Disabled</FBtn>
                <FBtn variant="primary" loading>Loading</FBtn>
              </div>
            </SubSection>
            <SubSection title="FBtn — SIZES">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <FBtn variant="primary" size="sm">Small</FBtn>
                <FBtn variant="primary" size="md">Medium</FBtn>
                <FBtn variant="primary" size="lg">Large</FBtn>
              </div>
            </SubSection>
            <SubSection title="FBtn — SPECIAL VARIANTS">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
                <FBtn variant="split" full iconLeading={ICONS.fwd}>Split Action</FBtn>
                <FBtn variant="primary" full size="lg" icon={ICONS.check}>Full + Icon</FBtn>
              </div>
            </SubSection>
          </Section>

          {/* ── Tags ── */}
          <Section title="TAGS" sub="FTag">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <FTag tone="neutral">Neutral</FTag>
              <FTag tone="accent">Accent</FTag>
              <FTag tone="green">Green</FTag>
              <FTag tone="red">Red</FTag>
              <FTag tone="mute">Mute</FTag>
            </div>
          </Section>

          {/* ── Typography ── */}
          <Section title="TEXT COMPONENTS" sub="FLabel · FMono · FNum">
            <Grid cols={3} gap={20}>
              <Demo label="FLabel">
                <FLabel>Section Label</FLabel>
                <FLabel color={Color.accent}>Accent Label</FLabel>
                <FLabel size={12}>Large Label</FLabel>
              </Demo>
              <Demo label="FMono">
                <FMono>Default mono</FMono><br/>
                <FMono color={Color.accent}>Accent</FMono><br/>
                <FMono color={Color.mute} size={9}>Small mute</FMono>
              </Demo>
              <Demo label="FNum">
                <FNum size={48} weight={200} unit="kcal">2,200</FNum>
                <div style={{ marginTop: 8 }}>
                  <FNum size={28} weight={300} unit="kg">82.1</FNum>
                </div>
              </Demo>
            </Grid>
          </Section>

          {/* ── Progress bars ── */}
          <Section title="PROGRESS" sub="FTexBar · FScale">
            <Grid cols={2} gap={24}>
              <Demo label="FTexBar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <FTexBar pct={72} height={22} />
                  <FTexBar pct={45} height={10} color={Color.green} />
                  <FTexBar pct={90} height={6} />
                  <FTexBar pct={30} height={6} color={Color.dim} />
                </div>
              </Demo>
              <Demo label="FScale">
                <div style={{ marginTop: 12 }}>
                  <FScale marks={[0, 25, 50, 75, 100]} suffix="%" />
                </div>
              </Demo>
            </Grid>
          </Section>

          {/* ── Sections + Layout ── */}
          <Section title="LAYOUT" sub="FSection · FToolbar · FStagger">
            <Grid cols={2} gap={20}>
              <Demo label="FSection">
                <FSection label="Recent activity" mb={0}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <FNum size={28} weight={200}>4 items</FNum>
                    <FMono color={Color.green}>ON TRACK</FMono>
                  </div>
                </FSection>
              </Demo>
              <Demo label="FToolbar">
                <FToolbar cells={[
                  { label: 'Merge', icon: ICONS.meal },
                  { label: 'Timeline', icon: ICONS.timer },
                  { label: 'Cook', icon: ICONS.flame, primary: true },
                ]} />
              </Demo>
            </Grid>
            <SubSection title="FStagger — ENTRANCE ANIMATION" style={{ marginTop: 20 }}>
              <StaggerDemo />
            </SubSection>
          </Section>

          {/* ── Navigation ── */}
          <Section title="NAVIGATION" sub="FNavBar · FTabBar · Phone">
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ background: Color.surface, borderRadius: 12, overflow: 'hidden', width: 360 }}>
                <FNavBar
                  title="SCREEN TITLE"
                  leading={<FBtn variant="ghost" size="sm" icon={ICONS.back} />}
                  trailing={<FBtn variant="ghost" size="sm" icon={ICONS.more} />}
                />
                <div style={{ padding: 16, color: Color.dim, fontSize: 13 }}>Content area</div>
                <FTabBar active={0} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FMono color={Color.mute} size={10}>TAB STATES</FMono>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={{ width: 240, borderRadius: 8, overflow: 'hidden', border: `1px solid ${Color.borderSoft}` }}>
                    <FTabBar active={i} />
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Phone Shell ── */}
          <Section title="PHONE SHELL" sub="Phone · ErrorBoundary">
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', height: 437, width: 201 }}>
                <Phone statusTime="9:41">
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FMono color={Color.mute}>402 x 874</FMono>
                  </div>
                </Phone>
              </div>
              <div style={{ flex: 1 }}>
                <FMono color={Color.mute} size={10}>SHELL FEATURES</FMono>
                <ul style={{ ...Type.bodyMd, color: Color.dim, lineHeight: 2, marginTop: 8 }}>
                  <li>Status bar with dynamic time</li>
                  <li>Dynamic island notch</li>
                  <li>Home indicator bar</li>
                  <li>402x874px viewport</li>
                  <li>Device shadow + bezel ring</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* ── Surfaces ── */}
          <Section title="SURFACES" sub="FSurface">
            <Grid cols={2} gap={16}>
              <FSurface>
                <FLabel>FSurface</FLabel>
                <div style={{ marginTop: 8, fontSize: 13, color: Color.dim }}>Standard card container with soft border.</div>
              </FSurface>
              <FSurface accent={Color.accent}>
                <FLabel color={Color.accent}>FSurface accent</FLabel>
                <div style={{ marginTop: 8, fontSize: 13, color: Color.dim }}>Surface with accent border tint.</div>
              </FSurface>
            </Grid>
          </Section>

          {/* ── List Rows ── */}
          <Section title="LIST ROWS" sub="FListRow">
            <div style={{ maxWidth: 400 }}>
              <FListRow title="Salmon fillet" subtitle="PROTEIN · 600G" trailing={<FMono color={Color.accent}>+4</FMono>} divider={false} />
              <FListRow title="Sat 23 May" subtitle="BODY FAT · WEIGHT" trailing={<FMono color={Color.green}>-0.4 kg</FMono>} />
              <FListRow
                leading={<div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center' }}><FIcon path={ICONS.goal} size={18} color={Color.dim}/></div>}
                title="Goal & contract"
                subtitle="EDIT, PAUSE, OR RESET"
                trailing={<FIcon path={ICONS.fwd} size={16} color={Color.mute}/>}
              />
            </div>
          </Section>

          {/* ── Button Group ── */}
          <Section title="BUTTON GROUP" sub="FButtonGroup">
            <Grid cols={2} gap={16}>
              <Demo label="With icons">
                <FButtonGroup
                  options={[
                    { value: 'bal', icon: ICONS.sparkle, label: 'BAL' },
                    { value: 'nut', icon: ICONS.meal, label: 'NUT' },
                    { value: 'trn', icon: ICONS.dumb, label: 'TRN' },
                  ]}
                  value="bal"
                  onChange={() => {}}
                />
              </Demo>
              <Demo label="Text only">
                <FButtonGroup
                  options={[
                    { value: 'm', label: 'M' },
                    { value: 'w', label: 'W' },
                    { value: 'd', label: 'D' },
                  ]}
                  value="w"
                  onChange={() => {}}
                  size="sm"
                />
              </Demo>
            </Grid>
          </Section>

          {/* ── Avatar ── */}
          <Section title="AVATAR" sub="FAvatar">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <FAvatar initials="ZM" tone="warm" size={56} />
                <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.faint, marginTop: 6 }}>warm · 56</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FAvatar initials="AU" tone="cool" />
                <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.faint, marginTop: 6 }}>cool · 48</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <FAvatar initials="T" tone="neutral" size={32} />
                <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.faint, marginTop: 6 }}>neutral · 32</div>
              </div>
            </div>
          </Section>

          {/* ── Screen Registry ── */}
          <Section title="SCREEN REGISTRY" sub={`${SCREENS.length} screens`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {SCREENS.map(s => (
                <div key={s.id} style={{
                  background: Color.surface, border: `1px solid ${Color.borderSoft}`,
                  borderRadius: 10, padding: 12,
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <div style={merge(Type.labelSm, { color: Color.accent })}>{s.flow}</div>
                  <div style={merge(Type.bodyMd, { color: Color.text })}>{s.label}</div>
                  <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.faint }}>{s.feature} · {s.id}</div>
                </div>
              ))}
            </div>
          </Section>
        </>}

        {/* ═══════════════════════ ICONS ═══════════════════════ */}
        {show('icons') && <>
          <Section title="ICON SET" sub={`FIcon · ${Object.keys(ICONS).length} icons · 24x24 viewBox`}>
            <SubSection title="SIZES">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                {[14, 18, 20, 24, 32].map(s => (
                  <div key={s} style={{ textAlign: 'center' }}>
                    <FIcon path={ICONS.flame} size={s} color={Color.accent} stroke={1.8} />
                    <div style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, marginTop: 4 }}>{s}px</div>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="FULL SET">
              <IconGrid />
            </SubSection>
          </Section>
        </>}

        {/* ═══════════════════════ BRAND ═══════════════════════ */}
        {show('brand') && <>
          <Section title="BRAND PLATE">
            <BrandPlate />
          </Section>
        </>}

      </div>
    </div>
  )
}

/* ── Stagger animation demo ── */
function StaggerDemo() {
  const [key, setKey] = useState(0)
  return (
    <div>
      <FBtn variant="ghost" size="sm" onClick={() => setKey(k => k + 1)}>Replay</FBtn>
      <div style={{ marginTop: 12 }} key={key}>
        <FStagger delay={60} distance={12}>
          {['First item', 'Second item', 'Third item', 'Fourth item'].map(t => (
            <div key={t} style={{
              padding: '10px 14px', borderRadius: Radius.md,
              background: Color.surface, border: `1px solid ${Color.borderSoft}`,
              marginBottom: 6, ...Type.bodyMd,
            }}>{t}</div>
          ))}
        </FStagger>
      </div>
    </div>
  )
}
