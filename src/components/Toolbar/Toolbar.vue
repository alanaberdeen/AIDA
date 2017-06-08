<template lang="html">
    <v-toolbar class="pointers-please">
        <v-toolbar-logo class='white--text'>Annotate</v-toolbar-logo>
        <v-toolbar-items>
            <v-toolbar-item>
                <app-settings></app-settings>
            </v-toolbar-item>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>

// Import child components
import Settings from './Settings.vue'

export default {
    data() {
        return {

        }
    },

    components: {
        'app-settings': Settings
    }
}

</script>

<style lang="css">
</style>
