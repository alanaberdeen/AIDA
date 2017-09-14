/*jshint esversion: 6 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

// Routing
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// CSS material design framework.
import Vuetify from 'vuetify';
Vue.use(Vuetify);

// Application child component
import App from './App';

// Development
Vue.config.productionTip = false;

// Event bus to handle child-child communication
export const eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
