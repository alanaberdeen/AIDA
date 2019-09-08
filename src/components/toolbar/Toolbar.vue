<template lang="html">
  <v-app-bar
    fixed
    dark
    dense
    clipped-right
    clipped-left
    class="primary"
    v-if="['loading'].indexOf($route.name) === -1"
    >

    <v-app-bar-nav-icon @click="toggleToolsDrawer()"/>

    <router-link to='/'>
      <v-toolbar-title class="white--text pl-1">
        AIDA
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <!-- <app-export/> -->

    <app-save/>

    <!-- <app-settings /> -->

    <!-- Link to Dashboard -->
    <v-btn
      icon
      to="/dashboard">
      <v-icon>
        mdi-apps
      </v-icon>
    </v-btn>

    <!-- Link to Docs -->
    <v-btn
      icon
      href="https://github.com/alanaberdeen/AIDA/wiki" >
      <v-icon> mdi-book-open-outline </v-icon>
    </v-btn>

    <v-app-bar-nav-icon @click="toggleStudioDrawer()"/>

  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

// import Settings from './settings/Settings.vue'
import Save from './save/Save.vue'
// import Export from './export/Export.vue'

export default {
  components: {
    'app-save': Save
  },

  methods: {
    ...mapActions({
      toggleToolsDrawer: 'app/toggleToolsDrawer',
      toggleStudioDrawer: 'app/toggleStudioDrawer'
    })
  }
}
</script>
