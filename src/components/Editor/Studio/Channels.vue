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
                <v-list-group no-action	v-for="(channel, channelIndex) in getChannels" :key="channelIndex">

                        <v-list-tile slot="item" id="tile">
                            <v-list-tile-content id="content">

                                <v-list-tile-title id="name">
                                    {{ channel.name }}
                                </v-list-tile-title>

                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-btn icon @click.native="toggleChannelVisibility(channel)" id='action'>

                                    <v-icon v-if="channel.visible" id="iconButton">
                                        visibility
                                    </v-icon>

                                    <v-icon v-else id="iconButton">
                                        visibility_off
                                    </v-icon>

                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>

                        <v-list-tile class="slider-tile">
                                <v-list-tile-content id="slider-content">
                                    <v-slider   v-model="channel.opacity"
                                                @input="setChannelVisibility(channel)">
                                    </v-slider>
                                </v-list-tile-content>
                        </v-list-tile>

                </v-list-group>

            </v-list>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';

export default {

    computed: {
        ...mapState({
            viewer: state => state.image.viewer
        }),

        ...mapGetters([
            'getChannels'
        ])
    },

    methods: {
        ...mapActions([
            'toggleChannelVisibility',
            'setChannelVisibility'
        ])
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
    color: #616161;
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

.slider-tile {
    background-color: #EEEEEE;
}

#slider-content {
    background-color: #EEEEEE;
}

#tile{
    height: 30px;
}

#iconButton {
    font-size: 18px;
}

</style>
