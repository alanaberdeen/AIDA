<template lang="html">
  <v-navigation-drawer
    fixed
    clipped
    app
    @input="updateStudioDrawerState"
    :value="this.studioDrawer"
    right
    mobile-break-point="1000"
    v-if="['loading', 'landing', 'examples'].indexOf($route.name) === -1"
  >
    <div class="studioPanel">
      <app-navigator/>
      <app-layers/>
      <app-images/>
      <app-properties/>
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
// import validations from './Validations.vue'

export default {
  components: {
    'app-navigator': navigator,
    'app-layers': layers,
    'app-images': images,
    'app-properties': properties
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
  background: #fafafa;
  overflow: auto;
  height: 100%;
}
</style>
