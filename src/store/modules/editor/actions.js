export default {
  resetEditorState: ({
    commit
  }) => {
    commit('resetEditorState')
  },

  setActiveStep: ({
    commit,
    dispatch
  }, step) => {
    if (typeof step.specificLayer === 'number') {
      dispatch('annotation/setActiveLayer', (step.specificLayer), {
        root: true
      })
    }
    commit('setActiveStep', (step.id - 1))
  },

  setEditorActiveLayer: ({
    commit
  }, layerIndex) => {
    commit('setEditorActiveLayer', layerIndex)
  },

  loadConfig: ({
    commit,
    rootState
  }, payload) => {
    commit('loadConfig', {
      editor: payload,
      rootState: rootState
    })
  },

  toggleSettings: ({
    commit
  }, payload) => {
    commit('toggleSettings')
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
