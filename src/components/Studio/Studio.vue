<template lang="html">
    <div class='pointers-please studioPanel elevation-2'>

        <app-layers :paperScope='paperScope'>
        </app-layers>

        <app-channels   :paperScope='paperScope'
                        :osdViewer='osdViewer'
                        :config='config'>
        </app-channels>

        <app-properties   :paperScope='paperScope'
                          :osdViewer='osdViewer'
                         >
        </app-properties>

    </div>

</template>

<script>
// Import child components
import layers from './Layers.vue'
import channels from './Channels.vue'
import properties from './Properties.vue'

export default {
    props: ['paperScope', 'osdViewer', 'config'],

    components: {
        'app-layers': layers,
        'app-channels': channels,
        'app-properties': properties
    }
}
</script>

<style lang="css" scoped>

.studioPanel{
    height: calc(100vh - 48px);
    background: #EEEEEE;
}


</style>
