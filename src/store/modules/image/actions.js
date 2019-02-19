export default {
  addOSDImage: ({
    commit
  }, payload) => {
    commit('addOSDImage', payload)
  },

  clearImages: ({
    commit
  }) => {
    commit('clearImages')
  },

  setProjectImageName: ({
    commit
  }, projectImageName) => {
    commit('setProjectImageName', projectImageName)
  },

  setupOsdCanvas: ({
    commit
  }, payload) => {
    commit('setupOsdCanvas', payload)
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

  setActiveChannelOpacity: ({
    commit
  }, payload) => {
    commit('setActiveChannelOpacity', payload)
  },

  setActiveChannelName: ({
    commit
  }, payload) => {
    commit('setActiveChannelName', payload)
  },

  setZoom: ({
    commit
  }, payload) => {
    commit('setZoom', payload)
  }
}
