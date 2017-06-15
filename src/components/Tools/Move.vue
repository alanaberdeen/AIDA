<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <i :class="{
                    'fa': true,
                    'fa-mouse-pointer': true,
                    'faIcons': !this.active,
                    'faIconsActive': this.active
                    }"></i>
        </v-btn>
    </v-list-item>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope', 'osdViewer', 'active'],
    data() {
        return {
            toolMove: null,
            hitOptions: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolMove.activate();

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

        // TODO: seems to be a bug when moving items that have overlapping
        // itembounds. E.g being able to move and item by selecting another
        // item's bounding box in some cases. Investigate this.

        // TODO: BUG: sometimes on moving the rectangular paths a copy is made
        // instead of moving the original. Think this has something to do with
        // accidently selecting the bounds rather than the path itself.

        var vm = this;
        var selectedGroup = null;
        var groupBounds = null;
        var hitResult = null;
        var status = null;

        // On mouseDown functionality
        function mouseDown(e) {

            // Save hitResult
            hitResult = paper.project.hitTest(e.point, vm.hitOptions)

            // Check if user has selected a point within the bounds rectangle.
            // Then assume their intention is to drag the item.
            if(groupBounds && groupBounds.contains(e.point)){
                groupBounds.selected = true;
                status = 'moving'

            // Check if use selected something
            } else if(hitResult) {

                // Remove previous itemBounds rect as housekeeping.
                if(groupBounds){
                    groupBounds.remove()
                }

                // Check if item
                if (hitResult.type == 'segment'     ||
                    hitResult.type == 'fill'        ||
                    hitResult.type == 'stroke') {

                    if(!e.modifiers.shift){
                        vm.paperScope.project.deselectAll()
                    }

                    // Select item
                    hitResult.item.selected = true

                    // Created selectedGroup
                    selectedGroup = new paper.Group(vm.paperScope.project.selectedItems)
                    selectedGroup.selected = true

                    // Draw bounding rectangle for selectedGroup
                    groupBounds = new paper.Path.Rectangle(selectedGroup.strokeBounds);
                    groupBounds.selected = true;

                    // Set transform status
                    status = 'moving'

                // Else check if item bounds
                // User can only click bounds after clicking item therefore
                // can leave var item as is.
                } else if (hitResult.type == 'bounds') {
                    groupBounds.selected = true
                    status = 'scaling'
                }



            // Else nothing was selected
            } else {
                vm.paperScope.project.deselectAll()
                selectedGroup = null;
                status = null;
                groupBounds = null;
            }
        }

        // On mouseMove functionality
        function mouseMove(e) {

            hitResult = paper.project.hitTest(e.point, vm.hitOptions)

            // Adjust cursor icon based on hitResult
            if (hitResult && (hitResult.name == 'top-right' || hitResult.name == 'bottom-left')) {
                document.getElementById('paper-canvas').style.cursor = "nesw-resize";
            } else if (hitResult && (hitResult.name == 'top-left' || hitResult.name == 'bottom-right')) {
                document.getElementById('paper-canvas').style.cursor = "nwse-resize";
            } else {
                document.getElementById('paper-canvas').style.cursor = "auto";
            }
        }

        // On mouseDrag functionality
        function mouseDrag (e) {

            // TODO: on dragging one corner past the opposite the item should be
            // mirrored along that diagonal axis. Instead it's be scaled by the
            // magnitude of the distance.

            if (status == 'moving') {
                selectedGroup.position = selectedGroup.position.add(e.delta);
                groupBounds.position = groupBounds.position.add(e.delta);
                groupBounds.selected = true

            // If clicked on the boundary then need to scale in some way.
            } else if (status == 'scaling') {

                // Itembounds rectangle for scale factor rectangle
                var scaleRect = groupBounds.bounds;
                scaleRect.selected = true

                // Check exactly which handle affected in order to adjust scaling point
                if (hitResult.name == 'top-left') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.topRight.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.bottomLeft.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    selectedGroup.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomRight)
                    groupBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomRight)

                } else if (hitResult && hitResult.name == 'top-right') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.topLeft.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.bottomRight.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    selectedGroup.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomLeft)
                    groupBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.bottomLeft)

                } else if (hitResult && hitResult.name == 'bottom-right') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.bottomLeft.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.topRight.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    selectedGroup.scale(horizScaleFactor, vertScaleFactor, scaleRect.topLeft)
                    groupBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.topLeft)

                } else if (hitResult && hitResult.name == 'bottom-left') {

                    // Calc scale factors
                    var newWidth = e.point.x - scaleRect.bottomRight.x;
                    var horizScaleFactor = Math.abs(newWidth/scaleRect.width);

                    var newHeight = e.point.y - scaleRect.topLeft.y;
                    var vertScaleFactor = Math.abs(newHeight/scaleRect.height);

                    // Scale items
                    selectedGroup.scale(horizScaleFactor, vertScaleFactor, scaleRect.topRight)
                    groupBounds.scale(horizScaleFactor, vertScaleFactor, scaleRect.topRight)
                }
            }
        }

        // On backSpace KeyEvent
        function onKeyUp (e) {

            if (e.key == 'backspace'){
                // Check for current selection
                if (vm.paperScope.project.selectedItems) {

                    // For each item selected remove if not a layer
                    vm.paperScope.project.selectedItems.forEach(function(item){
                        if(item.className != 'Layer'){
                            item.remove()
                        }
                    })

                    // If itemBounds has been added then remove this also
                    if(groupBounds){
                        groupBounds.remove()
                    }
                }
            }
        }

        // on MouseUp housekeeping functionality.
        function mouseUp (e) {
            hitResult = null;
        }

        this.toolMove = new paper.Tool()
        this.toolMove.onMouseDown = mouseDown
        this.toolMove.onMouseDrag = mouseDrag
        this.toolMove.onMouseUp = mouseUp
        this.toolMove.onKeyUp = onKeyUp
        this.toolMove.onMouseMove = mouseMove
    }
}

</script>

<style lang="css">
</style>
