<template lang="html">
    <div class="pointers-please channel-panel elevation-1" ondragstart="return false;" ondrop="return false;">
        <v-card class='panel'>

            <v-toolbar class='toolbar elevation-1'>
                <v-toolbar-title id='title'>
                    Channels
                </v-toolbar-title>
            </v-toolbar>

            <v-list dense>
                <v-list-group v-for="(channel, channelIndex) in channels" :key="channelIndex">

                        <v-list-tile slot="item" class='tile'>
                            <v-list-tile-content>

                                <v-list-tile-title class='channel-name'>
                                    Ch. {{channel.id + 1}}
                                </v-list-tile-title>

                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn @click.native="toggleVisibility(channelIndex)" icon ripple class='button'>

                                    <v-icon class='icon--dark'>
                                        <span v-if="isVisible(channelIndex)">
                                            visibility
                                        </span>

                                        <span v-else>
                                            visibility_off
                                        </span>
                                    </v-icon>

                                </v-btn>
                            </v-list-tile-action>
                            <v-divider></v-divider>
                        </v-list-tile>

                        <v-list-item>
                            <v-list-tile >
                                <v-list-tile-content>
                                    <v-slider   v-model="channel.opacity"
                                                @input="onInput(channelIndex, channel.opacity)">
                                    </v-slider>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-item>

                </v-list-group>

            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope', 'osdViewer'],
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
                opacity: (vm.getOpacity(vm.channels.length)*100)
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

        // Set the opactiy of the specified channel index to 0
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
.channel-panel {
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

.channel-name {
    font-size: 12px;
}

.panel {
    background-color: #EEEEEE;
}

.active {
    color: #1E88E5;
}

.input-group__details{
    min-height: 0;
}

.opacity-label {
    width: 20px;
}

.list--group .list__tile {
    padding-left: 10px;
}

</style>
