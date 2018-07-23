// View.vue
// Component creates a view. This is a combination of an image canvas (either
// deepZoom or standard) and an annotation canvas. When the components are
// mounted they are setup with the appropriate librarys.
<template lang="html">

  <div
    id="view"
    class="elevation-2 pointers-please">

    <!-- OpenSeadragon canvas -->
    <app-osd-canvas/>

    <!-- Annotation canvas -->
    <app-annotation-canvas/>

  </div>

</template>

<script>
import { mapActions } from 'vuex'

// Import child components
import OSDCanvas from './OSDCanvas.vue'
import AnnotationCanvas from './AnnotationCanvas.vue'

export default {
  components: {
    'app-osd-canvas': OSDCanvas,
    'app-annotation-canvas': AnnotationCanvas
  },

  props: {
    type: {
      type: String,
      default: 'examples'
    }
  },

  mounted () {
    // Ensure the size of the PaperJS annotation view and the OpenSeaDragon
    // viewer are always synchronised.
    this.synchroniseAnnotationAndOSDCanvas()

    // Load project data from the API, pass the type of project we are loading
    // as a parameter. This can be either a 'dzi' or a 'standard' image.
    this.loadProject(this.type)
  },

  // When the view element is removed from the app (ie. the user navigates away)
  // apply all the cleaning functionality and reset the state.
  destroyed () {
    this.resetStateToDefault()
  },

  methods: {
    ...mapActions({
      synchroniseAnnotationAndOSDCanvas: 'common/synchroniseAnnotationAndOSDCanvas',
      loadProject: 'common/loadProject',
      resetStateToDefault: 'common/resetStateToDefault'
    })
  }
}
</script>

<style lang='css' scoped>
#view {
  position: relative;
  display: inline-flex;
  flex: 1;
  flex-basis: auto;
}
</style>
