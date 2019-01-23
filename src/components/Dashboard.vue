<template>
  <div>
    <v-toolbar
      fixed
      dark
      dense
      app
      class="primary pointers-please"
      >

      <v-toolbar-title class="white--text">
        AIDA
      </v-toolbar-title>

      <v-spacer/>

      <!-- Link to Dashboard -->
      <v-btn
        icon
        to="/">
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
      
    </v-toolbar>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs10>
          <h4 class="title mb-3"> Images </h4>
          <v-data-table
            :headers="headers"
            :items="images"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <tr @mouseover="hoverImage = props.item" @mouseout="hoverImage = null">
                <td>{{ props.item }}</td>
                <td>
                  <v-btn flat icon small class="text-xs-right" :to="'/loading/' + props.item">
                    <v-tooltip left>
                      <v-icon slot="activator" v-show="hoverImage === props.item" small color='#0D47A1'>launch</v-icon>
                      <span> View in AIDA </span>
                    </v-tooltip>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Toolbar from './header/Toolbar.vue'

export default {
  components: {
    Toolbar
  },

  data () {
    return {
      headers: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: '', sortable: false }
      ],
      hoverImage: null
    }
  },

  mounted() {
    this.getData()
  },

  computed: mapState({
    images: state => state.app.images
  }),

  methods: {
    ...mapActions({
      getData: 'app/getData'
    })
  }
}
</script>
