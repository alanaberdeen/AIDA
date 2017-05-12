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

        // Plot a circle at click place tool
        function plotCirlce(event) {
            var centerX = Math.round(event.point.x)
            var centerY = Math.round(event.point.y)
            var myCircle = new paper.Path.Circle(new paper.Point(centerX, centerY), 10)
            myCircle.fillColor = 'black'
        }

        var tool = new paper.Tool();
        tool.onMouseDown = plotCirlce
        tool.activate();

    },

    components: {
        'app-tools': Tools,
        'app-layers': Layers,
        'app-test': Test,
        'app-canvas': Canvas
    }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>
