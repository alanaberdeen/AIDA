<template lang="html">
    <div class="pointers-please layer-panel elevation-1" ondragstart="return false;" ondrop="return false;">
        <v-card class='panel'>

            <v-toolbar class='toolbar elevation-1'>
                <v-toolbar-title id='title'>
                    Layers
                </v-toolbar-title>
                <v-btn @click.native="newLayer" icon ripple class='button'>
                    <v-icon class='icon'>tab</v-icon>
                </v-btn>
            </v-toolbar>

            <v-list dense>
                <v-list-item v-for="layer in paperScope.project.layers" :key="layer.id">
                    <span @click="selectLayer(layer)" @click.shift="addToSelection(layer)">

                        <v-list-tile class='tile'>
                            <v-list-tile-content>

                                <v-list-tile-title
                                    @dblclick="editLayerName(layer)"
                                    :class="{   editing: (layer.id == editedLayer),
                                                'layer-name': true,
                                                faIcons: !(layer == paperScope.project.activeLayer),
                                                faIconsActive: (layer == paperScope.project.activeLayer)}">
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
                                <v-btn @click.native="exportJSON(layer)" icon ripple class='button'>
                                    <v-icon class="icon--dark">
                                        save
                                    </v-icon>
                                </v-btn>
                            </v-list-tile-action>

                        </v-list-tile>
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

    created() {
        this.paperScope.project.activeLayer.name = 'Layer 1'
    },

    methods: {

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
            var layerIndex = this.paperScope.project.layers.length + 1;

            var layer = new paper.Layer({
                name: 'Layer ' + layerIndex,
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
    margin-top: 20px;
}

.editing {
    display: none;
}

.toolbar {
    background-color: #E0E0E0;
    height: 36px;

}

#title {
    font-size: 14px;
    margin-left: 10px;
}

.icon {
    font-size: 16px;
    color: #616161;
}

.button{
    margin-right: 5px;
}

.tile {
    padding: 0px 0px 0px 10px;
    height: 30px;
}

.layer-name {
    font-size: 12px;
}

.panel {
    background-color: #EEEEEE;
}

.active {
    color: #1E88E5;
}

</style>
