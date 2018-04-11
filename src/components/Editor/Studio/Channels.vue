<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title id="title">
          Channels
        </v-toolbar-title>
        <v-spacer/>
      </v-toolbar>

      <v-list id="list">
        <v-list-group
          v-for="(channel, channelIndex) in getChannels"
          id="group"
          :key="channelIndex"
          :append-icon="channel.visible ? 'visibility' : 'visibility_off'"
          no-action
        >
          <v-list-tile
            slot="activator"
            no-action
          >
            <v-list-tile-content id="content">
              <v-list-tile-title id="name">
                {{ channel.name }}
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>

          <div>
            <v-slider
              id="slider"
              v-model="channel.opacity"
              @input="setChannelVisibility(channel)"/>
          </div>

        </v-list-group>
      </v-list>

    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      viewer: state => state.image.viewer
    }),

    ...mapGetters([
      'getChannels'
    ]),

    channelIcon: function (channel) {
      if (channel.visibility) {
        return 'visibility'
      } else {
        return 'visibility-off'
      }
    }
  },

  methods: {
    ...mapActions([
      'toggleChannelVisibility',
      'setChannelVisibility'
    ])
  }
}
</script>

<style lang='css' scoped>
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

#list {
  background-color: #EEEEEE;
}

#tile{
  height: 30px;
}

#group{
  padding-right: 10px;
}

#slider{
  padding-left: 20px;
}

#slider:focus{
  outline: none;
}
</style>
