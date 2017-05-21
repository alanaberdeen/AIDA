<template lang="html">
    <div class="pointers-please tools-container">
        <v-card class="tools-panel">
            <v-toolbar>
                <v-toolbar-title>Tools</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-list>
                <v-list-item>
                    <app-circle :paperScope="paperScope"></app-circle>
                    <v-divider></v-divider>
                    <app-rectangle :paperScope="paperScope"></app-rectangle>
                    <v-divider></v-divider>
                    <app-pencil :paperScope="paperScope"></app-pencil>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

// Import child components
import Circle from './Tools/Circle.vue'
import Rectangle from './Tools/Rectangle.vue'
import Pencil from './Tools/Pencil.vue'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolCircle: null,
            toolRect: null
        }
    },

    components: {
        'app-circle': Circle,
        'app-rectangle': Rectangle,
        'app-pencil': Pencil
    },

    methods: {
    }
}
</script>

<style lang="css">

.tools-container{
    margin-top: 24px;
    margin-left: 10px;
}

</style>
