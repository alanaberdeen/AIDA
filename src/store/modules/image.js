// This file handles the management of the state for the image viewer.
// The image viewer is controlled via the OpenSeaDragon js lib.
import openseadragon from 'openseadragon'

const state = {
  OSDviewer: null,
  OSDworld: null,
  images: [],
  view: {
    viewSize: [null, null],
    imageSize: [null, null],
    imageCenter: [null, null],
    imageZoom: null
  }
}

const getters = {
  getImageWidth: state => {
    if (state.OSDviewer) {
      if (state.OSDviewer.world.getItemCount() > 0) {
        return state.OSDviewer.world.getItemAt(0).getContentSize.x
      } else {
        return 0
      }
    }
  },

  getChannels: (state, getters, rootState) => {
    let channels = []

    if (state.OSDviewer) {
      let numChannels = state.OSDviewer.world.getItemCount()

      for (let i = 0; i < numChannels; i++) {
        channels.push({
          channel: state.OSDviewer.world.getItemAt(i),
          id: i,
          opacity: state.OSDviewer.world.getItemAt(i).getOpacity(),
          name: state.images[i].name,
          visible: state.OSDviewer.world.getItemAt(i).getOpacity() > 0,
          opacityCache: 0
        })
      }
    }
    return channels
  }
}

const actions = {
  setupOSDCanvas: ({
    commit
  }, payload) => {
    commit('setupOSDCanvas', payload)
  },

  // Load the images into the state and then add them to the appropriate OSDviewer
  loadImages: ({
    state,
    dispatch
  }, images) => {
    dispatch('addImagesToState', images).then(() => {
      for (let i in images) {
        dispatch('addOSDImage', images[i])
      }
    })
  },

  addImagesToState: ({
    commit
  }, images) => {
    commit('addImagesToState', images)
  },

  addOSDImage: ({
    commit
  }, image) => {
    commit('addOSDImage', image)
  },

  toggleChannelOpacity: ({
    commit
  }, payload) => {
    commit('toggleChannelOpacity', payload)
  },

  setChannelOpacity: ({
    commit,
    rootState
  }, payload) => {
    commit('setChannelOpacity', {
      input: payload,
      activeChannel: rootState.config.activeChannel,
      rootState: rootState
    })
  },

  setChannelName: ({
    commit
  }, payload) => {
    commit('setChannelName')
  }
}

const mutations = {
  // Setup an OpenSeaDragon OSDviewer.
  setupOSDCanvas: (state, payload) => {
    // Create and OSD viewer
    state.OSDviewer = new openseadragon.Viewer({
      id: payload,
      showNavigationControl: false
    })

    // Add handlers to update the state when certain events are triggered on the
    // viewer. These state changes can be propagated through to the annotation
    // data to keep the two parts in sync.

    // Resize
    state.OSDviewer.addHandler('resize', function (e) {
      state.view.viewSize = [e.newContainerSize.x, e.newContainerSize.y]
      let centerPoint = state.OSDviewer.viewport.viewportToImageCoordinates(
        state.OSDviewer.viewport.getCenter(true)
      )
      state.view.imageCenter = [centerPoint.x, centerPoint.y]
    })

    // Zoom
    state.OSDviewer.addHandler('zoom', function (e) {
      state.view.imageZoom = state.OSDviewer.viewport.viewportToImageZoom(
        state.OSDviewer.viewport.getZoom(true)
      )

      let centerPoint = state.OSDviewer.viewport.viewportToImageCoordinates(
        state.OSDviewer.viewport.getCenter(true)
      )
      state.view.imageCenter = [centerPoint.x, centerPoint.y]
    })

    // Pan
    state.OSDviewer.addHandler('pan', function (e) {
      let centerPoint = state.OSDviewer.viewport.viewportToImageCoordinates(
        state.OSDviewer.viewport.getCenter(true)
      )
      state.view.imageCenter = [centerPoint.x, centerPoint.y]
    })
  },

  // Add images to the state
  addImagesToState: (state, images) => {
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
        opacity: 0.8
      })
    } else if (image.type === 'simple') {
      state.OSDviewer.addSimpleImage({
        url: image.source,
        x: 0,
        y: 0,
        opacity: 0.8
      })
    }
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
    state.OSDviewer.world.getItemAt(payload.activeChannel).setOpacity(newOpacity)
  },

  // Set the channel name
  setChannelName: (state, payload) => {
    // payload.channel.
  }
}

// Export all of the relevant logic so that it can be combined with the complete
// store and all other module logic.
export default {
  state,
  getters,
  actions,
  mutations
}
