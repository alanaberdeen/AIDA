export default {
  getData (state, images) {
    state.images = images
  },

  setFileName (state, fileName) {
    state.fileName = fileName
  },

  setImageType (state, fileName) {
    // Set image type by checking for .dzi
    if (fileName.indexOf('.dzi') > -1) {
      state.imageType = 'dzi'
    } else {
      state.imageType = 'simple'
    }
  },

  addOSDImage: (state, payload) => {
    if (payload.type === 'dzi') {
      payload.viewer.addTiledImage({
        tileSource: payload.source
      })
    } else if (payload.type === 'simple') {
      payload.viewer.addSimpleImage({
        url: payload.source
      })
    }
  }
}
