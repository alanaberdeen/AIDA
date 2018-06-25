// Using Vuex paradigm to build a central store of application state.
import Vue from 'vue'
import Vuex from 'vuex'

// Import the Vuex logic that has been modularized and separated into different
// files.
import image from './modules/image/index'
import annotation from './modules/annotation/index'
import editor from './modules/editor/index'
import common from './modules/common/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    image,
    annotation,
    editor,
    common
  }
})
