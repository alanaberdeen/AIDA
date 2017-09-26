<template lang="html">
    <v-list-tile id='tool-tile'>
        <v-btn @click.native="initialiseTool" flat block id='tool'>
            <v-icon v-if="this.active"
                    class="blue--text text--darken-1">
                    lock_open
            </v-icon>

            <v-icon v-else class='grey--text text--darken-2'>
                lock_outline
            </v-icon>
        </v-btn>
    </v-list-tile>

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

#tool {
    min-width: 0px;
}

#tool-tile {
    padding: 0px;
    min-width: 0px;
}
</style>
