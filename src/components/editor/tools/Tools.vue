<template lang="html">
  <div
    id="toolsPanel"
    class="pointers-please elevation-2"
  >

    <v-list
      id="toolList"
      dense
    >

      <app-pan
        v-if="(getStepTools().includes('pan'))"
        :active="(activeTool === 'pan')"
        @click.native="activeTool = 'pan'"
      />

      <v-divider/>

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

      <app-pen
        v-if="(getStepTools().includes('pen'))"
        :active="(activeTool === 'pen')"
        @click.native="activeTool = 'pen'"
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

      <!-- The count tool needs re-thinking, removing for now -->
      <!-- <v-divider/>

      <app-count
        v-if="(getStepTools().includes('count'))"
        :active="(activeTool === 'count')"
        @click.native="activeTool = 'count'"
      /> -->

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

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// Import child components

// Simple Tools:
import toolCircle from './simple/Circle.vue'
import toolRectangle from './simple/Rectangle.vue'
import toolPen from './simple/Pen.vue'
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
    'app-pen': toolPen,
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

  computed: {
    ...mapState({
      activeStep: state => state.editor.activeStep,
      tools: state => state.editor.tools
    })
  },

  methods: {
    ...mapGetters(['getStepTools'])
  }
}
</script>
<style lang='css' scoped>
#toolsPanel {
  height: calc(100vh - 48px);
  background: #eeeeee;
}

#toolList {
  background: #eeeeee;
}
</style>
