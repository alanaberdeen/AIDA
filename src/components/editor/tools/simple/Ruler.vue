<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="polygon"
          v-on="on"
          block
          text
          @click.native="initialiseTool"
        >
          <v-icon
            small
            :class="{'grey--text text--darken-2': !active,
                    'blue--text text--darken-1': active}">
            mdi-ruler
          </v-icon>
        </v-btn>
      </template>
      <span> Ruler Tool </span>
    </v-tooltip>
  </v-list-item>
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
      toolRuler: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      hitOptions: null,
      path: null,
      clickTime: null
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      strokeScale: state => state.app.strokeScale,
      pixelScaleFactor: state => (state.image.pixelScaleFactor.mppX * state.image.pixelScaleFactor.mppY) / 2
    })
  },

  created () {
    const toolDrag = event => {
      // Draw line
      let trackingLine = new paper.Path.Line({
        from: event.downPoint,
        to: event.point,
        strokeColor: '#2661D8',
        strokeWidth: this.strokeWidth
      })

      // Draw length label
      let vector = event.point.subtract(event.downPoint)
      let sign = Math.abs(vector.angle) > 90 ? 1 : -1
      let orthVector = vector.rotate(90 * sign).normalize()
      let textPoint = event.downPoint.add(vector.divide(2)).add(orthVector.multiply(this.strokeWidth))
      let textAngle = Math.abs(vector.angle) > 90 ? 180 + vector.angle : vector.angle
      let text = new paper.PointText({
        point: textPoint,
        content: Math.round(vector.length * this.pixelScaleFactor) + '\u03bcm',
        fillColor: 'white',
        justification: 'center',
        fontSize: this.strokeWidth * 3
      })

      let textBackground = new paper.Path.Rectangle({
        from: text.bounds.topLeft,
        to: text.bounds.bottomRight,
        fillColor: '#2661D8',
        strokeWidth: this.strokeWidth,
        strokeColor: '#2661D8',
        radius: this.strokeWidth / 10
      }).insertBelow(text)

      text.rotate(textAngle, textPoint)
      textBackground.rotate(textAngle, textPoint)

      // Constantly update guide items by removing and re-drawing.
      trackingLine.removeOn({ drag: true, up: true })
      textBackground.removeOn({ drag: true, up: true })
      text.removeOn({ drag: true, up: true })
    }

    const toolUp = event => {
      // Draw line
      let line = new paper.Path.Line({
        from: event.downPoint,
        to: event.point,
        strokeColor: '#2661D8',
        strokeWidth: this.strokeWidth,
        locked: true,
        data: {
          pixelScaleFactor: this.pixelScaleFactor
        },
        // Add a method for drawing the label to this line
        // TODO: this is a rough sketch of something that could be implemented.
        // Needs a thorough re-work later on. The method should definitely be
        // attached to the prototype for example. Perhaps building a whole new
        // paperItem class thingy.
        drawLabel: function () {
          // If there is currently a label attached to the line it must first be
          // removed.
          if (this.data.label) {
            this.data.label.text.remove()
            this.data.label.textBackground.remove()
          }

          // Draw length label
          let vector = this.lastSegment.point.subtract(this.firstSegment.point)
          let sign = Math.abs(vector.angle) > 90 ? 1 : -1
          let orthVector = vector.rotate(90 * sign).normalize()
          let textPoint = this.firstSegment.point
            .add(vector.divide(2))
            .add(orthVector.multiply(this.strokeWidth))
          let textAngle = Math.abs(vector.angle) > 90 ? 180 + vector.angle : vector.angle
          let text = new paper.PointText({
            point: textPoint,
            content: Math.round(vector.length * this.data.pixelScaleFactor) + '\u03bcm',
            fillColor: 'white',
            justification: 'center',
            fontSize: this.strokeWidth * 3,
            locked: true
          })

          // Fill the background behind the text to make it more clear.
          let textBackground = new paper.Path.Rectangle({
            from: text.bounds.topLeft,
            to: text.bounds.bottomRight,
            fillColor: '#2661D8',
            strokeWidth: this.strokeWidth,
            strokeColor: '#2661D8',
            radius: this.strokeWidth / 10,
            locked: true
          }).insertBelow(text)

          // Rotate the items to be at the same angle as the line
          text.rotate(textAngle, textPoint)
          textBackground.rotate(textAngle, textPoint)

          // Store references to the items on the line
          this.data.label = {
            text,
            textBackground
          }
        }
      })

      // Draw label
      line.drawLabel()
    }

    this.toolRuler = new paper.Tool()
    this.toolRuler.onMouseDrag = toolDrag
    this.toolRuler.onMouseUp = toolUp
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas',
      flagAnnotationEdits: 'annotation/flagAnnotationEdits'
    }),

    ...mapGetters({
      getColor: 'annotation/getColor'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolRuler.activate()

      // Set tool stroke width and hitOptions settings.
      this.strokeWidth = (this.imageWidth * this.strokeScale) / (this.viewportZoom * 1000)
      this.hitOptions = {
        segments: true,
        tolerance: this.strokeWidth * 5
      }
    },

    newPath () {
      let newPath = new paper.Path()
      newPath.strokeColor = new paper.Color(this.getColor().stroke)
      newPath.strokeWidth = this.strokeWidth
      newPath.selected = true

      return newPath
    }
  }
}
</script>

<style lang='css'>

#polygon {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
