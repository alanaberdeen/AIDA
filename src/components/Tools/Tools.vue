<template lang="html">
    <div class="pointers-please left-side-bar elevation-2">
            <v-list>
                <v-list-tile id='pan-toggle'>

                    <app-pan :paperScope="paperScope"
                             :osdViewer="osdViewer"
                             :active="(this.activeTool === 'pan')"
                             @click.native="activeTool = 'pan'"
                             v-if='config.steps[config.activeStep].tools.pan'>
                    </app-pan>

                </v-list-tile>

                <v-list-tile id='annotation-tools'>
                    <v-list>

                        <v-list-tile>
                            <app-circle :paperScope="paperScope"
                                        :active="(this.activeTool === 'circle')"
                                        :osdViewer="osdViewer"
                                        @click.native="activeTool = 'circle'"
                                        v-if='config.steps[config.activeStep].tools.circle'>
                            </app-circle>
                        </v-list-tile>

                        <v-list-tile>
                            <app-rectangle  :paperScope="paperScope"
                                            :active="(this.activeTool === 'rectangle')"
                                            :osdViewer="osdViewer"
                                            @click.native="activeTool = 'rectangle'"
                                            v-if='config.steps[config.activeStep].tools.rectangle'>
                            </app-rectangle>
                        </v-list-tile>

                        <v-list-tile>
                            <app-pen    :paperScope="paperScope"
                                        :osdViewer="osdViewer"
                                        :active="(this.activeTool === 'pen')"
                                        @click.native="activeTool = 'pen'"
                                        v-if='config.steps[config.activeStep].tools.pen'>
                            </app-pen>
                        </v-list-tile>

                        <v-list-tile>
                            <app-pencil :paperScope="paperScope"
                                      :osdViewer="osdViewer"
                                      :active="(this.activeTool === 'pencil')"
                                      @click.native="activeTool = 'pencil'"
                                      v-if='config.steps[config.activeStep].tools.pencil'>
                            </app-pencil>
                        </v-list-tile>

                        <v-list-tile>
                            <app-move :paperScope="paperScope"
                                      :osdViewer="osdViewer"
                                      :active="(this.activeTool === 'move')"
                                      @click.native="activeTool = 'move'"
                                      v-if='config.steps[config.activeStep].tools.move'>
                            </app-move>
                        </v-list-tile>

                        <v-list-tile>
                            <app-node :paperScope="paperScope"
                                      :osdViewer="osdViewer"
                                      :active="(this.activeTool === 'node')"
                                      @click.native="activeTool = 'node'"
                                      v-if='config.steps[config.activeStep].tools.node'>
                            </app-node>
                        </v-list-tile>

                    </v-list>
                </v-list-tile>
            </v-list>
    </div>
</template>

<script>
import paper from 'paper'

// Import child components
import toolCircle from './Circle.vue'
import toolRectangle from './Rectangle.vue'
import toolPen from './Pen.vue'
import toolPencil from './Pencil.vue'
import toolMove from './Move.vue'
import toolPan from './Pan.vue'
import toolNode from './Node.vue'

export default {
    props: ['paperScope', 'osdViewer', 'config'],

    data() {
        return{
            activeTool: 'pan'
        }
    },

    components: {
        'app-circle': toolCircle,
        'app-rectangle': toolRectangle,
        'app-pen': toolPen,
        'app-move': toolMove,
        'app-pan': toolPan,
        'app-node': toolNode,
        'app-pencil': toolPencil
    }
}
</script>

<style lang="css">

.left-side-bar{
    margin-top: 0px;
    width: 100%;
    height: 93vh;
    background-color: #EEEEEE;
}

.tool {
    min-width: 20px;
    margin: 1px 0px 1px 0px;
    background-color: #EEEEEE;
}

#pan-toggle{
    margin: 20px 0px 20px 0px;
}

</style>
