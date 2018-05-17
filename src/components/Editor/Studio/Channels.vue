<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title class="toolBarTitle">
          Channels
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon>
          <v-icon id="iconButton">
            tab
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-list id="list" >
        <v-list-group
          v-for="(channel, index) in getChannels"
          :key="index"
          no-action
        >
          <v-list-tile
            slot="activator"
            no-action
            @click.native="setConfigActiveChannel(index)"
          >
            <v-list-tile-content>
              <v-list-tile-title
                class="faIcons">
                {{ channel.name ? channel.name : ('Channel ' + index) }}
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>

          <!-- Layer Controls -->
          <div id="controls">
            <v-tabs
              left
              color="transparent"
            >
              <v-tab>
                <v-icon> visibility </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> text_format </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> delete </v-icon>
              </v-tab>

              <v-tabs-items id="tab-items">

                <!-- Opacity Slider -->
                <v-tab-item>
                  <div id="tab-item">
                    <v-layout
                      row
                      wrap>
                      <v-flex xs9>
                        <v-slider
                          v-model="channel.opacity"
                          step="0"
                          max="1"
                          @input="setChannelOpacity"
                        />
                      </v-flex>
                      <v-flex xs3>
                        <v-text-field
                          :value="(channel.opacity !== null) ? Math.round(channel.opacity*100) : 100"
                          suffix="%"
                          single-line
                          mask="###"
                          @change="setChannelOpacity"
                          @keyup.native.enter="setChannelOpacity"/>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-tab-item>

                <!-- Rename List Item -->
                <!-- <v-tab-item>
                  <div id="tab-item">
                    <v-text-field
                      :value="channel.name ? channel.name : ('Channel ' + index)"
                      single-line
                      @change="setChannelName"
                      @keyup.native.enter="setChannelName"
                    />
                  </div>
                </v-tab-item> -->

                <!-- Delete List item -->
                <!-- <v-tab-item>
                  <div id="tab-item">
                    <v-btn
                      id="deleteButton"
                      small
                      color="error"
                      dark
                      flat
                      outline
                      @click="deleteChannel">
                      Delete
                    </v-btn>
                  </div>
                </v-tab-item> -->

              </v-tabs-items>
            </v-tabs>
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
    ])
  },

  methods: {
    ...mapActions([
      'setChannelOpacity',
      'setConfigActiveChannel'
    ])
  }
}
</script>

<style lang='css' scoped>
.panel {
  margin-top: 7px;
  background-color: #EEEEEE;
  width: 240px;
}

.toolBarTitle {
  color: #424242;
}

#toolbar {
  background-color: #E0E0E0;
}

#iconButton {
  color: #616161;
}

#list {
  background-color: #EEEEEE;
}

#controls {
  background-color: #F5F5F5;
  border-top: 1px solid #E0E0E0;
}

#tab-items {
  background-color: #FAFAFA;
}

#tab-item {
  height: 74px;
  padding: 0px 16px;
}

#deleteButton {
  margin: 18px 0 0;
}
</style>
