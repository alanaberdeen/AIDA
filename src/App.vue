<template>
    <v-app toolbar pointer-events='none'>
        <router-view></router-view>
    </v-app>
</template>

<script>
// Import child components
import Toolbar from './components/header/Toolbar.vue';

export default {
    components: {
        'app-toolbar': Toolbar,
    }
}
</script>

<style lang="stylus">
    @import '../node_modules/vuetify/src/stylus/main'
    @import './css/main.css'
</style>
