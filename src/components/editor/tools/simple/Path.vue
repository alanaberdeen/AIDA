<template lang="html">
  <v-tooltip right open-delay=700>
    <template v-slot:activator="{ on }">
      <v-btn
        id="path"
        v-on="on"
        block
        text
        @click.native="initialiseTool"
      >
        <v-icon small>
          mdi-chart-timeline-variant
        </v-icon>
      </v-btn>
    </template>
    <span> Path Tool [p] </span>
  </v-tooltip>
</template>

<script>
import paper from 'paper'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      toolPen: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      hitOptions: null,
      path: null
    }
  },

  computed: {
    ...mapState({
      maxZoom: state => state.image.OSDviewer.viewport.getMaxZoom(),
      currentZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      strokeScale: state => state.app.strokeScale
    })
  },

  created () {
    const toolDown = event => {
      // If there is no current active path then create one.
      if (!this.path || !this.path.data.active) {
        this.path = this.newPath()
        this.path.data.active = true
        this.path.data.class = ''
        this.path.data.type = 'path'
      }
      // If option key is held down then close the path.
      if (event.modifiers.option) {
        this.path.closed = true
        this.path.smooth()
        this.path.selected = false
        this.path.data.active = false

      // If first segment clicked, close path.
      } else if (this.path.firstSegment && event.point.isClose(this.path.firstSegment.point, this.hitOptions.tolerance)) {
        this.path.closed = true
        this.path.fillColor = new paper.Color(this.getColor().fill)
        this.path.smooth()
        this.path.selected = false
        this.path.data.active = false

      // If last segment clicked close path.
      } else if (this.path.lastSegment && event.point.isClose(this.path.lastSegment.point, this.hitOptions.tolerance)) {
        this.path.selected = false
        this.path.data.active = false

      // Else add new point
      } else {
        this.path.add(event.point)
        this.path.smooth()
      }
    }

    // Feedfoward information on mouseMove
    const toolMove = event => {
      // If hovering over first/last segment then remove the selected
      // highlighting to indicate path will be finsihed.
      if (this.path && this.path.firstSegment && event.point.isClose(this.path.firstSegment.point, this.hitOptions.tolerance)) {
        this.path.closed = true
        this.path.selected = false
        const bounds = this.path.bounds
        const treeNode = { minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height, item: this.path }
        paper.view.itemsTree.insert(treeNode)
      } else if (this.path && this.path.lastSegment && event.point.isClose(this.path.lastSegment.point, this.hitOptions.tolerance)) {
        this.path.selected = false
      } else if (this.path && this.path.data.active) {
        this.path.selected = true
        this.path.closed = false
      }
    }

    const toolUp = event => {
      // Flag the annotation has been edited and the changes are not saved
      this.flagAnnotationEdits()
    }

    this.toolPen = new paper.Tool()
    this.toolPen.onMouseDown = toolDown
    this.toolPen.onMouseMove = toolMove
    this.toolPen.onMouseUp = toolUp
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
      this.toolPen.activate()

      // Set tool stroke width and hitOptions settings.
      this.strokeWidth = Math.ceil((this.imageWidth * this.strokeScale) / (this.maxZoom * 1000))

      this.hitOptions = {
        segments: true,
        tolerance: Math.ceil((this.imageWidth * this.strokeScale) / (this.currentZoom * 1000))
      }
    },

    newPath () {
      const newPath = new paper.Path()
      newPath.strokeColor = new paper.Color(this.getColor().stroke)
      newPath.strokeScaling = false
      newPath.strokeWidth = this.strokeWidth
      newPath.selected = true

      return newPath
    }
  }
}
</script>
