import paper from 'paper'

export default {
  setTask: (state, task) => {
    state.task = task
  },

  activateSnackbar: (state, payload) => {
    state.snackbar.active = true
    state.snackbar.text = payload.text ? payload.text : 'notification'
    state.snackbar.color = payload.color ? payload.color : 'info'
    state.snackbar.timeout = payload.timeout ? payload.timeout : 4000
  },

  dismissSnackbar: state => {
    state.snackbar.active = false
  },

  // Synchronise the position and scale of both the openseadragon image and the
  // annotation project.
  synchroniseAnnotationAndOSDCanvas: (state, viewer) => {
    viewer.addHandler('animation', () => {
      paper.view.autoUpdate = false
      paper.project.layers.forEach(layer => { layer.getItems({ }).forEach(item => { item.visible = false }) })
      const baseImage = viewer.world.getItemAt(0)
      const center = baseImage.viewportToImageCoordinates(viewer.viewport.getCenter(true))
      // Sync Zoom
      const currentZoom = viewer.viewport.getZoom(true)
      paper.view.zoom = baseImage.viewportToImageZoom(currentZoom)
      // Sync Center
      paper.view.center = new paper.Point(center.x, center.y)
      const bounds = paper.view.bounds
      paper.view.itemsTree.search({ minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height }).forEach(treeNode => { treeNode.item.visible = true })
      paper.view.autoUpdate = true
      paper.view.update()
    })

    viewer.addHandler('resize', function (e) {
      paper.view.autoUpdate = false
      paper.project.layers.forEach(layer => { layer.getItems({ }).forEach(item => { item.visible = false }) })
      const baseImage = viewer.world.getItemAt(0)

      // Sync Size
      paper.view.viewSize.width = e.newContainerSize.x
      paper.view.viewSize.height = e.newContainerSize.y

      // Sync Center
      const center = baseImage.viewportToImageCoordinates(
        viewer.viewport.getCenter(true)
      )
      paper.view.center = new paper.Point(center.x, center.y)
      const bounds = paper.view.bounds
      paper.view.itemsTree.search({ minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height }).forEach(treeNode => { treeNode.item.visible = true })

      const strokeWidth = Math.ceil(paper.view.viewSize.width * state.strokeScale / (viewer.viewport.getMaxZoom() * 1000))
      paper.project.getItems().forEach(item => {
        item.strokeWidth = strokeWidth
        // Ruler items need special treatment to re-draw the labels
        if (item.hasOwnProperty('drawLabel')) item.drawLabel()
      })

      paper.view.autoUpdate = true
      paper.view.update()
    })

    // When an item (image) is added to the world sync the path stroke widths
    viewer.world.addHandler('add-item', function (e) {
      paper.view.autoUpdate = false
      const baseImage = viewer.world.getItemAt(0)
      const container = document.getElementById('view')

      // Sync Size
      paper.view.viewSize.width = container.offsetWidth
      paper.view.viewSize.height = container.offsetHeight

      // Sync Zoom
      const currentZoom = viewer.viewport.getZoom(true)
      paper.view.zoom = baseImage.viewportToImageZoom(currentZoom)

      // Sync Center
      const center = baseImage.viewportToImageCoordinates(viewer.viewport.getCenter(true))
      paper.view.center = new paper.Point(center.x, center.y)

      const strokeWidth = Math.ceil(paper.view.viewSize.width * state.strokeScale / (viewer.viewport.getMaxZoom() * 1000))
      paper.project.getItems().forEach(item => {
        item.strokeWidth = strokeWidth
        // Ruler items need special treatment to re-draw the labels
        if (item.hasOwnProperty('drawLabel')) item.drawLabel()
      })

      paper.view.autoUpdate = true
      paper.view.update()
    })
  },

  setActiveStep: (state, stepIndex) => {
    state.activeStep = stepIndex
  },

  setActiveLayer: (state, layerIndex) => {
    state.activeLayer = layerIndex
  },

  toggleSettings: state => {
    state.settingsFlag = !state.settingsFlag
  },

  setActiveValidationIndex: (state, payload) => {
    state.activeValidationIndex = payload
  },

  setSteps: (state, steps) => {
    if (steps) state.steps = steps
    else {
      state.toolsDrawer = false
      state.studioDrawer = false
      if (state.task === 'review') {
        state.steps = [{
          id: 1,
          instruction: 'Review the data',
          type: 'review'
        }]
      } else if (state.task === 'validate') {
        state.steps = [{
          id: 1,
          instruction: 'Cycle through each of the predicted Megakaryocyte classifications and verify whether the prediction is correct or incorrect. In cases where you are not certain, flag the prediction for review.',
          type: 'validate'
        }]
      } else {
        state.toolsDrawer = true
        state.studioDrawer = true
        state.steps = null
      }
    }
  },

  toggleToolsDrawer: state => {
    state.toolsDrawer = !state.toolsDrawer
  },

  toggleStudioDrawer: state => {
    state.studioDrawer = !state.studioDrawer
  },

  setToolsDrawerState: (state, payload) => {
    state.toolsDrawer = payload
  },

  setStudioDrawerState: (state, payload) => {
    state.studioDrawer = payload
  }
}
