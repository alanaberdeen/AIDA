<template>
  <div>
    <header>
      <app-toolbar/>
    </header>

    <v-container
      id="content-container"
      fluid
    >
      <v-layout row>

        <v-flex
          id="left-panel"
          d-flex
        >
          <app-tools/>
        </v-flex>

        <v-flex d-flex>
          <div id="centre-container">
            <div id="stepper">
              <app-stepper/>
            </div>

            <div id="canvas-container">
              <app-canvas/>
            </div>
          </div>
        </v-flex>

        <v-flex
          id="right-panel"
          d-flex
        >
          <app-studio/>
        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
// Import child components
import Tools from './tools/Tools.vue'
import Studio from './studio/Studio.vue'
import Stepper from './Stepper.vue'
import Canvas from './Canvas.vue'
import Toolbar from '../header/Toolbar.vue'

export default {
  components: {
    'app-tools': Tools,
    'app-studio': Studio,
    'app-stepper': Stepper,
    'app-canvas': Canvas,
    'app-toolbar': Toolbar
  }
}
</script>

<style media='screen' scoped>

#content-container {
  padding: 0px;
  padding-top: 48px;
}

#centre-container {
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
  overflow-y: auto;
}

#stepper {
  flex-shrink: 1;
  padding: 5px 0px;
}

#canvas-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
}

#left-panel {
  flex: 0 1 auto;
}

#right-panel {
  flex: 0 1 auto;
}
</style>
