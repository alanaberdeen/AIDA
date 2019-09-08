<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="circle"
          v-on="on"
          block
          text
          @click.native="initialiseTool"
        >
          <v-icon
            small
            :class="{'grey--text text--darken-2': !active,
                    'blue--text text--darken-1': active}">
            mdi-blur
          </v-icon>
        </v-btn>
      </template>
      <span> Super Pixels </span>
    </v-tooltip>
  </v-list-item>

</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import paper from 'paper'
import openseadragon from 'openseadragon'
import { slic } from './slic.js'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      toolSuperPixel: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      radius: 2000
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      activeStep: state => state.app.activeStep,
      strokeScale: state => state.app.strokeScale,
      tiledImage: state => state.image.OSDviewer.world.getItemAt(0),
      viewer: state => state.image.OSDviewer
    })
  },

  created () {
    const toolDown = event => {
      const osdPoint = this.tiledImage.imageToViewportCoordinates(event.point.x, event.point.y)
      this.tiledImage.lastDrawn.forEach(async (tile) => {
        // Find the tile that was clicked on.
        if (tile.bounds.containsPoint(osdPoint)) {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          tile.drawCanvas(ctx)
          // Get the imageData for that tile.
          // const response = await fetch()
          // console.log(response)
          // const blob = await response.blob()
          // const dataURL = URL.createObjectURL(blob)
          // const imageBitmap = await createImageBitmap(blob)

          // const image = new Image
          // image.src = tile.url
          // image.onload = () => {
          //   ctx.drawImage(image, image.naturalWidth, image.naturalHeight);
          //   imageData = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
          //   console.log(imageData);
          // }
          // // const slicObj = slic(dataURL)
          // // console.log(slicObj)
        }
      })
    }

    this.toolSuperPixel = new paper.Tool()
    this.toolSuperPixel.onMouseDown = toolDown
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas',
      flagAnnotationEdits: 'annotation/flagAnnotationEdits'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolSuperPixel.activate()

      // Set the default radius relative to image size and zoom level.
      this.radius = this.imageWidth / (this.viewportZoom * 100)
      this.strokeWidth = (this.imageWidth * this.strokeScale) / (this.viewportZoom * 1000)
    }
  }
}
</script>

<style lang='css' scoped>

#circle {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
