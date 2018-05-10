<template lang="html">
  <div
    v-if="layers"
    class="elevation-1">
    <v-card class="panel">

      <!-- Panel Toolbar, Title and Action button -->
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

      <!-- List with Panel contents -->
      <v-list
        id="list"
        dense
      >
        <v-list-group
          v-for="(layer, id) in layers"
          :key="id"
          no-action
        >
          <v-list-tile
            slot="activator"
            no-action
            @click.native="setActiveStepAndLayer(id + 1)"
          >
            <v-list-tile-content id="content" >

              <!-- Name of List Item -->
              <v-list-tile-title
                id="name"
                :class="[(layer == activeLayer) ? 'faIconsActive' : 'faIcons']"
              >
                {{ layer.name }}
              </v-list-tile-title>

            </v-list-tile-content>
          </v-list-tile>

          <!-- Controls for List Item -->
          <v-tabs
            v-model="tabs"
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

            <v-tabs-items v-model="tabs">

              <!-- Opacity Slider -->
              <v-tab-item>
                <div>
                  <v-slider
                    id="slider"
                    v-model="activeLayer.opacity"
                    step="0"
                    min="0"
                    max="1"
                    @input="setLayerOpacity(layer)"
                  />
                </div>
                <div>
                  ActubeLayer Opacity = {{ activeLayer.opacity }}
                </div>
              </v-tab-item>

              <!-- Rename List Item -->
              <v-tab-item>
                <div>rename</div>
              </v-tab-item>

              <!-- Delete List item -->
              <v-tab-item>
                <div>delete</div>
              </v-tab-item>

            </v-tabs-items>
          </v-tabs>

        </v-list-group>
      </v-list>

    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
// TODO: figure out why the feedfoward highlighting for mouse clicks doesn't
//      want to work here.
// TODO: when editing layer name, and textinput is visible match the font-size
//      and style to the normal layer name.

export default {

  data () {
    return {
      editingLayer: null,
      beforeEditCache: null,
      tabs: '0'
    }
  },

  computed: {
    ...mapState({
      activeLayer: state => state.annotation.paperScope.project.activeLayer,
      layers: state => state.annotation.paperScope.project.layers
    }),

    ...mapGetters([
      'getLayers'
    ])
  },

  mounted () {
    // If there are no layers imported, then the default layer will not
    // have a name. So best set it here and avoid confusion.
    if (!this.activeLayer.name) {
      this.activeLayer.name = 'Layer 1'
    }
  },

  methods: {
    ...mapActions([
      'newLayer',
      'exportLayerJSON',
      'setActiveStepAndLayer',
      'setLayerOpacity'
    ]),

    // Begin editing
    editLayerName (layer) {
      this.beforeEditCache = layer.name
      this.editingLayer = layer.id
    },

    // Housekeeping once finsihed editing layer
    finishedEdit (layer) {
      if (!this.editingLayer) {
        return
      }

      // If no layer name then set to untitled else trim
      if (layer.name === undefined) {
        layer.name = 'Untitled'
      } else {
        layer.name = layer.name.trim()
      }

      // Reset currently editing data
      this.editingLayer = null
    },

    // Housekeeping on canceling edit
    cancelEdit (layer) {
      this.editingLayer = null
      layer.name = this.beforeEditCache
    }
  }
}
</script>

<style lang='css' scoped>
.not-editing {
  display: auto
}

.editing {
  display: none
}

#title {
  font-size: 14px;
  font-weight: 400;
  height: 30px;
}

.panel {
  margin-top: 7px;
  background-color: #EEEEEE;
}

#toolbar {
  background-color: #E0E0E0;
}

#name {
  font-size: 13px;
  height: 30px;
}

#content {
  margin-left: 16px;
}

#action {
  color: #616161;
  margin-right: 2px;
  height: 30px;
  margin-bottom: 0px;
}

#nameEdit {
  font-size: 13px;
  height: 20px;
  width: 100px;
  padding-bottom: 5px;
}

#list {
  background-color: #EEEEEE;
}

#iconButton {
  font-size: 18px;
}

#sub-menu {
  padding-left: 20px;
}
</style>
