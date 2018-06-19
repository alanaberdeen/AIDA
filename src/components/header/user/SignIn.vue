// Card component UI handling user sign in functionality
<template lang="html">
  <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title> Sign In </v-toolbar-title>
    </v-toolbar>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            prepend-icon="person"
            name="email"
            type="text"
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            id="password"
            prepend-icon="lock"
            v-model="password"
            type="password"
            name="input-10-1"
            label="Password"
            required
          ></v-text-field>
        </v-form>

      </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click='signIn'>
          Login
          </v-btn>
      </v-card-actions>

      <v-divider></v-divider>
      <div>
        <p class=body-1  id='sign-up-prompt'>
          Don't have an account? Sign up <a @click="$emit('signUp')">here</a>
        </p>
      </div>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    password_visible: false
  }),

  methods: {
    ...mapActions(['authenticateUser']),

    // Attempt to authenticate the user
    signIn () {
      this.authenticateUser({
        username: this.email,
        password: this.password
      }).then(() => {
        this.$router.push({
          name: 'Dashboard'
        })
      }).catch((err) => {
        console.log(err.message)
      })
    }
  }
}
</script>

<style lang='css' scoped>
#sign-up-prompt {
  padding-left: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 0px;
}
</style>
