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
                          :value="(layer.opacity != null) ? layer.opacity*100 : 100"
                          max="100"
                          @input="setLayerOpacity"
                        />
                      </v-flex>
                      <v-flex xs3>
                        <v-text-field
                          :value="layer.opacity ? Math.round(layer.opacity*100) : 100"
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
                      :value="layer.name ? layer.name : ('Layer ' + index)"
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
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      layers: state => state.annotation.project.layers,
      activeLayer: state => state.editor.activeLayer,
      steps: state => state.editor.steps,
      activeStep: state => state.editor.activeStep
    })
  },

  methods: {

    ...mapActions('annotation', [
      'setLayerOpacity',
      'newLayer',
      'exportLayerJSON',
      'setActiveLayer',
      'setLayerOpacity',
      'setLayerName',
      'deleteActiveLayer'
    ]),

    ...mapActions('editor', [
      'setActiveStep'
    ]),

    selectLayer (index) {
      // First check to see if the editor configuration syncs the active step
      // and layer. If so, change the step to the required index.
      // This is a quick hack. Could do with a better method.
      for (let i in this.steps) {
        let step = this.steps[i]

        if (step.specificLayer === index) {
          this.setActiveStep(step)
        } else {
          this.setActiveLayer(index)
        }
      }
    }
  }
}
</script>

<style lang='css' scoped>
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
