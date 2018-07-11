<template>
  <v-app id="inspire">

    <!-- Header Tool Bar -->
    <app-toolbar
      v-on:toggleToolsDrawer="toolsDrawer = !toolsDrawer"
      v-on:toggleStudioDrawer="studioDrawer = !studioDrawer"
    />

    <!-- Tools Drawer -->
    <v-navigation-drawer
      id="tools-drawer"
      fixed
      clipped
      v-model="toolsDrawer"
      mini-variant
      mini-variant-width="60"
      app
      mobile-break-point="800"
    >
      <app-tools/>
    </v-navigation-drawer>

    <!-- Central Content -->
    <v-content>
      <router-view/>
    </v-content>

    <!-- Tools Drawer -->
    <v-navigation-drawer
      id="studio-drawer"
      fixed
      clipped
      v-model="studioDrawer"
      app
      right
      mobile-break-point="800"
    >
      <app-studio/>
    </v-navigation-drawer>

  </v-app>
</template>

<script>
// Import child component
import Toolbar from './components/header/Toolbar.vue'
import Tools from './components/editor/tools/Tools.vue'
import Studio from './components/editor/studio/Studio.vue'

export default {
  components: {
    'app-toolbar': Toolbar,
    'app-tools': Tools,
    'app-studio': Studio
  },

  data: () => ({
    toolsDrawer: true,
    studioDrawer: true
  })
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
