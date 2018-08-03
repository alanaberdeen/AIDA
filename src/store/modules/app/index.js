import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  toolbar: false,
  toolsDrawer: true,
  studioDrawer: true,
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
