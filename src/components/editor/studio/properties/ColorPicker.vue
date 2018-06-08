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
import { Chrome } from 'vue-color'
import paper from 'paper'
import { eventBus } from '../../../../main'
import { mapState } from 'vuex'

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
      colorPick: this.color.obj
    }
  },

  computed: {
    ...mapState({
      paperScope: state => state.annotation.paperScope
    })
  },

  watch: {
    // Whenever dialog toggled, change the colour of the selected items
    dialog (pickerToggle) {
      if (pickerToggle === true) {
        this.colorPick = this.color.obj
      } else {
        // If there are items selected in the current project
        if (paper.project.selectedItems.length > 1) {
          // Create a temporary group out of the selected items
          let group = paper.project.getItem({
            selected: true,
            className: 'Group'
          })

          if (this.type === 'fill' && this.colorPick.hsl) {
            group.fillColor = new paper.Color({
              hue: this.colorPick.hsl.h,
              saturation: this.colorPick.hsl.s,
              lightness: this.colorPick.hsl.l,
              alpha: this.colorPick.hsl.a
            })
          } else if (this.type === 'stroke' && this.colorPick.hsl) {
            group.strokeColor = new paper.Color({
              hue: this.colorPick.hsl.h,
              saturation: this.colorPick.hsl.s,
              lightness: this.colorPick.hsl.l,
              alpha: this.colorPick.hsl.a
            })
          }

          // Emit selection event to the eventBus so that the properties
          // panel can be updated.
          eventBus.$emit('selectionChanged', paper.project.selectedItems)
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
