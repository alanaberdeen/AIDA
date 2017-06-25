<template lang="html">
    <div class='pointers-please right-panel elevation-2'>
        <v-list>
            <v-list-item>
                <app-layers :paperScope='paperScope'>
                </app-layers>
            </v-list-item>

            <v-list-item>
                <app-channels   :paperScope='paperScope'
                                :osdViewer='osdViewer'>
                </app-channels>
            </v-list-item>
        </v-list>
    </div>

</template>

<script>
// Import child components
import layers from './Layers.vue'
import channels from './Channels.vue'

export default {
    props: ['paperScope', 'osdViewer'],

    components: {
        'app-layers': layers,
        'app-channels': channels
    }
}
</script>

<style lang="css" scoped>

.right-panel{
    margin-top: 0px;
    width: 100%;
    height: 100vh;
    background-color: #EEEEEE;
}

</style>
