<template lang="html">
  <v-layout style="height: 48px" shrink>
    <v-layout align-center justify-center column fill-height caption v-if="!saveState.changesSaved">
      <div>
        Unsaved changes.
      </div>
      <div v-if="saveState.lastSaveTimeStamp">
        Last save: {{ this.saveState.lastSaveTimeStamp.toLocaleTimeString() }}
      </div>
    </v-layout>
    <v-layout shrink>
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
          mdi-content-save
        </v-icon>
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      savingInProgress: false
    }
  },

  computed: {
    ...mapState({
      saveState: state => state.annotation.saveState
    })
  },

  mounted () {
    // Add ctrl+s keyboard shortcut for saving data
    window.addEventListener('keydown', this.keyDown)

    // On closing the tab/window, if the annotation data is not saved warn the
    // user and prevent closing.
    window.addEventListener('beforeunload', this.checkForUnsavedChanges)
  },

  methods: {
    ...mapActions({
      dispatchSave: 'backend/saveProject'
    }),

    async save () {
      this.savingInProgress = true
      await this.dispatchSave()
      this.savingInProgress = false
    },

    // Prevent window unloading when annotation data has unsaved changes.
    checkForUnsavedChanges (e) {
      if (!this.saveState.changesSaved) {
        // Cancel the event
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = 'Annotation data has not been saved'
      }
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
