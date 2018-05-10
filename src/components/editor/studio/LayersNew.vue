<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title id="title">
          Layers
        </v-toolbar-title>
        <v-spacer/>
        <v-btn
          icon
          @click.native="newLayer">
          <v-icon id="iconButton">
            tab
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-list
        id="list"
        dense
      >
        <v-list-group
          v-for="(layer, id) in layers"
          id="group"
          :key="id"
          no-action
        >
          <v-list-tile
            slot="activator"
            no-action
            @click.native="selectLayer(id)"
          >
            <v-list-tile-content id="content">
              <v-list-tile-title id="name">
                {{ layer[1].name ? layer[1].name : ('Layer ' + id) }}
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>

          <div>
            <v-slider
              id="slider"
              :value="layer[1].opacity ? layer[1].opacity : 1"
              step="0"
              min="0"
              max="1"
              @input="setLayerOpacity"
            />
          </div>

        </v-list-group>
      </v-list>

    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      layers: state => state.annotation.project
    })
  },

  methods: {
    ...mapActions([
      'setLayerOpacity',
      'newLayer',
      'exportLayerJSON',
      'setActiveStepAndLayer',
      'setLayerOpacity'
    ]),

    selectLayer (id) {
      this.setActiveStepAndLayer(id + 1)
    }
  }
}
</script>

<style lang='css' scoped>
#title {
  font-size: 14px;
  font-weight: 400;
  height: 30px;
}

.panel {
  margin-top: 20px;
  background-color: #EEEEEE;
}

#toolbar {
  background-color: #E0E0E0;
}

#name {
  font-size: 13px;
  height: 30px;
  color: #616161;
}

#content {
  margin-left: 16px;
}

#list {
  background-color: #EEEEEE;
}

#group{
  padding-right: 10px;
}

#slider{
  padding-left: 20px;
}

#slider:focus{
  outline: none;
}
</style>
