import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  toolsDrawer: true,
  studioDrawer: true,
  snackbar: {
    active: false,
    text: 'this is a notification',
    color: 'info',
    timeout: 3000
  },
  type: 'dzi',
  activeChannel: 0,
  activeLayer: 0,
  activeStep: 0,
  steps: null,
  settingsFlag: false,
  activeValidationIndex: 0,
  strokeScale: 5,
  images: []
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
