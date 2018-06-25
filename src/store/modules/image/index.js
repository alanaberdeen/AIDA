// This file handles the management of the image viewer state.
// The image viewer is controlled via OpenSeaDragonJS.

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  OSDviewer: null,
  OSDworld: null,
  images: [],
  activeChannel: 0,
  view: {
    viewSize: [null, null],
    imageSize: [null, null],
    imageCenter: [null, null],
    imageZoom: null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
