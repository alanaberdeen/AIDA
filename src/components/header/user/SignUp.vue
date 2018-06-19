// Card component UI handling user sign up functionality
<template lang="html">
  <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title> Create an Account </v-toolbar-title>
    </v-toolbar>
      <v-card-text>
        <v-form>

          <v-text-field
            prepend-icon="person"
            v-validate="'required|email'"
            v-model="email"
            :error-messages="errors.collect('email')"
            label="E-mail"
            data-vv-name="email"
          ></v-text-field>

          <v-text-field
            v-validate="'required'"
            prepend-icon="lock"
            name="password"
            type="password"
            >

          </v-text-field>

          <v-text-field
            v-validate="'required|confirmed:password'"
            prepend-icon="lock"
            name="password_confirmation"
            data-vv-name='password_confirmation'
            type="password"
            data-vv-as="password"
            >

          </v-text-field>

          <!-- <v-text-field
            prepend-icon="lock"
            v-validate="'required'"
            v-model="password"
            :error-messages="errors.collect('password')"
            label="password"
            data-vv-name="password"
          ></v-text-field>

          <v-text-field
            prepend-icon="lock"
            v-validate="'required|confirmed:password'"
            :error-messages="errors.collect('password_confirmation')"
            label="confirm your password"
            data-vv-name="password_confirmation"
          ></v-text-field> -->
        </v-form>

      </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="createAccount"> Create Account </v-btn>
      </v-card-actions>

      <v-divider></v-divider>
      <div>
        <p class=body-1  id='sign-up-prompt'>
          Already have an account? Sign in <a @click="$emit('signIn')">here</a>
        </p>
      </div>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  $_veeValidate: {
    validator: 'new'
  },

  data: () => ({
    email: '',
    password: '',
    canSubmit: false,
    dictionary: {
      attributes: {
        email: 'E-mail Address'
      },
      custom: {
        password_confirmation: {
          confirmed: 'The passwords must match'
        }
      }
    }
  }),

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    ...mapActions(['signUp']),

    // Attempt to create an account for the user
    createAccount () {
      this.$validator.validateAll().then((result) => {
        console.log(result)
      }).catch((err) => {
        console.log(new Error(err.message))
      })
    //   this.signUp({
    //     username: this.email,
    //     password: this.password,
    //     attributes: {
    //       email: this.email
    //     }
    //   }).then(() => {
    //     console.log('Successfuly signed up')
    //   }).catch((err) => {
    //     console.log(new Error(err.message))
    //   })
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
