// Component provides an interface for cycling through the megakaryocytes
// predictions in the interface and provide validated feedback
<template>

  <div
    id="hint-card"
    class="elevation-1">
    <div id="hint">
      {{ steps[activeStep].instruction }}

      <v-divider></v-divider>

      <div v-if="!this.begin">
        <v-btn small color="primary" @click="beginValidation"> Begin </v-btn>
      </div>

      <!-- Validation controls section -->
      <v-container fluid id="validation-controls" v-else>
        <v-layout>
          <v-flex xs2>
            <!-- Back Button -->
            <v-btn flat icon color="primary" @click="previousMega">
              <v-icon> arrow_back </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs8>
            <v-layout align-center justify-center>
              <!-- Number of megas -->
              <span id="mega-title">
                Mega: {{ this.activeMegaIndex + 1  }} / {{ this.getMegas().length }}
                Score: {{ Math.round(this.getMegas()[this.activeMegaIndex].data.score * 100) / 100 }}
              </span>
            </v-layout>
            <v-divider></v-divider>
            <v-layout align-center justify-center>
              <!-- Number of megas -->
              <v-btn small color="success"
              :outline="!(this.activeValidationButton === 'correct')"
              :depressed="this.activeValidationButton === 'correct'"
              @click="markCorrect"
              >
                Correct
              </v-btn>
              <v-btn small color="warning"
              :outline="!(this.activeValidationButton === 'flag')"
              :depressed="this.activeValidationButton === 'flag'"
              @click="flagForReview">
                Flag for review
              </v-btn>
              <v-btn small color="error"
              :outline="!(this.activeValidationButton === 'incorrect')"
              :depressed="this.activeValidationButton === 'incorrect'"
              @click="markIncorrect">
                Incorrect
              </v-btn>
            </v-layout>
          </v-flex>

          <v-flex xs2 text-xs-right>
            <!-- Forward Button -->
            <v-btn flat icon color="primary" @click="nextMega">
              <v-icon> arrow_forward </v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      <div>

      </div>
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
      begin: false,
      activeMegaIndex: 0,
      activeValidationButton: '',
      paperMega: null,
      startVerifyTime: 0
    }
  },

  mounted () {
    // Add event listeners for the key shortcuts
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
  },

  destroyed () {
    // Remove the event listeners for key shortcuts
    window.removeEventListener('keydown', this.keyDown)
  },

  methods: {
    ...mapGetters({
      getMegas: 'annotation/getMegas'
    }),

    nextMega () {
      // If at the end of the set of Megas then go to the beginning, else increment
      if (this.activeMegaIndex === (this.getMegas().length - 1)) {
        this.activeMegaIndex = 0
      } else {
        this.activeMegaIndex++
      }
      this.goToActiveMega()

      // Set the mega we're looking at
      this.highlightMega(this.getMegas()[this.activeMegaIndex])

      // Record the time at which the verification decision started.
      this.startVerifyTime = Date.now()
    },

    previousMega () {
      // If at the start of the set of Megas then go to the end, else decrement
      if (this.activeMegaIndex === 0) {
        this.activeMegaIndex = this.getMegas().length - 1
      } else {
        this.activeMegaIndex--
      }
      this.goToActiveMega()

      // Set the mega we're looking at
      this.highlightMega(this.getMegas()[this.activeMegaIndex])
    },

    // Mark the currently active mega as a correct classification
    markCorrect () {
      // Set the stroke color and fill to represent a correct classificaiton.
      this.paperMega.strokeColor = '#4CAF50'
      this.paperMega.fillColor = '#4CAF50'

      // Flash and then fade the fill color
      this.flashAndFade(this.paperMega)

      // Add to the validation data this validation event.
      this.paperMega.data['data'].validations.push(
        {
          decision: 'correct',
          time: Date.now(),
          timeTaken: Date.now() - this.startVerifyTime
        }
      )

      // Go to the next prediction
      this.nextMega()
    },

    // Initiate mega adjustment
    flagForReview () {
      // Set the stroke color and fill to represent a correct classificaiton.
      this.paperMega.strokeColor = '#FFC107'
      this.paperMega.fillColor = '#FFC107'

      // Flash and then fade the fill color
      this.flashAndFade(this.paperMega)

      // Add to the validation data this validation event.
      this.paperMega.data['data'].validations.push(
        {
          decision: 'flag',
          time: Date.now(),
          timeTaken: Date.now() - this.startVerifyTime
        }
      )

      // Go to the next prediction
      this.nextMega()
    },

    // Mark the currently active mega as incorrect, a miss-classificaiton
    markIncorrect () {
      // Set the stroke color and fill to represent a correct classificaiton.
      this.paperMega.strokeColor = '#FF5252'
      this.paperMega.fillColor = '#FF5252'

      // Flash and then fade the fill color
      this.flashAndFade(this.paperMega)

      // Add to the validation data this validation event.
      this.paperMega.data['data'].validations.push(
        {
          decision: 'incorrect',
          time: Date.now(),
          timeTaken: Date.now() - this.startVerifyTime
        }
      )

      // Go to the next prediction
      this.nextMega()
    },

    // Pan and zoom the viewer to the active mega
    goToActiveMega () {
      // Make sure everything is deselected
      paper.project.deselectAll()

      let mega = this.getMegas()[this.activeMegaIndex]
      this.viewport.fitBoundsWithConstraints(
        this.viewport.imageToViewportRectangle(
          new openseadragon.Rect(
            mega.from.x,
            mega.from.y,
            mega.to.x - mega.from.x,
            mega.to.y - mega.from.y
          )
        )
      )
    },

    // Given a mega represented by the annotation state select it in paperJS
    highlightMega (mega) {
      this.paperMega = paper.project.getItem({
        overlapping: new paper.Rectangle(
          mega.from,
          mega.to
        ),
        class: 'Path'
      })
    },

    // Attach event listeners for the keyboard shortcuts
    keyDown (e) {
      switch (e.keyCode) {
        case 39:
          this.nextMega()
          break
        case 37:
          this.previousMega()
          break
        case 49:
          if (!e.getModifierState('Meta')) { this.markCorrect() }
          break
        case 50:
          if (!e.getModifierState('Meta')) { this.flagForReview() }
          break
        case 51:
          if (!e.getModifierState('Meta')) { this.markIncorrect() }
      }
    },

    // Flash the fill color of a paperJS item and then fade it
    flashAndFade (item) {
      item.fillColor.alpha = 0.7
      let fade = window.setInterval(() => {
        item.fillColor.alpha = item.fillColor.alpha - 0.1
      }, 100)

      // Remove the fade
      window.setTimeout(() => {
        window.clearInterval(fade)
      }, 800)
    },

    // Begin validating the predictions
    beginValidation () {
      // Hack to start beginning of list of megas
      this.activeMegaIndex = this.getMegas().length - 1
      this.nextMega()

      this.begin = true
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
