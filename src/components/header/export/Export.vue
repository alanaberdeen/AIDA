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
    ...mapActions([
      'refreshAnnotationState'
    ]),

    exportData: function () {
      this.refreshAnnotationState()

      let dataStr = 'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(this.dataToExport, null, 2))

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
