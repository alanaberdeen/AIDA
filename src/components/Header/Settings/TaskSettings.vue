<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field
                label="Step"
                value="Preliminary report"
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-text-field
                label="Instruction"
                v-model="title"
                counter
                multi-line
                max="120"
                ></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
export default {

    data() {
        return {
            title: ''
        }
    }
}
</script>

<style lang="css">
</style>
