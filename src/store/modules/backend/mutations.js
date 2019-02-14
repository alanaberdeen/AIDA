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

  setOSDImageSource: (state, OSDviewer) => {
    if (state.imageType === 'dzi') {
      OSDviewer.addTiledImage({
        tileSource: location.origin + '/data/images/' + state.fileName
      })
    } else if (state.imageType === 'simple') {
      OSDviewer.addSimpleImage({
        url: location.origin + '/data/images/' + state.fileName
      })
    }
  }
}
