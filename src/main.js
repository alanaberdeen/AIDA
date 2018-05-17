// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  Vcard,
  VMenu,
  VDivider,
  VStepper,
  VSlider,
  VDialog,
  VTabs,
  VTextField,
  VTooltip
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'
import './css/main.css'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    Vcard,
    VMenu,
    VDivider,
    VStepper,
    VSlider,
    VDialog,
    VTabs,
    VTextField,
    VTooltip
  }
})

Vue.config.productionTip = false

// Event bus to handle child-child communication
export const eventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
