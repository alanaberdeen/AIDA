<template lang="html">

  <!-- Annotation canvas -->
  <canvas id="annotation-canvas"/>

</template>

<script>
import paper from 'paper'

// Import Vuex tools
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      viewSize: state => state.image.view.viewSize,
      imageZoom: state => state.image.view.imageZoom,
      imageCenter: state => state.image.view.imageCenter
    })
  },

  // TODO: thought (and started) transfering all the paper-to-osd sync parts
  // to vuex reactivity via watchers. It gave a strange jumpy effect on the zoom
  // so leaving for now. Should return to this though because think it would be
  // a cleaner way of doing things.
  watch: {
    viewSize: function () {
      paper.view.viewSize.width = this.viewSize[0]
      paper.view.viewSize.height = this.viewSize[1]
    },

    imageZoom: function () {
      // paper.view.zoom = this.imageZoom
    },

    imageCenter: function () {
      // console.log(this.imageCenter)
      // paper.view.center = new paper.Point(
      //   this.imageCenter.x,
      //   this.imageCenter.y
      // )
    }
  },

  mounted () {
    // Setup the annotation canvas, this is a PaperJS instance targetting the
    // canvas DOM element: 'annotation-canvas'
    this.setupAnnotation('annotation-canvas')
  },

  methods: {
    ...mapActions('annotation', [
      'setupAnnotation'
    ])
  }
}

// // Add functionality that is triggered by the 'update-viewport' event
//     viewer.addHandler('update-viewport', function () {
//       // Match the size of paperScope view to the OSD viewer canvas
//       paper.view.viewSize.width = viewer.canvas.clientWidth
//       paper.view.viewSize.height = viewer.canvas.clientHeight

//       console.log(viewer.canvas.clientWidth)

//       // Match changes in zoom level
//       let viewportZoom = viewer.viewport.getZoom(true)
//       console.log(viewportZoom)
//       let image1 = viewer.world.getItemAt(0)
//       paper.view.zoom = image1.viewportToImageZoom(viewportZoom)

//       // Ensure the same center point
//       let center = image1.viewportToImageCoordinates(
//         viewer.viewport.getCenter(true)
//       )
//       paper.view.center = new paper.Point(center.x, center.y)

//       // Update paths to have strokeWidth reactive to zoom level.
//       // This might be computationally-expensive but will try for now.
//       // TODO: consider the computational expensive of this and find a more
//       // effectively method of handling it. Additionally, the hard coded 500
//       // is clearly a temporary fix here.
//       paper.project.layers.forEach(layer => {
//         layer.children.forEach(child => {
//           if (child.className === 'Path') {
//             console.log(image1.getContentSize().x)
//             child.strokeWidth = image1.getContentSize().x / (viewportZoom * 500)
//           }
//         })
//       })
//     })
</script>

<style>
#annotation-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
