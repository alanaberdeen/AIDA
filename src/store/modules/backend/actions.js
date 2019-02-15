import axios from 'axios'

export default {
  async getData ({
    commit
  }) {
    try {
      await axios.post(location.origin + '/checkForImages')
      const dataLocation = location.origin + '/data/images.json'
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

  setOSDImageSource: ({
    commit,
    rootState
  }) => {
    const OSDviewer = rootState.image.OSDviewer
    commit('setOSDImageSource', OSDviewer)
  },

  async saveAnnotation ({
    dispatch,
    rootState
  }) {
    try {
      await dispatch('annotation/refreshAnnotationState', null, { root: true })
      const postUrl = location.origin + '/save'
      await axios.post(
        postUrl,
        {
          imageName: rootState.image.imageName,
          annotationData: rootState.annotation.project
        }
      )
      dispatch('app/activateSnackbar', {
        text: 'Saved annotation data',
        color: 'success'
      }, { root: true })
    } catch (err) {
      dispatch('app/activateSnackbar', {
        text: 'Annotation data could not be saved',
        color: 'error'
      }, { root: true })
    }
  },

  async getAnnotation ({
    commit,
    rootState
  }) {
    const dataLocation = location.origin + '/data/annotations/' + rootState.image.imageName + '.json'
    try {
      const response = await axios.get(dataLocation)
      commit('annotation/loadAnnotation', response.data, { root: true })
    } catch (err) {
      console.log('Annotation data either could not be found or could not be loaded')
    }
  }
}
