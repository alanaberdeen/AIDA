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
        <i
          :class="{
            'fa': true,
            'fa-paint-brush': true,
            'faIcons': !active,
            'faIconsActive': active
        }"/>
      </v-btn>
      <span> Paint Tool </span>
    </v-tooltip>
  </v-list-tile>

</template>

<script>
import paper from 'paper'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      toolPaint: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      radius: 2000,
      brush: null,
      overlap: null,
      path: null,
      combinedPath: null
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      activeStep: state => state.app.activeStep
    })
  },

  created () {
    const toolMove = event => {
      this.brush = new paper.Path.Circle({
        radius: this.radius,
        position: event.point,
        strokeWidth: this.strokeWidth,
        strokeColor: new paper.Color({
          hue: 220,
          saturation: 0.7,
          lightness: 0.5,
          alpha: 1
        })
      })

      this.brush.removeOn({
        move: true,
        drag: true
      })
    }

    const toolDrag = event => {
      this.path = new paper.Path.Circle({
        radius: this.radius,
        position: event.point,
        strokeWidth: this.strokeWidth,
        strokeColor: this.getColor().stroke,
        fillColor: this.getColor().fill
      }).removeOn({
        drag: true,
        up: true,
        move: true
      })

      let overlap = paper.project.getItem({
        class: 'Path',
        match: function (item) {
          if (item.data.class !== 'megakaryocyte') { return true }
        },
        overlapping: this.path.bounds
      })

      console.log(overlap)

      if (overlap) {
        if (event.modifiers.alt) {
          this.combinedPath = overlap.subtract(this.path)
        } else {
          this.combinedPath = overlap.unite(this.path)
        }
        overlap.remove()
      }
    }

    const keyDown = event => {
      if (event.key === 'up') {
        this.radius++
      } else if (event.key === 'down') {
        this.radius--
      }
      console.log(event)
    }

    // Add the defined functions to the tool object.
    this.toolPaint = new paper.Tool()
    this.toolPaint.onMouseMove = toolMove
    this.toolPaint.onMouseDrag = toolDrag
    this.toolPaint.onKeyDown = keyDown
    // this.toolPaint.onMouseUp = toolUp
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
      this.toolPaint.activate()

      // Set the default radius relative to image size and zoom level.
      this.radius = this.imageWidth / (this.viewportZoom * 100)
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
    },

    // Helper function - calculate distance between 2 points:
    calculateDistance (firstPoint, secondPoint) {
      let x1 = firstPoint.x
      let y1 = firstPoint.y
      let x2 = secondPoint.x
      let y2 = secondPoint.y

      let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      return distance
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
