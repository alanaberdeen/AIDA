<template>
  <div>
    <v-stepper
      v-if="steps"
      id="stepper"
      :value="(activeStep + 1)"
      class="pointers-please"
      non-linear
    >
      <v-stepper-header id="stepper-header">
        <template
          v-for="(step, index) in steps">
          <v-stepper-step
            :key="index"
            :step="step.id"
            editable
            @click.native="setActiveStep(step)"
          />
          <v-divider
            v-if="step.id !== steps.length"
            :key="step.length" />
        </template>
      </v-stepper-header>

    </v-stepper>

    <div
      id="hint-card"
      class="elevation-1">
      <p id="hint">
        {{ steps[activeStep].instruction }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      activeStep: state => state.editor.activeStep,
      steps: state => state.editor.steps
    })
  },

  methods: {
    ...mapActions(['setActiveStep', 'setActiveStepAndLayer'])
  }
}
</script>

<style lang='css' scoped>
#stepper {
  background-color: #e0e0e0;
}

#stepper-header {
  height: 50px;
}

#hint-card {
  background-color: #eeeeee;
}

#hint {
  color: #616161;
  padding: 5px 24px;
  margin: 0px;
}
</style>
