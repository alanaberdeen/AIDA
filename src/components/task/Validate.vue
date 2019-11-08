<template>
  <div
    id="hint-card"
    class="elevation-1">

    <div id="hint">
      {{ steps[activeStep].instruction }}

      <v-divider/>

      <div v-if="!this.validationStarted">
        <v-btn small class="primary" :disabled="this.getItemsForValidation().length === 0"
          @click="startValidation">
          Start
        </v-btn>
      </div>

      <v-container fluid id="validation-controls" v-else>
        <v-layout>
          <v-flex xs2>
            <v-btn flat icon color="primary" @click="incrementActiveItemBy(-1)">
              <v-icon> arrow_back </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs8>
            <v-layout align-center justify-center>
                <span id="item-title">
                  {{ this.activeItemIndex + 1  }} / {{ this.getItemsForValidation().length }}
                </span>
            </v-layout>

            <v-divider/>

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
                @click="flagForReview"
              >
                Flag for review
              </v-btn>

              <v-btn small color="error"
                :outline="!(this.activeValidationButton === 'incorrect')"
                :depressed="this.activeValidationButton === 'incorrect'"
                @click="markIncorrect"
              >
                Incorrect
              </v-btn>

              <v-btn small color="blue"
                outline
                @click.stop="createNewItem"
              >
                Create
              </v-btn>
            </v-layout>
          </v-flex>

          <v-flex xs2 text-xs-right>
            <v-btn flat icon color="primary" @click="incrementActiveItemBy(1)">
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
      activeStep: state => state.app.activeStep,
      steps: state => state.app.steps,
      viewport: state => state.image.OSDviewer.viewport,
      activeValidationIndex: state => state.app.activeValidationIndex,
      uid: state => state.backend.user.uid,
      validatorRole: state => state.backend.user.validatorRole
    })
  },

  data () {
    return {
      label: '',
      validationStarted: false,
      activeItemIndex: 0,
      activeValidationButton: '',
      paperItem: null,
      validationStartTime: 0,
      initialItemData: {},
      neutralColor: {
        hue: 170,
        saturation: 0.44,
        lightness: 0.69,
        alpha: 1
      },
      highlightColor: {
        hue: 60,
        saturation: 1,
        lightness: 0.85,
        alpha: 1
      }
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
      setActiveValidationIndex: 'app/setActiveValidationIndex',
      saveClassValidation: 'backend/saveClassValidation',
      saveBoundingBox: 'backend/saveBoundingBox',
      validateItemsBoundingBox: 'backend/validateItemsBoundingBox',
      createNewItemInDB: 'backend/createNewItem'
    }),

    startValidation () {
      if (this.activeValidationIndex === 0) {
        this.activeItemIndex = this.getItemsForValidation().length - 1
      } else {
        this.activeItemIndex = this.activeValidationIndex - 1
      }
      this.incrementActiveItemBy(1)
      this.validationStarted = true
    },

    incrementActiveItemBy (value) {
      if (this.validationStarted) {
        this.checkToSaveValidation()
        this.label = ''
        this.paperItem.strokeColor = this.neutralColor
      }

      if (this.activeItemIndex === (this.getItemsForValidation().length - 1) && value > 0) {
        this.activeItemIndex = 0
      } else if (this.activeItemIndex === 0 && value < 0) {
        this.activeItemIndex = this.getItemsForValidation().length - 1
      } else {
        this.activeItemIndex = this.activeItemIndex + value
      }

      this.goToItem(this.getItemsForValidation()[this.activeItemIndex])

      this.paperItem = this.findPaperItem(this.getItemsForValidation()[this.activeItemIndex])
      this.paperItem.strokeColor = this.highlightColor

      this.validationStartTime = Date.now()
      this.initialItemData = {
        x: this.paperItem.bounds.x,
        y: this.paperItem.bounds.y,
        width: this.paperItem.bounds.width,
        height: this.paperItem.bounds.height
      }
    },

    markCorrect () {
      this.label = 'megakaryocyte'
      this.paperItem.strokeColor = '#4CAF50'
      this.paperItem.fillColor = '#4CAF50'
      this.flashAndFadeFillColor(this.paperItem)
      setTimeout(() => {
        this.incrementActiveItemBy(1)
        this.setActiveValidationIndex(this.activeItemIndex)
      }, 500)
    },

    flagForReview () {
      this.label = 'flag'
      this.paperItem.strokeColor = '#FFC107'
      this.paperItem.fillColor = '#FFC107'
      this.flashAndFadeFillColor(this.paperItem)
      setTimeout(() => {
        this.incrementActiveItemBy(1)
        this.setActiveValidationIndex(this.activeItemIndex)
      }, 500)
    },

    markIncorrect () {
      this.label = 'negative'
      this.paperItem.strokeColor = '#FF5252'
      this.paperItem.fillColor = '#FF5252'
      this.flashAndFadeFillColor(this.paperItem)
      setTimeout(() => {
        this.incrementActiveItemBy(1)
        this.setActiveValidationIndex(this.activeItemIndex)
      }, 500)
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

    createNewItem () {
      let item = paper.project.getItems({
        selected: true,
        class: paper.Path
      })[0]

      this.createNewItemInDB({
        timestamp: new Date(),
        boundingBox: {
          height: item.bounds.height,
          width: item.bounds.width,
          x: item.bounds.x,
          y: item.bounds.y
        }
      })
    },

    // TODO: remove item functionality is incomplete...
    // Remove the item from the paperJS rendering and also delete it from the database
    removeItem () {
      let item = paper.project.getItems({
        selected: true,
        class: paper.Path
      })[0]
    },

    goToItem (item) {
      this.viewport.fitBoundsWithConstraints(
        this.viewport.imageToViewportRectangle(
          new openseadragon.Rect(
            item.x,
            item.y,
            item.width,
            item.height
          )
        ),
        true
      )
    },

    findPaperItem (item) {
      return paper.project.getItem({
        inside: new paper.Rectangle(
          item.x,
          item.y,
          item.width,
          item.height
        ),
        class: 'Path'
      })
    },

    keyDown (e) {
      switch (e.keyCode) {
        case 39:
          this.incrementActiveItemBy(1)
          break
        case 37:
          this.incrementActiveItemBy(-1)
          break
        case 49:
          if (!e.getModifierState('Meta')) { this.markCorrect() }
          break
        case 50:
          if (!e.getModifierState('Meta')) { this.flagForReview() }
          break
        case 51:
          if (!e.getModifierState('Meta')) { this.markIncorrect() }
          break
        case 52:
          if (!e.getModifierState('Meta')) { this.createNewItem() }
          break
      }
    },

    checkToSaveValidation () {
      const labelAdded = this.checkIfLabelAdded()
      if (labelAdded) {
        this.saveClassValidation({
          validation: labelAdded,
          docName: this.paperItem.data.name
        })
      }

      if (this.validatorRole === 'basic') {
        let adjustedBoundingBox = this.checkIfBoundingBoxAdjusted()
        if (adjustedBoundingBox) {
          this.saveBoundingBox({
            boundingBox: adjustedBoundingBox,
            docName: this.paperItem.data.name,
            timestamp: new Date(),
            uid: this.uid
          })
        } else {
          this.validateItemsBoundingBox(this.paperItem.data.name)
        }
      }
    },

    checkIfLabelAdded () {
      if (this.label) {
        return {
          uid: this.uid,
          class: this.label,
          decisionTimeInMs: Date.now() - this.validationStartTime,
          timestamp: new Date()
        }
      } else {
        return false
      }
    },

    checkIfBoundingBoxAdjusted () {
      let currentItemData = {
        x: this.paperItem.bounds.x,
        y: this.paperItem.bounds.y,
        width: this.paperItem.bounds.width,
        height: this.paperItem.bounds.height
      }

      // WARNING: this is a relatively way frail of checking object equivalence.
      // Relies on simple objects without methods/DOM nodes inside
      // and the order of the properties is important
      if (JSON.stringify(currentItemData) !== JSON.stringify(this.initialItemData)) {
        return currentItemData
      } else {
        return false
      }
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
