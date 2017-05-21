<template>
        <v-app top-toolbar z-index=5 pointer-events='none'>
            <header>
                <v-toolbar>
                    <v-toolbar-logo>Annotate</v-toolbar-logo>
                    <v-toolbar-items>
                        <v-toolbar-item>

                        </v-toolbar-item>
                    </v-toolbar-items>
                </v-toolbar>
            </header>

            <v-container fluid>
                <v-row>
                    <v-col xs3>
                            <app-image-loader :paperScope="paperScope"></app-image-loader>
                            <app-tools :paperScope="paperScope"></app-tools>
                            <app-layers :paperScope="paperScope"></app-layers>
                    </v-col>
                    <v-col xs3 offset-xs9>
                    </v-col>
                </v-row>
            </v-container>

        </v-app>
</template>

<script>
// Import paperJS library
import paper from 'paper'

// Import child components
import Tools from './components/Tools.vue'
import Layers from './components/Layers.vue'
import Test from './components/Test.vue'
import Canvas from './components/Canvas.vue'
import ImageLoader from './components/ImageLoader.vue'

export default {
    data() {
        return {
            paperScope: null
        }
    },

    // The "created" function runs when the page loads
    created() {
        // Create and store the Paper instance in a Vue variable (this.paper)
        this.paperScope = paper.setup(document.getElementById('view'))

        // Add a first layer to the project
        paper.project.addLayer(new paper.Layer({
            name: 'Layer 1',
        }))



    },

    components: {
        'app-tools': Tools,
        'app-layers': Layers,
        'app-test': Test,
        'app-canvas': Canvas,
        'app-image-loader': ImageLoader
    }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>
