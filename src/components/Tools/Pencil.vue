<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class="tool elevation-1">
            <i  :class="{
                    'fa': true,
                    'fa-pencil': true,
                    'faIcons': !this.active,
                    'faIconsActive': this.active
                }">
           </i>
        </v-btn>
    </v-list-item>

</template>

<script>
import paper from 'paper';

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolPencil: null,
            hitOptions: null,
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
            var viewportZoom = this.osdViewer.viewport.getZoom(true);
            var hitTolerance = 500/viewportZoom;
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

            // The distance the mouse has to be dragged before an event is fired
            // is dependent on the current zoom level
            this.toolPencil.minDistance = 4000/viewportZoom;

            return myPath
        }
    },

    created() {
        var vm = this;

        function onToolDown(event) {

            // If there is no current active path then create one.
            if(!vm.path || !vm.path.data.active){
                console.log('creating new path');
                vm.path = vm.newPath();
                vm.path.data.active = true;
            }
        }

        function onToolDrag(event) {
        	vm.path.add(event.point);
        }

        function onToolUp(event) {
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
        this.toolPencil.onMouseUp = onToolUp;


    }

}
</script>

<style lang="css">
</style>
