<template lang="html">
  <v-btn
    id='save-button'
    icon
    @click.native="save()">
    <v-progress-circular
      v-if="savingInProgress"
      indeterminate
      color="white"
      :size="20"
    ></v-progress-circular>

    <v-icon v-else>
      save
    </v-icon>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      savingInProgress: false
    }
  },

  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },

  methods: {
    ...mapActions({
      dispatchSave: 'backend/saveAnnotation'
    }),

    async save () {
      this.savingInProgress = true
      await this.dispatchSave()
      this.savingInProgress = false
    },

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
