<template lang="html">
    <v-btn @click.native="initialiseTool" flat block>
        <v-icon :class="{'grey--text text--darken-2': !this.active,
                         'blue--text text--darken-1': this.active}">
                filter_9_plus
        </v-icon>
    </v-btn>
</template>

<script>
import paper from 'paper';
import { eventBus } from '../../main';

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolCount: null,
            strokeWidth: 400,
            viewportZoom: this.osdViewer.viewport.getZoom(true),
        }
    },

    methods: {
        initialiseTool() {

            // Manage browser pointers for interactivity
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }

            // Activate paperJS tool
            this.toolCount.activate();

            // Set the default size relative to zoom level.
            this.viewportZoom = this.osdViewer.viewport.getZoom(true);
            var size = this.osdViewer.world.getItemAt(0).getContentSize().x;
            this.strokeWidth = size/(this.viewportZoom*500);

            // Deselect any current selections to avoid confusion.
            this.paperScope.project.deselectAll();
        },

        //helper function - calculate distance between 2 points:
        //see: http://www.mathwarehouse.com/algebra/distance_formula/index.php
        calculateDistance(firstPoint,secondPoint){
            var x1 = firstPoint.x;
            var y1 = firstPoint.y;
            var x2 = secondPoint.x;
            var y2 = secondPoint.y;

            var distance = Math.sqrt((Math.pow((x2-x1), 2))+(Math.pow((y2-y1), 2)));
            return distance;
        }
    },

    created() {
        var vm = this;

        var firstPoint;
        var secondPoint;
        var projectPathItems = null;

        // Listen for an event indicating the marker counts should be updated.
        eventBus.$on('updateMarkerCount', () => {

            // Find counters in the project at this moment.
            var counters = vm.paperScope.project.getItems({
                data: {
                    type: 'counter'
                }
            });

            // Check which marker circles are inside the counting rectangle
            // at this moment.
            var markerItems = vm.paperScope.project.getItems({
                className: 'Path',
                data: {
                    countable: true
                }
            });


            for (var counter in counters){

                var totalMarkers = 0;

                // Log the bounds to see if it moves on move
                console.log(counters[counter].data.rect.bounds);

                // If marker is inside the area for counting then increment
                // the total count.
                for (var marker in markerItems){
                    if (markerItems[marker].isInside(counters[counter].data.rect.bounds)){
                        totalMarkers += 1;
                    }
                }

                // Update text to represent the number of markers inside
                // the associated rectangle.
                counters[counter].content = totalMarkers;
            }
        })

        // Get the first point
        function toolDown(event) {
	        firstPoint = event.point;

            // Check which path items are in the project at this moment.
            projectPathItems = vm.paperScope.project.getItems({
                className: 'Path'
            })
        }

        // On drag draw feedforward shadow rectangle in realtime.
        function toolDrag(event) {

        	secondPoint = event.point;

            // Draw rectangle.
        	var trackingRect = new paper.Path.Rectangle(firstPoint, secondPoint);
                trackingRect.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
                trackingRect.strokeWidth = vm.strokeWidth;
                trackingRect.removeOn({
                    drag: true,
                    down: true,
                    up:true
                });
        }

        // Finalise rectangle properties and draw.
        function toolUp(event) {

            // secondPoint for specifiying rectangle dimensions
        	secondPoint = event.point;

            // Draw rectangle
        	var countRect = new paper.Path.Rectangle(firstPoint, secondPoint);
            countRect.strokeColor = new paper.Color({hue: 46, saturation: 1.0, lightness: 0.65, alpha: 1});
            countRect.strokeWidth = vm.strokeWidth;

            // Draw text for number of items within rectangle
            var countText = new paper.PointText(countRect.bounds.topLeft);
                countText.translate(vm.strokeWidth*3, -vm.strokeWidth*2);
                countText.fillColor = 'black';
                countText.fontSize = vm.strokeWidth*12 + 'px';
                countText.data.rect = countRect;    // Keep a record of associated rectangle within which the items are counted.
                countText.data.type = 'counter';

            // Emit event that will check and update the number of markers in
            // each counter rectangle.
            eventBus.$emit('updateMarkerCount');

            // Draw text tag, background coloured area to make sure the text
            // is visually distinct.
            var textTagTopRight = countText.handleBounds.topRight.add(vm.strokeWidth*4, 0);
            var textTag = new paper.Path.Rectangle(countRect.strokeBounds.topLeft, textTagTopRight);
                textTag.fillColor = countRect.strokeColor;
                textTag.moveBelow(countText);

            // Add data to ensure all of these items can only be selected together.
            countRect.data.selectWith = [textTag, countText];
            countText.data.selectWith = [countRect, textTag, countText];
            textTag.data.selectWith = [countText, countRect];

        }

        this.toolCount = new paper.Tool();
        this.toolCount.onMouseDown = toolDown;
        this.toolCount.onMouseDrag = toolDrag;
        this.toolCount.onMouseUp = toolUp;
    }

}
</script>

<style lang="css">
</style>
