// 04 Fridge Tracker — simple list, delta-focused.

import { useState } from 'react'
import { Color, Font, Space, Radius, Type } from '../../ui/tokens'
import { ICONS, FButtonGroup, FNavBar, FLabel, FMono, FNum, FIcon, FCheckbox, FToolbar, FTabBar, FListRow, Phone } from '../../ui/components'

export function FridgeContent() {
  const cats = [
    { name: 'Produce', items: [
      { n: 'Cucumber',     have: 2,    unit: '',      need: 4,    use: 'Salmon bowls · Wed' },
      { n: 'Baby spinach', have: 0,    unit: 'g',     need: 500,  use: 'Tofu stir-fry · Thu' },
      { n: 'Roma tomato',  have: 8,    unit: '',      need: 8,    use: 'Chili · Fri' },
      { n: 'Garlic',       have: 1,    unit: 'head',  need: 2,    use: '3 recipes' },
      { n: 'Lemons',       have: 3,    unit: '',      need: 1,    use: 'Salmon bowls' },
    ]},
    { name: 'Protein', items: [
      { n: 'Salmon fillet',   have: 0, unit: '',    need: 4 },
      { n: 'Chicken breast',  have: 0, unit: 'kg',  need: 1.6 },
      { n: 'Firm tofu',       have: 1, unit: 'block', need: 2 },
      { n: 'Greek yogurt',    have: 800, unit: 'g', need: 400 },
    ]},
    { name: 'Pantry', items: [
      { n: 'Jasmine rice',  have: 500, unit: 'g',  need: 600 },
      { n: 'Olive oil',     have: 1,   unit: 'L',  need: 0.12 },
      { n: 'Soy sauce',     have: 350, unit: 'ml', need: 60 },
      { n: 'Cumin',         have: 1,   unit: 'jar', need: 0,  expiring: true },
    ]},
  ];

  const [filter, setFilter] = useState('MISSING');
  const [bought, setBought] = useState({});
  const toggle = (n) => setBought(s => ({ ...s, [n]: !s[n] }));

  const isShort = (it) => (it.need - it.have) > 0;
  const passes = (it) => {
    if (filter === 'ALL') return true;
    if (filter === 'MISSING') return isShort(it);
    if (filter === 'EXPIRING') return !!it.expiring;
    return true;
  };

  const allItems = cats.flatMap(c => c.items);
  const totalSkus = allItems.length;
  const missing = allItems.filter(isShort).filter(it => !bought[it.n]).length;

  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
      <FLabel>What's home</FLabel>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <FNum size={64} weight={200}>{totalSkus}</FNum>
        <div>
          <FMono color={Color.dim}>SKUS · 6 USED THIS WEEK</FMono>
          <div style={{ marginTop: 6 }}>
            <FMono color={Color.accent}>{missing} MISSING FOR PLAN</FMono>
          </div>
        </div>
      </div>

      <FButtonGroup
        options={[
          { value: 'ALL', label: 'ALL' },
          { value: 'MISSING', label: 'MISSING' },
          { value: 'EXPIRING', label: 'EXPIRING' },
        ]}
        value={filter}
        onChange={setFilter}
        style={{ marginTop: 32 }}
      />

      {cats.map((cat, i) => {
        const visible = cat.items.filter(passes);
        if (!visible.length) return null;
        return (
          <div key={i} style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <FLabel mb={0}>{cat.name}</FLabel>
              <FMono color={Color.mute}>{visible.length} items</FMono>
            </div>
            {visible.map((it, j) => {
              const short = isShort(it);
              const checked = !!bought[it.n];
              const tap = short ? () => toggle(it.n) : undefined;
              return (
                <FListRow key={j}
                  leading={short ? <FCheckbox checked={checked} size={18} /> : undefined}
                  title={<span style={{ ...Type.bodyLg, textDecoration: checked ? 'line-through' : 'none', color: checked ? Color.mute : Color.text }}>{it.n}</span>}
                  subtitle={it.expiring ? <FMono color={Color.red} size={10}>EXPIRES IN 3 DAYS</FMono> : it.use ? `FOR · ${it.use}` : undefined}
                  trailing={
                    <div style={{ textAlign: 'right' }}>
                      <FMono color={short ? Color.accent : Color.text}>
                        {it.have}{it.unit ? ' ' + it.unit : ''}
                      </FMono>
                      <div style={{ marginTop: 2 }}>
                        <FMono color={Color.mute} size={9}>/ {it.need}{it.unit ? ' ' + it.unit : ''}</FMono>
                      </div>
                    </div>
                  }
                  onClick={tap}
                  compact
                />
              );
            })}
          </div>
        );
      })}

      <div style={{ marginTop: 32, marginBottom: 24 }}>
        <FToolbar cells={[
          { icon: ICONS.search, label: 'Scan' },
          { icon: ICONS.cart,   label: 'Buy missing · ' + missing, primary: true },
          { icon: ICONS.filter, label: 'Filter', stay: true },
        ]}/>
      </div>
    </div>
  );
}

export function FridgeScreen() {
  return (
    <Phone label="Pantry · delta" group="FRIDGE">
      <FNavBar
        title="Pantry"
        leading={<FIcon path={ICONS.back} size={20} color={Color.text}/>}
        trailing={
          <div style={{ display: 'flex', gap: 14 }}>
            <FIcon path={ICONS.search} size={20} color={Color.text}/>
            <FIcon path={ICONS.plus} size={20} color={Color.text}/>
          </div>
        }
      />
      <FridgeContent />
      <FTabBar active={1}/>
    </Phone>
  );
}
