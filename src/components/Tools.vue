<template lang="html">
    <div class="pointers-please tools-container">
        <v-card class="tools-panel">
            <v-toolbar>
                <v-toolbar-title>Tools</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-list>
                <v-list-item>
                    <v-btn @click.native="addCircle" primary dark>Circle</v-btn>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    methods: {
        addCircle() {
            var centerX = Math.round(Math.random() * (this.paperScope.view.size.width - 10))
            var centerY = Math.round(Math.random() * (this.paperScope.view.size.height - 10))
            var myCircle = new this.paperScope.Path.Circle(new paper.Point(centerX, centerY), 10)
            myCircle.fillColor = 'black'
        }
    }
}
</script>

<style lang="css">

.tools-container{
    margin-top: 24px;
    margin-left: 10px;
}

</style>
