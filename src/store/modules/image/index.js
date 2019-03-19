import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  OSDviewer: null,
  OSDworld: null,
  activeChannelIndex: 0,
  // This refers to the **main** image in the project - the subject.
  projectImageName: '',
  // This is an array of al the images. It may include overlays on differnt
  // channels.
  images: [],
  // The scale factor for the image. To determine real dimensions.
  pixelScaleFactor: {
    mppX: null,
    mppY: null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
