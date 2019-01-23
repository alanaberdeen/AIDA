<template lang="html">
  <canvas id="annotation-canvas"/>
</template>

<script>
import paper from 'paper'

export default {
  mounted () {
    // Setup the annotation canvas, this is a PaperJS instance targetting the
    // canvas DOM element: 'annotation-canvas'
    paper.setup('annotation-canvas')

    // HACK:
    // By default activate the pan tool once the annotation canvas has loaded.
    // This hacky method assumes that the HTML element for the pan tool button has already been loaded
    // and can easily be grabbed and clicked.
    document.getElementById('pan').click()
  }
}
</script>

<style>
#annotation-canvas {
  position: absolute;
  flex: 1 1 auto;
}
</style>
