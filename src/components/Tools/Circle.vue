<template lang="html">
    <v-btn @click.native="initialiseTool" primary dark>
        <i :class="dependentClasses" aria-hidden="true"></i>
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
        stateDialog() {
            console.log("Current dialog value is: " + this.dialog)
        },

        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolCircle.activate();

            // Save tool name as currently active
            //this.paperScope.data.activeTool = 'circle'
        }
    },

    computed: {
        dependentClasses: function() {
            return {
                'btn--light-flat-pressed': this.paperScope.data.activeTool == 'circle',
                'fa': true,
                'fa-circle': true,
                'fa-icons': true
            }
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
