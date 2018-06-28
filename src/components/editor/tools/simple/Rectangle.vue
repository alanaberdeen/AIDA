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
          crop_landscape
        </v-icon>
      </v-btn>
      <span> Rectangel Tool </span>
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
      toolRect: null,
      strokeWidth: 2 // Default value, will be updated relative to view
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
    // On drag draw feedforward shadow rectangle in realtime.
    const toolDrag = event => {
      let trackingRect = new paper.Path.Rectangle(event.downPoint, event.point)
      trackingRect.strokeColor = new paper.Color('#2661D8')
      trackingRect.strokeColor.alpha = 0.7
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
      newRect.strokeWidth = this.strokeWidth

      // Custom data attribute:
      newRect.data.type = 'rectangle'
      newRect.data.class = ''
    }

    this.toolRect = new paper.Tool()
    this.toolRect.onMouseDrag = toolDrag
    this.toolRect.onMouseUp = toolUp
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
      this.toolRect.activate()

      // Set the default strokewidth relative to image size and zoom.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
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
