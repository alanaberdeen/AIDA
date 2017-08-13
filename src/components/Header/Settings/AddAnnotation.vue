<template lang="html">
    <div>
        <h6 class='step-id'> Add a new annotation </h6>

        <v-text-field
              label="Name"
              v-model="annotationName"
              required
        ></v-text-field>

        <v-text-field
              label="JSON string"
              v-model="annotationString"
              required
        ></v-text-field>

        <v-btn  outline class="indigo--text add-button"
                @click.native="addAnnotation()">
                Add
        </v-btn>

        <v-alert
          success
          :value="successToggle"
          transition="scale-transition"
        >
          Annotation successfully added.
        </v-alert>

        <v-alert
          error
          :value="errorToggle"
          transition="scale-transition"
        >
          Error: {{ errorMessage }}
        </v-alert>

    </div>

</template>

<script>

export default {
    props: ['config', 'osdViewer', 'paperScope'],

    data() {
        return {
            annotationName: '',
            annotationString: '',
            errorToggle: false,
            errorMessage: '',
            successToggle: false
        }
    },

    methods: {

        addAnnotation() {
            this.paperScope.project.importJSON(this.annotationString)
        },

        // On failure to add annotations, render error message
        error(event){
            var vm = this;

            console.log(event.message);
            this.errorMessage = event.message;

            // Display success message for two seconds
            this.errorToggle = true;
            setTimeout(function(){
                vm.errorToggle = false
            }, 3000)

        },

        // On successfully adding annotation
        success() {
            var vm = this;

            // Display success message for two seconds
            this.successToggle = true;
            setTimeout(function(){
                vm.successToggle = false
            }, 3000)

            // Reset input variables
            this.annotationName = '';
            this.annotationString = '';
        }
    }

}
</script>

<style lang="css" scoped>

.add-button{
    margin-left: 0px;
}

.alert {
    height: 35px;
}



</style>
