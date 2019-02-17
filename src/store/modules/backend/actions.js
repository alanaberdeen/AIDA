import axios from 'axios'

export default {
  async getArrayOfImages ({
    commit
  }) {
    try {
      await axios.post(location.origin + '/checkForImages')
      const pathToArrayOfImagesFile = location.origin + '/data/images.json'
      const arrayOfImagesFile = await axios.get(pathToArrayOfImagesFile)
      commit('setAvailableImages', arrayOfImagesFile.data)
    } catch (err) {
      console.log(err)
    }
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
      console.log(err)
      dispatch('app/activateSnackbar', {
        text: 'Annotation data could not be saved',
        color: 'error'
      }, { root: true })
    }
  },

  async getAnnotation ({
    commit,
    dispatch,
    rootState
  }) {
    const dataLocation = location.origin + '/annotations/' + rootState.image.imageName + '.json'
    try {
      const response = await axios.get(dataLocation)
      commit('annotation/loadAnnotation', response.data, { root: true })

      // If there are overlay images specified then we need to trigger
      // openseadragon to load these on top of the image.
      if (response.data.overlays) {
        response.data.overlays.forEach(overlay => {
          dispatch('image/addOSDImage', {
            type: overlay.type,
            source: overlay.source,
            name: overlay.name
          }, { root: true })
        })
      }
    } catch (err) {
      console.log('Annotation data either could not be found or could not be loaded')
    }
  },

  setProjectFileName ({
    commit
  }, payload) {
    commit('setProjectFileName', payload)
  },

  getProjectImage ({
    state,
    dispatch
  }) {
    // Set image type by checking for .dzi in the fileName
    if (state.projectFileName.indexOf('.dzi') > -1) {
      dispatch('image/addOSDImage', {
        name: state.projectFileName,
        type: 'dzi',
        source: location.origin + '/images/' + state.projectFileName
      }, { root: true })
    } else {
      dispatch('image/addOSDImage', {
        name: state.projectFileName,
        type: 'simple',
        source: location.origin + '/images/' + state.projectFileName
      }, { root: true })
    }
  }
}
