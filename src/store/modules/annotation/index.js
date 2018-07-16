// This module handles the management of the annotation state.

// Import sub files
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import helpers from './helpers.js'

const state = {
  project: {
    name: 'An AIDA project',
    layers: []
  },
  selectedItems: [],
  currentColor: null,
  defaultColors: helpers.defaultColors()
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
