// 03 Macro Tracking — weekly funnel: targets → meals → ingredients → shopping.

import { useState, useMemo } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FSurface, FNavBar, FLabel, FMono, FNum, FIcon, FCheckbox, FTag, FBtn, FTabBar, FSection, FToolbar, FListRow, Phone } from '../../ui/components'
import { useUser } from '../../context/UserContext'
import { useNav } from '../../context/NavigationContext'
import { MOCK_TARGETS } from '../../context/mockUser'
import { computeShoppingList } from './nutrition-data'

// ── Coach explainer used inside Macro Targets ──
function ExpandablePanelWhyWeek() {
  const [open, setOpen] = useState(false);
  return (
    <FSurface style={{ marginTop: 24, borderRadius: Radius.lg, overflow: 'hidden', padding: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        data-stay="true"
        style={{
          width: '100%', background: 'transparent', border: 'none',
          padding: 16, cursor: 'pointer', color: Color.text, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: Space[3],
          fontFamily: Font.sans,
        }}>
        <div style={{ flex: 1 }}>
          <FMono color={Color.dim} size={10}>WHY THIS WEEK</FMono>
          <div style={{ ...Type.bodyLg }}>Protein anchors training days.</div>
        </div>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          border: `1px solid ${Color.borderSoft}`,
          display: 'grid', placeItems: 'center', color: Color.dim,
          transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .18s ease',
        }}>
          <FIcon path={ICONS.fwd} size={14}/>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ ...Type.bodyMd, color: Color.dim, marginBottom: 12 }}>
            Mon / Wed / Fri are heavier days. The planner front-loads protein and carbs so post-session glycogen is restored before dinner. Tue / Thu rebalance toward fats and fiber for recovery without disturbing the deficit.
          </div>
          <div style={{
            padding: 12, borderRadius: 10,
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${Color.borderSoft}`,
            display: 'flex', gap: Space[4],
          }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div><FNum size={20} weight={300} unit="g">52% protein</FNum></div>
              <FMono color={Color.dim} size={10} style={{ display: 'block' }}>TRAINING DAYS</FMono>
            </div>
            <div style={{ width: 1, background: Color.borderSoft }}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div><FNum size={20} weight={300}>−18% kcal</FNum></div>
              <FMono color={Color.dim} size={10} style={{ display: 'block' }}>REST DAYS</FMono>
            </div>
          </div>
        </div>
      )}
    </FSurface>
  );
}

export function MacroTargetsContent() {
  const { pushDetail } = useNav()
  const { targets: ctxTargets, mealPlan } = useUser()
  const t = ctxTargets || MOCK_TARGETS
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const totalMeals = mealPlan?.meals?.length || 14
  const totalBatches = mealPlan?.batches?.length || 3
  const deficit = t.tdee ? Math.abs(t.target - t.tdee) : 480
  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <FNum size={68} weight={200} unit="kcal">{t.target.toLocaleString()}</FNum>
      <FMono color={Color.mute}>DAILY · −{deficit} DEFICIT · 16 WK PLAN</FMono>

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <FSurface accent={Color.accent} style={{ padding: '12px 14px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div><FNum size={24} weight={300} unit="g">{t.protein}</FNum></div>
          <FMono color={Color.accent} size={10} style={{ display: 'block' }}>PROTEIN</FMono>
          <div style={{ height: 3, background: Color.accent, borderRadius: Radius.full, marginTop: 2 }}/>
        </FSurface>
        <FSurface style={{ padding: '12px 14px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div><FNum size={24} weight={300} unit="g">{t.carbs}</FNum></div>
          <FMono color={Color.blue} size={10} style={{ display: 'block' }}>CARBS</FMono>
          <div style={{ height: 3, background: Color.blue, borderRadius: Radius.full, marginTop: 2 }}/>
        </FSurface>
        <FSurface style={{ padding: '12px 14px', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div><FNum size={24} weight={300} unit="g">{t.fat}</FNum></div>
          <FMono color={Color.amber} size={10} style={{ display: 'block' }}>FAT</FMono>
          <div style={{ height: 3, background: Color.amber, borderRadius: Radius.full, marginTop: 2 }}/>
        </FSurface>
      </div>

      <FSection label="This week's plan" mt={40} mb={12}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <FNum size={28} weight={200}>{totalMeals} meals</FNum>
          <FMono color={Color.mute}>{totalBatches} BATCHES</FMono>
        </div>
      </FSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 24 }}>
        {days.map((d, i) => {
          const filled = i < 5;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: Space[1], alignItems: 'center' }}>
              <FMono color={Color.mute} size={10}>{d}</FMono>
              <div style={{
                width: '100%', height: 64, borderRadius: 6,
                background: filled ? `repeating-linear-gradient(135deg, rgba(0,0,0,0.20) 0 1.5px, transparent 1.5px 5px), ${Color.accent}` : 'rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 4,
                border: `1px solid ${filled ? Color.accent : Color.borderSoft}`,
              }}>
                <span style={{ fontFamily: Font.mono, fontSize: 10, color: filled ? Color.accentText : Color.mute, fontWeight: 600 }}>
                  {filled ? '2' : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <FSurface style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <FLabel mb={4}>Auto-fit deviation</FLabel>
            <div style={{ fontSize: 14, color: Color.dim, lineHeight: 1.5 }}>Plan stays within ±3% of macro targets across the week.</div>
          </div>
          <FMono color={Color.green}>±2.4%</FMono>
        </div>
      </FSurface>

      <ExpandablePanelWhyWeek/>

      <div style={{ marginTop: 32 }}>
        <FListRow title="Review meals" trailing={<FIcon path={ICONS.fwd} size={18} color={Color.accent} stroke={2} />} onClick={() => pushDetail('batch', 'Batch Strategy')} style={{ borderTop: `1px solid ${Color.border}` }} />
      </div>

      <QuickLogMeal/>

      {/* ── Meal planning actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
        <button onClick={() => pushDetail('meal-queue', 'Meals')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.meal} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>Meal queue</FMono>
        </button>
        <button onClick={() => pushDetail('shopping', 'Shopping')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.cart} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>Shopping</FMono>
        </button>
        <button onClick={() => pushDetail('food-log', 'Food Log')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.chart} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>Food log</FMono>
        </button>
        <button onClick={() => pushDetail('fridge', 'Pantry')} style={{
          padding: '10px 12px', borderRadius: Radius.md,
          background: Color.surface, border: `1px solid ${Color.borderSoft}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <FIcon path={ICONS.bowl} size={14} color={Color.dim} stroke={1.8} />
          <FMono size={10} color={Color.dim}>Pantry</FMono>
        </button>
      </div>
    </div>
  );
}

function QuickLogMeal() {
  const { logMeal } = useUser();
  const [logged, setLogged] = useState(false);
  const handleLog = () => {
    logMeal({ kcal: 550, protein: 40, carbs: 55, fat: 18, name: 'Quick entry' });
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
  };
  return (
    <div style={{ marginTop: 16 }}>
      <FBtn variant="ghost" full size="md" icon={ICONS.plus} onClick={handleLog} disabled={logged}>
        {logged ? 'Logged' : 'Quick log meal'}
      </FBtn>
    </div>
  );
}

export function MacroTargetsScreen() {
  return (
    <Phone label="Weekly targets" group="MACROS">
      <FNavBar
        title="Week 19"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={<FIcon path={ICONS.more} size={20} color={Color.text}/>}
      />
      <MacroTargetsContent />
      <FTabBar active={1}/>
    </Phone>
  );
}

export function MacroMealsContent() {
  const { pushDetail } = useNav()
  const { mealPlan } = useUser()
  const HARDCODED_MEALS = [
    { name: 'Garlic salmon · greens', kcal: 540, p: 42, c: 28, f: 22, time: '7 PM · MON', img: 'A',
      swap: { name: 'Miso cod · greens', kcal: 510, p: 40, c: 24, f: 24, img: 'A' } },
    { name: 'Chicken rice bowls', kcal: 620, p: 55, c: 64, f: 14, time: '1 PM · TUE', img: 'B', batch: true,
      swap: { name: 'Turkey rice bowls', kcal: 600, p: 58, c: 60, f: 12, img: 'B' } },
    { name: 'Tofu stir-fry', kcal: 480, p: 28, c: 52, f: 12, time: '7 PM · WED', img: 'C',
      swap: { name: 'Tempeh stir-fry', kcal: 510, p: 34, c: 48, f: 16, img: 'C' } },
    { name: 'Beef chili', kcal: 580, p: 46, c: 38, f: 18, time: '7 PM · THU', img: 'D', batch: true,
      swap: { name: 'Lentil chili', kcal: 460, p: 30, c: 62, f: 8, img: 'D' } },
  ];
  const SLOT_LABELS = { breakfast: 'AM', lunch: '12 PM', dinner: '7 PM', snack: '3 PM' }
  const IMG_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const initial = mealPlan?.meals
    ? mealPlan.meals.map((m, i) => ({
        name: m.recipe.name,
        kcal: m.macros.kcal,
        p: m.macros.protein,
        c: m.macros.carbs,
        f: m.macros.fat,
        time: `${SLOT_LABELS[m.slot] || m.slot} · ${m.day.toUpperCase()}`,
        img: IMG_LETTERS[i % 26],
        batch: m.recipe.method === 'batch' || m.recipe.method === 'slow_cook',
      }))
    : HARDCODED_MEALS;
  const [meals, setMeals] = useState(initial);
  const [swappedIdx, setSwappedIdx] = useState(null);

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
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ ...Type.bodySm, color: Color.dim, marginBottom: 16 }}>Suggested by the planner — hits macros within 2%.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: Space[3] }}>
        {meals.map((m, i) => (
          <FSurface key={i} style={{
            border: `1px solid ${swappedIdx === i ? Color.accent : Color.borderSoft}`,
            display: 'flex', gap: 14, alignItems: 'flex-start',
            transition: 'border-color .4s ease',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: Radius.md,
              background: `linear-gradient(135deg, rgba(255,110,80,0.25), rgba(255,110,80,0.08))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: Font.mono, fontSize: 14, fontWeight: 600, color: Color.accent,
            }}>{m.img}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                <div style={{ ...Type.bodyLg }}>{m.name}</div>
                {swappedIdx === i ? <FTag tone="accent">SWAPPED</FTag> : (m.batch && <FTag tone="accent">BATCH</FTag>)}
              </div>
              <FMono color={Color.mute} size={10}>{m.time}</FMono>
              <div style={{ display: 'flex', gap: 14, marginTop: 8, alignItems: 'baseline' }}>
                <FMono color={Color.text}>{m.kcal} <span style={{ color: Color.mute }}>kcal</span></FMono>
                <FMono color={Color.dim} size={10}>P {m.p}g</FMono>
                <FMono color={Color.dim} size={10}>C {m.c}g</FMono>
                <FMono color={Color.dim} size={10}>F {m.f}g</FMono>
              </div>
            </div>
          </FSurface>
        ))}
      </div>

      <FSurface style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <FLabel mb={4}>Week total</FLabel>
            <div><FNum size={24} weight={300} unit="kcal">{Math.round(total).toLocaleString()}</FNum></div>
            <FMono color={Color.mute} size={10} style={{ display: 'block', marginTop: 4 }}>{deltaVsTarget >= 0 ? '+' : ''}{deltaVsTarget} vs target</FMono>
          </div>
          <button
            onClick={swapOne}
            data-stay="true"
            style={{
              padding: '10px 14px', borderRadius: Radius.md, background: 'transparent',
              color: Color.accent, border: `1px solid ${Color.accent}66`,
              fontFamily: Font.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
              textTransform: 'uppercase', cursor: 'pointer',
            }}>Swap one</button>
        </div>
      </FSurface>

      <div style={{ marginTop: 32, display: 'flex', gap: Space[3] }}>
        <FBtn variant="secondary" full style={{ flex: 1 }} onClick={() => pushDetail('batch', 'Batch Strategy')}>Batches</FBtn>
        <FBtn variant="secondary" full style={{ flex: 1 }} onClick={() => pushDetail('shopping', 'Shopping')}>Shopping list</FBtn>
      </div>
    </div>
  );
}

export function MacroMealsScreen() {
  return (
    <Phone label="Meal queue" group="MACROS">
      <FNavBar title="14 meals · 7 days" leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>} />
      <MacroMealsContent />
      <FTabBar active={1}/>
    </Phone>
  );
}

export function ShoppingListContent() {
  const { mealPlan, pantry, updatePantry } = useUser()

  const HARDCODED_ITEMS = [
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

  const initialItems = useMemo(() => {
    if (!mealPlan) return HARDCODED_ITEMS
    const list = computeShoppingList(mealPlan, pantry || {})
    // Group into a single "All items" category (flat list matches existing render)
    const rows = list.map(item => ({
      name: item.name,
      need: `${item.need} ${item.unit}`,
      have: `${item.have} ${item.unit}`,
      short: item.delta > 0 ? (item.unit === 'whole' ? item.delta : `${item.delta} ${item.unit}`) : 0,
    }))
    return [{ c: 'Ingredients', rows }]
  }, [mealPlan, pantry])

  const [checked, setChecked] = useState({}); // name → true if bought
  const [qtyAdj, setQtyAdj] = useState({}); // name → delta (+/-)
  const toggle = (name) => {
    setChecked(s => ({ ...s, [name]: !s[name] }))
    if (mealPlan && updatePantry) {
      // Mark item as fully stocked in pantry when checked
      const flat = initialItems.flatMap(c => c.rows)
      const item = flat.find(r => r.name === name)
      if (item && !checked[name]) {
        const needVal = parseFloat(String(item.need)) || 0
        updatePantry(name.toLowerCase(), needVal)
      }
    }
  }
  const adjustQty = (name, delta) => setQtyAdj(s => ({ ...s, [name]: (s[name] || 0) + delta }));

  // Compute counts dynamically
  const allShortRows = initialItems.flatMap(c => c.rows.filter(r => r.short !== 0));
  const remaining = allShortRows.filter(r => !checked[r.name]).length;
  const owned = initialItems.flatMap(c => c.rows).length - allShortRows.length;

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div><FNum size={40} weight={300}>{remaining}</FNum></div>
          <FMono color={Color.dim} size={10} style={{ display: 'block', marginTop: 4 }}>ITEMS TO BUY</FMono>
        </div>
        <FMono color={Color.green} size={10}>{owned} ALREADY HOME</FMono>
      </div>

      {initialItems.map((cat, i) => (
        <div key={i} style={{ marginTop: 24 }}>
          <FLabel mb={8}>{cat.c}</FLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cat.rows.map((r, j) => {
              const homeAlready = r.short === 0;
              const bought = !!checked[r.name];
              const dim = homeAlready || bought;
              const isNumeric = typeof r.short === 'number' && r.short > 0;
              const displayQty = isNumeric ? Math.max(0, r.short + (qtyAdj[r.name] || 0)) : r.short;
              return (
                <FListRow key={j}
                  leading={<FCheckbox checked={dim} size={24} />}
                  title={<span style={{ ...Type.bodyLg, textDecoration: dim ? 'line-through' : 'none', color: dim ? Color.mute : Color.text }}>{r.name}</span>}
                  trailing={!dim ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isNumeric && (
                        <button onClick={(e) => { e.stopPropagation(); adjustQty(r.name, -1); }} style={{
                          width: 24, height: 24, borderRadius: '50%', background: Color.surface,
                          border: `1px solid ${Color.border}`, color: Color.dim, fontSize: 14,
                          display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
                          fontFamily: Font.mono, lineHeight: 1,
                        }}>−</button>
                      )}
                      <span style={{
                        background: dim ? Color.green + '20' : Color.accent + '20',
                        color: dim ? Color.green : Color.accent,
                        borderRadius: Radius.full, padding: '2px 8px',
                        fontFamily: Font.mono, fontSize: 10, fontWeight: 600,
                      }}>{typeof displayQty === 'number' ? `×${displayQty}` : displayQty}</span>
                      {isNumeric && (
                        <button onClick={(e) => { e.stopPropagation(); adjustQty(r.name, 1); }} style={{
                          width: 24, height: 24, borderRadius: '50%', background: Color.surface,
                          border: `1px solid ${Color.border}`, color: Color.dim, fontSize: 14,
                          display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
                          fontFamily: Font.mono, lineHeight: 1,
                        }}>+</button>
                      )}
                    </div>
                  ) : undefined}
                  onClick={homeAlready ? undefined : () => toggle(r.name)}
                  compact
                />
              );
            })}
          </div>
        </div>
      ))}

      <FSurface style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <FLabel mb={0}>Estimated total</FLabel>
          <FNum size={20} weight={300} unit="USD">{42 - (allShortRows.length - remaining) * 4}</FNum>
        </div>
      </FSurface>

      <div style={{ marginTop: 14, marginBottom: 24 }}>
        <FToolbar cells={[
          { icon: ICONS.swap,  label: 'Export' },
          { icon: ICONS.cart,  label: 'Send to Instacart', primary: true },
          { icon: ICONS.more,  label: 'More', stay: true },
        ]}/>
      </div>
    </div>
  );
}

export function ShoppingListScreen() {
  return (
    <Phone label="Shopping" group="MACROS">
      <FNavBar title="Shopping list" leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>} />
      <ShoppingListContent />
      <FTabBar active={1}/>
    </Phone>
  );
}
