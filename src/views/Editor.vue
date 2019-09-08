<template>
  <div id="container">
    <app-snackbar/>
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
import Tools from '../components/editor/tools/Tools.vue'
import Studio from '../components/editor/studio/Studio.vue'
import Stepper from '../components/task/Stepper.vue'
import View from '../components/editor/view/View.vue'
import Toolbar from '../components/toolbar/Toolbar.vue'
import Snackbar from '../components/notification/Snackbar.vue'

export default {
  components: {
    'app-tools': Tools,
    'app-studio': Studio,
    'app-stepper': Stepper,
    'app-view': View,
    'app-toolbar': Toolbar,
    'app-snackbar': Snackbar
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
  margin: 4px;
}

#view-item {
  display: flex;
  flex: 1 1 auto;
  margin: 44px 4px 4px 4px;
}
</style>
