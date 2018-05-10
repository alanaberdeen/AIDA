<template lang="html">
  <div class="pointers-please studioPanel elevation-2">

    <app-layers/>

    <app-channels/>

    <app-properties/>

  </div>

</template>

<script>
// Import child components
import layers from './LayersNew.vue'
import channels from './Channels.vue'
import properties from './Properties.vue'

export default {
  components: {
    'app-layers': layers,
    'app-channels': channels,
    'app-properties': properties
  }
}
</script>
<style lang='css' scoped>

.studioPanel{
  height: calc(100vh - 48px);
  background: #EEEEEE;
}
</style>
