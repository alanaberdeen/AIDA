<template lang="html">
  <div>
    <h6 class="step-id"> Add a new annotation </h6>

    <v-text-field
      v-model="annotationName"
      label="Name"
      required
    />

    <v-text-field
      v-model="annotationString"
      label="JSON string"
      required
    />

    <v-btn
      outline
      class="indigo--text add-button"
      @click.native="addAnnotation()">
      Add
    </v-btn>

    <v-alert
      :value="successToggle"
      success
      transition="scale-transition"
    >
      Annotation successfully added.
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
    },
    paperScope: {
      type: Object,
      default: function () { return {} }
    }
  },

  data () {
    return {
      annotationName: '',
      annotationString: '',
      errorToggle: false,
      errorMessage: '',
      successToggle: false
    }
  },

  methods: {

    addAnnotation () {
      this.paperScope.project.importJSON(this.annotationString)
    },

    // On failure to add annotations, render error message
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

    // On successfully adding annotation
    success () {
      let vm = this

      // Display success message for two seconds
      this.successToggle = true
      setTimeout(function () {
        vm.successToggle = false
      }, 3000)

      // Reset input variables
      this.annotationName = ''
      this.annotationString = ''
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
