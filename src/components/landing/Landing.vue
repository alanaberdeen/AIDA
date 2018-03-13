<template>
    <v-container id='home'>
        <v-layout row id='hero'>
            <v-flex xs12 text-xs-center>
                <v-layout row wrap align-center justify-center>
                    <v-flex xs12 id='title-container'>
                        <h1 id="title"> AIDA </h1>
                    </v-flex>

                    <v-flex xs12 id='subtitle-container'>
                        <h2 id="subtitle"> Annotate Image Data by Assignment </h2>
                    </v-flex>

                    <v-flex xs8 sm4 md3 lg2 text-xs-center id='button-container'>
                        <v-btn dark primary block to='/example'>
                            <v-icon>web</v-icon>
                            <span class='button-text'>
                                Example
                            </span>
                        </v-btn>
                    </v-flex>

                    <v-flex xs8 sm4 md3 lg2 text-xs-center id='button-container'>
                        <v-btn light block href='https://github.com/alanaberdeen/AIDA'>
                            <v-icon>fa-github</v-icon>
                            <span class='button-text'>
                                Github
                            </span>
                        </v-btn>
                    </v-flex>

                    <v-flex xs8 sm4 md3 lg2 text-xs-center id='button-container'>
                        <v-btn light block to='/docs'>
                            <v-icon>fa-book</v-icon>
                            <span class='button-text'>
                                Docs
                            </span>
                        </v-btn>
                    </v-flex>
                </v-layout>

            </v-flex>
        </v-layout>

        <v-layout row align-center justify-center>
            <v-flex xs12 lg8 >
                <v-card class='info-card'>
                    <div class='info-content'>
                        <h4>
                            The Basic Idea
                        </h4>

                        <p>
                            AIDA is an attempt to bring an open source web-based
                            workflow to image annotation. Currently, in the
                            biomedical imaging space, image annotation is largely
                            confined to single computer shrink-wrapped software with
                            limited interactive capabilities and few, usually
                            closed, data formats.
                        </p>
                        <p>
                            AIDA is a web interface that enables distributed teams
                            of researchers to direclty annotate images with easy
                            to use on screen drawing tools. AIDA supports the
                            creation of well defined annotatio trials which include
                            a series of high resolution images or video and a
                            specific set of annotation tasks.
                        </p>
                        <p>
                            The trial and annotation data can be accessed
                            programatically via a <router-link to='/docs/api'>
                            documented API. </router-link>
                        </p>
                    </div>
                </v-card>

                <v-card class='info-card'>
                    <div class='info-content'>
                        <h4>
                            How has it been implemented?
                        </h4>

                        <p>
                            The user interface is a <a href='https://vuejs.org/'
                            >VueJS</a> Single Page Application
                            built to web standards, encapsulating and interacting
                            with two other significant JavaScript libraries:
                            <a href='https://openseadragon.github.io/'>
                            OpenSeaDragon</a> to manipulate the high-res images
                            and <a href='http://paperjs.org/'>PaperJS</a> to
                            provide the drawing functionality.
                            This interface generates a JSON file that is written
                            to a database via a web API. Login enables specific
                            configuration of the tool for different trials
                            and tasks.
                        </p>
                    </div>
                </v-card>

                <v-card class='info-card'>
                    <div class='info-content'>
                        <h4>
                            What's planned?
                        </h4>

                        <p>
                            The software is published as Open Source under the permissive <a href='https://github.com/alanaberdeen/AIDA/blob/master/LICENSE'> MIT license </a> and can be
                            modified by anyone.
                            The <router-link to='/docs/api'> API </router-link>
                            will also be public.

                            The next stage of development will be to integrate
                            intelligent tools that leverage the power of machine
                            learning techniques. We hope to enhance the ability
                            of the user to quickly and accuratley mark up images
                            with using predicitive technqiues.
                        </p>
                    </div>
                </v-card>

                <v-card class='info-card'>
                    <div class='info-content'>
                        <h4>
                            About
                        </h4>

                        <p>
                            This is a project of Alan Aberdeen, Jens Rittscher,
                            and Nasullah Khalid at the University of Oxford,
                            specifically the
                            <a href='http://www.ludwig.ox.ac.uk/jens-rittscher-group-page'>
                            Quantitative Biological Imaging Group
                        </a>.

                        </p>
                    </div>
                </v-card>

            </v-flex>
        </v-layout>

    </v-container>

</template>

<script>

</script>

<style scoped>

#home {
    padding-top: 48px;
}

#hero {
    padding-bottom: 50px;
}

#title {
    margin-bottom: 0px;
    color: #1976d2;
    font-weight: 400;
}

#subtitle {
    margin-bottom: 0px;
    color: #757575;
    font-size: 30px;
}

.button-text {
    padding-left: 10px;
}

#title-container {
    padding-bottom: 0px;
}

#subtitle-container{
    padding-top: 0px;
}

#button-container {
    padding: 5px 10px;
}

.info-card {
    color: #757575;
    margin-bottom: 20px;
}

.info-content {
    padding: 7px;
}

h4 {
    margin-top: 0px;
    margin-bottom: 5px;
}

</style>