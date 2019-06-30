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
      // Sync Zoom
      const currentZoom = viewer.viewport.getZoom(true)
      const baseImage = viewer.world.getItemAt(0)
      paper.view.zoom = baseImage.viewportToImageZoom(currentZoom)

      // Sync Center
      const center = baseImage.viewportToImageCoordinates(
        viewer.viewport.getCenter(true)
      )
      paper.view.center = new paper.Point(center.x, center.y)

      // Update path stroke widths.
      // If the current zoom level does not equal the target zoom level then we
      // need to scale the paths in the project to match the zoom changes.
      if (viewer.viewport.getZoom(true) !== viewer.viewport.getZoom()) {
        // Update paths to have strokeWidth reactive to zoom level.
        const strokeScale = state.strokeScale
        paper.project.getItems({ class: paper.Path }).forEach(path => {
          path.strokeWidth = (baseImage.getContentSize().x * strokeScale) / (currentZoom * 1000)

          // Ruler items need special treatment to re-draw the labels
          if (path.hasOwnProperty('drawLabel')) path.drawLabel()
        })
      }
    })

    viewer.addHandler('resize', function (e) {
      const baseImage = viewer.world.getItemAt(0)

      // Sync Size
      paper.view.viewSize.width = e.newContainerSize.x
      paper.view.viewSize.height = e.newContainerSize.y

      // Sync Center
      const center = baseImage.viewportToImageCoordinates(
        viewer.viewport.getCenter(true)
      )
      paper.view.center = new paper.Point(center.x, center.y)
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

  setSteps: state => {
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
