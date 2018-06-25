export default {

  // Get default color for the current layer
  getDefaultLayerColor: (state, getters, rootState) => {
    let activeLayerIndex = rootState.editor.activeLayer
    let numberLayers = state.project.layers.length
    return state.defaultColors[activeLayerIndex % numberLayers]
  }

}
