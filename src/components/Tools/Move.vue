<template lang="html">
    <v-btn @click.native="initialiseTool" primary dark>
        <i class="fa fa-mouse-pointer" aria-hidden="true"></i>
    </v-btn>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolMove: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolMove.activate();
        }
    },

    created() {
        var vm = this;
        var item = null;
        var itemBounds = null;
        var hitResult = null;

        //TODO: set the click tolerance to be determined by the current zoom level
        var hitOptions = {
            segments: true,
            stroke: true,
            bounds: true,
            handles: true,
            fill: true,
            tolerance: 100
        }

        // On mouseClick fucntionality
        function clickMove(e) {

            // Deselect all current selections
            vm.paperScope.project.deselectAll()

            // Save hitResult
            hitResult = paper.project.hitTest(e.point, hitOptions)

            // Check if use selected something
            if(hitResult) {

                // Check if item
                if (hitResult.type == 'segments'    ||
                    hitResult.type == 'fill'        ||
                    hitResult.type == 'stroke') {

                    // Create rectangle and select it to display the item bounds
                    // Remove previous rectangle as housekeeping.
                    if(itemBounds){
                        itemBounds.remove()
                    }
                    itemBounds = new paper.Path.Rectangle(hitResult.item.handleBounds);
                    itemBounds.fullySelected = true
                    console.log(itemBounds);

                    // Save the item for use in further interaction events
                    // For example, this is useful if the user drags the mouse
                    // off the item before the move anmiation can keep up - the
                    // selected item is not 'lost'
                    item = hitResult.item

                // Else check if item bounds
                } else if (hitResult.type == 'bounds') {
                    itemBounds.fullySelected = true

                // Else nothing was selected
                } else {
                    item = null
                }
            }
        }

        // On mouseDrag functionality
        function dragMove (e) {

            // Check if user has selected a point within the bounds rectangle.
            // Therefore consider their intention is to drag the item.
            if (itemBounds.contains(e.point)) {
                item.position = item.position.add(e.delta);
                itemBounds.position = itemBounds.position.add(e.delta);
                itemBounds.fullySelected = true

            // If clicked on the boundary then need to scale in some way.
            } else if (hitResult && hitResult.type == 'bounds') {

                // Itembounds rectangle for scale factor rectangle
                var scaleRect = itemBounds.bounds;

                // Check exactly which handle affected in order to adjust scaling point
                if (hitResult.name == 'top-left') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.topRight.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.bottomLeft.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    item.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomRight)
                    itemBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomRight)

                } else if (hitResult && hitResult.name == 'top-right') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.topLeft.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.bottomRight.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    item.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomLeft)
                    itemBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomLeft)

                } else if (hitResult && hitResult.name == 'bottom-right') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.bottomLeft.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.topRight.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    item.scale(horizScaleFactor, vertScaleFactor, scaleRect.topLeft)
                    itemBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.topLeft)

                } else if (hitResult && hitResult.name == 'bottom-left') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.bottomRight.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.topLeft.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    item.scale(horizScaleFactor, vertScaleFactor, scaleRect.topRight)
                    itemBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.topRight)
                }
            }
        }

        // on MouseUp housekeeping functionality.
        function releaseMove (e) {
            hitResult = null;
        }

        this.toolMove = new paper.Tool()
        this.toolMove.onMouseDown = clickMove
        this.toolMove.onMouseDrag = dragMove
        this.toolMove.onMouseUp = releaseMove
    }
}

</script>

<style lang="css">
</style>
