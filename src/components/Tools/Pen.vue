<template lang="html">

    <v-btn @click.native="initialiseTool" block class="tool elevation-1">
        <v-icon :class="{'blue--text darken-2--text': this.active}">
                timeline
        </v-icon>
    </v-btn>

</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolPen: null,
            hitOptions: null,
            strokeWidth: null,
            path: null
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
            var size = this.osdViewer.world.getItemAt(0).getContentSize().x;
            this.strokeWidth = size/(viewportZoom*500);

            var hitTolerance = this.strokeWidth*5;
            this.hitOptions = {
                segments: true,
                tolerance: hitTolerance
            }
        },

        newPath() {
            var viewportZoom = this.osdViewer.viewport.getZoom(true);
            var myPath = new paper.Path();
            myPath.strokeColor = new paper.Color({hue: 20, saturation: 0.7, lightness: 0.5, alpha: 1});
            myPath.strokeWidth = this.strokeWidth;
            myPath.selected = true;

            return myPath
        }
    },

    created() {
        var vm = this;

        function toolDown(e) {

            // If there is no current active path then create one.
            if(!vm.path || !vm.path.data.active){
                vm.path = vm.newPath()
                vm.path.data.active = true;
            }

            var hitResult = vm.path.hitTest(e.point, vm.hitOptions);

            // If option key is held down then close the path
            if(e.modifiers.option) {
                vm.path.closed = true;
                vm.path.smooth();
                vm.path.selected = false;
                vm.path.data.active = false;

            // If first segment clicked, close path.
            } else if (hitResult && hitResult.segment == vm.path.firstSegment){
                vm.path.closed = true;
                vm.path.fillColor = new paper.Color({hue: 20, saturation: 0.7, lightness: 0.5, alpha: 0.4});
                vm.path.smooth();
                vm.path.selected = false;
                vm.path.data.active = false;

            // If last segment clicked close path
            } else if (hitResult && hitResult.segment == vm.path.lastSegment) {
                vm.path.selected = false;
                vm.path.data.active = false;

            // Else ad new point
            } else {
                vm.path.add(e.point)
                vm.path.smooth();
            }
        }

        // ToolDrag for drawing
        function toolDrag(e){

        }

        // Feedfoward information on mouseMove
        function toolMove(e) {
            var hitResult = vm.paperScope.project.hitTest(e.point, vm.hitOptions);

            // If hovering over first/last segment then remove the selected
            // highlighting to indicate path will be finsihed.
            if (hitResult) {
                if( hitResult.segment == hitResult.item.firstSegment ){
                    vm.path.closed = true;
                } else if (hitResult.segment == hitResult.item.firstSegment ||
                           hitResult.segment == hitResult.item.lastSegment){
                               vm.path.selected = false;
                }
            } else {
                if (vm.path && vm.path.data.active){
                    vm.path.selected = true;
                    vm.path.closed = false;
                }
            }

        }

        this.toolPen = new paper.Tool();
        this.toolPen.onMouseDown = toolDown;
        this.toolPen.onMouseMove = toolMove;

    }
}

</script>

<style lang="css">
</style>
