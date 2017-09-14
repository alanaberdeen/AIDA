<template lang="html">
    <v-toolbar dark dense class="primary pointers-please">
        <v-toolbar-title class='white--text'>AIDA</v-toolbar-title>
        <v-spacer></v-spacer>

        <app-home>
        </app-home>

        <app-save   :paperScope='paperScope'>
        </app-save>

        <!-- <v-btn icon class="pointers-no">
            <app-settings   :config='config'
                            :osdViewer='osdViewer'
                            :paperScope='paperScope'>
            </app-settings>
        </v-btn> -->

        <v-btn icon class="pointers-no">
            <app-account>
            </app-account>
        </v-btn>

    </v-toolbar>
</template>

<script>

// Import child components
import Settings from './Settings/Settings.vue';
import Account from './Account/Account.vue';
import Home from './Home/Home.vue';
import Save from './Save/Save.vue';


export default {
    props: ['config', 'osdViewer', 'paperScope'],

    components: {
        'app-settings': Settings,
        'app-account': Account,
        'app-home': Home,
        'app-save': Save
    }
}

</script>

<style lang="css">
</style>
