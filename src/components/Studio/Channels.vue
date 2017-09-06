<template lang="html">
    <div class="elevation-1">
        <v-card class="panel">

            <v-toolbar dense id="toolbar">
                <v-toolbar-title id='title'>
                    Channels
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-list dense id="list">
                <v-list-group no-action	v-for="(channel, channelIndex) in channels" :key="channelIndex">

                        <v-list-tile slot="item" id="tile">
                            <v-list-tile-content id="content">

                                <v-list-tile-title id="name">
                                    {{config.images[channelIndex].name}}
                                </v-list-tile-title>

                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click.native="toggleVisibility(channelIndex)" id='action'>

                                    <v-icon v-if="isVisible(channelIndex)" id="iconButton">
                                        visibility
                                    </v-icon>

                                    <v-icon v-else id="iconButton">
                                        visibility_off
                                    </v-icon>

                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>

                        <v-list-tile id="list">
                                <v-list-tile-content>
                                    <v-slider   v-model="channel.opacity"
                                                @input="onInput(channelIndex, channel.opacity)">
                                    </v-slider>
                                </v-list-tile-content>
                        </v-list-tile>

                </v-list-group>

            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope', 'osdViewer', 'config'],
    data(){
        return {
            channels: [],
            value1: 0
        }
    },

    created() {
        var vm = this;

        // Add event handler for when items are added/removed from osd world
        // this will update the total number of channels.
        this.osdViewer.world.addHandler('add-item', function() {
            vm.channels.push({
                id: vm.channels.length,
                opacity: (vm.getOpacity(vm.channels.length)*100),
                slider: false
            })
        });


        // As, at this moment not sure which channel may have been removed
        // reconstruct the array. Probably slightly wasteful way of doing it.
        this.osdViewer.world.addHandler('remove-item', function() {
            vm.channels = []
            var numChannels = vm.osdViewer.world.getItemCount();

            for (i=0; i < numChannels; i++){
                vm.channels.push({
                    id: vm.channels.length,
                    opacity: (vm.getOpacity(vm.channels.length)*100)
                })
            }
        });
    },

    methods: {

        // Set the opactiy of the specified channel index to 0 or 0.5
        // TODO: give this a 'memory' so turning it back on resets the value
        // to what it was before it was turned off.
        toggleVisibility(channelIndex){
            var channel = this.osdViewer.world.getItemAt(channelIndex);
            if (channel.getOpacity() === 0){
                channel.setOpacity(0.5);
                this.channels[channelIndex].opacity = 50;
            } else {
                channel.setOpacity(0);
                this.channels[channelIndex].opacity = 0;
            }
        },

        // Check if channel is visibile
        isVisible(channelIndex) {
            var channel = this.osdViewer.world.getItemAt(channelIndex);
            if (channel.getOpacity() > 0){
                return true
            } else {
                return false
            }

            return true
        },

        getOpacity(channelIndex) {
            var channel = this.osdViewer.world.getItemAt(channelIndex);
            return channel.getOpacity();
        },

        onInput(channelIndex, channelOpacity){
            var channel = this.osdViewer.world.getItemAt(channelIndex);
            channel.setOpacity((channelOpacity/100));
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
    margin-top: 20px;
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

.input-group {
    padding: 7px 20px 7px 10px;
}

#list {
    background-color: #EEEEEE;
}

#tile{
    height: 30px;
}

#iconButton {
    font-size: 18px;
}

</style>
