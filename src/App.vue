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
                        <app-tools  :paperScope="paperScope"
                                    :osdViewer="osdViewer">
                        </app-tools>
                        <app-layers :paperScope="paperScope"></app-layers>
                    </v-col>
                    <v-col xs3 offset-xs9>
                    </v-col>
                </v-row>
            </v-container>

        </v-app>
</template>

<script>
// Import JS libraries
import paper from 'paper'
import openseadragon from 'openseadragon'

// Import child components
import Tools from './components/Tools.vue'
import Layers from './components/Layers.vue'
import Test from './components/Test.vue'
import ImageLoader from './components/ImageLoader.vue'
import ControlToggle from './components/ControlToggle.vue'

export default {
    data() {
        return {
            paperScope: null,
            osdViewer: null
        }
    },

    // The "created" function runs when the page loads
    created() {
        var vm = this;

        // Create the OpenSeadragon instance viewer.
        // Save it to the VueModel
        this.osdViewer = OpenSeadragon({
            id: "openseadragon2",
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: "https://openseadragon.github.io/example-images/duomo/duomo.dzi",
        });

        // Create the PaperJS instance.
        // Save it to the VueModel
        this.paperScope = paper.setup(document.getElementById('paper-canvas'))

        // Add a handler fucntion that will run when osd-viewport is updated.
        // This will synchronously update the paperJS viewport.
        this.osdViewer.addHandler('update-viewport', function() {
            var viewportZoom = vm.osdViewer.viewport.getZoom(true);
            var image1 = vm.osdViewer.world.getItemAt(0);
            vm.paperScope.view.zoom = image1.viewportToImageZoom(viewportZoom);
            var center = vm.osdViewer.viewport.viewportToImageCoordinates(vm.osdViewer.viewport.getCenter(true));
            vm.paperScope.view.center = new paper.Point(center.x, center.y);
        });

        // Add a first layer to the project
        paper.project.addLayer(new paper.Layer({
            name: 'Layer 1',
        }))
    },

    components: {
        'app-tools': Tools,
        'app-layers': Layers,
        'app-test': Test,
        'app-image-loader': ImageLoader,
        'app-control-toggle': ControlToggle,
    }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>
