<template lang="html">
    <div class="pointers-please elevation-2" id="toolsPanel">

        <v-list dense id="toolList">

            <app-pan :active="(this.activeTool === 'pan')"
                     @click.native="activeTool = 'pan'"
                     v-if="(this.getConfigStepTools().includes('pan'))">
            </app-pan>

            <v-divider></v-divider>

            <app-move :active="(this.activeTool === 'move')"
                      @click.native="activeTool = 'move'"
                      v-if="(this.getConfigStepTools().includes('move'))">
            </app-move>

            <app-node :active="(this.activeTool === 'node')"
                      @click.native="activeTool = 'node'"
                      v-if="(this.getConfigStepTools().includes('node'))">
            </app-node>

            <v-divider></v-divider>

            <app-circle :active="(this.activeTool === 'circle')"
                        @click.native="activeTool = 'circle'"
                        v-if="(this.getConfigStepTools().includes('circle'))">
            </app-circle>

            <app-rectangle  :active="(this.activeTool === 'rectangle')"
                            @click.native="activeTool = 'rectangle'"
                            v-if="(this.getConfigStepTools().includes('circle'))">
            </app-rectangle>

            <app-pen  :active="(this.activeTool === 'pen')"
                      @click.native="activeTool = 'pen'"
                      v-if="(this.getConfigStepTools().includes('circle'))">
            </app-pen>

            <app-pencil :active="(this.activeTool === 'pencil')"
                        @click.native="activeTool = 'pencil'"
                        v-if="(this.getConfigStepTools().includes('circle'))">
            </app-pencil>

            <v-divider></v-divider>

            <app-count :active="(this.activeTool === 'count')"
                       @click.native="activeTool = 'count'"
                       v-if="(this.getConfigStepTools().includes('count'))">
            </app-count>

            <v-divider></v-divider>

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

export default {

    data() {
        return {
            activeTool: 'pan'
        }
    },

    computed: {
        ...mapState({
            activeStep: state => state.config.activeStep
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
        'app-count': toolCount
    }
}
</script>

<style lang="css" scoped>

#toolsPanel {
    height: calc(100vh - 48px);
    background: #EEEEEE;
}

#toolList {
    background: #EEEEEE;
}

</style>
