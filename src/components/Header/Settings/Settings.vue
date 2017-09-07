<template lang="html">
        <v-dialog scrollable v-model="dialog" width="75%" class="pointers-please">

            <v-icon slot="activator">
                settings
            </v-icon>

            <v-card>

                <v-card-title>
                    Settings
                </v-card-title>
                <v-divider></v-divider>

                <v-layout>
                    <v-flex xs3 id="tabs-column">
                        <v-list id="settings-list" dense>

                            <v-list-group v-model="steps" no-action>

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

                                <v-list-tile v-for="(step,index) in config.steps" :key="index"
                                             @click.native="config.activeStep = index; active=''"
                                             :class="{'option-active': (config.activeStep === index)}"
                                             >

                                    <v-list-tile-content>
                                        <v-list-tile-title class="tile-title">
                                            Step {{index + 1}}
                                        </v-list-tile-title>
                                    </v-list-tile-content>

                                </v-list-tile>

                                <v-list-tile>
                                    <v-list-tile-content>
                                        <v-list-tile-title class="tile-title"
                                                           @click.native="active='addStep'">
                                            <v-icon class="add_icon">
                                                add_circle_outline
                                            </v-icon>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>

                            </v-list-group>

                            <v-list-group v-model="images" no-action>
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

                                <v-list-tile v-for="(image,index) in config.images" :key="index"
                                             @click.native="activeImage = index; active=''"
                                             :class="{'option-active': (activeImage === index)}">

                                    <v-list-tile-content>
                                        <v-list-tile-title class="tile-title">
                                            {{image.name}}
                                        </v-list-tile-title>
                                    </v-list-tile-content>

                                </v-list-tile>

                                <v-list-tile @click.native="activeImage = 'add'; active='addImage'"
                                             :class="{ 'option-active': (activeImage === 'add') }">
                                    <v-list-tile-content>
                                        <v-list-tile-title class="tile-title">
                                            <v-icon class="add_icon">
                                                add_circle_outline
                                            </v-icon>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>

                            </v-list-group>

                            <v-list-group v-model="annotations" no-action>
                                <v-list-tile slot="item">
                                    <v-list-tile-content>
                                        <v-list-tile-title class="tile-title"
                                                           @click.native="active=''">
                                            Annotations
                                        </v-list-tile-title>
                                    </v-list-tile-content>

                                    <v-list-tile-action class="action">
                                        <v-icon>keyboard_arrow_down</v-icon>
                                    </v-list-tile-action>
                                </v-list-tile>

                                <v-list-tile @click.native="activeAnnotation = 'add'; active='addAnnotation'"
                                             :class="{ 'option-active': (activeAnnotation === 'add') }">
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
                                    <app-step-settings v-if="steps"
                                                       :config='config'
                                                       :step='config.activeStep'>
                                    </app-step-settings>

                                    <!-- Show image settings -->
                                    <app-add-image  v-if="images && active === 'addImage'"
                                                    :config='config'
                                                    :osdViewer='osdViewer'>
                                    </app-add-image>

                                    <!-- Show annotation settings -->
                                    <app-add-annotation  v-if="annotations && active === 'addAnnotation'"
                                                    :config='config'
                                                    :osdViewer='osdViewer'
                                                    :paperScope='paperScope'>
                                    </app-add-annotation>
                                </v-card-text>

                            </v-flex>

                        </v-layout>
                    </v-flex>

                </v-layout>
                <v-divider></v-divider>

                <v-layout actions>
                    <v-btn  flat class="blue--text darken-1"
                            @click.native="dialog = false">
                        Close
                    </v-btn>
                </v-layout>

            </v-card>
        </v-dialog>
</template>

<script>

// Import child components
import ToolSettings from './ToolSettings.vue';
import StepSettings from './StepSettings.vue';
import AddImage from './AddImage.vue';
import AddAnnotation from './AddAnnotation.vue'

export default {
    props: ['config', 'osdViewer', 'paperScope'],

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
    },

    components: {
        'app-tool-settings': ToolSettings,
        'app-step-settings': StepSettings,
        'app-add-image': AddImage,
        'app-add-annotation': AddAnnotation
    }
}

</script>

<style lang="css" scoped>

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
