import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  toolbar: false,
  toolsDrawer: false,
  studioDrawer: false,
  snackbar: {
    active: false,
    text: 'this is a notification',
    color: 'info',
    timeout: 3000
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
