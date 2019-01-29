import paper from 'paper'

export default {
  activateSnackbar: (state, payload) => {
    state.snackbar.active = true
    state.snackbar.text = payload.text ? payload.text : 'notification'
    state.snackbar.color = payload.color ? payload.color : 'info'
    state.snackbar.timeout = payload.timeout ? payload.timeout : 2000
  },

  dismissSnackbar: state => {
    state.snackbar.active = false
  },

  // Add a handler function that will run when osd-viewport is updated.
  // This will synchronously update the paperJS viewport.
  // This is an expensive operation as it ensures all parameters are in sync
  // on every viewport update. For example, zoom may not have changed but it
  // would still fire this event and update the zoom. However, separating into
  // the individual parts led to a far less smooth experience. Leave it here
  // for now at least.
  synchroniseAnnotationAndOSDCanvas: (state, viewer) => {
    let strokeScale = state.strokeScale

    viewer.addHandler('update-viewport', function (e) {
      // Sync Zoom
      let viewportZoom = viewer.viewport.getZoom(true)
      let image1 = viewer.world.getItemAt(0)
      paper.view.zoom = image1.viewportToImageZoom(viewportZoom)

      // Sync Center
      let center = image1.viewportToImageCoordinates(
        viewer.viewport.getCenter(true)
      )
      paper.view.center = new paper.Point(center.x, center.y)

      // Update paths to have strokeWidth reactive to zoom level.
      // TODO: consider the computational expensive of this and find a more
      // effectively method of handling it.
      paper.project.getItems({
        class: paper.Path
      }).map(path => {
        path.strokeWidth = (image1.getContentSize().x * strokeScale) / (viewportZoom * 1000)
      })
    })

    viewer.addHandler('resize', function (e) {
      let image1 = viewer.world.getItemAt(0)

      // Sync Size
      paper.view.viewSize.width = e.newContainerSize.x
      paper.view.viewSize.height = e.newContainerSize.y

      // Sync Center
      let center = image1.viewportToImageCoordinates(
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

  setValidationSteps: state => {
    state.toolsDrawer = false
    state.studioDrawer = false
    state.steps = [
      {
        id: 1,
        instruction: 'Cycle through each of the predicted Megakaryocyte classifications and verify whether the prediction is correct or incorrect. In cases where you are not certain, flag the prediction for review.',
        type: 'validate'
      }
    ]
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
