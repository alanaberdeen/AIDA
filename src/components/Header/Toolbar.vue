<template lang="html">
    <v-toolbar class="pointers-please">
        <v-toolbar-logo class='white--text'>AIDA</v-toolbar-logo>
        <v-toolbar-items>
            <v-toolbar-item>
                <app-settings   :config='config'
                                :osdViewer='osdViewer'
                                :paperScope='paperScope'></app-settings>
            </v-toolbar-item>
        </v-toolbar-items>
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
