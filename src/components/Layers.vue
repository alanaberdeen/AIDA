<template lang="html">
    <div class="pointers-please layer-panel">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Layers</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click.native="newLayer" icon ripple>
                    <v-icon class="white--text">tab</v-icon>
                </v-btn>
            </v-toolbar>
            <v-list dense>
                <v-list-item v-for="layer in paperScope.project.layers" :key="layer.id">
                    <v-list-tile :v-model="layer.selected">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ layer.name }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon @click.native="selectLayer(layer)">
                                <v-icon class="grey--text text--lighten-1">info</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                            <v-btn @click.native="exportJSON(layer)" icon ripple>
                                <v-icon class="grey--text">save</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    methods: {

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
</style>
