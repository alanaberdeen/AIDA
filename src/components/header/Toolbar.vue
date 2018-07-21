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

    <div id="toolbar-toggle">
      <v-toolbar-side-icon @click="toggleToolsDrawer()"/>
    </div>

    <router-link to="/">
      <v-toolbar-title class="white--text">
        AIDA
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <app-export/>

    <app-save/>

    <app-settings />

    <!-- Link to Dashboard -->
    <v-btn
      icon
      href="https://imageannotation.nds.ox.ac.uk:8443/AIDA/">
      <v-icon>
        apps
      </v-icon>
    </v-btn>

    <!-- Link to Docs -->
    <v-btn
      icon
      href="https://aida.gitbook.io/docs/" >
      <v-icon small> fa-book </v-icon>
    </v-btn>

    <!-- <v-btn
      icon
      class="pointers-no">
      <app-user/>
    </v-btn> -->

    <div>
      <v-toolbar-side-icon @click="toggleStudioDrawer()"/>
    </div>

  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex'

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
      toggleToolsDrawer: 'app/toggleToolsDrawer',
      toggleStudioDrawer: 'app/toggleStudioDrawer'
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
