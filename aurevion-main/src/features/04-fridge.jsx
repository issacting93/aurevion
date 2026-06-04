// 04 Fridge Tracker — simple list, delta-focused.

function FridgeScreen() {
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

  const [filter, setFilter] = React.useState('MISSING');
  const [bought, setBought] = React.useState({});
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
    <Phone label="Fridge · delta" group="FRIDGE">
      <FNavBar
        title="Pantry"
        leading={<FIcon path={ICONS.back} size={20} color={F.text}/>}
        trailing={
          <div style={{ display: 'flex', gap: 14 }}>
            <FIcon path={ICONS.search} size={20} color={F.text}/>
            <FIcon path={ICONS.plus} size={20} color={F.text}/>
          </div>
        }
      />
      <div style={{ flex: 1, padding: '20px 24px 40px', overflowY: 'auto' }}>
        <FLabel>What's home</FLabel>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <FNum size={64} weight={200}>{totalSkus}</FNum>
          <div>
            <FMono color={F.dim}>SKUS · 6 USED THIS WEEK</FMono>
            <div style={{ marginTop: 6 }}>
              <FMono color={F.accent}>{missing} MISSING FOR PLAN</FMono>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 6 }}>
          {['ALL', 'MISSING', 'EXPIRING'].map(l => {
            const on = filter === l;
            return (
              <button key={l} onClick={() => setFilter(l)} style={{
                padding: '8px 14px', borderRadius: 6,
                background: on ? F.accent : 'transparent',
                color: on ? '#1a0f0a' : F.dim,
                border: `1px solid ${on ? F.accent : F.borderSoft}`,
                fontFamily: FF.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
                cursor: 'pointer',
              }}>{l}</button>
            );
          })}
        </div>

        {cats.map((cat, i) => {
          const visible = cat.items.filter(passes);
          if (!visible.length) return null;
          return (
            <div key={i} style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <FLabel mb={0}>{cat.name}</FLabel>
                <FMono color={F.mute}>{visible.length} items</FMono>
              </div>
              {visible.map((it, j) => {
                const short = isShort(it);
                const checked = !!bought[it.n];
                const tap = short ? () => toggle(it.n) : undefined;
                return (
                  <div key={j} onClick={tap} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '18px 0', borderTop: `1px solid ${F.borderSoft}`,
                    cursor: short ? 'pointer' : 'default',
                    opacity: checked ? 0.4 : 1,
                  }}>
                    {short && (
                      <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `1.4px solid ${checked ? F.green : F.borderSoft}`,
                        background: checked ? F.green : 'transparent',
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>{checked && <FIcon path={ICONS.check} size={11} stroke={3} color="#0d0d0d"/>}</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 400, textDecoration: checked ? 'line-through' : 'none' }}>{it.n}</div>
                      {it.use && (
                        <FMono color={F.mute} size={10}>FOR · {it.use}</FMono>
                      )}
                      {it.expiring && (
                        <FMono color={F.red} size={10}>EXPIRES IN 3 DAYS</FMono>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <FMono color={short ? F.accent : F.text}>
                        {it.have}{it.unit ? ' ' + it.unit : ''}
                      </FMono>
                      <div style={{ marginTop: 2 }}>
                        <FMono color={F.mute} size={9}>/ {it.need}{it.unit ? ' ' + it.unit : ''}</FMono>
                      </div>
                    </div>
                  </div>
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
    </Phone>
  );
}

Object.assign(window, { FridgeScreen });
