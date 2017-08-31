<template>
        <v-app top-toolbar pointer-events='none'>
            <header>
                <app-toolbar    :config='config'
                                :osdViewer='osdViewer'
                                :paperScope='paperScope'
                                id='toolbar'>
                </app-toolbar>
            </header>

            <v-container fluid id='content-container'>
                <v-layout>
                    <v-flex xs1>
                        <app-tools  :paperScope='paperScope'
                                    :osdViewer='osdViewer'
                                    :config='config'>
                        </app-tools>
                    </v-flex>
                    <v-flex xs9 class='center-col'>
                        <app-stepper :config='config'>
                        </app-stepper>
                    </v-flex>
                    <v-flex xs2>
                        <app-right-panel    :paperScope='paperScope'
                                            :osdViewer='osdViewer'
                                            :config='config'>
                        </app-right-panel>
                    </v-flex>
                </v-layout>
            </v-container>

            <!-- <app-footer></app-footer> -->
        </v-app>
</template>

<script>
// Import JS libraries
import paper from 'paper'
import openseadragon from 'openseadragon'

// Import child components
import Tools from './components/Tools/Tools.vue'
import ImageLoader from './components/ImageLoader.vue'
import Toolbar from './components/Header/Toolbar.vue'
import RightPanel from './components/Studio/RightPanel.vue'
import Footer from './components/Footer.vue'
import Stepper from './components/Stepper.vue'

import { eventBus } from './main'

export default {
    data() {
        return {
            paperScope: null,
            osdViewer: null,
            config: {
                activeStep: 0,
                tools: {
                    pan: {
                        include: true,
                        name: 'Pan and Zoom',
                        caption: 'Pan and zoom'
                    },
                    circle: {
                        include: true,
                        name: 'Circle',
                        caption: 'Plot circles',
                    },
                    rectangle: {
                        include: true,
                        name: 'Rectangle',
                        caption: 'Draw rectangles'
                    },
                    pen: {
                        include: true,
                        name: 'Pen',
                        caption: 'Draw smooth paths by plotting node points'
                    },
                    pencil: {
                        include: true,
                        name: 'Pencil',
                        caption: 'Draw smooth paths by dragging the mouse'
                    },
                    move: {
                        include: true,
                        name: 'Move',
                        caption: 'Move and scale annotation items'
                    },
                    node: {
                        include: true,
                        name: 'Node',
                        caption: 'Manipulate path nodes and handles'
                    }
                },
                steps: [
                    {   id: 1,
                        tools: {'pan': true, 'circle': true, 'rectangle': true, 'pen': true, 'pencil': true, 'move': true, 'node': true},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                    },
                    {   id: 2,
                        tools: {'pan': true, 'circle': true, 'rectangle': true, 'pen': true, 'pencil': true, 'move': true, 'node': true},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 2: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                    },
                    {   id: 3,
                        tools: {'pan': true, 'circle': true, 'rectangle': true, 'pen': true, 'pencil': true, 'move': true, 'node': true},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 3:'
                    }
                ],
                images: []
            }
        }
    },

    methods: {
        addImage(name, url) {
            var newid = this.config.images.length + 1;

            this.config.images.push({
                id: newid,
                name: name,
                url: url
            })

            this.osdViewer.addTiledImage({
                tileSource: url,
                x: 0,
                y: 0,
                opacity: 0.7
            });

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
            showNavigationControl: false
        });

        // Add image tile sources to the viewer.
        // These will be the different channels.
        // TODO: make this reactive to the number of channels in the image source.
        // at the moment it is merely hardcoded.
        // vm.addImage('CD3DZ', '../static/dzi_images/CD3DZ/CD3DZ.dzi');
        // vm.addImage('HEDZ', '../static/dzi_images/HEDZ/HEDZ.dzi');
        // vm.addImage('CD20DZ', '../static/dzi_images/CD20DZ/CD20DZ.dzi');
        vm.addImage('Highsmith', 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi');

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
            var center = image1.viewportToImageCoordinates(vm.osdViewer.viewport.getCenter(true));
            vm.paperScope.view.center = new paper.Point(center.x, center.y);

            // Update paths to have strokeWidth reactive to zoom level
            // This might be computationally-expensive but will try for now.
            // Loop through each item in the project checking if it's a path
            // item and resizing the strokeWidth to be relative to the zoom
            // level and item size.
            var size = vm.osdViewer.world.getItemAt(0).getContentSize().x;
            vm.paperScope.project.layers.forEach((layer) => {
                layer.children.forEach((child) => {
                    if(child.className === 'Path') {
                        child.strokeWidth = size/(viewportZoom*500);
                    }
                })
            })
        });

        // Import JSON.
        // If required, load the interface with a set of annotations by defualt.
        // paperJS annoations should be described by JSON object as a string parameter.
        vm.paperScope.project.importJSON('["Layer",{"name":"Circles","applyMatrix":true,"children":[["Path",{"applyMatrix":true,"segments":[[[2321.59715,3366.53675],[0,585.63994],[0,-585.63994]],[[3381.99206,2306.14185],[-585.63994,0],[585.63994,0]],[[4442.38697,3366.53675],[0,-585.63994],[0,585.63994]],[[3381.99206,4426.93166],[585.63994,0],[-585.63994,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":22.49365}],["Path",{"applyMatrix":true,"segments":[[[754.39936,5834.87327],[0,585.63994],[0,-585.63994]],[[1814.79427,4774.47837],[-585.63994,0],[585.63994,0]],[[2875.18918,5834.87327],[0,-585.63994],[0,585.63994]],[[1814.79427,6895.26818],[585.63994,0],[-585.63994,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":22.49365}],["Path",{"applyMatrix":true,"segments":[[[3222.73588,6481.34236],[0,585.63994],[0,-585.63994]],[[4283.13079,5420.94745],[-585.63994,0],[585.63994,0]],[[5343.5257,6481.34236],[0,-585.63994],[0,585.63994]],[[4283.13079,7541.73727],[585.63994,0],[-585.63994,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":22.49365}]]}]')
    },

    components: {
        'app-tools': Tools,
        'app-image-loader': ImageLoader,
        'app-toolbar': Toolbar,
        'app-footer': Footer,
        'app-right-panel': RightPanel,
        'app-stepper': Stepper
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
        padding: 0px;
    }

    .center-col {
        padding-left: 0px;
        padding-right: 0px;
    }

    #toolbar {
        height: 100%;
    }

    header {
        height: 7%;
    }
</style>
