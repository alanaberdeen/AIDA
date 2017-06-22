<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <i :class="{
                    'fa': true,
                    'fa-mouse-pointer': true,
                    'faIcons': !this.active,
                    'faIconsActive': this.active
                }">
            </i>
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
            selectOptions: null
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
            var hitTolerance = 500/viewportZoom;
            this.selectOptions = {
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
        var selectedGroup = null;
        var toolStatus = '';

        // Based on the mouseEvent set the appropriate tool toolStatus.
        function toolDown(e) {

            // Get details of the element the user has clicked on.
            hitResult = vm.paperScope.project.hitTest(e.point, vm.selectOptions);
            console.log('The hitResult is: ');
            console.log(hitResult);

            if (selectedGroup && selectedGroup.bounds.contains(e.point) && !e.modifiers.shift){

                if(hitResult && hitResult.type === 'bounds'){

                } else {
                    toolStatus = 'move';
                    return
                }
            }

            // Remove bounds rectangle of previous selection as will always
            // be updated.
            if(selectedGroup) {
                selectedGroup.bounds.selected = false;
            }

            // If no modiefiers and item has been selected then create the
            // selection group and select the bounding rectangle.
            if( hitResult                       &&
                !e.modifiers.shift              &&
                hitResult.type !== 'bounds'     &&
                (   hitResult.type === 'fill'   ||
                    hitResult.type === 'stroke' ||
                    hitResult.type === 'segment'
                )){

                // If preivous selection then unselect it
                if (selectedGroup) {
                    selectedGroup.selected = false;
                }

                selectedGroup = new paper.Group([hitResult.item]);
                selectedGroup.selected = true;
                selectedGroup.bounds.selected = true;

                toolStatus = 'move';

            // If user has clicked bounds then assume transforming.
            } else if(hitResult && hitResult.type === 'bounds'){
                toolStatus = 'transform';

                if(selectedGroup){
                    selectedGroup.selected = true;
                    selectedGroup.bounds.selected = true;
                }


            // If shift modifer is pressed then assume adding element(s).
            } else if (e.modifiers.shift){

                if(hitResult &&
                    (   hitResult.type === 'fill'   ||
                        hitResult.type === 'stroke' ||
                        hitResult.type === 'segment'
                    )){

                        if(!selectedGroup){
                            selectedGroup = new paper.Group([hitResult.item]);
                        } else {
                            selectedGroup.addChild(hitResult.item);
                        }
                    }

                // Select the items in the group
                selectedGroup.selected = true;
                selectedGroup.bounds.selected = true;

                toolStatus = 'selecting';
            } else {
                vm.paperScope.project.deselectAll();
                selectedGroup = null;
                toolStatus = 'selecting';
            }
        }

        // Functionality for user dragging the tool.
        // Specified action should have been set on the mouseDown event.
        function toolDrag(e) {

            if(toolStatus === 'move'){
                selectedGroup.position = selectedGroup.position.add(e.delta);

            } else if(toolStatus === 'transform'){
                var newWidth = null;
                var newHeight = null;
                var transfromCenter = null;

                // Set tranformation parameters for each scaling option.
                if (hitResult && hitResult.name === 'top-left'){
                    newWidth = e.point.x - selectedGroup.bounds.topRight.x;
                    newHeight = e.point.y - selectedGroup.bounds.bottomLeft.y;
                    transfromCenter = selectedGroup.bounds.bottomRight;
                } else if (hitResult && hitResult.name === 'top-right') {
                    newWidth = e.point.x - selectedGroup.bounds.topLeft.x;
                    newHeight = e.point.y - selectedGroup.bounds.bottomRight.y;
                    transfromCenter = selectedGroup.bounds.bottomLeft;
                } else if (hitResult && hitResult.name === 'bottom-right') {
                    newWidth = e.point.x - selectedGroup.bounds.bottomLeft.x;
                    newHeight = e.point.y - selectedGroup.bounds.topRight.y;
                    transfromCenter = selectedGroup.bounds.topLeft;
                } else if (hitResult && hitResult.name === 'bottom-left') {
                    newWidth = e.point.x - selectedGroup.bounds.bottomRight.x;
                    newHeight = e.point.y - selectedGroup.bounds.topLeft.y;
                    transfromCenter = selectedGroup.bounds.topRight;
                }

            // Set scale factors.
            var horizScaleFactor = Math.abs(newWidth/selectedGroup.bounds.width);
            var vertScaleFactor = Math.abs(newHeight/selectedGroup.bounds.height);

            // Scale group
            selectedGroup.scale(horizScaleFactor, vertScaleFactor, transfromCenter)

            }
        }

        // Housekeeping on mouseUp toolEvent
        function toolUp(e) {
            toolStatus = '';
        }

        // Feedforward tool options
        function toolMove(e) {
            hitResult = vm.paperScope.project.hitTest(e.point, vm.selectOptions);

            if (hitResult) {
                if (hitResult.name === 'bottom-right' || hitResult.name === 'top-left') {
                    document.getElementById('paper-canvas').style.cursor = "nwse-resize";
                } else if (hitResult.name === 'bottom-left' || hitResult.name === 'top-right'){
                    document.getElementById('paper-canvas').style.cursor = "nesw-resize";
                }
            } else {
                document.getElementById('paper-canvas').style.cursor = "auto";
            }
        }

        // handlers for keyEvents.
        function toolKeyUp (e) {

            // Remove items
            if (e.key == 'backspace'){
                // Check for current selection
                if (vm.paperScope.project.selectedItems) {
                    // For each item selected remove if item is not a layer
                    vm.paperScope.project.selectedItems.forEach(function(item){
                        if(item.className != 'Layer'){
                            item.remove();
                        }
                    })
                }
            }
        }

        // Assign tool to paper instance.
        this.toolMove = new paper.Tool();
        this.toolMove.onMouseDown = toolDown;
        this.toolMove.onMouseDrag = toolDrag;
        this.toolMove.onMouseUp = toolUp;
        this.toolMove.onMouseMove = toolMove;
        this.toolMove.onKeyUp = toolKeyUp;

    }
}

</script>

<style lang="css">
</style>
