import axios from 'axios'

export default {
  async getData ({
    commit
  }) {
    try {
      await axios.post('http://localhost:3000/checkForImages')
      const dataLocation = 'http://localhost:3000/data/images.json'
      const response = await axios.get(dataLocation)
      commit('getData', response.data)
    } catch (err) {
      console.log(err)
    }
  },

  setFileName: ({
    commit,
    dispatch
  }, fileName) => {
    commit('setFileName', fileName)
    dispatch('setImageType', fileName)
  },

  setImageType: ({
    commit
  }, fileName) => {
    commit('setImageType', fileName)
  },

  addImageToCanvas: ({
    commit,
    rootState
  }) => {
    const OSDviewer = rootState.image.OSDviewer
    commit('addImageToCanvas', OSDviewer)
  },

  async saveAnnotation ({
    dispatch,
    rootState
  }) {
    await dispatch('annotation/refreshAnnotationState', null, { root: true })
    axios.post(
      'http://localhost:3000/save',
      {
        imageName: rootState.image.imageName,
        annotationData: rootState.annotation.project
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
      commit('annotation/loadAnnotation', response.data, { root: true })
    } catch (err) {
      console.log('No annotation data found')
    }
  }
}
