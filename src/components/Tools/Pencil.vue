<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <i  :class="{
                'fa': true,
                'fa-pencil': true,
                'faIcons': !this.active,
                'faIconsActive': this.active
            }">
       </i>
    </v-btn>

</template>

<script>
import paper from 'paper';

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolPencil: null,
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
            this.toolPencil.activate();

            // Set tool hitOptions
            var viewportZoom = this.osdViewer.viewport.getZoom(true);var size = this.osdViewer.world.getItemAt(0).getContentSize().x;
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
            myPath.strokeColor = new paper.Color({hue: 200, saturation: 0.7, lightness: 0.5, alpha: 1});
            myPath.strokeWidth = this.strokeWidth;
            myPath.selected = true;

            // The distance the mouse has to be dragged before an event is fired
            // is dependent on the current zoom level
            this.toolPencil.minDistance = this.strokeWidth*5;

            return myPath
        }
    },

    created() {
        var vm = this;

        function onToolDown(event) {

            // If there is no current active path then create one.
            if(!vm.path || !vm.path.data.active){
                vm.path = vm.newPath();
                vm.path.data.active = true;
            }
        }

        function onToolDrag(event) {
        	vm.path.add(event.point);
        }

        // This doesn't work because onMouseMove events are not fired when
        // mouse button is held down. onMouseDrag events are instead.
        // function onToolMove(event){
        //
        //     // Feedforward information applied when path being worked on.
        //     if(vm.path){
        //         // If user releases mouse near the first segment then assume
        //         // trying to close the path and apply Feedfoward information.
        //         var hitResult = vm.path.hitTest(event.point, vm.hitOptions);
        //         if (hitResult && hitResult.segment === vm.path.firstSegment){
        //             vm.path.closed = true;
        //         } else {
        //             vm.path.close = false;
        //         }
        //     }
        // }

        function onToolUp(event) {

            // If user releases mouse near the first segment then close path
            // and set fill.
            var hitResult = vm.path.hitTest(event.point, vm.hitOptions);
            if (hitResult && hitResult.segment === vm.path.firstSegment){
                vm.path.closed = true;
                vm.path.fillColor = new paper.Color({hue: 200, saturation: 0.7, lightness: 0.5, alpha: 0.4})
            }

            // Deselect path.
        	vm.path.selected = false;

            // The path.segments array is analyzed and replaced by a more
            // optimal set of segments, reducing memory usage and speeding up
            // drawing.
        	vm.path.simplify();
            vm.path.data.active = false;
        }



        this.toolPencil = new paper.Tool();
        this.toolPencil.onMouseDown = onToolDown;
        this.toolPencil.onMouseDrag = onToolDrag;
        // this.toolPencil.onMouseMove = onToolMove;
        this.toolPencil.onMouseUp = onToolUp;


    }

}
</script>

<style lang="css">
</style>
