<template lang="html">
    <v-btn icon @click.native="exportJSON()">
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
            'exportJSON'
        ])
    },
}
</script>

<style lang="css">
</style>
