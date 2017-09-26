<template lang="html">
    <v-list-tile id='tool-tile'>
        <v-btn @click.native="initialiseTool" flat block id='tool'>
            <v-icon :class="{'grey--text text--darken-2': !this.active,
                             'blue--text text--darken-1': this.active}">
                    timeline
            </v-icon>
        </v-btn>
    </v-list-tile>

</template>

<script>
import paper from 'paper';

import { mapActions } from 'vuex';
import { mapState } from 'vuex';

export default {
    props: ['active'],

    data() {
        return {
            toolPen: null,
            strokeWidth: 400, // Default value, will be updated relative to view
            hitOptions: null,
            path: null
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
            this.toolPen.activate();

            // Set tool stroke width and hitOptions settings.
            this.strokeWidth = this.imageWidth/(this.viewportZoom*500);
            this.hitOptions = {
                segments: true,
                tolerance: this.strokeWidth*5
            };
        },

        newPath() {
            let newPath = new paper.Path();
            newPath.strokeColor = new paper.Color({hue: 20, saturation: 0.7, lightness: 0.5, alpha: 1});
            newPath.strokeWidth = this.strokeWidth;
            newPath.selected = true;

            return newPath
        }
    },

    created() {

        const toolDown = (event) => {

            // If there is no current active path then create one.
            if (!this.path || !this.path.data.active){
                this.path = this.newPath()
                this.path.data.active = true;
            }

            let hitResult = this.path.hitTest(event.point, this.hitOptions);

            // If option key is held down then close the path.
            if (event.modifiers.option) {
                this.path.closed = true;
                this.path.smooth();
                this.path.selected = false;
                this.path.data.active = false;

            // If first segment clicked, close path.
            } else if (hitResult && hitResult.segment == this.path.firstSegment){
                this.path.closed = true;
                this.path.fillColor = new paper.Color({hue: 20, saturation: 0.7, lightness: 0.5, alpha: 0.4});
                this.path.smooth();
                this.path.selected = false;
                this.path.data.active = false;

            // If last segment clicked close path.
            } else if (hitResult && hitResult.segment == this.path.lastSegment) {
                this.path.selected = false;
                this.path.data.active = false;

            // Else add new point
            } else {
                this.path.add(event.point)
                this.path.smooth();
            }
        };

        // Feedfoward information on mouseMove
        const toolMove = (event) => {
            let hitResult = this.paperScope.project.hitTest(event.point, this.hitOptions);

            // If hovering over first/last segment then remove the selected
            // highlighting to indicate path will be finsihed.
            if (hitResult) {
                if (hitResult.segment == hitResult.item.firstSegment){
                    this.path.closed = true;
                    this.path.selected = false;
                } else if (hitResult.segment == hitResult.item.firstSegment ||
                           hitResult.segment == hitResult.item.lastSegment){
                    this.path.selected = false;
                }
            } else {
                if (this.path && this.path.data.active){
                    this.path.selected = true;
                    this.path.closed = false;
                }
            }
        };

        this.toolPen = new paper.Tool();
        this.toolPen.onMouseDown = toolDown;
        this.toolPen.onMouseMove = toolMove;
    }
}

</script>

<style lang="css">

#tool {
    min-width: 0px;
}

#tool-tile {
    padding: 0px;
}
</style>
