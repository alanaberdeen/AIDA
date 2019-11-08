<template>
  <v-layout align-center justify-center fill-height class='tab-item'>
    <v-flex xs2>
      <v-btn text icon color="primary"
        @click="incrementActiveItemBy(-1)"
        :disabled="this.totalItems === 0"
      >
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
    </v-flex>

    <v-flex xs8>
      <v-layout align-center justify-center>
          <span v-if='this.totalItems > 0' id="item-title">
            {{ this.activeItemIndex + 1 }} / {{ this.totalItems }}
          </span>
          <span v-else id="item-title">
            {{ 0 }} / {{ this.totalItems }}
          </span>
      </v-layout>
    </v-flex>

    <v-flex xs2>
      <v-btn text icon color="primary"
        @click="incrementActiveItemBy(1)"
        :disabled="this.totalItems === 0"
      >
        <v-icon> mdi-arrow-right </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import paper from 'paper'
import openseadragon from 'openseadragon'

export default {
  props: ['cycleTabEvent', 'layerIndex'],

  data () {
    return {
      totalItems: null,
      activeItemIndex: 0
    }
  },

  watch: {
    cycleTabEvent: function () {
      this.totalItems = paper.project.layers[this.layerIndex].getItems({
        class: 'Path'
      }).length
    }
  },

  computed: {
    ...mapState({
      activeLayer: state => state.app.activeLayer,
      viewport: state => state.image.OSDviewer.viewport
    })
  },

  methods: {
    incrementActiveItemBy (value) {
      if (this.activeItemIndex === (this.totalItems - 1) && value > 0) {
        this.activeItemIndex = 0
      } else if (this.activeItemIndex === 0 && value < 0) {
        this.activeItemIndex = this.totalItems - 1
      } else {
        this.activeItemIndex = this.activeItemIndex + value
      }

      // On increment just do a check to make sure we have all the items as
      // some may have been added/removed between increments.
      const items = paper.project.layers[this.layerIndex].getItems({
        class: 'Path'
      })
      this.totalItems = items.length

      this.goToItem(items[this.activeItemIndex].bounds)
    },

    goToItem (item) {
      this.viewport.fitBoundsWithConstraints(
        this.viewport.imageToViewportRectangle(
          new openseadragon.Rect(
            item.x,
            item.y,
            item.width,
            item.height
          )
        ),
        true
      )
    }
  }
}
</script>

<style lang='css' scoped>
.tab-item {
  background-color: #f5f5f5;
  height: 54px;
  padding: 4px 0px;
  margin: 0px;
}
</style>
