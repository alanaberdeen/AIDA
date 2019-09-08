<template>
  <div>
    <v-toolbar
      flat
      dense
      dark
      class="primary"
      >
      <router-link to='/'>
        <v-toolbar-title class="white--text">
          AIDA
        </v-toolbar-title>
      </router-link>

      <v-spacer/>

      <v-toolbar-items>
        <v-btn
          icon
          to="/dashboard">
          <v-icon>
            mdi-apps
          </v-icon>
        </v-btn>

        <v-btn
          icon
          href="https://github.com/alanaberdeen/AIDA/wiki" >
          <v-icon> mdi-book-open-outline </v-icon>
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <v-container>
      <v-layout justify-center pb-3>
        <h1 class='display-4 primary--text'> AIDA </h1>
      </v-layout>

      <v-layout justify-center pb-5>
        <h2 class='display-1'> Annotate Image Data by Asssigment </h2>
      </v-layout>

      <v-layout justify-center row wrap pb-10>
        <v-flex xs8 sm3 md2 my-1 mx-2>
          <v-btn dark block to='/demo'>
            <v-icon left> mdi-play </v-icon>
            try it out
          </v-btn>
        </v-flex>
        <v-flex xs8 sm3 my-1 md2>
          <v-btn block href='https://github.com/alanaberdeen/AIDA'>
            <v-icon left> mdi-github-circle </v-icon>
            Github
          </v-btn>
        </v-flex>
        <v-flex xs8 sm3 md2 my-1 mx-2>
          <v-btn block href='https://github.com/alanaberdeen/AIDA/wiki'>
            <v-icon left> mdi-book-open-outline </v-icon>
            Docs
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout mb-4>
        <v-flex md8 offset-md2 sm10 offset-sm1 xs12>
          <h3 class='primary--text title'> The Basic Idea </h3>
          <v-divider class='my-1'/>
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

      <v-layout mb-4>
        <v-flex md8 offset-md2 sm10 offset-sm1 xs12>
          <h3 class='primary--text title'> How has it been implemented? </h3>
          <v-divider class='my-1'/>
          <p>
            The user interface is a <a href='https://vuejs.org/'>VueJS</a> Single Page Application, encapsulating and interacting with two other significant JavaScript libraries: <a href='https://openseadragon.github.io/'>OpenSeaDragon</a> to manipulate the high-res images and <a href='http://paperjs.org/'>PaperJS</a> to provide the drawing functionality. <a href='http://vuetifyjs.com/'>VuetifyJS</a> is used as a UI component library which implements the material design language.
          </p>
        </v-flex>
      </v-layout>

      <v-layout my-4>
        <v-flex md8 offset-md2 sm10 offset-sm1 xs12>
          <h3 class='primary--text title'> What's planned? </h3>
          <v-divider class='my-1'/>
          <p>
            The software is published as Open Source under the permissive <a href='https://github.com/alanaberdeen/AIDA/blob/master/LICENSE'>MIT license</a>.
          </p>
          <p>
            The next stage of development will be to integrate intelligent tools that leverage the power of machine learning techniques. We hope to enhance the ability of the user to quickly and accurately mark up images through predictive assistance.
          </p>
        </v-flex>
      </v-layout>

      <v-layout my-4>
        <v-flex md8 offset-md2 sm10 offset-sm1 xs12>
          <h3 class='primary--text title'> About </h3>
          <v-divider class='my-1'/>
          <p>
            This is a project of <a href='https://alanaberdeen.com'>Alan Aberdeen</a>, Jens Rittscher, and Nasullah Khalid at the University of Oxford, specifically the <a href='https://www.ludwig.ox.ac.uk/jens-rittscher-group-page'>Quantitative Biological Imaging Group</a>.
          </p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style scoped>
p a {
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}
</style>
