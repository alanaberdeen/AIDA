<template>

  <div
    id="hint-card"
    class="elevation-1">

    <div id="hint">

      {{ steps[activeStep].instruction }}

      <v-divider></v-divider>

      <div v-if="!this.begunValidation">
        <v-btn small color="primary" @click="beginValidation"> Begin </v-btn>
      </div>

      <v-container fluid id="validation-controls" v-else>
        <v-layout>
          <v-flex xs2>

            <v-btn flat icon color="primary" @click="intialisePreviousMegaForValidation">
              <v-icon> arrow_back </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs8>
            <v-layout align-center justify-center>

              <!-- Number of megas -->
              <span id="mega-title">
                Mega: {{ this.activeMegaIndex + 1  }} / {{ this.getMegas().length }}
                <!-- Score: {{ Math.round(this.getMegas()[this.activeMegaIndex].data.score * 100) / 100 }} -->
              </span>
            </v-layout>

            <v-divider></v-divider>

            <v-layout align-center justify-center>

              <v-btn small color="success"
              :outline="!(this.activeValidationButton === 'correct')"
              :depressed="this.activeValidationButton === 'correct'"
              @click="validatePredictionAsCorrect"
              >
                Correct
              </v-btn>

              <v-btn small color="warning"
              :outline="!(this.activeValidationButton === 'flag')"
              :depressed="this.activeValidationButton === 'flag'"
              @click="flagPredictionForReview">
                Flag for review
              </v-btn>

              <v-btn small color="error"
              :outline="!(this.activeValidationButton === 'incorrect')"
              :depressed="this.activeValidationButton === 'incorrect'"
              @click="validatePredictionAsIncorrect">
                Incorrect
              </v-btn>
            </v-layout>
          </v-flex>

          <v-flex xs2 text-xs-right>

            <v-btn flat icon color="primary" @click="intialiseNextMegaForValidation">
              <v-icon> arrow_forward </v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>

</template>

<script>
import openseadragon from 'openseadragon'
import paper from 'paper'

import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      activeStep: state => state.editor.activeStep,
      steps: state => state.editor.steps,
      viewport: state => state.image.OSDviewer.viewport
    })
  },

  data () {
    return {
      begunValidation: false,
      activeMegaIndex: 0,
      activeValidationButton: '',
      paperMega: null,
      timeBeganValidatingAtInMs: 0
    }
  },

  mounted () {
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
  },

  destroyed () {
    window.removeEventListener('keydown', this.keyDown)
  },

  methods: {
    ...mapGetters({
      getMegas: 'annotation/getMegas'
    }),

    intialiseNextMegaForValidation () {
      this.activeMegaIndex === (this.getMegas().length - 1) ? this.activeMegaIndex = 0 : this.activeMegaIndex++

      this.goToMega(this.getMegas()[this.activeMegaIndex])
      this.paperMega = this.findPaperMega(this.getMegas()[this.activeMegaIndex])
      this.timeBeganValidatingAtInMs = Date.now()
    },

    intialisePreviousMegaForValidation () {
      this.activeMegaIndex === 0 ? (this.activeMegaIndex = this.getMegas().length - 1) : this.activeMegaIndex--

      this.goToMega(this.getMegas()[this.activeMegaIndex])
      this.paperMega = this.findPaperMega(this.getMegas()[this.activeMegaIndex])
      this.timeBeganValidatingAtInMs = Date.now()
    },

    validatePredictionAsCorrect () {
      this.paperMega.strokeColor = '#4CAF50'
      this.paperMega.fillColor = '#4CAF50'

      this.flashAndFadeFillColor(this.paperMega)

      this.paperMega.data['data'].validations.push(
        {
          decision: 'correct',
          timeStamp: Date.now(),
          decisionTimeInMs: Date.now() - this.timeBeganValidatingAtInMs
        }
      )
      setTimeout(() => {
        this.intialiseNextMegaForValidation()
      }, 500)
    },

    flagPredictionForReview () {
      this.paperMega.strokeColor = '#FFC107'
      this.paperMega.fillColor = '#FFC107'

      this.flashAndFadeFillColor(this.paperMega)

      this.paperMega.data['data'].validations.push(
        {
          decision: 'flag',
          timeStamp: Date.now(),
          decisionTimeInMs: Date.now() - this.timeBeganValidatingAtInMs
        }
      )

      setTimeout(() => {
        this.intialiseNextMegaForValidation()
      }, 500)
    },

    validatePredictionAsIncorrect () {
      this.paperMega.strokeColor = '#FF5252'
      this.paperMega.fillColor = '#FF5252'

      this.flashAndFadeFillColor(this.paperMega)

      this.paperMega.data['data'].validations.push(
        {
          decision: 'incorrect',
          timeStamp: Date.now(),
          decisionTimeInMs: Date.now() - this.timeBeganValidatingAtInMs
        }
      )

      setTimeout(() => {
        this.intialiseNextMegaForValidation()
      }, 500)
    },

    goToMega (mega) {
      this.viewport.fitBoundsWithConstraints(
        this.viewport.imageToViewportRectangle(
          new openseadragon.Rect(
            mega.from.x,
            mega.from.y,
            mega.to.x - mega.from.x,
            mega.to.y - mega.from.y
          )
        ),
        true
      )
    },

    findPaperMega (mega) {
      return paper.project.getItem({
        inside: new paper.Rectangle(
          mega.from,
          mega.to
        ),
        class: 'Path'
      })
    },

    keyDown (e) {
      switch (e.keyCode) {
        case 39:
          this.intialiseNextMegaForValidation()
          break
        case 37:
          this.intialisePreviousMegaForValidation()
          break
        case 49:
          if (!e.getModifierState('Meta')) { this.validatePredictionAsCorrect() }
          break
        case 50:
          if (!e.getModifierState('Meta')) { this.flagPredictionForReview() }
          break
        case 51:
          if (!e.getModifierState('Meta')) { this.validatePredictionAsIncorrect() }
      }
    },

    flashAndFadeFillColor (item) {
      item.fillColor.alpha = 0.6
      let fade = window.setInterval(() => {
        item.fillColor.alpha = item.fillColor.alpha - 0.05
      }, 100)

      window.setTimeout(() => {
        window.clearInterval(fade)
      }, 800)
    },

    beginValidation () {
      this.activeMegaIndex = this.getMegas().length - 1
      this.intialiseNextMegaForValidation()
      this.begunValidation = true
    }
  }

}
</script>

<style scoped>
#hint-card {
  background-color: #eeeeee;
}

#hint {
  color: #616161;
  padding: 5px 24px;
  margin: 0px;
}

#validation-controls {
  padding: 0px;
}

#mega-title {
  padding: 5px 0px;
}
</style>
