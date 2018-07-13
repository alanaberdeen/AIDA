// This tool counts circle items within a predefined area.
// It needs to be re-thought.
<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700">
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
          filter_9_plus
        </v-icon>
      </v-btn>
      <span> Count Tool </span>
    </v-tooltip>
  </v-list-tile>
</template>

<script>
// import paper from 'paper'

// import { mapActions, mapState } from 'vuex'

// export default {
//   props: {
//     active: {
//       type: Boolean,
//       default: false
//     }
//   },

//   data () {
//     return {
//       toolCount: null,
//       strokeWidth: 2
//     }
//   },

//   computed: {
//     ...mapState({
//       viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
//       imageWidth: state =>
//         state.image.OSDviewer.world.getItemAt(0).getContentSize().x
//     })
//   },

//   created () {
//     // Listen for an event indicating the marker counts should be updated.
//     eventBus.$on('updateMarkerCount', () => {
//       // Find counters in the project at this moment.
//       let counters = paper.project.getItems({
//         data: {
//           type: 'counter'
//         }
//       })

//       // Check which marker circles are inside the counting rectangle
//       // at this moment.
//       let markerItems = paper.project.getItems({
//         className: 'Path',
//         data: {
//           countable: true
//         }
//       })

//       for (let counter in counters) {
//         let totalMarkers = 0

//         // If marker is inside the area for counting then increment
//         // the total count.
//         for (let marker in markerItems) {
//           if (
//             markerItems[marker].isInside(counters[counter].data.rect.bounds)
//           ) {
//             totalMarkers += 1
//           }
//         }

//         // Update text to represent the number of markers inside
//         // the associated rectangle.
//         counters[counter].content = totalMarkers
//       }
//     })

//     // On drag draw feedforward shadow rectangle in realtime.
//     const toolDrag = event => {
//       let trackingRect = new paper.Path.Rectangle(event.downPoint, event.point)
//       trackingRect.strokeColor = new paper.Color({
//         hue: 220,
//         saturation: 0.7,
//         lightness: 0.5,
//         alpha: 1
//       })
//       trackingRect.strokeWidth = this.strokeWidth

//       // Constantly update tracking rect by removing it and re-drawing.
//       trackingRect.removeOn({
//         drag: true,
//         up: true
//       })
//     }

//     // Finalise rectangle properties and draw.
//     const toolUp = event => {
//       // Draw rectangle
//       let countRect = new paper.Path.Rectangle(event.downPoint, event.point)
//       countRect.strokeColor = new paper.Color({
//         hue: 46,
//         saturation: 1.0,
//         lightness: 0.65,
//         alpha: 1
//       })
//       countRect.strokeWidth = this.strokeWidth

//       // Draw text for number of items within rectangle
//       let countText = new paper.PointText(countRect.bounds.topLeft)
//       countText.translate(this.strokeWidth * 3, -this.strokeWidth * 2)
//       countText.fillColor = 'black'
//       countText.fontSize = this.strokeWidth * 12 + 'px'
//       countText.data.rect = countRect // Keep a record of associated rectangle within which the items are counted.
//       countText.data.type = 'counter'

//       // Emit event that will check and update the number of markers in
//       // each counter rectangle.
//       eventBus.$emit('updateMarkerCount')

//       // Draw text tag, background coloured area to make sure the text
//       // is visually distinct.
//       let textTagTopRight = countText.handleBounds.topRight.add(
//         this.strokeWidth * 4,
//         0
//       )
//       let textTag = new paper.Path.Rectangle(
//         countRect.strokeBounds.topLeft,
//         textTagTopRight
//       )
//       textTag.fillColor = countRect.strokeColor
//       textTag.moveBelow(countText)

//       // Add data to ensure all of these items can only be selected together.
//       countRect.data.selectWith = [textTag, countText]
//       countText.data.selectWith = [countRect, textTag, countText]
//       textTag.data.selectWith = [countText, countRect]
//     }

//     this.toolCount = new paper.Tool()
//     this.toolCount.onMouseDrag = toolDrag
//     this.toolCount.onMouseUp = toolUp
//   },

//   methods: {
//     ...mapActions({
//       prepareCanvas: 'annotation/prepareCanvas'
//     }),

//     initialiseTool () {
//       // Prepare PaperJS canvas for interaction.
//       this.prepareCanvas()

//       // Activate the paperJS tool.
//       this.toolCount.activate()

//       // Set the default strokewidth relative to image size and zoom.
//       this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)

//       // Deselect any current selections to avoid confusion.
//       paper.project.deselectAll()
//     }
//   }
// }
// </script>

// <style lang='css'>
// #tooltip {
//   width: 100%;
// }

// #tool {
//   min-width: 0px;
// }

// #tool-tile {
//   padding: 0px;
// }
//
