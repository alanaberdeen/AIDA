// View.vue
// Component creates a view. This is a combination of an image canvas (either
// deepZoom or standard) and an annotation canvas. When the components are
// mounted they are setup with the appropriate librarys.
<template lang="html">

  <div
    id="view"
    class="elevation-2 pointers-please">

    <app-osd-canvas/>

    <app-annotation-canvas/>

  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

import OSDCanvas from './OSDCanvas.vue'
import AnnotationCanvas from './AnnotationCanvas.vue'

export default {
  components: {
    'app-osd-canvas': OSDCanvas,
    'app-annotation-canvas': AnnotationCanvas
  },

  computed: {
    ...mapState({
      imageName: state => state.image.imageName
    })
  },

  mounted () {
    if (!this.imageName) {
      this.$router.replace('/')
    } else {
      this.loadProject()
    }
  },

  methods: {
    ...mapActions({
      loadProject: 'app/loadProject'
    })
  }
}
</script>

<style scoped>
#view {
  position: relative;
  display: flex;
  flex: 1 1 auto;
}
</style>
