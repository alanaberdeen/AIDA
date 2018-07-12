import './mutations'

export default {

  // TurnToolbarOff
  toolbarOff: ({
    commit
  }) => {
    commit('toolbarOff')
  },

  // TurnToolbarOn
  toolbarOn: ({
    commit
  }) => {
    commit('toolbarOn')
  },

  // ToggleToolsDrawer
  toggleToolsDrawer: ({
    commit
  }) => {
    commit('toggleToolsDrawer')
  },

  // TurnToolbarOff
  toolsDrawerOff: ({
    commit
  }) => {
    commit('toolsDrawerOff')
  },

  // TurnToolbarOn
  toolsDrawerOn: ({
    commit
  }) => {
    commit('toolsDrawerOn')
  },

  // ToggleToolsDrawer
  toggleStudioDrawer: ({
    commit
  }) => {
    commit('toggleStudioDrawer')
  },

  // TurnToolbarOff
  studioDrawerOff: ({
    commit
  }) => {
    commit('studioDrawerOff')
  },

  // TurnToolbarOn
  studioDrawerOn: ({
    commit
  }) => {
    commit('studioDrawerOn')
  }
}
