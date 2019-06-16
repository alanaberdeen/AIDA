<template>
  <app-editor />
</template>

<script>
import Editor from './editor/Editor.vue'

export default {
  components: {
    'app-editor': Editor
  },

  mounted () {
    console.log('demo was mounted')
  }
}
</script>
