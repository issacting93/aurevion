// Core component previews — simple UI primitives.

function FeatureCardPreview() {
  const [hover, setHover] = React.useState(false);
  return (
    <PreviewBase>
      <H1>Component Audit</H1>
      <Caption>Full-screen transition entry surface — proposed cook-mode opener.</Caption>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: T.surface, borderRadius: 22, padding: 18,
          border: `1px solid ${T.borderSoft}`,
          transform: hover ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform .25s ease, box-shadow .25s ease',
          boxShadow: hover ? '0 18px 40px rgba(255,110,80,0.18)' : 'none',
          cursor: 'pointer',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Tonight · Salmon &amp; greens</div>
            <div style={{ fontSize: 12, color: T.textDim }}>Tap to enter cook mode</div>
          </div>
          <button style={{
            background: T.accent, color: '#1a0f0a', border: 'none',
            padding: '10px 18px', borderRadius: 14, fontWeight: 600,
            fontSize: 14, fontFamily: FONTS.sans, cursor: 'pointer',
          }}>Start</button>
        </div>
        <div style={{
          marginTop: 14, height: 132, borderRadius: 14,
          background: `repeating-linear-gradient(135deg, ${T.surface2} 0 12px, #1f1f1f 12px 24px)`,
          border: `1px solid ${T.borderSoft}`,
          display: 'flex', alignItems: 'flex-end', padding: 10,
        }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.textMute }}>{'<photo · entree>'}</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MIcon name="touch_app" size={14}/> tap <MIcon name="east" size={14}/> fullscreen morph (proposed)
      </div>
    </PreviewBase>
  );
}

function StackWindowPreview() {
  const [open, setOpen] = React.useState(false);
  const cards = [0, 1, 2, 3, 4];
  return (
    <PreviewBase>
      <H1>Stack Window</H1>
      <Caption>Stacked preview fans into a horizontal strip on tap.</Caption>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: T.surface, borderRadius: 22, padding: 24,
          border: `1px solid ${T.borderSoft}`,
          cursor: 'pointer', minHeight: 220,
        }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180, position: 'relative' }}>
          {cards.map((i) => {
            const offset = open ? (i - 2) * 56 : i * 6;
            const ty = open ? 0 : i * 4;
            const rot = open ? 0 : (i - 2) * 1.5;
            return (
              <div key={i} style={{
                position: 'absolute',
                width: 70, height: 110, borderRadius: 12,
                background: T.surface2, border: `1px solid ${T.borderSoft}`,
                transform: `translate(${offset}px, ${ty}px) rotate(${rot}deg)`,
                transition: 'transform .5s cubic-bezier(.4,.0,.2,1)',
                zIndex: open ? 5 - Math.abs(i - 2) : i,
              }} />
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', fontFamily: FONTS.mono, fontSize: 10, color: T.textMute, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        tap to {open ? 'collapse' : 'fan'} <MIcon name="east" size={14}/>
      </div>
    </PreviewBase>
  );
}

function TimelinePreview() {
  const items = [
    { name: 'Warm-up walk', sub: '5 min mobility', state: 'done' },
    { name: 'Squats',         sub: 'Primary lift · 4 × 6', state: 'active' },
    { name: 'Romanian deadlift', sub: 'Posterior chain · 3 × 8', state: 'idle' },
    { name: 'Walking lunge',  sub: 'Single-leg control · 3 × 10', state: 'idle' },
    { name: 'Cooldown breathing', sub: 'Downshift · 3 min', state: 'idle' },
  ];
  return (
    <PreviewBase scroll>
      <H1>Today · Strength</H1>
      <Caption>Sequential execution rail. Tap a row to focus, swipe to advance.</Caption>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
        {items.map((it, i) => {
          const isDone = it.state === 'done';
          const isActive = it.state === 'active';
          return (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                marginTop: 2,
                background: isDone ? T.accent : 'transparent',
                border: `2px solid ${isActive ? T.accent : isDone ? T.accent : 'rgba(255,110,80,0.35)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1a0f0a', fontSize: 14,
              }}>{isDone ? <MIcon name="check" size={18} color="#1a0f0a" weight={600}/> : isActive ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.accent }}/> : null}</div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: isActive ? T.text : (isDone ? T.textDim : T.text) }}>
                  {it.name}
                </div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>{it.sub}</div>
                {isActive && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 18, fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 0.5 }}>
                    <span style={{ color: T.accent, fontWeight: 600 }}>COMPLETE</span>
                    <span style={{ color: T.textDim }}>SKIP</span>
                    <span style={{ color: T.textDim }}>NEXT</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PreviewBase>
  );
}

function TypographyPreview() {
  return (
    <PreviewBase scroll>
      <H1>Type roles</H1>
      <Caption>Constrained role set; tone carries meaning.</Caption>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14 }}>
        <div>
          <SectionLabel>Display</SectionLabel>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>72%</div>
        </div>
        <div>
          <SectionLabel>Title</SectionLabel>
          <div style={{ fontSize: 22, fontWeight: 600 }}>Sequential strength flow</div>
        </div>
        <div>
          <SectionLabel>Body</SectionLabel>
          <div style={{ fontSize: 15, color: T.text, lineHeight: 1.45 }}>Drive through the floor and keep the chest organized on every rep.</div>
        </div>
        <div>
          <SectionLabel>Caption</SectionLabel>
          <div style={{ fontSize: 12, color: T.textDim }}>4 × 6 · 16 min · Quads · glutes · RPE 8</div>
        </div>
        <div>
          <SectionLabel>Semantic tone</SectionLabel>
          <div style={{ display: 'flex', gap: 18, fontSize: 14, fontWeight: 600, marginTop: 4 }}>
            <Tone color={T.green}>Success</Tone>
            <Tone color={T.amber}>Warning</Tone>
            <Tone color={T.red}>Danger</Tone>
          </div>
        </div>
      </div>
    </PreviewBase>
  );
}

function IconsLinePreview() {
  const icons = [
    { name: 'auto_awesome',  tone: T.text,  label: 'highlight' },
    { name: 'bolt',          tone: T.red,   label: 'urgent', fill: 1 },
    { name: 'check_circle',  tone: T.green, label: 'done' },
    { name: 'schedule',      tone: T.amber, label: 'time' },
    { name: 'warning',       tone: T.red,   label: 'alert' },
  ];
  return (
    <PreviewBase>
      <H1>Line icons</H1>
      <Caption>Tone carries meaning; geometry is shared.</Caption>
      <div style={{ display: 'flex', gap: 22, marginTop: 18, flexWrap: 'wrap' }}>
        {icons.map((ic, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <MIcon name={ic.name} size={30} color={ic.tone} fill={ic.fill || 0} weight={400}/>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: T.textMute, letterSpacing: 0.5 }}>{ic.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, padding: 16, background: T.surface, borderRadius: 14, border: `1px solid ${T.borderSoft}` }}>
        <SectionLabel>Contained treatment</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${T.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MIcon name="auto_awesome" size={20} color={T.purple} fill={1}/>
          </div>
          <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.45 }}>Container lives in the surrounding layout, not in a separate primitive.</div>
        </div>
      </div>
    </PreviewBase>
  );
}

function CookingIconsPreview() {
  // Today's generic Tabler/Material set — flagged as not step-representative.
  const actions = [
    { label: 'Plan',     icon: 'restaurant_menu' },
    { label: 'Prep',     icon: 'kitchen' },
    { label: 'Knife',    icon: 'restaurant' },
    { label: 'Chop',     icon: 'content_cut' },
    { label: 'Measure',  icon: 'monitor_weight' },
    { label: 'Season',   icon: 'grain' },
    { label: 'Mix',      icon: 'donut_small' },
    { label: 'Blend',    icon: 'blender' },
    { label: 'Bake',     icon: 'fireplace' },
    { label: 'Roast',    icon: 'whatshot' },
    { label: 'Grill',    icon: 'outdoor_grill' },
    { label: 'Sauté',    icon: 'local_fire_department' },
    { label: 'Boil',     icon: 'water_drop' },
    { label: 'Simmer',   icon: 'schedule' },
    { label: 'Plate',    icon: 'dinner_dining' },
    { label: 'Portion',  icon: 'inventory_2' },
    { label: 'Store',    icon: 'kitchen' },
    { label: 'Chill',    icon: 'ac_unit' },
    { label: 'Clean',    icon: 'cleaning_services' },
    { label: 'Sauce',    icon: 'opacity' },
  ];
  return (
    <PreviewBase scroll>
      <H1>Cooking actions</H1>
      <Caption>Current generic icon set — flagged for replacement with step-specific glyphs.</Caption>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 14 }}>
        {actions.map((a, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: `1px solid ${T.borderSoft}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,110,80,0.04)',
            }}>
              <MIcon name={a.icon} size={24} color={T.accent}/>
            </div>
            <div style={{ fontSize: 11, color: T.textDim }}>{a.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: 14, background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 12 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.red, letterSpacing: 1, marginBottom: 4 }}>FLAGGED FOR REPLACEMENT</div>
        <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>
          Glyphs need to actually represent the step. Current icons are not distinguishable in a recipe context.
        </div>
      </div>
    </PreviewBase>
  );
}

function ButtonPreview() {
  const base = {
    padding: '14px 22px', borderRadius: 14, border: 'none',
    fontSize: 16, fontWeight: 600, fontFamily: FONTS.sans, cursor: 'pointer',
  };
  return (
    <PreviewBase>
      <H1>Button</H1>
      <Caption>Vary by emphasis, scale, and state. Icons compose as children.</Caption>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={{ ...base, background: T.accent, color: '#1a0f0a' }}>Primary</button>
          <button style={{ ...base, background: '#fff', color: '#000' }}>Secondary</button>
          <button style={{ ...base, background: 'transparent', color: T.text, border: `1px solid ${T.border}` }}>Ghost</button>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={{ ...base, background: T.red, color: '#fff' }}>Delete</button>
          <button style={{ ...base, background: '#3a3a3a', color: T.textDim }} disabled>Disabled</button>
          <button style={{ ...base, background: 'rgba(255,110,80,0.7)', color: '#1a0f0a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2px solid rgba(26,15,10,0.3)', borderTopColor: '#1a0f0a',
              animation: 'spin 1s linear infinite',
            }}/>
            Saving
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </PreviewBase>
  );
}

function ChipPreview() {
  const Chip = ({ label, tone = T.text, fill, border, glyph }) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 12px', borderRadius: 999,
      background: fill || 'transparent',
      border: `1px solid ${border || T.border}`,
      color: tone, fontSize: 13, fontWeight: 500,
    }}>
      {glyph && <span style={{ fontSize: 10 }}>{glyph}</span>}
      {label}
    </div>
  );
  return (
    <PreviewBase scroll>
      <H1>Chip</H1>
      <Caption>Flagged: "feels too SaaS". Auditing each surface for replacement with a verb or tone.</Caption>
      <SectionLabel>Currently used as</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Chip label="Focused" tone={T.accent} fill="rgba(255,110,80,0.10)" border="rgba(255,110,80,0.3)" glyph={<MIcon name="auto_awesome" size={13} color={T.accent}/>}/>
        <Chip label="Filter"/>
        <Chip label="Passive" tone={T.textDim}/>
        <Chip label="On track" tone={T.green} fill="rgba(34,197,94,0.10)" border="rgba(34,197,94,0.3)"/>
        <Chip label="Review" tone={T.amber} fill="rgba(245,158,11,0.10)" border="rgba(245,158,11,0.3)"/>
        <Chip label="Off track" tone={T.red} fill="rgba(239,68,68,0.10)" border="rgba(239,68,68,0.3)"/>
        <Chip label="Locked" tone={T.textMute}/>
      </div>
      <SectionLabel>Proposed: verb button</SectionLabel>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button style={{ background: 'transparent', border: 'none', color: T.accent, fontSize: 14, fontWeight: 600, fontFamily: FONTS.sans, padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>Filter results <MIcon name="arrow_forward" size={16}/></button>
      </div>
      <SectionLabel>Proposed: inline tone</SectionLabel>
      <div style={{ fontSize: 14, color: T.text, lineHeight: 1.5 }}>
        Plan is <Tone color={T.green}>on track</Tone>. One step in <Tone color={T.amber}>review</Tone>.
      </div>
    </PreviewBase>
  );
}

function AvatarPreview() {
  const A = ({ initials, color = '#5a3a35', size = 56, image }) => (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: image ? `url(${image}) center/cover` : color,
      border: `1.5px solid ${T.borderSoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 600, fontSize: size * 0.32,
      flexShrink: 0,
    }}>{!image && initials}</div>
  );
  return (
    <PreviewBase>
      <H1>Avatar</H1>
      <Caption>Size + tone are props. Grouping is a layout choice.</Caption>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 14 }}>
        <A initials="" image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"/>
        <A initials="DL" color="#1f1f1f"/>
        <A initials="AV" color="#4a1f1f"/>
      </div>
      <SectionLabel>Group (layout)</SectionLabel>
      <div style={{ display: 'flex', marginTop: 6 }}>
        <A initials="AL" size={44}/>
        <div style={{ marginLeft: -12 }}><A initials="JR" size={44}/></div>
        <div style={{ marginLeft: -12 }}><A initials="SM" size={44}/></div>
        <div style={{ marginLeft: -12 }}><A initials="+4" size={44} color="#2a2a2a"/></div>
      </div>
    </PreviewBase>
  );
}

function InputPreview() {
  const base = {
    width: '100%', boxSizing: 'border-box',
    padding: '14px 16px', borderRadius: 12,
    background: T.surface, border: `1px solid ${T.borderSoft}`,
    color: T.text, fontSize: 15, fontFamily: FONTS.sans, outline: 'none',
  };
  return (
    <PreviewBase scroll>
      <H1>Input</H1>
      <Caption>Composed shell, field, slot. Currently flagged for rework.</Caption>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
        <input style={base} placeholder="Plan title"/>
        <input style={{ ...base, color: T.text }} defaultValue="Hypertrophy block"/>
        <div style={{ ...base, borderColor: T.red, background: 'rgba(239,68,68,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: T.red }}>Macro target unavailable</span>
          <MIcon name="error" size={20} color={T.red}/>
        </div>
        <input style={{ ...base, color: T.textMute }} disabled placeholder="Disabled state"/>
        <div style={{ ...base, background: 'rgba(255,110,80,0.06)', borderColor: 'rgba(255,110,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.accent }}>
            <MIcon name="search" size={18} color={T.accent}/><span>Search routines</span>
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.textDim }}>CMD K</span>
        </div>
      </div>
    </PreviewBase>
  );
}

function DividerPreview() {
  return (
    <PreviewBase>
      <H1>Divider</H1>
      <Caption>Standard, inset, and split layouts come from composition.</Caption>
      <div style={{ marginTop: 20 }}>
        <SectionLabel>Standard</SectionLabel>
        <div style={{ height: 1, background: T.borderSoft, marginBottom: 22 }}/>
        <SectionLabel>Inset</SectionLabel>
        <div style={{ height: 1, background: T.borderSoft, margin: '0 0 22px 40px' }}/>
        <SectionLabel>Split</SectionLabel>
        <div style={{ display: 'flex', gap: 30, color: T.textDim, fontSize: 13 }}>
          <span>Left rail</span>
          <div style={{ flex: 1, alignSelf: 'center', height: 1, background: T.borderSoft }}/>
          <span>Right rail</span>
        </div>
      </div>
    </PreviewBase>
  );
}

Object.assign(window, {
  FeatureCardPreview, StackWindowPreview, TimelinePreview,
  TypographyPreview, IconsLinePreview, CookingIconsPreview,
  ButtonPreview, ChipPreview, AvatarPreview, InputPreview, DividerPreview,
});
