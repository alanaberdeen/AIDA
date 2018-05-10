// This file handles the management of the state for the annotations.
// The annotation layers are controled via the PaperJS lib.
import paper from 'paper'
import Vue from 'vue'

const state = {
  project: [
    [
      'Layer',
      {
        'name': 'Layer 1',
        'applyMatrix': true
      }
    ]
  ]
}

const getters = {}

const actions = {
  setupAnnotation: ({ commit }, payload) => {
    commit('setupAnnotation', payload)
  },

  loadAnnotation: ({ commit }, payload) => {
    commit('loadAnnotation', payload)
  },

  exportLayerJSON: ({ commit }, layer) => {
    commit('exportLayerJSON', layer)
  },

  prepareCanvas: ({ commit }, payload) => {
    commit('prepareCanvas', payload)
  },

  newLayer: ({ commit }, payload) => {
    commit('newLayer')
  },

  setActiveLayer: ({ commit }, layerID) => {
    commit('setActiveLayer', layerID)
  },

  setLayerOpacity: ({ commit }, payload) => {
    commit('setLayerOpacity', payload)
  }
}

const mutations = {
  // Setup the PaperJs instance on the canvas DOM element.
  setupAnnotation: (state, canvas) => {
    paper.setup(canvas)
  },

  // Load a new PaperJS JSON string representing new project data into the
  // paperJS instance
  loadAnnotation: (state, payload) => {
    paper.project.importJSON(payload)
    state.project = paper.project.exportJSON({asString: false, precision: 5})
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
    if (paper.view.element.classList.contains('pointers-no')) {
      paper.view.element.classList.remove('pointers-no')
    }
  },

  // Add a new layer to the annotation project.
  newLayer: state => {
    let newLayer = new paper.Layer({
      name: 'Layer ' + (paper.project.layers.length + 1),
      position: paper.view.center
    })
    console.log(newLayer)

    // Update the store with the new project representation
    state.project = paper.project.exportJSON({ asString: false, precision: 5 })
  },

  // Set specified layer to be active
  setActiveLayer: (state, id) => {
    paper.project.layers[id - 1].activate()
  },

  // Set the opactiy of a specific layer
  setLayerOpacity: (state, payload) => {
    // Change opacity
    paper.project.activeLayer.opacity = payload

    // Save changed opacity to the Vuex state.
    // Watch out for Vue Change Detection Caveats: isn't reactive to new
    // attributes being added to an object. Use Vue.set to get around this.
    Vue.set(state.project[paper.project.activeLayer.index][1], 'opacity', payload)
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
