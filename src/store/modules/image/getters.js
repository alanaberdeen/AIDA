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
    // Filter out the overlay images as not interested in returning these.
    const projectImages = state.images.filter(image => image.function !== 'overlay')

    // Check if a viewer has been instantiated and there is at minimum 1 project
    // image in the OSD world and the image vuex state.
    if (state.OSDviewer && state.OSDviewer.world.getItemCount() > 0 &&
        projectImages.length > 0) {
      //
      // Reformat the array so that it includes more details.
      return projectImages.map(imageDetails => {
        const image = state.OSDviewer.world.getItemAt(imageDetails.index)
        if (image) {
          return {
            channel: image,
            id: imageDetails.index,
            opacity: image.getOpacity(),
            name: imageDetails.name,
            visible: image.getOpacity() > 0,
            opacityCache: 0
          }
        }
      })
    } else {
      return []
    }
  }
}
