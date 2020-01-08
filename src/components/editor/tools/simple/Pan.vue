<template lang="html">
  <v-tooltip right open-delay=700>
    <template v-slot:activator="{ on }">
      <v-btn
        id="pan"
        v-on="on"
        block
        text
        @click.native="initialiseTool"
      >
        <v-icon small>
          mdi-lock-outline
        </v-icon>
      </v-btn>
    </template>
    <span>Lock View Tool [space]</span>
  </v-tooltip>
</template>

<script>
export default {
  methods: {
    initialiseTool () {
      // Relinquish control of PaperJS interface
      document.getElementById('annotation-canvas').style.pointerEvents = 'none'
      document.getElementById('osd-canvas').style.cursor = 'grab'
    }
  }
}
</script>
