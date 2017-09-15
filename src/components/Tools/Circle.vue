<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <i :class="{
                'fa': true,
                'fa-circle': true,
                'faIcons': !this.active,
                'faIconsActive': this.active
                }">
        </i>
    </v-btn>

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

            // Testing purposes 
            console.log("this is coming from the store!");
            console.log(this.$store.state.image.number);

            // Set the default radius relative to image size and zoom level.
            // TODO: inefficiencies in this. Each time we are getting the
            // content size repeatedly.
            this.viewportZoom = this.osdViewer.viewport.getZoom(true);
            var size = this.osdViewer.world.getItemAt(0).getContentSize().x;
            this.radius = size/(this.viewportZoom*100);
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
        var radius = 2000;

        // Set the required zoom dependent variables
        function toolDown(event) {

            // The distance the mouse has to be dragged before an event is fired
            // is dependent on the current zoom level
            vm.toolCircle.minDistance = vm.radius * 1.5;

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
            trackingPath.add(event.point);
            trackingPath.removeOn({
                drag:true,
                down: true,
                up:true
            });

            //create a circle positioned at point where mousedown was, with radius
            //the distance between mousedown/mouseup
        	var trackingCircle = new paper.Path.Circle(firstPoint, vm.radius);
            trackingCircle.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
            trackingCircle.strokeWidth = vm.strokeWidth;
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

            // Custom attribute: includes item in counting tools.
            myCircle.data.countable = true;

            // As the number of circle markers in the project has changed,
            // Emit an event that will check to see if we are counting these
            // in a particular area and update that value if so.
            eventBus.$emit('updateMarkerCount');
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
