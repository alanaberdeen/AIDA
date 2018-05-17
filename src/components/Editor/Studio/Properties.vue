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
        <v-list-tile>

          <v-list-tile-content>
            <v-list-tile-title class="faIcons">
              No. selected items:
            </v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            {{ numItems }}
          </v-list-tile-action>

        </v-list-tile>

        <v-list-tile>

          <v-list-tile-content>
            <v-list-tile-title class="faIcons">
              Fill colour:
            </v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
              icon
              class="action pointers-no">
              <colour-picker
                :color="groupFillColor"
                :type="'fill'"
                class="pointers-please"/>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>

        <v-list-tile>

          <v-list-tile-content>
            <v-list-tile-title class="faIcons">
              Stroke colour:
            </v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
              icon
              class="action pointers-no">
              <colour-picker
                :color="groupStrokeColor"
                :type="'stroke'"
                class="pointers-please"/>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>

      </v-list>
    </v-card>
  </div>
</template>

<script>
import { eventBus } from '../../../main'
import ColorPicker from './ColorPicker.vue'

export default {

  components: {
    'colour-picker': ColorPicker
  },
  data () {
    return {
      numItems: 0,
      groupFillColor: {
        style: 'transparent',
        obj: {
          h: 0,
          s: 0,
          l: 0,
          a: 0
        }
      },
      groupStrokeWidth: '',
      groupStrokeColor: {
        style: 'transparent',
        obj: {
          h: 0,
          s: 0,
          l: 0,
          a: 0
        }
      },
      color: 'blue'
    }
  },

  created () {
    // Listen for an event indicating the selection has changed and
    // update the component data appropriately.
    eventBus.$on('selectionChanged', (selection) => {
      if (selection.length >= 1) {
        this.numItems = 0
        selection.forEach((item) => {
          if (item.className === 'Group') {
            if (item.fillColor) {
              let hue = item.fillColor.hue
              let sat = (item.fillColor.saturation * 100) + '%'
              let light = (item.fillColor.lightness * 100) + '%'
              let alpha = item.fillColor.alpha

              this.groupFillColor.style = 'hsla(' + hue + ', ' + sat + ', ' + light + ', ' + alpha + ')'
              this.groupFillColor.obj = {
                h: hue,
                s: sat,
                l: light,
                a: alpha
              }
            } else {
              this.groupFillColor.style = 'transparent'
              this.groupFillColor.obj = {
                h: 0,
                s: 0,
                l: 0,
                a: 0
              }
            }

            if (item.strokeColor) {
              let hue = item.strokeColor.hue
              let sat = (item.strokeColor.saturation * 100) + '%'
              let light = (item.strokeColor.lightness * 100) + '%'
              let alpha = item.strokeColor.alpha

              this.groupStrokeColor.style = 'hsla(' + hue + ', ' + sat + ', ' + light + ', ' + alpha + ')'
              this.groupStrokeColor.obj = {
                h: hue,
                s: sat,
                l: light,
                a: alpha
              }
            } else {
              this.groupStrokeColor.style = 'transparent'
              this.groupStrokeColor.obj = {
                h: 0,
                s: 0,
                l: 0,
                a: 0
              }
            }
          } else {
            this.numItems++
          }
        })
      } else {
        // Reset property data
        this.numItems = 0
        this.groupFillColor = {
          style: 'transparent',
          obj: {
            h: 0,
            s: 0,
            l: 0,
            a: 0
          }
        }
        this.groupStrokeWidth = ''
        this.groupStrokeColor = {
          style: 'transparent',
          obj: {
            h: 0,
            s: 0,
            l: 0,
            a: 0
          }
        }
      }
    })
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

.action {
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

</style>
