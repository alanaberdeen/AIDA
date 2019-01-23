import paper from 'paper'

export default {
  async getData (state, images) {
    state.images = images
  },

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

  setEditorActiveLayer: (state, layerIndex) => {
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

  updateValidation: async (state, payload) => {
    const db = firebase.firestore()

    if (payload.validation) {
      // Add validation to history
      const validationsRef = db.collection('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes/' + payload.docName + '/validations')
      validationsRef.add({
        timestamp: payload.timestamp,
        ...payload.validation
      })

      // If the boundingBox has not been changed then we simply assume is correct and call it validated
      const itemRef = db.doc('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes/' + payload.docName)
      itemRef.update({ 'boundingBox.validated': true })
    }

    if (payload.boundingBox) {
      // Add new bounding box to the items history
      const boundingBoxesRef = db.collection('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes/' + payload.docName + '/boundingBoxes')
      boundingBoxesRef.add({
        timestamp: payload.timestamp,
        user: state.uid,
        ...payload.boundingBox
      })

      // Update the image's default bounding box to also be the latest adjustment
      const itemRef = db.doc('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes/' + payload.docName)
      itemRef.update({
        boundingBox: {
          ...payload.boundingBox,
          validated: true
        }
      })
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
  },

  createNewItem: async (state, payload) => {
    console.log('CreateNewItem mutation fired')
    const db = firebase.firestore()

    const itemsCollection = db.collection('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes')
    console.log(itemsCollection.path)
    const newItemDocRef = await itemsCollection.add({
      boundingBox: {
        ...payload.boundingBox,
        validated: true
      },
      class: {
        label: 'megakaryocyte',
        basicValidation: true,
        expertValidation: false,
        validationScore: 1
      },
      segmentation: {
        cell: null,
        nucleus: null,
        validated: null
      }
    })
    console.log('Created a new item document: ' + newItemDocRef.id)

    const boundingBoxesRef = db.collection('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes/' + newItemDocRef.id + '/boundingBoxes')
    boundingBoxesRef.add({
      timestamp: payload.timestamp,
      uid: state.uid,
      ...payload.boundingBox
    })

    const validationsRef = db.collection('/studies/' + payload.studyName + '/images/' + payload.imageName + '/megakaryocytes/' + newItemDocRef.id + '/validations')
    validationsRef.add({
      decisionTimeInMs: null,
      label: 'megakaryocyte',
      timestamp: payload.timestamp,
      user: state.uid
    })
  }
}
