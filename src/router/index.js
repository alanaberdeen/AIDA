import Vue from 'vue'
import Router from 'vue-router'

// Import Components
import Landing from '@/components/landing/Landing'
import Editor from '@/components/editor/Editor'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/example/dzi',
    name: 'DZI Example',
    component: Editor,
    props: {
      default: true,
      type: 'dzi'
    }
  },
  {
    path: '/example/simple',
    name: 'Simple Example',
    component: Editor,
    props: {
      default: true,
      type: 'simple'
    }
  },
  {
    path: '/example',
    name: 'Examples',
    component: Editor,
    props: {
      default: true,
      type: 'examples'
    }
  }

  ]
})
