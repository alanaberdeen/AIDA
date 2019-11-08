<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="tool"
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
            mdi-format-paint
          </v-icon>
        </v-btn>
      </template>
      <span> Edit Tool </span>
    </v-tooltip>
  </v-list-item>

</template>

<script>
import paper from 'paper'
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      toolEdit: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      radius: 2000,
      editBrush: null,
      currentColor: '#000000',
      currentRaster: null
    }
  },

  computed: {
    ...mapState({
      OSDviewer: state => state.image.OSDviewer,
      OSDworld: state => state.image.world,
      viewportZoom: state => state.image.OSDviewer.viewport.getMaxZoom(),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      activeStep: state => state.app.activeStep
    })
  },

  created () {
    const toolMove = event => {
      this.editBrush = new paper.Path.Circle({
        radius: this.radius,
        position: event.point,
        strokeScaling: false,
        strokeWidth: this.strokeWidth,
        strokeColor: new paper.Color({
          hue: 220,
          saturation: 0.7,
          lightness: 0.5,
          alpha: 1
        })
      })

      this.editBrush.removeOn({
        move: true,
        drag: true
      })
    }

    const toolDrag = event => {
      const newPath = new paper.Path.Circle({
        radius: this.radius,
        position: event.point,
        fillColor: this.currentColor,
        locked: true,
        data: {
          type: 'imageEdit'
        }
      })

      const overlap = paper.project.getItem({
        fillColor: this.currentColor,
        match: item => { return item.locked },
        overlapping: newPath.bounds
      })

      if (overlap) {
        this.combinedPath = overlap.unite(newPath)
        this.combinedPath.locked = true
        overlap.remove()
        newPath.remove()
      }
    }

    const toolUp = event => {
      // Flag the annotation has been edited and the changes are not saved
      this.flagAnnotationEdits()
    }

    const keyDown = event => {
      if (event.key === 'alt') {
        paper.view.element.style.cursor = 'crosshair'
      } else if (event.key === '1') {
        this.currentColor = '#000000'
      } else if (event.key === '2') {
        this.currentColor = '#808080'
      } else if (event.key === '3') {
        this.currentColor = '#FFFFFF'
      }
    }

    const keyUp = event => {
      if (event.key === 'alt') {
        paper.view.element.style.cursor = 'auto'
      }
    }

    // Add the defined functions to the tool object.
    this.toolEdit = new paper.Tool()
    this.toolEdit.onMouseMove = toolMove
    this.toolEdit.onMouseDrag = toolDrag
    this.toolEdit.onKeyDown = keyDown
    this.toolEdit.onKeyUp = keyUp
    this.toolEdit.onMouseUp = toolUp
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas',
      editTiles: 'backend/editTiles',
      flagAnnotationEdits: 'annotation/flagAnnotationEdits'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolEdit.activate()

      // Set the default radius relative to image size and zoom level.
      this.radius = this.imageWidth / (this.viewportZoom * 100)
      this.strokeWidth = Math.ceil((this.imageWidth * this.strokeScale) / (this.viewportZoom * 1000))
    }
  }
}
</script>

<style lang='css' scoped>

#tool {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
