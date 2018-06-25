<template lang="html">
  <div>
    <!-- If the user is not currently signed in then clicking this button
        activates the user signIn/signUp dialog -->
    <v-dialog
      v-model="dialog"
      class="pointers-please"
      max-width="500px"
      v-if="!signedIn"
    >

      <v-btn
        slot="activator"
        icon >
        <v-icon>
          account_circle
        </v-icon>
      </v-btn>

      <!-- Check if we want to create an account and render this if so -->
      <app-sign-up
        v-if="displaySignUp"
        v-on:signIn="displaySignUp = false"
      >
      </app-sign-up>

      <!-- Otherwise, render sign in -->
      <app-sign-in
        v-else
        v-on:signUp="displaySignUp = true">
      </app-sign-in>

    </v-dialog>

    <!-- If user is already signed in then just open the sign-out menu -->
    <v-menu
      transition="slide-y-transition"
      v-else
      class="pointers-please"
      offset-y
      bottom
      :nudge-right="5"
      :nudge-bottom="10"
    >
      <v-btn
        slot="activator"
        icon >
        <v-icon>
          account_circle
        </v-icon>
      </v-btn>

      <v-list>
        <v-list-tile @click="logOut">
          <v-list-tile-title>
            Log Out
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// Import child components
import SignIn from './SignIn.vue'
import SignUp from './SignUp.vue'

export default {
  components: {
    'app-sign-in': SignIn,
    'app-sign-up': SignUp
  },

  computed: {
    ...mapState({
      signedIn: state => state.cognito.signedIn
    })
  },

  data: () => ({
    dialog: false,
    displaySignUp: false
  }),

  methods: {
    ...mapActions(['signOut']),

    logOut () {
      this.dialog = false
      this.signOut().then(() => {
        this.$router.push({
          name: 'Landing'
        })
      })
    }
  }
}
</script>

<style lang='css' scoped>
</style>
