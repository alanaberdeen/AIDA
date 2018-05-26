// This file handles the management of the state for the annotations.
// The annotation layers are controlled via the PaperJS lib.
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
  refreshState: ({
    commit
  }, payload) => {
    commit('refreshState', payload)
  },

  setupAnnotation: ({
    commit
  }, payload) => {
    commit('setupAnnotation', payload)
  },

  loadAnnotation: ({
    commit
  }, payload) => {
    commit('loadAnnotation', payload)
  },

  exportLayerJSON: ({
    commit
  }, layer) => {
    commit('exportLayerJSON', layer)
  },

  prepareCanvas: ({
    commit
  }, payload) => {
    commit('prepareCanvas', payload)
  },

  newLayer: ({
    commit
  }, payload) => {
    commit('newLayer')
  },

  setActiveLayer: ({
    commit,
    dispatch
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)

    // Also, store the new active layer in the config
    dispatch('setConfigActiveLayer', layerIndex)
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

  deleteLayer: ({
    commit
  }, payload) => {
    commit('deleteLayer', payload)
  }
}

const mutations = {
  // Refresh the Vuex store state with the current paperJS project representation
  refreshState: (state, payload) => {
    state.project = paper.project.exportJSON({
      asString: false,
      precision: 5
    })
  },

  // Setup the PaperJs instance on the canvas DOM element.
  setupAnnotation: (state, canvas) => {
    paper.setup(canvas)
  },

  // Load a new PaperJS JSON string representing new project data into the
  // paperJS instance
  loadAnnotation: (state, payload) => {
    paper.project.importJSON(payload)
    state.project = paper.project.exportJSON({
      asString: false,
      precision: 5
    })
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
    // Remove the class that interrupts the pointer interaction.
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
    state.project = paper.project.exportJSON({
      asString: false,
      precision: 5
    })
  },

  // Set specified layer to be active
  setActiveLayer: (state, index) => {
    paper.project.layers[index].activate()
  },

  // Set the opacity of the active layer
  setLayerOpacity: (state, payload) => {
    let newOpacity
    // Check if keyboard event. This happens in the case that the user types
    // the opacity value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newOpacity = payload.target.value / 100
    } else {
      newOpacity = payload / 100
    }

    // Check if within range
    if (newOpacity > 1) {
      newOpacity = 1
    } else if (payload < 0) {
      newOpacity = 0
    }

    // Set opacity
    paper.project.activeLayer.opacity = newOpacity

    // Save changed opacity to the Vuex state.
    // Watch out for Vue Change Detection Caveats: isn't reactive to new
    // attributes being added to an object. Use Vue.set to get around this.
    Vue.set(state.project[paper.project.activeLayer.index][1], 'opacity', newOpacity)
  },

  // Set the name of the active layer
  setLayerName: (state, payload) => {
    let newName
    // Check if keyboard event. This happens in the case that the user types
    // the opacity value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newName = payload.target.value
    } else {
      newName = payload
    }

    // Set name
    paper.project.activeLayer.name = newName

    // Save changes to Vuex state
    Vue.set(state.project[paper.project.activeLayer.index][1], 'name', newName)
  },

  // Remove active layer
  deleteLayer: (state, payload) => {
    // Remove from Vuex state
    state.project.splice(paper.project.activeLayer.index, 1)

    // Remove from paperJS project
    paper.project.activeLayer.remove()
  }
}

// Export all of the relevant logic so that it can be combined with the complete
// store and all other module logic.
export default {
  state,
  getters,
  actions,
  mutations
}
