export default {
  toolbarOff: state => {
    state.toolbar = false
  },

  toolbarOn: state => {
    state.toolbar = true
  },

  toggleToolsDrawer: state => {
    state.toolsDrawer = !state.toolsDrawer
  },

  toolsDrawerOff: state => {
    state.toolsDrawer = false
  },

  toolsDrawerOn: state => {
    state.toolsDrawer = true
  },

  toggleStudioDrawer: state => {
    state.studioDrawer = !state.studioDrawer
  },

  studioDrawerOff: state => {
    state.studioDrawer = false
  },

  studioDrawerOn: state => {
    state.studioDrawer = true
  },

  dismissSnackbar: state => {
    state.snackbar.active = false
  },

  activateSnackbar: (state, payload) => {
    state.snackbar.active = true
    state.snackbar.text = payload.text ? payload.text : 'notification'
    state.snackbar.color = payload.color ? payload.color : 'info'
    state.snackbar.timeout = payload.timeout ? payload.timeout : 2000
  }
}
