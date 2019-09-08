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
      className: function (className) {
        return (className === 'Path' || className === 'Raster')
      }
    })

    // Store them in the state appropriately. Convention follows AIDA annotation
    // schema: https://github.com/alanaberdeen/AIDA/wiki/Annotation-Schema
    for (const item of items) {
      if (item.data.type === 'circle') {
        state.project.layers[item.layer.index].items.push({
          class: item.data.class,
          type: 'circle',
          color: helpers.getColor(item),
          center: {
            x: item.position.x,
            y: item.position.y
          },
          radius: item.bounds.width / 2,
          locked: item.locked,
          data: item.data.data
        })
      } else if (item.data.type === 'rectangle') {
        state.project.layers[item.layer.index].items.push({
          ...item.data,
          color: helpers.getColor(item),
          x: item.bounds.x,
          y: item.bounds.y,
          width: item.bounds.width,
          height: item.bounds.height,
          locked: item.locked
        })
      } else if (item.data.type === 'path') {
        state.project.layers[item.layer.index].items.push({
          class: item.data.class,
          type: 'path',
          color: helpers.getColor(item),
          segments: helpers.getSegments(item),
          closed: item.closed,
          locked: item.locked,
          data: item.data.data
        })
      // Check if the item is meant to represent an edit to an image. For
      // example when editing a segmentation mask that is tiled and overlayed
      // on the project image.
      } else if (item.data.type === 'imageEdit') {
        const rasterizedItem = item.rasterize()
        const itemDataURL = rasterizedItem.toDataURL()

        state.project.layers[item.layer.index].items.push({
          class: item.data.class,
          type: 'raster',
          source: itemDataURL,
          position: {
            x: item.position.x,
            y: item.position.y
          },
          data: item.data.data
        })
      // If the item is a raster, we need to incorporate edits to it.
      // Therefore, necessary to 'rasterise' this image and it's combined edits.
      } else if (item.data.type === 'raster') {
        const editItems = item.layer.getItems({
          match: item => { return item.locked },
          overlapping: item.bounds
        })

        // Add the original raster item to the array. Make sure to include
        // as the first child so that the edits are displayed above it in the
        // project hierarchy
        editItems.unshift(item)

        // When a new group is created the default behaviour is to place is at
        // the top of the active layer. Avoid this by explicitly sending it to
        // the back of the project hierarchy.
        const itemsToRaster = new paper.Group(editItems)
        itemsToRaster.sendToBack()

        // Rasterize the image and it's edits. Convert to a base64 encoded URL.
        const rasterizedGroup = itemsToRaster.rasterize(item.resolution.height, false)
        const rasterizedData = rasterizedGroup.toDataURL()

        state.project.layers[item.layer.index].items.push({
          class: item.data.class,
          type: 'raster',
          source: rasterizedData,
          position: {
            x: item.position.x,
            y: item.position.y
          },
          data: item.data.data
        })
      }
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
