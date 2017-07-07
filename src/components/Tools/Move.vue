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
import paper from 'paper';
import { eventBus } from '../../main';

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
            };


        }
    },

    created() {
        var vm = this;
        var hitResult = null;

        var selectedGroup = null;
        var toBeSelected = [];
        var selectionRect = new paper.Path.Rectangle([0,0], 0);
        selectionRect.remove();

        var toolStatus = '';
        var projectPathItems = null;

        // Based on the mouseEvent set the appropriate tool toolStatus.
        function toolDown(e) {

            // Get details of the element the user has clicked on.
            hitResult = vm.paperScope.project.hitTest(e.point, vm.selectOptions);

            // Check which path items are in the project at this moment.
            // This is useful for group selection.
            projectPathItems = vm.paperScope.project.getItems({
                className: 'Path'
            })

            // If user clicked inside a bounds selection rectangle
            if (selectedGroup && selectedGroup.bounds.contains(e.point) && !e.modifiers.shift){
                if(hitResult && hitResult.type === 'bounds'){
                    // Do nothing if they selected the boundary itself.
                } else {
                    toolStatus = 'move';
                    return
                }
            }

            // Remove bounds rectangle of previous selection as will always
            // be updated.
            if (selectedGroup) {
                selectedGroup.bounds.selected = false;
            }

            // If no modiefiers and item has been selected then create the
            // selection group and select the bounding rectangle.
            if (hitResult                       &&
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
            } else if (hitResult && hitResult.type === 'bounds'){
                toolStatus = 'transform';

                if (selectedGroup){
                    selectedGroup.selected = true;
                    selectedGroup.bounds.selected = true;
                }


            // If shift modifer is pressed then assume adding element(s).
            } else if (e.modifiers.shift){

                if (hitResult &&
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
                if (selectedGroup){
                    selectedGroup.selected = true;
                    selectedGroup.bounds.selected = true;
                }

                toolStatus = 'select';
            } else {
                vm.paperScope.project.deselectAll();
                selectedGroup = null;
                toolStatus = 'select';
            }
        }

        // Functionality for user dragging the tool.
        // Specified action should have been set on the mouseDown event.
        function toolDrag(e) {

            // Draggable selection box.
            if (toolStatus === 'select'){

                // Repeatedly draw the box as specified.
                var width = e.point.x - e.downPoint.x;
                var height = e.point.y - e.downPoint.y;

                selectionRect.remove();

                // Rebuild as defined by new config
                selectionRect = new paper.Path.Rectangle(e.downPoint.x, e.downPoint.y, width, height);
                selectionRect.strokeColor = '#4D88D4';
                selectionRect.fillColor = '#A3C5E8';
                selectionRect.opacity = 0.4;
                selectionRect.strokeWidth = vm.selectOptions.tolerance;

                // For each item in the project check if they are inside the
                // box and select them if so.
                for (var path in projectPathItems) {
                    if (projectPathItems.hasOwnProperty(path)) {
                        if (projectPathItems[path].isInside(selectionRect.bounds)){
                            projectPathItems[path].selected = true;

                            // Add to array of items to be selected
                            toBeSelected.push(projectPathItems[path]);
                        } else {
                            projectPathItems[path].selected = false;

                            // Remove from array of items to be selected
                            var index = toBeSelected.indexOf(projectPathItems[path]);
                            if (index > -1) {
                                toBeSelected.splice(index, 1);
                            }
                        }
                    }
                }

            } else if (toolStatus === 'move'){
                selectedGroup.position = selectedGroup.position.add(e.delta);

            } else if (toolStatus === 'transform'){
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

        // Check for multiple selections and adjust if so.
        function toolUp(e) {

            if (toolStatus === 'select') {
                if (e.modifiers.shift){
                    if(!selectedGroup){
                        selectedGroup = new paper.Group(toBeSelected);
                    } else {
                        selectedGroup.addChildren(toBeSelected);
                    }
                } else {
                    // Deselect all current selection
                    vm.paperScope.project.deselectAll();
                    selectedGroup = new paper.Group(toBeSelected);
                }

                // Select the items in the group
                if (selectedGroup && selectedGroup.hasChildren()){
                    selectedGroup.selected = true;
                    selectedGroup.bounds.selected = true;
                }
            }

            // Housekeeping
            toolStatus = '';
            selectionRect.remove();
            toBeSelected = [];

            // Emit selection event to the eventBus so that the properties
            // panel can be updated.
            eventBus.$emit('selectionChanged', vm.paperScope.project.selectedItems);

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
                        if (item.className != 'Layer'){
                            item.remove();
                        }
                    })
                }

                // Emit selection event to the eventBus so that the properties
                // panel can be updated.
                eventBus.$emit('selectionChanged', vm.paperScope.project.selectedItems);
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
