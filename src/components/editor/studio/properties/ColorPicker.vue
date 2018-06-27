// ColorPicker.vue
// Component triggers a color picker dialog.
// The color change will be applied to all the currently selected items
<template lang="html">
  <v-dialog
    v-model="dialog"
    width="225px">

    <a slot="activator">
      <div
        :style="{ 'background-color': color.style }"
        class="color-tile"
      />
    </a>

    <v-card>
      <colour-picker
        id="picker"
         v-model="colorPick"
      />
    </v-card>

  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

import { Chrome } from 'vue-color'
import paper from 'paper'

export default {
  components: {
    'colour-picker': Chrome
  },

  props: {
    color: {
      type: Object,
      default: function () {
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
    type: {
      type: String,
      default: function () {
        return 'fill'
      }
    }
  },

  data () {
    return {
      dialog: false,
      colorPick: {hsl: this.color.obj}
    }
  },

  computed: {
    ...mapState({
      selectedItems: state => state.annotation.selectedItems
    })
  },

  watch: {
    // Whenever dialog toggled, change the colour of the selected items
    dialog (pickerToggle) {
      // on closing the dialog
      if (!pickerToggle) {
        // If there are items selected in the current project
        if (this.selectedItems.length > 0) {
          // Change the color of the selected items.
          this.selectedItems.map(item => {
            if (this.type === 'fill') {
              item.fillColor = new paper.Color({
                hue: this.colorPick.hsl.h,
                saturation: this.colorPick.hsl.s,
                lightness: this.colorPick.hsl.l,
                alpha: this.colorPick.hsl.a
              })
            } else if (this.type === 'stroke') {
              item.strokeColor = new paper.Color({
                hue: this.colorPick.hsl.h,
                saturation: this.colorPick.hsl.s,
                lightness: this.colorPick.hsl.l,
                alpha: this.colorPick.hsl.a
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang='css' scoped>
.color-tile {
  width: 20px;
  height: 20px;
  margin: auto;
  border: 1px solid #616161;
}
</style>
