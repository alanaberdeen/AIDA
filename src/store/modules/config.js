// This file handles the management of the state for the annotation tool.
// This specifies the layout of the annotation interface. This may include
// the required steps and instructions, the tools necessary to complete
// the annotations or the default image and annotation content.

const state = {
        activeStep: 1,
        steps: [
            {   id: 1,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                ROI: false,
                instruction: 'Instructions for Step 1: Use the circle tool to mark the lymphocytes within the region of interest.'
            },
            {   id: 2,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                ROI: false,
                instruction: 'Instructions for Step 2: Use the pencil tool to mark the non-tumour region.'
            },
            {   id: 3,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                ROI: false,
                instruction: 'Instructions for Step 3: Use the pencil tool to mark the central region of the tumour.'
            },
            {   id: 4,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                ROI: false,
                instruction: 'Instructions for Step 4: Use the pencil tool to mark the invasive margin.'
            },
            {   id: 5,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                ROI: false,
                instruction: 'Instructions for Step 5: Use the pencil tool to mark the area around the glands.'
            }
        ],
        tools: {
            pan: {
                name: 'Pan and Zoom',
                caption: 'Pan and zoom'
            },
            circle: {
                name: 'Circle',
                caption: 'Plot circlular markers',
            },
            rectangle: {
                name: 'Rectangle',
                caption: 'Draw rectangles'
            },
            pen: {
                name: 'Pen',
                caption: 'Draw smooth paths by plotting node points'
            },
            pencil: {
                name: 'Pencil',
                caption: 'Draw smooth paths by dragging the mouse'
            },
            move: {
                name: 'Move',
                caption: 'Move and scale items'
            },
            node: {
                name: 'Node',
                caption: 'Manipulate path nodes and handles'
            },
            count: {
                name: 'Count',
                caption: 'Count items within a specified rectangle'
            }
        },
        channels: [{
            name: 'Highsmith',
            url: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
        }],
        annotation: `[["Layer",{"name":"Lymphocytes","applyMatrix":true}],
                     ["Layer",{"name":"Non-tumour region","applyMatrix":true}],
                     ["Layer",{"name":"Tumour centre","applyMatrix":true}],
                     ["Layer",{"name":"Invasive margin","applyMatrix":true}],
                     ["Layer",{"name":"Glands","applyMatrix":true}]]`
};

const getters = {

	// Get an array specifiying the tools included in the current step.
	getConfigStepTools: state => {
		return state.steps[state.activeStep - 1].tools
	}
};

const actions = {

    // Load a configuration into the tool.
    // May perform asynchronous tasks here (like pulling from REST API) before
    // committing the state mutation which must run synchronously.
    loadConfig: ({commit}, payload) => {

        // let newConfig = ****** pull from API *****
        // .then(() => {
        //  commit('loadConfig', newConfig);
        // )}
    },

	addImage: ({commit}, payload) => {
		commit('addImage', payload);
	},

    // Action dispatches events to set both the active step and the active layer
    // ensuring that they are in sync.
    setActiveStepAndLayer: ({dispatch}, step) => {
        dispatch('activateLayer', step);
        dispatch('setActiveStep', step);
    },

	setActiveStep: ({commit}, step) => {
		commit('setActiveStep', step);
	},

    // Save the current configuration to the server.
    saveConfig: ({dispatch, commit}) => {

        // Update the config and then save to RestAPI
        dispatch('updateConfig').then(() => {

            // Here is where we would push to REST API
            // ****** Save to API *****
            console.log("saved the new configuration");
            console.log(state);
        })
    },

    updateConfig: ({dispatch, commit, rootState, rootGetters}) => {
        let newAnnotations = rootGetters.getAnnotationProjectJSON;
        commit('updateConfig', newAnnotations);
    }
};

const mutations = {
	addImage: (state, payload) => {
		state.channels.push()
	},

	setActiveStep: (state, step) => {
		state.activeStep = step;
	},

    updateConfig: (state, newAnnotations) => {
        state.annotation = newAnnotations;
    },

    loadConfig: (state, newConfig) => {
        state.config = newConfig;
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
