// Editor.vue
// This component represents an instance of the AIDA editor
// It includes the sub components that make up the interface
<template>
  <v-container id="center" fill-height fluid grid-list-sm>

    <v-layout column >
       <!-- Stepper -->
      <v-flex xs1>
        <app-stepper/>
      </v-flex>

      <!-- Viewer -->
      <v-flex xs12>
        <app-view :type="type"/>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
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
  }
}
</script>

<style media='screen' scoped>
#center {
  padding: 5px;
}
</style>
