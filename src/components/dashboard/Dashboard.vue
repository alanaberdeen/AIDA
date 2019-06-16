<template>
  <div>
    <v-toolbar
      fixed
      dark
      dense
      app
      class="primary pointers-please"
      >
      <router-link to='/'>
        <v-toolbar-title class="white--text">
          AIDA
        </v-toolbar-title>
      </router-link>

      <v-spacer/>

      <!-- Link to Dashboard -->
      <v-btn
        icon
        to="/dashboard">
        <v-icon>
          apps
        </v-icon>
      </v-btn>

      <!-- Link to Docs -->
      <v-btn
        icon
        href="https://github.com/alanaberdeen/AIDA/wiki" >
        <v-icon small> fa-book </v-icon>
      </v-btn>
      
    </v-toolbar>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <Treeview />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Toolbar from '../toolbar/Toolbar.vue'
import Treeview from './Treeview.vue'

export default {
  components: {
    Toolbar,
    Treeview
  },

  mounted() {
    this.getArrayOfImages()
  },

  methods: {
    ...mapActions({
      getArrayOfImages: 'backend/getArrayOfImages'
    })
  }
}
</script>
