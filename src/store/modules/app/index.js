// This module handles the management of the annotation state.

// Import sub files
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  toolbar: false
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
