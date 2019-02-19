import helpers from './helpers.js'
import paper from 'paper'

export default {
  loadAnnotation: async ({
    dispatch,
    commit
  }, payload) => {
    // Reset the project state to the empty defaults
    commit('resetProjectState')

    // Draw the annotation layers
    for (const layer of payload.layers) {
      await dispatch('createLayer')
      await dispatch('setActiveLayerName', layer.name)
      await dispatch('setActiveLayerType', layer.type)
      for (const item of layer.items) {
        // If the item has type 'overlay' trigger openseadragon to load the
        // overlay image on top of the project image.
        if (item.type === 'overlay') {
          await dispatch('image/addOSDImage', {
            function: 'overlay',
            fileType: item.fileType,
            source: item.source,
            name: layer.name,
            opacity: layer.opacity
          }, { root: true })
          await dispatch('image/setActiveChannel', layer.name, { root: true })
        } else {
          helpers.drawItem(item)
        }
      }
      dispatch('setActiveLayerOpacity', layer.opacity * 100)
    }

    // Active the correct layer as specified by editor state.
    if (payload.activeLayer) dispatch('setActiveLayer', payload.activeLayer)
  },

  resetAnnotationState: ({
    commit
  }) => {
    commit('resetAnnotationState')
  },

  refreshAnnotationState: ({
    commit
  }, payload) => {
    commit('refreshAnnotationState', payload)
  },

  prepareCanvas: ({
    commit,
    rootState
  }) => {
    commit('prepareCanvas', rootState.app.activeLayer)
  },

  createLayer: ({
    commit
  }) => {
    commit('createLayer')
  },

  setActiveLayer: ({
    state,
    commit,
    dispatch
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)
    dispatch('app/setActiveLayer', layerIndex, {
      root: true
    })

    // For overlay layers it is necessary to also activate the associated
    // channel where OSD renders the overlay.
    if (state.project.layers[layerIndex].type === 'overlay') {
      const activeLayerName = state.project.layers[layerIndex].name
      dispatch('image/setActiveChannel', activeLayerName, { root: true })
    }
  },

  setActiveLayerOpacity: ({
    state,
    dispatch,
    commit
  }, payload) => {
    commit('setActiveLayerOpacity', payload)

    // For overlay layers it is necessary to also activate the associated
    // channel where OSD renders the overlay.
    const activeLayerIndex = paper.project.activeLayer.index
    if (state.project.layers[activeLayerIndex].type === 'overlay') {
      dispatch('image/setActiveChannelOpacity', payload, { root: true })
    }
  },

  setActiveLayerName: ({
    commit
  }, payload) => {
    commit('setActiveLayerName', payload)
  },

  setActiveLayerType: ({
    commit
  }, payload) => {
    commit('setActiveLayerType', payload)
  },

  deleteActiveLayer: ({
    commit
  }) => {
    commit('deleteActiveLayer')
  },

  setProjectName: ({
    commit
  }, payload) => {
    commit('setProjectName', payload)
  },

  setSelectedItems: ({
    commit
  }, payload) => {
    commit('setSelectedItems', payload)
  },

  drawBoundingBoxes: ({
    commit
  }, payload) => {
    commit('drawBoundingBoxes', payload)
  }
}
