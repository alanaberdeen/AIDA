<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700"
    >
      <v-btn
        id="pencil"
        slot="activator"
        flat
        block
        @click.native="initialiseTool"
      >
        <i
          :class="{
            'fa': true,
            'fa-pencil-alt': true,
            'faIcons': !active,
            'faIconsActive': active
        }"/>
      </v-btn>
      <span> Pencil Tool [m] </span>
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
      toolPencil: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      hitOptions: null,
      path: null
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x
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
    }

    const toolDrag = event => {
      this.path.add(event.point)

      // If the user if sufficiently clost to the intial point that the
      // draw area will be closed upon releasing the mouse then indicate
      // this by drawing the filled colour.
      let hitResult = this.path.hitTest(event.point, this.hitOptions)
      if (hitResult && hitResult.segment === this.path.firstSegment) {
        this.path.closed = true
        this.path.fillColor = new paper.Color(this.getColor().fill)
      } else {
        this.path.closed = false
        this.path.fillColor.alpha = 0
      }
    }

    const toolUp = event => {
      // If user releases mouse near the first segment then close path
      // and set fill.
      let hitResult = this.path.hitTest(event.point, this.hitOptions)
      if (hitResult && hitResult.segment === this.path.firstSegment) {
        this.path.closed = true
        this.path.fillColor = new paper.Color(this.getColor().fill)
      }

      // Deselect path.
      this.path.selected = false

      // The path.segments array is analyzed and replaced by a more
      // optimal set of segments, reducing memory usage and speeding up
      // drawing.
      this.path.simplify()

      // Ensure this path is no longer the active path to be edited.
      this.path.data.active = false
    }

    this.toolPencil = new paper.Tool()
    this.toolPencil.onMouseDown = toolDown
    this.toolPencil.onMouseDrag = toolDrag
    this.toolPencil.onMouseUp = toolUp
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
      this.toolPencil.activate()

      // Set tool stroke width and hitOptions settings.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
      this.hitOptions = {
        segments: true,
        tolerance: this.strokeWidth * 5
      }

      // The distance the mouse has to be dragged before an event is fired
      // is dependent on the current zoom level
      this.toolPencil.minDistance = this.strokeWidth * 5
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
#tooltip {
  width: 100%;
}

#pencil {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
