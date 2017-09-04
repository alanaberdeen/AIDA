<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <v-icon v-if="this.active"
                class="blue--text darken-2--text">
                lock_open
        </v-icon>

        <v-icon v-else class='faIcons'>
            lock_outline
        </v-icon>
    </v-btn>

</template>

<script>
// TODO: Add a keyboard short cut that can be held down to activate
// pan and zoom controls.

// TODO: There is a difference in color for both active and in-active states
// for the Font Awesome Icons and the material icons. It's annoying.

import paper from 'paper'
import openseadragon from 'openseadragon'

export default {
    props: ['paperScope', 'osdViewer', 'active'],
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
    },

    created() {
        this.initialiseTool();
    }
}
</script>

<style lang="css">
</style>
