// Editor.vue
// This component represents an instance of the AIDA editor
// It includes the sub components that make up the interface
<template>
  <div id="container">

    <div id="stepper-item">
      <app-stepper/>
    </div>

    <div id="view-item">
      <app-view :type="type"/>
    </div>

  </div>
</template>

<script>
// Vuex State Management
import { mapActions } from 'vuex'

// Import child components
import Tools from './tools/Tools.vue'
import Studio from './studio/Studio.vue'
import Stepper from '../steps/Stepper.vue'
import View from './view/View.vue'
import Toolbar from '../header/Toolbar.vue'

export default {
  components: {
    'app-tools': Tools,
    'app-studio': Studio,
    'app-stepper': Stepper,
    'app-view': View,
    'app-toolbar': Toolbar
  },

  props: {
    type: {
      type: String,
      default: 'examples'
    }
  },

  mounted () {
    this.toolbarOn()
    this.toolsDrawerOn()
    this.studioDrawerOn()
  },

  destroyed () {
    this.toolsDrawerOff()
    this.studioDrawerOff()
  },

  methods: {
    ...mapActions({
      toolbarOn: 'app/toolbarOn',
      toolsDrawerOn: 'editor/toolsDrawerOn',
      studioDrawerOn: 'editor/studioDrawerOn',
      toolsDrawerOff: 'editor/toolsDrawerOff',
      studioDrawerOff: 'editor/studioDrawerOff'
    })
  }
}
</script>

<style media='screen' scoped>
#container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#stepper-item {
  margin: 5px;
}

#view-item {
  display: flex;
  flex: auto;
  margin: 0px 5px 5px 5px;
}
</style>
