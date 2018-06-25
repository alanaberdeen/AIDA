import Vue from 'vue'
import Router from 'vue-router'

// Import Components
import Landing from '../components/landing/Landing.vue'
import Editor from '../components/editor/Editor.vue'
import Examples from '../components/examples/Examples.vue'

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
    component: Examples
  },
  {
    path: '/new',
    name: 'New',
    component: Editor,
    props: {
      default: true,
      type: 'new'
    }
  }
  ]
})
