<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable width='70%'>

            <!-- Button toggles the activated status of dialog -->
            <v-btn slot="activator" icon class="white--text">
                <v-icon>settings</v-icon>
            </v-btn>

            <v-card>
                <v-card-title>Settings</v-card-title>
                <v-divider></v-divider>

                <v-card-row>
                    <v-card-col>
                        <v-list>
                            <v-list-item>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        tools
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list-item>
                        </v-list>
                    </v-card-col>

                    <v-card-col>
                        <v-list two-line subheader>

                            <!-- For each tool add an option to activate or otherwise -->
                            <v-list-item v-for="tool in config.tools" :key="tool.name">
                                <v-list-tile avatar>

                                    <v-list-tile-action>
                                        <v-checkbox v-model="tool.include"></v-checkbox>
                                    </v-list-tile-action>

                                    <v-list-tile-content>
                                        <v-list-tile-title> {{ tool.name }} </v-list-tile-title>
                                        <v-list-tile-sub-title> {{ tool.caption }}</v-list-tile-sub-title>
                                    </v-list-tile-content>

                                </v-list-tile>
                            </v-list-item>

                        </v-list>
                    </v-card-col>
                </v-card-row>
                <v-divider></v-divider>
                <v-card-row actions>
                    <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Close</v-btn>
                </v-card-row>

            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>



export default {
    props: ['config'],

    data () {
      return {
        dialog: false
      }
    }
}

</script>

<style lang="css">

.dialog__content{
    z-index: 200;
}

.dialog-active {
    width: 70%;
}



</style>
