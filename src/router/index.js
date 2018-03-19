import Vue from 'vue'
import Router from 'vue-router'

// Import Components
import Landing from '@/components/landing/Landing'
import Editor from '@/components/editor/Editor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/example',
      name: 'Example',
      component: Editor
    }
  ]
})
