// This file handles the management of the state for the annotations. 
// The annotation layers are controled via the PaperJS lib. 
import paper from 'paper';
import Vue from 'vue';

const state = {
	paperScope: {
		project: {
			layers: []
		}
	}
};

const getters = {

	// Return the currently active paperScope instance. 
	getPaperScope: state => {
		return state.paperScope
	}
};

const actions = {
	initialiseAnnotation: ({commit}, payload) => {
		commit('initialiseAnnotation', payload);
	}, 

	loadAnnotation: ({commit}, payload) => {
		commit('loadAnnotation', payload);
	},

	exportJSON: ({commit}, payload) => {
		commit('exportJSON', payload);
	},

	prepareCanvas: ({commit}, payload) => {
		commit('prepareCanvas', payload);
	},

	newLayer: ({commit}, payload) => {
		commit('newLayer', payload);
	},

	activateLayer: ({commit}, payload) => {
		commit('activateLayer', payload);
	}
};

const mutations = {

	// Setup the PaperJs instance on the canvas DOM element. 
	initialiseAnnotation: (state, payload) => {
		state.paperScope = paper.setup(payload.canvas);
	},

	// Loads a PaperJS project JSON string into the current PaperScope 
	loadAnnotation: (state, payload) => {
		state.paperScope.project.importJSON(payload)
	},

	// Export a PaperJS JSON string representing current state to the console.
	// If no payload param then default to exporting the whole PaperJS project. 
	exportJSON: (state, payload) => {
		if (payload) {
			console.log(payload.exportJSON())
		} else {
			console.log(state.paperScope.project.exportJSON())
		}
	},

	// Prepare the canvas for adding annotations. 
	prepareCanvas: (state, payload) => {
		// Remove the class that interupts the pointer interaction. 
		if (state.paperScope.view.element.classList.contains('pointers-no')){
                state.paperScope.view.element.classList.remove('pointers-no');
            }
	}, 

	// Add a new layer to the annotation project. 
	newLayer: (state, payload) => {
		let newLayerIndex = state.paperScope.project.layers.length + 1;
        let newLayer = new paper.Layer({
            name: 'Layer ' + newLayerIndex,
            position: state.paperScope.view.center
        });

        // The way that PaperJS adds a new layer to the paperScope instance 
        // slips by the VueJS Change Detection. This is a known issue when 
        // mutating objects/arrays in certain ways. Therefore, must explicitly
        // Vue tell Vue to set the property and watch for it's changes. 
        // See: https://vuejs.org/v2/guide/reactivity.html
        Vue.set(state.paperScope.project, 'layers', state.paperScope.project.layers);
        Vue.set(state.paperScope.project, 'activeLayer', newLayer);
	},

	// Select a specified layer 
	activateLayer: (state, payload) => {
        Vue.set(state.paperScope.project, 'activeLayer', payload);
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
