<template>
        <v-app top-toolbar pointer-events='none'>
            <header>
                <app-toolbar :config='config'></app-toolbar>
            </header>

            <v-container fluid id='content-container'>
                <v-layout>
                    <v-flex xs2>
                        <app-tools  :paperScope.sync='paperScope'
                                    :osdViewer='osdViewer'
                                    :config='config'>
                        </app-tools>
                        <app-layers :paperScope="paperScope"></app-layers>
                    </v-flex>
                </v-layout>
            </v-container>

            <app-footer></app-footer>
        </v-app>
</template>

<script>
// Import JS libraries
import paper from 'paper'
import openseadragon from 'openseadragon'

// Import child components
import Tools from './components/Tools/Tools.vue'
import Layers from './components/Layers.vue'
import ImageLoader from './components/ImageLoader.vue'
import Toolbar from './components/Toolbar/Toolbar.vue'
import Footer from './components/Footer.vue'

export default {
    data() {
        return {
            paperScope: null,
            osdViewer: null,
            config: {
                tools: {
                    circle: {
                        include: true,
                        name: 'Circle',
                        caption: 'Plot filled circles',
                    },
                    rectangle: {
                        include: true,
                        name: 'Rectangle',
                        caption: 'Draw rectangles'
                    },
                    path: {
                        include: true,
                        name: 'Path',
                        caption: 'Draw smooth paths'
                    },
                    move: {
                        include: true,
                        name: 'Move',
                        caption: 'Move and scale annotation items'
                    },
                    pan: {
                        include: true,
                        name: 'Pan and Zoom',
                        caption: 'Pan and zoom the image and annotations'
                    },
                    node: {
                        include: true,
                        name: 'Node',
                        caption: 'Manipulate path node and handles'
                    }
                }
            }
        }
    },

    // The "created" function runs when the page loads
    created() {
        var vm = this;

        // Create the OpenSeadragon instance viewer.
        // Save it to the VueModel
        this.osdViewer = OpenSeadragon({
            id: "osd-canvas",
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: "https://openseadragon.github.io/example-images/duomo/duomo.dzi",
            showNavigationControl: false
        });

        // Create the PaperJS instance.
        // Save it to the VueModel
        this.paperScope = paper.setup(document.getElementById('paper-canvas'))

        // Add a handler fucntion that will run when osd-viewport is updated.
        // This will synchronously update the paperJS viewport.
        this.osdViewer.addHandler('update-viewport', function() {

            // Handle resize events
            var containerWidth = document.getElementById('canvas').clientWidth;
            var containerHeight = document.getElementById('canvas').clientHeight;
            vm.paperScope.view.viewSize = new paper.Size(containerWidth, containerHeight);

            // Handle changes in zoom level
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
        'app-image-loader': ImageLoader,
        'app-toolbar': Toolbar,
        'app-footer': Footer
    }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>

<style media="screen">
    #app {
        background-color: transparent;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    #content-container {
        flex: 1 0 auto;
    }
</style>
