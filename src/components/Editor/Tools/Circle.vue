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
            'fa-circle': true,
            'faIcons': !active,
            'faIconsActive': active
        }"/>
      </v-btn>
      <span> Circle Tool </span>
    </v-tooltip>
  </v-list-tile>

</template>

<script>
import paper from 'paper'
import { eventBus } from '../../../main'
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
      toolCircle: null,
      strokeWidth: 400, // Default value, will be updated relative to view
      radius: 2000
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.viewer.viewport.getZoom(true),
      imageWidth: state => state.image.viewer.world.getItemAt(0).getContentSize().x,
      activeStep: state => state.config.activeStep
    })
  },

  created () {
    const toolDown = (event) => {
      // The distance the mouse has to be dragged before an event is fired
      // is dependent on the default radius which is set by the
      // current zoom level.
      this.toolCircle.minDistance = this.strokeWidth * 4
    }

    const toolDrag = (event) => {
      // If user dragged fire enough to fire this event assume they are
      // adjusting the default size of the circle.
      // Reset the distance before further events fired.
      this.toolCircle.minDistance = 0

      // Adjust circle radius.
      this.radius = this.calculateDistance(event.downPoint, event.point)

      // Draw the tracking path
      let trackingPath = new paper.Path.Line(event.downPoint, event.point)
      trackingPath.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1})
      trackingPath.strokeWidth = this.strokeWidth
      trackingPath.add(event.point)
      trackingPath.removeOn({
        drag: true,
        down: true,
        up: true
      })

      // Create a circle positioned at point where mousedown was, with radius
      // the distance between mousedown/mouseup
      let trackingCircle = new paper.Path.Circle(event.downPoint, this.radius)
      trackingCircle.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1})
      trackingCircle.strokeWidth = this.strokeWidth
      trackingCircle.removeOn({
        drag: true,
        down: true,
        up: true
      })
    }

    const toolUp = (event) => {
      // Create a circle marker positioned on the point where mousedown was,
      // with either the default radius or the new radius as set by the
      // distance between the point of mouseDown and mouseUp.
      let newCircle = new paper.Path.Circle(event.downPoint, this.radius)
      newCircle.strokeColor = new paper.Color(this.getDefaultColor().stroke)
      newCircle.strokeWidth = this.strokeWidth
      newCircle.fillColor = new paper.Color(this.getDefaultColor().fill)

      // Custom attribute: includes item in counting tools.
      newCircle.data.countable = true

      // As the number of circle markers in the project has changed,
      // Emit an event that will check to see if we are counting these
      // in a particular area and update that value if so.
      eventBus.$emit('updateMarkerCount')
    }

    // Add the defined functions to the tool object.
    // UNSATISFACTORY: mutating PaperJS project state directly without
    // dispatching view action.
    this.toolCircle = new paper.Tool()
    this.toolCircle.onMouseDown = toolDown
    this.toolCircle.onMouseDrag = toolDrag
    this.toolCircle.onMouseUp = toolUp
  },

  methods: {
    ...mapActions([
      'prepareCanvas'
    ]),

    ...mapGetters([
      'getDefaultColor'
    ]),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolCircle.activate()

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

      let distance = Math.sqrt((Math.pow((x2 - x1), 2)) + (Math.pow((y2 - y1), 2)))
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
