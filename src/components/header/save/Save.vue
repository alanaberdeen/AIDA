<template lang="html">
  <v-btn
    icon
    @click.native="saveProject">
    <v-icon>
      save
    </v-icon>
  </v-btn>
</template>

<script>
import {mapActions} from 'vuex'

export default {

  methods: {
    ...mapActions({
      saveProject: 'common/saveProject'
    })
  }
}
</script>

<style lang='css'>
</style>
