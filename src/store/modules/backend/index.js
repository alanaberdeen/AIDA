import actions from './actions'
import mutations from './mutations'

const state = {
  availableImages: [],
  projectFileName: ''
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
