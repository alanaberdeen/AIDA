export default {
  setAvailableImages (state, availableImages) {
    state.availableImages = availableImages
  },

  setProjectFilePath (state, projectFilePath) {
    state.projectFilePath = projectFilePath
  },

  setAnnotationFilePath: (state, payload) => {
    state.annotationFilePath = payload
  }
}
