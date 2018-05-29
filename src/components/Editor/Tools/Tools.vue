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
        v-if="(getConfigStepTools().includes('pan'))"
        :active="(activeTool === 'pan')"
        @click.native="activeTool = 'pan'"
      />

      <v-divider/>

      <app-move
        v-if="(getConfigStepTools().includes('move'))"
        :active="(activeTool === 'move')"
        @click.native="activeTool = 'move'"
      />

      <app-node
        v-if="(getConfigStepTools().includes('node'))"
        :active="(activeTool === 'node')"
        @click.native="activeTool = 'node'"
      />

      <v-divider/>

      <app-circle
        v-if="(getConfigStepTools().includes('circle'))"
        :active="(activeTool === 'circle')"
        @click.native="activeTool = 'circle'"
      />

      <app-rectangle
        v-if="(getConfigStepTools().includes('rectangle'))"
        :active="(activeTool === 'rectangle')"
        @click.native="activeTool = 'rectangle'"
      />

      <app-pen
        v-if="(getConfigStepTools().includes('pen'))"
        :active="(activeTool === 'pen')"
        @click.native="activeTool = 'pen'"
      />

      <app-pencil
        v-if="(getConfigStepTools().includes('pencil'))"
        :active="(activeTool === 'pencil')"
        @click.native="activeTool = 'pencil'"
      />

      <v-divider/>

      <app-count
        v-if="(getConfigStepTools().includes('count'))"
        :active="(activeTool === 'count')"
        @click.native="activeTool = 'count'"
      />

      <v-divider/>

      <app-delete
        v-if="(getConfigStepTools().includes('delete'))"
        :active="(activeTool === 'delete')"
        @click.native="activeTool = 'delete'"
      />

    </v-list>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// Import child components
import toolCircle from './simple/Circle.vue'
import toolRectangle from './simple/Rectangle.vue'
import toolPen from './simple/Pen.vue'
import toolPencil from './simple/Pencil.vue'
import toolMove from './simple/Move.vue'
import toolPan from './simple/Pan.vue'
import toolNode from './simple/Node.vue'
import toolCount from './simple/Count.vue'
import toolDelete from './simple/Delete.vue'

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
    'app-delete': toolDelete
  },

  data () {
    return {
      activeTool: 'pan'
    }
  },

  computed: {
    ...mapState({
      activeStep: state => state.config.activeStep,
      tools: state => state.config.tools
    })
  },

  methods: {
    ...mapGetters(['getConfigStepTools'])
  }
}
</script>

<!-- //TODO: Manage tooltip delay in but no delay out. Also if tooltip already
  displayed then shouldn't have further delay on moving to a different
  tool.  -->
<style lang='css' scoped>
#toolsPanel {
  height: calc(100vh - 48px);
  background: #eeeeee;
}

#toolList {
  background: #eeeeee;
}
</style>
