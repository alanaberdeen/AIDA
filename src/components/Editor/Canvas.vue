<template lang="html">

    <div id='canvas' class='elevation-2 pointers-please'>
        <div id="osd-canvas"></div>
        <canvas id="paper-canvas"></canvas>
    </div>

</template>

<script>
import {mapActions} from 'vuex';
import {mapState} from 'vuex';

export default {

    computed: {
        ...mapState({
            channels: state => state.config.channels,
            annotation: state => state.config.annotation
        })
    },

    methods: {
        ...mapActions([
            'initialiseViewer', 
            'initialiseAnnotation',
            'addImages',
            'synchroniseAnnotationAndImage',
            'loadAnnotation',
            'loadConfig'
        ])
    },

    mounted() { 

        // Create the OpenSeadragon instance viewer.
        this.initialiseViewer();

        // Create the PaperJS instance targetting the canvas DOM element.
        this.initialiseAnnotation();

        // Load configuration from the API 
        // this.loadConfig();

        // Add the images specied in the config state to the viewer. 
        // this.addImages(this.getImages);
        this.addImages(this.channels);

        // Ensure the size of the PaperJS annotation view and the OpenSeaDragon
        // viewer are always synchronised. 
        this.synchroniseAnnotationAndImage();

        // Import any annotation data set in the config object. 
        this.loadAnnotation(this.annotation);       
    }
}
</script>

<style lang="css" scoped>
#canvas {
    position: relative;
    width: 100%;
    flex: 1;
}

#osd-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
}

#paper-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
