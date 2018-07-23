import './mutations'

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

  setupAnnotation: ({
    commit
  }, payload) => {
    commit('setupAnnotation', payload)
  },

  loadAnnotation: ({
    dispatch,
    rootState
  }, annotation) => {
    // Handle both legacy string representation and new AIDA annotation schema
    if (typeof annotation === 'object') {
      dispatch('loadAidaAnnotation', {
        annotation: annotation,
        activeLayer: rootState.editor.activeLayer
      })
    } else if (typeof annotation === 'string') {
      dispatch('loadPaperStringAnnotation', {
        annotation: annotation,
        activeLayer: rootState.editor.activeLayer
      }).then(() => {
        dispatch('refreshAnnotationState')
      })
    }
  },

  loadAidaAnnotation: ({
    commit
  }, payload) => {
    commit('loadAidaAnnotation', payload)
  },

  loadPaperStringAnnotation: ({
    commit
  }, payload) => {
    commit('loadPaperStringAnnotation', payload)
  },

  prepareCanvas: ({
    commit,
    rootState
  }, payload) => {
    commit('prepareCanvas', rootState)
  },

  newLayer: ({
    commit
  }, payload) => {
    commit('newLayer')
  },

  setActiveLayer: ({
    commit,
    dispatch
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)

    // Also, store the new active layer in the editor
    dispatch('editor/setEditorActiveLayer', layerIndex, {
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
  }
}
