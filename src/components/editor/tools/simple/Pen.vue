<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700"
    >
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
          timeline
        </v-icon>
      </v-btn>
      <span> Path Tool </span>
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
      toolPen: null,
      strokeWidth: 400, // Default value, will be updated relative to view
      hitOptions: null,
      path: null
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state => state.image.OSDviewer.world.getItemAt(0).getContentSize().x
    })
  },

  created () {
    const toolDown = (event) => {
      // If there is no current active path then create one.
      if (!this.path || !this.path.data.active) {
        this.path = this.newPath()
        this.path.data.active = true
      }

      let hitResult = this.path.hitTest(event.point, this.hitOptions)

      // If option key is held down then close the path.
      if (event.modifiers.option) {
        this.path.closed = true
        this.path.smooth()
        this.path.selected = false
        this.path.data.active = false

      // If first segment clicked, close path.
      } else if (hitResult && hitResult.segment === this.path.firstSegment) {
        this.path.closed = true
        this.path.fillColor = new paper.Color(this.getDefaultColor().fill)
        this.path.smooth()
        this.path.selected = false
        this.path.data.active = false

        // If last segment clicked close path.
      } else if (hitResult && hitResult.segment === this.path.lastSegment) {
        this.path.selected = false
        this.path.data.active = false

      // Else add new point
      } else {
        this.path.add(event.point)
        this.path.smooth()
      }
    }

    // Feedfoward information on mouseMove
    const toolMove = (event) => {
      let hitResult = paper.project.hitTest(event.point, this.hitOptions)

      // If hovering over first/last segment then remove the selected
      // highlighting to indicate path will be finsihed.
      if (hitResult) {
        if (hitResult.segment === hitResult.item.firstSegment) {
          this.path.closed = true
          this.path.selected = false
        } else if (hitResult.segment === hitResult.item.firstSegment ||
         hitResult.segment === hitResult.item.lastSegment) {
          this.path.selected = false
        }
      } else {
        if (this.path && this.path.data.active) {
          this.path.selected = true
          this.path.closed = false
        }
      }
    }

    this.toolPen = new paper.Tool()
    this.toolPen.onMouseDown = toolDown
    this.toolPen.onMouseMove = toolMove
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
      this.toolPen.activate()

      // Set tool stroke width and hitOptions settings.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
      this.hitOptions = {
        segments: true,
        tolerance: this.strokeWidth * 5
      }
    },

    newPath () {
      let newPath = new paper.Path()
      newPath.strokeColor = new paper.Color(this.getDefaultColor().stroke)
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

#tool {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
