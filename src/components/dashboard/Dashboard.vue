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

    <div> THIS IS THE DASH, hello {{this.username}} </div>

    </v-container>

  </div>

</template>

<script>
import { mapState } from 'vuex'

// Import custom components
import Toolbar from '../header/Toolbar.vue'

export default {
  components: {
    'app-toolbar': Toolbar
  },

  computed: {
    ...mapState({
      username: state => state.cognito.user.username
    })
  }
}
</script>

<style lang='css' scoped>
#content-container {
  padding: 0px;
  padding-top: 60px;
}
</style>
