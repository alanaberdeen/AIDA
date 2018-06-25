export default {
  getMaxZoom: state => {
    if (state.OSDviewer) {
      return Math.round(state.OSDviewer.viewport.getMaxZoom())
    } else {
      return 10
    }
  },

  getZoom: state => {
    if (state.OSDviewer) {
      let zoom = state.OSDviewer.viewport.getZoom()

      if (zoom < 100) {
        return Math.round(zoom * 10) / 10
      } else {
        return Math.round(zoom)
      }
    } else {
      return 'na'
    }
  },

  getImageWidth: state => {
    if (state.OSDviewer) {
      if (state.OSDviewer.world.getItemCount() > 0) {
        return state.OSDviewer.world.getItemAt(0).getContentSize.x
      } else {
        return 0
      }
    }
  },

  getChannels: (state, getters, rootState) => {
    let channels = []

    if (state.OSDviewer) {
      let numChannels = state.OSDviewer.world.getItemCount()

      for (let i = 0; i < numChannels; i++) {
        channels.push({
          channel: state.OSDviewer.world.getItemAt(i),
          id: i,
          opacity: state.OSDviewer.world.getItemAt(i).getOpacity(),
          name: state.images[i].name,
          visible: state.OSDviewer.world.getItemAt(i).getOpacity() > 0,
          opacityCache: 0
        })
      }
    }
    return channels
  }
}
