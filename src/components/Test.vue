<template lang="html">
    <v-card>
      <v-toolbar class="white--text pink">
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Inbox</v-toolbar-title>
        <v-icon class="mr-4">search</v-icon>
        <v-icon>check_circle</v-icon>
      </v-toolbar>
      <v-list two-line>
        <v-list-item>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Title</v-list-tile-title>
              <v-list-tile-sub-title class="grey--text text--darken-4">headline</v-list-tile-sub-title>
              <v-list-tile-sub-title>subtitle</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>action</v-list-tile-action-text>
              <v-icon class="grey--text text--lighten-1">star_border</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-item>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Title</v-list-tile-title>
              <v-list-tile-sub-title class="grey--text text--darken-4">headline</v-list-tile-sub-title>
              <v-list-tile-sub-title>subtitle</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>action</v-list-tile-action-text>
              <v-icon class="grey--text text--lighten-1">star_border</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-item>
          <v-list-tile avatar ripple>
            <v-list-tile-content>
              <v-list-tile-title>Title</v-list-tile-title>
              <v-list-tile-sub-title class="grey--text text--darken-4">headline</v-list-tile-sub-title>
              <v-list-tile-sub-title>subtitle</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>action</v-list-tile-action-text>
              <v-icon class="grey--text text--lighten-1">star_border</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list-item>
      </v-list>
    </v-card>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
