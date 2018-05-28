// Examples.vue
// Component presents a grid of options that the user can select to load a
// different type of example into the editor.
<template lang="html">

  <v-container
    fill-height
    fluid
  >
    <v-layout
      row
      fill-height
      justify-space-around
    >
      <v-flex
        xs10
        sm5
      >
        <v-card
          to="/example/dzi"
        >
          <v-card-media
            :src="require('./dzi_example.png')"
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
        sm5
      >
        <v-card
          to="/example/simple"
        >
          <v-card-media
            :src="require('./simple_example.png')"
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
    </v-layout>
  </v-container>
</template>

<script>
export default {}
</script>

<style lang='css' scoped>
</style>
