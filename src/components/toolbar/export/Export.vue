// Export.vue
// Component allows the user to download the current annotation data as a .json
<template lang="html">
  <v-btn
    icon
    @click.native="exportData" >
    <v-icon small>
      fa-download
    </v-icon>
  </v-btn>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      dataToExport: state => state.annotation.project
    })
  },

  methods: {
    ...mapActions({
      refreshAnnotationState: 'annotation/refreshAnnotationState'
    }),

    exportData: function () {
      // Make sure we have refreshed the state to get the current representation
      this.refreshAnnotationState()

      // Build the data into a properly encoded string
      let dataStr = 'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(this.dataToExport, null, 2))

      // Create an anchor node that triggers a download of the annotation.json
      // briefly attach it to the window, trigger it being clicked and then
      // remove it from the window once done.
      let downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', 'AIDA_annotation.json')
      document.body.appendChild(downloadAnchorNode) // required for firefox
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    }
  }
}
</script>

<style lang='css'>
</style>
