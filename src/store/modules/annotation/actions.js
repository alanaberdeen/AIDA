import helpers from './helpers.js'

export default {
  loadAnnotation: async ({
    dispatch,
    commit
  }, payload) => {
    // Reset the project state to the empty defaults
    commit('resetProjectState')
    // If there are overlay images specified then trigger openseadragon to
    // load these on top of the project image. Also create a new annotation
    // layer for the overlay.
    // if (payload.overlays) {
    //   payload.overlays.forEach(overlay => {
    //     dispatch('image/addOSDImage', {
    //       function: 'overlay',
    //       type: overlay.type,
    //       source: overlay.source,
    //       name: overlay.name
    //     }, { root: true })
    //   })
    // }

    // Draw the annotation layers
    for (const layer of payload.layers) {
      await dispatch('createLayer')
      await dispatch('setLayerName', layer.name)
      dispatch('setLayerOpacity', layer.opacity * 100)
      layer.items.forEach(item => {
        helpers.drawItem(item)
      })
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
    commit,
    dispatch
  }, layerIndex) => {
    commit('setActiveLayer', layerIndex)
    dispatch('app/setActiveLayer', layerIndex, {
      root: true
    })
  },

  setLayerOpacity: ({
    commit
  }, payload) => {
    commit('setLayerOpacity', payload)
  },

  setLayerName: ({
    commit
  }, payload) => {
    commit('setLayerName', payload)
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
