// Toolbar.vue
// This component defines the main toolbar for the AIDA application
// It contains the sub-components for different functionality
<template lang="html">
  <v-toolbar
    fixed
    dark
    dense
    app
    clipped-right
    clipped-left
    class="primary pointers-please"
    >

    <!-- Toggle Tools Drawer -->
    <div id="toolbar-toggle">
      <v-toolbar-side-icon @click="toggleToolsDrawer()"></v-toolbar-side-icon>
    </div>

    <!-- Home -->
    <router-link to="/">
      <v-toolbar-title class="white--text">
        AIDA
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <!-- Export -->
    <app-export/>

    <!-- Save -->
    <app-save/>

    <!-- Settings -->
    <app-settings />

    <!-- Dashboard -->
    <v-btn
      icon
      href="https://imageannotation.nds.ox.ac.uk:8443/AIDA/">
      <v-icon> apps </v-icon>
    </v-btn>

    <!-- Docs -->
    <v-btn
      icon
      href="https://aida.gitbook.io/docs/" >
      <v-icon small> fa-book </v-icon>
    </v-btn>

    <!-- User -->
    <!-- <v-btn
      icon
      class="pointers-no">
      <app-user/>
    </v-btn> -->

    <!-- Toggle Studio Drawer -->
    <div>
      <v-toolbar-side-icon @click="toggleStudioDrawer()"></v-toolbar-side-icon>
    </div>

  </v-toolbar>
</template>

<script>
// Vuex State Management
import { mapActions } from 'vuex'

// Import child components
import Settings from './settings/Settings.vue'
import User from './user/User.vue'
import Save from './save/Save.vue'
import Export from './export/Export.vue'

export default {
  components: {
    'app-settings': Settings,
    'app-user': User,
    'app-save': Save,
    'app-export': Export
  },

  methods: {
    ...mapActions({
      toggleToolsDrawer: 'editor/toggleToolsDrawer',
      toggleStudioDrawer: 'editor/toggleStudioDrawer'
    })
  }
}
</script>

<style lang='css' scoped>
#toolbar-side-icon-spacer {
  height: 36px;
  width: 36px;
}

#toolbar-toggle {
  margin-left: 5px;
  margin-right: 40px;
}
</style>
