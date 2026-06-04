// ─────────────────────────────────────────────────────────────────────────────
// Aurevion · Interactive App Shell
// ─────────────────────────────────────────────────────────────────────────────
// Working navigation prototype with:
//   - 5-tab bottom nav (Home, Train, Eat, Plan, You)
//   - Cross-fade transitions between tabs
//   - Bottom sheet / modal system for actions
//   - Detail push navigation (back button)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tab definitions ─────────────────────────────────────
const APP_TABS = [
  { id: 'home',  label: 'Home',  icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10' },
  { id: 'train', label: 'Train', icon: ICONS.dumb },
  { id: 'eat',   label: 'Eat',   icon: ICONS.bowl },
  { id: 'plan',  label: 'Plan',  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'you',   label: 'You',   icon: ICONS.chart },
];

// ─── App Shell ───────────────────────────────────────────
function AppShell() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [prevTab, setPrevTab] = React.useState(null);
  const [transitioning, setTransitioning] = React.useState(false);
  const [sheet, setSheet] = React.useState(null); // { id, title, content }
  const [detailStack, setDetailStack] = React.useState([]); // pushed detail views

  const switchTab = React.useCallback((tabId) => {
    if (tabId === activeTab || transitioning) return;
    setPrevTab(activeTab);
    setTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setDetailStack([]);
      setTimeout(() => setTransitioning(false), 20);
    }, 150);
  }, [activeTab, transitioning]);

  const pushDetail = React.useCallback((view) => {
    setDetailStack(prev => [...prev, view]);
  }, []);

  const popDetail = React.useCallback(() => {
    setDetailStack(prev => prev.slice(0, -1));
  }, []);

  const openSheet = React.useCallback((config) => {
    setSheet(config);
  }, []);

  const closeSheet = React.useCallback(() => {
    setSheet(null);
  }, []);

  // Context passed to all screens
  const nav = { switchTab, pushDetail, popDetail, openSheet, closeSheet, activeTab };

  // Current view
  const currentDetail = detailStack[detailStack.length - 1];
  const showingDetail = detailStack.length > 0;

  return (
    <Phone>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Main content area */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Tab screens */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: transitioning ? 0 : (showingDetail ? 0 : 1),
            transform: showingDetail ? 'translateX(-20px)' : 'translateX(0)',
            transition: 'opacity 0.2s ease, transform 0.25s ease',
            overflow: 'auto',
            pointerEvents: showingDetail ? 'none' : 'auto',
          }}>
            <AppTabContent tab={activeTab} nav={nav} />
          </div>

          {/* Detail view overlay */}
          {showingDetail && (
            <div style={{
              position: 'absolute', inset: 0,
              background: F.bg,
              animation: 'appDetailIn 0.25s ease both',
              overflow: 'auto',
            }}>
              <DetailHeader title={currentDetail.title} onBack={popDetail} />
              {currentDetail.content}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <AppTabBar active={activeTab} onSwitch={switchTab} hidden={showingDetail} />
      </div>

      {/* Sheet overlay */}
      {sheet && <AppSheet config={sheet} onClose={closeSheet} />}

      <style>{`
        @keyframes appDetailIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes appSheetIn {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes appBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </Phone>
  );
}

// ─── Tab Bar (interactive) ───────────────────────────────
function AppTabBar({ active, onSwitch, hidden }) {
  return (
    <div style={{
      padding: '8px 16px 26px', flexShrink: 0,
      transform: hidden ? 'translateY(100%)' : 'translateY(0)',
      transition: 'transform 0.25s ease',
    }}>
      <div style={{
        height: 56, borderRadius: 999,
        background: 'rgba(20,20,20,0.92)', backdropFilter: 'blur(16px)',
        border: `1px solid ${F.borderSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 8px',
      }}>
        {APP_TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onSwitch(tab.id)}
              data-stay="true"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '6px 12px', borderRadius: 12,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: isActive ? F.accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? '#1a0f0a' : F.mute,
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'scale(1)' : 'scale(0.9)',
              }}>
                <FIcon path={tab.icon} size={18} stroke={isActive ? 2.2 : 1.6} />
              </div>
              <span style={{
                fontFamily: FF.mono, fontSize: 9, letterSpacing: 0.8,
                textTransform: 'uppercase',
                color: isActive ? F.text : F.mute,
                transition: 'color 0.15s ease',
              }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail Header ───────────────────────────────────────
function DetailHeader({ title, onBack }) {
  return (
    <div style={{
      padding: '12px 16px 12px 12px', display: 'flex',
      alignItems: 'center', gap: Space[2], flexShrink: 0,
    }}>
      <button
        onClick={onBack}
        data-stay="true"
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', border: 'none',
          color: F.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <FIcon path={ICONS.back} size={18} stroke={2} />
      </button>
      <span style={{
        fontFamily: FF.mono, fontSize: 11, letterSpacing: 1.2,
        color: F.mute, textTransform: 'uppercase',
      }}>{title}</span>
    </div>
  );
}

// ─── Bottom Sheet ────────────────────────────────────────
function AppSheet({ config, onClose }) {
  const { title, content, height = '60%' } = config;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'auto' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          animation: 'appBackdropIn 0.2s ease both',
        }}
      />
      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: height,
        background: F.surface,
        borderRadius: '20px 20px 0 0',
        border: `1px solid ${F.border}`,
        borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        animation: 'appSheetIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '12px 20px 0',
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.2)', marginBottom: 14,
          }} />
          <div style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: Space[4],
          }}>
            <FLabel size={11} mb={0} letter={1.2}>{title}</FLabel>
            <button
              onClick={onClose}
              data-stay="true"
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: 'none',
                color: F.dim, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FIcon path={ICONS.close} size={14} stroke={2} />
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
          {content}
        </div>
      </div>
    </div>
  );
}

// ─── Tab Content Router ──────────────────────────────────
function AppTabContent({ tab, nav }) {
  switch (tab) {
    case 'home':  return <HomeTab nav={nav} />;
    case 'train': return <TrainTab nav={nav} />;
    case 'eat':   return <EatTab nav={nav} />;
    case 'plan':  return <PlanTab nav={nav} />;
    case 'you':   return <YouTab nav={nav} />;
    default:      return null;
  }
}

// ─── Sample data (mirrors dashboard data) ───────────────
const APP_DATA = {
  goal: { current: 20.1, target: 15.0, unit: '% BF', weeks: 16, elapsed: 6 },
  macros: { kcal: 1660, protein: 147, carbs: 160, fat: 60, deficit: '\u2212480' },
  session: {
    name: 'Pull \u00b7 Upper B', time: '48 min planned', day: 'FRI', exerciseCount: 6,
    exercises: [
      { name: 'Warm-up walk', sets: '5 min' }, { name: 'Pull-up', sets: '4 \u00d7 8' },
      { name: 'Barbell row', sets: '4 \u00d7 6' }, { name: 'Face pull', sets: '3 \u00d7 12' },
      { name: 'Bicep curl', sets: '3 \u00d7 10' }, { name: 'Cooldown stretch', sets: '5 min' },
    ],
  },
  prep: {
    recipes: [
      { name: 'Salmon + greens', color: '#FF6E50', portions: 4, time: '25m' },
      { name: 'Rice bowls', color: '#5eaaff', portions: 6, time: '35m' },
      { name: 'Chili', color: '#a78bfa', portions: 8, time: '55m' },
    ],
    totalTime: '~78 min', readyPct: 85,
  },
  checkin: {
    latest: { weight: 82.1, bf: 20.1, date: '12 May' }, trend: 'down', streak: 14,
    history: [
      { date: '12 May', weight: 82.1, bf: 20.1, delta: -0.4 },
      { date: '05 May', weight: 82.5, bf: 20.4, delta: -0.3 },
      { date: '28 Apr', weight: 82.8, bf: 20.6, delta: -0.5 },
    ],
  },
  streak: { count: 14, best: 21 },
};

// ─── HOME TAB ────────────────────────────────────────────
function HomeTab({ nav }) {
  const hour = 14;
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '16px 0 20px' }}>
      {/* Header */}
      <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: F.dim, marginBottom: 2 }}>{greeting}</div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3 }}>Dashboard</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6E50, #c93b1d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#1a0f0a',
        }}>Z</div>
      </div>

      {/* Next action card */}
      <div style={{ padding: '0 20px', marginBottom: Space[4] }}>
        <div
          onClick={() => nav.switchTab('train')}
          style={{
            background: 'linear-gradient(135deg, rgba(255,110,80,0.12), rgba(255,110,80,0.04))',
            border: '1px solid rgba(255,110,80,0.2)',
            borderRadius: 14, padding: Space[4],
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: F.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FIcon path={ICONS.dumb} size={20} color="#1a0f0a" stroke={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <FLabel size={9} mb={2} color={F.accent}>NEXT UP</FLabel>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Pull · Upper B</div>
            <div style={{ fontSize: 12, color: F.dim, marginTop: 2 }}>6 exercises · ~48 min</div>
          </div>
          <FIcon path={ICONS.fwd} size={16} color={F.mute} stroke={1.8} />
        </div>
      </div>

      {/* Quick tiles grid */}
      <FTileGrid>
        <GoalTile density="mid" span={2} {...APP_DATA.goal} />
        <MacroTile density="mid" span={2} {...APP_DATA.macros} />
        <SessionTile density="mid" span={1} {...APP_DATA.session} />
        <PrepTile density="mid" span={1} {...APP_DATA.prep} />
        <CheckInTile density="compact" span={1} {...APP_DATA.checkin} />
        <StreakTile density="compact" span={1} {...APP_DATA.streak} />
      </FTileGrid>
    </div>
  );
}

// ─── TRAIN TAB ───────────────────────────────────────────
function TrainTab({ nav }) {
  const workouts = [
    { name: 'Pull · Upper B', day: 'Today', exercises: 6, time: '48 min', ready: true },
    { name: 'Legs · Quad Focus', day: 'Tomorrow', exercises: 7, time: '55 min', ready: false },
    { name: 'Push · Chest/Tris', day: 'Saturday', exercises: 6, time: '45 min', ready: false },
  ];

  const muscleGroups = [
    { name: 'Chest', status: 'recovered', volume: '12 sets' },
    { name: 'Back', status: 'moderate', volume: '16 sets' },
    { name: 'Shoulders', status: 'recovered', volume: '9 sets' },
    { name: 'Quads', status: 'fatigued', volume: '14 sets' },
    { name: 'Hamstrings', status: 'recovered', volume: '8 sets' },
    { name: 'Arms', status: 'moderate', volume: '10 sets' },
  ];

  const startWorkout = () => {
    nav.pushDetail({
      title: 'Workout Mode',
      content: <WorkoutModeDetail nav={nav} />,
    });
  };

  return (
    <div style={{ padding: '16px 0 20px' }}>
      <div style={{ padding: '0 20px 20px' }}>
        <FNavBar
          title="TRAINING"
          trailing={<FIconBtn icon={ICONS.search} size={32} />}
        />
      </div>

      {/* Active/next session */}
      <div style={{ padding: '0 20px', marginBottom: Space[5] }}>
        <FSection label="This week's sessions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: Space[2] }}>
            {workouts.map((w, i) => (
              <div
                key={i}
                onClick={i === 0 ? startWorkout : undefined}
                style={{
                  background: i === 0 ? 'rgba(255,110,80,0.06)' : F.surface,
                  border: `1px solid ${i === 0 ? 'rgba(255,110,80,0.2)' : F.borderSoft}`,
                  borderRadius: 12, padding: 14,
                  display: 'flex', alignItems: 'center', gap: Space[3],
                  cursor: i === 0 ? 'pointer' : 'default',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: i === 0 ? F.accent : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i === 0 ?
                    <FIcon path={ICONS.play} size={16} color="#1a0f0a" stroke={2.4} /> :
                    <FIcon path={ICONS.dumb} size={16} color={F.mute} stroke={1.8} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: F.dim, marginTop: 2 }}>
                    {w.exercises} exercises · {w.time}
                  </div>
                </div>
                <FTag tone={i === 0 ? 'accent' : 'mute'} size="sm">{w.day}</FTag>
              </div>
            ))}
          </div>
        </FSection>
      </div>

      {/* Muscle recovery */}
      <div style={{ padding: '0 20px', marginBottom: Space[5] }}>
        <FSection label="Recovery status" action={<FMono size={10} color={F.accent}>View all</FMono>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {muscleGroups.map((m, i) => {
              const color = m.status === 'recovered' ? F.green :
                           m.status === 'fatigued' ? F.red : '#facc15';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderBottom: i < muscleGroups.length - 1 ? `1px solid ${F.borderSoft}` : 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: color,
                    boxShadow: `0 0 6px ${color}66`,
                  }} />
                  <span style={{ flex: 1, fontSize: 13 }}>{m.name}</span>
                  <FMono size={10} color={F.dim}>{m.volume}</FMono>
                  <FTag tone={m.status === 'recovered' ? 'green' : m.status === 'fatigued' ? 'red' : 'neutral'} size="sm">
                    {m.status}
                  </FTag>
                </div>
              );
            })}
          </div>
        </FSection>
      </div>

      {/* Exercise library entry */}
      <div style={{ padding: '0 20px' }}>
        <FBtn
          variant="ghost" full
          iconLeading={ICONS.search}
          onClick={() => nav.pushDetail({
            title: 'Exercise Library',
            content: <ExerciseLibraryDetail nav={nav} />,
          })}
        >
          Browse Exercise Library
        </FBtn>
      </div>
    </div>
  );
}

// ─── WORKOUT MODE (Detail) ───────────────────────────────
function WorkoutModeDetail({ nav }) {
  const [currentEx, setCurrentEx] = React.useState(0);
  const [currentSet, setCurrentSet] = React.useState(1);
  const [resting, setResting] = React.useState(false);
  const [restTime, setRestTime] = React.useState(90);

  const exercises = [
    { name: 'Warm-up walk', sets: 1, reps: '5 min', weight: null },
    { name: 'Pull-up', sets: 4, reps: '8', weight: 'BW' },
    { name: 'Barbell row', sets: 4, reps: '6', weight: '80kg' },
    { name: 'Face pull', sets: 3, reps: '12', weight: '20kg' },
    { name: 'Bicep curl', sets: 3, reps: '10', weight: '14kg' },
    { name: 'Cooldown stretch', sets: 1, reps: '5 min', weight: null },
  ];

  const ex = exercises[currentEx];
  const isWarmup = currentEx === 0 || currentEx === exercises.length - 1;

  React.useEffect(() => {
    if (!resting) return;
    const t = setInterval(() => {
      setRestTime(prev => {
        if (prev <= 1) { setResting(false); return 90; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [resting]);

  const completeSet = () => {
    if (currentSet >= ex.sets) {
      if (currentEx < exercises.length - 1) {
        setCurrentEx(currentEx + 1);
        setCurrentSet(1);
      }
    } else {
      setResting(true);
      setRestTime(90);
      setCurrentSet(currentSet + 1);
    }
  };

  const skipRest = () => {
    setResting(false);
    setRestTime(90);
  };

  return (
    <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Progress indicator */}
      <div style={{ display: 'flex', gap: 3, marginBottom: Space[6] }}>
        {exercises.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < currentEx ? F.accent : i === currentEx ? 'rgba(255,110,80,0.5)' : 'rgba(255,255,255,0.08)',
          }} />
        ))}
      </div>

      {/* Current exercise */}
      <div style={{ textAlign: 'center', marginBottom: Space[8] }}>
        <FLabel size={9} mb={8} color={F.accent}>
          EXERCISE {currentEx + 1} OF {exercises.length}
        </FLabel>
        <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.5, marginBottom: 8 }}>
          {ex.name}
        </div>
        {!isWarmup && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: Space[4], marginTop: Space[3] }}>
            <div style={{ textAlign: 'center' }}>
              <FMono size={10} color={F.dim}>SETS</FMono>
              <div style={{ fontSize: 20, fontWeight: 300, marginTop: 4 }}>{currentSet}/{ex.sets}</div>
            </div>
            <div style={{ width: 1, background: F.borderSoft }} />
            <div style={{ textAlign: 'center' }}>
              <FMono size={10} color={F.dim}>REPS</FMono>
              <div style={{ fontSize: 20, fontWeight: 300, marginTop: 4 }}>{ex.reps}</div>
            </div>
            {ex.weight && <>
              <div style={{ width: 1, background: F.borderSoft }} />
              <div style={{ textAlign: 'center' }}>
                <FMono size={10} color={F.dim}>LOAD</FMono>
                <div style={{ fontSize: 20, fontWeight: 300, marginTop: 4 }}>{ex.weight}</div>
              </div>
            </>}
          </div>
        )}
      </div>

      {/* Rest timer or action */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {resting ? (
          <div style={{ textAlign: 'center' }}>
            <FLabel size={10} mb={12} color={F.dim}>REST</FLabel>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              border: `3px solid ${F.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span style={{ fontSize: 36, fontWeight: 200, fontFamily: FF.mono }}>
                {Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, '0')}
              </span>
            </div>
            <FBtn variant="ghost" size="sm" onClick={skipRest}>Skip rest</FBtn>
          </div>
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: `linear-gradient(135deg, ${F.accent}, #c93b1d)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: `0 8px 32px rgba(255,110,80,0.3)`,
              cursor: 'pointer',
            }} onClick={completeSet}>
              <FIcon path={ICONS.check} size={36} color="#1a0f0a" stroke={2.4} />
            </div>
            <div style={{ fontSize: 13, color: F.dim }}>
              {isWarmup ? 'Tap when done' : 'Complete set'}
            </div>
          </div>
        )}
      </div>

      {/* Next up */}
      {currentEx < exercises.length - 1 && (
        <div style={{
          marginTop: 'auto', padding: '14px 0',
          borderTop: `1px solid ${F.borderSoft}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <FMono size={9} color={F.mute}>NEXT</FMono>
          <span style={{ fontSize: 13, color: F.dim }}>{exercises[currentEx + 1].name}</span>
        </div>
      )}
    </div>
  );
}

// ─── EXERCISE LIBRARY (Detail) ───────────────────────────
function ExerciseLibraryDetail({ nav }) {
  const [filter, setFilter] = React.useState('all');
  const categories = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
  const exercises = [
    { name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate' },
    { name: 'Pull-up', muscle: 'Back', equipment: 'Bodyweight', difficulty: 'Intermediate' },
    { name: 'Squat', muscle: 'Legs', equipment: 'Barbell', difficulty: 'Advanced' },
    { name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', difficulty: 'Intermediate' },
    { name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', difficulty: 'Intermediate' },
    { name: 'Romanian Deadlift', muscle: 'Legs', equipment: 'Barbell', difficulty: 'Intermediate' },
    { name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', difficulty: 'Beginner' },
    { name: 'Bicep Curl', muscle: 'Arms', equipment: 'Dumbbell', difficulty: 'Beginner' },
    { name: 'Tricep Dip', muscle: 'Arms', equipment: 'Bodyweight', difficulty: 'Intermediate' },
    { name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', difficulty: 'Beginner' },
    { name: 'Cable Fly', muscle: 'Chest', equipment: 'Cable', difficulty: 'Beginner' },
    { name: 'Face Pull', muscle: 'Back', equipment: 'Cable', difficulty: 'Beginner' },
  ];

  const filtered = filter === 'all' ? exercises :
    exercises.filter(e => e.muscle.toLowerCase() === filter);

  return (
    <div style={{ padding: '0 20px 20px' }}>
      {/* Search bar */}
      <div style={{
        background: F.surface, border: `1px solid ${F.borderSoft}`,
        borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: Space[4],
      }}>
        <FIcon path={ICONS.search} size={16} color={F.mute} stroke={1.8} />
        <span style={{ fontSize: 13, color: F.mute }}>Search exercises...</span>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 18,
        paddingBottom: 4,
      }}>
        {categories.map(c => (
          <button
            key={c}
            data-stay="true"
            onClick={() => setFilter(c)}
            style={{
              padding: '6px 12px', borderRadius: 999, border: 'none',
              background: c === filter ? F.accent : 'rgba(255,255,255,0.06)',
              color: c === filter ? '#1a0f0a' : F.dim,
              fontFamily: FF.mono, fontSize: 10, letterSpacing: 0.8,
              textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >{c}</button>
        ))}
      </div>

      {/* Exercise list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((ex, i) => (
          <div key={i} style={{
            padding: '12px 0',
            borderBottom: `1px solid ${F.borderSoft}`,
            display: 'flex', alignItems: 'center', gap: Space[3],
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FIcon path={ICONS.dumb} size={14} color={F.mute} stroke={1.6} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</div>
              <div style={{ display: 'flex', gap: Space[2], marginTop: 3 }}>
                <FMono size={9} color={F.dim}>{ex.muscle}</FMono>
                <FMono size={9} color={F.faint}>·</FMono>
                <FMono size={9} color={F.dim}>{ex.equipment}</FMono>
              </div>
            </div>
            <FTag tone="mute" size="sm">{ex.difficulty}</FTag>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EAT TAB ─────────────────────────────────────────────
function EatTab({ nav }) {
  const macros = { kcal: 1180, kcalTarget: 1660, protein: 98, proteinTarget: 147, carbs: 112, carbsTarget: 160, fat: 38, fatTarget: 60 };
  const meals = [
    { time: '7:30', name: 'Overnight oats + banana', kcal: 380, logged: true },
    { time: '12:00', name: 'Chicken rice bowl', kcal: 520, logged: true },
    { time: '15:30', name: 'Greek yoghurt + berries', kcal: 280, logged: true },
    { time: '19:00', name: 'Salmon + greens', kcal: 0, logged: false, planned: true },
  ];

  const openLogSheet = () => {
    nav.openSheet({
      title: 'Log Food',
      content: <LogFoodSheet nav={nav} />,
      height: '70%',
    });
  };

  return (
    <div style={{ padding: '16px 0 20px' }}>
      <div style={{ padding: '0 20px 16px' }}>
        <FNavBar title="NUTRITION" trailing={
          <button data-stay="true" onClick={openLogSheet} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: F.accent, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FIcon path={ICONS.plus} size={16} color="#1a0f0a" stroke={2.4} />
          </button>
        } />
      </div>

      {/* Macro rings / summary */}
      <div style={{ padding: '0 20px', marginBottom: Space[5] }}>
        <div style={{
          background: F.surface, border: `1px solid ${F.borderSoft}`,
          borderRadius: 14, padding: 18,
        }}>
          {/* Calories hero */}
          <div style={{ textAlign: 'center', marginBottom: Space[4] }}>
            <FNum size={44} weight={200} unit="kcal">{macros.kcal}</FNum>
            <div style={{ fontSize: 12, color: F.dim, marginTop: 6 }}>
              {macros.kcalTarget - macros.kcal} remaining
            </div>
            <div style={{ marginTop: 10 }}>
              <FTexBar pct={Math.round(macros.kcal / macros.kcalTarget * 100)} height={6} radius={3} />
            </div>
          </div>

          {/* P / C / F row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: Space[3] }}>
            {[
              { label: 'Protein', val: macros.protein, target: macros.proteinTarget, color: '#4ade80' },
              { label: 'Carbs', val: macros.carbs, target: macros.carbsTarget, color: '#60a5fa' },
              { label: 'Fat', val: macros.fat, target: macros.fatTarget, color: '#facc15' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <FLabel size={9} mb={4} color={F.mute}>{m.label}</FLabel>
                <div style={{ fontSize: 16, fontWeight: 400, fontFamily: FF.mono }}>
                  {m.val}<span style={{ fontSize: 10, color: F.mute }}>/{m.target}g</span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <FTexBar pct={Math.round(m.val / m.target * 100)} height={4} radius={2} color={m.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's meals */}
      <div style={{ padding: '0 20px' }}>
        <FSection label="Today's meals" action={
          <button data-stay="true" onClick={openLogSheet} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <FMono size={10} color={F.accent}>+ Add</FMono>
          </button>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {meals.map((m, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 10,
                background: m.logged ? F.surface : 'transparent',
                border: `1px solid ${m.logged ? F.borderSoft : 'rgba(255,255,255,0.04)'}`,
                display: 'flex', alignItems: 'center', gap: Space[3],
                opacity: m.logged ? 1 : 0.6,
              }}>
                <FMono size={10} color={F.mute}>{m.time}</FMono>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: m.logged ? 400 : 300 }}>{m.name}</div>
                </div>
                {m.logged ? (
                  <FMono size={11} color={F.dim}>{m.kcal}</FMono>
                ) : (
                  <FTag tone="mute" size="sm">planned</FTag>
                )}
              </div>
            ))}
          </div>
        </FSection>
      </div>

      {/* Water */}
      <div style={{ padding: '0 20px', marginTop: Space[4] }}>
        <div style={{
          background: F.surface, border: `1px solid ${F.borderSoft}`,
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: Space[3],
        }}>
          <span style={{ fontSize: 18 }}>💧</span>
          <div style={{ flex: 1 }}>
            <FLabel size={9} mb={2}>WATER</FLabel>
            <FTexBar pct={62} height={4} radius={2} color="#60a5fa" />
          </div>
          <FMono size={11} color={F.dim}>1.5 / 2.4L</FMono>
        </div>
      </div>
    </div>
  );
}

// ─── LOG FOOD SHEET ──────────────────────────────────────
function LogFoodSheet({ nav }) {
  const quickActions = [
    { icon: ICONS.search, label: 'Search food', desc: 'Database lookup' },
    { icon: 'M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 8h10M7 12h4', label: 'Scan barcode', desc: 'Camera scan' },
    { icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z', label: 'Photo', desc: 'AI recognition' },
    { icon: 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8', label: 'Voice', desc: 'Say what you ate' },
  ];

  const recents = [
    { name: 'Overnight oats + banana', kcal: 380 },
    { name: 'Chicken rice bowl', kcal: 520 },
    { name: 'Protein shake', kcal: 220 },
    { name: 'Greek yoghurt + berries', kcal: 280 },
  ];

  return (
    <div>
      {/* Quick actions grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Space[2], marginBottom: Space[5] }}>
        {quickActions.map((a, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${F.borderSoft}`,
            borderRadius: 12, padding: 14,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Space[2],
            cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,110,80,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FIcon path={a.icon} size={16} color={F.accent} stroke={1.8} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{a.label}</div>
              <div style={{ fontSize: 10, color: F.mute, marginTop: 2 }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick-add */}
      <div style={{
        display: 'flex', gap: Space[2], marginBottom: Space[5],
      }}>
        <div style={{
          flex: 1, background: F.surface2, borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: Space[2],
        }}>
          <FIcon path={ICONS.plus} size={12} color={F.mute} stroke={2} />
          <span style={{ fontSize: 12, color: F.dim }}>Quick-add cals</span>
        </div>
        <div style={{
          flex: 1, background: F.surface2, borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: Space[2],
        }}>
          <FIcon path={ICONS.plus} size={12} color={F.mute} stroke={2} />
          <span style={{ fontSize: 12, color: F.dim }}>Quick-add protein</span>
        </div>
      </div>

      {/* Recent meals */}
      <FLabel size={10} mb={8}>RECENT</FLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {recents.map((r, i) => (
          <div key={i} style={{
            padding: '10px 0',
            borderBottom: `1px solid ${F.borderSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13 }}>{r.name}</span>
            <FMono size={10} color={F.dim}>{r.kcal} kcal</FMono>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PLAN TAB ────────────────────────────────────────────
function PlanTab({ nav }) {
  const days = [
    { label: 'Mon', date: '12', events: [{ type: 'train', name: 'Upper A' }, { type: 'meal', name: '3 meals' }], done: true },
    { label: 'Tue', date: '13', events: [{ type: 'meal', name: 'Prep day' }], done: true },
    { label: 'Wed', date: '14', events: [{ type: 'train', name: 'Lower' }, { type: 'meal', name: '3 meals' }], done: true },
    { label: 'Thu', date: '15', events: [{ type: 'checkin', name: 'Check-in' }, { type: 'meal', name: '3 meals' }], today: true },
    { label: 'Fri', date: '16', events: [{ type: 'train', name: 'Pull · Upper B' }, { type: 'meal', name: '3 meals' }] },
    { label: 'Sat', date: '17', events: [{ type: 'rest', name: 'Rest day' }] },
    { label: 'Sun', date: '18', events: [{ type: 'meal', name: 'Batch prep' }, { type: 'meal', name: '3 meals' }] },
  ];

  const typeColor = { train: F.accent, meal: '#60a5fa', checkin: F.green, rest: F.mute };

  return (
    <div style={{ padding: '16px 0 20px' }}>
      <div style={{ padding: '0 20px 16px' }}>
        <FNavBar title="PLAN" trailing={<FTag tone="neutral">Week 6</FTag>} />
      </div>

      {/* Week strip */}
      <div style={{
        padding: '0 20px', marginBottom: Space[5],
        display: 'flex', gap: 6,
      }}>
        {days.map((d, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', padding: '10px 0',
            borderRadius: 10,
            background: d.today ? 'rgba(255,110,80,0.1)' : 'transparent',
            border: d.today ? `1px solid rgba(255,110,80,0.3)` : `1px solid transparent`,
          }}>
            <div style={{ fontFamily: FF.mono, fontSize: 9, color: F.mute, marginBottom: 4, letterSpacing: 0.8 }}>
              {d.label}
            </div>
            <div style={{
              fontSize: 14, fontWeight: d.today ? 600 : 400,
              color: d.today ? F.accent : d.done ? F.text : F.dim,
            }}>{d.date}</div>
            {d.done && <div style={{ width: 4, height: 4, borderRadius: 2, background: F.green, margin: '4px auto 0' }} />}
          </div>
        ))}
      </div>

      {/* Day breakdown */}
      <div style={{ padding: '0 20px' }}>
        <FSection label="Thursday · Today">
          <div style={{ display: 'flex', flexDirection: 'column', gap: Space[2] }}>
            {days[3].events.map((ev, i) => (
              <div key={i} style={{
                background: F.surface, border: `1px solid ${F.borderSoft}`,
                borderRadius: 10, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: typeColor[ev.type] }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{ev.name}</div>
                </div>
                <FTag tone={ev.type === 'train' ? 'accent' : ev.type === 'checkin' ? 'green' : 'neutral'} size="sm">
                  {ev.type}
                </FTag>
              </div>
            ))}
          </div>
        </FSection>

        {/* Upcoming */}
        <FSection label="Friday" mt={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Space[2] }}>
            {days[4].events.map((ev, i) => (
              <div key={i} style={{
                background: F.surface, border: `1px solid ${F.borderSoft}`,
                borderRadius: 10, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: 0.7,
              }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: typeColor[ev.type] }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{ev.name}</div>
                </div>
                <FTag tone={ev.type === 'train' ? 'accent' : 'neutral'} size="sm">{ev.type}</FTag>
              </div>
            ))}
          </div>
        </FSection>

        {/* Planning controls */}
        <div style={{ marginTop: Space[5], display: 'flex', flexDirection: 'column', gap: Space[2] }}>
          <FBtn variant="ghost" full iconLeading={ICONS.swap}>Move meals</FBtn>
          <FBtn variant="ghost" full iconLeading={ICONS.sparkle}>AI suggest plan</FBtn>
        </div>
      </div>
    </div>
  );
}

// ─── YOU TAB ─────────────────────────────────────────────
function YouTab({ nav }) {
  const metrics = [
    { label: 'Weight', value: '82.1', unit: 'kg', trend: '−0.4 this week', trendDir: 'down' },
    { label: 'Body Fat', value: '20.1', unit: '%', trend: '−0.3 this month', trendDir: 'down' },
    { label: 'TDEE', value: '2,420', unit: 'kcal', trend: 'High confidence', trendDir: 'stable' },
    { label: 'Streak', value: '14', unit: 'days', trend: 'Best: 21 days', trendDir: 'up' },
  ];

  const strength = [
    { name: 'Bench Press', current: '90kg', trend: '+5kg', period: '4 weeks' },
    { name: 'Squat', current: '120kg', trend: '+10kg', period: '6 weeks' },
    { name: 'Deadlift', current: '140kg', trend: '+7.5kg', period: '6 weeks' },
    { name: 'Overhead Press', current: '55kg', trend: '+2.5kg', period: '4 weeks' },
  ];

  return (
    <div style={{ padding: '16px 0 20px' }}>
      <div style={{ padding: '0 20px 16px' }}>
        <FNavBar title="PROGRESS" trailing={
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FIcon path={'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z'} size={16} color={F.dim} stroke={1.8} />
          </div>
        } />
      </div>

      {/* Key metrics grid */}
      <div style={{ padding: '0 20px', marginBottom: Space[5] }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Space[2] }}>
          {metrics.map((m, i) => {
            const trendColor = m.trendDir === 'down' ? F.green : m.trendDir === 'up' ? F.accent : F.dim;
            return (
              <div key={i} style={{
                background: F.surface, border: `1px solid ${F.borderSoft}`,
                borderRadius: 12, padding: 14,
              }}>
                <FLabel size={9} mb={6}>{m.label}</FLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 300, fontFamily: FF.mono }}>{m.value}</span>
                  <span style={{ fontSize: 10, color: F.mute, fontFamily: FF.mono }}>{m.unit}</span>
                </div>
                <div style={{ fontSize: 10, color: trendColor, marginTop: 6, fontFamily: FF.mono }}>
                  {m.trend}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adherence bar */}
      <div style={{ padding: '0 20px', marginBottom: Space[5] }}>
        <FSection label="Adherence · This week">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Workouts', pct: 75, detail: '3/4 completed' },
              { label: 'Nutrition', pct: 85, detail: '6/7 days logged' },
              { label: 'Check-ins', pct: 100, detail: '1/1 this week' },
            ].map((a, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <FMono size={10} color={F.dim}>{a.label}</FMono>
                  <FMono size={10} color={F.dim}>{a.detail}</FMono>
                </div>
                <FTexBar pct={a.pct} height={5} radius={3} color={a.pct === 100 ? F.green : F.accent} />
              </div>
            ))}
          </div>
        </FSection>
      </div>

      {/* Strength trends */}
      <div style={{ padding: '0 20px' }}>
        <FSection label="Strength trends">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {strength.map((s, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: `1px solid ${F.borderSoft}`,
                display: 'flex', alignItems: 'center',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{s.name}</div>
                  <FMono size={10} color={F.dim}>{s.current}</FMono>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <FTag tone="green" size="sm">{s.trend}</FTag>
                  <div style={{ fontSize: 9, color: F.mute, marginTop: 3, fontFamily: FF.mono }}>{s.period}</div>
                </div>
              </div>
            ))}
          </div>
        </FSection>
      </div>

      {/* Body scan CTA */}
      <div style={{ padding: '0 20px', marginTop: Space[3] }}>
        <FBtn variant="ghost" full iconLeading={ICONS.expand}>
          Body scan & progress photos
        </FBtn>
      </div>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────
window.AppShell = AppShell;
