<template>
  <div id="container">
    <app-toolbar/>
    <app-tools />
    <app-studio />

    <div id="stepper-item">
      <app-stepper/>
    </div>

    <div id="view-item">
      <app-view/>
    </div>

  </div>

</template>

<script>
import Tools from './tools/Tools.vue'
import Studio from './studio/Studio.vue'
import Stepper from '../instruction/Stepper.vue'
import View from './view/View.vue'
import Toolbar from '../header/Toolbar.vue'

export default {
  components: {
    'app-tools': Tools,
    'app-studio': Studio,
    'app-stepper': Stepper,
    'app-view': View,
    'app-toolbar': Toolbar
  }
}
</script>

<style scoped>
#container {
  display: flex;
  flex-flow: column;
  height: 100%;
}

#stepper-item {
  flex: 0 1 auto;
  margin: 5px;
}

#view-item {
  display: flex;
  flex: 1 1 auto;
  margin: 0px 5px 5px 5px;
}
</style>
