import Vue from 'vue'
import paper from 'paper'

import helpers from './helpers.js'

export default {
  resetAnnotationState: state => {
    Vue.set(state, 'project', {
      name: 'An AIDA project',
      layers: []
    })

    paper.project.remove()
  },

  // Refresh the Vuex store to incorporate all of the paperJS annotation items
  refreshAnnotationState: (state, payload) => {
    // Construct the layer structure fresh in the Vuex state
    paper.project.layers.forEach(layer => {
      if (layer.name !== 'guide') {
        Vue.set(state.project.layers, [layer.index], {
          name: state.project.layers[layer.index] ? state.project.layers[layer.index].name : layer.name,
          opacity: layer.opacity,
          items: []
        })
      }
    })

    // Gather all the Path items in the paperJS environment and store them in
    // the state appropriately. Convention follows AIDA annotation schema:
    // https://aida.gitbook.io/docs/annotation-schema
    paper.project
      .getItems({
        className: 'Path'
      })
      .forEach(item => {
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
            data: item.data.data
          })
        } else if (item.data.type === 'rectangle') {
          state.project.layers[item.layer.index].items.push({
            class: item.data.class,
            type: 'rectangle',
            color: helpers.getColor(item),
            from: {
              x: item.bounds.topLeft.x,
              y: item.bounds.topRight.y
            },
            to: {
              x: item.bounds.bottomRight.x,
              y: item.bounds.bottomRight.y
            },
            data: item.data.data
          })
        } else {
          state.project.layers[item.layer.index].items.push({
            class: item.data.class,
            type: 'path',
            color: helpers.getColor(item),
            segments: helpers.getSegments(item),
            closed: item.closed,
            data: item.data.data
          })
        }
      })
  },

  // Setup the PaperJs instance on the canvas DOM element.
  setupAnnotation: (state, canvas) => {
    paper.setup(canvas)
  },

  // Load annotation data into both the state and the paperJS environment.
  loadAidaAnnotation: (state, payload) => {
    // Save the loaded annotation data to the Vuex state
    state.project = payload.annotation

    // Cycle through the layers
    state.project.layers.forEach(layer => {
      // Create a new layer
      let newPaperLayer = new paper.Layer()
      newPaperLayer.opacity = layer.opacity

      // Draw each item
      if (layer.items) {
        layer.items.forEach(item => {
          let newPaperItem
          if (item.type === 'circle') {
            newPaperItem = new paper.Path.Circle({
              center: item.center,
              radius: item.radius,
              data: {
                type: 'circle',
                countable: true,
                class: item.class,
                data: item.data
              }
            })
          } else if (item.type === 'rectangle') {
            newPaperItem = new paper.Path.Rectangle({
              from: item.from,
              to: item.to,
              data: {
                type: 'rectangle',
                class: item.class,
                data: item.data
              }
            })
          } else {
            newPaperItem = new paper.Path({
              segments: item.segments,
              closed: item.closed ? item.closed : false,
              data: {
                type: 'path',
                class: item.class,
                data: item.data
              }
            })
          }

          // Set the path colors to the default for their layer.
          if (newPaperItem.closed) {
            if (item.color && item.color.fill) {
              newPaperItem.fillColor = new paper.Color({
                hue: item.color.fill.hue,
                saturation: item.color.fill.saturation,
                lightness: item.color.fill.lightness,
                alpha: item.color.fill.alpha
              })
            } else {
              newPaperItem.fillColor = 'blue'
              newPaperItem.fillColor.alpha = 0
            }
          }
          if (item.color && item.color.stroke) {
            newPaperItem.strokeColor = new paper.Color({
              hue: item.color.stroke.hue,
              saturation: item.color.stroke.saturation,
              lightness: item.color.stroke.lightness,
              alpha: item.color.stroke.alpha
            })
          } else {
            newPaperItem.strokeColor = state.defaultColors[newPaperItem.layer.index % state.defaultColors.length].stroke
          }
        })
      }
    })

    // Active the correct layer as specified by editor state.
    paper.project.layers[payload.activeLayer].activate()
  },

  // Load legacy, paperJS project string representation
  loadPaperStringAnnotation: (state, payload) => {
    paper.project.importJSON(payload.annotation)
    paper.project.layers[payload.activeLayer].activate()
  },

  // Prepare the canvas for adding annotations.
  prepareCanvas: (state, rootState) => {
    // Remove the class that interrupts the pointer interaction.
    if (paper.view.element.classList.contains('pointers-no')) {
      paper.view.element.classList.remove('pointers-no')
    }

    // Ensure the correct layer is active
    paper.project.layers[rootState.editor.activeLayer].activate()
  },

  // Add a new layer to the annotation project.
  newLayer: state => {
    // Create layer in paperJS environment
    let newLayer = new paper.Layer({
      position: paper.view.center
    })
    newLayer.opacity = 1

    // Add new layer to the Vuex state representation
    state.project.layers.push({
      name: 'Layer ' + (state.project.layers.length + 1),
      opacity: 1,
      items: []
    })
  },

  setActiveLayer: (state, index) => {
    paper.project.layers[index].activate()
  },

  // Set the opacity of the active layer
  setLayerOpacity: (state, payload) => {
    let newOpacity
    // Check if keyboard event. This happens in the case that the user types
    // the opacity value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newOpacity = payload.target.value / 100
    } else {
      newOpacity = payload / 100
    }

    // Check if within range
    if (newOpacity > 1) {
      newOpacity = 1
    } else if (payload < 0) {
      newOpacity = 0
    }

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

  // Set the name of the active layer
  setLayerName: (state, payload) => {
    let newName
    // Check if keyboard event. This happens in the case that the user types
    // the opacity value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newName = payload.target.value
    } else {
      newName = payload
    }

    // Set name
    paper.project.activeLayer.name = newName

    // Save changes to Vuex state
    Vue.set(
      state.project.layers[paper.project.activeLayer.index],
      'name',
      newName
    )
  },

  deleteActiveLayer: (state) => {
    state.project.layers.splice(paper.project.activeLayer.index, 1)
    paper.project.activeLayer.remove()
  },

  // Set the project name
  setProjectName: (state, payload) => {
    let newName
    // Check if keyboard event. This happens in the case that the user types
    // the opacity value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newName = payload.target.value
    } else {
      newName = payload
    }

    state.project.name = newName
  },

  /**
   * Stores an array of the current selected items in the state
   * @function setSelectedItems
   * @param {Array} selectedItems: an array of the currently selected items
   */
  setSelectedItems: (state, selectedItems) => {
    state.selectedItems = selectedItems
  }
}