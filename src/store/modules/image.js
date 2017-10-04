// This file handles the management of the state for the image viewer.
// The image viewer is controled via the OpenSeadragon js lib.
import openseadragon from 'openseadragon';
import paper from 'paper';

const state = {
	viewer: null
};

const getters = {

	getImageWidth: state => {
        if(state.viewer) {
            return state.viewer.world.getItemAt(0).getContentSize.x
        }
	},

	getChannels: (state, getters, rootState) => {
		let channels = [];

		if (state.viewer) {
			let numChannels = state.viewer.world.getItemCount();

			for (let i = 0; i < numChannels; i++){
				channels.push({
					channel: state.viewer.world.getItemAt(i),
					id: i,
					opacity: state.viewer.world.getItemAt(i).getOpacity()*100,
					name: rootState.config.channels[i].name,
					visible: (state.viewer.world.getItemAt(i).getOpacity() > 0),
					opacityCache: 0
				})
			}
		}
		return channels
	}
};

const actions = {
	initialiseViewer: ({commit}, payload) => {
		commit('initialiseViewer', payload);
	},

	addImages: ({commit}, channels) => {
		commit('addImages', channels)
	},

	synchroniseAnnotationAndImage: ({state, commit, rootState}) => {
		commit('synchroniseAnnotationAndImage', rootState.annotation.paperScope)
	},

	toggleChannelVisibility: ({commit}, payload) => {
		commit('toggleChannelVisibility', payload)
	},

	setChannelVisibility: ({commit}, payload) => {
		commit('setChannelVisibility', payload)
	}
};

const mutations = {

	// Initialise the openseadragon Viewer class.
	initialiseViewer: (state, payload) => {
		state.viewer = new openseadragon.Viewer({
            id: 'osd-canvas',
            showNavigationControl: false
        });
    },

    // Add a handler function that will run when osd-viewport is updated.
    // This will synchronously update the paperJS viewport.
    // This is an expensive operation as it ensures all parameteres are in sync
    // on every viewport update. For example, zoom may not have changed but it
    // would still fire this event and update the zoom. However, seperating into
    // the individual parts led to a far less smooth experience. Leave it here
    // for now at least.
    synchroniseAnnotationAndImage: (state, paperScope) => {

        state.viewer.addHandler('update-viewport', function() {

            // Check the current size of the Canvas container DOM element
            // and set the paperJS view to match this.
            let canvasWidth = state.viewer.canvas.clientWidth;
            let canvasHeight = state.viewer.canvas.clientHeight;

            // Update the size of the Paper view
            // UNSATISFACTORY: unable to dispatch an action to commit a mutation
            // as is the patern of Vuex because already in a mutation callback.
            // But as the PaperScope annotation and OpenSeaDragon viewer
            // instances are seperated into modules can't currently  see another
            // option.
            paperScope.view.viewSize = new paper.Size(canvasWidth, canvasHeight);

            // Handle changes in zoom level
            let viewportZoom = state.viewer.viewport.getZoom(true);
            let image1 = state.viewer.world.getItemAt(0);
            paperScope.view.zoom = image1.viewportToImageZoom(viewportZoom);

            // Ensure the same center point
            let center = image1.viewportToImageCoordinates(state.viewer.viewport.getCenter(true));
            paperScope.view.center = new paper.Point(center.x, center.y);

            // Update paths to have strokeWidth reactive to zoom level.
            // This might be computationally-expensive but will try for now.
            var size = image1.getContentSize().x;
            paperScope.project.layers.forEach((layer) => {
                layer.children.forEach((child) => {
                    if(child.className === 'Path') {
                        child.strokeWidth = size/(viewportZoom*500);
                    }
                })
            })
        });
	},

	// Add images to the openseadragon Viewer
	addImages: (state, channels) => {

		for (let image in channels){

            // If pulling from secure data scource then need to set the correct
            // params: ajaxWithCredentials, loadTilesWithAjax, ajaxHeaders.
            // see: https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#addTiledImage
            state.viewer.addTiledImage({
                tileSource: channels[image].url,
                x: 0,
                y: 0,
                opacity: 0.7
            });
		}
	},

	// Toggle the visibility of a channel.
	// TODO: build in some kind of cache of opacity so that when it is toggled
	// from not-visible to visible it can easily return to the state it was.
	toggleChannelVisibility: (state, payload) => {
		// Payload should be a Channel object as defined by getChannels().
		if (payload.opacity > 0) {
			payload.channel.setOpacity(0);
		} else {
			payload.channel.setOpacity(0.7);
		}
	},

	// Set visibility of a channel
	setChannelVisibility: (state, payload) => {
		payload.channel.setOpacity(payload.opacity/100)
	}
};

// Export all of the relevent logic so that it can be combined with the complete
// store and all other module logic.
export default {
	state,
	getters,
	actions,
	mutations
};

