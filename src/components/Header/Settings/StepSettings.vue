<template lang="html">
    <div>
        <h6 class='step-id'> Step {{step + 1}} </h6>

        <v-text-field
            class="instruction-input"
            label="Instruction"
            v-model="config.steps[step].instruction"
            counter
            multi-line
            max="200"
            rows="2"
            required
        ></v-text-field>

    </div>
</template>


<script>
export default {

    props: ['config', 'step'],

    data() {
        return {
            title: ''
        }
    }
}
</script>

<style lang="css">

.step-id{
    padding-bottom: 20px;
    font-size: 18px;
}

.step-info {
    margin-bottom: 20px;
}

.instruction-input{
    font-size: 14px;
}

</style>
