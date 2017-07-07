<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <i :class="{
                    'fa': true,
                    'fa-circle': true,
                    'faIcons': !this.active,
                    'faIconsActive': this.active
                    }">
            </i>
        </v-btn>
    </v-list-item>
</template>

<script>
import paper from 'paper'
import { eventBus } from '../../main'

export default {
    props: ['paperScope', 'active', 'osdViewer'],
    data() {
        return {
            toolCircle: null,
            strokeWidth: 400,
            radius: 2000,
            viewportZoom: this.osdViewer.viewport.getZoom(true)
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolCircle.activate();

            // Set the default radius relative to zoom level.
            this.viewportZoom = this.osdViewer.viewport.getZoom(true);
            this.radius = 3000/this.viewportZoom;
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
        var radius = 2000;

        // Set the required zoom dependent variables 
        function toolDown(event) {

            // Set the strokewidth relative to zoom level.
            vm.strokeWidth = 400/vm.viewportZoom;

            // The distance the mouse has to be dragged before an event is fired
            // is dependent on the current zoom level
            vm.toolCircle.minDistance = 4000/vm.viewportZoom;

            //get the first point
	        firstPoint = event.point;
        }

        function toolDrag(event) {

            // If user dragged fire enough to fire this event assume they are
            // adjusting the default size of the circle.
            // Reset the distance before further events fired.
            vm.toolCircle.minDistance = 0;

        	secondPoint = event.point;
        	vm.radius = vm.calculateDistance(firstPoint,secondPoint)

            var trackingPath = new paper.Path.Line(firstPoint, secondPoint);
            trackingPath.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
            trackingPath.strokeWidth = vm.strokeWidth;

            //create a circle positioned at point where mousedown was, with radius
            //the distance between mousedown/mouseup
        	var trackingCircle = new paper.Path.Circle(firstPoint, vm.radius);
            trackingCircle.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
            trackingCircle.strokeWidth = vm.strokeWidth;

        	//remove tracking circle/line and display another one while dragging
        	trackingPath.add(event.point);

            trackingPath.removeOn({
                drag:true,
                down: true,
                up:true
            });

            trackingCircle.removeOn({
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
        	var myCircle = new paper.Path.Circle(firstPoint, vm.radius);
            myCircle.strokeColor = new paper.Color({hue: 170, saturation: 0.7, lightness: 0.5, alpha: 1});
            myCircle.strokeWidth = vm.strokeWidth;
            myCircle.fillColor = new paper.Color({hue: 170, saturation: 0.7, lightness: 0.5, alpha: 0.4});
        }

        this.toolCircle = new paper.Tool();
        this.toolCircle.onMouseDown = toolDown;
        this.toolCircle.onMouseDrag = toolDrag;
        this.toolCircle.onMouseUp = toolUp;
    }
}
</script>

<style lang="css">


</style>
