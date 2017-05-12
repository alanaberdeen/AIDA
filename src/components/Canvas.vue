<template lang="html">
  <div class="view">

  </div>
</template>

<script>
import paper from 'paper'

export default {
    props: ['paperScope'],
    created() {
        this.paperScope.view.onMouseDown = function(event){
            console.log('MouseDown event triggered')
        }
    },
    methods: {
        mouseDownThing() {
            this.paperScope.view.onMouseDown = function(event){
                console.log('MouseDown event triggered')
            }

        }
    }
}
</script>

<style lang="css">
</style>
