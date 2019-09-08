import Vue from 'vue'
import Router from 'vue-router'

import Landing from './views/Landing.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "Dashboard" */ './views/Dashboard.vue')
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import(/* webpackChunkName: "Editor" */ './views/Editor.vue')
    },
    {
      path: '/loading/:filePath',
      name: 'loading',
      component: () => import(/* webpackChunkName: "Loading" */ './views/Loading.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import(/* webpackChunkName: "Demo" */ './views/Demo.vue')
    }
  ]
})
