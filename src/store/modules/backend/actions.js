import convert from 'xml-js'
import path from 'path'

export default {
  loadProject: async ({
    state,
    dispatch
  }) => {
    // Clear any images in the current vuex state.
    await dispatch('image/clearImages', null, { root: true })

    // Sync
    await dispatch('app/synchroniseAnnotationAndOSDCanvas', null, { root: true })

    // Load project data
    if (!state.projectFilePath.endsWith('.json')) {
      dispatch('getDefaultImageAnnotation')
      dispatch('getProjectImage')
      return
    }
    try {
      const dataLocation = `${location.origin}/data/${state.projectFilePath}`
      const response = await fetch(dataLocation)
      const project = await response.json()

      // Check for a specified annotation file, if found load it up.
      try {
        if (Object.prototype.hasOwnProperty.call(project, 'annotation')) {
          const annotationFilePath = project.annotation
          dispatch('setAnnotationFilePath', annotationFilePath)

          const response = await fetch(`${location.origin}/data/annotations/${annotationFilePath}`)
          const annotation = await response.json()
          dispatch('annotation/loadAnnotation', annotation, { root: true })
        }
      } catch (err) {
        dispatch('getDefaultImageAnnotation')
      }

      try {
        const iiifImageTypes = ['.tif', '.tiff', '.czi', '.dcm', '.dicom', '.ndpi', '.qptiff', '.scn', '.svs', '.vsi', '.jp2', '.j2k']
        // Load project images
        if (Object.prototype.hasOwnProperty.call(project, 'images')) {
          project.images.forEach(image => {
            const ext = path.extname(image.path)
            if (iiifImageTypes.includes(ext)) {
              dispatch('image/addOSDImage', {
                name: image.name,
                fileType: 'iiif',
                source: image.path,
                function: 'project',
                opacity: 1
              }, { root: true })
            } else if (ext === '.dzi') {
              dispatch('image/addOSDImage', {
                name: image.name,
                fileType: 'dzi',
                source: `${location.origin}/data/images/${image.path}`,
                function: 'project',
                opacity: 1
              }, { root: true })

              // dispatch('getProjectImageProperties')
            } else {
              dispatch('image/addOSDImage', {
                name: image.name,
                fileType: 'simple',
                source: `${location.origin}/data/images/${image.path}`,
                function: 'project',
                opacity: 1
              }, { root: true })
            }
          })
        }

        // Load project editor configuration
        if (Object.prototype.hasOwnProperty.call(project, 'editor')) {
          dispatch('app/loadEditorConfig', project.editor, { root: true })
        }
      } catch (err) {
        dispatch('getProjectImage')
      }
    } catch (err) {
      dispatch('getDefaultImageAnnotation')
      dispatch('getProjectImage')
    }
  },

  setAnnotationFilePath: ({
    commit
  }, payload) => {
    commit('setAnnotationFilePath', payload)
  },

  async saveProject ({
    dispatch,
    state,
    rootState
  }) {
    try {
      // Ensure all the paperJS items are included in the vuex state
      await dispatch('annotation/refreshAnnotationState', null, { root: true })

      // Post API request.
      const postUrl = `${location.origin}/save`

      const response = await fetch(postUrl, {
        method: 'POST',
        body: JSON.stringify({
          editor: {
            activeImageIndex: rootState.image.activeImageIndex,
            activeStep: rootState.app.activeStep,
            activeLayerIndex: rootState.app.activeLayerIndex,
            type: rootState.app.type,
            steps: rootState.app.steps
          },
          annotation: {
            data: rootState.annotation.project,
            filePath: state.annotationFilePath
          },
          images: rootState.image.images
        })
      })

      if (response.status === 200) {
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
      } else {
        throw response.statusText
      }
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

  async getDefaultImageAnnotation ({
    state,
    dispatch
  }) {
    const ext = path.extname(state.projectFilePath)
    const filePath = state.projectFilePath.split(ext)[0].split('images/')[1]
    const annotationLocation = `${location.origin}/data/annotations/${filePath}.json`
    try {
      const response = await fetch(annotationLocation)
      const annotationData = await response.json()
      dispatch('annotation/loadAnnotation', annotationData, { root: true })
    } catch (err) {
      // console.log('Annotation data either could not be found or could not be loaded')
      // console.log('Loading the default empty project')
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
    const iiifImageTypes = ['.tif', '.tiff', '.czi', '.dcm', '.dicom', '.ndpi', '.qptiff', '.scn', '.svs', '.vsi', '.jp2', '.j2k']
    const ext = path.extname(state.projectFilePath)
    if (iiifImageTypes.includes(ext)) {
      dispatch('image/addOSDImage', {
        name: rootState.image.projectImageName,
        fileType: 'iiif',
        source: state.projectFilePath,
        function: 'project',
        opacity: 1
      }, { root: true })
    } else if (state.projectFilePath.endsWith('.dzi')) {
      // Set image type by checking for .dzi in the fileName
      dispatch('image/addOSDImage', {
        name: rootState.image.projectImageName,
        fileType: 'dzi',
        source: `${location.origin}/data/${state.projectFilePath}`,
        function: 'project',
        opacity: 1
      }, { root: true })
      // dispatch('getProjectImageProperties')
    } else {
      dispatch('image/addOSDImage', {
        name: rootState.image.projectImageName,
        fileType: 'simple',
        source: `${location.origin}/data/${state.projectFilePath}`,
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
    const propsLocation = `${location.origin}/data/${state.projectFilePath.slice(0, -4)}_files/vips-properties.xml`

    // Fetch data and convert to jsObject
    const propertiesFile = await fetch(propsLocation)
    const data = JSON.parse(convert.xml2json(
      await propertiesFile.text(),
      {
        ignoreDeclaration: true,
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
