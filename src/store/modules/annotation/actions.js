export default {
  resetAnnotationState: ({
    commit
  }) => {
    commit('resetAnnotationState')
  },

  refreshAnnotationState: ({
    commit
  }, payload) => {
    commit('refreshAnnotationState', payload)
  },

  prepareCanvas: ({
    commit,
    rootState
  }) => {
    commit('prepareCanvas', rootState.app.activeLayer)
  },

  createLayer: ({
    commit
  }) => {
    commit('createLayer')
  },

  setActiveLayer: ({
    commit,
    dispatch
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)
    dispatch('app/setActiveLayer', layerIndex, {
      root: true
    })
  },

  setLayerOpacity: ({
    commit
  }, payload) => {
    commit('setLayerOpacity', payload)
  },

  setLayerName: ({
    commit
  }, payload) => {
    commit('setLayerName', payload)
  },

  deleteActiveLayer: ({
    commit
  }) => {
    commit('deleteActiveLayer')
  },

  setProjectName: ({
    commit
  }, payload) => {
    commit('setProjectName', payload)
  },

  setSelectedItems: ({
    commit
  }, payload) => {
    commit('setSelectedItems', payload)
  },

  drawBoundingBoxes: ({
    commit
  }, payload) => {
    commit('drawBoundingBoxes', payload)
  }
}
