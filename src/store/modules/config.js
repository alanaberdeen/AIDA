// This file handles the management of the state for the annotation tool.
// This specifies the layout of the annotation interface. This may include
// the required steps and instructions, the tools necessary to complete
// the annotations or the default image and annotation content.
import axios from 'axios'
import Vue from 'vue'

const state = {}

const getters = {
  // Get an array specifiying the tools included in the current step.
  getConfigStepTools: state => {
    if (state.steps) {
      return state.steps[state.activeStep - 1].tools
    } else {
      return []
    }
  },

  // Get an object that specifies the default color for annotatations in this
  // step.
  getDefaultColor: state => {
    if (state.steps) {
      return state.steps[state.activeStep - 1].color
    } else {
      return {
        fill: {
          alpha: 0,
          hue: 170,
          lightness: 0.5,
          saturation: 1
        },
        stroke: {
          alpha: 0,
          hue: 170,
          lightness: 0.5,
          saturation: 1
        }
      }
    }
  }
}

const actions = {
  // Load a configuration into the tool.
  // May perform asynchronous tasks here (like pulling from REST API) before
  // committing the state mutation which must run synchronously.
  loadConfig: ({ state, rootState, commit, dispatch }, newConfig) => {
    axios
      .get('https://aida-testing.firebaseio.com/.json')

      // Update the config.js state
      .then(function (response) {
        commit('loadConfig', {
          rootState: rootState,
          newConfig: response.data.config
        })

        // Update the PaperJS project representation
        dispatch('loadProject', response.data.config.annotation, { root: true })

        // Update the OpenSeaDragon image channels
        dispatch('addImages', response.data.config.channels, { root: true })
      })
      .catch(function (error) {
        console.log('Could not read data from external source.')
        console.log('Returned the following error: ')
        console.log(error)
      })
  },

  addImage: ({ commit }, payload) => {
    commit('addImage', payload)
  },

  // Action dispatches events to set both the active step and the active layer
  // ensuring that they are in sync.
  setActiveStepAndLayer: ({ dispatch }, step) => {
    dispatch('setActiveLayer', step)
    dispatch('setActiveStep', step)
  },

  setActiveStep: ({ commit }, step) => {
    commit('setActiveStep', step)
  },

  // Save the current configuration to the server.
  saveConfig: ({ dispatch, commit, state }) => {
    // Update the config and then save to RestAPI
    dispatch('updateConfig', state).then(() => {
      // Here is where we would push to REST API
      // ****** Save to API *****
      axios
        .put('https://aida-testing.firebaseio.com/.json', {
          config: state
        })
        .then(function (response) {
          console.log(response)
        })
    })
  },

  updateConfig: ({ dispatch, commit, rootState, rootGetters }) => {
    let newAnnotations = rootGetters.getAnnotationProjectJSON
    commit('updateConfig', newAnnotations)
  }
}

const mutations = {
  addImage: (state, payload) => {
    state.channels.push()
  },

  setActiveStep: (state, step) => {
    state.activeStep = step
  },

  updateConfig: (state, newAnnotations) => {
    state.annotation = newAnnotations
  },

  loadConfig: (state, payload) => {
    Vue.set(payload.rootState, 'config', payload.newConfig)
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
