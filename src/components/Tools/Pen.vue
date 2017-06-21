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
            this.newPath()

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
        }
    },

    created() {
        var vm = this;

        function addPoint(e) {
            // Get currently activate item
            var myPath = vm.paperScope.project.activeLayer.lastChild;

            var hitResult = myPath.hitTest(e.point, vm.hitOptions);
            console.log('The hitResult is:')
            console.log(hitResult);

            // If option key is held down then close the path
            if(e.modifiers.option) {
                myPath.closed = true;
                myPath.smooth()

                // start a new path
                vm.newPath()

            // If user has clicked on the last segment again then complete
            // the path and create a new one.
            } else if(hitResult && hitResult.segment == myPath.lastSegment) {
                myPath.selected = false
                vm.newPath()
            }else {
                myPath.add(e.point)
                myPath.smooth()
            }
        }

        function finishPath(e) {
            myPath.add(e.point);
            myPath.smooth()

            vm.newPath()
        }

        this.toolPen = new paper.Tool()
        this.toolPen.onMouseDown = addPoint

    }
}

</script>

<style lang="css">
</style>
