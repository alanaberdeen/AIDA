// Faces.vue
// Example of calling an API to tigger algorithm assisted annotation.
// This example calls the Google Faces api.
<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="tool"
          v-on="on"
          block
          @click.native="activate"
        >
          <i
            :class="{
              'fa': true,
              'fa-user-tag': !loading,
              'fa-spinner': loading,
              'fa-pulse': loading,
              'faIcons': !active,
              'faIconsActive': active
          }"/>
        </v-btn>
      </template>
      <span> Faces Tool </span>
    </v-tooltip>
  </v-list-item>

</template>

<script>
// Import libs
import axios from 'axios'
import paper from 'paper'

// Vuex
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      strokeWidth: 400,
      loading: false
    }
  },

  computed: {
    ...mapState({
      imageUri: state => state.image.images[state.image.activeChannel].source,
      viewportZoom: state => state.image.OSDviewer.viewport.getZoom(true),
      imageWidth: state =>
        state.image.OSDviewer.world.getItemAt(0).getContentSize().x
    })
  },

  methods: {
    ...mapGetters({
      getColor: 'annotation/getColor'
    }),

    activate () {
      // Set the default strokewidth relative to image size and zoom.
      this.strokeWidth = this.imageWidth / (this.viewportZoom * 500)

      // Change icon to loading by adjust data variable
      this.loading = true

      // Careful with API key below.
      // In production the key here should only be valid if the domain that
      // refers the call is: alanaberdeen.github.io/AIDA.
      // This is to ensure there is no un-authorised use.
      //
      // Clearly there is still a major authentication probelm here. It is
      // difficult to balance the full client side SPA setup and a secure
      // RESTful backend. Need a way of autheticating calls without keeping the
      // secrets in the client code...
      axios
        .post(
          // INSERT API KEY,
          {
            requests: [
              {
                image: {
                  source: {
                    imageUri: this.imageUri
                  }
                },
                features: {
                  type: 'FACE_DETECTION'
                },
                imageContext: {}
              }
            ]
          }
        )
        .then(response => {
          // Change icon back from a loading spinner to default tag by adjusting
          // the indicating data variable.
          this.loading = false

          // Log the repsonse to the console.
          // As this is experimental leave here for now, useful for
          // investigating issues
          let faceAnnotations = response.data.responses[0].faceAnnotations

          // Draw a rectangle around each of the detected faces.
          for (let i in faceAnnotations) {
            let segments = []
            for (let j in faceAnnotations[i].boundingPoly.vertices) {
              segments.push(
                new paper.Point(
                  faceAnnotations[i].boundingPoly.vertices[j].x,
                  faceAnnotations[i].boundingPoly.vertices[j].y
                )
              )
            }

            let newRect = new paper.Path(segments)
            newRect.strokeColor = new paper.Color(this.getColor())
            newRect.closed = true
            newRect.strokeWidth = this.strokeWidth

            // Custom data attribute:
            newRect.data.type = 'rectangle'
            newRect.data.class = 'face'
          }
        })
        // Catch errors - reset and report issue.
        .catch(error => {
          // Change icon back from a loading spinner to default tag by adjusting
          // the indicating data variable.
          this.loading = false
        })
    },

    drawBoundingFaces (response) {}
  }
}
</script>

<style lang='css' scoped>

#tool {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
}
</style>
