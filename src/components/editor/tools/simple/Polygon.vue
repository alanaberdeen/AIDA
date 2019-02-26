<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700"
    >
      <v-btn
        id="polygon"
        slot="activator"
        flat
        block
        @click.native="initialiseTool"
      >
        <v-icon
          :class="{'grey--text text--darken-2': !active,
                   'blue--text text--darken-1': active}">
          polymer
        </v-icon>
      </v-btn>
      <span> Polygon Tool </span>
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
      toolPolygon: null,
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
        this.path.closed = true
        this.path.add(event.point)
      // If double clicked close the path
      } else if (this.clickTime && Date.now() - this.clickTime < 200) {
        this.path.fillColor = new paper.Color(this.getColor().fill)
        this.path.selected = false
        this.path.data.active = false
      } else {
        this.path.add(event.point)
        this.clickTime = Date.now()
      }
    }

    const onEscape = event => {
      if (event.key === 'escape') {
        this.path.fillColor = new paper.Color(this.getColor().fill)
        this.path.selected = false
        this.path.data.active = false
      }
    }

    const toolUp = event => {
      // Flag the annotation has been edited and the changes are not saved
      this.flagAnnotationEdits()
    }

    this.toolPolygon = new paper.Tool()
    this.toolPolygon.onMouseDown = toolDown
    this.toolPolygon.onKeyDown = onEscape
    this.toolPolygon.onMouseUp = toolUp
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
      this.toolPolygon.activate()

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
#tooltip {
  width: 100%;
}

#polygon {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
