<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class="tool elevation-1">
            <v-icon :class="{'blue--text darken-2--text': this.active}">
                    timeline
            </v-icon>
        </v-btn>
    </v-list-item>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope', 'active'],
    data() {
        return {
            toolPen: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolPen.activate();
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

        this.toolPen = new paper.Tool()
        this.toolPen.onMouseDown = addPoint
    }
}

</script>

<style lang="css">
</style>
