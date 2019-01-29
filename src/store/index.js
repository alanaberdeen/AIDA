import Vue from 'vue'
import Vuex from 'vuex'

import backend from './modules/backend/index'
import app from './modules/app/index'
import image from './modules/image/index'
import annotation from './modules/annotation/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    backend,
    app,
    image,
    annotation
  }
})
