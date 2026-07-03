// Check-in Screen wrapper — wraps CheckInFlowContent in a Phone frame for gallery display.

import { Phone } from '../../ui/components'
import { CheckInFlowContent } from './CheckIn'

export function CheckInScreen() {
  return (
    <Phone label="Weekly Check-in" group="FEEDBACK">
      <CheckInFlowContent />
    </Phone>
  );
}
