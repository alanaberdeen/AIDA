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

  getChannels: state => {
    const channels = []

    if (state.OSDviewer) {
      const numChannels = state.OSDviewer.world.getItemCount()

      for (let i = 0; i < numChannels; i++) {
        const image = state.OSDviewer.world.getItemAt(i)
        channels.push({
          channel: image,
          id: i,
          opacity: image.getOpacity(),
          name: state.imageName,
          visible: image.getOpacity() > 0,
          opacityCache: 0
        })
      }
    }
    return channels
  }
}
