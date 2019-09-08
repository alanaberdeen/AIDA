// Draws a custom grid over the view.
// The grid should be locked when annotating the image but adjustable when this
// tool is active.
<template lang="html">
  <v-list-item id="tool-tile">
    <v-menu
      id="menu"
      :close-on-content-click="false"
      :nudge-width="150"
      :nudge-right="10"
      transition="slide-x-transition"
      v-model="menu"
      offset-x
    >
      <v-btn
        id="tool"
        slot="activator"
        block
        @click.native="initialiseTool"
      >
        <v-icon
          :class="{'grey--text text--darken-2': !active,
                   'blue--text text--darken-1': active}">
          grid_on
        </v-icon>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-item>
            <v-flex xs5 justify-space-around>
              <div id='switch'>
                <v-switch
                :input-value="visible"
                @change="toggleLayerVisibility">
                </v-switch>
              </div>
            </v-flex>
            <v-flex xs6 offset-xs1>
              Visibility
            </v-flex>
          </v-list-item>
          <v-list-item>
            <v-flex xs5>
              <v-text-field
              :value="gridWidth"
              suffix="px"
              single-line
              @change="setGridWidth"
              @keyup.native.enter="setGridWidth"/>
            </v-flex>
            <v-flex xs6 offset-xs1>
              Width
            </v-flex>
          </v-list-item>
          <v-list-item>
            <v-flex xs5>
              <v-text-field
              :value="gridHeight"
              suffix="px"
              single-line
              @change="setGridHeight"
              @keyup.native.enter="setGridHeight"/>
            </v-flex>
            <v-flex xs6 offset-xs1>
              Height
            </v-flex>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
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
      toolGrid: null,
      strokeWidth: 2, // Default value, will be updated relative to view
      gridLayer: false,
      gridWidth: 0,
      gridHeight: 0,
      menu: false,
      visible: true
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      imageHeight: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().y,
      strokeScale: state => state.app.strokeScale
    })
  },

  created () {
    this.toolGrid = new paper.Tool()
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Set the default strokewidth relative to image size and zoom.
      this.strokeWidth = (this.imageWidth * this.strokeScale) / (this.viewportZoom * 1000)

      // If grid has no been initialised then create it.
      if (!this.gridLayer) {
        this.createGrid()
      }

      // Activate this tool, even though it doesn't have much interactivity atm
      // It's important to make sure that the previous tool is no longer active
      this.toolGrid.activate()
    },

    // Draw the initial grid
    createGrid () {
      // Add a layer for the grid guide
      this.gridLayer = new paper.Layer({
        name: 'guide'
      })

      this.gridWidth = this.imageWidth / 10
      this.gridHeight = this.imageHeight / 10

      this.redrawGrid()
    },

    // Redraw grid
    redrawGrid () {
      // Activate and clear any previously drawn items
      this.gridLayer.activate()
      this.gridLayer.removeChildren()

      // Calculate the required rows and cols
      let rows = Math.ceil(this.imageHeight / this.gridHeight)
      let cols = Math.ceil(this.imageWidth / this.gridWidth)

      // Draw a rectangle for each part
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let gridRect = new paper.Path.Rectangle({
            from: [this.gridWidth * j, this.gridHeight * i],
            to: [(this.gridWidth * j) + this.gridWidth, (this.gridHeight * i) + this.gridHeight],
            strokeColor: 'grey',
            strokeWidth: this.strokeWidth
          })
          gridRect.strokeColor.alpha = 0.7
        }
      }
    },

    toggleLayerVisibility () {
      this.visible = !this.visible
      this.gridLayer.visible = !this.gridLayer.visible
    },

    setGridWidth (input) {
      let newWidth = this.gridWidth // Default

      // If passed a text event
      if (typeof input === 'string' || typeof input === 'number') {
        newWidth = input
      // If passed a keyboard event. (most likely enter key from a text edit.)
      } else if (input instanceof KeyboardEvent) {
        newWidth = input.target.value
      }

      // Set the new width and re-draw
      this.gridWidth = Number(newWidth)
      this.redrawGrid()
    },

    setGridHeight (input) {
      let newHeight = this.gridHeight // Default

      // If passed a text event
      if (typeof input === 'string' || typeof input === 'number') {
        newHeight = input
      // If passed a keyboard event. (most likely enter key from a text edit.)
      } else if (input instanceof KeyboardEvent) {
        newHeight = input.target.value
      }

      // Set the new height and re-draw
      this.gridHeight = Number(newHeight)
      this.redrawGrid()
    }
  }
}
</script>

<style lang='css'>

#menu {
  width: 100%;
}

#tool {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}

#switch {
  padding-top: 25px;
  padding-left: 10px;
}
</style>
