<template lang="html">
    <v-toolbar dark dense class="primary pointers-please">
        <v-toolbar-title class='white--text'>
                    <a href="https://imageannotation.nds.ox.ac.uk:8443/AIDA/">
                        AIDA
                    </a>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <app-save></app-save>

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
import Save from './Save/Save.vue';

export default {
    components: {
        'app-settings': Settings,
        'app-account': Account,
        'app-save': Save
    }
}

</script>

<style lang="css">
a {
  color: inherit;              
  text-decoration: inherit;     
}
</style>
