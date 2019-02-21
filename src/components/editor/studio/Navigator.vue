// Navigation element.
// Provides minimap to pan around the view and a method of controlling and
// specifying the zoom level accuratley.
<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title class="toolBarTitle">
          Navigator
        </v-toolbar-title>
      </v-toolbar>

      <!-- Navigator -->
      <div id="nav-container">
        <div id="navigator"/>
      </div>

      <!-- Zoom -->
      <div id="tab-item">
        <v-layout
          row
          wrap
          justify-space-between
        >
          <v-flex xs10>
            <v-slider
              :value="getZoom"
              :max="getMaxZoom"
              min="0"
              step="0"
              @input="setZoom"
              class='pad-slider-right'
            />
          </v-flex>
          <v-flex xs2>
            <v-text-field
              :value="getZoom"
              suffix="x"
              single-line
              @change="setZoom"
              @keyup.native.enter="setZoom"
            />
          </v-flex>
        </v-layout>
      </div>

    </v-card>
  </div>
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
.pad-slider-right {
  padding-right: 15px;
}

.panel {
  margin-top: 7px;
  background-color: #eeeeee;
}

.toolBarTitle {
  color: #424242;
}

#toolbar {
  background-color: #e0e0e0;
}

#iconButton {
  color: #616161;
}

#list {
  background-color: #eeeeee;
}

#controls {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

#tab-items {
  background-color: #fafafa;
}

#tab-item {
  height: 74px;
  padding: 0px 16px;
  background-color: #f5f5f5;
}

#deleteButton {
  margin: 18px 0 0;
}

#nav-container {
  width: 100%;
  text-align: center;
  background-color: #eeeeee;
  padding-top: 10px;
}

#navigator {
  display: inline-block;
  height: 120px;
  width: 200px;
  background-color: #fafafa;
}
</style>
