<template lang="html">
    <div class="pointers-please tools-container">
        <v-card class="tools-panel">
            <v-toolbar>
                <v-toolbar-title>Tools</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-list>
                <v-list-item>
                    <v-btn @click.native="toolCircle.activate()" primary dark>
                        <v-icon class="white--text text--lighten-1">radio_button_unchecked</v-icon>
                    </v-btn>
                    <v-divider></v-divider>
                    <v-btn @click.native="toolRect.activate()" primary dark>
                        <v-icon class="white--text text--lighten-1">crop_landscape</v-icon>
                    </v-btn>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    data() {
        return {
            toolCircle: null,
            toolRect: null
        }
    },

    created() {

        // ----------------------------------------
        // Tool to plot a cirlce at pointer location
        function plotCirlce(event) {
            var centerX = Math.round(event.point.x)
            var centerY = Math.round(event.point.y)
            var myCircle = new paper.Path.Circle(new paper.Point(centerX, centerY), 10)
            myCircle.fillColor = 'black'
        }

        this.toolCircle = new paper.Tool();
        this.toolCircle.onMouseDown = plotCirlce

        // ----------------------------------------
        // Tool to draw a rectangle using pointer
        var rect = new paper.Path.Rectangle([100,100], 100)
        function drawRect(e) {
            var width = e.point.x - e.downPoint.x;
            var height = e.point.y - e.downPoint.y;

            // Remove in current config
            rect.remove();

            // Rebuild in new config
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
    },

    methods: {
    }
}
</script>

<style lang="css">

.tools-container{
    margin-top: 24px;
    margin-left: 10px;
}

</style>
