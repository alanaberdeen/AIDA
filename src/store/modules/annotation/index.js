// This module handles the management of the annotation state.

// Import sub files
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  project: {
    name: 'An AIDA project',
    layers: []
  },
  defaultColors: [{
    stroke: {
      alpha: 1,
      hue: 170,
      lightness: 0.69,
      saturation: 0.44
    },
    fill: {
      alpha: 0.7,
      hue: 170,
      lightness: 0.69,
      saturation: 0.44
    }
  },
  {
    stroke: {
      alpha: 1,
      hue: 6,
      lightness: 0.72,
      saturation: 0.94
    },
    fill: {
      alpha: 0.7,
      hue: 6,
      lightness: 0.72,
      saturation: 0.94
    }
  },
  {
    stroke: {
      alpha: 1,
      hue: 60,
      lightness: 0.85,
      saturation: 1
    },
    fill: {
      alpha: 0.7,
      hue: 60,
      lightness: 0.85,
      saturation: 1
    }
  },
  {
    stroke: {
      alpha: 1,
      hue: 190,
      lightness: 0.79,
      saturation: 0.3
    },
    fill: {
      alpha: 0.7,
      hue: 190,
      lightness: 0.79,
      saturation: 0.3
    }
  },
  {
    stroke: {
      alpha: 1,
      hue: 6,
      lightness: 0.72,
      saturation: 0.94
    },
    fill: {
      alpha: 0.7,
      hue: 6,
      lightness: 0.72,
      saturation: 0.94
    }
  },
  {
    stroke: {
      alpha: 1,
      hue: 205,
      lightness: 0.66,
      saturation: 0.49
    },
    fill: {
      alpha: 0.7,
      hue: 205,
      lightness: 0.66,
      saturation: 0.49
    }
  }
  ],
  selectedItems: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
