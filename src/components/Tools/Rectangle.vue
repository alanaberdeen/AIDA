<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <v-icon :class="{'grey--text text--darken-2': !this.active,
                         'blue--text text--darken-1': this.active}">
                crop_landscape
        </v-icon>
    </v-btn>

</template>

<script>
import paper from 'paper';

import { mapActions } from 'vuex';
import { mapState } from 'vuex';

export default {
    props: ['active'],

    data() {
        return {
            toolRect: null,
            strokeWidth: 400, // Default value, will be updated relative to view 
            diagonal: 2000
        }
    },

    computed: {
        ...mapState({
            paperScope: state => state.annotation.paperScope,
            viewportZoom: state => state.image.viewer.viewport.getZoom(true),
            imageWidth: state => state.image.viewer.world.getItemAt(0).getContentSize().x
        })
    },

    methods: {
        ...mapActions([
            'prepareCanvas'
        ]),

        initialiseTool() {

            // Prepare PaperJS canvas for interaction.
            this.prepareCanvas();

            // Activate the paperJS tool. 
            this.toolRect.activate();

            // Set the default diagonal length relative to image size and zoom.
            this.diagonal = this.imageWidth/(this.viewportZoom*100);
            this.strokeWidth = this.imageWidth/(this.viewportZoom*500);
        },

        // Helper function - calculate distance between 2 points:
        calculateDistance(firstPoint, secondPoint){
            let x1 = firstPoint.x;
            let y1 = firstPoint.y;
            let x2 = secondPoint.x;
            let y2 = secondPoint.y;

            let distance = Math.sqrt((Math.pow((x2-x1), 2))+(Math.pow((y2-y1), 2)));
            return distance;
        }
    },

    created() {

        // On drag draw feedforward shadow rectangle in realtime.
        const toolDrag = (event) => {

        	this.diagonal = this.calculateDistance(event.downPoint, event.point)

        	let trackingRect = new paper.Path.Rectangle(event.downPoint, event.point);
                trackingRect.strokeColor = new paper.Color({hue: 220, saturation: 0.7, lightness: 0.5, alpha: 1});
                trackingRect.strokeWidth = this.strokeWidth;

        	// Constantly update tracking rect by removing it and re-drawing.
            trackingRect.removeOn({
                drag: true,
                down: true,
                up:true
            });
        };

        // Finalise rectangle properties and draw.
        const toolUp = (event) => {

        	let newRect = new paper.Path.Rectangle(event.downPoint, event.point);
            newRect.strokeColor = new paper.Color({hue: 350, saturation: 0.7, lightness: 0.5, alpha: 1});
            newRect.fillColor = new paper.Color({hue: 350, saturation: 0.7, lightness: 0.5, alpha: 0.4});
            newRect.strokeWidth = this.strokeWidth;
        };

        this.toolRect = new paper.Tool();
        this.toolRect.onMouseDrag = toolDrag;
        this.toolRect.onMouseUp = toolUp;
    }
}
</script>

<style lang="css">
</style>
