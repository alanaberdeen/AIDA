import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  OSDviewer: null,
  OSDworld: null,
  activeChannel: 0,
  // This refers to the main image of the project rather
  // than any associated overlays
  projectImageName: '',
  images: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
