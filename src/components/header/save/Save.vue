<template lang="html">
  <v-btn
    id='save-button'
    icon
    @click.native="saveAnnotation()">
    <v-icon>
      save
    </v-icon>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },

  methods: {
    ...mapActions({
      saveAnnotation: 'backend/saveAnnotation'
    }),

    // Attach event listeners for the keyboard shortcuts
    keyDown (e) {
      if (e.key === 's' && (e.metaKey === true || e.ctrlKey === true)) {
        e.preventDefault()
        document.getElementById('save-button').click()
      }
    }

  }
}
</script>

<style lang='css'>
</style>
