import Vue from 'vue'
import openseadragon from 'openseadragon'

export default {
  resetImageState: (state) => {
    // Destroy the openseadragon viewer
    state.OSDviewer.navigator.destroy()
    state.OSDviewer.destroy()

    state = {
      OSDviewer: null,
      OSDworld: null,
      images: [],
      activeChannel: 0,
      view: {
        viewSize: [null, null],
        imageSize: [null, null],
        imageCenter: [null, null],
        imageZoom: null
      }
    }
  },

  // Setup an OpenSeaDragon OSDviewer.
  setupOSDCanvas: (state, payload) => {
    // Create and OSD viewer
    state.OSDviewer = new openseadragon.Viewer({
      id: payload,
      showNavigationControl: false,
      showNavigator: true,
      navigatorId: 'navigator'
    })

    // Add handlers to update the state when certain events are triggered on the
    // viewer. These state changes can be propagated through to the annotation
    // data to keep the two parts in sync.

    // Resize
    state.OSDviewer.addHandler('resize', function (e) {
      state.view.viewSize = [e.newContainerSize.x, e.newContainerSize.y]
      let centerPoint = state.OSDviewer.world.getItemAt(0).viewportToImageCoordinates(
        state.OSDviewer.viewport.getCenter(true)
      )
      state.view.imageCenter = [centerPoint.x, centerPoint.y]
    })

    // Zoom
    state.OSDviewer.addHandler('zoom', function (e) {
      state.view.imageZoom = state.OSDviewer.world.getItemAt(0).viewportToImageZoom(
        state.OSDviewer.viewport.getZoom(true)
      )

      let centerPoint = state.OSDviewer.world.getItemAt(0).viewportToImageCoordinates(
        state.OSDviewer.viewport.getCenter(true)
      )
      state.view.imageCenter = [centerPoint.x, centerPoint.y]
    })

    // Pan
    state.OSDviewer.addHandler('pan', function (e) {
      let centerPoint = state.OSDviewer.world.getItemAt(0).viewportToImageCoordinates(
        state.OSDviewer.viewport.getCenter(true)
      )
      state.view.imageCenter = [centerPoint.x, centerPoint.y]
    })
  },

  // Add images to the state
  addImagesToState: (state, images) => {
    state.images = []
    for (let i in images) {
      state.images.push(images[i])
    }
  },

  // Add dzi images to OpenSeaDragon OSDviewer
  addOSDImage: (state, image) => {
    if (image.type === 'dzi') {
      state.OSDviewer.addTiledImage({
        tileSource: image.source,
        x: 0,
        y: 0,
        opacity: 1.0
      })
    } else if (image.type === 'simple') {
      state.OSDviewer.addSimpleImage({
        url: image.source,
        x: 0,
        y: 0,
        opacity: 1.0
      })
    }
  },

  setActiveChannel: (state, payload) => {
    state.activeChannel = payload
  },

  // Toggle the visibility of a channel.
  // TODO: build in some kind of cache of opacity so that when it is toggled
  // from not-visible to visible it can easily return to the state it was.
  toggleChannelOpacity: (state, payload) => {
    // Payload should be a Channel object as defined by getChannels().
    if (payload.opacity > 0) {
      payload.channel.setOpacity(0)
    } else {
      payload.channel.setOpacity(0.7)
    }
  },

  // Set channel visibility
  setChannelOpacity: (state, payload) => {
    let input = payload.input
    let newOpacity = 1 // Default

    // There are multiple ways to edit the opacity.
    // Handle each of the different inputs.
    // If passed an integer
    if (typeof input === 'string' || typeof input === 'number') {
      input = Number(input)
      if (input > 1) {
        newOpacity = input / 100
      } else {
        newOpacity = input
      }

      // If passed a keyboard event. (most likely enter key from a text edit.)
    } else if (input instanceof KeyboardEvent) {
      newOpacity = input.target.value / 100
    }

    // Set the new opacity level
    state.OSDviewer.world.getItemAt(state.activeChannel).setOpacity(newOpacity)
  },

  // Set the channel name
  setChannelName: (state, payload) => {
    let newName
    // Check if keyboard event. This happens in the case that the user types
    // the opacity value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newName = payload.target.value
    } else {
      newName = payload
    }

    // Save changes to Vuex state
    Vue.set(state.images[state.activeChannel], 'name', newName)
  },

  // Set the zoom level
  setZoom: (state, payload) => {
    let newZoom
    // Check if keyboard event. This happens in the case that the user types
    // the zoom value in the text box and hits enter
    if (payload instanceof KeyboardEvent) {
      newZoom = Number(payload.target.value)
    } else {
      newZoom = Number(payload)
    }

    if (typeof newZoom === 'number' && newZoom > 0) {
      state.OSDviewer.viewport.zoomTo(newZoom)
    }
  }
}
