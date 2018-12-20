<template>
  <div
    id="hint-card"
    class="elevation-1">

    <div id="hint">

      {{ steps[activeStep].instruction }}

      <v-divider/>

      <div v-if="!this.validationStarted">
        <v-btn small color="primary" @click="startValidation"> Start </v-btn>
      </div>

      <v-container fluid id="validation-controls" v-else>
        <v-layout>
          <v-flex xs2>

            <v-btn flat icon color="primary" @click="goToPreviousItem">
              <v-icon> arrow_back </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs8>
            <v-layout align-center justify-center>
              <v-flex xs4>
                <span id="item-title">
                  Item: {{ this.activeItemIndex + 1  }} / {{ this.getItemsForValidation().length }}
                </span>
              </v-flex>

              <v-flex xs4>
                <span id="item-title">
                  Class: {{ this.getItemsForValidation()[this.activeItemIndex].class }}
                </span>
              </v-flex>

              <v-flex xs4>
                <span id="item-title">
                  Score: {{ Math.round(this.getItemsForValidation()[this.activeItemIndex].predictionScore * 100) / 100 }}
                </span>
              </v-flex>

            </v-layout>

            <v-divider></v-divider>

            <v-layout align-center justify-center>

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
            <v-btn flat icon color="primary" @click="goToNextItem">
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

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      activeStep: state => state.editor.activeStep,
      steps: state => state.editor.steps,
      viewport: state => state.image.OSDviewer.viewport,
      activeValidationIndex: state => state.editor.activeValidationIndex
    })
  },

  data () {
    return {
      validationStarted: false,
      activeItemIndex: 0,
      activeValidationButton: '',
      paperItem: null,
      validationStartTime: 0
    }
  },

  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },

  destroyed () {
    window.removeEventListener('keydown', this.keyDown)
  },

  methods: {
    ...mapGetters({
      getItemsForValidation: 'annotation/getItemsForValidation'
    }),

    ...mapActions({
      saveProject: 'common/saveProject',
      setActiveValidationIndex: 'editor/setActiveValidationIndex',
      refreshAnnotationState: 'annotation/refreshAnnotationState'
    }),

    goToNextItem () {
      this.activeItemIndex === (this.getItemsForValidation().length - 1) ? this.activeItemIndex = 0 : this.activeItemIndex++
      this.goToItem(this.getItemsForValidation()[this.activeItemIndex])
      this.paperItem = this.findPaperItem(this.getItemsForValidation()[this.activeItemIndex])
      this.validationStartTime = Date.now()
    },

    goToPreviousItem () {
      this.activeItemIndex === 0 ? (this.activeItemIndex = this.getItemsForValidation().length - 1) : this.activeItemIndex--
      this.goToItem(this.getItemsForValidation()[this.activeItemIndex])
      this.paperItem = this.findPaperItem(this.getItemsForValidation()[this.activeItemIndex])
      this.validationStartTime = Date.now()
    },

    markCorrect () {
      this.paperItem.strokeColor = '#4CAF50'
      this.paperItem.fillColor = '#4CAF50'
      this.flashAndFadeFillColor(this.paperItem)
      this.saveDecisionAndGoToNext('correct')
    },

    flagForReview () {
      this.paperItem.strokeColor = '#FFC107'
      this.paperItem.fillColor = '#FFC107'
      this.flashAndFadeFillColor(this.paperItem)
      this.saveDecisionAndGoToNext('flag')
    },

    markIncorrect () {
      this.paperItem.strokeColor = '#FF5252'
      this.paperItem.fillColor = '#FF5252'
      this.flashAndFadeFillColor(this.paperItem)
      this.saveDecisionAndGoToNext('incorrect')
    },

    goToItem (item) {
      this.viewport.fitBoundsWithConstraints(
        this.viewport.imageToViewportRectangle(
          new openseadragon.Rect(
            item.bounds.x - (0.1 * item.bounds.width),
            item.bounds.y - (0.1 * item.bounds.height),
            item.bounds.width * 1.2,
            item.bounds.height * 1.2
          )
        ),
        true
      )
    },

    findPaperItem (item) {
      return paper.project.getItem({
        inside: new paper.Rectangle(
          item.bounds.x,
          item.bounds.y,
          item.bounds.width,
          item.bounds.height
        ),
        class: 'Path'
      })
    },

    keyDown (e) {
      switch (e.keyCode) {
        case 39:
          this.goToNextItem()
          break
        case 37:
          this.goToPreviousItem()
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

    flashAndFadeFillColor (item) {
      item.fillColor.alpha = 0.6
      let fade = window.setInterval(() => {
        item.fillColor.alpha = item.fillColor.alpha - 0.05
      }, 100)

      window.setTimeout(() => {
        window.clearInterval(fade)
      }, 800)
    },

    async startValidation () {
      await this.refreshAnnotationState()

      if (this.activeValidationIndex > this.getItemsForValidation().length || this.activeValidationIndex === 0) {
        this.activeItemIndex = this.getItemsForValidation().length - 1
      } else {
        this.activeItemIndex = this.activeValidationIndex - 1
      }
      this.goToNextItem()
      this.validationStarted = true
    },

    saveDecisionAndGoToNext (decision) {
      if (!this.paperItem.data['data'] || !this.paperItem.data['data'].validations) {
        this.paperItem.data['data'] = {}
        this.paperItem.data['data'].validations = []
      }

      this.paperItem.data['data'].validations.push(
        {
          decision: decision,
          timeStamp: Date.now(),
          decisionTimeInMs: Date.now() - this.timeBeganValidatingAtInMs
        }
      )

      setTimeout(() => {
        this.goToNextItem()
        this.setActiveValidationIndex(this.activeItemIndex)
        this.saveProject({
          notification: false
        })
      }, 500)
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

#item-title {
  padding: 5px 0px;
}
</style>
