import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css' // Ensure you are using css-loader

// Vuetify content
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

// Event bus to handle child-child communication
export const eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
