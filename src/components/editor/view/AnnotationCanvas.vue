<template lang="html">
  <canvas id="annotation-canvas"/>
</template>

<script>
import paper from 'paper'
import RBush from 'rbush'

export default {
  mounted () {
    // Setup the annotation canvas, this is a PaperJS instance targetting the
    // canvas DOM element: 'annotation-canvas'
    paper.setup('annotation-canvas')
    paper.view.itemsTree = new RBush()

    // By default once the annotation canvas has loaded we remove pointer events
    // from the paperJS canvas. This allows interaction with the OSD canvas
    // through the pan tool.
    document.getElementById('annotation-canvas').style.pointerEvents = 'none'
    document.getElementById('osd-canvas').style.cursor = 'grab'
  }
}
</script>

<style>
#annotation-canvas {
  position: absolute;
  flex: 1 1 auto;
}
</style>
