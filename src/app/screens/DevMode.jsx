/* Re-export Probe from the standalone package.
   The app uses DevModeOverlay as the wrapper name for backwards compat. */

import { Probe } from '../../../packages/probe/src/Probe'

export { Probe as DevModeOverlay }
