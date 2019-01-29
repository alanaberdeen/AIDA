export default {
  dismissSnackbar: ({
    commit
  }) => {
    commit('dismissSnackbar')
  },

  activateSnackbar: ({
    commit
  }, payload) => {
    commit('activateSnackbar', payload)
  },

  synchroniseAnnotationAndOSDCanvas: ({
    commit,
    rootState
  }) => {
    commit('synchroniseAnnotationAndOSDCanvas', rootState.image.OSDviewer)
  },

  setActiveStepAndLayer: ({
    dispatch
  }, index) => {
    dispatch('setActiveLayer', index)
    dispatch('setActiveStep', index)
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

  setActiveLayer: ({
    commit
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)
  },

  toggleSettings: ({
    commit
  }) => {
    commit('toggleSettings')
  },

  setActiveValidationIndex: ({
    commit
  }, payload) => {
    commit('setActiveValidationIndex', payload)
  },

  setupForValidation: ({
    commit
  }) => {
    commit('setupForValidation')
  },

  loadProject: async ({
    dispatch
  }) => {
    await dispatch('backend/getAnnotation', null, { root: true })
    await dispatch('backend/addImageToCanvas', null, { root: true })
    dispatch('synchroniseAnnotationAndOSDCanvas')
  },

  toggleToolsDrawer: ({
    commit
  }) => {
    commit('toggleToolsDrawer')
  },

  setToolsDrawerState: ({
    commit
  }, payload) => {
    commit('setToolsDrawerState', payload)
  },

  toggleStudioDrawer: ({
    commit
  }) => {
    commit('toggleStudioDrawer')
  },

  setStudioDrawerState: ({
    commit
  }, payload) => {
    commit('setStudioDrawerState', payload)
  },

  createNewItem: ({
    state,
    rootState,
    commit
  }, payload) => {
    payload['studyName'] = state.studyName
    payload['imageName'] = rootState.image.imageName
    commit('createNewItem', payload)
  }
}
