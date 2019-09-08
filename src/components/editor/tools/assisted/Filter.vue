<template>
  <v-list-item id="tool-tile">
    <v-menu
      id="menu"
      :close-on-content-click="false"
      :nudge-width="150"
      :nudge-right="10"
      transition="slide-x-transition"
      v-model="menu"
      offset-x
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip right open-delay="700">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              id="filter"
              v-on="{ ...tooltip, ...menu }"
              text
              block
              @click.native="initialiseTool"
            >
              <v-icon
                small
                :class="{'grey--text text--darken-2': !active,
                        'blue--text text--darken-1': active}">
                mdi-filter
              </v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      <span>Filter tool</span>

      <v-card>
        <!-- <v-list>
          <v-list-item>
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
          </v-list-item>
        </v-list> -->

        <!-- <v-container fluid grid-list-sm>
          <v-layout row wrap>
            <v-flex xs9 offset-xs3>
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
            </v-flex>
          </v-layout> -->

          <!-- <v-layout align-center row>
            <v-flex xs3>
              Alan
            </v-flex>
            <v-flex xs9>
              <v-btn-toggle v-model="toggle_multiple" multiple>
                <v-btn id='toggle-button' depressed color="success"/>
                <v-btn id='toggle-button' depressed color="warning"/>
                <v-btn id='toggle-button' depressed color="error"/>
              </v-btn-toggle>
            </v-flex>
          </v-layout>

          <v-layout align-center justify-space-around row fill-height>
            <v-flex xs3>
              Gabi
            </v-flex>
            <v-flex xs9>
              <v-btn-toggle v-model="toggle_multiple" multiple>
                <v-btn id='toggle-button' depressed color="success"/>
                <v-btn id='toggle-button' depressed color="warning"/>
                <v-btn id='toggle-button' depressed color="error"/>
              </v-btn-toggle>
            </v-flex>
          </v-layout>

          <v-layout align-center justify-space-around row fill-height>
            <v-flex xs3>
              Gareth
            </v-flex>
            <v-flex xs9>
              <v-btn-toggle v-model="toggle_multiple" multiple>
                <v-btn id='toggle-button' depressed color="success"/>
                <v-btn id='toggle-button' depressed color="warning"/>
                <v-btn id='toggle-button' depressed color="error"/>
              </v-btn-toggle>
            </v-flex>
          </v-layout> -->

        <!-- </v-container> -->

        <v-container>
          <v-layout>
            <v-flex xs12>
              <v-text-field
                label="Create class filter group"
                box
                @keyup.native.enter="createFilterGroup"
              ></v-text-field>
            </v-flex>
          </v-layout>

           <v-list>
              <v-list-item
                v-for="(item, index) in listOfFilters"
                :key="item.class"
                avatar
              >

                <v-list-item-content>
                  <v-list-item-title v-html="item.class"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn flat icon color="pink" @click="popFilter(index)">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
        </v-container>
      </v-card>
    </v-menu>
  </v-list-item>
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
      predictions: {
        correct: [],
        flagged: [],
        incorrect: [],
        alan: {
          correct: [],
          flagged: [],
          incorrect: []
        },
        gabi: {
          correct: [],
          flagged: [],
          incorrect: []
        },
        gareth: {
          correct: [],
          flagged: [],
          incorrect: []
        }
      },
      correctPredictions: [],
      flaggedPredictions: [],
      incorrectPredictions: [],
      visiblePredictions: {
        alan: [0, 1, 2],
        gareth: [0, 1, 2],
        gabi: [0, 1, 2]
      },
      listOfFilters: []
    }
  },

  watch: {
    visiblePrediction: function (val) {

    },

    listOfFilters: function (filters) {
      filters.map(filter => {
        let filterGroup = paper.project.getItems({
          data: {
            class: filter.class
          }
        })

        filterGroup.map(item => item.remove())
      })
    },

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
      let allPredictions = paper.project.getItems({
        data: {
          class: 'megakaryocyte'
        }
      })

      this.predictions.correct = allPredictions.filter(item =>
        'data' in item.data &&
          'validations' in item.data.data &&
          item.data.data.validations[item.data.data.validations.length - 1].decision === 'correct'
      )

      this.predictions.flagged = allPredictions.filter(item =>
        'data' in item.data &&
          'validations' in item.data.data &&
          item.data.data.validations[item.data.data.validations.length - 1].decision === 'flag'
      )

      this.predictions.incorrect = allPredictions.filter(item =>
        'data' in item.data &&
          'validations' in item.data.data &&
          item.data.data.validations[item.data.data.validations.length - 1].decision === 'incorrect'
      )
    },

    createFilterGroup (input) {
      this.listOfFilters.push({
        class: input.target.value,
        active: false
      })
    },

    popFilter (index) {
      this.listOfFilters.splice(index, 1)
    }
  }

}
</script>

<style lang='css' scoped>
#menu {
  width: 100%;
}

#filter {
  min-width: 0px;
}

#toggle-button {
  width: 40px;
  margin-right: 1px;
}

#tool-tile {
  padding: 0px;
}
</style>
