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
        var hitOptions = {
            segments: true,
            stroke: true,
            bounds: true,
            handles: true,
            fill: true,
            bounds: true,
            tolerance: 5
        }

        function clickMove(e) {

            // Deselect all current selections
            vm.paperScope.project.deselectAll()

            hitResult = paper.project.hitTest(e.point, hitOptions)

            // If user has clicked on a path
            if (hitResult.type == 'segments'    ||
                hitResult.type == 'fill'        ||
                hitResult.type == 'stroke') {

                itemBounds = new paper.Path.Rectangle(hitResult.item.bounds)

                // Save the item for use in further interaction events
                // For example, this is useful if the user drags the mouse
                // off the item before the move anmiation can keep up - the
                // selected item is not 'lost'
                item = hitResult.item
                itemBounds.fullySelected = true
            } else if (hitResult.type == 'bounds') {
                itemBounds.fullySelected = true
            } else {
                item = null
            }

        }

        // Install a drag event handler that moves the path along.
        function dragMove (e) {

            // If clicked on the path itself then drag to move
            // TODO: could make this be clicking INSIDE the bounds but NOT on
            // might be a better way to do it as difficult to click on skinny
            // lines.
            // TODO: This is jumping so the user always holds the centre of the
            // circle, but they should be able to move it from an arbitrary point.
            if (hitResult.type == 'segments'    ||
                hitResult.type == 'fill'        ||
                hitResult.type == 'stroke') {

                item.position = e.point;
                itemBounds.position = e.point;

            // If clicked on the boundary then need to scale in some way.
            } else if (hitResult.type == 'bounds') {

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

                } else if (hitResult.name == 'top-right') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.topLeft.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.bottomRight.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    item.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomLeft)
                    itemBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomLeft)

                } else if (hitResult.name == 'bottom-right') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.bottomLeft.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.topRight.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    item.scale(horizScaleFactor, vertScaleFactor, scaleRect.topLeft)
                    itemBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.topLeft)

                } else if (hitResult.name == 'bottom-left') {

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

        // Housekeeping on MouseUp
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
