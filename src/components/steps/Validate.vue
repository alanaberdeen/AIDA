// Component provides an interface for cycling through the megakaryocytes
// predictions in the interface and provide validated feedback
<template>

  <div
    id="hint-card"
    class="elevation-1">
    <div id="hint">
      {{ steps[activeStep].instruction }}

      <v-divider></v-divider>

      <!-- Validation controls section -->
      <v-container fluid id="validation-controls">
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
                <!-- Score: {{ Math.round(this.getMegas()[this.activeMegaIndex].data.score * 100) / 100 }} -->
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
              :outline="!(this.activeValidationButton === 'adjusted')"
              :depressed="this.activeValidationButton === 'adjusted'"
              @click="markAdjusted">
                Adjust
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
      activeMegaIndex: 0,
      activeValidationButton: '',
      paperMega: null
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
      if (this.activeMegaIndex === (this.getMegas().length - 1)) {
        this.activeMegaIndex = 0
      } else {
        this.activeMegaIndex++
      }
      this.goToActiveMega()
      this.highlightMega(this.getMegas()[this.activeMegaIndex])
    },

    previousMega () {
      if (this.activeMegaIndex === 0) {
        this.activeMegaIndex = this.getMegas().length - 1
      } else {
        this.activeMegaIndex--
      }
      this.goToActiveMega()
      this.highlightMega(this.getMegas()[this.activeMegaIndex])
    },

    // Mark the currently active mega as a correct classification
    markCorrect () {
      paper.project.deselectAll()

      // Set the stroke color and fill to represent a correct classificaiton.
      this.paperMega.strokeColor = '#4CAF50'
      this.paperMega.fillColor = '#4CAF50'

      // Flash and then fade the fill color
      this.flashAndFade(this.paperMega)

      // Store indicator that the mega has been validated
      this.paperMega.data['data'] = {validation: 'correct'}
      this.activeValidationButton = 'correct'
    },

    // Initiate mega adjustment
    markAdjusted () {
      // Set the stroke color and fill to represent a correct classificaiton.
      this.paperMega.strokeColor = '#FFC107'
      this.paperMega.fillColor = '#FFC107'

      // Flash and then fade the fill color
      this.flashAndFade(this.paperMega)

      // Store indicator that the mega has been validated
      this.paperMega.data['data'] = {validation: 'adjusted'}
      this.activeValidationButton = 'adjusted'

      // Select only this item
      paper.project.deselectAll()
      this.paperMega.selected = true

      // Select move tool
      document.getElementById('move').click()
    },

    // Mark the currently active mega as incorrect, a miss-classificaiton
    markIncorrect () {
      paper.project.deselectAll()

      // Set the stroke color and fill to represent a correct classificaiton.
      this.paperMega.strokeColor = '#FF5252'
      this.paperMega.fillColor = '#FF5252'

      // Flash and then fade the fill color
      this.flashAndFade(this.paperMega)

      // Store indicator that the mega has been validated
      this.paperMega.data['data'] = {validation: 'incorrect'}
      this.activeValidationButton = 'incorrect'
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

      // Check if the mega has already been validated
      if (this.paperMega.data.data && this.paperMega.data.data.validation) {
        // Set the correct validation button to appear active
        this.activeValidationButton = this.paperMega.data.data.validation
      } else {
        this.activeValidationButton = ''
      }
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
          this.markCorrect()
          break
        case 50:
          this.markAdjusted()
          break
        case 51:
          this.markIncorrect()
      }
    },

    // Attach event listeners for the keyboard shortcuts
    // If it's classified as correct or incorrect then switch to the next mega
    keyUp (e) {
      switch (e.keyCode) {
        case 49:
          this.nextMega()
          break
        case 51:
          this.nextMega()
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
