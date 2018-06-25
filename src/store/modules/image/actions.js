export default {
  resetImageState: ({
    commit,
    rootState
  }) => {
    commit('resetImageState', rootState)
  },

  setupOSDCanvas: ({
    commit
  }, payload) => {
    commit('setupOSDCanvas', payload)
  },

  // Load the images into the state and then add them to the appropriate OSDviewer
  loadImages: ({
    state,
    dispatch
  }, images) => {
    // Add the new images to the state and the OSD
    dispatch('addImagesToState', images).then(() => {
      // Add each image to the OSD viewer
      for (let i in images) {
        dispatch('addOSDImage', images[i])
      }
    })
  },

  addImagesToState: ({
    commit
  }, images) => {
    commit('addImagesToState', images)
  },

  addOSDImage: ({
    commit
  }, image) => {
    commit('addOSDImage', image)
  },

  setActiveChannel: ({
    commit
  }, payload) => {
    commit('setActiveChannel', payload)
  },

  toggleChannelOpacity: ({
    commit
  }, payload) => {
    commit('toggleChannelOpacity', payload)
  },

  setChannelOpacity: ({
    commit,
    rootState
  }, payload) => {
    commit('setChannelOpacity', {
      input: payload,
      activeChannel: rootState.editor.activeChannel,
      rootState: rootState
    })
  },

  setChannelName: ({
    commit,
    rootState
  }, payload) => {
    commit('setChannelName', payload)
  },

  setZoom: ({
    commit
  }, payload) => {
    commit('setZoom', payload)
  }
}
