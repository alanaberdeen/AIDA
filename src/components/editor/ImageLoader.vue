<template lang="html">
  <div tools-container">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Image</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-list>
        <v-list-item>
          <!--  Use input element to open fileUploader interface -->
          <!--  But keep <input> hidden and access via button for UI conformity -->
          <input
            id="uploadFile"
            ref="uploadFile"
            type="file"
            @change="onFileChange">
          <v-btn
            primary
            dark
            @click.native="chooseFile">
            <v-icon class="white--text text--lighten-1">file_upload</v-icon>
          </v-btn>
          <!--  Image has to be somewhere in page for PaperJS to load it onto the canvas -->
          <!--  This seems like a bit of a poor method but not seems to work -->
          <img
            id="img"
            :src="imageData"
          >
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {

  props: {
    paperScope: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data () {
    return {
      imageData: ''
    }
  },
  methods: {
    chooseFile () {
      this.$refs['uploadFile'].click()
    },

    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      this.createImage(files[0])
      this.imageFile = (files[0])
    },

    createImage (file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.imageData = e.target.result
      }

      reader.readAsDataURL(file)
      this.addToPaper(file)
    }
  }
}
</script>

<style lang='css' scoped>
#uploadFile {
  display: none;
}

#img {
  display: none;
}
</style>
