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
    Vue.set(payload.rootState, 'editor', payload.editor)
  },

  toggleSettings: (state) => {
    state.settingsFlag = !state.settingsFlag
  }
}
