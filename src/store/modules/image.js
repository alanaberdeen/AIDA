// This file handles the management of the state for the image viewer.
// The image viewer is controled via the OpenSeadragon js lib.
import openseadragon from 'openseadragon'

const state = {
  viewer: null,
  images: []
}

const getters = {
  getImageWidth: state => {
    if (state.viewer) {
      if (state.viewer.world.getItemCount() > 0) {
        return state.viewer.world.getItemAt(0).getContentSize.x
      } else {
        return 0
      }
    }
  },

  getChannels: (state, getters, rootState) => {
    let channels = []

    if (state.viewer) {
      let numChannels = state.viewer.world.getItemCount()

      for (let i = 0; i < numChannels; i++) {
        channels.push({
          channel: state.viewer.world.getItemAt(i),
          id: i,
          opacity: state.viewer.world.getItemAt(i).getOpacity(),
          name: state.images[i].name,
          visible: state.viewer.world.getItemAt(i).getOpacity() > 0,
          opacityCache: 0
        })
      }
    }
    return channels
  }
}

const actions = {
  setupViewer: ({ commit }, payload) => {
    commit('setupViewer', payload)
  },

  loadImages: ({ commit }, images) => {
    commit('loadImages', images)
  },

  toggleChannelOpacity: ({ commit }, payload) => {
    commit('toggleChannelOpacity', payload)
  },

  setChannelOpacity: ({ commit, rootState }, payload) => {
    commit('setChannelOpacity', {
      input: payload,
      activeChannel: rootState.config.activeChannel,
      rootState: rootState
    })
  },

  setChannelName: ({ commit }, payload) => {
    commit('setChannelName')
  }
}

const mutations = {
  // Initialise the openseadragon Viewer class.
  setupViewer: (state, payload) => {
    state.viewer = new openseadragon.Viewer({
      id: payload,
      showNavigationControl: false
    })
  },

  // Add images to the openseadragon Viewer
  loadImages: (state, images) => {
    for (let i in images) {
      // If pulling from secure data scource then need to set the correct
      // params: ajaxWithCredentials, loadTilesWithAjax, ajaxHeaders.
      // see: https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#addTiledImage

      // Store them in the state
      state.images.push(images[i])

      // Add them to the OpenSeaDragon Viewer
      state.viewer.addTiledImage({
        tileSource: images[i].source,
        x: 0,
        y: 0,
        opacity: 0.7
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

    // If passed a keyboard event. (mostlikely enter key from a text edit.)
    } else if (input instanceof KeyboardEvent) {
      newOpacity = input.target.value / 100
    }

    // Set the new opacity level
    state.viewer.world.getItemAt(payload.activeChannel).setOpacity(newOpacity)
  },

  // Set the channel name
  setChannelName: (state, payload) => {
    // payload.channel.
  }
}

// Export all of the relevent logic so that it can be combined with the complete
// store and all other module logic.
export default {
  state,
  getters,
  actions,
  mutations
}
