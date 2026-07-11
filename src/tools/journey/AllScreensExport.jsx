/* AllScreensExport — every screen rendered at full 428px phone size for HTML export.
   Route: /journey/all/export
   No labels, no chrome, no compact toggle — just screens at 1:1 scale. */

import { useMemo } from 'react'
import { Color, Font } from '../../ui/tokens'
import { FMono } from '../../ui/components'
import { PHASES, TOTAL_SCREENS, PW, PH } from './journey-data'
import { UserProvider } from '../../context/UserContext'
import { MOCK_PROFILE, MOCK_ACTIVITY_LOG } from '../../context/mockUser'
import { computeMacros } from '../../app/screens/Onboarding'
import { generateProgram } from '../../app/screens/fitness-data'
import { generateMealPlan } from '../../app/screens/nutrition-data'

const PROFILE_STATE = (() => {
  const profile = MOCK_PROFILE
  const targets = computeMacros(profile)
  const workoutPlan = generateProgram({
    goals: profile.goals || [],
    equipment: profile.equipment,
    availableDays: profile.availableDays,
    injuries: profile.injuries || [],
    experience: profile.liftingExp,
  })
  const mealPlan = generateMealPlan({ targets, dietary: profile.dietary || [], schedule: workoutPlan.schedule })
  return { profile, targets, workoutPlan, mealPlan, onboarded: true, activityLog: MOCK_ACTIVITY_LOG, checkins: [], interventions: [], preferences: { layout: 'balanced' }, mealPrepApproach: null, pantry: {}, exerciseHistory: {}, activeSession: null }
})()

export default function AllScreensExport() {
  return (
    <UserProvider _override={PROFILE_STATE}>
      <div data-name="All Screens Export" style={{
        minHeight: '100vh', background: Color.bg,
        fontFamily: Font.sans, color: Color.text,
        padding: '40px 60px 120px',
      }}>
        {PHASES.map(phase => (
          <div data-name={`Phase / ${phase.title}`} key={phase.id} style={{ marginBottom: 60 }}>
            {/* Phase label */}
            <div data-name="Phase Header" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 24, paddingBottom: 12,
              borderBottom: `1px solid ${Color.borderSoft}`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: phase.color }} />
              <FMono size={12} color={phase.color} letter={1.4}>{phase.phase}</FMono>
              <FMono size={12} color={Color.dim}>{phase.title}</FMono>
              <FMono size={11} color={Color.faint} style={{ marginLeft: 'auto' }}>
                {phase.screens.filter(s => s.C).length}/{phase.screens.length} SCREENS
              </FMono>
            </div>

            {/* Screens at full 428px */}
            <div data-name="Screen Row" style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 32,
            }}>
              {phase.screens.map((screen, si) => (
                <div data-name={`Screen / ${screen.label}`} key={si}>
                  <div data-name="Screen Label" style={{ fontFamily: Font.mono, fontSize: 10, color: Color.mute, letterSpacing: 0.8, marginBottom: 8 }}>
                    {screen.label}
                  </div>
                  {screen.C ? (
                    <screen.C />
                  ) : (
                    <div data-name={`Missing / ${screen.label}`} style={{
                      width: PW, height: PH, borderRadius: 56,
                      border: `2px dashed ${Color.faint}`,
                      display: 'grid', placeItems: 'center',
                    }}>
                      <FMono size={10} color={Color.faint}>NOT BUILT</FMono>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </UserProvider>
  )
}
