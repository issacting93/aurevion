/* Re-export Probe from the standalone package.
   The app uses DevModeOverlay as the wrapper name for backwards compat. */

import { Probe } from 'probe-ui'

export { Probe as DevModeOverlay }
