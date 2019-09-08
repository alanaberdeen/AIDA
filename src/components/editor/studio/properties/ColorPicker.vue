<template lang="html">
  <v-dialog
    v-model="dialog"
    width="300px"
  >
    <template v-slot:activator="{ on }">
      <v-btn text icon absolute v-on="on">
        <div
          :style="{ 'background-color': color.style }"
          class="color-tile"
        />
      </v-btn>
    </template>

    <v-color-picker v-model="colorPick"/>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import paper from 'paper'

export default {
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
      colorPick: { hsla: this.color.obj }
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
        this.colorPick = this.color.obj
      } else if (!colorPickerOpen) {
        if (this.selectedItems.length > 0) {
          if (this.type === 'fill') {
            this.changeItemsFillColor(this.selectedItems)
            this.flagAnnotationEdits()
          } else if (this.type === 'stroke') {
            this.changeItemsStrokeColor(this.selectedItems)
            this.flagAnnotationEdits()
          }
        }
      }
    }
  },

  methods: {
    ...mapActions({
      flagAnnotationEdits: 'annotation/flagAnnotationEdits'
    }),

    changeItemsFillColor (items) {
      items.map(item => {
        item.fillColor = new paper.Color({
          hue: this.colorPick.h,
          saturation: this.colorPick.s,
          lightness: this.colorPick.l,
          alpha: this.colorPick.a
        })
      })
    },

    changeItemsStrokeColor (items) {
      items.map(item => {
        item.strokeColor = new paper.Color({
          hue: this.colorPick.h,
          saturation: this.colorPick.s,
          lightness: this.colorPick.l,
          alpha: this.colorPick.a
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
