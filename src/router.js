import Vue from 'vue'
import Router from 'vue-router'

import Editor from './components/editor/Editor.vue'
import Dashboard from './components/Dashboard.vue'
import Loading from './components/Loading.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/:image',
      name: 'editor',
      component: Editor
    },
    {
      path: '/loading/:fileName',
      name: 'loading',
      component: Loading
    }
  ]
})
