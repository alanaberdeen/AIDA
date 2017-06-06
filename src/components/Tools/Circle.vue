<template lang="html">
    <v-btn @click.native="initialiseTool" primary dark>
        <i class="fa fa-circle" aria-hidden="true"></i>
    </v-btn>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolCircle: null
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolCircle.activate();
        }
    },

    created() {
        // Plot a cirlce at pointer location
        function plotCirlce(event) {
            var centerX = Math.round(event.point.x)
            var centerY = Math.round(event.point.y)
            var myCircle = new paper.Path.Circle(new paper.Point(centerX, centerY), 3000)
            myCircle.fillColor = 'red'
        }

        this.toolCircle = new paper.Tool();
        this.toolCircle.onMouseDown = plotCirlce
    }
}
</script>

<style lang="css">
</style>
