<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="node"
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
            mdi-navigation
          </v-icon>
        </v-btn>
      </template>
      <span> Node Tool [a] </span>
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
      toolNode: null,
      hitOptions: null
    }
  },

  computed: {
    ...mapState({
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state => state.image.OSDviewer.world.getItemAt(0).getContentSize().x,
      saveState: state => state.annotation.saveState
    })
  },

  created () {
    // Result of user click interaction on PaperJS instancevent.
    let hitResult = null

    // Current tool status.
    let toolStatus = null

    const toolDown = event => {
      // Get details of the element the user has clicked on.
      hitResult = paper.project.hitTest(event.point, this.hitOptions)

      // Check if use selected something
      if (hitResult) {
        // If item not currrently selected then select.
        if (!hitResult.item.selected) {
          paper.project.deselectAll()
          hitResult.item.selected = true
          toolStatus = 'selecting'

          // If user selects stroke then add node
        } else if (hitResult.type === 'stroke') {
          toolStatus = 'adding-node'

          // If user selecteds a segment.
        } else if (hitResult.type === 'segment') {
          // Select only that segment and associate handles.
          paper.project.deselectAll()
          hitResult.item.selected = true
          hitResult.segment.selected = true
          hitResult.segment.handleIn.selected = true
          hitResult.segment.handleOut.selected = true

          toolStatus = 'adjusting-segment'

          // If user selects handle
        } else if (
          hitResult.type === 'handle-out' ||
          hitResult.type === 'handle-in'
        ) {
          toolStatus = 'adjusting-handle'
        }

        // Otherwise deselect all selections
      } else {
        paper.project.deselectAll()
      }
    }

    // On mouseDrag functionality
    const toolDrag = event => {
      if (hitResult) {
        if (toolStatus === 'adjusting-segment') {
          hitResult.segment.point = hitResult.segment.point.add(event.delta)
        } else if (
          hitResult.type === 'handle-out' &&
          toolStatus === 'adjusting-handle'
        ) {
          hitResult.segment.handleOut = hitResult.segment.handleOut.add(
            event.delta
          )
        } else if (
          hitResult.type === 'handle-in' &&
          toolStatus === 'adjusting-handle'
        ) {
          hitResult.segment.handleIn = hitResult.segment.handleIn.add(event.delta)
        }

        paper.view.itemsTree.remove(hitResult.item)
        const bounds = hitResult.item.bounds
        const treeNode = { minX: bounds.x, minY: bounds.y, maxX: bounds.x + bounds.width, maxY: bounds.y + bounds.height, item: hitResult.item }
        paper.view.itemsTree.insert(treeNode)

        if (this.saveState.changesSaved) {
          // Flag the annotation has been edited and the changes are not saved
          this.flagAnnotationEdits()
        }
      }
    }

    this.toolNode = new paper.Tool()
    this.toolNode.onMouseDown = toolDown
    this.toolNode.onMouseDrag = toolDrag
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
      this.toolNode.activate()

      // Selection options
      let hitTolerance = this.imageWidth / (this.viewportZoom * 300)
      this.hitOptions = {
        segments: true,
        stroke: true,
        handles: true,
        fill: true,
        tolerance: hitTolerance,
        match: this.matchFilter
      }
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

<style lang='css'>

#node {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
