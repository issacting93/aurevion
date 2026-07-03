import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { DemoProvider } from './context/DemoContext'

// Product pages
import Home from './pages/Home'
import AppFlow from './pages/AppFlow'
import Landing from './pages/Landing'
import BodyViewer from './pages/BodyViewer'

// Dev & asset tools
import UILibrary from './tools/UILibrary'
import DevHandover from './tools/DevHandover'
import Scenes from './tools/Scenes'
import Trailer from './tools/Trailer'

// Journey sub-routes
import JourneyLayout from './tools/journey/JourneyLayout'
import JourneyHub from './tools/journey/JourneyHub'
import ModeOverview from './tools/journey/ModeOverview'
import FlowPage from './tools/journey/FlowPage'
import GoalNetwork from './tools/goal-network/GoalNetwork'
import OntologyExplorer from './tools/ontology/OntologyExplorer'
import ScenarioPlanner from './tools/ontology/ScenarioPlanner'
import ExerciseLibrary from './tools/ontology/ExerciseLibrary'
import GoalDetailCards from './tools/ontology/GoalDetailCards'

export default function App() {
  return (
    <UserProvider>
      <DemoProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<AppFlow />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/library" element={<UILibrary />} />
          <Route path="/demo" element={<DevHandover />} />
          <Route path="/journey" element={<JourneyLayout />}>
            <Route index element={<JourneyHub />} />
            <Route path="seed" element={<ModeOverview mode="seed" />} />
            <Route path="decide" element={<ModeOverview mode="decide" />} />
            <Route path="cooking" element={<ModeOverview mode="cooking" />} />
            <Route path="cooking/:flow" element={<FlowPage mode="cooking" />} />
            <Route path="exercise" element={<ModeOverview mode="exercise" />} />
            <Route path="exercise/:flow" element={<FlowPage mode="exercise" />} />
            <Route path="observe" element={<ModeOverview mode="observe" />} />
            <Route path="goals" element={<GoalNetwork />} />
            <Route path="explore" element={<OntologyExplorer />}>
              <Route index element={<ScenarioPlanner />} />
              <Route path="scenario" element={<ScenarioPlanner />} />
              <Route path="exercises" element={<ExerciseLibrary />} />
              <Route path="goal-cards" element={<GoalDetailCards />} />
            </Route>
          </Route>
          <Route path="/screens" element={<Navigate to="/journey" replace />} />
          <Route path="/body" element={<BodyViewer />} />
          <Route path="/scenes" element={<Scenes />} />
          <Route path="/trailer" element={<Trailer />} />
        </Routes>
      </DemoProvider>
    </UserProvider>
  )
}
