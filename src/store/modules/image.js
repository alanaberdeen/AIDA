// This file handles the management of the state for the image viewer. 
// The image viewer is controled via the OpenSeadragon js lib. 

import openseadragon from 'openseadragon';
import paper from 'paper';

const state = {
	viewer: {}
};

const getters = {

	// getViewportZoom: state => {
	// 	return state.viewer.viewport.getZoom(true)
	// },

	getImageWidth: state => {
		return state.viewer.world.getItemAt(0).getContentSize.x
	}

};

const actions = {
	initialiseViewer: ({commit}, payload) => {
		commit('initialiseViewer', payload);
	},

	addImages: ({commit}, payload) => {
		commit('addImages', payload)
	},

	synchroniseAnnotationAndImage: ({commit}, payload) => {
		commit('synchroniseAnnotationAndImage', payload)
	}
};

const mutations = {

	// Initialise the openseadragon Viewer class. 
	initialiseViewer: (state, payload) => {
		state.viewer = new openseadragon.Viewer({
            id: payload.id,
            prefixUrl: payload.prefixUrl,
            showNavigationControl: payload.showNavigationControl
        });
    },	

    // Add a handler function that will run when osd-viewport is updated.
    // This will synchronously update the paperJS viewport.
    synchroniseAnnotationAndImage: (state, payload) => {
        
        state.viewer.addHandler('update-viewport', function() {

            // Check the current size of the Canvas container DOM element 
            // and set the paperJS view to match this. 
            let canvasWidth = document.getElementById('canvas').clientWidth;
            let canvasHeight = document.getElementById('canvas').clientHeight;

            // Update the size of the Paper view
            // UNSATISFACTORY: unable to dispatch an action to commit a mutation 
            // as is the patern of Vuex because already in a mutation callback. 
            // But as the PaperScope annotation and OpenSeaDragon viewer 
            // instances are seperated into modules can't currently  see another 
            // option. 

            // Ensure the same size
            payload.paperScope.view.viewSize = new paper.Size(canvasWidth, canvasHeight);

            // Handle changes in zoom level
            let viewportZoom = state.viewer.viewport.getZoom(true);
            let image1 = state.viewer.world.getItemAt(0);
            payload.paperScope.view.zoom = image1.viewportToImageZoom(viewportZoom);

            // Ensure the same center point
            let center = image1.viewportToImageCoordinates(state.viewer.viewport.getCenter(true));
            payload.paperScope.view.center = new paper.Point(center.x, center.y);

            // Update paths to have strokeWidth reactive to zoom level.
            // This might be computationally-expensive but will try for now.
            var size = image1.getContentSize().x;
            payload.paperScope.project.layers.forEach((layer) => {
                layer.children.forEach((child) => {
                    if(child.className === 'Path') {
                        child.strokeWidth = size/(viewportZoom*500);
                    }
                })
            })
        });
	},

	// Add images to the openseadragon Viewer
	addImages: (state, payload) => {

		for (let image in payload){
            state.viewer.addTiledImage({
                tileSource: payload[image].url,
                x: 0,
                y: 0,
                opacity: 0.7
            });

		}
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

