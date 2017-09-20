<template lang="html">
    <v-dialog v-model="dialog" width="225px">

        <a slot="activator">
            <div class="color-tile" :style="{'background-color': color.style}">
            </div>
        </a>

        <v-card>
            <colour-picker v-model="colorPick" id="picker"></colour-picker>
        </v-card>

    </v-dialog>
</template>

<script>
import { Chrome } from 'vue-color'
import paper from 'paper'
import { eventBus } from '../../main';
import { mapState } from 'vuex';

export default {

    props: ['color', 'type'],

    data(){
        return{
            dialog: false,
            colorPick: this.color.obj
        }
    },

    computed: {
        ...mapState({
            paperScope: state => state.annotation.paperScope
        })
    },

    watch: {
        // Whenever dialog toggled, change the colour of the selected items
        dialog(newValue) {

            if (newValue === true){
                this.colorPick = this.color.obj;

            } else if (newValue === false){
                if (this.paperScope.project.selectedItems.length > 1){
                    let group = this.paperScope.project.getItem({
                                    selected: true,
                                    className: 'Group'
                                });

                    if (this.type === 'fill'){
                        group.fillColor = new paper.Color({ hue: this.colorPick.hsl.h,
                                                saturation: this.colorPick.hsl.s,
                                                lightness: this.colorPick.hsl.l,
                                                alpha: this.colorPick.hsl.a});
                    } else if (this.type === 'stroke'){
                        group.strokeColor = new paper.Color({ hue: this.colorPick.hsl.h,
                                                saturation: this.colorPick.hsl.s,
                                                lightness: this.colorPick.hsl.l,
                                                alpha: this.colorPick.hsl.a});
                    }


                    // Emit selection event to the eventBus so that the properties
                    // panel can be updated.
                    eventBus.$emit('selectionChanged', this.paperScope.project.selectedItems)

                }
            }
        }
    },

    components: {
        'colour-picker': Chrome
    }

}
</script>

<style lang="css" scoped>

.color-tile {
    width: 20px;
    height: 20px;
    margin: auto;
    border: 1px solid #616161;
}

</style>
