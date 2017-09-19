<template lang="html">
    <div class="pointers-please toolsPanel elevation-2">

        <v-list dense id="toolList">

            <v-list-tile>
                <app-pan :active="(this.activeTool === 'pan')"
                         @click.native="activeTool = 'pan'"
                         v-if="(this.getStepTools().includes('pan'))">
                </app-pan>
            </v-list-tile>

            <v-list-tile>
                <app-circle :active="(this.activeTool === 'circle')"
                            @click.native="activeTool = 'circle'"
                            v-if="(this.getStepTools().includes('circle'))">
                </app-circle>
            </v-list-tile>

            <v-list-tile>
                <app-rectangle  :active="(this.activeTool === 'rectangle')"
                                @click.native="activeTool = 'rectangle'"
                                v-if="(this.getStepTools().includes('circle'))">
                </app-rectangle>
            </v-list-tile>

            <v-list-tile>
                <app-pen  :active="(this.activeTool === 'pen')"
                          @click.native="activeTool = 'pen'"
                          v-if="(this.getStepTools().includes('circle'))">
                </app-pen>
            </v-list-tile>

            <v-list-tile>
                <app-pencil :active="(this.activeTool === 'pencil')"
                            @click.native="activeTool = 'pencil'"
                            v-if="(this.getStepTools().includes('circle'))">
                </app-pencil>
            </v-list-tile>

            <v-list-tile>
                <app-move :active="(this.activeTool === 'move')"
                          @click.native="activeTool = 'move'"
                          v-if="(this.getStepTools().includes('move'))">
                </app-move>
            </v-list-tile>

            <v-list-tile>
                <app-node :active="(this.activeTool === 'node')"
                          @click.native="activeTool = 'node'"
                          v-if="(this.getStepTools().includes('node'))">
                </app-node>
            </v-list-tile>

            <v-list-tile>
                <app-count :active="(this.activeTool === 'count')"
                           @click.native="activeTool = 'count'"
                           v-if="(this.getStepTools().includes('count'))">
                </app-count>
            </v-list-tile> 

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
            'getStepTools',
            'getActiveStep'
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

<style lang="css">

.list__tile {
    padding: 0px;
}

.btn {
    min-width: 0px;
}

.toolsPanel {
    height: calc(100vh - 48px);
    background: #EEEEEE;
}

#toolList {
    background: #EEEEEE;
}

</style>
