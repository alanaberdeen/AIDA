<template lang="html">
    <v-toolbar dark dense class="primary pointers-please">
        <v-toolbar-title class='white--text'>AIDA</v-toolbar-title>
        <v-spacer></v-spacer>

        <app-settings   :config='config'
                        :osdViewer='osdViewer'
                        :paperScope='paperScope'>
        </app-settings>

    </v-toolbar>
</template>

<script>

// Import child components
import Settings from './Settings/Settings.vue'

export default {
    props: ['config', 'osdViewer', 'paperScope'],

    components: {
        'app-settings': Settings
    }
}

</script>

<style lang="css">
</style>
