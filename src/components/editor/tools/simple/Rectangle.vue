<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="rectangle"
          v-on="on"
          block
          text
          @click.native="initialiseTool"
        >
          <v-icon
            small
            :class="{'grey--text text--darken-2': !active,
                    'blue--text text--darken-1': active}">
            mdi-crop-landscape
          </v-icon>
        </v-btn>
      </template>
      <span> Rectangel Tool [r] </span>
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
      toolRect: null,
      strokeWidth: 2 // Default value, will be updated relative to view
    }
  },

  computed: {
    ...mapState({
      maxZoom: state => state.image.OSDviewer.viewport.getMaxZoom(),
      imageWidth: state => state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      strokeScale: state => state.app.strokeScale
    })
  },

  created () {
    // On drag draw feedforward shadow rectangle in realtime.
    const toolDrag = event => {
      let trackingRect = new paper.Path.Rectangle(event.downPoint, event.point)
      trackingRect.strokeColor = new paper.Color('#2661D8')
      trackingRect.strokeColor.alpha = 0.7
      trackingRect.strokeScaling = false
      trackingRect.strokeWidth = this.strokeWidth

      // Constantly update tracking rect by removing it and re-drawing.
      trackingRect.removeOn({
        drag: true,
        up: true
      })
    }

    // Finalise rectangle properties and draw.
    const toolUp = event => {
      let newRect = new paper.Path.Rectangle(event.downPoint, event.point)
      newRect.strokeColor = new paper.Color(this.getColor().stroke)
      newRect.fillColor = new paper.Color(this.getColor().fill)
      newRect.strokeScaling = false
      newRect.strokeScaling = false
      newRect.strokeWidth = this.strokeWidth

      // Custom data attribute:
      newRect.data.type = 'rectangle'
      newRect.data.class = ''

      const bounds = newRect.bounds
      const treeNode = { minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height, item: newRect }
      paper.view.itemsTree.insert(treeNode)

      // Flag the annotation has been edited and the changes are not saved
      this.flagAnnotationEdits()
    }

    this.toolRect = new paper.Tool()
    this.toolRect.onMouseDrag = toolDrag
    this.toolRect.onMouseUp = toolUp
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
      this.toolRect.activate()

      // Set the default strokewidth relative to image size and zoom.
      this.strokeWidth = Math.ceil((this.imageWidth * this.strokeScale) / (this.maxZoom * 1000))
    }
  }
}
</script>

<style lang='css'>

#rectangle {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
