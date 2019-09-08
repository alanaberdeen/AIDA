<template lang="html">
  <div>
    Tools
  </div>
  <!-- <v-flex xs12>

     Adjust which tools are activated.
    <v-list
      two-line
      subheader>
      <v-list-item
        v-for="tool in app.tools"
        :key="tool.name">
        <v-list-item avatar>

          <v-list-item-action>
            <v-checkbox v-model="tool.include"/>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title> {{ tool.name }} </v-list-item-title>
            <v-list-item-sub-title> {{ tool.caption }}</v-list-item-sub-title>
          </v-list-item-content>

        </v-list-item>
      </v-list-item>
    </v-list>

  </v-flex> -->
</template>

<script>
export default {
  props: {
    editor: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>
