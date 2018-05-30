<template lang="html">
  <div>
    <h6 class="step-id">
      Add a new image
    </h6>

    <v-text-field
      v-model="imageName"
      label="Name"
      required
    />

    <v-text-field
      v-model="imagePath"
      label="Tile Source URL"
      required
    />

    <v-btn
      outline
      class="indigo--text add-button"
      @click.native="addImage()">
      Add
    </v-btn>

    <v-alert
      :value="successToggle"
      success
      transition="scale-transition"
    >
      Image successfully added.
    </v-alert>

    <v-alert
      :value="errorToggle"
      error
      transition="scale-transition"
    >
      Error: {{ errorMessage }}
    </v-alert>

  </div>
</template>

<script>

export default {
  props: {
    editor: {
      type: Object,
      default: function () { return {} }
    },
    osdViewer: {
      type: Object,
      default: function () { return {} }
    }
  },

  data () {
    return {
      imageName: '',
      imagePath: '',
      errorToggle: false,
      errorMessage: '',
      successToggle: false
    }
  },

  methods: {

    addImage () {
      this.osdViewer.addTiledImage({
        tileSource: this.imagePath,
        x: 0,
        y: 0,
        opacity: 0.5,
        success: this.success,
        error: this.error
      })
    },

    // On failure to add image, render error message
    error (event) {
      let vm = this

      console.log(event.message)
      this.errorMessage = event.message

      // Display success message for two seconds
      this.errorToggle = true
      setTimeout(function () {
        vm.errorToggle = false
      }, 3000)
    },

    // On successfully adding image
    success () {
      let vm = this

      // Add new image details to editor object.
      let newid = this.editor.images.length + 1
      this.editor.images.push({
        id: newid,
        name: this.imageName,
        url: this.imagePath
      })

      // Display success message for two seconds
      this.successToggle = true
      setTimeout(function () {
        vm.successToggle = false
      }, 3000)

      // Reset input variables
      this.imageName = ''
      this.imagePath = ''
    }
  }
}
</script>

<style lang='css' scoped>

.add-button{
  margin-left: 0px;
}

.alert {
  height: 35px;
}
</style>
