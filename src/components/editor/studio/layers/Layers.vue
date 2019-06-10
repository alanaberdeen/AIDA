<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title class="toolBarTitle">
          Layers
        </v-toolbar-title>
        <v-spacer/>
        <v-btn
          icon
          @click.native="newLayer">
          <v-icon id="iconButton">
            add
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
                {{ layer.name ? layer.name : ('Layer ' + index) }}
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
                <v-icon> opacity </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> text_format </v-icon>
              </v-tab>

              <v-tab @click='cycleTabEvent = !cycleTabEvent'>
                <v-icon> swap_horiz </v-icon>
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
                      <v-flex xs10>
                        <v-slider
                          :value="layer.opacity * 100"
                          max="100"
                          @input="setActiveLayerOpacity"
                          class='pad-slider-right'
                          :prepend-icon="layer.opacity > 0 ? 'visibility' : 'visibility_off'"
                          @click:prepend="toggleOpacity(layer.opacity)"
                        />
                      </v-flex>
                      <v-flex xs2>
                        <v-text-field
                          :value="Math.round(layer.opacity * 100)"
                          suffix="%"
                          single-line
                          mask="###"
                          @keyup.native.enter="setActiveLayerOpacity"/>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-tab-item>

                <!-- Rename List Item -->
                <v-tab-item>
                  <div id="tab-item">
                    <v-text-field
                      :value="layer.name ? layer.name : ('Layer ' + index)"
                      single-line
                      @change="setActiveLayerName"
                      @keyup.native.enter="setActiveLayerName"
                    />
                  </div>

                </v-tab-item>

                <!-- Cycle List item -->
                <v-tab-item>
                  <div id="tab-item">
                    <app-cycle :cycleTabEvent="cycleTabEvent" :layerIndex="index"/>
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
                      @click="deleteActiveLayer().then(() => {setActiveLayer(0)})">
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
import paper from 'paper'
import { mapActions, mapState } from 'vuex'

import cycle from './Cycle.vue'

export default {
  components: {
    'app-cycle': cycle
  },

  data() {
    return {
      opacityCache: 1,
      cycleTabEvent: false // Variable used to indicate cycleTab has be toggled
    }
  },

  computed: {
    ...mapState({
      layers: state => state.annotation.project.layers,
      activeLayer: state => state.app.activeLayer,
      steps: state => state.app.steps,
      activeStep: state => state.app.activeStep
    })
  },

  methods: {
    ...mapActions('annotation', [
      'setActiveLayerOpacity',
      'createLayer',
      'exportLayerJSON',
      'setActiveLayer',
      'setActiveLayerName',
      'deleteActiveLayer'
    ]),

    ...mapActions('editor', [
      'setActiveStep'
    ]),

    async newLayer (index) {
      await this.createLayer()
      this.setActiveLayer(this.layers.length - 1)
    },

    selectLayer (index) {
      this.setActiveLayer(index)

      // Also toggle the cycletab variable. This will trigger an update in the 
      // tab component and is necessary when changing layers.
      this.cycleTab = !this.cycleTab
    },

    toggleOpacity (currentOpacity) {
      if (currentOpacity > 0) {
        this.opacityCache = currentOpacity
        this.setActiveLayerOpacity(0)
      } else {
        this.setActiveLayerOpacity(this.opacityCache * 100)
      }
    }
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
}

#deleteButton {
  margin: 18px 0 0;
}
</style>
