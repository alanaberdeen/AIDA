<template lang="html">
  <v-tooltip right open-delay=700>
    <template v-slot:activator="{ on }">
      <v-btn
        id="reshape"
        v-on="on"
        block
        text
        @click.native="initialiseTool"
      >
        <v-icon small>
          mdi-timeline
        </v-icon>
      </v-btn>
    </template>
    <span> Reshape Tool </span>
  </v-tooltip>
</template>

<script>
import paper from 'paper'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      toolReshape: null,
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
    const modes = {
      SELECT: 'select',
      EDIT: 'edit',
      GROUPEDIT: 'groupedit',
      SCALE: 'scale',
      DRAG: 'drag'
    }

    let item, hitResult
    let mode = modes.SELECT

    const toolDown = event => {
      switch (mode) {
        case modes.SELECT:
          item = null
          var p = event.point
          paper.view.itemsTree.search({
            minX: p.x,
            minY: p.y,
            maxX: p.x,
            maxY: p.y
          }).forEach(treeNode => {
            if (this.matchFilter(treeNode.item)) {
              if (treeNode.item.contains(p) && (item == null || treeNode.item.isAbove(item))) {
                item = treeNode.item
              }
            }
          })
          break
        case modes.EDIT:
          hitResult = item.hitTest(event.point, this.hitOptions)
          if (hitResult) {
            if (hitResult.type === 'bounds') {
              mode = modes.SCALE
            }
          } else {
            item.bounds.selected = false
            item.selected = false
            item = null
            mode = modes.SELECT
          }
          break
        case modes.GROUPEDIT:
          hitResult = item.hitTest(event.point, this.hitOptions)
          if (!hitResult) {
            item.bounds.selected = false
            item.selected = false
            item.remove()
            paper.project.activeLayer.addChildren(item.children)
            item = null
            mode = modes.SELECT
            this.setSelectedItems(paper.project.selectedItems)
          }
          break
      }
    }

    // On mouseDrag functionality
    const toolDrag = event => {
      switch (mode) {
        case modes.SELECT:
          var selectionRect = new paper.Shape.Rectangle(event.downPoint, event.point)
          selectionRect.strokeColor = '#4D88D4'
          selectionRect.fillColor = '#A3C5E8'
          selectionRect.opacity = 0.3
          selectionRect.strokeScaling = false
          selectionRect.strokeWidth = this.strokeWidth

          // Constantly update tracking rect by removing it and re-drawing.
          selectionRect.removeOn({ drag: true, down: true, up: true })

          // Select items inside the selection rectangle.
          paper.project.deselectAll()
          var bounds = selectionRect.bounds
          paper.view.itemsTree.search({
            minX: bounds.x,
            minY: bounds.y,
            maxX: bounds.x + bounds.width,
            maxY: bounds.y + bounds.height
          }).forEach(treeNode => {
            if (treeNode.item.isInside(bounds) && this.matchFilter(treeNode.item)) {
              treeNode.item.selected = true
            }
          })

          break
        case modes.EDIT:
        case modes.DRAG:
          mode = modes.DRAG
          if (hitResult) {
            var edited = false
            if (hitResult.type === 'segment') {
              paper.view.autoUpdate = false
              var p = hitResult.segment.point.clone()
              hitResult.segment.point.set(event.point)
              if (item.closed) {
                if (item.segments[0].point.equals(item.segments[item.segments.length - 1].point)) {
                  item.segments[item.segments.length - 1].remove()
                }
                if (item.intersects(item)) {
                  hitResult.segment.point = p
                } else {
                  edited = true
                }
              }
              paper.view.autoUpdate = true
            } else if (hitResult.type === 'fill') {
              item.translate(event.delta)
              edited = true
            }
          }
          break
        case modes.SCALE:
          var newWidth = item.bounds.width
          var newHeight = item.bounds.height
          var horizScaleFactor = 1
          var vertScaleFactor = 1
          var transfromCenter = null

          // Set tranformation parameters for each scaling option.
          if (hitResult && hitResult.name === 'top-left') {
            newWidth = Math.max(1, item.bounds.topRight.x - event.point.x)
            newHeight = Math.max(1, item.bounds.bottomLeft.y - event.point.y)
            transfromCenter = item.bounds.bottomRight
            horizScaleFactor = newWidth / item.bounds.width
            vertScaleFactor = newHeight / item.bounds.height
            horizScaleFactor = vertScaleFactor = Math.max(horizScaleFactor, vertScaleFactor)
          } else if (hitResult && hitResult.name === 'top-right') {
            newWidth = Math.max(1, event.point.x - item.bounds.topLeft.x)
            newHeight = Math.max(1, item.bounds.bottomRight.y - event.point.y)
            transfromCenter = item.bounds.bottomLeft
            horizScaleFactor = newWidth / item.bounds.width
            vertScaleFactor = newHeight / item.bounds.height
            horizScaleFactor = vertScaleFactor = Math.max(horizScaleFactor, vertScaleFactor)
          } else if (hitResult && hitResult.name === 'bottom-right') {
            newWidth = Math.max(1, event.point.x - item.bounds.bottomLeft.x)
            newHeight = Math.max(1, event.point.y - item.bounds.topRight.y)
            transfromCenter = item.bounds.topLeft
            horizScaleFactor = newWidth / item.bounds.width
            vertScaleFactor = newHeight / item.bounds.height
            horizScaleFactor = vertScaleFactor = Math.max(horizScaleFactor, vertScaleFactor)
          } else if (hitResult && hitResult.name === 'bottom-left') {
            newWidth = Math.max(1, item.bounds.bottomRight.x - event.point.x)
            newHeight = Math.max(1, event.point.y - item.bounds.topLeft.y)
            transfromCenter = item.bounds.topRight
            horizScaleFactor = newWidth / item.bounds.width
            vertScaleFactor = newHeight / item.bounds.height
            horizScaleFactor = vertScaleFactor = Math.max(horizScaleFactor, vertScaleFactor)
          } else if (item.type !== 'circle' && hitResult && hitResult.name === 'top-center') {
            newHeight = Math.max(1, item.bounds.bottomCenter.y - event.point.y)
            transfromCenter = item.bounds.bottomCenter
            vertScaleFactor = newHeight / item.bounds.height
          } else if (item.type !== 'circle' && hitResult && hitResult.name === 'bottom-center') {
            newHeight = Math.max(1, event.point.y - item.bounds.topCenter.y)
            transfromCenter = item.bounds.topCenter
            vertScaleFactor = newHeight / item.bounds.height
          } else if (item.type !== 'circle' && hitResult && hitResult.name === 'left-center') {
            newWidth = Math.max(1, item.bounds.rightCenter.x - event.point.x)
            transfromCenter = item.bounds.rightCenter
            horizScaleFactor = newWidth / item.bounds.width
          } else if (item.type !== 'circle' && hitResult && hitResult.name === 'right-center') {
            newWidth = Math.max(1, event.point.x - item.bounds.leftCenter.x)
            transfromCenter = item.bounds.leftCenter
            horizScaleFactor = newWidth / item.bounds.width
          }
          item.scale(horizScaleFactor, vertScaleFactor, transfromCenter)
          edited = true
          break
      }
      if (edited) {
        paper.view.itemsTree.remove(item)
        const bounds = item.bounds
        const treeNode = {
          minX: bounds.x,
          minY: bounds.y,
          maxX: bounds.x + bounds.width,
          maxY: bounds.y + bounds.height,
          item: item
        }
        paper.view.itemsTree.insert(treeNode)
      }
    }

    const toolUp = event => {
      switch (mode) {
        case modes.SELECT:
          if (paper.project.selectedItems.length === 1) {
            item = paper.project.selectedItems[0]
            item.bounds.selected = true
            item.bringToFront()
            mode = modes.EDIT
          } else if (paper.project.selectedItems.length > 1) {
            item = new paper.Group(paper.project.selectedItems)
            item.bounds.selected = true
            mode = modes.GROUPEDIT
          }
          this.setSelectedItems(paper.project.selectedItems)
          break
        case modes.EDIT:
          if (hitResult) {
            var edited = false
            if (event.modifiers.shift) {
              if (hitResult.type === 'segment') {
                hitResult.segment.remove()
                if (item.hasHandles()) {
                  item.smooth()
                }
                edited = true
              }
            } else if (hitResult.type === 'stroke' && hitResult.location) {
              item.insert(hitResult.location.index + 1, event.point)
              if (item.hasHandles()) {
                item.smooth()
              }
              edited = true
            }
            if (edited) {
              paper.view.itemsTree.remove(item)
              const bounds = item.bounds
              const treeNode = {
                minX: bounds.x,
                minY: bounds.y,
                maxX: bounds.x + bounds.width,
                maxY: bounds.y + bounds.height,
                item: item
              }
              paper.view.itemsTree.insert(treeNode)
            }
          }
          break
        case modes.SCALE:
          mode = modes.EDIT
          break
        case modes.DRAG:
          mode = modes.EDIT
          break
      }
      hitResult = null
    }

    const toolMove = event => {
      switch (mode) {
        case modes.SELECT:
          paper.project.deselectAll()
          var selectedItem = null
          var p = event.point
          paper.view.itemsTree.search({
            minX: p.x,
            minY: p.y,
            maxX: p.x,
            maxY: p.y
          }).forEach(treeNode => {
            if (this.matchFilter(treeNode.item)) {
              if (treeNode.item.contains(p) && (selectedItem == null || treeNode.item.isAbove(selectedItem))) {
                selectedItem = treeNode.item
              }
            }
          })
          if (selectedItem) {
            selectedItem.selected = true
          }
          break
        case modes.EDIT:
          var hitResult = item.hitTest(event.point, this.hitOptions)
          if (!hitResult) {
            paper.view.element.style.cursor = 'auto'
          } else if (hitResult.name === 'bottom-right' || hitResult.name === 'top-left') {
            paper.view.element.style.cursor = 'nwse-resize'
          } else if (hitResult.name === 'bottom-left' || hitResult.name === 'top-right') {
            paper.view.element.style.cursor = 'nesw-resize'
          } else if ((item.type !== 'circle') && (hitResult.name === 'bottom-center' || hitResult.name === 'top-center')) {
            paper.view.element.style.cursor = 'ns-resize'
          } else if ((item.type !== 'circle') && (hitResult.name === 'left-center' || hitResult.name === 'right-center')) {
            paper.view.element.style.cursor = 'ew-resize'
          } else {
            paper.view.element.style.cursor = 'auto'
          }
          break
      }
    }

    const keyDown = event => {
      if (event.key === 'delete') {
        if (mode === modes.EDIT || mode === modes.GROUPEDIT) {
          if (item.children) {
            item.children.forEach(item => { paper.view.itemsTree.remove(item) })
          }
          paper.view.itemsTree.remove(item)
          item.remove()
          item = null
          this.setSelectedItems(paper.project.selectedItems)
          paper.view.element.style.cursor = 'auto'
          mode = modes.SELECT
        }
      }
    }

    this.toolReshape = new paper.Tool()
    this.toolReshape.onMouseDown = toolDown
    this.toolReshape.onMouseUp = toolUp
    this.toolReshape.onMouseMove = toolMove
    this.toolReshape.onMouseDrag = toolDrag
    this.toolReshape.onKeyDown = keyDown
  },

  methods: {
    ...mapActions({
      prepareCanvas: 'annotation/prepareCanvas',
      setSelectedItems: 'annotation/setSelectedItems',
      flagAnnotationEdits: 'annotation/flagAnnotationEdits'
    }),

    initialiseTool () {
      // Prepare PaperJS canvas for interaction.
      this.prepareCanvas()

      // Activate the paperJS tool.
      this.toolReshape.activate()

      // Selection options
      const hitTolerance = this.imageWidth / (this.viewportZoom * 300)
      this.hitOptions = {
        segments: true,
        stroke: true,
        bounds: true,
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
