<template lang="html">
  <div id="osd-canvas" />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted () {
    this.setupOsdCanvas('osd-canvas')
  },

  methods: {
    ...mapActions({
      setupOsdCanvas: 'image/setupOsdCanvas'
    })
  }
}
</script>

<style>
#osd-canvas {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
