export default {
  loadEditorConfig: ({
    dispatch
  }, config) => {
    if (config.hasOwnProperty('activeLayer')) {
      dispatch('setActiveLayer', config.activeLayer)
    }

    if (config.hasOwnProperty('activeChannel')) {
      dispatch('image/setActiveChannel', config.activeChannel, { root: true })
    }

    if (config.hasOwnProperty('steps')) {
      dispatch('setSteps', config.steps)
    }

    if (config.hasOwnProperty('activeStep')) {
      dispatch('setActiveStep', config.steps[config.activeStep])
    }
  },

  setSteps: ({
    commit
  }, steps) => {
    commit('setSteps', steps)
  },

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

    // Demo data isn't saved on a server but locally in the browser so check
    // for it when openning the demo project and load if found.
    const savedAnnotation = window.localStorage.annotation
    if (savedAnnotation) {
      await dispatch('annotation/loadAnnotation',
        JSON.parse(savedAnnotation),
        { root: true }
      )
    } else {
      dispatch('annotation/loadAnnotation', null, { root: true })
    }

    await dispatch('image/clearImages', null, { root: true })
    await dispatch('image/addOSDImage', {
      name: 'Example image',
      fileType: 'dzi',
      source: 'https://s3-eu-west-1.amazonaws.com/aida-example/SampleKi67.dzi',
      function: 'project',
      opacity: 1
    }, { root: true })
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
