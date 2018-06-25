<template lang="html">
  <v-container>
    <v-layout>
      <v-flex xs12>

        <v-text-field
          :value="projectName"
          name="input-3"
          label="Project Name"
          @change="setProjectName"
          @keyup.native.enter="setProjectName"
        />
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      projectName: state => state.annotation.project.name
    })
  },

  methods: {
    ...mapActions({
      setProjectName: 'annotation/setProjectName'
    })
  }
}
</script>

<style lang='css'>
</style>
