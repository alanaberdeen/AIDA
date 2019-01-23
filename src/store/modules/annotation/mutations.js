import Vue from 'vue'
import paper from 'paper'
import helpers from './helpers.js'

export default {
  resetAnnotationState: state => {
    paper.project.remove()

    Vue.set(state, 'project', {
      name: 'An AIDA project',
      layers: []
    })
  },

  // Incorporate all of the paperJS annotation items in the Vuex state
  refreshAnnotationState: state => {
    paper.project.layers.forEach(layer => {
      Vue.set(state.project.layers, [layer.index], {
        name: state.project.layers[layer.index] ? state.project.layers[layer.index].name : layer.name,
        opacity: layer.opacity,
        items: []
      })
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
            ...item.data,
            color: helpers.getColor(item),
            x: item.bounds.x,
            y: item.bounds.y,
            width: item.bounds.width,
            height: item.bounds.height
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

  prepareCanvas: (state, activeLayer) => {
    if (paper.view.element.classList.contains('pointers-no')) {
      paper.view.element.classList.remove('pointers-no')
    }

    if (activeLayer) {
      paper.project.layers[activeLayer].activate()
    }
  },

  newLayer: state => {
    let newLayer = new paper.Layer({ position: paper.view.center })
    newLayer.opacity = 1

    state.project.layers.push({
      name: 'Layer ' + (state.project.layers.length + 1),
      opacity: 1,
      items: []
    })
  },

  setActiveLayer: (state, index) => {
    paper.project.layers[index].activate()
  },

  setLayerOpacity: (state, payload) => {
    let newOpacity
    if (payload instanceof KeyboardEvent) {
      newOpacity = payload.target.value / 100
    } else {
      newOpacity = payload / 100
    }

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

  setLayerName: (state, payload) => {
    let newName

    if (payload instanceof KeyboardEvent) {
      newName = payload.target.value
    } else {
      newName = payload
    }

    paper.project.activeLayer.name = newName
    Vue.set(state.project.layers[paper.project.activeLayer.index], 'name', newName)
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

  // Load annotation data into both the state and the paperJS environment.
  loadAnnotation: (state, payload) => {
    if (payload) {
      // Save the loaded annotation data to the Vuex state
      state.project = payload

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
                point: [item.x, item.y],
                size: [item.width, item.height],
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
                if (typeof item.color.fill === 'string' || item.color.fill instanceof String) {
                  newPaperItem.fillColor = item.color.fill
                  newPaperItem.fillColor.alpha = 0.2
                } else {
                  newPaperItem.fillColor = new paper.Color({
                    hue: item.color.fill.hue,
                    saturation: item.color.fill.saturation,
                    lightness: item.color.fill.lightness,
                    alpha: item.color.fill.alpha
                  })
                }
              } else {
                newPaperItem.fillColor = 'blue'
                newPaperItem.fillColor.alpha = 0
              }
            }
            if (item.color && item.color.stroke) {
              if (typeof item.color.fill === 'string' || item.color.fill instanceof String) {
                newPaperItem.strokeColor = item.color.stroke
              } else {
                newPaperItem.strokeColor = new paper.Color({
                  hue: item.color.stroke.hue,
                  saturation: item.color.stroke.saturation,
                  lightness: item.color.stroke.lightness,
                  alpha: item.color.stroke.alpha
                })
              }
            } else {
              newPaperItem.strokeColor = state.defaultColors[newPaperItem.layer.index % state.defaultColors.length].stroke
            }
          })
        }
      })

      // Active the correct layer as specified by editor state.
      if (payload.activeLayer) { paper.project.layers[payload.activeLayer].activate() }
    }
  }
}
