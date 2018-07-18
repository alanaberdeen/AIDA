// This file handles the Vuex state changes that are either common, or involve
// using more than one of the different parts: annotation, editor and image.
import axios from 'axios'
import paper from 'paper'

// Import helper functions
import readOldSchema from './readOldSchema'

const state = {
  projectEndpoint: ''
}

const actions = {
  // Reset Vuex state to default
  resetState: ({
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

  // Load a project into AIDA.
  loadProject: ({
    dispatch,
    commit
  }, payload) => {
    // Construct endpoint from which to pull the data from and save to state
    let endpoint = 'https://aida-private.firebaseio.com/' + payload + '.json '
    commit('setProjectEndpoint', endpoint)

    // Pull latest test project from REST api
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

  // Save AIDA project to REST API
  saveProject: ({
    state,
    rootState,
    dispatch
  }) => {
    dispatch('annotation/refreshAnnotationState', '', {
      root: true
    }).then(() => {
      // Declare saving endpoint
      let endpoint = state.projectEndpoint

      axios
        .put(endpoint, {
          editor: rootState.editor,
          annotation: rootState.annotation.project,
          images: rootState.image.images
        }).then(function (response) {
          console.log(response)
        })
    })
  },

  // Install event hooks to keep the annotations and the OSDcanvas in sync when
  // panning or zooming.
  synchroniseAnnotationAndOSDCanvas: ({
    state,
    commit,
    rootState
  }) => {
    commit('synchroniseAnnotationAndOSDCanvas', rootState.image.OSDviewer)
  },

  // Dispatch mutations to set both the active step and the active layer,
  // ensuring that they are in sync.
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
  synchroniseAnnotationAndOSDCanvas: (state, viewer) => {
    // Add functionality that is triggered by the 'update-viewport' event
    viewer.addHandler('update-viewport', function () {
      // Match changes in zoom level
      let viewportZoom = viewer.viewport.getZoom(true)
      let image1 = viewer.world.getItemAt(0)
      paper.view.zoom = image1.viewportToImageZoom(viewportZoom)

      // Ensure the same center point
      let center = image1.viewportToImageCoordinates(
        viewer.viewport.getCenter(true)
      )
      paper.view.center = new paper.Point(center.x, center.y)

      // Update paths to have strokeWidth reactive to zoom level.
      // This might be computationally-expensive but will try for now.
      // TODO: consider the computational expensive of this and find a more
      // effectively method of handling it. Additionally, the hard coded 500
      // is clearly a temporary fix here.
      paper.project.layers.forEach(layer => {
        layer.children.forEach(child => {
          if (child.className === 'Path') {
            child.strokeWidth = image1.getContentSize().x / (viewportZoom * 300)
          }
        })
      })
    })
  },

  setProjectEndpoint: (state, projectEndpoint) => {
    state.projectEndpoint = projectEndpoint
  }
}

// Export all of the relevant logic so that it can be combined with the
// respective parts in the other modules and complete the store.
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
