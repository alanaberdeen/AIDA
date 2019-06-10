// Studio.vue
// Component defines the studio; the interaction elements on the right side of
// the app.
<template lang="html">
  <v-navigation-drawer
    id="studio-drawer"
    fixed
    clipped
    @input="updateStudioDrawerState"
    :value="this.studioDrawer"
    app
    right
    mobile-break-point="1000"
    v-if="['loading', 'landing', 'examples'].indexOf($route.name) === -1"
  >
    <div class="pointers-please studioPanel elevation-2">

      <!-- The minimap naigation element -->
      <app-navigator/>

      <!-- Display and control annotation layers -->
      <app-layers/>

      <!-- Display and control images in the instance -->
      <app-images/>

      <!-- Display and control properties of the selected items -->
      <app-properties/>

      <!-- Display the validation history of the selected item -->
      <!-- <app-validations/> -->

    </div>
  </v-navigation-drawer>

</template>

<script>
import { mapState, mapActions } from 'vuex'

import navigator from './Navigator.vue'
import layers from './layers/Layers.vue'
import images from './Images.vue'
import properties from './properties/Properties.vue'
import validations from './Validations.vue'

export default {
  components: {
    'app-navigator': navigator,
    'app-layers': layers,
    'app-images': images,
    'app-properties': properties,
    'app-validations': validations
  },

  computed: {
    ...mapState({
      studioDrawer: state => state.app.studioDrawer
    })
  },

  methods: {
    ...mapActions({
      setStudioDrawerState: 'app/setStudioDrawerState'
    }),

    updateStudioDrawerState (state) {
      if (!state) {
        this.setStudioDrawerState(state)
      }
    }
  }
}
</script>
<style lang='css' scoped>
.studioPanel {
  background: #eeeeee;
  overflow: auto;
}
</style>
