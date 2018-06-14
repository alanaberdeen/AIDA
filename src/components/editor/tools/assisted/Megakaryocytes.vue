// Megakayocyte classifier.
// 1. Tool is used to define an area
// 2. The tiles within that area are sent to a pre-trained classifier
// 3. Bounding boxes are returned and drawn on the image
// 4. The user review process is initiated
// 5. The reviewed data is returned to the classifier and this data is
//    incorporated in the next classification iteration.
<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700">
      <v-btn
        id="tool"
        slot="activator"
        flat
        block
        @click.native="initialiseTool"
      >
        <v-icon
          :class="{'grey--text text--darken-2': !active,
                   'blue--text text--darken-1': active}">
          youtube_searched_for
        </v-icon>
      </v-btn>
      <span> Megakaryocyte Classifier </span>
    </v-tooltip>
  </v-list-tile>

</template>

<script>
// Import libs
import paper from 'paper'
import openseadragon from 'openseadragon'

// Vuex
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      strokeWidth: 400,
      loading: false
    }
  },

  computed: {
    ...mapState({
      imageUri: state => state.image.images[state.image.activeChannel].source,
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      tileSource: state => state.image.OSDviewer.source,
      viewport: state => state.image.OSDviewer.viewport
    })
  },

  created () {
    // On drag draw feedforward shadow rectangle in realtime.
    const toolDrag = event => {
      let trackingRect = new paper.Path.Rectangle(event.downPoint, event.point)
      trackingRect.strokeColor = new paper.Color({
        hue: 220,
        saturation: 0.7,
        lightness: 0.5,
        alpha: 1
      })
      trackingRect.strokeWidth = this.strokeWidth

      // Constantly update tracking rect by removing it and re-drawing.
      trackingRect.removeOn({
        drag: true,
        up: true
      })
    }

    // Get a list of tiles in the defined rectangle
    const toolUp = event => {
      // Source dimensions
      let dimensions = this.tileSource.dimensions
      let aspectRatio = this.tileSource.aspectRatio

      // Point given to getTileAtPoint must be 0 < point < 1, therefore it's in
      // openseadragon viewport coordinates rather than image and is magnitude
      // limited.
      let downX = Math.min(Math.max((event.downPoint.x / dimensions.x), 0), 1)
      let downY = Math.min(Math.max((event.downPoint.y / dimensions.y), 0), 1)
      let upX = Math.min(Math.max((event.point.x / dimensions.x), 0), 1)
      let upY = Math.min(Math.max((event.point.y / dimensions.y), 0), 1)
      let downPoint = new openseadragon.Point(downX, downY / aspectRatio)
      let upPoint = new openseadragon.Point(upX, upY / aspectRatio)

      // These two tiles define the area in which we want to search, from the
      // first (downTile) to the last (upTile).
      let level = 15
      let downTile = this.tileSource.getTileAtPoint(level, downPoint)
      let upTile = this.tileSource.getTileAtPoint(level, upPoint)

      // Create list of tile data in which the algorithm should search
      let tilesToSearch = []
      for (let col = downTile.x; col <= upTile.x; col++) {
        for (let row = downTile.y; row <= upTile.y; row++) {
          let position = this.viewport.viewportToImageCoordinates(
            this.tileSource.getTileBounds(level, col, row).x,
            this.tileSource.getTileBounds(level, col, row).y
          )
          tilesToSearch.push({
            tile: [row, col],
            postion: [
              position.x,
              position.y
            ]
          })
        }
      }

      // getTileBounds
      console.log(tilesToSearch)

      // console.log('downTile: ')
      // console.log(downTile)
      // console.log('upTile: ' + upTile)

      // let newRect = new paper.Path.Rectangle(event.downPoint, event.point)
      // newRect.strokeColor = new paper.Color(this.getDefaultLayerColor().stroke)
      // newRect.fillColor = new paper.Color(this.getDefaultLayerColor().fill)
      // newRect.strokeWidth = this.strokeWidth

      // // Custom data attribute:
      // newRect.data.type = 'rectangle'
      // newRect.data.class = ''
    }

    this.toolMega = new paper.Tool()
    this.toolMega.onMouseDrag = toolDrag
    this.toolMega.onMouseUp = toolUp
  },

  methods: {
    ...mapActions(['prepareCanvas']),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolMega.activate()

      // Set the default strokewidth relative to image size and zoom.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
    }
  }
}
</script>

<style lang='css' scoped>
#tooltip {
  width: 100%;
}

#tool {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
