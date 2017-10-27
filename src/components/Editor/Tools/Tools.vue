<template lang="html">
    <div class="pointers-please elevation-2" id="toolsPanel">

        <v-list dense id="toolList">

            <app-pan :active="(this.activeTool === 'pan')"
                     @click.native="activeTool = 'pan'"
                     v-if="(this.getConfigStepTools().includes('pan'))"
                     v-tooltip:right="{ html: this.tools.pan.caption }">
            </app-pan>

            <v-divider></v-divider>

            <app-move :active="(this.activeTool === 'move')"
                      @click.native="activeTool = 'move'"
                      v-if="(this.getConfigStepTools().includes('move'))"
                      v-tooltip:right="{ html: this.tools.move.caption }">
            </app-move>

            <app-node :active="(this.activeTool === 'node')"
                      @click.native="activeTool = 'node'"
                      v-if="(this.getConfigStepTools().includes('node'))"
                      v-tooltip:right="{ html: this.tools.node.caption }">
            </app-node>

            <v-divider></v-divider>

            <app-circle :active="(this.activeTool === 'circle')"
                        @click.native="activeTool = 'circle'"
                        v-if="(this.getConfigStepTools().includes('circle'))"
                        v-tooltip:right="{ html: this.tools.circle.caption }">
            </app-circle>

            <app-rectangle  :active="(this.activeTool === 'rectangle')"
                            @click.native="activeTool = 'rectangle'"
                            v-if="(this.getConfigStepTools().includes('rectangle'))"
                            v-tooltip:right="{ html: this.tools.rectangle.caption }">
            </app-rectangle>

            <app-pen  :active="(this.activeTool === 'pen')"
                      @click.native="activeTool = 'pen'"
                      v-if="(this.getConfigStepTools().includes('pen'))"
                      v-tooltip:right="{ html: this.tools.pen.caption }">
            </app-pen>

            <app-pencil :active="(this.activeTool === 'pencil')"
                        @click.native="activeTool = 'pencil'"
                        v-if="(this.getConfigStepTools().includes('pencil'))"
                        v-tooltip:right="{ html: this.tools.pencil.caption }">
            </app-pencil>

            <v-divider></v-divider>

            <app-count :active="(this.activeTool === 'count')"
                       @click.native="activeTool = 'count'"
                       v-if="(this.getConfigStepTools().includes('count'))"
                       v-tooltip:right="{ html: this.tools.count.caption }">
            </app-count>

            <v-divider></v-divider>

            <app-delete :active="(this.activeTool === 'delete')"
                        @click.native="activeTool = 'delete'"
                        v-if="(this.getConfigStepTools().includes('delete'))"
                        v-tooltip:right="{ html: this.tools.count.caption }">
            </app-delete>

        </v-list>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';

// Import child components
import toolCircle from './Circle.vue';
import toolRectangle from './Rectangle.vue';
import toolPen from './Pen.vue';
import toolPencil from './Pencil.vue';
import toolMove from './Move.vue';
import toolPan from './Pan.vue';
import toolNode from './Node.vue';
import toolCount from './Count.vue';
import toolDelete from './Delete.vue';

export default {

    data() {
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
        ...mapGetters([
            'getConfigStepTools',
        ])
    },

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
    }
}
</script>

<!-- //TODO: Manage tooltip delay in but no delay out. Also if tooltip already
             displayed then shouldn't have further delay on moving to a different
             tool.  -->

<style lang="css" scoped>

#toolsPanel {
    height: calc(100vh - 48px);
    background: #EEEEEE;
}

#toolList {
    background: #EEEEEE;
}

[data-tooltip]:before {
    transition-delay: 800ms;
}
</style>
