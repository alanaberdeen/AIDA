<template lang="html">

  <v-list
    id="toolList"
    class="pointers-please"
    dense
  >

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

    <app-paint
      v-if="(getStepTools().includes('paint'))"
      :active="(activeTool === 'paint')"
      @click.native="activeTool = 'paint'"
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

    <app-megas
      v-if="(getStepTools().includes('megas'))"
      :active="(activeTool === 'megas')"
      @click.native="activeTool = 'megas'"
    />

  </v-list>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

// Import child components
// Simple Tools:
import toolCircle from './simple/Circle.vue'
import toolRectangle from './simple/Rectangle.vue'
import toolPath from './simple/Path.vue'
import toolPencil from './simple/Pencil.vue'
import toolMove from './simple/Move.vue'
import toolPan from './simple/Pan.vue'
import toolNode from './simple/Node.vue'
import toolCount from './simple/Count.vue'
import toolDelete from './simple/Delete.vue'
import toolPaint from './simple/Paint.vue'
import toolGrid from './simple/Grid.vue'

// Assissted Tools:
import toolFaces from './assisted/Faces.vue'
import toolMegas from './assisted/Megakaryocytes'

export default {
  components: {
    'app-circle': toolCircle,
    'app-rectangle': toolRectangle,
    'app-path': toolPath,
    'app-move': toolMove,
    'app-pan': toolPan,
    'app-node': toolNode,
    'app-pencil': toolPencil,
    'app-count': toolCount,
    'app-delete': toolDelete,
    'app-faces': toolFaces,
    'app-megas': toolMegas,
    'app-paint': toolPaint,
    'app-grid': toolGrid
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
      activeStep: state => state.editor.activeStep,
      tools: state => state.editor.tools
    })
  },

  methods: {
    ...mapGetters({
      getStepTools: 'editor/getStepTools'
    }),

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

<style lang='css' scoped>
#toolList {
  background: #eeeeee;
}
</style>
