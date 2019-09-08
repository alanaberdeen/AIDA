<template lang="html">
  <v-list-item id="tool-tile">
    <v-tooltip right open-delay=700>
      <template v-slot:activator="{ on }">
        <v-btn
          id="pan"
          v-on="on"
          block
          text
          @click.native="initialiseTool"
        >
          <v-icon
            v-if="active"
            class="blue--text text--darken-1"
            small
          >
            mdi-lock-open
          </v-icon>

          <v-icon
            v-else
            class="grey--text text--darken-2"
            small
          >
            mdi-lock-outline
          </v-icon>
        </v-btn>
      </template>
      <span>Lock View Tool [space]</span>
    </v-tooltip>
  </v-list-item>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      toolPan: null
    }
  },

  methods: {
    initialiseTool () {
      // Relinquish control of PaperJS interface
      document.getElementById('annotation-canvas').style.pointerEvents = 'none'
      document.getElementById('osd-canvas').style.cursor = 'grab'
    }
  }
}
</script>

<style lang='css'>
#pan {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
  min-width: 0px;
}
</style>
