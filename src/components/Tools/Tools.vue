<template lang="html">
    <div class="pointers-please tools-container elevation-2">
        <v-card class="tools-panel">
            <v-toolbar>
                <v-toolbar-title>Tools</v-toolbar-title>
            </v-toolbar>
            <v-list>
                <v-list-item>
                    <app-circle :paperScope="paperScope"></app-circle>
                    <v-divider></v-divider>
                    <app-rectangle :paperScope="paperScope"></app-rectangle>
                    <v-divider></v-divider>
                    <app-pencil :paperScope="paperScope"></app-pencil>
                    <v-divider></v-divider>
                    <app-move :paperScope="paperScope"
                              :osdViewer="osdViewer"></app-move>
                    <v-divider></v-divider>
                    <app-pan :paperScope="paperScope"
                             :osdViewer="osdViewer">
                    </app-pan>
                    <v-divider></v-divider>
                    <app-node :paperScope="paperScope"
                             :osdViewer="osdViewer">
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
import toolPencil from './Pencil.vue'
import toolMove from './Move.vue'
import toolPan from './Pan.vue'
import toolNode from './Node.vue'

export default {
    props: ['paperScope', 'osdViewer'],

    components: {
        'app-circle': toolCircle,
        'app-rectangle': toolRectangle,
        'app-pencil': toolPencil,
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
