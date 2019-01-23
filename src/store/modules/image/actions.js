export default {
  addImageToState: ({
    commit
  }, payload) => {
    commit('addImageToState', payload)
  },

  setupOsdCanvas: ({
    commit
  }, payload) => {
    commit('setupOsdCanvas', payload)
  },

  addImageToCanvas: ({
    commit
  }) => {
    commit('addImageToCanvas')
  },

  resetImageState: ({
    commit,
    rootState
  }) => {
    commit('resetImageState', rootState)
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
      activeChannel: rootState.app.activeChannel,
      rootState: rootState
    })
  },

  setChannelName: ({
    commit
  }, payload) => {
    commit('setChannelName', payload)
  },

  setZoom: ({
    commit
  }, payload) => {
    commit('setZoom', payload)
  }
}
