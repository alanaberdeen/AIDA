<template lang="html">
    <div class="elevation-1">
        <v-card class="panel">

            <v-toolbar dense id="toolbar">
                <v-toolbar-title id='title'>
                    Layers
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="newLayer">
                    <v-icon id="iconButton">
                        tab
                    </v-icon>
                </v-btn>
            </v-toolbar>

            <v-list dense id="list">
                <v-list-tile    v-for="layer in paperScope.project.layers" :key="layer.id"
                                @click.native="selectLayer(layer)"
                                @click.shift.native="addToSelection(layer)"
                                @dblclick.native="editLayerName(layer)"
                                id="tile">

                    <v-list-tile-content id="content">

                        <v-list-tile-title
                            id="name"
                            v-if="editingLayer != layer.id"
                            :class="[(layer == paperScope.project.activeLayer) ? 'faIconsActive' : 'faIcons']">
                            {{ layer.name }}
                        </v-list-tile-title>

                        <v-text-field
                            id="nameEdit"
                            v-if="editingLayer == layer.id"
                            autofocus
                            single-line
                            v-model="layer.name"
                            @blur="finishedEdit(layer)"
                            @keyup.enter.native="finishedEdit(layer)"
                            @keyup.esc.native="cancelEdit(layer)">
                        ></v-text-field>

                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon @click.native="exportJSON(layer)" id='action'>
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
import paper from 'paper'

//TODO: fix addToSelection with the shift clicking of layers.
//TODO: figure out why the feedfoward highlighting for mouse clicks doesn't
//      want to work here.
//TODO: when editing layer name, and textinput is visible match the font-size
//      and style to the normal layer name.

export default {
    props: ['paperScope'],
    data(){
        return {
            editingLayer: null,
            beforeEditCache: null,
        }
    },

    created() {

        // If there are no layers imported, then the default layer will not
        // have a name. So best set it here and avoid confusion.
        if (!this.paperScope.project.activeLayer.name){
            this.paperScope.project.activeLayer.name = 'Layer 1'
        }
    },

    methods: {

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
            if (layer.name == undefined) {
                layer.name = "Untitled Layer"
            } else {
                layer.name = layer.name.trim()
            }
        },

        // Housekeeping on canceling edit
        cancelEdit (layer) {
            this.editingLayer = null
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
