<template lang="html">
    <v-btn @click.native="initialiseTool" flat block>
        <v-icon :class="{'grey--text text--darken-2': !this.active,
                         'blue--text text--darken-1': this.active}">
                filter_9_plus
        </v-icon>
    </v-btn>
</template>

<script>
// This is the start of a persistent count object.
// The idea is that you draw a rectangle on the page that has a tab attached
// that specifies the number of items within this rectangle. This tab
// should update automatically as more items are added. Might have
// to use the eventBus instance to trigger an update when items are to the
// paperScope in general and then do a recount. Can't seem to find an event,
// like item-added-event in the paperScope view object that I could attach a
// handler to.
import paper from 'paper';

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolCount: null,
            strokeWidth: 400,
            viewportZoom: this.osdViewer.viewport.getZoom(true)
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolCount.activate();

            // Set the default size relative to zoom level.
            this.viewportZoom = this.osdViewer.viewport.getZoom(true);
            var size = this.osdViewer.world.getItemAt(0).getContentSize().x;
            this.strokeWidth = size/(this.viewportZoom*500);
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

        // Deselect any current selection
        this.paperScope.project.deselectAll();

        // Get the first point
        function toolDown(event) {
	        firstPoint = event.point;
        }

        // On drag draw feedforward shadow rectangle in realtime.
        function toolDrag(event) {

        	secondPoint = event.point;
        	vm.radius = vm.calculateDistance(firstPoint,secondPoint)

        	var trackingRect = new paper.Path.Rectangle(firstPoint, secondPoint);
            trackingRect.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
            trackingRect.strokeWidth = vm.strokeWidth;

        	// Constantly update tracking rect by removing it and
            // drawing another.
            trackingRect.removeOn({
                drag: true,
                down: true,
                up:true
            });
        }

        // Finalise rectangle properties and draw.
        function toolUp(event) {

        	secondPoint = event.point;

        	var myRect = new paper.Path.Rectangle(firstPoint, secondPoint);
            myRect.strokeColor = new paper.Color({hue: 46, saturation: 1.0, lightness: 0.65, alpha: 1});
            myRect.strokeWidth = vm.strokeWidth;
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
