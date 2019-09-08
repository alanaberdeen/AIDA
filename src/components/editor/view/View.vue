// View.vue
// Component creates a view. This is a combination of an openseadragon image canvas
// and an annotation canvas.
<template lang="html">
  <div
    id="view"
    class="elevation-2"
  >
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
      projectImageName: state => state.image.projectImageName
    })
  },

  async mounted () {
    if (this.$router.currentRoute.name === 'demo') {
      await this.setProjectImageName('demo')
      this.loadDemo()
    } else if (!this.projectImageName) {
      this.$router.replace('/dashboard')
    } else {
      this.loadProject()
    }
  },

  methods: {
    ...mapActions({
      setProjectImageName: 'image/setProjectImageName',
      loadDemo: 'app/loadDemo',
      loadProject: 'backend/loadProject'
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
