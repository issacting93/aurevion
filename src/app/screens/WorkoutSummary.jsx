// Workout Summary — standalone screen wrapper for journey/gallery views.
// The actual summary logic now lives inside Training.jsx (SummaryPhase).

import { Color } from '../../ui/tokens'
import { ICONS, FNavBar, FIcon, Phone } from '../../ui/components'
import { TrainingSessionContent } from './Training'

export function WorkoutSummaryContent() {
  // Renders the training session which includes its own summary phase
  return <TrainingSessionContent />
}

export function WorkoutSummaryScreen() {
  return (
    <Phone label="Workout Summary" group="TRAINING">
      <FNavBar
        title="Session Complete"
        leading={<FIcon path={ICONS.close} size={20} color={Color.text} />}
      />
      <WorkoutSummaryContent />
    </Phone>
  )
}
