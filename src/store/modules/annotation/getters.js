export default {

  getColor: (state, getters, rootState) => {
    const activeLayerIndex = rootState.app.activeLayerIndex
    return state.defaultColors[activeLayerIndex % state.defaultColors.length]
  },

  getItemsForValidation: (state) => {
    const validationLayer = state.project.layers.filter(layer => layer.name === 'Validate')

    if (validationLayer.length > 0) {
      return validationLayer[0].items
    } else {
      return []
    }
  }
}
