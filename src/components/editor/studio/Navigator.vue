<template lang="html">
  <v-card
    class="mt-12"
    color='#eeeeee'
    >

    <v-toolbar
      color='#e0e0e0'
      dense
    >
      <v-toolbar-title>
        Navigator
      </v-toolbar-title>
    </v-toolbar>

    <div id="nav-container">
      <div id="navigator"/>
    </div>

    <v-slider
      :value="getZoom"
      :max="getMaxZoom"
      @change="setZoom"
      class="align-center tab-item px-4 py-2"
      min=0
      hide-details
    >
      <template v-slot:append>
        <v-text-field
          :value="getZoom"
          class="mt-0 pt-0"
          suffix="x"
          hide-details
          single-line
          type="number"
          style="width: 60px"
          @change="setZoom"
          @keyup.native.enter="setZoom"
        ></v-text-field>
      </template>
    </v-slider>

  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      viewer: state => state.image.OSDviewer
    }),

    ...mapGetters('image', ['getZoom', 'getMaxZoom'])
  },

  methods: {
    ...mapActions({
      setZoom: 'image/setZoom'
    })
  }
}
</script>

<style lang='css' scoped>
#nav-container {
  width: 100%;
  text-align: center;
  background-color: #eeeeee;
  padding-top: 8px;
}

#navigator {
  display: inline-block;
  height: 120px;
  width: 224px;
  background-color: #fafafa;
}
</style>
