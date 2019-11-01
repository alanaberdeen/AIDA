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
            :class="{'grey--text text--darken-2': !active,
                    'blue--text text--darken-1': active}"
            small
          >
            mdi-polymer
          </v-icon>
        </v-btn>
      </template>
      <span> Polygon Tool </span>
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
      toolPolygon: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      hitOptions: null,
      path: null,
      clickTime: null
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
        this.path.closed = true
        this.path.add(event.point)
      // If double clicked close the path
      } else if (this.clickTime && Date.now() - this.clickTime < 200) {
        this.path.fillColor = new paper.Color(this.getColor().fill)
        const bounds = this.path.bounds
        const treeNode = { minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height, item: this.path }
        paper.view.itemsTree.insert(treeNode)
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
      this.strokeWidth = (this.imageWidth * this.strokeScale) / (this.maxZoom * 1000)
      this.hitOptions = {
        segments: true,
        tolerance: (this.imageWidth * this.strokeScale) / (this.currentZoom * 1000) * 5
      }
    },

    newPath () {
      let newPath = new paper.Path()
      newPath.strokeColor = new paper.Color(this.getColor().stroke)
      newPath.strokeScaling = false
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
