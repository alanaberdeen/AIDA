// Dashboard.vue
// Component defines the user dashboard from which they can navigate to
// specific AIDA editor instances.
<template lang="html">

  <div>
    <header>
      <app-toolbar/>
    </header>

    <v-container
      id="content-container"
      fluid
    >
    <v-layout>
      <v-flex xs10 offset-xs1>
        <p class=".display-3"> Dashboard </p>

      <v-btn @click="getImages"> hit </v-btn>

      <v-data-table
      :headers="headers"
      :items="images"
      hide-actions
      class="elevation-1"
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.study }}</td>
        <td class="text-xs-right">{{ props.item.stain }}</td>
        <td class="text-xs-right">{{ props.item.source }}</td>
      </template>
      </v-data-table>
      </v-flex>

    </v-layout>

    </v-container>

  </div>

</template>

<script>
import { mapState } from 'vuex'
import apiConfig from '../../../config/api.js'
import axios from 'axios'

// Import custom components
import Toolbar from '../header/Toolbar.vue'

export default {
  data () {
    return {
      headers: [
        {
          text: 'Images',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'ID', value: 'id' },
        { text: 'Study', value: 'study' },
        { text: 'Stain', value: 'stain' },
        { text: 'Link', value: 'source' }
      ],
      images: [
        {
          value: false,
          name: 'Example image',
          id: 1,
          study: 159,
          stain: 6.0
        }
      ]
    }
  },

  components: {
    'app-toolbar': Toolbar
  },

  mounted () {
    // If use isn't signed in then trigger the sign-in dialog
    if (!this.signedIN) {

    }
    // Get
    // this.images = this.getImages(this.user, apiConfig)
  },

  computed: {
    ...mapState({
      signedIN: state => state.cognito.signedIn,
      user: state => state.cognito.user,
      username: state => state.cognito.user.username,
      idToken: state => state.cognito.user.tokens.IdToken
    })
  },

  methods: {
    // Call the images available to the user from the api
    getImages () {
      axios({
        method: 'get',
        url: 'https://to5r9whwnk.execute-api.eu-west-2.amazonaws.com/prod' + '/images',
        headers: {
          Authorization: this.user.tokens.IdToken
        }
      }).then((response) => {
        this.images = JSON.parse(response.data.data)
      })
    }
  }
}
</script>

<style lang='css' scoped>
#content-container {
  padding: 0px;
  padding-top: 60px;
}
</style>
