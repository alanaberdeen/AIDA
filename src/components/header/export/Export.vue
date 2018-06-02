<template lang="html">
  <a
    :href="dataToExport"
    download="AIDA_annotation.json">

    <v-btn icon>
      <v-icon small>
        fa-download
      </v-icon>
    </v-btn>

  </a>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      dataToExport: state =>
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(state.annotation.project))
    })
  }
}
</script>

<style lang='css'>
</style>
