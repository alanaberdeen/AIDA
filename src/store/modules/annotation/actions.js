import axios from 'axios'

export default {
  resetAnnotationState: ({
    commit
  }) => {
    commit('resetAnnotationState')
  },

  prepareCanvas: ({
    commit,
    rootState
  }) => {
    commit('prepareCanvas', rootState.app.activeLayer)
  },

  newLayer: ({
    commit
  }) => {
    commit('newLayer')
  },

  setActiveLayer: ({
    commit,
    dispatch
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)
    dispatch('app/setEditorActiveLayer', layerIndex, {
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

  refreshAnnotationState: ({
    commit
  }) => {
    commit('refreshAnnotationState')
  },

  async saveAnnotation ({
    dispatch,
    state,
    rootState
  }) {
    await dispatch('refreshAnnotationState')
    axios.post(
      'http://localhost:3000/save',
      {
        imageName: rootState.image.imageName,
        annotationData: state.project
      }
    )
  },

  async getAnnotation ({
    commit,
    rootState
  }) {
    const dataLocation = 'http://localhost:3000/data/annotations/' + rootState.image.imageName + '.json'
    try {
      const response = await axios.get(dataLocation)
      commit('loadAnnotation', response.data)
    } catch (err) {
      console.log('No annotation data found')
    }
  }
}
