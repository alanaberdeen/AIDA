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

  setActiveChannelOpacity: ({
    state
  }, payload) => {
    // The opacity can be set by the 'enter' key-event or mouse interaction with
    // the UI slider. Where exactly the value is specified it dependent on how
    // this action was triggered.
    let newOpacity = payload instanceof KeyboardEvent ? payload.target.value / 100 : payload / 100
    newOpacity = Math.min(Math.max(newOpacity, 0), 1)

    const channel = state.OSDviewer.world.getItemAt(state.activeChannelIndex)
    if (channel) channel.setOpacity(newOpacity)
  },

  setActiveChannelName: ({
    commit
  }, payload) => {
    commit('setActiveChannelName', payload)
  },

  setZoom: ({
    state
  }, payload) => {
    let newZoom = payload instanceof KeyboardEvent ? Number(payload.target.value) : Number(payload)
    if (newZoom > 0) { state.OSDviewer.viewport.zoomTo(newZoom) }
  },

  setPixelScaleFactor: ({
    commit
  }, payload) => {
    commit('setPixelScaleFactor', payload)
  }
}
