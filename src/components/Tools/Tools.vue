<template lang="html">
    <div class="pointers-please left-side-bar elevation-2">
            <v-list>
                <v-list-item id='pan-toggle'>

                    <app-pan :paperScope="paperScope"
                             :osdViewer="osdViewer"
                             :active="(this.activeTool === 'pan')"
                             @click.native="activeTool = 'pan'"
                             v-if='config.tools.pan.include'>
                    </app-pan>

                </v-list-item>

                <v-list-item id='annotation-tools'>
                    <v-list>

                        <app-circle :paperScope="paperScope"
                                    :active="(this.activeTool === 'circle')"
                                    @click.native="activeTool = 'circle'"
                                    v-if='config.tools.circle.include'>
                        </app-circle>

                        <app-rectangle  :paperScope="paperScope"
                                        :active="(this.activeTool === 'rectangle')"
                                        @click.native="activeTool = 'rectangle'"
                                        v-if='config.tools.rectangle.include'>
                        </app-rectangle>

                        <app-pen    :paperScope="paperScope"
                                    :osdViewer="osdViewer"
                                    :active="(this.activeTool === 'pen')"
                                    @click.native="activeTool = 'pen'"
                                    v-if='config.tools.path.include'>
                        </app-pen>

                        <app-move :paperScope="paperScope"
                                  :osdViewer="osdViewer"
                                  :active="(this.activeTool === 'move')"
                                  @click.native="activeTool = 'move'"
                                  v-if='config.tools.move.include'>
                        </app-move>

                        <app-node :paperScope="paperScope"
                                  :osdViewer="osdViewer"
                                  :active="(this.activeTool === 'node')"
                                  @click.native="activeTool = 'node'"
                                  v-if='config.tools.node.include'>
                        </app-node>

                    </v-list>
                </v-list-item>
            </v-list>
    </div>
</template>

<script>
import paper from 'paper'

// Import child components
import toolCircle from './Circle.vue'
import toolRectangle from './Rectangle.vue'
import toolPen from './Pen.vue'
import toolMove from './Move.vue'
import toolPan from './Pan.vue'
import toolNode from './Node.vue'

export default {
    props: ['paperScope', 'osdViewer', 'config'],

    data() {
        return{
            activeTool: ''
        }
    },

    components: {
        'app-circle': toolCircle,
        'app-rectangle': toolRectangle,
        'app-pen': toolPen,
        'app-move': toolMove,
        'app-pan': toolPan,
        'app-node': toolNode
    }
}
</script>

<style lang="css">

.left-side-bar{
    margin-top: 0px;
    width: 100%;
    height: 100vh;
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
