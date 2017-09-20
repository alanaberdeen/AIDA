<template lang="html">

    <div id='canvas' class='elevation-2 pointers-please'>
        <div id="osd-canvas"></div>
        <canvas id="paper-canvas"></canvas>
    </div>

</template>

<script>
import {mapActions} from 'vuex';
import {mapGetters} from 'vuex';

export default {

    methods: {
        ...mapActions([
            'initialiseViewer', 
            'initialiseAnnotation',
            'addImages',
            'synchroniseAnnotationAndImage',
            'loadAnnotation'
        ]),
        ...mapGetters([
            'getConfigChannels',
            'getPaperScope',
            'getAnnotation'
        ])
    },

    mounted() { 

        // Create the OpenSeadragon instance viewer.
        this.initialiseViewer({
            id: 'osd-canvas',
            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
            showNavigationControl: false
        });

        // Add the images specied in the config state to the viewer. 
        // this.addImages(this.getImages);
        this.addImages(this.getConfigChannels());

        // Create the PaperJS instance targetting the canvas DOM element.
        this.initialiseAnnotation({
            canvas: document.getElementById('paper-canvas')
        });

        // Ensure the size of the PaperJS annotation view and the OpenSeaDragon
        // viewer are always synchronised. 
        this.synchroniseAnnotationAndImage({
            paperScope: this.getPaperScope()
        });

        // Import any annotation data set in the config object. 
        this.loadAnnotation(this.getAnnotation());       
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
