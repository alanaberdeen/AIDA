<template lang="html">
  <v-footer class="pa-3">

    <div/>
    <v-spacer/>
    <div>© {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>

<script>
// TODO: This footer could contain 'hint' text to help guide the user
// similar to that in affinity.
import { eventBus } from '../main'

export default {
  data () {
    return {
      hint: null
    }
  },

  created () {
    eventBus.$on('toolActivated', (tool) => {
    })
  }
}
</script>

<style lang='css'>
</style>
