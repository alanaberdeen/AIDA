// This file handles the management of the state for the annotation tool. 
// This specifies the layout of the annotation interface. This may include 
// the required steps and instructions, the tools necessary to complete 
// the annotations or the default image and annotation content.  

const state = {
        activeStep: 0,
        tools: {
            pan: {
                include: true,
                name: 'Pan and Zoom',
                caption: 'Pan and zoom'
            },
            circle: {
                include: true,
                name: 'Circle',
                caption: 'Plot circles',
            },
            rectangle: {
                include: true,
                name: 'Rectangle',
                caption: 'Draw rectangles'
            },
            pen: {
                include: true,
                name: 'Pen',
                caption: 'Draw smooth paths by plotting node points'
            },
            pencil: {
                include: true,
                name: 'Pencil',
                caption: 'Draw smooth paths by dragging the mouse'
            },
            move: {
                include: true,
                name: 'Move',
                caption: 'Move and scale annotation items'
            },
            node: {
                include: true,
                name: 'Node',
                caption: 'Manipulate path nodes and handles'
            },
            count: {
                include: true,
                name: 'Count',
                caption: 'Count items within a rectangle'
            }
        },
        steps: [
            {   id: 1,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                regionOfIntereset: false,
                instruction: 'Instructions for Step 1: Use the circle tool to mark the lymphocytes within the region of interest.'
            },
            {   id: 2,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                regionOfIntereset: true,
                instruction: 'Instructions for Step 2: Use the contour tool to mark the non-tumor region.'
            },
            {   id: 3,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                regionOfIntereset: false,
                instruction: 'Instructions for Step 3: Use the contour tool to mark the center of the tumor.'
            },
            {   id: 4,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                regionOfIntereset: false,
                instruction: 'Instructions for Step 4: Use the contour tool to mark the invasive margin.'
            },
            {   id: 5,
                tools: ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count'],
                regionOfIntereset: false,
                instruction: 'Instructions for Step 5: Use the contour tool to mark the area around the glands.'
            }
        ],
        channels: [{
            name: 'Highsmith',
            url: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
        }],
        annotation: '["Layer",{"name":"Circles","applyMatrix":true,"children":[["Group",{"applyMatrix":true}],["Group",{"applyMatrix":true}],["Path",{"applyMatrix":true,"data":{"countable":true},"segments":[[[2833.81806,3521.67343],[0,314.028],[0,-314.028]],[[3402.41605,2953.07544],[-314.028,0],[314.028,0]],[[3971.01404,3521.67343],[0,-314.028],[0,314.028]],[[3402.41605,4090.27142],[314.028,0],[-314.028,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":21.53835}],["Path",{"applyMatrix":true,"data":{"countable":true},"segments":[[[3449.21215,4848.68081],[0,472.14183],[0,-472.14183]],[[4304.10055,3993.79241],[-472.14183,0],[472.14183,0]],[[5158.98896,4848.68081],[0,-472.14183],[0,472.14183]],[[4304.10055,5703.56922],[472.14183,0],[-472.14183,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":21.53835}],["Path",{"applyMatrix":true,"data":{"countable":true},"segments":[[[1031.26573,5393.0941],[0,454.51656],[0,-454.51656]],[[1854.24077,4570.11906],[-454.51656,0],[454.51656,0]],[[2677.21582,5393.0941],[0,-454.51656],[0,454.51656]],[[1854.24077,6216.06914],[454.51656,0],[-454.51656,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":21.53835}]]}]'
};

const getters = {

	// Get an array of images in the configuration. 
	getConfigChannels: state => {
		return state.channels
	},

	// Get a string representing the PaperJS project annotations that has been 
	// saved to the configuration obejct. 
	getAnnotation: state => {
		return state.annotation
	},

	getActiveStep: state => {
		return state.activeStep
	},

	checkIncludeTool: state => (tool) => {
		return tool
	},

	// Get an array specifiying the tools included in the current step. 
	getStepTools: state => {
		return state.steps[state.activeStep].tools
	}
};

const actions = {
	addImage: ({commit}, payload) => {
		commit('addImage', payload);
	}
};

const mutations = {
	addImage: (state, payload) => {
		state.images.push()
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
