<template lang="html">
    <v-menu class="pointers-please" offset-y
            :nudge-right="30"
            :nudge-bottom="5">

        <v-icon slot="activator">
            account_circle
        </v-icon>

        <v-list dense class="pointers-please">
            <v-list-tile>
                <v-list-tile-title id="title">
                    Log out
                </v-list-tile-title>
            </v-list-tile>
        </v-list>

    </v-menu>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>

#title {
    padding-right: 10px;
    padding-left: 10px;
}
</style>
