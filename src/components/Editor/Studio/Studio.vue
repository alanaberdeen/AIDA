<template lang="html">
  <div class="pointers-please studioPanel elevation-2">

    <app-navigator/>

    <app-layers/>

    <app-images/>

    <app-properties/>

  </div>

</template>

<script>
// Import child components
import navigator from './Navigator.vue'
import layers from './Layers.vue'
import images from './Images.vue'
import properties from './properties/Properties.vue'

export default {
  components: {
    'app-navigator': navigator,
    'app-layers': layers,
    'app-images': images,
    'app-properties': properties
  }
}
</script>
<style lang='css' scoped>
.studioPanel {
  height: calc(100vh - 48px);
  background: #eeeeee;
  overflow: auto;
}
</style>
