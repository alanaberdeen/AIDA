import Vue from 'vue'

import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css' // Ensure using css-loader
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
