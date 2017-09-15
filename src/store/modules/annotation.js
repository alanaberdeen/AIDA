// This file handles the management of the state for the annotations. 
// The annotation layers are controled via the PaperJS lib. 
import paper from 'paper';

const state = {
	paperScope: {}
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
