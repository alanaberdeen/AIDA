import axios from 'axios'

export default {
  async getData ({
    commit
  }) {
    await axios.post('http://localhost:3000/checkForImages')
    const dataLocation = 'http://localhost:3000/data/images.json'
    try {
      const response = await axios.get(dataLocation)
      commit('getData', response.data)
    } catch (err) {
      console.log(err)
    }
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
    commit('setEditorActiveLayer', layerIndex)
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
    dispatch,
    commit
  }) => {
    await dispatch('annotation/getAnnotation', null, { root: true })
    await dispatch('image/addImageToCanvas', null, { root: true })
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
  }
}
