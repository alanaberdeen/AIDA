<template lang="html">
  <v-list-tile id="tool-tile">
    <v-tooltip
      id="tooltip"
      right
      open-delay="700"
    >
      <v-btn
        id="pan"
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
      <span> Lock View Tool [space] </span>
    </v-tooltip>
  </v-list-tile>
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

  mounted () {
    this.initialiseTool()
  },

  methods: {
    initialiseTool () {
      // Relinquish control of PaperJS interface
      document
        .getElementById('annotation-canvas')
        .setAttribute('class', 'pointers-no')

      document.getElementById('osd-canvas').style.cursor = 'grab'
    }

  }
}
</script>

<style lang='css'>
#tooltip {
  width: 100%;
}

#pan {
  min-width: 0px;
}

#tool-tile {
  padding: 0px;
  min-width: 0px;
}
</style>
