<template>
<div>
  <v-toolbar
    flat
    scroll-off-screen
    dense
    dark
    class="primary pointers-please"
    >
    <router-link to='/'>
      <v-toolbar-title class="white--text">
        AIDA
      </v-toolbar-title>
    </router-link>

    <v-spacer/>

    <!-- Link to Dashboard -->
    <v-btn
      icon
      to="/dashboard">
      <v-icon>
        apps
      </v-icon>
    </v-btn>

    <!-- Link to Docs -->
    <v-btn
      icon
      href="https://github.com/alanaberdeen/AIDA/wiki" >
      <v-icon small> fa-book </v-icon>
    </v-btn>

  </v-toolbar>
  <v-container>
    <v-layout justify-center row>
      <h1 class='display-4 primary--text'> AIDA </h1>
    </v-layout>

    <v-layout justify-center>
      <h2 class='display-1 text-xs-center'> Annotate Image Data by Asssigment </h2>
    </v-layout>

    <v-layout justify-center row wrap my-3>
      <v-flex xs8 sm3 md2 mx-2>
        <v-btn dark block to='/demo'>
          <v-icon left> play_arrow </v-icon>
          try it out
        </v-btn>
      </v-flex>
      <v-flex xs8 sm3 md2>
        <v-btn block href='https://github.com/alanaberdeen/AIDA'>
          <v-icon left> mdi-github-circle </v-icon>
          Github
        </v-btn>
      </v-flex>
      <v-flex xs8 sm3 md2 mx-2>
        <v-btn block href='https://github.com/alanaberdeen/AIDA/wiki'>
          <v-icon left> fa-book </v-icon>
          Docs
        </v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap mb-4 mt-5>
      <v-flex sm10 offset-sm1 xs12>
        <h3 class='primary--text title'> The Basic Idea </h3>
        <v-divider class='my-2'/>
        <p>
          AIDA brings an open source web-based work-flow to image annotation.
        </p>
        <p>
          Currently, in the biomedical imaging space, image annotation is largely confined to shrink-wrapped software on a single computer with limited interactive capabilities and few, usually closed, data formats.
        </p>
        <p>
          AIDA is a web interface that enables distributed teams of researchers to directly annotate images with easy to use on screen drawing tools. AIDA supports the creation of well defined annotation trials which include a series of high resolution images and a specific set of annotation tasks.
        </p>
        <p>
          For documentation and further information see the <a href='https://github.com/alanaberdeen/AIDA/wiki'>Wiki</a>.
        </p>
      </v-flex>
    </v-layout>

    <v-layout row wrap my-4>
      <v-flex sm10 offset-sm1 xs12>
        <h3 class='primary--text title'> How has it been implemented? </h3>
        <v-divider class='my-2'/>
        <p>
          The user interface is a <a href='https://vuejs.org/'>VueJS</a> Single Page Application, encapsulating and interacting with two other significant JavaScript libraries: <a href='https://openseadragon.github.io/'>OpenSeaDragon</a> to manipulate the high-res images and <a href='http://paperjs.org/'>PaperJS</a> to provide the drawing functionality. <a href='http://vuetifyjs.com/'>VuetifyJS</a> is used as a UI component library which implements the material design language.
        </p>
      </v-flex>
    </v-layout>

    <v-layout row wrap my-4>
      <v-flex sm10 offset-sm1 xs12>
        <h3 class='primary--text title'> What's planned? </h3>
        <v-divider class='my-2'/>
        <p>
          The software is published as Open Source under the permissive <a href='https://github.com/alanaberdeen/AIDA/blob/master/LICENSE'>MIT license</a>.
        </p>
        <p>
          The next stage of development will be to integrate intelligent tools that leverage the power of machine learning techniques. We hope to enhance the ability of the user to quickly and accurately mark up images through predictive assistance.
        </p>
      </v-flex>
    </v-layout>

    <v-layout row wrap my-4>
      <v-flex sm10 offset-sm1 xs12>
        <h3 class='primary--text title'> About </h3>
        <v-divider class='my-2'/>
        <p>
          This is a project of <a href='https://alanaberdeen.com'>Alan Aberdeen</a>, Jens Rittscher, and Nasullah Khalid at the University of Oxford, specifically the <a href='https://www.ludwig.ox.ac.uk/jens-rittscher-group-page'>Quantitative Biological Imaging Group</a>.
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
export default {
}
</script>

<style scoped>
p a {
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}
</style>
