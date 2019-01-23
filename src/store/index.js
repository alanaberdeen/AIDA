import Vue from 'vue'
import Vuex from 'vuex'

import image from './modules/image/index'
import annotation from './modules/annotation/index'
import app from './modules/app/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    image,
    annotation
  }
})
