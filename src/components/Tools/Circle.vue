<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <i :class="{
                    'fa': true,
                    'fa-circle': true,
                    'faIcons': !this.active,
                    'faIconsActive': this.active
                    }">
            </i>
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
            toolCircle: null,
        }
    },

    methods: {
        initialiseTool() {
            if (this.paperScope.view.element.classList.contains('pointers-no')){
                this.paperScope.view.element.classList.remove('pointers-no')
            }
            this.toolCircle.activate();
        },
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
            myCircle.strokeColor = new paper.Color({hue: 140, saturation: 0.7, lightness: 0.5, alpha: 1});
            myCircle.fillColor = new paper.Color({hue: 140, saturation: 0.7, lightness: 0.5, alpha: 0.4});
        }

        this.toolCircle = new paper.Tool();
        this.toolCircle.onMouseDown = plotCirlce
    }
}
</script>

<style lang="css">


</style>
