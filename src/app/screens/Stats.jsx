// ════════════════════════════════════════════════════════════
// Stats / Progress — weekly overview (body, training, nutrition)
// ════════════════════════════════════════════════════════════

import { Phone } from '../../ui/components'
import { CheckInOverviewContent } from './CheckIn'

export function StatsContent() {
  return <CheckInOverviewContent />
}

export function StatsScreen() {
  return (
    <Phone label="Progress" group="OBSERVE">
      <CheckInOverviewContent />
    </Phone>
  )
}
