<template lang="html">
  <v-container>
    <v-layout>
      <v-flex xs12>

        Plan to add upload functionality for annotation data.

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      viewSize: state => state.image.view.viewSize,
      imageZoom: state => state.image.view.imageZoom,
      imageCenter: state => state.image.view.imageCenter
    })
  }
}
</script>

<style lang='css'>
</style>
