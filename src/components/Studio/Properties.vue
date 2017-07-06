<template lang="html">
    <div class="pointers-please channel-panel elevation-1" ondragstart="return false;" ondrop="return false;">
        <v-card class='panel'>

            <v-toolbar class='toolbar elevation-1'>
                <v-toolbar-title id='title'>
                    Properties
                </v-toolbar-title>
            </v-toolbar>

            <v-list dense>
                <v-list-item >

                        <v-list-tile class='tile'>
                            <v-list-tile-content>

                                <v-list-tile-title class='channel-name'>
                                    No. items selected :
                                </v-list-tile-title>

                            </v-list-tile-content>

                            <v-list-tile-action>
                                <div class='action'>
                                    {{ numItems }}
                                </div>
                            </v-list-tile-action>
                            <v-divider></v-divider>
                        </v-list-tile>

                </v-list-item>

                <v-list-item >

                        <v-list-tile class='tile'>
                            <v-list-tile-content>

                                <v-list-tile-title class='channel-name'>
                                    Fill colour:
                                </v-list-tile-title>

                            </v-list-tile-content>

                            <v-list-tile-action>
                                <div class='action'>
                                    <colour-picker  :paperScope='paperScope'
                                                    :color="groupFillColor"
                                                    :type='"fill"'>
                                    </colour-picker>
                                </div>
                            </v-list-tile-action>
                            <v-divider></v-divider>
                        </v-list-tile>

                </v-list-item>

                <v-list-item >

                        <v-list-tile class='tile'>
                            <v-list-tile-content>

                                <v-list-tile-title class='channel-name'>
                                    Stroke colour:
                                </v-list-tile-title>

                            </v-list-tile-content>

                            <v-list-tile-action>
                                <div class='action'>
                                    <colour-picker  :paperScope='paperScope'
                                                    :color="groupStrokeColor"
                                                    :type='"stroke"'>
                                    </colour-picker>
                                </div>
                            </v-list-tile-action>
                            <v-divider></v-divider>
                        </v-list-tile>

                </v-list-item>

            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper';
import { eventBus } from '../../main';
import ColorPicker from './ColorPicker.vue'

export default {
    props: ['paperScope', 'osdViewer'],
    data(){
        return {
            numItems: 0,
            groupFillColor: {
                style: 'transparent',
                obj: {  h: 0,
                        s: 0,
                        l: 0,
                        a: 0
                    }
            },
            groupStrokeWidth: '',
            groupStrokeColor: {
                style: 'transparent',
                obj: {  h: 0,
                        s: 0,
                        l: 0,
                        a: 0
                    }
            },
            color: 'blue'
        }
    },

    components: {
        'colour-picker': ColorPicker
    },

    created() {
        var vm = this;

        // Listen for an event indicating the selection has changed and
        // update the component data appropriately.
        eventBus.$on('selectionChanged', (selection) => {
            console.log('The selection has been changed: ');

            // If
            if (selection.length >= 1){
                vm.numItems = 0;
                selection.forEach((item) => {
                    if (item.className === 'Group'){
                        if (item.fillColor) {
                            var hue = item.fillColor.hue;
                            var sat = (item.fillColor.saturation*100) + '%';
                            var light = (item.fillColor.lightness*100) + '%';
                            var alpha = item.fillColor.alpha;

                            vm.groupFillColor.style = 'hsla(' + hue + ', ' + sat + ', ' + light + ', ' + alpha + ')';
                            vm.groupFillColor.obj = {
                                h: hue,
                                s: sat,
                                l: light,
                                a: alpha
                            }
                        } else {
                            vm.groupFillColor.style = 'transparent';
                            vm.groupFillColor.obj = {
                                h: 0,
                                s: 0,
                                l: 0,
                                a: 0
                            }
                        }

                        if (item.strokeColor) {
                            var hue = item.strokeColor.hue;
                            var sat = (item.strokeColor.saturation*100) + '%';
                            var light = (item.strokeColor.lightness*100) + '%';
                            var alpha = item.strokeColor.alpha;

                            vm.groupStrokeColor.style = 'hsla(' + hue + ', ' + sat + ', ' + light + ', ' + alpha + ')';
                            vm.groupStrokeColor.obj = {
                                h: hue,
                                s: sat,
                                l: light,
                                a: alpha
                            }
                        } else {
                            vm.groupStrokeColor.style = 'transparent';
                            vm.groupStrokeColor.obj = {
                                h: 0,
                                s: 0,
                                l: 0,
                                a: 0
                            }
                        }


                    } else {
                        vm.numItems++
                    }
                })

            } else {
                // Reset property data
                vm.numItems = 0;
                vm.groupFillColor = {
                    style: 'transparent',
                    obj: {  h: 0,
                            s: 0,
                            l: 0,
                            a: 0
                        }
                };
                vm.groupStrokeWidth = '';
                vm.groupStrokeColor = {
                    style: 'transparent',
                    obj: {  h: 0,
                            s: 0,
                            l: 0,
                            a: 0
                        }
                };
            }




            console.log('Fill color: ' + vm.groupFillColor);


        })
    }
}
</script>

<style lang="css" scoped>
.channel-panel {
    margin-top: 20px;
}

.editing {
    display: none;
}

.toolbar {
    background-color: #E0E0E0;
    height: 36px;

}

#title {
    font-size: 14px;
    margin-left: 10px;
}

.icon {
    font-size: 16px;
    color: #616161;
}

.button{
    margin-right: 5px;
}

.tile {
    padding: 0px 0px 0px 10px;
    height: 30px;
}

.channel-name {
    font-size: 12px;
}

.panel {
    background-color: #EEEEEE;
}

.active {
    color: #1E88E5;
}

.input-group__details{
    min-height: 0;
}

.opacity-label {
    width: 20px;
}

.list--group .list__tile {
    padding-left: 10px;
}

.action{
    margin-right: 5px;
    width: 36px;
    text-align: center;
}



</style>
