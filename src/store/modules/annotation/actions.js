import helpers from './helpers.js'
import paper from 'paper'

export default {
  loadAnnotation: async ({
    dispatch,
    commit
  }, payload) => {
    paper.view.autoUpdate = false
    // Reset the project state to the empty defaults
    commit('resetProjectState')
    if (payload) {
      let treeNodes = []
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

            // The overlay isn't present in the paperJS project. Therefore, it
            // needs to be manually added to the state.
            commit('addItemToActiveLayer', item)
          } else {
            const paperItem = helpers.drawItem(item)
            const bounds = paperItem.bounds
            const treeNode = { minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height, item: paperItem }
            treeNodes.push(treeNode)
          }
        }
        dispatch('setActiveLayerOpacity', layer.opacity * 100)
      }
      paper.view.itemsTree.load(treeNodes)

      // Active the correct layer as specified by editor state.
      if (payload.activeLayer) dispatch('setActiveLayer', payload.activeLayer)
    } else {
      await dispatch('createLayer')
      dispatch('setActiveLayerName', 'Layer 1')
      dispatch('setActiveLayerType', 'paths')
    }
    paper.view.autoUpdate = true
    paper.view.update()
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
    rootState
  }) => {
    paper.view.element.style.pointerEvents = 'auto'
    if (rootState.app.activeLayer) {
      paper.project.layers[rootState.app.activeLayer].activate()
    }
  },

  createLayer: ({
    commit
  }) => {
    commit('createLayer')
  },

  setActiveLayer: ({
    state,
    dispatch
  }, layerIndex) => {
    paper.project.layers[layerIndex].activate()
    dispatch('app/setActiveLayer', layerIndex, { root: true })

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
  },

  setSaveState: ({
    commit
  }, payload) => {
    commit('setSaveState', payload)
  },

  flagAnnotationEdits: ({
    commit
  }) => {
    commit('setSaveState', {
      changesSaved: false
    })
  }
}
