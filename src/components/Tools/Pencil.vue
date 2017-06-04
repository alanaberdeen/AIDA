<template lang="html">
    <v-btn @click.native="initialiseTool" primary dark>
        <v-icon class="white--text text--lighten-1">timeline</v-icon>
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

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolPencil.activate();
        }
    },

    created() {
        // Create a new path once, when the script is executed:
        var myPath = new paper.Path();
        myPath.strokeColor = 'red';
        myPath.strokeWidth = 100;

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
