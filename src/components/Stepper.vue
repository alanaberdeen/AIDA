<template>
    <div class='pointers-please stepper'>
        <v-stepper non-linear>
            <v-stepper-header>
                <div v-for="(stepItem, stepIndex) in config.steps" :key='stepIndex'>
                    <v-stepper-step
                                    :step=stepItem.id
                                    editable
                                    @click.native="activeStep = stepIndex"
                                    >
                    </v-stepper-step>
                    <v-divider></v-divider>
                </div>
            </v-stepper-header>
        </v-stepper>

        <div class='hint-card'>
            <p class="hint">
                {{ config.steps[activeStep].instruction }}
            </p>
        </div>
    </div>
</template>

<script>

export default {

    props: ['config'],

    data() {
        return {
            activeStep: 0
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
