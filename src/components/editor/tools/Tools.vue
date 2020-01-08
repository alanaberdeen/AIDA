<template lang="html">
  <v-navigation-drawer
    fixed
    clipped
    app
    @input="updateToolsDrawerState"
    :value="this.toolsDrawer"
    mini-variant
    mini-variant-width="52"
    mobile-break-point="800"
    class='mt-12'
    v-if="['loading'].indexOf($route.name) === -1"
  >
    <v-btn-toggle
      v-model="toggle_exclusive"
      mandatory
      borderless
      group
      color="primary"
    >

      <app-pan v-if="(getStepTools().includes('pan'))" />

      <v-divider class="ma-1"/>

      <app-reshape v-if="(getStepTools().includes('reshape'))" />
      <app-move v-if="(getStepTools().includes('move'))" />
      <app-node v-if="(getStepTools().includes('node'))" />

      <v-divider class="ma-1"/>

      <app-circle v-if="(getStepTools().includes('circle'))" />
      <app-rectangle v-if="(getStepTools().includes('rectangle'))" />
      <app-path v-if="(getStepTools().includes('path'))" />
      <app-pencil v-if="(getStepTools().includes('pencil'))" />
      <app-polygon v-if="(getStepTools().includes('polygon'))" />
      <app-paint v-if="(getStepTools().includes('paint'))" />
      <app-paste v-if="(getStepTools().includes('paste'))" />

      <v-divider class="ma-1"/>

      <app-delete v-if="(getStepTools().includes('delete'))" />

      <v-divider class="ma-1"/>

      <app-grid v-if="(getStepTools().includes('grid'))" />
      <app-filter v-if="(getStepTools().includes('filter'))" />
      <app-edit v-if="(getStepTools().includes('edit'))" />
      <app-ruler v-if="(getStepTools().includes('ruler'))" />

    </v-btn-toggle>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

// Simple Tools:
import toolCircle from './simple/Circle.vue'
import toolRectangle from './simple/Rectangle.vue'
import toolPath from './simple/Path.vue'
import toolPencil from './simple/Pencil.vue'
import toolMove from './simple/Move.vue'
import toolPan from './simple/Pan.vue'
import toolNode from './simple/Node.vue'
import toolDelete from './simple/Delete.vue'
import toolPaint from './simple/Paint.vue'
import toolGrid from './simple/Grid.vue'
import toolPolygon from './simple/Polygon.vue'
import toolPaste from './simple/Paste.vue'
import toolEdit from './simple/Edit.vue'
import toolRuler from './simple/Ruler.vue'
import toolReshape from './simple/Reshape.vue'

// Assisted Tools:
import toolFilter from './assisted/Filter.vue'

export default {
  components: {
    'app-circle': toolCircle,
    'app-rectangle': toolRectangle,
    'app-path': toolPath,
    'app-move': toolMove,
    'app-pan': toolPan,
    'app-node': toolNode,
    'app-pencil': toolPencil,
    'app-delete': toolDelete,
    'app-paint': toolPaint,
    'app-grid': toolGrid,
    'app-filter': toolFilter,
    'app-polygon': toolPolygon,
    'app-paste': toolPaste,
    'app-edit': toolEdit,
    'app-ruler': toolRuler,
    'app-reshape': toolReshape
  },

  data () {
    return {
      toggle_exclusive: undefined,
      activeTool: 'pan'
    }
  },

  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },

  computed: {
    ...mapState({
      toolsDrawer: state => state.app.toolsDrawer,
      activeStep: state => state.app.activeStep,
      tools: state => state.app.tools
    })
  },

  methods: {
    ...mapGetters({
      getStepTools: 'app/getStepTools'
    }),

    ...mapActions({
      setToolsDrawerState: 'app/setToolsDrawerState'
    }),

    updateToolsDrawerState (state) {
      if (!state) {
        this.setToolsDrawerState(state)
      }
    },

    // Attach event listeners for the keyboard shortcuts
    keyDown (e) {
      switch (e.keyCode) {
        case 32:
          document.getElementById('pan').click()
          break
        case 86:
          document.getElementById('move').click()
          break
        case 65:
          document.getElementById('node').click()
          break
        case 67:
          document.getElementById('circle').click()
          break
        case 82:
          document.getElementById('rectangle').click()
          break
        case 80:
          document.getElementById('path').click()
          break
        case 77:
          document.getElementById('pencil').click()
          break
      }
    }
  }
}
</script>

<style lang="css">
.v-btn-toggle {
  flex-direction: column
}
</style>
