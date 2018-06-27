export default {

  // Return the color in which an item should be drawn
  getColor: (state, getters, rootState) => {
    // Check if there is a default color for the step
    if (rootState.editor.steps[rootState.editor.activeStep].color) {
      return rootState.editor.steps[rootState.editor.activeStep].color
      // If there is no specified step color then return the default layer color
    } else {
      let activeLayerIndex = rootState.editor.activeLayer
      let defaultColors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd']
      return defaultColors[activeLayerIndex % defaultColors.length]
    }
  }
}
