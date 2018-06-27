export default {

  // Get default color for the current layer
  getDefaultLayerColor: (state, getters, rootState) => {
    let activeLayerIndex = rootState.editor.activeLayer
    let numberColors = state.defaultColors.length
    return state.defaultColors[activeLayerIndex % numberColors]
  }
}
