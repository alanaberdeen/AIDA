import Vue from 'vue'
import openseadragon from 'openseadragon'
import axios from 'axios'

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
      activeImageIndex: 0,
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
      navigatorAutoResize: false
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

  setActiveImage: (state, payload) => {
    // Payload can be either the image index or the image name.
    if (typeof payload === 'number') {
      state.activeImageIndex = payload
    } else if (typeof payload === 'string') {
      state.activeImageIndex = state.images.findIndex(image => {
        return image.name === payload
      })
    }
  },

  setActiveImageName: (state, payload) => {
    // Save changes to Vuex state, have to use Vue.set to get around the fact that vueJs
    // is not reactive to mutations of arrays.
    if (payload instanceof KeyboardEvent) {
      Vue.set(state.images[state.activeImageIndex], 'name', payload.target.value)
    } else {
      Vue.set(state.images[state.activeImageIndex], 'name', payload)
    }
  },

  addOSDImage: (state, payload) => {
    // Add the image to the OSD viewer.
    // Require different API method calls for tiled/simple images.
    if (payload.fileType === 'tiled') {
      axios.get(location.origin + '/iiif')
        .then((response) => {
          state.OSDviewer.addTiledImage({
            tileSource: new URL(encodeURIComponent(payload.source) + '/info.json', response.data.toString()).toString(),
            opacity: payload.opacity
          })
        })
    } else if (payload.fileType === 'dzi') {
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
