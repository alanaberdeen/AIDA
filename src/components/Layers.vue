<template lang="html">
    <div class="pointers-please layer-panel elevation-2">
        <v-card>
            <v-toolbar>
                <v-toolbar-title class='white--text'>Layers</v-toolbar-title>
                <v-btn @click.native="newLayer" icon ripple>
                    <v-icon class="white--text">tab</v-icon>
                </v-btn>
            </v-toolbar>
            <v-list dense>
                <v-list-item v-for="layer in paperScope.project.layers" :key="layer.id">
                    <span @click="selectLayer(layer)" @click.shift="addToSelection(layer)">
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title
                                    @dblclick="editLayerName(layer)"
                                    :class="{editing: layer.id == editedLayer}"
                                    >
                                    {{ layer.name }}
                                </v-list-tile-title>
                                <v-text-field
                                    class="editContent"
                                    :class="{editing: layer.id != editedLayer}"
                                    name="input-1-3"
                                    single-line
                                    v-model="layer.name"
                                    @blur="doneEdit(layer)"
                                    @keyup.enter.native="doneEdit(layer)"
                                    @keyup.esc.native="cancelEdit(layer)">
                                ></v-text-field>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn @click.native="exportJSON(layer)" icon ripple>
                                    <v-icon class="grey--text">save</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                    </span>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    data(){
        return {
            editedLayer: null,
            beforeEditCache: null,
        }
    },
    methods: {

        sayHello() {
            console.log("Hi there")
        },

        // Begin editing
        editLayerName (layer) {
            this.beforeEditCache = layer.name
            this.editedLayer = layer.id
        },

        // Housekeeping once finsihed editing layer
        doneEdit (layer) {
            if (!this.editedLayer) {
                return
            }

            // Reset currently editing data
            this.editedLayer = null

            // If no layer name then set to untitled else trim
            if (layer.name == undefined) {
                layer.name = "Untitled Layer"
            } else {
                layer.name = layer.name.trim()
            }
        },

        // Housekeeping on canceling edit
        cancelEdit (layer) {
            this.editedLayer = null
            layer.name = this.beforeEditCache
        },

        // Add a new layer with a default name
        newLayer () {
            var layer = new paper.Layer({
              name: 'New Layer',
              position: this.paperScope.view.center
            })
            this.selectLayer(layer)
        },

        // De-select all layers and select this one
        selectLayer (layer) {
            // Deselect all layers
            this.paperScope.project.layers.forEach((l) => {
              l.selected = false
            })
            // Select the given layer
            layer.selected = true;
            layer.activate();
        },

        // This doesn't work at the moment, well it might but currently
        // using the activaLayer selection to exportJSON and highlight the
        // selected items as full layers so it's not effective as such
        addToSelection (layer) {
            layer.selected = true;
        },

        // Save the selected layers as a JSON object to the console
        exportJSON (layer) {
            layer.activate();
            console.log(this.paperScope.project.activeLayer.exportJSON())

        }
    }
}
</script>

<style lang="css" scoped>
.layer-panel {
    margin-top: 30px;
    margin-left: 10px;
}

.editing {
    display: none;
}

</style>
