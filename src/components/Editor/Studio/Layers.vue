<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title>
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
      >
        <v-list-group
          v-for="(layer, index) in layers"
          :key="index"
          no-action
        >
          <v-list-tile
            slot="activator"
            no-action
            @click.native="selectLayer(index)"
          >
            <v-list-tile-content>
              <v-list-tile-title
                :class="[(activeLayer === index) ? 'faIconsActive' : 'faIcons']">
                {{ layer[1].name ? layer[1].name : ('Layer ' + index) }}
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>

          <!-- Layer Controls -->
          <div id="controls">
            <v-tabs
              left
              color="transparent"
            >
              <v-tab>
                <v-icon> visibility </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> text_format </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> delete </v-icon>
              </v-tab>

              <v-tabs-items id="tab-items">

                <!-- Opacity Slider -->
                <v-tab-item>
                  <div id="tab-item">
                    <v-layout
                      row
                      wrap>
                      <v-flex xs9>
                        <v-slider
                          :value="(layer[1].opacity != null) ? layer[1].opacity*100 : 100"
                          max="100"
                          @input="setLayerOpacity"
                        />
                      </v-flex>
                      <v-flex xs3>
                        <v-text-field
                          :value="layer[1].opacity ? Math.round(layer[1].opacity*100) : 100"
                          suffix="%"
                          single-line
                          mask="###"
                          @change="setLayerOpacity"
                          @keyup.native.enter="setLayerOpacity"/>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-tab-item>

                <!-- Rename List Item -->
                <v-tab-item>
                  <div id="tab-item">
                    <v-text-field
                      :value="layer[1].name ? layer[1].name : ('Layer ' + index)"
                      single-line
                      @change="setLayerName"
                      @keyup.native.enter="setLayerName"
                    />
                  </div>

                </v-tab-item>

                <!-- Delete List item -->
                <v-tab-item>
                  <div id="tab-item">
                    <v-btn
                      id="deleteButton"
                      small
                      color="error"
                      dark
                      flat
                      outline
                      @click="deleteLayer">
                      Delete
                    </v-btn>
                  </div>
                </v-tab-item>

              </v-tabs-items>
            </v-tabs>
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
      layers: state => state.annotation.project,
      activeLayer: state => state.config.activeLayer
    })
  },

  methods: {
    ...mapActions([
      'setLayerOpacity',
      'newLayer',
      'exportLayerJSON',
      'setActiveStepAndLayer',
      'setLayerOpacity',
      'setLayerName',
      'deleteLayer'
    ]),

    selectLayer (index) {
      this.setActiveStepAndLayer(index)
    }
  }
}
</script>

<style lang='css' scoped>
.panel {
  margin-top: 7px;
  background-color: #EEEEEE;
  width: 240px;
}

#toolbar {
  background-color: #E0E0E0;
}

#iconButton {
  color: #616161;
}

#list {
  background-color: #EEEEEE;
}

#controls {
  background-color: #F5F5F5;
  border-top: 1px solid #E0E0E0;
}

#tab-items {
  background-color: #FAFAFA;
}

#tab-item {
  height: 74px;
  padding: 0px 16px;
}

#deleteButton {
  margin: 18px 0 0;
}
</style>
