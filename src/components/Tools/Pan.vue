<template lang="html">
    <v-btn @click.native="initialiseTool" primary dark>
        <i class="fa fa-hand-paper-o" aria-hidden="true"></i>
    </v-btn>
</template>

<script>
import paper from 'paper'
import openseadragon from 'openseadragon'

export default {
    props: ['paperScope', 'osdViewer'],
    data() {
        return {
            toolPan: null,
        }
    },

    methods: {
        initialiseTool() {
            // Relinquish control of PaperJS interface
            this.paperScope.view.element.setAttribute("class", "pointers-no");
        }
    }
}
</script>

<style lang="css">
</style>
