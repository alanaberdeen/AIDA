import Vue from 'vue'

export default {
  resetEditorState: (state) => {
    state = {
      'type': 'dzi',
      'activeChannel': 0,
      'activeLayer': 0,
      'activeStep': 0,
      'steps': null
    }
  },

  setActiveStep: (state, stepIndex) => {
    state.activeStep = stepIndex
  },

  setEditorActiveLayer: (state, layerIndex) => {
    state.activeLayer = layerIndex
  },

  loadConfig: (state, payload) => {
    // Using Vue.set on the parent (rootState) to ensure that we don't fall into
    // the trap of Vue reactivity caveats.
    // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
    let newState = { ...state,
      ...payload.editor
    }
    Vue.set(payload.rootState, 'editor', newState)
  },

  toggleSettings: (state) => {
    state.settingsFlag = !state.settingsFlag
  },

  toggleToolsDrawer: state => {
    state.toolsDrawer = !state.toolsDrawer
  },

  toolsDrawerOff: state => {
    state.toolsDrawer = false
  },

  toolsDrawerOn: state => {
    state.toolsDrawer = true
  },

  toggleStudioDrawer: state => {
    state.studioDrawer = !state.studioDrawer
  },

  studioDrawerOff: state => {
    state.studioDrawer = false
  },

  studioDrawerOn: state => {
    state.studioDrawer = true
  },

  setActiveValidationIndex: (state, payload) => {
    state.activeValidationIndex = payload
  }
}
