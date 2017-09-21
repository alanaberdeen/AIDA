<template lang="html">

    <v-btn @click.native="initialiseTool" flat block>
        <v-icon v-if="this.active"
                class="blue--text text--darken-1">
                lock_open
        </v-icon>

        <v-icon v-else class='grey--text text--darken-2'>
            lock_outline
        </v-icon>
    </v-btn>

</template>

<script>
// TODO: Add a keyboard short cut that can be held down to activate
// pan and zoom controls.
export default {
    props: ['active'],
    data() {
        return {
            toolPan: null,
        }
    },

    methods: {
        initialiseTool() {
            // Relinquish control of PaperJS interface
            document.getElementById('paper-canvas').setAttribute("class", "pointers-no");
        }
    },

    mounted() {
        this.initialiseTool();
    }
}
</script>

<style lang="css">
</style>
