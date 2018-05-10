<!-- Repurposed the move tool to act as a graphical delete tool -->

<template lang="html">
  <v-list-tile id="tool-delete">
    <v-btn
      id="tool"
      flat
      block
      @click.native="initialiseTool"
    >
      <v-icon
        :class="{'grey--text text--darken-2': !active,
                 'blue--text text--darken-1': active}">
        delete
      </v-icon>
    </v-btn>
  </v-list-tile>

</template>

<script>
import paper from 'paper'
import { eventBus } from '../../../main'
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
      toolDelete: null,
      selectOptions: null,
      strokeWidth: null
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.viewer.viewport.getZoom(true),
      imageWidth: state => state.image.viewer.world.getItemAt(0).getContentSize().x
    })
  },

  created () {
    // Result of user click interaction on PaperJS instance.
    let hitResult = null

    // Array of items that will be selected and the selected group
    let toBeDeleted = []
    let selectedGroup = null

    const toolDown = (event) => {
      // Get details of the element the user has clicked on.
      hitResult = paper.project.hitTest(event.point, this.selectOptions)

      // If no modiefiers and item has been selected then create the
      // selection group (of one element) to be selected.
      if (hitResult && (hitResult.type === 'fill' || hitResult.type === 'stroke' || hitResult.type === 'segment' || hitResult.type === 'bounds')) {
        toBeDeleted = [hitResult.item]
      } else {
        toBeDeleted = []
      }

      // Clean current selection
      paper.project.deselectAll()
      if (selectedGroup) {
        selectedGroup.selected = false
        selectedGroup.bounds.selected = false
        selectedGroup = null
      }

      // If there are items to be selected then setup selection.
      if (toBeDeleted.length > 0) {
        // Check any of the items need to be selected with linked
        // items. For example in the case of the
        // counting rectanlge tool need to select the number, tag
        // and rectangle path.
        for (let item in toBeDeleted) {
          if (toBeDeleted[item].data.selectWith) {
            for (let extraItem in toBeDeleted[item].data.selectWith) {
              toBeDeleted.push(toBeDeleted[item].data.selectWith[extraItem])
            }
          }
        }

        selectedGroup = new paper.Group(toBeDeleted)
        selectedGroup.selected = true
      }
    }

    // Functionality for user dragging select/move tool.
    // Specified action should have been set on the mouseDown event.
    const toolDrag = (event) => {
      let selectionRect = new paper.Shape.Rectangle(event.downPoint, event.point)
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
      toBeDeleted = paper.project.getItems({
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

      if (toBeDeleted.length > 0) {
        // Check any of the items need to be selected with linked
        // items. For example in the case of the
        // counting rectanlge tool need to select the number, tag
        // and rectangle path.
        for (let item in toBeDeleted) {
          if (toBeDeleted[item].data.selectWith) {
            for (let extraItem in toBeDeleted[item].data.selectWith) {
              toBeDeleted.push(toBeDeleted[item].data.selectWith[extraItem])
            }
          }
        }

        selectedGroup = new paper.Group(toBeDeleted)
        selectedGroup.selected = true
      }
    }

    // Select the group and provide housekeeping/emit events.
    const toolUp = (event) => {
      if (selectedGroup) {
        selectedGroup.remove()
      }

      // Emit selection event to the eventBus so that the properties
      // panel can be updated.
      eventBus.$emit('selectionChanged', paper.project.selectedItems)

      // As the number of circle markers in the project may have
      // changed, emit an event that will check to see if we are
      // counting these in a particular area and update that value.
      eventBus.$emit('updateMarkerCount')
    }

    // Assign tool to paper instance.
    this.toolDelete = new paper.Tool()
    this.toolDelete.onMouseDown = toolDown
    this.toolDelete.onMouseDrag = toolDrag
    this.toolDelete.onMouseUp = toolUp
  },

  methods: {
    ...mapActions([
      'prepareCanvas'
    ]),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolDelete.activate()

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
#tool {
  min-width: 0px;
}

#tool-delete {
  padding: 0px;
}
</style>
