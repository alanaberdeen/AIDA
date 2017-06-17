<template lang="html">
    <v-list-item>
        <v-btn @click.native="initialiseTool" block class='tool elevation-1'>
            <i :class="{
                    'fa': true,
                    'fa-lock': !this.active,
                    'faIcons': !this.active,
                    'faIconsActive': this.active,
                    'fa-unlock': this.active
                    }">
            </i>
        </v-btn>
    </v-list-item>
</template>

<script>
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
    }
}
</script>

<style lang="css">
</style>
