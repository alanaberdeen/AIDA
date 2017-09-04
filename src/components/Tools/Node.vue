<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <i :class="{
                'fa': true,
                'fa-location-arrow': true,
                'faIcons': !this.active,
                'faIconsActive': this.active
                }">
        </i>
    </v-btn>

</template>

<script>
import paper from 'paper'

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
            var hitTolerance = 500/viewportZoom;
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

            // Save hitResult
            hitResult = paper.project.hitTest(e.point, vm.hitOptions)

            // Check if use selected something
            if(hitResult) {
                // Depending on item state and click location set tool status
                if (!hitResult.item.selected){
                    hitResult.item.selected = true;
                    status = 'selecting';

                } else if (hitResult.type === 'fill'        ||
                           hitResult.type === 'stroke') {

                    status = 'adding-node';

                } else if (hitResult.type === 'segment'){

                    // Select this segment and negihbouring handles.
                    // Deselect all else.
                    hitResult.item.segments.forEach((segment) => {
                        if (segment === hitResult.segment){
                            segment.selected = true;
                        } else if (segment === hitResult.segment.next) {
                            segment.handleIn.selected = true;
                        } else if (segment === hitResult.segment.previous) {
                            segment.handleOut.selected = true;
                        } else {
                            segment.selected = false;
                        }
                    })

                    status = 'adjusting-segment';

                } else if ( hitResult.type === 'handle-out'   ||
                            hitResult.type === 'handle-in') {

                    status = 'adjusting-handle';

                }
            } else {
                vm.paperScope.project.deselectAll();
            }
        }

        // On mouseDrag functionality
        function mouseDrag(e) {

            if (hitResult && (status == 'adjusting-segment')) {
                hitResult.segment.point = hitResult.segment.point.add(e.delta);

            } else if ( hitResult &&
                        (hitResult.type == 'handle-out') &&
                        (status == 'adjusting-handle')) {
                hitResult.segment.handleOut = hitResult.segment.handleOut.add(e.delta);

            } else if ( hitResult &&
                        (hitResult.type == 'handle-in') &&
                        (status == 'adjusting-handle')) {
                hitResult.segment.handleIn = hitResult.segment.handleIn.add(e.delta);
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
