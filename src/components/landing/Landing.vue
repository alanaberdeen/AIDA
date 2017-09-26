<template>
    <v-container grid-list-xl id='home'>
        <v-layout row wrap id='hero'>
            <v-flex xs12 text-xs-center>
                <v-layout row wrap align-center justify-center>
                    <v-flex xs12 id='title-container'>
                        <h1 id="title"> AIDA </h1>
                    </v-flex>

                    <v-flex xs12 id='subtitle-container'>
                        <h2 id="subtitle"> Annotate Image Data by Assignment </h2>
                    </v-flex>

                    <v-flex xs8 sm4 md3 lg2 text-xs-center id='button-container'>
                        <v-btn dark primary block to='/editor/example'>
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

        <v-layout row>
            <v-flex xs12 text-xs-center>
                <!-- <v-card height='200px'>

                </v-card> -->

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

</style>