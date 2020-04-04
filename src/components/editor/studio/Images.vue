<template lang="html">
  <v-card
    class="mt-2"
    color='#eeeeee'
  >
    <v-toolbar
      color='#e0e0e0'
      dense
    >
      <v-toolbar-title>
        Images
      </v-toolbar-title>
    </v-toolbar>

    <v-list>
      <v-list-group
        v-for="(image, index) in getImages"
        :key="index"
        no-action
        @click.native="setActiveImage(index)"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              :class="{'blue--text text--darken-1': (activeImageIndex === index)}">
              {{ image.name ? image.name : ('Image ' + index) }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item style='padding: 0px;'>
          <v-list-item-content>
            <div id="controls">
              <v-tabs grow background-color="transparent">
                <v-tab style='min-width: 48px;'><v-icon> mdi-opacity </v-icon></v-tab>
                <v-tab style='min-width: 48px;'><v-icon> mdi-format-color-text </v-icon></v-tab>
                <v-tab style='min-width: 48px;'><v-icon> mdi-delete </v-icon></v-tab>

                <v-tab-item>
                  <v-slider
                    :value="image.opacity * 100"
                    @input="setActiveImageOpacity"
                    class="align-center tab-item"
                    max=100
                    min=0
                    hide-details
                    :prepend-icon="image.opacity > 0 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:prepend="toggleOpacity(image.opacity)"
                  >
                    <template v-slot:append>
                      <v-text-field
                        :value="image.opacity * 100"
                        class="mt-0 pt-0"
                        suffix="%"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @keyup.native.enter="setActiveImageOpacity"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-tab-item>

                <v-tab-item>
                  <v-text-field
                    :value="image.name ? image.name : ('Image ' + index)"
                    single-line
                    class="tab-item"
                    @change="setActiveImageName"
                    @keyup.native.enter="setActiveImageName"
                  />
                </v-tab-item>

                <v-tab-item>
                  <div class="d-flex justify-center align-center tab-item">
                    <v-btn
                      small
                      disabled
                      color="error"
                      dark
                      outlined
                      @click="deleteImage().then(() => {setActiveImage(0)})">
                      Delete
                    </v-btn>
                  </div>
                </v-tab-item>
              </v-tabs>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      opacityCache: 1
    }
  },

  computed: {
    ...mapState({
      images: state => state.image.images,
      activeImageIndex: state => state.image.activeImageIndex
    }),

    ...mapGetters({
      getImages: 'image/getImages'
    })
  },

  methods: {
    ...mapActions({
      setActiveImageOpacity: 'image/setActiveImageOpacity',
      setActiveImage: 'image/setActiveImage',
      setActiveImageName: 'image/setActiveImageName',
      deleteImage: 'image/deleteImage'
    }),

    toggleOpacity (currentOpacity) {
      if (currentOpacity > 0) {
        this.opacityCache = currentOpacity
        this.setActiveImageOpacity(0)
      } else {
        this.setActiveImageOpacity(this.opacityCache * 100)
      }
    }
  }
}
</script>

<style lang='css' scoped>
#controls {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  padding-left: 16px;
  padding-right: 16px;
}

#tab-items {
  background-color: #fafafa;
}

.tab-item {
  background-color: #f5f5f5;
  height: 54px;
  padding: 4px 0px;
  margin: 0px;
}
</style>
