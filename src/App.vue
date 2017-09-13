<template>
    <v-app toolbar pointer-events='none'>
        <header>
            <app-toolbar    :config='config'
                            :osdViewer='osdViewer'
                            :paperScope='paperScope'>
            </app-toolbar>
        </header>

        <main>
            <v-container fluid class='content-container'>
                <v-layout class='content-container'>

                    <v-flex id="leftPanel">
                        <app-tools  :paperScope='paperScope'
                                    :osdViewer='osdViewer'
                                    :config='config'>
                        </app-tools>
                    </v-flex>

                    <v-flex id='center-col'>
                        <app-stepper :config='config'>
                        </app-stepper>
                    </v-flex>

                    <v-flex id='rightPanel'>
                        <app-studio    :paperScope='paperScope'
                                            :osdViewer='osdViewer'
                                            :config='config'>
                        </app-studio>
                    </v-flex>

                </v-layout>
            </v-container>
        </main>

        <!-- <app-footer></app-footer> -->
    </v-app>
</template>

<script>
// Import JS libraries
import paper from 'paper';
import openseadragon from 'openseadragon';

// Import child components
import Tools from './components/Tools/Tools.vue';
import ImageLoader from './components/ImageLoader.vue';
import Toolbar from './components/Header/Toolbar.vue';
import Studio from './components/Studio/Studio.vue';
import Footer from './components/Footer.vue';
import Stepper from './components/Stepper.vue';

import { eventBus } from './main';

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
                    },
                    count: {
                        include: true,
                        name: 'Count',
                        caption: 'Count items within a rectangle'
                    }
                },
                steps: [
                    {   id: 1,
                        tools: {'pan': true, 'circle': true, 'rectangle': true, 'pen': true, 'pencil': true, 'move': true, 'node': true, 'count': true},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 1: Use the circle tool to mark the lymphocytes within the region of interest.'
                    },
                    {   id: 2,
                        tools: {'pan': true, 'circle': false, 'rectangle': false, 'pen': false, 'pencil': true, 'move': true, 'node': true, 'count': false},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 2: Use the contour tool to mark the non-tumor region.'
                    },
                    {   id: 3,
                        tools: {'pan': true, 'circle': false, 'rectangle': false, 'pen': false, 'pencil': true, 'move': true, 'node': true, 'count': false},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 3: Use the contour tool to mark the center of the tumor.'
                    },
                    {   id: 4,
                        tools: {'pan': true, 'circle': false, 'rectangle': false, 'pen': false, 'pencil': true, 'move': true, 'node': true, 'count': false},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 4: Use the contour tool to mark the invasive margin.'
                    },
                    {   id: 5,
                        tools: {'pan': true, 'circle': false, 'rectangle': false, 'pen': false, 'pencil': true, 'move': true, 'node': true, 'count': false},
                        regionOfIntereset: '',
                        instruction: 'Instructions for Step 5: Use the contour tool to mark the area around the glands.'
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
        this.osdViewer = new openseadragon.Viewer({
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
        vm.paperScope.project.importJSON('["Layer",{"name":"Circles","applyMatrix":true,"children":[["Group",{"applyMatrix":true}],["Group",{"applyMatrix":true}],["Path",{"applyMatrix":true,"data":{"countable":true},"segments":[[[2833.81806,3521.67343],[0,314.028],[0,-314.028]],[[3402.41605,2953.07544],[-314.028,0],[314.028,0]],[[3971.01404,3521.67343],[0,-314.028],[0,314.028]],[[3402.41605,4090.27142],[314.028,0],[-314.028,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":21.53835}],["Path",{"applyMatrix":true,"data":{"countable":true},"segments":[[[3449.21215,4848.68081],[0,472.14183],[0,-472.14183]],[[4304.10055,3993.79241],[-472.14183,0],[472.14183,0]],[[5158.98896,4848.68081],[0,-472.14183],[0,472.14183]],[[4304.10055,5703.56922],[472.14183,0],[-472.14183,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":21.53835}],["Path",{"applyMatrix":true,"data":{"countable":true},"segments":[[[1031.26573,5393.0941],[0,454.51656],[0,-454.51656]],[[1854.24077,4570.11906],[-454.51656,0],[454.51656,0]],[[2677.21582,5393.0941],[0,-454.51656],[0,454.51656]],[[1854.24077,6216.06914],[454.51656,0],[-454.51656,0]]],"closed":true,"fillColor":["hsl",170,0.7,0.5,0.4],"strokeColor":["hsl",170,0.7,0.5,1],"strokeWidth":21.53835}]]}]')
    },

    components: {
        'app-tools': Tools,
        'app-image-loader': ImageLoader,
        'app-toolbar': Toolbar,
        'app-footer': Footer,
        'app-studio': Studio,
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

    .content-container {
        flex: 1 0 auto;
        padding: 0px;
        min-height: 100%;
        height: 100%;
    }

    #center-col {
        padding: 7px;
    }

    #leftPanel{
        flex: 0 1 auto;
    }

    #rightPanel{
        flex: 0 1 auto;
    }
</style>
