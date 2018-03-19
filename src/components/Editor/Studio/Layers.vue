<template lang="html">
  <div
    v-if="layers"
    class="elevation-1">
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
        <v-list-tile
          v-for="(layer, id) in layers"
          id="tile"
          :key="id"
          @click.native="setActiveStepAndLayer(id + 1)"
          @dblclick.native="editLayerName(layer)"
        >

          <v-list-tile-content id="content">

            <v-list-tile-title
              id="name"
              :class="[(layer == activeLayer) ? 'faIconsActive' : 'faIcons',
                       (layer.id == editingLayer) ? 'editing' : 'not-editing']">
              {{ layer.name }}
            </v-list-tile-title>

            <input
              id="nameEdit"
              :class="[(layer.id !== editingLayer) ? 'editing' : 'not-editing']"
              v-model="layer.name"
              autofocus
              @blur="finishedEdit(layer)"
              @keyup.enter="finishedEdit(layer)"
              @keyup.esc="cancelEdit(layer)"
            >

          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
              id="action"
              icon
              @click.native="exportLayerJSON(layer)"
            >
              <v-icon id="iconButton">
                save
              </v-icon>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// TODO: figure out why the feedfoward highlighting for mouse clicks doesn't
//      want to work here.
// TODO: when editing layer name, and textinput is visible match the font-size
//      and style to the normal layer name.

export default {

  data () {
    return {
      editingLayer: null,
      beforeEditCache: null
    }
  },

  computed: {
    ...mapState({
      activeLayer: state => state.annotation.paperScope.project.activeLayer,
      layers: state => state.annotation.paperScope.project.layers
    })
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
      'activateLayer',
      'exportLayerJSON',
      'setActiveStepAndLayer'
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

      // Reset currently editing data
      this.editingLayer = null

      // If no layer name then set to untitled else trim
      if (layer.name === undefined) {
        layer.name = 'Untitled'
      } else {
        layer.name = layer.name.trim()
      }
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
  margin-right: 8px;
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

#tile{
  height: 30px;
}

</style>
