<template>
  <div>
      <v-toolbar
    flat
    dense
    dark
    class="primary"
    >
    <router-link to='/'>
      <v-toolbar-title class="white--text">
        AIDA
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <v-toolbar-items>
      <v-btn
        icon
        to="/dashboard">
        <v-icon>
          mdi-apps
        </v-icon>
      </v-btn>

      <v-btn
        icon
        href="https://github.com/alanaberdeen/AIDA/wiki" >
        <v-icon> mdi-book-open-outline </v-icon>
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm10 offset-sm1>
          <Treeview />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Treeview from '../components/dashboard/Treeview.vue'

export default {
  components: {
    Treeview
  },

  mounted () {
    this.getArrayOfImages()
  },

  methods: {
    ...mapActions({
      getArrayOfImages: 'backend/getArrayOfImages'
    })
  }
}
</script>
