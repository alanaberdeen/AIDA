// Manage the vuex state for actions that are common to multiple modules.
import axios from 'axios'
import paper from 'paper'
import readOldSchema from './readOldSchema'

const state = {
  projectEndpoint: ''
}

const actions = {
  resetStateToDefault: ({
    dispatch
  }) => {
    dispatch('editor/resetEditorState', '', {
      root: true
    })
    dispatch('annotation/resetAnnotationState', '', {
      root: true
    })
    dispatch('image/resetImageState', '', {
      root: true
    })
  },

  loadProject: ({
    dispatch,
    commit
  }, payload) => {
    // Construct endpoint from which to pull the data from and save to state
    let endpoint = 'https://aida-testing.firebaseio.com/' + payload + '.json '
    commit('setProjectEndpoint', endpoint)

    axios
      .get(endpoint)
      // Update the editor.js state
      .then(function (response) {
        // Check if data loaded is of the old format (it will have config prop
        // at the highest level) and if so use the helper function to translate
        // the content into the new schema before loading
        let config = response.data
        if (response.data.config) {
          config = readOldSchema(response.data.config)
        }

        // Load the editor configuration
        dispatch('editor/loadConfig', config.editor, {
          root: true
        }).then(() => {
          dispatch('synchroniseAnnotationAndOSDCanvas')
        })

        // Load the images into the viewer
        dispatch('image/loadImages', config.images, {
          root: true
        })

        // Load the PaperJS project representation of the annotation data
        dispatch('annotation/loadAnnotation', config.annotation, {
          root: true
        })
      })
      .catch(function (error) {
        console.log(`Could not load all data from external source. Returned the following error: \n \n` + error)
      })
  },

  saveProject: ({
    state,
    rootState,
    dispatch
  }, payload) => {
    dispatch('annotation/refreshAnnotationState', '', {
      root: true
    }).then(() => {
      let endpoint = state.projectEndpoint

      axios
        .put(endpoint, {
          editor: rootState.editor,
          annotation: rootState.annotation.project,
          images: rootState.image.images
        }).then(function (response) {
          console.log('Saved State.\nStatus response: ' + response.statusText)
          console.log(response)

          if (payload.notification) {
            dispatch('app/activateSnackbar', {
              text: 'Success: the annotations were successfully saved.',
              color: 'success'
            }, {
              root: true
            })
          }
        })
        .catch(function (error) {
          console.log(`Could not save state: \nReturned following Error: \n` + error)

          if (payload.notification) {
            dispatch('app/activateSnackbar', {
              text: 'Error: the annotations could not be saved.',
              color: 'error'
            }, {
              root: true
            })
          }
        })
    })
  },

  synchroniseAnnotationAndOSDCanvas: ({
    commit,
    rootState
  }) => {
    commit('synchroniseAnnotationAndOSDCanvas', {
      viewer: rootState.image.OSDviewer,
      strokeScale: rootState.editor.strokeScale
    })
  },

  setActiveStepAndLayer: ({
    dispatch
  }, index) => {
    dispatch('setActiveLayer', index)
    dispatch('setActiveStep', index)
  }
}

const mutations = {
  // Add a handler function that will run when osd-viewport is updated.
  // This will synchronously update the paperJS viewport.
  // This is an expensive operation as it ensures all parameters are in sync
  // on every viewport update. For example, zoom may not have changed but it
  // would still fire this event and update the zoom. However, separating into
  // the individual parts led to a far less smooth experience. Leave it here
  // for now at least.
  synchroniseAnnotationAndOSDCanvas: (state, payload) => {
    let viewer = payload.viewer
    let strokeScale = payload.strokeScale

    viewer.addHandler('update-viewport', function () {
      let viewportZoom = viewer.viewport.getZoom(true)
      let image1 = viewer.world.getItemAt(0)
      paper.view.zoom = image1.viewportToImageZoom(viewportZoom)

      let center = image1.viewportToImageCoordinates(
        viewer.viewport.getCenter(true)
      )
      paper.view.center = new paper.Point(center.x, center.y)

      // Update paths to have strokeWidth reactive to zoom level.
      // TODO: consider the computational expensive of this and find a more
      // effectively method of handling it.
      paper.project.getItems({
        class: paper.Path
      }).map(path => {
        path.strokeWidth = (image1.getContentSize().x * strokeScale) / (viewportZoom * 1000)
      })
    })
  },

  setProjectEndpoint: (state, projectEndpoint) => {
    state.projectEndpoint = projectEndpoint
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
