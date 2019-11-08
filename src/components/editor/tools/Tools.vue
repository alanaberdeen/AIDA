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
    <v-list dense>

      <app-pan
        v-if="(getStepTools().includes('pan'))"
        :active="(activeTool === 'pan')"
        @click.native="activeTool = 'pan'"
      />

      <v-divider></v-divider>

      <app-move
        v-if="(getStepTools().includes('move'))"
        :active="(activeTool === 'move')"
        @click.native="activeTool = 'move'"
      />

      <app-node
        v-if="(getStepTools().includes('node'))"
        :active="(activeTool === 'node')"
        @click.native="activeTool = 'node'"
      />

      <v-divider/>

      <app-circle
        v-if="(getStepTools().includes('circle'))"
        :active="(activeTool === 'circle')"
        @click.native="activeTool = 'circle'"
      />

      <app-rectangle
        v-if="(getStepTools().includes('rectangle'))"
        :active="(activeTool === 'rectangle')"
        @click.native="activeTool = 'rectangle'"
      />

      <app-path
        v-if="(getStepTools().includes('path'))"
        :active="(activeTool === 'path')"
        @click.native="activeTool = 'path'"
      />

      <app-pencil
        v-if="(getStepTools().includes('pencil'))"
        :active="(activeTool === 'pencil')"
        @click.native="activeTool = 'pencil'"
      />

      <app-polygon
        v-if="(getStepTools().includes('polygon'))"
        :active="(activeTool === 'polygon')"
        @click.native="activeTool = 'polygon'"
      />

      <app-paint
        v-if="(getStepTools().includes('paint'))"
        :active="(activeTool === 'paint')"
        @click.native="activeTool = 'paint'"
      />

      <app-paste
        v-if="(getStepTools().includes('paste'))"
        :active="(activeTool === 'paste')"
        @click.native="activeTool = 'paste'"
      />

      <app-grid
        v-if="(getStepTools().includes('grid'))"
        :active="(activeTool === 'grid')"
        @click.native="activeTool = 'grid'"
      />

      <v-divider/>

      <app-delete
        v-if="(getStepTools().includes('delete'))"
        :active="(activeTool === 'delete')"
        @click.native="activeTool = 'delete'"
      />

      <v-divider/>

      <app-faces
        v-if="(getStepTools().includes('faces'))"
        :active="(activeTool === 'faces')"
        @click.native="activeTool = 'faces'"
      />

      <app-filter
        v-if="(getStepTools().includes('filter'))"
        :active="(activeTool === 'filter')"
        @click.native="activeTool = 'filter'"
      />

      <app-edit
        v-if="(getStepTools().includes('edit'))"
        :active="(activeTool === 'edit')"
        @click.native="activeTool = 'edit'"
      />

      <app-ruler
        v-if="(getStepTools().includes('ruler'))"
        :active="(activeTool === 'ruler')"
        @click.native="activeTool = 'ruler'"
      />

    </v-list>
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

// Assisted Tools:
import toolFilter from './assisted/Filter.vue'

// Intelligent Tools:
import toolFaces from './intelligent/Faces.vue'

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
    'app-faces': toolFaces,
    'app-paint': toolPaint,
    'app-grid': toolGrid,
    'app-filter': toolFilter,
    'app-polygon': toolPolygon,
    'app-paste': toolPaste,
    'app-edit': toolEdit,
    'app-ruler': toolRuler
  },

  data () {
    return {
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
