// ─────────────────────────────────────────────────────────────────────────────
// Aurevion · App Shell — 5-tab navigation with detail stack
// ─────────────────────────────────────────────────────────────────────────────

import { NavigationProvider, useNav } from '../context/NavigationContext'
import { Color, Font, Space, Radius } from '../ui/tokens'
import { Phone, FIcon, ICONS, FMono } from '../ui/components'

// Content components (no Phone/NavBar/TabBar wrappers)
import { DashboardContent } from './screens/Dashboard'
import { TDEEContent } from './screens/TDEE'
import { GoalInputContent } from './screens/GoalSetting'
import { MacroTargetsContent } from './screens/Macros'
import { TrainingSessionContent } from './screens/Training'
import { ProgramOverviewContent } from './screens/ProgramOverview'
import { PlanCalendarContent } from './screens/PlanCalendar'
import { FridgeContent } from './screens/Fridge'
import { MealPrepMergeContent } from './screens/MealPrep'
import { BatchPrepContent } from './screens/BatchPrep'
import { ProfileContent } from './screens/Profile'
import { CheckInFlowContent } from './screens/CheckIn'
import { GoalDetailContent } from './screens/GoalDetail'
import { ExerciseBrowserContent } from './screens/ExerciseBrowser'
import { ExerciseDetailContent } from './screens/ExerciseDetail'
import { WorkoutTemplateContent } from './screens/WorkoutTemplateDetail'
import { useUser } from '../context/UserContext'

// ─── Tab definitions ─────────────────────────────────────
const TABS = [
  { id: 'home',  label: 'Home',  icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10' },
  { id: 'train', label: 'Train', icon: ICONS.dumb },
  { id: 'eat',   label: 'Eat',   icon: ICONS.bowl },
  { id: 'plan',  label: 'Plan',  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'you',   label: 'You',   icon: ICONS.goal },
]

// ─── Tile → Detail screen mapping ────────────────────────
const TILE_ROUTES = {
  goal:     { screen: 'goal',    title: 'Goal' },
  tdee:     { screen: 'tdee',    title: 'Expenditure' },
  macros:   { screen: 'macros',  title: 'Macros' },
  calendar: { screen: 'plan',    title: 'Calendar' },
  session:  { screen: 'session', title: 'Training' },
  prep:     { screen: 'prep',    title: 'Meal Prep' },
  checkin:  { screen: 'checkin-flow', title: 'Check-in' },
  fridge:   { screen: 'fridge',  title: 'Pantry' },
  streak:   { screen: 'profile', title: 'Profile' },
}

// ─── Tab content router ──────────────────────────────────
function TabRouter({ tab }) {
  const { pushDetail } = useNav()
  const { markSessionComplete } = useUser()
  const handleTile = (tileId) => {
    const route = TILE_ROUTES[tileId]
    if (route) pushDetail(route.screen, route.title)
  }

  const handleStartSession = (session) => {
    pushDetail('active-session', session.name, { session })
  }

  switch (tab) {
    case 'home':  return <DashboardContent onTileClick={handleTile} />
    case 'train': return <ProgramOverviewContent onStartSession={handleStartSession} />
    case 'eat':   return <MacroTargetsContent />
    case 'plan':  return <PlanCalendarContent onStartSession={handleStartSession} />
    case 'you':   return <ProfileContent />
    default:      return null
  }
}

// ─── Detail content router ───────────────────────────────
function DetailRouter({ screenId, data }) {
  const { popDetail } = useNav()
  const { markSessionComplete } = useUser()

  const handleSessionComplete = () => {
    if (data?.session?.dayIndex != null) markSessionComplete(data.session.dayIndex)
    popDetail()
  }

  switch (screenId) {
    case 'goal':    return <GoalInputContent />
    case 'tdee':    return <TDEEContent />
    case 'macros':  return <MacroTargetsContent />
    case 'session': return <ProgramOverviewContent />
    case 'active-session': return <TrainingSessionContent session={data?.session} onComplete={handleSessionComplete} onBack={popDetail} />
    case 'prep':    return <MealPrepMergeContent />
    case 'fridge':  return <FridgeContent />
    case 'batch':   return <BatchPrepContent />
    case 'plan':    return <PlanCalendarContent />
    case 'profile':      return <ProfileContent />
    case 'checkin-flow': return <CheckInFlowContent />
    case 'goal-detail':      return <GoalDetailContent data={data} />
    case 'exercises':        return <ExerciseBrowserContent data={data} />
    case 'exercise-detail':  return <ExerciseDetailContent data={data} />
    case 'workout-template': return <WorkoutTemplateContent data={data} />
    default:             return null
  }
}

// ─── Detail header with back button ──────────────────────
function DetailHeader({ title }) {
  const { popDetail } = useNav()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${Space[3]}px 20px`, flexShrink: 0,
    }}>
      <button onClick={popDetail} style={{
        width: 36, height: 36, borderRadius: Radius.full, border: 'none',
        background: Color.surface, color: Color.text,
        cursor: 'pointer', display: 'grid', placeItems: 'center',
      }}>
        <FIcon path={ICONS.back} size={16} stroke={2} />
      </button>
      <FMono size={11} color={Color.mute}>{title?.toUpperCase()}</FMono>
      <div style={{ width: 36 }} />
    </div>
  )
}

// ─── Interactive tab bar ─────────────────────────────────
function ShellTabBar({ hidden }) {
  const { activeTab, switchTab } = useNav()
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '6px 12px 28px',
      background: 'linear-gradient(to top, rgba(0,0,0,0.95) 60%, transparent)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      transform: hidden ? 'translateY(100%)' : 'translateY(0)',
      transition: 'transform 0.25s ease',
      zIndex: 10,
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 10px', minWidth: 48,
              color: active ? Color.accent : Color.mute,
              transition: 'color 0.15s ease',
            }}
          >
            <FIcon path={tab.icon} size={20} color={active ? Color.accent : Color.mute} stroke={active ? 2 : 1.5} />
            <span style={{
              fontFamily: Font.mono, fontSize: 9, letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Shell content (inside Phone frame) ──────────────────
function ShellContent() {
  const { activeTab, showingDetail, currentDetail, transitioning } = useNav()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Tab content layer */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: transitioning ? 0 : (showingDetail ? 0 : 1),
        transform: showingDetail ? 'translateX(-20px)' : 'translateX(0)',
        transition: 'opacity 0.2s ease, transform 0.25s ease',
        pointerEvents: showingDetail ? 'none' : 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <TabRouter tab={activeTab} />
      </div>

      {/* Detail overlay */}
      {showingDetail && currentDetail && (
        <div
          key={currentDetail.screen}
          style={{
            position: 'absolute', inset: 0,
            background: Color.bg,
            display: 'flex', flexDirection: 'column',
            animation: 'shellDetailIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          <DetailHeader title={currentDetail.title} />
          <DetailRouter screenId={currentDetail.screen} data={currentDetail.data} />
        </div>
      )}

      {/* Tab bar */}
      <ShellTabBar hidden={showingDetail} />

      <style>{`
        @keyframes shellDetailIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

// ─── AppShell (main export) ──────────────────────────────
export function AppShell() {
  return (
    <NavigationProvider>
      <Phone statusTime="9:41">
        <ShellContent />
      </Phone>
    </NavigationProvider>
  )
}
