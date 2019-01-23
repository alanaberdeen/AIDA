import Vue from 'vue'
import openseadragon from 'openseadragon'

export default {
  addImageToState: (state, fileName) => {
    state.fileName = fileName

    // Set image name by removing extension
    state.imageName = fileName.replace(/\.[^/.]+$/, '')

    // Set image type by checking for .dzi
    if (fileName.indexOf('.dzi') > -1) {
      state.imageType = 'dzi'
    } else {
      state.imageType = 'simple'
    }
  },

  resetImageState: (state) => {
    state.OSDviewer.navigator.destroy()
    state.OSDviewer.destroy()
    state = {
      OSDviewer: null,
      OSDworld: null,
      activeChannel: 0,
      imageName: '',
      imageType: 'dzi'
    }
  },

  setupOsdCanvas: (state, payload) => {
    state.OSDviewer = new openseadragon.Viewer({
      id: payload,
      showNavigationControl: false,
      showNavigator: true,
      navigatorId: 'navigator'
    })
  },

  addImageToCanvas: (state) => {
    if (state.imageType === 'dzi') {
      state.OSDviewer.addTiledImage({
        tileSource: 'http://localhost:3000/data/images/' + state.fileName,
        x: 0,
        y: 0,
        opacity: 1
      })
    } else if (state.imageType === 'simple') {
      state.OSDviewer.addSimpleImage({
        x: 0,
        y: 0,
        opacity: 1,
        url: 'http://localhost:3000/data/images/' + state.fileName
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

  setChannelOpacity: (state, payload) => {
    let input = payload.input
    let newOpacity = 1 // Default

    // There are multiple ways to edit the opacity.
    // Handle each of the different inputs.
    // If passed an integer
    if (typeof input === 'string') {
      newOpacity = Number(input / 100)
    } else if (input instanceof KeyboardEvent) {
      newOpacity = input.target.value / 100
    } else {
      newOpacity = input
    }

    state.OSDviewer.world.getItemAt(state.activeChannel).setOpacity(newOpacity)
  },

  setChannelName: (state, payload) => {
    // Save changes to Vuex state, have to use Vue.set to get around the fact that vueJs
    // is not reactive to mutations of arrays.
    if (payload instanceof KeyboardEvent) {
      Vue.set(state.images[state.activeChannel], 'name', payload.target.value)
    } else {
      Vue.set(state.images[state.activeChannel], 'name', payload)
    }
  },

  setZoom: (state, payload) => {
    let newZoom
    if (payload instanceof KeyboardEvent) {
      newZoom = Number(payload.target.value)
    } else {
      newZoom = Number(payload)
    }

    if (newZoom > 0) { state.OSDviewer.viewport.zoomTo(newZoom) }
  }
}
