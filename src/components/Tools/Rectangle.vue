<template lang="html">
    <v-btn @click.native="toolRect.activate()" primary dark>
        <v-icon class="white--text text--lighten-1">crop_landscape</v-icon>
    </v-btn>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolRect: null
        }
    },

    created() {

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
            rect.strokeColor = 'black';
            rect.strokeWidth = 1;
        }

        function keepRect(e){
            var myRect = rect.clone();
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
