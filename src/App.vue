<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
    <v-snackbar
      v-model="snackbar"
      :timeout=-1
    >
      This site uses cookies to function optimally.
      <v-btn
        dark
        text
        @click="acceptCookies()"
      >
        OK
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data () {
    return {
      snackbar: true
    }
  },

  methods: {
    acceptCookies () {
      this.snackbar = false
      window.localStorage.setItem('acceptCookies', 'false')
    }
  },

  created () {
    if (window.localStorage.acceptCookies && window.localStorage.acceptCookies === 'false') {
      this.snackbar = false
    }
  }
}
</script>
