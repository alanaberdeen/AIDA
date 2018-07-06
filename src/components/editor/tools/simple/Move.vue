<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700"
    >
      <v-btn
        id="move"
        slot="activator"
        flat
        block
        @click.native="initialiseTool"
      >

        <i
          :class="{
            'fa': true,
            'fa-mouse-pointer': true,
            'faIcons': !active,
            'faIconsActive': active
          }"
        />

      </v-btn>
      <span> Move Tool [v]</span>
    </v-tooltip>
  </v-list-tile>
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
      toolMove: null,
      hitOptions: null,
      strokeWidth: 2,
      selectionGroup: null,
      toolMode: ''
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
    // NOTE: This method is rather unsatisfactory. Currently paper.js does not
    // have functionality for un-grouping items in a project. Therefore, the
    // following code will leave many groups that are un-used in the project.

    // Initialise variables to be used across tool events
    let hitResult = null

    const toolDown = event => {
      // Check if item hit
      hitResult = paper.project.hitTest(event.point, this.hitOptions)

      // Remove current selection group bounds
      this.selectionGroup.bounds.selected = false

      // Hit result and event modifier conditions
      if (hitResult) {
        // If hit a bounds item, assume user is attempting to trasnform
        if (hitResult.type === 'bounds') {
          this.toolMode = 'transform'

          // If hit an item and shift key held then add to selection
        } else if (event.modifiers.shift) {
          hitResult.item.selected = true

          // If item is already selected, assume user is attempting to move
        } else if (hitResult.item.selected) {
          this.toolMode = 'move'

          // If hit an unselected item with no modifer then deselct all but this
        } else {
          paper.project.deselectAll()
          hitResult.item.selected = true
          this.toolMode = 'move'
        }

        // If no hitresult, assume use is attempting to make a new selection
      } else {
        paper.project.deselectAll()
        this.toolMode = 'select'
      }
    }

    // Functionality for user dragging select/move tool.
    // Specified mode should have been set on the mouseDown event.
    const toolDrag = event => {
      // Select mode: creates a draggable selection box.
      if (this.toolMode === 'select') {
        let selectionRect = new paper.Shape.Rectangle(
          event.downPoint,
          event.point
        )
        selectionRect.strokeColor = '#4D88D4'
        selectionRect.fillColor = '#A3C5E8'
        selectionRect.opacity = 0.3
        selectionRect.strokeWidth = this.strokeWidth

        // Constantly update tracking rect by removing it and re-drawing.
        selectionRect.removeOn({
          drag: true,
          down: true,
          up: true
        })

        // Select items inside the selection rectangle.
        paper.project.deselectAll()
        paper.project.getItems({
          class: 'Path',
          inside: selectionRect.bounds,
          match: this.matchFilter
        }).forEach((item) => {
          item.selected = true
        })

      // Move mode: adjusts the position of the selected group
      } else if (this.toolMode === 'move') {
        if (this.selectionGroup.children.length > 0) {
          this.selectionGroup.position = this.selectionGroup.position.add(event.delta)
        } else {
          hitResult.item.position = hitResult.item.position.add(event.delta)
        }

        // Transfrom mode: scales the selected group
      } else if (this.toolMode === 'transform') {
        let newWidth = null
        let newHeight = null
        let transfromCenter = null

        // Set tranformation parameters for each scaling option.
        if (hitResult && hitResult.name === 'top-left') {
          newWidth = event.point.x - this.selectionGroup.bounds.topRight.x
          newHeight = event.point.y - this.selectionGroup.bounds.bottomLeft.y
          transfromCenter = this.selectionGroup.bounds.bottomRight
        } else if (hitResult && hitResult.name === 'top-right') {
          newWidth = event.point.x - this.selectionGroup.bounds.topLeft.x
          newHeight = event.point.y - this.selectionGroup.bounds.bottomRight.y
          transfromCenter = this.selectionGroup.bounds.bottomLeft
        } else if (hitResult && hitResult.name === 'bottom-right') {
          newWidth = event.point.x - this.selectionGroup.bounds.bottomLeft.x
          newHeight = event.point.y - this.selectionGroup.bounds.topRight.y
          transfromCenter = this.selectionGroup.bounds.topLeft
        } else if (hitResult && hitResult.name === 'bottom-left') {
          newWidth = event.point.x - this.selectionGroup.bounds.bottomRight.x
          newHeight = event.point.y - this.selectionGroup.bounds.topLeft.y
          transfromCenter = this.selectionGroup.bounds.topRight
        }

        // Set scale factors.
        let horizScaleFactor = Math.abs(newWidth / this.selectionGroup.bounds.width)
        let vertScaleFactor = Math.abs(newHeight / this.selectionGroup.bounds.height)

        // Scale group
        this.selectionGroup.scale(horizScaleFactor, vertScaleFactor, transfromCenter)
      }
    }

    const toolUp = event => {
      this.selectionGroup = new paper.Group(paper.project.selectedItems)
      if (!this.selectionGroup.isEmpty()) {
        this.selectionGroup.bounds.selected = true
      }

      // Store an array of selected items in the group
      this.setSelectedItems(paper.project.selectedItems)
    }

    // Change tool icon based on context in order to Feedforward to the
    // user the action that could be taken.
    // I imagine this is a relatively expensive operation?
    const toolMove = event => {
      if (
        this.selectionGroup &&
        this.selectionGroup.hitTest(event.point, this.hitOptions)
      ) {
        let hit = this.selectionGroup.hitTest(event.point, this.hitOptions)
        if (hit.name === 'bottom-right' || hit.name === 'top-left') {
          paper.view.element.style.cursor = 'nwse-resize'
        } else if (hit.name === 'bottom-left' || hit.name === 'top-right') {
          paper.view.element.style.cursor = 'nesw-resize'
        } else if (hit.type === 'fill') {
          paper.view.element.style.cursor = 'move'
        }
      } else {
        let canvas = document.getElementById('annotation-canvas')
        canvas.style.cursor = 'auto'
      }
    }

    // handlers for keyEvents.
    const toolKeyUp = event => {
      // Only trigger the following if Move tool is active
      if (this.active) {
        // Remove items
        if (event.key === 'backspace' || event.key === 'delete') {
        // Check for current selection
          if (paper.project.selectedItems) {
          // Remove current selection group bounds
            this.selectionGroup.bounds.selected = false

            // For each item selected remove if item is not a layer
            paper.project.selectedItems.forEach(item => {
              if (item.className !== 'Layer') {
                item.remove()
              }
            })
          }
        }
      }
    }

    // Assign tool to paper instance.
    this.toolMove = new paper.Tool()
    this.toolMove.onMouseDown = toolDown
    this.toolMove.onMouseDrag = toolDrag
    this.toolMove.onMouseMove = toolMove
    this.toolMove.onKeyUp = toolKeyUp
    this.toolMove.onMouseUp = toolUp
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas',
      setSelectedItems: 'annotation/setSelectedItems'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolMove.activate()

      // Set tool stroke width and hitTolerance settings.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
      let hitTolerance = this.strokeWidth * 3

      // Selection options
      this.hitOptions = {
        segments: true,
        stroke: true,
        bounds: true,
        handles: true,
        fill: true,
        tolerance: hitTolerance,
        match: this.matchFilter
      }

      // If first time using the tool then must initialise the selection group
      this.selectionGroup = new paper.Group(paper.project.selectedItems)
    },

    matchFilter (itemToCheck) {
      // When checking a hitResult, need to check under item
      if (itemToCheck.item && itemToCheck.item.layer.name === 'guide') {
        return false
      // When checking from project.getItems(), can check straight under layer
      } else if (itemToCheck.layer && itemToCheck.layer.name === 'guide') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang='css' >
#tooltip {
  width: 100%;
}

#move {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
