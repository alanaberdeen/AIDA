<template>
  <div v-if="steps" id="stepper-container">
    <v-stepper
      id="stepper"
      :value="(activeStep + 1)"
      non-linear
    >
      <v-stepper-header id="stepper-header">
        <template
          v-for="(step, index) in steps">
          <v-stepper-step
            :key="index"
            :step="step.id"
            editable
            @click.native="activateStep(step)"
            class='step-icon'
          />
          <v-divider
            v-if="step.id !== steps.length"
            :key="step.length" />
        </template>
      </v-stepper-header>

    </v-stepper>

    <div
      id="hint-card"
      class="elevation-1"
    >
      <app-validate
        v-if="steps &&
              steps[activeStep].hasOwnProperty('type') &&
              steps[activeStep].type === 'validate'"
      />

      <p id="hint" v-else>
        {{ steps[activeStep].instruction }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import Validate from './Validate.vue'

export default {
  components: {
    'app-validate': Validate
  },

  computed: {
    ...mapState({
      activeStep: state => state.app.activeStep,
      steps: state => state.app.steps
    })
  },

  methods: {
    ...mapActions({
      setActiveStep: 'app/setActiveStep',
      saveProject: 'app/saveProject'
    }),

    activateStep (step) {
      this.setActiveStep(step)

      // Trigger and auto-save
      this.saveProject({
        notification: false
      })
    }
  }
}
</script>

<style lang='css' scoped>
#stepper-container {
  width: 100%;
}

#stepper {
  background-color: #e0e0e0;
  width: 100%;
}

#stepper-header {
  height: 50px;
}

.step-icon {
  padding-top: 13px;
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
