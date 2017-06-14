<template lang="html">
    <div class="pointers-please tools-container elevation-2">
        <v-card class="tools-panel">
            <v-toolbar primary dark>
                <v-toolbar-title class='white--text'>Tools</v-toolbar-title>
            </v-toolbar>
            <v-list>
                <v-list-item>
                    <app-circle :paperScope.sync="paperScope"
                                v-if='config.tools.circle.include'>
                    </app-circle>
                    <v-divider></v-divider>
                    <app-rectangle  :paperScope.sync="paperScope"
                                    v-if='config.tools.rectangle.include'>
                    </app-rectangle>
                    <v-divider></v-divider>
                    <app-path :paperScope="paperScope"
                              v-if='config.tools.path.include'>
                    </app-path>
                    <v-divider></v-divider>
                    <app-move :paperScope="paperScope"
                              :osdViewer="osdViewer"
                              v-if='config.tools.move.include'>
                    </app-move>
                    <v-divider></v-divider>
                    <app-pan :paperScope="paperScope"
                             :osdViewer="osdViewer"
                             v-if='config.tools.pan.include'>
                    </app-pan>
                    <v-divider></v-divider>
                    <app-node :paperScope="paperScope"
                              :osdViewer="osdViewer"
                              v-if='config.tools.node.include'>
                    </app-node>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
//TODO: make it so that the active tool has a 'depressed' visual on the button
import paper from 'paper'

// Import child components
import toolCircle from './Circle.vue'
import toolRectangle from './Rectangle.vue'
import toolPath from './Pencil.vue'
import toolMove from './Move.vue'
import toolPan from './Pan.vue'
import toolNode from './Node.vue'

export default {
    props: ['paperScope', 'osdViewer', 'config'],

    components: {
        'app-circle': toolCircle,
        'app-rectangle': toolRectangle,
        'app-path': toolPath,
        'app-move': toolMove,
        'app-pan': toolPan,
        'app-node': toolNode
    }
}
</script>

<style lang="css">

.tools-container{
    margin-top: 20px;
    margin-left: 10px;
}

</style>
