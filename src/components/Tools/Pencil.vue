<template lang="html">
    <v-btn @click.native="toolPencil.activate()" primary dark>
        <i class="fa fa-pencil" aria-hidden="true"></i>
    </v-btn>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolPencil: null
        }
    },

    created() {
        // Create a new path once, when the script is executed:
        var myPath = new paper.Path();
        myPath.strokeColor = 'black';

        function addPoint(event) {
            // If option key is held down then close the path
            if(event.modifiers.option) {
                myPath.closed = true;
                myPath.smooth()
            } else {
                // Add a segment to the path at the position of the mouse:
                myPath.add(event.point);
                myPath.smooth()
            }

        }

        this.toolPencil = new paper.Tool()
        this.toolPencil.onMouseDown = addPoint
    }
}

</script>

<style lang="css">
</style>
