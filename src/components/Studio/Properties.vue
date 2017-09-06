<template lang="html">
    <div class="elevation-1">
        <v-card class="panel">

            <v-toolbar dense id="toolbar">
                <v-toolbar-title id='title'>
                    Properties
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-list dense id="list">
                <v-list-tile  id="tile">

                    <v-list-tile-content class="content">
                        <v-list-tile-title class="name">
                            No. selected items:
                        </v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <span class='number'>
                            {{ numItems }}
                        </span>
                    </v-list-tile-action>

                </v-list-tile>

                <v-list-tile id="tile">

                    <v-list-tile-content class="content">
                        <v-list-tile-title class="name">
                            Fill colour:
                        </v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon class='action'>
                            <colour-picker  :paperScope='paperScope'
                                            :color="groupFillColor"
                                            :type='"fill"'>
                            </colour-picker>
                        </v-btn>
                    </v-list-tile-action>

                </v-list-tile >

                <v-list-tile id="tile">

                    <v-list-tile-content class="content">
                        <v-list-tile-title class="name">
                            Stroke colour:
                        </v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon class='action'>
                            <colour-picker  :paperScope='paperScope'
                                            :color="groupStrokeColor"
                                            :type='"stroke"'>
                            </colour-picker>
                        </v-btn>
                    </v-list-tile-action>

                </v-list-tile>

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
        })
    }
}
</script>

<style lang="css" scoped>
#title {
    font-size: 14px;
    font-weight: 400;
}

.panel {
    margin-top: 20px;
    background-color: #EEEEEE;
}

#toolbar {
    background-color: #E0E0E0;
}

.name {
    font-size: 13px;
    height: 30px;
}

.content {
    margin-left: 16px;
}

.action {
    margin-right: 8px;
    height: 30px;
    margin-bottom: 0px;
}

.input-group {
    padding: 7px 20px 7px 10px;
}

.number {
    text-align: center;
    margin-right: 8px;
    width: 36px;
    margin-bottom: 5px;
}

#list {
    background-color: #EEEEEE;
}

#tile{
    height: 30px;
}

</style>
