<template lang="html">

    <div id='canvas' class='elevation-2 pointers-please'>
        <div id="osd-canvas"></div>
        <canvas id="paper-canvas"></canvas>
    </div>

</template>

<script>
export default {
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
    opacity: 0.7;
    filter: alpha(opacity=70);
    width: 100%;
    height: 100%;
}
</style>
