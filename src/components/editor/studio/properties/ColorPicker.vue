<template lang="html">
  <v-dialog
    v-model="dialog"
    width="225px"
  >

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
      colorPick: { hsl: this.color.obj }
    }
  },

  computed: {
    ...mapState({
      selectedItems: state => state.annotation.selectedItems
    })
  },

  watch: {
    dialog (colorPickerOpen) {
      if (colorPickerOpen) {
        this.colorPick = { hsl: this.color.obj }
      } else if (!colorPickerOpen) {
        if (this.selectedItems.length > 0) {
          if (this.type === 'fill') {
            this.changeItemsFillColor(this.selectedItems)
          } else if (this.type === 'stroke') {
            this.changeItemsStrokeColor(this.selectedItems)
          }
        }
      }
    }
  },

  methods: {
    changeItemsFillColor (items) {
      items.map(item => {
        item.fillColor = new paper.Color({
          hue: this.colorPick.hsl.h,
          saturation: this.colorPick.hsl.s,
          lightness: this.colorPick.hsl.l,
          alpha: this.colorPick.hsl.a
        })
      })
    },

    changeItemsStrokeColor (items) {
      items.map(item => {
        item.strokeColor = new paper.Color({
          hue: this.colorPick.hsl.h,
          saturation: this.colorPick.hsl.s,
          lightness: this.colorPick.hsl.l,
          alpha: this.colorPick.hsl.a
        })
      })
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
