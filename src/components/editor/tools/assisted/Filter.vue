<template>
  <v-list-tile id="tool-tile">
    <v-menu
      id="menu"
      :close-on-content-click="false"
      :nudge-width="150"
      :nudge-right="10"
      transition="slide-x-transition"
      v-model="menu"
      offset-x
    >
      <v-btn
        id="filter"
        slot="activator"
        flat
        block
        @click.native="initialiseTool"
      >
        <i
          :class="{
            'fa': true,
            'fa-filter': !loading,
            'fa-spinner': loading,
            'fa-pulse': loading,
            'faIcons': !active,
            'faIconsActive': active
        }"/>
      </v-btn>

      <v-card>
        <v-list>
          <v-list-tile>
            <v-btn-toggle v-model="toggle_multiple" multiple>
              <v-btn flat color="success">
                <v-icon>check_circle</v-icon>
              </v-btn>
              <v-btn flat color="warning">
                <v-icon>flag</v-icon>
              </v-btn>
              <v-btn flat color="error">
                <v-icon>cancel</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-list-tile>
        </v-list>

      </v-card>
    </v-menu>
  </v-list-tile>

</template>

<script>
import paper from 'paper'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      menu: false,
      loading: false,
      toggle_multiple: [0, 1, 2],
      predictions: [],
      correctPredictions: [],
      flaggedPredictions: [],
      incorrectPredictions: []
    }
  },

  watch: {
    toggle_multiple: function (val) {
      // Filter correct predictions
      if (!this.toggle_multiple.includes(0)) {
        this.correctPredictions = this.predictions.filter(item =>
          'data' in item.data &&
          'validations' in item.data.data &&
          item.data.data.validations[item.data.data.validations.length - 1].decision === 'correct'
        )

        this.correctPredictions.map(item => item.remove())
      } else {
        paper.project.activeLayer.addChildren(this.correctPredictions)
        this.correctPredictions = []
      }

      // Filter flagged predictions
      if (!this.toggle_multiple.includes(1)) {
        this.flaggedPredictions = this.predictions.filter(item =>
          'data' in item.data &&
          'validations' in item.data.data &&
          item.data.data.validations[item.data.data.validations.length - 1].decision === 'flag'
        )

        this.flaggedPredictions.map(item => item.remove())
      } else {
        paper.project.activeLayer.addChildren(this.flaggedPredictions)
        this.flaggedPredictions = []
      }

      // Filter incorrect predictions
      if (!this.toggle_multiple.includes(2)) {
        this.incorrectPredictions = this.predictions.filter(item =>
          'data' in item.data &&
          'validations' in item.data.data &&
          item.data.data.validations[item.data.data.validations.length - 1].decision === 'incorrect'
        )

        this.incorrectPredictions.map(item => item.remove())
      } else {
        paper.project.activeLayer.addChildren(this.incorrectPredictions)
        this.incorrectPredictions = []
      }
    }
  },

  methods: {
    initialiseTool () {
      this.predictions = paper.project.getItems({
        data: {
          class: 'megakaryocyte'
        }
      })
    }
  }

}
</script>

<style lang='css' scoped>
#tooltip {
  width: 100%;
}

#menu {
  width: 100%;
}

#filter {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}

#switch {
  padding-top: 25px;
  padding-left: 10px;
}
</style>
