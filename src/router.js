import Vue from 'vue'
import Router from 'vue-router'

import Editor from './components/editor/Editor.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import Loading from './components/Loading.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/edit',
      name: 'editor',
      component: Editor,
      props: (route) => ({ query: route.query.q })
    },
    {
      path: '/loading/:filePath',
      name: 'loading',
      component: Loading
    }
  ]
})
