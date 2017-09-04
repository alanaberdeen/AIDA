<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <v-icon :class="{'blue--text darken-2--text': this.active}">
                crop_landscape
        </v-icon>
    </v-btn>

</template>

<script>
import paper from 'paper'
import { eventBus } from '../../main'

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolRect: null,
            strokeWidth: 400,
            viewportZoom: this.osdViewer.viewport.getZoom(true)
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolRect.activate();

            // Set the default radius relative to zoom level.
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

        // Set the required zoom dependent variables
        function toolDown(event) {

            //get the first point
	        firstPoint = event.point;
        }

        function toolDrag(event) {

        	secondPoint = event.point;
        	vm.radius = vm.calculateDistance(firstPoint,secondPoint)

            //create a circle positioned at point where mousedown was, with radius
            //the distance between mousedown/mouseup
        	var trackingRect = new paper.Path.Rectangle(firstPoint, secondPoint);
            trackingRect.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
            trackingRect.strokeWidth = vm.strokeWidth;

        	//remove tracking rect and display another one while dragging
            trackingRect.removeOn({
                drag: true,
                down: true,
                up:true
            });
        }

        function toolUp(event) {
            //get the point on mouse up and calculate the distance with 1st point
        	secondPoint = event.point;

        	//create a circle positioned at point where mousedown was, with radius
        	//the distance between mousedown/mouseup
        	var myRect = new paper.Path.Rectangle(firstPoint, secondPoint);
            myRect.strokeColor = new paper.Color({hue: 350, saturation: 0.7, lightness: 0.5, alpha: 1});
            myRect.strokeWidth = vm.strokeWidth;
            myRect.fillColor = new paper.Color({hue: 350, saturation: 0.7, lightness: 0.5, alpha: 0.4});
        }

        this.toolRect = new paper.Tool();
        this.toolRect.onMouseDown = toolDown;
        this.toolRect.onMouseDrag = toolDrag;
        this.toolRect.onMouseUp = toolUp;
    }

}
</script>

<style lang="css">
</style>
