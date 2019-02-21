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
        <!-- <v-spacer/>
        <v-btn icon>
          <v-icon id="iconButton">
            add
          </v-icon>
        </v-btn> -->
      </v-toolbar>

      <v-list id="list" >
        <v-list-group
          v-for="(channel, index) in getChannels"
          :key="index"
          no-action
        >
          <v-list-tile
            class="list-hotfix"
            slot="activator"
            no-action
            @click.native="setActiveChannel(index)"
          >
            <v-list-tile-content>
              <v-list-tile-title
                :class="[(activeChannel === index) ? 'faIconsActive' : 'faIcons']">
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
                <v-icon> opacity </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> text_format </v-icon>
              </v-tab>

              <v-tab>
                <v-icon> delete </v-icon>
              </v-tab>

              <v-tabs-items id="tab-items">

                <!-- Opacity Slider -->
                <v-tab-item @mousedown="setActiveChannel(index)">
                  <div id="tab-item">
                    <v-layout
                      row
                      wrap>
                      <v-flex xs10>
                        <v-slider
                          :value="channel.opacity * 100"
                          max="100"
                          @input="setActiveChannelOpacity"
                          class='pad-slider-right'
                          :prepend-icon="channel.opacity > 0 ? 'visibility' : 'visibility_off'"
                          @click:prepend="toggleOpacity(channel.opacity)"
                        />
                      </v-flex>
                      <v-flex xs2>
                        <v-text-field
                          :value="Math.round(channel.opacity*100)"
                          suffix="%"
                          single-line
                          mask="###"
                          @keyup.native.enter="setActiveChannelOpacity"/>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-tab-item>

                <!-- Rename List Item -->
                <v-tab-item @mousedown="setActiveChannel(index)">
                  <div id="tab-item">
                    <v-text-field
                      :value="channel.name ? channel.name : ('Channel ' + index)"
                      single-line
                      @change="setActiveChannelName"
                      @keyup.native.enter="setActiveChannelName"
                    />
                  </div>
                </v-tab-item>

                <!-- Delete List item -->
                <v-tab-item @mousedown="setActiveChannel(index)">
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
                </v-tab-item>

              </v-tabs-items>
            </v-tabs>
          </div>

        </v-list-group>
      </v-list>

    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      opacityCache: 1
    }
  },

  computed: {
    ...mapState({
      activeChannel: state => state.image.activeChannel
    }),

    ...mapGetters({
      getChannels: 'image/getChannels'
    })
  },

  methods: {
    ...mapActions({
      setActiveChannelOpacity: 'image/setActiveChannelOpacity',
      setActiveChannel: 'image/setActiveChannel',
      setActiveChannelName: 'image/setActiveChannelName',
      deleteChannel: 'image/deleteChannel'
    }),

    toggleOpacity (currentOpacity) {
      if (currentOpacity > 0) {
        this.opacityCache = currentOpacity
        this.setActiveChannelOpacity(0)
      } else {
        this.setActiveChannelOpacity(this.opacityCache * 100)
      }
    }
  }
}
</script>

<style lang='css' scoped>
.pad-slider-right {
  padding-right: 15px;
}

.panel {
  margin-top: 7px;
  background-color: #eeeeee;
}

.toolBarTitle {
  color: #424242;
}

#toolbar {
  background-color: #e0e0e0;
}

#iconButton {
  color: #616161;
}

#list {
  background-color: #eeeeee;
}

.list-hotfix {
  flex: 1 1 auto !important;
  overflow: hidden;
}

#controls {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

#tab-items {
  background-color: #fafafa;
}

#tab-item {
  height: 74px;
  padding: 0px 16px;
}

#deleteButton {
  margin: 18px 0 0;
}
</style>
