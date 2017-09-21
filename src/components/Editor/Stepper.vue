<template>
    <div class='pointers-please stepper'>
        <v-stepper non-linear :value.sync="activeStep">
            <v-stepper-header>
                <div v-for="step in steps" :key='step.id'>
                    <v-stepper-step :step = step.id
                                    editable
                                    @click.native="setActiveStepAndLayer(step.id)"
                                    >
                    </v-stepper-step>
                    <v-divider></v-divider>
                </div>
            </v-stepper-header>
        </v-stepper>

        <div class='hint-card'>
            <p class="hint">
                {{ steps[(activeStep - 1)].instruction }}
            </p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex';

export default {

    computed: {
        ...mapState({
            activeStep: state => state.config.activeStep,
            steps: state => state.config.steps
        })
    },

    methods: {
        ...mapActions([
            'setActiveStep',
            'setActiveStepAndLayer'
        ])
    }
}
</script>

<style lang="css" scoped>

.stepper{
    background-color: #E0E0E0;
}

.hint-card {
    background-color: #EEEEEE;
}

.hint {
    font-size: 12px;
    color: #616161;
    padding: 5px 24px;
    margin: 0px;
}

.stepper__step {
    padding: 10px 24px;
}

</style>
