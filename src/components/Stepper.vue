<template>
    <div class='pointers-please stepper'>
        <v-stepper non-linear>
            <v-stepper-header>
                <v-stepper-step step="1" editable @click.native="activeStep = 1"> </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" editable @click.native="activeStep = 2"> </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" editable @click.native="activeStep = 3"> </v-stepper-step>
            </v-stepper-header>
        </v-stepper>
        <div class='hint-card'>
            <p v-if='activeStep === 1' class="hint">
                {{ step1 }}
            </p>
            <p v-else-if="activeStep === 2" class="hint">
                {{ step2 }}
            </p>
            <p v-else-if="activeStep === 3" class="hint">
                {{ step3 }}
            </p>
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            activeStep: 1,
            step1: 'Instructions for Step 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            step2: 'Instructions for Step 2: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            step3: 'Instructions for Step 3: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
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
