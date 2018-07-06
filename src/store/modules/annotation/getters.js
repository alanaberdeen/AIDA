export default {

  // Return the color in which an item should be drawn
  getColor: (state, getters, rootState) => {
    // Check if there is a default color for the step
    if (
      rootState.editor.steps &&
      rootState.editor.steps[rootState.editor.activeStep].color) {
      return rootState.editor.steps[rootState.editor.activeStep].color
      // If there is no specified step color then return the default layer color
    } else {
      let activeLayerIndex = rootState.editor.activeLayer
      return state.defaultColors[activeLayerIndex % state.defaultColors.length]
    }
  },

  // Get megas in the annotation data
  getMegas: (state) => {
    return state.project.layers[0].items.filter(item => item.class === 'megakaryocyte')
  }
}
