<template>
    <v-app toolbar pointer-events='none'>
        <header>
            <app-toolbar>
            </app-toolbar>
        </header>

        <main>
            <app-editor></app-editor>
        </main>

        <!-- <app-footer></app-footer> -->
    </v-app>
</template>

<script>
// Import child components
import Editor from './components/editor/Editor.vue';
import Toolbar from './components/header/Toolbar.vue';
import Footer from './components/Footer.vue';

import { eventBus } from './main';

export default {
    components: {
        'app-editor': Editor,
        'app-toolbar': Toolbar,
        'app-footer': Footer,
    }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>
