<template lang="html">
  <v-card
    class="mt-2"
    color='#eeeeee'
  >
    <v-toolbar
      color='#e0e0e0'
      dense
    >
      <v-toolbar-title>
        Layers
      </v-toolbar-title>

      <v-spacer/>

      <v-btn
        icon
        @click.native="newLayer"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>

    </v-toolbar>

    <v-list>
      <v-list-group
        v-for="(layer, index) in layers"
        :key="index"
        no-action
        @click.native="selectLayer(index)"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              :class="{'blue--text text--darken-1': (activeLayer === index)}">
              {{ layer.name ? layer.name : ('Layer ' + index) }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item style='padding: 0px;'>
          <v-list-item-content>
            <div id="controls">
              <v-tabs grow background-color="transparent">
                <v-tab style='min-width: 48px;'><v-icon> mdi-opacity </v-icon></v-tab>
                <v-tab style='min-width: 48px;'><v-icon> mdi-format-color-text </v-icon></v-tab>
                <v-tab @click='cycleTabEvent = !cycleTabEvent' style='min-width: 48px;'><v-icon> mdi-swap-horizontal </v-icon></v-tab>
                <v-tab style='min-width: 48px;'><v-icon> mdi-delete </v-icon></v-tab>

                <v-tab-item>
                  <v-slider
                    :value="layer.opacity * 100"
                    @input="setActiveLayerOpacity"
                    class="align-center tab-item"
                    max=100
                    min=0
                    hide-details
                    :prepend-icon="layer.opacity > 0 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:prepend="toggleOpacity(layer.opacity)"
                  >
                    <template v-slot:append>
                      <v-text-field
                        :value="layer.opacity * 100"
                        class="mt-0 pt-0"
                        suffix="%"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @keyup.native.enter="setActiveLayerOpacity"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-tab-item>

                <v-tab-item>
                  <v-text-field
                    :value="layer.name ? layer.name : ('Layer ' + index)"
                    single-line
                    class="tab-item"
                    @change="setActiveLayerName"
                    @keyup.native.enter="setActiveLayerName"
                  />
                </v-tab-item>

                <v-tab-item>
                  <app-cycle :cycleTabEvent="cycleTabEvent" :layerIndex="index"/>
                </v-tab-item>

                <v-tab-item>
                  <div class="d-flex justify-center align-center tab-item">
                    <v-btn
                      small
                      color="error"
                      dark
                      outlined
                      @click="deleteActiveLayer().then(() => {setActiveLayer(0)})">
                      Delete
                    </v-btn>
                  </div>
                </v-tab-item>
              </v-tabs>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import cycle from './Cycle.vue'

export default {
  components: {
    'app-cycle': cycle
  },

  data () {
    return {
      slider: 0,
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
#controls {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  padding-left: 16px;
  padding-right: 16px;
}

#tab-items {
  background-color: #fafafa;
}

.tab-item {
  background-color: #f5f5f5;
  height: 54px;
  padding: 4px 0px;
  margin: 0px;
}
</style>
