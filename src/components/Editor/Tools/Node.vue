<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <i :class="{
                'fa': true,
                'fa-location-arrow': true,
                'faIcons': !this.active,
                'faIconsActive': this.active
                }">
        </i>
    </v-btn>

</template>

<script>
import paper from 'paper'

import { mapActions } from 'vuex';
import { mapState } from 'vuex';

export default {
    props: ['active'],

    data() {
        return {
            toolNode: null,
            hitOptions: null
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
            this.toolNode.activate();

            // Selection options
            let hitTolerance = this.imageWidth / (this.viewportZoom*100);
            this.hitOptions = {
                segments: true,
                stroke: true,
                handles: true,
                fill: true,
                tolerance: hitTolerance
            }
        }
    },

    created() {

        // Result of user click interaction on PaperJS instancevent. 
        let hitResult = null;

        // Current tool status.
        let toolStatus = null;

        const toolDown = (event) => {

            // Get details of the element the user has clicked on.
            hitResult = this.paperScope.project.hitTest(event.point, this.hitOptions);

            // Check if use selected something
            if (hitResult) {

                // If item not currrently selected then select. 
                if (!hitResult.item.selected){
                    hitResult.item.selected = true;
                    toolStatus = 'selecting';

                // If user selects stroke then add node 
                } else if (hitResult.type === 'stroke') {
                    toolStatus = 'adding-node';

                // If user selecteds a segment. 
                } else if (hitResult.type === 'segment'){
                    // Select only that segment and associate handles. 
                    this.paperScope.project.deselectAll();
                    hitResult.item.selected = true;
                    hitResult.segment.selected = true; 
                    hitResult.segment.handleIn.selected = true;
                    hitResult.segment.handleOut.selected = true;

                    toolStatus = 'adjusting-segment';

                } else if ( hitResult.type === 'handle-out'   ||
                            hitResult.type === 'handle-in') {
                    toolStatus = 'adjusting-handle';
                }

            } else {
                this.paperScope.project.deselectAll();
            }
        };

        // On mouseDrag functionality
        const toolDrag = (event) => {

            if (hitResult && (toolStatus == 'adjusting-segment')) {
                hitResult.segment.point = hitResult.segment.point.add(event.delta);

            } else if ( hitResult &&
                        (hitResult.type == 'handle-out') &&
                        (toolStatus == 'adjusting-handle')) {
                hitResult.segment.handleOut = hitResult.segment.handleOut.add(event.delta);

            } else if ( hitResult &&
                        (hitResult.type == 'handle-in') &&
                        (toolStatus == 'adjusting-handle')) {
                hitResult.segment.handleIn = hitResult.segment.handleIn.add(event.delta);
            }
        };

        this.toolNode = new paper.Tool();
        this.toolNode.onMouseDown = toolDown;
        this.toolNode.onMouseDrag = toolDrag;
    }
}
</script>

<style lang="css">
</style>
