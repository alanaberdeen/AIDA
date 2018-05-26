<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700"
    >
      <v-btn
        id="tool"
        slot="activator"
        flat
        block
        @click.native="initialiseTool"
      >
        <v-icon
          v-if="active"
          class="blue--text text--darken-1">
          lock_open
        </v-icon>

        <v-icon
          v-else
          class="grey--text text--darken-2">
          lock_outline
        </v-icon>
      </v-btn>
      <span> Lock View Tool </span>
    </v-tooltip>
  </v-list-tile>
</template>

<script>
// TODO: Add a keyboard short cut that can be held down to activate
// pan and zoom controls.
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

  mounted () {
    // this.initialiseTool()
  },

  methods: {
    initialiseTool () {
      // Relinquish control of PaperJS interface
      document
        .getElementById('annotation-canvas')
        .setAttribute('class', 'pointers-no')
    }
  }
}
</script>

<style lang='css'>
#tooltip {
  width: 100%;
}

#tool {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
  min-width: 0px;
}
</style>
