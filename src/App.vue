<template>
  <v-app id="inspire">

    <app-toolbar
      v-if="this.toolbar"
      v-on:toggleToolsDrawer="toolsDrawer = !toolsDrawer"
      v-on:toggleStudioDrawer="studioDrawer = !studioDrawer"
    />

    <app-snackbar/>

    <v-navigation-drawer
      id="tools-drawer"
      fixed
      clipped
      :value="this.toolsDrawer"
      mini-variant
      mini-variant-width="60"
      app
      mobile-break-point="800"
    >
      <app-tools/>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>

    <v-navigation-drawer
      id="studio-drawer"
      fixed
      clipped
      :value="this.studioDrawer"
      app
      right
      mobile-break-point="1000"
    >
      <app-studio/>
    </v-navigation-drawer>

  </v-app>
</template>

<script>
import { mapState } from 'vuex'

import Toolbar from './components/header/Toolbar.vue'
import Tools from './components/editor/tools/Tools.vue'
import Studio from './components/editor/studio/Studio.vue'
import Snackbar from './components/notification/Snackbar.vue'

export default {
  components: {
    'app-toolbar': Toolbar,
    'app-tools': Tools,
    'app-studio': Studio,
    'app-snackbar': Snackbar
  },

  computed: {
    ...mapState({
      toolbar: state => state.app.toolbar,
      toolsDrawer: state => state.app.toolsDrawer,
      studioDrawer: state => state.app.studioDrawer
    })
  }
}

</script>

<style>
#tools-drawer {
  background-color: #eeeeee;
}

#studio-drawer {
  background-color: #eeeeee;
}
</style>
