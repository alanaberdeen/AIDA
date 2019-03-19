import Vue from 'vue'
import openseadragon from 'openseadragon'

export default {
  setProjectImageName: (state, projectImageName) => {
    state.projectImageName = projectImageName
  },

  resetImageState: (state) => {
    state.OSDviewer.navigator.destroy()
    state.OSDviewer.destroy()

    state = {
      OSDviewer: null,
      OSDworld: null,
      activeChannel: 0,
      view: {
        viewSize: [null, null],
        imageSize: [null, null],
        imageCenter: [null, null],
        imageZoom: null
      },
      image: '',
      imageAccessToken: ''
    }
  },

  setupOsdCanvas: (state, payload) => {
    state.OSDviewer = new openseadragon.Viewer({
      id: payload,
      showNavigationControl: false,
      showNavigator: true,
      navigatorId: 'navigator',
      maxZoomPixelRatio: 2
    })

    // Prevent rotation and 'flipping' of the image through the default keybaord
    // shortcuts, R and F. (these were conflicting with other annotation tool
    // shortcuts when the image was open)
    state.OSDviewer.addHandler('canvas-key', e => {
      if (e.originalEvent.code === 'KeyR' || e.originalEvent.code === 'KeyF') {
        e.preventDefaultAction = true
      }
    })
  },

  setActiveChannel: (state, payload) => {
    // Payload can be either the channel index or the channel name.
    if (typeof payload === 'number') {
      state.activeChannelIndex = payload
    } else if (typeof payload === 'string') {
      state.activeChannelIndex = state.images.findIndex(image => {
        return image.name === payload
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

  setActiveChannelOpacity: (state, input) => {
    // The opacity can be set by the 'enter' key-event or mouse interaction with
    // the UI slider. Where exactly the value is specified it dependent on how
    // this action was triggered.
    let newOpacity
    if (input instanceof KeyboardEvent) {
      newOpacity = input.target.value / 100
    } else {
      newOpacity = input / 100
    }

    // Restrict value to between 0 and 1
    newOpacity = Math.min(Math.max(newOpacity, 0), 1)

    const channel = state.OSDviewer.world.getItemAt(state.activeChannelIndex)
    if (channel) channel.setOpacity(newOpacity)
  },

  setActiveChannelName: (state, payload) => {
    // Save changes to Vuex state, have to use Vue.set to get around the fact that vueJs
    // is not reactive to mutations of arrays.
    if (payload instanceof KeyboardEvent) {
      Vue.set(state.images[state.activeChannelIndex], 'name', payload.target.value)
    } else {
      Vue.set(state.images[state.activeChannelIndex], 'name', payload)
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
  },

  addOSDImage: (state, payload) => {
    // Add the image to the OSD viewer.
    // Require different API method calls for tiled/simple images.
    if (payload.fileType === 'dzi') {
      state.OSDviewer.addTiledImage({
        tileSource: payload.source,
        opacity: payload.opacity
      })
    } else if (payload.fileType === 'simple') {
      state.OSDviewer.addSimpleImage({
        url: payload.source,
        opacity: payload.opacity
      })
    }

    // Keep a record of the available images.
    state.images.push({
      ...payload,
      index: state.OSDviewer.world.getItemCount()
    })
  },

  clearImages: state => {
    state.images = []
  },

  setPixelScaleFactor: (state, payload) => {
    state.pixelScaleFactor.mppX = payload.mppX
    state.pixelScaleFactor.mppY = payload.mppY
  }
}
