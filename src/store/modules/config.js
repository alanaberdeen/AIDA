// This file handles the management of the state for the annotation tool.
// This specifies the layout of the annotation interface. This may include
// the required steps and instructions, the tools necessary to complete
// the annotations or the default image and annotation content.
import Vue from 'vue'

// Default configuration.
const state = {
  'type': 'dzi',
  'activeStep': 0,
  'activeLayer': 0,
  'activeChannel': 0,
  'steps': [{
    'ROI': false,
    'color': {
      'fill': {
        'alpha': 0.4,
        'hue': 170,
        'lightness': 0.5,
        'saturation': 0.7
      },
      'stroke': {
        'alpha': 1,
        'hue': 170,
        'lightness': 0.5,
        'saturation': 0.7
      }
    },
    'id': 1,
    'instruction': 'Instructions for Step 1: ',
    'tools': ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count', 'delete']
  }, {
    'ROI': false,
    'color': {
      'fill': {
        'alpha': 0.4,
        'hue': 350,
        'lightness': 0.5,
        'saturation': 0.7
      },
      'stroke': {
        'alpha': 1,
        'hue': 350,
        'lightness': 0.5,
        'saturation': 0.7
      }
    },
    'id': 2,
    'instruction': 'Instructions for Step 2',
    'tools': ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count', 'delete']
  }, {
    'ROI': false,
    'color': {
      'fill': {
        'alpha': 0.4,
        'hue': 20,
        'lightness': 0.5,
        'saturation': 0.7
      },
      'stroke': {
        'alpha': 1,
        'hue': 20,
        'lightness': 0.5,
        'saturation': 0.7
      }
    },
    'id': 3,
    'instruction': 'Instructions for Step 3:',
    'tools': ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count', 'delete']
  }]
}

const getters = {
  // Get an array specifying the tools included in the current step.
  getConfigStepTools: state => {
    if (state.steps) {
      return state.steps[state.activeStep].tools
    } else {
      return []
    }
  },

  // Get an object that specifies the default color for annotations in this
  // step.
  getDefaultColor: state => {
    if (state.steps) {
      return state.steps[state.activeStep].color
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
  setActiveStep: ({
    commit
  }, step) => {
    commit('setActiveStep', step)
  },

  setConfigActiveLayer: ({
    commit
  }, layerIndex) => {
    commit('setConfigActiveLayer', layerIndex)
  },

  loadConfig: ({
    commit,
    rootState
  }, payload) => {
    commit('loadConfig', {
      config: payload,
      rootState: rootState
    })
  }
}

const mutations = {
  setActiveStep: (state, stepIndex) => {
    state.activeStep = stepIndex
  },

  setConfigActiveLayer: (state, layerIndex) => {
    state.activeLayer = layerIndex
  },

  loadConfig: (state, payload) => {
    // Using Vue.set on the parent (rootState) to ensure that we don't fall into
    // the trap of Vue reactivity caveats.
    // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
    Vue.set(payload.rootState, 'config', payload.config)
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
