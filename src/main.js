/*jshint esversion: 6 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';

Vue.use(Vuetify);
Vue.config.productionTip = false;

// Event bus to handle child-child communication
export const eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
