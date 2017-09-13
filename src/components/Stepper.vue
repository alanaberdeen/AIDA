<template>
    <div class='pointers-please stepper'>
        <v-stepper non-linear>
            <v-stepper-header>
                <div v-for="(stepItem, stepIndex) in config.steps" :key='stepIndex'>
                    <v-stepper-step
                                    :step=stepItem.id
                                    editable
                                    @click.native="setActive(stepIndex)"
                                    >
                    </v-stepper-step>
                    <v-divider></v-divider>
                </div>
            </v-stepper-header>
        </v-stepper>

        <div class='hint-card'>
            <p class="hint">
                {{ config.steps[config.activeStep].instruction }}
            </p>
        </div>
    </div>
</template>

<script>
import openseadragon from 'openseadragon';

export default {

    props: ['config', 'osdViewer'],

    computed: {
        activeStep() {
            return this.config.activeStep
        }
    },

    methods: {
        setActive(stepIndex){
            this.config.activeStep = stepIndex;

            // If this step has an associated region of interest then pan and
            // zoom the viewport to this setup.
            if (this.config.steps[stepIndex].regionOfIntereset){

                // var region = new openseadragon.Rect(
                //     this.config.steps[stepIndex].regionOfIntereset.x,
                //     this.config.steps[stepIndex].regionOfIntereset.y,
                //     this.config.steps[stepIndex].regionOfIntereset.width,
                //     this.config.steps[stepIndex].regionOfIntereset.height
                // );

                // Temp demonstration rectangle. Need to figure out the
                // coordinate change.
                var region = new openseadragon.Rect(
                    0,
                    0,
                    0.3,
                    0.3
                );

                this.osdViewer.viewport.fitBounds(region);
            } else {
                this.osdViewer.viewport.goHome();
            }
        }
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
