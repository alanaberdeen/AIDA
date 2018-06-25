<template lang="html">

  <!-- OpenSeadragon DeepZoom canvas -->
  <div id="osd-canvas" />

</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted () {
    this.setupOSDCanvas('osd-canvas')
  },

  methods: {
    ...mapActions({
      setupOSDCanvas: 'image/setupOSDCanvas'
    })
  }
}
</script>

<style>
#osd-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
