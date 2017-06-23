<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class="tool elevation-1">
            <v-icon :class="{'blue--text darken-2--text': this.active}">
                    timeline
            </v-icon>
        </v-btn>
    </v-list-item>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolPen: null,
            hitOptions: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolPen.activate();

            // Set tool hitOptions
            var viewportZoom = this.osdViewer.viewport.getZoom(true);
            var hitTolerance = 400/viewportZoom;
            this.hitOptions = {
                segments: true,
                tolerance: hitTolerance
            }
        },

        newPath() {
            var viewportZoom = this.osdViewer.viewport.getZoom(true);
            var myPath = new paper.Path();
            myPath.strokeColor = 'red';
            myPath.strokeWidth = 400/viewportZoom;
            myPath.selected = true;

            return myPath
        }
    },

    created() {
        var vm = this;
        var path = null;

        function toolDown(e) {

            // If there is no current active path then create one.
            if(!path || !path.data.active){
                console.log('creating new path');
                path = vm.newPath()
                path.data.active = true;
            }

            var hitResult = path.hitTest(e.point, vm.hitOptions);
            console.log('The hitResult is:')
            console.log(hitResult);

            // If option key is held down then close the path
            if(e.modifiers.option) {
                path.closed = true;
                path.smooth();
                path.selected = false;
                path.data.active = false;

            // If first segment clicked, close path.
            } else if (hitResult && hitResult.segment == path.firstSegment){
                path.closed = true;
                path.smooth();
                path.selected = false;
                path.data.active = false;

            // If last segment clicked close path
            } else if (hitResult && hitResult.segment == path.lastSegment) {
                path.selected = false;
                path.data.active = false;

            // Else ad new point
            } else {
                path.add(e.point)
                path.smooth();
            }
        }

        // ToolDrag for drawing
        function toolDrag(e){
            
        }

        // Feedfoward information on mouseMove
        function toolMove(e) {
            var hitResult = path.hitTest(e.point, vm.hitOptions);

            // If hovering over first segment
            if(hitResult && hitResult.segment == path.firstSegment){

            }
        }

        this.toolPen = new paper.Tool()
        this.toolPen.onMouseDown = toolDown

    }
}

</script>

<style lang="css">
</style>
