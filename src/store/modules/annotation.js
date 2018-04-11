// This file handles the management of the state for the annotations.
// The annotation layers are controled via the PaperJS lib.
import paper from 'paper'

const state = {
  paperScope: {
    project: {
      layers: []
    }
  }
}

const getters = {
  // Get a JSON object describing the current state of the PaperJS project.
  // Using a hack to get past the fact it might not initially be defined with
  // the if check for paperscope version.
  getAnnotationProjectJSON: state => {
    if (state.paperScope.version) {
      return state.paperScope.project.exportJSON()
    }
  }
}

const actions = {
  initialiseAnnotation: ({ commit }, payload) => {
    commit('initialiseAnnotation', payload)
  },

  loadAnnotation: ({ commit }, payload) => {
    commit('loadAnnotation', payload)
  },

  loadProject: ({ commit }, payload) => {
    commit('loadProject', payload)
  },

  exportLayerJSON: ({ commit }, layer) => {
    commit('exportLayerJSON', layer)
  },

  prepareCanvas: ({ commit }, payload) => {
    commit('prepareCanvas', payload)
  },

  newLayer: ({ commit }, payload) => {
    commit('newLayer', payload)
  },

  setActiveLayer: ({ commit }, layerID) => {
    commit('setActiveLayer', layerID)
  }
}

const mutations = {
  // Setup the PaperJs instance on the canvas DOM element.
  initialiseAnnotation: (state, payload) => {
    state.paperScope = paper.setup(document.getElementById('paper-canvas'))
  },

  // Loads a PaperJS project JSON string into the current PaperScope
  loadAnnotation: (state, payload) => {
    state.paperScope.project.importJSON(payload)
  },

  // Load a new PaperJS JSON string representing new project data into the
  // paperJS instance
  loadProject: (state, payload) => {
    state.paperScope.project.clear()
    state.paperScope.project.importJSON(payload)
  },

  // Export a PaperJS JSON string representing current state to the console.
  // If no payload param then default to exporting the whole PaperJS project.
  exportLayerJSON: (state, layer) => {
    console.log('Layer to be exported: ')
    console.log(layer.name)
    console.log(layer.exportJSON())
  },

  // Prepare the canvas for adding annotations.
  prepareCanvas: (state, payload) => {
    // Remove the class that interupts the pointer interaction.
    if (state.paperScope.view.element.classList.contains('pointers-no')) {
      state.paperScope.view.element.classList.remove('pointers-no')
    }
  },

  // Add a new layer to the annotation project.
  newLayer: (state, payload) => {
    let newLayerIndex = state.paperScope.project.layers.length + 1
    let newLayer = new paper.Layer({
      name: 'Layer ' + newLayerIndex,
      position: state.paperScope.view.center
    })

    // Error check in the console to make sure that the new layer was created
    // and then activated properly.
    console.assert(paper.project.activeLayer === newLayer,
      'New Layer was not created/activated correctly')
  },

  // Set specified layer to be active
  setActiveLayer: (state, id) => {
    let layer = state.paperScope.project.layers[id - 1]
    layer.activate()
  }
}

// Export all of the relevent logic so that it can be combined with the complete
// store and all other module logic.
export default {
  state,
  getters,
  actions,
  mutations
}
