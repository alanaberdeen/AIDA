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
            type="password"
            ref="password"
            name="password"
            label="Password"
            data-vv-name="password"
            v-validate="'required|min:8|verify_password'"
            v-model="password"
            :error-messages="errors.collect('password')"
            prepend-icon="lock"
            >

          </v-text-field>

          <v-text-field
            type="password"
            label="Password confirmation"
            data-vv-name="password_confirmation"
            target="password"
            v-validate="'confirmed:password'"
            v-model="password_confirmation"
            :error-messages="errors.collect('password_confirmation')"
            prepend-icon="lock"
            >

          </v-text-field>

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
    password_confirmation: '',
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
      this.$validator.validateAll().then((valid) => {
        // Check if all the inputs are valid
        if (valid) {
          // Attempt to sign up an account via Cognito
          this.signUp({
            username: this.email,
            password: this.password,
            attributes: {
              email: this.email
            }
          }).then(() => {
            console.log('Successfuly signed up')
          }).catch((err) => {
            console.log(new Error(err.message))
          })
        }
      }).catch((err) => {
        console.log(new Error(err.message))
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
