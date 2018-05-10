<template lang="html">

  <div
    id="canvas"
    class="elevation-2 pointers-please">
    <div id="osd-canvas"/>
    <canvas id="paper-canvas"/>
  </div>

</template>

<script>
import {mapActions} from 'vuex'

export default {
  mounted () {
    // Setup the OpenSeadragon instance viewer on the HTML element
    this.setupViewer('osd-canvas')

    // Setup the PaperJS instance targetting the canvas DOM element.
    this.setupAnnotation('paper-canvas')

    // Load project data from the API
    this.loadProject()

    // Ensure the size of the PaperJS annotation view and the OpenSeaDragon
    // viewer are always synchronised.
    this.synchroniseAnnotationAndImage()
  },

  methods: {
    ...mapActions([
      'setupViewer',
      'setupAnnotation',
      'synchroniseAnnotationAndImage',
      'loadProject'
    ])
  }
}
</script>

<style lang='css' scoped>
#canvas {
  position: relative;
  width: 100%;
  flex: 1;
}

#osd-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

#paper-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
