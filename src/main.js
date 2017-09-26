/*jshint esversion: 6 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

// Routing
import VueRouter from 'vue-router';
import { routes } from './routes';
Vue.use(VueRouter);
const router = new VueRouter({
    routes,
    mode: 'history',
    base: '/AIDA/'
});

// Vuex central application state store paradigm.
import { store } from './store/store';

// CSS material design framework.
import Vuetify from 'vuetify';
Vue.use(Vuetify);

// Application child component
import App from './App';

// Development settings
Vue.config.productionTip = false;

// Event bus to handle child-child communication
export const eventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  router,
  components: { App }
});
