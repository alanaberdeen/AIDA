<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title class="toolBarTitle">
          Properties
        </v-toolbar-title>
        <v-spacer/>
      </v-toolbar>

      <v-list id="list" >

        <!-- Number of selected items -->
        <v-list-item>

          <v-list-item-content>
            <v-list-item-title class="faIcons">
              No. selected items:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            {{ selectedItems.length }}
          </v-list-item-action>
        </v-list-item>

        <!-- Fill color -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="faIcons">
              Fill colour:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              class="action pointers-no">
              <colour-picker
                :color="selectedFillColor"
                :type="'fill'"
              />
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <!-- Stroke color -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="faIcons">
              Stroke colour:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              class="action pointers-no">
              <colour-picker
                :color="selectedStrokeColor"
                :type="'stroke'"
              />
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <!-- Class
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="faIcons">
              Class:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-text-field
              :value="groupClass"
              name="input-3-4"
              single-line
            />
          </v-list-item-action>
        </v-list-item> -->

      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ColorPicker from './ColorPicker.vue'

export default {
  components: {
    'colour-picker': ColorPicker
  },

  computed: {
    ...mapState({
      selectedItems: state => state.annotation.selectedItems
    }),

    /**
     * Returns the fill color of the selected item(s) only if all items in the
     * selection are the same color. Otherwise, return transparent.
     */
    selectedFillColor () {
      if (this.selectedItems.length > 0 && this.selectedItems.every(
        (value, index, array) => (
          value.fillColor !== null &&
          value.fillColor.hue === array[0].fillColor.hue &&
          value.fillColor.saturation === array[0].fillColor.saturation &&
          value.fillColor.lightness === array[0].fillColor.lightness &&
          value.fillColor.alpha === array[0].fillColor.alpha
        )
      )) {
        return {
          style: this.selectedItems[0].fillColor.toCSS(),
          obj: {
            h: this.selectedItems[0].fillColor.hue,
            s: this.selectedItems[0].fillColor.saturation,
            l: this.selectedItems[0].fillColor.lightness,
            a: this.selectedItems[0].fillColor.alpha
          }
        }
      } else {
        return {
          style: 'transparent',
          obj: {
            h: 0,
            s: 0,
            l: 0,
            a: 0
          }
        }
      }
    },

    /**
     * Returns the stroke color of the selected item(s) only if all items in the
     * selection are the same color. Otherwise, return transparent.
     */
    selectedStrokeColor () {
      if (this.selectedItems.length > 0 && this.selectedItems.every(
        (value, index, array) => (
          value.strokeColor !== null &&
            value.strokeColor.hue === array[0].strokeColor.hue &&
            value.strokeColor.saturation === array[0].strokeColor.saturation &&
            value.strokeColor.lightness === array[0].strokeColor.lightness &&
            value.strokeColor.alpha === array[0].strokeColor.alpha
        )
      )) {
        let color = {
          h: this.selectedItems[0].strokeColor.hue,
          s: this.selectedItems[0].strokeColor.saturation,
          l: this.selectedItems[0].strokeColor.lightness,
          a: this.selectedItems[0].strokeColor.alpha
        }
        return {
          style: this.selectedItems[0].strokeColor.toCSS(),
          obj: color
        }
      } else {
        return {
          style: 'transparent',
          obj: {
            h: 0,
            s: 0,
            l: 0,
            a: 0
          }
        }
      }
    }
  },

  methods: {
    ...mapGetters({
      getSelectedItems: 'annotation/getSelectedItems'
    })
  }
}
</script>

<style lang='css' scoped>
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

.action {
  margin-right: 8px;
  height: 30px;
  margin-bottom: 0px;
}

.input-group {
  padding: 7px 20px 7px 10px;
}

#list {
  background-color: #eeeeee;
}
</style>
