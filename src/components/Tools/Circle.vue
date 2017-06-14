<template lang="html">
    <v-btn @click.native="initialiseTool" primary dark :class='buttonClasses'>
        <i :class="iconClasses" aria-hidden="true"></i>
    </v-btn>
</template>

<script>
import paper from 'paper'
import { eventBus } from '../../main'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolCircle: null,
            iconClasses: {
                'fa': true,
                'fa-circle': true,
                'fa-icons': true
            }

        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolCircle.activate();

            // Save tool name as currently active
            eventBus.$emit('toolActivated', 'circle')
        }
    },

    computed: {
        buttonClasses: function() {
            return {
                'btn--light-flat-pressed': true,
                'z-depth-2': true
            }
        }
    },

    created() {
        var vm = this;

        // Plot a cirlce at pointer location
        function plotCirlce(event) {

            // Deselect all current selections
            vm.paperScope.project.deselectAll()

            var centerX = Math.round(event.point.x)
            var centerY = Math.round(event.point.y)
            var myCircle = new paper.Path.Circle(new paper.Point(centerX, centerY), 1000)
            myCircle.fillColor = 'red'
        }

        this.toolCircle = new paper.Tool();
        this.toolCircle.onMouseDown = plotCirlce
    }
}
</script>

<style lang="css">
</style>
