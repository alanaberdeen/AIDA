import axios from 'axios'
import convert from 'xml-js'
import path from 'path'

export default {
  loadProject: async ({
    dispatch
  }) => {
    // Clear any images in the current vuex state.
    await dispatch('image/clearImages', null, { root: true })

    // Sync
    await dispatch('app/synchroniseAnnotationAndOSDCanvas', null, { root: true })

    // Get project
    const response = await window.fetch('http://localhost:3000/data/projects/nasullah.json')
    const project = await response.json()

    // Load project annotation
    if (project.hasOwnProperty('annotation')) {
      dispatch('annotation/loadAnnotation', project.annotation, { root: true })
    }

    // Load project images
    if (project.hasOwnProperty('images')) {
      project.images.forEach(image => {
        if (image.source.indexOf('.dzi') > -1) {
          dispatch('image/addOSDImage', {
            name: image.name,
            fileType: 'dzi',
            source: image.source,
            function: 'project',
            opacity: 1
          }, { root: true })

          // dispatch('getProjectImageProperties')
        } else {
          dispatch('image/addOSDImage', {
            name: image.name,
            fileType: 'simple',
            source: image.source,
            function: 'project',
            opacity: 1
          }, { root: true })
        }
      })
    }

    // Load project editor configuration
    if (project.hasOwnProperty('editor')) {
      dispatch('app/loadEditorConfig', project.editor, { root: true })
    }
  },

  async getArrayOfImages ({
    commit
  }) {
    try {
      await axios.post(location.origin + '/checkForImages')
      const pathToImagesFile = location.origin + '/data/images.json'
      const imagesFile = await axios.get(pathToImagesFile)
      commit('setAvailableImages', imagesFile.data)
    } catch (err) {
      console.log(err)
    }
  },

  async saveProject ({
    dispatch,
    rootState
  }) {
    try {
      // Ensure all the paperJS items are included in the vuex state
      await dispatch('annotation/refreshAnnotationState', null, { root: true })

      // Post API request.
      const postUrl = location.origin + '/save'
      await axios.post(
        postUrl,
        {
          editor: {
            activeChannel: rootState.image.activeChannelIndex,
            activeStep: rootState.app.activeStep,
            activeLayer: rootState.app.activeLayer,
            type: rootState.app.type,
            steps: rootState.app.setps
          },
          annotation: rootState.annotation.project,
          images: rootState.image.images
        }
      )

      // Activate notification
      dispatch('app/activateSnackbar', {
        text: 'Saved annotation data',
        color: 'success'
      }, { root: true })

      // Set annotation save state
      dispatch('annotation/setSaveState', {
        changesSaved: true,
        lastSaveTimeStamp: new Date()
      }, { root: true })

    // Handle errors
    } catch (err) {
      try {
        // Save to local browser storage
        window.localStorage.setItem('annotation', JSON.stringify(rootState.annotation.project))

        // Activate notification
        dispatch('app/activateSnackbar', {
          text: 'Could not reach server, data saved in browser',
          color: 'warning'
        }, { root: true })

        // Set annotation save state
        dispatch('annotation/setSaveState', {
          changesSaved: true,
          lastSaveTimeStamp: new Date()
        }, { root: true })
      } catch (err) {
        dispatch('app/activateSnackbar', {
          text: 'Annotation data could not be saved',
          color: 'error'
        }, { root: true })
      }
    }
  },

  async saveAnnotation ({
    state,
    dispatch,
    rootState
  }) {
    try {
      // Ensure all the paperJS items are included in the vuex state
      await dispatch('annotation/refreshAnnotationState', null, { root: true })

      // Post API request.
      const postUrl = location.origin + '/save'
      await axios.post(
        postUrl,
        {
          projectFilePath: state.projectFilePath,
          annotationData: rootState.annotation.project
        }
      )

      // Activate notification
      dispatch('app/activateSnackbar', {
        text: 'Saved annotation data',
        color: 'success'
      }, { root: true })

      // Set annotation save state
      dispatch('annotation/setSaveState', {
        changesSaved: true,
        lastSaveTimeStamp: new Date()
      }, { root: true })

    // Handle errors
    } catch (err) {
      try {
        // Save to local browser storage
        window.localStorage.setItem('annotation', JSON.stringify(rootState.annotation.project))

        // Activate notification
        dispatch('app/activateSnackbar', {
          text: 'Could not reach server, data saved in browser',
          color: 'warning'
        }, { root: true })

        // Set annotation save state
        dispatch('annotation/setSaveState', {
          changesSaved: true,
          lastSaveTimeStamp: new Date()
        }, { root: true })
      } catch (err) {
        dispatch('app/activateSnackbar', {
          text: 'Annotation data could not be saved',
          color: 'error'
        }, { root: true })
      }
    }
  },

  async getAnnotation ({
    state,
    dispatch
  }) {
    const ext = path.extname(state.projectFilePath)
    const filePath = state.projectFilePath.split(ext)[0]
    const dataLocation = location.origin + '/annotations/' + filePath + '.json'
    try {
      const response = await axios.get(dataLocation)
      dispatch('annotation/loadAnnotation', response.data, { root: true })
    } catch (err) {
      console.log('Annotation data either could not be found or could not be loaded')
      console.log('Loading the default empty project')
      dispatch('annotation/loadAnnotation', null, { root: true })
    }
  },

  setProjectFilePath ({
    commit
  }, payload) {
    commit('setProjectFilePath', payload)
  },

  async getProjectImage ({
    state,
    rootState,
    dispatch
  }) {
    // Clear any images in the current vuex state.
    await dispatch('image/clearImages', null, { root: true })

    // Set image type by checking for .dzi in the fileName
    if (state.projectFilePath.indexOf('.dzi') > -1) {
      dispatch('image/addOSDImage', {
        name: rootState.image.projectImageName,
        fileType: 'dzi',
        source: location.origin + '/images/' + state.projectFilePath,
        function: 'project',
        opacity: 1
      }, { root: true })

      // dispatch('getProjectImageProperties')
    } else {
      dispatch('image/addOSDImage', {
        name: rootState.image.projectImageName,
        fileType: 'simple',
        source: location.origin + '/images/' + state.projectFilePath,
        function: 'project',
        opacity: 1
      }, { root: true })
    }
  },

  // Check for a properites file. These files can be created by libvips when
  // building deepZoom images and contain useful metadata about the image.
  async getProjectImageProperties ({
    state,
    dispatch
  }) {
    // Construct path to file
    const propsLocation = location.origin + '/images/' +
                      state.projectFilePath.slice(0, -4) +
                      '_files/vips-properties.xml'

    // Fetch data and convert to jsObject
    const propertiesFile = await fetch(propsLocation)
    const data = JSON.parse(convert.xml2json(
      await propertiesFile.text(),
      { ignoreDeclaration: true,
        compact: true,
        ignoreComment: true,
        alwaysChildren: true,
        attributesKey: 'attributes',
        textKey: 'text'
      }
    ))

    // Extract relevant metrics
    const mppX = Number(data.image.properties.property.find(ele => {
      return ele.name.text === 'openslide.mpp-x'
    }).value.text)

    const mppY = Number(data.image.properties.property.find(ele => {
      return ele.name.text === 'openslide.mpp-y'
    }).value.text)

    // Dispatch methods for saving the scale
    dispatch('image/setPixelScaleFactor', { mppX, mppY }, { root: true })
  }
}
