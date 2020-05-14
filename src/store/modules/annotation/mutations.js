import Vue from 'vue'
import paper from 'paper'
import helpers from './helpers.js'

export default {
  // Reset vuex project State to the empty default.
  resetProjectState: state => {
    Vue.set(state, 'project', {
      name: 'An AIDA project',
      layers: []
    })
  },

  // Add an item to the active layer.
  // Used for items that are not automatically kept in the paperJS project and
  // therefore need to be manually added.
  addItemToActiveLayer: (state, item) => {
    const activeLayer = state.project.layers[paper.project.activeLayer.index]
    activeLayer.items.push(item)
  },

  // Incorporate all of the paperJS annotation items in the Vuex state
  refreshAnnotationState: state => {
    paper.project.layers.forEach(layer => {
      const currentStateLayer = state.project.layers[layer.index]
      Vue.set(state.project.layers, layer.index, {
        name: currentStateLayer.name,
        opacity: layer.opacity,
        type: currentStateLayer.type,
        // Clear the all but the overlay items currently in the state.
        items: currentStateLayer.items.filter(item => item.type === 'overlay')
      })
    })

    // Gather all the Path/Raster items in the paperJS environment
    const items = paper.project.getItems({
      className: cn => (cn === 'Path' || cn === 'Shape' || cn === 'CompoundPath' || cn === 'Raster'),
      match: item => item.parent.className !== 'CompoundPath'
    })

    // Store them in the state appropriately. Convention follows AIDA annotation
    // schema: https://github.com/alanaberdeen/AIDA/wiki/Annotation-Schema
    for (const item of items) {
      state.project.layers[item.layer.index].items.push(helpers.getItemState(item))
    }

    // Increment a tally of the number of time the project state has been
    // refreshed. This is used as a bit of a hack so that different Vue
    // components can easily 'watch()' part of the state and trigger methods
    // on updates
    state.projectStateRefreshIndex = state.projectStateRefreshIndex + 1
  },

  // Create a new layer in both the paperJS project and the vuex state
  createLayer: state => {
    const newLayer = new paper.Layer()
    state.project.layers.push({
      name: 'Layer ' + (state.project.layers.length + 1),
      opacity: newLayer.opacity,
      items: []
    })
  },

  setActiveLayerOpacity: (state, payload) => {
    // The opacity can be set by the 'enter' key-event or mouse interaction with
    // the UI slider. Where exactly the value is specified it dependent on how
    // this action was triggered.
    let newOpacity = payload instanceof KeyboardEvent ? payload.target.value / 100 : payload / 100

    // Restrict value to between 0 and 1
    newOpacity = Math.min(Math.max(newOpacity, 0), 1)

    // Set paperJS opacity
    paper.project.activeLayer.opacity = newOpacity

    // Save changed opacity to the Vuex state.
    // Watch out for Vue Change Detection Caveats: isn't reactive to new
    // attributes being added to an object. Use Vue.set to get around this.
    Vue.set(
      state.project.layers[paper.project.activeLayer.index],
      'opacity',
      newOpacity
    )
  },

  setActiveLayerName: (state, payload) => {
    const newName = payload instanceof KeyboardEvent ? payload.target.value : payload
    paper.project.activeLayer.name = newName
    Vue.set(state.project.layers[paper.project.activeLayer.index], 'name', newName)
  },

  setActiveLayerType: (state, type) => {
    Vue.set(state.project.layers[paper.project.activeLayer.index], 'type', type)
  },

  deleteActiveLayer: (state) => {
    state.project.layers.splice(paper.project.activeLayer.index, 1)
    paper.project.activeLayer.remove()
  },

  setProjectName: (state, payload) => {
    if (payload instanceof KeyboardEvent) {
      state.project.name = payload.target.value
    } else {
      state.project.name = payload
    }
  },

  setSelectedItems: (state, selectedItems) => {
    state.selectedItems = selectedItems
  },

  drawBoundingBoxes: (state, boundingBoxes) => {
    const newPaperLayer = new paper.Layer({ name: 'Validate' })
    newPaperLayer.opacity = 1

    boundingBoxes.forEach((box) => {
      const newPaperItem = new paper.Path.Rectangle({
        point: [box.boundingBox.x, box.boundingBox.y],
        size: [box.boundingBox.width, box.boundingBox.height],
        data: {
          name: box.name,
          type: 'rectangle',
          predictionClass: box.class.predictionClass,
          predictionScore: box.class.predictionScore,
          validationClass: box.class.validationClass,
          validationScore: box.class.validationScore
        }
      })
      newPaperItem.strokeColor = state.defaultColors[newPaperItem.layer.index % state.defaultColors.length].stroke
    })
  },

  setSaveState: (state, payload) => {
    state.saveState.changesSaved = payload.changesSaved
    if (payload.lastSaveTimeStamp) {
      state.saveState.lastSaveTimeStamp = payload.lastSaveTimeStamp
    }
  }
}
