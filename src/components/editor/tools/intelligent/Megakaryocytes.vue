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
import paper from 'paper'
import openseadragon from 'openseadragon'
import axios from 'axios'

// Vuex
import { mapState, mapActions, mapGetters } from 'vuex'

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
      loading: false,
      trackingRect: null
    }
  },

  computed: {
    ...mapState({
      imageUri: state => state.image.images[state.image.activeChannel].source,
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      tileSource: state => state.image.OSDviewer.world.getItemAt(0).source,
      viewport: state => state.image.OSDviewer.viewport,
      tiledImage: state => state.image.OSDviewer.world.getItemAt(0)
    })
  },

  created () {
    // On drag draw feedforward shadow rectangle in realtime.
    const toolDrag = event => {
      this.trackingRect = new paper.Path.Rectangle(event.downPoint, event.point)
      this.trackingRect.strokeColor = new paper.Color('#2661D8')
      this.trackingRect.strokeColor.alpha = 0.7
      this.trackingRect.strokeWidth = this.strokeWidth

      // Constantly update tracking rect by removing it and re-drawing.
      this.trackingRect.removeOn({
        drag: true
      })
    }

    // Get a list of tiles in the defined rectangle
    const toolUp = event => {
      // Point given to getTileAtPoint must be in viewport coordiantes
      let downPoint = this.tiledImage.imageToViewportCoordinates(event.downPoint.x, event.downPoint.y)
      let upPoint = this.tiledImage.imageToViewportCoordinates(event.point.x, event.point.y
      )

      // Selection rectangle defined as:
      let topLeft = {
        x: Math.min(downPoint.x, upPoint.x),
        y: Math.min(downPoint.y, upPoint.y)
      }
      let bottomRight = {
        x: Math.max(downPoint.x, upPoint.x),
        y: Math.max(downPoint.y, upPoint.y)
      }

      // Check if selected area overlaps image
      if (this.overlapsImage({ topLeft, bottomRight })) {
        let aspectRatio = this.tileSource.aspectRatio

        // Extract the part of the selection rectangle overlaps with the image
        let selectionTL = new openseadragon.Point(
          Math.min(Math.max(topLeft.x, 0), 1),
          Math.min(Math.max(topLeft.y, 0), 1 / aspectRatio)
        )

        let selectionBR = new openseadragon.Point(
          Math.min(Math.max(bottomRight.x, 0), 1),
          Math.min(Math.max(bottomRight.y, 0), 1 / aspectRatio)
        )

        // These two tiles define the area in which we want to search, from the
        // first (topLeftTile) to the last (bottomRightTile).
        let level = 17
        let topLeftTile = this.tileSource.getTileAtPoint(level, selectionTL)
        let bottomRightTile = this.tileSource.getTileAtPoint(level, selectionBR)

        // Create list of tile data in which the algorithm should search
        let tilesToSearch = []
        for (let col = topLeftTile.x; col <= bottomRightTile.x; col++) {
          for (let row = topLeftTile.y; row <= bottomRightTile.y; row++) {
            let position = this.tiledImage.viewportToImageCoordinates(
              this.tileSource.getTileBounds(level, col, row).x,
              this.tileSource.getTileBounds(level, col, row).y
            )
            tilesToSearch.push({
              source: this.tileSource.getTileUrl(level, col, row),
              position: [
                Math.round(position.x),
                Math.round(position.y)
              ]
            })
          }
        }
        console.log(tilesToSearch)
        this.saveToJSON(tilesToSearch, 'tiles_for_mega_search.json')

        // Send the query to the compute
        // Pretending to do this now

        // Run loading animation

        // Read results and display results
        axios
          .get('https://aida-private.firebaseio.com/megas.json ')
          // Update the app.js state
          .then((response) => {
            let megas = response.data
            console.log(megas)
            megas.map(this.drawMega)
            this.trackingRect.remove()
          }).then(
            // Now run through the validation workflow

          )
      }
    }

    this.toolMega = new paper.Tool()
    // this.toolMega.onMouseDrag = toolDrag
    // this.toolMega.onMouseUp = toolUp
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas'
    }),

    ...mapGetters({
      getColor: 'annotation/getColor'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolMega.activate()

      // Set the default strokewidth relative to image size and zoom.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 300)

      // Read results and display results
      axios
        .get('https://aida-private.firebaseio.com/megas.json ')
      // Update the app.js state
        .then((response) => {
          let megas = response.data
          console.log(megas)
          megas.map(this.drawMega)
        }).then(
          // Now run through the validation workflow

        )
    },

    // Returns true if rectangle overlaps the image in viewport coordinates
    overlapsImage (rect) {
      // If one rectangle is on left side of other
      if (rect.topLeft.x > this.tiledImage.getBounds().width || rect.bottomRight.x < 0) {
        return false
      // If one rectangle is above other
      } else if (rect.topLeft.y > this.tiledImage.getBounds().height || rect.bottomRight.y < 0) {
        return false
      } else {
        return true
      }
    },

    // Saves data to JSON
    saveToJSON (data, filename) {
      // Build the data into a properly encoded string
      let dataStr = 'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(data, null, 2))

      // Create an anchor node that triggers a download of the annotation.json
      // briefly attach it to the window, trigger it being clicked and then
      // remove it from the window once done.
      let downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', filename)
      document.body.appendChild(downloadAnchorNode) // required for firefox
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    },

    /**
    * @function drawMegas
    * Draws the results from the megakaryocytes classifier in the paperJS instance
    * @param {array} megas - An array of annotation items as described by schema
    */
    drawMega (mega) {
      // Create item
      let newMega = new paper.Path.Rectangle({
        from: new paper.Point(mega.x_min, mega.y_min),
        to: new paper.Point(mega.x_max, mega.y_max),
        data: {
          type: 'rectangle',
          class: mega.class,
          data: {
            score: mega.score,
            validations: []
          }
        }
      })

      // Style item
      newMega.strokeColor = new paper.Color(this.getColor().stroke)
      newMega.strokeWidth = this.strokeWidth
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
