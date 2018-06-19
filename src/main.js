import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css' // Ensure you are using css-loader

// Vuetify content
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Vue Validate
import VeeValidate from 'vee-validate'

// Add in an extra password strength validator
VeeValidate.Validator.extend('verify_password', {
  getMessage: field => 'The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)',
  validate: value => {
    var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
    return strongRegex.test(value)
  }
})

Vue.use(Vuetify)
Vue.use(VeeValidate)

Vue.config.productionTip = false

// Event bus to handle child-child communication
export const eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
