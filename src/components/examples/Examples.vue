// Examples.vue
// Component presents a grid of options that the user can select to load a
// different type of example into the editor.
<template lang="html">

  <div>
    <header>
      <app-toolbar/>
    </header>

    <v-container
      id="content-container"
      fluid
    >
      <v-layout
        row
        wrap
        fill-height
        justify-space-between
      >
        <v-flex
          xs10
          sm4
        >
          <v-card
            to="/example/dzi"
          >
            <v-card-media
              src="https://s3-eu-west-1.amazonaws.com/aida-example/ui-images/slide_example.png"
              height="200px"/>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">
                  Deep Zoom
                </h3>
                <div>
                  Annotate a super hi-res Deep Zoom image with multiple tiled
                  layers.
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn
                flat
                color="primary"> Try it out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex
          xs10
          sm4
        >
          <v-card
            to="/example/simple"
          >
            <v-card-media
              src="https://s3-eu-west-1.amazonaws.com/aida-example/ui-images/simple_example.png"
              height="200px"/>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">
                  Simple
                </h3>
                <div>
                  Annotate a standard image (no fancy Deep Zooming).
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn
                flat
                color="primary"> Try it out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex
          xs10
          sm4
        >
          <v-card
            to="/new"
          >
            <v-card-media
              src="https://s3-eu-west-1.amazonaws.com/aida-example/ui-images/fresh.png"
              height="200px"
            />
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">
                  New
                </h3>
                <div>
                  Start from scratch!
                </div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn
                flat
                color="primary"> get started
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>

</template>

<script>
import Toolbar from '../header/Toolbar.vue'

export default {
  components: {
    'app-toolbar': Toolbar
  }
}
</script>

<style lang='css' scoped>
.card {
  margin: 10px;
}

#content-container {
  padding: 0px;
  padding-top: 60px;
}
</style>
