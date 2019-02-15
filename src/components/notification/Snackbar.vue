<template lang="html">
  <v-snackbar
    :value="active"
    :color="color"
    :timeout=0
    top
  >
    {{ text }}
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {

  computed: {
    ...mapState({
      active: state => state.app.snackbar.active,
      text: state => state.app.snackbar.text,
      color: state => state.app.snackbar.color,
      timeout: state => state.app.snackbar.timeout
    })
  },

  methods: {
    ...mapActions({
      dismissSnackbar: 'app/dismissSnackbar'
    })
  },

  watch: {
    active: function (val) {
      if (val && this.timeout > 0) {
        setTimeout(() => {
          this.dismissSnackbar()
        }, this.timeout)
      }
    }
  }

}
</script>
