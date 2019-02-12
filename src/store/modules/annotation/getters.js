export default {

  getColor: (state, getters, rootState) => {
    let activeLayerIndex = rootState.app.activeLayer
    return state.defaultColors[activeLayerIndex % state.defaultColors.length]
  },

  getItemsForValidation: (state) => {
    let validationLayer = state.project.layers.filter(layer => layer.name === 'Validate')

    if (validationLayer.length > 0) {
      return validationLayer[0].items
    } else {
      return []
    }
  }
}
