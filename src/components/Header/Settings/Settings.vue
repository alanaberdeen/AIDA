<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable>

            <!-- Button toggles the activated status of dialog -->
            <v-btn slot="activator" icon class="white--text">
                <v-icon>settings</v-icon>
            </v-btn>

            <v-card>
                <v-layout>
                    <v-card-title class='card-title'>Settings</v-card-title>
                </v-layout>

                <v-divider></v-divider>

                <v-layout>
                    <v-flex xs3 class='tabs' style='padding-right: 0px;'>

                        <v-list class='options'>

                            <v-list-item>
                                <v-list-tile @click.native="active = 'Task'"
                                             :class="{ 'option-active': (active === 'Task') }">
                                    <v-list-tile-content class='option'>
                                        Task
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list-item>

                            <v-list-item>
                                <v-list-tile @click.native="active = 'Images'"
                                             :class="{ 'option-active': (active === 'Images') }">
                                    <v-list-tile-content class='option'>
                                        Images
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list-item>

                            <v-list-item>
                                <v-list-tile @click.native="active = 'Tools'"
                                             :class="{ 'option-active': (active === 'Tools') }">
                                    <v-list-tile-content class='option'>
                                        Tools
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list-item>

                        </v-list>
                    </v-flex>

                    <v-flex xs9>

                        <v-card-row class='settings'>
                            <v-layout>

                                <!-- Show tool settings -->
                                <app-tool-settings v-if="active === 'Tools'"
                                                   :config='config'>
                                </app-tool-settings>

                                <!-- Show task settings -->
                                <app-task-settings v-if="active === 'Task'"
                                                   :config='config'>
                                </app-task-settings>

                            </v-layout>
                        </v-card-row>

                        <v-layout>
                            <v-card-row actions>
                                <v-btn class="blue--text darken-1" flat @click.native="dialog = false">
                                    Close
                                </v-btn>
                            </v-card-row>
                        </v-layout>

                    </v-flex>
                </v-layout>

            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>

// Import child components
import ToolSettings from './ToolSettings.vue'
import TaskSettings from './TaskSettings.vue'

export default {
    props: ['config'],

    data () {
        return {
            dialog: false,
            active: 'Task'
        }
    },

    components: {
        'app-tool-settings': ToolSettings,
        'app-task-settings': TaskSettings
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
