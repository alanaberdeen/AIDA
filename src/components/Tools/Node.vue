<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <i :class="{
                    'fa': true,
                    'fa-location-arrow': true,
                    'faIcons': !this.active,
                    'faIconsActive': this.active
                    }">
            </i>
        </v-btn>
    </v-list-item>
</template>

<script>
import paper from 'paper'

//TODO: make it so that not all handles are automatically shown. Rather, use
// should select of drag a node and that node's handles plus those of the
// two nearest nodes should be visible.

//TODO: make this work with standard shapes such as circle adjustment. Think
// at the moment it is selected bounds.

export default {
    props: ['paperScope', 'osdViewer', 'active'],
    data() {
        return {
            toolNode: null,
            hitOptions: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolNode.activate();

            // Set the hitTolerance for user clicks to be depenent on current
            // viewport parameters
            var viewportZoom = this.osdViewer.viewport.getZoom(true);
            var hitTolerance = 100/viewportZoom;
            this.hitOptions = {
                segments: true,
                stroke: true,
                bounds: true,
                handles: true,
                fill: true,
                tolerance: hitTolerance
            }
        }
    },

    created() {

        var vm = this;
        var hitResult = null;
        var status = null;

        // On mouseDown functionality
        function mouseDown(e) {

            // Deselect all current selections
            vm.paperScope.project.deselectAll()

            // Save hitResult
            hitResult = paper.project.hitTest(e.point, vm.hitOptions)

            // Check if use selected something
            if(hitResult) {

                console.log('The hitResult is: ' + hitResult);
                hitResult.item.fullySelected = true;

                // Check if item
                if (hitResult.type == 'fill'        ||
                    hitResult.type == 'stroke') {
                status = 'selecting'

                } else if (hitResult.type == 'segment'      ||
                           hitResult.type == 'handle-out'   ||
                           hitResult.type == 'handle-in'){
                    status = 'adjusting'
                }
            }
        }

        // On mouseDrag functionality
        function mouseDrag(e) {

            if (status == 'adjusting') {
                if (hitResult.type == 'segment'){
                    hitResult.segment.point = hitResult.segment.point.add(e.delta)
                } else if (hitResult.type == 'handle-out') {
                    hitResult.segment.handleOut = hitResult.segment.handleOut.add(e.delta)
                } else if (hitResult.type == 'handle-in') {
                    hitResult.segment.handleIn = hitResult.segment.handleIn.add(e.delta)
                }
            }
        }


        this.toolNode = new paper.Tool();
        this.toolNode.onMouseDown = mouseDown;
        this.toolNode.onMouseDrag = mouseDrag;
    }
}
</script>

<style lang="css">
</style>
