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
                 <v-list-tile   v-for="layer in layers" :key="layer.id"
                                @click.native="activateLayer(layer)"
                                @dblclick.native="editLayerName(layer)"
                                id="tile"> 

                   <v-list-tile-content id="content"> 

                        <v-list-tile-title
                            id="name"
                            v-if="editingLayer !== layer.id"
                            :class="[(layer == activeLayer) ? 'faIconsActive' : 'faIcons']">
                            {{ layer.name }}
                        </v-list-tile-title>

                        <input 
                            id="nameEdit"
                            v-if="editingLayer == layer.id"
                            v-model="layer.name"
                            autofocus
                            @blur="finishedEdit(layer)"
                            @keyup.enter="finishedEdit(layer)"
                            @keyup.esc="cancelEdit(layer)"
                        >

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
import paper from 'paper';

import { mapActions } from 'vuex';
import { mapState } from 'vuex';

//TODO: figure out why the feedfoward highlighting for mouse clicks doesn't
//      want to work here.
//TODO: when editing layer name, and textinput is visible match the font-size
//      and style to the normal layer name.

export default {

    data(){
        return {
            editingLayer: null,
            beforeEditCache: null,
        }
    },

    computed: {
        ...mapState({
            activeLayer: state => state.annotation.paperScope.project.activeLayer,
            layers: state => state.annotation.paperScope.project.layers
        })
    },

    mounted() { 

        // If there are no layers imported, then the default layer will not
        // have a name. So best set it here and avoid confusion.
        if (!this.activeLayer.name){
            this.activeLayer.name = 'Layer 1'
        }
    },

    methods: {
        ...mapActions([
            'newLayer',
            'activateLayer',
            'exportJSON'
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
            if (layer.name == undefined) {
                layer.name = "Untitled"
            } else {
                layer.name = layer.name.trim()
            }
        },

        // Housekeeping on canceling edit
        cancelEdit (layer) {
            this.editingLayer = null
            layer.name = this.beforeEditCache
        },
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
