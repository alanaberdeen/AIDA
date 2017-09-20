<template>
    <v-app toolbar pointer-events='none'>
        <header>
            <app-toolbar>
            </app-toolbar>
        </header>

        <main>
            <v-container fluid id='content-container'>
                <v-layout row>

                    <v-flex d-flex id="left-panel">
                        <app-tools>
                        </app-tools>
                    </v-flex>

                    <v-flex d-flex>
                        <div id="centre-container">
                            <div id='stepper'>
                                <app-stepper>
                                </app-stepper>
                            </div>

                            <div id='canvas-container'>
                                <app-canvas>
                                </app-canvas>
                            </div>
                        </div>
                    </v-flex>

                    <v-flex d-flex id='right-panel'>
                        <app-studio>
                        </app-studio>
                    </v-flex>

                </v-layout>
            </v-container>
        </main>

        <!-- <app-footer></app-footer> -->
    </v-app>
</template>

<script>
// Import child components
import Tools from './components/Tools/Tools.vue';
import ImageLoader from './components/ImageLoader.vue';
import Toolbar from './components/Header/Toolbar.vue';
import Studio from './components/Studio/Studio.vue';
import Footer from './components/Footer.vue';
import Stepper from './components/Stepper.vue';
import Canvas from './components/Canvas.vue';

import { eventBus } from './main';

export default {
    components: {
        'app-tools': Tools,
        'app-image-loader': ImageLoader,
        'app-toolbar': Toolbar,
        'app-footer': Footer,
        'app-studio': Studio,
        'app-stepper': Stepper,
        'app-canvas': Canvas
    }
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>

<style media="screen" scoped>

    #content-container {
        padding: 0px;
    }

    #centre-container {
        display: flex;
        flex-direction: column;
        padding: 0px 5px;
    }

    #stepper {
        flex-shrink: 1;
        padding: 5px 0px;
    }

    #canvas-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding-bottom: 5px;
    }

    #left-panel {
        flex: 0 1 auto;
    }

    #right-panel {
        flex: 0 1 auto;
    }

    #placer {
        height: 100vh;
        background-color: blue;
    }
</style>
