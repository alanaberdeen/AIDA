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
            rows="3"
            required
        ></v-text-field>

        <div>
            <p class='label'> Tools required: </p>

            <v-btn  @click.native="config.steps[step].tools.pan = !config.steps[step].tools.pan"
                    small
                    :flat="!config.steps[step].tools.pan"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.pan.caption }">
                <i :class="{
                        'fa': true,
                        'fa-lock': true,
                        'faIcons': true,
                        }">
                </i>
            </v-btn>

            <v-btn @click.native="config.steps[step].tools.circle = !config.steps[step].tools.circle"
                    small
                    :flat="!config.steps[step].tools.circle"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.circle.caption }">
                <i :class="{
                        'fa': true,
                        'fa-circle': true,
                        'faIcons': true,
                        }">
                </i>
            </v-btn>

            <v-btn @click.native="config.steps[step].tools.rectangle = !config.steps[step].tools.rectangle"
                    small
                    :flat="!config.steps[step].tools.rectangle"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.rectangle.caption }">
                <v-icon>
                        crop_landscape
                </v-icon>
            </v-btn>

            <v-btn @click.native="config.steps[step].tools.pen = !config.steps[step].tools.pen"
                    small
                    :flat="!config.steps[step].tools.pen"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.pen.caption }">
                <v-icon>
                        timeline
                </v-icon>
            </v-btn>

            <v-btn @click.native="config.steps[step].tools.pencil = !config.steps[step].tools.pencil"
                    small
                    :flat="!config.steps[step].tools.pencil"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.pencil.caption }">
                <i  :class="{
                        'fa': true,
                        'fa-pencil': true,
                        'faIcons': true,
                    }">
               </i>
            </v-btn>

            <v-btn @click.native="config.steps[step].tools.move = !config.steps[step].tools.move"
                    small
                    :flat="!config.steps[step].tools.move"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.move.caption }">
                <i :class="{
                        'fa': true,
                        'fa-mouse-pointer': true,
                        'faIcons': true,
                    }">
                </i>
            </v-btn>

            <v-btn @click.native="config.steps[step].tools.node = !config.steps[step].tools.node"
                    small
                    :flat="!config.steps[step].tools.node"
                    class="tool elevation-1"
                    v-tooltip:bottom="{ html: config.tools.node.caption }">
                <i :class="{
                        'fa': true,
                        'fa-location-arrow': true,
                        'faIcons': true,
                        }">
                </i>
            </v-btn>

        </div>

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

.label {
    color: rgba(0,0,0,0.38);
    font-size: 16px;
}

[data-tooltip] {
    transition-delay: 1s;
}



</style>
