import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  OSDviewer: null,
  OSDworld: null,
  activeChannel: 0,
  projectImageName: ''
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
