import actions from './actions'
import mutations from './mutations'

const state = {
  availableImages: [],
  projectFilePath: ''
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
