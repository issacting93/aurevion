// 03 Macro Tracking — weekly funnel: targets → meals → ingredients → shopping.

function MacroTargetsScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <Phone label="Weekly targets" group="MACROS">
      <FNavBar
        title="Week 19"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <FLabel>Targets for this week</FLabel>
        <div style={{ marginTop: 4 }}>
          <FNum size={68} weight={200} unit="kcal">1,660</FNum>
        </div>
        <FMono color={F.mute}>DAILY · −480 DEFICIT · 16 WK PLAN</FMono>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: F.surface, border: `1px solid ${F.accent}55` }}>
            <FLabel mb={4} color={F.accent}>Protein</FLabel>
            <FNum size={24} weight={300} unit="g">147</FNum>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 3, background: F.accent, borderRadius: 999 }}/>
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
            <FLabel mb={4}>Carbs</FLabel>
            <FNum size={24} weight={300} unit="g">160</FNum>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 999 }}/>
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
            <FLabel mb={4}>Fat</FLabel>
            <FNum size={24} weight={300} unit="g">60</FNum>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 999 }}/>
            </div>
          </div>
        </div>

        <FSection label="This week's plan" mt={40} mb={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <FNum size={28} weight={200}>14 meals</FNum>
            <FMono color={F.mute}>3 BATCHES</FMono>
          </div>
        </FSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 24 }}>
          {days.map((d, i) => {
            const filled = i < 5;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <FMono color={F.mute} size={9}>{d}</FMono>
                <div style={{
                  width: '100%', height: 64, borderRadius: 6,
                  background: filled ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${F.accent}` : 'rgba(255,255,255,0.05)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 4,
                  border: `1px solid ${filled ? F.accent : F.borderSoft}`,
                }}>
                  <span style={{ fontFamily: FF.mono, fontSize: 9, color: filled ? '#1a0f0a' : F.mute, fontWeight: 600 }}>
                    {filled ? '2' : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 40, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel mb={4}>Auto-fit deviation</FLabel>
              <div style={{ fontSize: 14, color: F.dim, lineHeight: 1.5 }}>Plan stays within ±3% of macro targets across the week.</div>
            </div>
            <FMono color={F.green}>±2.4%</FMono>
          </div>
        </div>

        <ExpandablePanelWhyWeek/>

        <div style={{ marginTop: 32 }}>
          <FBtn variant="editorial">Review meals</FBtn>
        </div>
      </div>
      <FTabBar active={1}/>
    </Phone>
  );
}

function MacroMealsScreen() {
  const initial = [
    { name: 'Garlic salmon · greens', kcal: 540, p: 42, c: 28, f: 22, time: '7 PM · MON', img: 'A',
      swap: { name: 'Miso cod · greens', kcal: 510, p: 40, c: 24, f: 24, img: 'A' } },
    { name: 'Chicken rice bowls', kcal: 620, p: 55, c: 64, f: 14, time: '1 PM · TUE', img: 'B', batch: true,
      swap: { name: 'Turkey rice bowls', kcal: 600, p: 58, c: 60, f: 12, img: 'B' } },
    { name: 'Tofu stir-fry', kcal: 480, p: 28, c: 52, f: 12, time: '7 PM · WED', img: 'C',
      swap: { name: 'Tempeh stir-fry', kcal: 510, p: 34, c: 48, f: 16, img: 'C' } },
    { name: 'Beef chili', kcal: 580, p: 46, c: 38, f: 18, time: '7 PM · THU', img: 'D', batch: true,
      swap: { name: 'Lentil chili', kcal: 460, p: 30, c: 62, f: 8, img: 'D' } },
  ];
  const [meals, setMeals] = React.useState(initial);
  const [swappedIdx, setSwappedIdx] = React.useState(null);

  const swapOne = () => {
    // pick first un-swapped meal and swap it
    const idx = meals.findIndex((m, i) => m.swap && initial[i].name === m.name);
    if (idx === -1) return;
    const next = meals.slice();
    next[idx] = { ...meals[idx].swap, time: meals[idx].time, batch: meals[idx].batch };
    setMeals(next);
    setSwappedIdx(idx);
    setTimeout(() => setSwappedIdx(null), 1400);
  };

  const total = meals.reduce((s, m) => s + m.kcal, 0) * (14 / meals.length / 1);
  const deltaVsTarget = Math.round(total - 11760);
  return (
    <Phone label="Meal queue" group="MACROS">
      <FNavBar
        title="14 meals · 7 days"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.swap} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <FLabel>Suggested by the planner</FLabel>
        <div style={{ marginTop: 4 }}>
          <FNum size={32} weight={200}>Hits macros within 2%.</FNum>
        </div>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {meals.map((m, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 12, background: F.surface,
              border: `1px solid ${swappedIdx === i ? F.accent : F.borderSoft}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
              transition: 'border-color .4s ease',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                background: `linear-gradient(135deg, rgba(255,110,80,0.25), rgba(255,110,80,0.08))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FF.mono, fontSize: 14, fontWeight: 600, color: F.accent,
              }}>{m.img}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: 400 }}>{m.name}</div>
                  {swappedIdx === i ? <FTag tone="accent">SWAPPED</FTag> : (m.batch && <FTag tone="accent">BATCH</FTag>)}
                </div>
                <FMono color={F.mute} size={10}>{m.time}</FMono>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, alignItems: 'baseline' }}>
                  <FMono color={F.text}>{m.kcal} <span style={{ color: F.mute }}>kcal</span></FMono>
                  <FMono color={F.dim} size={10}>P {m.p}g</FMono>
                  <FMono color={F.dim} size={10}>C {m.c}g</FMono>
                  <FMono color={F.dim} size={10}>F {m.f}g</FMono>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <FLabel mb={4}>Week total</FLabel>
              <FNum size={24} weight={300} unit="kcal">{Math.round(total).toLocaleString()}</FNum>
              <FMono color={F.mute} size={10}>{deltaVsTarget >= 0 ? '+' : ''}{deltaVsTarget} vs target</FMono>
            </div>
            <button
              onClick={swapOne}
              data-stay="true"
              style={{
                padding: '10px 14px', borderRadius: 8, background: 'transparent',
                color: F.accent, border: `1px solid ${F.accent}66`,
                fontFamily: FF.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Swap one</button>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <FBtn variant="secondary" full style={{ flex: 1 }} onClick={() => {}}>Optimize into Batches</FBtn>
          <FBtn variant="editorial" full style={{ flex: 1.2 }}>Build shopping list</FBtn>
        </div>
      </div>
      <FTabBar active={1}/>
    </Phone>
  );
}

function ShoppingListScreen() {
  const initialItems = [
    { c: 'Produce', rows: [
      { name: 'Cucumber', need: '4', have: '2', short: 2 },
      { name: 'Baby spinach', need: '500 g', have: '0', short: '500 g' },
      { name: 'Roma tomato', need: '8', have: '8', short: 0 },
      { name: 'Garlic', need: '2 heads', have: '1 head', short: '1 head' },
    ]},
    { c: 'Protein', rows: [
      { name: 'Salmon fillet', need: '4', have: '0', short: 4 },
      { name: 'Chicken breast', need: '1.6 kg', have: '0', short: '1.6 kg' },
      { name: 'Firm tofu', need: '2 blocks', have: '1 block', short: '1 block' },
    ]},
    { c: 'Pantry', rows: [
      { name: 'Jasmine rice', need: '600 g', have: '500 g', short: '100 g' },
      { name: 'Olive oil', need: '120 ml', have: '∞', short: 0 },
    ]},
  ];
  const [checked, setChecked] = React.useState({}); // name → true if bought
  const toggle = (name) => setChecked(s => ({ ...s, [name]: !s[name] }));

  // Compute counts dynamically
  const allShortRows = initialItems.flatMap(c => c.rows.filter(r => r.short !== 0));
  const remaining = allShortRows.filter(r => !checked[r.name]).length;
  const owned = initialItems.flatMap(c => c.rows).length - allShortRows.length;

  return (
    <Phone label="Shopping · delta" group="MACROS">
      <FNavBar
        title="Shopping list"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={<FIcon path={ICONS.filter} size={20} color={F.text}/>}
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <FLabel>To buy</FLabel>
            <FNum size={64} weight={200}>{remaining} <span style={{ fontSize: 18, color: F.mute, fontFamily: FF.mono }}>items</span></FNum>
          </div>
          <FMono color={F.green}>−{owned} ALREADY HOME</FMono>
        </div>

        {initialItems.map((cat, i) => (
          <div key={i} style={{ marginTop: 32 }}>
            <FLabel mb={8}>{cat.c}</FLabel>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cat.rows.map((r, j) => {
                const homeAlready = r.short === 0;
                const bought = !!checked[r.name];
                const dim = homeAlready || bought;
                return (
                  <div key={j} onClick={() => !homeAlready && toggle(r.name)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '18px 0', borderTop: `1px solid ${F.borderSoft}`,
                    opacity: dim ? 0.4 : 1,
                    cursor: homeAlready ? 'default' : 'pointer',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      border: `1.4px solid ${dim ? F.green : F.borderSoft}`,
                      background: dim ? F.green : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'background .12s, border-color .12s',
                    }}>{dim && <FIcon path={ICONS.check} size={12} stroke={3} color="#0d0d0d"/>}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 400, textDecoration: dim ? 'line-through' : 'none' }}>{r.name}</div>
                      {!dim && (
                        <FMono color={F.mute} size={10}>NEED {r.need} · HAVE {r.have}</FMono>
                      )}
                    </div>
                    {!dim && (
                      <FMono color={F.accent}>+{r.short}</FMono>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FLabel mb={0}>Estimated total</FLabel>
            <FNum size={20} weight={300} unit="USD">{42 - (allShortRows.length - remaining) * 4}</FNum>
          </div>
        </div>

        <div style={{ marginTop: 14, marginBottom: 24 }}>
          <FToolbar cells={[
            { icon: ICONS.swap,  label: 'Export' },
            { icon: ICONS.cart,  label: 'Send to Instacart', primary: true },
            { icon: ICONS.more,  label: 'More', stay: true },
          ]}/>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { MacroTargetsScreen, MacroMealsScreen, ShoppingListScreen });

// ── Coach explainer used inside Macro Targets ──
function ExpandablePanelWhyWeek() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginTop: 24, borderRadius: 12, background: F.surface, border: `1px solid ${F.borderSoft}`, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        data-stay="true"
        style={{
          width: '100%', background: 'transparent', border: 'none',
          padding: 16, cursor: 'pointer', color: F.text, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: FF.sans,
        }}>
        <div style={{ flex: 1 }}>
          <FLabel mb={4}>Why this week</FLabel>
          <div style={{ fontSize: 15, fontWeight: 400 }}>Protein anchors training days.</div>
        </div>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          border: `1px solid ${F.borderSoft}`,
          display: 'grid', placeItems: 'center', color: F.dim,
          transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .18s ease',
        }}>
          <FIcon path={ICONS.fwd} size={14}/>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: 13, color: F.dim, lineHeight: 1.55, marginBottom: 12 }}>
            Mon / Wed / Fri are heavier days. The planner front-loads protein and carbs so post-session glycogen is restored before dinner. Tue / Thu rebalance toward fats and fiber for recovery without disturbing the deficit.
          </div>
          <div style={{
            padding: 12, borderRadius: 10,
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${F.borderSoft}`,
            display: 'flex', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <FLabel mb={2}>Training days</FLabel>
              <FNum size={20} weight={300} unit="g">52% protein</FNum>
            </div>
            <div style={{ width: 1, background: F.borderSoft }}/>
            <div style={{ flex: 1 }}>
              <FLabel mb={2}>Rest days</FLabel>
              <FNum size={20} weight={300}>−18% kcal</FNum>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
