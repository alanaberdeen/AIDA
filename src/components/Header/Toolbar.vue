<template lang="html">
    <v-toolbar :fixed="true" dark dense class="primary pointers-please">

        <!-- Home -->
        <v-toolbar-title class='white--text'>
            <router-link to='/'>
                AIDA
            </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Save -->
        <app-save></app-save>

        <!-- Dashboard -->
        <v-btn icon href='https://imageannotation.nds.ox.ac.uk:8443/AIDA/'>
            <v-icon> apps</v-icon>
        </v-btn>

        <!-- Docs -->
        <router-link to='/docs'>
            <v-btn icon >
                <v-icon> fa-book </v-icon>
            </v-btn>
        </router-link>

        <!-- <v-btn icon class="pointers-no">
            <app-settings   :config='config'
                            :osdViewer='osdViewer'
                            :paperScope='paperScope'>
            </app-settings>
        </v-btn> -->

        <!-- Account -->
        <v-btn icon class="pointers-no">
            <app-account>
            </app-account>
        </v-btn>

    </v-toolbar>
</template>

<script>

// Import child components
import Settings from './settings/Settings.vue';
import Account from './account/Account.vue';
import Save from './save/Save.vue';

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
