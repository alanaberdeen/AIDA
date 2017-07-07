<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable>

            <!-- Button toggles the activated status of dialog -->
            <v-btn slot="activator" icon class="white--text">
                <v-icon>settings</v-icon>
            </v-btn>

            <v-card>
                <v-card-title>Settings</v-card-title>
                <v-divider></v-divider>
                <v-layout>
                    <v-flex xs3 class='tabs' style='padding-right: 0px;'>

                        <v-list>
                            <v-list-group v-model="steps">
                                <v-list-tile slot="item"
                                             @click.native="active = ''">
                                    <v-list-tile-content>
                                        <v-list-tile-title> Steps </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-icon>keyboard_arrow_down</v-icon>
                                    </v-list-tile-action>
                                </v-list-tile>

                                <v-list-item v-for="(step,index) in config.steps" :key="index">
                                    <v-list-tile @click.native="config.activeStep = index"
                                                 :class="{ 'option-active': (config.activeStep === index) }">
                                        <v-list-tile-content>
                                            <v-list-tile-title> {{index + 1}} </v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list-item>

                                <v-list-item>
                                    <v-list-tile>
                                        <v-list-tile-content>
                                            <v-list-tile-title> + add </v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list-item>


                            </v-list-group>

                            <v-list-item>
                                <v-list-tile slot="item"
                                             @click.native="active = 'Images'; steps=false"
                                             :class="{ 'option-active': (active === 'Images') }">
                                    <v-list-tile-content>
                                        <v-list-tile-title> Images </v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list-item>

                        </v-list>

                    </v-flex>

                    <v-flex xs9>
                        <v-card-row height="400px">

                            <v-card-text>
                                <!-- Show task settings -->
                                <app-step-settings v-if="steps"
                                                   :config='config'
                                                   :step='config.activeStep'>
                                </app-step-settings>
                            </v-card-text>

                        </v-card-row>
                    </v-flex>

                </v-layout>
                <v-divider></v-divider>

                <v-card-row actions>
                    <v-btn class="blue--text darken-1" flat @click.native="dialog = false">
                        Close
                    </v-btn>
                </v-card-row>

            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>

// Import child components
import ToolSettings from './ToolSettings.vue'
import StepSettings from './StepSettings.vue'

export default {
    props: ['config'],

    data () {
        return {
            dialog: false,
            active: 'Task',
            steps: false,
            activeStep: 0
        }
    },

    components: {
        'app-tool-settings': ToolSettings,
        'app-step-settings': StepSettings
    }
}

</script>

<style lang="css">

.dialog {
    min-width: 75%;
}

.card-title {
    padding-left: 36px;
}

.tabs {
    border-right: 1px solid rgba(0,0,0,0.12);
}

.options {
    padding: 0px;
}

.option {
    padding-left: 8px;
}

.option-active {
    background-color: rgba(0,0,0,0.07);
    font-weight: bold;
}

.settings {
    min-height: 400px;
    max-height: 400px;
    padding-top: 30px;
}

.list__tile__title {
    font-size: 14px;
}

.list__tile__sub-title {
    font-size: 12px;
}

.material-icons {
    font-size: 20px;
}

</style>
