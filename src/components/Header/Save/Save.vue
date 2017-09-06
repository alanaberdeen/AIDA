<template lang="html">
    <v-btn icon @click.native="exportJSON">
        <v-icon>
            save
        </v-icon>
    </v-btn>
</template>

<script>
export default {
    props: ['paperScope'],

    methods: {

        // Save the project as a JSON object to the console
        exportJSON () {
            console.log(this.paperScope.project.exportJSON())
        }
    }
}
</script>

<style lang="css">
</style>
