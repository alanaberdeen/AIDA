<template lang="html">
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation>

          <!-- Name -->
          <v-text-field
            v-model="newName"
            :rules="nameRules"
            label="Name"
            required
          />

          <!-- Type -->
          <v-radio-group
            v-model="newType">
            <v-radio
              label="Simple"
              value="simple"/>
            <v-radio
              label="DZI"
              value="dzi"/>
          </v-radio-group>

          <!-- Source -->
          <v-text-field
            v-model="newSource"
            :rules="sourceRules"
            label="Source"
            required
          />

          <v-btn
            :disabled="!valid"
            @click="loadImages([{name: newName, type: newType, source: newSource}])"
          >
            submit
          </v-btn>
        </v-form>

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      valid: false,
      newName: '',
      nameRules: [v => !!v || 'Name is required'],
      newType: 'simple',
      newSource: '',
      sourceRules: [v => !!v || 'Source location is required']
    }
  },

  computed: {
    ...mapState({
      viewer: state => state.image.OSDviewer
    }),

    ...mapGetters({
      getChannels: 'images/getChannels'
    })
  },

  methods: {
    ...mapActions({
      loadImages: 'images/loadImages'
    }),

    submit () {
      if (this.$refs.form.validate()) {
        console.log('good to go')
      }
    }
  }
}
</script>

<style lang="css"/>
