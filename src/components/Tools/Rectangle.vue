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
        this.paperScope.project.deselectAll();

        // Define an intial rect just so we can always remove one where necessary
        // in the drawing loop.
        var rect = new paper.Path.Rectangle([100,100], 100);
        rect.remove();

        function toolDrag(e) {
            var width = e.point.x - e.downPoint.x;
            var height = e.point.y - e.downPoint.y;

            // Remove in current config
            rect.remove();

            // Rebuild as defined by new config
            rect = new paper.Path.Rectangle(e.downPoint.x, e.downPoint.y, width,height);
            rect.strokeColor = new paper.Color({hue: 350, saturation: 0.7, lightness: 0.5, alpha: 1});
            rect.strokeWidth = 400;
        }

        function toolUp(e){
            var myRect = rect.clone();
            myRect.fillColor = new paper.Color({hue: 350, saturation: 0.7, lightness: 0.5, alpha: 0.4});
            rect.remove();
        }

        this.toolRect = new paper.Tool();
        this.toolRect.onMouseDrag = toolDrag;
        this.toolRect.onMouseUp = toolUp;
    }

}
</script>

<style lang="css">
</style>
