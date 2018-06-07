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

        <i
          :class="{
            'fa': true,
            'fa-mouse-pointer': true,
            'faIcons': !active,
            'faIconsActive': active
          }"
        />

      </v-btn>
      <span> Move Tool </span>
    </v-tooltip>
  </v-list-tile>
</template>

<script>
import paper from 'paper'
import { eventBus } from '../../../../main'
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
      selectOptions: null,
      strokeWidth: 2
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
    // Result of user click interaction on PaperJS instance.
    let hitResult = null

    // Array of items that will be selected and the selected group
    let toBeSelected = []
    let selectedGroup = null

    // Current tool status.
    let toolStatus = ''

    const toolDown = event => {
      // Get details of the element the user has clicked on.
      hitResult = paper.project.hitTest(event.point, this.selectOptions)

      // If no modiefiers and item has been selected then create the
      // selection group (of one element) to be selected.
      if (
        hitResult &&
        hitResult.type !== 'bounds' &&
        (hitResult.type === 'fill' ||
          hitResult.type === 'stroke' ||
          hitResult.type === 'segment')
      ) {
        if (
          selectedGroup &&
          selectedGroup.hitTest(event.point, this.selectOptions)
        ) {
          // If clicking an already selected item then make no change.
        } else if (event.modifiers.shift) {
          toBeSelected.push(hitResult.item)
        } else {
          toBeSelected = [hitResult.item]
        }

        toolStatus = 'move'

        // If user has clicked bounds then assume transforming.
      } else if (hitResult && hitResult.type === 'bounds') {
        toolStatus = 'transform'
      } else {
        toBeSelected = []
        toolStatus = 'select'
      }

      // Clean current selection
      paper.project.deselectAll()
      if (selectedGroup) {
        selectedGroup.selected = false
        selectedGroup.bounds.selected = false
        selectedGroup = null
      }

      // If there are items to be selected then setup selection.
      if (toBeSelected.length > 0) {
        // Check any of the items need to be selected with linked
        // items. For example in the case of the
        // counting rectanlge tool need to select the number, tag
        // and rectangle path.
        for (let item in toBeSelected) {
          if (toBeSelected[item].data.selectWith) {
            for (let extraItem in toBeSelected[item].data.selectWith) {
              toBeSelected.push(toBeSelected[item].data.selectWith[extraItem])
            }
          }
        }

        selectedGroup = new paper.Group(toBeSelected)
        selectedGroup.selected = true
        selectedGroup.bounds.selected = true
      }
    }

    // Functionality for user dragging select/move tool.
    // Specified action should have been set on the mouseDown event.
    const toolDrag = event => {
      // Draggable selection box.
      if (toolStatus === 'select') {
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

        // Get items inside the selection rectangle.
        toBeSelected = paper.project.getItems({
          class: 'Path',
          inside: selectionRect.bounds
        })

        // Clean current selection
        paper.project.deselectAll()
        if (selectedGroup) {
          selectedGroup.selected = false
          selectedGroup.bounds.selected = false
          selectedGroup = null
        }

        if (toBeSelected.length > 0) {
          // Check any of the items need to be selected with linked
          // items. For example in the case of the
          // counting rectanlge tool need to select the number, tag
          // and rectangle path.
          for (let item in toBeSelected) {
            if (toBeSelected[item].data.selectWith) {
              for (let extraItem in toBeSelected[item].data.selectWith) {
                toBeSelected.push(toBeSelected[item].data.selectWith[extraItem])
              }
            }
          }

          selectedGroup = new paper.Group(toBeSelected)
          selectedGroup.selected = true
        }
      } else if (toolStatus === 'move') {
        selectedGroup.position = selectedGroup.position.add(event.delta)
      } else if (toolStatus === 'transform') {
        let newWidth = null
        let newHeight = null
        let transfromCenter = null

        // Set tranformation parameters for each scaling option.
        if (hitResult && hitResult.name === 'top-left') {
          newWidth = event.point.x - selectedGroup.bounds.topRight.x
          newHeight = event.point.y - selectedGroup.bounds.bottomLeft.y
          transfromCenter = selectedGroup.bounds.bottomRight
        } else if (hitResult && hitResult.name === 'top-right') {
          newWidth = event.point.x - selectedGroup.bounds.topLeft.x
          newHeight = event.point.y - selectedGroup.bounds.bottomRight.y
          transfromCenter = selectedGroup.bounds.bottomLeft
        } else if (hitResult && hitResult.name === 'bottom-right') {
          newWidth = event.point.x - selectedGroup.bounds.bottomLeft.x
          newHeight = event.point.y - selectedGroup.bounds.topRight.y
          transfromCenter = selectedGroup.bounds.topLeft
        } else if (hitResult && hitResult.name === 'bottom-left') {
          newWidth = event.point.x - selectedGroup.bounds.bottomRight.x
          newHeight = event.point.y - selectedGroup.bounds.topLeft.y
          transfromCenter = selectedGroup.bounds.topRight
        }

        // Set scale factors.
        let horizScaleFactor = Math.abs(newWidth / selectedGroup.bounds.width)
        let vertScaleFactor = Math.abs(newHeight / selectedGroup.bounds.height)

        // Scale group
        selectedGroup.scale(horizScaleFactor, vertScaleFactor, transfromCenter)
      }
    }

    // Select the group and provide housekeeping/emit events.
    const toolUp = event => {
      if (selectedGroup) {
        selectedGroup.bounds.selected = true
      }

      // Housekeeping
      toolStatus = ''

      // Emit selection event to the eventBus so that the properties
      // panel can be updated.
      eventBus.$emit('selectionChanged', paper.project.selectedItems)

      // As the number of circle markers in the project may have
      // changed, emit an event that will check to see if we are
      // counting these in a particular area and update that value.
      eventBus.$emit('updateMarkerCount')
    }

    // Change tool icon based on context in order to Feedforward to the
    // user the action that could be taken.
    // I imagine this is a relatively expensive operation?
    const toolMove = event => {
      if (
        selectedGroup &&
        selectedGroup.hitTest(event.point, this.selectOptions)
      ) {
        let hit = selectedGroup.hitTest(event.point, this.selectOptions)
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
      // Remove items
      if (event.key === 'backspace' || event.key === 'delete') {
        // Check for current selection
        if (paper.project.selectedItems) {
          // For each item selected remove if item is not a layer
          paper.project.selectedItems.forEach(item => {
            if (item.className !== 'Layer') {
              item.remove()
            }
          })
        }

        // Emit selection event to the eventBus so that the properties
        // panel can be updated.
        eventBus.$emit('selectionChanged', paper.project.selectedItems)

        // As the number of circle markers in the project may have
        // changed, emit an event that will check to see if we are
        // counting these in a particular area and update that value.
        eventBus.$emit('updateMarkerCount')
      }
    }

    // Assign tool to paper instance.
    this.toolMove = new paper.Tool()
    this.toolMove.onMouseDown = toolDown
    this.toolMove.onMouseDrag = toolDrag
    this.toolMove.onMouseUp = toolUp
    this.toolMove.onMouseMove = toolMove
    this.toolMove.onKeyUp = toolKeyUp
  },

  methods: {
    ...mapActions(['prepareCanvas']),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolMove.activate()

      // Set tool stroke width and hitTolerance settings.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)
      let hitTolerance = this.strokeWidth * 3

      // Selection options
      this.selectOptions = {
        segments: true,
        stroke: true,
        bounds: true,
        handles: true,
        fill: true,
        tolerance: hitTolerance
      }
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
