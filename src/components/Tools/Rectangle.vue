<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <v-icon :class="{'blue--text darken-2--text': this.active}">
                    crop_landscape
            </v-icon>
        </v-btn>
    </v-list-item>
</template>

<script>
import paper from 'paper'
import { eventBus } from '../../main'

export default {
    props: ['paperScope', 'active'],
    data() {
        return {
            toolRect: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolRect.activate();
        }
    },

    created() {

        // Deselect any current selection
        this.paperScope.project.deselectAll()

        // Define an intial rect just so we can always remove one where necessary
        // in the drawing loop.
        var rect = new paper.Path.Rectangle([100,100], 100)
        rect.remove()

        function drawRect(e) {
            var width = e.point.x - e.downPoint.x;
            var height = e.point.y - e.downPoint.y;

            // Remove in current config
            rect.remove();

            // Rebuild as defined by new config
            rect = new paper.Path.Rectangle(e.downPoint.x, e.downPoint.y, width,height)
            rect.strokeColor = 'red';
            rect.strokeWidth = 400;
        }

        function keepRect(e){
            var myRect = rect.clone();
            rect.remove();
        }

        this.toolRect = new paper.Tool();
        this.toolRect.onMouseDrag = drawRect;
        this.toolRect.onMouseUp = keepRect
        this.toolRect.activate();
    }

}
</script>

<style lang="css">
</style>
