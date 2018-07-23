// This file handles the management of the editor state..
// This specifies the layout of the annotation interface. This may include
// the required steps and instructions, the tools necessary to complete
// the annotations or the default image and annotation content.

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  'type': 'dzi',
  'activeChannel': 0,
  'activeLayer': 0,
  'activeStep': 0,
  'steps': null,
  'settingsFlag': false,
  'toolsDrawer': false,
  'studioDrawer': false
}

// Export all of the relevant logic so that it can be combined with the complete
// store and all other module logic.
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
