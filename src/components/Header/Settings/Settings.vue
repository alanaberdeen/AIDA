<template lang="html">
  <v-dialog
    v-model="dialog"
    scrollable
    width="75%"
    class="pointers-please">

    <v-icon slot="activator">
      settings
    </v-icon>

    <v-card>

      <v-card-title>
        Settings
      </v-card-title>
      <v-divider/>

      <v-layout>
        <v-flex
          id="tabs-column"
          xs3
        >
          <v-list
            id="settings-list"
            dense>

            <v-list-group
              v-model="steps"
              no-action>

              <v-list-tile slot="item">

                <v-list-tile-content>
                  <v-list-tile-title class="tile-title">
                    Task
                  </v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action class="action">
                  <v-icon>
                    keyboard_arrow_down
                  </v-icon>
                </v-list-tile-action>

              </v-list-tile>

              <v-list-tile
                v-for="(step,index) in editor.steps"
                :key="index"
                :class="{'option-active': (editor.activeStep === index)}"
                @click.native="editor.activeStep = index; active=''"
              >

                <v-list-tile-content>
                  <v-list-tile-title class="tile-title">
                    Step {{ index + 1 }}
                  </v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>

              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title
                    class="tile-title"
                    @click.native="active='addStep'">
                    <v-icon class="add_icon">
                      add_circle_outline
                    </v-icon>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

            </v-list-group>

            <v-list-group
              v-model="images"
              no-action>
              <v-list-tile slot="item">
                <v-list-tile-content>
                  <v-list-tile-title class="tile-title">
                    Images
                  </v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action class="action">
                  <v-icon>
                    keyboard_arrow_down
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile
                v-for="(image,index) in editor.images"
                :key="index"
                :class="{'option-active': (activeImage === index)}"
                @click.native="activeImage = index; active=''"
              >

                <v-list-tile-content>
                  <v-list-tile-title class="tile-title">
                    {{ image.name }}
                  </v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>

              <v-list-tile
                :class="{ 'option-active': (activeImage === 'add') }"
                @click.native="activeImage = 'add'; active = 'addImage'"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="tile-title">
                    <v-icon class="add_icon">
                      add_circle_outline
                    </v-icon>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

            </v-list-group>

            <v-list-group
              v-model="annotations"
              no-action>
              <v-list-tile slot="item">
                <v-list-tile-content>
                  <v-list-tile-title
                    class="tile-title"
                    @click.native="active=''">
                    Annotations
                  </v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action class="action">
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-list-tile-action>
              </v-list-tile>

              <v-list-tile
                :class="{ 'option-active': (activeAnnotation === 'add') }"
                @click.native="activeAnnotation = 'add'; active='addAnnotation'"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="tile-title">
                    <v-icon class="add_icon">
                      add_circle_outline
                    </v-icon>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

            </v-list-group>

          </v-list>
        </v-flex>

        <v-flex xs9>
          <v-layout>
            <v-flex>

              <v-card-text>
                <!-- Show task settings -->
                <app-step-settings
                  v-if="steps"
                  :editor="editor"
                  :step="editor.activeStep"/>

                <!-- Show image settings -->
                <app-add-image
                  v-if="images && active === 'addImage'"
                  :editor="editor"
                  :osd-viewer="osdViewer"/>

                <!-- Show annotation settings -->
                <app-add-annotation
                  v-if="annotations && active === 'addAnnotation'"
                  :editor="editor"
                  :osd-viewer="osdViewer"
                  :paper-scope="paperScope"/>
              </v-card-text>

            </v-flex>

          </v-layout>
        </v-flex>

      </v-layout>
      <v-divider/>

      <v-layout actions>
        <v-btn
          flat
          class="blue--text darken-1"
          @click.native="dialog = false">
          Close
        </v-btn>
      </v-layout>

    </v-card>
  </v-dialog>
</template>

<script>

// Import child components
import ToolSettings from './ToolSettings.vue'
import StepSettings from './StepSettings.vue'
import AddImage from './AddImage.vue'
import AddAnnotation from './AddAnnotation.vue'

export default {

  components: {
    'app-tool-settings': ToolSettings,
    'app-step-settings': StepSettings,
    'app-add-image': AddImage,
    'app-add-annotation': AddAnnotation
  },

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
      dialog: false,
      active: 'Task',
      steps: false,
      images: false,
      annotations: false,
      activeAnnotation: 0,
      activeImage: 0,
      activeStep: 0
    }
  }
}
</script>

<style lang='css' scoped>
#tabs-column{
  border-right: 1px solid rgba(0,0,0,0.12);
}

#settings-list {
  padding: 0px;
}

.tile-title {
  font-size: 13px;
  padding-left: 16px;
}

.action {
  padding-right: 4px;
}

.option-active {
  background-color: rgba(0,0,0,0.07);
}

.add_icon{
  font-size: 20px;
}
</style>
