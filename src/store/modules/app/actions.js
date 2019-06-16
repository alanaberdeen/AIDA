export default {
  setTask: ({
    commit
  }, task) => {
    commit('setTask', task)
  },

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

  loadDemo: async ({
    dispatch
  }) => {
    await dispatch('synchroniseAnnotationAndOSDCanvas')
    dispatch('annotation/loadAnnotation', null, { root: true })
    await dispatch('image/clearImages', null, { root: true })
    dispatch('image/addOSDImage', {
      name: 'Example image',
      fileType: 'dzi',
      source: 'https://s3-eu-west-1.amazonaws.com/aida-example/SampleKi67.dzi',
      function: 'project',
      opacity: 1
    }, { root: true })
  },

  loadProject: async ({
    dispatch
  }) => {
    await dispatch('synchroniseAnnotationAndOSDCanvas')
    dispatch('backend/getAnnotation', null, { root: true })
    dispatch('backend/getProjectImage', null, { root: true })
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
    payload['imageName'] = rootState.image.projectImageName
    commit('createNewItem', payload)
  }
}
