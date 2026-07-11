/* AllScreens — grid view of every screen across all journey phases.
   Route: /journey/all */

import { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Color, Font, alpha } from '../../ui/tokens'
import { FMono, FTag } from '../../ui/components'
import { PHASES, TOTAL_SCREENS, COVERAGE_PCT, PW, PH, COMPACT_FW, COMPACT_FH, COMPACT_SCALE, FW, FH, SCALE } from './journey-data'
import { PhoneFrame, MissingFrame, ScreenLabel } from './journey-shared'
import { useJourneyContext } from './JourneyLayout'
import { UserProvider } from '../../context/UserContext'
import { MOCK_PROFILE, MOCK_TARGETS, MOCK_ACTIVITY_LOG } from '../../context/mockUser'
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

export default function AllScreens() {
  const { compact, setExpanded } = useJourneyContext()
  const fw = compact ? COMPACT_FW : FW
  const fh = compact ? COMPACT_FH : FH
  const sc = compact ? COMPACT_SCALE : SCALE

  const allScreens = useMemo(() => {
    const result = []
    for (const phase of PHASES) {
      for (const screen of phase.screens) {
        result.push({ ...screen, phase: phase.phase, phaseColor: phase.color, phaseTitle: phase.title })
      }
    }
    return result
  }, [])

  return (
    <UserProvider _override={PROFILE_STATE}>
      <div style={{ padding: '30px 60px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <FMono size={14} color={Color.accent} letter={2}>ALL SCREENS</FMono>
          <FTag tone="accent" size="sm">{TOTAL_SCREENS}</FTag>
          <FTag tone={COVERAGE_PCT === 100 ? 'green' : 'mute'} size="sm">{COVERAGE_PCT}% BUILT</FTag>
          <Link to="/journey/all/export" target="_blank" style={{
            marginLeft: 'auto', padding: '6px 14px', borderRadius: 9999,
            fontFamily: Font.mono, fontSize: 10, letterSpacing: 1.2,
            color: Color.mute, textDecoration: 'none',
            border: `1px solid ${Color.borderSoft}`, background: 'transparent',
          }}>EXPORT 428px</Link>
        </div>

        {PHASES.map(phase => (
          <div key={phase.id} style={{ marginBottom: 48 }}>
            {/* Phase header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 16, paddingBottom: 12,
              borderBottom: `1px solid ${Color.borderSoft}`,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 4,
                background: phase.color,
              }} />
              <FMono size={11} color={phase.color} letter={1.4}>{phase.phase}</FMono>
              <FMono size={11} color={Color.dim}>{phase.title}</FMono>
              <FMono size={10} color={Color.faint} style={{ marginLeft: 'auto' }}>
                {phase.screens.filter(s => s.C).length}/{phase.screens.length}
              </FMono>
            </div>

            {/* Screen grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, ${fw}px)`,
              gap: compact ? 12 : 20,
            }}>
              {phase.screens.map((screen, si) => (
                <div key={si} style={{ width: fw }}>
                  <ScreenLabel label={screen.label} missing={!screen.C} reads={screen.reads} writes={screen.writes} />
                  {screen.C ? (
                    <div
                      onClick={() => setExpanded?.({ C: screen.C, label: screen.label })}
                      style={{ cursor: 'pointer' }}
                    >
                      <PhoneFrame scale={sc} frameWidth={fw} frameHeight={fh}>
                        <screen.C />
                      </PhoneFrame>
                    </div>
                  ) : (
                    <MissingFrame label={screen.label} frameWidth={fw} frameHeight={fh} scale={sc} />
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
