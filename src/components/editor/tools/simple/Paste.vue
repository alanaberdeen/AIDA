<template lang="html">
  <v-tooltip right open-delay=700>
    <template v-slot:activator="{ on }">
      <v-btn
        id="tool"
        v-on="on"
        block
        text
        @click.native="initialiseTool"
      >
        <v-icon small>
          mdi-spray
        </v-icon>
      </v-btn>
    </template>
    <span> Paste Tool </span>
  </v-tooltip>
</template>

<script>
import paper from 'paper'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      toolPaste: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      radius: 2000,
      pasteBrush: null,
      currentColor: null,
      currentRaster: null
    }
  },

  computed: {
    ...mapState({
      maxZoom: state => state.image.OSDviewer.viewport.getMaxZoom(),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      activeStep: state => state.app.activeStep
    })
  },

  created () {
    const toolMove = event => {
      this.pasteBrush = new paper.Path.Circle({
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

      this.pasteBrush.removeOn({
        move: true,
        drag: true
      })
    }

    const toolDown = event => {
      const hitResult = paper.project.hitTest(event.point, { class: paper.Raster })
      if (hitResult) {
        this.currentRaster = hitResult.item
      }

      // When alt-key is held the user is indicating the color that they want to
      // paste elsewhere by selecting a pixel in the raster. Otherwise the user
      // is attempting to paste a pixel of the current color somewhere else.
      if (event.modifiers.alt) {
        if (hitResult) {
          this.currentColor = hitResult.color
        }
      }
    }

    const toolDrag = event => {
      if (!event.modifiers.alt) {
        let newPath = new paper.Path.Circle({
          radius: this.radius,
          position: event.point,
          fillColor: this.currentColor,
          locked: true
        }).removeOn({
          drag: true,
          up: true,
          move: true
        })

        let overlap = paper.project.getItem({
          fillColor: this.currentColor,
          match: item => { return item.locked },
          overlapping: newPath.bounds
        })

        if (overlap) {
          this.combinedPath = overlap.unite(newPath)
          this.combinedPath.locked = true
          overlap.remove()
          newPath.remove()
        } else {
          newPath.remove()
        }
      }
    }

    const toolUp = event => {
      // Flag the annotation has been edited and the changes are not saved
      this.flagAnnotationEdits()
    }

    const keyDown = event => {
      if (event.key === 'alt') {
        paper.view.element.style.cursor = 'crosshair'
      }
    }

    const keyUp = event => {
      if (event.key === 'alt') {
        paper.view.element.style.cursor = 'auto'
      }
    }

    // Add the defined functions to the tool object.
    this.toolPaste = new paper.Tool()
    this.toolPaste.onMouseDown = toolDown
    this.toolPaste.onMouseMove = toolMove
    this.toolPaste.onMouseDrag = toolDrag
    this.toolPaste.onKeyDown = keyDown
    this.toolPaste.onKeyUp = keyUp
    this.toolPaste.onMouseUp = toolUp
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas',
      flagAnnotationEdits: 'annotation/flagAnnotationEdits'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolPaste.activate()

      // Set the default radius relative to image size and zoom level.
      this.radius = this.imageWidth / (this.maxZoom * 100)
      this.strokeWidth = Math.ceil((this.imageWidth * this.strokeScale) / (this.maxZoom * 1000))
    }
  }
}
</script>
