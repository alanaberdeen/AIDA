<template lang="html">
  <v-toolbar
    :fixed="true"
    dark
    dense
    class="primary pointers-please">

    <!-- Control for navigation drawer -->
    <v-toolbar-side-icon
      @click.stop="$emit('toggleNav')"
    />

    <!-- Home -->
    <router-link to="/">
      <v-toolbar-title class="white--text">
        AIDA
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <!-- Save -->
    <app-save/>

    <!-- Dashboard -->
    <v-btn
      icon
      href="https://imageannotation.nds.ox.ac.uk:8443/AIDA/">
      <v-icon> apps</v-icon>
    </v-btn>

    <!-- Docs -->
    <router-link to="/docs">
      <v-btn icon >
        <v-icon> fa-book </v-icon>
      </v-btn>
    </router-link>

    <!-- Account -->
    <v-btn
      icon
      class="pointers-no">
      <app-account/>
    </v-btn>

  </v-toolbar>
</template>

<script>

// Import child components
import Settings from './settings/Settings.vue'
import Account from './account/Account.vue'
import Save from './save/Save.vue'

export default {
  components: {
    'app-settings': Settings,
    'app-account': Account,
    'app-save': Save
  }
}

</script>

<style lang='css' scoped>
</style>
