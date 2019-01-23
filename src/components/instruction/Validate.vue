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
                  Class: {{ this.paperItem.data.validationScore }}
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
      activeStep: state => state.app.activeStep,
      steps: state => state.app.steps,
      viewport: state => state.image.OSDviewer.viewport,
      activeValidationIndex: state => state.app.activeValidationIndex,
      uid: state => state.app.uid
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
      initialItemData: {}
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
      saveProject: 'app/saveProject',
      setActiveValidationIndex: 'app/setActiveValidationIndex',
      updateValidation: 'app/updateValidation',
      createNewItemInDB: 'app/createNewItem'
    }),

    goToNextItem () {
      if (this.validationStarted) {
        this.saveValidation()
        this.label = ''
        // Reset the previously viewed paperJS item to neutral color
        this.paperItem.strokeColor = {
          hue: 170,
          saturation: 0.44,
          lightness: 0.69,
          alpha: 1
        }
      } 
      this.activeItemIndex === (this.getItemsForValidation().length - 1) ? this.activeItemIndex = 0 : this.activeItemIndex++
      this.goToItem(this.getItemsForValidation()[this.activeItemIndex])

      // Update the reference to the new paperJS item and then make the stroke visually distinctive
      this.paperItem = this.findPaperItem(this.getItemsForValidation()[this.activeItemIndex])
      this.paperItem.strokeColor = {
        hue: 60,
        saturation: 1,
        lightness: 0.85,
        alpha: 1
      }

      this.initialItemData = {
        x: this.paperItem.bounds.x,
        y: this.paperItem.bounds.y,
        width: this.paperItem.bounds.width,
        height: this.paperItem.bounds.height
      }
      this.validationStartTime = Date.now()
    },

    goToPreviousItem () {
      this.label = ''
      this.activeItemIndex === 0 ? (this.activeItemIndex = this.getItemsForValidation().length - 1) : this.activeItemIndex--
      this.goToItem(this.getItemsForValidation()[this.activeItemIndex])

      // Reset the previously viewed paperJS item to neutral color
      this.paperItem.strokeColor = {
        hue: 170,
        saturation: 0.44,
        lightness: 0.69,
        alpha: 1
      }

      // Update the reference to the new paperJS item and then make the stroke visually distinctive
      this.paperItem = this.findPaperItem(this.getItemsForValidation()[this.activeItemIndex])
      this.paperItem.strokeColor = {
        hue: 60,
        saturation: 1,
        lightness: 0.85,
        alpha: 1
      }
      this.initialItemData = {
        x: this.paperItem.bounds.x,
        y: this.paperItem.bounds.y,
        width: this.paperItem.bounds.width,
        height: this.paperItem.bounds.height
      }
      this.validationStartTime = Date.now()
    },

    markCorrect () {
      this.label = 'megakaryocyte'
      this.paperItem.strokeColor = '#4CAF50'
      this.paperItem.fillColor = '#4CAF50'
      this.flashAndFadeFillColor(this.paperItem)
      setTimeout(() => {
        this.goToNextItem()
        this.setActiveValidationIndex(this.activeItemIndex)
      }, 500)
    },

    flagForReview () {
      this.label = 'flag'
      this.paperItem.strokeColor = '#FFC107'
      this.paperItem.fillColor = '#FFC107'
      this.flashAndFadeFillColor(this.paperItem)
      setTimeout(() => {
        this.goToNextItem()
        this.setActiveValidationIndex(this.activeItemIndex)
      }, 500)
    },

    markIncorrect () {
      this.label = 'negative'
      this.paperItem.strokeColor = '#FF5252'
      this.paperItem.fillColor = '#FF5252'
      this.flashAndFadeFillColor(this.paperItem)
      setTimeout(() => {
        this.goToNextItem()
        this.setActiveValidationIndex(this.activeItemIndex)
      }, 500)
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

    // Remove the item from the paperJS rendering and also delete it from the database
    removeItem () {
      console.log('want to remove item')

      let item = paper.project.getItems({
        selected: true,
        class: paper.Path
      })[0]

      console.log(item)
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
          break
        case 52:
          if (!e.getModifierState('Meta')) { this.createNewItem() }
          break
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

    startValidation () {
      if (this.activeValidationIndex === 0) {
        this.activeItemIndex = this.getItemsForValidation().length - 1
      } else {
        this.activeItemIndex = this.activeValidationIndex - 1
      }
      this.goToNextItem()
      this.validationStarted = true
    },

    saveValidation () {
      let adjustedBoundingBox = this.checkIfBoundingBoxAdjusted()
      let labelAdded = this.checkIfLabelAdded()
      let itemData = {
        docName: this.paperItem.data.name,
        timestamp: new Date(),
        validation: labelAdded,
        boundingBox: adjustedBoundingBox
      }

      this.updateValidation(itemData)
    },

    checkIfLabelAdded () {
      if (this.label) {
        return {
          uid: this.uid,
          label: this.label,
          decisionTimeInMs: Date.now() - this.validationStartTime
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
