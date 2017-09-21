<template lang="html">
    <v-btn icon @click.native="saveConfig()">
        <v-icon>
            save
        </v-icon>
    </v-btn>
</template>

<script>
import {mapActions} from 'vuex';

export default {

    methods: {
        ...mapActions([
            'saveConfig'
        ])
    },
}
</script>

<style lang="css">
</style>
