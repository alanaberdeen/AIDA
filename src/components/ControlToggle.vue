<template lang="html">
    <div class="pointers-please tools-container">
        <v-card class="control-toggle-panel">
            <v-toolbar>
                <v-toolbar-title>Controls</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card class="elevation-0">
                <v-card-text>
                    <v-switch label='Annotate/image' v-model="toggle" dark></v-switch>
                </v-card-text>
            </v-card>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ['paperScope'],
    data() {
        return {
            toggle: true,
        }
    },

    methods: {

        toggleControl(input) {
            console.log(input);
        }
    }

}
</script>

<style lang="css">
</style>
