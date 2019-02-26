import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import helpers from './helpers'

const state = {
  project: {
    name: 'An AIDA project',
    layers: []
  },
  projectStateRefreshIndex: 0,
  selectedItems: [],
  currentColor: null,
  defaultColors: helpers.defaultColors(),
  saveState: {
    changesSaved: true,
    lastSaveTimeStamp: null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
